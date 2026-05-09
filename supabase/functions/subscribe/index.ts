import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { sendEmail, elegantTemplate } from "../_shared/resend.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert into subscribers
    const { data, error } = await supabaseClient
      .from("subscribers")
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return new Response(JSON.stringify({ error: "Already subscribed" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw error;
    }

    // Send welcome email
    const unsubscribeUrl = `${Deno.env.get("PUBLIC_SITE_URL")}/unsubscribe?token=${data.unsubscribe_token}`;
    
    const welcomeHtml = elegantTemplate(`
      <h2 style="color: #D4AF37; text-align: center;">Welcome to the Maison</h2>
      <p>Thank you for joining the Royal Brands Fashion community. You've successfully subscribed to our newsletter.</p>
      <p>As part of our inner circle, you'll be the first to know about:</p>
      <ul style="list-style-type: none; padding: 0;">
        <li>✧ Exclusive previews of new couture collections</li>
        <li>✧ Private invitations to seasonal sales</li>
        <li>✧ Curated sartorial inspirations from our designers</li>
      </ul>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${Deno.env.get("PUBLIC_SITE_URL")}/shop" class="button">Explore Collections</a>
      </div>
    `, unsubscribeUrl);

    await sendEmail({
      to: email,
      subject: "Welcome to Royal Brands Fashion",
      html: welcomeHtml,
    });

    // Log success
    await supabaseClient.from("email_logs").insert([
      { type: "newsletter_signup", recipient: email, status: "success" },
    ]);

    return new Response(JSON.stringify({ message: "Successfully joined our community!" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
