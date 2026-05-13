import React, { useState, useEffect } from 'react';
import config from '../config';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AnalyticsDashboard.css';

const API_BASE_URL = config.API_BASE_URL;

const AnalyticsDashboard = ({ onBack }) => {
  const [regions, setRegions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [riskChartData, setRiskChartData] = useState(null);
  const [pollutionChartData, setPollutionChartData] = useState(null);
  const [temperatureChartData, setTemperatureChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [regionsRes, statsRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/regions`),
        fetch(`${API_BASE_URL}/api/analytics/statistics`),
        fetch(`${API_BASE_URL}/api/analytics/alerts`)
      ]);

      const regionsData = await regionsRes.json();
      const statsData = await statsRes.json();
      const alertsData = await alertsRes.json();

      setRegions(regionsData.data || []);
      setStatistics(statsData.data || null);
      setAlerts(alertsData.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };

  const fetchChartData = async (chartType) => {
    try {
      setChartLoading(true);
      setChartError('');
      const response = await fetch(`${API_BASE_URL}/api/analytics/charts/${chartType}`);
      const data = await response.json();
      const chart = data.data || [];
      if (chartType === 'risk-distribution') setRiskChartData(chart);
      if (chartType === 'pollution') setPollutionChartData(chart);
      if (chartType === 'temperature') setTemperatureChartData(chart);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartError('Unable to load analytics chart data.');
    } finally {
      setChartLoading(false);
    }
  };

  const fetchOverviewCharts = async () => {
    try {
      setChartLoading(true);
      setChartError('');

      const chartRequests = [
        fetch(`${API_BASE_URL}/api/analytics/charts/risk-distribution`),
        fetch(`${API_BASE_URL}/api/analytics/charts/pollution`),
        fetch(`${API_BASE_URL}/api/analytics/charts/temperature`),
      ];

      const [riskRes, pollutionRes, tempRes] = await Promise.all(chartRequests);
      const [riskData, pollutionData, temperatureData] = await Promise.all([
        riskRes.json(),
        pollutionRes.json(),
        tempRes.json(),
      ]);

      setRiskChartData(riskData.data || []);
      setPollutionChartData(pollutionData.data || []);
      setTemperatureChartData(temperatureData.data || []);
    } catch (error) {
      console.error('Error fetching overview charts:', error);
      setChartError('Unable to load analytics chart data.');
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewCharts();
    }
  }, [activeTab]);

  const fetchRegionRecommendations = async (region) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/recommendations/govt/${region}`);
      const data = await response.json();
      setRecommendations(data.data || []);
      setSelectedRegion(region);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading Analytics Dashboard...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <header className="analytics-header">
        <div>
          <h1>🌍 Climate Intelligence & Analytics</h1>
          <p>AI-Powered Climate Risk Analysis & Recommendations</p>
        </div>
        <button type="button" className="back-action" onClick={onBack}>
          Back to dashboard
        </button>
      </header>

      {/* Statistics Overview */}
      {statistics && (
        <section className="statistics-section">
          <div className="stat-card">
            <div className="stat-value">{statistics.totalRegions}</div>
            <div className="stat-label">Total Regions</div>
          </div>
          <div className="stat-card alert">
            <div className="stat-value">{statistics.criticalRegions}</div>
            <div className="stat-label">Critical Regions</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-value">{statistics.highRiskRegions}</div>
            <div className="stat-label">High Risk Regions</div>
          </div>
          <div className="stat-card info">
            <div className="stat-value">{statistics.averageRisk.toFixed(1)}</div>
            <div className="stat-label">Average Risk Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statistics.percentageAffected}%</div>
            <div className="stat-label">Population Affected</div>
          </div>
        </section>
      )}

      {/* Navigation Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📊 Overview
        </button>
        <button className={`tab ${activeTab === 'regions' ? 'active' : ''}`} onClick={() => setActiveTab('regions')}>
          🗺️ All Regions
        </button>
        <button className={`tab ${activeTab === 'heatmap' ? 'active' : ''}`} onClick={() => setActiveTab('heatmap')}>
          🔥 Heatmap
        </button>
        <button className={`tab ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
          ⚠️ Alerts ({alerts.length})
        </button>
      </div>

      {/* Content Sections */}
      {activeTab === 'overview' && (
        <section className="overview-section">
          <div className="chart-container">
            <h3>Risk Distribution</h3>
            {chartLoading && !riskChartData ? (
              <p>Loading chart...</p>
            ) : riskChartData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={riskChartData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {riskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <button onClick={() => fetchChartData('risk-distribution')}>Load Chart</button>
            )}
          </div>

          <div className="chart-container">
            <h3>Top Polluted Regions</h3>
            {chartLoading && !pollutionChartData ? (
              <p>Loading chart...</p>
            ) : pollutionChartData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pollutionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pollution" fill="#ff6b6b" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <button onClick={() => fetchChartData('pollution')}>Load Chart</button>
            )}
          </div>

          <div className="chart-container">
            <h3>Temperature Rise Trend</h3>
            {chartLoading && !temperatureChartData ? (
              <p>Loading chart...</p>
            ) : temperatureChartData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={temperatureChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tempRise" fill="#ff4757" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <button onClick={() => fetchChartData('temperature')}>Load Chart</button>
            )}
          </div>
          {chartError && <p className="chart-error">{chartError}</p>}
        </section>
      )}

      {activeTab === 'regions' && (
        <section className="regions-section">
          <h3>All Regions Climate Data</h3>
          <div className="regions-grid">
            {regions.map((region, index) => (
              <div key={index} className="region-card" style={{ borderLeftColor: region.color }}>
                <h4>{region.region}</h4>
                <div className="risk-badge" style={{ backgroundColor: region.color }}>
                  {region.status} - {region.riskScore.toFixed(1)}%
                </div>
                <div className="region-metrics">
                  <div className="metric">
                    <span className="metric-label">Pollution:</span>
                    <span className="metric-value">{region.pollution}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Flood Risk:</span>
                    <span className="metric-value">{region.floodRisk}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Poverty:</span>
                    <span className="metric-value">{region.poverty}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Temp Rise:</span>
                    <span className="metric-value">{region.tempRise}°C</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Equity Score:</span>
                    <span className="metric-value">{region.equityScore.toFixed(1)}</span>
                  </div>
                </div>
                <button onClick={() => fetchRegionRecommendations(region.region)} className="btn-recommendations">
                  View Recommendations
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'heatmap' && (
        <section className="heatmap-section">
          <h3>Climate Risk Heatmap</h3>
          <div className="heatmap-container">
            {regions.map((region, index) => (
              <div
                key={index}
                className="heatmap-cell"
                style={{ backgroundColor: region.color }}
                title={`${region.region}: ${region.riskScore.toFixed(1)}% - ${region.status}`}
              >
                <span className="heatmap-region">{region.region}</span>
                <span className="heatmap-score">{region.riskScore.toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="heatmap-legend">
            <div><span className="legend-color" style={{ backgroundColor: '#d32f2f' }}></span> Critical (75+)</div>
            <div><span className="legend-color" style={{ backgroundColor: '#f57c00' }}></span> High (50-75)</div>
            <div><span className="legend-color" style={{ backgroundColor: '#fbc02d' }}></span> Medium (25-50)</div>
            <div><span className="legend-color" style={{ backgroundColor: '#388e3c' }}></span> Low (0-25)</div>
          </div>
        </section>
      )}

      {activeTab === 'alerts' && (
        <section className="alerts-section">
          <h3>⚠️ Climate Alerts</h3>
          {alerts.length === 0 ? (
            <p>No critical alerts at this time.</p>
          ) : (
            <div className="alerts-list">
              {alerts.map((alert, index) => (
                <div key={index} className={`alert-item alert-${alert.priority.toLowerCase()}`}>
                  <div className="alert-header">
                    <span className="alert-region">{alert.region}</span>
                    <span className="alert-priority">{alert.priority}</span>
                  </div>
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-score">Risk Score: {alert.riskScore.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recommendations Panel */}
      {selectedRegion && recommendations.length > 0 && (
        <section className="recommendations-panel">
          <h3>Recommendations for {selectedRegion}</h3>
          <ul className="recommendations-list">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
