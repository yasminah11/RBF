import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Banknote, Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nContext";
import { createPaymentSession, type PaymentSessionRequest } from "@/lib/payment-api";

type PaymentMethod = "iyzico" | "cod";

interface PaymentSectionProps {
  items: any[];
  totalAmount: number;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
  };
  isValid: boolean;
}

export function PaymentSection({ items, totalAmount, clientInfo, isValid }: PaymentSectionProps) {
  const { t } = useI18n();
  const [method, setMethod] = useState<PaymentMethod>("iyzico");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  // Initialize Iyzico session when method is selected and form is valid
  useEffect(() => {
    if (method === "iyzico" && isValid && !sessionInitialized) {
      initializeIyzico();
    }
  }, [method, isValid]);

  const initializeIyzico = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await createPaymentSession({
        items,
        totalAmount,
        currency: "TRY",
        clientInfo
      });

      if (response.status === "success" && response.checkoutFormContent) {
        setSessionInitialized(true);
        // In a real integration, the backend returns a script tag or content
        // which would be injected into the DOM.
        const container = document.getElementById("iyzico-checkout-form");
        if (container) {
          container.innerHTML = response.checkoutFormContent;
        }
      } else {
        setError(response.errorMessage || "Failed to initialize payment gateway.");
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-card/40 backdrop-blur-sm border border-border/10 p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-border/10 pb-4">
        <CreditCard className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl text-cream">{t.checkout.paymentMethod}</h2>
      </div>

      {!isValid && (method === "iyzico") ? (
        <div className="bg-primary/5 border border-primary/20 p-8 text-center rounded-sm">
          <AlertCircle className="h-6 w-6 text-primary/60 mx-auto mb-3" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Please complete your shipping information to proceed with online payment.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Iyzico Method */}
            <button
              onClick={() => setMethod("iyzico")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 border transition-all duration-500 relative overflow-hidden group",
                method === "iyzico" ? "border-primary bg-primary/5 shadow-luxury" : "border-border/10 bg-background/20 hover:border-primary/40"
              )}
            >
              <div className="bg-white px-3 py-1 rounded shadow-sm scale-75">
                <span className="text-[#19385c] font-black italic tracking-tighter">iyzi</span>
                <span className="text-[#207ecc] font-black italic tracking-tighter">co</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-cream">{t.checkout.creditCard}</span>
              {method === "iyzico" && (
                <motion.div layoutId="payment-check" className="absolute top-2 right-2">
                  <Check className="h-3 w-3 text-primary" />
                </motion.div>
              )}
            </button>

            {/* COD Method */}
            <button
              onClick={() => setMethod("cod")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 border transition-all duration-500 relative overflow-hidden group",
                method === "cod" ? "border-primary bg-primary/5 shadow-luxury" : "border-border/10 bg-background/20 hover:border-primary/40"
              )}
            >
              <Banknote className="h-6 w-6 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-cream">{t.checkout.cod}</span>
              {method === "cod" && (
                <motion.div layoutId="payment-check" className="absolute top-2 right-2">
                  <Check className="h-3 w-3 text-primary" />
                </motion.div>
              )}
            </button>
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {method === "iyzico" ? (
                <motion.div
                  key="iyzico-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-background/40 border border-border/10 p-1 min-h-[200px] flex items-center justify-center relative">
                    {loading && (
                      <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Securing Payment Session...</p>
                      </div>
                    )}
                    
                    {error ? (
                      <div className="text-center p-8">
                        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                        <p className="text-sm text-cream mb-4">{error}</p>
                        <button 
                          onClick={initializeIyzico}
                          className="text-[10px] uppercase tracking-widest text-primary hover:text-primary-glow underline underline-offset-4"
                        >
                          Retry Initialization
                        </button>
                      </div>
                    ) : (
                      <div id="iyzico-checkout-form" className="w-full">
                        {/* Iyzico will inject the form here */}
                        {!loading && !sessionInitialized && (
                           <div className="p-8 text-center text-muted-foreground italic text-sm">
                             Initializing secure payment...
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-center text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                    Secure encrypted transaction powered by Iyzico
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="cod-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-primary/5 border border-primary/20 p-6 md:p-10 text-center rounded-sm"
                >
                  <p className="text-primary font-bold text-[11px] uppercase tracking-[0.3em] mb-3">{t.checkout.payAtDoor}</p>
                  <p className="text-muted-foreground text-xs italic mb-0">{t.checkout.payAtDoorNote}</p>
                  <p className="text-[9px] uppercase tracking-widest text-primary/60 mt-4">{t.checkout.codFee}</p>
                  
                  <div className="mt-8 md:mt-10 flex justify-center">
                    <button 
                      disabled={!isValid}
                      className="group relative w-fit mx-auto sm:w-auto px-12 sm:px-10 bg-primary text-primary-foreground py-4 text-[10px] uppercase tracking-[0.4em] font-bold overflow-hidden transition-all hover:shadow-gold disabled:opacity-50 disabled:grayscale"
                    >
                      <span className="relative z-10">{t.checkout.completeOrder}</span>
                      <div className="absolute inset-0 bg-primary-glow translate-y-full transition-transform group-hover:translate-y-0" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </section>
  );
}
