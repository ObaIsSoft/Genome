/**
 * Shadow Engine
 *
 * Builds multi-layer box-shadow values from continuous ComponentDecisionVector
 * parameters. No hardcoded presets — every value is computed from the genome.
 *
 * Real designers layer 2–4 box-shadows: ambient (large/soft) + direct (crisp)
 * + optional primary-tinted glow + optional specular inset highlight.
 */
/**
 * Hex to RGB helper — kept local to avoid circular imports
 */
function hexToRgbTriple(hex) {
    const clean = hex.replace('#', '');
    if (clean.length !== 6)
        return null;
    return {
        r: parseInt(clean.slice(0, 2), 16),
        g: parseInt(clean.slice(2, 4), 16),
        b: parseInt(clean.slice(4, 6), 16),
    };
}
/**
 * Build a single box-shadow string for a component at a given intensity scale.
 * scale = 1.0 for default, 1.5+ for hover, 0.4 for active.
 */
export function buildShadow(vec, primaryHex, scale = 1.0) {
    const { shadowLayers, shadowSoftness, shadowColorTinted, shadowScale, specularHighlight } = vec;
    const effectiveScale = shadowScale * scale;
    const layers = [];
    // ── Layer 1: Ambient (always present) ──────────────────────────────────────
    // Large, very soft, low opacity — the "atmosphere" shadow
    const ambientBlur = Math.round((18 + shadowSoftness * 30) * effectiveScale);
    const ambientSpread = Math.round(-2 * effectiveScale);
    const ambientY = Math.round((4 + shadowSoftness * 8) * effectiveScale);
    const ambientOpacity = parseFloat((0.04 + shadowScale * 0.05).toFixed(3));
    layers.push(`0 ${ambientY}px ${ambientBlur}px ${ambientSpread}px rgba(0,0,0,${ambientOpacity})`);
    // ── Layer 2: Direct (when shadowLayers >= 2) ───────────────────────────────
    // Crisp, small, higher opacity — the "cast" shadow
    if (shadowLayers >= 2) {
        const directBlur = Math.round((4 + shadowSoftness * 10) * effectiveScale);
        const directY = Math.round((2 + shadowSoftness * 4) * effectiveScale);
        const directOpacity = parseFloat((0.06 + shadowScale * 0.08).toFixed(3));
        layers.push(`0 ${directY}px ${directBlur}px rgba(0,0,0,${directOpacity})`);
    }
    // ── Layer 3: Primary-tinted glow (when layers >= 3 && colorTinted) ─────────
    if (shadowLayers >= 3 && shadowColorTinted) {
        const rgb = hexToRgbTriple(primaryHex);
        if (rgb) {
            const tintBlur = Math.round((12 + shadowSoftness * 20) * effectiveScale);
            const tintY = Math.round((2 + shadowSoftness * 6) * effectiveScale);
            const tintOpacity = parseFloat((0.10 + shadowScale * 0.12).toFixed(3));
            layers.push(`0 ${tintY}px ${tintBlur}px rgba(${rgb.r},${rgb.g},${rgb.b},${tintOpacity})`);
        }
    }
    // ── Layer 4: Specular inset highlight (polished surfaces) ──────────────────
    if (shadowLayers >= 4 && specularHighlight) {
        const highlightOpacity = parseFloat((0.08 + (1 - shadowSoftness) * 0.10).toFixed(3));
        layers.push(`inset 0 1px 0 rgba(255,255,255,${highlightOpacity})`);
    }
    return layers.join(', ') || 'none';
}
/**
 * Build a complete shadow set for a component (default, hover, active, focus).
 */
