// src/lib/r2.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getSignedUrlRequest } from "@aws-sdk/s3-request-presigner";

import {
  R2_ACCESS_KEY_ID,
  R2_ACCOUNT_ID,
  R2_BUCKET_NAME,
  R2_SECRET_ACCESS_KEY,
} from "astro:env/server";

export class R2Service {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = R2_BUCKET_NAME;

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }

  private generateKey(originalFilename: string): string {
    const timestamp = Date.now().toString(36); // Base36 for shorter string
    const random = Math.random().toString(36).substring(2, 6); // 4 random chars
    const ext = originalFilename.split(".").pop(); // Get file extension

    return `${timestamp}-${random}.${ext}`; // Format: timestamp-random.ext
  }

  async uploadFile(
    file: Buffer | Blob,
    filename: string
  ): Promise<{ url: string; key: string }> {
    const key = this.generateKey(filename);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
    });

    await this.client.send(command);
    return {
      url: `https://${this.bucket}.r2.cloudflarestorage.com/${key}`,
      key,
    };
  }

  async getFile(filename: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: filename,
    });

    const response = await this.client.send(command);
    const arrayBuffer = await response.Body?.transformToByteArray();
    return Buffer.from(arrayBuffer as Uint8Array);
  }

  async getSignedUrl(key: string, expiresIn = 86400): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    // Generate a signed URL that expires in 1 hour (3600 seconds) by default
    const signedUrl = await getSignedUrlRequest(this.client, command, {
      expiresIn,
    });
    return signedUrl;
  }
}
