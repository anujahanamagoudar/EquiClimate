import { useState, useEffect } from 'react';
import { getWithFallback, postWithFallback } from '../utils/apiClient';
import './GovtDashboard.css';
import { calculateContribution, calculateVulnerability, calculateGap, getInequalityLabel } from '../utils/climateUtils';

const GovtDashboard = ({ userType, onLogout }) => {

const [regions, setRegions] = useState([]);
const [schemes, setSchemes] = useState([]);
const [selectedRegionName, setSelectedRegionName] = useState('');
const [editIncome, setEditIncome] = useState(0);
const [editEmissions, setEditEmissions] = useState(0);
const [newScheme, setNewScheme] = useState({ name: '', description: '', targetRegion: '' });

// 🔥 FETCH FROM BACKEND
useEffect(() => {
getWithFallback('regions')
.then(res => {
const enriched = res.data.map(region => {
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
        gap
      };
    });

    setRegions(enriched);

    if (enriched.length > 0) {
      setSelectedRegionName(enriched[0].city);
      setEditIncome(enriched[0].income);
      setEditEmissions(enriched[0].emissions);
    }
  })
  .catch(err => console.log(err));

getWithFallback('schemes')
.then(res => setSchemes(res.data))
.catch(err => console.log(err));
}, []);

const selectedRegion = regions.find(r => r.city === selectedRegionName) || {};

const sortedPriority = [...regions]
.sort((a, b) => b.gap - a.gap)
.slice(0, 3);

const handleRegionChange = (city) => {
const region = regions.find(r => r.city === city);
if (region) {
setSelectedRegionName(city);
setEditIncome(region.income);
setEditEmissions(region.emissions);
}
};

const handleSaveRegion = () => {
setRegions(prev =>
prev.map(region =>
region.city === selectedRegionName
? {
...region,
income: Number(editIncome),
emissions: Number(editEmissions)
}
: region
)
);
};

const handleSchemeSubmit = async (e) => {
e.preventDefault();
if (!newScheme.name || !newScheme.description || !newScheme.targetRegion) return;

try {
  const res = await postWithFallback('schemes', newScheme);
  setSchemes(prev => [...prev, res.data]);
  setNewScheme({ name: '', description: '', targetRegion: '' });
} catch (err) {
  console.log(err);
}
};

return ( <section className="govt-dashboard">

  <header className="govt-header">
    <h1>Government Dashboard</h1>
    <button onClick={onLogout}>Logout</button>
  </header>

  {/* 🔥 PRIORITY */}
  <div className="priority-panel">
    <h2>Priority Regions</h2>

    {sortedPriority.map((region, index) => (
      <div key={region.id}>
        #{index + 1} {region.city} — Gap: {region.gap}
      </div>
    ))}
  </div>

  {/* 🔥 REGION MANAGEMENT */}
  <div className="region-panel">

    <select value={selectedRegionName} onChange={(e) => handleRegionChange(e.target.value)}>
      {regions.map(region => (
        <option key={region.id} value={region.city}>
          {region.city}
        </option>
      ))}
    </select>

    <input
      type="number"
      value={editIncome}
      onChange={(e) => setEditIncome(e.target.value)}
      placeholder="Income"
    />

    <input
      type="number"
      value={editEmissions}
      onChange={(e) => setEditEmissions(e.target.value)}
      placeholder="Emissions"
    />

    <button onClick={handleSaveRegion}>Save</button>

    {/* 🔥 DETAILS */}
    {selectedRegion && (
      <div>
        <p><strong>Contribution:</strong> {selectedRegion.contribution}</p>
        <p><strong>Vulnerability:</strong> {selectedRegion.vulnerability}</p>
        <p><strong>Gap:</strong> {selectedRegion.gap}</p>
        <p><strong>Fairness:</strong> {getInequalityLabel(selectedRegion.gap)}</p>
      </div>
    )}
  </div>

  {/* 🔥 SCHEME */}
  <div className="scheme-panel">
    <h2>Add Scheme</h2>

    <form onSubmit={handleSchemeSubmit}>
      <input
        placeholder="Scheme name"
        value={newScheme.name}
        onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
      />

      <input
        placeholder="Target region"
        value={newScheme.targetRegion}
        onChange={(e) => setNewScheme({ ...newScheme, targetRegion: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={newScheme.description}
        onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
      />

      <button type="submit">Add</button>
    </form>

    {schemes.map((s, i) => (
      <div key={i}>
        <h4>{s.name}</h4>
        <p>{s.description}</p>
        <small>{s.targetRegion}</small>
      </div>
    ))}
  </div>

</section>


);
};

export default GovtDashboard;
