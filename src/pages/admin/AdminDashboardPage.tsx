import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, TrendingUp, MapPin, Loader2 } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { cn } from "@/lib/cn";
import { dashboardApi } from "@/api/dashboard.api";
import { bookingsApi } from "@/api/bookings.api";
import type { DashboardStats, Booking } from "@/api/types";

export default function AdminDashboardPage() {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.getStats(), bookingsApi.getAll()])
      .then(([s, bookings]) => {
        setStats(s);
        setRecentBookings(bookings.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Bookings",
          value: String(stats.totalBookings),
          icon: Calendar,
          trend: stats.confirmedBookings + " confirmed",
          positive: true,
        },
        {
          label: "Total Services",
          value: String(stats.totalServices),
          icon: TrendingUp,
          trend: stats.totalBranches + " branches",
          positive: true,
        },
        {
          label: "Active Staff",
          value: String(stats.activeStaff),
          icon: Users,
          trend: "team members",
          positive: true,
        },
        {
          label: "Completed",
          value: String(stats.completedBookings),
          icon: MapPin,
          trend: stats.cancelledBookings + " cancelled",
          positive: false,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-salon-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-primary">
          Dashboard Overview
        </h1>
        <p className="text-text-secondary">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface p-6 rounded-3xl border border-border-color shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-salon-gold/10 rounded-2xl flex items-center justify-center text-salon-gold">
                <stat.icon className="w-6 h-6" />
              </div>
              <span
                className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  stat.positive
                    ? "bg-green-500/10 text-green-500"
                    : "bg-orange-500/10 text-orange-500",
                )}
              >
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-text-secondary font-medium">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold text-text-primary mt-1">
              {stat.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-border-color shadow-sm">
          <h3 className="text-xl font-serif font-bold text-text-primary mb-8">
            Booking Status
          </h3>
          <div className="h-[300px]">
            {stats && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Pending", count: stats.pendingBookings },
                    { name: "Confirmed", count: stats.confirmedBookings },
                    { name: "Completed", count: stats.completedBookings },
                    { name: "Cancelled", count: stats.cancelledBookings },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? "#302b24" : "#E8E2D8"}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: isDark ? "#8c8070" : "#5A5A5A",
                      fontSize: 12,
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: isDark ? "#8c8070" : "#5A5A5A",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1a1713" : "#FFFFFF",
                      borderRadius: "12px",
                      border: `1px solid ${isDark ? "#302b24" : "#E8E2D8"}`,
                      color: isDark ? "#f0ece2" : "#111111",
                    }}
                  />
                  <Bar dataKey="count" fill="#C6A46C" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-surface p-8 rounded-3xl border border-border-color shadow-sm">
          <h3 className="text-xl font-serif font-bold text-text-primary mb-8">
            Recent Bookings
          </h3>
          <div className="space-y-6">
            {recentBookings.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-4">
                No bookings yet.
              </p>
            ) : (
              recentBookings.map((booking, i) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-bg rounded-full flex items-center justify-center text-salon-gold font-bold">
                      {booking.customerName[0]}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-text-primary group-hover:text-salon-gold transition-colors">
                        {booking.customerName}
                      </h5>
                      <p className="text-xs text-text-secondary">
                        {Array.isArray(booking.services)
                          ? booking.services.join(", ")
                          : booking.services}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-text-primary">
                      {booking.time}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest mt-1",
                        booking.status === "CONFIRMED"
                          ? "text-green-500"
                          : booking.status === "PENDING"
                            ? "text-salon-gold"
                            : "text-text-secondary",
                      )}
                    >
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
