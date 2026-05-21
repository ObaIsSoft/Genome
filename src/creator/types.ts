/**
 * L0 CREATOR GENOME - The Foundation of Generative Design
 * 
 * 16 chromosomes encoding latent space coordinates for infinite persona diversity.
 * Not categorical. Not indexed. Pure continuous values generating unique creators.
 */

/**
 * LatentVector - N-dimensional continuous space coordinate
 * Values typically in range [-1, 1] or [0, 1] depending on chromosome
 */
export type LatentVector = number[];

/**
 * DistributionCurve - Weighted distribution across a dimension
 * For temporal nostalgia: weight per decade
 * For sensory priority: weight per sense
 */
export interface DistributionCurve {
  points: { position: number; weight: number }[];
  interpolation: 'linear' | 'gaussian' | 'step';
}

/**
 * GraphTraversal - Knowledge domain exploration parameters
 */
export interface GraphTraversal {
  origin_domain: number;      // Latent coordinate for starting domain
  depth: number;              // How deep into rabbit holes (0-1)
  branching_factor: number;   // How many tangents to follow (0-1)
  connection_strength: number; // Weak vs strong associations (0-1)
}

/**
 * L0 Creator Genome - 16 Chromosomes
 * Each chromosome is a latent space coordinate, not a category index
 */
export interface CreatorGenome {
  // c0: Cultural origin in learned latent space (3D vector)
  // Generates: Specific geographic/cultural background with nuance
  c0_cultural_vector: LatentVector; // 3 dimensions

  // c1: Temporal nostalgia distribution (weighted curve across 1900-2030)
  // Generates: Which eras resonate, how strongly, in what combination
  c1_temporal_nostalgia: DistributionCurve;

  // c2: Knowledge domain exploration (graph traversal params)
  // Generates: Starting obsession + depth + unexpected connections
  c2_obsession_traversal: GraphTraversal;

  // c3: Formative era style (2D coordinate in era-space)
  // Generates: Youth culture influences, coming-of-age aesthetics
  c3_formative_era: LatentVector; // 2 dimensions

  // c4: Authorial voice embedding (4D linguistic style space)
  // Generates: How they write - technical, poetic, irreverent, academic, etc
  c4_authorial_embedding: LatentVector; // 4 dimensions

  // c5: Technical literacy spectrum (multi-dimensional skill map)
  // Generates: Capabilities + blind spots + self-taught vs formal
  c5_technical_spectrum: LatentVector; // 5 dimensions

  // c6: Aesthetic sensibility coordinates (3D taste space)
  // Generates: Visual instincts - not colors, but *preferences*
  c6_aesthetic_sensibility: LatentVector; // 3 dimensions

  // c7: Cognitive style pattern (thinking approach)
  // Generates: Systematic vs intuitive, abstract vs concrete, etc
  c7_cognitive_pattern: LatentVector; // 3 dimensions

  // c8: Social positioning vector (status/relationship to culture)
  // Generates: Insider, outsider, observer, rebel, participant, etc
  c8_social_vector: LatentVector; // 2 dimensions

  // c9: Material affinity (texture/material preference space)
  // Generates: Digital vs analog, rough vs polished, organic vs synthetic
  c9_material_affinity: LatentVector; // 3 dimensions

  // c10: Narrative instinct (storytelling pattern)
  // Generates: How they explain things - hero journey, technical, poetic, fragmented
  c10_narrative_pattern: LatentVector; // 2 dimensions

  // c11: Chaos tolerance (mutation rate for this creator)
  // Generates: How much unpredictability they introduce
  c11_chaos_tolerance: number; // 0-1 scalar

  // c12: Cross-pollination tendency (domain bridging strength)
  // Generates: Unusual combinations, productive friction
  c12_cross_pollination: number; // 0-1 scalar

  // c13: Temporal perception (sense of time)
  // Generates: Cyclical, linear, compressed, expanded, layered
  c13_temporal_sense: LatentVector; // 2 dimensions

