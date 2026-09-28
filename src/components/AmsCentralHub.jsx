import React, { useState } from 'react';
import { 
  ArrowRight, 
  UserCheck, 
  Wrench, 
  Scale, 
  TrendingUp, 
  Users, 
  Wallet, 
  CheckSquare,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { GeminiCursorCanvas } from './GeminiCursorCanvas';

export const AmsCentralHub = ({ 
  onSelectModule, 
  onOpenLoginModal, 
  currentUser, 
  isLanding = false,
  theme: externalTheme,
  onToggleTheme: externalToggleTheme,
  onLogout
}) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [internalTheme, setInternalTheme] = useState('dark');

  // Support controlled or uncontrolled theme
  const themeMode = externalTheme || internalTheme;
  const toggleTheme = externalToggleTheme || (() => setInternalTheme(prev => prev === 'dark' ? 'light' : 'dark'));
  const isDark = themeMode === 'dark';

  const modules = [
    { 
      key: 'teknik', 
      label: 'Teknik', 
      sub: 'Konstruksi & Lapangan', 
      desc: 'Absen Tenaga Kerja, Proyek & Fasilitas', 
      color: '#0284c7', 
      lightColor: '#0369a1',
      icon: Wrench
    },
    { 
      key: 'legal', 
      label: 'legal', 
      sub: 'SPK, Izin & Legalitas', 
      desc: 'Legal Corporate, Perizinan & Dokumen', 
      color: '#c084fc', 
      lightColor: '#9333ea',
      icon: Scale
    },
    { 
      key: 'marketing', 
      label: 'Marketing', 
      sub: 'Penjualan & Konsumen', 
      desc: 'Unit Properti, Akad & Leads Marketing', 
      color: '#38bdf8', 
      lightColor: '#0284c7',
      icon: TrendingUp
    },
    { 
      key: 'hr-ga', 
      label: 'HR & GA', 
      sub: 'SDM, Aset & Operasional', 
      desc: 'Kepegawaian, Fasilitas & Kendaraan', 
      color: '#a855f7', 
      lightColor: '#9333ea',
      icon: Users
    },
    { 
      key: 'finance', 
      label: 'Finance', 
      sub: 'Keuangan & Kas Bank', 
      desc: 'Arus Kas, Tagihan Vendor & Payment', 
      color: '#0284c7', 
      lightColor: '#0369a1',
      icon: Wallet
    },
    { 
      key: 'todo-attendance', 
      label: 'TO -DO LIST', 
      sub: 'Agenda Kerja & Presensi', 
      desc: 'Target Harian & Kehadiran Staf', 
      color: '#ec4899', 
      lightColor: '#db2777',
      icon: CheckSquare
    }
  ];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: isDark ? '#080c14' : '#f8fafc',
        color: isDark ? '#ffffff' : '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem 1rem',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
        transition: 'background 0.3s ease, color 0.3s ease'
      }}
    >
      <style>
        {`
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulseRing {
            0%, 100% { transform: scale(1); opacity: 0.35; }
            50% { transform: scale(1.04); opacity: 0.8; }
          }
          @keyframes geminiGlow {
            0%, 100% { filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.4)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.3)); }
            50% { filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.45)) drop-shadow(0 0 25px rgba(56, 189, 248, 0.5)); }
          }
          @keyframes streamDash {
            to { stroke-dashoffset: -40; }
          }
          .gemini-sparkle-icon {
            animation: geminiGlow 4s ease-in-out infinite;
          }
          .ams-hub-node-btn {
            position: relative;
            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
            user-select: none;
            outline: none;
          }
          .ams-hub-node-btn:hover {
            transform: scale(1.06) translateY(-2px);
          }
          .ams-hub-node-btn:active {
            transform: scale(0.98);
          }
          @media (max-width: 768px) {
            .ams-hub-middle-row {
              flex-direction: column !important;
              gap: 20px !important;
            }
            .ams-hub-side-col {
              width: 100% !important;
              height: auto !important;
              flex-direction: row !important;
              justify-content: center !important;
              align-items: center !important;
              gap: 16px !important;
            }
            .ams-hub-circle-box {
              width: 230px !important;
              height: 230px !important;
            }
            .ams-hub-svg-layer {
              display: none !important;
            }
          }
        `}
      </style>

      {/* 1. DYNAMIC INTERACTIVE GEMINI CANVAS (Cursor Spotlight & Star Particles) */}
      <GeminiCursorCanvas theme={themeMode} />

      {/* 2. TOP CORNER CONTROLS (Theme Switcher & Quick User Switch) */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '20px', 
          right: '24px', 
          zIndex: 20, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px' 
        }}
      >
        {/* Theme Toggle (Mode Gelap / Terang) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Ganti ke Mode Terang (Putih)' : 'Ganti ke Mode Gelap'}
          style={{
            background: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1.5px solid #cbd5e1',
            color: isDark ? '#fbbf24' : '#0284c7',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.5)' : '0 4px 15px rgba(0,0,0,0.08)',
            transition: 'all 0.2s ease'
          }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Modal Login Staf Khusus (Optional) */}
        {isLanding && onOpenLoginModal && (
          <button
            type="button"
            onClick={onOpenLoginModal}
            style={{
              background: isDark ? 'rgba(15, 23, 42, 0.85)' : '#ffffff',
              border: isDark ? '1.5px solid rgba(2, 132, 199, 0.45)' : '1.5px solid #0284c7',
              borderRadius: '24px',
              padding: '8px 18px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: isDark ? '#f8fafc' : '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              backdropFilter: 'blur(10px)',
              boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 15px rgba(2, 132, 199, 0.15)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#0284c7';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = isDark ? 'rgba(2, 132, 199, 0.45)' : '#0284c7';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <UserCheck size={15} color="#0284c7" />
            <span>Pilih Akun Staf / Login Khusus</span>
          </button>
        )}

        {/* Tombol Keluar / Ganti Akun */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            style={{
              background: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
              border: isDark ? '1px solid rgba(239, 68, 68, 0.35)' : '1.5px solid #fca5a5',
              color: isDark ? '#f87171' : '#dc2626',
              borderRadius: '24px',
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)',
              boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.5)' : '0 4px 15px rgba(220, 38, 38, 0.08)',
              transition: 'all 0.2s ease'
            }}
            title="Keluar ke Layar Login / Ganti Akun"
          >
            <LogOut size={15} />
            <span>Keluar / Ganti Akun</span>
          </button>
        )}
      </div>

      {/* 3. MAIN CENTRAL HUB ARCHITECTURE */}
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          margin: 'auto 0',
          zIndex: 10
        }}
      >
        {/* TOP ELEMENT: ASHOKA LOGO + AMS + GLOWING ACCENT */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            userSelect: 'none',
            position: 'relative'
          }}
        >
          {/* Subtle Ambient Halo behind Logo */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '130px',
              height: '130px',
              background: isDark 
                ? 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)'
                : 'radial-gradient(circle, rgba(2, 132, 199, 0.12) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 70%)',
              filter: 'blur(16px)',
              pointerEvents: 'none'
            }}
          />

          {/* Logo with Frosted Glass Badge */}
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '20px',
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
              border: isDark ? '1.5px solid rgba(255, 255, 255, 0.18)' : '1.5px solid #e2e8f0',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isDark 
                ? '0 10px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.25)' 
                : '0 8px 20px rgba(0, 0, 0, 0.08), 0 0 15px rgba(245, 158, 11, 0.15)',
              transition: 'transform 0.3s ease'
            }}
          >
            <img
              src="/company-logo-transparent.png"
              alt="Ashoka Logo"
              onError={(e) => {
                e.currentTarget.src = '/company-logo.png';
              }}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'contain',
                filter: isDark ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' : 'none'
              }}
            />
          </div>

          {/* AMS TEXT: ALWAYS 100% VISIBLE IN BOTH DARK AND LIGHT MODES */}
          <div
            style={{
              fontSize: '1.55rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              marginTop: '8px',
              color: isDark ? '#ffffff' : '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
            }}
          >
            <span>AMS</span>
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: isDark ? '#94a3b8' : '#475569',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}
          >
            Ashoka Management System
          </div>
        </div>

        {/* MIDDLE SECTION: 3 COLUMNS + INTERACTIVE SVG NEURAL RAYS */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* SVG Animated Glowing Energy Streams between Central Circle and Nodes */}
          <svg
            className="ams-hub-svg-layer"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '820px',
              height: '320px',
              pointerEvents: 'none',
              zIndex: 1
            }}
            viewBox="0 0 820 320"
          >
            <defs>
              <linearGradient id="streamGradTeknik" x1="100%" y1="50%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="streamGradLegal" x1="100%" y1="50%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="streamGradMarketing" x1="0%" y1="50%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="streamGradHr" x1="0%" y1="50%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Line to Teknik (Left Top) */}
            <path
              d="M 330 140 C 270 120, 220 80, 160 70"
              fill="none"
              stroke={hoveredNode === 'teknik' ? 'url(#streamGradTeknik)' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15, 23, 42, 0.15)')}
              strokeWidth={hoveredNode === 'teknik' ? '2.5' : '1.5'}
              strokeDasharray={hoveredNode === 'teknik' ? '6 4' : 'none'}
              style={{
                animation: hoveredNode === 'teknik' ? 'streamDash 1.2s linear infinite' : 'none',
                transition: 'stroke 0.3s, stroke-width 0.3s'
              }}
            />

            {/* Line to Legal (Left Bottom) */}
            <path
              d="M 330 180 C 270 200, 220 240, 160 250"
              fill="none"
              stroke={hoveredNode === 'legal' ? 'url(#streamGradLegal)' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15, 23, 42, 0.15)')}
              strokeWidth={hoveredNode === 'legal' ? '2.5' : '1.5'}
              strokeDasharray={hoveredNode === 'legal' ? '6 4' : 'none'}
              style={{
                animation: hoveredNode === 'legal' ? 'streamDash 1.2s linear infinite' : 'none',
                transition: 'stroke 0.3s, stroke-width 0.3s'
              }}
            />

            {/* Line to Marketing (Right Top) */}
            <path
              d="M 490 140 C 550 120, 600 80, 660 70"
              fill="none"
              stroke={hoveredNode === 'marketing' ? 'url(#streamGradMarketing)' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15, 23, 42, 0.15)')}
              strokeWidth={hoveredNode === 'marketing' ? '2.5' : '1.5'}
              strokeDasharray={hoveredNode === 'marketing' ? '6 4' : 'none'}
              style={{
                animation: hoveredNode === 'marketing' ? 'streamDash 1.2s linear infinite' : 'none',
                transition: 'stroke 0.3s, stroke-width 0.3s'
              }}
            />

            {/* Line to HR & GA (Right Bottom) */}
            <path
              d="M 490 180 C 550 200, 600 240, 660 250"
              fill="none"
              stroke={hoveredNode === 'hr-ga' ? 'url(#streamGradHr)' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15, 23, 42, 0.15)')}
              strokeWidth={hoveredNode === 'hr-ga' ? '2.5' : '1.5'}
              strokeDasharray={hoveredNode === 'hr-ga' ? '6 4' : 'none'}
              style={{
                animation: hoveredNode === 'hr-ga' ? 'streamDash 1.2s linear infinite' : 'none',
                transition: 'stroke 0.3s, stroke-width 0.3s'
              }}
            />
          </svg>

          {/* 3 Columns Flex Layout */}
          <div
            className="ams-hub-middle-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              gap: '36px',
              position: 'relative',
              zIndex: 5
            }}
          >
            {/* Left Column (Teknik & legal) */}
            <div
              className="ams-hub-side-col"
              style={{
                width: '230px',
                height: '290px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}
            >
              {/* Node: Teknik */}
              <button
                type="button"
                className="ams-hub-node-btn"
                onClick={() => onSelectModule('teknik')}
                onMouseEnter={() => setHoveredNode('teknik')}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  background: isDark 
                    ? (hoveredNode === 'teknik' ? 'rgba(2, 132, 199, 0.2)' : 'rgba(15, 23, 42, 0.75)')
                    : (hoveredNode === 'teknik' ? '#f0f9ff' : '#ffffff'),
                  border: hoveredNode === 'teknik' 
                    ? '2px solid #0284c7' 
                    : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0'),
                  borderRadius: '16px',
                  padding: '12px 20px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: hoveredNode === 'teknik'
                    ? '0 12px 30px rgba(2, 132, 199, 0.35), 0 0 15px rgba(2, 132, 199, 0.2)'
                    : (isDark ? '0 6px 20px rgba(0, 0, 0, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.06)'),
                  cursor: 'pointer',
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ 
                    fontSize: '1.45rem', 
                    fontWeight: 900, 
                    color: hoveredNode === 'teknik' ? '#0284c7' : (isDark ? '#f8fafc' : '#0f172a'), 
                    lineHeight: 1.1 
                  }}>
                    Teknik
                  </div>
                  <div style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    color: hoveredNode === 'teknik' ? '#0369a1' : (isDark ? '#94a3b8' : '#64748b'), 
                    marginTop: '4px' 
                  }}>
                    Konstruksi & Proyek
                  </div>
                </div>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: hoveredNode === 'teknik' ? '#0284c7' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#e0f2fe'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: hoveredNode === 'teknik' ? '#ffffff' : '#0284c7',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Wrench size={18} />
                </div>
              </button>

              {/* Node: legal */}
              <button
                type="button"
                className="ams-hub-node-btn"
                onClick={() => onSelectModule('legal')}
                onMouseEnter={() => setHoveredNode('legal')}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  background: isDark 
                    ? (hoveredNode === 'legal' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(15, 23, 42, 0.75)')
                    : (hoveredNode === 'legal' ? '#faf5ff' : '#ffffff'),
                  border: hoveredNode === 'legal' 
                    ? '2px solid #c084fc' 
                    : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0'),
                  borderRadius: '16px',
                  padding: '12px 20px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: hoveredNode === 'legal'
                    ? '0 12px 30px rgba(192, 132, 252, 0.35), 0 0 15px rgba(192, 132, 252, 0.2)'
                    : (isDark ? '0 6px 20px rgba(0, 0, 0, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.06)'),
                  cursor: 'pointer',
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ 
                    fontSize: '1.45rem', 
                    fontWeight: 900, 
                    color: hoveredNode === 'legal' ? '#c084fc' : (isDark ? '#f8fafc' : '#0f172a'), 
                    lineHeight: 1.1 
                  }}>
                    legal
                  </div>
                  <div style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    color: hoveredNode === 'legal' ? '#a855f7' : (isDark ? '#94a3b8' : '#64748b'), 
                    marginTop: '4px' 
                  }}>
                    SPK, Izin & Legal
                  </div>
                </div>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: hoveredNode === 'legal' ? '#9333ea' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#f3e8ff'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: hoveredNode === 'legal' ? '#ffffff' : '#9333ea',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Scale size={18} />
                </div>
              </button>
            </div>

            {/* Center Circle: Ashoka Management System (The Gemini Nexus) */}
            <div
              className="ams-hub-circle-box"
              style={{
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                cursor: 'default'
              }}
            >
              {/* Outer Orbiting Ring 1 (Rotates smoothly) */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-14px',
                  borderRadius: '50%',
                  border: isDark ? '1.5px dashed rgba(56, 189, 248, 0.35)' : '1.5px dashed rgba(2, 132, 199, 0.45)',
                  animation: 'spinSlow 28s linear infinite',
                  pointerEvents: 'none'
                }}
              >
                {/* Orbiting Satellite Dot */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isDark ? '#38bdf8' : '#0284c7',
                    boxShadow: isDark ? '0 0 10px #38bdf8, 0 0 20px #38bdf8' : '0 0 8px rgba(2, 132, 199, 0.6)'
                  }}
                />
              </div>

              {/* Outer Orbiting Ring 2 (Counter rotates with pulse) */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-28px',
                  borderRadius: '50%',
                  border: isDark ? '1px solid rgba(168, 85, 247, 0.2)' : '1px solid rgba(147, 51, 234, 0.25)',
                  animation: 'pulseRing 4s ease-in-out infinite',
                  pointerEvents: 'none'
                }}
              />

              {/* Main Glowing Frosted Glass Circle Body */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: isDark 
                    ? 'radial-gradient(circle at 35% 35%, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.98) 100%)' 
                    : '#ffffff',
                  border: isDark ? '2.5px solid rgba(255, 255, 255, 0.2)' : '2.5px solid #0f172a',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDark
                    ? '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 0 30px rgba(56, 189, 248, 0.08), 0 0 40px rgba(99, 102, 241, 0.25)'
                    : '0 15px 40px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.9), 0 0 25px rgba(2, 132, 199, 0.12)',
                  transition: 'all 0.35s ease',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}
              >
                {/* Gemini Star Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    color: isDark ? '#38bdf8' : '#0284c7',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase'
                  }}
                >
                  <span>Central Hub</span>
                </div>

                {/* Main Hub Title: Crisp & Bold in Both Themes */}
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    lineHeight: 1.18,
                    letterSpacing: '0.01em',
                    color: isDark ? '#ffffff' : '#0f172a'
                  }}
                >
                  <div>Ashoka</div>
                  <div style={{ 
                    color: isDark ? '#38bdf8' : '#0284c7',
                    filter: isDark ? 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.4))' : 'none'
                  }}>
                    Management
                  </div>
                  <div>System</div>
                </div>

                <div
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: isDark ? '#94a3b8' : '#64748b',
                    marginTop: '8px',
                    letterSpacing: '0.08em'
                  }}
                >
                  CORE ARCHITECTURE
                </div>
              </div>
            </div>

            {/* Right Column (Marketing & HR & GA) */}
            <div
              className="ams-hub-side-col"
              style={{
                width: '230px',
                height: '290px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              {/* Node: Marketing */}
              <button
                type="button"
                className="ams-hub-node-btn"
                onClick={() => onSelectModule('marketing')}
                onMouseEnter={() => setHoveredNode('marketing')}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  background: isDark 
                    ? (hoveredNode === 'marketing' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.75)')
                    : (hoveredNode === 'marketing' ? '#f0f9ff' : '#ffffff'),
                  border: hoveredNode === 'marketing' 
                    ? '2px solid #38bdf8' 
                    : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0'),
                  borderRadius: '16px',
                  padding: '12px 20px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: hoveredNode === 'marketing'
                    ? '0 12px 30px rgba(56, 189, 248, 0.35), 0 0 15px rgba(56, 189, 248, 0.2)'
                    : (isDark ? '0 6px 20px rgba(0, 0, 0, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.06)'),
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: hoveredNode === 'marketing' ? '#38bdf8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#e0f2fe'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: hoveredNode === 'marketing' ? '#ffffff' : '#0284c7',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div style={{ 
                    fontSize: '1.45rem', 
                    fontWeight: 900, 
                    color: hoveredNode === 'marketing' ? '#38bdf8' : (isDark ? '#f8fafc' : '#0f172a'), 
                    lineHeight: 1.1 
                  }}>
                    Marketing
                  </div>
                  <div style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    color: hoveredNode === 'marketing' ? '#0284c7' : (isDark ? '#94a3b8' : '#64748b'), 
                    marginTop: '4px' 
                  }}>
                    Penjualan Unit
                  </div>
                </div>
              </button>

              {/* Node: HR & GA */}
              <button
                type="button"
                className="ams-hub-node-btn"
                onClick={() => onSelectModule('hr-ga')}
                onMouseEnter={() => setHoveredNode('hr-ga')}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  background: isDark 
                    ? (hoveredNode === 'hr-ga' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.75)')
                    : (hoveredNode === 'hr-ga' ? '#faf5ff' : '#ffffff'),
                  border: hoveredNode === 'hr-ga' 
                    ? '2px solid #a855f7' 
                    : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0'),
                  borderRadius: '16px',
                  padding: '12px 20px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: hoveredNode === 'hr-ga'
                    ? '0 12px 30px rgba(168, 85, 247, 0.35), 0 0 15px rgba(168, 85, 247, 0.2)'
                    : (isDark ? '0 6px 20px rgba(0, 0, 0, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.06)'),
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: hoveredNode === 'hr-ga' ? '#a855f7' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#f3e8ff'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: hoveredNode === 'hr-ga' ? '#ffffff' : '#9333ea',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ 
                    fontSize: '1.45rem', 
                    fontWeight: 900, 
                    color: hoveredNode === 'hr-ga' ? '#a855f7' : (isDark ? '#f8fafc' : '#0f172a'), 
                    lineHeight: 1.1 
                  }}>
                    HR & GA
                  </div>
                  <div style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    color: hoveredNode === 'hr-ga' ? '#9333ea' : (isDark ? '#94a3b8' : '#64748b'), 
                    marginTop: '4px' 
                  }}>
                    SDM & Aset Kantor
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: FINANCE & TO -DO LIST */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '36px',
            gap: '12px',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Node: Finance (Berwarna Biru, Di Atas TO -DO LIST) */}
          <button
            type="button"
            className="ams-hub-node-btn"
            onClick={() => onSelectModule('finance')}
            onMouseEnter={() => setHoveredNode('finance')}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
              background: isDark 
                ? (hoveredNode === 'finance' ? 'rgba(2, 132, 199, 0.2)' : 'rgba(15, 23, 42, 0.75)')
                : (hoveredNode === 'finance' ? '#f0f9ff' : '#ffffff'),
              border: hoveredNode === 'finance' 
                ? '2px solid #0284c7' 
                : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0'),
              borderRadius: '14px',
              padding: '7px 22px',
              minWidth: '220px',
              backdropFilter: 'blur(16px)',
              boxShadow: hoveredNode === 'finance'
                ? '0 10px 25px rgba(2, 132, 199, 0.35), 0 0 15px rgba(2, 132, 199, 0.2)'
                : (isDark ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.06)'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: hoveredNode === 'finance' ? '#0284c7' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#e0f2fe'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: hoveredNode === 'finance' ? '#ffffff' : '#0284c7',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              <Wallet size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 900, 
                color: hoveredNode === 'finance' ? '#38bdf8' : (isDark ? '#f8fafc' : '#0f172a'), 
                lineHeight: 1.1 
              }}>
                Finance
              </div>
              <div style={{ 
                fontSize: '0.64rem', 
                fontWeight: 700, 
                color: hoveredNode === 'finance' ? '#0284c7' : (isDark ? '#94a3b8' : '#64748b'), 
                marginTop: '2px' 
              }}>
                Keuangan & Kas Bank
              </div>
            </div>
          </button>

          {/* Node: TO -DO LIST */}
          <button
            type="button"
            className="ams-hub-node-btn"
            onClick={() => onSelectModule('todo-attendance')}
            onMouseEnter={() => setHoveredNode('todo-attendance')}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
              background: isDark 
                ? (hoveredNode === 'todo-attendance' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(15, 23, 42, 0.75)')
                : (hoveredNode === 'todo-attendance' ? '#fdf2f8' : '#ffffff'),
              border: hoveredNode === 'todo-attendance' 
                ? '2px solid #ec4899' 
                : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0'),
              borderRadius: '14px',
              padding: '7px 22px',
              minWidth: '220px',
              backdropFilter: 'blur(16px)',
              boxShadow: hoveredNode === 'todo-attendance'
                ? '0 10px 25px rgba(236, 72, 153, 0.35), 0 0 15px rgba(236, 72, 153, 0.2)'
                : (isDark ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.06)'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: hoveredNode === 'todo-attendance' ? '#ec4899' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#fce7f3'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: hoveredNode === 'todo-attendance' ? '#ffffff' : '#db2777',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              <CheckSquare size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 900, 
                color: hoveredNode === 'todo-attendance' ? '#ec4899' : (isDark ? '#f8fafc' : '#0f172a'), 
                lineHeight: 1.1 
              }}>
                TO -DO LIST
              </div>
              <div style={{ 
                fontSize: '0.64rem', 
                fontWeight: 700, 
                color: hoveredNode === 'todo-attendance' ? '#db2777' : (isDark ? '#94a3b8' : '#64748b'), 
                marginTop: '2px' 
              }}>
                Agenda Kerja Harian
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
