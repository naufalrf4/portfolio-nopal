'use client';

import { Link } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import {
  useBlogs,
  BlogCard,
  CreateBlogModal,
  EditBlogModal,
  DeleteConfirmModal,
  PlusIcon,
  BlogLinkIcon,
  NEUMORPHIC_STYLES,
  FILTER_BUTTONS,
} from '@/features/blogs';

export function BlogsPageContent() {
  const {
    filteredBlogLinks,
    loading,
    filter,
    setFilter,
    toggleVisibility,
    createBlogLink,
    updateBlogLink,
    deleteBlogLink,
    blogLinks,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    editingBlogLink,
    deletingBlogLink,
    isDeleting,
    openEditModal,
    openDeleteModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
  } = useBlogs();

  if (loading) {
    return null;
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Blog Links"
        description="Manage your external blog articles and publications"
        icon={<Link />}
        stats={[
          { label: 'Total', value: blogLinks.length },
          {
            label: 'Visible',
            value: blogLinks.filter((b) => b.visible).length,
            variant: 'success',
          },
          {
            label: 'Hidden',
            value: blogLinks.filter((b) => !b.visible).length,
            variant: 'default',
          },
        ]}
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${NEUMORPHIC_STYLES.accent}, ${NEUMORPHIC_STYLES.accentLight})`,
              boxShadow: NEUMORPHIC_STYLES.shadows.small,
              color: 'white',
            }}
          >
            <PlusIcon />
            <span>Add Link</span>
          </button>
        }
      />

      <div
        className="rounded-2xl p-2 mb-8 inline-flex gap-2"
        style={{
          backgroundColor: NEUMORPHIC_STYLES.background,
          boxShadow: NEUMORPHIC_STYLES.shadows.inset,
        }}
      >
        {FILTER_BUTTONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-5 py-2 rounded-xl font-medium transition-all duration-200"
            style={{
              backgroundColor: filter === key ? NEUMORPHIC_STYLES.background : 'transparent',
              boxShadow: filter === key ? NEUMORPHIC_STYLES.shadows.small : 'none',
              color: filter === key ? NEUMORPHIC_STYLES.accent : NEUMORPHIC_STYLES.muted,
            }}
          >
            {label}
            {key === 'all' && ` (${blogLinks.length})`}
            {key === 'visible' && ` (${blogLinks.filter((b) => b.visible).length})`}
            {key === 'hidden' && ` (${blogLinks.filter((b) => !b.visible).length})`}
          </button>
        ))}
      </div>

      {filteredBlogLinks.length === 0 ? (
        <div
          className="rounded-[32px] p-12 text-center"
          style={{
            backgroundColor: NEUMORPHIC_STYLES.background,
            boxShadow: NEUMORPHIC_STYLES.shadows.extruded,
          }}
        >
          <div
            className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
              boxShadow: NEUMORPHIC_STYLES.shadows.small,
            }}
          >
            <span className="text-white">
              <BlogLinkIcon />
            </span>
          </div>
          <h3
            className="font-display text-xl font-bold mb-2"
            style={{ color: NEUMORPHIC_STYLES.foreground }}
          >
            {filter === 'all' ? 'No blog links yet' : `No ${filter} blog links`}
          </h3>
          <p className="mb-6" style={{ color: NEUMORPHIC_STYLES.muted }}>
            {filter === 'all'
              ? 'Create your first blog link to showcase your articles.'
              : `You don't have any ${filter} blog links at the moment.`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${NEUMORPHIC_STYLES.accent}, ${NEUMORPHIC_STYLES.accentLight})`,
                boxShadow: NEUMORPHIC_STYLES.shadows.small,
                color: 'white',
              }}
            >
              <PlusIcon />
              <span>Add Your First Link</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogLinks.map((blogLink) => (
            <BlogCard
              key={blogLink.id}
              blogLink={blogLink}
              onEdit={() => openEditModal(blogLink)}
              onDelete={() => openDeleteModal(blogLink)}
              onToggleVisibility={() => toggleVisibility(blogLink.id, blogLink.visible)}
            />
          ))}
        </div>
      )}

      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={async (data) => {
          await createBlogLink(data);
        }}
      />

      <EditBlogModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={async (data) => {
          if (editingBlogLink) {
            await updateBlogLink(editingBlogLink.id, data);
          }
        }}
        blogLink={editingBlogLink}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (deletingBlogLink) {
            deleteBlogLink(deletingBlogLink.id);
          }
        }}
        title={deletingBlogLink?.title || ''}
        isDeleting={isDeleting}
      />

      <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} label="Add Blog Link" />
    </PageWrapper>
  );
}
