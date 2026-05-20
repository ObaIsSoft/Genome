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
 * ComponentDecisionVector — intermediate representation between genome chromosomes
 * and per-component CSS token decisions.
 *
 * All fields are continuous numeric values derived from creator latent coordinates
 * + L1 chromosome values. No named presets — the values drive CSS directly.
 * Labels (materialLabel, easingLabel) are documentation only.
 */
export interface ComponentDecisionVector {
  // ── Surface quality (from c9_material_affinity 3D vector) ──────────────────
  /** px — 0 means no backdrop blur; 12–40 when c9[0] is strongly negative */
  backdropBlur: number;
  /** % — saturate() in backdrop-filter; 120–220 */
  backdropSaturate: number;
  /** 0.04–1.0 — surface bg opacity; lower = more translucent */
  surfaceOpacity: number;
  /** 0–0.5 — grain/noise overlay intensity from ch11_texture.noiseLevel */
  surfaceGrain: number;
  /** inset top border glow — true when c9[1] (polished) > 0.6 */
  specularHighlight: boolean;
  /** 0–1 — color temperature bias; 0=cool, 1=warm; from c9[2] */
  surfaceWarmth: number;

  // ── Shape (from c6_aesthetic_sensibility + ch7_edge) ───────────────────────
  /** px — ch7_edge.componentRadius (already genome-derived) */
  radiusBase: number;
  /** ±factor — how much components deviate from radiusBase; from c6[1] */
  radiusVariance: number;

  // ── Shadow (from c14_sensory_weights.tactile + ch10_hierarchy.shadowScale) ─
  /** 1–4 stacked box-shadow layers */
  shadowLayers: 1 | 2 | 3 | 4;
  /** primary-color tinted shadow when c14.visual > 0.6 */
  shadowColorTinted: boolean;
  /** blur multiplier; 0=polished/sharp, 1=rough/diffuse; from c9[1] inverted */
  shadowSoftness: number;
  /** raw shadowScale from ch10_hierarchy */
  shadowScale: number;

  // ── Motion (from c11 + c14.kinesthetic + ch8_motion) ──────────────────────
  /** computed cubic-bezier string — never a keyword like "ease-out" */
  easingCurve: string;
  /** ms base — ch8_motion.durationScale × 200 */
  durationBase: number;
  /** px — translateY on hover; c14.kinesthetic × 16 */
  hoverDistance: number;
  /** 0.55–0.85 — opacity target for opacity-style hovers */
  hoverOpacity: number;
  /** null | CSS animation name — idle animation for expressive genomes */
  idleAnimation: string | null;

  // ── Typography (from c4_authorial_embedding) ────────────────────────────────
  /** em — c4[0] mapped to [-0.02, 0.08] */
  letterSpacingBase: number;
  /** font-variant-numeric: tabular-nums — from c4[3] > 0.5 */
  tabulaNumeric: boolean;
  /** text-wrap: balance for headings — from c7_cognitive_pattern[0] > 0.5 */
  textWrapBalance: boolean;

  // ── Motif (from ch35_signature_motif) ───────────────────────────────────────
  separator: string;
  hoverIndicator: string;

  // ── Meta (documentation only — never used as CSS switch) ─────────────────
  materialLabel: string;
  easingLabel: string;
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
