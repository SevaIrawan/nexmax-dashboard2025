import { createClient } from '@supabase/supabase-js';
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

async function checkAdminUser() {
  try {
    console.log('🔍 Checking admin user...');
    
    // Get admin user
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin');
    
    if (error) {
      console.error('❌ Error fetching admin user:', error);
      process.exit(1);
    }
    
    if (!users || users.length === 0) {
      console.log('❌ Admin user not found!');
      console.log('📊 All users in database:');
      
      const { data: allUsers } = await supabase
        .from('users')
        .select('*');
      
      allUsers.forEach(user => {
        console.log(`   - ${user.username} (${user.role})`);
      });
      
      return;
    }
    
    const admin = users[0];
    console.log('✅ Admin user found:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Password (first 20 chars): ${admin.password.substring(0, 20)}...`);
    console.log(`   Password length: ${admin.password.length}`);
    
    // Check if password is hashed (bcrypt hashes start with $2b$)
    if (admin.password.startsWith('$2b$')) {
      console.log('✅ Password is properly hashed with bcrypt');
    } else {
      console.log('❌ Password is NOT hashed (plain text)');
    }
    
  } catch (error) {
    console.error('❌ Error checking admin user:', error);
    process.exit(1);
  }
}

checkAdminUser(); 