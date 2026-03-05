import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  MessageSquare,
  Instagram,
  Facebook,
  Clock,
  ArrowRight,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "../common/ThemeToggle";
import { Button } from "../ui/button";
import { SALON_DATA, getWhatsAppLink } from "@/config/constants";

export function PublicLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/portfolio" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
          isScrolled
            ? "bg-black/78 backdrop-blur-md shadow-lg border-b border-salon-gold/25 py-3"
            : "bg-black/45 backdrop-blur-[10px] py-4",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-salon-gold rounded-full flex items-center justify-center text-white font-serif text-xl font-bold shadow-inner">
              <img
                src="https://res.cloudinary.com/dg3rk2yot/image/upload/v1772730569/logo_eyv3fr.png"
                alt="logo"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold tracking-tight text-white">
                ÉCLAT <span className="text-salon-gold">SALON</span>
              </span>
              <span className="text-[10px] text-salon-champagne/80 tracking-[0.2em] uppercase -mt-1 font-medium">
                Hair & Beauty
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-all duration-300 hover:text-salon-gold tracking-wide",
                    isActive ? "text-salon-gold" : "text-white",
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle className="text-white hover:text-salon-gold" />
            <Link to="/book">
              <Button
                size="sm"
                className="bg-salon-gold hover:bg-salon-gold-dark text-white border-none px-6"
              >
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <ThemeToggle className="text-white" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 hover:text-salon-gold transition-colors"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 lg:hidden flex items-center justify-center",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div className="flex flex-col items-center gap-8 p-8">
          <nav className="flex flex-col gap-8 text-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-3xl font-serif font-medium transition-colors",
                    isActive ? "text-salon-gold" : "text-white",
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link to="/book" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full mt-4 px-12" size="lg">
                Book Appointment
              </Button>
            </Link>
          </nav>

          <div className="flex gap-6 mt-8">
            <a
              href={SALON_DATA.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-salon-gold transition-colors"
            >
              <span className="text-sm font-bold uppercase tracking-widest">
                TikTok
              </span>
            </a>
            <a
              href={SALON_DATA.social.instagram}
              className="text-white hover:text-salon-gold transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href={SALON_DATA.social.facebook}
              className="text-white hover:text-salon-gold transition-colors"
            >
              <Facebook className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-6 border-t border-salon-gold/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-salon-gold rounded-full flex items-center justify-center text-white font-serif text-xl font-bold">
                É
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight">
                ÉCLAT <span className="text-salon-gold">SALON</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              {SALON_DATA.aboutShort}
            </p>
            <div className="flex gap-4">
              <a
                href={SALON_DATA.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-salon-gold hover:text-white transition-all"
              >
                <span className="text-[10px] font-bold">TT</span>
              </a>
              <a
                href={SALON_DATA.social.instagram}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-salon-gold hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SALON_DATA.social.facebook}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-salon-gold hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-xl mb-8 text-salon-gold">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-light">
              <li>
                <Link
                  to="/"
                  className="hover:text-salon-gold transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-salon-gold transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="hover:text-salon-gold transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-salon-gold transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-salon-gold transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-xl mb-8 text-salon-gold">
              Contact Info
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-light">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-salon-gold shrink-0 mt-1" />
                <span>Phone: {SALON_DATA.contact.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-salon-gold shrink-0 mt-1" />
                <span>WhatsApp: +{SALON_DATA.contact.whatsapp}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-salon-gold shrink-0 mt-1" />
                <span>{SALON_DATA.contact.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-salon-gold shrink-0 mt-1" />
                <span>{SALON_DATA.contact.hours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-xl mb-8 text-salon-gold">
              Location
            </h4>
            <p className="text-sm text-gray-400 font-light mb-6">
              {SALON_DATA.contact.address}
            </p>
            <a
              href={SALON_DATA.location.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-salon-gold text-sm font-bold uppercase tracking-widest hover:text-salon-champagne transition-colors"
            >
              Get Directions <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} {SALON_DATA.name}. Luxury Hair & Beauty
            Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}
