import { Storage } from '@google-cloud/storage';

interface ServiceAccountCredentials {
  client_email?: string;
  private_key?: string;
}

type AssetValue = string | null | undefined;

function getCredentials(): ServiceAccountCredentials | undefined {
  const rawCredentials = process.env.GCS_SERVICE_ACCOUNT_JSON?.trim();

  if (!rawCredentials) {
    return undefined;
  }

  const parsed = JSON.parse(rawCredentials) as ServiceAccountCredentials;
  return parsed.client_email && parsed.private_key ? parsed : undefined;
}

function getRequiredEnv(name: 'GCS_BUCKET_NAME' | 'GCS_PROJECT_ID'): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

let cachedStorageClient: Storage | null = null;

function getStorageClient(): Storage {
  if (cachedStorageClient) {
    return cachedStorageClient;
  }

  const credentials = getCredentials();
  cachedStorageClient = new Storage({
    projectId: getRequiredEnv('GCS_PROJECT_ID'),
    ...(credentials ? { credentials } : {}),
  });

  return cachedStorageClient;
}

function getBucketName(): string {
  return getRequiredEnv('GCS_BUCKET_NAME');
}

function normalizePublicBaseUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\/+$/, '');
}

function extractStorageKeyFromUrl(value: string): string | null {
  try {
    const parsedUrl = new URL(value);
    const bucketName = process.env.GCS_BUCKET_NAME?.trim();
    const publicBaseUrl = normalizePublicBaseUrl(process.env.GCS_PUBLIC_BASE_URL);

    if (publicBaseUrl && value.startsWith(`${publicBaseUrl}/`)) {
      return decodeURIComponent(value.slice(publicBaseUrl.length + 1)) || null;
    }

    if (!bucketName) {
      return null;
    }

    const rawPath = decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ''));

    if (parsedUrl.hostname === 'storage.googleapis.com' && rawPath.startsWith(`${bucketName}/`)) {
      return rawPath.slice(bucketName.length + 1) || null;
    }

    if (parsedUrl.hostname === `${bucketName}.storage.googleapis.com`) {
      return rawPath || null;
    }

    return null;
  } catch {
    return null;
  }
}

export function normalizeStoredAssetValue(value: AssetValue): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (!/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return extractStorageKeyFromUrl(trimmedValue) ?? trimmedValue;
}

export type UploadFolder = 'projects' | 'about' | 'achievements' | 'resumes';

export interface UploadResult {
  key: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'application/rtf',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export class StorageService {
  async uploadFile(file: File, folder: UploadFolder): Promise<UploadResult> {
    this.validateFile(file, folder);

    const key = this.generateKey(file.name, folder);
    const buffer = Buffer.from(await file.arrayBuffer());

    await getStorageClient()
      .bucket(getBucketName())
      .file(key)
      .save(buffer, {
        resumable: false,
        metadata: {
          contentType: file.type,
          cacheControl: this.getCacheControl(folder),
        },
      });

    return { key };
  }

  async signGetUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const [signedUrl] = await getStorageClient()
      .bucket(getBucketName())
      .file(key)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiresInSeconds * 1000,
      });

    return signedUrl;
  }

  async deleteFile(key: string): Promise<void> {
    await getStorageClient().bucket(getBucketName()).file(key).delete({ ignoreNotFound: true });
  }

  async getPresignedUploadUrl(
    filename: string,
    folder: UploadFolder
  ): Promise<{ url: string; key: string }> {
    const key = this.generateKey(filename, folder);
    const [url] = await getStorageClient()
      .bucket(getBucketName())
      .file(key)
      .getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 3600 * 1000,
        contentType: 'application/octet-stream',
      });

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

  private getCacheControl(folder: UploadFolder): string {
    return folder === 'resumes'
      ? 'public, max-age=3600, s-maxage=3600'
      : 'public, max-age=31536000, immutable';
  }
}

export const storageService = new StorageService();
