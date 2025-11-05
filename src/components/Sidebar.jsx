import { Home, FileText, Shield, Activity, LogOut, Users, Grid, Building2 } from 'lucide-react';

const ROLE_NAV = {
  patient: [
    { key: '/patient/dashboard', label: 'Dashboard', icon: Home },
    { key: '/patient/records', label: 'My Records', icon: FileText },
    { key: '/patient/permissions', label: 'Permissions', icon: Shield },
    { key: '/patient/activity', label: 'Activity Log', icon: Activity },
    { key: '/patient/providers', label: 'Providers', icon: Building2 },
  ],
  doctor: [
    { key: '/doctor/patients', label: 'My Patients', icon: Users },
  ],
  admin: [
    { key: '/admin/overview', label: 'Overview', icon: Grid },
    { key: '/admin/manage-users', label: 'Manage Users', icon: Users },
    { key: '/admin/manage-providers', label: 'Manage Providers', icon: Building2 },
  ],
};

export default function Sidebar({ role = 'patient', active, onNavigate, onLogout }) {
  const items = ROLE_NAV[role] || ROLE_NAV.patient;
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="grid h-9 w-9 place-content-center rounded-lg bg-blue-600 text-white"><span className="text-sm font-bold">IL</span></div>
        <div className="text-base font-semibold tracking-tight text-slate-900">IoMT‑Ledger</div>
      </div>
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active === key ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            aria-current={active === key}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
