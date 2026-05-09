import { useState, useEffect } from 'react';
import { getWithFallback } from '../utils/apiClient';
import './AdminDashboard.css';
import { calculateContribution, calculateVulnerability, calculateGap, getPriorityLabel, getInequalityLabel, isHighInequality } from '../utils/climateUtils';

const AdminDashboard = ({ userType, onLogout }) => {

const [regions, setRegions] = useState([]);
const [selectedRegion, setSelectedRegion] = useState(null);

// 🔥 Fetch from backend
useEffect(() => {
getWithFallback('regions')
.then(res => {
const data = res.data.map(region => {
const contribution = calculateContribution({
aqi: region.aqi,
temperature: region.temperature,
income: region.income,
population: region.populationDensity,
emissions: region.emissions
});


      const vulnerability = calculateVulnerability({
        aqi: region.aqi,
        temperature: region.temperature,
        income: region.income,
        population: region.populationDensity,
        emissions: region.emissions
      });

      const gap = calculateGap(vulnerability, contribution);

      return {
        ...region,
        contribution,
        vulnerability,
        gap,
        inequality: isHighInequality(contribution, vulnerability, gap)
      };
    });

    setRegions(data);
    setSelectedRegion(data[0]);
  })
  .catch(err => console.log(err));


}, []);

const highPriorityRegions = [...regions]
.sort((a, b) => b.gap - a.gap)
.slice(0, 3);

if (!selectedRegion) return <p>Loading...</p>;

return ( <section className="admin-dashboard"> <header className="admin-header"> <h1>Admin Dashboard</h1> <button onClick={onLogout}>Logout</button> </header>


  <div className="high-priority">
    <h2>Top Priority Regions</h2>
    {highPriorityRegions.map((region, idx) => (
      <div key={region.id}>
        #{idx + 1} {region.city} - Gap: {region.gap}
      </div>
    ))}
  </div>

  <div className="region-table">
    <h2>All Regions</h2>
    <table>
      <thead>
        <tr>
          <th>City</th>
          <th>Contribution</th>
          <th>Vulnerability</th>
          <th>Gap</th>
        </tr>
      </thead>
      <tbody>
        {regions.map(region => (
          <tr key={region.id} onClick={() => setSelectedRegion(region)}>
            <td>{region.city}</td>
            <td>{region.contribution}</td>
            <td>{region.vulnerability}</td>
            <td>{region.gap}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="analysis">
    <h2>Selected: {selectedRegion.city}</h2>
    <p>AQI: {selectedRegion.aqi}</p>
    <p>Temperature: {selectedRegion.temperature}</p>
    <p>Income: {selectedRegion.income}</p>
    <p>Population: {selectedRegion.populationDensity}</p>
    <p>Emissions: {selectedRegion.emissions}</p>
  </div>
</section>


);
};

export default AdminDashboard;
