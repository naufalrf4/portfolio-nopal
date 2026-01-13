'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { IngestButton } from './IngestButton';
import { cn } from '@/lib/utils';

interface KnowledgeDoc {
  id: string;
  filename: string;
  content: string;
  indexed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeTableProps {
  docs: KnowledgeDoc[];
  loading: boolean;
  onDelete: (id: string) => Promise<boolean>;
  onIngest: (id: string) => Promise<boolean>;
}

export function KnowledgeTable({ docs, loading, onDelete, onIngest }: KnowledgeTableProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState<KnowledgeDoc | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (doc: KnowledgeDoc) => {
    setDeletingDoc(doc);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingDoc) return;
    setIsDeleting(true);
    try {
      const success = await onDelete(deletingDoc.id);
      if (success) {
        setDeleteModalOpen(false);
        setDeletingDoc(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (docs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div
          className={cn(
            'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4',
            'bg-[#E0E5EC]',
            '[box-shadow:inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]'
          )}
        >
          <FileText className="h-8 w-8 text-[#6B7280]" />
        </div>
        <h3 className="text-lg font-semibold text-[#3D4852] mb-2">No Knowledge Documents</h3>
        <p className="text-[#6B7280] mb-4">Get started by adding your first knowledge document.</p>
        <Button variant="primary" asChild>
          <Link href="/knowledge/new">Add Document</Link>
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#D1D9E6]">
              <TableHead className="text-[#6B7280]">Filename</TableHead>
              <TableHead className="text-[#6B7280]">Status</TableHead>
              <TableHead className="text-[#6B7280] hidden md:table-cell">Content Preview</TableHead>
              <TableHead className="text-[#6B7280]">Updated</TableHead>
              <TableHead className="text-[#6B7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((doc) => (
              <TableRow
                key={doc.id}
                className="border-b border-[#D1D9E6]/50 hover:bg-[#E0E5EC]/50 transition-colors"
              >
                <TableCell className="font-medium text-[#3D4852]">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#3B82F6]" />
                    {doc.filename}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={doc.indexed ? 'success' : 'warning'}>
                    {doc.indexed ? 'Indexed' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#6B7280] text-sm hidden md:table-cell">
                  <div className="line-clamp-2 max-w-md">{doc.content}</div>
                </TableCell>
                <TableCell className="text-[#6B7280] text-sm whitespace-nowrap">
                  {formatDate(doc.updatedAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <IngestButton docId={doc.id} indexed={doc.indexed} onIngest={onIngest} />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => router.push(`/knowledge/${doc.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => openDeleteModal(doc)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Knowledge Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingDoc?.filename}&quot;? This action
              cannot be undone and will remove the document from the RAG system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
