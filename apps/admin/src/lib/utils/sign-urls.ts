import { storageService } from '@/lib/services/storage';

type SignableRecord = object;

interface SignConfig {
  fields?: string[];
  nested?: Record<string, string[]>;
}

function isS3Key(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const urlPatterns = [/^https?:\/\//, /^\/api\//];

  for (const pattern of urlPatterns) {
    if (pattern.test(value)) return false;
  }

  return value.includes('/');
}

export async function signAssetUrls<T extends SignableRecord>(
  record: T,
  config: SignConfig,
  expiresInSeconds = 3600
): Promise<T> {
  if (!record) return record;

  const signedRecord = { ...record } as Record<string, unknown>;

  if (config.fields) {
    const promises = config.fields.map(async (field) => {
      const value = signedRecord[field];
      if (typeof value === 'string' && isS3Key(value)) {
        signedRecord[field] = await storageService.signGetUrl(value, expiresInSeconds);
      }
    });
    await Promise.all(promises);
  }

  if (config.nested) {
    const nestedPromises = Object.entries(config.nested).map(async ([arrayField, fields]) => {
      const array = signedRecord[arrayField];
      if (Array.isArray(array)) {
        signedRecord[arrayField] = await Promise.all(
          array.map(async (item) => {
            if (!item || typeof item !== 'object') return item;

            const signedItem: Record<string, unknown> = { ...(item as Record<string, unknown>) };
            const itemPromises = fields.map(async (field) => {
              const value = signedItem[field];
              if (typeof value === 'string' && isS3Key(value)) {
                signedItem[field] = await storageService.signGetUrl(value, expiresInSeconds);
              }
            });
            await Promise.all(itemPromises);
            return signedItem;
          })
        );
      }
    });
    await Promise.all(nestedPromises);
  }

  return signedRecord as T;
}

export async function signAssetUrlsMany<T extends SignableRecord>(
  records: T[],
  config: SignConfig,
  expiresInSeconds = 3600
): Promise<T[]> {
  if (!records || !Array.isArray(records)) return records;

  return Promise.all(records.map((record) => signAssetUrls(record, config, expiresInSeconds)));
}

export async function signStringArray(keys: string[], expiresInSeconds = 3600): Promise<string[]> {
  if (!keys || !Array.isArray(keys)) return keys;

  return Promise.all(
    keys.map(async (key) => {
      if (key && isS3Key(key)) {
        return storageService.signGetUrl(key, expiresInSeconds);
      }
      return key;
    })
  );
}
