import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Trash2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { bookingsApi } from "@/api/bookings.api";
import type { Booking, BookingStatus } from "@/api/types";

const STATUS_TABS = ["All", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

interface DropdownTarget {
  id: number;
  top: number;
  left: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  const [dropdownTarget, setDropdownTarget] = useState<DropdownTarget | null>(
    null,
  );

  const fetchBookings = () => {
    setLoading(true);
    bookingsApi
      .getAll()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const close = () => setDropdownTarget(null);
    document.addEventListener("click", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("scroll", close, true);
    };
  }, []);

  const handleToggleDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    booking: Booking,
  ) => {
    e.stopPropagation();
    if (dropdownTarget?.id === booking.id) {
      setDropdownTarget(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownTarget({
      id: booking.id,
      top: rect.bottom + 4,
      left: rect.left,
    });
  };

  const handleStatusChange = async (
    bookingId: number,
    newStatus: BookingStatus,
  ) => {
    setStatusUpdating(bookingId);
    setDropdownTarget(null);
    try {
      await bookingsApi.updateStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
      );
      toast.success(
        `Booking status updated to ${STATUS_LABELS[newStatus] ?? newStatus}`,
      );
    } catch (e) {
      console.error(e);
      toast.error("Failed to update booking status. Please try again.");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await bookingsApi.delete(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success("Booking deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete booking. Please try again.");
    }
    setDeleteConfirm(null);
  };

  const filtered = bookings.filter(
    (b) =>
      (activeTab === "All" || b.status === activeTab) &&
      ((b.customerName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        String(b.id).includes(searchTerm)),
  );

  const tabCount = (tab: string) =>
    tab === "All"
      ? bookings.length
      : bookings.filter((b) => b.status === tab).length;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      CONFIRMED: "bg-green-500/10 text-green-500",
      PENDING: "bg-salon-gold/10 text-salon-gold",
      COMPLETED: "bg-blue-500/10 text-blue-500",
      CANCELLED: "bg-red-500/10 text-red-500",
    };
    return (
      map[status] ||
      "bg-secondary-bg border border-border-color text-text-secondary"
    );
  };

  const dropdownBooking = dropdownTarget
    ? bookings.find((b) => b.id === dropdownTarget.id)
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">
            Bookings Management
          </h1>
          <p className="text-text-secondary">
            Track and manage all salon appointments.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-surface border border-border-color rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-salon-gold outline-none w-64 shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === tab
                ? "bg-salon-gold text-white shadow-lg shadow-salon-gold/20"
                : "bg-surface border border-border-color text-text-secondary hover:border-salon-gold hover:text-salon-gold",
            )}
          >
            {STATUS_LABELS[tab] ?? tab}
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold",
                activeTab === tab ? "bg-white/30" : "bg-bg",
              )}
            >
              {tabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary-bg border-b border-border-color">
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Service
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-salon-gold mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-text-secondary"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-bg/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-salon-gold">
                        #{String(booking.id).padStart(6, "0")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-primary">
                          {booking.customerName}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {booking.phone}
                        </span>
                        <span className="text-xs text-text-secondary italic">
                          {booking.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-text-primary">
                          {Array.isArray(booking.services)
                            ? booking.services.join(", ")
                            : booking.services}
                        </span>
                        {booking.notes && (
                          <div className="mt-1 flex items-start gap-1 text-[10px] text-text-secondary bg-bg p-1 rounded">
                            <MessageSquare className="w-2 h-2 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">
                              {booking.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">
                          {booking.date}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {booking.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => handleToggleDropdown(e, booking)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:opacity-80 transition-all",
                          statusBadge(booking.status),
                        )}
                      >
                        {booking.status === "CONFIRMED" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {booking.status === "PENDING" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {booking.status === "CANCELLED" && (
                          <XCircle className="w-3 h-3" />
                        )}
                        {statusUpdating === booking.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          (STATUS_LABELS[booking.status] ?? booking.status)
                        )}
                        <ChevronDown className="w-2.5 h-2.5 ml-1" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteConfirm(booking.id)}
                        className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixed-position status dropdown  escapes overflow containers */}
      <AnimatePresence>
        {dropdownTarget && dropdownBooking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              top: dropdownTarget.top,
              left: dropdownTarget.left,
              zIndex: 9999,
            }}
            className="bg-surface border border-border-color rounded-xl shadow-2xl min-w-[150px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {(
              [
                "PENDING",
                "CONFIRMED",
                "COMPLETED",
                "CANCELLED",
              ] as BookingStatus[]
            ).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(dropdownBooking.id, s)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-salon-gold/10 hover:text-salon-gold transition-all",
                  dropdownBooking.status === s
                    ? "text-salon-gold bg-salon-gold/5"
                    : "text-text-secondary",
                )}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-surface rounded-3xl border border-border-color p-8 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-serif font-bold text-text-primary mb-2">
                Delete Booking?
              </h3>
              <p className="text-text-secondary mb-8 font-light">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl border border-border-color text-text-secondary font-bold hover:bg-bg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
