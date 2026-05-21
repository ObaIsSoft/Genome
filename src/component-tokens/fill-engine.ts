/**
 * Fill Engine
 *
 * Derives fill CSS from continuous genome coordinates:
 * gradient type, angle, stops, noise blend, gradient text.
 *
 * c6_aesthetic_sensibility — expressivity and organic vs geometric
 * c9_material_affinity    — digital vs analog, synthetic vs natural
 * c11_chaos_tolerance     — complexity and unexpectedness
 * c15_coherence_style     — how tightly the fills cohere
 *
 * Every value is computed. Labels are documentation only.
 */

import type { ComponentDecisionVector } from '../creator/types.js';
import type { ComponentSemantics } from '../creator/types.js';

export interface GradientStop {
  color: string;
  position: number;  // 0–100%
  opacity: number;   // 0–1
}

export interface FillSpec {
  /** Primary background CSS value */
  background: string;
  /** Stacked background layers when multiple fills */
  backgroundLayers: string[];
  /** CSS background-size value */
  backgroundSize: string;
  /** CSS background-position */
  backgroundPosition: string;
  /** Noise/grain overlay as a CSS pseudo-element data attribute */
  noiseOverlay: { intensity: number; blendMode: string } | null;
  /** gradient fill on text: background-clip + gradient background */
  textGradient: string | null;
  /** Object-fit for media containers */
  objectFit: string;
  /** Object-position focal point */
  objectPosition: string;
}

// ── Hex helpers ────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const c = hex.replace('#', '');
  if (c.length !== 6) return '0,0,0';
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`;
}

function shiftLightness(hex: string, amount: number): string {
  const c = hex.replace('#', '');
  if (c.length !== 6) return hex;
  const r = Math.max(0, Math.min(255, parseInt(c.slice(0,2),16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(c.slice(2,4),16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(c.slice(4,6),16) + amount));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ── Gradient builder ───────────────────────────────────────────────────────────

/**
 * Build a CSS gradient string from genome-derived parameters.
 * All stop positions and colors are computed, never preset.
 */
function buildGradient(
  vec: ComponentDecisionVector,
  baseHex: string,
  accentHex: string,
  sem: ComponentSemantics
): string {
  const stopCount = vec.gradientStopCount;
  const contrast  = vec.gradientContrast;

  // Stops: first = base, last = shifted by contrast, middle = continuous interpolations
  const stops: GradientStop[] = [];

  for (let i = 0; i < stopCount; i++) {
    const t = stopCount === 1 ? 0 : i / (stopCount - 1); // 0→1

    // Alternate between base and accent hue shifts
    const isEven = i % 2 === 0;
    const lightnessShift = Math.round((isEven ? -1 : 1) * contrast * 60 * t);
    const color = isEven ? shiftLightness(baseHex, -lightnessShift) : shiftLightness(accentHex, lightnessShift);

    // Opacity: middle stops can be slightly more transparent for depth
    const midDip  = Math.abs(t - 0.5) < 0.3 ? 0.05 : 0;
    const opacity = Math.max(0.6, 1 - midDip * contrast);

    stops.push({
      color,
      position: Math.round(t * 100),
      opacity: parseFloat(opacity.toFixed(3)),
    });
  }

  const stopStr = stops
    .map(s => `rgba(${hexToRgb(s.color)},${s.opacity}) ${s.position}%`)
    .join(', ');

  if (vec.gradientType === 'radial') {
    // Radial: origin from semantic weight (centered for visual-heavy, top for containers)
    const origin = sem.visualWeight > 0.6 ? 'center center' : 'center top';
    return `radial-gradient(ellipse at ${origin}, ${stopStr})`;
  }

  if (vec.gradientType === 'conic') {
    return `conic-gradient(from ${vec.gradientAngle}deg, ${stopStr})`;
  }

  // Linear — default
  return `linear-gradient(${vec.gradientAngle}deg, ${stopStr})`;
}

// ── Noise blend modes ──────────────────────────────────────────────────────────

const BLEND_MODE_MAP: Record<string, string> = {
  'overlay':    'overlay',
  'multiply':   'multiply',
  'screen':     'screen',
  'soft-light': 'soft-light',
  'normal':     'normal',
};

// ── Main entry ─────────────────────────────────────────────────────────────────

/**
 * Compute fill CSS for a component at a given base color.
 * The fill is shaped by the component's semantics — a media-heavy
 * container gets different treatment than a text-primary editorial block.
 */
export function computeFill(
  vec: ComponentDecisionVector,
  sem: ComponentSemantics,
  baseHex: string,
  accentHex: string,
  primaryHex: string
): FillSpec {
  const rgb = hexToRgb(baseHex);

  // ── Base background ────────────────────────────────────────────────────────
  let background: string;
  const backgroundLayers: string[] = [];

  if (vec.usesGradient && !sem.isFeedback && !sem.isNavigational) {
    // Gradient: derived from genome, shaped by semantics
    const grad = buildGradient(vec, baseHex, accentHex, sem);
    background = vec.surfaceOpacity < 1
      ? `${grad}` // gradient handles its own opacity via stops
      : grad;
    backgroundLayers.push(background);
  } else if (vec.backdropBlur > 0) {
    // Glassmorphism: translucent solid
    background = `rgba(${rgb}, ${vec.surfaceOpacity.toFixed(3)})`;
    backgroundLayers.push(background);
  } else {
    background = baseHex;
    backgroundLayers.push(background);
  }

  // ── Noise overlay layer ─────────────────────────────────────────────────────
  let noiseOverlay: FillSpec['noiseOverlay'] = null;
  if (vec.surfaceGrain > 0.08) {
    noiseOverlay = {
      intensity: vec.surfaceGrain,
      blendMode: BLEND_MODE_MAP[vec.noiseBlendMode] ?? 'overlay',
    };
  }

  // ── Gradient text fill ──────────────────────────────────────────────────────
  let textGradient: string | null = null;
  if (vec.gradientText) {
    // Text gradient: primary → shifted accent, always horizontal for legibility
    const textStops = [
      `${primaryHex} 0%`,
      `${shiftLightness(accentHex, 20)} 100%`,
    ].join(', ');
    textGradient = `linear-gradient(90deg, ${textStops})`;
  }

  // ── Media object treatment ─────────────────────────────────────────────────
  // Focal point: editorial/portrait → top-center, product → center, landscape → center
  let objectPosition = 'center center';
  if (sem.containsMedia && sem.isTextPrimary) objectPosition = 'center top';
  if (sem.visualWeight > 0.8 && sem.containsMedia) objectPosition = 'center 30%';

  const objectFit = sem.containsMedia
    ? (sem.contentDensity > 0.5 ? 'contain' : 'cover')
    : 'cover';

  // ── Background size/position for gradient backgrounds ──────────────────────
  const backgroundSize  = vec.usesGradient ? '100% 100%' : 'auto';
  const backgroundPosition = 'center';

  return {
    background,
    backgroundLayers,
    backgroundSize,
    backgroundPosition,
    noiseOverlay,
    textGradient,
    objectFit,
    objectPosition,
  };
}

/**
 * Build the CSS background shorthand from a FillSpec.
 */
export function fillToCSS(fill: FillSpec): string {
  return fill.background;
}

/**
 * Build the gradient text CSS rule set.
 * Returns null if this genome doesn't use gradient text.
 */
export function gradientTextCSS(fill: FillSpec): Record<string, string> | null {
  if (!fill.textGradient) return null;
  return {
    background: fill.textGradient,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    'background-clip': 'text',
    'color': 'transparent',
  };
}
