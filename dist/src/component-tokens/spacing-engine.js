/**
 * Spacing Engine
 *
 * Derives component-internal padding and gap from the genome's rhythm system
 * and component semantics. Spacing is not a fixed scale lookup — it's derived
 * from the genome's base rhythm unit, modulated by semantic density and role.
 *
 * ch2_rhythm.verticalRhythm → base grid unit (4 | 8 | 12 px)
 * vec.paddingScale          → global multiplier from genome expressivity
 * vec.gapScale              → global gap multiplier
 * semantics                 → per-component density modulation
 *
 * The result is a component-specific 4-value padding and a gap value,
 * expressed as exact px values derived from continuous math.
 */
// ── Padding derivation ─────────────────────────────────────────────────────────
/**
 * Derive padding for a component from its semantics and the global rhythm.
 *
 * The rhythm unit is the base grid (4, 8, or 12px). Padding is always
 * a multiple of this unit — continuous math on the multipliers.
 */
export function deriveSpacing(vec, sem) {
    const unit = vec.rhythmUnit; // 4, 8, or 12
    // ── Vertical (block axis) padding ────────────────────────────────────────
    // Dense components = tight vertical; editorial/text = generous vertical
    const verticalMultiplier = (() => {
        if (sem.contentDensity > 0.75)
            return vec.paddingScale * 0.5;
        if (sem.isTextPrimary)
            return vec.paddingScale * 1.6;
        if (sem.isContainer)
            return vec.paddingScale * 1.2;
        if (sem.isFeedback)
            return vec.paddingScale * 0.6;
        if (sem.isNavigational)
            return vec.paddingScale * 0.8;
        if (sem.isEphemeral)
            return vec.paddingScale * 0.7;
        return vec.paddingScale;
    })();
    // ── Horizontal (inline axis) padding ─────────────────────────────────────
    // Action-initiating elements (buttons, CTAs) need generous horizontal padding
    // for comfortable click targets. Text-primary elements match vertical.
    const horizontalMultiplier = (() => {
        if (sem.initiatesAction)
            return vec.paddingScale * 2.0;
        if (sem.isNavigational)
            return vec.paddingScale * 1.2;
        if (sem.contentDensity > 0.75)
            return vec.paddingScale * 0.6;
        if (sem.isTextPrimary)
            return vec.paddingScale * 1.4;
        if (sem.isContainer)
            return vec.paddingScale * 1.3;
        if (sem.isFeedback)
            return vec.paddingScale * 0.9;
        return vec.paddingScale * 1.2;
    })();
    // Snap raw px to the nearest multiple of unit
    const snapToGrid = (rawPx) => Math.max(unit, Math.round(rawPx / unit) * unit);
    const vPad = snapToGrid(verticalMultiplier * unit);
    const hPad = snapToGrid(horizontalMultiplier * unit);
    // ── Asymmetric padding ────────────────────────────────────────────────────
    // Asymmetric genomes (ch7 edge asymmetric) can have non-uniform padding
    // For simplicity, slight left/right asymmetry from the genome's variance
    const paddingLeft = sem.isNavigational
        ? Math.round(hPad * (1 + vec.radiusVariance * 0.2))
        : hPad;
    const paddingRight = hPad;
    const paddingTop = vPad;
    const paddingBottom = sem.isTextPrimary
        ? Math.round(vPad * (1 + vec.radiusVariance * 0.15))
        : vPad;
    // Shorthand: if all sides equal → single value; top/bottom equal + left/right equal → two values
    let padding;
    if (paddingTop === paddingBottom && paddingLeft === paddingRight && paddingTop === paddingLeft) {
        padding = `${paddingTop}px`;
    }
    else if (paddingTop === paddingBottom && paddingLeft === paddingRight) {
        padding = `${paddingTop}px ${paddingLeft}px`;
    }
    else {
        padding = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;
    }
    // ── Gap ───────────────────────────────────────────────────────────────────
    // Internal gap between child elements: derives from gapScale + density
    const gapMultiplier = sem.contentDensity > 0.7
        ? vec.gapScale * 0.5
        : sem.isContainer ? vec.gapScale * 1.0
            : vec.gapScale * 0.75;
    const gapPx = snapToGrid(gapMultiplier * unit);
    const gap = `${gapPx}px`;
    return {
        padding,
        gap,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        gapPx,
    };
}
