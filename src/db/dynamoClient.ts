import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB Client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
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
