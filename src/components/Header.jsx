import React, { useState } from 'react';
import { ArrowLeft, User, LogOut, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = ({ currentTab, setCurrentTab, onBackToLanding, activeTitle, onLogout, onOpenProfile }) => {
  const { theme, toggleTheme, currentUser, getAvatarUrl } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const avatarUrl = getAvatarUrl(currentUser);

  return (
    <header
      className="app-header"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        height: 'var(--header-height)',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* ========================================================================= */}
      {/* SEBELAH KIRI: TOMBOL BACK & PROFIL (AVATAR + NAMA)                        */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Tombol Back (Muncul saat sedang di dalam modul) */}
        {currentTab !== 'dashboard' && (
          <button
            type="button"
            onClick={() => {
              if (onBackToLanding) {
                onBackToLanding();
              } else if (setCurrentTab) {
                setCurrentTab('dashboard');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 15px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(234, 88, 12, 0.4)',
              transition: 'all 0.18s ease'
            }}
            title="Kembali ke Beranda Utama (Central Hub)"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
        )}

        {/* Profil Pengguna: Avatar + Yazid Hizbullah, S.E.,S.T */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(30, 41, 59, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '5px 14px 5px 6px',
              cursor: 'pointer',
              color: 'var(--text-main)',
              transition: 'all 0.2s'
            }}
            title="Klik untuk melihat menu profil / ganti user"
          >
            <img
              src={avatarUrl}
              alt="Avatar"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #F59E0B'
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                {currentUser?.name || 'Yazid Hizbullah, S.E.,S.T'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>
                {currentUser?.role || 'Direktur Utama'}
              </div>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '125%',
                left: 0,
                width: '240px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
                padding: '0.6rem',
                zIndex: 100
              }}
            >
              <div style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '0.4rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{currentUser?.role}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenProfile();
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', marginBottom: '0.3rem', fontSize: '0.8rem' }}
              >
                <User size={14} /> Profil Lengkap Saya
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onLogout) onLogout();
                }}
                className="btn btn-outline-danger btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem' }}
              >
                <LogOut size={14} /> Ganti User / Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEBELAH KANAN: LOGO PALING KANAN & ASHOKA MANAGEMENT SYSTEM               */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.02em',
              lineHeight: 1.2
            }}
          >
            Ashoka Management System
          </div>
          <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 800, letterSpacing: '0.04em' }}>
            Asset & Property Management System (AMS)
          </div>
        </div>

        <img
          src="/company-logo.png"
          alt="Ashoka Logo"
          style={{
            width: '38px',
            height: '38px',
            objectFit: 'contain'
          }}
        />
      </div>
    </header>
  );
};
