import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import PagesRouter from './components/PagesRouter.jsx';
import BrandFooter from './components/BrandFooter.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState('/');

  const handleSignIn = (u) => {
    const role = u.role || 'patient';
    setUser({ name: u.name || 'User', role });
    if (role === 'patient') setRoute('/patient/dashboard');
    if (role === 'doctor') setRoute('/doctor/patients');
    if (role === 'admin') setRoute('/admin/overview');
  };

  const handleLogout = () => {
    setUser(null);
    setRoute('/');
  };

  useEffect(() => {
    // Simple keyboard nav for demo: alt+left to go "back" to dashboard-like route
    const onKey = (e) => {
      if (e.altKey && e.key === 'ArrowLeft' && user) {
        const role = user.role;
        setRoute(role === 'patient' ? '/patient/dashboard' : role === 'doctor' ? '/doctor/patients' : '/admin/overview');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [user]);

  if (!user) {
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar role={user.role} active={route} onNavigate={setRoute} onLogout={handleLogout} />
        <main className="min-h-screen flex-1">
          <PagesRouter route={route} setRoute={setRoute} user={user} />
          <BrandFooter />
        </main>
      </div>
    </div>
  );
}
