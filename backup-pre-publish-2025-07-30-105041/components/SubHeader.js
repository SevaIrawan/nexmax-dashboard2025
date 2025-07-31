import CurrencySlicer from './slicers/CurrencySlicer';
import YearSlicer from './slicers/YearSlicer';
import MonthSlicer from './slicers/MonthSlicer';

// CENTRALIZED SUB HEADER - SAME SIZE AS MAIN DASHBOARD FOR ALL PAGES
export default function SubHeader({ 
  title, 
  year, setYear, 
  currency, setCurrency, 
  month, setMonth, 
  showMonthSlicer = true 
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      minHeight: '100px', // SAME AS MAIN DASHBOARD
      padding: '15px 48px', // SAME AS MAIN DASHBOARD
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', // SAME AS MAIN DASHBOARD
      position: 'relative'
    }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '600', 
        color: '#1f2937', 
        margin: 0, 
        lineHeight: '1.2' 
      }}>
        {title}
      </h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        alignItems: 'center', 
        height: '100%' 
      }}>
        <YearSlicer value={year} onChange={setYear} />
        <CurrencySlicer value={currency} onChange={setCurrency} />
        {showMonthSlicer && (
          <MonthSlicer value={month} onChange={setMonth} />
        )}
      </div>
    </div>
  );
} 