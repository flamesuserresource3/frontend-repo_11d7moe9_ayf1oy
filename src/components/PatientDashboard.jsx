export default function PatientDashboard({ name }) {
  return (
    <div className="space-y-8 px-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back, {name}.</h1>
        <p className="mt-1 text-sm text-slate-500">Your health data at a glance.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard title="Last Heart Rate" value="78 bpm" timestamp="Updated 2 minutes ago" />
        <StatCard title="Active Permissions" value="3 Providers" cta="Manage ->" />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">Recent Activity</h2>
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {[
            "Dr. Smith accessed your Heart Rate data",
            "Dr. Patel viewed your Blood Pressure record",
            "You granted access to Dr. Lee for Heart Rate",
          ].map((item, idx) => (
            <li key={idx} className="px-4 py-3 text-sm text-slate-700">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ title, value, timestamp, cta }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-900">{value}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-slate-500">{timestamp}</div>
        {cta && (
          <button className="text-sm font-medium text-blue-700 hover:underline">{cta}</button>
        )}
      </div>
    </div>
  );
}
