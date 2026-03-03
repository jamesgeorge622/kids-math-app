import { MATH_TRACKS } from '../data/tracks';
import { Question } from '../types';

export const generateTimesTableExplorer = (): Question => {
    return {
        concept: 'multiplication',
        question: 'Times Table Explorer',
        visual: { kind: 'timesTableExplorer' },
        correctAnswer: 'Start Quiz',
        options: ['Start Quiz'],
        explanation: {
            visual: 'Endless Learning',
            steps: ['Explore the patterns!', 'Tap numbers to see how they grow.']
        }
    };
};

export const generateQuestion = (trackId: string, level: number, difficulty: number, kidAge: number, currencyCode: 'USD' | 'EUR' = 'USD', context?: { practiceTable?: number }): Question => {
    const track = MATH_TRACKS[trackId];

    if (!track || !track.concepts || track.concepts.length === 0) {
        return generateCountingQuestion(level, difficulty, kidAge);
    }

    const concept = track.concepts[0]; // Use primary concept

    switch (concept) {

        case 'counting':
            return generateCountingQuestion(level, difficulty, kidAge);
        case 'number_recognition':
            return generateNumberRecognitionQuestion(level, difficulty, kidAge);
        case 'shapes':
            return generateShapesQuestion(level, difficulty, kidAge);
        case 'colors':
            return generateColorsQuestion(level, difficulty, kidAge);
        case 'comparison':
            return generateComparisonQuestion(level, difficulty, kidAge);
        case 'addition':
            return generateAdditionQuestion(level, difficulty, kidAge);
        case 'subtraction':
            return generateSubtractionQuestion(level, difficulty, kidAge);
        case 'number_bonds':
            return generateNumberBondsQuestion(level, difficulty, kidAge);
        case 'skip_counting':
            return generateSkipCountingQuestion(level, difficulty, kidAge);
        case 'place_value':
            return generatePlaceValueQuestion(level, difficulty, kidAge);
        case 'time':
            return generateTimeQuestion(level, difficulty, kidAge);
        case 'multiplication':
            return generateMultiplicationQuestion(level, difficulty, kidAge, { ...context, trackId });
        case 'division':
            return generateDivisionQuestion(level, difficulty, kidAge, { trackId });
        case 'fractions':
            return generateFractionsQuestion(level, difficulty, kidAge, { trackId });
        case 'decimals':
            return generateDecimalsQuestion(level, difficulty, kidAge, { trackId });
        case 'percentages':
            return generatePercentagesQuestion(level, difficulty, kidAge);
        case 'word_problems':
            return generateWordProblemQuestion(level, difficulty, kidAge);
        case 'money':
            return generateMoneyQuestion(level, difficulty, kidAge, currencyCode, { trackId });
        case 'measurement':
            return generateMeasurementQuestion(level, difficulty, kidAge, trackId);
        case 'data':
            return generateDataQuestion(level, difficulty, kidAge);
        case 'algebra':
            return generateAlgebraQuestion(level, difficulty, kidAge);
        default:
            return generateCountingQuestion(level, difficulty, kidAge);
    }
};

const generateCountingQuestion = (level: number, _difficulty: number, kidAge: number): Question => {
    const maxCount = kidAge === 5 ? Math.min(5 + level, 10) :
        kidAge === 6 ? Math.min(10 + level, 20) :
            Math.min(20 + level * 5, 100);
    const count = Math.floor(Math.random() * maxCount) + 1;
    const objects = ['🍎', '⭐', '🎈', '🐶', '🚗', '🏀', '🌸', '🦋', '🍪', '🎨'];
    const obj = objects[Math.floor(Math.random() * objects.length)];

    return {
        concept: 'counting',
        question: `How many ${obj} are there?`,
        visual: { kind: 'emojiRow', items: Array(count).fill(obj) },
        correctAnswer: count,
        options: [count, count + 1, count - 1, count + 2].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: Array(count).fill(obj),
            steps: [
                'Let\'s count together!',
                'Point at each one as we count.',
                `Count: ${Array(count).fill(obj).map((_, i) => i + 1).join(', ')}`,
                `There are ${count} ${obj}!`
            ]
        }
    };
};

const generateNumberRecognitionQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    const max = 10;
    const number = Math.floor(Math.random() * max) + 1;
    const objects = ['🔵', '⭐', '🎈'];
    const obj = objects[Math.floor(Math.random() * objects.length)];

    return {
        concept: 'number_recognition',
        question: `Which number matches these ${obj}?`,
        visual: { kind: 'emojiRow', items: Array(number).fill(obj) },
        correctAnswer: number,
        options: [number, number + 1, number - 1, number + 2].filter(n => n > 0 && n <= 10).sort(() => Math.random() - 0.5),
        explanation: {
            visual: Array(number).fill(obj),
            steps: [
                `Let's count the ${obj}:`,
                `${Array(number).fill(obj).join(' ')}`,
                `We counted ${number} objects.`,
                `The number ${number} represents ${number} things!`
            ]
        }
    };
};

const generateShapesQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    const shapes = [
        { name: 'circle', description: 'round like a ball' },
        { name: 'square', description: '4 equal sides' },
        { name: 'triangle', description: '3 sides' },
        { name: 'rectangle', description: '2 long sides, 2 short sides' }
    ];

    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const options = shapes.map(s => s.name);

    // Randomize "Find the X" vs "What shape is this?"
    // For now, let's stick to "Find the [Shape]" where options are visuals (handled in GameScreen)
    // OR "What shape is this?" where visual is shape and options are text.

    // Let's do "Find the [Shape]" as requested by user context "Find the square"

    return {
        concept: 'shapes',
        question: `Find the ${targetShape.name}!`,
        visual: { kind: 'singleTarget', value: 'question' }, // Abstract visual to not give away answer
        correctAnswer: targetShape.name,
        options: options.sort(() => Math.random() - 0.5),
        explanation: {
            visual: targetShape.name, // Will trigger the CSS shape renderer in explanation
            steps: [
                `A ${targetShape.name} is ${targetShape.description}.`,
                `It looks like this!`,
                `Can you find a ${targetShape.name} around you?`
            ]
        }
    };
};

const generateColorsQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    const colors = [
        { name: 'red', emoji: '🔴' },
        { name: 'blue', emoji: '🔵' },
        { name: 'yellow', emoji: '🟡' },
        { name: 'green', emoji: '🟢' }
    ];

    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const options = colors.map(c => c.emoji);

    return {
        concept: 'colors',
        question: `Which one is ${targetColor.name}?`,
        visual: { kind: 'emojiRow', items: options },
        correctAnswer: targetColor.emoji,
        options: options.sort(() => Math.random() - 0.5),
        explanation: {
            visual: [targetColor.emoji],
            steps: [
                `This is the color ${targetColor.name}: ${targetColor.emoji}`,
                `Colors help us describe things!`,
                `Can you find something ${targetColor.name} near you?`,
                `Learning colors is fun and useful!`
            ]
        }
    };
};

const generateComparisonQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    const countA = Math.floor(Math.random() * 8) + 2;
    const countB = countA + Math.floor(Math.random() * 3) + 1;
    const obj = ['🍎', '⭐', '🎈'][Math.floor(Math.random() * 3)];

    return {
        concept: 'comparison',
        question: `Which group has MORE ${obj}?`,
        visual: {
            kind: 'twoGroups',
            left: Array(countA).fill(obj),
            right: Array(countB).fill(obj)
        },
        correctAnswer: 'Group B',
        options: ['Group A', 'Group B'].sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                groupA: Array(countA).fill(obj),
                groupB: Array(countB).fill(obj)
            },
            steps: [
                `Group A has ${countA} ${obj}`,
                `Group B has ${countB} ${obj}`,
                `${countB} is MORE than ${countA}`,
                `Group B has MORE!`
            ]
        }
    };
};

const generateAdditionQuestion = (level: number, _difficulty: number, kidAge: number): Question => {
    // Difficulty scaling:
    // Age 5: max num 5 (Total ~10)
    // Age 6-7: max num 10 (Total ~20)
    // Age 8-9: max num 30 (Total ~60)
    // Age 10+: max num 50 (Total ~100)
    let max = 50;
    if (kidAge <= 5) max = 5;
    else if (kidAge <= 7) max = 10;
    else if (kidAge <= 9) max = 30;

    const effectiveMax = Math.min(max + (level * 2), kidAge >= 10 ? 100 : max * 1.5);

    const a = Math.floor(Math.random() * effectiveMax) + 1;
    const b = Math.floor(Math.random() * effectiveMax) + 1;
    const answer = a + b;
    const isVertical = kidAge >= 10;

    let visual: any = undefined;

    if (isVertical) {
        visual = {
            kind: 'verticalMath',
            a: a,
            b: b,
            operator: '+'
        };
    } else if (kidAge <= 7) {
        // Use Ten Frame (Addition Mode)
        visual = {
            kind: 'tenFrame',
            mode: 'addition',
            value: a,
            secondary: b,
            filled: answer // For backward compat or total view
        };
    } else {

        // Option A: Base-10 Blocks (Concrete Visual for Age 8+)
        visual = {
            kind: 'baseTenBlocks',
            a: a,
            b: b
        };
    }

    return {
        concept: 'addition',
        question: `What is ${a} + ${b}?`,
        visual: visual,
        correctAnswer: answer,
        options: [answer, answer + 1, answer - 1, answer + 2].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                groupA: isVertical ? [] : Array(a).fill('🔵'),
                groupB: isVertical ? [] : Array(b).fill('🔵'),
                combined: isVertical ? [] : Array(answer).fill('🔵'),
                valA: a,
                valB: b,
                isVertical
            },
            steps: isVertical ? [
                `1. Stack the numbers: Ones over Ones, Tens over Tens.`,
                `2. Add the Ones column: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}`,
                ((a % 10) + (b % 10) >= 10) ? `   (Don't forget to carry the 10!)` : null,
                `3. Add the Tens column: ${Math.floor(a / 10)}0 + ${Math.floor(b / 10)}0 = ${Math.floor(answer / 10)}0`,
                `4. Total: ${answer}`
            ].filter(Boolean) as string[] : [
                `Start with ${a}`,
                `Add ${b} more`,
                `${a} + ${b} = ${answer}!`
            ]
        }
    };
};

const generateSubtractionQuestion = (level: number, _difficulty: number, kidAge: number): Question => {
    // Difficulty scaling similar to addition
    let max = 100;
    if (kidAge <= 5) max = 10;
    else if (kidAge <= 7) max = 20;
    else if (kidAge <= 9) max = 50;

    const effectiveMax = Math.min(max + (level * 2), kidAge >= 10 ? 150 : max * 1.2);

    const a = Math.floor(Math.random() * effectiveMax) + 3; // Ensure at least 3
    const b = Math.floor(Math.random() * (a - 1)) + 1;      // Ensure result > 0
    const answer = a - b;
    const isVertical = kidAge >= 10;

    let visual: any = undefined;

    if (isVertical) {
        visual = {
            kind: 'verticalMath',
            a: a,
            b: b,
            operator: '-'
        };
    } else if (kidAge <= 7) {
        // Ten Frame (Subtraction Mode)
        visual = {
            kind: 'tenFrame',
            mode: 'subtraction',
            value: a,
            secondary: b,
            filled: a // Start with 'a' filled
        };
    } else {
        // Option A: Base-10 Blocks (Concrete Visual for Age 8+)
        visual = {
            kind: 'baseTenBlocks',
            a: a,
            b: b,
            operator: '-'
        };
    }

    return {
        concept: 'subtraction',
        question: `What is ${a} - ${b}?`,
        visual: visual,
        correctAnswer: answer,
        options: [answer, answer + 1, answer - 1, answer + 2].filter(n => n >= 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                start: isVertical ? [] : Array(a).fill('⭐'),
                removed: isVertical ? [] : Array(b).fill('❌'),
                remaining: isVertical ? [] : Array(answer).fill('⭐'),
                valA: a,
                valB: b,
                isVertical
            },
            steps: isVertical ? [
                `1. Stack the numbers correctly.`,
                `2. Subtract the Ones: ${a % 10} - ${b % 10} = ?`,
                (a % 10 < b % 10) ? `   (Borrow 10!)` : `   ${a % 10} - ${b % 10} = ${(a % 10) - (b % 10)}`,
                `3. Subtract the Tens.`,
                `4. Answer: ${answer}`
            ].filter(Boolean) as string[] : [
                `Start with ${a}`,
                `Take away ${b}`,
                `${a} - ${b} = ${answer}!`
            ]
        }
    };
};

const generateNumberBondsQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    const total = Math.floor(Math.random() * 5) + 5; // 5-10
    const part1 = Math.floor(Math.random() * (total - 1)) + 1;
    const part2 = total - part1;

    return {
        concept: 'number_bonds',
        question: `${total} = ${part1} + ?`,
        visual: {
            kind: 'numberBond',
            total: Array(total).fill('🔵'),
            part1: Array(part1).fill('🔵'),
            part2: part2 // Numeric value triggers the '?' in NumberBondVisual
        },
        correctAnswer: part2,
        options: [part2, part2 + 1, part2 - 1, part2 + 2].filter(n => n > 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                total: Array(total).fill('🔵'),
                split: [Array(part1).fill('🔵'), Array(part2).fill('🔵')]
            },
            steps: [
                `${total} can be split into ${part1} and ${part2}`,
                `${part1} + ${part2} = ${total}`,
                `So ${total} = ${part1} + ${part2}!`,
                `Number bonds help you see how numbers fit together!`
            ]
        }
    };
};

const generateSkipCountingQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    const skipBy = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = skipBy;
    const length = 4;
    const sequence = Array(length).fill(0).map((_, i) => start + (i * skipBy));

    return {
        concept: 'skip_counting',
        question: `Count by ${skipBy}s. What comes next after ${sequence[length - 2]}?`,
        visual: { kind: 'emojiRow', items: sequence.slice(0, -1).map(n => `${n}`) },
        correctAnswer: sequence[length - 1],
        options: [sequence[length - 1], sequence[length - 1] + 1, sequence[length - 1] + skipBy, sequence[length - 1] - skipBy].sort(() => Math.random() - 0.5),
        explanation: {
            visual: sequence.map(n => `${n}`),
            steps: [
                `When we count by ${skipBy}s, we add ${skipBy} each time.`,
                `${sequence.join(', ')}`,
                `${sequence[length - 2]} + ${skipBy} = ${sequence[length - 1]}`,
                `The next number is ${sequence[length - 1]}!`
            ]
        }
    };
};

const generatePlaceValueQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    const tens = Math.floor(Math.random() * 9) + 1;
    const ones = Math.floor(Math.random() * 10);
    const number = tens * 10 + ones;

    // Generate unique options
    const optionsSet = new Set<number>();
    optionsSet.add(tens);
    optionsSet.add(tens + 1);
    optionsSet.add(tens - 1);
    if (ones !== tens) optionsSet.add(ones);

    // Fill with randoms if needed
    while (optionsSet.size < 4) {
        optionsSet.add(Math.floor(Math.random() * 10) + 1);
    }

    const options = Array.from(optionsSet).slice(0, 4).sort(() => Math.random() - 0.5);

    return {
        concept: 'place_value',
        question: `How many tens are in ${number}?`,
        visual: {
            kind: 'baseTenBlocks',
            tens: tens,
            ones: ones
        },
        correctAnswer: tens,
        options: options,
        explanation: {
            visual: { number, tens, ones },
            steps: [
                `${number} has two digits.`,
                `The ${tens} is in the tens place = ${tens * 10}`,
                `The ${ones} is in the ones place = ${ones}`,
                `${number} = ${tens} tens + ${ones} ones = ${tens * 10} + ${ones}`
            ]
        }
    };
};

const generateTimeQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const timeStr = minute === 0 ? `${hour}:00` : `${hour}:${minute}`;

    return {
        concept: 'time',
        question: `What time is shown?`,
        visual: { kind: 'clockFace', hour, minute },
        correctAnswer: timeStr,
        options: [timeStr, `${hour + 1}:00`, `${hour}:${minute + 15}`, `${hour - 1}:30`].sort(() => Math.random() - 0.5),
        explanation: {
            visual: { display: `🕐 ${timeStr}` },
            steps: [
                `The short hand points to the hour: ${hour}`,
                minute === 0 ? 'The long hand points to 12: that means :00' : `The long hand shows minutes: ${minute}`,
                `The time is ${timeStr}`,
                `Practice reading clocks at home!`
            ]
        }
    };
};

const generateMultiplicationQuestion = (level: number, _difficulty: number, kidAge: number, context?: { practiceTable?: number; trackId?: string }): Question => {
    const maxFactor = kidAge <= 8 ? 5 : kidAge <= 9 ? 10 : 12;

    // Check for Multi-Digit Track
    if (context?.trackId === 'multiplication_multi_digit') {
        // Generate Double Digit numbers (e.g. 12 x 14, 25 x 10)
        // Keep them relatively small for 10 year olds starting out (10-25 range)
        const a = Math.floor(Math.random() * 15) + 10; // 10-25
        const b = Math.floor(Math.random() * 10) + 10; // 10-20
        const answer = a * b;

        return {
            concept: 'multiplication',
            question: `What is ${a} × ${b}?`,
            visual: { kind: 'multiDigitMultiplication', a, b },
            correctAnswer: answer,
            options: [answer, answer + 10, answer - 10, answer + a].sort(() => Math.random() - 0.5),
            explanation: {
                visual: { kind: 'multiDigitMultiplication', a, b }, // Use same visual for explanation
                steps: [
                    `Break it down:`,
                    `${a} = ${Math.floor(a / 10) * 10} + ${a % 10}`,
                    `${b} = ${Math.floor(b / 10) * 10} + ${b % 10}`,
                    `Multiply each part (see the boxes!)`,
                    `Add them up: ${answer}`
                ]
            }
        };
    }

    // If practiceTable is designated, lock 'a' to it.
    // Ensure 'b' is still random.
    const a = context?.practiceTable ?? (Math.floor(Math.random() * Math.min(maxFactor, 2 + level)) + 2);
    const b = Math.floor(Math.random() * Math.min(maxFactor, 2 + level)) + 2;
    const answer = a * b;

    return {
        concept: 'multiplication',
        question: `What is ${a} × ${b}?`,
        visual: { kind: 'multiplication', groups: a, perGroup: b },
        correctAnswer: answer,
        options: [answer, answer + a, answer - a, answer + b].sort(() => Math.random() - 0.5),
        explanation: {
            visual: {
                groups: Array(a).fill(null).map(() => Array(b).fill('🔷'))
            },
            steps: [
                `${a} × ${b} means "${a} groups of ${b}"`,
                `Let's count each group:`,
                ...Array(a).fill(null).map((_, i) => `Group ${i + 1}: ${Array(b).fill('🔷').join(' ')}`),
                `That's ${b} ` + `+ ${b} `.repeat(a - 2) + `+ ${b} = ${answer}`,
                `So ${a} × ${b} = ${answer}!`
            ]
        }
    };
};

