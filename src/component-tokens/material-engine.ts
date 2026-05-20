/**
 * Material Engine
 *
 * Derives surface CSS from the continuous c9_material_affinity 3D vector.
 * No archetype lookup table — every value is a continuous derivation.
 * The materialLabel in ComponentDecisionVector is documentation only.
 *
 * c9[0]: digital(-1) ↔ analog(+1)  → transparency / backdrop-filter usage
 * c9[1]: polished(+1) ↔ rough(-1)  → shadow softness, border crispness
 * c9[2]: synthetic(-1) ↔ natural(+1) → warmth, organic shapes
 */

import type { ComponentDecisionVector } from '../creator/types.js';
import { buildShadow } from './shadow-engine.js';

export interface SurfaceCSS {
  background: string;
  backdropFilter: string;
  border: string | 'none';
  boxShadow: string;
  /** Additional class hint for grain overlay (handled by CSS @keyframes) */
  grainClass: string | null;
}

/**
 * Derive hex → rgb triple (duplicate avoided by keeping inline for this module)
 */
function hexToRgb(hex: string): string {
  const c = hex.replace('#', '');
  if (c.length !== 6) return '0,0,0';
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`;
}

/**
 * Compute the surface CSS for a given base color + ComponentDecisionVector.
 *
 * baseColor: the nominal background (ch6 surface, or primary for tinted cards)
 * primaryHex: used for tinted shadows
 * scale: 1.0 = default, 1.5 = hover
 */
export function computeSurface(
  vec: ComponentDecisionVector,
  baseColor: string,
  primaryHex: string,
  scale: number = 1.0
): SurfaceCSS {
  const rgb = hexToRgb(baseColor);

  // ── Background ────────────────────────────────────────────────────────────
  const background = vec.backdropBlur > 0
    ? `rgba(${rgb}, ${vec.surfaceOpacity.toFixed(3)})`
    : baseColor;

  // ── Backdrop filter ───────────────────────────────────────────────────────
  const backdropFilter = vec.backdropBlur > 0
    ? `blur(${vec.backdropBlur}px) saturate(${vec.backdropSaturate}%)`
    : 'none';

  // ── Border ────────────────────────────────────────────────────────────────
  // Specular surfaces get a subtle light-edge highlight (glass, metal)
  const border: string = vec.specularHighlight
    ? `1px solid rgba(255,255,255,${(0.08 + vec.surfaceOpacity * 0.12).toFixed(3)})`
    : vec.surfaceGrain > 0.25
      // Textured surfaces (paper, fabric) get a soft warm border
      ? `1px solid rgba(${rgb}, ${(0.08 + vec.surfaceGrain * 0.10).toFixed(3)})`
      : 'none';

  // ── Shadow ────────────────────────────────────────────────────────────────
  const boxShadow = buildShadow(vec, primaryHex, scale);

  // ── Grain class ──────────────────────────────────────────────────────────
  const grainClass = vec.surfaceGrain > 0.12 ? 'genome-grain' : null;

  return { background, backdropFilter, border, boxShadow, grainClass };
}

/**
 * Compute hover surface — slightly more opaque / stronger shadow.
 */
export function computeHoverSurface(
  vec: ComponentDecisionVector,
  baseColor: string,
  primaryHex: string
): SurfaceCSS {
  const hoverVec: ComponentDecisionVector = {
    ...vec,
    // On hover: slightly increase opacity if translucent
    surfaceOpacity: Math.min(1, vec.surfaceOpacity + 0.06),
  };
  return computeSurface(hoverVec, baseColor, primaryHex, 1.6);
}

/**
 * Determine the human-readable material label from c9 continuous coordinates.
 * Used ONLY for rationale documentation — never drives CSS logic.
 */
export function deriveMaterialLabel(c9: [number, number, number], c6_2: number): string {
  const [digital_analog, polished_rough, synthetic_natural] = c9;

  if (digital_analog < -0.45 && polished_rough > 0.30) return 'glass';
  if (digital_analog < -0.30 && polished_rough > 0.65) return 'metal';
  if (synthetic_natural > 0.40 && c6_2 > 0.40)         return 'fabric';
  if (c6_2 > 0.45 && synthetic_natural > 0.20)          return 'paper';
  if (digital_analog < -0.35 && polished_rough < -0.30) return 'mineral';
  if (digital_analog > 0.45 && synthetic_natural < -0.20) return 'plastic';
  if (digital_analog < -0.55 && polished_rough > 0.10)  return 'ether';
  return 'standard';
}
