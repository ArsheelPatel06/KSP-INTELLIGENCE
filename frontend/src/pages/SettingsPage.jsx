import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, User, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';

const sCard = {
  padding: '1.25rem',
  borderRadius: '0.75rem',
  backgroundColor: 'var(--t-bg-card)',
  border: '1px solid var(--t-border)',
};

const sTitle = {
  fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
  letterSpacing: '0.07em', color: 'var(--t-text-secondary)',
  display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1rem'
};

export const SettingsPage = () => {
  const { currentUser, setCurrentUser } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [name, setName] = useState(currentUser.name);
  const [badge, setBadge] = useState(currentUser.badge);
  const [district, setDistrict] = useState(currentUser.district);
  const [email, setEmail] = useState('officer.vikram@ksp.gov.in');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [criticalPush, setCriticalPush] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setCurrentUser({ ...currentUser, name, badge, district });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ ...sCard, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--t-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} style={{ color: '#3B82F6' }} />
            Platform Settings &amp; Personnel Preferences
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--t-text-secondary)', marginTop: '0.25rem' }}>
            Configure officer credentials, notification channels, &amp; security parameters.
          </p>
        </div>
        {savedSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
            <CheckCircle2 size={14} /> Settings Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Officer Profile */}
        <div style={sCard}>
          <div style={sTitle}><User size={15} style={{ color: '#3B82F6' }} /> Officer Profile &amp; SmartCard Metadata</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Full Officer Name', value: name, setter: setName, type: 'text' },
              { label: 'IPS / KPS Badge Number', value: badge, setter: setBadge, type: 'text' },
              { label: 'Assigned Station / District', value: district, setter: setDistrict, type: 'text' },
              { label: 'Official Gov Email', value: email, setter: setEmail, type: 'email' },
            ].map(f => (
              <div key={f.label}>
                <label className="t-label">{f.label}</label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className="t-input"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notification Channels */}
        <div style={sCard}>
          <div style={sTitle}><Bell size={15} style={{ color: '#3B82F6' }} /> Alert Channels &amp; Thresholds</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[
              { label: 'Critical Crime Spike Push Alerts', desc: 'Instant audio/popup alerts when automated spike detection triggers.', val: criticalPush, setter: setCriticalPush },
              { label: 'Official SMS Dispatch Notifications', desc: 'Receive encrypted SMS alerts for FIR assignments.', val: smsAlerts, setter: setSmsAlerts },
              { label: 'Daily Intelligence Email Summary', desc: 'Automated 06:00 AM briefing sent to official email.', val: emailAlerts, setter: setEmailAlerts },
            ].map(t => (
              <label key={t.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--t-bg-card-alt)', border: '1px solid var(--t-border)', borderRadius: '0.5rem', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--t-text-primary)' }}>{t.label}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--t-text-muted)', marginTop: '0.125rem' }}>{t.desc}</div>
                </div>
                <input type="checkbox" checked={t.val} onChange={e => t.setter(e.target.checked)} style={{ width: '1rem', height: '1rem', accentColor: '#3B82F6', cursor: 'pointer' }} />
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div style={sCard}>
          <div style={sTitle}><Shield size={15} style={{ color: '#3B82F6' }} /> Hardware SmartCard &amp; 2FA Status</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--t-bg-card-alt)', border: '1px solid var(--t-border)', borderRadius: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--t-text-primary)' }}>Hardware Token: YubiKey-5-Police-HSM</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--t-text-muted)', marginTop: '0.125rem' }}>Cryptographic key ID: 0x94F2A... (Valid till 2028)</div>
            </div>
            <Badge variant="success" size="md">ENFORCED</Badge>
          </div>
        </div>

        {/* Save */}
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', backgroundColor: '#1E3A8A', color: '#FFF', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', width: 'fit-content' }}>
          <Save size={16} /> Save Preferences
        </button>
      </form>
    </div>
  );
};
