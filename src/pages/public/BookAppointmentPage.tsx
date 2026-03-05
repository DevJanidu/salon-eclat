import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Scissors,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Search,
  X,
  Star,
  Users,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { branchesApi } from "@/api/branches.api";
import { servicesApi } from "@/api/services.api";
import { staffApi } from "@/api/staff.api";
import { bookingsApi } from "@/api/bookings.api";
import type { Branch, SalonService, StaffMember } from "@/api/types";

const bookingSchema = z.object({
  branch: z.string().min(1, "Please select a branch"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  staffPreference: z.string().optional(),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const steps = [
  { id: "branch", title: "Select Branch", icon: MapPin },
  { id: "service", title: "Choose Services", icon: Scissors },
  { id: "stylist", title: "Pick Stylist", icon: Users },
  { id: "datetime", title: "Date & Time", icon: Calendar },
  { id: "contact", title: "Your Details", icon: User },
];

// ─── Service selection sub-component ──────────────────────────────────────
function ServiceSelector({
  services,
  selectedServices,
  onToggle,
}: {
  services: SalonService[];
  selectedServices: string[];
  onToggle: (name: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(services.map((s) => s.category)));
    return ["All", ...cats];
  }, [services]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return services.filter((s) => {
      const matchCat =
        activeCategory === "All" || s.category === activeCategory;
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [services, activeCategory, search]);

  const totalDuration = services
    .filter((s) => selectedServices.includes(s.name))
    .reduce((sum, s) => sum + Number(s.duration), 0);
  const totalPrice = services
    .filter((s) => selectedServices.includes(s.name))
    .reduce((sum, s) => sum + Number(s.price), 0);

  return (
    <div className="space-y-5">
      {/* Selected summary chips */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 items-center justify-between bg-salon-gold/10 border border-salon-gold/30 rounded-2xl px-5 py-3"
        >
          <div className="flex flex-wrap gap-2">
            {selectedServices.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1.5 text-xs bg-salon-gold text-white px-3 py-1.5 rounded-full font-medium"
              >
                {name}
                <button
                  type="button"
                  onClick={() => onToggle(name)}
                  className="hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-text-secondary whitespace-nowrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {totalDuration} mins
            </span>
            <span className="font-bold text-salon-gold">
              {totalPrice.toLocaleString()} LKR
            </span>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services…"
          className="w-full bg-bg border border-border-color rounded-xl py-3 pl-11 pr-10 focus:ring-2 focus:ring-salon-gold outline-none transition-all text-text-primary text-sm placeholder:text-text-secondary/60"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex gap-2 flex-nowrap">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? services.length
                : services.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5",
                  activeCategory === cat
                    ? "bg-salon-gold text-white shadow shadow-salon-gold/20"
                    : "bg-bg border border-border-color text-text-secondary hover:border-salon-gold hover:text-salon-gold",
                )}
              >
                {cat}
                <span
                  className={cn(
                    "text-xs px-1 rounded-full font-normal",
                    activeCategory === cat ? "bg-white/20" : "bg-border-color",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {filtered.length} service{filtered.length !== 1 ? "s" : ""} shown
        </span>
        {(search || activeCategory !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
            }}
            className="text-salon-gold hover:underline font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Service list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-8 h-8 text-border-color mx-auto mb-3" />
          <p className="text-text-secondary text-sm italic">
            No services found{search ? ` for "${search}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {filtered.map((service) => {
            const isSelected = selectedServices.includes(service.name);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onToggle(service.name)}
                className={cn(
                  "text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden group",
                  isSelected
                    ? "border-salon-gold bg-salon-gold/5 shadow-md shadow-salon-gold/10"
                    : "border-border-color hover:border-salon-gold/40 bg-bg",
                )}
              >
                <div className="flex items-stretch">
                  {service.imageUrl && (
                    <div className="w-20 flex-shrink-0 overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-text-primary text-sm leading-tight">
                        {service.name}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 uppercase tracking-widest">
                        {service.category}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-text-secondary">
                          <Clock className="w-3 h-3" />
                          {service.duration} min
                        </span>
                        <span className="text-xs font-bold text-salon-gold">
                          {Number(service.price).toLocaleString()} LKR
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-salon-gold border-salon-gold"
                          : "border-border-color",
                      )}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Stylist selection sub-component ──────────────────────────────────────
function StylistSelector({
  staff,
  selectedBranchId,
  selectedStylist,
  onSelect,
}: {
  staff: StaffMember[];
  selectedBranchId: string;
  selectedStylist: string;
  onSelect: (name: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("All");

  const branchStaff = useMemo(
    () =>
      staff.filter(
        (s) =>
          s.status === "ACTIVE" &&
          (!selectedBranchId || String(s.branchId) === selectedBranchId),
      ),
    [staff, selectedBranchId],
  );

  const roles = useMemo(() => {
    const r = Array.from(new Set(branchStaff.map((s) => s.role)));
    return ["All", ...r];
  }, [branchStaff]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return branchStaff.filter((s) => {
      const matchRole = activeRole === "All" || s.role === activeRole;
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [branchStaff, activeRole, search]);

  return (
    <div className="space-y-5">
      <div className="bg-bg border border-border-color rounded-2xl p-4 text-sm text-text-secondary">
        <p className="flex items-center gap-2">
          <Star className="w-4 h-4 text-salon-gold flex-shrink-0" />
          This step is <strong className="text-text-primary">optional</strong>.
          You can skip and any available stylist will be assigned.
        </p>
      </div>

      {/* Any stylist option */}
      <button
        type="button"
        onClick={() => onSelect("")}
        className={cn(
          "w-full text-left rounded-2xl border-2 p-5 transition-all flex items-center gap-4",
          !selectedStylist
            ? "border-salon-gold bg-salon-gold/5 shadow-md shadow-salon-gold/10"
            : "border-border-color hover:border-salon-gold/40 bg-bg",
        )}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
            !selectedStylist ? "bg-salon-gold" : "bg-border-color",
          )}
        >
          <Users
            className={cn(
              "w-6 h-6",
              !selectedStylist ? "text-white" : "text-text-secondary",
            )}
          />
        </div>
        <div className="flex-1">
          <p className="font-bold text-text-primary">Any Available Stylist</p>
          <p className="text-xs text-text-secondary mt-0.5">
            We'll assign the best available stylist for your appointment
          </p>
        </div>
        {!selectedStylist && (
          <CheckCircle2 className="w-5 h-5 text-salon-gold flex-shrink-0" />
        )}
      </button>

      {branchStaff.length > 0 && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or role…"
              className="w-full bg-bg border border-border-color rounded-xl py-3 pl-11 pr-10 focus:ring-2 focus:ring-salon-gold outline-none transition-all text-text-primary text-sm placeholder:text-text-secondary/60"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Role filter */}
          <div className="overflow-x-auto pb-1 -mx-1 px-1">
            <div className="flex gap-2 flex-nowrap">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                    activeRole === role
                      ? "bg-salon-gold text-white shadow shadow-salon-gold/20"
                      : "bg-bg border border-border-color text-text-secondary hover:border-salon-gold hover:text-salon-gold",
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Staff grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-8 h-8 text-border-color mx-auto mb-3" />
              <p className="text-text-secondary text-sm italic">
                No stylists found{search ? ` for "${search}"` : ""}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {filtered.map((member) => {
                const isSelected = selectedStylist === member.name;
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => onSelect(member.name)}
                    className={cn(
                      "text-left rounded-2xl border-2 p-4 transition-all flex items-center gap-4 group",
                      isSelected
                        ? "border-salon-gold bg-salon-gold/5 shadow-md shadow-salon-gold/10"
                        : "border-border-color hover:border-salon-gold/40 bg-bg",
                    )}
                  >
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0 group-hover:ring-2 group-hover:ring-salon-gold/30 transition-all"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-salon-gold/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-7 h-7 text-salon-gold" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-primary text-sm leading-tight truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 uppercase tracking-widest">
                        {member.role}
                      </p>
                      {member.rating && (
                        <div className="flex items-center gap-0.5 mt-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-3 h-3",
                                i < Math.round(member.rating!)
                                  ? "text-salon-gold fill-salon-gold"
                                  : "text-border-color",
                              )}
                            />
                          ))}
                          <span className="text-xs text-text-secondary ml-1">
                            {member.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-salon-gold flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {branchStaff.length === 0 && (
        <div className="text-center py-8 text-text-secondary text-sm">
          <Users className="w-8 h-8 text-border-color mx-auto mb-3" />
          No stylists listed for this branch yet. One will be assigned at
          booking.
        </div>
      )}
    </div>
  );
}

// ─── Main booking page ─────────────────────────────────────────────────────
export default function BookAppointmentPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<SalonService[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [branchData, serviceData, staffData] = await Promise.all([
          branchesApi.getAll(),
          servicesApi.getAll(),
          staffApi.getAll(),
        ]);
        setBranches(branchData.filter((b) => b.status === "ACTIVE"));
        setServices(serviceData.filter((s) => s.status === "ACTIVE"));
        setStaff(staffData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      branch: "",
      services: [],
      staffPreference: "",
      date: "",
      time: "",
      name: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const selectedBranch = watch("branch");
  const selectedServices = watch("services") || [];
  const selectedStylist = watch("staffPreference") ?? "";
  const selectedDate = watch("date");
  const selectedTime = watch("time");

  const toggleService = (serviceName: string) => {
    const current = [...selectedServices];
    const index = current.indexOf(serviceName);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(serviceName);
    }
    setValue("services", current);
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const noteParts = [
        data.staffPreference
          ? `Preferred Stylist: ${data.staffPreference}`
          : null,
        data.notes || null,
      ].filter(Boolean);

      await bookingsApi.create({
        branchId: Number(data.branch),
        services: data.services,
        date: data.date,
        time: data.time,
        customerName: data.name,
        phone: data.phone,
        email: data.email,
        notes: noteParts.length ? noteParts.join("\n\n") : undefined,
      });
      navigate("/book/success", { state: { booking: data } });
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4">
            Book Appointment
          </h1>
          <p className="text-text-secondary">
            Follow the steps below to secure your luxury experience.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-12 relative">
          <div className="absolute top-6 left-0 w-full h-0.5 bg-border-color z-0" />
          <div
            className="absolute top-6 left-0 h-0.5 bg-salon-gold z-0 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          <div className="relative z-10 flex justify-between">
            {steps.map((step, i) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                    i < currentStep
                      ? "bg-salon-gold text-white"
                      : i === currentStep
                        ? "bg-salon-gold text-white ring-4 ring-salon-gold/20"
                        : "bg-surface text-text-secondary border border-border-color",
                  )}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-xs font-bold mt-2 uppercase tracking-tighter hidden md:block",
                    i <= currentStep
                      ? "text-salon-gold"
                      : "text-text-secondary",
                  )}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface rounded-[2rem] border border-border-color p-8 md:p-12 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {/* ── Step 0: Branch ── */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-serif font-bold text-text-primary">
                  Where would you like to visit?
                </h2>
                {loadingData ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-salon-gold" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {branches.map((branch) => (
                      <div
                        key={branch.id}
                        onClick={() => setValue("branch", String(branch.id))}
                        className={cn(
                          "relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group",
                          selectedBranch === String(branch.id)
                            ? "border-salon-gold shadow-lg"
                            : "border-transparent hover:border-salon-gold/30",
                        )}
                      >
                        {branch.imageUrl ? (
                          <img
                            src={branch.imageUrl}
                            alt={branch.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-surface to-bg flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-border-color" />
                          </div>
                        )}
                        <div className="p-6 bg-surface">
                          <h3 className="font-bold text-lg text-text-primary">
                            {branch.name}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {branch.address ? `${branch.address}, ` : ""}
                            {branch.city}
                          </p>
                        </div>
                        {selectedBranch === String(branch.id) && (
                          <div className="absolute top-4 right-4 bg-salon-gold text-white p-1 rounded-full">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end pt-8">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedBranch}
                    className="group"
                  >
                    Next Step{" "}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 1: Services ── */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif font-bold text-text-primary">
                    What services are you looking for?
                  </h2>
                  <span className="text-xs font-bold text-salon-gold uppercase tracking-widest">
                    Select multiple
                  </span>
                </div>
                {loadingData ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-salon-gold" />
                  </div>
                ) : (
                  <ServiceSelector
                    services={services}
                    selectedServices={selectedServices}
                    onToggle={toggleService}
                  />
                )}
                {errors.services && (
                  <p className="text-red-500 text-xs">
                    {errors.services.message}
                  </p>
                )}
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="ghost" onClick={prevStep}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={selectedServices.length === 0}
                    className="group"
                  >
                    Next Step{" "}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Stylist ── */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif font-bold text-text-primary">
                    Choose your stylist
                  </h2>
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-widest bg-bg border border-border-color px-3 py-1 rounded-full">
                    Optional
                  </span>
                </div>
                {loadingData ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-salon-gold" />
                  </div>
                ) : (
                  <StylistSelector
                    staff={staff}
                    selectedBranchId={selectedBranch}
                    selectedStylist={selectedStylist}
                    onSelect={(name) => setValue("staffPreference", name)}
                  />
                )}
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="ghost" onClick={prevStep}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="group">
                    {selectedStylist ? "Next Step" : "Skip & Continue"}{" "}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Date & Time ── */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-serif font-bold text-text-primary">
                  When would you like to come?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-text-primary uppercase tracking-widest">
                      Select Date
                    </label>
                    <input
                      type="date"
                      {...register("date")}
                      className="w-full bg-bg border border-border-color rounded-xl p-4 focus:ring-2 focus:ring-salon-gold outline-none transition-all"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-text-primary uppercase tracking-widest">
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "09:00",
                        "10:00",
                        "11:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                      ].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setValue("time", time)}
                          className={cn(
                            "py-3 rounded-xl border text-sm font-medium transition-all",
                            selectedTime === time
                              ? "bg-salon-gold text-white border-salon-gold"
                              : "bg-bg border-border-color hover:border-salon-gold/30",
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-8">
                  <Button type="button" variant="ghost" onClick={prevStep}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedDate || !selectedTime}
                    className="group"
                  >
                    Next Step{" "}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Contact ── */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-serif font-bold text-text-primary">
                  Final details
                </h2>

                {/* Booking summary */}
                <div className="bg-bg border border-border-color rounded-2xl p-5 space-y-3 text-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">
                    Booking Summary
                  </h3>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Branch</span>
                    <span className="font-medium text-text-primary">
                      {branches.find((b) => String(b.id) === selectedBranch)
                        ?.name ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-text-secondary flex-shrink-0">
                      Services
                    </span>
                    <span className="font-medium text-text-primary text-right">
                      {selectedServices.join(", ")}
                    </span>
                  </div>
                  {selectedStylist && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Stylist</span>
                      <span className="font-medium text-text-primary">
                        {selectedStylist}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Date & Time</span>
                    <span className="font-medium text-text-primary">
                      {selectedDate} at {selectedTime}
                    </span>
                  </div>
                  <div className="border-t border-border-color pt-3 flex justify-between font-bold">
                    <span className="text-text-secondary">Total Est.</span>
                    <span className="text-salon-gold">
                      {services
                        .filter((s) => selectedServices.includes(s.name))
                        .reduce((sum, s) => sum + Number(s.price), 0)
                        .toLocaleString()}{" "}
                      LKR
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary uppercase tracking-widest">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        {...register("name")}
                        placeholder="Jane Doe"
                        className="w-full bg-bg border border-border-color rounded-xl p-4 pl-12 focus:ring-2 focus:ring-salon-gold outline-none transition-all"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary uppercase tracking-widest">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        {...register("phone")}
                        placeholder="077 123 4567"
                        className="w-full bg-bg border border-border-color rounded-xl p-4 pl-12 focus:ring-2 focus:ring-salon-gold outline-none transition-all"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-text-primary uppercase tracking-widest">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        {...register("email")}
                        placeholder="jane@example.com"
                        className="w-full bg-bg border border-border-color rounded-xl p-4 pl-12 focus:ring-2 focus:ring-salon-gold outline-none transition-all"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-text-primary uppercase tracking-widest">
                      Special Notes
                    </label>
                    <textarea
                      {...register("notes")}
                      rows={4}
                      placeholder="Any specific requests or allergies?"
                      className="w-full bg-bg border border-border-color rounded-xl p-4 focus:ring-2 focus:ring-salon-gold outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-between pt-8">
                  <Button type="button" variant="ghost" onClick={prevStep}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="group px-5 shadow-md shadow-salon-gold/20 tracking-wide text-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                        Processing…
                      </>
                    ) : (
                      <>
                        Confirm Booking{" "}
                        <CheckCircle2 className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
