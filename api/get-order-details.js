const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Get order details by Stripe session ID
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', session_id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Return order details (excluding sensitive information)
    const orderDetails = {
      id: order.id,
      status: order.status,
      first_name: order.first_name,
      last_name: order.last_name,
      address: order.address,
      postal_code: order.postal_code,
      city: order.city,
      country: order.country,
      phone: order.phone,
      items: order.items,
      amount_total: order.amount_total,
      currency: order.currency,
      created_at: order.created_at,
      paid_at: order.paid_at
    };

    res.status(200).json(orderDetails);

  } catch (error) {
    console.error('Error in get-order-details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
