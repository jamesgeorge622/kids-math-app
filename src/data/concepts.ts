
export const MATH_CONCEPTS: Record<string, { title: string; explanation: { intro: string; visual: string; example: string; tip: string } }> = {
    counting: {
        title: 'Counting',
        explanation: {
            intro: 'Counting means saying numbers in order, one by one.',
            visual: 'Count each object by pointing at it!',
            example: 'Let\'s count together: 1, 2, 3, 4, 5!',
            tip: 'Touch each object as you count so you don\'t miss any!'
        }
    },
    number_recognition: {
        title: 'Number Recognition',
        explanation: {
            intro: 'Each number has its own special symbol and name.',
            visual: 'The symbol "5" represents five things.',
            example: 'When you see "3", that means three objects!',
            tip: 'Practice writing numbers and saying their names!'
        }
    },
    shapes: {
        title: 'Shapes',
        explanation: {
            intro: 'Shapes are all around us! Each shape has its own name.',
            visual: 'Circles are round, squares have 4 equal sides.',
            example: 'A ball is a circle, a book is a rectangle!',
            tip: 'Look for shapes in your house - windows, plates, doors!'
        }
    },
    colors: {
        title: 'Colors',
        explanation: {
            intro: 'Colors help us describe and sort things.',
            visual: 'Red apples, blue sky, yellow sun!',
            example: 'Can you find all the red things in your room?',
            tip: 'Colors make the world beautiful and help us organize!'
        }
    },
    comparison: {
        title: 'More or Less',
        explanation: {
            intro: 'We can compare groups to see which has MORE or LESS.',
            visual: 'Count each group and compare the numbers!',
            example: '5 cookies is MORE than 3 cookies!',
            tip: 'Line up objects to see which group is bigger!'
        }
    },
    addition: {
        title: 'Addition',
        explanation: {
            intro: 'Addition means putting numbers together to make a bigger number.',
            visual: 'Start with one group, then add more!',
            example: 'If you have 3 apples and get 2 more, now you have 5 apples total!',
            tip: 'You can count on your fingers or use objects to help!'
        }
    },
    subtraction: {
        title: 'Subtraction',
        explanation: {
            intro: 'Subtraction means taking away. The number gets smaller!',
            visual: 'Start with a group, then take some away.',
            example: 'If you have 5 cookies and eat 2, you have 3 left!',
            tip: 'You can count backwards or cross out objects!'
        }
    },
    number_bonds: {
        title: 'Number Bonds',
        explanation: {
            intro: 'Number bonds show how numbers can be split or combined.',
            visual: '5 can be split into 2 and 3, or 1 and 4!',
            example: '8 = 5 + 3, or 8 = 6 + 2, or 8 = 4 + 4',
            tip: 'Learning number bonds helps you add and subtract faster!'
        }
    },
    skip_counting: {
        title: 'Skip Counting',
        explanation: {
            intro: 'Skip counting means jumping by the same number each time.',
            visual: 'Count by 2s: 2, 4, 6, 8, 10!',
            example: 'Count by 5s: 5, 10, 15, 20, 25!',
            tip: 'Skip counting helps with multiplication later!'
        }
    },
    place_value: {
        title: 'Place Value',
        explanation: {
            intro: 'Each digit in a number has a special place - ones, tens, hundreds.',
            visual: '23 means 2 tens and 3 ones = 20 + 3',
            example: '45 = 4 tens + 5 ones = 40 + 5',
            tip: 'The position of a digit changes its value!'
        }
    },
    time: {
        title: 'Telling Time',
        explanation: {
            intro: 'Clocks help us know what time it is!',
            visual: 'The short hand shows hours, the long hand shows minutes.',
            example: 'When the long hand points to 12 and short hand to 3, it\'s 3 o\'clock!',
            tip: 'Start by learning the hour, then add minutes!'
        }
    },
    carrying: {
        title: 'Carrying in Addition',
        explanation: {
            intro: 'When adding makes a number bigger than 9, we carry to the next place.',
            visual: '27 + 6: First add 7+6=13, write 3 and carry the 1 ten',
            example: '27 + 6 = 2 tens + 13 ones = 3 tens + 3 ones = 33',
            tip: 'Think: Does my answer in the ones place make a new ten?'
        }
    },
    borrowing: {
        title: 'Borrowing in Subtraction',
        explanation: {
            intro: 'When we can\'t subtract, we borrow from the next place.',
            visual: '32 - 5: Can\'t take 5 from 2, so borrow 1 ten',
            example: '32 - 5: Borrow 1 ten, now it\'s 2 tens and 12 ones, 12-5=7, answer is 27',
            tip: 'Remember: Borrowing changes a ten into 10 ones!'
        }
    },
    multiplication: {
        title: 'Multiplication',
        explanation: {
            intro: 'Multiplication means making equal groups.',
            visual: '3 × 4 means "3 groups of 4"',
            example: '3 × 4 is the same as 4 + 4 + 4 = 12',
            tip: 'The first number tells you HOW MANY groups. The second tells you HOW MUCH in each group!'
        }
    },
    division: {
        title: 'Division',
        explanation: {
            intro: 'Division means splitting into equal groups or sharing fairly.',
            visual: '12 ÷ 3 means "split 12 into 3 equal groups"',
            example: '12 cookies shared among 3 friends = 4 cookies each',
            tip: 'Division is the opposite of multiplication!'
        }
    },
    fractions: {
        title: 'Fractions',
        explanation: {
            intro: 'Fractions show parts of a whole.',
            visual: '1/2 means 1 piece out of 2 equal pieces.',
            example: 'If you cut a pizza into 4 pieces, each piece is 1/4',
            tip: 'The bottom number shows how many pieces total, the top shows how many you have!'
        }
    },
    decimals: {
        title: 'Decimals',
        explanation: {
            intro: 'Decimals are another way to show parts of a whole.',
            visual: '0.5 is the same as 1/2 or one half',
            example: '$2.50 means 2 dollars and 50 cents (50/100 of a dollar)',
            tip: 'The dot is called a decimal point. Numbers after it are less than 1!'
        }
    },
    percentages: {
        title: 'Percentages',
        explanation: {
            intro: 'Percent means "out of 100". The symbol is %.',
            visual: '50% means 50 out of 100, which is half!',
            example: '25% is 25 out of 100, which is the same as 1/4',
            tip: '100% means the whole thing, 0% means none!'
        }
    },
    word_problems: {
        title: 'Word Problems',
        explanation: {
            intro: 'Word problems tell math stories! Read carefully to find the numbers.',
            visual: 'Look for key words: "total" means add, "left" means subtract.',
            example: 'If Sarah has 5 apples and gets 3 more, how many total? 5 + 3 = 8!',
            tip: 'Underline the numbers and circle what the question asks!'
        }
    },
    money: {
        title: 'Money',
        explanation: {
            intro: 'Money helps us buy things! We count coins and bills.',
            visual: 'Penny = 1¢, Nickel = 5¢, Dime = 10¢, Quarter = 25¢',
            example: '2 quarters + 1 dime = 25¢ + 25¢ + 10¢ = 60¢',
            tip: 'Start with the biggest coins first when counting!'
        }
    },
    measurement: {
        title: 'Measurement',
        explanation: {
            intro: 'Measurement tells us how long, heavy, or big something is.',
            visual: 'Inch, foot, yard for length. Ounce, pound for weight.',
            example: 'A pencil is about 7 inches long. Your height might be 4 feet!',
            tip: 'Use the right tool: ruler for length, scale for weight!'
        }
    },
    data: {
        title: 'Reading Graphs',
        explanation: {
            intro: 'Graphs show information in a picture! They help us compare things.',
            visual: 'Bar graphs use bars - taller bars mean more!',
            example: 'If the "apples" bar is at 5 and "oranges" is at 3, there are 2 more apples.',
            tip: 'Always read the labels on the bottom and side of the graph!'
        }
    },
    algebra: {
        title: 'Patterns & Algebra',
        explanation: {
            intro: 'Patterns repeat! Algebra helps us find what comes next.',
            visual: 'If the pattern is 2, 4, 6, 8... each number grows by 2!',
            example: 'Pattern: 5, 10, 15, 20... Rule: Add 5 each time. Next: 25!',
            tip: 'Look for what changes between numbers to find the rule!'
        }
    }
};
