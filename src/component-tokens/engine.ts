/**
 * Component Token Engine
 *
 * Translates L0 Creator Genome latent coordinates + L1 Design Genome chromosomes
 * into a ComponentDecisionVector — the intermediate representation that drives
 * all per-component CSS token decisions.
 *
 * ALL values are continuous derivations from genome coordinates.
 * Labels (materialLabel, easingLabel) are documentation only — never CSS switches.
 */

import type { CreatorGenome, ComponentDecisionVector } from '../creator/types.js';
import type { DesignGenome } from '../genome/types.js';
import { computeSurface, computeHoverSurface, deriveMaterialLabel } from './material-engine.js';
import { buildShadowSet, buildFocusOnlyShadow } from './shadow-engine.js';
import { getComponentMotion, buildBaseTransition } from './motion-engine.js';
import { getComponentTypography, getFontFeatureSettings } from './typography-engine.js';

// ── Component list ────────────────────────────────────────────────────────────

export const ALL_COMPONENTS = [
  'button', 'card', 'nav', 'input', 'select', 'textarea',
  'badge', 'chip', 'modal', 'tooltip', 'avatar', 'checkbox',
  'radio', 'toggle', 'table', 'progress', 'skeleton', 'spinner',
  'alert', 'tabs',
] as const;

export type ComponentName = typeof ALL_COMPONENTS[number];

// ── Output types ─────────────────────────────────────────────────────────────

export interface ComponentTokenState {
  background: string;
  backdropFilter: string;
  border: string | 'none';
  boxShadow: string;
  borderRadius: string;
  transition: string;
  transform: string;
  letterSpacing: string;
  textTransform: string | null;
  fontVariantNumeric: string | null;
  fontSizeScale: number;
  lineHeight: string | null;
  textWrap: string | null;
  opacity: number;
  cursor: string;
  outline: string | null;
}

export interface ComponentTokenVariant {
  /** default / resting state */
  default: ComponentTokenState;
  hover: ComponentTokenState;
  active: ComponentTokenState;
  focus: ComponentTokenState;
  disabled: ComponentTokenState;
}

export interface ComponentTokenEntry {
  /** Base (filled) variant */
  filled: ComponentTokenVariant;
  /** Ghost / outline variant */
  ghost: ComponentTokenVariant;
  /** Flat / text variant */
  flat: ComponentTokenVariant;
  /** Continuous border-radius value in px (for use in rationale) */
  borderRadiusPx: number;
  /** Human-readable rationale for major decisions */
  rationale: Record<string, string>;
}

export interface ComponentTokenMap {
  /** The decision vector used for all derivations */
  vec: ComponentDecisionVector;
  /** Per-component token entries */
  components: Partial<Record<ComponentName, ComponentTokenEntry>>;
  /** CSS custom properties block — paste into :root */
  cssVariables: string;
  /** Signature motif data */
  motif: {
    separator: string;
    hoverIndicator: string;
    deployment: number;
  };
}

// ── Sensory weight extraction ─────────────────────────────────────────────────

/**
 * Extract named sensory weight from c14's DistributionCurve.
 * Senses are stored as: [visual, tactile, auditory, spatial, kinesthetic]
 */
function getSensoryWeight(creator: CreatorGenome, senseIndex: number): number {
  const pts = creator.c14_sensory_weights.points;
  return pts[senseIndex]?.weight ?? 0.2;
}

// ── Easing derivation ─────────────────────────────────────────────────────────

/**
 * Derive a unique cubic-bezier string from continuous creator latent coordinates.
 * Never outputs a keyword like "ease-out" — always a computed 4-point curve.
 *
 * c11_chaos_tolerance → overshoot (spring vs smooth)
 * c15_coherence_style → how much the curve converges to 1
 * c7_cognitive_pattern[0] → systematic (predictable) vs intuitive (elastic)
 */
function deriveEasingCurve(creator: CreatorGenome): { curve: string; label: string } {
  const chaos    = creator.c11_chaos_tolerance;         // 0.1–0.9
  const coherence = creator.c15_coherence_style;        // 0–1
  const systematic = (creator.c7_cognitive_pattern[0] + 1) / 2; // -1..1 → 0..1

  // x1: how early the curve accelerates (lower = delayed burst)
  const x1 = parseFloat((0.08 + systematic * 0.35).toFixed(3));
  // y1: overshoot — high chaos = spring/bounce, low chaos = smooth
  const y1 = parseFloat((0.80 + chaos * 0.90).toFixed(3));
  // x2: how late the deceleration lands (higher = more ease-out feel)
  const x2 = parseFloat((0.40 + coherence * 0.50).toFixed(3));
  // y2: almost always 1, slight undershoot for very coherent genomes
  const y2 = parseFloat((1.0 - (coherence > 0.7 ? (coherence - 0.7) * 0.1 : 0)).toFixed(3));

  const curve = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

  // Label for documentation
  const label = chaos > 0.65 ? 'spring' : systematic > 0.6 ? 'ease-out' : coherence > 0.6 ? 'smooth' : 'balanced';

  return { curve, label };
}

