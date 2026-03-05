import React, { useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

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
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-surface border-r border-border-color transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20",
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
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all group",
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
                !isSidebarOpen && "justify-center",
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-grow transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-20",
        )}
      >
        {/* Topbar */}
        <header className="h-20 bg-surface border-b border-border-color px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-bg rounded-lg text-text-secondary"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                placeholder="Search bookings..."
                className="bg-bg border border-border-color rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-salon-gold outline-none w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button className="relative p-2 hover:bg-bg rounded-lg text-text-secondary">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-border-color">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-primary">
                  {user?.email}
                </p>
                <p className="text-xs text-text-secondary">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-salon-gold/20 rounded-full flex items-center justify-center text-salon-gold font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
