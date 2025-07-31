import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { month, startDate, endDate, useDateRange, page = 1, limit = 1000 } = req.query;
  let client;

  try {
    client = await pool.connect();
    console.log('📊 Fetching headcountdep data with filters:', { month, startDate, endDate, useDateRange, page, limit });

    // First, get table structure to build dynamic query
    const structureQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'headcountdep' 
      ORDER BY ordinal_position
    `;
    
    const structureResult = await client.query(structureQuery);
    const columns = structureResult.rows.map(row => row.column_name);
    
    console.log('📋 Table columns:', columns);

    // Build dynamic SELECT query
    let selectFields = columns.map(col => {
      if (col === 'date') {
        return 'DATE(date) as date';
      }
      return col;
    }).join(', ');

    // Base query with dynamic columns
    let query = `SELECT ${selectFields} FROM headcountdep WHERE 1=1`;
    let params = [];
    let paramCount = 0;

    // Add filters based on selections
    if (month && month !== 'ALL' && useDateRange !== 'true') {
      paramCount++;
      query += ` AND EXTRACT(MONTH FROM date) = $${paramCount}`;
      params.push(parseInt(month));
    }

    if (useDateRange === 'true' && startDate && endDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
      
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    // Get total count first
    const countQuery = query.replace(`SELECT ${selectFields}`, 'SELECT COUNT(*) as total');
    const countResult = await client.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].total);

    // Add pagination with improved sorting
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` ORDER BY date DESC, year DESC, month DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), offset);

    console.log('🔍 Executing query:', query);
    console.log('📋 With parameters:', params);

    const result = await client.query(query, params);

    console.log(`✅ Found ${result.rows.length} records from headcountdep (Page ${page} of ${Math.ceil(totalRecords / parseInt(limit))})`);

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
        month,
        startDate,
        endDate,
        useDateRange
      }
    });

  } catch (error) {
    console.error('❌ Error fetching headcountdep data:', error);
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