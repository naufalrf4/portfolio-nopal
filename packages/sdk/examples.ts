import { createClient, NotFoundError, ValidationError } from '@naufalrf/sdk';

const client = createClient({
  baseURL: 'http://localhost:3001',
});

async function fetchProjects() {
  try {
    const response = await client.projects.getAll({
      page: 1,
      limit: 10,
      featured: true,
    });

    if (response.data) {
      console.log('Projects:', response.data.projects);
      console.log('Pagination:', response.data.pagination);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

async function fetchProjectBySlug(slug: string) {
  try {
    const response = await client.projects.getBySlug(slug);
    console.log('Project:', response.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error('Project not found');
    } else {
      console.error('Error fetching project:', error);
    }
  }
}

async function fetchBlogLinks() {
  try {
    const response = await client.blogs.getAll({ source: 'medium' });
    console.log('Blog links:', response.data);
  } catch (error) {
    console.error('Error fetching blog links:', error);
  }
}

async function fetchGuestbook() {
  try {
    const response = await client.guestbook.getAll();
    console.log('Guestbook entries:', response.data);
  } catch (error) {
    console.error('Error fetching guestbook:', error);
  }
}

async function createGuestbookEntry(message: string) {
  try {
    const response = await client.guestbook.create({ message });
    console.log('Created entry:', response.data);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation error:', error.details);
    } else {
      console.error('Error creating entry:', error);
    }
  }
}

async function fetchProfileLinks() {
  try {
    const response = await client.profileLinks.getAll();
    console.log('Profile links:', response.data);
  } catch (error) {
    console.error('Error fetching profile links:', error);
  }
}

async function main() {
  await fetchProjects();
  await fetchProjectBySlug('sample-project');
  await fetchBlogLinks();
  await fetchGuestbook();
  await fetchProfileLinks();
}

main();
