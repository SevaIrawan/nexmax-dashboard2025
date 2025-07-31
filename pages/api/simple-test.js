export default async function handler(req, res) {
  try {
    console.log('🧪 Simple API test...');
    
    // Check environment variables
    const envCheck = {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    };
    
    console.log('🔧 Environment variables:', envCheck);
    
    // Test basic response
    res.status(200).json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      test: 'This API endpoint is accessible'
    });
    
  } catch (error) {
    console.error('❌ API test error:', error);
    res.status(500).json({ 
      error: 'API test failed', 
      details: error.message 
    });
  }
} 