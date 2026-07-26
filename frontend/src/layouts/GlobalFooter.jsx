import React, { useState, useEffect } from 'react';

export function GlobalFooter() {
  return (
    <footer className="ux4g-bg-primary-900 ux4g-text-white" style={{ backgroundColor: '#1E3A8A', color: '#FFF', paddingTop: '5rem' }}>
      <div className="ux4g-max-w-7xl ux4g-mx-auto ux4g-px-l" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Top Footer Row */}
        <div className="ux4g-grid ux4g-grid-cols-1 md:ux4g-grid-cols-5 ux4g-gap-2xl ux4g-mb-2xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Col 1: Logo & Social */}
          <div className="ux4g-flex ux4g-flex-col ux4g-gap-m" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img src="/images/Seal_of_Karnataka.png" alt="Seal of Karnataka" className="ux4g-h-16 ux4g-w-auto ux4g-mb-s" style={{ height: '4rem', objectFit: 'contain', objectPosition: 'left' }} />
            
            <div className="ux4g-flex ux4g-gap-s" style={{ display: 'flex', gap: '0.5rem' }}>
              <a href="#" className="ux4g-p-xs ux4g-bg-neutral-800 ux4g-rounded hover:ux4g-bg-primary-600" style={{ padding: '0.25rem', backgroundColor: '#27272A', borderRadius: '0.25rem', display: 'flex' }}>
                <img src="/images/facebook.svg" alt="Facebook" className="ux4g-h-5 ux4g-w-5" style={{ height: '1.25rem', width: '1.25rem', filter: 'invert(1)' }} />
              </a>
              <a href="#" className="ux4g-p-xs ux4g-bg-neutral-800 ux4g-rounded hover:ux4g-bg-primary-600" style={{ padding: '0.25rem', backgroundColor: '#27272A', borderRadius: '0.25rem', display: 'flex' }}>
                <img src="/images/twitter.svg" alt="Twitter" className="ux4g-h-5 ux4g-w-5" style={{ height: '1.25rem', width: '1.25rem', filter: 'invert(1)' }} />
              </a>
              <a href="#" className="ux4g-p-xs ux4g-bg-neutral-800 ux4g-rounded hover:ux4g-bg-primary-600" style={{ padding: '0.25rem', backgroundColor: '#27272A', borderRadius: '0.25rem', display: 'flex' }}>
                <img src="/images/youtube.svg" alt="YouTube" className="ux4g-h-5 ux4g-w-5" style={{ height: '1.25rem', width: '1.25rem', filter: 'invert(1)' }} />
              </a>
            </div>

            <div className="ux4g-flex ux4g-flex-col ux4g-gap-xs ux4g-mt-s" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="ux4g-btn ux4g-btn-outline-neutral ux4g-rounded-full ux4g-text-xs" style={{ border: '1px solid #71717A', borderRadius: '9999px', padding: '0.25rem 1rem', background: 'transparent', color: '#FFF', fontSize: '0.75rem' }}>Recruitment</button>
              <button className="ux4g-btn ux4g-btn-outline-neutral ux4g-rounded-full ux4g-text-xs" style={{ border: '1px solid #71717A', borderRadius: '9999px', padding: '0.25rem 1rem', background: 'transparent', color: '#FFF', fontSize: '0.75rem' }}>Tenders</button>
            </div>

            <div className="ux4g-text-xs ux4g-text-neutral-500 ux4g-mt-s" style={{ fontSize: '0.75rem', color: '#71717A', marginTop: '0.5rem' }}>
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="ux4g-font-bold ux4g-mb-m ux4g-text-neutral-100" style={{ fontWeight: 700, marginBottom: '1.25rem', color: '#F4F4F5', fontSize: '1.25rem' }}>Operations</h3>
            <ul className="ux4g-space-y-s ux4g-text-base ux4g-text-neutral-400" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', color: '#A1A1AA' }}>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Active Investigations</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Critical Alerts</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Suspect Registry</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Evidence Locker</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Network Graph</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="ux4g-font-bold ux4g-mb-m ux4g-text-neutral-100" style={{ fontWeight: 700, marginBottom: '1.25rem', color: '#F4F4F5', fontSize: '1.25rem' }}>Intelligence</h3>
            <ul className="ux4g-space-y-s ux4g-text-base ux4g-text-neutral-400" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', color: '#A1A1AA' }}>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>AI Analytics</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Threat Hotspots</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Cyber Crime Trends</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Forensic Reports</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="ux4g-font-bold ux4g-mb-m ux4g-text-neutral-100" style={{ fontWeight: 700, marginBottom: '1.25rem', color: '#F4F4F5', fontSize: '1.25rem' }}>Administration</h3>
            <ul className="ux4g-space-y-s ux4g-text-base ux4g-text-neutral-400" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', color: '#A1A1AA' }}>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>User Management</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Role Clearance</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Audit Logs</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>System Health</a></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h3 className="ux4g-font-bold ux4g-mb-m ux4g-text-neutral-100" style={{ fontWeight: 700, marginBottom: '1.25rem', color: '#F4F4F5', fontSize: '1.25rem' }}>Support</h3>
            <ul className="ux4g-space-y-s ux4g-text-base ux4g-text-neutral-400" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', color: '#A1A1AA' }}>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Helpdesk</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Contact IT Unit</a></li>
              <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Report an Issue</a></li>
            </ul>
          </div>

        </div>

      </div>

      {/* Logos Row */}
      <div className="ux4g-py-l" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '2rem' }}>
        <div className="ux4g-max-w-7xl ux4g-mx-auto ux4g-px-l ux4g-flex ux4g-flex-wrap ux4g-gap-xl ux4g-justify-center ux4g-items-center" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '3.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/images/DBIM_GOV_PNG.png" alt="India GOV" style={{ height: '56px', objectFit: 'contain' }} />
          <img src="/images/DBIM_BPRD_PNG.png" alt="Bureau of Police Research and Development" style={{ height: '56px', objectFit: 'contain' }} />
          <img src="/images/DBIM_CBI_PNG.png" alt="Central Bureau of Investigation" style={{ height: '56px', objectFit: 'contain' }} />
          <img src="/images/DBIM_Emblem_PNG.png" alt="National Emblem" style={{ height: '56px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="ux4g-py-m" style={{ backgroundColor: '#172554', padding: '1rem 0' }}>
        <div className="ux4g-max-w-7xl ux4g-mx-auto ux4g-px-l ux4g-flex ux4g-flex-col md:ux4g-flex-row ux4g-justify-between ux4g-items-center" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ul className="ux4g-flex ux4g-gap-l ux4g-text-sm ux4g-text-neutral-400" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#A1A1AA' }}>
            <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions</a></li>
            <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a></li>
            <li><a href="#" className="hover:ux4g-text-white" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</a></li>
          </ul>
          <p className="ux4g-text-xs ux4g-text-neutral-500 ux4g-mt-s md:ux4g-mt-0" style={{ fontSize: '0.75rem', color: '#71717A', margin: 0 }}>
            © Karnataka State Police. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
