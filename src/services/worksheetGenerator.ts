import { db } from '../services/db';
import { QuestionAnsweredEvent } from '../domain/events';
import { WorksheetPreview, WorksheetItem } from '../domain/worksheets';


export const generateWorksheetPreview = ({ kidId, trackId, periodDays = 7 }: { kidId: string, trackId?: string, periodDays?: number }): WorksheetPreview => {
    const kid = db.getKid(kidId);
    if (!kid) throw new Error('Kid not found');

    const cutoff = Date.now() - (periodDays * 24 * 60 * 60 * 1000);
    const events = db.getEvents(kidId);

    // 1. Filter events
    const recentErrors = events.filter(e =>
        e.type === 'question_answered' &&
        !e.correct &&
        e.ts >= cutoff &&
        (trackId ? e.trackId === trackId : true)
    ) as QuestionAnsweredEvent[];

    // 2. Group by errorType
    const errorCounts: Record<string, number> = {};
    recentErrors.forEach(e => {
        const type = e.errorType || `${e.concept}_error`;
        errorCounts[type] = (errorCounts[type] || 0) + 1;
    });

    // 3. Identify top error types
    const sortedErrors = Object.entries(errorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3) // Top 3
        .map(([type]) => type);

    const items: WorksheetItem[] = [];
    const itemCount = 6; // Target 6 items

    if (sortedErrors.length === 0) {
        // Fallback: Mixed practice based on kid's age/level
        // For now, simple fallback templates
        items.push(...generateFallbackItems(kid.age, itemCount));
    } else {
        // Distribute items
        let itemsPerType = Math.floor(itemCount / sortedErrors.length);
        let remainder = itemCount % sortedErrors.length;

        sortedErrors.forEach(errorType => {
            const count = itemsPerType + (remainder > 0 ? 1 : 0);
            remainder--;
            for (let i = 0; i < count; i++) {
                items.push(createWorksheetItemForErrorType(errorType, kid.age, i));
            }
        });
    }

    return {
        id: `ws_${Date.now()}`,
        kidId,
        trackId,
        periodStart: cutoff,
        periodEnd: Date.now(),
        title: `Weekly Practice for ${kid.name}`,
        objective: sortedErrors.length > 0
            ? `Focus: ${sortedErrors.map(e => formatErrorType(e)).join(', ')}`
            : 'General Practice: Mixed Math Fun',
        items,
        parentNote: sortedErrors.length > 0
            ? `We noticed ${kid.name} had some trouble with ${formatErrorType(sortedErrors[0])}. Here are some practice questions!`
            : `${kid.name} is doing great! Here are some fun questions to keep practicing.`,
        createdAt: Date.now()
    };
};

// Helper: Format error type for display
const formatErrorType = (type: string) => {
    return type.replace('_error', '').replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
};

// Template Generator
const createWorksheetItemForErrorType = (errorType: string, age: number, index: number): WorksheetItem => {
    const id = `item_${Date.now()}_${index}`;

    // Normalize basic concepts
    if (errorType.includes('counting')) return generateCountingItem(id, age);
    if (errorType.includes('addition')) return generateAdditionItem(id, age);
    if (errorType.includes('subtraction')) return generateSubtractionItem(id, age);
    if (errorType.includes('shapes')) return generateShapeItem(id);
    if (errorType.includes('money')) return generateMoneyItem(id);
    if (errorType.includes('comparison')) return generateComparisonItem(id);

    // Fallback
    return generateCountingItem(id, age);
};

// Generators for specific items
const generateCountingItem = (id: string, age: number): WorksheetItem => {
    const count = Math.floor(Math.random() * (age === 5 ? 5 : 10)) + 3;
    const emoji = ['🍎', '⭐', '🎈', '🐶'][Math.floor(Math.random() * 4)];

    return {
        id,
        sourceErrorType: 'counting_error',
        prompt: `Count the ${emoji}s:`,
        visual: { kind: 'emojiRow', items: Array(count).fill(emoji) },
        answerKey: count.toString()
    };
};

const generateAdditionItem = (id: string, age: number): WorksheetItem => {
    const max = age <= 6 ? 5 : 10;
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;

    return {
        id,
        sourceErrorType: 'addition_error',
        prompt: `Solve: ${a} + ${b} = ?`,
        visual: age <= 7 ? {
            kind: 'twoGroups',
            left: Array(a).fill('⚫'),
            right: Array(b).fill('⚪')
        } : undefined,
        answerKey: (a + b).toString()
    };
};

const generateSubtractionItem = (id: string, age: number): WorksheetItem => {
    const max = age <= 6 ? 5 : 10;
    const a = Math.floor(Math.random() * max) + 2;
    const b = Math.floor(Math.random() * (a - 1)) + 1;

    return {
        id,
        sourceErrorType: 'subtraction_error',
        prompt: `Solve: ${a} - ${b} = ?`,
        visual: undefined, // Keep it simple for worksheet
        answerKey: (a - b).toString()
    };
};

const generateShapeItem = (id: string): WorksheetItem => {
    const shape = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)];
    return {
        id,
        sourceErrorType: 'shapes_error',
        prompt: `Draw a ${shape}!`,
        // Or if we want them to identify:
        // prompt: `Circle the ${shape}`,
        // visual: { kind: 'singleTarget', value: shape },
        answerKey: 'Drawing'
    };
};

const generateMoneyItem = (id: string): WorksheetItem => {
    const count = Math.floor(Math.random() * 3) + 1;
    return {
        id,
        sourceErrorType: 'money_error',
        prompt: `How much money is this? (pennies)`,
        visual: { kind: 'coinRow', coin: 'penny', count },
        answerKey: `${count} cents`
    };
};

const generateComparisonItem = (id: string): WorksheetItem => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = a + Math.floor(Math.random() * 3) + 1;
    return {
        id,
        sourceErrorType: 'comparison_error',
        prompt: `Circle the group with MORE items.`,
        visual: {
            kind: 'twoGroups',
            left: Array(a).fill('🍎'),
            right: Array(b).fill('🍎')
        },
        answerKey: 'Right group'
    };
};

const generateFallbackItems = (age: number, count: number): WorksheetItem[] => {
    const items = [];
    for (let i = 0; i < count; i++) {
        // Alternate addition and counting
        if (i % 2 === 0) items.push(generateCountingItem(`fb_${i}`, age));
        else items.push(generateAdditionItem(`fb_${i}`, age));
    }
    return items;
};
