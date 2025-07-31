import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: 'env.production' });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('🔧 Environment check:');
console.log('   SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('   JWT_SECRET:', JWT_SECRET ? '✅ Set' : '❌ Missing');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testLoginProduction() {
  try {
    console.log('\n🧪 Testing login logic...');
    
    const username = 'admin';
    const password = 'NexMax2024!@#';
    
    console.log('📤 Login attempt:');
    console.log('   Username:', username);
    console.log('   Password:', password);
    
    // Get user from Supabase
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = users[0];
    console.log('✅ User found:', user.username);
    console.log('   Password hash:', user.password.substring(0, 20) + '...');
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔐 Password verification:', isValidPassword ? '✅ Valid' : '❌ Invalid');
    
    if (isValidPassword) {
      console.log('🎉 Login would be successful!');
      console.log('   User role:', user.role);
    } else {
      console.log('❌ Login would fail - invalid password');
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
  }
}

testLoginProduction(); 