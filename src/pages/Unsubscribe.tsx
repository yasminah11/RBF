import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/I18nContext";
import { Ornament } from "@/components/Ornament";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { locale } = useI18n();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const performUnsubscribe = async () => {
      if (!token) {
        setStatus("error");
        setMessage(locale === "ar" ? "رمز الإلغاء غير صالح" : locale === "tr" ? "Geçersiz abonelikten çıkma anahtarı" : "Invalid unsubscribe token");
        return;
      }

      try {
        const { error } = await supabase
          .from("subscribers")
          .update({ is_active: false })
          .eq("unsubscribe_token", token);

        if (error) throw error;

        setStatus("success");
        setMessage(locale === "ar" ? "تم إلغاء الاشتراك بنجاح" : locale === "tr" ? "Abonelikten başarıyla çıkıldı" : "Successfully unsubscribed");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Something went wrong.");
      }
    };

    performUnsubscribe();
  }, [token, locale]);

  return (
    <div className="container-luxury py-20 md:py-32 flex justify-center items-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-primary/10 p-8 md:p-12 text-center"
      >
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-cream italic">Processing your request...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-6">
            <CheckCircle className="h-16 w-16 text-primary" />
            <h1 className="font-display text-3xl text-cream">{message}</h1>
            <p className="text-muted-foreground italic">We're sorry to see you go. You can re-subscribe anytime from our homepage.</p>
            <Ornament />
            <Link to="/" className="button mt-4">Back to Maison</Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-6">
            <XCircle className="h-16 w-16 text-destructive" />
            <h1 className="font-display text-3xl text-cream">{message}</h1>
            <p className="text-muted-foreground italic">We couldn't process your request. Please check the link or contact support.</p>
            <Link to="/" className="button mt-4">Back to Maison</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
