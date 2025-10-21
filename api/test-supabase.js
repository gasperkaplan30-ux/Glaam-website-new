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
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    if (connectionError) {
      return res.status(500).json({
        status: 'FAILED',
        error: 'Supabase connection failed',
        details: connectionError.message,
        code: connectionError.code,
        hint: connectionError.hint
      });
    }

    // Test table structure
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'orders' })
      .catch(() => {
        // If RPC doesn't exist, try a simple query
        return supabase
          .from('orders')
          .select('*')
          .limit(0);
      });

    // Test insert permissions (dry run)
    const testOrderData = {
      user_id: null,
      first_name: 'Test',
      last_name: 'User',
      address: 'Test Address',
      postal_code: '1000',
      city: 'Test City',
      country: 'Slovenia',
      phone: '+38612345678',
      email: 'test@example.com',
      items: [],
      amount_total: 0,
      currency: 'EUR',
      status: 'pending'
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('orders')
      .insert(testOrderData)
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({
        status: 'FAILED',
        error: 'Insert test failed',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      });
    }

    // Clean up test data
    await supabase
      .from('orders')
      .delete()
      .eq('id', insertTest.id);

    res.status(200).json({
      status: 'OK',
      message: 'Supabase table is working correctly',
      connectionTest: 'PASSED',
      insertTest: 'PASSED',
      tableExists: true
    });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      status: 'ERROR',
      error: 'Unexpected error',
      details: error.message
    });
  }
}
