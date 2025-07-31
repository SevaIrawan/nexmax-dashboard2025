import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: 'env.production' });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function hashAllPasswords() {
  try {
    console.log('🔧 Hashing all user passwords...');
    
    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching users:', error);
      process.exit(1);
    }
    
    console.log(`📊 Found ${users.length} users to hash`);
    
    // Hash each user's password
    for (const user of users) {
      console.log(`🔐 Hashing password for user: ${user.username}`);
      
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('username', user.username);
      
      if (updateError) {
        console.error(`❌ Error updating ${user.username}:`, updateError);
      } else {
        console.log(`✅ Password hashed for ${user.username}`);
      }
    }
    
    console.log('🎉 All passwords hashed successfully!');
    console.log('🔑 Login credentials:');
    console.log('   admin / admin123');
    console.log('   manager / Manager2024!@#');
    console.log('   user / User2024!@#');
    console.log('   executive / Executive2024!@#');
    console.log('   operator / Operator2024!@#');
    
  } catch (error) {
    console.error('❌ Error hashing passwords:', error);
    process.exit(1);
  }
}

hashAllPasswords(); 