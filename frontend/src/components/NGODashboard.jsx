import { useState, useEffect } from 'react';
import { getWithFallback, postWithFallback } from '../utils/apiClient';
import './NGODashboard.css';

const NGODashboard = ({ userType, onLogout, onViewAnalytics }) => {
  const [regions, setRegions] = useState([]);
  const [supportEntries, setSupportEntries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [regionNotes, setRegionNotes] = useState([]);
  const [supportForm, setSupportForm] = useState({ category: '', description: '', region: '' });
  const [alertText, setAlertText] = useState('');
  const [noteForm, setNoteForm] = useState({ region: '', note: '' });

  useEffect(() => {
    getWithFallback('regions')
      .then((res) => setRegions(res.data || []))
      .catch(() => setRegions([]));

    getWithFallback('support')
      .then((res) => setSupportEntries(res.data || []))
      .catch(() => setSupportEntries([]));

    getWithFallback('alerts')
      .then((res) => setAlerts(res.data || []))
      .catch(() => setAlerts([]));

    getWithFallback('notes')
      .then((res) => setRegionNotes(res.data || []))
      .catch(() => setRegionNotes([]));
  }, []);

  const regionOptions = regions.map((region) => region.city);

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportForm.category || !supportForm.description || !supportForm.region) return;

    try {
      const res = await postWithFallback('support', supportForm);
      setSupportEntries((prev) => [...prev, res.data]);
      setSupportForm({ category: '', description: '', region: '' });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAlertSubmit = async (e) => {
    e.preventDefault();
    if (!alertText.trim()) return;

    try {
      const res = await postWithFallback('alerts', { message: alertText });
      setAlerts((prev) => [...prev, res.data]);
      setAlertText('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteForm.region || !noteForm.note) return;

    try {
      const res = await postWithFallback('notes', noteForm);
      setRegionNotes((prev) => [...prev, res.data]);
      setNoteForm({ region: '', note: '' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="ngo-dashboard">
      <header className="ngo-header">
        <div>
          <p className="eyebrow">NGO Portal</p>
          <h1>NGO Dashboard</h1>
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

      <div className="ngo-grid">
        <div className="card-panel">
          <div className="panel-header">
            <h2>Support requests</h2>
            <p className="panel-note">Create or assign support services for priority regions.</p>
          </div>

          <form className="support-form" onSubmit={handleSupportSubmit}>
            <input
              placeholder="Category"
              value={supportForm.category}
              onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
            />

            {regionOptions.length > 0 ? (
              <select
                value={supportForm.region}
                onChange={(e) => setSupportForm({ ...supportForm, region: e.target.value })}
              >
                <option value="" disabled>
                  Select a region
                </option>
                {regionOptions.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            ) : (
              <input
                placeholder="Region"
                value={supportForm.region}
                onChange={(e) => setSupportForm({ ...supportForm, region: e.target.value })}
              />
            )}

            <textarea
              placeholder="Description"
              value={supportForm.description}
              onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
            />

            <button type="submit">Add support</button>
          </form>

          <div className="support-list">
            {supportEntries.map((entry, index) => (
              <div key={index} className="support-card">
                <h3>{entry.category}</h3>
                <p>{entry.description}</p>
                <small>{entry.region}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="card-panel">
          <div className="panel-header">
            <h2>Field notes</h2>
            <p className="panel-note">Capture insights and action items for each region.</p>
          </div>

          <form className="notes-form" onSubmit={handleNoteSubmit}>
            {regionOptions.length > 0 ? (
              <select
                value={noteForm.region}
                onChange={(e) => setNoteForm({ ...noteForm, region: e.target.value })}
              >
                <option value="" disabled>
                  Select a region
                </option>
                {regionOptions.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            ) : (
              <input
                placeholder="Region"
                value={noteForm.region}
                onChange={(e) => setNoteForm({ ...noteForm, region: e.target.value })}
              />
            )}

            <textarea
              placeholder="Note"
              value={noteForm.note}
              onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })}
            />

            <button type="submit">Add note</button>
          </form>

          <div className="notes-list">
            {regionNotes.map((note, index) => (
              <div key={index} className="note-card">
                <h3>{note.region}</h3>
                <p>{note.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-panel">
        <div className="panel-header">
          <h2>Alerts</h2>
          <p className="panel-note">Publish immediate messages for communities and government teams.</p>
        </div>

        <form className="alert-form" onSubmit={handleAlertSubmit}>
          <input
            value={alertText}
            onChange={(e) => setAlertText(e.target.value)}
            placeholder="Alert message"
          />
          <button type="submit">Publish alert</button>
        </form>

        <div className="alert-list">
          {alerts.map((alert, index) => (
            <div key={index} className="alert-card">
              <p>{alert.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NGODashboard;
