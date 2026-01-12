export interface GuestbookEntry {
  id: string;
  userId: string;
  message: string;
  visible: boolean;
  createdAt: string;
  user: {
    name: string;
    image: string | null;
  };
}
