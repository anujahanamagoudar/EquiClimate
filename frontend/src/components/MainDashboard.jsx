import { useState, useEffect } from 'react';
import { getWithFallback } from '../utils/apiClient';
import './MainDashboard.css';

const MainDashboard = ({ userType, onLogout }) => {

const threshold = 0.5;

const [regions, setRegions] = useState([]);
const [selectedRegion, setSelectedRegion] = useState(null);

// 🔥 FETCH FROM BACKEND
useEffect(() => {
getWithFallback('regions')
.then(res => {
console.log("Backend Data:", res.data);


    setRegions(res.data);
    if (res.data.length > 0) {
      setSelectedRegion(res.data[0]);
    }
  })
  .catch(err => console.log(err));


}, []);

if (!selectedRegion) return <p>Loading...</p>;

// 🔥 HIGH GAP REGIONS
const highInequality = regions
.filter(region => region.gapScore > threshold)
.slice(0, 3);

const determineReasons = (region) => {
const reasons = [];
if (region.aqi > 200) reasons.push('High air pollution');
if (region.income < 30000) reasons.push('Low income');
if (region.populationDensity > 1000) reasons.push('High population density');
if (region.emissions > 50) reasons.push('High emissions');
if (reasons.length === 0) reasons.push('Balanced conditions');
return reasons;
};

const selectedReasons = determineReasons(selectedRegion);

const impactValue = selectedRegion.emissions;
const contributionValue = selectedRegion.gapScore;
const maxValue = Math.max(100, impactValue, contributionValue);

return ( <section className="main-dashboard">

  <header className="main-header">
    <h1>Main Dashboard</h1>
    <button onClick={onLogout}>Logout</button>
  </header>

  {/* 🔥 TOP INSIGHTS */}
  <div className="top-grid">

    <div className="top-insights">
      <h2>High Inequality Regions</h2>

      {highInequality.map(region => (
        <div key={region.id}>
          <strong>{region.city}</strong> — Gap: {region.gapScore}
        </div>
      ))}
    </div>

    {/* 🔥 IMPACT */}
    <div className="impact-panel">
      <h2>Impact vs Gap</h2>

      <p>Emissions: {impactValue}</p>
      <p>Gap Score: {contributionValue}</p>
    </div>

  </div>

  {/* 🔥 TABLE */}
  <div className="table-grid">

    <table>
      <thead>
        <tr>
          <th>City</th>
          <th>Vulnerability</th>
          <th>Gap</th>
        </tr>
      </thead>

      <tbody>
        {regions.map(region => (
          <tr key={region.id} onClick={() => setSelectedRegion(region)}>
            <td>{region.city}</td>
            <td>{region.vulnerabilityScore}</td>
            <td>{region.gapScore}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* 🔥 DETAILS */}
    <div>
      <h2>{selectedRegion.city}</h2>

      <p><strong>Vulnerability:</strong> {selectedRegion.vulnerabilityScore}</p>
      <p><strong>Gap:</strong> {selectedRegion.gapScore}</p>

      <h3>Reasons</h3>
      <ul>
        {selectedReasons.map(r => <li key={r}>{r}</li>)}
      </ul>
    </div>

  </div>

</section>


);
};

export default MainDashboard;
