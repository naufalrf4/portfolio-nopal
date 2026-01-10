'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  visible: boolean;
  order: number;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProjects() {
      try {
        const response = await fetch('/api/v1/admin/projects', {
          signal: controller.signal,
        });
        const data = await response.json();
        if (data.success) {
          setProjects(data.data.projects);
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // Error fetching projects
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();

    return () => {
      controller.abort();
    };
  }, []);

  async function toggleVisibility(id: string, currentValue: boolean) {
    try {
      const response = await fetch(`/api/v1/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentValue }),
      });
      const data = await response.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, visible: !currentValue } : p))
        );
      }
    } catch {
      // Error toggling visibility
    }
  }

  async function toggleFeatured(id: string, currentValue: boolean) {
    try {
      const response = await fetch(`/api/v1/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentValue }),
      });
      const data = await response.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: !currentValue } : p))
        );
      }
    } catch {
      // Error toggling featured
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/v1/admin/projects/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // Error deleting project
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Link href="/projects/new">
          <Button>Create Project</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No projects yet. Create your first project!
              </p>
              <Link href="/projects/new">
                <Button>Create Project</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">/{project.slug}</TableCell>
                    <TableCell>
                      <Switch
                        checked={project.featured}
                        onCheckedChange={() => toggleFeatured(project.id, project.featured)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={project.visible}
                        onCheckedChange={() => toggleVisibility(project.id, project.visible)}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
