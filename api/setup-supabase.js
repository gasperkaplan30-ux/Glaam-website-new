const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if orders table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    if (tableError && tableError.code === 'PGRST116') {
      // Table doesn't exist, create it
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          stripe_session_id VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          address TEXT NOT NULL,
          postal_code VARCHAR(10) NOT NULL,
          city VARCHAR(100) NOT NULL,
          country VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          email VARCHAR(255) NOT NULL,
          items JSONB NOT NULL DEFAULT '[]',
          amount_total DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'EUR',
          paid_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      const { data: createResult, error: createError } = await supabase
        .rpc('exec_sql', { sql: createTableSQL });

      if (createError) {
        return res.status(500).json({
          status: 'FAILED',
          error: 'Failed to create orders table',
          details: createError.message
        });
      }

      // Enable RLS
      await supabase
        .rpc('exec_sql', { sql: 'ALTER TABLE orders ENABLE ROW LEVEL SECURITY;' });

      // Create policies
      await supabase
        .rpc('exec_sql', { 
          sql: `CREATE POLICY "Users can view their own orders" ON orders
                FOR SELECT USING (auth.uid() = user_id);` 
        });

      await supabase
        .rpc('exec_sql', { 
          sql: `CREATE POLICY "Users can insert their own orders" ON orders
                FOR INSERT WITH CHECK (auth.uid() = user_id);` 
        });

      await supabase
        .rpc('exec_sql', { 
          sql: `CREATE POLICY "Users can update their own orders" ON orders
                FOR UPDATE USING (auth.uid() = user_id);` 
        });

      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Orders table created successfully with RLS policies'
      });
    } else if (tableError) {
      return res.status(500).json({
        status: 'FAILED',
        error: 'Error checking table',
        details: tableError.message
      });
    } else {
      return res.status(200).json({
        status: 'EXISTS',
        message: 'Orders table already exists'
      });
    }

  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({
      status: 'ERROR',
      error: 'Unexpected error',
      details: error.message
    });
  }
}
