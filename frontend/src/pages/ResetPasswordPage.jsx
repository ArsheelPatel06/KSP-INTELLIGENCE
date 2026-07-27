import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Key, ArrowRight, CheckCircle } from 'lucide-react';
import { authService } from '../services/auth.service';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing reset token.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ux4g-min-h-screen ux4g-w-full ux4g-bg-neutral-50 ux4g-flex ux4g-items-center ux4g-justify-center ux4g-p-m" style={{ minHeight: '100vh', width: '100%', backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="ux4g-w-full ux4g-max-w-md ux4g-bg-white ux4g-rounded-lg ux4g-shadow-l2 ux4g-overflow-hidden" style={{ width: '100%', maxWidth: '28rem', backgroundColor: '#FFFFFF', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div className="ux4g-p-xl ux4g-text-center" style={{ backgroundColor: '#1E3A8A', padding: '2.5rem 2rem', textAlign: 'center', borderBottom: '4px solid #FACC15' }}>
          <img src="/images/Seal_of_Karnataka.png" alt="Seal of Karnataka" className="ux4g-h-20 ux4g-mx-auto ux4g-mb-m" style={{ height: '5rem', margin: '0 auto 1rem', objectFit: 'contain' }} />
          <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#93C5FD', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Government of Karnataka</div>
          <h1 className="ux4g-text-2xl ux4g-font-bold ux4g-text-white" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFF' }}>KSP Intelligence OS</h1>
          <p className="ux4g-text-sm ux4g-text-neutral-300 ux4g-mt-xs" style={{ fontSize: '0.875rem', color: '#BFDBFE', marginTop: '0.25rem' }}>Create New Password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="ux4g-p-xl ux4g-space-y-l" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {error && (
            <div className="ux4g-p-s ux4g-bg-error-50 ux4g-text-error-700 ux4g-rounded ux4g-text-sm" style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', color: '#B91C1C', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {success ? (
            <div className="ux4g-p-s ux4g-bg-success-50 ux4g-text-success-700 ux4g-rounded ux4g-text-sm" style={{ padding: '0.75rem', backgroundColor: '#ECFDF5', color: '#047857', borderRadius: '0.25rem', fontSize: '0.875rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={24} color="#047857" />
              <p style={{ margin: 0, fontWeight: 600 }}>Password reset successfully!</p>
              <button 
                type="button" 
                onClick={() => navigate('/login')}
                className="ux4g-w-full ux4g-btn ux4g-flex ux4g-items-center ux4g-justify-center ux4g-gap-s ux4g-py-m hover:ux4g-opacity-90"
                style={{ width: '100%', backgroundColor: '#1E3A8A', color: '#FFF', padding: '0.75rem', borderRadius: '0.25rem', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1rem' }}
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="ux4g-text-sm ux4g-font-semibold ux4g-text-neutral-700" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3F3F46' }}>New Password</label>
                <div className="ux4g-relative" style={{ position: 'relative' }}>
                  <Key size={18} className="ux4g-absolute ux4g-left-3 ux4g-top-1/2 -ux4g-translate-y-1/2 ux4g-text-neutral-400" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="ux4g-w-full ux4g-p-s ux4g-pl-10 ux4g-border ux4g-border-neutral-300 ux4g-rounded ux4g-text-neutral-900 focus:ux4g-ring-2 focus:ux4g-ring-primary-500" 
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #D4D4D8', borderRadius: '0.25rem', color: '#18181B', backgroundColor: '#FFF' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="ux4g-text-sm ux4g-font-semibold ux4g-text-neutral-700" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3F3F46' }}>Confirm Password</label>
                <div className="ux4g-relative" style={{ position: 'relative' }}>
                  <Key size={18} className="ux4g-absolute ux4g-left-3 ux4g-top-1/2 -ux4g-translate-y-1/2 ux4g-text-neutral-400" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="ux4g-w-full ux4g-p-s ux4g-pl-10 ux4g-border ux4g-border-neutral-300 ux4g-rounded ux4g-text-neutral-900 focus:ux4g-ring-2 focus:ux4g-ring-primary-500" 
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #D4D4D8', borderRadius: '0.25rem', color: '#18181B', backgroundColor: '#FFF' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !token}
                className="ux4g-w-full ux4g-btn ux4g-flex ux4g-items-center ux4g-justify-center ux4g-gap-s ux4g-py-m hover:ux4g-opacity-90"
                style={{ width: '100%', backgroundColor: '#1E3A8A', color: '#FFF', padding: '0.75rem', borderRadius: '0.25rem', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: loading || !token ? 'wait' : 'pointer', transition: 'background-color 0.2s', opacity: !token ? 0.5 : 1 }}
              >
                {loading ? 'Updating...' : 'Update Password'}
                <ArrowRight size={18} />
              </button>
            </>
          )}

        </form>

        <div className="ux4g-bg-neutral-100 ux4g-p-s ux4g-text-center ux4g-border-t ux4g-border-neutral-200" style={{ backgroundColor: '#F4F4F5', padding: '0.75rem', textAlign: 'center', borderTop: '1px solid #E4E4E7' }}>
          <p className="ux4g-text-xs ux4g-text-neutral-500 ux4g-font-mono" style={{ fontSize: '0.75rem', color: '#71717A', fontFamily: 'monospace' }}>IP LOGGED • UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE</p>
        </div>
      </div>
    </div>
  );
};
