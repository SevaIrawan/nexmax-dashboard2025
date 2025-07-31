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

async function fixAdminPassword() {
  try {
    console.log('🔧 Fixing admin password...');
    
    // Hash the password
    const plainPassword = 'NexMax2024!@#';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('✅ Password hashed successfully');
    
    // Update admin user password
    const { error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('username', 'admin');
    
    if (error) {
      console.error('❌ Error updating admin password:', error);
      process.exit(1);
    }
    
    console.log('✅ Admin password updated successfully!');
    console.log('🔑 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: NexMax2024!@#');
    
  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
    process.exit(1);
  }
}

fixAdminPassword(); 