const generateDivisionQuestion = (_level: number, _difficulty: number, _kidAge: number, context?: { trackId?: string }): Question => {
    const isAdvanced = context?.trackId === 'division_advanced';

    // LONG DIVISION MODE for Advanced
    if (isAdvanced) {
        // Generate clean division problems (no remainder for now, for simplicity of area model)
        // Tens should be divisible by divisor for clean "Area Model" visual at this age
        // e.g. 84 / 4 -> 80/4 and 4/4. 
        // We want (Tens % divisor == 0) and (Ones % divisor == 0) ideally for the first level of this visual

        const divisor = [2, 3, 4, 5][Math.floor(Math.random() * 4)];

        // Generate Quotient such that digits don't carry for simplest Area Model
        // Tens digit
        const qTens = Math.floor(Math.random() * 4) + 1; // 1-4
        // Ones digit
        const qOnes = Math.floor(Math.random() * 9) + 1; // 1-9

        const quotient = qTens * 10 + qOnes;
        const dividend = quotient * divisor;

        // Ensure within reasonable bounds
        // If Logic: dividend is tens(qTens*divisor) + ones(qOnes*divisor).
        // e.g. Divisor 3. qTens 2 (20). qOnes 1. -> 21 * 3 = 63.
        // 60 / 3 = 20. 3 / 3 = 1. Perfect area split.

        const wrongOptionsSet = new Set<number>();
        while (wrongOptionsSet.size < 3) {
            const val = quotient + (Math.floor(Math.random() * 10) - 5) * 10 + (Math.floor(Math.random() * 5) - 2);
            if (val > 0 && val !== quotient) wrongOptionsSet.add(val);
        }

        return {
            concept: 'division',
            question: `What is ${dividend} ÷ ${divisor}?`,
            visual: { kind: 'longDivision', dividend, divisor },
            correctAnswer: quotient,
            options: [quotient, ...Array.from(wrongOptionsSet)].sort(() => Math.random() - 0.5),
            explanation: {
                visual: { kind: 'longDivision', dividend, divisor },
                steps: [
                    `Break up ${dividend} into ${Math.floor(dividend / 10) * 10} and ${dividend % 10}`,
                    `${Math.floor(dividend / 10) * 10} ÷ ${divisor} = ${qTens * 10}`,
                    `${dividend % 10} ÷ ${divisor} = ${qOnes}`,
                    `Total = ${qTens * 10} + ${qOnes} = ${quotient}`
                ]
            }
        };
    }

    // Basic: Sharing (Cookie Jars)
    // Advanced: Grouping (Lasso) -> Moved to Basic or specific track
    const object = ['🍪', '⭐', '🍎', '🎾', '🧁'][Math.floor(Math.random() * 5)];

    const divisor = Math.floor(Math.random() * 5) + 2;
    const quotient = Math.floor(Math.random() * (isAdvanced ? 8 : 4)) + 2;
    const dividend = divisor * quotient;

    const wrongOptionsSet = new Set<number>();
    while (wrongOptionsSet.size < 3) {
        const offset = Math.floor(Math.random() * 5) - 2;
        const val = quotient + offset;
        if (val > 0 && val !== quotient) {
            wrongOptionsSet.add(val);
        } else {
            const randomVal = Math.floor(Math.random() * 10) + 1;
            if (randomVal !== quotient) wrongOptionsSet.add(randomVal);
        }
    }
    const wrongOptions = Array.from(wrongOptionsSet);

    // Construct correct visual payload
    const visual = isAdvanced
        ? { kind: 'divisionGrouping' as const, total: dividend, groupSize: divisor, item: object }
        : { kind: 'divisionSharing' as const, total: dividend, groupCount: divisor, item: object };

    return {
        concept: 'division',
        question: `What is ${dividend} ÷ ${divisor}?`,
        visual: visual,
        correctAnswer: quotient,
        options: [quotient, ...wrongOptions].sort(() => Math.random() - 0.5),
        explanation: {
            visual: visual,
            steps: isAdvanced ? [
                `${dividend} ÷ ${divisor} means "how many groups of ${divisor} fit in ${dividend}?"`,
                `We circled groups of ${divisor}.`,
                `There are ${quotient} groups!`,
                `${dividend} ÷ ${divisor} = ${quotient}`
            ] : [
                `${dividend} ÷ ${divisor} means "share ${dividend} equally into ${divisor} groups"`,
                `We put items into ${divisor} jars one by one...`,
                `Each jar has ${quotient} items!`,
                `${dividend} ÷ ${divisor} = ${quotient}`
            ]
        }
    };
};