export function buildShadowSet(vec, primaryHex, focusRingOpacity = 0.25) {
    const rgb = hexToRgbTriple(primaryHex);
    const focusOpacity = parseFloat(focusRingOpacity.toFixed(3));
    const focusWidth = Math.round(2 + vec.shadowScale * 2);
    const fallbackOpacity = parseFloat((0.10 + vec.shadowScale * 0.10).toFixed(3));
    const focusRing = rgb
        ? `0 0 0 ${focusWidth}px rgba(${rgb.r},${rgb.g},${rgb.b},${focusOpacity})`
        : `0 0 0 ${focusWidth}px rgba(0,0,0,${fallbackOpacity})`;
    return {
        default: buildShadow(vec, primaryHex, 1.0),
        hover: buildShadow(vec, primaryHex, 1.6),
        active: buildShadow(vec, primaryHex, 0.5),
        focus: `${buildShadow(vec, primaryHex, 0.8)}, ${focusRing}`,
    };
}
/**
 * Build a "none" shadow with optional focus ring only.
 * Used for flat/ghost variants that have no elevation.
 */
export function buildFocusOnlyShadow(vec, primaryHex) {
    const rgb = hexToRgbTriple(primaryHex);
    const focusOpacity = parseFloat((0.20 + vec.shadowScale * 0.15).toFixed(3));
    const focusWidth = Math.round(2 + vec.shadowScale * 2);
    const fallbackOpacity = parseFloat((0.12 + vec.shadowScale * 0.12).toFixed(3));
    const focusRing = rgb
        ? `0 0 0 ${focusWidth}px rgba(${rgb.r},${rgb.g},${rgb.b},${focusOpacity})`
        : `0 0 0 ${focusWidth}px rgba(0,0,0,${fallbackOpacity})`;
    return { default: 'none', hover: 'none', active: 'none', focus: focusRing };
}
/**
 * Build inset box-shadow from continuous genome parameters.
 * Inner shadows create material depth — pressed buttons, recessed inputs,
 * sunken containers on analog/physical-feeling surfaces.
 */
export function buildInnerShadow(vec) {
    if (vec.innerShadowCount === 0)
        return { css: null, layers: 0 };
    const { innerShadowSoftness, innerShadowOpacity } = vec;
    const layers = [];
    // Layer 1: top inset edge — main recessed shadow
    const blur1 = Math.round(2 + innerShadowSoftness * 10); // 2–12px
    const yOffset = Math.round(1 + innerShadowSoftness * 4); // 1–5px
    const spread1 = innerShadowSoftness > 0.5 ? 0 : -1;
    layers.push(`inset 0 ${yOffset}px ${blur1}px ${spread1}px rgba(0,0,0,${innerShadowOpacity.toFixed(3)})`);
    // Layer 2: bottom highlight — paired inset on opposite edge creates pressed-in depth
    if (vec.innerShadowCount >= 2) {
        const highlightOpacity = parseFloat((innerShadowOpacity * 0.5).toFixed(3));
        const blur2 = Math.round(blur1 * 0.6);
        layers.push(`inset 0 -${Math.round(yOffset * 0.6)}px ${blur2}px rgba(255,255,255,${highlightOpacity})`);
    }
    return { css: layers.join(', '), layers: vec.innerShadowCount };
}
/**
 * Build CSS text-shadow for display text from continuous genome parameters.
 * Editorial/expressive genomes use text shadows on headings; digital/minimal don't.
 * Warm analog genomes → color-tinted shadow; cool digital → neutral dark shadow.
 */
export function buildTextShadow(vec, primaryHex) {
    if (!vec.useTextShadow)
        return { css: null };
    const rgb = hexToRgbTriple(primaryHex);
    const opacity = vec.textShadowOpacity;
    const blur = vec.textShadowBlur;
    const yOffset = Math.round(blur * 0.3);
    if (rgb && vec.surfaceWarmth > 0.55) {
        // Warm analog: subtle primary-tinted glow for editorial depth
        return { css: `0 ${yOffset}px ${blur}px rgba(${rgb.r},${rgb.g},${rgb.b},${opacity.toFixed(3)})` };
    }
    return { css: `0 ${yOffset}px ${blur}px rgba(0,0,0,${opacity.toFixed(3)})` };
}
