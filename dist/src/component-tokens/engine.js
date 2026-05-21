/**
 * Component Token Engine
 *
 * Translates L0 Creator Genome latent coordinates + L1 Design Genome chromosomes
 * into a ComponentDecisionVector — the intermediate representation that drives
 * all per-component CSS token decisions.
 *
 * ALL values are continuous derivations from genome coordinates.
 * Labels (materialLabel, easingLabel, blendLabel, gradientLabel) are documentation
 * only — they never drive CSS switch statements.
 *
 * Components are described by ComponentSpec (name + free-form description).
 * Semantics are inferred from the description, not looked up by name.
 * No hardcoded component type lists. No lookup tables keyed by component name.
 */
import { computeSurface, computeHoverSurface, deriveMaterialLabel } from './material-engine.js';
import { buildShadowSet, buildFocusOnlyShadow, buildInnerShadow, buildTextShadow } from './shadow-engine.js';
import { getComponentMotion, buildBaseTransition } from './motion-engine.js';
import { getComponentTypography } from './typography-engine.js';
import { computeFill } from './fill-engine.js';
import { deriveBlend } from './blend-engine.js';
import { deriveFilters } from './filter-engine.js';
import { deriveStroke, deriveHoverStroke } from './stroke-engine.js';
import { deriveSpacing } from './spacing-engine.js';
import { resolveSemantics, semanticRadiusModifier, semanticShadowScale } from './semantic-inference.js';
// ── Default specs (used when no specs are provided) ────────────────────────────
// Described via semantic signals — not a fixed type enum.
// The inferSemantics() function reads these descriptions to derive continuous properties.
export const DEFAULT_COMPONENT_SPECS = [
    { name: 'primary-action', description: 'cta primary button submit confirm trigger action interactive press' },
    { name: 'content-card', description: 'card container raised tile product listing article post media image' },
    { name: 'navigation-item', description: 'nav menu item tab link anchor route sidebar' },
    { name: 'text-field', description: 'input field form control interactive select text entry' },
    { name: 'status-indicator', description: 'badge pill indicator feedback status notification count small compact' },
    { name: 'media-hero', description: 'hero banner full width prominent featured large background image' },
    { name: 'floating-panel', description: 'modal dialog overlay floating ephemeral above foreground' },
    { name: 'data-row', description: 'table row data list repeated dense information compact' },
    { name: 'profile-circle', description: 'avatar circular round user profile picture portrait' },
    { name: 'system-message', description: 'toast alert notification ephemeral appears feedback message' },
    { name: 'secondary-action', description: 'ghost outline secondary subtle button link text action' },
    { name: 'editorial-heading', description: 'heading title display text primary article typography reading' },
];
// ── Sensory weight extraction ──────────────────────────────────────────────────
function getSensoryWeight(creator, senseIndex) {
    const pts = creator.c14_sensory_weights.points;
    return pts[senseIndex]?.weight ?? 0.2;
}
// ── Easing derivation ─────────────────────────────────────────────────────────
function deriveEasingCurve(creator) {
    const chaos = creator.c11_chaos_tolerance;
    const coherence = creator.c15_coherence_style;
    const systematic = (creator.c7_cognitive_pattern[0] + 1) / 2;
    const x1 = parseFloat((0.08 + systematic * 0.35).toFixed(3));
    const y1 = parseFloat((0.80 + chaos * 0.90).toFixed(3));
    const x2 = parseFloat((0.40 + coherence * 0.50).toFixed(3));
    const y2 = parseFloat((1.0 - (coherence > 0.7 ? (coherence - 0.7) * 0.1 : 0)).toFixed(3));
    const curve = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
    const label = chaos > 0.65 ? 'spring'
        : systematic > 0.6 ? 'ease-out'
            : coherence > 0.6 ? 'smooth'
                : 'balanced';
    return { curve, label };
}
// ── Main vector builder ────────────────────────────────────────────────────────
/**
 * Build a ComponentDecisionVector from creator genome + design genome.
 * Every field is computed from continuous latent coordinates.
 * This is the sole source of truth — all sub-engines read from this vector.
 */
