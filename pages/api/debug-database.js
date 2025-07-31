import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    console.log('🔍 Debug database connection...');
    
    // Check environment variables
    const envCheck = {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'
    };
    
    console.log('🔧 Environment variables:', envCheck);
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        envCheck 
      });
    }
    
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
        details: error.message,
        envCheck 
      });
    }
    
    console.log('✅ Database connected successfully');
    console.log(`📊 Found ${users.length} users`);
    
    // Test login with admin user
    const testUsername = 'admin';
    const testPassword = 'admin123';
    
    console.log(`🧪 Testing login for: ${testUsername}`);
    
    const adminUser = users.find(u => u.username === testUsername);
    
    if (!adminUser) {
      return res.status(200).json({
        success: false,
        message: 'Admin user not found',
        envCheck,
        users: users.map(u => ({ username: u.username, role: u.role })),
        testUser: testUsername
      });
    }
    
    console.log('✅ Admin user found');
    console.log('   Username:', adminUser.username);
    console.log('   Role:', adminUser.role);
    console.log('   Password hash:', adminUser.password.substring(0, 20) + '...');
    
    // Test password verification
    console.log('🔐 Testing password verification...');
    const isValidPassword = await bcrypt.compare(testPassword, adminUser.password);
    console.log('   Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(200).json({
        success: false,
        message: 'Password verification failed',
        envCheck,
        userFound: true,
        passwordValid: false,
        testPassword: testPassword,
        passwordHash: adminUser.password.substring(0, 20) + '...'
      });
    }
    
    console.log('🎉 Login test successful!');
    return res.status(200).json({
      success: true,
      message: 'Login test successful',
      envCheck,
      userFound: true,
      passwordValid: true,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role
      }
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return res.status(500).json({ 
      error: 'Debug failed', 
      details: error.message 
    });
  }
} 