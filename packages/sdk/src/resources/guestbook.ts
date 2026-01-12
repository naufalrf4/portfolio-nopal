import type { HttpClient } from '../client';
import type {
  GuestbookEntry,
  CreateGuestbookEntryInput,
  GuestbookEntriesResponse,
  GuestbookEntryResponse,
} from '../types';

export class GuestbookClient {
  constructor(private client: HttpClient) {}

  async getAll(): Promise<GuestbookEntriesResponse> {
    const entries = await this.client.get<GuestbookEntry[]>('/api/v1/public/guestbook');

    return {
      success: true,
      data: entries,
    };
  }

  async create(input: CreateGuestbookEntryInput): Promise<GuestbookEntryResponse> {
    const entry = await this.client.post<GuestbookEntry>('/api/v1/public/guestbook', input);

    return {
      success: true,
      data: entry,
    };
  }
}
