import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currency, line, year, month, startDate, endDate, filterMode, page = 1, limit = 1000 } = req.query;
  let client;

  try {
    client = await pool.connect();
    console.log('📊 Fetching deposit_daily data with filters:', { currency, line, year, month, startDate, endDate, filterMode, page, limit });

    // Base query
    let query = `SELECT * FROM deposit_daily WHERE 1=1`;
    let params = [];
    let paramCount = 0;

    // Add filters based on selections
    if (currency && currency !== 'ALL') {
      paramCount++;
      query += ` AND currency = $${paramCount}`;
      params.push(currency);
    }

    if (line && line !== 'ALL') {
      paramCount++;
      query += ` AND line = $${paramCount}`;
      params.push(line);
    }

    if (year && year !== 'ALL') {
      paramCount++;
      query += ` AND EXTRACT(YEAR FROM date) = $${paramCount}`;
      params.push(parseInt(year));
    }

    // Handle month vs date range filtering
    if (filterMode === 'month' && month && month !== 'ALL') {
      paramCount++;
      query += ` AND EXTRACT(MONTH FROM date) = $${paramCount}`;
      params.push(parseInt(month));
    } else if (filterMode === 'daterange' && startDate && endDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
      
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    // Get total count first
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await client.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].total);

    // Add pagination with improved sorting
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` ORDER BY date DESC, year DESC, month DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), offset);

    console.log('🔍 Executing query:', query);
    console.log('📋 With parameters:', params);

    const result = await client.query(query, params);

    console.log(`✅ Found ${result.rows.length} records from deposit_daily (Page ${page} of ${Math.ceil(totalRecords / parseInt(limit))})`);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / parseInt(limit)),
        totalRecords,
        recordsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < Math.ceil(totalRecords / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      },
      filters: {
        currency,
        line,
        year,
        month,
        startDate,
        endDate,
        filterMode
      }
    });

  } catch (error) {
    console.error('❌ Error fetching deposit_daily data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while fetching data',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 