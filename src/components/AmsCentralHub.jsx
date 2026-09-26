import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  Wrench, 
  Scale, 
  TrendingUp, 
  Users, 
  Wallet, 
  CheckSquare,
  Sun,
  Moon
} from 'lucide-react';
import { GeminiCursorCanvas } from './GeminiCursorCanvas';

export const AmsCentralHub = ({ 
  onSelectModule, 
  onOpenLoginModal, 
  currentUser, 
  isLanding = false,
  theme: externalTheme,
  onToggleTheme: externalToggleTheme
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
      color: '#f97316', 
      lightColor: '#ea580c',
      icon: Wrench
    },
    { 
      key: 'legal', 
      label: 'legal', 
      sub: 'SPK, Izin & Legalitas', 
      desc: 'Legal Corporate, Perizinan & Dokumen', 
      color: '#10b981', 
      lightColor: '#059669',
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
      color: '#f59e0b', 
      lightColor: '#d97706',
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
        minHeight: isLanding ? '100vh' : 'auto',
        background: isDark ? '#080c14' : '#f8fafc',
        color: isDark ? '#ffffff' : '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem',
        position: 'relative',
        overflow: 'hidden',
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
        {/* Theme Toggle (Dark Gemini / Bright Aura) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Ganti ke Mode Terang (Putih)' : 'Ganti ke Mode Gemini Gelap'}
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
              border: isDark ? '1.5px solid rgba(245, 158, 11, 0.45)' : '1.5px solid #f59e0b',
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
              boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 15px rgba(245, 158, 11, 0.15)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#f59e0b';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = isDark ? 'rgba(245, 158, 11, 0.45)' : '#f59e0b';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <UserCheck size={15} color="#f59e0b" />
            <span>Pilih Akun Staf / Login Khusus</span>
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
            marginBottom: '26px',
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
              width: '160px',
              height: '160px',
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
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
              border: isDark ? '1.5px solid rgba(255, 255, 255, 0.18)' : '1.5px solid #e2e8f0',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isDark 
                ? '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.25)' 
                : '0 12px 30px rgba(0, 0, 0, 0.08), 0 0 20px rgba(245, 158, 11, 0.15)',
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
                width: '66px',
                height: '66px',
                objectFit: 'contain',
                filter: isDark ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' : 'none'
              }}
            />
          </div>

          {/* AMS TEXT: ALWAYS 100% VISIBLE IN BOTH DARK AND LIGHT MODES */}
          <div
            style={{
              fontSize: '1.85rem',
              fontWeight: 900,
              letterSpacing: '0.06em',
              marginTop: '12px',
              color: isDark ? '#ffffff' : '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
            }}
          >
            <span>AMS</span>
            <Sparkles size={18} color="#f59e0b" className="gemini-sparkle-icon" />
          </div>

          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: isDark ? '#94a3b8' : '#475569',
              letterSpacing: '0.14em',
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
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="streamGradLegal" x1="100%" y1="50%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" />
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
                    ? (hoveredNode === 'teknik' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(15, 23, 42, 0.75)')
                    : (hoveredNode === 'teknik' ? '#fff7ed' : '#ffffff'),
                  border: hoveredNode === 'teknik' 
                    ? '2px solid #f97316' 
                    : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0'),
                  borderRadius: '16px',
                  padding: '12px 20px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: hoveredNode === 'teknik'
                    ? '0 12px 30px rgba(249, 115, 22, 0.35), 0 0 15px rgba(249, 115, 22, 0.2)'
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
                    color: hoveredNode === 'teknik' ? '#f97316' : (isDark ? '#f8fafc' : '#0f172a'), 
                    lineHeight: 1.1 
                  }}>
                    Teknik
                  </div>
                  <div style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    color: hoveredNode === 'teknik' ? '#ea580c' : (isDark ? '#94a3b8' : '#64748b'), 
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
                    background: hoveredNode === 'teknik' ? '#f97316' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffedd5'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: hoveredNode === 'teknik' ? '#ffffff' : '#ea580c',
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
                    ? (hoveredNode === 'legal' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.75)')
                    : (hoveredNode === 'legal' ? '#f0fdf4' : '#ffffff'),
                  border: hoveredNode === 'legal' 
                    ? '2px solid #10b981' 
                    : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0'),
                  borderRadius: '16px',
                  padding: '12px 20px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: hoveredNode === 'legal'
                    ? '0 12px 30px rgba(16, 185, 129, 0.35), 0 0 15px rgba(16, 185, 129, 0.2)'
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
                    color: hoveredNode === 'legal' ? '#10b981' : (isDark ? '#f8fafc' : '#0f172a'), 
                    lineHeight: 1.1 
                  }}>
                    legal
                  </div>
                  <div style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    color: hoveredNode === 'legal' ? '#059669' : (isDark ? '#94a3b8' : '#64748b'), 
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
                    background: hoveredNode === 'legal' ? '#10b981' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#dcfce7'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: hoveredNode === 'legal' ? '#ffffff' : '#059669',
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
                    gap: '4px',
                    marginBottom: '8px',
                    color: isDark ? '#38bdf8' : '#0284c7',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase'
                  }}
                >
                  <Sparkles size={14} className="gemini-sparkle-icon" color={isDark ? '#38bdf8' : '#0284c7'} />
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
            marginTop: '28px',
            gap: '14px',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Node: Finance */}
          <button
            type="button"
            className="ams-hub-node-btn"
            onClick={() => onSelectModule('finance')}
            onMouseEnter={() => setHoveredNode('finance')}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
              background: isDark 
                ? (hoveredNode === 'finance' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.75)')
                : (hoveredNode === 'finance' ? '#fefce8' : '#ffffff'),
              border: hoveredNode === 'finance' 
                ? '2px solid #f59e0b' 
                : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0'),
              borderRadius: '16px',
              padding: '10px 28px',
              backdropFilter: 'blur(16px)',
              boxShadow: hoveredNode === 'finance'
                ? '0 12px 30px rgba(245, 158, 11, 0.35), 0 0 15px rgba(245, 158, 11, 0.2)'
                : (isDark ? '0 6px 20px rgba(0, 0, 0, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.06)'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: hoveredNode === 'finance' ? '#f59e0b' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#fef3c7'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: hoveredNode === 'finance' ? '#000000' : '#d97706',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              <Wallet size={17} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '1.4rem', 
                fontWeight: 900, 
                color: hoveredNode === 'finance' ? '#f59e0b' : (isDark ? '#f8fafc' : '#0f172a'), 
                lineHeight: 1.1 
              }}>
                Finance
              </div>
              <div style={{ 
                fontSize: '0.66rem', 
                fontWeight: 700, 
                color: hoveredNode === 'finance' ? '#d97706' : (isDark ? '#94a3b8' : '#64748b'), 
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
              borderRadius: '16px',
              padding: '10px 28px',
              backdropFilter: 'blur(16px)',
              boxShadow: hoveredNode === 'todo-attendance'
                ? '0 12px 30px rgba(236, 72, 153, 0.35), 0 0 15px rgba(236, 72, 153, 0.2)'
                : (isDark ? '0 6px 20px rgba(0, 0, 0, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.06)'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
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
              <CheckSquare size={17} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '1.4rem', 
                fontWeight: 900, 
                color: hoveredNode === 'todo-attendance' ? '#ec4899' : (isDark ? '#f8fafc' : '#0f172a'), 
                lineHeight: 1.1 
              }}>
                TO -DO LIST
              </div>
              <div style={{ 
                fontSize: '0.66rem', 
                fontWeight: 700, 
                color: hoveredNode === 'todo-attendance' ? '#db2777' : (isDark ? '#94a3b8' : '#64748b'), 
                marginTop: '2px' 
              }}>
                Agenda Kerja Harian
              </div>
            </div>
          </button>
        </div>

        {/* BOTTOM STATUS & HELPFUL HINT */}
        <div
          style={{
            marginTop: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.76rem',
            color: isDark ? '#94a3b8' : '#475569',
            fontWeight: 700,
            userSelect: 'none',
            zIndex: 10
          }}
        >
          <Sparkles size={15} color="#f59e0b" />
          <span>Gerakkan kursor untuk efek interaktif Gemini • Klik departemen untuk membuka modul</span>
        </div>
      </div>
    </div>
  );
};