  // c14: Sensory priority weighting (sense dominance)
  // Generates: Visual, tactile, auditory, spatial priorities
  c14_sensory_weights: DistributionCurve;

  // c15: Personality coherence (trait integration style)
  // Generates: Tightly integrated vs contradictory vs fragmented self
  c15_coherence_style: number; // 0-1 scalar

  // Metadata
  seed: string;
  dna_hash: string;
  generation_timestamp: number;
}

/**
 * Creator Persona - The decoded, human-readable form
 * Generated from CreatorGenome via LLM decoding
 */
export interface CreatorPersona {
  id: string; // SHA-256 of genome
  
  // Simulated biography
  biography: {
    origin: string;           // Geographic/cultural background
    formative_years: string;  // Youth/influences
    journey: string;          // Career/life path with pivots
    current: string;          // Present context
    contradictions: string[]; // Internal tensions that make them human
  };

  // Design instincts (derived from genome)
  instincts: {
    visual_language: string[];      // How they see
    interaction_metaphors: string[]; // How they think about UI
    aesthetic_principles: string[];  // What they believe looks good
    copy_voice: string;              // How they sound
  };

  // Unique conceptual framework
  worldview: {
    core_metaphor: string;      // How they interpret the world
    design_philosophy: string;  // Their personal design stance
    unusual_connections: string[]; // Cross-domain bridges
    blind_spots: string[];      // What they don't see
  };

  // Chaos parameters
  creative_behavior: {
    chaos_tolerance: number;
    cross_pollination: number;
    coherence_style: 'integrated' | 'contradictory' | 'fragmented';
  };

  // Raw genome for traceability
  genome: CreatorGenome;
}

/**
 * Design Intent - What the user wants
 * Passed through creator's worldview to generate brief
 */
export interface DesignIntent {
  description: string;        // "A portfolio site for a photographer"
  sector?: string;            // Photography, fintech, etc
  audience?: string;          // Who it's for
  mood_hints?: string[];      // Optional mood suggestions
  constraints?: string[];     // Technical or business constraints
}

/**
 * Creative Brief - The output of epigenetic layer
 * Generated by persona interpreting intent through their worldview
 */
export interface CreativeBrief {
  id: string;
  
  concept: {
    statement: string;           // "What if wedding albums felt like..."
    insight: string;             // The creative insight
    tension: string;             // Productive friction in the concept
  };

  metaphor_system: {
    primary: string;             // Main metaphor
    secondary: string;           // Counterpoint metaphor  
    tertiary?: string;           // Optional accent metaphor
    tension_description: string; // How they clash/productively interact
  };

  design_principles: string[];   // High-level rules
  
  component_language: {
    buttons: string;             // How buttons work in this world
    navigation: string;          // How navigation works
    forms: string;               // How forms work
    cards: string;               // How cards work
    feedback: string;            // Success/error states
    [key: string]: string;       // Extensible
  };

  sensory_design: {
    visual_approach: string;
    motion_philosophy: string;
    texture_strategy: string;
    sound_feel?: string;         // Even if no audio, the *feel* of sound
  };

  copy_system: {
    voice_description: string;
    vocabulary_tendencies: string[];
    sentence_patterns: string[];
    microcopy_examples: Record<string, string>; // "submit": "Seal the pact"
  };

  generated_by: CreatorPersona;
  generation_metadata: {
    timestamp: number;
    intent: DesignIntent;
    mutation_applied: boolean;
    cross_pollination_applied: boolean;
  };
}

/**
 * ComponentSemantics — continuous property description of what a component IS.
 * Derived from intent + page composition. Never a named category lookup.
 * These properties, combined with the genome vector, drive all CSS decisions.
 */
