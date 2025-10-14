const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const config = {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Missing'
    },
    supabase: {
      url: process.env.PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
      anonKey: process.env.PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
    },
    environment: process.env.NODE_ENV || 'development'
  };

  // Check if all required variables are set
  const allSet = config.stripe.secretKey === 'Set' && 
                config.supabase.url === 'Set' && 
                config.supabase.serviceRoleKey === 'Set';

  // Test Supabase connection if config is set
  let supabaseTest = 'Not tested';
  if (allSet) {
    try {
      const supabase = createClient(
        process.env.PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1);
      
      if (error) {
        supabaseTest = `Failed: ${error.message}`;
      } else {
        supabaseTest = 'Connected';
      }
    } catch (error) {
      supabaseTest = `Error: ${error.message}`;
    }
  }

  res.status(200).json({
    status: allSet ? 'OK' : 'MISSING_CONFIG',
    config,
    supabaseTest,
    message: allSet ? 'All configuration is set' : 'Some configuration is missing'
  });
}
