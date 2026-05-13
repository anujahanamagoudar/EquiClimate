import { useState, useEffect } from 'react';
import { getWithFallback, postWithFallback } from '../utils/apiClient';
import './GovtDashboard.css';
import { calculateContribution, calculateVulnerability, calculateGap, getInequalityLabel, getRiskLevel } from '../utils/climateUtils';

const GovtDashboard = ({ userType, onLogout, onViewAnalytics }) => {
  const [regions, setRegions] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedRegionName, setSelectedRegionName] = useState('');
  const [editIncome, setEditIncome] = useState(0);
  const [editEmissions, setEditEmissions] = useState(0);
  const [newScheme, setNewScheme] = useState({ name: '', description: '', targetRegion: '' });

  const enrichRegion = (region) => {
    const contribution = calculateContribution({
      aqi: region.aqi,
      temperature: region.temperature,
      income: region.income,
      population: region.populationDensity,
      emissions: region.emissions,
    });

    const vulnerability = calculateVulnerability({
      aqi: region.aqi,
      temperature: region.temperature,
      income: region.income,
      population: region.populationDensity,
      emissions: region.emissions,
    });

    const gap = calculateGap(vulnerability, contribution);
    const risk = getRiskLevel(vulnerability);

    return {
      ...region,
      contribution,
      vulnerability,
      gap,
      riskLevel: risk.level,
      riskColor: risk.color,
    };
  };

  useEffect(() => {
    getWithFallback('regions')
      .then((res) => {
        const enriched = (res.data || []).map(enrichRegion);
        setRegions(enriched);

        if (enriched.length > 0) {
          const [first] = enriched;
          setSelectedRegionName(first.city);
          setEditIncome(first.income);
          setEditEmissions(first.emissions);
        }
      })
      .catch(() => setRegions([]));

    getWithFallback('schemes')
      .then((res) => setSchemes(res.data || []))
      .catch(() => setSchemes([]));
  }, []);

  const selectedRegion = regions.find((r) => r.city === selectedRegionName) || null;

  const priorityRegions = [...regions]
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  const handleRegionChange = (city) => {
    const region = regions.find((r) => r.city === city);
    if (region) {
      setSelectedRegionName(city);
      setEditIncome(region.income);
      setEditEmissions(region.emissions);
    }
  };

  const handleSaveRegion = () => {
    setRegions((prev) =>
      prev.map((region) =>
        region.city === selectedRegionName
          ? enrichRegion({ ...region, income: Number(editIncome), emissions: Number(editEmissions) })
          : region
      )
    );
  };

  const handleSchemeSubmit = async (e) => {
    e.preventDefault();
    if (!newScheme.name || !newScheme.description || !newScheme.targetRegion) return;

    try {
      const res = await postWithFallback('schemes', newScheme);
      setSchemes((prev) => [...prev, res.data]);
      setNewScheme({ name: '', description: '', targetRegion: '' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="govt-dashboard">
      <header className="govt-header">
        <div>
          <p className="eyebrow">Government Portal</p>
          <h1>Government Dashboard</h1>
        </div>
        <div className="header-actions">
          <button type="button" className="secondary-action" onClick={onViewAnalytics}>
            View analytics
          </button>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="top-grid">
        <div className="card-panel">
          <div className="panel-header">
            <h2>Top Priority Regions</h2>
            <p className="panel-note">Focus on the regions with the largest equity gap.</p>
          </div>

          <div className="priority-list">
            {priorityRegions.map((region, index) => (
              <div key={region.id} className="priority-item">
                <div>
                  <h3>{index + 1}. {region.city}</h3>
                  <p>Gap score: {region.gap}</p>
                </div>
                <span className="risk-badge" style={{ backgroundColor: region.riskColor }}>
                  {region.riskLevel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-panel">
          <div className="panel-header">
            <h2>Selected region</h2>
            <p className="panel-note">Adjust economic levers and see the updated risk profile immediately.</p>
          </div>

          <div className="region-select-row">
            <select value={selectedRegionName} onChange={(e) => handleRegionChange(e.target.value)}>
              {regions.map((region) => (
                <option key={region.id} value={region.city}>
                  {region.city}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-grid">
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
          </div>

          <button type="button" className="save-btn" onClick={handleSaveRegion}>
            Recalculate region score
          </button>

          {selectedRegion ? (
            <div className="region-summary">
              <div><strong>Vulnerability:</strong> {selectedRegion.vulnerability}</div>
              <div><strong>Contribution:</strong> {selectedRegion.contribution}</div>
              <div><strong>Gap:</strong> {selectedRegion.gap}</div>
              <div><strong>Fairness:</strong> {getInequalityLabel(selectedRegion.gap)}</div>
            </div>
          ) : (
            <p className="panel-note">Select a region to view details.</p>
          )}
        </div>
      </div>

      <div className="scheme-panel card-panel">
        <div className="panel-header">
          <h2>Policy schemes</h2>
          <p className="panel-note">Publish targeted initiatives to support regions in need.</p>
        </div>

        <form className="scheme-form" onSubmit={handleSchemeSubmit}>
          <input
            placeholder="Scheme name"
            value={newScheme.name}
            onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
          />

          <select
            value={newScheme.targetRegion}
            onChange={(e) => setNewScheme({ ...newScheme, targetRegion: e.target.value })}
          >
            <option value="" disabled>
              Choose target region
            </option>
            {regions.map((region) => (
              <option key={region.id} value={region.city}>
                {region.city}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={newScheme.description}
            onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
          />

          <button type="submit">Add scheme</button>
        </form>

        <div className="scheme-list">
          {schemes.map((scheme, index) => (
            <div key={index} className="scheme-card">
              <h3>{scheme.name}</h3>
              <p>{scheme.description}</p>
              <small>{scheme.targetRegion || 'Regional program'}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GovtDashboard;
