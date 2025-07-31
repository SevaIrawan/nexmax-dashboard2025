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

async function createAdminUser() {
  try {
    console.log('🔧 Creating new admin user...');
    
    // Delete existing admin user first
    console.log('🗑️ Deleting existing admin user...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('username', 'admin');
    
    if (deleteError) {
      console.error('❌ Error deleting existing admin:', deleteError);
    } else {
      console.log('✅ Existing admin user deleted');
    }
    
    // Create new admin user
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    const newAdmin = {
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    };
    
    console.log('📝 Creating new admin user...');
    const { data, error } = await supabase
      .from('users')
      .insert([newAdmin]);
    
    if (error) {
      console.error('❌ Error creating admin user:', error);
      process.exit(1);
    }
    
    console.log('✅ Admin user created successfully!');
    console.log('🔑 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    
    // Verify the user was created
    const { data: verifyData } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin');
    
    if (verifyData && verifyData.length > 0) {
      console.log('✅ User verified in database');
    } else {
      console.log('❌ User not found in database');
    }
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 