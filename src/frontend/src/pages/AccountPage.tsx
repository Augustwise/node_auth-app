import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAccessToken, fetchMe, getAccessToken } from '../api';

type User = { id: number; name: string; email: string };

export function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <button className="app-button" type="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
