/**
 * Typography Engine
 *
 * Per-component typographic decisions from c4_authorial_embedding continuous coordinates.
 * Handles letter-spacing, numeric rendering, text-wrap, and label formatting.
 * All values are continuous derivations — no preset slots.
 */
/**
 * Context-specific letter-spacing modifiers (em, added to base).
 * Buttons and badges need slightly more tracking for legibility at small size.
 * Headings often benefit from tight tracking. Body inherits genome base directly.
 */
const LETTER_SPACING_MODIFIER = {
    button: 0.010,
    badge: 0.040,
    label: 0.060,
    body: 0.000,
    heading: -0.010,
    caption: 0.020,
    nav: 0.025,
    input: 0.005,
    code: 0.000,
};
/**
 * Contexts that get uppercase treatment based on genome voice.
 * Only when letterSpacingBase > 0.03 (expressive, formal voice).
 */
const UPPERCASE_ELIGIBLE = new Set(['badge', 'label', 'nav', 'caption']);
/**
 * Derive per-context typography from ComponentDecisionVector.
 * All returned values are computed from continuous vec parameters.
 */
export function getComponentTypography(vec, context) {
    const modifier = LETTER_SPACING_MODIFIER[context] ?? 0;
    const rawSpacing = vec.letterSpacingBase + modifier;
    // Clamp to reasonable CSS range: -0.02em to 0.12em
    const clampedSpacing = Math.max(-0.02, Math.min(0.12, rawSpacing));
    const letterSpacing = `${clampedSpacing.toFixed(3)}em`;
    // Uppercase: only for eligible contexts when genome has wide tracking (formal/editorial voice)
    const isUppercaseContext = UPPERCASE_ELIGIBLE.has(context) && vec.letterSpacingBase > 0.03;
    const textTransform = isUppercaseContext ? 'uppercase' : null;
    // Tabular numerics for contexts that display numbers
    const fontVariantNumeric = vec.tabulaNumeric ? 'tabular-nums' : null;
    // text-wrap: balance — only headings when genome has systematic cognitive style
    const textWrap = context === 'heading' && vec.textWrapBalance ? 'balance' : null;
    // Font size scale — captions and badges shrink slightly by genome voice intensity
    // letterSpacingBase > 0.04 suggests a compact, refined voice → captions are smaller
    let fontSizeScale = 1.0;
    if (context === 'caption') {
        fontSizeScale = parseFloat((0.88 + vec.letterSpacingBase * 0.4).toFixed(3));
        fontSizeScale = Math.max(0.78, Math.min(0.95, fontSizeScale));
    }
    else if (context === 'badge') {
        fontSizeScale = parseFloat((0.82 + vec.letterSpacingBase * 0.3).toFixed(3));
        fontSizeScale = Math.max(0.75, Math.min(0.90, fontSizeScale));
    }
    // Line height — headings get tighter leading when genome is bold/sparse
    let lineHeight = null;
    if (context === 'heading') {
        // letterSpacingBase < 0 = very tight → headlines compress line-height too
        const lh = parseFloat((1.15 - vec.letterSpacingBase * 1.5).toFixed(3));
        lineHeight = `${Math.max(1.05, Math.min(1.45, lh)).toFixed(2)}`;
    }
    else if (context === 'body') {
        // Body: slightly looser for readability, warmth pulls toward more relaxed leading
        const lh = parseFloat((1.55 + vec.surfaceWarmth * 0.15).toFixed(3));
        lineHeight = `${Math.max(1.45, Math.min(1.80, lh)).toFixed(2)}`;
    }
    else if (context === 'caption') {
        lineHeight = '1.4';
    }
    return {
        letterSpacing,
        fontVariantNumeric,
        textWrap,
        textTransform,
        fontSizeScale,
        lineHeight,
    };
}
/**
 * Build the CSS font-feature-settings string from genome voice parameters.
 * Returns null if no features active (avoid outputting redundant CSS).
 */
export function getFontFeatureSettings(vec) {
    const features = [];
    if (vec.tabulaNumeric)
        features.push('"tnum"');
    // Oldstyle figures for body text in warm/analog genomes
    const isAnalogWarm = vec.surfaceWarmth > 0.55 && vec.backdropBlur === 0;
    if (isAnalogWarm)
        features.push('"onum"');
    // Discretionary ligatures for highly expressive authorial voices
    if (vec.letterSpacingBase < -0.005)
        features.push('"dlig"');
    return features.length > 0 ? features.join(', ') : null;
}
/**
 * Format a number using the genome's ch35 signature motif numberFormat convention.
 * Purely presentational — for rationale strings and CSS content values.
 */
export function formatSignatureNumber(value, separator) {
    const padded = String(value).padStart(2, '0');
    return `${separator}${padded}`;
}
