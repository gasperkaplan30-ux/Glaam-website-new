const { createClient } = require('@supabase/supabase-js');

// Server-side Supabase client using service role for Admin API
const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('API check-user-exists called');
  console.log('Environment check:', {
    hasUrl: !!process.env.PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });

  try {
    let { email } = req.body || {};
    console.log('Received email:', email);
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Normalize email to avoid case/whitespace mismatches
    email = String(email).trim().toLowerCase();
    console.log('Normalized email:', email);

    // First try getUserByEmail
    let userData = null;
    let userError = null;
    
    try {
      const result = await supabase.auth.admin.getUserByEmail(email);
      userData = result.data;
      userError = result.error;
    } catch (err) {
      // If getUserByEmail is not available, fall back to listUsers
      console.log('getUserByEmail failed, trying listUsers:', err.message);
      
      const listResult = await supabase.auth.admin.listUsers();
      if (listResult.error) {
        return res.status(500).json({ error: 'User lookup failed' });
      }
      
      // Find user with matching email in the list
      const matchingUser = listResult.data.users?.find(user => 
        user.email?.toLowerCase() === email
      );
      
      return res.status(200).json({ exists: !!matchingUser });
    }

    if (userError) {
      // If Supabase returns user-not-found, we return exists=false
      if (userError?.message && /not\s*found|no\s*user/i.test(userError.message)) {
        return res.status(200).json({ exists: false });
      }
      return res.status(500).json({ error: 'Lookup failed: ' + userError.message });
    }

    const exists = !!userData?.user && userData.user.email?.toLowerCase() === email;
    return res.status(200).json({ exists });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}


