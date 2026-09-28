import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Mail,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GeminiCursorCanvas } from '../components/GeminiCursorCanvas';

export const LandingLogin = ({ onLoginSuccess }) => {
  const { users } = useApp();
  
  const [identity, setIdentity] = useState('ams@gmail.com');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // State untuk animasi logo timbul lalu tenggelam
  const [isTransitioning, setIsTransitioning] = useState(false);

  const runEnterTransition = (targetEmail) => {
    setIsTransitioning(true);

    // Animasi logo timbul lalu tenggelam dibuat lebih tenang dan lambat (3.2 detik)
    setTimeout(() => {
      setIsTransitioning(false);
      onLoginSuccess('hub', targetEmail);
    }, 3250);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const emailTrimmed = (identity || '').trim().toLowerCase();
    const passTrimmed = (password || '').trim();

    // Akun Yazid Hizbullah (Direktur Utama): email ams@gmail.com, sandi 123
    if (emailTrimmed === 'ams@gmail.com' || emailTrimmed === 'yazid@ams.co.id') {
      if (passTrimmed === '123' || passTrimmed === 'password123') {
        setTimeout(() => {
          setLoading(false);
          runEnterTransition('ams@gmail.com');
        }, 150);
        return;
      } else {
        setTimeout(() => {
          setLoading(false);
          setErrorMsg('Kata sandi salah! Masukkan sandi yang sesuai (Sandi: 123).');
        }, 200);
        return;
      }
    }

    // Akun resmi lainnya dalam sistem jika dimasukkan
    const matchedUser = (users || []).find((u) => u.email.toLowerCase() === emailTrimmed);
    if (matchedUser) {
      if (passTrimmed === '123' || passTrimmed === 'password123') {
        setTimeout(() => {
          setLoading(false);
          runEnterTransition(matchedUser.email);
        }, 150);
        return;
      } else {
        setTimeout(() => {
          setLoading(false);
          setErrorMsg('Kata sandi salah! Masukkan kata sandi yang sesuai.');
        }, 200);
        return;
      }
    }

    // Email tidak terdaftar
    setTimeout(() => {
      setLoading(false);
      setErrorMsg('Email tidak terdaftar dalam sistem AMS! Gunakan akun: ams@gmail.com (sandi: 123).');
    }, 200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#080c14',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style>
        {`
          @keyframes logoTimbulTenggelam {
            0% {
              opacity: 0;
              transform: scale(0.65) translateY(55px);
              filter: blur(12px) drop-shadow(0 0 0px rgba(56, 189, 248, 0));
            }
            30% {
              opacity: 1;
              transform: scale(1.05) translateY(-5px);
              filter: blur(0px) drop-shadow(0 20px 40px rgba(56, 189, 248, 0.55));
            }
            45%, 65% {
              opacity: 1;
              transform: scale(1) translateY(0);
              filter: blur(0px) drop-shadow(0 15px 35px rgba(56, 189, 248, 0.45));
            }
            80% {
              opacity: 0.9;
              transform: scale(0.97) translateY(10px);
              filter: blur(2px) drop-shadow(0 10px 25px rgba(56, 189, 248, 0.3));
            }
            100% {
              opacity: 0;
              transform: scale(0.65) translateY(65px);
              filter: blur(14px) drop-shadow(0 0 0px rgba(56, 189, 248, 0));
            }
          }

          @keyframes haloPulse {
            0%, 100% {
              transform: scale(0.85);
              opacity: 0.3;
            }
            45%, 65% {
              transform: scale(1.25);
              opacity: 0.85;
            }
          }
        `}
      </style>

      {/* 1. DYNAMIC INTERACTIVE GEMINI CANVAS (Cursor Spotlight & Star Particles) */}
      <GeminiCursorCanvas theme="dark" />

      {/* 2. AMBIENT GLOW BACKDROP */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, rgba(56, 189, 248, 0.06) 50%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* 3. MAIN LOGIN CONTAINER */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* HEADER BRANDING & LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '84px',
            height: '84px',
            margin: '0 auto 14px auto',
            borderRadius: '22px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 25px rgba(2, 132, 199, 0.4)'
          }}>
            <img
              src="/company-logo-transparent.png"
              alt="Ashoka Logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
          </div>

          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.04em',
            margin: '0 0 4px 0',
            textTransform: 'uppercase'
          }}>
            PT. YAZFI GEMA PERSADA / PT. YAZFI SETIA PERSADA
          </h1>
          <div style={{
            fontSize: '0.84rem',
            fontWeight: 800,
            color: '#38bdf8',
            letterSpacing: '0.05em'
          }}>
            ASHOKA PROPERTY ERP & ASSET MANAGEMENT SYSTEM (AMS)
          </div>
          <p style={{
            fontSize: '0.78rem',
            color: '#94a3b8',
            marginTop: '5px',
            marginBottom: 0
          }}>
            Pusat Operasional Digital Terpadu Seluruh Divisi Properti & Konstruksi
          </p>
        </div>

        {/* LOGIN GLASS CARD */}
        <div
          className="glass-card"
          style={{
            background: '#0f172a',
            border: '1.5px solid rgba(56, 189, 248, 0.28)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 40px rgba(2, 132, 199, 0.22)',
            borderRadius: '20px',
            padding: '2rem 1.75rem',
            color: '#ffffff'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.02em',
              margin: '0 0 4px 0'
            }}>
              MASUK KE SISTEM AMS
            </h2>
            <p style={{
              fontSize: '0.78rem',
              color: '#94a3b8',
              margin: 0
            }}>
              Silakan masukkan email akun dan kata sandi Anda
            </p>
          </div>

          {errorMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.18)',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              color: '#f87171',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* FORM LOGIN */}
          <form onSubmit={handleSubmit}>
            {/* Field 1: Email */}
            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>
                Email Akun:
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{
                    paddingLeft: '38px',
                    background: '#090d16',
                    borderColor: '#334155',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    borderRadius: '9px',
                    height: '44px'
                  }}
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="ams@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Field 2: Kata Sandi */}
            <div className="form-group" style={{ marginBottom: '1.35rem' }}>
              <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>
                Kata Sandi (Password):
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{
                    paddingLeft: '38px',
                    paddingRight: '38px',
                    background: '#090d16',
                    borderColor: '#334155',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    borderRadius: '9px',
                    height: '44px'
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || isTransitioning}
              style={{
                width: '100%',
                padding: '0.85rem',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 900,
                border: '1px solid #38bdf8',
                borderRadius: '10px',
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.45)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                height: '46px'
              }}
            >
              {loading ? (
                <span>Memverifikasi Akses...</span>
              ) : (
                <>
                  <span>MASUK KE SISTEM AMS</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper Badge */}
          <div style={{
            marginTop: '1.25rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '9px',
            background: 'rgba(2, 132, 199, 0.1)',
            border: '1px dashed rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            color: '#94a3b8'
          }}>
            <span>Akun Resmi Utama:</span>
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>ams@gmail.com (sandi: 123)</span>
          </div>
        </div>

        {/* FOOTER COPYRIGHT */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.74rem',
          color: '#64748b'
        }}>
          &copy; 2026 Ashoka Asset Management System (AMS) &bull; PT Yazfi Gema Persada / PT Yazfi Setia Persada. All rights reserved.
        </div>
      </div>

      {/* 4. CINEMATIC LOGO "TIMBUL LALU TENGGELAM" TRANSITION OVERLAY */}
      {isTransitioning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#080c14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Animated Background Canvas */}
          <GeminiCursorCanvas theme="dark" />

          {/* Central Logo & AMS Container (Timbul Lalu Tenggelam) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'logoTimbulTenggelam 3.2s cubic-bezier(0.35, 0, 0.25, 1) forwards'
            }}
          >
            {/* Ambient Radial Halo */}
            <div
              style={{
                position: 'absolute',
                top: '50px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)',
                filter: 'blur(22px)',
                pointerEvents: 'none',
                animation: 'haloPulse 3.2s ease-in-out forwards'
              }}
            />

            {/* Logo Badge (Matching Central Hub) */}
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '26px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1.5px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.28)',
                position: 'relative',
                zIndex: 2
              }}
            >
              <img
                src="/company-logo-transparent.png"
                alt="Ashoka Logo"
                style={{
                  width: '74px',
                  height: '74px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
                }}
              />
            </div>

            {/* Ashoka Management System Text Under Logo */}
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                marginTop: '15px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(56, 189, 248, 0.6)',
                position: 'relative',
                zIndex: 2
              }}
            >
              <span>Ashoka Management System</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
