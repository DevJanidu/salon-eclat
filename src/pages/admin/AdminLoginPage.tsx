import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/api/auth.api";

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await authApi.login(data);
      setAuth(response.token, {
        email: response.email,
        role: response.role,
      });
      navigate("/admin/dashboard");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ?? "Invalid username or password.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-salon-gold rounded-full flex items-center justify-center text-white font-serif text-3xl font-bold mx-auto mb-6">
            S
          </div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">
            Admin Portal
          </h1>
          <p className="text-text-secondary mt-2">
            Please sign in to manage your salon.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface p-8 rounded-3xl border border-border-color shadow-xl space-y-6"
        >
          {errorMsg && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary uppercase tracking-widest">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                className="w-full bg-bg border border-border-color rounded-xl p-4 pl-12 focus:ring-2 focus:ring-salon-gold outline-none transition-all"
                placeholder="admin@saloneclact.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full bg-bg border border-border-color rounded-xl p-4 pl-12 focus:ring-2 focus:ring-salon-gold outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              <>
                Sign In{" "}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-text-secondary">
            Forgot password? Contact system administrator.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
