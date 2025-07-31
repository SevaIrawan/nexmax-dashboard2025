import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from env.production
dotenv.config({ path: 'env.production' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabaseAdmin.from('users').select('*').limit(1);
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

// Helper function to execute queries
export async function executeQuery(query, params = []) {
  try {
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: query });
    if (error) {
      console.error('❌ Query execution error:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('❌ Query execution error:', error);
    return null;
  }
}

// Helper function to insert data
export async function insertData(table, data) {
  try {
    const { data: result, error } = await supabaseAdmin.from(table).insert(data);
    if (error) {
      console.error(`❌ Error inserting data into ${table}:`, error);
      return null;
    }
    return result;
  } catch (error) {
    console.error(`❌ Error inserting data into ${table}:`, error);
    return null;
  }
}

// Helper function to select data with better error handling
export async function selectData(table, columns = '*', filters = {}, limit = null) {
  try {
    let query = supabaseAdmin.from(table).select(columns);
    
    // Apply filters if provided
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    // Apply limit only if specified
    if (limit !== null && limit > 0) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`❌ Error selecting data from ${table}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`❌ Error selecting data from ${table}:`, error);
    return [];
  }
}

// Helper function to update data
export async function updateData(table, data, filters = {}) {
  try {
    let query = supabaseAdmin.from(table).update(data);
    
    // Apply filters if provided
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data: result, error } = await query;
    
    if (error) {
      console.error(`❌ Error updating data in ${table}:`, error);
      return null;
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Error updating data in ${table}:`, error);
    return null;
  }
}

// Helper function to delete data
export async function deleteData(table, filters = {}) {
  try {
    let query = supabaseAdmin.from(table).delete();
    
    // Apply filters if provided
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data: result, error } = await query;
    
    if (error) {
      console.error(`❌ Error deleting data from ${table}:`, error);
      return null;
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Error deleting data from ${table}:`, error);
    return null;
  }
} 