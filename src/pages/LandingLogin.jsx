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
  Users as UsersIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingLogin = ({ onLoginSuccess }) => {
  const { users, getAvatarUrl } = useApp();
  const yazidUser = users.find(u => u.email.toLowerCase() === 'yazid@ams.co.id') || users[1] || users[0];
  
  const [identity, setIdentity] = useState(yazidUser?.email || 'yazid@ams.co.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState(yazidUser?.role || 'Direktur Utama & Finance Director');
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

  // 1-Click Instant Quick Login Function
  const handleInstantLoginRole = (u) => {
    setErrorMsg('');
    setIdentity(u.email);
    setActiveRole(u.role);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('dashboard', u.email);
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('dashboard', identity);
    }, 200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(245, 158, 11, 0.15) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.12) 0%, transparent 50%)',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        opacity: 0.6
      }} />

      <div style={{
        width: '100%',
        maxWidth: '780px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Logo & Company Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <img 
              src="/company-logo.png" 
              alt="Ashoka Logo" 
              style={{
                width: '85px',
                height: '85px',
                objectFit: 'contain',
                borderRadius: '20px',
                background: '#ffffff',
                padding: '8px',
                boxShadow: '0 0 35px rgba(245, 158, 11, 0.45)',
                border: '2px solid rgba(245, 158, 11, 0.6)',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
            ASHOKA ENTERPRISE
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: 800, marginTop: '0.15rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Asset & Real Estate Management System (AMS)
          </p>
        </div>

        <div className="glass-card" style={{
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(245, 158, 11, 0.15)',
          borderRadius: '20px',
          padding: '1.75rem'
        }}>
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

          {/* QUICK INSTANT 1-CLICK DEMO LOGIN BUTTONS (ALL 17 OFFICIAL ACCOUNTS) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={14} color="#F59E0B" /> Pilih Akun (Total {users.length} Akun Resmi Aktif):
              </div>

              {/* Filter Category Tabs */}
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button 
                  type="button"
                  onClick={() => setFilterCategory('all')} 
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: filterCategory === 'all' ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
                    background: filterCategory === 'all' ? '#F59E0B' : 'rgba(15,23,42,0.6)',
                    color: filterCategory === 'all' ? '#000000' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  Semua ({users.length})
                </button>
                <button 
                  type="button"
                  onClick={() => setFilterCategory('pimpinan')} 
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: filterCategory === 'pimpinan' ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
                    background: filterCategory === 'pimpinan' ? '#F59E0B' : 'rgba(15,23,42,0.6)',
                    color: filterCategory === 'pimpinan' ? '#000000' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  Direksi & Pimpinan
                </button>
                <button 
                  type="button"
                  onClick={() => setFilterCategory('staf')} 
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: filterCategory === 'staf' ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
                    background: filterCategory === 'staf' ? '#F59E0B' : 'rgba(15,23,42,0.6)',
                    color: filterCategory === 'staf' ? '#000000' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  Staf Operasional
                </button>
              </div>
            </div>

            {/* Search Account Box */}
            <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari nama karyawan atau jabatan (misal: Yazid, Rafail, Adhi, Salma, Kholidin)..."
                value={searchAccount}
                onChange={(e) => setSearchAccount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 32px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(15, 23, 42, 0.5)',
                  color: '#ffffff',
                  fontSize: '0.75rem'
                }}
              />
            </div>

            {/* SCROLLABLE GRID OF ALL 17 ACCOUNTS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.5rem',
              maxHeight: '220px',
              overflowY: 'auto',
              padding: '4px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {filteredUsers.map((acc) => {
                const isSelected = identity.toLowerCase() === acc.email.toLowerCase();
                const avatarSrc = getAvatarUrl(acc);

                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleInstantLoginRole(acc)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isSelected ? 'rgba(245, 158, 11, 0.35)' : 'rgba(30, 41, 59, 0.75)',
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <img 
                      src={avatarSrc} 
                      alt={acc.name} 
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #F59E0B', flexShrink: 0 }} 
                    />
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <div style={{ fontWeight: 800, color: isSelected ? '#ffffff' : '#f1f5f9', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontSize: '0.78rem' }}>
                        {acc.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: isSelected ? '#F59E0B' : '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {acc.role}
                      </div>
                    </div>
                    <ArrowRight size={13} color="#F59E0B" style={{ opacity: isSelected ? 1 : 0.6, flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '0.85rem' }}>
              <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Email / Akun Terpilih</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '36px', background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.85rem' }}
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="masukkan email..."
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Kata Sandi (Password)</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '36px', paddingRight: '36px', background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.85rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#000000',
                fontSize: '0.9rem',
                fontWeight: 800,
                border: 'none',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.4)'
              }}
            >
              {loading ? 'Memverifikasi Akses...' : `MASUK SEBAGAI ${activeRole.toUpperCase()}`} <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: '#64748b' }}>
          &copy; 2025 Ashoka Enterprise Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
};
