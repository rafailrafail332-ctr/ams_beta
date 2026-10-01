import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserManagement = () => {
  const { currentUser } = useApp();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header Modul Admin */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h1 className="page-title" style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
              Modul Admin (Master Control Panel)
            </h1>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Pusat kendali operasional, konfigurasi sistem, dan hak akses resmi PT Ashoka Enterprise Realty.
          </p>
        </div>
      </div>

      {/* Clean Slate Workspace */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center',
          borderRadius: '16px',
          border: '1.5px dashed rgba(2, 132, 199, 0.35)',
          background: 'rgba(15, 23, 42, 0.4)'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(2, 132, 199, 0.15)',
          color: '#38bdf8',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}>
          <Sparkles size={32} />
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
          Ruang Kerja Modul Admin Siap Dikonfigurasi
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
          Seluruh isi lama modul admin telah dikosongkan tanpa mengubah modul lain. Modul ini siap diisi dengan rancangan fitur-fitur baru yang canggih dan berguna sesuai persetujuan Anda.
        </p>
      </div>
    </div>
  );
};
