import fs from 'fs';

console.log('🔍 Testing environment variables...\n');

// Check if file exists
if (fs.existsSync('temp.env.local')) {
  console.log('✅ temp.env.local file exists');
  
  // Read file content
  const content = fs.readFileSync('temp.env.local', 'utf8');
  console.log('File content length:', content.length);
  
  // Parse environment variables manually
  const lines = content.split('\n');
  const envVars = {};
  
  lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const equalIndex = line.indexOf('=');
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex);
        const value = line.substring(equalIndex + 1);
        envVars[key] = value;
      }
    }
  });
  
  console.log('\nParsed environment variables:');
  console.log('SUPABASE_URL:', envVars.SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY:', envVars.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', envVars.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Not set');
  console.log('JWT_SECRET:', envVars.JWT_SECRET ? '✅ Set' : '❌ Not set');
  
  // Set environment variables manually
  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = value;
  });
  
  console.log('\nAfter setting manually:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Not set');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
} else {
  console.log('❌ temp.env.local file does not exist');
}

console.log('\n🎉 Environment test complete!'); 