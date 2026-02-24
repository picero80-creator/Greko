import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InspectionRequest {
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
    const body: InspectionRequest = await req.json();
    const { firstName, phone, smsConsent } = body;

    const emailData = {
      personalizations: [
        {
          to: [
            { email: "grekoroofing@gmail.com" },
            { email: "Bklik81@gmail.com" },
            { email: "picero80@gmail.com" }
          ],
          subject: `New Roof Inspection Request - ${firstName}`
        }
      ],
      from: {
        email: "noreply@grekoroofing.com",
        name: "Greko Roofing Website"
      },
      content: [
        {
          type: "text/html",
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #C45D1B;">New Roof Inspection Request</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Name:</td>
                  <td style="padding: 12px; border: 1px solid #dee2e6;">${firstName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Phone:</td>
                  <td style="padding: 12px; border: 1px solid #dee2e6;">${phone}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">SMS Consent:</td>
                  <td style="padding: 12px; border: 1px solid #dee2e6;">${smsConsent ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Submitted At:</td>
                  <td style="padding: 12px; border: 1px solid #dee2e6;">${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</td>
                </tr>
              </table>
            </div>
          `
        }
      ]
    };

    const sendGridKey = Deno.env.get('SENDGRID_API_KEY');

    if (!sendGridKey) {
      throw new Error('SendGrid API key not configured');
    }

    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!sendGridResponse.ok) {
      const errorText = await sendGridResponse.text();
      console.error('SendGrid error:', errorText);
      throw new Error(`SendGrid API error: ${sendGridResponse.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in send-inspection-email:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
