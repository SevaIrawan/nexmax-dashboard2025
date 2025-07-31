import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    console.log('🔍 Debug login attempt:');
    console.log('   Username:', username);
    console.log('   Password:', password);

    // Check environment variables
    console.log('🔧 Environment check:');
    console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Missing environment variables' });
    }

    // Create Supabase client directly
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Get user from Supabase
    console.log('📊 Fetching user from database...');
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);
    
    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    console.log('📊 Database response:');
    console.log('   Users found:', users ? users.length : 0);
    console.log('   Error:', error);

    if (!users || users.length === 0) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials - user not found' });
    }

    const user = users[0];
    console.log('✅ User found:');
    console.log('   Username:', user.username);
    console.log('   Role:', user.role);
    console.log('   Password hash:', user.password.substring(0, 20) + '...');

    // Verify password
    console.log('🔐 Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('   Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: 'Invalid credentials - wrong password' });
    }

    console.log('🎉 Login successful!');
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 