import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { sendEmail, elegantTemplate } from "../_shared/resend.ts";

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "" // Need service role to fetch all subscribers
    );

    const payload = await req.json();
    const { record, old_record, type } = payload;
    
    // Determine the notification type
    let notificationType: 'new_product' | 'discount_update' | null = null;
    
    if (type === 'INSERT') {
      notificationType = 'new_product';
    } else if (type === 'UPDATE') {
      const oldDiscount = old_record?.sale_price || 0;
      const newDiscount = record?.sale_price || 0;
      if (newDiscount > 0 && newDiscount < record.price && newDiscount !== oldDiscount) {
        notificationType = 'discount_update';
      }
    }

    if (!notificationType) {
      return new Response(JSON.stringify({ message: "No notification needed" }), { status: 200 });
    }

    // Get all active subscribers
    const { data: subscribers, error: subError } = await supabaseClient
      .from("subscribers")
      .select("email, unsubscribe_token")
      .eq("is_active", true);

    if (subError) throw subError;
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: "No active subscribers found" }), { status: 200 });
    }

    // Prepare email content based on type
    let subject = "";
    let content = "";

    if (notificationType === 'new_product') {
      subject = `New Arrival: ${record.name_en}`;
      content = `
        <h2 style="color: #D4AF37; text-align: center;">New Couture Arrival</h2>
        <p>A new piece has joined our collection: <strong>${record.name_en}</strong>.</p>
        <p>${record.description_en || ''}</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 24px; color: #D4AF37; margin-bottom: 20px;">₺${record.price}</div>
          <a href="${Deno.env.get("PUBLIC_SITE_URL")}/product/${record.slug}" class="button">Shop Now</a>
        </div>
      `;
    } else {
      subject = `Private Offer: ${record.name_en}`;
      content = `
        <h2 style="color: #D4AF37; text-align: center;">Exclusive Private Offer</h2>
        <p>A special price is now available for <strong>${record.name_en}</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="text-decoration: line-through; opacity: 0.5; font-size: 16px;">₺${record.price}</div>
          <div style="font-size: 24px; color: #D4AF37; margin-bottom: 20px;">₺${record.sale_price}</div>
          <a href="${Deno.env.get("PUBLIC_SITE_URL")}/product/${record.slug}" class="button">Grab the Deal</a>
        </div>
      `;
    }

    // Send emails in batches or parallel (Resend supports multiple recipients in one call for higher plans, 
    // but for demo we'll loop or use their batch API if needed. Let's send individually for logging).
    
    const results = await Promise.allSettled(
      subscribers.map(async (sub) => {
        const unsubscribeUrl = `${Deno.env.get("PUBLIC_SITE_URL")}/unsubscribe?token=${sub.unsubscribe_token}`;
        const emailHtml = elegantTemplate(content, unsubscribeUrl);
        
        try {
          await sendEmail({
            to: sub.email,
            subject,
            html: emailHtml,
          });
          
          await supabaseClient.from("email_logs").insert([
            { type: notificationType, recipient: sub.email, status: "success" },
          ]);
        } catch (err) {
          console.error(`Failed to send to ${sub.email}:`, err);
          await supabaseClient.from("email_logs").insert([
            { type: notificationType!, recipient: sub.email, status: "failed", error_message: err.message },
          ]);
        }
      })
    );

    return new Response(JSON.stringify({ message: `Sent ${results.length} notifications` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
