import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Scissors,
  Sparkles,
  Heart,
  Zap,
  User,
  Star,
  Clock,
  Calendar,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { servicesApi } from "@/api/services.api";
import type { SalonService } from "@/api/types";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Hair: Scissors,
  Beauty: Sparkles,
  "Herbal spa": Zap,
  "Massaging Therapy": Heart,
  "Manicure & Pedicure": User,
  "Gel Nails": Star,
  Makeup: Sparkles,
  Waxing: Zap,
  Threading: Scissors,
};

const getIcon = (category: string): React.ElementType =>
  CATEGORY_ICONS[category] ?? Sparkles;

export default function ServicesPage() {
  const [apiServices, setApiServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    servicesApi
      .getAll()
      .then((data) => setApiServices(data.filter((s) => s.status === "ACTIVE")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(apiServices.map((s) => s.category)));
    return ["All", ...cats];
  }, [apiServices]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return apiServices.filter((s) => {
      const matchCat =
        activeCategory === "All" || s.category === activeCategory;
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [apiServices, activeCategory, search]);

  return (
    <div className="pt-32 pb-24 bg-bg">
      {/* Header */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold text-text-primary mb-6"
          >
            Our <span className="text-salon-gold italic">Services</span>
          </motion.h1>
          <p className="text-text-secondary max-w-2xl mx-auto font-light text-lg">
            Experience the pinnacle of luxury hair and beauty excellence. Select
            a category to explore our curated treatments.
          </p>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services by name or description…"
              className="w-full bg-surface border border-border-color rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-salon-gold outline-none transition-all text-text-primary placeholder:text-text-secondary/60"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="overflow-x-auto pb-2">
            <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3">
              {categories.map((cat) => {
                const count =
                  cat === "All"
                    ? apiServices.length
                    : apiServices.filter((s) => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2",
                      activeCategory === cat
                        ? "bg-salon-gold text-white shadow-lg shadow-salon-gold/20"
                        : "bg-surface border border-border-color text-text-secondary hover:border-salon-gold hover:text-salon-gold",
                    )}
                  >
                    {cat}
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full font-normal",
                        activeCategory === cat
                          ? "bg-white/20 text-white"
                          : "bg-border-color text-text-secondary",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-[2rem] border border-border-color overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-border-color" />
                  <div className="p-10">
                    <div className="h-5 bg-border-color rounded mb-3 w-3/4" />
                    <div className="h-4 bg-border-color rounded mb-2 w-full" />
                    <div className="h-4 bg-border-color rounded mb-8 w-2/3" />
                    <div className="h-10 bg-border-color rounded-xl w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((service) => {
                    const Icon = getIcon(service.category);
                    return (
                      <motion.div
                        layout
                        key={service.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="bg-surface rounded-[2rem] border border-border-color shadow-sm hover:shadow-2xl hover:border-salon-gold/30 transition-all duration-500 group flex flex-col overflow-hidden"
                      >
                        {/* Image / icon header */}
                        {service.imageUrl ? (
                          <div className="relative h-52 overflow-hidden">
                            <img
                              src={service.imageUrl}
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <span className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-widest bg-salon-gold text-white px-3 py-1 rounded-full">
                              {service.category}
                            </span>
                          </div>
                        ) : (
                          <div className="px-10 pt-10">
                            <div className="w-16 h-16 bg-salon-gold/10 rounded-2xl flex items-center justify-center group-hover:bg-salon-gold transition-colors duration-500">
                              <Icon className="w-8 h-8 text-salon-gold group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col flex-1 p-10 pt-6">
                          {!service.imageUrl && (
                            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">
                              {service.category}
                            </span>
                          )}
                          <h3 className="text-xl font-serif font-bold text-text-primary mb-3">
                            {service.name}
                          </h3>
                          {service.description && (
                            <p className="text-text-secondary font-light leading-relaxed mb-6 text-sm flex-1">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mb-6 mt-auto pt-4">
                            <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{service.duration} mins</span>
                            </div>
                            <span className="font-bold text-salon-gold text-lg">
                              {Number(service.price).toLocaleString()} LKR
                            </span>
                          </div>
                          <Link to="/book">
                            <Button className="w-full bg-salon-gold text-white">
                              <Calendar className="w-4 h-4 mr-2" />
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {filtered.length === 0 && !loading && (
                <div className="text-center py-24">
                  <Search className="w-12 h-12 text-border-color mx-auto mb-4" />
                  <p className="text-text-secondary font-light italic text-lg mb-4">
                    {search
                      ? `No services found for "${search}"`
                      : "No services found in this category."}
                  </p>
                  {(search || activeCategory !== "All") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setActiveCategory("All");
                      }}
                      className="text-salon-gold font-bold text-sm hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Custom Package CTA */}
      <section className="mt-32 px-6">
        <div className="max-w-5xl mx-auto bg-secondary-bg rounded-[3rem] p-12 md:p-20 text-center border border-border-color">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-text-primary mb-8">
            Looking for a{" "}
            <span className="text-salon-gold italic">Custom Package</span>?
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto font-light">
            We offer personalized beauty packages for weddings, events, and
            group bookings. Book an appointment to discuss your requirements
            with our experts.
          </p>
          <Link to="/book">
            <Button
              size="lg"
              className="min-w-[200px] bg-salon-gold hover:bg-salon-gold-hover text-white shadow-lg shadow-salon-gold/30 tracking-wide"
            >
              Book Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
