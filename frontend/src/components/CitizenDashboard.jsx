import { useState, useEffect } from 'react';
import { getWithFallback } from '../utils/apiClient';
import './CitizenDashboard.css';
import { calculateContribution, calculateVulnerability, calculateGap, getRiskLevel, getInequalityLabel } from '../utils/climateUtils';

const CitizenDashboard = ({ userType, onLogout, onViewAnalytics }) => {

  const [regions, setRegions] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [supportEntries, setSupportEntries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationCoords, setLocationCoords] = useState(null);
  const [geolocationError, setGeolocationError] = useState('');
  const [geolocationStatus, setGeolocationStatus] = useState('');
  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const getRegionLabel = (region) => region?.city || region?.region || region?.name || 'Unknown location';

  useEffect(() => {
    getWithFallback('regions')
      .then(res => setRegions(res.data || []))
      .catch(() => setRegions([]));

    getWithFallback('schemes')
      .then(res => setSchemes(res.data || []))
      .catch(() => setSchemes([]));

    getWithFallback('support')
      .then(res => setSupportEntries(res.data || []))
      .catch(() => setSupportEntries([]));

    getWithFallback('alerts')
      .then(res => setAlerts(res.data || []))
      .catch(() => setAlerts([]));
  }, []);

  const filteredRegions = locationQuery.trim()
    ? regions.filter((region) =>
        getRegionLabel(region).toLowerCase().includes(locationQuery.toLowerCase())
      )
    : regions.slice(0, 6);

  const supportCount = supportEntries.length;
  const alertCount = alerts.length;
  const schemeCount = schemes.length;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(a));
  };

  const findNearestRegion = (coords) => {
    if (!coords || regions.length === 0) return null;

    return regions.reduce((closest, region) => {
      if (region.latitude == null || region.longitude == null) return closest;
      const distance = haversineDistance(coords.latitude, coords.longitude, region.latitude, region.longitude);
      return !closest || distance < closest.distance
        ? { region, distance }
        : closest;
    }, null)?.region;
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeolocationError('Geolocation is not available in your browser.');
      return;
    }

    setGeolocationLoading(true);
    setGeolocationError('');
    setGeolocationStatus('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocationCoords(coords);

        const nearest = findNearestRegion(coords);
        if (nearest) {
          const label = getRegionLabel(nearest);
          setSelectedCity(label);
          setLocationQuery(label);
          setCurrentData(nearest);
          setAnalyzed(true);
          setGeolocationStatus(`Matched nearest region: ${label}`);
        } else if (regions.length > 0) {
          const fallbackRegion = regions.find((region) => region.latitude != null && region.longitude != null) || regions[0];
          if (fallbackRegion) {
            const label = getRegionLabel(fallbackRegion);
            setSelectedCity(label);
            setLocationQuery(label);
            setCurrentData(fallbackRegion);
            setAnalyzed(true);
            setGeolocationStatus(`Could not match location exactly. Showing closest available region: ${label}`);
          } else {
            setCurrentData(null);
            setAnalyzed(false);
            setGeolocationError('Your location was detected, but no region data is available.');
          }
        } else {
          setCurrentData(null);
          setAnalyzed(false);
          setGeolocationError('Location detected, but region list is still loading. Please try again.');
        }

        setGeolocationLoading(false);
      },
      (error) => {
        setGeolocationLoading(false);
        setGeolocationError(error.message || 'Unable to access your location.');
      },
      { timeout: 10000 }
    );
  };

  const handleSelectLocation = (label) => {
    const location = regions.find((loc) => getRegionLabel(loc).toLowerCase() === label.toLowerCase());
    if (!location) return;

    setSelectedCity(getRegionLabel(location));
    setLocationQuery(getRegionLabel(location));
    setCurrentData(location);
    setAnalyzed(true);
    setGeolocationError('');
    setGeolocationStatus(`Loaded region data for ${getRegionLabel(location)}.`);
  };

  const handleAnalyze = () => {
    const queryValue = locationQuery.trim();
    if (!queryValue) return;

    const exactLocation = regions.find(
      (loc) => getRegionLabel(loc).toLowerCase() === queryValue.toLowerCase()
    );

    if (exactLocation) {
      const label = getRegionLabel(exactLocation);
      setCurrentData(exactLocation);
      setSelectedCity(label);
      setLocationQuery(label);
      setAnalyzed(true);
      setGeolocationError('');
      return;
    }

    const partialLocation = regions.find(
      (loc) => getRegionLabel(loc).toLowerCase().includes(queryValue.toLowerCase())
    );

    if (partialLocation) {
      const label = getRegionLabel(partialLocation);
      setCurrentData(partialLocation);
      setSelectedCity(label);
      setLocationQuery(label);
      setAnalyzed(true);
      setGeolocationError('');
      return;
    }

    setCurrentData(null);
    setAnalyzed(false);
    setSelectedCity('');
    setGeolocationError(`No matching location found for “${queryValue}”. Try another location.`);
  };

  const contributionScore = currentData
    ? calculateContribution({
        aqi: currentData.aqi,
        temperature: currentData.temperature,
        income: currentData.income,
        population: currentData.populationDensity,
        emissions: currentData.emissions,
      })
    : null;

  const vulnerabilityScore = currentData
    ? calculateVulnerability({
        aqi: currentData.aqi,
        temperature: currentData.temperature,
        income: currentData.income,
        population: currentData.populationDensity,
        emissions: currentData.emissions,
      })
    : null;

  const gapScore = currentData ? calculateGap(vulnerabilityScore, contributionScore) : null;
  const riskStatus = vulnerabilityScore !== null ? getRiskLevel(vulnerabilityScore) : null;
  const unfairnessLabel = gapScore !== null ? getInequalityLabel(gapScore) : '';

  return (
    <section className="citizen-dashboard">
      <header className="citizen-header">
        <div>
          <p className="eyebrow">EquiClimate for Citizens</p>
          <h1>Personalized climate risk analysis</h1>
          <p className="header-note">
            Use live city data and the location selector to compare climate vulnerability
            versus contribution and understand fairness in your area.
          </p>
        </div>

        <div className="header-actions">
          <button type="button" className="secondary-action" onClick={onViewAnalytics}>
            View analytics
          </button>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-title">Community programs</span>
          <strong>{supportCount}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-title">Regional alerts</span>
          <strong>{alertCount}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-title">Available schemes</span>
          <strong>{schemeCount}</strong>
        </div>
      </div>

      <div className="location-selector card-panel">
        <div className="panel-header">
          <h2>Select Your Location</h2>
          <p className="panel-note">
            Search the live region database or use your current coordinates for instant analysis.
          </p>
        </div>

        <div className="selector-row">
          <input
            type="text"
            className="location-dropdown"
            placeholder="Search for a location..."
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              setSelectedCity('');
              setCurrentData(null);
              setAnalyzed(false);
              setGeolocationError('');
            }}
          />
          <button
            type="button"
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={!locationQuery.trim()}
          >
            Analyze
          </button>
        </div>

        <div className="geo-row">
          <button
            type="button"
            className="geo-btn"
            onClick={handleUseMyLocation}
            disabled={geolocationLoading}
          >
            {geolocationLoading ? 'Detecting location…' : 'Use my current location'}
          </button>
          {locationCoords && (
            <p className="location-coordinates">
              Detected coordinates: {locationCoords.latitude.toFixed(3)}, {locationCoords.longitude.toFixed(3)}
            </p>
          )}
        </div>

        {geolocationError && <p className="location-error">{geolocationError}</p>}
        {!geolocationError && geolocationStatus && (
          <p className="location-status">{geolocationStatus}</p>
        )}

        <div className="location-suggestions">
          {locationQuery.trim() && filteredRegions.length === 0 ? (
            <p className="location-error">No matching location found for “{locationQuery}”.</p>
          ) : (
            filteredRegions.slice(0, 8).map((region) => {
              const label = getRegionLabel(region);
              return (
                <button
                  key={region.id}
                  type="button"
                  className={`location-chip ${selectedCity === label ? 'selected' : ''}`}
                  onClick={() => handleSelectLocation(label)}
                >
                  {label}
                </button>
              );
            })
          )}
        </div>
      </div>

      {analyzed && currentData && (
        <div className="result-panel card-panel">
          <div className="panel-header">
            <h2>Climate profile for {getRegionLabel(currentData)}</h2>
            <p className="panel-note">
              Review vulnerability, contribution and gap metrics to understand how your region is performing.
            </p>
          </div>

          <div className="risk-card">
            <div className={`risk-level-badge ${riskStatus?.level?.toLowerCase() || ''}`}>
              {riskStatus?.level || 'N/A'}
            </div>
            <div className="risk-details">
              <p>
                <strong>Vulnerability Score:</strong> {vulnerabilityScore}
              </p>
              <p>
                <strong>Contribution Score:</strong> {contributionScore}
              </p>
              <p>
                <strong>Gap Score:</strong> {gapScore}
              </p>
              <p>
                <strong>Fairness:</strong> {unfairnessLabel}
              </p>
              <p>
                <strong>Air quality index:</strong> {currentData.aqi}
              </p>
              <p>
                <strong>Temperature:</strong> {currentData.temperature}°C
              </p>
            </div>
          </div>

          <div className="risk-alert">
            Based on the selected city, this analysis highlights how local climate stress compares with the region’s impact.
          </div>
        </div>
      )}
    </section>
  );
};

export default CitizenDashboard;
