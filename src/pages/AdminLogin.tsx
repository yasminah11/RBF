import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ornament } from "@/components/Ornament";
import {
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Initial Auth Check
  useEffect(() => {
    const checkExistingAuth = async () => {
      // Check local bypass flag
      if (localStorage.getItem("rbf_admin_auth") === "true") {
        console.log("Found existing admin bypass flag, redirecting...");
        navigate("/admin/dashboard");
        return;
      }

      // Check Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();

        if (roles) {
          console.log("Found existing Supabase admin session, redirecting...");
          navigate("/admin/dashboard");
        }
      }
    };
    checkExistingAuth();
  }, [navigate]);

  // 2. Direct Bypass Handler
  const handleQuickAccess = () => {
    console.log("Executing Quick Access Bypass");
    localStorage.setItem("rbf_admin_auth", "true");
    toast.success("Welcome, Administrator", {
      description: "Quick access granted for development.",
    });
    // Use window.location for a hard redirect if navigate is failing
    window.location.href = "/admin/dashboard";
  };

  // 3. Form Submission Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const inputEmail = email.trim().toLowerCase();
    const inputPassword = password.trim();

    console.log("Login submitted:", { email: inputEmail, pass: inputPassword });

    // PRIORITY BYPASS: If password is Admin123, ignore everything else
    if (inputPassword.toLowerCase() === "admin123") {
      console.log("Bypass password detected!");
      localStorage.setItem("rbf_admin_auth", "true");
      toast.success("Welcome, Administrator", {
        description: "Development bypass active.",
      });
      // Small delay to ensure toast and storage are processed
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 100);
      return;
    }

    try {
      // Real Supabase Auth attempt
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password: inputPassword,
      });

      if (error) throw error;

      if (data.user) {
        // Verify admin role in DB
        const { data: roles, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .single();

        if (roleError || !roles) {
          await supabase.auth.signOut();
          throw new Error("Access denied. Admin privileges required.");
        }

        localStorage.setItem("rbf_admin_auth", "true");
        toast.success("Welcome, Administrator", {
          description: "Authenticated via Supabase.",
        });
        navigate("/admin/dashboard");
      }
    } catch (error: unknown) {
      console.error("Authentication Error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Invalid credentials. Try using password: Admin123";
      toast.error("Authentication Failed", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-luxury py-20 md:py-32 flex flex-col justify-center items-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-primary/10 p-8 md:p-12 shadow-luxury relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="text-center mb-10">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <ShieldCheck className="text-primary w-8 h-8" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3 font-bold">
            Maison Portal
          </p>
          <h1 className="font-display text-4xl text-cream">Admin Access</h1>
          <Ornament className="mt-4" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@royal.com"
                className="w-full bg-background/40 border border-primary/20 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-all text-cream rounded-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <span className="text-[8px] text-primary/60 italic font-bold">
                Use: Admin123
              </span>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background/40 border border-primary/20 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-all text-cream rounded-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-primary text-primary-foreground py-5 text-[10px] uppercase tracking-[0.3em] font-bold overflow-hidden transition-all hover:shadow-gold disabled:opacity-50 mt-4"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto relative z-10" />
            ) : (
              <div className="flex items-center justify-center gap-3 relative z-10">
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            )}
            <div className="absolute inset-0 bg-primary-glow translate-y-full transition-transform group-hover:translate-y-0" />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-primary/10">
          <button
            type="button"
            onClick={handleQuickAccess}
            className="w-full border border-primary/20 bg-primary/5 hover:bg-primary/10 py-4 text-[9px] uppercase tracking-[0.2em] text-primary font-bold flex items-center justify-center gap-3 transition-all"
          >
            <Zap className="h-3 w-3" /> Quick Access (Demo Account)
          </button>
        </div>

        <p className="mt-10 text-center text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Authorized personnel only. All access attempts are logged.
        </p>
      </motion.div>
    </div>
  );
}
