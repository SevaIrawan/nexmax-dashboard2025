export default async function handler(req, res) {
  try {
    console.log('🧪 Testing environment variables...');
    
    const envCheck = {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    };
    
    console.log('🔧 Environment check:', envCheck);
    
    res.status(200).json({
      success: true,
      message: 'Environment test',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      test: 'API is accessible'
    });
    
  } catch (error) {
    console.error('❌ Test error:', error);
    res.status(500).json({ 
      error: 'Test failed', 
      details: error.message 
    });
  }
} 