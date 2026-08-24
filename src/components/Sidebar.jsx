import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  ChevronRight, 
  Lock, 
  UserCheck, 
  CheckSquare, 
  ShieldCheck, 
  FileText, 
  DollarSign, 
  Tag, 
  CreditCard, 
  AlertTriangle, 
  Scale, 
  FileSignature, 
  FileCheck, 
  Award, 
  BookOpen, 
  Briefcase, 
  Users, 
  Clock, 
  HeartHandshake, 
  MessageSquare, 
  Package, 
  ShoppingCart, 
  Truck, 
  Printer,
  Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ currentTab, setCurrentTab, isOpen, setIsOpen, onOpenProfile }) => {
  const { currentUser, canAccessModule, activeSubTab, setActiveSubTab, showNotification, getAvatarUrl } = useApp();

  const isBossRole = () => {
    if (!currentUser) return false;
    const r = currentUser.role.toLowerCase();
    return r.includes('super admin') || r.includes('direktur') || r.includes('general manager');
  };

  const isSuperAdmin = () => {
    if (!currentUser) return false;
    return currentUser.role.toLowerCase().includes('super admin');
  };

  const handleNavClick = (moduleKey, subTabKey = 'default') => {
    if (!canAccessModule(moduleKey)) {
      showNotification(`Akses Terbatas: Role ${currentUser?.role} hanya memiliki izin membuka Modul Khusus milik Anda!`, 'danger');
      return;
    }
    setCurrentTab(moduleKey);
    setActiveSubTab(subTabKey);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // CLEAN SPACIOUS SUB-MODULES NAVIGATION TAILORED FOR SPECIFIC ROLES
  const getStaffSubModules = () => {
    const roleLower = currentUser?.role.toLowerCase() || '';

    if (roleLower.includes('teknik') || roleLower.includes('operation')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'teknik-rumah', title: 'Progress Kavling Unit Rumah & WA Tracker', moduleKey: 'teknik-rumah', subTabKey: 'rumah', icon: Building2, color: '#FBBF24' },
        { id: 'teknik-fasilitas', title: 'Utilitas & Komersil (Fasum/Fasos)', moduleKey: 'teknik-fasilitas', subTabKey: 'fasilitas', icon: ShieldCheck, color: '#38BDF8' },
        { id: 'teknik-batp', title: 'Berita Acara BATP Kontraktor Utama', moduleKey: 'teknik-batp', subTabKey: 'batp', icon: FileCheck, color: '#10B981' }
      ];
    }

    if (roleLower.includes('legal')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'legal-shgb', title: '1. SHGB Master Titling (30-Thn)', moduleKey: 'legal', subTabKey: 'shgb', icon: Scale, color: '#C084FC' },
        { id: 'legal-pbg', title: '2. PBG / IMB Induk & Per-Kavling', moduleKey: 'legal', subTabKey: 'pbg', icon: FileSignature, color: '#C084FC' },
        { id: 'legal-split', title: '3. Splitzing SHM BPN Per-Kavling', moduleKey: 'legal', subTabKey: 'split', icon: FileCheck, color: '#C084FC' },
        { id: 'legal-apht', title: '4. APHT Notaris & PKS Bank Mitra', moduleKey: 'legal', subTabKey: 'apht', icon: Award, color: '#C084FC' },
        { id: 'legal-ppjb', title: '5. Pengikatan Akta PPJB Konsumen', moduleKey: 'legal', subTabKey: 'ppjb', icon: BookOpen, color: '#C084FC' },
        { id: 'legal-dispute', title: '6. Dispute Audit Sengketa Lahan', moduleKey: 'legal', subTabKey: 'dispute', icon: ShieldCheck, color: '#C084FC' },
        { id: 'mkt-spr', title: '7. Verifikasi & Cetak Dokumen SPR', moduleKey: 'marketing', subTabKey: 'spr', icon: Printer, color: '#FBBF24' }
      ];
    }

    if (roleLower.includes('hr') || roleLower.includes('dodi')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'hr-staff', title: '1. SDM & Penyesuaian Gaji Karyawan', moduleKey: 'hr', subTabKey: 'staff', icon: Users, color: '#F87171' },
        { id: 'hr-payroll', title: '2. Payroll & Kompensasi SDM', moduleKey: 'hr', subTabKey: 'payroll', icon: DollarSign, color: '#10B981' },
        { id: 'ga-office', title: '3. Site Office & Fasilitas Lapangan', moduleKey: 'ga', subTabKey: 'site-office', icon: Building2, color: '#38BDF8' },
        { id: 'ga-fleet', title: '4. Fleet & Transportasi Lapangan', moduleKey: 'ga', subTabKey: 'fleet', icon: Truck, color: '#38BDF8' },
        { id: 'ga-k3', title: '5. K3 & Tanggap Darurat Proyek', moduleKey: 'ga', subTabKey: 'k3', icon: ShieldCheck, color: '#EF4444' }
      ];
    }

    if (roleLower.includes('finance') || roleLower.includes('accounting')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'fin-price', title: '1. Penetapan Pricelist Resmi Finance', moduleKey: 'finance', subTabKey: 'pricelist', icon: Tag, color: '#60A5FA' },
        { id: 'fin-dp', title: '2. Monitoring DP & Pembayaran Cash In', moduleKey: 'finance', subTabKey: 'dp', icon: DollarSign, color: '#10B981' },
        { id: 'fin-kpr', title: '3. SLA Pencairan KPR Bank Mitra', moduleKey: 'finance', subTabKey: 'kpr', icon: CreditCard, color: '#38BDF8' },
        { id: 'fin-expenses', title: '4. Pengeluaran Kantor & Operasional (Cash Out)', moduleKey: 'finance', subTabKey: 'expenses', icon: Receipt, color: '#F87171' },
        { id: 'fin-overrun', title: '5. Cost Overrun Inspector (Faktur)', moduleKey: 'finance', subTabKey: 'cost-overrun', icon: AlertTriangle, color: '#F59E0B' }
      ];
    }

    if (roleLower.includes('marketing')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'mkt-leads', title: '1. Pipeline CRM Leads & Komisi Sales', moduleKey: 'marketing', subTabKey: 'leads', icon: Users, color: '#FBBF24' },
        { id: 'mkt-spr', title: '2. Transaksi Unit & Upload Dokumen SPR', moduleKey: 'marketing', subTabKey: 'spr', icon: FileText, color: '#FBBF24' }
      ];
    }

    return [
      { id: 'todo-attendance', title: 'To-Do List & Presensi Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' }
    ];
  };

  // FULL MULTI-MODULE LIST FOR BOSS ROLES (USER CONTROL EXCLUSIVELY FOR SUPER ADMIN AHMAD RAFAIL)
  const fullBossModules = [
    { id: 'todo-attendance', mainTitle: 'TO-DO LIST HARIAN', subtitle: 'Universal (Bisa Diakses Semua)', tab: 'todo-attendance', color: '#F59E0B' },
    { id: 'executive', mainTitle: 'EKSEKUTIF & DIREKSI', subtitle: 'Direktur Utama & BOD Suite', tab: 'executive', color: '#F59E0B' },
    { id: 'manager', mainTitle: 'MANAJER OPERASIONAL', subtitle: 'Pusat Approval Ops Manager', tab: 'manager', color: '#38BDF8' },
    { id: 'teknik', mainTitle: 'TEKNIK & KONSTRUKSI', subtitle: 'Progress Unit & Serah Terima', tab: 'teknik-rumah', color: '#FBBF24' },
    { id: 'marketing', mainTitle: 'MARKETING & SALES', subtitle: 'Penjualan Unit & Prospek Lead', tab: 'marketing', color: '#FBBF24' },
    { id: 'legal', mainTitle: 'LEGAL & PERIZINAN', subtitle: 'Sertifikat SHGB/SHM & PBG', tab: 'legal', color: '#C084FC' },
    { id: 'finance', mainTitle: 'FINANCE & PAYMENT', subtitle: 'Pembayaran, DP & KPR', tab: 'finance', color: '#60A5FA' },
    { id: 'ga', mainTitle: 'GENERAL AFFAIR', subtitle: 'Aset, Maintenance & Operasional', tab: 'ga', color: '#38BDF8' },
    { id: 'hr', mainTitle: 'HUMAN RESOURCES', subtitle: 'SDM, Payroll, K3 & Retensi Talent', tab: 'hr', color: '#F87171' },
    { id: 'cr', mainTitle: 'CUSTOMER RELATION', subtitle: 'Komplain, BAST, CSAT & IPL', tab: 'customer-relation', color: '#FB7185' },
    { id: 'procurement', mainTitle: 'PROCUREMENT & VENDOR', subtitle: 'Pengadaan, PO & Tender Proyek', tab: 'procurement', color: '#34D399' },
    // USER CONTROL ONLY VISIBLE TO SUPER ADMIN (AHMAD RAFAIL)
    ...(isSuperAdmin() ? [{ id: 'users', mainTitle: 'USER CONTROL', subtitle: 'Otorisasi Access & Audit Security', tab: 'users', color: '#F59E0B' }] : [])
  ];

  const isBoss = isBossRole();
  const staffSubModules = getStaffSubModules();
  const avatarUrl = getAvatarUrl(currentUser);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }} 
        />
      )}

      <aside 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--border-color)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        {/* Logo Section */}
        <div style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0 1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <img 
            src="/company-logo.png" 
            alt="Ashoka Logo" 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              objectFit: 'contain',
              background: '#ffffff',
              padding: '3px',
              boxShadow: 'var(--shadow-glow)',
              border: '1px solid rgba(245, 158, 11, 0.5)'
            }}
          />
          <div>
            <div style={{ fontWeight: '900', fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              ASHOKA
            </div>
            <div style={{ fontSize: '0.68rem', color: '#F59E0B', fontWeight: 700 }}>
              {isBoss ? 'Pusat Pengawasan Direksi' : `Modul ${currentUser?.role || 'Staf'}`}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, padding: '1.25rem 1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Main Dashboard Button (Only for Boss Roles) */}
          {isBoss && (
            <button
              onClick={() => handleNavClick('dashboard')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: currentTab === 'dashboard' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: currentTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: currentTab === 'dashboard' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '0.5rem'
              }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard Utama</span>
            </button>
          )}

          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.2rem 0.25rem 0.4rem' }}>
            {isBoss ? `SEMUA DEPARTEMEN (PIMPINAN)` : `SUB-MODUL (${currentUser?.name})`}
          </div>

          {/* IF STAFF USER: RENDER TAILORED & SPACIOUS SUB-MODULES NAVIGATION WITHOUT "PILAR" */}
          {!isBoss ? (
            staffSubModules.map((sub) => {
              const isActive = currentTab === sub.moduleKey && (activeSubTab === sub.subTabKey || activeSubTab === 'default');
              const IconComp = sub.icon;

              return (
                <div
                  key={sub.id}
                  onClick={() => handleNavClick(sub.moduleKey, sub.subTabKey)}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: isActive ? `1.5px solid ${sub.color}` : '1px solid var(--border-color)',
                    backgroundColor: isActive ? 'rgba(30, 41, 59, 0.9)' : 'var(--bg-card)',
                    boxShadow: isActive ? `0 4px 18px ${sub.color}33` : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    borderLeft: `5px solid ${sub.color}`,
                    marginBottom: '0.2rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: `${sub.color}20`,
                      color: sub.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComp size={18} />
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.3' }}>
                      {sub.title}
                    </div>
                  </div>
                  <ChevronRight size={16} color={sub.color} style={{ opacity: isActive ? 1 : 0.35, flexShrink: 0 }} />
                </div>
              );
            })
          ) : (
            /* IF BOSS ROLE: RENDER FULL MULTI-MODULE CARDS */
            fullBossModules.map((card) => {
              const isActive = currentTab === card.tab;
              const hasAccess = canAccessModule(card.tab);

              return (
                <div
                  key={card.id}
                  onClick={() => handleNavClick(card.tab)}
                  style={{
                    width: '100%',
                    padding: '0.8rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: isActive ? `1.5px solid ${card.color}` : '1px solid var(--border-color)',
                    backgroundColor: isActive ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                    boxShadow: isActive ? `0 0 16px ${card.color}33` : 'none',
                    cursor: hasAccess ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    borderLeft: `4px solid ${card.color}`,
                    opacity: hasAccess ? 1 : 0.45
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      {card.mainTitle}
                    </div>
                  </div>
                  {hasAccess ? (
                    <ChevronRight size={16} color={card.color} style={{ opacity: isActive ? 1 : 0.4 }} />
                  ) : (
                    <Lock size={14} color="var(--danger)" title="Restriksi Hak Akses Role" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer User Profile Card */}
        <div 
          onClick={onOpenProfile}
          title="Klik untuk membuka Profil Pengguna & Hak Akses"
          style={{
            padding: '0.85rem 1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            background: 'rgba(30, 41, 59, 0.4)',
            transition: 'all 0.25s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #F59E0B',
              flexShrink: 0
            }}>
              <img src={avatarUrl} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '800', fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#ffffff' }}>{currentUser?.name || 'User'}</div>
              <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentUser?.role || 'Staff'}</div>
            </div>
          </div>
          <ChevronRight size={16} color="#F59E0B" />
        </div>
      </aside>
    </>
  );
};
