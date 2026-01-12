export interface BlogLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  source: string;
  publishedAt?: string | Date;
}
