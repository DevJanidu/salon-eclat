import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Maximize2, X, ArrowRight, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { SALON_DATA } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { portfolioApi } from "@/api/portfolio.api";
import type { PortfolioItem } from "@/api/types";

const beforeAfterItems = [
  {
    id: 1,
    title: "Bridal Transformation",
    before:
      "https://res.cloudinary.com/dg3rk2yot/image/upload/v1772718980/1_boer5b.png",
    after:
      "https://res.cloudinary.com/dg3rk2yot/image/upload/v1772719016/2_fmvpzu.png",
    desc: "An exquisite journey from raw natural beauty to a breathtaking, royal Sri Lankan bride.",
  },
  {
    id: 2,
    title: "Nail Transformation",
    before:
      "https://res.cloudinary.com/dg3rk2yot/image/upload/v1772719396/4_ph4rfq.png",
    after:
      "https://res.cloudinary.com/dg3rk2yot/image/upload/v1772719393/3_lauleb.png",
    desc: "From a natural, raw canvas to a sophisticated terra-cotta finish for a polished, modern look.",
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioApi
      .getAll({})
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...SALON_DATA.serviceCategories];
  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="pt-32 pb-24 bg-bg">
      {/* Header */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold text-text-primary mb-6"
          >
            Our <span className="text-salon-gold italic">Gallery</span>
          </motion.h1>
          <p className="text-text-secondary max-w-2xl mx-auto font-light text-lg">
            A showcase of our finest work. From bridal transformations to
            precision styling, witness the Éclat touch.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="px-6 mb-16 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-salon-gold text-white shadow-lg shadow-salon-gold/20"
                  : "bg-surface border border-border-color text-text-secondary hover:border-salon-gold hover:text-salon-gold",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-salon-gold" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-24 text-text-secondary">
              No portfolio items yet. Check back soon!
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                    onClick={() =>
                      item.imageUrl && setSelectedImage(item.imageUrl)
                    }
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                      <span className="text-salon-gold text-xs font-bold uppercase tracking-widest mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-white mb-4">
                        {item.title}
                      </h3>
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-32 bg-secondary-bg px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs font-bold text-salon-gold tracking-[0.3em] uppercase mb-6">
              Transformations
            </h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-text-primary">
              Before & After
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {beforeAfterItems.map((item) => (
              <div key={item.id} className="space-y-8" data-aos="fade-up">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-lg">
                    <img
                      src={item.before}
                      alt="Before"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Before
                    </div>
                  </div>
                  <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-lg">
                    <img
                      src={item.after}
                      alt="After"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-salon-gold text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      After
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-serif font-bold text-text-primary mb-2">
                    {item.title}
                  </h4>
                  <p className="text-text-secondary font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-8">
            Want a <span className="text-salon-gold italic">Similar Glow</span>?
          </h2>
          <p className="text-text-secondary text-lg mb-12 font-light">
            Book your consultation today and let our experts design a
            personalized transformation for you.
          </p>
          <Link to="/book">
            <Button
              size="lg"
              className="min-w-[200px] bg-salon-gold hover:bg-salon-gold-hover text-white shadow-lg shadow-salon-gold/30 tracking-wide"
            >
              Book Consultation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-salon-gold transition-colors">
              <X className="w-10 h-10" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
