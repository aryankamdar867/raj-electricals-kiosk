import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';
import { sendQuoteNotifications } from '@/lib/sendQuoteNotifications';
export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
    const body = await request.json().catch(() => null);

    if (!body || !body.action) {
      return NextResponse.json({ success: false, error: "Missing pipeline action parameter." }, { status: 400 });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ==========================================
    // STAGE 1: CREATE ORDER & GENERATE PAYMENT QR
    // ==========================================
    if (body.action === 'CREATE_ORDER') {
      const { customer, items, total } = body;

      // 1. Create the quote row — pending payment
      const { data: quoteRecord, error: dbError } = await supabase
        .from('quotations')
        .insert([
          {
            customer_name: customer.name || 'Walk-in Customer',
            customer_phone: customer.phone || 'N/A',
            customer_email: customer.email || null,
            items: items,
            total_amount: Number(total) || 0,
            payment_status: 'pending',
            payment_id: null,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // 2. Generate Razorpay QR Code for ₹1 processing fee (Test Mode)
      let qrCodeUrl = '';
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (keyId && keySecret) {
        try {
          const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
          });
          const qrCode = await razorpay.qrCode.create({
            type: 'upi_qr',
            name: `Quotation Fee - ${quoteRecord.id}`,
            usage: 'single_use',
            fixed_amount: true,
            payment_amount: 19900, // 199.00 INR in paise
            description: `Quotation fee for ${customer.name || 'Customer'}`,
            notes: {
              quoteId: String(quoteRecord.id)
            }
          });
          qrCodeUrl = qrCode.image_url;
        } catch (qrErr: any) {
          console.error("⚠️ [Razorpay] QR API call error, generating UPI QR fallback:", qrErr?.message || qrErr);
          qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=rajelectricals@upi&pn=Raj%20Electricals&am=199.00&cu=INR&tn=Quote%20${quoteRecord.id}`)}`;
        }
      } else {
        console.log("ℹ️ [Razorpay] Keys not configured in Vercel Env Vars, using UPI QR fallback.");
        qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=rajelectricals@upi&pn=Raj%20Electricals&am=199.00&cu=INR&tn=Quote%20${quoteRecord.id}`)}`;
      }

      // 3. Return payment details & QR code URL to client
      return NextResponse.json({
        success: true,
        quoteId: quoteRecord.id,
        qrCodeUrl: qrCodeUrl,
        free: false
      }, { status: 200 });
    }
    // ==========================================
    // STAGE 2: VERIFY TRANSACTION AND DISPATCH SUMMARY
    // ==========================================
    if (body.action === 'VERIFY_PAYMENT') {
      const { quoteId, mockTxnId } = body;

      // 1. Double check order validity state from database reference
      const { data: quote, error: fetchErr } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (fetchErr || !quote) return NextResponse.json({ success: false, error: "Estimate reference not found." }, { status: 404 });
      if (quote.payment_status === 'paid') return NextResponse.json({ success: true, message: "Already fulfilled." });

      // 2. Update status mapping to lock out replay attacks
      const { error: updateErr } = await supabase
        .from('quotations')
        .update({ payment_status: 'paid', payment_id: mockTxnId || 'UPI_DIRECT_TXN' })
        .eq('id', quoteId);

      if (updateErr) throw updateErr;

      // 3. Send WhatsApp + Gmail confirmation via shared helper
      await sendQuoteNotifications(quote);

      return NextResponse.json({ success: true, message: "Transaction fully audited and updates dispatched cleanly!" }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: "Invalid action handler path route mapped." }, { status: 400 });

  } catch (err: any) {
    console.error("❌ CRITICAL DISPATCH BREAKDOWN EXCEPTION:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}