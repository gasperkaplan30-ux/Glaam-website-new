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

  // Check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
    return res.status(500).json({ error: 'Stripe configuration missing' });
  }

  if (!process.env.PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase configuration missing');
    return res.status(500).json({ error: 'Supabase configuration missing' });
  }

  try {
    console.log('Request body received:', JSON.stringify(req.body, null, 2));
    
    const { items, customerInfo, userId, successUrl, cancelUrl } = req.body;
    
    // Log items structure for debugging
    console.log('Items received:', items);
    items.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        name: item.name,
        unit_amount: item.unit_amount,
        price: item.price,
        quantity: item.quantity,
        unit_amount_type: typeof item.unit_amount,
        price_type: typeof item.price,
        quantity_type: typeof item.quantity
      });
      
      // Validate item structure
      if (!item.name) {
        throw new Error(`Item ${index} missing name`);
      }
      if (!item.unit_amount && !item.price) {
        throw new Error(`Item ${index} missing price/unit_amount`);
      }
      if (!item.quantity) {
        throw new Error(`Item ${index} missing quantity`);
      }
    });

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid items data:', items);
      return res.status(400).json({ error: 'Invalid items data' });
    }

    if (!customerInfo) {
      console.error('Customer info missing');
      return res.status(400).json({ error: 'Customer info is required' });
    }

    console.log('Processing order with', items.length, 'items');

    // Test Supabase connection
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Supabase connection test failed:', testError);
      return res.status(500).json({ 
        error: 'Supabase connection failed', 
        details: testError.message,
        code: testError.code,
        hint: testError.hint
      });
    }
    console.log('Supabase connection test successful');

    // Create Stripe line items
    const lineItems = items.map(item => {
      const productData = {
        name: item.name
      };
      // Only include description if non-empty to satisfy Stripe API
      if (item.description && String(item.description).trim() !== '') {
        productData.description = String(item.description).trim();
      }
      // Only include images if present; sanitize to absolute ASCII URLs acceptable to Stripe
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        try {
          const origin = (typeof req.headers.origin === 'string' && req.headers.origin) || 'https://glaam-bqgr-dtu38ckg3-mgs-projects-007b05b7.vercel.app';
          const sanitizedImages = item.images
            .map(img => {
              if (!img) return null;
              let urlString = String(img).trim();
              // Make absolute URL if relative
              if (!/^https?:\/\//i.test(urlString)) {
                // Ensure leading slash for path-join
                if (urlString[0] !== '/') urlString = '/' + urlString;
                urlString = origin.replace(/\/$/, '') + urlString;
              }
              // Percent-encode non-ASCII characters in the URL
              try {
                const parsed = new URL(urlString);
                const encodedPath = parsed.pathname
                  .split('/')
                  .map(segment => encodeURIComponent(decodeURIComponent(segment)))
                  .join('/');
                const encodedUrl = `${parsed.protocol}//${parsed.host}${encodedPath}${parsed.search || ''}${parsed.hash || ''}`;
                // Validate
                new URL(encodedUrl);
                return encodedUrl;
              } catch (_) {
                return null;
              }
            })
            .filter(Boolean);
          if (sanitizedImages.length > 0) {
            productData.images = sanitizedImages;
          }
        } catch (_) {
          // If anything goes wrong, omit images entirely
        }
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: productData,
          unit_amount: Math.round(item.unit_amount), // Already in cents
        },
        quantity: item.quantity,
      };
    });

    // Calculate total amount with validation
    const totalAmount = items.reduce((sum, item) => {
      // Handle both unit_amount (from frontend) and price (legacy)
      const price = parseFloat(item.unit_amount || item.price);
      const quantity = parseInt(item.quantity, 10);

      console.log(`Processing item: ${item.name}`);
      console.log(`  - unit_amount: ${item.unit_amount} (type: ${typeof item.unit_amount})`);
      console.log(`  - price: ${item.price} (type: ${typeof item.price})`);
      console.log(`  - quantity: ${item.quantity} (type: ${typeof item.quantity})`);
      
      // Check if values are valid before parsing
      if (item.unit_amount === null || item.unit_amount === undefined) {
        console.error(`Item ${item.name} has null/undefined unit_amount`);
      }
      if (item.quantity === null || item.quantity === undefined) {
        console.error(`Item ${item.name} has null/undefined quantity`);
      }
      
      console.log(`  - parsed price: ${price}`);
      console.log(`  - parsed quantity: ${quantity}`);

      if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
        console.error('Invalid item data encountered:', item);
        console.error('Raw item data:', JSON.stringify(item, null, 2));
        throw new Error(`Invalid item price or quantity in cart. Item: ${item.name}, Price: ${price}, Quantity: ${quantity}`);
      }
      
      const itemTotal = price * quantity;
      console.log(`Item: ${item.name}, Price: ${price}, Quantity: ${quantity}, Total: ${itemTotal}`);
      
      return sum + itemTotal;
    }, 0);

    console.log('Total amount calculated:', totalAmount);

    // Validate total amount
    if (isNaN(totalAmount) || totalAmount <= 0) {
      console.error('Invalid total amount:', totalAmount);
      return res.status(400).json({ 
        error: 'Invalid total amount calculated', 
        details: `Total amount is ${totalAmount}` 
      });
    }

    // Create order in Supabase first
    console.log('Creating order in Supabase...');
    const orderData = {
      user_id: userId || null,
      first_name: customerInfo.firstName,
      last_name: customerInfo.lastName,
      address: customerInfo.address,
      postal_code: customerInfo.postalCode,
      city: customerInfo.city,
      country: customerInfo.country,
      phone: customerInfo.phone,
      email: customerInfo.email,
      items: items,
      amount_total: totalAmount / 100, // Convert from cents
      currency: 'EUR',
      status: 'pending'
    };
    
    console.log('Order data:', JSON.stringify(orderData, null, 2));
    console.log('Amount total value:', orderData.amount_total);
    console.log('Amount total type:', typeof orderData.amount_total);
    
    // Final validation before database insert
    if (orderData.amount_total === null || orderData.amount_total === undefined || isNaN(orderData.amount_total)) {
      console.error('Amount total is invalid for database insert:', orderData.amount_total);
      return res.status(400).json({ 
        error: 'Invalid amount total for database', 
        details: `Amount total is ${orderData.amount_total}` 
      });
    }
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      console.error('Order error details:', JSON.stringify(orderError, null, 2));
      return res.status(500).json({ 
        error: 'Failed to create order', 
        details: orderError.message,
        code: orderError.code,
        hint: orderError.hint
      });
    }

    console.log('Order created successfully:', order.id);

    // Create Stripe checkout session
    console.log('Creating Stripe checkout session...');
    
    // Ensure URLs are properly encoded
    const baseUrl = req.headers.origin || 'https://glaam-bqgr-dtu38ckg3-mgs-projects-007b05b7.vercel.app';
    const encodedSuccessUrl = successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const encodedCancelUrl = cancelUrl || `${baseUrl}/cancel`;
    
    console.log('Base URL:', baseUrl);
    console.log('Success URL:', encodedSuccessUrl);
    console.log('Cancel URL:', encodedCancelUrl);
    
    // Validate URLs don't contain non-ASCII characters
    try {
      new URL(encodedSuccessUrl);
      new URL(encodedCancelUrl);
    } catch (urlError) {
      console.error('Invalid URL detected:', urlError.message);
      return res.status(400).json({ 
        error: 'Invalid URL format', 
        details: urlError.message 
      });
    }
    
    const sessionData = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: encodedSuccessUrl,
      cancel_url: encodedCancelUrl,
      metadata: {
        orderId: order.id.toString(),
        userId: userId || 'anonymous',
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`.replace(/[^\x00-\x7F]/g, ''), // Remove non-ASCII characters
        customerEmail: customerInfo.email || '',
        customerPhone: customerInfo.phone,
        customerAddress: `${customerInfo.address}, ${customerInfo.postalCode} ${customerInfo.city}, ${customerInfo.country}`.replace(/[^\x00-\x7F]/g, ''), // Remove non-ASCII characters
        amountTotal: (totalAmount / 100).toString(),
        currency: 'EUR'
      },
      customer_email: customerInfo.email || undefined,
      shipping_address_collection: {
        allowed_countries: ['SI', 'HR', 'AT', 'IT', 'HU']
      }
    };
    
    console.log('Stripe session data:', JSON.stringify(sessionData, null, 2));
    
    // Final validation before creating Stripe session
    try {
      const session = await stripe.checkout.sessions.create(sessionData);
      console.log('Stripe session created:', session.id);
      
      // Update order with Stripe session ID
      await supabase
        .from('orders')
        .update({ stripe_session_id: session.id })
        .eq('id', order.id);

      res.status(200).json({ 
        url: session.url, 
        orderId: order.id, 
        sessionId: session.id 
      });
      
    } catch (stripeError) {
      console.error('Stripe error:', stripeError.message);
      console.error('Stripe error details:', stripeError);
      return res.status(500).json({ 
        error: 'Stripe session creation failed', 
        details: stripeError.message 
      });
    }

  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      type: error.name 
    });
  }
}