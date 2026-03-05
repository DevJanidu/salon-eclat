import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { portfolioApi } from "@/api/portfolio.api";
import type { PortfolioItem } from "@/api/types";
import { SALON_DATA } from "@/config/constants";
import ImageUploadField from "@/components/common/ImageUploadField";

interface PortfolioForm {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

const EMPTY_FORM: PortfolioForm = {
  title: "",
  category: SALON_DATA.serviceCategories[0],
  description: "",
  imageUrl: "",
  featured: false,
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState<PortfolioForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await portfolioApi.getAll({});
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      featured: item.featured ?? false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.imageUrl.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        imageUrl: form.imageUrl,
        featured: form.featured,
      };
      if (editingItem) {
        const updated = await portfolioApi.update(editingItem.id, payload);
        setItems((prev) =>
          prev.map((it) => (it.id === editingItem.id ? updated : it)),
        );
        toast.success("Portfolio item updated successfully");
      } else {
        const created = await portfolioApi.create(payload);
        setItems((prev) => [created, ...prev]);
        toast.success("Portfolio item added successfully");
      }
      setShowModal(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save portfolio item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await portfolioApi.delete(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      toast.success("Portfolio item deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete portfolio item. Please try again.");
    }
    setDeleteConfirm(null);
  };

  const toggleFeatured = async (item: PortfolioItem) => {
    try {
      const updated = await portfolioApi.update(item.id, {
        title: item.title,
        category: item.category,
        description: item.description,
        imageUrl: item.imageUrl,
        featured: !item.featured,
      });
      setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
      toast.success(
        item.featured ? "Removed from featured" : "Marked as featured",
      );
    } catch (e) {
      console.error(e);
      toast.error("Failed to update featured status.");
    }
  };

  const categories = ["All", ...SALON_DATA.serviceCategories];
  const filtered = items.filter(
    (item) =>
      (categoryFilter === "All" || item.category === categoryFilter) &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">
            Portfolio Management
          </h1>
          <p className="text-text-secondary">
            Manage your gallery and showcase your best work.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-salon-gold text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-salon-gold-dark transition-all shadow-lg shadow-salon-gold/20"
        >
          <Plus className="w-5 h-5" /> Add Portfolio Item
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search portfolio..."
          className="w-full bg-surface border border-border-color rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-salon-gold outline-none shadow-sm"
        />
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

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-salon-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-text-secondary">
                No portfolio items found. Add your first piece above.
              </div>
            ) : (
              filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden group"
                >
                  <div
                    className="relative aspect-[4/3] cursor-pointer"
                    onClick={() => setLightbox(item.imageUrl)}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary-bg flex items-center justify-center text-text-secondary text-sm">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {item.featured && (
                      <div className="absolute top-3 left-3 bg-salon-gold text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(item);
                        }}
                        className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-salon-gold transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(item.id);
                        }}
                        className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-salon-gold uppercase tracking-widest">
                          {item.category}
                        </span>
                        <h3 className="text-base font-serif font-bold text-text-primary mt-0.5">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleFeatured(item)}
                        title={item.featured ? "Unfeature" : "Mark as Featured"}
                        className={cn(
                          "ml-3 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0",
                          item.featured
                            ? "bg-salon-gold/20 text-salon-gold"
                            : "bg-bg border border-border-color text-text-secondary hover:border-salon-gold hover:text-salon-gold",
                        )}
                      >
                        {item.featured ? "Featured" : "Feature"}
                      </button>
                    </div>
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
                  {editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
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
                    Title *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                    placeholder="e.g. Luxury Bridal Styling"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
                    Category
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
                <ImageUploadField
                  label="Portfolio Image *"
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  folder="portfolio"
                />
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
                    placeholder="Describe this work..."
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-salon-gold"
                  />
                  <span className="text-sm font-medium text-text-primary">
                    Mark as Featured
                  </span>
                </label>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border-color text-text-secondary font-bold hover:bg-bg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    saving || !form.title.trim() || !form.imageUrl.trim()
                  }
                  className="flex-1 py-3 rounded-xl bg-salon-gold text-white font-bold hover:bg-salon-gold-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2">
              <X className="w-8 h-8" />
            </button>
            <img
              src={lightbox}
              alt="Preview"
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
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
                Delete Portfolio Item?
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
