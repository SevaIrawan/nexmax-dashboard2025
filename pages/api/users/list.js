import { selectData } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Fetching all users from database...');
    
    // Get all users from Supabase
    const usersData = await selectData('users', '*', {});
    
    // Ensure usersData is an array
    const usersArray = Array.isArray(usersData) ? usersData : [];
    
    if (usersArray.length === 0) {
      console.log('📋 No users found in database');
      return res.status(200).json({
        success: true,
        users: [],
        total: 0,
        message: 'No users found'
      });
    }

    console.log(`✅ Found ${usersArray.length} users in database`);
    
    // Format the data for display
    const users = usersArray.map(user => ({
      id: user.id,
      username: user.username,
      password: user.password, // Show actual password for admin management
      role: user.role,
      created_at: user.created_at || 'Not available'
    }));

    res.status(200).json({
      success: true,
      users: users,
      total: users.length,
      message: `Successfully fetched ${users.length} users`
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while fetching users',
      message: error.message,
      users: []
    });
  }
} 