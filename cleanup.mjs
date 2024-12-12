import { fileURLToPath } from 'url';
import { dirname } from 'path';

console.log('Current working directory:', dirname(fileURLToPath(import.meta.url)));
import { wordOperations } from './src/db/wordOperations.js';

async function runCleanup() {
    try {
        await wordOperations.cleanupInvalidWords();
        console.log('Cleanup completed successfully.');
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

runCleanup();
