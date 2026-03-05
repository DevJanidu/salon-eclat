import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

/* ── Floating petal particle ─────────────────────────────────────────────── */
interface Petal {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
  opacity: number;
}

function usePetals(count: number): Petal[] {
  const ref = useRef<Petal[]>([]);
  if (ref.current.length === 0) {
    ref.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 4 + Math.random() * 10,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
      opacity: 0.15 + Math.random() * 0.35,
    }));
  }
  return ref.current;
}

/* ── Animated digit ──────────────────────────────────────────────────────── */
function GlitchDigit({ char }: { char: string }) {
  return (
    <div className="relative inline-block select-none">
      {/* Shadow layers */}
      <span
        aria-hidden
        className="absolute inset-0 text-salon-gold/20 blur-[2px] font-serif font-black"
        style={{ transform: "translate(3px, 3px)" }}
      >
        {char}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 text-salon-champagne/30 font-serif font-black"
        style={{ transform: "translate(-2px, -1px)" }}
      >
        {char}
      </span>
      {/* Main digit */}
      <motion.span
        className="relative font-serif font-black bg-linear-to-b from-salon-champagne via-salon-gold to-salon-gold-dark bg-clip-text text-transparent"
        animate={{
          textShadow: [
            "0 0 20px rgba(212,175,55,0.4)",
            "0 0 60px rgba(212,175,55,0.8)",
            "0 0 20px rgba(212,175,55,0.4)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {char}
      </motion.span>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function NotFoundPage() {
  const { pathname } = useLocation();
  const petals = usePetals(18);

  /* prevent scroll on this page */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#080604]">
      {/* ── Radial glow ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-salon-gold/8 blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-salon-champagne/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-salon-bronze/5 blur-[100px]" />
      </div>

      {/* ── Animated grid overlay ────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-salon-gold, #d4af37) 1px, transparent 1px), linear-gradient(90deg, var(--color-salon-gold, #d4af37) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Falling petals ───────────────────────────────────────────────── */}
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none absolute top-0 rounded-full bg-salon-gold"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [p.rotate, p.rotate + 360],
            x: [0, Math.sin(p.id) * 60],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* ── Logo pill ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8"
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-salon-gold rounded-full flex items-center justify-center text-white font-serif text-xl font-bold shadow-lg shadow-salon-gold/30">
            É
          </div>
          <span className="font-serif font-bold text-lg text-white tracking-tight">
            ÉCLAT <span className="text-salon-gold">SALON</span>
          </span>
        </Link>
      </motion.div>

      {/* ── 4 0 4 ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
        className="text-[clamp(6rem,22vw,16rem)] leading-none tracking-tighter z-10"
      >
        <GlitchDigit char="4" />
        <GlitchDigit char="0" />
        <GlitchDigit char="4" />
      </motion.div>

      {/* ── Decorative divider ───────────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        className="z-10 flex items-center gap-4 mt-2 mb-6"
      >
        <div className="h-px w-24 bg-linear-to-r from-transparent to-salon-gold/60" />
        <Sparkles className="w-4 h-4 text-salon-gold" />
        <div className="h-px w-24 bg-linear-to-l from-transparent to-salon-gold/60" />
      </motion.div>

      {/* ── Copy ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="z-10 text-center px-6 max-w-md"
      >
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-white/50 text-sm md:text-base leading-relaxed mb-2">
          The page{" "}
          <span className="text-salon-gold font-medium font-mono text-xs bg-white/5 px-2 py-0.5 rounded">
            {pathname}
          </span>{" "}
          doesn't exist.
        </p>
        <p className="text-white/35 text-sm">
          Let's guide you back to where the beauty begins.
        </p>
      </motion.div>

      {/* ── CTA buttons ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="z-10 flex flex-wrap items-center justify-center gap-4 mt-8"
      >
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2 bg-salon-gold hover:bg-salon-gold-dark text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-salon-gold/25 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-200" />
            Back to Home
          </motion.button>
        </Link>
        <Link to="/book">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 border border-salon-gold/40 hover:border-salon-gold text-salon-gold font-bold px-7 py-3.5 rounded-2xl transition-colors duration-200 hover:bg-salon-gold/10"
          >
            <Sparkles className="w-4 h-4" />
            Book Appointment
          </motion.button>
        </Link>
      </motion.div>

      {/* ── Bottom quote ─────────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-8 text-white/20 text-xs tracking-[0.25em] uppercase font-medium z-10"
      >
        Glow with Éclat — Unveil Your Inner Glow
      </motion.p>
    </div>
  );
}
