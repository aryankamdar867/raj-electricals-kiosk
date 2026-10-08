import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendQuoteNotifications } from '@/lib/sendQuoteNotifications';
export async function POST(request: Request) {
  try {
    // IMPORTANT: signature must be computed over the RAW request body,
    // not the parsed/re-stringified JSON — so we read text() first.
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    if (!secret || expectedSignature !== signature) {
      console.error('❌ [Webhook] Signature mismatch — rejecting request.');
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log('✅ [Webhook] Verified event received:', event.event);

    if (event.event === 'qr_code.credited') {
      const quoteId = event.payload?.qr_code?.entity?.notes?.quoteId;
      const paymentId = event.payload?.payment?.entity?.id;

      if (!quoteId) {
        console.error('⚠️ [Webhook] qr_code.credited fired but no quoteId in notes.');
        return NextResponse.json({ success: true }, { status: 200 }); // still 200 so Razorpay doesn't retry forever
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: quote, error: fetchErr } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (fetchErr || !quote) {
        console.error('⚠️ [Webhook] Quote not found for id:', quoteId);
        return NextResponse.json({ success: true }, { status: 200 });
      }

      // Idempotency check — Razorpay may send the same webhook more than once
      if (quote.payment_status !== 'paid') {
        await supabase
          .from('quotations')
          .update({ payment_status: 'paid', payment_id: paymentId || 'WEBHOOK_CONFIRMED' })
          .eq('id', quoteId);

        await sendQuoteNotifications(quote);
        console.log(`✅ [Webhook] Quote ${quoteId} marked paid and notifications sent.`);
      } else {
        console.log(`ℹ️ [Webhook] Quote ${quoteId} was already marked paid — skipping duplicate.`);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('❌ [Webhook] Processing error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}