export interface ComponentSemantics {
  /** 0=decorative/static, 1=highly interactive (click, drag, select) */
  interactivity: number;
  /** initiates a primary action — CTA, submit, navigate, confirm */
  initiatesAction: boolean;
  /** appears and disappears — tooltip, modal, toast, dropdown */
  isEphemeral: boolean;
  /** contains image, video, canvas, or other media */
  containsMedia: boolean;
  /** 0=single icon/label, 1=dense data table or form */
  contentDensity: number;
  /** wraps or contains other components */
  isContainer: boolean;
  /** text is the primary content (article body, heading, label) */
  isTextPrimary: boolean;
  /** 0=inline/flat, 1=raised card, 2=floating panel, 3=overlay/modal */
  elevationLevel: number;
  /** 0=ghost/minimal weight, 1=primary/dominant visual weight */
  visualWeight: number;
  /** geometry is circular — avatar, radio button, spinner, progress ring */
  isCircular: boolean;
  /** animates in on mount */
  hasEntrance: boolean;
  /** can hold an idle/ambient animation state */
  hasIdleState: boolean;
  /** 0=motion irrelevant, 1=motion is core to this component's function */
  motionPriority: number;
  /** appears multiple times in a list, grid, or repeating pattern */
  isRepeated: boolean;
  /** navigational role — nav item, tab, breadcrumb, pagination */
  isNavigational: boolean;
  /** communicates system state — alert, progress, skeleton, badge */
  isFeedback: boolean;
}

/**
 * ComponentSpec — what the implementer passes in to describe a component.
 * Name and description are free-form. Semantics can be provided or inferred.
 */
export interface ComponentSpec {
  /** Free-form name. "vehicle-listing-card", "hero-banner", "author-byline" */
  name: string;
  /** Optional: human description used to infer semantics if not provided */
  description?: string;
  /** Optional: explicit semantics. If omitted, inferred from name + description */
  semantics?: Partial<ComponentSemantics>;
}

/**
 * ComponentDecisionVector — the full design expression of a genome.
 * Built once from creator + design genome. All sub-engines read from this.
 * All fields are continuous numeric values — no named presets drive CSS.
 * Labels (materialLabel, easingLabel, blendLabel, gradientLabel) are documentation only.
 */
export interface ComponentDecisionVector {
  // ── Surface / backdrop ─────────────────────────────────────────────────────
  backdropBlur: number;         // 0 or 12–40px from c9[0]
  backdropSaturate: number;     // 20–220%
  backdropBrightness: number;   // 0.7–1.15 for backdrop-filter
  backdropContrast: number;     // 0.85–1.15 for backdrop-filter
  surfaceOpacity: number;       // 0.04–1.0
  surfaceGrain: number;         // 0–0.5
  specularHighlight: boolean;
  surfaceWarmth: number;        // 0–1

  // ── Fill system ────────────────────────────────────────────────────────────
  /** Does this genome use gradient fills on surfaces? */
  usesGradient: boolean;
  /** 'linear' | 'radial' | 'conic' — derived from c9 + c11 */
  gradientType: string;
  /** 0–360 degrees */
  gradientAngle: number;
  /** 2–5 stops */
  gradientStopCount: number;
  /** 0–1: how dramatic the gradient transitions are */
  gradientContrast: number;
  /** Does the grain layer use a blend mode beyond normal? */
  noiseBlendMode: string;
  /** Display headings get gradient text fill — from c4 expressivity + c6 */
  gradientText: boolean;

  // ── Blend modes ────────────────────────────────────────────────────────────
  /** CSS mix-blend-mode for the component element */
  mixBlendMode: string;
  /** 0–1 opacity as a design tool (not just disabled state) */
  elementOpacity: number;
  /** CSS background-blend-mode when fill layers are stacked */
  backgroundBlendMode: string;

  // ── Shape ──────────────────────────────────────────────────────────────────
  radiusBase: number;
  radiusVariance: number;
  /** 0=standard CSS, 1=full squircle smoothing */
  cornerSmoothing: number;
  /** Whether corners vary individually (organic) */
  asymmetricCorners: boolean;

