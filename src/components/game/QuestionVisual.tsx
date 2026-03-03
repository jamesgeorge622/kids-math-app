// import { useState, useEffect } from 'react';
import { FractionVisual } from './visuals/FractionVisual';
// import { DivisionVisual } from './visuals/DivisionVisual';
// import { DecimalVisual } from './visuals/DecimalVisual';
// import { PercentageVisual } from './visuals/PercentageVisual';
import { WordProblemVisual } from './visuals/WordProblemVisual';
import { CountingVisual } from './visuals/CountingVisual';
import { AdditionVisual } from './visuals/AdditionVisual';
import { MultiplicationVisual } from './visuals/MultiplicationVisual';
import { NumberBondVisual } from './visuals/NumberBondVisual';
// import { DataVisual } from './visuals/DataVisual';
import { SubtractionVisual } from './visuals/SubtractionVisual';
import { TimeVisual } from './visuals/TimeVisual';
import { PlaceValueVisual } from './visuals/PlaceValueVisual';
// import { SequenceVisual } from './visuals/SequenceVisual';
import { ShapeVisual } from './visuals/ShapeVisual';
import { MoneyVisual } from './visuals/MoneyVisual';
import { ComparisonVisual } from './visuals/ComparisonVisual';
import { MeasurementVisual } from './visuals/MeasurementVisual';
import { HundredsChartVisual } from './visuals/HundredsChartVisual';

import { TenFrameVisual } from './visuals/TenFrameVisual';
import { NumberLineVisual } from './visuals/NumberLineVisual';
import { TimesTableExplorerVisual } from './visuals/TimesTableExplorerVisual';
import { BalanceScaleVisual } from './visuals/BalanceScaleVisual';
import { MeasuringCupVisual } from './visuals/MeasuringCupVisual';
import { BarGraphVisual } from './visuals/BarGraphVisual';
import { DivisionSharingVisual } from './visuals/DivisionSharingVisual';
import { DivisionGroupingVisual } from './visuals/DivisionGroupingVisual';
import { DecimalGridVisual } from './visuals/DecimalGridVisual';
import { ComparingFractionsVisual } from './visuals/ComparingFractionsVisual';
import { MultiDigitMultiplicationVisual } from './visuals/MultiDigitMultiplicationVisual';
import { LongDivisionVisual } from './visuals/LongDivisionVisual';
import { FractionEquationVisual } from './visuals/FractionEquationVisual';
import { DecimalOperationVisual } from './visuals/DecimalOperationVisual';
import { PercentageBatteryVisual } from './visuals/PercentageBatteryVisual';
import { CashRegisterVisual } from './visuals/CashRegisterVisual';

import { Question } from '../../types';

export const QuestionVisual = ({ question }: { question: Question }) => {
    // Strict dispatch based on visual.kind
    return (
        <div key={question.id || JSON.stringify(question.visual)} className="w-full flex justify-center">
            {renderVisual(question)}
        </div>
    );
}

const renderVisual = (question: Question) => {
    if (!question.visual) return null;

    switch (question.visual.kind) {
        case 'fractionModel':
            return <FractionVisual question={question} />;

        case 'emojiRow':
            return <CountingVisual question={question} />;

        case 'twoGroups':
            return <ComparisonVisual question={question} />;

        case 'coinRow':
            return <MoneyVisual question={question} />;

        case 'singleTarget':
            return <ShapeVisual question={question} />;

        case 'tenFrame':
            return <TenFrameVisual question={question} />;

        case 'numberLine':
            return <NumberLineVisual question={question} />;

        case 'clockFace':
            return <TimeVisual question={question} />;

        case 'numberBond':
            return <NumberBondVisual question={question} />;

        case 'baseTenBlocks':
            return <PlaceValueVisual question={question} />;

        case 'wordProblem':
            return <WordProblemVisual question={question} />;

        case 'measurement':
            return <MeasurementVisual question={question} />;

        case 'balanceScale':
            return <BalanceScaleVisual question={question} />;

        case 'measuringCup':
            return <MeasuringCupVisual question={question} />;

        case 'barGraph':
            return <BarGraphVisual data={question.visual as any} />;

        case 'timesTableExplorer':
            return <TimesTableExplorerVisual question={question} />;

        case 'divisionSharing':
            return <DivisionSharingVisual data={question.visual} />;

        case 'divisionGrouping':
            return <DivisionGroupingVisual data={question.visual} />;

        case 'decimalGrid':
            return <DecimalGridVisual data={question.visual} />;

        case 'fractionComparison':
            return <ComparingFractionsVisual data={question.visual} />;

        case 'multiDigitMultiplication':
            return <MultiDigitMultiplicationVisual data={question.visual} />;

        case 'longDivision':
            return <LongDivisionVisual data={question.visual} />;

        case 'fractionEquation':
            return <FractionEquationVisual data={question.visual} />;

        case 'decimalOperation':
            return <DecimalOperationVisual data={question.visual} />;

        case 'percentageBattery':
            return <PercentageBatteryVisual data={question.visual} />;

        case 'cashRegister':
            return <CashRegisterVisual data={question.visual} />;

        case 'multiplication':
            return <MultiplicationVisual question={question} />;

        case 'hundredsChart':
            return <HundredsChartVisual question={question as any} />;

        case 'verticalMath':
            if (question.concept === 'addition') return <AdditionVisual question={question} />;
            if (question.concept === 'subtraction') return (
                <SubtractionVisual question={question} />
            );
            return null;

        case 'subtractionModel':
            return (
                <SubtractionVisual question={question} />
            );

        default:
            return null;
    }
};
