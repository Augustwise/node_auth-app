import { LoginForm } from '../LoginForm';
import { useGuestOnly } from '../useGuestOnly';

export function LoginPage() {
  const isCheckingAuth = useGuestOnly();

  if (isCheckingAuth) {
    return null;
  }

  return <LoginForm />;
}
