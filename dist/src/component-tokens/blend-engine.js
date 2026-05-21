/**
 * Blend Engine
 *
 * Derives CSS mix-blend-mode and background-blend-mode from continuous
 * creator genome coordinates. No hardcoded category → blend mode lookup.
 *
 * The blend mode is a continuous position in blend-space, shaped by:
 *   c9[0] digital(-1) ↔ analog(+1)   → additive vs subtractive blending
 *   c9[1] polished(+1) ↔ rough(-1)   → clean vs textured compositing
 *   c11   chaos_tolerance             → experimental vs safe blend choices
 *   c7[0] systematic ↔ intuitive     → predictable vs surprising
 *
 * The label is documentation only — the CSS value is what matters.
 */
// ── Blend mode clusters ────────────────────────────────────────────────────────
// Grouped by visual character, not named. Selection is continuous.
// Additive / luminous — digital, high-energy, screen-like
const ADDITIVE = ['screen', 'color-dodge', 'lighten', 'luminosity'];
// Subtractive / physical — analog, photographic, material
const SUBTRACTIVE = ['multiply', 'darken', 'color-burn'];
// Atmospheric / layered — painterly, overlapping surfaces
const ATMOSPHERIC = ['overlay', 'soft-light', 'hard-light'];
// Experimental / expressive — high contrast, unexpected
const EXPERIMENTAL = ['difference', 'exclusion', 'hue', 'saturation', 'color'];
// Safe / neutral — reliable, invisible when subtle
const SAFE = ['normal', 'multiply'];
/**
 * Pick a blend mode from a cluster using a continuous float index.
 * The cluster selection itself is continuous — different genomes land
 * at different positions in the blend-space.
 */
function pickFromCluster(cluster, t) {
    const idx = Math.floor(t * cluster.length) % cluster.length;
    return cluster[idx];
}
/**
 * Derive blend modes and opacity from the decision vector and semantics.
 *
 * Most components stay at 'normal' — blend modes are a tool for specific
 * design statements, not applied universally. The genome determines whether
 * blend modes are part of this design's vocabulary at all.
 */
export function deriveBlend(vec, sem) {
    // Cluster weights from continuous genome values
    // digital(-1)→analog(+1): more digital = additive cluster
    const digitalScore = Math.max(0, -vec.surfaceWarmth * 2 + 1); // invert warmth → digital proxy
    // analog score
    const analogScore = vec.surfaceWarmth;
    // chaos
    const chaosScore = 1 - vec.shadowSoftness; // reuse softness as chaos proxy (polished→ordered)
    // expressivity: gradient usage + gradient contrast signal expressiveness
    const expressiveScore = vec.usesGradient ? vec.gradientContrast : 0;
    // Score each cluster 0–1
    const additiveWeight = digitalScore * (1 - chaosScore * 0.5);
    const subtractiveWeight = analogScore * 0.8;
    const atmosphericWeight = (analogScore + expressiveScore) * 0.6;
    const experimentalWeight = chaosScore * expressiveScore * 1.5;
    // Which cluster dominates?
    const weights = [additiveWeight, subtractiveWeight, atmosphericWeight, experimentalWeight];
    const max = Math.max(...weights);
    const dominant = weights.indexOf(max);
    // For most components in most genomes, blend mode should be normal.
    // Only apply non-normal blend when: the genome is expressive AND the
    // component semantics support it (not feedback, not navigational data).
    const shouldUseBlend = (expressiveScore > 0.4 ||
        experimentalWeight > 0.35 ||
        (vec.usesGradient && sem.containsMedia)) && !sem.isFeedback && sem.elevationLevel < 2;
    let mixBlendMode = 'normal';
    let blendLabel = 'neutral';
    if (shouldUseBlend) {
        const t = expressiveScore; // continuous position within chosen cluster
        if (dominant === 0) {
            mixBlendMode = pickFromCluster(ADDITIVE, t);
            blendLabel = 'additive';
        }
        else if (dominant === 1) {
            mixBlendMode = pickFromCluster(SUBTRACTIVE, t);
            blendLabel = 'physical';
        }
        else if (dominant === 2) {
            mixBlendMode = pickFromCluster(ATMOSPHERIC, t);
            blendLabel = 'atmospheric';
        }
        else {
            mixBlendMode = pickFromCluster(EXPERIMENTAL, t);
            blendLabel = 'experimental';
        }
    }
    // Background blend: stacked fills need a blend mode to interact
    // Usually overlay or multiply — derived from the noise blend mode
    const backgroundBlendMode = vec.usesGradient && vec.surfaceGrain > 0.1
        ? vec.noiseBlendMode
        : 'normal';
    // Element opacity: used as a design tool for layered/glass surfaces
    // Not the same as surfaceOpacity (which is the fill layer) —
    // this is the CSS `opacity` on the element itself
    let elementOpacity = 1.0;
    if (vec.backdropBlur > 0 && sem.elevationLevel >= 2) {
        // Floating glass panels get slight opacity
        elementOpacity = parseFloat((0.88 + vec.surfaceOpacity * 0.12).toFixed(3));
    }
    return { mixBlendMode, backgroundBlendMode, elementOpacity, blendLabel };
}
