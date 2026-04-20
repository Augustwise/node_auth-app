import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  changeEmail,
  changeName,
  changePassword,
  clearAccessToken,
  fetchMe,
  getAccessToken,
  type ApiError,
} from '../api';

type User = { id: number; name: string; email: string };

function validateOldPassword(password: string): string[] {
  if (password.length === 0) {
    return ['Old password is required'];
  }

  return [];
}

function validateCurrentPassword(password: string): string[] {
  if (password.length === 0) {
    return ['Password is required'];
  }

  return [];
}

function validateNewPassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('At least 12 characters');
  }

  if ((password.match(/\d/g) ?? []).length < 2) {
    errors.push('At least 2 numbers');
  }

  return errors;
}

function validateNewName(name: string): string[] {
  if (name.trim().length === 0) {
    return ['Name is required'];
  }

  return [];
}

function validateNewEmail(email: string): string[] {
  const trimmedEmail = email.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return ['Invalid email address'];
  }

  return [];
}

function validatePasswordConfirmation(
  newPassword: string,
  confirmPassword: string,
): string[] {
  if (confirmPassword.length === 0) {
    return ['Please confirm the new password'];
  }

  if (newPassword !== confirmPassword) {
    return ['Passwords do not match'];
  }

  return [];
}

function validateEmailConfirmation(
  newEmail: string,
  confirmEmail: string,
): string[] {
  if (confirmEmail.trim().length === 0) {
    return ['Please confirm the new email'];
  }

  if (newEmail.trim() !== confirmEmail.trim()) {
    return ['Email addresses do not match'];
  }

  return [];
}

