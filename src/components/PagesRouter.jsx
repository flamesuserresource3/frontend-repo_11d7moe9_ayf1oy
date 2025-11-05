import { useEffect, useMemo, useRef, useState } from 'react';
import { HeartPulse, Activity, Shield, X, Check, Hospital, Search } from 'lucide-react';

export default function PagesRouter({ route, setRoute, user }) {
  if (route.startsWith('/patient')) {
    if (route === '/patient/dashboard') return <PatientDashboard name={user.name} setRoute={setRoute} />;
    if (route === '/patient/records') return <PatientRecords />;
    if (route === '/patient/permissions') return <PatientPermissions />;
    if (route === '/patient/providers') return <ProvidersDirectory />;
    return <Placeholder title="Patient" route={route} />;
  }
  if (route.startsWith('/doctor')) {
    if (route === '/doctor/patients') return <DoctorPatients setRoute={setRoute} />;
    if (route.startsWith('/doctor/patient/')) {
      const pid = route.replace('/doctor/patient/', '');
      return <DoctorPatientDetail patientId={pid} />;
    }
    return <Placeholder title="Doctor" route={route} />;
  }
  if (route.startsWith('/admin')) {
    if (route === '/admin/overview') return <AdminOverview />;
    if (route === '/admin/manage-users' || route === '/admin/manage-providers') {
      return <Placeholder title="Admin" route={route} />;
    }
    return <Placeholder title="Admin" route={route} />;
  }
  return <Placeholder title="Home" route={route} />;
}

function Section({ title, children }) {
  return (
    <section className="px-6">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function StatCard({ title, value, right, onClick, pulse }) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-start justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className={`mt-2 text-3xl font-semibold text-slate-900 ${pulse ? 'animate-pulse text-green-600' : ''}`}>{value}</div>
      </div>
      {right}
    </button>
  );
}

function PatientDashboard({ name, setRoute }) {
  const [hr, setHr] = useState(78);
  const [pulse, setPulse] = useState(false);
  const [series, setSeries] = useState(() => {
    const now = Date.now();
    return Array.from({ length: 30 }, (_, i) => ({ t: now - (29 - i) * 2000, v: 70 + Math.round(Math.random() * 15) }));
  });

  useEffect(() => {
    const id = setInterval(() => {
      const next = Math.max(60, Math.min(110, Math.round(hr + (Math.random() * 10 - 5))));
      setHr(next);
      setPulse(true);
      setSeries((prev) => {
        const now = Date.now();
        const updated = [...prev.slice(-29), { t: now, v: next }];
        return updated;
      });
      const tm = setTimeout(() => setPulse(false), 400);
      return () => clearTimeout(tm);
    }, 2000);
    return () => clearInterval(id);
  }, [hr]);

  return (
    <div className="space-y-8 px-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back, {name}.</h1>
        <p className="mt-1 text-sm text-slate-500">Your live health summary.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard
          title="Live Heart Rate"
          value={`${hr} bpm`}
          pulse={pulse}
          right={<HeartPulse className={`h-6 w-6 ${pulse ? 'text-green-600' : 'text-slate-400'}`} />}
        />
        <StatCard
          title="Active Permissions"
          value="3 Providers"
          onClick={() => setRoute('/patient/permissions')}
          right={<Shield className="h-6 w-6 text-slate-400 transition group-hover:text-blue-600" />}
        />
      </div>

      <Section title="Heart Rate (Last Hour)">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
          <LineChart data={series} />
        </div>
      </Section>
    </div>
  );
}

