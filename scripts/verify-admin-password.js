import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: 'env.production' });

async function verifyAdminPassword() {
  try {
    console.log('🔍 Verifying admin password...');
    
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Get admin user
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin');
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }
    
    const admin = users[0];
    console.log('👤 Admin user found:', {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      passwordHash: admin.password ? admin.password.substring(0, 30) + '...' : 'null'
    });
    
    // Test password "admin123"
    const testPassword = 'admin123';
    console.log('🔐 Testing password:', testPassword);
    
    const isValid = await bcrypt.compare(testPassword, admin.password);
    console.log('✅ Password valid:', isValid);
    
    // Test password "NexMax2024!@#"
    const testPassword2 = 'NexMax2024!@#';
    console.log('🔐 Testing password:', testPassword2);
    
    const isValid2 = await bcrypt.compare(testPassword2, admin.password);
    console.log('✅ Password valid:', isValid2);
    
    // Hash new password if needed
    if (!isValid && !isValid2) {
      console.log('🔄 Creating new hash for admin123...');
      const newHash = await bcrypt.hash('admin123', 10);
      console.log('🔑 New hash:', newHash);
      
      // Update admin password
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: newHash })
        .eq('username', 'admin');
      
      if (updateError) {
        console.error('❌ Update error:', updateError);
      } else {
        console.log('✅ Admin password updated successfully');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyAdminPassword(); 