// components/StatCard.js
export default function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <h2 style={{ color }}>{value}</h2>
      <p>{subtitle}</p>
      <style jsx>{`
        .stat-card {
          background: #fff;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          margin: 10px;
          min-width: 200px;
        }
        h4 {
          margin: 0 0 8px 0;
        }
        h2 {
          margin: 0 0 8px 0;
        }
        p {
          margin: 0;
          color: #888;
        }
      `}</style>
    </div>
  );
}