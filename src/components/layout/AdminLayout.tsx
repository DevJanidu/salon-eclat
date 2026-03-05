import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth.store";
import { ThemeToggle } from "../common/ThemeToggle";

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);

  // Open by default on desktop, closed on mobile
  useEffect(() => {
    if (window.innerWidth >= 1024) setIsSidebarOpen(true);
  }, []);

  // Close when clicking outside on mobile
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (window.innerWidth >= 1024) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Bookings", path: "/admin/bookings", icon: Calendar },
    { name: "Branches", path: "/admin/branches", icon: MapPin },
    { name: "Services", path: "/admin/services", icon: Scissors },
    { name: "Staff", path: "/admin/staff", icon: Users },
    { name: "Portfolio", path: "/admin/portfolio", icon: Image },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-surface border-r border-border-color transition-all duration-300 w-64",
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-20",
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-salon-gold rounded-xl flex items-center justify-center text-white font-serif text-xl font-bold shrink-0">
              S
            </div>
            {isSidebarOpen && (
              <span className="font-serif font-bold text-text-primary tracking-tight">
                SALON <span className="text-salon-gold">ADMIN</span>
              </span>
            )}
          </div>

          <nav className="flex-grow px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all group",
                    !isSidebarOpen && "lg:justify-center",
                    isActive
                      ? "bg-salon-gold text-white shadow-lg shadow-salon-gold/20"
                      : "text-text-secondary hover:bg-salon-gold/10 hover:text-salon-gold",
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-border-color">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 p-3 w-full rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-all",
                !isSidebarOpen && "lg:justify-center",
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content — never shifts on mobile, shifts on desktop only */}
      <main
        className={cn(
          "flex-grow transition-all duration-300 min-w-0",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-surface border-b border-border-color px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-bg rounded-lg text-text-secondary"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                placeholder="Search bookings..."
                className="bg-bg border border-border-color rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-salon-gold outline-none w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <ThemeToggle />
            <button className="relative p-2 hover:bg-bg rounded-lg text-text-secondary">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-6 border-l border-border-color">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-primary truncate max-w-[140px]">
                  {user?.email}
                </p>
                <p className="text-xs text-text-secondary">Administrator</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-salon-gold/20 rounded-full flex items-center justify-center text-salon-gold font-bold shrink-0">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
