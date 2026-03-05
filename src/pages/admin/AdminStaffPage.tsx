import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MapPin,
  Phone,
  Star,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { staffApi } from "@/api/staff.api";
import { branchesApi } from "@/api/branches.api";
import type { StaffMember, StaffStatus, Branch } from "@/api/types";
import ImageUploadField from "@/components/common/ImageUploadField";

const ROLES = [
  "Master Stylist",
  "Senior Stylist",
  "Bridal Specialist",
  "Skin Therapist",
  "Nail Technician",
  "Senior Barber",
  "Makeup Artist",
  "Masseur/Masseuse",
];

interface StaffForm {
  name: string;
  role: string;
  branchId: number | "";
  phone: string;
  email: string;
  rating: number;
  status: StaffStatus;
  imageUrl: string;
}

const EMPTY_FORM: StaffForm = {
  name: "",
  role: ROLES[0],
  branchId: "",
  phone: "",
  email: "",
  rating: 5,
  status: "ACTIVE",
  imageUrl: "",
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState<number | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<StaffForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([staffApi.getAll(), branchesApi.getAll()])
      .then(([s, b]) => {
        setStaff(s);
        setBranches(b);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingMember(null);
    setForm({ ...EMPTY_FORM, branchId: branches[0]?.id ?? "" });
    setShowModal(true);
  };

  const openEdit = (m: StaffMember) => {
    setEditingMember(m);
    setForm({
      name: m.name,
      role: m.role,
      branchId: m.branchId,
      phone: m.phone || "",
      email: m.email || "",
      rating: m.rating ?? 5,
      status: m.status,
      imageUrl: m.imageUrl || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.branchId) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        role: form.role,
        branchId: Number(form.branchId),
        phone: form.phone || undefined,
        email: form.email || undefined,
        rating: form.rating,
        status: form.status,
        imageUrl: form.imageUrl || undefined,
      };
      if (editingMember) {
        const updated = await staffApi.update(editingMember.id, payload);
        setStaff((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s)),
        );
        toast.success("Staff member updated successfully");
      } else {
        const created = await staffApi.create(payload);
        setStaff((prev) => [created, ...prev]);
        toast.success("Staff member added successfully");
      }
      setShowModal(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save staff member. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await staffApi.delete(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast.success("Staff member deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete staff member. Please try again.");
    }
    setDeleteConfirm(null);
  };

  const filtered = staff.filter(
    (m) =>
      (branchFilter === "All" || m.branchId === branchFilter) &&
      (m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const statusColor = (status: StaffStatus) => {
    if (status === "ACTIVE") return "bg-green-500 text-white";
    if (status === "ON_LEAVE") return "bg-salon-gold text-white";
    return "bg-red-500 text-white";
  };

  const statusLabel = (status: StaffStatus) => {
    if (status === "ACTIVE") return "Active";
    if (status === "ON_LEAVE") return "On Leave";
    return "Inactive";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">
            Staff Management
          </h1>
          <p className="text-text-secondary">
            Manage your team across all branches.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-salon-gold text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-salon-gold-dark transition-all shadow-lg shadow-salon-gold/20"
        >
          <Plus className="w-5 h-5" /> Add New Staff
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff by name or role..."
            className="w-full bg-surface border border-border-color rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-salon-gold outline-none shadow-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setBranchFilter("All")}
            className={cn(
              "px-5 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
              branchFilter === "All"
                ? "bg-salon-gold text-white"
                : "bg-surface border border-border-color text-text-secondary hover:border-salon-gold hover:text-salon-gold",
            )}
          >
            All
          </button>
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => setBranchFilter(b.id)}
              className={cn(
                "px-5 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
                branchFilter === b.id
                  ? "bg-salon-gold text-white"
                  : "bg-surface border border-border-color text-text-secondary hover:border-salon-gold hover:text-salon-gold",
              )}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-salon-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="col-span-4 text-center py-20 text-text-secondary">
                No staff found. Add your first team member above.
              </div>
            ) : (
              filtered.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden group"
                >
                  <div className="relative h-48 bg-secondary-bg">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-salon-gold text-5xl font-serif font-bold">
                        {member.name[0]}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button
                        onClick={() => openEdit(member)}
                        className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-salon-gold transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(member.id)}
                        className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          statusColor(member.status),
                        )}
                      >
                        {statusLabel(member.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-serif font-bold text-text-primary truncate">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-1 text-salon-gold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-salon-gold" />
                        <span className="text-xs font-bold">
                          {member.rating ?? 5}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-salon-gold font-bold uppercase tracking-widest mb-3">
                      {member.role}
                    </p>
                    <div className="space-y-2 pt-3 border-t border-border-color">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />{" "}
                        {member.branchName}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Phone className="w-3.5 h-3.5 shrink-0" />{" "}
                          {member.phone}
                        </div>
                      )}
                      {member.email && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary truncate">
                          <Mail className="w-3.5 h-3.5 shrink-0" />{" "}
                          {member.email}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-3xl border border-border-color p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-text-primary">
                  {editingMember ? "Edit Staff Member" : "Add New Staff"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-bg rounded-xl text-text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Full Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    placeholder="e.g. Anura Perera"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                      Role *
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                      Branch *
                    </label>
                    <select
                      value={form.branchId}
                      onChange={(e) =>
                        setForm({ ...form, branchId: Number(e.target.value) })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                      Phone
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as StaffStatus,
                        })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="ON_LEAVE">On Leave</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Email
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    type="email"
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    placeholder="staff@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Rating (1–5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rating: parseFloat(e.target.value) || 5,
                      })
                    }
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                  />
                </div>
                <ImageUploadField
                  label="Staff Photo"
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  folder="staff"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border-color text-text-secondary font-bold hover:bg-bg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name.trim() || !form.branchId}
                  className="flex-1 py-3 rounded-xl bg-salon-gold text-white font-bold hover:bg-salon-gold-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {editingMember ? "Save Changes" : "Add Staff"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                Remove Staff Member?
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
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