  // ── Outer shadow ───────────────────────────────────────────────────────────
  shadowLayers: 1 | 2 | 3 | 4;
  shadowColorTinted: boolean;
  shadowSoftness: number;
  shadowScale: number;

  // ── Inner shadow ───────────────────────────────────────────────────────────
  /** 0–2 inner shadow layers; 0=none */
  innerShadowCount: number;
  /** blur softness for inner shadow; 0=crisp inset, 1=diffuse */
  innerShadowSoftness: number;
  /** 0–0.25 opacity of inner shadow */
  innerShadowOpacity: number;

  // ── Text shadow ────────────────────────────────────────────────────────────
  useTextShadow: boolean;
  /** px blur radius for text shadow */
  textShadowBlur: number;
  /** 0–0.4 opacity */
  textShadowOpacity: number;

  // ── Element filters ────────────────────────────────────────────────────────
  /** True when genome applies a non-trivial filter to elements */
  useElementFilter: boolean;
  filterBrightness: number;     // 0.7–1.3
  filterContrast: number;       // 0.8–1.4
  filterSaturate: number;       // 0–2
  filterHueRotate: number;      // 0–30 degrees (subtle shift)
  filterGrayscale: number;      // 0–1
  filterSepia: number;          // 0–0.4

  // ── Image / media treatment ────────────────────────────────────────────────
  imageFilterBrightness: number;  // applied to img/video elements
  imageFilterContrast: number;
  imageFilterSaturate: number;
  imageFilterHueRotate: number;
  /** Documentation only — describes the visual treatment */
  imageTreatmentLabel: string;

  // ── Stroke / outline ───────────────────────────────────────────────────────
  /** 0=no stroke, 0.5–4px continuous */
  strokeWidth: number;
  /** 'solid' | 'dashed' | 'dotted' | 'double' */
  strokeStyle: string;
  /** 'inside' | 'center' | 'outside' */
  strokePosition: string;
  /** True when stroke uses a gradient rather than flat color */
  strokeUsesGradient: boolean;

  // ── Motion ─────────────────────────────────────────────────────────────────
  easingCurve: string;
  durationBase: number;
  hoverDistance: number;
  hoverOpacity: number;
  idleAnimation: string | null;

  // ── Typography ─────────────────────────────────────────────────────────────
  letterSpacingBase: number;
  tabulaNumeric: boolean;
  textWrapBalance: boolean;
  /** px width for -webkit-text-stroke on display headings; 0=none */
  textStrokeWidth: number;
  /** CSS font-variation-settings string; null if not variable font */
  fontVariationSettings: string | null;

  // ── Spacing ────────────────────────────────────────────────────────────────
  /** Multiplier on ch2_rhythm.verticalRhythm base unit for padding */
  paddingScale: number;
  /** Multiplier on base unit for gap between internal elements */
  gapScale: number;
  /** px — the base grid unit from ch2 */
  rhythmUnit: number;

  // ── Motif ──────────────────────────────────────────────────────────────────
  separator: string;
  hoverIndicator: string;

  // ── Meta (documentation only) ──────────────────────────────────────────────
  materialLabel: string;
  easingLabel: string;
  blendLabel: string;
  gradientLabel: string;
}

/**
 * Validation: Check if genome is valid
 */
export function validateCreatorGenome(genome: CreatorGenome): string[] {
  const errors: string[] = [];

  if (!genome.c0_cultural_vector || genome.c0_cultural_vector.length !== 3) {
    errors.push('c0_cultural_vector must be 3D vector');
  }

  if (!genome.c1_temporal_nostalgia || !genome.c1_temporal_nostalgia.points) {
    errors.push('c1_temporal_nostalgia must have distribution curve');
  }

  if (genome.c11_chaos_tolerance < 0 || genome.c11_chaos_tolerance > 1) {
    errors.push('c11_chaos_tolerance must be 0-1');
  }

  if (genome.c12_cross_pollination < 0 || genome.c12_cross_pollination > 1) {
    errors.push('c12_cross_pollination must be 0-1');
  }

  return errors;
}