// ── Main vector builder ───────────────────────────────────────────────────────

/**
 * Build a ComponentDecisionVector from creator genome + design genome.
 * This is the sole source of truth — all sub-engines read from this vector.
 */
export function buildDecisionVector(
  creator: CreatorGenome,
  genome: DesignGenome
): ComponentDecisionVector {
  const c9 = creator.c9_material_affinity;   // [digital↔analog, polished↔rough, synthetic↔natural]
  const c6 = creator.c6_aesthetic_sensibility;
  const c4 = creator.c4_authorial_embedding; // [expressivity, formality, playfulness, precision]
  const c7 = creator.c7_cognitive_pattern;
  const ch = genome.chromosomes;

  // ── Surface quality ──────────────────────────────────────────────────────
  // c9[0]: digital(-1) ↔ analog(+1). Strongly digital → backdrop blur / glassmorphism
  const isGlass    = c9[0] < -0.15;
  const glassDepth = Math.abs(Math.min(c9[0], 0)); // 0–1
  const backdropBlur = isGlass
    ? Math.round(12 + glassDepth * 28)   // 12–40px, unique per genome
    : 0;
  const backdropSaturate = isGlass
    ? Math.round(120 + c9[1] * 100)       // 20–220%
    : 100;
  const surfaceOpacity = isGlass
    ? parseFloat((0.04 + glassDepth * 0.82).toFixed(3))  // 0.04–0.86
    : 1.0;

  // Surface grain from ch11 texture chromosome
  const surfaceGrain = parseFloat(ch.ch11_texture.noiseLevel.toFixed(3)); // 0–0.5

  // Specular highlight: polished surfaces (c9[1] > 0.6)
  const specularHighlight = c9[1] > 0.60;

  // Surface warmth: natural (c9[2] > 0) → warm
  const surfaceWarmth = parseFloat(((c9[2] + 1) / 2).toFixed(3)); // -1..1 → 0..1

  // ── Shape ────────────────────────────────────────────────────────────────
  const radiusBase = ch.ch7_edge.componentRadius;
  // c6[1] aesthetic tension: -1=strict/geometric, +1=fluid/organic
  const radiusVariance = parseFloat(((c6[1] + 1) / 2 * 0.4).toFixed(3)); // 0–0.4

  // ── Shadow ───────────────────────────────────────────────────────────────
  const tactileWeight = getSensoryWeight(creator, 1); // tactile = index 1
  const visualWeight  = getSensoryWeight(creator, 0); // visual  = index 0
  const shadowLayers  = Math.max(1, Math.min(4, Math.ceil(tactileWeight * 4))) as 1 | 2 | 3 | 4;
  const shadowColorTinted = visualWeight > 0.28; // above ~28% visual weighting
  // Softness: polished (c9[1] = +1) → sharp; rough (c9[1] = -1) → diffuse
  const shadowSoftness = parseFloat(((1 - c9[1]) / 2).toFixed(3)); // 0–1
  const shadowScale    = ch.ch10_hierarchy.shadowScale;

  // ── Motion ───────────────────────────────────────────────────────────────
  const { curve: easingCurve, label: easingLabel } = deriveEasingCurve(creator);
  const durationBase = Math.round(ch.ch8_motion.durationScale * 200); // ms
  const kinesthetic  = getSensoryWeight(creator, 4); // kinesthetic = index 4
  const hoverDistance = parseFloat((kinesthetic * 16).toFixed(1)); // 0–16px
  // Hover opacity for opacity-style hovers (non-lift)
  const hoverOpacity  = parseFloat((0.55 + creator.c15_coherence_style * 0.30).toFixed(3));

  // Idle animation: only for expressive/chaotic genomes
  const isExpressive = creator.c11_chaos_tolerance > 0.60 && creator.c12_cross_pollination > 0.55;
  const idleAnimation = isExpressive
    ? (['genome-breathe', 'genome-float', 'genome-shimmer'] as const)[
        Math.floor(creator.c11_chaos_tolerance * 3) % 3
      ]
    : null;

  // ── Typography ───────────────────────────────────────────────────────────
  // c4[0] expressivity: maps -1..1 → -0.02..0.08em letter-spacing base
  const letterSpacingBase = parseFloat(((c4[0] + 1) / 2 * 0.10 - 0.02).toFixed(4)); // -0.02–0.08
  // c4[3] precision > 0.5 → tabular numerics
  const tabulaNumeric   = c4[3] > 0.50;
  // c7[0] systematic > 0.5 → text-wrap balance for headings
  const textWrapBalance = c7[0] > 0.50;

  // ── Motif ─────────────────────────────────────────────────────────────────
  const separator      = ch.ch35_signature_motif.separator;
  const hoverIndicator = ch.ch35_signature_motif.hoverIndicator;

  // ── Material label (documentation only) ──────────────────────────────────
  const materialLabel = deriveMaterialLabel(
    [c9[0], c9[1], c9[2]] as [number, number, number],
    (c6[2] + 1) / 2  // c6[2] -1..1 → 0..1 for deriveMaterialLabel
  );

  return {
    backdropBlur,
    backdropSaturate,
    surfaceOpacity,
    surfaceGrain,
    specularHighlight,
    surfaceWarmth,
    radiusBase,
    radiusVariance,
    shadowLayers,
    shadowColorTinted,
    shadowSoftness,
    shadowScale,
    easingCurve,
    durationBase,
    hoverDistance,
    hoverOpacity,
    idleAnimation,
    letterSpacingBase,
    tabulaNumeric,
    textWrapBalance,
    separator,
    hoverIndicator,
    materialLabel,
    easingLabel,
  };
}

