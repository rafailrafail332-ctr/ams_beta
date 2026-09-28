import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  Zap,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GeminiCursorCanvas } from '../components/GeminiCursorCanvas';

export const LandingLogin = ({ onLoginSuccess }) => {
  const { users, getAvatarUrl } = useApp();
  const yazidUser = users.find(u => u.email.toLowerCase() === 'yazid@ams.co.id') || users[1] || users[0];
  
  const [identity, setIdentity] = useState(yazidUser?.email || 'yazid@ams.co.id');
  const [activeName, setActiveName] = useState(yazidUser?.name || 'Yazid Hizbullah, S.E.,S.T');
  const [activeRole, setActiveRole] = useState(yazidUser?.role || 'Direktur Utama & Finance Director');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchAccount, setSearchAccount] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Filtered list of 17 Official Accounts
  const filteredUsers = (users || []).filter((u) => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchAccount.toLowerCase()) || 
                          (u.role || '').toLowerCase().includes(searchAccount.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(searchAccount.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterCategory === 'all') return true;
    if (filterCategory === 'pimpinan') {
      const r = (u.role || '').toLowerCase();
      return r.includes('direktur') || r.includes('admin') || r.includes('manager') || r.includes('head');
    }
    if (filterCategory === 'staf') {
      const r = (u.role || '').toLowerCase();
      return !r.includes('direktur') && !r.includes('admin') && !r.includes('manager') && !r.includes('head');
    }
    return true;
  });

  // Select account from grid
  const handleSelectAccount = (u) => {
    setErrorMsg('');
    setIdentity(u.email);
    setActiveName(u.name);
    setActiveRole(u.role);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('hub', identity);
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
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* 3. MAIN LOGIN CONTAINER */}
      <div style={{
        width: '100%',
        maxWidth: '820px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* HEADER BRANDING & LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 12px auto',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1.5px solid rgba(56, 189, 248, 0.3)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(2, 132, 199, 0.35)'
          }}>
            <img
              src="/company-logo-transparent.png"
              alt="Ashoka Logo"
              style={{ width: '56px', height: '56px', objectFit: 'contain' }}
            />
          </div>

          <h1 style={{
            fontSize: '1.35rem',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.04em',
            margin: '0 0 4px 0',
            textTransform: 'uppercase'
          }}>
            PT. YAZFI GEMA PERSADA / PT. YAZFI SETIA PERSADA
          </h1>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#38bdf8',
            letterSpacing: '0.05em'
          }}>
            ASHOKA PROPERTY ERP & ASSET MANAGEMENT SYSTEM (AMS)
          </div>
          <p style={{
            fontSize: '0.78rem',
            color: '#94a3b8',
            marginTop: '4px',
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
            border: '1.5px solid rgba(56, 189, 248, 0.25)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(2, 132, 199, 0.2)',
            borderRadius: '20px',
            padding: '1.75rem',
            color: '#ffffff'
          }}
        >
          {errorMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* SECTION 1: PILIH AKUN 17 KARYAWAN */}
          <div style={{ marginBottom: '1.35rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <Zap size={16} color="#38bdf8" />
                <span>Pilih Akun (Total {users.length} Akun Resmi Aktif):</span>
              </div>

              {/* Filter Category Tabs */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button 
                  type="button"
                  onClick={() => setFilterCategory('all')} 
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    borderRadius: '6px',
                    border: filterCategory === 'all' ? '1px solid #38bdf8' : '1px solid #334155',
                    background: filterCategory === 'all' ? '#0284c7' : '#1e293b',
                    color: filterCategory === 'all' ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Semua ({users.length})
                </button>
                <button 
                  type="button"
                  onClick={() => setFilterCategory('pimpinan')} 
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    borderRadius: '6px',
                    border: filterCategory === 'pimpinan' ? '1px solid #38bdf8' : '1px solid #334155',
                    background: filterCategory === 'pimpinan' ? '#0284c7' : '#1e293b',
                    color: filterCategory === 'pimpinan' ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Direksi & Pimpinan
                </button>
                <button 
                  type="button"
                  onClick={() => setFilterCategory('staf')} 
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    borderRadius: '6px',
                    border: filterCategory === 'staf' ? '1px solid #38bdf8' : '1px solid #334155',
                    background: filterCategory === 'staf' ? '#0284c7' : '#1e293b',
                    color: filterCategory === 'staf' ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Staf Operasional
                </button>
              </div>
            </div>

            {/* Search Account Box */}
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari nama karyawan atau jabatan (misal: Yazid, Rafail, Adhi, Salma, Kholidin)..."
                value={searchAccount}
                onChange={(e) => setSearchAccount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem 0.55rem 34px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#090d16',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* SCROLLABLE GRID OF ALL 17 ACCOUNTS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(235px, 1fr))',
              gap: '0.55rem',
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '6px',
              borderRadius: '10px',
              background: '#090d16',
              border: '1px solid #1e293b'
            }}>
              {filteredUsers.map((acc) => {
                const isSelected = identity.toLowerCase() === acc.email.toLowerCase();
                const avatarSrc = getAvatarUrl(acc);

                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #0284c7' : '1px solid #1e293b',
                      background: isSelected ? 'rgba(2, 132, 199, 0.25)' : '#1e293b',
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.18s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      boxShadow: isSelected ? '0 0 14px rgba(2, 132, 199, 0.35)' : 'none'
                    }}
                  >
                    <img 
                      src={avatarSrc} 
                      alt={acc.name} 
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: isSelected ? '2px solid #38bdf8' : '1.5px solid #475569',
                        flexShrink: 0
                      }} 
                    />
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <div style={{
                        fontWeight: 800,
                        color: isSelected ? '#ffffff' : '#f1f5f9',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        fontSize: '0.8rem'
                      }}>
                        {acc.name}
                      </div>
                      <div style={{
                        fontSize: '0.68rem',
                        color: isSelected ? '#38bdf8' : '#94a3b8',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}>
                        {acc.role}
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                    ) : (
                      <ArrowRight size={13} color="#475569" style={{ flexShrink: 0 }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: FORM LOGIN */}
          <form onSubmit={handleSubmit} style={{ borderTop: '1px solid #1e293b', paddingTop: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* Field 1: Email / Akun Terpilih */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>
                  Email / Akun Terpilih:
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                  <input
                    type="email"
                    className="form-control"
                    style={{
                      paddingLeft: '38px',
                      background: '#090d16',
                      borderColor: '#334155',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      borderRadius: '8px'
                    }}
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    placeholder="masukkan email..."
                    required
                  />
                </div>
              </div>

              {/* Field 2: Kata Sandi */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>
                  Kata Sandi (Password):
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{
                      paddingLeft: '38px',
                      paddingRight: '38px',
                      background: '#090d16',
                      borderColor: '#334155',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      borderRadius: '8px'
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
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
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <span>Memverifikasi Akses...</span>
              ) : (
                <>
                  <span>MASUK KE SISTEM AMS (SEBAGAI {activeRole.toUpperCase()})</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* FOOTER COPYRIGHT */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.25rem',
          fontSize: '0.74rem',
          color: '#64748b'
        }}>
          &copy; 2025 Ashoka Asset Management System (AMS) &bull; PT Yazfi Gema Persada / PT Yazfi Setia Persada. All rights reserved.
        </div>
      </div>
    </div>
  );
};
