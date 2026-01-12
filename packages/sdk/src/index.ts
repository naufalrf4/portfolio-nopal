import { HttpClient, type ClientConfig } from './client';
import { ProjectsClient } from './resources/projects';
import { BlogLinksClient } from './resources/blog-links';
import { GuestbookClient } from './resources/guestbook';
import { ProfileLinksClient } from './resources/profile-links';

export * from './types';
export * from './errors';
export { HttpClient, type ClientConfig };

export class NaufalRFSDK {
  public projects: ProjectsClient;
  public blogs: BlogLinksClient;
  public guestbook: GuestbookClient;
  public profileLinks: ProfileLinksClient;

  constructor(config: ClientConfig = {}) {
    const client = new HttpClient(config);

    this.projects = new ProjectsClient(client);
    this.blogs = new BlogLinksClient(client);
    this.guestbook = new GuestbookClient(client);
    this.profileLinks = new ProfileLinksClient(client);
  }
}

export function createClient(config?: ClientConfig): NaufalRFSDK {
  return new NaufalRFSDK(config);
}

export const defaultClient = new NaufalRFSDK();
