import './App.css';
import { useState, useEffect } from 'react';
import { getWithFallback } from './utils/apiClient';
import Dashboard from './components/Dashboard';
import CitizenDashboard from './components/CitizenDashboard';
import GovtDashboard from './components/GovtDashboard';
import NGODashboard from './components/NGODashboard';
import UserTypeSelection from './components/UserTypeSelection';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [view, setView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserType, setLoggedInUserType] = useState('');
  const [userType, setUserType] = useState('');
  const [mode, setMode] = useState('login');

  const openLogin = () => {
    setView('auth');
    setUserType('');
    setMode('login');
  };

  const openRegister = () => {
    setView('auth');
    setUserType('');
    setMode('register');
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setView('auth');
  };

  const handleLoginSuccess = (type) => {
    setIsLoggedIn(true);
    setLoggedInUserType(type);
    setView('main');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUserType('');
    setView('dashboard');
    setUserType('');
    setMode('login');
  };

  const handleBackToSelection = () => {
    setUserType('');
    setMode('login');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setUserType('');
    setMode('login');
  };

  return (
    <div className="app-shell">
      {isLoggedIn && view === 'main' ? (
        loggedInUserType === 'Citizen' ? (
          <CitizenDashboard
            userType={loggedInUserType}
            onLogout={handleLogout}
          />
        ) : loggedInUserType === 'Government' ? (
          <GovtDashboard
            userType={loggedInUserType}
            onLogout={handleLogout}
          />
        ) : (
          <NGODashboard
            userType={loggedInUserType}
            onLogout={handleLogout}
          />
        )
      ) : view === 'dashboard' ? (
        <Dashboard onOpenLogin={openLogin} onOpenRegister={openRegister} />
      ) : (
        <div className="auth-layout">
          <header className="auth-header">
            <div className="brand-wrap">
              <span className="brand-name">Equi</span>
              <span className="brand-strong">Climate</span>
            </div>
            <div className="auth-header-actions">
              <p>Secure access for citizens and decision-makers on EquiClimate.</p>
              <button type="button" className="back-action" onClick={handleBackToDashboard}>
                Back to dashboard
              </button>
            </div>
          </header>

          <div className="auth-card">
            {!userType ? (
              <UserTypeSelection onSelect={handleUserTypeSelect} />
            ) : mode === 'login' ? (
              <LoginForm userType={userType} onSwitchMode={() => setMode('register')} onBack={handleBackToSelection} onSuccess={(role) => handleLoginSuccess(role || userType)} />
            ) : (
              <RegisterForm userType={userType} onSwitchMode={() => setMode('login')} onBack={handleBackToSelection} onSuccess={(role) => handleLoginSuccess(role || userType)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;