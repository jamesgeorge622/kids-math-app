import { ConceptType, Visual } from '../types/question';
import { conceptVisualRules, VisualKind } from './visualRules';

export function validateVisualForConcept(concept: ConceptType, visual?: Visual): { ok: boolean; errors: string[] } {
    const rules = conceptVisualRules[concept];
    if (!rules) {
        // Unknown concept, default safe (or error if strict)
        return { ok: true, errors: [] };
    }

    if (rules.required && !visual) {
        return { ok: false, errors: [`Visual required for ${concept} but missing`] };
    }

    if (visual) {
        if (!rules.allowed.includes(visual.kind)) {
            return { ok: false, errors: [`Visual kind '${visual.kind}' not allowed for ${concept}. Allowed: ${rules.allowed.join(', ')}`] };
        }

        // Basic Shape Validation (Internal consistency)
        if (visual.kind === 'emojiRow' && (!visual.items || visual.items.length === 0)) return { ok: false, errors: ['emojiRow empty'] };
        if (visual.kind === 'twoGroups' && (!visual.left || !visual.right)) return { ok: false, errors: ['twoGroups missing sides'] };
        if (visual.kind === 'coinRow' && visual.count <= 0) return { ok: false, errors: ['coinRow invalid count'] };
        // Add more deep shape checks as needed
    }

    return { ok: true, errors: [] };
}

export function normalizeVisualForConcept(params: { concept: ConceptType; age: number; visual?: Visual }): { visual?: Visual; usedFallback: boolean; reason?: string } {
    const { concept, age, visual } = params;
    const rules = conceptVisualRules[concept];

    if (!rules) return { visual, usedFallback: false };

    // 1. Missing Visual
    if (!visual) {
        if (!rules.required) return { visual: undefined, usedFallback: false };

        // Determine specific fallback kind based on age for Core Math
        let fallbackKind = rules.fallback;
        if (concept === 'addition' || concept === 'subtraction') {
            if (age <= 7) fallbackKind = 'tenFrame';
            else fallbackKind = 'numberLine';
        }

        const fallback = createFallbackVisual(concept, fallbackKind, age);
        return { visual: fallback, usedFallback: true, reason: 'Missing required visual' };
    }

    // 2. Invalid Visual Kind
    if (!rules.allowed.includes(visual.kind)) {
        // Same logic for invalid kind fallbacks
        let fallbackKind = rules.fallback;
        if (concept === 'addition' || concept === 'subtraction') {
            if (age <= 7) fallbackKind = 'tenFrame';
            else fallbackKind = 'numberLine';
        }

        const fallback = createFallbackVisual(concept, fallbackKind, age);
        return { visual: fallback, usedFallback: true, reason: `Invalid visual kind: ${visual.kind}` };
    }

    // 3. Age Preference Overrides (Optional - can be done here or in generator)
    // For now, if it's allowed, we respect the generator's choice. 
    // We only force fallback if INVALID.

    return { visual, usedFallback: false };
}

function createFallbackVisual(_concept: ConceptType, kind?: VisualKind, _age?: number): Visual | undefined {
    if (!kind) return undefined;

    // Best-effort synthesis of a dummy visual to prevent crash, 
    // though real data should come from generator.
    switch (kind) {
        case 'emojiRow':
            return { kind: 'emojiRow', items: ['❓', '❓', '❓'] };
        case 'twoGroups':
            return { kind: 'twoGroups', left: ['❓'], right: ['❓'] };
        case 'singleTarget':
            return { kind: 'singleTarget', value: 'square' }; // Safe default
        case 'coinRow':
            return { kind: 'coinRow', coin: 'penny', count: 1 };
        case 'tenFrame':
            return { kind: 'tenFrame', filled: 5 };
        case 'numberLine':
            return { kind: 'numberLine', min: 0, max: 10, start: 0 };
        case 'clockFace':
            return { kind: 'clockFace', hour: 12, minute: 0 };
        case 'fractionModel':
            return { kind: 'fractionModel', numerator: 1, denominator: 2 };
        case 'wordProblem':
            return { kind: 'wordProblem', action: 'total', day1: 1, day2: 1 };
        case 'measurement':
            return { kind: 'measurement', unit: 'inches', type: 'object', item: 'pencil', length: 5 };
        case 'hundredsChart':
            return { kind: 'hundredsChart', start: 1, add: 10 };
        case 'baseTenBlocks':
            return { kind: 'baseTenBlocks', tens: 1, ones: 5 };
        case 'balanceScale':
            return {
                kind: 'balanceScale',
                left: { name: 'Apple', weight: 1, emoji: '🍎' },
                right: { name: 'Apple', weight: 1, emoji: '🍎' }
            };
        case 'measuringCup':
            return { kind: 'measuringCup', level: 50, unit: 'ml', max: 100 };
        default:
            return undefined;
    }
}
