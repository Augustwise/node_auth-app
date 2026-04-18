import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(name: string): string[] {
  if (name.trim().length === 0) {
    return ['Name is required'];
  }

  return [];
}

function validateEmail(email: string): string[] {
  if (!EMAIL_REGEX.test(email)) {
    return ['Invalid email address'];
  }

  return [];
}

function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('At least 12 characters');
  }

  if ((password.match(/\d/g) ?? []).length < 2) {
    errors.push('At least 2 numbers');
  }

  return errors;
}

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const nameErrors = validateName(name);
  const emailErrors = validateEmail(email);
  const passwordErrors = validatePassword(password);
  const hasErrors = nameErrors.length > 0 || emailErrors.length > 0 || passwordErrors.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (!hasErrors) {
      setSuccess(true);
    }
  }

  if (success) {
    return <p style={{ color: 'green' }}>Registered successfully!</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, width: '100%', margin: '60px auto', padding: '0 16px' }}>
      <h2 style={{ margin: 0 }}>Create account</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ padding: 8, fontSize: 14, borderColor: submitted && nameErrors.length > 0 ? '#c00' : undefined }}
      />

      {submitted && nameErrors.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
          {nameErrors.map(err => <li key={err}>{err}</li>)}
        </ul>
      )}

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
          {emailErrors.map(err => <li key={err}>{err}</li>)}
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
          {passwordErrors.map(err => <li key={err}>{err}</li>)}
        </ul>
      )}

      <button type="submit" style={{ padding: 8, cursor: 'pointer' }}>Register</button>
    </form>
  );
}
