import pool from '../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  let client;
  try {
    client = await pool.connect();
    console.log('⚡ FAST Last Update query...');
    
    // DAX-LIKE QUERY: Automatically read MAX(date) from member_report_monthly
    const lastUpdateQuery = `
      SELECT MAX(date) as latest_date
      FROM member_report_monthly 
      WHERE date IS NOT NULL
    `;
    
    const result = await client.query(lastUpdateQuery);
    
    if (result.rows.length > 0 && result.rows[0].latest_date) {
      const latestDate = result.rows[0].latest_date; // Format: "7/28/2025"
      
      // Parse MM/DD/YYYY format
      const [month, day, year] = latestDate.split('/');
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      console.log(`✅ FAST result: ${latestDate} → ${formattedDate}`);
      
      return res.status(200).json({
        last_update: `🔄 Data Updated: ${formattedDate}`,
        source: 'auto_database',
        raw_date: latestDate
      });
    }

    // Fallback if no data found
    return res.status(200).json({
      last_update: `🔄 Data Updated: No data available`,
      source: 'no_data_fallback',
      raw_date: null
    });

  } catch (error) {
    console.error('❌ Database error:', error.message);
    // Fallback if database error
    return res.status(200).json({
      last_update: `🔄 Data Updated: Database error`,
      source: 'error_fallback',
      raw_date: null
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 