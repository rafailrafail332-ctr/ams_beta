import React, { useState } from 'react';
import { ArrowLeft, User, LogOut, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = ({ currentTab, setCurrentTab, onBackToLanding, activeTitle, onLogout, onOpenProfile }) => {
  const { theme, toggleTheme, currentUser, getAvatarUrl } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isDark = theme !== 'light';
  const isLegalTab = currentTab === 'legal';
  const isHrGaTab = currentTab === 'hr-ga' || currentTab === 'ga';
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
        {currentTab !== 'dashboard' && currentTab !== 'hub' && (
          <button
            type="button"
            onClick={() => {
              if (onBackToLanding) {
                onBackToLanding();
              } else if (setCurrentTab) {
                setCurrentTab('hub');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isLegalTab 
                ? 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' 
                : isHrGaTab
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 15px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: isLegalTab 
                ? '0 2px 10px rgba(147, 51, 234, 0.45)' 
                : isHrGaTab
                ? '0 2px 10px rgba(16, 185, 129, 0.45)'
                : '0 2px 10px rgba(2, 132, 199, 0.4)',
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
                border: isLegalTab ? '1.5px solid #c084fc' : isHrGaTab ? '1.5px solid #34d399' : '1.5px solid #0284c7'
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                {currentUser?.name || 'Yazid Hizbullah, S.E.,S.T'}
              </div>
              <div style={{ fontSize: '0.7rem', color: isLegalTab ? '#c084fc' : isHrGaTab ? '#34d399' : '#38bdf8', fontWeight: 700 }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          <div style={{ fontSize: '0.68rem', color: isLegalTab ? '#c084fc' : isHrGaTab ? '#34d399' : '#38bdf8', fontWeight: 800, letterSpacing: '0.04em' }}>
            Asset & Property Management System (AMS)
          </div>
        </div>

        {/* Frosted Glass Logo Badge persis seperti di Central Hub */}
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
            border: isDark 
              ? (isLegalTab ? '1.5px solid rgba(192, 132, 252, 0.35)' : isHrGaTab ? '1.5px solid rgba(52, 211, 153, 0.35)' : '1.5px solid rgba(255, 255, 255, 0.18)') 
              : (isLegalTab ? '1.5px solid #e9d5ff' : isHrGaTab ? '1.5px solid #a7f3d0' : '1.5px solid #e2e8f0'),
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isDark 
              ? (isLegalTab ? '0 6px 18px rgba(0, 0, 0, 0.5), 0 0 16px rgba(192, 132, 252, 0.35)' : isHrGaTab ? '0 6px 18px rgba(0, 0, 0, 0.5), 0 0 16px rgba(52, 211, 153, 0.35)' : '0 6px 18px rgba(0, 0, 0, 0.5), 0 0 16px rgba(56, 189, 248, 0.28)') 
              : (isLegalTab ? '0 4px 12px rgba(0, 0, 0, 0.08), 0 0 10px rgba(168, 85, 247, 0.2)' : isHrGaTab ? '0 4px 12px rgba(0, 0, 0, 0.08), 0 0 10px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.08), 0 0 10px rgba(245, 158, 11, 0.15)'),
            flexShrink: 0
          }}
        >
          <img
            src="/company-logo-transparent.png"
            alt="Ashoka Logo"
            onError={(e) => {
              e.currentTarget.src = '/company-logo.png';
            }}
            style={{
              width: '28px',
              height: '28px',
              objectFit: 'contain',
              filter: isDark ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' : 'none'
            }}
          />
        </div>
      </div>
    </header>
  );
};