// ── Component radius derivation ───────────────────────────────────────────────

/**
 * Per-component radius modifiers relative to base.
 * Cards have slightly more rounding; badges less; inputs match base.
 */
const RADIUS_MODIFIER: Record<ComponentName, number> = {
  button:   1.0,
  card:     1.2,
  nav:      0.8,
  input:    0.9,
  select:   0.9,
  textarea: 0.9,
  badge:    0.6,
  chip:     0.7,
  modal:    1.3,
  tooltip:  0.5,
  avatar:   999, // always full circle (enforced by min)
  checkbox: 0.3,
  radio:    999,
  toggle:   999,
  table:    0.4,
  progress: 999,
  skeleton: 0.5,
  spinner:  999,
  alert:    0.9,
  tabs:     0.6,
};

function getComponentRadius(vec: ComponentDecisionVector, component: ComponentName): number {
  const modifier = RADIUS_MODIFIER[component];
  if (modifier === 999) return 9999; // full pill/circle → clip via CSS
  const base = vec.radiusBase * (1 + vec.radiusVariance * (modifier - 1));
  return Math.max(0, Math.round(base * modifier));
}

// ── State builder helpers ─────────────────────────────────────────────────────

function buildState(
  background: string,
  backdropFilter: string,
  border: string,
  boxShadow: string,
  borderRadius: number,
  transition: string,
  transform: string,
  typography: ReturnType<typeof getComponentTypography>,
  opacity: number,
  cursor: string,
  outline: string | null
): ComponentTokenState {
  return {
    background,
    backdropFilter,
    border,
    boxShadow,
    borderRadius: borderRadius >= 9999 ? '50%' : `${borderRadius}px`,
    transition,
    transform,
    letterSpacing: typography.letterSpacing,
    textTransform: typography.textTransform,
    fontVariantNumeric: typography.fontVariantNumeric,
    fontSizeScale: typography.fontSizeScale,
    lineHeight: typography.lineHeight,
    textWrap: typography.textWrap,
    opacity,
    cursor,
    outline,
  };
}

// ── Per-component token generation ───────────────────────────────────────────

