import { Question, ConceptType, Visual, ExplanationStep } from '../types/question';
import { normalizeVisualForConcept } from './visualValidation';
import { conceptVisualRules } from './visualRules';

export interface RenderableQuestion {
    id: string;
    concept: ConceptType;
    trackId: string;
    level: number;
    difficultyIndex: number;
    prompt: string;
    question: string; // Legacy alias for UI compatibility
    options: string[];
    correctAnswer: string | number;
    correctIndex: number;
    visual?: Visual;
    explanation?: ExplanationStep; // Preserving full explanation object to avoid breaking UI
    explanationText?: string;      // Keeping requested field as logic derivation
    debug?: {
        usedFallback: boolean;
        reason?: string;
    };
}

export type RenderBoundaryResult =
    | { ok: true; value: RenderableQuestion }
    | { ok: false; error: string };

export function toRenderableQuestion(raw: Question, ctx: { age: number; trackId: string; level: number; difficulty: number }): RenderBoundaryResult {
    // 1. Validate Shape
    if (!raw.question || raw.question.trim() === '') {
        return { ok: false, error: 'Empty prompt' };
    }
    if (!raw.options || raw.options.length === 0) {
        return { ok: false, error: 'No options provided' };
    }

    // 2. Normalize Options & Find Correct Index
    // We strictly convert all options to strings for rendering
    const optionsStr = raw.options.map(o => String(o));
    const correctAnswerStr = String(raw.correctAnswer);

    // Find index of correct answer in the stringified options
    // Note: We need to be careful with loose equality vs strict string matching.
    const correctIndex = optionsStr.findIndex(opt => opt === correctAnswerStr);

    if (correctIndex === -1) {
        // Fallback: try to find by original value equality if simple string mapping failed (unlikely but safe)
        // or just error out. 
        // Let's error out to be strict.
        return { ok: false, error: `Correct answer '${raw.correctAnswer}' not found in options: ${raw.options.join(', ')}` };
    }

    // 3. Normalize Visual
    const normalized = normalizeVisualForConcept({
        concept: raw.concept,
        age: ctx.age,
        visual: raw.visual // raw.visual might be undefined
    });

    const finalVisual = normalized.visual;
    const rule = conceptVisualRules[raw.concept];

    // 4. Enforce Requirements
    if (rule?.required && !finalVisual) {
        return { ok: false, error: `Visual required for ${raw.concept} but failed to produce one (even with fallback)` };
    }

    // 5. Construct Renderable
    return {
        ok: true,
        value: {
            id: raw.id || `q_${Date.now()}_${Math.random()}`,
            concept: raw.concept,
            trackId: ctx.trackId, // Ensure trackId is passed through
            level: ctx.level,
            difficultyIndex: ctx.difficulty,
            prompt: raw.question,
            question: raw.question, // Legacy alias
            options: optionsStr,
            correctAnswer: raw.correctAnswer, // Added for strict compliance with Question type
            correctIndex: correctIndex,
            visual: finalVisual,
            explanation: raw.explanation,
            explanationText: raw.explanation?.intro, // Map to intro if available
            debug: {
                usedFallback: normalized.usedFallback,
                reason: normalized.reason
            }
        }
    };
}
