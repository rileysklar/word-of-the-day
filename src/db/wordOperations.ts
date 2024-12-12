import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "./dynamoClient";

const TABLE_NAME = "word-of-the-day";

export interface WordEntry {
  wd: string;
  dt: string;
  definition: string;
  partOfSpeech: string;
  example?: string;
  photoUrl?: string;
}

export const wordOperations = {
  // Add a new word
  async addWord(wordEntry: WordEntry) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: wordEntry,
    });

    return await dynamoDb.send(command);
  },

  // Get a word by date
  async getWordByDate(date: string) {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "dt = :date",
      ExpressionAttributeValues: {
        ":date": date,
      },
    });

    const response = await dynamoDb.send(command);
    return response.Items?.[0] as WordEntry | undefined;
  },

  // Get all words
  async getAllWords() {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await dynamoDb.send(command);
    return response.Items as WordEntry[];
  },

  // Update a word
  async updateWord(word: string, updates: Partial<Omit<WordEntry, "wd">>) {
    const updateExpression = Object.keys(updates)
      .map((key, index) => `#${key} = :${key}`)
      .join(", ");

    const expressionAttributeNames = Object.keys(updates).reduce(
      (acc, key) => ({
        ...acc,
        [`#${key}`]: key,
      }),
      {}
    );

    const expressionAttributeValues = Object.entries(updates).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [`:${key}`]: value,
      }),
      {}
    );

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { wd: word },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const response = await dynamoDb.send(command);
    return response.Attributes as WordEntry;
  },

  // Delete a word by date
  async deleteWord(date: string) {
    // First, find the word by date
    const word = await this.getWordByDate(date);
    if (!word) {
      throw new Error("Word not found");
    }

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { wd: word.wd },
    });

    return await dynamoDb.send(command);
  },

  // Cleanup invalid word entries
  async cleanupInvalidWords() {
    const words = await this.getAllWords();

    for (const word of words) {
      const isInvalid = !word.wd || !word.partOfSpeech || !word.dt;
      if (isInvalid) {
        console.log(`Deleting invalid word entry: ${word.dt}`);
        await this.deleteWord(word.dt);
      }
    }
  },
};

export default wordOperations;
