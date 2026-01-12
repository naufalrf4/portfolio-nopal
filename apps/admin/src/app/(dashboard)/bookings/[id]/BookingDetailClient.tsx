'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowLeft, Mail, Phone, Clock, Globe, FileText, User } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { toast } from 'sonner';
import { formatDate, formatDateTime } from '@/lib/utils/date';
import { getErrorMessage } from '@/lib/utils/api';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  timezone: string;
  notes: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

interface BookingDetailClientProps {
  id: string;
}

export function BookingDetailClient({ id }: BookingDetailClientProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Booking['status']>('PENDING');
  const [statusNotes, setStatusNotes] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  async function fetchBooking() {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/admin/bookings/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load booking');
      }

      if (data.success && data.data) {
        setBooking(data.data);
        setSelectedStatus(data.data.status);
        setStatusNotes(data.data.notes || '');
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load booking'));
      router.push('/bookings');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!booking) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/v1/admin/bookings/${booking.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Booking deleted successfully');
        router.push('/bookings');
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

  async function handleUpdateStatus() {
    if (!booking) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/v1/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          notes: statusNotes || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Status updated successfully');
        setIsStatusModalOpen(false);
        fetchBooking();
      } else {
        const errorMsg =
          typeof data.error === 'string'
            ? data.error
            : data.error?.message || 'Failed to update status';
        toast.error(errorMsg);
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  function getStatusBadgeVariant(
    status: Booking['status']
  ): 'default' | 'warning' | 'success' | 'destructive' {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'destructive';
      case 'COMPLETED':
        return 'default';
      default:
        return 'default';
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-12">
          <div className="text-[#6B7280]">Loading booking details...</div>
        </div>
      </PageWrapper>
    );
  }

  if (!booking) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-12">
          <div className="text-[#6B7280]">Booking not found</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <button
          onClick={() => router.push('/bookings')}
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#3B82F6] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#3D4852] mb-2">Booking Details</h1>
            <p className="text-[#6B7280]">View and manage booking information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsStatusModalOpen(true)}>
              Update Status
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div
          className="lg:col-span-2 rounded-[32px] p-8 bg-[#E0E5EC]"
          style={{
            boxShadow:
              '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#3D4852] mb-2">{booking.name}</h2>
              <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
            </div>
            <div
              className="p-4 rounded-2xl bg-[#E0E5EC]"
              style={{
                boxShadow:
                  '6px 6px 12px rgba(163,177,198,0.5), -6px -6px 12px rgba(255,255,255,0.5)',
              }}
            >
              <Calendar className="h-8 w-8 text-[#3B82F6]" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-2xl bg-[#E0E5EC]"
                    style={{
                      boxShadow:
                        'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
                    }}
                  >
                    <User className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Name</p>
                    <p className="font-medium text-[#3D4852]">{booking.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-2xl bg-[#E0E5EC]"
                    style={{
                      boxShadow:
                        'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
                    }}
                  >
                    <Mail className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Email</p>
                    <p className="font-medium text-[#3D4852]">{booking.email}</p>
                  </div>
                </div>
                {booking.phone && (
                  <div className="flex items-center gap-4">
                    <div
                      className="p-3 rounded-2xl bg-[#E0E5EC]"
                      style={{
                        boxShadow:
                          'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
                      }}
                    >
                      <Phone className="h-5 w-5 text-[#6B7280]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">Phone</p>
                      <p className="font-medium text-[#3D4852]">{booking.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
                Appointment Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-2xl bg-[#E0E5EC]"
                    style={{
                      boxShadow:
                        'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
                    }}
                  >
                    <Calendar className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Date</p>
                    <p className="font-medium text-[#3D4852]">{formatDate(booking.date, 'long')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-2xl bg-[#E0E5EC]"
                    style={{
                      boxShadow:
                        'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
                    }}
                  >
                    <Clock className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Time</p>
                    <p className="font-medium text-[#3D4852]">{booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-2xl bg-[#E0E5EC]"
                    style={{
                      boxShadow:
                        'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
                    }}
                  >
                    <Globe className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Timezone</p>
                    <p className="font-medium text-[#3D4852]">{booking.timezone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div>
                <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
                  Notes
                </h3>
                <div
                  className="p-4 rounded-2xl bg-[#E0E5EC]"
                  style={{
                    boxShadow:
                      'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-[#6B7280] mt-0.5" />
                    <p className="text-[#3D4852] leading-relaxed">{booking.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Card */}
        <div
          className="rounded-[32px] p-8 bg-[#E0E5EC] h-fit"
          style={{
            boxShadow:
              '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
          }}
        >
          <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
            Booking Metadata
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Created</p>
              <p className="text-sm font-medium text-[#3D4852]">
                {formatDateTime(booking.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Last Updated</p>
              <p className="text-sm font-medium text-[#3D4852]">
                {formatDateTime(booking.updatedAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Booking ID</p>
              <p className="text-xs font-mono text-[#3D4852] break-all">{booking.id}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-[#A3B1C6]/20">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {booking.status === 'PENDING' && (
                <>
                  <button
                    onClick={async () => {
                      setSelectedStatus('CONFIRMED');
                      await handleUpdateStatus();
                    }}
                    className="w-full py-2 px-4 rounded-2xl text-sm font-medium text-white bg-[#38B2AC] hover:bg-[#319795] transition-colors"
                    style={{
                      boxShadow:
                        '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
                    }}
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={async () => {
                      setSelectedStatus('CANCELLED');
                      await handleUpdateStatus();
                    }}
                    className="w-full py-2 px-4 rounded-2xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                    style={{
                      boxShadow:
                        '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
                    }}
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              {booking.status === 'CONFIRMED' && (
                <button
                  onClick={async () => {
                    setSelectedStatus('COMPLETED');
                    await handleUpdateStatus();
                  }}
                  className="w-full py-2 px-4 rounded-2xl text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors"
                  style={{
                    boxShadow:
                      '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
                  }}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <ResponsiveModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        title="Update Booking Status"
        description="Change the status of this booking and add optional notes"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-[#3D4852] mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Booking['status'])}
              className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#3D4852] border-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              style={{
                boxShadow:
                  'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
              }}
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D4852] mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              rows={4}
              placeholder="Add any notes about this status change..."
              className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#3D4852] border-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
              style={{
                boxShadow:
                  'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
              }}
            />
          </div>
        </div>
      </ResponsiveModal>

      {/* Delete Confirmation Modal */}
      <ResponsiveModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Booking"
        description={`Are you sure you want to delete the booking for "${booking.name}"? This action cannot be undone.`}
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
    </PageWrapper>
  );
}
