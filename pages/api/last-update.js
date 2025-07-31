import { selectData } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all dates from member_report_daily and find the latest
    const { data: memberData, error } = await selectData(
      'member_report_daily',
      'date'
    );

    if (error) {
      console.error('❌ Error fetching last update:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!memberData || memberData.length === 0) {
      console.log('⚠️ No data found in member_report_daily');
      return res.status(200).json({
        success: true,
        lastUpdate: {
          date: null,
          formattedDate: 'No data available',
          totalRecords: 0
        }
      });
    }

    // Find the latest date
    const dates = memberData.map(row => new Date(row.date));
    const latestDate = new Date(Math.max(...dates));
    const totalRecords = memberData.length;

    // Format date for display
    const formattedDate = latestDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    console.log('✅ Last update fetched successfully:', {
      date: latestDate.toISOString(),
      formattedDate,
      totalRecords
    });

    res.status(200).json({
      success: true,
      lastUpdate: {
        date: latestDate.toISOString(),
        formattedDate,
        totalRecords
      }
    });

  } catch (error) {
    console.error('❌ Last update API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 