function buildComponentTokens(
  vec: ComponentDecisionVector,
  component: ComponentName,
  primaryHex: string,
  surfaceHex: string,
  elevatedHex: string
): ComponentTokenEntry {
  const radius = getComponentRadius(vec, component);
  const motion = getComponentMotion(vec, component);
  const shadows = buildShadowSet(vec, primaryHex);
  const flatShadows = buildFocusOnlyShadow(vec, primaryHex);
  const baseTransition = buildBaseTransition(vec);

  // Typography context mapping
  const typCtx = (() => {
    if (component === 'badge' || component === 'chip') return 'badge' as const;
    if (component === 'nav') return 'nav' as const;
    if (component === 'input' || component === 'select' || component === 'textarea') return 'input' as const;
    if (component === 'tooltip') return 'caption' as const;
    return 'button' as const;
  })();
  const typography = getComponentTypography(vec, typCtx);

  // Surface computations
  const defaultSurface = computeSurface(vec, surfaceHex, primaryHex, 1.0);
  const hoverSurface   = computeHoverSurface(vec, elevatedHex, primaryHex);
  const activeSurface  = computeSurface(vec, surfaceHex, primaryHex, 0.85);

  const hoverTransition = `${motion.hoverTransition}, ${baseTransition}`;

  // ── FILLED variant ──────────────────────────────────────────────────────
  const filled: ComponentTokenVariant = {
    default: buildState(
      defaultSurface.background, defaultSurface.backdropFilter, defaultSurface.border,
      shadows.default, radius, baseTransition, 'none', typography, 1.0, 'pointer', null
    ),
    hover: buildState(
      hoverSurface.background, hoverSurface.backdropFilter, hoverSurface.border,
      shadows.hover, radius, hoverTransition, motion.hoverTransform, typography, 1.0, 'pointer', null
    ),
    active: buildState(
      activeSurface.background, activeSurface.backdropFilter, activeSurface.border,
      shadows.active, radius,
      `transform ${motion.activeDurationMs}ms ${vec.easingCurve}, box-shadow ${motion.activeDurationMs}ms ${vec.easingCurve}`,
      motion.activeTransform, typography, 1.0, 'pointer', null
    ),
    focus: buildState(
      defaultSurface.background, defaultSurface.backdropFilter, defaultSurface.border,
      shadows.focus, radius, baseTransition, 'none', typography, 1.0, 'pointer',
      `0 0 0 2px ${primaryHex}40`
    ),
    disabled: buildState(
      defaultSurface.background, defaultSurface.backdropFilter, defaultSurface.border,
      'none', radius, 'none', 'none', typography, 0.45, 'not-allowed', null
    ),
  };

  // ── GHOST variant ───────────────────────────────────────────────────────
  const ghostBorder = `1px solid ${primaryHex}80`;
  const ghost: ComponentTokenVariant = {
    default: buildState(
      'transparent', 'none', ghostBorder,
      flatShadows.default, radius, baseTransition, 'none', typography, 1.0, 'pointer', null
    ),
    hover: buildState(
      `${primaryHex}12`, 'none', `1px solid ${primaryHex}`,
      flatShadows.hover, radius, hoverTransition, motion.hoverTransform, typography, 1.0, 'pointer', null
    ),
    active: buildState(
      `${primaryHex}20`, 'none', `1px solid ${primaryHex}`,
      flatShadows.active, radius,
      `transform ${motion.activeDurationMs}ms ${vec.easingCurve}`,
      motion.activeTransform, typography, 1.0, 'pointer', null
    ),
    focus: buildState(
      'transparent', 'none', `1px solid ${primaryHex}`,
      flatShadows.focus, radius, baseTransition, 'none', typography, 1.0, 'pointer',
      `0 0 0 2px ${primaryHex}40`
    ),
    disabled: buildState(
      'transparent', 'none', `1px solid ${primaryHex}40`,
      'none', radius, 'none', 'none', typography, 0.45, 'not-allowed', null
    ),
  };

  // ── FLAT variant ────────────────────────────────────────────────────────
  const flat: ComponentTokenVariant = {
    default: buildState(
      'transparent', 'none', 'none',
      'none', radius, baseTransition, 'none', typography, 1.0, 'pointer', null
    ),
    hover: buildState(
      `${primaryHex}10`, 'none', 'none',
      'none', radius, hoverTransition, 'none', typography,
      vec.hoverOpacity, 'pointer', null
    ),
    active: buildState(
      `${primaryHex}18`, 'none', 'none',
      'none', radius,
      `opacity ${motion.activeDurationMs}ms ${vec.easingCurve}`,
      'none', typography, 1.0, 'pointer', null
    ),
    focus: buildState(
      'transparent', 'none', 'none',
      flatShadows.focus, radius, baseTransition, 'none', typography, 1.0, 'pointer',
      `0 0 0 2px ${primaryHex}40`
    ),
    disabled: buildState(
      'transparent', 'none', 'none',
      'none', radius, 'none', 'none', typography, 0.40, 'not-allowed', null
    ),
  };

  // ── Rationale ───────────────────────────────────────────────────────────
  const rationale: Record<string, string> = {
    borderRadius: `${radius}px — derived from componentRadius(${vec.radiusBase}px) × component modifier(${RADIUS_MODIFIER[component]}) + aesthetic variance(${(vec.radiusVariance * 100).toFixed(0)}%)`,
    shadow: `${vec.shadowLayers}-layer shadow — tactile weight drives depth; softness=${vec.shadowSoftness.toFixed(2)} (c9 polished↔rough); scale=${vec.shadowScale.toFixed(2)}`,
    motion: `${vec.durationBase}ms ${vec.easingLabel} (${vec.easingCurve}); lift=${motion.hoverTransform}`,
    surface: `material="${vec.materialLabel}"; ${vec.backdropBlur > 0 ? `glassmorphism blur=${vec.backdropBlur}px saturate=${vec.backdropSaturate}%` : 'solid surface'}; grain=${vec.surfaceGrain.toFixed(2)}`,
    typography: `letter-spacing=${typography.letterSpacing}; ${vec.tabulaNumeric ? 'tabular-nums; ' : ''}${typography.textTransform ?? 'inherit case'}`,
  };

  return { filled, ghost, flat, borderRadiusPx: radius, rationale };
}

