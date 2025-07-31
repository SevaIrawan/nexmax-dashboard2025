import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uniquekey } = req.body;

  if (!uniquekey) {
    return res.status(400).json({ 
      success: false,
      error: 'Unique key is required for deletion' 
    });
  }

  let client;

  try {
    client = await pool.connect();
    console.log('🗑️ Attempting to delete headcount record with uniquekey:', uniquekey);

    // First check if the record exists
    const checkQuery = 'SELECT uniquekey FROM headcountdep WHERE uniquekey = $1';
    const checkResult = await client.query(checkQuery, [uniquekey]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Record not found' 
      });
    }

    // Delete the record
    const deleteQuery = 'DELETE FROM headcountdep WHERE uniquekey = $1 RETURNING uniquekey';
    const deleteResult = await client.query(deleteQuery, [uniquekey]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Record not found or already deleted' 
      });
    }

    console.log('✅ Successfully deleted headcount record:', uniquekey);

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
      deletedUniquekey: uniquekey
    });

  } catch (error) {
    console.error('❌ Error deleting headcount record:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while deleting record',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 