export interface GuestbookEntry {
  id: string;
  message: string;
  createdAt: string;
  user?: {
    name?: string;
    image?: string;
  } | null;
}