// ── CSS variables generator ───────────────────────────────────────────────────

function buildCSSVariables(vec: ComponentDecisionVector, primaryHex: string): string {
  const lines: string[] = [
    '/* Genome Component Tokens — generated, do not edit */',
    ':root {',
    `  --genome-easing: ${vec.easingCurve};`,
    `  --genome-duration-base: ${vec.durationBase}ms;`,
    `  --genome-duration-fast: ${Math.round(vec.durationBase * 0.45)}ms;`,
    `  --genome-duration-slow: ${Math.round(vec.durationBase * 1.4)}ms;`,
    `  --genome-radius-base: ${vec.radiusBase}px;`,
    `  --genome-radius-variance: ${vec.radiusVariance};`,
    `  --genome-shadow-softness: ${vec.shadowSoftness};`,
    `  --genome-shadow-scale: ${vec.shadowScale};`,
    `  --genome-backdrop-blur: ${vec.backdropBlur}px;`,
    `  --genome-backdrop-saturate: ${vec.backdropSaturate}%;`,
    `  --genome-surface-opacity: ${vec.surfaceOpacity};`,
    `  --genome-surface-grain: ${vec.surfaceGrain};`,
    `  --genome-hover-distance: ${vec.hoverDistance}px;`,
    `  --genome-hover-opacity: ${vec.hoverOpacity};`,
    `  --genome-letter-spacing-base: ${vec.letterSpacingBase.toFixed(4)}em;`,
    `  --genome-surface-warmth: ${vec.surfaceWarmth};`,
    vec.idleAnimation ? `  --genome-idle-animation: ${vec.idleAnimation};` : '',
    `  --genome-separator: "${vec.separator}";`,
    `  --genome-hover-indicator: "${vec.hoverIndicator}";`,
    '}',
  ].filter(Boolean);

  return lines.join('\n');
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface GenerateTokensOptions {
  components?: ComponentName[];
}

/**
 * Generate the full ComponentTokenMap from creator + design genome.
 * This is the main entry point for the generate_component_tokens MCP tool.
 */
export function generateComponentTokens(
  creator: CreatorGenome,
  genome: DesignGenome,
  options: GenerateTokensOptions = {}
): ComponentTokenMap {
  const vec = buildDecisionVector(creator, genome);

  const primaryHex  = genome.chromosomes.ch5_color_primary.hex;
  const surfaceHex  = genome.chromosomes.ch6_color_temp.surfaceColor;
  const elevatedHex = genome.chromosomes.ch6_color_temp.elevatedSurface;

  const targetComponents = options.components ?? [...ALL_COMPONENTS];
  const components: Partial<Record<ComponentName, ComponentTokenEntry>> = {};

  for (const component of targetComponents) {
    components[component] = buildComponentTokens(vec, component, primaryHex, surfaceHex, elevatedHex);
  }

  return {
    vec,
    components,
    cssVariables: buildCSSVariables(vec, primaryHex),
    motif: {
      separator:      genome.chromosomes.ch35_signature_motif.separator,
      hoverIndicator: genome.chromosomes.ch35_signature_motif.hoverIndicator,
      deployment:     genome.chromosomes.ch35_signature_motif.deployment,
    },
  };
}
