
// Pet type used in types, but not needed here strictly if we use numbers for stages
// import { Pet } from '../types';

// Configuration
const BASE_XP = 100; // XP needed for Level 1 -> 2
const EXPONENT = 1.5; // Growth factor (1.5 = Standard, 1.2 = Fast, 2.0 = Slow)

/**
 * Calculates the total XP required to reach a specific level (start of that level).
 */
export const getXpForLevel = (level: number): number => {
    if (level <= 1) return 0;
    // Formula: Sum of XP for previous levels? 
    // Or simplified curve: TotalXP = BASE * (Level-1)^EXPONENT * 10? 
    // Let's use cumulative sum for precise control or direct formula.
    // Direct formula: Total XP = Constant * (Level ^ Exponent)

    return Math.floor(BASE_XP * Math.pow(level - 1, EXPONENT) * 10);
};

// Inverse: Calculate Level from Total XP
export const getLevelFromXp = (totalXp: number): number => {
    // Approx inverse of the formula above
    // xp = Base * (L-1)^Exp * 10
    // xp / (Base*10) = (L-1)^Exp
    // (xp / (Base*10))^(1/Exp) = L - 1
    // L = (xp / (Base*10))^(1/Exp) + 1

    if (totalXp <= 0) return 1;
    let level = 1;
    // Iterative check for safety/precision or direct math
    // Direct math:
    const calculated = Math.pow(totalXp / (BASE_XP * 5), 1 / EXPONENT) + 1;

    // Safety check with iterative approach due to floor/rounding
    // Optimization: Predict and scan nearby
    level = Math.floor(calculated);
    if (level < 1) level = 1;

    return level;
};

/**
 * Returns progress towards next level (0 to 100)
 */
export const getLevelProgress = (totalXp: number) => {
    const currentLevel = getLevelFromXp(totalXp);
    const nextLevel = currentLevel + 1;

    const xpStart = getXpForLevel(currentLevel);
    const xpEnd = getXpForLevel(nextLevel);

    const currentLevelXp = totalXp - xpStart;
    const requiredXp = xpEnd - xpStart; // XP needed for this specific level

    return {
        level: currentLevel,
        currentLevelXp, // XP earned in this level
        requiredXp,     // XP needed to complete this level
        percent: Math.min(100, Math.max(0, (currentLevelXp / requiredXp) * 100))
    };
};

/**
 * Pet Evolution Logic
 * Determines the visual stage based on Level
 */
export const getPetStage = (level: number): number => {
    if (level < 5) return 1; // Egg
    if (level < 20) return 2; // Baby
    if (level < 50) return 3; // Child
    if (level < 100) return 4; // Teen
    return 5; // Adult/Master
};

export const getPetStageName = (stage: number): string => {
    switch (stage) {
        case 1: return 'Egg';
        case 2: return 'Baby';
        case 3: return 'Kid';
        case 4: return 'Teen';
        case 5: return 'Master';
        default: return 'Unknown';
    }
};

/**
 * XP Reward Logic
 */
export const calculateXpReward = (difficulty: number, streak: number): number => {
    // Actually, let's use difficulty to scale rewards!
    const base = 10 * Math.max(1, difficulty); // Difficulty 1 = 10xp, Diff 2 = 20xp
    const streakBonus = Math.min(50, streak * 2);
    return Math.round(base * (1 + streakBonus / 100));
};

export const getPetEmoji = (type: 'dragon' | 'robot' | 'cat' | 'lion' | 'tiger' | 'panda' | 'fox' | 'koala' | 'frog' | 'unicorn' | 'octopus', stage: number): string => {
    // Stage 1 is always Egg for biological pets, specific for Robot
    if (stage === 1) {
        if (type === 'robot') return '🔩';
        return '🥚';
    }

    switch (type) {
        case 'dragon':
            if (stage === 2) return '🐲';
            if (stage === 3) return '🐉';
            if (stage === 4) return '🔥';
            return '👑';
        case 'robot':
            if (stage === 2) return '🤖';
            if (stage === 3) return '🦾';
            if (stage === 4) return '🚀';
            return '🛸';
        case 'cat':
            if (stage === 2) return '😺';
            if (stage === 3) return '🐈';
            if (stage === 4) return '🐯';
            return '🦁';
        case 'lion':
            if (stage === 2) return '🦁'; // Cub
            if (stage === 3) return '🦁'; // Teen Mane
            if (stage === 4) return '👑'; // Prince
            return '🦁'; // King
        case 'tiger':
            if (stage === 2) return '🐱'; // Cub
            if (stage === 3) return '🐯';
            if (stage === 4) return '🐅';
            return '🌟';
        case 'panda':
            if (stage === 2) return '🐼'; // Face
            if (stage === 3) return '🐼'; // Body
            if (stage === 4) return '🎋'; // Bamboo master
            return '🥋'; // Kung Fu
        case 'fox':
            if (stage === 2) return '🦊'; // Face
            if (stage === 3) return '🦊'; // Body
            if (stage === 4) return '🧣'; // Scarf
            return '🌟'; // Star Fox
        case 'koala':
            if (stage === 2) return '🐨'; // Face
            if (stage === 3) return '🐨'; // Body
            if (stage === 4) return '🐨'; // Teen
            return '👑'; // King Koala
        case 'frog':
            if (stage === 2) return '🐸'; // Tadpole
            if (stage === 3) return '🐸'; // Frog
            if (stage === 4) return '👑'; // Prince
            return '🐸'; // King
        case 'unicorn':
            if (stage === 2) return '🦄'; // Head
            if (stage === 3) return '🦄'; // Body
            if (stage === 4) return '🌈'; // Rainbow
            return '✨'; // Magic
        case 'octopus':
            if (stage === 2) return '🐙'; // Baby
            if (stage === 3) return '🐙'; // Adult
            if (stage === 4) return '🌊'; // Wave
            return '👑'; // King
    }
    return '❓';
};

// Store Configuration
export const FOOD_ITEMS = [
    { id: 'apple', name: 'Apple', emoji: '🍎', cost: 10, xp: 5, minLevel: 1 },
    { id: 'cookie', name: 'Cookie', emoji: '🍪', cost: 25, xp: 15, minLevel: 5 },
    { id: 'burger', name: 'Burger', emoji: '🍔', cost: 50, xp: 35, minLevel: 10 },
    { id: 'cake', name: 'Cake', emoji: '🎂', cost: 100, xp: 80, minLevel: 20 },
] as const;

export const canBuyFood = (coins: number, level: number, item: typeof FOOD_ITEMS[number]): boolean => {
    return coins >= item.cost && level >= item.minLevel;
};
