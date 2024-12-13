import type { APIRoute } from "astro";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: import.meta.env.REGION,
  credentials: {
    accessKeyId: import.meta.env.ACCESS,
    secretAccessKey: import.meta.env.SECRET,
  },
});

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log("Starting photo upload...");
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const dt = formData.get("dt") as string;

    console.log("Received file:", file?.name, "for date:", dt);

    if (!file || !dt) {
      console.error("Missing file or date");
      return new Response(
        JSON.stringify({ error: "File and date are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate a unique key for the S3 object
    const fileExtension = file.name.split(".").pop();
    const key = `whiteboard-photos/${dt}-${Date.now()}.${fileExtension}`;
    console.log("Generated S3 key:", key);

    // Create a buffer from the file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Uploading to S3...");
    console.log("Bucket:", import.meta.env.AWS_S3_BUCKET);
    console.log("Region:", import.meta.env.REGION);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: import.meta.env.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);
    console.log("Successfully uploaded to S3");

    // Return the full S3 URL
    const photoUrl = `https://${import.meta.env.AWS_S3_BUCKET}.s3.${
      import.meta.env.REGION
    }.amazonaws.com/${key}`;
    console.log("Generated photo URL:", photoUrl);

    return new Response(JSON.stringify({ photoUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
