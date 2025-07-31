import { useState, useEffect } from 'react';

export function useLastUpdate() {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLastUpdate = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/last-update');
        const data = await response.json();
        
        if (data.last_update) {
          setLastUpdate(data.last_update);
          setError(null);
        } else {
          setError('Failed to fetch last update');
          setLastUpdate(`🔄 Data Updated: ${new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: '2-digit', 
            year: 'numeric' 
          })}`); // Fallback
        }
      } catch (err) {
        console.error('Error fetching last update:', err);
        setError(err.message);
        setLastUpdate(`🔄 Data Updated: ${new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: '2-digit', 
          year: 'numeric' 
        })}`); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchLastUpdate();
  }, []);

  return { lastUpdate, loading, error };
} 