/**
 * Semantic Inference Engine
 *
 * Derives ComponentSemantics from a component's name and description.
 * No lookup table of component types — continuous scoring from text signals.
 * The semantics, combined with the genome vector, drive all CSS decisions.
 *
 * A "vehicle-listing-card" on an ecommerce site and a "story-card" on an
 * editorial site produce different semantics from the same inference pass
 * because their descriptions contain different signals.
 */
// ── Signal scoring ─────────────────────────────────────────────────────────────
/**
 * Score a text against a list of signal terms.
 * Returns 0–1 based on how many signals appear and their weight.
 *
 * Multi-word signals (phrases) are matched as substrings.
 * Single-word signals are matched at word boundaries to prevent
 * substring false positives ("round" in "background", "ring" in "string").
 */
function score(text, signals, weight = 1) {
    const words = new Set(text.split(/[\s\-_/]+/));
    const hits = signals.filter(s => {
        if (s.includes(' '))
            return text.includes(s); // phrase match
        return words.has(s); // whole-word match
    }).length;
    return Math.min(1, (hits / Math.max(signals.length * 0.3, 1)) * weight);
}
// ── Signal vocabulary ──────────────────────────────────────────────────────────
// These are not component names — they are semantic property signals.
// The presence of these terms in a description raises or lowers a semantic score.
const INTERACTIVITY_HIGH = [
    'button', 'click', 'tap', 'press', 'select', 'toggle', 'switch',
    'drag', 'drop', 'resize', 'scroll', 'swipe', 'pinch', 'input',
    'control', 'interactive', 'action', 'trigger', 'activate', 'submit',
    'choose', 'pick', 'filter', 'sort', 'configure', 'adjust', 'slider',
];
const INTERACTIVITY_LOW = [
    'display', 'read', 'view', 'show', 'static', 'text', 'label',
    'heading', 'paragraph', 'caption', 'decorative', 'illustration',
    'divider', 'separator', 'rule', 'spacer', 'background',
];
const ACTION_INITIATING = [
    'cta', 'call to action', 'submit', 'buy', 'purchase', 'checkout',
    'add to cart', 'add to bag', 'book', 'reserve', 'subscribe',
    'sign up', 'register', 'download', 'install', 'get started',
    'contact', 'apply', 'request', 'confirm', 'save', 'publish',
    'primary button', 'hero button', 'conversion',
];
const EPHEMERAL_SIGNALS = [
    'tooltip', 'popover', 'toast', 'notification', 'snackbar',
    'modal', 'dialog', 'overlay', 'sheet', 'drawer', 'dropdown',
    'menu', 'context menu', 'flyout', 'panel', 'transient',
    'temporary', 'appears', 'disappears', 'dismiss', 'close',
];
const MEDIA_SIGNALS = [
    'image', 'photo', 'picture', 'video', 'film', 'thumbnail',
    'gallery', 'cover', 'hero image', 'background image', 'poster',
    'avatar', 'portrait', 'landscape', 'media', 'canvas', 'visual',
    'illustration', 'graphic', 'artwork', 'shot', 'frame',
];
const DENSITY_HIGH = [
    'table', 'data', 'list', 'rows', 'columns', 'grid', 'spreadsheet',
    'dashboard', 'analytics', 'metrics', 'stats', 'chart', 'form',
    'fields', 'specifications', 'specs', 'details', 'information',
    'comparison', 'dense', 'compact', 'full', 'rich',
];
const DENSITY_LOW = [
    'icon', 'badge', 'tag', 'chip', 'pill', 'dot', 'indicator',
    'minimal', 'simple', 'single', 'solo', 'lone', 'small',
    'avatar only', 'icon only', 'label only',
];
const CONTAINER_SIGNALS = [
    'card', 'panel', 'section', 'container', 'wrapper', 'box',
    'block', 'tile', 'cell', 'item', 'entry', 'row', 'group',
    'cluster', 'collection', 'list item', 'grid item', 'article',
    'post', 'product', 'listing', 'result', 'unit',
];
const TEXT_PRIMARY = [
    'article', 'body', 'prose', 'paragraph', 'text', 'copy',
    'heading', 'title', 'headline', 'subheading', 'label', 'caption',
    'quote', 'pullquote', 'byline', 'author', 'editorial', 'blog',
    'description', 'content', 'reading', 'typography',
];
const ELEVATION_HIGH = [
    'modal', 'dialog', 'overlay', 'sheet', 'lightbox', 'spotlight',
    'popup', 'popover', 'floating', 'sticky', 'fixed', 'pinned',
    'above', 'on top', 'foreground',
];
const ELEVATION_MID = [
    'card', 'panel', 'raised', 'elevated', 'lifted', 'surface',
    'container', 'dropdown', 'menu',
];
const WEIGHT_HIGH = [
    'hero', 'primary', 'featured', 'main', 'focal', 'banner',
    'prominent', 'highlight', 'spotlight', 'showcase', 'lead',
    'dominant', 'large', 'full width', 'full bleed',
];
const WEIGHT_LOW = [
    'ghost', 'subtle', 'minimal', 'secondary', 'tertiary',
    'muted', 'soft', 'light', 'faint', 'outline', 'text-only',
];
const CIRCULAR_SIGNALS = [
    'avatar', 'profile picture', 'user image', 'radio', 'spinner',
    'loader', 'ring', 'circle', 'round', 'donut', 'progress ring',
    'circular', 'disc', 'orb',
];
const ENTRANCE_SIGNALS = [
    'entrance', 'appears', 'loads', 'enters', 'mounts', 'reveals',
    'animated', 'transition in', 'fade in', 'slide in', 'scale in',
    'hero', 'above fold', 'first view', 'landing',
];
const IDLE_SIGNALS = [
    'loading', 'skeleton', 'shimmer', 'pulse', 'breathing', 'pending',
    'waiting', 'processing', 'streaming', 'live', 'realtime', 'ambient',
];
const MOTION_CORE = [
    'animation', 'animated', 'motion', 'transition', 'interactive',
    'microinteraction', 'hover effect', 'parallax', 'scroll',
    'carousel', 'slider', 'reveal', 'kinetic',
];
const REPEATED_SIGNALS = [
    'list item', 'grid item', 'card in', 'row in', 'each', 'per',
    'listing', 'results', 'feed', 'stream', 'collection', 'loop',
    'repeated', 'multiple', 'stack', 'group of',
];
const NAVIGATIONAL = [
    'nav', 'navigation', 'menu item', 'tab', 'breadcrumb', 'pagination',
    'link', 'anchor', 'step', 'progress step', 'sidebar item',
    'footer link', 'header link', 'route',
];
const FEEDBACK_SIGNALS = [
    'alert', 'warning', 'error', 'success', 'info', 'status',
    'progress', 'loading', 'skeleton', 'badge', 'count', 'indicator',
    'notification', 'banner', 'announcement', 'message', 'feedback',
];
// ── Inference function ─────────────────────────────────────────────────────────
/**
 * Infer ComponentSemantics from a component's name and description.
 * All scores are continuous 0–1. No component type lookup.
 */