const generateFractionsQuestion = (_level: number, _difficulty: number, _kidAge: number, context?: { trackId?: string }): Question => {
    const isComparison = context?.trackId === 'fractions_compare';

    if (isComparison) {
        // PROPER COMPARISON MODE
        // 1. Generate two distinct fractions
        // Limit denominators to 2,3,4,5,6,8,10 for simplicity
        const denoms = [2, 3, 4, 5, 6, 8, 10];

        const generateFraction = () => {
            const d = denoms[Math.floor(Math.random() * denoms.length)];
            const n = Math.floor(Math.random() * (d - 1)) + 1; // 1 to d-1 (proper fraction)
            return { n, d, val: n / d };
        };

        let left = generateFraction();
        let right = generateFraction();

        // Ensure they are not equal and not too close to evaluate visually easily? 
        // Or just ensure not equal.
        let attempts = 0;
        while (left.val === right.val && attempts < 10) {
            right = generateFraction();
            attempts++;
        }
        // Fallback if still equal
        if (left.val === right.val) {
            right = { n: 1, d: left.d + 1, val: 1 / (left.d + 1) };
        }

        const isLeftBigger = left.val > right.val;
        const correctAnswer = isLeftBigger ? `${left.n}/${left.d}` : `${right.n}/${right.d}`;

        // Options: The two fractions + a distractor? 
        // Or just the two fractions? "Which is bigger?" usually implies a choice between the two.
        // Let's offer 3 options: Left, Right, Equal? Or just Left/Right to keep it simple.
        // Let's do 2 options: Left vs Right.
        const options = [`${left.n}/${left.d}`, `${right.n}/${right.d}`];

        // Randomly pick 'circle' or 'bar' mode
        const mode = Math.random() > 0.5 ? 'circle' : 'bar';

        return {
            concept: 'fractions',
            question: `Which is bigger?`,
            visual: {
                kind: 'fractionComparison',
                mode,
                left: { numerator: left.n, denominator: left.d },
                right: { numerator: right.n, denominator: right.d }
            },
            correctAnswer: correctAnswer,
            options: options.sort(() => Math.random() - 0.5),
            explanation: {
                visual: { kind: 'fractionComparison', mode, left: { numerator: left.n, denominator: left.d }, right: { numerator: right.n, denominator: right.d } },
                steps: [
                    `${left.n}/${left.d} = ${left.val.toFixed(2)}`,
                    `${right.n}/${right.d} = ${right.val.toFixed(2)}`,
                    isLeftBigger
                        ? `${left.n}/${left.d} is bigger than ${right.n}/${right.d}`
                        : `${right.n}/${right.d} is bigger than ${left.n}/${left.d}`
                ]
            }
        };
    } else if (context?.trackId === 'fractions_operations') {
        const denoms = [3, 4, 5, 6, 8, 10];
        const d = denoms[Math.floor(Math.random() * denoms.length)];

        // Ensure result <= 1 for strict addition
        // Pick left N
        const n1 = Math.floor(Math.random() * (d - 1)) + 1;
        // Pick right N (remaining space)
        const maxN2 = d - n1;
        const n2 = Math.floor(Math.random() * maxN2) + 1;

        const sum = n1 + n2;
        const operation = '+';

        return {
            concept: 'fractions',
            question: `What is ${n1}/${d} + ${n2}/${d}?`,
            visual: {
                kind: 'fractionEquation',
                left: { n: n1, d },
                right: { n: n2, d },
                operation
            },
            correctAnswer: `${sum}/${d}`, // Accepting string answer as multiple choice usually
            options: [
                `${sum}/${d}`,
                `${sum + 1 > d ? sum - 1 : sum + 1}/${d}`,
                `${Math.abs(n1 - n2) === 0 ? 1 : Math.abs(n1 - n2)}/${d}`,
                `${sum}/${d + 1}` // Wrong denom
            ].sort(() => Math.random() - 0.5),
            explanation: {
                visual: { kind: 'fractionEquation', left: { n: n1, d }, right: { n: n2, d }, operation },
                steps: [
                    `We have ${n1} parts and we add ${n2} parts.`,
                    `The denominator (bottom number) stays the same: /${d}.`,
                    `${n1} + ${n2} = ${sum}.`,
                    `So the answer is ${sum}/${d}!`
                ]
            }
        };
    }

    // ORIGINAL IDENTIFICATION MODE
    const fractions = [
        { display: '1/2', value: 0.5, name: 'one half', theme: 'pizza', total: 2, filled: 1 },
        { display: '1/2', value: 0.5, name: 'one half', theme: 'chocolate', total: 2, filled: 1 },
        { display: '1/4', value: 0.25, name: 'one quarter', theme: 'pizza', total: 4, filled: 1 },
        { display: '1/4', value: 0.25, name: 'one quarter', theme: 'chocolate', total: 4, filled: 1 },
        { display: '3/4', value: 0.75, name: 'three quarters', theme: 'pizza', total: 4, filled: 3 },
        { display: '3/4', value: 0.75, name: 'three quarters', theme: 'chocolate', total: 4, filled: 3 },
        { display: '1/3', value: 0.33, name: 'one third', theme: 'pizza', total: 3, filled: 1 },
        { display: '2/3', value: 0.67, name: 'two thirds', theme: 'pizza', total: 3, filled: 2 },
        { display: '1/5', value: 0.2, name: 'one fifth', theme: 'chocolate', total: 5, filled: 1 }, // vertical bar
        { display: '2/5', value: 0.4, name: 'two fifths', theme: 'chocolate', total: 5, filled: 2 },
        { display: '3/5', value: 0.6, name: 'three fifths', theme: 'chocolate', total: 5, filled: 3 }
    ];

    // Pick a random fraction from the list
    // Use simple random selection to avoid repeating the same sequence based on level
    const index = Math.floor(Math.random() * fractions.length);
    const fraction = fractions[index];

    // Visual is now an object describing the food item
    const visualData = {
        kind: 'fractionModel' as const,
        numerator: fraction.filled,
        denominator: fraction.total,
        theme: fraction.theme // Pass theme for visual rendering
    };

    const visualString = Array(fraction.total).fill('').map((_, i) => i < fraction.filled ? '🟦' : '⬜').join('');

    // Generate options
    // 1. Get all unique display values (e.g. '1/2', '1/4') avoiding duplicates from different themes
    const uniqueDisplays = Array.from(new Set(fractions.map(f => f.display)));

    // 2. Filter out the correct answer
    const wrongOptionsPool = uniqueDisplays.filter(display => display !== fraction.display);

    // 3. Shuffle and slice to get 3 wrong options
    const wrongOptions = wrongOptionsPool
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    const allOptions = [fraction.display, ...wrongOptions].sort(() => Math.random() - 0.5);

    return {
        concept: 'fractions',
        question: `Which shows ${fraction.name}?`,
        visual: visualData, // Send the object for the GameScreen to render
        correctAnswer: fraction.display,
        options: allOptions,
        explanation: {
            visual: visualString, // Keep simple string for explanation modal for now
            steps: [
                `${fraction.display} means ${fraction.name}`,
                `We have ${fraction.total} equal pieces total (bottom number)`,
                `${fraction.filled} piece${fraction.filled > 1 ? 's' : ''} ${fraction.filled > 1 ? 'are' : 'is'} filled (top number)`,
                `So the fraction is ${fraction.filled}/${fraction.total}`
            ]
        }
    };
};

const generateDecimalsQuestion = (_level: number, _difficulty: number, _kidAge: number, context?: { trackId?: string }): Question => {

    if (context?.trackId === 'decimals_operations') {
        const isAddition = Math.random() > 0.5;
        // Generate values like money (0.00 - 5.00)
        // Ensure A > B for subtraction
        const valA = (Math.floor(Math.random() * 400) + 50) / 100; // 0.50 - 4.50
        const valB = (Math.floor(Math.random() * 400) + 10) / 100; // 0.10 - 4.10

        let a = valA;
        let b = valB;
        if (!isAddition && b > a) {
            [a, b] = [b, a]; // Swap
        }

        const res = isAddition ? a + b : a - b;
        const op = isAddition ? '+' : '-';

        const fixedRes = parseFloat(res.toFixed(2));

        return {
            concept: 'decimals',
            question: `What is ${a.toFixed(2)} ${op} ${b.toFixed(2)}?`,
            visual: { kind: 'decimalOperation', a, b, operation: op },
            correctAnswer: fixedRes,
            options: [
                fixedRes,
                parseFloat((fixedRes + 0.1).toFixed(2)),
                parseFloat((fixedRes - 0.1).toFixed(2)),
                parseFloat((fixedRes + 1.0).toFixed(2))
            ].sort(() => Math.random() - 0.5),
            explanation: {
                visual: { kind: 'decimalOperation', a, b, operation: op },
                steps: [
                    `Line up the decimal points!`,
                    `${a.toFixed(2)}`,
                    `${op} ${b.toFixed(2)}`,
                    `= ${fixedRes.toFixed(2)}`
                ]
            }
        };
    }

    const whole = Math.floor(Math.random() * 5);
    const decimal = [0, 0.25, 0.5, 0.75][Math.floor(Math.random() * 4)];
    const number = whole + decimal;

    return {
        concept: 'decimals',
        question: `What is ${number} as a decimal?`,
        visual: { kind: 'decimalGrid', whole, decimal },
        correctAnswer: number,
        options: [number, number + 0.5, number + 1, number - 0.5].filter(n => n >= 0).sort(() => Math.random() - 0.5),
        explanation: {
            visual: { kind: 'decimalGrid', whole, decimal },
            steps: [
                `${number} is a decimal number`,
                `The number before the decimal point is ${whole}`,
                `The number after the decimal point is ${decimal}`,
                `Decimals help us show parts of a whole!`
            ]
        }
    };
};

const generatePercentagesQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {

    // Mix of Difficulty Levels
    // 1. Standard: Total 100 (Answer = %)
    // 2. Simple Scaling: Total 50, 10, 200, 1000
    // 3. Fraction Logic: Total 20, 40, 60, 80 (e.g. 25% of 40)

    const scaleType = Math.random();
    let total = 100;
    let percent = 50;

    if (scaleType < 0.4) {
        // LEV 1: Standard (40% chance)
        total = 100;
        percent = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100][Math.floor(Math.random() * 12)];
    } else if (scaleType < 0.7) {
        // LEV 2: Simple Scaling (30% chance)
        const totals = [10, 20, 50, 200];
        total = totals[Math.floor(Math.random() * totals.length)];

        // Pick friendly percents for these totals
        if (total === 50) percent = [10, 20, 50, 100][Math.floor(Math.random() * 4)];
        else if (total === 10) percent = [50, 100][Math.floor(Math.random() * 2)]; // 50% of 10 = 5
        else if (total === 20) percent = [50, 100][Math.floor(Math.random() * 2)];
        else if (total === 200) percent = [10, 25, 50][Math.floor(Math.random() * 3)];
    } else {
        // LEV 3: Fraction Logic (30% chance)
        // Focus on 25% (Quarter), 50% (Half), 75% (3 Quarters)
        const totals = [40, 60, 80];
        total = totals[Math.floor(Math.random() * totals.length)];
        percent = [25, 50, 75][Math.floor(Math.random() * 3)];
    }

    // Double check valid integer logic
    const amount = (percent / 100) * total;

    // Generate unique wrong options
    const wrongOptionsSet = new Set<number>();
    while (wrongOptionsSet.size < 3) {
        const val = amount + (Math.floor(Math.random() * 5) - 2) * 10; // +/- 10, 20
        if (val > 0 && val !== amount) {
            wrongOptionsSet.add(val);
        } else {
            const randomVal = Math.floor(Math.random() * 10) * 10;
            if (randomVal !== amount && randomVal > 0) wrongOptionsSet.add(randomVal);
        }
    }
    const wrongOptions = Array.from(wrongOptionsSet);

    return {
        concept: 'percentages',
        question: `What is ${percent}% of ${total}?`,
        visual: { kind: 'percentageBattery', percent, total },
        correctAnswer: amount,
        options: [amount, ...wrongOptions].sort(() => Math.random() - 0.5),
        explanation: {
            visual: { percent, total, amount },
            steps: [
                `${percent}% means ${percent} out of 100`,
                `To find ${percent}% of ${total}:`,
                `${percent} ÷ 100 × ${total} = ${amount}`,
                `${percent}% of ${total} = ${amount}!`
            ]
        }
    };
};

const getRandomName = () => {
    const names = ['Sarah', 'Tom', 'Emma', 'Alex', 'Mike', 'Lisa', 'David', 'Amy', 'Ben', 'Zoe'];
    return names[Math.floor(Math.random() * names.length)];
};

const getRandomItem = (type: 'food' | 'toy' | 'book' | 'generic') => {
    const items = {
        food: [
            { name: 'apple', emoji: '🍎' },
            { name: 'cookie', emoji: '🍪' },
            { name: 'sweet', emoji: '🍬' },
            { name: 'cupcake', emoji: '🧁' },
            { name: 'pizza slice', emoji: '🍕' }
        ],
        toy: [
            { name: 'toy car', emoji: '🚗' },
            { name: 'ball', emoji: '⚽' },
            { name: 'doll', emoji: '🧸' },
            { name: 'robot', emoji: '🤖' },
            { name: 'sticker', emoji: '⭐' }
        ],
        book: [
            { name: 'book', emoji: '📚' },
            { name: 'comic', emoji: '🦸' },
            { name: 'page', emoji: '📄' }
        ],
        generic: [
            { name: 'star', emoji: '⭐' },
            { name: 'flower', emoji: '🌸' },
            { name: 'shell', emoji: '🐚' }
        ]
    };
    return items[type][Math.floor(Math.random() * items[type].length)];
};

const generateWordProblemQuestion = (_level: number, _difficulty: number, kidAge: number): Question => {
    const scenario = Math.floor(Math.random() * 4);
    const name = getRandomName();
    const maxNumber = kidAge <= 6 ? 10 : 20;

    let question: any = {};

    switch (scenario) {
        case 0: { // Gave away
            const item = getRandomItem('food');
            const start = Math.floor(Math.random() * (maxNumber - 4)) + 4;
            const amount = Math.floor(Math.random() * (start - 1)) + 1;
            const left = start - amount;
            question = {
                story: `${name} has ${start} ${item.name}s. ${['Tom', 'Mike', 'David', 'Ben', 'Alex'].includes(name) ? 'He' : 'She'} gives ${amount} to a friend. How many ${item.name}s does ${name} have left?`,
                answer: left,
                visual: { kind: 'wordProblem', action: 'gave away', start, amount, item: item.emoji }
            };
            break;
        }
        case 1: { // Got more
            const item = getRandomItem('toy');
            const start = Math.floor(Math.random() * (maxNumber / 2)) + 1;
            const amount = Math.floor(Math.random() * (maxNumber / 2)) + 1;
            const total = start + amount;
            const pronoun = ['Tom', 'Mike', 'David', 'Ben', 'Alex'].includes(name) ? 'His' : 'Her';
            const objPronoun = ['Tom', 'Mike', 'David', 'Ben', 'Alex'].includes(name) ? 'him' : 'her';

            question = {
                story: `${name} has ${start} ${item.name}s. ${pronoun} mom buys ${objPronoun} ${amount} more. How many ${item.name}s does ${name} have now?`,
                answer: total,
                visual: { kind: 'wordProblem', action: 'got', start, amount, item: item.emoji }
            };
            break;
        }
        case 2: { // Share equally
            const item = getRandomItem('food');
            const groups = [2, 3, 4][Math.floor(Math.random() * 3)];
            const perGroup = Math.floor(Math.random() * 4) + 1;
            const total = groups * perGroup;
            question = {
                story: `There are ${total} ${item.name}s. ${groups} children share them equally. How many ${item.name}s does each child get?`,
                answer: perGroup,
                visual: { kind: 'wordProblem', action: 'share equally', total, groups, item: item.emoji }
            };
            break;
        }
        case 3: { // Total over time
            const item = getRandomItem('book');
            const day1 = Math.floor(Math.random() * (maxNumber / 2)) + 1;
            const day2 = Math.floor(Math.random() * (maxNumber / 2)) + 1;
            const total = day1 + day2;
            const pronoun = ['Tom', 'Mike', 'David', 'Ben', 'Alex'].includes(name) ? 'he' : 'she';
            question = {
                story: `${name} reads ${day1} ${item.name}s on Monday and ${day2} ${item.name}s on Tuesday. How many ${item.name}s did ${pronoun} read in total?`,
                answer: total,
                visual: { kind: 'wordProblem', action: 'total', day1, day2, item: item.emoji }
            };
            break;
        }
    }

    const wrongOptionsSet = new Set<number>();
    while (wrongOptionsSet.size < 3) {
        const offset = Math.floor(Math.random() * 5) - 2;
        const val = question.answer + offset;
        if (val > 0 && val !== question.answer) {
            wrongOptionsSet.add(val);
        } else {
            const randomVal = Math.floor(Math.random() * 10) + 1;
            if (randomVal !== question.answer) wrongOptionsSet.add(randomVal);
        }
    }
    const wrongOptions = Array.from(wrongOptionsSet);

    return {
        concept: 'word_problems',
        question: question.story,
        visual: question.visual,
        correctAnswer: question.answer,
        options: [question.answer, ...wrongOptions].sort(() => Math.random() - 0.5),
        explanation: {
            visual: question.visual,
            steps: [
                "Let's break down the problem:",
                `Key numbers: ${JSON.stringify(question.visual)}`,
                `The answer is ${question.answer}!`,
                "Always read carefully and find the important numbers!"
            ]
        }
    };
};

