import { HttpClient, type ClientConfig } from './client';
import { ProjectsClient } from './resources/projects';
import { BlogLinksClient } from './resources/blog-links';
import { GuestbookClient } from './resources/guestbook';
import { ProfileLinksClient } from './resources/profile-links';
import { KnowledgeClient } from './resources/knowledge';
import { ChatLogsClient } from './resources/chat-logs';

export * from './types';
export * from './errors';
export { HttpClient, type ClientConfig };

export class NaufalRFSDK {
  public projects: ProjectsClient;
  public blogs: BlogLinksClient;
  public guestbook: GuestbookClient;
  public profileLinks: ProfileLinksClient;
  public knowledge: KnowledgeClient;
  public chatLogs: ChatLogsClient;

  constructor(config: ClientConfig = {}) {
    const client = new HttpClient(config);

    this.projects = new ProjectsClient(client);
    this.blogs = new BlogLinksClient(client);
    this.guestbook = new GuestbookClient(client);
    this.profileLinks = new ProfileLinksClient(client);
    this.knowledge = new KnowledgeClient(client);
    this.chatLogs = new ChatLogsClient(client);
  }
}

export function createClient(config?: ClientConfig): NaufalRFSDK {
  return new NaufalRFSDK(config);
}

export const defaultClient = new NaufalRFSDK();
