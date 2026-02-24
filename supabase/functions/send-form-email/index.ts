import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

    const emailBody = `
New Roof Inspection Request

Name: ${formData.firstName}
Phone: ${formData.phone}
SMS Consent: ${formData.smsConsent ? 'Yes' : 'No'}

Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}
`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
    .header { background-color: #E8830A; color: white; padding: 20px; text-align: center; }
    .content { background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #5A4A3A; }
    .value { margin-left: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Roof Inspection Request</h1>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name:</span>
        <span class="value">${formData.firstName}</span>
      </div>
      <div class="field">
        <span class="label">Phone:</span>
        <span class="value">${formData.phone}</span>
      </div>
      <div class="field">
        <span class="label">SMS Consent:</span>
        <span class="value">${formData.smsConsent ? 'Yes' : 'No'}</span>
      </div>
      <div class="field">
        <span class="label">Submitted:</span>
        <span class="value">${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

    const emailRecipients = [
      "grekoroofing@gmail.com",
      "Bklik81@gmail.com"
    ];

    const sendEmailPromises = emailRecipients.map(async (recipient) => {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");

      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY not configured");
      }

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Greko Roofing <noreply@grekoroofing.com>",
          to: [recipient],
          subject: `New Roof Inspection Request - ${formData.firstName}`,
          text: emailBody,
          html: emailHtml,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        throw new Error(`Failed to send email to ${recipient}: ${errorText}`);
      }

      return emailResponse.json();
    });

    await Promise.all(sendEmailPromises);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Form submitted and emails sent successfully",
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