const generateMoneyQuestion = (_level: number, _difficulty: number, _kidAge: number, currencyCode: 'USD' | 'EUR' = 'USD', context?: { trackId?: string }): Question => {

    // Check for "Making Change" Track - SHOPKEEPER MODE
    if (context?.trackId === 'money_change') {
        const currency = {
            USD: { code: 'USD', symbol: '$' },
            EUR: { code: 'EUR', symbol: '€' }
        }[currencyCode] as any;

        const item = getRandomItem('toy');

        // Generate Logical Price (e.g. 2.50, 3.25, 4.00)
        // Price between 1.00 and 15.00
        const priceCents = (Math.floor(Math.random() * 14) + 1) * 100 + [0, 25, 50, 75][Math.floor(Math.random() * 4)];

        // Generate Payment (Must be greater than price, usually logical bills)
        const validPayments = [200, 500, 1000, 2000].filter(p => p > priceCents);
        if (validPayments.length === 0) validPayments.push(Math.ceil(priceCents / 100) * 100);
        const paidCents = validPayments[Math.floor(Math.random() * validPayments.length)];

        const changeCents = paidCents - priceCents;

        // Helper
        const formatF = (c: number) => currency.code === 'USD' ? `$${(c / 100).toFixed(2)}` : `€${(c / 100).toFixed(2)}`;

        // Generate Options
        const options = [changeCents];
        while (options.length < 4) {
            const offset = (Math.floor(Math.random() * 5) - 2) * 25;
            const val = changeCents + offset;
            if (val > 0 && !options.includes(val)) options.push(val);
        }

        return {
            concept: 'money',
            question: `You buy a ${item.name} for ${formatF(priceCents)}. You pay ${formatF(paidCents)}. How much change?`,
            visual: { kind: 'cashRegister', price: priceCents, paid: paidCents, item: item.emoji, currency: currency.code },
            correctAnswer: formatF(changeCents),
            options: options.sort(() => Math.random() - 0.5).map(formatF),
            explanation: {
                steps: [
                    `Price: ${formatF(priceCents)}`,
                    `Paid: ${formatF(paidCents)}`,
                    `Count up from ${formatF(priceCents)} to ${formatF(paidCents)}...`,
                    `Answer: ${formatF(changeCents)}`
                ]
            }
        };
    }

    // Default: Counting Logic
    const currencies: Record<'USD' | 'EUR', { code: 'USD' | 'EUR', symbol: string, coins: { name: string, value: number, emoji: string }[] }> = {
        'USD': {
            code: 'USD',
            symbol: '¢',
            coins: [
                { name: 'penny', value: 1, emoji: '🪙' },
                { name: 'nickel', value: 5, emoji: '🪙' },
                { name: 'dime', value: 10, emoji: '🪙' },
                { name: 'quarter', value: 25, emoji: '🪙' }
            ]
        },
        'EUR': {
            code: 'EUR',
            symbol: 'c',
            coins: [
                { name: '1 cent coin', value: 1, emoji: '🪙' },
                { name: '2 cent coin', value: 2, emoji: '🪙' },
                { name: '5 cent coin', value: 5, emoji: '🪙' },
                { name: '10 cent coin', value: 10, emoji: '🪙' },
                { name: '20 cent coin', value: 20, emoji: '🪙' },
                { name: '50 cent coin', value: 50, emoji: '🪙' }
            ]
        }
    };

    // Select currency
    const currency = currencies[currencyCode];
    const coin1 = currency.coins[Math.floor(Math.random() * currency.coins.length)];
    const count = Math.floor(Math.random() * 5) + 1;
    const total = coin1.value * count;

    // Helper to format money
    const formatMoney = (amount: number, code: 'USD' | 'EUR') => {
        if (code === 'USD') {
            if (amount >= 100) return `$${(amount / 100).toFixed(2)}`;
            return `${amount}¢`;
        } else {
            if (amount >= 100) return `€${(amount / 100).toFixed(2)}`;
            return `${amount}c`;
        }
    };

    // Format question appropriately
    const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    const countDisplay = count <= 10 ? numberWords[count] : count.toString();

    const questionText = currency.code === 'USD'
        ? `How much is ${countDisplay} ${coin1.name}${count > 1 ? 's' : ''}?`
        : `How much is ${countDisplay} ${coin1.name}${count > 1 ? 's' : ''}?`;

    const correctAnswerFormatted = formatMoney(total, currency.code);

    // Generate options first as numbers then format
    const numericOptions = [total, total + 5, total - 5, total + 10].filter(n => n > 0).sort(() => Math.random() - 0.5);
    // Ensure uniqueness
    const uniqueOptions = Array.from(new Set(numericOptions)).slice(0, 4);
    // If we filtered out too many negatives or duplicates, add some
    while (uniqueOptions.length < 4) {
        let newOpt = total + Math.floor(Math.random() * 20) - 10;
        if (newOpt > 0 && !uniqueOptions.includes(newOpt)) {
            uniqueOptions.push(newOpt);
        }
    }

    // Sort final numeric options relative to each other (optional, but good for cleanliness)
    uniqueOptions.sort((a, b) => a - b);
    // Wait, let's just shuffle them so answer position is random
    uniqueOptions.sort(() => Math.random() - 0.5);

    return {
        concept: 'money',
        question: questionText,
        visual: { kind: 'coinRow', coin: coin1.name, count: count },
        correctAnswer: correctAnswerFormatted, // Now returning string
        options: uniqueOptions.map(opt => formatMoney(opt, currency.code)), // Formatted strings
        explanation: {
            visual: Array(count).fill(coin1.emoji),
            steps: [
                `Each ${coin1.name} = ${formatMoney(coin1.value, currency.code)}`,
                `${count} ${coin1.name}${count > 1 ? 's' : ''} = ${count} × ${formatMoney(coin1.value, currency.code)}`,
                `${count} × ${coin1.value} = ${total}`,
                `Answer: ${correctAnswerFormatted}!`
            ]
        }
    };
};



