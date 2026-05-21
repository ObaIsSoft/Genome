/**
 * Filter Engine
 *
 * Derives CSS filter() values for elements and image treatment.
 * Separate concerns:
 *   - Element filter: applied to component itself (rare, intentional)
 *   - Image filter: applied to img/video/canvas inside a component
 *
 * Derived from:
 *   c9[0] digital(-1) ↔ analog(+1)   → contrast/desaturation treatment
 *   c9[2] synthetic(-1) ↔ natural(+1) → warmth, sepia, organic feel
 *   sector context (via vec.imageTreatmentLabel)
 *   ContentTraits (via vec.filterContrast, vec.filterSaturate etc.)
 */

import type { ComponentDecisionVector } from '../creator/types.js';
import type { ComponentSemantics } from '../creator/types.js';

export interface FilterSpec {
  /** CSS filter string for the component element; null if identity */
  elementFilter: string | null;
  /** CSS filter string for img/video/canvas children */
  imageFilter: string | null;
  /** Full backdrop-filter string (blur + brightness + saturate + contrast) */
  backdropFilter: string | null;
  /** Documentation */
  imageTreatmentLabel: string;
}

// ── Filter string builder ──────────────────────────────────────────────────────

function buildFilterString(params: {
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  grayscale: number;
  sepia: number;
  blur?: number;
}): string | null {
  const parts: string[] = [];

  if (Math.abs(params.brightness - 1) > 0.01)
    parts.push(`brightness(${params.brightness.toFixed(3)})`);

  if (Math.abs(params.contrast - 1) > 0.01)
    parts.push(`contrast(${params.contrast.toFixed(3)})`);

  if (Math.abs(params.saturate - 1) > 0.02)
    parts.push(`saturate(${params.saturate.toFixed(3)})`);

  if (params.hueRotate > 0.5)
    parts.push(`hue-rotate(${Math.round(params.hueRotate)}deg)`);

  if (params.grayscale > 0.01)
    parts.push(`grayscale(${params.grayscale.toFixed(3)})`);

  if (params.sepia > 0.01)
    parts.push(`sepia(${params.sepia.toFixed(3)})`);

  if (params.blur && params.blur > 0.1)
    parts.push(`blur(${params.blur.toFixed(1)}px)`);

  return parts.length > 0 ? parts.join(' ') : null;
}

// ── Main derivation ────────────────────────────────────────────────────────────

/**
 * Derive element + image filter CSS from the decision vector.
 *
 * Element filters are reserved for intentional design statements.
 * Image filters shape the visual atmosphere of media-containing components.
 */
export function deriveFilters(
  vec: ComponentDecisionVector,
  sem: ComponentSemantics
): FilterSpec {

  // ── Backdrop filter ─────────────────────────────────────────────────────────
  let backdropFilter: string | null = null;
  if (vec.backdropBlur > 0) {
    const parts: string[] = [`blur(${vec.backdropBlur}px)`];
    if (vec.backdropSaturate !== 100)
      parts.push(`saturate(${vec.backdropSaturate}%)`);
    if (Math.abs(vec.backdropBrightness - 1) > 0.01)
      parts.push(`brightness(${vec.backdropBrightness.toFixed(3)})`);
    if (Math.abs(vec.backdropContrast - 1) > 0.01)
      parts.push(`contrast(${vec.backdropContrast.toFixed(3)})`);
    backdropFilter = parts.join(' ');
  }

  // ── Element filter ──────────────────────────────────────────────────────────
  // Only applied when genome actively uses element filters (rare — intentional)
  // Never applied to interactive, feedback, or navigational components.
  let elementFilter: string | null = null;
  if (vec.useElementFilter && !sem.initiatesAction && !sem.isFeedback && !sem.isNavigational) {
    elementFilter = buildFilterString({
      brightness: vec.filterBrightness,
      contrast:   vec.filterContrast,
      saturate:   vec.filterSaturate,
      hueRotate:  vec.filterHueRotate,
      grayscale:  vec.filterGrayscale,
      sepia:      vec.filterSepia,
    });
  }

  // ── Image / media filter ────────────────────────────────────────────────────
  // Applied to img/video elements. Shapes the visual atmosphere of media.
  // Even genomes that don't use element filters may have strong image treatment.
  let imageFilter: string | null = null;
  if (sem.containsMedia) {
    imageFilter = buildFilterString({
      brightness: vec.imageFilterBrightness,
      contrast:   vec.imageFilterContrast,
      saturate:   vec.imageFilterSaturate,
      hueRotate:  vec.imageFilterHueRotate,
      grayscale:  0,  // grayscale on images is handled separately via sepia
      sepia:      0,
    });
  }

  return {
    elementFilter,
    imageFilter,
    backdropFilter,
    imageTreatmentLabel: vec.imageTreatmentLabel,
  };
}

/**
 * Build a complete CSS filter string for an image element
 * at a specific state (default, hover, active).
 * Hover typically intensifies contrast and reduces brightness slightly.
 */
export function imageFilterAtState(
  vec: ComponentDecisionVector,
  state: 'default' | 'hover' | 'active'
): string | null {
  if (Math.abs(vec.imageFilterBrightness - 1) < 0.01 &&
      Math.abs(vec.imageFilterContrast   - 1) < 0.01 &&
      Math.abs(vec.imageFilterSaturate   - 1) < 0.02) {
    return null; // identity — no filter needed
  }

  let bri = vec.imageFilterBrightness;
  let con = vec.imageFilterContrast;
  let sat = vec.imageFilterSaturate;
  const hue = vec.imageFilterHueRotate;

  if (state === 'hover') {
    // Hover: slightly brighter/more saturated — reveals the image
    bri = Math.min(1.15, bri + 0.04);
    sat = Math.min(1.4,  sat + 0.08);
    con = Math.max(0.9,  con - 0.02);
  } else if (state === 'active') {
    // Active/press: slight darken
    bri = Math.max(0.7, bri - 0.05);
  }

  return buildFilterString({ brightness: bri, contrast: con, saturate: sat, hueRotate: hue, grayscale: 0, sepia: 0 });
}
