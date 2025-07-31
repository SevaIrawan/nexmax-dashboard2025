import { useState } from 'react';

export default function Setup() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const addLog = (message, type = 'info') => {
    setResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testTable = async () => {
    setLoading(true);
    addLog('Testing exchange_rate table...', 'info');
    
    try {
      const response = await fetch('/api/exchange/test');
      const result = await response.json();
      
      if (result.success) {
        addLog(`✅ Table structure: ${result.structure.length} columns`, 'success');
        addLog(`📊 Total records: ${result.totalRecords}`, 'success');
        if (result.sampleData.length > 0) {
          addLog(`📋 Sample data available`, 'success');
        } else {
          addLog(`⚠️ No data found in table`, 'warning');
        }
      } else {
        addLog(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`❌ Network error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createTable = async () => {
    setLoading(true);
    addLog('Creating exchange_rate table...', 'info');
    
    try {
      const response = await fetch('/api/exchange/create-table', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        addLog(`✅ ${result.message}`, 'success');
      } else {
        addLog(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`❌ Network error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    setLoading(true);
    addLog('Seeding sample data...', 'info');
    
    try {
      const response = await fetch('/api/exchange/seed', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        addLog(`✅ ${result.message}`, 'success');
      } else {
        addLog(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`❌ Network error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔧 Database Setup</h1>
      <p>Setup exchange_rate table and sample data</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testTable}
          disabled={loading}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🧪 Test Table
        </button>
        
        <button
          onClick={createTable}
          disabled={loading}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🔨 Create Table
        </button>
        
        <button
          onClick={seedData}
          disabled={loading}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🌱 Seed Data
        </button>
        
        <button
          onClick={clearLogs}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear Logs
        </button>
      </div>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '15px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <h3>📋 Logs:</h3>
        {results.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No logs yet. Click buttons above to start.</p>
        ) : (
          results.map((log, index) => (
            <div key={index} style={{
              padding: '5px 0',
              borderBottom: '1px solid #e5e7eb',
              color: log.type === 'error' ? '#ef4444' : 
                     log.type === 'success' ? '#10b981' : 
                     log.type === 'warning' ? '#f59e0b' : '#374151'
            }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>📝 Instructions:</h3>
        <ol>
          <li>Click <strong>Test Table</strong> to check if table exists and has data</li>
          <li>If table doesn't exist, click <strong>Create Table</strong></li>
          <li>If table is empty, click <strong>Seed Data</strong> to add sample data</li>
          <li>After setup, go to <a href="/transaction/exchange">Exchange page</a> to test</li>
        </ol>
      </div>
    </div>
  );
} 