const generateMeasurementQuestion = (_level: number, _difficulty: number, _kidAge: number, trackId?: string): Question => {
    // Determine Type: Length (default) or Weight/Volume
    const mode = trackId === 'measurement_weight' ? 'weight_volume' : 'length';

    // LENGTH MODE
    if (mode === 'length') {
        const items = [
            { name: 'pencil', emoji: '✏️' },
            { name: 'crayon', emoji: '🖍️' },
            { name: 'spoon', emoji: '🥄' },
            { name: 'brush', emoji: '🖌️' }
        ];

        const targetItem = items[Math.floor(Math.random() * items.length)];
        const length = Math.floor(Math.random() * 8) + 2; // 2 to 9 inches

        return {
            concept: 'measurement',
            question: `How long is the ${targetItem.name}?`,
            visual: {
                kind: 'measurement',
                unit: 'inches',
                type: 'object',
                item: targetItem.name,
                length: length
            },
            correctAnswer: `${length} inches`,
            options: [length, length + 1, length - 1, length + 2]
                .sort(() => Math.random() - 0.5)
                .map(n => `${n} inches`),
            explanation: {
                visual: { unit: 'inches' },
                steps: [
                    `Look at where the ${targetItem.name} ends on the ruler.`,
                    `It ends at the number ${length}.`,
                    `So it is ${length} inches long!`
                ]
            }
        };
    }

    // WEIGHT / VOLUME MODE
    // 50/50 split
    if (Math.random() > 0.5) {
        // --- VOLUME (Measuring Cup) ---
        const max = 1000; // ml
        const level = [250, 500, 750, 1000][Math.floor(Math.random() * 4)];

        return {
            concept: 'measurement',
            question: "How much water is in the jug?",
            visual: {
                kind: 'measuringCup',
                level: level,
                max: max,
                unit: 'ml'
            },
            correctAnswer: `${level}ml`,
            options: [`${level}ml`, `${level === 1000 ? 500 : level + 250}ml`, `${level === 250 ? 500 : level - 250}ml`, "100ml"]
                .sort(() => Math.random() - 0.5),
            explanation: {
                steps: [
                    "Look at the water level.",
                    `It matches the line for ${level}.`,
                    `So there is ${level}ml of water!`
                ]
            }
        };

    } else {
        // --- WEIGHT (Balance Scale) ---
        // Simple comparison: Which is heavier?
        const heavyItems = [
            { name: 'Elephant', weight: 1000, emoji: '🐘' },
            { name: 'Car', weight: 800, emoji: '🚗' },
            { name: 'Rock', weight: 50, emoji: '🪨' }
        ];
        const lightItems = [
            { name: 'Mouse', weight: 1, emoji: '🐁' },
            { name: 'Feather', weight: 0.1, emoji: '🪶' },
            { name: 'Apple', weight: 0.2, emoji: '🍎' }
        ];

        const heavy = heavyItems[Math.floor(Math.random() * heavyItems.length)];
        const light = lightItems[Math.floor(Math.random() * lightItems.length)];

        // Randomize positions (Left vs Right)
        const heavyIsLeft = Math.random() > 0.5;
        const left = heavyIsLeft ? heavy : light;
        const right = heavyIsLeft ? light : heavy;

        return {
            concept: 'measurement',
            question: "Which object is heavier?",
            visual: {
                kind: 'balanceScale',
                left: left,
                right: right
            },
            correctAnswer: heavy.name,
            options: [left.name, right.name, "Both equal", "Neither"].slice(0, 2), // Binary choice usually better
            explanation: {
                steps: [
                    "Look at the scale.",
                    "The side that goes DOWN is heavier.",
                    `${heavy.name} pushed the scale down.`,
                    `So ${heavy.name} is heavier!`
                ]
            }
        };
    }
};

const generateDataQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    // 1. Generate Data (Source of Truth)
    const data: Record<string, number> = {
        apples: Math.floor(Math.random() * 10) + 1,
        oranges: Math.floor(Math.random() * 10) + 1,
        bananas: Math.floor(Math.random() * 10) + 1
    };

    // 2. Select Target (Deterministic derivation)
    const fruits = Object.keys(data);
    const targetFruit = fruits[Math.floor(Math.random() * fruits.length)];
    const answer = data[targetFruit];

    // 3. Create Safe Visual Payload (Deep Clone to prevent mutation)
    const safeData = JSON.parse(JSON.stringify(data));

    // 4. Sanity Check
    if (safeData[targetFruit] !== answer) {
        throw new Error(`[CRITICAL] Data integrity check failed: ${safeData[targetFruit]} !== ${answer}`);
    }

    // 5. Generate Options (Robust)
    const optionsSet = new Set<number>();
    optionsSet.add(answer);
    optionsSet.add(answer + 1);
    optionsSet.add(answer - 1);

    // Add random valid numbers until we have 4 options
    while (optionsSet.size < 4) {
        const r = Math.floor(Math.random() * 10) + 1;
        optionsSet.add(r);
    }
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    // 6. Generate ID (Stable unique identifier)
    const uniqueId = `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // SVG Rebuild Logic
    const visualPayload = {
        kind: 'barGraph' as const,
        title: 'Fruit Count',
        yAxis: { min: 0, max: 10, step: 2 },
        series: [
            { id: 'apples', label: 'Apples', value: safeData.apples, color: '#F87171', icon: '🍎' },
            { id: 'oranges', label: 'Oranges', value: safeData.oranges, color: '#FB923C', icon: '🍊' },
            { id: 'bananas', label: 'Bananas', value: safeData.bananas, color: '#FACC15', icon: '🍌' }
        ]
    };

    return {
        id: uniqueId,
        concept: 'data',
        question: `Look at the graph. How many ${targetFruit} are there?`,
        visual: visualPayload,
        correctAnswer: answer,
        options: options,
        explanation: {
            visual: visualPayload,
            steps: [
                `Look at the bar for ${targetFruit}`,
                `The bar reaches ${answer}`,
                `So there are ${answer} ${targetFruit}!`,
                "Always check the labels on graphs!"
            ]
        }
    };
};

const generateAlgebraQuestion = (_level: number, _difficulty: number, _kidAge: number): Question => {
    const start = Math.floor(Math.random() * 10) + 1;
    const step = Math.floor(Math.random() * 5) + 1;
    const length = 4;
    const sequence = Array(length).fill(0).map((_, i) => start + (i * step));
    const next = start + (length * step);

    return {
        concept: 'algebra',
        question: `What number comes next? ${sequence.join(', ')}, __`,
        visual: undefined,
        correctAnswer: next,
        options: [next, next + 1, next - 1, next + step].sort(() => Math.random() - 0.5),
        explanation: {
            visual: undefined,
            steps: [
                `Look at the pattern: ${sequence.join(', ')}`,
                `Each number increases by ${step}`,
                `${sequence[length - 1]} + ${step} = ${next}`,
                `The next number is ${next}!`
            ]
        }
    };
};
