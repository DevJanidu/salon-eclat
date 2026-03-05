import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  MessageSquare,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { authApi } from "@/api/auth.api";
const STORAGE_KEY = "eclat-salon-settings";

interface SalonSettings {
  name: string;
  tagline: string;
  aboutShort: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  tiktok: string;
  instagram: string;
  facebook: string;
  googleMapsLink: string;
}

const defaultSettings: SalonSettings = {
  name: "Éclat Hair & Beauty Salon",
  tagline: "Glow with Éclat! Unveil Your Inner Glow.",
  aboutShort:
    "Éclat Beauty Salon offers premium hair, skin, and makeup services designed to enhance your natural beauty.",
  phone: "+94 777393482",
  whatsapp: "94773049957",
  email: "saloneclatmatale@gmail.com",
  address: "Matale, Sri Lanka",
  hours: "8.00am – 10.30pm",
  tiktok: "",
  instagram: "",
  facebook: "",
  googleMapsLink: "",
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-surface rounded-3xl border border-border-color p-8 shadow-sm">
    <h3 className="text-lg font-serif font-bold text-text-primary mb-6 pb-4 border-b border-border-color">
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
      {label}
    </label>
    {children}
  </div>
);

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SalonSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Change Password state
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError(null);
    if (
      !pwForm.currentPassword ||
      !pwForm.newPassword ||
      !pwForm.confirmPassword
    ) {
      setPwError("All fields are required.");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New password and confirm password do not match.");
      return;
    }
    setPwSaving(true);
    try {
      await authApi.changePassword(pwForm);
      setPwSuccess(true);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to change password. Please try again.";
      setPwError(msg);
    } finally {
      setPwSaving(false);
    }
  };

  const input = (
    key: keyof SalonSettings,
    placeholder?: string,
    type = "text",
  ) => (
    <input
      type={type}
      value={settings[key] as string}
      onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
      placeholder={placeholder}
      className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
    />
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-salon-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">
            Salon Settings
          </h1>
          <p className="text-text-secondary">
            Manage your salon's public information and contact details.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-salon-gold text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-salon-gold-dark transition-all shadow-lg shadow-salon-gold/20 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      {/* General Info */}
      <Section title="General Information">
        <div className="space-y-5">
          <Field label="Salon Name">
            {input("name", "Éclat Hair & Beauty Salon")}
          </Field>
          <Field label="Tagline">{input("tagline", "Glow with Éclat!")}</Field>
          <Field label="About (Short Description)">
            <textarea
              value={settings.aboutShort}
              onChange={(e) =>
                setSettings({ ...settings, aboutShort: e.target.value })
              }
              rows={4}
              className="w-full bg-bg border border-border-color rounded-xl p-3 text-sm focus:ring-2 focus:ring-salon-gold outline-none resize-none"
              placeholder="A short description of your salon..."
            />
          </Field>
        </div>
      </Section>

      {/* Contact Info */}
      <Section title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Phone Number">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full bg-bg border border-border-color rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                placeholder="+94 777 393 482"
              />
            </div>
          </Field>
          <Field label="WhatsApp Number (digits only)">
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                value={settings.whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp: e.target.value })
                }
                className="w-full bg-bg border border-border-color rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                placeholder="94773049957"
              />
            </div>
          </Field>
          <Field label="Email Address">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full bg-bg border border-border-color rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                placeholder="salon@example.com"
              />
            </div>
          </Field>
          <Field label="Working Hours">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                value={settings.hours}
                onChange={(e) =>
                  setSettings({ ...settings, hours: e.target.value })
                }
                className="w-full bg-bg border border-border-color rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                placeholder="8.00am – 10.30pm"
              />
            </div>
          </Field>
          <div className="md:col-span-2">
            <Field label="Address">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  className="w-full bg-bg border border-border-color rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                  placeholder="Matale, Sri Lanka"
                />
              </div>
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Google Maps Link">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  value={settings.googleMapsLink}
                  onChange={(e) =>
                    setSettings({ ...settings, googleMapsLink: e.target.value })
                  }
                  className="w-full bg-bg border border-border-color rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </Field>
          </div>
        </div>
      </Section>

      {/* Social Media */}
      <Section title="Social Media">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="TikTok URL">
            {input("tiktok", "https://tiktok.com/@yoursalon")}
          </Field>
          <Field label="Instagram URL">
            {input("instagram", "https://instagram.com/yoursalon")}
          </Field>
          <Field label="Facebook URL">
            {input("facebook", "https://facebook.com/yoursalon")}
          </Field>
        </div>
      </Section>

      {/* Change Password */}
      <Section title="Change Password">
        <div className="space-y-5 max-w-md">
          {pwError && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Password changed successfully!
            </div>
          )}
          <Field label="Current Password">
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                className="w-full bg-bg border border-border-color rounded-xl p-3 pr-10 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </Field>
          <Field label="New Password">
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, newPassword: e.target.value })
                }
                placeholder="Minimum 6 characters"
                className="w-full bg-bg border border-border-color rounded-xl p-3 pr-10 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </Field>
          <Field label="Confirm New Password">
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={pwForm.confirmPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, confirmPassword: e.target.value })
                }
                placeholder="Repeat new password"
                className="w-full bg-bg border border-border-color rounded-xl p-3 pr-10 text-sm focus:ring-2 focus:ring-salon-gold outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </Field>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleChangePassword}
            disabled={pwSaving}
            className="bg-salon-gold text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-salon-gold-dark transition-all shadow-lg shadow-salon-gold/20 disabled:opacity-60"
          >
            {pwSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <KeyRound className="w-5 h-5" />
            )}
            {pwSaving ? "Changing..." : "Change Password"}
          </motion.button>
        </div>
      </Section>

      {/* Save (bottom) */}
      <div className="flex justify-end pb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="bg-salon-gold text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-salon-gold-dark transition-all shadow-lg shadow-salon-gold/20 disabled:opacity-60 text-lg"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saved ? "Settings Saved!" : "Save All Settings"}
        </motion.button>
      </div>
    </div>
  );
}
