/**
 * Stroke Engine
 *
 * Derives CSS outline / border from continuous genome coordinates.
 * 'border' and 'outline' in CSS have different box-model implications —
 * this engine produces both where appropriate.
 *
 * Derived from:
 *   c9[0] digital(-1) ↔ analog(+1)  → no stroke vs defined stroke
 *   c9[1] polished(+1) ↔ rough(-1)  → hairline vs bold
 *   c7[0] systematic ↔ intuitive    → solid vs organic dash
 *   c11   chaos_tolerance           → dashed/irregular patterns
 *   semantics                       → when and where stroke appears
 */
// ── Dash pattern builder ───────────────────────────────────────────────────────
/**
 * Build a CSS border-style value.
 * For dashed patterns beyond simple 'dashed', we'd use SVG stroke-dasharray,
 * but for CSS border we stay within the valid keyword set.
 * The continuous value maps to the keyword cluster.
 */
function deriveBorderStyle(vec) {
    // dashLikelihood: analog (c9[0] positive) + non-systematic (c7 low) + chaos
    // We proxy these from available vec fields
    const analog = vec.surfaceWarmth; // warmth = analog proxy
    const ordered = 1 - vec.shadowSoftness; // low softness = polished = ordered
    const chaos = 1 - vec.cornerSmoothing; // smoother corners = more controlled
    const dashScore = analog * (1 - ordered) * chaos;
    if (dashScore > 0.55 && vec.strokeWidth > 1)
        return 'dashed';
    if (dashScore > 0.70 && vec.strokeWidth < 1.5)
        return 'dotted';
    if (ordered > 0.85 && vec.strokeWidth > 1.5)
        return 'double';
    return 'solid';
}
// ── Gradient border ────────────────────────────────────────────────────────────
function buildBorderImage(primaryHex, accentHex, angle) {
    return `linear-gradient(${angle}deg, ${primaryHex}, ${accentHex}) 1`;
}
// ── Main derivation ────────────────────────────────────────────────────────────
/**
 * Derive stroke specification from genome vector and component semantics.
 */
export function deriveStroke(vec, sem, primaryHex, accentHex, surfaceHex) {
    const width = vec.strokeWidth;
    // No stroke for:
    // - Components with no stroke in this genome (width=0)
    // - Feedback chips (badge, status) that rely on background color
    // - Circular components (handled by shape, not stroke)
    if (width < 0.1) {
        return {
            border: null,
            focusOutline: null,
            borderStyle: 'none',
            borderWidth: 0,
            borderColor: 'transparent',
            borderImage: null,
        };
    }
    const style = deriveBorderStyle(vec);
    const widthRounded = parseFloat(width.toFixed(1));
    // Border color derivation:
    // - Ghost/minimal components → primary color at low opacity
    // - Raised containers → subtle surface-adjacent border
    // - Specular surfaces → white highlight border (already in material-engine)
    let borderColor;
    let borderImage = null;
    if (vec.strokeUsesGradient && sem.visualWeight > 0.5) {
        // Gradient border via border-image
        borderColor = 'transparent';
        borderImage = buildBorderImage(primaryHex, accentHex, vec.gradientAngle);
    }
    else if (sem.visualWeight < 0.3) {
        // Ghost — primary tinted at low opacity
        borderColor = `${primaryHex}66`; // 40% opacity
    }
    else if (sem.elevationLevel === 0 && !sem.initiatesAction) {
        // Flat non-interactive — neutral surface border
        borderColor = `${surfaceHex}cc`;
    }
    else {
        // Standard interactive border
        borderColor = `${primaryHex}80`; // 50% opacity
    }
    // Position: inside by default (doesn't affect layout dimensions)
    // For focus outline, always 'outside' to not interfere
    const positionInset = vec.strokePosition === 'inside' ? 'inset' : '';
    const border = `${positionInset ? 'inset ' : ''}${widthRounded}px ${style} ${borderColor}`.trim();
    // Focus outline: always solid, always uses primary color at full opacity
    const focusWidth = Math.max(2, Math.round(widthRounded + 1));
    const focusOutline = `${focusWidth}px solid ${primaryHex}`;
    return {
        border,
        focusOutline,
        borderStyle: style,
        borderWidth: widthRounded,
        borderColor,
        borderImage,
    };
}
/**
 * Stroke spec for hover state — border intensifies slightly.
 */
export function deriveHoverStroke(stroke, primaryHex) {
    if (!stroke.border)
        return stroke;
    return {
        ...stroke,
        borderColor: primaryHex,
        border: stroke.border.replace(stroke.borderColor, primaryHex),
    };
}