export function inferSemantics(spec) {
    const raw = `${spec.name} ${spec.description ?? ''}`.toLowerCase();
    // Interactivity: high signals push up, low signals pull down
    const interactivityRaw = score(raw, INTERACTIVITY_HIGH, 1.2) - score(raw, INTERACTIVITY_LOW, 0.5);
    const interactivity = Math.max(0, Math.min(1, interactivityRaw));
    // Action-initiating: binary threshold from signal strength
    const actionScore = score(raw, ACTION_INITIATING, 1.5);
    const initiatesAction = actionScore > 0.15;
    // Ephemeral
    const isEphemeral = score(raw, EPHEMERAL_SIGNALS) > 0.2;
    // Media
    const containsMedia = score(raw, MEDIA_SIGNALS) > 0.15;
    // Content density: high signals push up, low push down
    const densityRaw = score(raw, DENSITY_HIGH, 1.1) - score(raw, DENSITY_LOW, 0.7);
    const contentDensity = Math.max(0.05, Math.min(1, 0.35 + densityRaw));
    // Container
    const isContainer = score(raw, CONTAINER_SIGNALS) > 0.15;
    // Text primary
    const isTextPrimary = score(raw, TEXT_PRIMARY) > 0.2;
    // Elevation: 0=flat, 1=raised, 2=floating, 3=overlay
    const elevationHighScore = score(raw, ELEVATION_HIGH);
    const elevationMidScore = score(raw, ELEVATION_MID);
    const elevationLevel = elevationHighScore > 0.3 ? 3
        : isEphemeral ? 2
            : elevationMidScore > 0.2 ? 1
                : 0;
    // Visual weight: 0=ghost, 1=dominant
    const weightHighScore = score(raw, WEIGHT_HIGH);
    const weightLowScore = score(raw, WEIGHT_LOW);
    const visualWeight = Math.max(0, Math.min(1, 0.5 + weightHighScore - weightLowScore));
    // Circular
    const isCircular = score(raw, CIRCULAR_SIGNALS) > 0.2;
    // Entrance animation
    const hasEntrance = score(raw, ENTRANCE_SIGNALS) > 0.15 || elevationLevel >= 2;
    // Idle state
    const hasIdleState = score(raw, IDLE_SIGNALS) > 0.15;
    // Motion priority
    const motionPriority = Math.min(1, score(raw, MOTION_CORE, 1.3) + (interactivity * 0.3));
    // Repeated
    const isRepeated = score(raw, REPEATED_SIGNALS) > 0.15;
    // Navigational
    const isNavigational = score(raw, NAVIGATIONAL) > 0.2;
    // Feedback
    const isFeedback = score(raw, FEEDBACK_SIGNALS) > 0.2;
    return {
        interactivity,
        initiatesAction,
        isEphemeral,
        containsMedia,
        contentDensity,
        isContainer,
        isTextPrimary,
        elevationLevel,
        visualWeight,
        isCircular,
        hasEntrance,
        hasIdleState,
        motionPriority,
        isRepeated,
        isNavigational,
        isFeedback,
    };
}
/**
 * Merge inferred semantics with any explicit overrides provided by the caller.
 * Explicit values always win — the caller knows their component better than inference.
 */
