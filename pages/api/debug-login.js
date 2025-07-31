import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    console.log('🔍 Debug login process...');
    console.log('📝 Username:', username);
    console.log('🔑 Password length:', password ? password.length : 0);

    // Check environment variables
    const envCheck = {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'
    };
    console.log('🔧 Environment:', envCheck);

    // Create Supabase client
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('🔌 Supabase client created');

    // Get user from Supabase
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);
    
    console.log('📊 Database query result:');
    console.log('- Error:', error);
    console.log('- Users found:', users ? users.length : 0);
    
    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ 
        error: 'Database error', 
        details: error,
        debug: { envCheck, username }
      });
    }

    if (!users || users.length === 0) {
      console.log('❌ No user found with username:', username);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        debug: { envCheck, username, usersFound: 0 }
      });
    }

    const user = users[0];
    console.log('👤 User found:', {
      id: user.id,
      username: user.username,
      role: user.role,
      passwordHash: user.password ? user.password.substring(0, 20) + '...' : 'null'
    });

    // Verify password
    console.log('🔐 Comparing passwords...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('✅ Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Password invalid');
      return res.status(401).json({ 
        error: 'Invalid credentials',
        debug: { 
          envCheck, 
          username, 
          userFound: true,
          passwordValid: false,
          providedPasswordLength: password.length,
          storedPasswordHash: user.password ? user.password.substring(0, 20) + '...' : 'null'
        }
      });
    }

    console.log('✅ Login successful!');
    res.status(200).json({
      success: true,
      message: 'Login debug successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      debug: {
        envCheck,
        username,
        userFound: true,
        passwordValid: true
      }
    });

  } catch (error) {
    console.error('❌ Debug login error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      debug: { 
        envCheck: {
          SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
          JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'
        }
      }
    });
  }
} 