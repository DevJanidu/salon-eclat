import React from "react";
import { motion } from "framer-motion";
import { Award, Users, Clock, Heart, Sparkles, Star } from "lucide-react";
import { SALON_DATA } from "@/config/constants";

const stats = [
  { label: "Years of Excellence", value: "15+", icon: Clock },
  { label: "Happy Clients", value: "1000+", icon: Users },
  { label: "Expert Stylists", value: "5", icon: Star },
  { label: "Beauty Awards", value: "5", icon: Award },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-bg">
      {/* Hero Section */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xs font-bold text-salon-gold tracking-[0.3em] uppercase mb-6">
                Our Story
              </h2>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-text-primary mb-8 leading-tight">
                Defining <span className="text-salon-gold italic">Beauty</span>{" "}
                Since 2025
              </h1>
              <p className="text-text-secondary text-lg mb-8 font-light leading-relaxed">
                {SALON_DATA.aboutShort}
              </p>
              <p className="text-text-secondary text-lg mb-10 font-light leading-relaxed">
                At {SALON_DATA.name}, we believe that beauty is an experience.
                Our journey began with a simple vision: to create a sanctuary
                where luxury meets personalized care. Today, we are proud to be
                Matale's premier destination for those who seek excellence in
                hair, skin, and wellness.
              </p>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border border-salon-gold p-1">
                  <img
                    src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2069&auto=format&fit=crop"
                    className="w-full h-full object-cover rounded-full"
                    alt="Founder"
                  />
                </div>
                <div>
                  <p className="text-text-primary font-serif font-bold text-xl italic">
                    The Éclat Team
                  </p>
                  <p className="text-salon-gold text-sm uppercase tracking-widest font-bold">
                    Expert Care Specialists
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop"
                  alt="Salon Interior"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[2rem] shadow-2xl border border-border-color hidden md:block">
                <p className="text-salon-gold text-5xl font-serif font-bold mb-2">
                  100%
                </p>
                <p className="text-text-secondary text-sm uppercase tracking-widest font-bold">
                  Client Satisfaction
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-secondary-bg px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-salon-gold/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-6 h-6 text-salon-gold" />
                </div>
                <p className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-text-secondary text-sm uppercase tracking-widest font-bold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs font-bold text-salon-gold tracking-[0.3em] uppercase mb-6">
              Our Philosophy
            </h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-text-primary">
              The Éclat Standards
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-10 bg-white rounded-[2.5rem] border border-border-color shadow-sm hover:shadow-xl transition-all duration-500">
              <Sparkles className="w-10 h-10 text-salon-gold mb-8" />
              <h4 className="text-2xl font-serif font-bold text-text-secondary mb-4">
                Premium Products
              </h4>
              <p className="text-text-secondary font-light leading-relaxed">
                We exclusively use world-class professional products to ensure
                your hair and skin receive the best possible care.
              </p>
            </div>
            <div className="p-10 bg-white rounded-[2.5rem] border border-border-color shadow-sm hover:shadow-xl transition-all duration-500">
              <Heart className="w-10 h-10 text-salon-gold mb-8" />
              <h4 className="text-2xl font-serif font-bold text-text-secondary mb-4">
                Personalized Care
              </h4>
              <p className="text-text-secondary font-light leading-relaxed">
                Every client is unique. We tailor our services to match your
                individual style, personality, and beauty goals.
              </p>
            </div>
            <div className="p-10 bg-white rounded-[2.5rem] border border-border-color shadow-sm hover:shadow-xl transition-all duration-500">
              <Star className="w-10 h-10 text-salon-gold mb-8" />
              <h4 className="text-2xl font-serif font-bold text-text-secondary mb-4">
                Expert Artistry
              </h4>
              <p className="text-text-secondary font-light leading-relaxed">
                Our team of certified professionals stays ahead of global trends
                to bring you the latest in beauty and hair fashion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
