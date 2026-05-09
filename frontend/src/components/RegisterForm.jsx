import { useState } from 'react';
import { postWithFallback } from '../utils/apiClient';
import './AuthForm.css';

const RegisterForm = ({ userType, onSwitchMode, onBack, onSuccess }) => {

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const handleSubmit = async (event) => {
  event.preventDefault();

  const validation = {};

  if (!name.trim()) validation.name = 'Name is required.';
  if (!email.trim()) validation.email = 'Email is required.';
  if (!password) validation.password = 'Password is required.';
  if (!confirmPassword) validation.confirmPassword = 'Confirm your password.';
  if (password !== confirmPassword) validation.confirmPassword = 'Passwords do not match.';

  setErrors(validation);

  if (Object.keys(validation).length > 0) return;

  try {
    setLoading(true);

    const response = await postWithFallback('register', {
      name,
      email,
      password,
      role: userType
    });

    console.log("Registered:", response.data);

    const responseRole = response.data.role || response.data.user?.role || userType;

    if (typeof onSuccess === 'function') {
      onSuccess(responseRole);
    }
  } catch (error) {
    console.error(error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      (error?.response?.status === 409 ? 'User already exists.' : null) ||
      (error?.response?.status === 400 ? 'Invalid registration data.' : null) ||
      error?.message ||
      'Registration failed. Please try again.';

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
      <p className="eyebrow">Register</p>
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
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      {errors.name && <p className="field-error">{errors.name}</p>}
    </div>

    <div className="form-group">
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      {errors.email && <p className="field-error">{errors.email}</p>}
    </div>

    <div className="form-group">
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {errors.password && <p className="field-error">{errors.password}</p>}
    </div>

    <div className="form-group">
      <label>Confirm Password</label>
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
    </div>

    <div className="form-group">
      <label>User Type</label>
      <input value={userType} disabled />
    </div>

    <button type="submit" className="primary-button" disabled={loading}>
      {loading ? "Creating..." : "Create Account"}
    </button>

  </form>

  <div className="form-footer">
    <p>Already have an account?</p>
    <button type="button" className="secondary-button" onClick={typeof onSwitchMode === 'function' ? onSwitchMode : undefined}>
      Sign in
    </button>
  </div>

</div>


);
};

export default RegisterForm;
