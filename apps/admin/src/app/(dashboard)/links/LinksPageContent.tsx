'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Link2, Plus } from 'lucide-react';
import {
  useLinks,
  LinkCard,
  LinkTable,
  LinkModal,
  DeleteConfirmModal,
  EmptyState,
  FilterButtons,
  SearchBar,
  type ProfileLink,
  type ViewMode,
} from '@/features/links';

export function LinksPageContent() {
  const {
    filteredLinks,
    loading,
    filterMode,
    setFilterMode,
    searchQuery,
    setSearchQuery,
    stats,
    toggleVisibility,
    createLink,
    updateLink,
    deleteLink,
  } = useLinks();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ProfileLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<ProfileLink | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreateModal() {
    setEditingLink(null);
    setIsModalOpen(true);
  }

  function openEditModal(link: ProfileLink) {
    setEditingLink(link);
    setIsModalOpen(true);
  }

  function openDeleteModal(link: ProfileLink) {
    setDeletingLink(link);
    setIsDeleteModalOpen(true);
  }

  async function handleSubmit(formData: { label: string; url: string; icon: string }) {
    if (editingLink) {
      return await updateLink(editingLink.id, formData);
    }
    return await createLink(formData);
  }

  async function handleDelete() {
    if (!deletingLink) return;
    setDeleting(true);
    try {
      const result = await deleteLink(deletingLink.id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setDeletingLink(null);
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <TooltipProvider>
      <PageWrapper>
        <PageHeader
          title="Profile Links"
          description="Manage your social media and contact links"
          icon={<Link2 />}
          stats={[
            { label: 'Total', value: stats.total },
            { label: 'Visible', value: stats.visible, variant: 'success' },
            { label: 'Hidden', value: stats.hidden, variant: 'default' },
          ]}
          actions={
            <Button variant="primary" onClick={openCreateModal} className="gap-2">
              <Plus className="h-5 w-5" />
              Add Link
            </Button>
          }
        />

        <FilterButtons filterMode={filterMode} onFilterChange={setFilterMode} stats={stats} />

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {filteredLinks.length === 0 ? (
          <EmptyState
            hasSearchQuery={!!searchQuery}
            searchQuery={searchQuery}
            onCreateClick={openCreateModal}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLinks.map((link, index) => (
              <LinkCard
                key={link.id}
                link={link}
                index={index}
                onEdit={() => openEditModal(link)}
                onDelete={() => openDeleteModal(link)}
                onToggleVisibility={() => toggleVisibility(link)}
              />
            ))}
          </div>
        ) : (
          <LinkTable
            links={filteredLinks}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onToggleVisibility={toggleVisibility}
          />
        )}

        <LinkModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleSubmit}
          editingLink={editingLink}
        />

        <DeleteConfirmModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleDelete}
          linkLabel={deletingLink?.label || ''}
          deleting={deleting}
        />

        <FloatingActionButton onClick={openCreateModal} label="Add Profile Link" />
      </PageWrapper>
    </TooltipProvider>
  );
}
