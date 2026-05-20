/**
 * Motion Engine
 *
 * Per-component motion specification derived from continuous genome coordinates.
 * Follows the same pattern as src/genome/animation-engine.ts:
 * ALL values computed from chromosome floats — no hardcoded easing keywords.
 */

import type { ComponentDecisionVector } from '../creator/types.js';

export interface ComponentMotion {
  /** CSS transform on hover */
  hoverTransform: string;
  /** Full transition string for hover state */
  hoverTransition: string;
  /** CSS transform on active/press */
  activeTransform: string;
  /** Transition duration ms for active state (fast snap back) */
  activeDurationMs: number;
  /** Entry animation duration ms */
  entranceDurationMs: number;
  /** The cubic-bezier easing string for this component */
  easingCurve: string;
  /** CSS animation name for idle effect, or null */
  idleAnimation: string | null;
  /** Entry animation CSS class name */
  entranceClass: string;
}

/**
 * Per-component distance scaling so cards lift more than buttons, badges don't lift.
 */
const DISTANCE_SCALE: Record<string, number> = {
  button:   1.0,
  card:     1.3,
  nav:      0.6,
  input:    0.0,
  select:   0.0,
  textarea: 0.0,
  badge:    0.0,
  chip:     0.3,
  modal:    0.0,
  tooltip:  0.0,
  avatar:   0.4,
  checkbox: 0.0,
  radio:    0.0,
  toggle:   0.0,
  table:    0.0,
  progress: 0.0,
  skeleton: 0.0,
  spinner:  0.0,
};

/**
 * Derive per-component motion spec from ComponentDecisionVector.
 */
export function getComponentMotion(
  vec: ComponentDecisionVector,
  component: string
): ComponentMotion {
  const scale = DISTANCE_SCALE[component] ?? 0.8;
  const liftPx = Math.round(vec.hoverDistance * scale);

  // Hover transform: lift or none
  const hoverTransform = liftPx > 0 ? `translateY(-${liftPx}px)` : 'none';

  // Hover transition — transform + box-shadow, timed slightly differently
  const tDuration   = Math.round(vec.durationBase * 0.8);
  const shDuration  = Math.round(vec.durationBase * 0.9);
  const hoverTransition = liftPx > 0
    ? `transform ${tDuration}ms ${vec.easingCurve}, box-shadow ${shDuration}ms ${vec.easingCurve}`
    : `opacity ${tDuration}ms ${vec.easingCurve}, box-shadow ${shDuration}ms ${vec.easingCurve}`;

  // Active/press: return to base, slight scale compression
  const pressScale    = parseFloat((0.970 + (1 - vec.hoverDistance / 16) * 0.025).toFixed(3));
  const activeTransform = liftPx > 0
    ? `translateY(0) scale(${pressScale})`
    : `scale(${pressScale})`;
  const activeDurationMs = Math.round(vec.durationBase * 0.45);

  // Entrance: slightly slower than hover
  const entranceDurationMs = vec.durationBase;

  // Idle animation: only for expressive genomes (high idleAnimation != null)
  const idleAnimation = vec.idleAnimation;

  // Entrance class name — derived from easing label
  const entranceClass = `genome-enter-${vec.easingLabel.replace(/[^a-z0-9]/g, '-')}`;

  return {
    hoverTransform,
    hoverTransition,
    activeTransform,
    activeDurationMs,
    entranceDurationMs,
    easingCurve: vec.easingCurve,
    idleAnimation,
    entranceClass,
  };
}

/**
 * Build a complete CSS transition string for a component's default state.
 * Used on the base element so all properties transition smoothly.
 */
export function buildBaseTransition(vec: ComponentDecisionVector): string {
  const d = Math.round(vec.durationBase * 0.7);
  const e = vec.easingCurve;
  return `background ${d}ms ${e}, color ${d}ms ${e}, border-color ${d}ms ${e}, opacity ${d}ms ${e}`;
}
