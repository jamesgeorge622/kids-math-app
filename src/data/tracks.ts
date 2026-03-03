import { MathTrack } from '../types';

export const MATH_TRACKS: Record<string, MathTrack> = {
    // AGE 5 (Kindergarten)
    counting_1_10: {
        id: 'counting_1_10',
        title: 'Counting 1-10',
        description: 'Learn to count up to 10',
        icon: '1️⃣',
        color: 'from-blue-400 to-blue-600',
        ageRange: [5, 5],
        levels: 8,
        concepts: ['counting', 'number_recognition']
    },
    shapes_colors: {
        id: 'shapes_colors',
        title: 'Shapes & Colors',
        description: 'Learn basic shapes and colors',
        icon: '🔷',
        color: 'from-pink-400 to-pink-600',
        ageRange: [5, 5],
        levels: 6,
        concepts: ['shapes', 'colors']
    },
    more_less: {
        id: 'more_less',
        title: 'More or Less',
        description: 'Compare which group has more',
        icon: '⚖️',
        color: 'from-green-400 to-green-600',
        ageRange: [5, 6],
        levels: 6,
        concepts: ['comparison']
    },

    // AGE 6 (Grade 1)
    counting_1_20: {
        id: 'counting_1_20',
        title: 'Counting 1-20',
        description: 'Count higher numbers',
        icon: '🔢',
        color: 'from-blue-400 to-blue-600',
        ageRange: [6, 6],
        levels: 10,
        concepts: ['counting']
    },
    addition_basic: {
        id: 'addition_basic',
        title: 'Addition to 10',
        description: 'Add numbers up to 10',
        icon: '➕',
        color: 'from-green-400 to-green-600',
        ageRange: [6, 7],
        levels: 10,
        concepts: ['addition']
    },
    subtraction_basic: {
        id: 'subtraction_basic',
        title: 'Subtraction to 10',
        description: 'Take away numbers up to 10',
        icon: '➖',
        color: 'from-orange-400 to-orange-600',
        ageRange: [6, 7],
        levels: 10,
        concepts: ['subtraction']
    },
    number_bonds: {
        id: 'number_bonds',
        title: 'Number Bonds',
        description: 'Learn how numbers combine',
        icon: '🔗',
        color: 'from-purple-400 to-purple-600',
        ageRange: [6, 7],
        levels: 8,
        concepts: ['number_bonds']
    },

    // AGE 7 (Grade 2)
    counting_1_100: {
        id: 'counting_1_100',
        title: 'Counting to 100',
        description: 'Count by 1s, 5s, and 10s',
        icon: '💯',
        color: 'from-blue-400 to-blue-600',
        ageRange: [7, 7],
        levels: 10,
        concepts: ['counting', 'skip_counting']
    },
    addition_20: {
        id: 'addition_20',
        title: 'Addition to 20',
        description: 'Add bigger numbers',
        icon: '➕',
        color: 'from-green-400 to-green-600',
        ageRange: [7, 8],
        levels: 12,
        concepts: ['addition']
    },
    subtraction_20: {
        id: 'subtraction_20',
        title: 'Subtraction to 20',
        description: 'Subtract bigger numbers',
        icon: '➖',
        color: 'from-orange-400 to-orange-600',
        ageRange: [7, 8],
        levels: 12,
        concepts: ['subtraction']
    },
    place_value: {
        id: 'place_value',
        title: 'Tens and Ones',
        description: 'Understand place value',
        icon: '🔟',
        color: 'from-indigo-400 to-indigo-600',
        ageRange: [7, 8],
        levels: 10,
        concepts: ['place_value']
    },
    time_basics: {
        id: 'time_basics',
        title: 'Telling Time',
        description: 'Learn to read clocks',
        icon: '🕐',
        color: 'from-yellow-400 to-yellow-600',
        ageRange: [7, 8],
        levels: 8,
        concepts: ['time']
    },

    // AGE 8 (Grade 3)
    addition_100: {
        id: 'addition_100',
        title: 'Addition to 100',
        description: 'Add with two-digit numbers',
        icon: '➕',
        color: 'from-green-400 to-green-600',
        ageRange: [8, 10],
        levels: 12,
        concepts: ['addition', 'carrying']
    },
    subtraction_100: {
        id: 'subtraction_100',
        title: 'Subtraction to 100',
        description: 'Subtract with two-digit numbers',
        icon: '➖',
        color: 'from-orange-400 to-orange-600',
        ageRange: [8, 10],
        levels: 12,
        concepts: ['subtraction', 'borrowing']
    },
    multiplication_intro: {
        id: 'multiplication_intro',
        title: 'Multiplication Basics',
        description: 'Learn about equal groups',
        icon: '✖️',
        color: 'from-purple-400 to-purple-600',
        ageRange: [8, 9],
        levels: 10,
        concepts: ['multiplication']
    },
    times_tables_2_5_10: {
        id: 'times_tables_2_5_10',
        title: 'Times Tables 2, 5, 10',
        description: 'Master easy multiplication facts',
        icon: '✖️',
        color: 'from-purple-500 to-purple-700',
        ageRange: [8, 9],
        levels: 12,
        concepts: ['multiplication']
    },
    fractions_half_quarter: {
        id: 'fractions_half_quarter',
        title: 'Halves & Quarters',
        description: 'Learn about fractions',
        icon: '🍕',
        color: 'from-red-400 to-red-600',
        ageRange: [8, 9],
        levels: 10,
        concepts: ['fractions']
    },

    // AGE 9 (Grade 4)
    multiplication_advanced: {
        id: 'multiplication_advanced',
        title: 'All Times Tables',
        description: 'Master multiplication to 12×12',
        icon: '✖️',
        color: 'from-purple-400 to-purple-600',
        ageRange: [9, 10],
        levels: 15,
        concepts: ['multiplication']
    },
    division_intro: {
        id: 'division_intro',
        title: 'Division Basics',
        description: 'Learn to divide and share',
        icon: '➗',
        color: 'from-teal-400 to-teal-600',
        ageRange: [9, 10],
        levels: 12,
        concepts: ['division']
    },
    fractions_compare: {
        id: 'fractions_compare',
        title: 'Comparing Fractions',
        description: 'Which fraction is bigger?',
        icon: '🍕',
        color: 'from-red-400 to-red-600',
        ageRange: [9, 10],
        levels: 12,
        concepts: ['fractions']
    },
    decimals_intro: {
        id: 'decimals_intro',
        title: 'Decimals',
        description: 'Learn about decimal numbers',
        icon: '🔢',
        color: 'from-cyan-400 to-cyan-600',
        ageRange: [9, 10],
        levels: 10,
        concepts: ['decimals']
    },

    // AGE 10 (Grade 5)
    multiplication_multi_digit: {
        id: 'multiplication_multi_digit',
        title: 'Multi-Digit Multiplication',
        description: 'Multiply bigger numbers',
        icon: '✖️',
        color: 'from-purple-400 to-purple-600',
        ageRange: [10, 10],
        levels: 12,
        concepts: ['multiplication']
    },
    division_advanced: {
        id: 'division_advanced',
        title: 'Long Division',
        description: 'Divide bigger numbers',
        icon: '➗',
        color: 'from-teal-400 to-teal-600',
        ageRange: [10, 10],
        levels: 12,
        concepts: ['division']
    },
    fractions_operations: {
        id: 'fractions_operations',
        title: 'Adding Fractions',
        description: 'Add and subtract fractions',
        icon: '🍕',
        color: 'from-red-400 to-red-600',
        ageRange: [10, 10],
        levels: 12,
        concepts: ['fractions']
    },
    decimals_operations: {
        id: 'decimals_operations',
        title: 'Decimal Operations',
        description: 'Add and subtract decimals',
        icon: '🔢',
        color: 'from-cyan-400 to-cyan-600',
        ageRange: [10, 10],
        levels: 12,
        concepts: ['decimals']
    },
    percentages_intro: {
        id: 'percentages_intro',
        title: 'Percentages',
        description: 'Learn about percents',
        icon: '💯',
        color: 'from-yellow-400 to-yellow-600',
        ageRange: [10, 10],
        levels: 10,
        concepts: ['percentages']
    },

    // NEW TRACKS - Word Problems, Money, Measurement, Data
    word_problems_basic: {
        id: 'word_problems_basic',
        title: 'Word Problems',
        description: 'Solve real-world math stories',
        icon: '📖',
        color: 'from-indigo-400 to-indigo-600',
        ageRange: [7, 8],
        levels: 10,
        concepts: ['word_problems']
    },
    word_problems_advanced: {
        id: 'word_problems_advanced',
        title: 'Advanced Word Problems',
        description: 'Multi-step problem solving',
        icon: '📚',
        color: 'from-indigo-500 to-indigo-700',
        ageRange: [9, 10],
        levels: 12,
        concepts: ['word_problems']
    },
    money_counting: {
        id: 'money_counting',
        title: 'Counting Money',
        description: 'Learn coins and bills',
        icon: '💰',
        color: 'from-green-400 to-green-600',
        ageRange: [6, 7],
        levels: 10,
        concepts: ['money']
    },
    money_change: {
        id: 'money_change',
        title: 'Making Change',
        description: 'Calculate change and prices',
        icon: '💵',
        color: 'from-green-500 to-green-700',
        ageRange: [8, 10],
        levels: 12,
        concepts: ['money']
    },
    measurement_length: {
        id: 'measurement_length',
        title: 'Measuring Length',
        description: 'Inches, feet, centimeters',
        icon: '📏',
        color: 'from-amber-400 to-amber-600',
        ageRange: [7, 9],
        levels: 10,
        concepts: ['measurement']
    },
    measurement_weight: {
        id: 'measurement_weight',
        title: 'Weight & Volume',
        description: 'Pounds, ounces, cups, liters',
        icon: '⚖️',
        color: 'from-amber-500 to-amber-700',
        ageRange: [8, 10],
        levels: 10,
        concepts: ['measurement']
    },
    data_graphs: {
        id: 'data_graphs',
        title: 'Reading Graphs',
        description: 'Bar graphs and charts',
        icon: '📊',
        color: 'from-cyan-400 to-cyan-600',
        ageRange: [8, 10],
        levels: 10,
        concepts: ['data']
    },
    patterns_algebra: {
        id: 'patterns_algebra',
        title: 'Patterns & Algebra',
        description: 'Find patterns and rules',
        icon: '🔢',
        color: 'from-violet-400 to-violet-600',
        ageRange: [9, 10],
        levels: 10,
        concepts: ['algebra']
    }
};
