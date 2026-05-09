import { useState, useEffect } from 'react';
import { getWithFallback } from '../utils/apiClient';
import './CitizenDashboard.css';
import { calculateContribution, calculateVulnerability, calculateGap, getRiskLevel, getInequalityLabel } from '../utils/climateUtils';

const CitizenDashboard = ({ userType, onLogout }) => {

const [regions, setRegions] = useState([]);
const [schemes, setSchemes] = useState([]);
const [supportEntries, setSupportEntries] = useState([]);
const [alerts, setAlerts] = useState([]);
const [selectedLocation, setSelectedLocation] = useState('');
const [analyzed, setAnalyzed] = useState(false);
const [currentData, setCurrentData] = useState(null);

// 🔥 Fetch data from backend
useEffect(() => {
getWithFallback('regions')
.then(res => {
console.log("Backend Data:", res.data);
setRegions(res.data);
})
.catch(err => console.log(err));

getWithFallback('schemes')
.then(res => setSchemes(res.data))
.catch(err => console.log(err));

getWithFallback('support')
.then(res => setSupportEntries(res.data))
.catch(err => console.log(err));

getWithFallback('alerts')
.then(res => setAlerts(res.data))
.catch(err => console.log(err));
}, []);

// Analyze selected region
const handleAnalyze = () => {
if (!selectedLocation) return;


const location = regions.find((loc) => loc.city === selectedLocation);
if (location) {
  setCurrentData(location);
  setAnalyzed(true);
}


};

const contributionScore = currentData ? calculateContribution({
aqi: currentData.aqi,
temperature: currentData.temperature,
income: currentData.income,
population: currentData.populationDensity,
emissions: currentData.emissions
}) : null;

const vulnerabilityScore = currentData ? calculateVulnerability({
aqi: currentData.aqi,
temperature: currentData.temperature,
income: currentData.income,
population: currentData.populationDensity,
emissions: currentData.emissions
}) : null;

const gapScore = currentData ? calculateGap(vulnerabilityScore, contributionScore) : null;

const riskStatus = vulnerabilityScore !== null ? getRiskLevel(vulnerabilityScore) : null;
const unfairnessLabel = gapScore !== null ? getInequalityLabel(gapScore) : '';

return ( <section className="citizen-dashboard"> <header className="citizen-header"> <div> <p className="eyebrow">EquiClimate for Citizens</p> <h1>Personalized climate risk analysis</h1> </div> <div className="header-actions"> <p>Logged in as <strong>{userType}</strong></p> <button onClick={onLogout}>Sign out</button> </div> </header>


  <div className="location-selector card-panel">
    <h2>Select Your Location</h2>

    <select
      value={selectedLocation}
      onChange={(e) => setSelectedLocation(e.target.value)}
    >
      <option value="">-- Select a location --</option>

      {regions.map(region => (
        <option key={region.id} value={region.city}>
          {region.city}
        </option>
      ))}
    </select>

    <button onClick={handleAnalyze} disabled={!selectedLocation}>
      Analyze
    </button>
  </div>

  {analyzed && currentData && (
    <div className="result-panel">
      <h2>Results for {currentData.city}</h2>

      <p><strong>Vulnerability Score:</strong> {vulnerabilityScore}</p>
      <p><strong>Contribution Score:</strong> {contributionScore}</p>
      <p><strong>Gap Score:</strong> {gapScore}</p>
      <p><strong>Risk Level:</strong> {riskStatus?.level}</p>
      <p><strong>Fairness:</strong> {unfairnessLabel}</p>
    </div>
  )}
</section>


);
};

export default CitizenDashboard;
