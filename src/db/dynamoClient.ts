import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB Client
const client = new DynamoDBClient({
  region: process.env.REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS as string,
    secretAccessKey: process.env.SECRET as string,
  },
});

// Create a document client for easier handling of data
export const dynamoDb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    // Remove undefined values
    removeUndefinedValues: true,
    // Convert empty strings
    convertEmptyValues: true,
  },
});

export default dynamoDb;
