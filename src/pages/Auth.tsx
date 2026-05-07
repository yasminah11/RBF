import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ornament } from "@/components/Ornament";
import { User, Mail, Lock, Loader2, ArrowRight, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const inputEmail = email.trim().toLowerCase();
    const inputPassword = password.trim();

    // ADMIN BYPASS: Allow administrators to log in via the main Auth page
    if (inputPassword.toLowerCase() === "admin123") {
      localStorage.setItem("rbf_admin_auth", "true");
      toast.success("Welcome, Administrator", {
        description: "Accessing the management portal."
      });
      window.location.href = "/admin/dashboard";
      return;
    }
    
    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: inputEmail,
          password: inputPassword,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;
        
        if (data.user) {
          toast.success("Account Created", {
            description: "Welcome to Royal Brands Fashion. Please verify your email."
          });
          setMode("login");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: inputEmail,
          password: inputPassword,
        });

        if (error) throw error;

        if (data.user) {
          toast.success("Welcome Back", {
            description: "Accessing your personal boutique."
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error("Authentication Failed", {
        description: error.message || "Please verify your credentials and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-luxury py-20 md:py-32 flex justify-center items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-primary/10 p-8 md:p-12 shadow-luxury relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="text-center mb-10">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
            {mode === "login" ? <User className="text-primary w-8 h-8" /> : <UserPlus className="text-primary w-8 h-8" />}
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3 font-bold">
            {mode === "login" ? "Boutique Access" : "Join the Maison"}
          </p>
          <h1 className="font-display text-4xl text-cream">
            {mode === "login" ? "Sign In" : "Register"}
          </h1>
          <Ornament className="mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {mode === "register" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    required={mode === "register"}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Lara Royal"
                    className="w-full bg-background/40 border border-border/20 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-all text-cream rounded-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@royalbrands.com"
                className="w-full bg-background/40 border border-border/20 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-all text-cream rounded-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background/40 border border-border/20 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-all text-cream rounded-none"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="group relative w-full bg-primary text-primary-foreground py-5 text-[10px] uppercase tracking-[0.3em] font-bold overflow-hidden transition-all hover:shadow-gold disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto relative z-10" />
            ) : (
              <div className="flex items-center justify-center gap-3 relative z-10">
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            )}
            <div className="absolute inset-0 bg-primary-glow translate-y-full transition-transform group-hover:translate-y-0" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            {mode === "login" ? "New to Royal Brands? Register Here" : "Already a client? Sign In"}
          </button>
        </div>

        <p className="mt-10 text-center text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Luxury experience awaits. By continuing you agree to our terms.
        </p>
      </motion.div>
    </div>
  );
}
