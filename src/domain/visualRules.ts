import { ConceptType, Visual } from '../types/question';

export type VisualKind = Visual['kind'];

interface ConceptVisualRule {
    required: boolean;
    allowed: VisualKind[];
    preferred?: VisualKind; // General preference
    fallback?: VisualKind;
}

// Age-based preference logic will live in normalization, this is the hard constraints
export const conceptVisualRules: Record<ConceptType, ConceptVisualRule> = {
    // Core Math
    addition: {
        required: true,
        allowed: ['tenFrame', 'numberLine', 'emojiRow', 'verticalMath', 'hundredsChart', 'baseTenBlocks'],
        preferred: 'tenFrame',
        fallback: 'emojiRow'
    },
    subtraction: {
        required: true,
        allowed: ['tenFrame', 'numberLine', 'emojiRow', 'verticalMath', 'hundredsChart', 'baseTenBlocks'],
        preferred: 'tenFrame',
        fallback: 'emojiRow'
    },
    counting: {
        required: true,
        allowed: ['emojiRow', 'tenFrame'],
        preferred: 'tenFrame',
        fallback: 'emojiRow'
    },
    comparison: {
        required: true,
        allowed: ['twoGroups'],
        preferred: 'twoGroups',
        fallback: 'twoGroups'
    },

    // Topics

    shapes: {
        required: true,
        allowed: ['singleTarget', 'emojiRow'],
        preferred: 'singleTarget',
        fallback: 'singleTarget'
    },
    time: {
        required: true,
        allowed: ['clockFace'],
        preferred: 'clockFace',
        fallback: 'clockFace'
    },

    patterns: {
        required: true,
        allowed: ['patternGrid', 'emojiRow'],
        preferred: 'patternGrid',
        fallback: 'emojiRow'
    },
    colors: {
        required: true,
        allowed: ['emojiRow'],
        preferred: 'emojiRow',
        fallback: 'emojiRow'
    },
    number_recognition: {
        required: true,
        allowed: ['emojiRow'],
        preferred: 'emojiRow',
        fallback: 'emojiRow'
    },
    number_bonds: {
        required: true,
        allowed: ['numberBond', 'barModel'],
        preferred: 'numberBond',
        fallback: 'numberBond'
    },

    // Pending / Less Strict
    skip_counting: { required: true, allowed: ['emojiRow', 'numberLine'], fallback: 'emojiRow' },
    place_value: { required: true, allowed: ['baseTenBlocks'], preferred: 'baseTenBlocks', fallback: 'baseTenBlocks' },
    multiplication: { required: true, allowed: ['multiplication', 'timesTableExplorer', 'multiDigitMultiplication'], preferred: 'timesTableExplorer', fallback: 'multiplication' },
    division: { required: true, allowed: ['divisionSharing', 'divisionGrouping', 'multiplication', 'longDivision', 'emojiRow'], preferred: 'divisionSharing', fallback: 'divisionSharing' },
    decimals: { required: true, allowed: ['decimalGrid', 'decimalOperation'], preferred: 'decimalGrid', fallback: 'decimalGrid' },
    fractions: { required: true, allowed: ['fractionModel', 'fractionComparison', 'fractionEquation'], preferred: 'fractionModel', fallback: 'fractionModel' },
    percentages: { required: false, allowed: ['percentageBattery'], fallback: undefined },
    word_problems: { required: true, allowed: ['wordProblem'], preferred: 'wordProblem', fallback: 'wordProblem' },
    money: { required: true, allowed: ['coinRow', 'cashRegister'], preferred: 'coinRow', fallback: 'coinRow' },
    measurement: { required: true, allowed: ['measurement', 'balanceScale', 'measuringCup'], preferred: 'measurement', fallback: 'measurement' },
    data: { required: true, allowed: ['barGraph'], preferred: 'barGraph', fallback: 'barGraph' },
    algebra: { required: false, allowed: [], fallback: undefined },
};
