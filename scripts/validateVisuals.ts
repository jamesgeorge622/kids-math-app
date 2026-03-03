/// <reference types="node" />

// Note: This script runs in Node. 
// We rely on ts-node to execute it, or we can compile it. 
// Assuming ts-node or similar is available or we can run with basic node if we transpile.
// For simplicity in this environment, I'll write it as a TS file that imports app code.

import { MATH_TRACKS } from '../src/data/tracks';
import { generateQuestion } from '../src/utils/questionGenerator';
// import { validateVisualForConcept } from '../src/domain/visualValidation'; // No longer direct usage
import { toRenderableQuestion } from '../src/domain/renderBoundary';
import { ConceptType } from '../src/types/question';

const AGES = [6, 9];
const ITERATIONS = 200;

let totalFailures = 0;

console.log('Starting Strict Render Boundary Validation...');

Object.values(MATH_TRACKS).forEach(track => {
    // Only test tracks with concepts
    if (!track.concepts || track.concepts.length === 0) return;

    const concept = track.concepts[0] as ConceptType;
    console.log(`Testing Track: ${track.id} (${concept})`);

    AGES.forEach(age => {
        let failuresForTrack = 0;
        let boundaryRejections = 0;
        const errors: string[] = [];

        for (let i = 0; i < ITERATIONS; i++) {
            // Random level 1-5
            const level = Math.floor(Math.random() * 5) + 1;
            try {
                const raw = generateQuestion(track.id, level, 1, age);

                // Validate via Boundary
                const result = toRenderableQuestion(raw, {
                    age: age,
                    trackId: track.id,
                    level: level,
                    difficulty: 1
                });

                if (!result.ok) {
                    failuresForTrack++;
                    boundaryRejections++;
                    // Capture first few unique errors
                    if (errors.length < 5) {
                        errors.push(`[Age ${age}] Boundary Rejected: ${result.error}`);
                    }
                } else {
                    // Double check - if visual is required, is it there?
                    // toRenderableQuestion should guarantee this, but good to verify.
                    // Accessing result.value.visual is safe.
                }

            } catch (e) {
                failuresForTrack++;
                errors.push(`[Age ${age}] CRASH: ${e}`);
            }
        }

        if (failuresForTrack > 0) {
            console.error(`  FAIL [Age ${age}]: ${failuresForTrack}/${ITERATIONS} failures (${boundaryRejections} rejections)`);
            errors.forEach(e => console.error(`    - ${e}`));
            totalFailures += failuresForTrack;
        } else {
            // console.log(`  PASS [Age ${age}]`);
        }
    });
});

if (totalFailures > 0) {
    console.error(`\nValidation FAILED with ${totalFailures} total errors.`);
    process.exit(1);
} else {
    console.log('\nValidation PASSED! All visuals compliant.');
    process.exit(0);
}
