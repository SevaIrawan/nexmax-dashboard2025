import { useState } from 'react';

export default function ExportButton({ 
  data = [], 
  filename = 'export', 
  endpoint = '', 
  params = {},
  disabled = false 
}) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (disabled || data.length === 0) {
      alert('No data available for export');
      return;
    }

    try {
      setExporting(true);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Get filename from response headers or use default
        const contentDisposition = response.headers.get('content-disposition');
        const downloadFilename = contentDisposition 
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        
        a.download = downloadFilename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(`Export failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || exporting || data.length === 0}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: disabled || data.length === 0 ? '#f3f4f6' : '#10b981',
        color: disabled || data.length === 0 ? '#9ca3af' : 'white',
        cursor: disabled || data.length === 0 ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {exporting ? (
        <>
          <span>⏳</span>
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <span>📥</span>
          <span>Export CSV</span>
        </>
      )}
    </button>
  );
} 