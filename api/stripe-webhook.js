const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('PaymentIntent failed:', failedPayment.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    const { orderId, userId, customerName, customerAddress, customerPhone } = session.metadata;

    if (!orderId) {
      console.error('No orderId found in session metadata');
      return;
    }

    // Update order status to paid
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        amount_total: session.amount_total / 100, // Convert from cents
        currency: session.currency,
        stripe_session_id: session.id,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order status:', updateError);
      throw updateError;
    }

    // Get order details for confirmation email
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Error fetching order details:', orderError);
      return;
    }

    // Get user email from Supabase Auth
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error('Error fetching user details:', userError);
      return;
    }

    // Send confirmation email (optional - you can implement this later)
    console.log(`Order ${orderId} completed successfully for user ${user.user.email}`);
    
    // Log successful payment
    console.log('Payment completed:', {
      orderId,
      userId,
      customerName,
      customerAddress,
      customerPhone,
      amount: session.amount_total / 100,
      currency: session.currency,
    });

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}
