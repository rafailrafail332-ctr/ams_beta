import React, { useState } from 'react';
import { Menu, Sun, Moon, Bell, Search, User, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = ({ onToggleSidebar, activeTitle, onLogout, onOpenProfile }) => {
  const { theme, toggleTheme, currentUser, getAvatarUrl } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const avatarUrl = getAvatarUrl(currentUser);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        height: 'var(--header-height)',
        backgroundColor: '#0f172a',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        paddingLeft: 'calc(var(--sidebar-width) + 1.75rem)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Left side: Toggle & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Ashoka Management &bull; {activeTitle}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Real-Time Housing Project Tracking 
            <span className="badge badge-warning" style={{ fontSize: '0.7rem', cursor: 'pointer' }} onClick={onOpenProfile} title="Klik untuk membuka Profil Saya">
              <ShieldCheck size={12} /> {currentUser?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div 
        className="d-none d-md-flex"
        style={{
          position: 'relative',
          width: '300px'
        }}
      >
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Cari unit, blok, owner..."
          className="form-control"
          style={{
            paddingLeft: '36px',
            fontSize: '0.85rem',
            borderRadius: '9999px',
            background: 'var(--bg-card)'
          }}
        />
      </div>

      {/* Right Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s'
          }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              boxShadow: '0 0 6px var(--accent-primary)'
            }} />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '300px',
              backgroundColor: '#0f172a',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '1rem',
              zIndex: 100
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Notifikasi Terbaru
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-card-hover)' }}>
                  <div style={{ fontWeight: 600 }}>Update Progress Unit B-05</div>
                  <div style={{ color: 'var(--text-muted)' }}>Progress naik ke 40% (Struktur Dinding)</div>
                </div>
                <div style={{ padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-card-hover)' }}>
                  <div style={{ fontWeight: 600 }}>Pecah Sertifikat Ready</div>
                  <div style={{ color: 'var(--text-muted)' }}>SHGB Unit A-01 resmi terbit dari BPN</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.6rem',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            <img
              src={avatarUrl}
              alt="Avatar"
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #F59E0B' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }} className="d-none d-sm-inline">
              {currentUser?.name || 'User'}
            </span>
          </button>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '220px',
              backgroundColor: '#0f172a',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '0.5rem',
              zIndex: 100
            }}>
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{currentUser?.role}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
              </div>
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenProfile();
                }}
                className="btn btn-secondary btn-sm" 
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', marginBottom: '0.2rem' }}
              >
                <User size={14} /> Profil Saya
              </button>
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onLogout) onLogout();
                }}
                className="btn btn-outline-danger btn-sm" 
                style={{ width: '100%', justifyContent: 'flex-start', marginTop: '0.25rem' }}
              >
                <LogOut size={14} /> Ganti User / Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
