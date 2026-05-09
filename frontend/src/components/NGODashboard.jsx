import { useState, useEffect } from 'react';
import { getWithFallback, postWithFallback } from '../utils/apiClient';
import './NGODashboard.css';

const NGODashboard = ({ userType, onLogout }) => {

const [supportEntries, setSupportEntries] = useState([]);
const [alerts, setAlerts] = useState([]);
const [regionNotes, setRegionNotes] = useState([]);

const [supportForm, setSupportForm] = useState({ category: '', description: '', region: '' });
const [alertText, setAlertText] = useState('');
const [noteForm, setNoteForm] = useState({ region: '', note: '' });

// 🔥 FETCH DATA FROM BACKEND
useEffect(() => {
getWithFallback('support')
.then(res => setSupportEntries(res.data));

getWithFallback('alerts')
  .then(res => setAlerts(res.data));

getWithFallback('notes')
  .then(res => setRegionNotes(res.data));


}, []);

// 🔥 ADD SUPPORT
const handleSupportSubmit = async (e) => {
e.preventDefault();


if (!supportForm.category || !supportForm.description || !supportForm.region) return;

try {
  const res = await postWithFallback('support', supportForm);
  setSupportEntries(prev => [...prev, res.data]);
  setSupportForm({ category: '', description: '', region: '' });
} catch (err) {
  console.log(err);
}


};

// 🔥 ADD ALERT
const handleAlertSubmit = async (e) => {
e.preventDefault();

if (!alertText) return;

try {
  const res = await postWithFallback('alerts', {
    message: alertText
  });
  setAlerts(prev => [...prev, res.data]);
  setAlertText('');
} catch (err) {
  console.log(err);
}


};

// 🔥 ADD NOTE
const handleNoteSubmit = async (e) => {
e.preventDefault();

if (!noteForm.region || !noteForm.note) return;

try {
  const res = await postWithFallback('notes', noteForm);
  setRegionNotes(prev => [...prev, res.data]);  setNoteForm({ region: '', note: '' });
} catch (err) {
  console.log(err);
}


};

return ( <section className="ngo-dashboard">

  <header className="ngo-header">
    <h1>NGO Dashboard</h1>
    <button onClick={onLogout}>Logout</button>
  </header>

  <div className="ngo-grid">

    {/* SUPPORT */}
    <div>
      <h2>Support</h2>

      <form onSubmit={handleSupportSubmit}>
        <input placeholder="Type" value={supportForm.category}
          onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })} />

        <input placeholder="Region" value={supportForm.region}
          onChange={(e) => setSupportForm({ ...supportForm, region: e.target.value })} />

        <textarea placeholder="Description"
          value={supportForm.description}
          onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })} />

        <button>Add</button>
      </form>

      {supportEntries.map((entry, i) => (
        <div key={i}>
          <h4>{entry.category}</h4>
          <p>{entry.description}</p>
          <small>{entry.region}</small>
        </div>
      ))}

    </div>

    {/* NOTES */}
    <div>
      <h2>Notes</h2>

      <form onSubmit={handleNoteSubmit}>
        <input placeholder="Region"
          value={noteForm.region}
          onChange={(e) => setNoteForm({ ...noteForm, region: e.target.value })} />

        <textarea placeholder="Note"
          value={noteForm.note}
          onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })} />

        <button>Add</button>
      </form>

      {regionNotes.map((n, i) => (
        <div key={i}>
          <h4>{n.region}</h4>
          <p>{n.note}</p>
        </div>
      ))}

    </div>

  </div>

  {/* ALERTS */}
  <div>
    <h2>Alerts</h2>

    <form onSubmit={handleAlertSubmit}>
      <input value={alertText}
        onChange={(e) => setAlertText(e.target.value)}
        placeholder="Alert message" />

      <button>Publish</button>
    </form>

    {alerts.map((a, i) => (
      <div key={i}>
        <p>{a.message}</p>
      </div>
    ))}

  </div>

</section>


);
};

export default NGODashboard;
