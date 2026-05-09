import { useState } from 'react';
import { postWithFallback } from '../utils/apiClient';
import './AuthForm.css';

const LoginForm = ({ userType, onSwitchMode, onBack, onSuccess }) => {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const handleSubmit = async (event) => {
event.preventDefault();


const validation = {};

if (!email.trim()) {
  validation.email = 'Email is required.';
}

if (!password) {
  validation.password = 'Password is required.';
}

setErrors(validation);

if (Object.keys(validation).length > 0) return;

try {
    setLoading(true);

    const response = await postWithFallback('login', {
      email,
      password,
      role: userType
    });

    console.log("Login Success:", response.data);
  const responseRole = response.data.role || response.data.user?.role || userType;

  if (typeof onSuccess === 'function') {
    onSuccess(responseRole);
  }

} catch (error) {
  console.error(error);

  const errorMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (error?.response?.status === 404 ? 'User does not exist.' : null) ||
    (error?.response?.status === 401 ? 'Invalid email or password.' : null) ||
    error?.message ||
    'Login failed. Please try again.';

  setErrors({
    general: errorMessage
  });

} finally {
  setLoading(false);
}


};

return ( <div className="form-shell">


  <div className="form-heading">
    <div>
      <p className="eyebrow">Sign in</p>
      <h2>{userType}</h2>
    </div>
    <button type="button" className="text-link" onClick={typeof onBack === 'function' ? onBack : undefined}>
      Change role
    </button>
  </div>

  <form onSubmit={handleSubmit} noValidate>

    {/* GENERAL ERROR */}
    {errors.general && (
      <p className="field-error">{errors.general}</p>
    )}

    <div className="form-group">
      <label>Email address</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      {errors.email && <p className="field-error">{errors.email}</p>}
    </div>

    <div className="form-group">
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      {errors.password && <p className="field-error">{errors.password}</p>}
    </div>

    <button type="submit" className="primary-button" disabled={loading}>
      {loading ? "Logging in..." : "Continue"}
    </button>

  </form>

  <div className="form-footer">
    <p>New to EquiClimate?</p>
    <button type="button" className="secondary-button" onClick={typeof onSwitchMode === 'function' ? onSwitchMode : undefined}>
      Create an account
    </button>
  </div>

</div>


);
};

export default LoginForm;
