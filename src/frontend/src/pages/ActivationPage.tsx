import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAccessToken } from '../api';

export function ActivationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('accessToken');

    if (token) {
      setAccessToken(token);
    }

    const timer = setTimeout(() => {
      navigate('/account', { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
      <h2>Email verified</h2>
      <p>You have successfully verified your email address. Redirecting to your account page...</p>
    </div>
  );
}