function LineChart({ data }) {
  const width = 800;
  const height = 200;
  const padding = 24;
  const values = data.map((d) => d.v);
  const min = Math.min(...values) - 5;
  const max = Math.max(...values) + 5;
  const t0 = data[0]?.t || 0;
  const t1 = data[data.length - 1]?.t || 1;
  const points = data
    .map((d) => {
      const x = padding + ((d.t - t0) / (t1 - t0 || 1)) * (width - padding * 2);
      const y = padding + (1 - (d.v - min) / (max - min || 1)) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2.5" />
      <polygon points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`} fill="url(#grad)" />
    </svg>
  );
}

function PatientRecords() {
  const items = [
    { icon: HeartPulse, title: 'Heart Rate', value: '82 bpm', timestamp: 'Today, 10:45 AM' },
    { icon: Activity, title: 'Blood Pressure', value: '120/80 mmHg', timestamp: 'Yesterday, 9:00 AM' },
  ];
  return (
    <div className="space-y-6 px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My Health Records</h1>
      <div className="space-y-4">
        {items.map(({ icon: Icon, title, value, timestamp }, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-10 w-10 place-content-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-slate-500">{title}</div>
                <div className="text-lg font-medium text-slate-900">{value}</div>
              </div>
            </div>
            <div className="text-sm text-slate-500">{timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatientPermissions() {
  const [showGrant, setShowGrant] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(null);
  const [revoking, setRevoking] = useState(false);
  const [permissions, setPermissions] = useState([
    { id: 'p1', provider: 'Dr. Smith', data: ['Heart Rate'], expires: '2025-12-31' },
    { id: 'p2', provider: 'Dr. Lee', data: ['Blood Pressure'], expires: '2025-10-01' },
  ]);

  const revoke = (id) => {
    setRevoking(true);
    setTimeout(() => {
      setPermissions((prev) => prev.filter((p) => p.id !== id));
      setRevoking(false);
      setConfirmRevoke(null);
    }, 800);
  };

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Manage Permissions</h1>
        <button
          onClick={() => setShowGrant(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700"
        >
          + Grant Access
        </button>
      </div>

      <Section title="Active Permissions">
        <div className="space-y-3">
          {permissions.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
              <div>
                <div className="text-slate-900">{p.provider}</div>
                <div className="text-sm text-slate-500">Access: {p.data.join(', ')} · Expires on {p.expires}</div>
              </div>
              <button
                onClick={() => setConfirmRevoke(p)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      </Section>

      {showGrant && (
        <GrantAccessWizard onClose={() => setShowGrant(false)} onAdd={(entry) => setPermissions((prev) => [entry, ...prev])} />
      )}

      {confirmRevoke && (
        <Modal onClose={() => setConfirmRevoke(null)}>
          <div className="space-y-4 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Revoke access?</h3>
            <p className="text-sm text-slate-600">This will immediately remove access for {confirmRevoke.provider}.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setConfirmRevoke(null)} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button
                onClick={() => revoke(confirmRevoke.id)}
                disabled={revoking}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white shadow-sm hover:bg-red-600 disabled:opacity-60"
              >
                {revoking ? 'Revoking…' : 'Confirm'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function GrantAccessWizard({ onClose, onAdd }) {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState('');
  const doctors = useMemo(() => ['Dr. Smith', 'Dr. Lee', 'Dr. Patel', 'Dr. Gomez', 'Dr. Nguyen'], []);
  const filtered = doctors.filter((d) => d.toLowerCase().includes(query.toLowerCase()));
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [dataTypes, setDataTypes] = useState({ 'Heart Rate': true, 'Blood Pressure': false });
  const [duration, setDuration] = useState('1 Month');
  const [loading, setLoading] = useState(false);

  const confirm = () => {
    setLoading(true);
    setTimeout(() => {
      const id = Math.random().toString(36).slice(2, 8);
      const dt = Object.entries(dataTypes)
        .filter(([, v]) => v)
        .map(([k]) => k);
      onAdd({ id, provider: selectedDoctor || 'Dr. Smith', data: dt, expires: duration === '1 Week' ? 'In 1 Week' : duration === '1 Month' ? 'In 1 Month' : 'Until revoked' });
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <Modal onClose={onClose} full>
      <div className="mx-auto w-full max-w-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Grant Access</h3>
          <div className="text-sm text-slate-500">Step {step} of 4</div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctors..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {filtered.map((doc) => (
                <button
                  key={doc}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm ${
                    selectedDoctor === doc ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{doc}</span>
                  {selectedDoctor === doc && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {Object.keys(dataTypes).map((k) => (
              <label key={k} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={dataTypes[k]}
                  onChange={(e) => setDataTypes((prev) => ({ ...prev, [k]: e.target.checked }))}
                />
                <span>{k}</span>
              </label>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            {['1 Week', '1 Month', 'Until I revoke'].map((opt) => (
              <label key={opt} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
                <span>{opt}</span>
                <input type="radio" name="duration" checked={duration === opt} onChange={() => setDuration(opt)} />
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm text-slate-500">Confirm details</div>
            <div className="text-slate-900">Doctor: <span className="font-medium">{selectedDoctor || 'Not selected'}</span></div>
            <div className="text-slate-900">Data: <span className="font-medium">{Object.entries(dataTypes).filter(([, v]) => v).map(([k]) => k).join(', ')}</span></div>
            <div className="text-slate-900">Duration: <span className="font-medium">{duration}</span></div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Close</button>
          <div className="flex gap-2">
            {step > 1 && (
              <button onClick={() => setStep((s) => s - 1)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Back</button>
            )}
            {step < 4 && (
              <button onClick={() => setStep((s) => s + 1)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Next</button>
            )}
            {step === 4 && (
              <button onClick={confirm} disabled={loading} className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-60">
                {loading ? 'Confirming…' : 'Confirm'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ProvidersDirectory() {
  const providers = [
    { title: 'City General Hospital', subtitle: 'New York, NY' },
    { title: 'Downtown Clinic', subtitle: 'New York, NY' },
  ];
  const [message, setMessage] = useState('');

  const book = (name) => {
    setMessage('');
    setTimeout(() => setMessage(`Appointment request sent to ${name}.`), 300);
  };

  return (
    <div className="space-y-6 px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Find Healthcare Providers</h1>
      <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <input placeholder="Search by name or location..." className="w-full bg-transparent outline-none placeholder:text-slate-400" />
      </label>
      {message && <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{message}</div>}
      <div className="space-y-3">
        {providers.map((p) => (
          <div key={p.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-content-center rounded-xl bg-blue-50 text-blue-600"><Hospital className="h-5 w-5" /></div>
              <div>
                <div className="font-medium text-slate-900">{p.title}</div>
                <div className="text-sm text-slate-500">{p.subtitle}</div>
              </div>
            </div>
            <button onClick={() => book(p.title)} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">Book Appointment</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorPatients({ setRoute }) {
  const [query, setQuery] = useState('');
  const patients = [
    { id: 'patient-123', name: 'Alex Johnson' },
    { id: 'patient-456', name: 'Taylor Smith' },
    { id: 'patient-789', name: 'Jordan Lee' },
  ];
  const filtered = patients.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6 px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My Patients</h1>
      <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a patient..." className="w-full bg-transparent outline-none placeholder:text-slate-400" />
      </label>
      <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {filtered.map((p) => (
          <button key={p.id} onClick={() => setRoute(`/doctor/patient/${p.id}`)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-slate-50">
            <span className="font-medium text-slate-700">{p.name}</span>
            <span className="text-slate-500">{p.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DoctorPatientDetail({ patientId }) {
  return (
    <div className="space-y-4 px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Patient Detail</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">Showing records for <span className="font-medium text-slate-900">{patientId}</span>.</div>
    </div>
  );
}

function AdminOverview() {
  const [feed, setFeed] = useState(() => []);
  const counter = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      const ts = new Date().toLocaleTimeString();
      counter.current += 1;
      setFeed((prev) => [{ fn: `record.update#${counter.current}`, ts }, ...prev].slice(0, 10));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-8 px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Network Overview</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { title: 'Total Records', value: '1,428' },
          { title: 'Transactions (24h)', value: '152' },
          { title: 'Active Patients', value: '112' },
          { title: 'Active Providers', value: '34' },
        ].map((s) => (
          <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">{s.title}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{s.value}</div>
          </div>
        ))}
      </div>
      <Section title="Live Transaction Feed">
        <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {feed.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-slate-700">{item.fn}</span>
              <span className="text-slate-500">{item.ts}</span>
            </div>
          ))}
          {feed.length === 0 && <div className="px-4 py-6 text-sm text-slate-500">Waiting for transactions…</div>}
        </div>
      </Section>
    </div>
  );
}

function Modal({ children, onClose, full = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className={`relative w-full ${full ? 'h-full' : 'max-w-lg'} overflow-auto rounded-2xl bg-white shadow-xl`}>{children}</div>
      <button aria-label="Close" onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/90 p-2 shadow ring-1 ring-slate-200 hover:bg-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function Placeholder({ title, route }) {
  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-500">Route: {route}</p>
    </div>
  );
}
