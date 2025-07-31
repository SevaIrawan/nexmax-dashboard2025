import { useState, useEffect } from 'react';
import Header from '../components/Header';

export default function DatabaseStructure() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDatabaseStructure();
  }, []);

  const fetchDatabaseStructure = async () => {
    try {
      const response = await fetch('/api/database/tables');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading database structure...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data) return <div className="error">No data available</div>;

  return (
    <div className="database-structure">
      <Header title="🗄️ Database Structure" />
      
      <div className="content">
        <div className="overview">
          <h2>📊 Database Overview</h2>
          <div className="stats">
            <div className="stat-card">
              <h3>Total Tables</h3>
              <span className="stat-value">{data.totalTables}</span>
            </div>
            <div className="stat-card">
              <h3>Deposit Daily Table</h3>
              <span className={`stat-value ${data.depositDailyExists ? 'exists' : 'missing'}`}>
                {data.depositDailyExists ? '✅ EXISTS' : '❌ MISSING'}
              </span>
            </div>
          </div>
        </div>

        <div className="tables-list">
          <h2>📋 All Tables</h2>
          <div className="table-names">
            {data.tableNames.map((tableName, index) => (
              <div key={index} className={`table-name ${tableName === 'deposit_daily' ? 'highlight' : ''}`}>
                {tableName === 'deposit_daily' && '🎯 '}
                {tableName}
              </div>
            ))}
          </div>
        </div>

        <div className="tables-details">
          <h2>🔍 Table Structures</h2>
          {Object.entries(data.tableStructures).map(([tableName, structure]) => (
            <div key={tableName} className="table-detail">
              <h3 className={tableName === 'deposit_daily' ? 'target-table' : ''}>
                {tableName === 'deposit_daily' && '🎯 '}
                {tableName}
              </h3>
              
              <div className="columns-section">
                <h4>📝 Columns ({structure.columns.length})</h4>
                <div className="columns-grid">
                  {structure.columns.map((column, index) => (
                    <div key={index} className="column-card">
                      <div className="column-name">{column.column_name}</div>
                      <div className="column-type">{column.data_type}</div>
                      <div className="column-nullable">
                        {column.is_nullable === 'YES' ? '🟢 Nullable' : '🔴 Required'}
                      </div>
                      {column.column_default && (
                        <div className="column-default">Default: {column.column_default}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {structure.sampleData.length > 0 && (
                <div className="sample-section">
                  <h4>📊 Sample Data ({structure.sampleData.length} rows)</h4>
                  <div className="sample-table">
                    <table>
                      <thead>
                        <tr>
                          {structure.columns.map((column, index) => (
                            <th key={index}>{column.column_name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {structure.sampleData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {structure.columns.map((column, colIndex) => (
                              <td key={colIndex}>
                                {row[column.column_name] !== null 
                                  ? String(row[column.column_name]) 
                                  : '∅'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .database-structure {
          min-height: 100vh;
          background: #f8fafc;
        }

        .content {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }

        .error {
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }

        .overview {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .overview h2 {
          margin: 0 0 16px 0;
          color: #1f2937;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid #e2e8f0;
        }

        .stat-card h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }

        .stat-value.exists {
          color: #059669;
        }

        .stat-value.missing {
          color: #dc2626;
        }

        .tables-list {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .tables-list h2 {
          margin: 0 0 16px 0;
          color: #1f2937;
        }

        .table-names {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }

        .table-name {
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }

        .table-name.highlight {
          background: #fef3c7;
          border-color: #f59e0b;
          font-weight: bold;
        }

        .tables-details {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .tables-details h2 {
          margin: 0 0 24px 0;
          color: #1f2937;
        }

        .table-detail {
          margin-bottom: 32px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fafafa;
        }

        .table-detail h3 {
          margin: 0 0 16px 0;
          font-family: 'Courier New', monospace;
          color: #1f2937;
          font-size: 20px;
        }

        .table-detail h3.target-table {
          color: #f59e0b;
          background: #fef3c7;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .columns-section h4, .sample-section h4 {
          margin: 16px 0 12px 0;
          color: #374151;
        }

        .columns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .column-card {
          background: white;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
        }

        .column-name {
          font-weight: bold;
          color: #1f2937;
          font-family: 'Courier New', monospace;
        }

        .column-type {
          color: #6366f1;
          font-size: 12px;
          margin: 4px 0;
        }

        .column-nullable {
          font-size: 11px;
          margin: 4px 0;
        }

        .column-default {
          font-size: 10px;
          color: #6b7280;
          font-style: italic;
        }

        .sample-table {
          overflow-x: auto;
          border: 1px solid #d1d5db;
          border-radius: 6px;
        }

        .sample-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .sample-table th,
        .sample-table td {
          padding: 8px 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 12px;
        }

        .sample-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .sample-table td {
          font-family: 'Courier New', monospace;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .content {
            padding: 12px;
          }
          
          .stats {
            grid-template-columns: 1fr;
          }
          
          .table-names {
            grid-template-columns: 1fr;
          }
          
          .columns-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 