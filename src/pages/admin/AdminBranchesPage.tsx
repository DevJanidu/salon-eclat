import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { branchesApi } from "@/api/branches.api";
import type { Branch, BranchStatus } from "@/api/types";
import ImageUploadField from "@/components/common/ImageUploadField";

interface BranchForm {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  mapsUrl: string;
  status: BranchStatus;
  imageUrl: string;
}

const EMPTY_FORM: BranchForm = {
  name: "",
  address: "",
  city: "",
  phone: "",
  email: "",
  hours: "8:00 AM  10:30 PM",
  mapsUrl: "",
  status: "ACTIVE",
  imageUrl: "",
};

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState<BranchForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const data = await branchesApi.getAll();
      setBranches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const openAdd = () => {
    setEditingBranch(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (b: Branch) => {
    setEditingBranch(b);
    setForm({
      name: b.name,
      address: b.address,
      city: b.city,
      phone: b.phone ?? "",
      email: b.email ?? "",
      hours: b.hours ?? "",
      mapsUrl: b.mapsUrl ?? "",
      status: b.status,
      imageUrl: b.imageUrl ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        address: form.address,
        city: form.city,
        phone: form.phone,
        email: form.email,
        hours: form.hours,
        mapsUrl: form.mapsUrl,
        status: form.status,
        imageUrl: form.imageUrl,
      };
      if (editingBranch) {
        const updated = await branchesApi.update(editingBranch.id, payload);
        setBranches((prev) =>
          prev.map((b) => (b.id === editingBranch.id ? updated : b)),
        );
        toast.success("Branch updated successfully");
      } else {
        const created = await branchesApi.create(payload);
        setBranches((prev) => [created, ...prev]);
        toast.success("Branch created successfully");
      }
      setShowModal(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save branch. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await branchesApi.delete(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
      toast.success("Branch deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete branch. Please try again.");
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">
            Branch Management
          </h1>
          <p className="text-text-secondary">
            Manage your salon locations and branch details.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-salon-gold text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-salon-gold-dark transition-all shadow-lg shadow-salon-gold/20"
        >
          <Plus className="w-5 h-5" /> Add New Branch
        </button>
      </div>

      {/* Branch Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-salon-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {branches.map((branch) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface rounded-3xl border border-border-color overflow-hidden group"
              >
                {/* Image */}
                <div className="h-44 bg-gradient-to-br from-surface to-bg relative overflow-hidden">
                  {branch.imageUrl ? (
                    <img
                      src={branch.imageUrl}
                      alt={branch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-border-color" />
                    </div>
                  )}
                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(branch)}
                      className="w-8 h-8 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-salon-gold hover:text-white transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(branch.id)}
                      className="w-8 h-8 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Status badge */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        branch.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400",
                      )}
                    >
                      {branch.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-text-primary">
                      {branch.name}
                    </h3>
                    <p className="text-salon-gold text-sm font-semibold">
                      {branch.city}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-text-secondary">
                    {branch.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-text-secondary/60" />
                        <span>{branch.address}</span>
                      </div>
                    )}
                    {branch.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 shrink-0 text-text-secondary/60" />
                        <span>{branch.phone}</span>
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 shrink-0 text-text-secondary/60" />
                        <span>{branch.email}</span>
                      </div>
                    )}
                    {branch.hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 shrink-0 text-text-secondary/60" />
                        <span>{branch.hours}</span>
                      </div>
                    )}
                    {branch.mapsUrl && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 shrink-0 text-text-secondary/60" />
                        <a
                          href={branch.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-salon-gold hover:underline"
                        >
                          View on Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-3xl border border-border-color p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-text-primary">
                  {editingBranch ? "Edit Branch" : "Add New Branch"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-bg flex items-center justify-center hover:bg-border-color transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                      Branch Name *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                      placeholder="Kandy Branch"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                      City *
                    </label>
                    <input
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                      placeholder="Kandy"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Address
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    placeholder="123 Main Street"
                  />
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
                          status: e.target.value as BranchStatus,
                        })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    placeholder="branch@eclatsalon.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Working Hours
                  </label>
                  <input
                    value={form.hours}
                    onChange={(e) =>
                      setForm({ ...form, hours: e.target.value })
                    }
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    placeholder="8:00 AM  10:30 PM"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Google Maps URL
                  </label>
                  <input
                    value={form.mapsUrl}
                    onChange={(e) =>
                      setForm({ ...form, mapsUrl: e.target.value })
                    }
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <ImageUploadField
                  label="Branch Photo"
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  folder="branches"
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
                  disabled={saving || !form.name.trim() || !form.city.trim()}
                  className="flex-1 py-3 rounded-xl bg-salon-gold text-white font-bold hover:bg-salon-gold-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {editingBranch ? "Save Changes" : "Add Branch"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
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
                Delete Branch?
              </h3>
              <p className="text-text-secondary mb-8 font-light">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl border border-border-color text-text-secondary font-bold hover:bg-bg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600"
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
