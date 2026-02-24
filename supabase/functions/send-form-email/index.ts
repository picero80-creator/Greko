import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FormData {
  firstName: string;
  phone: string;
  smsConsent: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: FormData = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabase
      .from("form_submissions")
      .insert({
        first_name: formData.firstName,
        phone: formData.phone,
        sms_consent: formData.smsConsent,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save form submission");
    }

    try {
      const emailRecipients = [
        "grekoroofing@gmail.com",
        "Bklik81@gmail.com"
      ];

      const formSubmitPromises = emailRecipients.map(async (recipient) => {
        const emailResponse = await fetch("https://formsubmit.co/ajax/" + recipient, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            _subject: `New Roof Inspection Request - ${formData.firstName}`,
            Name: formData.firstName,
            Phone: formData.phone,
            "SMS Consent": formData.smsConsent ? 'Yes' : 'No',
            "Submitted At": new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error(`Failed to send email to ${recipient}:`, errorText);
          return false;
        }

        return true;
      });

      await Promise.all(formSubmitPromises);
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Form submitted successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing form:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
