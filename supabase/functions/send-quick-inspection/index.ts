import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QuickInspectionData {
  fullName: string;
  phoneNumber: string;
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
    const formData: QuickInspectionData = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
          }
          .header {
            background: linear-gradient(135deg, #1A0F00 0%, #2C1A06 60%, #4A2800 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            text-transform: uppercase;
          }
          .header .subtitle {
            color: #E8830A;
            font-size: 18px;
            margin: 0;
          }
          .content {
            padding: 30px 20px;
          }
          .field {
            background-color: #f9f9f9;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #E8830A;
            border-radius: 4px;
          }
          .field-label {
            font-weight: bold;
            color: #2C1A06;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .field-value {
            color: #333;
            font-size: 16px;
          }
          .consent-box {
            background-color: ${formData.smsConsent ? '#e8f5e9' : '#fff3e0'};
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
            text-align: center;
          }
          .footer {
            background-color: #2C1A06;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Free Roof Inspection</h1>
            <p class="subtitle">New Request Received</p>
          </div>

          <div class="content">
            <div class="field">
              <div class="field-label">Full Name</div>
              <div class="field-value">${formData.fullName}</div>
            </div>

            <div class="field">
              <div class="field-label">Phone Number</div>
              <div class="field-value">${formData.phoneNumber}</div>
            </div>

            <div class="consent-box">
              <strong>SMS Updates:</strong> ${formData.smsConsent ? '✅ Customer opted IN for text updates' : '❌ Customer opted OUT of text updates'}
            </div>
          </div>

          <div class="footer">
            <p><strong>Greko Roofing & Construction</strong></p>
            <p>📞 (708) 668-6500</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Greko Roofing <onboarding@resend.dev>",
        to: ["grekoroofing@gmail.com", "Bklik81@gmail.com", "picero80@gmail.com"],
        subject: `🏠 New Free Inspection Request - ${formData.fullName}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
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