export function resolveSemantics(spec) {
    const inferred = inferSemantics(spec);
    if (!spec.semantics)
        return inferred;
    return { ...inferred, ...spec.semantics };
}
/**
 * Derive a continuous radius modifier from semantics.
 * Replaces RADIUS_MODIFIER lookup table — no component names involved.
 */
export function semanticRadiusModifier(sem) {
    if (sem.isCircular)
        return 999; // full 50%
    let modifier = 1.0;
    // Containers with media get slightly more radius (card-like softness)
    if (sem.isContainer && sem.containsMedia)
        modifier += 0.20;
    // Ephemeral elements (tooltips, toasts) are compact — less radius
    if (sem.isEphemeral && !sem.isContainer)
        modifier -= 0.40;
    // Dense data elements stay sharp
    if (sem.contentDensity > 0.7)
        modifier -= 0.25;
    // Navigational items compress slightly
    if (sem.isNavigational)
        modifier -= 0.15;
    // Feedback elements (badges, alerts) are compact
    if (sem.isFeedback && sem.contentDensity < 0.4)
        modifier -= 0.30;
    // High visual weight elements soften slightly
    if (sem.visualWeight > 0.7)
        modifier += 0.15;
    // Action-initiating buttons get their full radius
    if (sem.initiatesAction)
        modifier = Math.max(modifier, 0.85);
    return Math.max(0.05, modifier);
}
/**
 * Derive a continuous hover lift modifier from semantics.
 * Replaces DISTANCE_SCALE lookup table.
 */
export function semanticLiftModifier(sem) {
    if (!sem.initiatesAction && sem.interactivity < 0.3)
        return 0;
    if (sem.isTextPrimary && !sem.isContainer)
        return 0;
    if (sem.contentDensity > 0.8)
        return 0; // data tables don't lift
    let modifier = sem.interactivity;
    // Containers lift more (cards, product tiles)
    if (sem.isContainer && sem.containsMedia)
        modifier *= 1.3;
    // Navigational items lift subtly
    if (sem.isNavigational)
        modifier *= 0.5;
    // Feedback elements don't lift
    if (sem.isFeedback)
        modifier *= 0.1;
    // Ephemeral elements already elevated — no lift
    if (sem.isEphemeral)
        modifier = 0;
    return Math.max(0, Math.min(2.0, modifier));
}
/**
 * Derive shadow intensity from elevation + visual weight.
 */
export function semanticShadowScale(sem, baseScale) {
    const elevationBoost = sem.elevationLevel * 0.25;
    const weightBoost = sem.visualWeight * 0.15;
    return Math.max(0, baseScale + elevationBoost + weightBoost);
}
/**
 * Derive padding from content density and rhythm.
 * Dense = compact padding; sparse/editorial = generous padding.
 */
export function semanticPaddingModifier(sem) {
    if (sem.contentDensity > 0.75)
        return 0.6; // compact
    if (sem.isTextPrimary)
        return 1.4; // editorial breathing room
    if (sem.isContainer)
        return 1.2; // cards need space
    if (sem.isFeedback)
        return 0.7; // badges/alerts are tight
    if (sem.isNavigational)
        return 0.9;
    return 1.0;
}
