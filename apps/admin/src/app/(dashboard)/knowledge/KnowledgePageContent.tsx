'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Plus, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { KnowledgeTable, FreelanceToolPanel } from '@/components/knowledge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface KnowledgeDoc {
  id: string;
  filename: string;
  content: string;
  indexed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function KnowledgePageContent() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'documents' | 'freelance-tool'>('documents');

  const fetchDocs = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/admin/knowledge?limit=50');
      const data = await response.json();
      if (data.success) {
        setDocs(data.data.docs);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      void error;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDocs();
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/v1/admin/knowledge/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setDocs((prev) => prev.filter((doc) => doc.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      void error;
      return false;
    }
  };

  const handleIngest = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/v1/admin/knowledge/${id}/ingest`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setDocs((prev) => prev.map((doc) => (doc.id === id ? { ...doc, indexed: true } : doc)));
        return true;
      }
      return false;
    } catch (error) {
      void error;
      return false;
    }
  };

  const indexedCount = docs.filter((d) => d.indexed).length;
  const pendingCount = docs.filter((d) => !d.indexed).length;

  return (
    <PageWrapper>
      <PageHeader
        title="Knowledge Base"
        description="Manage the knowledge corpus that powers the Agentic Contextual RAG experience"
        icon={<FileText />}
        stats={[
          { label: 'Total', value: pagination?.total || docs.length },
          { label: 'Indexed', value: indexedCount, variant: 'success' },
          { label: 'Pending', value: pendingCount, variant: 'warning' },
        ]}
        actions={
          activeTab === 'documents' ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="primary" asChild>
                <Link href="/knowledge/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Link>
              </Button>
            </div>
          ) : null
        }
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="mb-6 grid w-full max-w-xl grid-cols-2">
          <TabsTrigger value="documents">Knowledge Documents</TabsTrigger>
          <TabsTrigger value="freelance-tool">Freelance Tool</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <KnowledgeTable
            docs={docs}
            loading={loading}
            onDelete={handleDelete}
            onIngest={handleIngest}
          />
        </TabsContent>

        <TabsContent value="freelance-tool">
          <FreelanceToolPanel />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
