export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear semua cookies
  res.setHeader('Set-Cookie', [
    'user_id=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'username=; Path=/; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'user_role=; Path=/; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  ]);

  res.status(200).json({ success: true, message: 'Logged out successfully' });
} 