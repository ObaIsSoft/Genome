/**
 * Motion Engine
 *
 * Per-component motion specification derived from continuous genome coordinates.
 * ALL values computed — no hardcoded easing keywords, no component-name lookup tables.
 *
 * Component-specific lift intensity is driven by ComponentSemantics via
 * semanticLiftModifier() — same semantic properties that drive other engines.
 */

import type { ComponentDecisionVector, ComponentSemantics } from '../creator/types.js';
import { semanticLiftModifier } from './semantic-inference.js';

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
 * Derive per-component motion spec from ComponentDecisionVector + ComponentSemantics.
 * Uses semanticLiftModifier() for continuous hover lift — no lookup table.
 */
export function getComponentMotion(
  vec: ComponentDecisionVector,
  sem: ComponentSemantics
): ComponentMotion {
  // Lift scale: continuous from semantic properties, not component name
  const liftScale = semanticLiftModifier(sem);
  const liftPx    = Math.round(vec.hoverDistance * liftScale);

  // Hover transform: lift or none
  const hoverTransform = liftPx > 0 ? `translateY(-${liftPx}px)` : 'none';

  // Hover transition — transform + box-shadow, timed slightly differently
  const tDuration  = Math.round(vec.durationBase * 0.8);
  const shDuration = Math.round(vec.durationBase * 0.9);
  const hoverTransition = liftPx > 0
    ? `transform ${tDuration}ms ${vec.easingCurve}, box-shadow ${shDuration}ms ${vec.easingCurve}`
    : `opacity ${tDuration}ms ${vec.easingCurve}, box-shadow ${shDuration}ms ${vec.easingCurve}`;

  // Active/press: return to base + scale compression
  // More interactive components compress more; decorative barely register
  const pressDepth    = 0.970 + (1 - Math.min(1, liftScale)) * 0.025;
  const pressScale    = parseFloat(pressDepth.toFixed(3));
  const activeTransform = liftPx > 0
    ? `translateY(0) scale(${pressScale})`
    : `scale(${pressScale})`;
  const activeDurationMs = Math.round(vec.durationBase * 0.45);

  // Entrance: slightly slower than hover for perceived quality
  const entranceDurationMs = vec.durationBase;

  // Idle animation from global genome setting (already derived in buildDecisionVector)
  const idleAnimation = vec.idleAnimation;

  // Entry class name derived from easing label
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
 * Build a complete CSS transition string for a component's default/resting state.
 * Applied to the base element so all properties transition smoothly.
 */
export function buildBaseTransition(vec: ComponentDecisionVector): string {
  const d = Math.round(vec.durationBase * 0.7);
  const e = vec.easingCurve;
  return `background ${d}ms ${e}, color ${d}ms ${e}, border-color ${d}ms ${e}, opacity ${d}ms ${e}`;
}
