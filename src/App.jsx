import { useState } from 'react';
import LoginScreen from './components/LoginScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import PatientDashboard from './components/PatientDashboard.jsx';
import BrandFooter from './components/BrandFooter.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState('dashboard');

  const handleSignIn = (u) => {
    setUser({ name: u.name || 'Patient', role: 'patient' });
  };

  const handleLogout = () => {
    setUser(null);
    setRoute('dashboard');
  };

  if (!user) {
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar active={route} onNavigate={setRoute} onLogout={handleLogout} />
        <main className="min-h-screen flex-1">
          {route === 'dashboard' && <PatientDashboard name={user.name} />}
          {route !== 'dashboard' && (
            <div className="px-6 py-10">
              <h1 className="text-2xl font-semibold tracking-tight">{labelForRoute(route)}</h1>
              <p className="mt-2 text-slate-500">This section will be available in the next iteration.</p>
            </div>
          )}
          <BrandFooter />
        </main>
      </div>
    </div>
  );
}

function labelForRoute(route) {
  switch (route) {
    case 'records':
      return 'My Health Records';
    case 'permissions':
      return 'Manage Permissions';
    case 'activity':
      return 'Activity Log';
    default:
      return 'Dashboard';
  }
}
