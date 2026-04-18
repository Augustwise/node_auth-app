import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, setAccessToken, type ApiError } from './api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string[] {
  if (!EMAIL_REGEX.test(email)) {
    return ['Invalid email address'];
  }

  return [];
}

function validatePassword(password: string): string[] {
  if (password.length === 0) {
    return ['Password is required'];
  }

  return [];
}

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const emailErrors = validateEmail(email);
  const passwordErrors = validatePassword(password);
  const hasClientErrors = emailErrors.length > 0 || passwordErrors.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerMessage(null);

    if (hasClientErrors) {
      return;
    }

    setSubmitting(true);

    try {
      const { accessToken } = await login({ email, password });
      setAccessToken(accessToken);
      navigate('/account', { replace: true });
    } catch (err) {
      const apiError = err as ApiError;
      setServerMessage(apiError?.message ?? 'Could not log you in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 320,
        width: '100%',
        margin: '60px auto',
        padding: '0 16px',
      }}
    >
      <h2 style={{ margin: 0 }}>Log in</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ padding: 8, fontSize: 14, borderColor: submitted && emailErrors.length > 0 ? '#c00' : undefined }}
      />

      {submitted && emailErrors.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
          {emailErrors.map(error => <li key={error}>{error}</li>)}
        </ul>
      )}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ padding: 8, fontSize: 14, borderColor: submitted && passwordErrors.length > 0 ? '#c00' : undefined }}
      />

      {submitted && passwordErrors.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
          {passwordErrors.map(error => <li key={error}>{error}</li>)}
        </ul>
      )}

      {serverMessage && (
        <p style={{ color: '#c00', margin: 0, fontSize: 13 }}>{serverMessage}</p>
      )}

      <button type="submit" disabled={submitting} style={{ padding: 8, cursor: 'pointer' }}>
        {submitting ? 'Logging in...' : 'Log in'}
      </button>

      <p style={{ margin: 0, fontSize: 14 }}>
        No account yet? <Link to="/register">Create one</Link>
      </p>
    </form>
  );
}
