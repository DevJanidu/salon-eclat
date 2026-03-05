import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  Scissors,
  Sparkles,
  Heart,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SALON_DATA, getWhatsAppLink } from "@/config/constants";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1637777269308-6a072f24e8a4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Luxury Salon Interior"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Critical Fix: Hero Overlay Gradient for Navbar Visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block text-salon-gold font-bold tracking-[0.4em] uppercase text-xs mb-8"
          >
            Luxury Hair & Beauty Excellence
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1.1]"
          >
            {SALON_DATA.tagline.split("!")[0]}!<br />
            <span className="text-salon-gold italic font-normal">
              {SALON_DATA.tagline.split("!")[1]}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {SALON_DATA.aboutShort}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/book">
              <Button
                size="lg"
                className="min-w-[200px] bg-salon-gold hover:bg-salon-gold-hover text-white shadow-lg shadow-salon-gold/30 tracking-wide"
              >
                Book Appointment
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] border-white/50 text-white hover:bg-white/10 hover:border-white tracking-wide backdrop-blur-sm"
              >
                Explore Services
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
          <div data-aos="fade-right">
            <h2 className="text-xs font-bold text-salon-gold tracking-[0.3em] uppercase mb-6">
              Our Philosophy
            </h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-black mb-8 leading-tight">
              Unveil Your{" "}
              <span className="italic font-normal text-salon-gold">
                Inner Glow
              </span>
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-10 font-light">
              At {SALON_DATA.name}, we believe beauty is more than skin deep.
              It's about confidence, radiance, and self-care. Our expert team
              combines traditional herbal wisdom with modern luxury techniques
              to provide a transformative experience.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="text-3xl font-serif font-bold text-salon-gold mb-2">
                  14+
                </h4>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                  Years Experience
                </p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-salon-gold mb-2">
                  5k+
                </h4>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                  Happy Clients
                </p>
              </div>
            </div>
            <Link to="/about">
              <Button
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop"
                alt="Salon Experience"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-salon-gold/10 rounded-full -z-10 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-32 bg-secondary-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-20" data-aos="fade-up">
            <h2 className="text-xs font-bold text-salon-gold tracking-[0.3em] uppercase mb-6">
              Our Expertise
            </h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold ">
              Luxury Services
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Hair Styling",
                icon: Scissors,
                desc: "Precision cuts, vibrant colors, and luxury treatments.",
              },
              {
                title: "Herbal Spa",
                icon: Sparkles,
                desc: "Traditional herbal wisdom for skin and body rejuvenation.",
              },
              {
                title: "Massaging Therapy",
                icon: Heart,
                desc: "Deep relaxation and therapeutic body massages.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-white p-7 md:p-12 rounded-3xl border border-border-color shadow-sm hover:shadow-2xl transition-all duration-500 group text-center"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="w-20 h-20 bg-salon-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-salon-gold transition-colors duration-500">
                  <service.icon className="w-10 h-10 text-salon-gold group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-black mb-4">
                  {service.title}
                </h4>
                <p className="text-gray-500 font-light leading-relaxed mb-8">
                  {service.desc}
                </p>
                <Link to="/services">
                  <Button
                    variant="ghost"
                    className="text-salon-gold hover:text-salon-gold-dark p-0"
                  >
                    View Details <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Map & Contact info */}
      <section className="py-16 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div data-aos="fade-right">
            <h2 className="text-xs font-bold text-salon-gold tracking-[0.3em] uppercase mb-6">
              Visit Us
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-black mb-8">
              Our Matale Studio
            </h3>
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-salon-gold/10 rounded-xl flex items-center justify-center text-salon-gold shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-black mb-1">Address</h4>
                  <p className="text-gray-500 font-light">
                    {SALON_DATA.contact.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-salon-gold/10 rounded-xl flex items-center justify-center text-salon-gold shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-black mb-1">Operating Hours</h4>
                  <p className="text-gray-500 font-light">
                    {SALON_DATA.contact.hours}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-salon-gold/10 rounded-xl flex items-center justify-center text-salon-gold shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-black mb-1">Call Us</h4>
                  <p className="text-gray-500 font-light">
                    {SALON_DATA.contact.phone}
                  </p>
                </div>
              </div>
            </div>
            <a
              href={SALON_DATA.location.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-black text-white hover:bg-salon-gold tracking-wide shadow-md">
                Get Directions
              </Button>
            </a>
          </div>
          <div
            className="h-64 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-border-color"
            data-aos="fade-left"
          >
            <iframe
              src={SALON_DATA.location.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-7xl font-serif font-bold mb-6 md:mb-10"
          >
            Experience <span className="text-salon-gold italic">Éclat</span>{" "}
            Luxury
          </motion.h2>
          <p className="text-gray-400 text-xl mb-12 font-light leading-relaxed">
            Ready to unveil your inner glow? Book your appointment today and let
            our experts take care of you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/book">
              <Button
                size="lg"
                className="min-w-[200px] bg-salon-gold hover:bg-salon-gold-hover text-white shadow-lg shadow-salon-gold/30 tracking-wide"
              >
                Book Appointment
              </Button>
            </Link>
            <a href={`mailto:${SALON_DATA.contact.email}`}>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] border-white/50 text-white hover:bg-white/10 hover:border-white tracking-wide backdrop-blur-sm"
              >
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
