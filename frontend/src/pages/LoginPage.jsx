import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Key, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Admin');

  const roles = ['Investigator', 'Analyst', 'Supervisor', 'Admin'];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login({ username, password, role: selectedRole });
    if (success) {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="ux4g-min-h-screen ux4g-w-full ux4g-bg-neutral-50 ux4g-flex ux4g-items-center ux4g-justify-center ux4g-p-m" style={{ minHeight: '100vh', width: '100%', backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="ux4g-w-full ux4g-max-w-md ux4g-bg-white ux4g-rounded-lg ux4g-shadow-l2 ux4g-overflow-hidden" style={{ width: '100%', maxWidth: '28rem', backgroundColor: '#FFFFFF', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div className="ux4g-p-xl ux4g-text-center" style={{ backgroundColor: '#1E3A8A', padding: '2.5rem 2rem', textAlign: 'center', borderBottom: '4px solid #FACC15' }}>
          <img src="/images/Seal_of_Karnataka.png" alt="Seal of Karnataka" className="ux4g-h-20 ux4g-mx-auto ux4g-mb-m" style={{ height: '5rem', margin: '0 auto 1rem', objectFit: 'contain' }} />
          <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#93C5FD', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Government of Karnataka</div>
          <h1 className="ux4g-text-2xl ux4g-font-bold ux4g-text-white" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFF' }}>KSP Intelligence OS</h1>
          <p className="ux4g-text-sm ux4g-text-neutral-300 ux4g-mt-xs" style={{ fontSize: '0.875rem', color: '#BFDBFE', marginTop: '0.25rem' }}>Secure Authorized Access</p>
        </div>

        {/* Demo Credentials Notice */}
        <div style={{ padding: '1rem 2rem 0 2rem' }}>
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1E40AF', textAlign: 'center' }}>Judges Login</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#1E3A8A', textAlign: 'center' }}>Username: <strong>admin</strong></p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#1E3A8A', textAlign: 'center' }}>Password: <strong>Password123!</strong></p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="ux4g-p-xl ux4g-space-y-l" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {error && (
            <div className="ux4g-p-s ux4g-bg-error-50 ux4g-text-error-700 ux4g-rounded ux4g-text-sm" style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', color: '#B91C1C', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="ux4g-text-sm ux4g-font-semibold ux4g-text-neutral-700" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3F3F46' }}>Clearance Role</label>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="ux4g-w-full ux4g-p-s ux4g-border ux4g-border-neutral-300 ux4g-rounded ux4g-text-neutral-900" 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #D4D4D8', borderRadius: '0.25rem', color: '#18181B', backgroundColor: '#FFF' }}
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="ux4g-text-sm ux4g-font-semibold ux4g-text-neutral-700" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3F3F46' }}>Official ID</label>
            <div className="ux4g-relative" style={{ position: 'relative' }}>
              <User size={18} className="ux4g-absolute ux4g-left-3 ux4g-top-1/2 -ux4g-translate-y-1/2 ux4g-text-neutral-400" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
              <input 
                type="text" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="ux4g-w-full ux4g-p-s ux4g-pl-10 ux4g-border ux4g-border-neutral-300 ux4g-rounded ux4g-text-neutral-900 focus:ux4g-ring-2 focus:ux4g-ring-primary-500" 
                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #D4D4D8', borderRadius: '0.25rem', color: '#18181B', backgroundColor: '#FFF' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="ux4g-text-sm ux4g-font-semibold ux4g-text-neutral-700" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3F3F46' }}>Password</label>
            <div className="ux4g-relative" style={{ position: 'relative' }}>
              <Key size={18} className="ux4g-absolute ux4g-left-3 ux4g-top-1/2 -ux4g-translate-y-1/2 ux4g-text-neutral-400" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="ux4g-w-full ux4g-p-s ux4g-pl-10 ux4g-border ux4g-border-neutral-300 ux4g-rounded ux4g-text-neutral-900 focus:ux4g-ring-2 focus:ux4g-ring-primary-500" 
                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #D4D4D8', borderRadius: '0.25rem', color: '#18181B', backgroundColor: '#FFF' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="ux4g-w-full ux4g-btn ux4g-flex ux4g-items-center ux4g-justify-center ux4g-gap-s ux4g-py-m hover:ux4g-opacity-90"
            style={{ width: '100%', backgroundColor: '#1E3A8A', color: '#FFF', padding: '0.75rem', borderRadius: '0.25rem', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: loading ? 'wait' : 'pointer', transition: 'background-color 0.2s' }}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
            <ArrowRight size={18} />
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.875rem' }}>
            <span 
              onClick={() => navigate('/forgot-password')}
              style={{ color: '#1E40AF', cursor: 'pointer', fontWeight: 500 }}
              className="hover:ux4g-underline"
            >
              Forgot Password?
            </span>
            <span 
              onClick={() => navigate('/signup')}
              style={{ color: '#1E40AF', cursor: 'pointer', fontWeight: 500 }}
              className="hover:ux4g-underline"
            >
              Create Account
            </span>
          </div>
        </form>

        <div className="ux4g-bg-neutral-100 ux4g-p-s ux4g-text-center ux4g-border-t ux4g-border-neutral-200" style={{ backgroundColor: '#F4F4F5', padding: '0.75rem', textAlign: 'center', borderTop: '1px solid #E4E4E7' }}>
          <p className="ux4g-text-xs ux4g-text-neutral-500 ux4g-font-mono" style={{ fontSize: '0.75rem', color: '#71717A', fontFamily: 'monospace' }}>IP LOGGED • UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE</p>
        </div>
      </div>
    </div>
  );
};
