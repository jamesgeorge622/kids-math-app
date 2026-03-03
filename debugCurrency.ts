
import { generateQuestion } from './src/utils/questionGenerator';

const testCurrency = () => {
    console.log("Testing Currency Generation...");

    // Test 1: USD
    const qUSD = generateQuestion('money_change', 1, 0, 8, 'USD');
    console.log("USD Question:", qUSD.question);
    console.log("USD Visual Currency:", (qUSD.visual as any).currency);

    // Test 2: EUR
    const qEUR = generateQuestion('money_change', 1, 0, 8, 'EUR');
    console.log("EUR Question:", qEUR.question);
    console.log("EUR Visual Currency:", (qEUR.visual as any).currency);

    if (qEUR.question.includes('€') || qEUR.question.includes('EUR')) {
        console.log("PASS: EUR symbol found in question.");
    } else {
        console.log("FAIL: EUR symbol NOT found in question.");
    }

    if ((qEUR.visual as any).currency === 'EUR') {
        console.log("PASS: Visual currency is EUR.");
    } else {
        console.log("FAIL: Visual currency is " + (qEUR.visual as any).currency);
    }
};

testCurrency();
