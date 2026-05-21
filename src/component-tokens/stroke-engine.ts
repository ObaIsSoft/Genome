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

import type { ComponentDecisionVector } from '../creator/types.js';
import type { ComponentSemantics } from '../creator/types.js';

export interface StrokeSpec {
  /** Full CSS border shorthand; null = no border */
  border: string | null;
  /** CSS outline shorthand for focus ring context (not box model) */
  focusOutline: string | null;
  /** CSS border-style value */
  borderStyle: string;
  /** px width */
  borderWidth: number;
  /** CSS border-color */
  borderColor: string;
  /** border-image for gradient strokes */
  borderImage: string | null;
}

// ── Dash pattern builder ───────────────────────────────────────────────────────

/**
 * Build a CSS border-style value.
 * For dashed patterns beyond simple 'dashed', we'd use SVG stroke-dasharray,
 * but for CSS border we stay within the valid keyword set.
 * The continuous value maps to the keyword cluster.
 */
function deriveBorderStyle(vec: ComponentDecisionVector): string {
  // dashLikelihood: analog (c9[0] positive) + non-systematic (c7 low) + chaos
  // We proxy these from available vec fields
  const analog    = vec.surfaceWarmth;            // warmth = analog proxy
  const ordered   = 1 - vec.shadowSoftness;       // low softness = polished = ordered
  const chaos     = 1 - vec.cornerSmoothing;      // smoother corners = more controlled

  const dashScore = analog * (1 - ordered) * chaos;

  if (dashScore > 0.55 && vec.strokeWidth > 1) return 'dashed';
  if (dashScore > 0.70 && vec.strokeWidth < 1.5) return 'dotted';
  if (ordered > 0.85 && vec.strokeWidth > 1.5) return 'double';
  return 'solid';
}

// ── Gradient border ────────────────────────────────────────────────────────────

function buildBorderImage(primaryHex: string, accentHex: string, angle: number): string {
  return `linear-gradient(${angle}deg, ${primaryHex}, ${accentHex}) 1`;
}

// ── Main derivation ────────────────────────────────────────────────────────────

/**
 * Derive stroke specification from genome vector and component semantics.
 */
export function deriveStroke(
  vec: ComponentDecisionVector,
  sem: ComponentSemantics,
  primaryHex: string,
  accentHex: string,
  surfaceHex: string
): StrokeSpec {
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
  let borderColor: string;
  let borderImage: string | null = null;

  if (vec.strokeUsesGradient && sem.visualWeight > 0.5) {
    // Gradient border via border-image
    borderColor = 'transparent';
    borderImage = buildBorderImage(primaryHex, accentHex, vec.gradientAngle);
  } else if (sem.visualWeight < 0.3) {
    // Ghost — primary tinted at low opacity
    borderColor = `${primaryHex}66`; // 40% opacity
  } else if (sem.elevationLevel === 0 && !sem.initiatesAction) {
    // Flat non-interactive — neutral surface border
    borderColor = `${surfaceHex}cc`;
  } else {
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
export function deriveHoverStroke(
  stroke: StrokeSpec,
  primaryHex: string
): StrokeSpec {
  if (!stroke.border) return stroke;
  return {
    ...stroke,
    borderColor: primaryHex,
    border: stroke.border.replace(stroke.borderColor, primaryHex),
  };
}
