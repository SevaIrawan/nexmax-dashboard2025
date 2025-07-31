import { useLastUpdate } from '../hooks/useLastUpdate';

export default function LastUpdate() {
  const { lastUpdate, loading, error } = useLastUpdate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: '#1f2937',
      borderRadius: '8px',
      border: '1px solid #374151',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Orange accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        backgroundColor: '#f59e0b',
        zIndex: 1
      }} />
      
      {/* N icon */}
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#000',
        border: '1px solid #fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 2,
        position: 'relative'
      }}>
        <span style={{
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          fontStyle: 'italic'
        }}>
          N
        </span>
      </div>
      
      {/* Last update text */}
      <div style={{
        color: '#f59e0b',
        fontSize: '12px',
        fontWeight: '500',
        zIndex: 2,
        position: 'relative'
      }}>
        {loading ? (
          'Loading...'
        ) : error ? (
          'Error loading update'
        ) : (
          `LAST UPDATE: ${lastUpdate.formattedDate}`
        )}
      </div>
    </div>
  );
} 