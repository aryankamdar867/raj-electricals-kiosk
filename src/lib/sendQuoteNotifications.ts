import twilio from 'twilio';
import { Resend } from 'resend';

// Sends the WhatsApp + Email confirmation once a quote's payment_status becomes 'paid'.
// Called from BOTH the manual "Confirm Counter Clearance" button flow and the
// Razorpay webhook, so notifications never fire twice and never get out of sync.
export async function sendQuoteNotifications(quote: any) {
  const items = quote.items || [];
  let itemizedText = '';
  let itemizedHtmlRows = '';

  if (Array.isArray(items)) {
    items.forEach((item: any) => {
      const name = item?.item_name || item?.name || 'Electrical Item';
      const qty = item?.qty || item?.quantity || 1;
      const price = item?.price || 0;
      itemizedText += `• ${name}\n  Qty: ${qty} × ₹${price} = ₹${qty * price}\n`;
      itemizedHtmlRows += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding:12px; font-weight:bold;">${name}</td><td style="padding:12px; text-align:center;">${qty}</td><td style="padding:12px; text-align:right;">₹${price}</td><td style="padding:12px; text-align:right; font-weight:bold;">₹${qty * price}</td></tr>`;
    });
  }

  // TWILIO WHATSAPP OUTBOUND
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

  if (accountSid && authToken && whatsappFrom && quote.customer_phone) {
    try {
      const twilioClient = twilio(accountSid, authToken);
      const rawPhone = quote.customer_phone.trim();
      const formattedPhone = rawPhone.startsWith('+') ? rawPhone : `+91${rawPhone}`;

      const whatsappMessage = `*⚡ RAJ ELECTRICALS — ESTIMATE PAID*
----------------------------------------
Hello *${quote.customer_name}*,

Your setup curation fee of *₹199* was received successfully. Here is your itemized estimate summary:

*Items Selected:*
${itemizedText || 'No standard items indexed.'}
----------------------------------------
*Estimated Net Total: ₹${quote.total_amount || 0}*

_Please present this verified summary at the main counter desk to pull your modular stock allocation._`;

      await twilioClient.messages.create({
        from: whatsappFrom.startsWith('whatsapp:') ? whatsappFrom : `whatsapp:${whatsappFrom}`,
        to: `whatsapp:${formattedPhone}`,
        body: whatsappMessage,
      });
      console.log("✅ [Twilio] Message dispatched following verification confirmation.");
    } catch (tErr: any) {
      console.error("⚠️ [Twilio] Notification skipped during checkout:", tErr.message);
    }
  }

  // RESEND EMAIL OUTBOUND
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);

      const emailHtmlBody = `<div style="font-family: Arial; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;"><div style="background-color:#1a1a1a; padding:24px; text-align:center; border-bottom:4px solid #d4af37;"><h1 style="color:#d4af37; margin:0;">RAJ ELECTRICALS</h1><p style="color:#a0aec0; margin:4px 0 0 0; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Verified Payment Receipt</p></div><div style="padding:24px;"><p>Hello <strong>${quote.customer_name}</strong>,</p><p>We have successfully processed your processing fee of ₹199. Here is your compiled configuration list:</p><table style="width:100%; border-collapse:collapse; margin:20px 0; font-size:13px;"><thead><tr style="background-color:#f7fafc;"><th style="padding:12px; text-align:left;">Specification</th><th style="padding:12px; text-align:center;">Qty</th><th style="padding:12px; text-align:right;">Rate</th><th style="padding:12px; text-align:right;">Total</th></tr></thead><tbody>${itemizedHtmlRows}</tbody></table><div style="text-align:right; padding:16px; background-color:#f7fafc; border-radius:8px;"><strong>Estimated Net Value: ₹${quote.total_amount}</strong></div></div></div>`;

      // Email #1: Customer receipt only
      if (quote.customer_email) {
        const { data, error } = await resend.emails.send({
          from: 'Raj Electricals Kiosk <estimates@raj-electricals.in>',
          to: [quote.customer_email],
          subject: `⚡ Verified Paid Estimate - ${quote.customer_name}`,
          html: emailHtmlBody,
        });
        if (error) console.error("❌ [Resend] Customer email failed:", error);
        else console.log("✅ [Resend] Customer email dispatched:", data?.id);
      }

      // Email #2: Lead notification to the shop — name, phone, email, and the order
      const ownerEmail = process.env.OWNER_NOTIFY_EMAIL || process.env.GMAIL_USER;

      if (ownerEmail) {
        const ownerHtmlBody = `<div style="font-family: Arial; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;"><div style="background-color:#1a1a1a; padding:24px; text-align:center; border-bottom:4px solid #d4af37;"><h1 style="color:#d4af37; margin:0;">NEW PAID LEAD</h1><p style="color:#a0aec0; margin:4px 0 0 0; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Raj Electricals Kiosk</p></div><div style="padding:24px;"><table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px;"><tr><td style="padding:6px 0; font-weight:bold; width:120px;">Name</td><td style="padding:6px 0;">${quote.customer_name}</td></tr><tr><td style="padding:6px 0; font-weight:bold;">Phone</td><td style="padding:6px 0;">${quote.customer_phone}</td></tr><tr><td style="padding:6px 0; font-weight:bold;">Email</td><td style="padding:6px 0;">${quote.customer_email || '—'}</td></tr></table><table style="width:100%; border-collapse:collapse; margin:20px 0; font-size:13px;"><thead><tr style="background-color:#f7fafc;"><th style="padding:12px; text-align:left;">Specification</th><th style="padding:12px; text-align:center;">Qty</th><th style="padding:12px; text-align:right;">Rate</th><th style="padding:12px; text-align:right;">Total</th></tr></thead><tbody>${itemizedHtmlRows}</tbody></table><div style="text-align:right; padding:16px; background-color:#f7fafc; border-radius:8px;"><strong>Estimated Net Value: ₹${quote.total_amount}</strong></div></div></div>`;

        const { data, error } = await resend.emails.send({
          from: 'Raj Electricals Kiosk <estimates@raj-electricals.in>',
          to: [ownerEmail],
          subject: `🔔 New Paid Lead - ${quote.customer_name} (${quote.customer_phone})`,
          html: ownerHtmlBody,
        });
        if (error) console.error("❌ [Resend] Owner notification failed:", error);
        else console.log("✅ [Resend] Owner notification dispatched:", data?.id);
      } else {
        console.log("ℹ️ [Resend] No owner email configured — skipping lead notification.");
      }
    } catch (mErr: any) {
      console.error("❌ [Resend] Exception during send:", mErr.message);
    }
  } else {
    console.log("ℹ️ [Resend] RESEND_API_KEY not set — skipping email send.");
  }
}