export function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChangeName, setShowChangeName] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [nameSubmitting, setNameSubmitting] = useState(false);
  const [nameServerErrors, setNameServerErrors] = useState<Record<string, string>>({});
  const [nameServerMessage, setNameServerMessage] = useState<string | null>(null);
  const [emailPassword, setEmailPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailServerErrors, setEmailServerErrors] = useState<Record<string, string>>({});
  const [emailServerMessage, setEmailServerMessage] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      navigate('/login', { replace: true });
      return;
    }

    fetchMe()
      .then(setUser)
      .catch(() => setError('Could not load your account.'));
  }, [navigate]);

  function handleLogout() {
    clearAccessToken();
    navigate('/login', { replace: true });
  }

  function resetChangeNameForm() {
    setNewName('');
    setNameSubmitted(false);
    setNameSubmitting(false);
    setNameServerErrors({});
    setNameServerMessage(null);
  }

  function handleShowChangeName() {
    setShowChangeName(true);
    setShowChangeEmail(false);
    setShowChangePassword(false);
    setSuccessMessage(null);
    resetChangeNameForm();
    resetChangeEmailForm();
    resetChangePasswordForm();
  }

  function handleCancelChangeName() {
    setShowChangeName(false);
    resetChangeNameForm();
  }

  const newNameErrors = [
    ...validateNewName(newName),
    ...(nameServerErrors.newName ? [nameServerErrors.newName] : []),
  ];
  const hasNameClientErrors = validateNewName(newName).length > 0;

  async function handleChangeNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameSubmitted(true);
    setNameServerErrors({});
    setNameServerMessage(null);
    setSuccessMessage(null);

    if (hasNameClientErrors) {
      return;
    }

    setNameSubmitting(true);

    try {
      const { message } = await changeName({ newName });
      setUser(prev => prev ? { ...prev, name: newName.trim() } : prev);
      setSuccessMessage(message);
      setShowChangeName(false);
      resetChangeNameForm();
    } catch (err) {
      const apiError = err as ApiError;
      setNameServerErrors(apiError?.errors ?? {});
      setNameServerMessage(apiError?.message ?? 'Could not change your name.');
    } finally {
      setNameSubmitting(false);
    }
  }

  function resetChangeEmailForm() {
    setEmailPassword('');
    setNewEmail('');
    setConfirmNewEmail('');
    setEmailSubmitted(false);
    setEmailSubmitting(false);
    setEmailServerErrors({});
    setEmailServerMessage(null);
  }

  function handleShowChangeEmail() {
    setShowChangeEmail(true);
    setShowChangeName(false);
    setShowChangePassword(false);
    setSuccessMessage(null);
    resetChangeNameForm();
    resetChangeEmailForm();
    resetChangePasswordForm();
  }

  function handleCancelChangeEmail() {
    setShowChangeEmail(false);
    resetChangeEmailForm();
  }

  const emailPasswordErrors = [
    ...validateCurrentPassword(emailPassword),
    ...(emailServerErrors.password ? [emailServerErrors.password] : []),
  ];
  const newEmailErrors = [
    ...validateNewEmail(newEmail),
    ...(emailServerErrors.newEmail ? [emailServerErrors.newEmail] : []),
  ];
  const confirmNewEmailErrors = [
    ...validateEmailConfirmation(newEmail, confirmNewEmail),
  ];
  const hasEmailClientErrors =
    validateCurrentPassword(emailPassword).length > 0 ||
    validateNewEmail(newEmail).length > 0 ||
    validateEmailConfirmation(newEmail, confirmNewEmail).length > 0;

  async function handleChangeEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailSubmitted(true);
    setEmailServerErrors({});
    setEmailServerMessage(null);
    setSuccessMessage(null);

    if (hasEmailClientErrors) {
      return;
    }

    setEmailSubmitting(true);

    try {
      const { message } = await changeEmail({
        password: emailPassword,
        newEmail: newEmail.trim(),
      });

      setSuccessMessage(message);
      setShowChangeEmail(false);
      resetChangeEmailForm();
    } catch (err) {
      const apiError = err as ApiError;
      setEmailServerErrors(apiError?.errors ?? {});
      setEmailServerMessage(apiError?.message ?? 'Could not change your email.');
    } finally {
      setEmailSubmitting(false);
    }
  }

  function resetChangePasswordForm() {
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setSubmitted(false);
    setSubmitting(false);
    setServerErrors({});
    setServerMessage(null);
  }

  function handleShowChangePassword() {
    setShowChangePassword(true);
    setShowChangeName(false);
    setShowChangeEmail(false);
    setSuccessMessage(null);
    resetChangeNameForm();
    resetChangeEmailForm();
    resetChangePasswordForm();
  }

  function handleCancelChangePassword() {
    setShowChangePassword(false);
    resetChangePasswordForm();
  }

  const oldPasswordErrors = [
    ...validateOldPassword(oldPassword),
    ...(serverErrors.oldPassword ? [serverErrors.oldPassword] : []),
  ];
  const newPasswordErrors = [
    ...validateNewPassword(newPassword),
    ...(serverErrors.newPassword ? [serverErrors.newPassword] : []),
  ];
  const confirmNewPasswordErrors = [
    ...validatePasswordConfirmation(newPassword, confirmNewPassword),
  ];
  const hasClientErrors =
    validateOldPassword(oldPassword).length > 0 ||
    validateNewPassword(newPassword).length > 0 ||
    validatePasswordConfirmation(newPassword, confirmNewPassword).length > 0;

  async function handleChangePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerErrors({});
    setServerMessage(null);
    setSuccessMessage(null);

    if (hasClientErrors) {
      return;
    }

    setSubmitting(true);

    try {
      const { message } = await changePassword({ oldPassword, newPassword });
      setSuccessMessage(message);
      setShowChangePassword(false);
      resetChangePasswordForm();
    } catch (err) {
      const apiError = err as ApiError;
      setServerErrors(apiError?.errors ?? {});
      setServerMessage(apiError?.message ?? 'Could not change your password.');
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 16px' }}>
        <p style={{ color: '#c00' }}>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 16px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 16px' }}>
      <h2>Your account</h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: 16,
        }}
      >
        <tbody>
          <tr>
            <th
              scope="row"
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                border: '1px solid #333',
                width: '35%',
              }}
            >
              Name
            </th>
            <td style={{ padding: '10px 12px', border: '1px solid #333' }}>{user.name}</td>
          </tr>
          <tr>
            <th
              scope="row"
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                border: '1px solid #333',
              }}
            >
              Email
            </th>
            <td style={{ padding: '10px 12px', border: '1px solid #333' }}>{user.email}</td>
          </tr>
        </tbody>
      </table>
      {successMessage && (
        <p style={{ color: '#0a6b2d', margin: '0 0 16px' }}>{successMessage}</p>
      )}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="app-button" type="button" onClick={handleShowChangeName}>
          Change Name
        </button>
        <button className="app-button" type="button" onClick={handleShowChangeEmail}>
          Change Email
        </button>
        <button className="app-button" type="button" onClick={handleShowChangePassword}>
          Change Password
        </button>
        <button className="app-button app-button--danger" type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {showChangeName && (
        <form
          onSubmit={handleChangeNameSubmit}
          noValidate
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginTop: 20,
            padding: 16,
            border: '1px solid #d7d7d7',
            borderRadius: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>Change name</h3>

          <input
            type="text"
            placeholder="New name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
            style={{ padding: 8, fontSize: 14, borderColor: nameSubmitted && newNameErrors.length > 0 ? '#c00' : undefined }}
          />

          {nameSubmitted && newNameErrors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
              {newNameErrors.map(nameError => <li key={nameError}>{nameError}</li>)}
            </ul>
          )}

          {nameServerMessage && Object.keys(nameServerErrors).length === 0 && (
            <p style={{ color: '#c00', margin: 0, fontSize: 13 }}>{nameServerMessage}</p>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="app-button" type="submit" disabled={nameSubmitting}>
              {nameSubmitting ? 'Saving...' : 'Save new name'}
            </button>
            <button className="app-button" type="button" onClick={handleCancelChangeName} disabled={nameSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {showChangeEmail && (
        <form
          onSubmit={handleChangeEmailSubmit}
          noValidate
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginTop: 20,
            padding: 16,
            border: '1px solid #d7d7d7',
            borderRadius: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>Change email</h3>

          <input
            type="password"
            placeholder="Current password"
            value={emailPassword}
            onChange={e => setEmailPassword(e.target.value)}
            required
            style={{ padding: 8, fontSize: 14, borderColor: emailSubmitted && emailPasswordErrors.length > 0 ? '#c00' : undefined }}
          />

          {emailSubmitted && emailPasswordErrors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
              {emailPasswordErrors.map(passwordError => <li key={passwordError}>{passwordError}</li>)}
            </ul>
          )}

          <input
            type="email"
            placeholder="New email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            required
            style={{ padding: 8, fontSize: 14, borderColor: emailSubmitted && newEmailErrors.length > 0 ? '#c00' : undefined }}
          />

          {emailSubmitted && newEmailErrors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
              {newEmailErrors.map(emailError => <li key={emailError}>{emailError}</li>)}
            </ul>
          )}

          <input
            type="email"
            placeholder="Confirm new email"
            value={confirmNewEmail}
            onChange={e => setConfirmNewEmail(e.target.value)}
            required
            style={{ padding: 8, fontSize: 14, borderColor: emailSubmitted && confirmNewEmailErrors.length > 0 ? '#c00' : undefined }}
          />

          {emailSubmitted && confirmNewEmailErrors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
              {confirmNewEmailErrors.map(emailError => <li key={emailError}>{emailError}</li>)}
            </ul>
          )}

          {emailServerMessage && Object.keys(emailServerErrors).length === 0 && (
            <p style={{ color: '#c00', margin: 0, fontSize: 13 }}>{emailServerMessage}</p>
          )}

          <p style={{ margin: 0, fontSize: 13, color: '#555' }}>
            We&apos;ll send a confirmation link to the new address and notify your current email after the change.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="app-button" type="submit" disabled={emailSubmitting}>
              {emailSubmitting ? 'Sending confirmation...' : 'Send confirmation link'}
            </button>
            <button className="app-button" type="button" onClick={handleCancelChangeEmail} disabled={emailSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {showChangePassword && (
        <form
          onSubmit={handleChangePasswordSubmit}
          noValidate
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginTop: 20,
            padding: 16,
            border: '1px solid #d7d7d7',
            borderRadius: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>Change password</h3>

          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            required
            style={{ padding: 8, fontSize: 14, borderColor: submitted && oldPasswordErrors.length > 0 ? '#c00' : undefined }}
          />

          {submitted && oldPasswordErrors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
              {oldPasswordErrors.map(passwordError => <li key={passwordError}>{passwordError}</li>)}
            </ul>
          )}

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            style={{ padding: 8, fontSize: 14, borderColor: submitted && newPasswordErrors.length > 0 ? '#c00' : undefined }}
          />

          {submitted && newPasswordErrors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
              {newPasswordErrors.map(passwordError => <li key={passwordError}>{passwordError}</li>)}
            </ul>
          )}

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            required
            style={{ padding: 8, fontSize: 14, borderColor: submitted && confirmNewPasswordErrors.length > 0 ? '#c00' : undefined }}
          />

          {submitted && confirmNewPasswordErrors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#c00', fontSize: 13 }}>
              {confirmNewPasswordErrors.map(passwordError => <li key={passwordError}>{passwordError}</li>)}
            </ul>
          )}

          {serverMessage && Object.keys(serverErrors).length === 0 && (
            <p style={{ color: '#c00', margin: 0, fontSize: 13 }}>{serverMessage}</p>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="app-button" type="submit" disabled={submitting}>
              {submitting ? 'Changing password...' : 'Save new password'}
            </button>
            <button className="app-button" type="button" onClick={handleCancelChangePassword} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
