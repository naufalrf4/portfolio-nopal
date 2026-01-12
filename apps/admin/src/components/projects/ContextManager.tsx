'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProjectContext {
  id: string;
  title: string;
  type: string;
  content: string;
  order: number;
}

interface ContextManagerProps {
  projectId: string;
}

const CONTEXT_TYPES = [
  'CONTEXT',
  'ROLE',
  'DECISIONS',
  'TRADEOFFS',
  'RESULT',
  'ARCHITECTURE',
  'OPERATIONS',
  'METRICS',
];

export default function ContextManager({ projectId }: ContextManagerProps) {
  const [contexts, setContexts] = useState<ProjectContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContext, setEditingContext] = useState<ProjectContext | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'CONTEXT',
    content: '',
    order: 0,
  });

  useEffect(() => {
    fetchContexts();
  }, [projectId]);

  async function fetchContexts() {
    try {
      const response = await fetch(`/api/v1/admin/contexts?projectId=${projectId}`);
      const data = await response.json();
      if (data.success) {
        setContexts(data.data);
      }
    } catch {
      
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingContext(null);
    setFormData({
      title: '',
      type: 'CONTEXT',
      content: '',
      order: contexts.length,
    });
    setIsDialogOpen(true);
  }

  function openEditDialog(context: ProjectContext) {
    setEditingContext(context);
    setFormData({
      title: context.title,
      type: context.type,
      content: context.content,
      order: context.order,
    });
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        projectId: editingContext ? undefined : projectId,
      };

      const url = editingContext
        ? `/api/v1/admin/contexts/${editingContext.id}`
        : '/api/v1/admin/contexts';
      const method = editingContext ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setIsDialogOpen(false);
        fetchContexts();
      } else {
        alert('Failed to save context: ' + JSON.stringify(data.error));
      }
    } catch {
      alert('An error occurred while saving the context');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this context?')) return;

    try {
      const response = await fetch(`/api/v1/admin/contexts/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchContexts();
      }
    } catch {
      
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">Loading contexts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Context Sections ({contexts.length})</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>Add Context</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingContext ? 'Edit Context' : 'Create Context'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  {CONTEXT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  rows={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value, 10),
                    }))
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingContext ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contexts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No context sections yet. Add your first context!
            </p>
            <Button onClick={openCreateDialog}>Add Context</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {contexts.map((context) => (
              <Card key={context.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{context.title}</h4>
                      <Badge variant="outline" className="mt-1">
                        {context.type}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(context)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(context.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {context.content.substring(0, 200)}
                    {context.content.length > 200 ? '...' : ''}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
