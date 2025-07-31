import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    console.log('🔍 Testing database connection...');
    
    // Create Supabase client
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Test database connection
    console.log('📊 Testing database connection...');
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: error.message
      });
    }
    
    console.log('✅ Database connected successfully');
    console.log(`📊 Found ${users.length} users`);
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      usersFound: users.length,
      users: users.map(u => ({ 
        id: u.id, 
        username: u.username, 
        role: u.role,
        passwordHash: u.password.substring(0, 20) + '...'
      }))
    });
    
  } catch (error) {
    console.error('❌ Database test error:', error);
    return res.status(500).json({ 
      error: 'Database test failed', 
      details: error.message 
    });
  }
} 