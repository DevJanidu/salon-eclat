// ─── Shared ───────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  tokenType: string;
  email: string;
  role: "ADMIN" | "STAFF";
}
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Booking ─────────────────────────────────────────────────────────────────
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface BookingRequest {
  branchId: number;
  services: string[];
  date: string; // ISO date "YYYY-MM-DD"
  time: string;
  customerName: string;
  phone: string;
  email: string;
  notes?: string;
}
export interface Booking {
  id: number;
  branchId: number;
  branchName: string;
  services: string[];
  date: string;
  time: string;
  customerName: string;
  phone: string;
  email: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────
export type ServiceStatus = "ACTIVE" | "INACTIVE";

export interface ServiceRequest {
  name: string;
  category: string;
  price: string;
  duration: string;
  description?: string;
  imageUrl?: string;
  status: ServiceStatus;
}
export interface SalonService {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description?: string;
  imageUrl?: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Staff ───────────────────────────────────────────────────────────────────
export type StaffStatus = "ACTIVE" | "ON_LEAVE" | "INACTIVE";

export interface StaffRequest {
  name: string;
  role: string;
  branchId: number;
  phone?: string;
  email?: string;
  rating?: number;
  imageUrl?: string;
  status: StaffStatus;
}
export interface StaffMember {
  id: number;
  name: string;
  role: string;
  branchId: number;
  branchName: string;
  phone?: string;
  email?: string;
  rating?: number;
  imageUrl?: string;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Branch ──────────────────────────────────────────────────────────────────
export type BranchStatus = "ACTIVE" | "INACTIVE";

export interface BranchRequest {
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  hours?: string;
  mapsUrl?: string;
  imageUrl?: string;
  status: BranchStatus;
}
export interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  hours?: string;
  mapsUrl?: string;
  imageUrl?: string;
  status: BranchStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Portfolio ───────────────────────────────────────────────────────────────
export interface PortfolioRequest {
  title: string;
  category: string;
  description?: string;
  imageUrl: string;
  featured: boolean;
}
export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description?: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalServices: number;
  activeStaff: number;
  totalBranches: number;
  bookingsByStatus: Record<string, number>;
}
