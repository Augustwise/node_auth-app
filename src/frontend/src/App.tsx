import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ActivationPage } from './pages/ActivationPage';
import { AccountPage } from './pages/AccountPage';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/activation" element={<ActivationPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