export function buildDecisionVector(creator, genome) {
    const c9 = creator.c9_material_affinity; // [digital↔analog, polished↔rough, synthetic↔natural]
    const c6 = creator.c6_aesthetic_sensibility;
    const c4 = creator.c4_authorial_embedding; // [expressivity, formality, playfulness, precision]
    const c7 = creator.c7_cognitive_pattern;
    const ch = genome.chromosomes;
    // ── Surface / backdrop ──────────────────────────────────────────────────────
    const isGlass = c9[0] < -0.15;
    const glassDepth = Math.abs(Math.min(c9[0], 0)); // 0–1
    const backdropBlur = isGlass ? Math.round(12 + glassDepth * 28) : 0;
    const backdropSaturate = isGlass ? Math.round(120 + c9[1] * 100) : 100;
    const backdropBrightness = isGlass
        ? parseFloat((1.0 + glassDepth * 0.15).toFixed(3)) // glass slightly brightens
        : 1.0;
    const backdropContrast = isGlass
        ? parseFloat((1.0 + (c9[1] + 1) / 2 * 0.10).toFixed(3)) // polished glass more contrast
        : 1.0;
    const surfaceOpacity = isGlass
        ? parseFloat((0.04 + glassDepth * 0.82).toFixed(3))
        : 1.0;
    const surfaceGrain = parseFloat(ch.ch11_texture.noiseLevel.toFixed(3));
    const specularHighlight = c9[1] > 0.60;
    const surfaceWarmth = parseFloat(((c9[2] + 1) / 2).toFixed(3)); // -1..1 → 0..1
    // ── Fill system ─────────────────────────────────────────────────────────────
    // Expressivity × chaos → whether gradients appear; polished surfaces stay flat
    const expressivity = (c6[0] + 1) / 2; // 0–1
    const usesGradient = (expressivity * 0.65 + creator.c11_chaos_tolerance * 0.35) > 0.42
        && !(c9[1] > 0.72); // very polished = flat
    // Gradient type: chaos + analog-score drive toward conic/radial
    const gradTypeScore = creator.c11_chaos_tolerance * 0.5 + Math.abs(c9[0]) * 0.5;
    const gradientType = gradTypeScore > 0.70 ? 'conic'
        : c9[0] > 0.30 ? 'radial'
            : 'linear';
    // Angle: aesthetics + cognitive pattern, spread 0–360
    const gradientAngle = Math.round(((c6[0] + 1) * 90 + (c7[0] + 1) * 90) % 360);
    // Stop count: 2–5, more chaos → more stops
    const gradientStopCount = Math.max(2, Math.min(5, 2 + Math.floor(creator.c11_chaos_tolerance * 2 + expressivity)));
    // Contrast of gradient transitions: high expressivity = dramatic
    const gradientContrast = parseFloat((0.15 + Math.abs(c6[0]) * 0.65).toFixed(3));
    // Noise blend mode: derived from material balance
    const NOISE_BLEND_MODES = ['overlay', 'multiply', 'screen', 'soft-light', 'normal'];
    const noiseBlendIdx = Math.floor(((c9[0] + 1) / 2 + (c9[1] + 1) / 2) / 2 * NOISE_BLEND_MODES.length)
        % NOISE_BLEND_MODES.length;
    const noiseBlendMode = NOISE_BLEND_MODES[noiseBlendIdx];
    // Gradient text: very expressive + non-polished + strong authorial voice
    const gradientText = c6[0] > 0.55 && c4[0] > 0.30 && !(c9[1] > 0.65);
    // Gradient label (documentation)
    const gradientLabel = !usesGradient ? 'flat'
        : gradientType === 'conic' ? 'conic-expressive'
            : gradientType === 'radial' ? 'radial-depth'
                : gradientContrast > 0.50 ? 'high-contrast-linear'
                    : 'soft-linear';
    // ── Blend modes (global genome baseline) ───────────────────────────────────
    // The blend-engine will refine per-component based on semantics.
    // These globals are the genome's default — 'normal' for most genomes.
    const expressiveScore = usesGradient ? gradientContrast : 0;
    const mixBlendMode = expressiveScore > 0.55 || creator.c11_chaos_tolerance > 0.70
        ? ['screen', 'overlay', 'soft-light', 'multiply'][Math.floor((creator.c11_chaos_tolerance + expressiveScore) * 2) % 4]
        : 'normal';
    const elementOpacity = 1.0; // refined per-component by blend-engine
    const backgroundBlendMode = usesGradient && surfaceGrain > 0.08 ? noiseBlendMode : 'normal';
    const blendLabel = mixBlendMode === 'normal' ? 'neutral'
        : ['screen', 'color-dodge'].includes(mixBlendMode) ? 'additive'
            : ['multiply', 'darken'].includes(mixBlendMode) ? 'subtractive'
                : 'atmospheric';
    // ── Shape ──────────────────────────────────────────────────────────────────
    const radiusBase = ch.ch7_edge.componentRadius;
    // c6[1]: -1=strict/geometric, +1=fluid/organic → variance in radius across components
    const radiusVariance = parseFloat(((c6[1] + 1) / 2 * 0.40).toFixed(3)); // 0–0.40
    // Corner smoothing: polished + expressive → squircle-like
    const cornerSmoothing = parseFloat(((c9[1] + 1) / 2 * 0.55 + Math.abs(c6[2] ?? 0) * 0.35).toFixed(3));
    // Asymmetric corners: intuitive cognitive style + fluid aesthetic
    const asymmetricCorners = c7[0] < -0.40 && c6[1] > 0.30;
    // ── Shadow ─────────────────────────────────────────────────────────────────
    const tactileWeight = getSensoryWeight(creator, 1); // tactile = index 1
    const visualWeight = getSensoryWeight(creator, 0);
    const shadowLayers = Math.max(1, Math.min(4, Math.ceil(tactileWeight * 4)));
    const shadowColorTinted = visualWeight > 0.28;
    const shadowSoftness = parseFloat(((1 - c9[1]) / 2).toFixed(3)); // polished→sharp, rough→diffuse
    const shadowScale = ch.ch10_hierarchy.shadowScale;
    // ── Inner shadow ───────────────────────────────────────────────────────────
    // Analog/physical materials → more inner shadow depth. Polished glass → less.
    const innerShadowLikelihood = Math.max(0, c9[0]) * 0.55 + ((c9[1] + 1) / 2) * 0.35;
    const innerShadowCount = innerShadowLikelihood > 0.55 ? 2
        : innerShadowLikelihood > 0.30 ? 1
            : 0;
    const innerShadowSoftness = parseFloat(((c9[1] + 1) / 2).toFixed(3));
    const innerShadowOpacity = parseFloat((0.04 + innerShadowLikelihood * 0.16).toFixed(3));
    // ── Text shadow ────────────────────────────────────────────────────────────
    // Editorial + expressive genomes → text shadows on display headings
    const useTextShadow = c4[0] > 0.40 && creator.c11_chaos_tolerance > 0.30 && expressivity > 0.45;
    const textShadowBlur = Math.round(2 + creator.c11_chaos_tolerance * 8); // 2–10px
    const textShadowOpacity = parseFloat((0.07 + c4[0] * 0.18).toFixed(3));
    // ── Element filters ─────────────────────────────────────────────────────────
    // Chaotic or strongly material-toned genomes apply element filters
    const useElementFilter = creator.c11_chaos_tolerance > 0.55 || Math.abs(c9[2]) > 0.60;
    const filterBrightness = parseFloat((1.0 + c9[2] * 0.15).toFixed(3)); // natural → brighter
    const filterContrast = parseFloat((1.0 + Math.abs(c9[1]) * 0.22 - 0.11).toFixed(3));
    const filterSaturate = parseFloat((1.0 + c6[0] * 0.55).toFixed(3)); // expressive → saturated
    const filterHueRotate = Math.round(Math.abs(c6[2] ?? 0) * 22); // 0–22deg subtle shift
    // Very digital + polished → slight desaturation filter
    const filterGrayscale = c9[1] > 0.70 && c9[0] < -0.50
        ? parseFloat((c9[1] * 0.25).toFixed(3))
        : 0;
    // Natural/warm surfaces → hint of sepia warmth
    const filterSepia = c9[2] > 0.50
        ? parseFloat(((c9[2] - 0.50) * 0.70).toFixed(3))
        : 0;
    // ── Image / media treatment ─────────────────────────────────────────────────
    const imageFilterBrightness = parseFloat((0.88 + surfaceWarmth * 0.18).toFixed(3));
    const imageFilterContrast = parseFloat((1.0 + (c9[1] + 1) / 2 * 0.22).toFixed(3));
    const imageFilterSaturate = parseFloat((0.82 + expressivity * 0.46).toFixed(3));
    const imageFilterHueRotate = Math.round((surfaceWarmth - 0.5) * 14); // -7 to +7deg
    const imageTreatmentLabel = c9[2] > 0.40 ? 'warm-organic'
        : c9[0] < -0.40 ? 'cool-digital'
            : c9[1] > 0.50 ? 'polished-cinematic'
                : 'natural';
    // ── Stroke / border ─────────────────────────────────────────────────────────
    // Analog/physical materials → defined strokes. Digital glass → no strokes.
    const strokeLikelihood = Math.max(0, c9[0]) * 0.55 + ((c9[1] + 1) / 2) * 0.35;
    const strokeWidth = strokeLikelihood > 0.45
        ? parseFloat((0.5 + strokeLikelihood * 3.5).toFixed(1)) // 0.5–4px
        : 0;
    const strokeStyle = 'solid'; // stroke-engine refines this per component
    const strokePosition = c9[1] > 0.40 ? 'inside' : 'center';
    const strokeUsesGradient = usesGradient && creator.c11_chaos_tolerance > 0.55 && strokeWidth > 1.0;
    // ── Motion ──────────────────────────────────────────────────────────────────
    const { curve: easingCurve, label: easingLabel } = deriveEasingCurve(creator);
    const durationBase = Math.round(ch.ch8_motion.durationScale * 200);
    const kinesthetic = getSensoryWeight(creator, 4); // kinesthetic = index 4
    const hoverDistance = parseFloat((kinesthetic * 16).toFixed(1)); // 0–16px
    const hoverOpacity = parseFloat((0.55 + creator.c15_coherence_style * 0.30).toFixed(3));
    const isExpressive = creator.c11_chaos_tolerance > 0.60 && creator.c12_cross_pollination > 0.55;
    const idleAnimation = isExpressive
        ? ['genome-breathe', 'genome-float', 'genome-shimmer'][Math.floor(creator.c11_chaos_tolerance * 3) % 3]
        : null;
    // ── Typography ──────────────────────────────────────────────────────────────
    const letterSpacingBase = parseFloat(((c4[0] + 1) / 2 * 0.10 - 0.02).toFixed(4)); // -0.02–0.08em
    const tabulaNumeric = c4[3] > 0.50;
    const textWrapBalance = c7[0] > 0.50;
    // Text stroke: high expressivity + non-subtle genomes → display stroke
    const textStrokeWidth = c4[0] > 0.65 && creator.c11_chaos_tolerance > 0.55
        ? parseFloat((0.5 + c4[0] * 1.5).toFixed(1)) // 0.5–2.5px
        : 0;
    // Font variation settings: variable fonts when technical score is high
    const techScore = creator.c5_technical_spectrum?.[0] ?? 0.5;
    const fontVariationSettings = techScore > 0.55
        ? `"wght" ${Math.round(300 + c6[0] * 400)}` // weight axis 300–700
        : null;
    // ── Spacing ─────────────────────────────────────────────────────────────────
    const rhythmUnit = ch.ch2_rhythm.verticalRhythm; // 4 | 8 | 12 px
    // Padding scale: expressive + high chaos = generous; systematic/tight = compact
    const paddingScale = parseFloat((0.70 + expressivity * 0.70 + creator.c11_chaos_tolerance * 0.20).toFixed(3));
    // Gap scale: systematic (ordered) = tighter gaps; intuitive = looser
    const gapScale = parseFloat((0.45 + ((c7[0] + 1) / 2) * 0.80).toFixed(3));
    // ── Motif ──────────────────────────────────────────────────────────────────
    const separator = ch.ch35_signature_motif?.separator ?? '_';
    const hoverIndicator = ch.ch35_signature_motif?.hoverIndicator ?? '→';
    // ── Material label (documentation only) ────────────────────────────────────
    const materialLabel = deriveMaterialLabel([c9[0], c9[1], c9[2]], (c6[2] !== undefined ? (c6[2] + 1) / 2 : 0.5));
    return {
        backdropBlur, backdropSaturate, backdropBrightness, backdropContrast,
        surfaceOpacity, surfaceGrain, specularHighlight, surfaceWarmth,
        usesGradient, gradientType, gradientAngle, gradientStopCount, gradientContrast,
        noiseBlendMode, gradientText,
        mixBlendMode, elementOpacity, backgroundBlendMode,
        radiusBase, radiusVariance, cornerSmoothing, asymmetricCorners,
        shadowLayers, shadowColorTinted, shadowSoftness, shadowScale,
        innerShadowCount, innerShadowSoftness, innerShadowOpacity,
        useTextShadow, textShadowBlur, textShadowOpacity,
        useElementFilter, filterBrightness, filterContrast, filterSaturate,
        filterHueRotate, filterGrayscale, filterSepia,
        imageFilterBrightness, imageFilterContrast, imageFilterSaturate,
        imageFilterHueRotate, imageTreatmentLabel,
        strokeWidth, strokeStyle, strokePosition, strokeUsesGradient,
        easingCurve, durationBase, hoverDistance, hoverOpacity, idleAnimation,
        letterSpacingBase, tabulaNumeric, textWrapBalance, textStrokeWidth,
        fontVariationSettings,
        paddingScale, gapScale, rhythmUnit,
        separator, hoverIndicator,
        materialLabel, easingLabel, blendLabel, gradientLabel,
    };
}
// ── State builder ─────────────────────────────────────────────────────────────
function buildState(background, backdropFilter, border, boxShadow, borderRadius, transition, transform, typography, opacity, cursor, outline, filter, mixBlendMode, padding, gap) {
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
        filter,
        mixBlendMode,
        padding,
        gap,
    };
}
// ── Typography context from semantics ─────────────────────────────────────────
function typographyContext(sem) {
    if (sem.initiatesAction)
        return 'button';
    if (sem.isFeedback && sem.contentDensity < 0.40)
        return 'badge';
    if (sem.isNavigational)
        return 'nav';
    if (sem.interactivity > 0.35 && !sem.isContainer)
        return 'input';
    if (sem.contentDensity < 0.20 && !sem.isContainer)
        return 'caption';
    return 'button';
}
// ── Per-component token generation ────────────────────────────────────────────
function buildComponentTokens(vec, spec, sem, primaryHex, accentHex, surfaceHex, elevatedHex) {
    // ── Radius: semantic modifier on genome base, no lookup table ───────────────
    const radiusMod = semanticRadiusModifier(sem);
    const radiusPx = radiusMod >= 999 ? 9999 : Math.max(0, Math.round(vec.radiusBase * radiusMod));
    // ── All engine specs ────────────────────────────────────────────────────────
    const fillSpec = computeFill(vec, sem, surfaceHex, accentHex, primaryHex);
    const blendSpec = deriveBlend(vec, sem);
    const filterSpec = deriveFilters(vec, sem);
    const strokeSpec = deriveStroke(vec, sem, primaryHex, accentHex, surfaceHex);
    const spacingSpec = deriveSpacing(vec, sem);
    const innerShadow = buildInnerShadow(vec);
    const textShadow = buildTextShadow(vec, primaryHex);
    // ── Shadow with semantic scale ──────────────────────────────────────────────
    const semScale = semanticShadowScale(sem, vec.shadowScale);
    const scaledVec = { ...vec, shadowScale: semScale };
    const shadowSet = buildShadowSet(scaledVec, primaryHex);
    const flatShadows = buildFocusOnlyShadow(scaledVec, primaryHex);
    // ── Motion ──────────────────────────────────────────────────────────────────
    const motion = getComponentMotion(vec, sem);
    const baseTransition = buildBaseTransition(vec);
    const hoverTransition = `${motion.hoverTransition}, ${baseTransition}`;
    // ── Typography ──────────────────────────────────────────────────────────────
    const typography = getComponentTypography(vec, typographyContext(sem));
    // ── Surface backgrounds ─────────────────────────────────────────────────────
    const defaultSurface = computeSurface(vec, surfaceHex, primaryHex, 1.0);
    const hoverSurface = computeHoverSurface(vec, elevatedHex, primaryHex);
    const activeSurface = computeSurface(vec, surfaceHex, primaryHex, 0.85);
    // ── Composed CSS values ─────────────────────────────────────────────────────
    const borderStr = strokeSpec.border ?? 'none';
    const hoverBorderStr = deriveHoverStroke(strokeSpec, primaryHex).border ?? 'none';
    const blendMode = blendSpec.mixBlendMode;
    const elemFilter = filterSpec.elementFilter;
    const padding = spacingSpec.padding;
    const gap = spacingSpec.gap;
    // Compose inner shadow with outer shadow
    const composeBoxShadow = (outer) => {
        if (!innerShadow.css)
            return outer;
        return outer === 'none' ? innerShadow.css : `${outer}, ${innerShadow.css}`;
    };
    // ── FILLED variant ──────────────────────────────────────────────────────────
    const filled = {
        default: buildState(defaultSurface.background, defaultSurface.backdropFilter, borderStr, composeBoxShadow(shadowSet.default), radiusPx, baseTransition, 'none', typography, blendSpec.elementOpacity, 'pointer', null, elemFilter, blendMode, padding, gap),
        hover: buildState(hoverSurface.background, hoverSurface.backdropFilter, hoverBorderStr, composeBoxShadow(shadowSet.hover), radiusPx, hoverTransition, motion.hoverTransform, typography, blendSpec.elementOpacity, 'pointer', null, elemFilter, blendMode, padding, gap),
        active: buildState(activeSurface.background, activeSurface.backdropFilter, borderStr, composeBoxShadow(shadowSet.active), radiusPx, `transform ${motion.activeDurationMs}ms ${vec.easingCurve}, box-shadow ${motion.activeDurationMs}ms ${vec.easingCurve}`, motion.activeTransform, typography, blendSpec.elementOpacity, 'pointer', null, elemFilter, blendMode, padding, gap),
        focus: buildState(defaultSurface.background, defaultSurface.backdropFilter, borderStr, composeBoxShadow(shadowSet.focus), radiusPx, baseTransition, 'none', typography, blendSpec.elementOpacity, 'pointer', `0 0 0 2px ${primaryHex}40`, elemFilter, blendMode, padding, gap),
        disabled: buildState(defaultSurface.background, defaultSurface.backdropFilter, borderStr, 'none', radiusPx, 'none', 'none', typography, 0.45, 'not-allowed', null, null, 'normal', padding, gap),
    };
    // ── GHOST variant ───────────────────────────────────────────────────────────
    const ghostBorder = `1px solid ${primaryHex}80`;
    const ghostHoverBorder = `1px solid ${primaryHex}`;
    const ghost = {
        default: buildState('transparent', 'none', ghostBorder, flatShadows.default, radiusPx, baseTransition, 'none', typography, 1.0, 'pointer', null, null, blendMode, padding, gap),
        hover: buildState(`${primaryHex}12`, 'none', ghostHoverBorder, flatShadows.hover, radiusPx, hoverTransition, motion.hoverTransform, typography, 1.0, 'pointer', null, null, blendMode, padding, gap),
        active: buildState(`${primaryHex}20`, 'none', ghostHoverBorder, flatShadows.active, radiusPx, `transform ${motion.activeDurationMs}ms ${vec.easingCurve}`, motion.activeTransform, typography, 1.0, 'pointer', null, null, blendMode, padding, gap),
        focus: buildState('transparent', 'none', ghostHoverBorder, flatShadows.focus, radiusPx, baseTransition, 'none', typography, 1.0, 'pointer', `0 0 0 2px ${primaryHex}40`, null, blendMode, padding, gap),
        disabled: buildState('transparent', 'none', `1px solid ${primaryHex}40`, 'none', radiusPx, 'none', 'none', typography, 0.45, 'not-allowed', null, null, 'normal', padding, gap),
    };
    // ── FLAT variant ────────────────────────────────────────────────────────────
    const flat = {
        default: buildState('transparent', 'none', 'none', 'none', radiusPx, baseTransition, 'none', typography, 1.0, 'pointer', null, null, blendMode, padding, gap),
        hover: buildState(`${primaryHex}10`, 'none', 'none', 'none', radiusPx, hoverTransition, 'none', typography, blendSpec.elementOpacity, 'pointer', null, null, blendMode, padding, gap),
        active: buildState(`${primaryHex}18`, 'none', 'none', 'none', radiusPx, `opacity ${motion.activeDurationMs}ms ${vec.easingCurve}`, 'none', typography, 1.0, 'pointer', null, null, blendMode, padding, gap),
        focus: buildState('transparent', 'none', 'none', flatShadows.focus, radiusPx, baseTransition, 'none', typography, 1.0, 'pointer', `0 0 0 2px ${primaryHex}40`, null, blendMode, padding, gap),
        disabled: buildState('transparent', 'none', 'none', 'none', radiusPx, 'none', 'none', typography, 0.40, 'not-allowed', null, null, 'normal', padding, gap),
    };
    // ── Rationale ───────────────────────────────────────────────────────────────
    const rationale = {
        component: `"${spec.name}"${spec.description ? ` — ${spec.description}` : ''}`,
        borderRadius: `${radiusPx >= 9999 ? '50%' : radiusPx + 'px'} — radiusBase=${vec.radiusBase}px × semanticModifier=${semanticRadiusModifier(sem).toFixed(2)}`,
        shadow: `${vec.shadowLayers}-layer shadow; softness=${vec.shadowSoftness.toFixed(2)}; scale=${semScale.toFixed(2)} (semantic boost from elevation=${sem.elevationLevel})`,
        motion: `${vec.durationBase}ms ${vec.easingLabel} (${vec.easingCurve}); lift=${motion.hoverTransform}; interactivity=${sem.interactivity.toFixed(2)}`,
        surface: `material="${vec.materialLabel}"; ${vec.backdropBlur > 0 ? `glassmorphism blur=${vec.backdropBlur}px saturate=${vec.backdropSaturate}%` : 'solid surface'}; grain=${vec.surfaceGrain.toFixed(2)}`,
        fill: `${vec.usesGradient ? `${vec.gradientLabel} gradient (${vec.gradientStopCount} stops, contrast=${vec.gradientContrast.toFixed(2)})` : 'flat solid'}`,
        blend: `blend="${blendSpec.blendLabel}" (${blendSpec.mixBlendMode})`,
        stroke: strokeSpec.border ? `${vec.strokeWidth}px ${strokeSpec.borderStyle} stroke` : 'no stroke',
        spacing: `padding=${spacingSpec.padding}; gap=${spacingSpec.gap}; rhythmUnit=${vec.rhythmUnit}px`,
        typography: `letter-spacing=${typography.letterSpacing}; ${vec.tabulaNumeric ? 'tabular-nums; ' : ''}${typography.textTransform ?? 'inherit case'}`,
        semantics: `interactivity=${sem.interactivity.toFixed(2)}; density=${sem.contentDensity.toFixed(2)}; elevation=${sem.elevationLevel}; media=${sem.containsMedia}; circular=${sem.isCircular}`,
    };
    return {
        filled, ghost, flat,
        specs: { fill: fillSpec, blend: blendSpec, filter: filterSpec, stroke: strokeSpec, spacing: spacingSpec, innerShadow, textShadow },
        borderRadiusPx: radiusPx,
        padding,
        gap,
        rationale,
    };
}
// ── CSS variables generator ───────────────────────────────────────────────────
function buildCSSVariables(vec, primaryHex) {
    const lines = [
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
        `  --genome-backdrop-brightness: ${vec.backdropBrightness};`,
        `  --genome-surface-opacity: ${vec.surfaceOpacity};`,
        `  --genome-surface-grain: ${vec.surfaceGrain};`,
        `  --genome-hover-distance: ${vec.hoverDistance}px;`,
        `  --genome-hover-opacity: ${vec.hoverOpacity};`,
        `  --genome-letter-spacing-base: ${vec.letterSpacingBase.toFixed(4)}em;`,
        `  --genome-surface-warmth: ${vec.surfaceWarmth};`,
        `  --genome-rhythm-unit: ${vec.rhythmUnit}px;`,
        `  --genome-padding-scale: ${vec.paddingScale};`,
        `  --genome-gap-scale: ${vec.gapScale};`,
        `  --genome-gradient-angle: ${vec.gradientAngle}deg;`,
        `  --genome-gradient-contrast: ${vec.gradientContrast};`,
        `  --genome-stroke-width: ${vec.strokeWidth}px;`,
        `  --genome-corner-smoothing: ${vec.cornerSmoothing};`,
        vec.idleAnimation ? `  --genome-idle-animation: ${vec.idleAnimation};` : '',
        `  --genome-separator: "${vec.separator}";`,
        `  --genome-hover-indicator: "${vec.hoverIndicator}";`,
        vec.fontVariationSettings ? `  --genome-font-variation: ${vec.fontVariationSettings};` : '',
        `  --genome-mix-blend-mode: ${vec.mixBlendMode};`,
        `  --genome-text-stroke-width: ${vec.textStrokeWidth}px;`,
        '}',
    ].filter(Boolean);
    return lines.join('\n');
}
/**
 * Generate the full ComponentTokenMap from creator + design genome.
 * This is the main entry point for the generate_component_tokens MCP tool.
 *
 * Components are driven by ComponentSpec[] — free-form name + description.
 * If no specs are provided, DEFAULT_COMPONENT_SPECS are used.
 * All CSS decisions are continuous derivations from genome latent coordinates.
 */
