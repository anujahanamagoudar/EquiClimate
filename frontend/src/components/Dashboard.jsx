import { useEffect, useState } from "react";
import { getWithFallback } from '../utils/apiClient';


const Dashboard = ({ onOpenLogin, onOpenRegister, onViewAnalytics }) => {

const [regions, setRegions] = useState([]);
const [highRisk, setHighRisk] = useState([]);

// 🔥 Fetch data from backend
useEffect(() => {
getWithFallback('regions')
.then(res => {
console.log("Backend Data:", res.data);
setRegions(res.data);


    // Sort by gapScore (highest first)
    const sorted = [...res.data]
      .sort((a, b) => b.gapScore - a.gapScore)
      .slice(0, 3);

    setHighRisk(sorted);
  })
  .catch(err => console.log(err));


}, []);

return ( <div className="dashboard-layout">

  {/* HEADER */}
  <header className="dashboard-header">
    <div className="brand-wrap">
      <span className="brand-name">Equi</span>
      <span className="brand-strong">Climate</span>
    </div>
    <p>
      AI-based climate inequality intelligence for communities and decision makers.
    </p>
  </header>

  {/* HERO */}
  <section className="dashboard-hero">
    <div className="hero-copy">
      <p className="eyebrow">Climate equity intelligence</p>
      <h1>Understanding climate inequality in real time</h1>
      <p>
        Identify regions where environmental impact is high despite lower contribution levels.
        Access a clean, modern platform designed for both citizens and government / NGO users.
      </p>

      <div className="dashboard-buttons">
        <button className="primary-action" onClick={onOpenRegister}>
          Create account
        </button>
        <button className="secondary-action" onClick={onOpenLogin}>
          Sign in
        </button>
        <button className="secondary-action" onClick={onViewAnalytics}>
          View analytics
        </button>
      </div>
    </div>
  </section>

  {/* 🔥 DYNAMIC INSIGHTS */}
  <section className="insights">

    {/* HIGH RISK REGIONS */}
    <div className="dashboard-card">
      <h3>High Risk Regions</h3>

      {highRisk.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {highRisk.map(region => (
            <li key={region.id}>
              <strong>{region.city}</strong> — Gap: {region.gapScore.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* INEQUALITY */}
    <div className="dashboard-card">
      <h3>Inequality Gap Analysis</h3>
      <p>
        Real-time comparison of vulnerability vs contribution using backend data.
      </p>

      {regions.length > 0 && (
        <p>Total Regions Analyzed: <strong>{regions.length}</strong></p>
      )}
    </div>

    {/* DECISION SUPPORT */}
    <div className="dashboard-card">
      <h3>Decision Support</h3>

      {highRisk.length > 0 ? (
        <p>
          Focus resources on <strong>{highRisk[0].city}</strong> for maximum impact.
        </p>
      ) : (
        <p>Loading recommendations...</p>
      )}
    </div>

  </section>

</div>


);
};

export default Dashboard;
