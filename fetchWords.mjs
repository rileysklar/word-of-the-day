import { wordOperations } from './src/db/wordOperations.ts';

async function fetchWords() {
    try {
        const words = await wordOperations.getAllWords();
        console.log(words);
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

fetchWords();
