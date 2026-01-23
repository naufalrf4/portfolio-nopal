export interface BlogLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  source: string;
  category?: string | null;
  publishedAt?: string | Date;
}
