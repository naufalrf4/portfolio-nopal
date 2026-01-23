import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3Client = new S3Client({
  region: process.env.R2_REGION ?? 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export type UploadFolder = 'projects' | 'about' | 'achievements' | 'resumes';

export interface UploadResult {
  key: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class StorageService {
  async uploadFile(file: File, folder: UploadFolder): Promise<UploadResult> {
    this.validateFile(file, folder);

    const key = this.generateKey(file.name, folder);
    const buffer = Buffer.from(await file.arrayBuffer());

    const params: PutObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(params));

    return { key };
  }

  async signGetUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  }

  async deleteFile(key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  }

  async getPresignedUploadUrl(
    filename: string,
    folder: UploadFolder
  ): Promise<{ url: string; key: string }> {
    const key = this.generateKey(filename, folder);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { url, key };
  }

  private validateFile(file: File, folder: UploadFolder): void {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    const allowedTypes = folder === 'resumes' ? ALLOWED_DOCUMENT_TYPES : ALLOWED_IMAGE_TYPES;

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }

  private generateKey(filename: string, folder: UploadFolder): string {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${folder}/${timestamp}-${sanitizedFilename}`;
  }
}

export const storageService = new StorageService();
