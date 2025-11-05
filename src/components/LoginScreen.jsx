import { useState } from 'react';
import Spline from '@splinetool/react-spline';

function Input({ label, type = 'text', value, onChange }) {
  return (
    <label className="block w-full">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        placeholder={label}
        aria-label={label}
      />
    </label>
  );
}

export default function LoginScreen({ onSignIn }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth for the sandbox (no backend yet)
    setTimeout(() => {
      setLoading(false);
      onSignIn({ name: userId || 'Patient', role: 'patient' });
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Spline Cover */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        {/* Soft gradient to improve contrast for the form */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/60" />
      </div>

      {/* Centered Card */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl ring-1 ring-slate-100 backdrop-blur">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-10 w-10 place-content-center rounded-xl bg-blue-600 text-white shadow-sm">
              <span className="text-lg font-bold">IL</span>
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight text-slate-900">IoMT‑Ledger</div>
              <div className="text-sm text-slate-500">Secure Health Portal</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60"
            >
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            By continuing you agree to our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
