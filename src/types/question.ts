export type ConceptType =
    | 'counting'
    | 'number_recognition'
    | 'shapes'
    | 'colors'
    | 'comparison'
    | 'addition'
    | 'subtraction'
    | 'number_bonds'
    | 'skip_counting'
    | 'place_value'
    | 'time'
    | 'multiplication'
    | 'division'
    | 'fractions'
    | 'decimals'
    | 'percentages'
    | 'word_problems'
    | 'money'
    | 'measurement'
    | 'data'
    | 'algebra'
    | 'patterns';

export type Visual =
    | { kind: 'emojiRow'; items: string[] }
    | { kind: 'twoGroups'; left: string[]; right: string[] }
    | { kind: 'singleTarget'; value: string }
    | { kind: 'coinRow'; coin: string; count: number }
    | { kind: 'numberLine'; min: number; max: number; start: number; end?: number; hops?: number[] }
    | { kind: 'tenFrame'; filled?: number; total?: 10; mode?: 'count' | 'addition' | 'subtraction'; value?: number; secondary?: number }
    | { kind: 'fractionModel'; numerator: number; denominator: number; theme?: string }
    | { kind: 'barModel'; parts: number[]; labels?: string[] }
    | { kind: 'clockFace'; hour: number; minute: number }
    | { kind: 'patternGrid'; rows: number; cols: number; cells: (string | null)[] }
    | { kind: 'verticalMath'; a: number; b: number; operator: '+' | '-' }
    | { kind: 'subtractionModel'; items: string[]; countToRemove: number }
    | { kind: 'numberBond'; total: string[]; part1: string[]; part2: number | string[] }
    | { kind: 'baseTenBlocks'; tens?: number; ones?: number; a?: number; b?: number; operator?: '+' | '-' }
    | { kind: 'wordProblem'; action: 'gave away' | 'got' | 'share equally' | 'total'; start?: number; amount?: number; total?: number; groups?: number; day1?: number; day2?: number; item?: string }
    | { kind: 'measurement'; unit: string; type: 'conversion' | 'object'; item?: string; length?: number }
    | { kind: 'balanceScale'; left: { name: string; weight: number; emoji: string }; right: { name: string; weight: number; emoji: string } }
    | { kind: 'measuringCup'; level: number; unit: 'ml' | 'cups' | 'L'; max: number; liquidColor?: string }
    | { kind: 'hundredsChart'; start: number; add: number }
    | { kind: 'multiplication'; groups: number; perGroup: number }
    | { kind: 'timesTableExplorer' }
    | { kind: 'barGraph'; title: string; yAxis: { min: number; max: number; step: number }; series: { id: string; label: string; value: number; color: string; icon: string }[] }
    | { kind: 'divisionSharing'; total: number; groupCount: number; item: string }
    | { kind: 'divisionGrouping'; total: number; groupSize: number; item: string }
    | { kind: 'decimalGrid'; whole: number; decimal: number }
    | {
        kind: 'fractionComparison';
        mode: 'circle' | 'bar';
        left: { numerator: number; denominator: number };
        right: { numerator: number; denominator: number };
    }
    | { kind: 'multiDigitMultiplication'; a: number; b: number }
    | { kind: 'longDivision'; dividend: number; divisor: number }
    | { kind: 'fractionEquation'; left: { n: number; d: number }; right: { n: number; d: number }; operation: '+' | '-' }
    | { kind: 'decimalOperation'; a: number; b: number; operation: '+' | '-' }
    | { kind: 'percentageBattery'; percent: number; total?: number; filled?: boolean }
    | { kind: 'cashRegister'; price: number; paid: number; item: string; currency: 'USD' | 'EUR' };

export interface ExplanationStep {
    visual?: Visual | string | any; // Keeping loose for explanation backward compat for now, or tighten if possible
    steps: string[];
    tip?: string;
    intro?: string;
}

export interface Question {
    id?: string; // Optional for generator, likely derived/unused for now but good for contract
    concept: ConceptType;
    question: string;
    visual?: Visual;
    correctAnswer: string | number;
    options: (string | number)[];
    explanation?: ExplanationStep;
    trackId?: string;
    level?: number;
    difficultyIndex?: number;
}
