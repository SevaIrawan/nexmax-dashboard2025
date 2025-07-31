import { useState, useEffect } from 'react';

export function useLastUpdate() {
  const [lastUpdate, setLastUpdate] = useState({
    date: null,
    formattedDate: 'Loading...',
    totalRecords: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLastUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/last-update');
      const result = await response.json();
      
      if (result.success) {
        console.log('🔄 LastUpdate hook received:', result.lastUpdate);
        setLastUpdate(result.lastUpdate);
      } else {
        setError(result.error || 'Failed to fetch last update');
        setLastUpdate({
          date: null,
          formattedDate: 'Error loading',
          totalRecords: 0
        });
      }
    } catch (error) {
      console.error('Error fetching last update:', error);
      setError('Network error while fetching last update');
      setLastUpdate({
        date: null,
        formattedDate: 'Network error',
        totalRecords: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastUpdate();
    
    // Refresh every 5 minutes to keep last update current
    const interval = setInterval(fetchLastUpdate, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    lastUpdate,
    loading,
    error,
    refresh: fetchLastUpdate
  };
} 