export function generateComponentTokens(creator, genome, options = {}) {
    const vec = buildDecisionVector(creator, genome);
    const primaryHex = genome.chromosomes.ch5_color_primary.hex;
    const accentHex = genome.chromosomes.ch6_color_temp.elevatedSurface ?? primaryHex;
    const surfaceHex = genome.chromosomes.ch6_color_temp.surfaceColor;
    const elevatedHex = genome.chromosomes.ch6_color_temp.elevatedSurface;
    // Resolve spec list
    let specs = options.specs ?? [];
    // Legacy support: if string names passed via components[], convert to specs
    if (specs.length === 0 && options.components && options.components.length > 0) {
        specs = options.components.map(name => {
            // Find in defaults by partial name match first
            const match = DEFAULT_COMPONENT_SPECS.find(s => s.name.includes(name) || name.includes(s.name.split('-')[0]));
            return match ?? { name, description: name.replace(/-/g, ' ') };
        });
    }
    // Fall back to defaults
    if (specs.length === 0)
        specs = DEFAULT_COMPONENT_SPECS;
    const components = {};
    for (const spec of specs) {
        const sem = resolveSemantics(spec);
        components[spec.name] = buildComponentTokens(vec, spec, sem, primaryHex, accentHex, surfaceHex, elevatedHex);
    }
    return {
        vec,
        components,
        cssVariables: buildCSSVariables(vec, primaryHex),
        motif: {
            separator: genome.chromosomes.ch35_signature_motif?.separator ?? '_',
            hoverIndicator: genome.chromosomes.ch35_signature_motif?.hoverIndicator ?? '→',
            deployment: genome.chromosomes.ch35_signature_motif?.deployment ?? 0.5,
        },
    };
}
