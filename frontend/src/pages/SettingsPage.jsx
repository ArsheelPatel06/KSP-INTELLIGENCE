import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, User, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';
import { Btn } from '../components/common/ButtonSystem';

export const SettingsPage = () => {
  const { currentUser, setCurrentUser } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [name, setName] = useState(currentUser.name || 'Vikram Singh');
  const [badge, setBadge] = useState(currentUser.badge || 'IPS-KA-2019-482');
  const [district, setDistrict] = useState(currentUser.district || 'Bengaluru Urban');
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
    <div className="max-w-4xl mx-auto flex flex-col gap-5 pb-8 animate-fade-in font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 flex items-center gap-2">
            <Settings size={24} className="text-blue-600" />
            Platform Settings &amp; Personnel Preferences
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Configure officer credentials, notification channels, &amp; security parameters.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-[10px] text-[13px] font-bold shadow-sm">
            <CheckCircle2 size={16} /> Settings Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">

        {/* Officer Profile */}
        <div className="bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-widest text-slate-500 mb-5">
            <User size={16} className="text-blue-600" /> 
            Officer Profile &amp; SmartCard Metadata
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Full Officer Name', value: name, setter: setName, type: 'text' },
              { label: 'IPS / KPS Badge Number', value: badge, setter: setBadge, type: 'text' },
              { label: 'Assigned Station / District', value: district, setter: setDistrict, type: 'text' },
              { label: 'Official Gov Email', value: email, setter: setEmail, type: 'email' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className="w-full h-11 px-4 rounded-[12px] border border-gray-200 bg-slate-50 text-[14px] font-semibold text-slate-800 focus:bg-white focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] outline-none transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-widest text-slate-500 mb-5">
            <Bell size={16} className="text-blue-600" /> 
            Alert Channels &amp; Thresholds
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Critical Crime Spike Push Alerts', desc: 'Instant audio/popup alerts when automated spike detection triggers.', val: criticalPush, setter: setCriticalPush },
              { label: 'Official SMS Dispatch Notifications', desc: 'Receive encrypted SMS alerts for FIR assignments.', val: smsAlerts, setter: setSmsAlerts },
              { label: 'Daily Intelligence Email Summary', desc: 'Automated 06:00 AM briefing sent to official email.', val: emailAlerts, setter: setEmailAlerts },
            ].map(t => (
              <label key={t.label} className="flex items-center justify-between p-4 bg-slate-50 border border-gray-100 rounded-[14px] cursor-pointer hover:border-blue-200 transition-colors">
                <div>
                  <div className="text-[14px] font-extrabold text-slate-800">{t.label}</div>
                  <div className="text-[12px] font-medium text-slate-500 mt-0.5">{t.desc}</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={t.val} 
                  onChange={e => t.setter(e.target.checked)} 
                  className="w-5 h-5 rounded-[6px] border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-widest text-slate-500 mb-5">
            <Shield size={16} className="text-blue-600" /> 
            Hardware SmartCard &amp; 2FA Status
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-gray-100 rounded-[14px]">
            <div>
              <div className="text-[14px] font-extrabold text-slate-800">Hardware Token: YubiKey-5-Police-HSM</div>
              <div className="text-[12px] font-medium text-slate-500 mt-0.5">Cryptographic key ID: 0x94F2A... (Valid till 2028)</div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-extrabold uppercase tracking-widest">
              Enforced
            </span>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-start">
          <Btn type="submit" variant="primary" size="lg" icon={Save}>
            Save Preferences
          </Btn>
        </div>
      </form>
    </div>
  );
};
