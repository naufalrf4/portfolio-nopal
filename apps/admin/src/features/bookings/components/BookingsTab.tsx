'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Calendar,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  CheckCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils/date';
import { getErrorMessage } from '@/lib/utils/api';
import type { Booking, FilterType } from '../types/bookings.types';
import { FILTER_BUTTONS } from '../constants';
import { ActionButton } from './ActionButton';
import { DetailField } from './DetailField';

interface BookingsTabProps {
  onPendingCountChange: (count: number) => void;
}

export function BookingsTab({ onPendingCountChange }: BookingsTabProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const limit = 20;

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/v1/admin/bookings?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load bookings');
      }

      if (data.success && data.data?.bookings) {
        setBookings(data.data.bookings);
        setTotalPages(data.data.pagination.totalPages);

        const pending = data.data.bookings.filter((b: Booking) => b.status === 'PENDING').length;
        onPendingCountChange(pending);
      } else {
        setBookings([]);
        setTotalPages(1);
        onPendingCountChange(0);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load bookings'));
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, onPendingCountChange]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  function openDeleteModal(booking: Booking) {
    setDeletingBooking(booking);
    setIsDeleteModalOpen(true);
  }

  function openDetailModal(booking: Booking) {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  }

  async function handleDelete() {
    if (!deletingBooking) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/v1/admin/bookings/${deletingBooking.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Booking deleted successfully');
        setIsDeleteModalOpen(false);
        fetchBookings();
      } else {
        const errorMsg =
          typeof data.error === 'string'
            ? data.error
            : data.error?.message || 'Failed to delete booking';
        toast.error(errorMsg);
      }
    } catch {
      toast.error('Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  }

  async function updateStatus(id: string, status: Booking['status']) {
    try {
      const response = await fetch(`/api/v1/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Status updated successfully');
        fetchBookings();
        if (isDetailModalOpen) {
          setSelectedBooking({ ...selectedBooking!, status });
        }
      } else {
        const errorMsg =
          typeof data.error === 'string'
            ? data.error
            : data.error?.message || 'Failed to update status';
        toast.error(errorMsg);
      }
    } catch {
      toast.error('Failed to update status');
    }
  }

  function getStatusBadgeVariant(
    status: Booking['status']
  ): 'default' | 'warning' | 'success' | 'destructive' | 'primary' {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'destructive';
      case 'COMPLETED':
        return 'primary';
      default:
        return 'default';
    }
  }

  return (
    <>
      <div
        className="rounded-[24px] p-2 mb-8 inline-flex gap-2 flex-wrap"
        style={{
          background: '#E0E5EC',
          boxShadow:
            'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
        }}
      >
        {FILTER_BUTTONS.map((btn) => (
          <button
            key={btn.key}
            onClick={() => {
              setFilter(btn.key as FilterType);
              setCurrentPage(1);
            }}
            className="px-6 py-3 rounded-[18px] font-medium transition-all duration-300"
            style={{
              background: filter === btn.key ? '#E0E5EC' : 'transparent',
              color: filter === btn.key ? '#3B82F6' : '#6B7280',
              boxShadow:
                filter === btn.key
                  ? '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)'
                  : 'none',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-[#6B7280]">Loading bookings...</div>
        </div>
      ) : bookings.length === 0 ? (
        <div
          className="rounded-[32px] p-12 text-center"
          style={{
            background: '#E0E5EC',
            boxShadow: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
          }}
        >
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: '#E0E5EC',
              boxShadow:
                'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
            }}
          >
            <Calendar className="w-12 h-12 text-[#6B7280]" />
          </div>
          <h3 className="text-xl font-semibold text-[#3D4852] mb-2">No bookings found</h3>
          <p className="text-[#6B7280] max-w-md mx-auto">
            {filter === 'all'
              ? 'No bookings have been made yet.'
              : `No ${filter.toLowerCase()} bookings found.`}
          </p>
        </div>
      ) : (
        <>
          <div
            className="rounded-[32px] overflow-hidden bg-[#E0E5EC] mb-6"
            style={{
              boxShadow:
                '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#A3B1C6]/20">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">
                      Date/Time
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#3D4852]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#3D4852]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-[#A3B1C6]/10 last:border-0 hover:bg-[#D5DCE8]/30 transition-colors cursor-pointer"
                      onClick={() => openDetailModal(booking)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[#3D4852]">{booking.name}</p>
                          {booking.phone && (
                            <p className="text-sm text-[#6B7280]">{booking.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{booking.email}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-[#3D4852]">{formatDate(booking.date)}</p>
                          <p className="text-xs text-[#6B7280]">
                            {booking.time} ({booking.timezone})
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <Badge variant={getStatusBadgeVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center justify-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ActionButton
                            icon={<Eye className="h-4 w-4" />}
                            tooltip="View"
                            onClick={() => openDetailModal(booking)}
                          />

                          {booking.status === 'PENDING' && (
                            <>
                              <ActionButton
                                icon={<Check className="h-4 w-4" />}
                                tooltip="Confirm"
                                onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                                hoverColor="#38B2AC"
                              />
                              <ActionButton
                                icon={<X className="h-4 w-4" />}
                                tooltip="Cancel"
                                onClick={() => updateStatus(booking.id, 'CANCELLED')}
                                hoverColor="#EF4444"
                              />
                            </>
                          )}

                          {booking.status === 'CONFIRMED' && (
                            <ActionButton
                              icon={<CheckCircle className="h-4 w-4" />}
                              tooltip="Complete"
                              onClick={() => updateStatus(booking.id, 'COMPLETED')}
                              hoverColor="#3B82F6"
                            />
                          )}

                          <ActionButton
                            icon={<Trash2 className="h-4 w-4" />}
                            tooltip="Delete"
                            onClick={() => openDeleteModal(booking)}
                            hoverColor="#EF4444"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-[#E0E5EC] text-[#6B7280] hover:text-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow:
                    '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-[#6B7280] font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-[#E0E5EC] text-[#6B7280] hover:text-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow:
                    '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}

      <ResponsiveModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Booking"
        description={`Are you sure you want to delete the booking for "${deletingBooking?.name}"? This action cannot be undone.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        }
      >
        <div className="py-4">
          <p className="text-[#6B7280]">
            This will permanently delete the booking and all associated data.
          </p>
        </div>
      </ResponsiveModal>

      <ResponsiveModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        title="Booking Details"
        size="lg"
        footer={
          <div className="flex items-center gap-2 w-full justify-between">
            <div className="flex gap-2">
              {selectedBooking?.status === 'PENDING' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => updateStatus(selectedBooking.id, 'CONFIRMED')}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateStatus(selectedBooking.id, 'CANCELLED')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
              {selectedBooking?.status === 'CONFIRMED' && (
                <Button
                  variant="outline"
                  onClick={() => updateStatus(selectedBooking.id, 'COMPLETED')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
            <Button variant="primary" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedBooking && (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Status</span>
              <Badge variant={getStatusBadgeVariant(selectedBooking.status)}>
                {selectedBooking.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Name" value={selectedBooking.name} />
              <DetailField label="Email" value={selectedBooking.email} />
              <DetailField label="Phone" value={selectedBooking.phone || 'N/A'} />
              <DetailField label="Date" value={formatDate(selectedBooking.date)} />
              <DetailField label="Time" value={selectedBooking.time} />
              <DetailField label="Timezone" value={selectedBooking.timezone} />
            </div>
            {selectedBooking.notes && (
              <div
                className="rounded-2xl p-4 bg-[#E0E5EC]"
                style={{
                  boxShadow:
                    'inset 4px 4px 8px rgba(163,177,198,0.4), inset -4px -4px 8px rgba(255,255,255,0.4)',
                }}
              >
                <label className="text-[#6B7280] text-xs mb-2 block">Notes</label>
                <p className="text-[#3D4852] text-sm">{selectedBooking.notes}</p>
              </div>
            )}
          </div>
        )}
      </ResponsiveModal>
    </>
  );
}
