import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Scissors,
  Clock,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { servicesApi } from "@/api/services.api";
import type { SalonService, ServiceStatus } from "@/api/types";
import { SALON_DATA } from "@/config/constants";
import ImageUploadField from "@/components/common/ImageUploadField";

interface ServiceForm {
  name: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  imageUrl: string;
  status: ServiceStatus;
}

const EMPTY_FORM: ServiceForm = {
  name: "",
  category: SALON_DATA.serviceCategories[0],
  price: "",
  duration: "",
  description: "",
  imageUrl: "",
  status: "ACTIVE",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<SalonService | null>(
    null,
  );
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchServices = () => {
    setLoading(true);
    servicesApi
      .getAll()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => {
    setEditingService(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (s: SalonService) => {
    setEditingService(s);
    setForm({
      name: s.name,
      category: s.category,
      price: String(s.price),
      duration: String(s.duration),
      description: s.description || "",
      imageUrl: s.imageUrl || "",
      status: s.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price.trim() || !form.duration.trim())
      return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price.replace(/,/g, "")),
        duration: parseInt(form.duration),
        description: form.description,
        imageUrl: form.imageUrl || undefined,
        status: form.status,
      };
      if (editingService) {
        const updated = await servicesApi.update(editingService.id, payload);
        setServices((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s)),
        );
        toast.success("Service updated successfully");
      } else {
        const created = await servicesApi.create(payload);
        setServices((prev) => [created, ...prev]);
        toast.success("Service created successfully");
      }
      setShowModal(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await servicesApi.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Service deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete service. Please try again.");
    }
    setDeleteConfirm(null);
  };

  const categories = ["All", ...SALON_DATA.serviceCategories];
  const filtered = services.filter(
    (s) =>
      (categoryFilter === "All" || s.category === categoryFilter) &&
      s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">
            Services Management
          </h1>
          <p className="text-text-secondary">
            Manage your salon service menu and pricing.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-salon-gold text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-salon-gold-dark transition-all shadow-lg shadow-salon-gold/20"
        >
          <Plus className="w-5 h-5" /> Add New Service
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-surface border border-border-color rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-salon-gold outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              categoryFilter === cat
                ? "bg-salon-gold text-white shadow-lg shadow-salon-gold/20"
                : "bg-surface border border-border-color text-text-secondary hover:border-salon-gold hover:text-salon-gold",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-salon-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-text-secondary">
                No services found. Add your first service above.
              </div>
            ) : (
              filtered.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-surface p-6 rounded-3xl border border-border-color shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-salon-gold/10 rounded-2xl flex items-center justify-center text-salon-gold">
                      <Scissors className="w-6 h-6" />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(service)}
                        className="p-2 hover:bg-salon-gold/10 hover:text-salon-gold rounded-lg text-text-secondary transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(service.id)}
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-text-secondary transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-salon-gold uppercase tracking-widest">
                        {service.category}
                      </span>
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          service.status === "ACTIVE"
                            ? "bg-green-500"
                            : "bg-red-400",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[10px] font-semibold",
                          service.status === "ACTIVE"
                            ? "text-green-500"
                            : "text-red-400",
                        )}
                      >
                        {service.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-text-primary group-hover:text-salon-gold transition-colors">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-xs text-text-secondary mt-2 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border-color">
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <Clock className="w-3 h-3" /> {service.duration} mins
                    </div>
                    <span className="text-lg font-bold text-text-primary">
                      {Number(service.price).toLocaleString()} LKR
                    </span>
                  </div>
                </motion.div>
              ))
            )}
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
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-3xl border border-border-color p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-text-primary">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-bg rounded-xl text-text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Service Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    placeholder="e.g. Luxury Hair Cut"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    >
                      {SALON_DATA.serviceCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
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
                          status: e.target.value as ServiceStatus,
                        })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                      Price (LKR) *
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                      placeholder="e.g. 3500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                      Duration (mins) *
                    </label>
                    <input
                      type="number"
                      value={form.duration}
                      onChange={(e) =>
                        setForm({ ...form, duration: e.target.value })
                      }
                      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                      placeholder="e.g. 45"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none resize-none"
                    placeholder="Describe the service..."
                  />
                </div>
                <ImageUploadField
                  label="Service Image (optional)"
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  folder="services"
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
                  disabled={
                    saving ||
                    !form.name.trim() ||
                    !form.price.trim() ||
                    !form.duration.trim()
                  }
                  className="flex-1 py-3 rounded-xl bg-salon-gold text-white font-bold hover:bg-salon-gold-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {editingService ? "Save Changes" : "Add Service"}
                </button>
              </div>
            </motion.div>
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
                Delete Service?
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
