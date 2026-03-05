import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

// Pages
import HomePage from "./pages/public/HomePage";
import ServicesPage from "./pages/public/ServicesPage";
import PortfolioPage from "./pages/public/PortfolioPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import BookAppointmentPage from "./pages/public/BookAppointmentPage";
import BookingSuccessPage from "./pages/public/BookingSuccessPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminStaffPage from "./pages/admin/AdminStaffPage";
import AdminBranchesPage from "./pages/admin/AdminBranchesPage";
import AdminPortfolioPage from "./pages/admin/AdminPortfolioPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import NotFoundPage from "./pages/public/NotFoundPage";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="salon-theme">
        <Toaster position="top-right" richColors closeButton />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/book" element={<BookAppointmentPage />} />
              <Route path="/book/success" element={<BookingSuccessPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="branches" element={<AdminBranchesPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="staff" element={<AdminStaffPage />} />
              <Route path="portfolio" element={<AdminPortfolioPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
