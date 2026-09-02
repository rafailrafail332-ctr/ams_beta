import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Mail, 
  Lock, 
  CheckCircle2, 
  X, 
  Home, 
  Key, 
  MapPin
} from 'lucide-react';

export const UserProfileModal = ({ isOpen, onClose, onOpenUserControl, onLogout }) => {
  const { currentUser, getAvatarUrl } = useApp();

  if (!isOpen || !currentUser) return null;

  const isSuperAdmin = currentUser.role.toLowerCase().includes('super admin');
  const avatarUrl = getAvatarUrl(currentUser);

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="#F59E0B" />
            <h3 className="modal-title">Profil Pengguna & Alamat Rumah</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* User Header Profile Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.25rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            marginBottom: '1.25rem'
          }}>
            <img
              src={avatarUrl}
              alt={currentUser.name}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #F59E0B',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.35)'
              }}
            />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: 800, margin: '2px 0 4px' }}>
                {currentUser.role}
              </div>
              <span className="badge badge-success">
                <CheckCircle2 size={12} /> Status: {currentUser.status || 'Aktif'}
              </span>
            </div>
          </div>

          {/* Account Detail Info Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
            {/* EMAIL */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Mail size={16} color="#F59E0B" /> Alamat Email
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                {currentUser.email}
              </div>
            </div>

            {/* ALAMAT RUMAH */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                <Home size={16} color="#38BDF8" /> Alamat Rumah
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', textAlign: 'right' }}>
                {currentUser.address || 'Kantor Operasional Ashoka Enterprise'}
              </div>
            </div>

            {/* LEVEL OTORISASI */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} color="#F59E0B" /> Otorisasi Modul
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#F59E0B' }}>
                {isSuperAdmin ? 'Full Multi-Module Admin' : currentUser.allowedModules?.length > 2 ? 'Multi-Module Director' : '1 Single Module Restriction'}
              </div>
            </div>
          </div>

          {/* Security & Admin Notice */}
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: '1.45'
          }}>
            <div style={{ fontWeight: 800, color: '#F59E0B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} /> Pengelolaan Profil Terpusat
            </div>
            Pengaturan alamat rumah, email, serta otorisasi hak akses modul Anda dikelola secara terpusat oleh <strong>Super Admin</strong> melalui Modul User Control.
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            className="btn btn-outline-danger" 
            onClick={() => {
              onClose();
              if (onLogout) onLogout();
            }}
          >
            <Lock size={16} /> Logout / Ganti User
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isSuperAdmin && (
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  onClose();
                  onOpenUserControl();
                }}
              >
                <Key size={16} /> Buka User Control
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
