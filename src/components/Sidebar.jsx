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
  Receipt,
  Landmark,
  Headphones,
  KeyRound,
  Wrench,
  HardHat,
  Calculator,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ currentTab, setCurrentTab, isOpen, setIsOpen, onOpenProfile, onLogout }) => {
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
  };

  // CLEAN SPACIOUS SUB-MODULES NAVIGATION TAILORED FOR SPECIFIC ROLES
  const getStaffSubModules = () => {
    const roleLower = currentUser?.role.toLowerCase() || '';

    // 1. HR, GENERAL AFFAIR & HEAD OFFICE OPS (PAK DODI)
    if (roleLower.includes('hr') || roleLower.includes('dodi') || (roleLower.includes('ga') && !roleLower.includes('legal'))) {
      return [
        { id: 'todo-attendance', title: 'To-Do List & Presensi Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'hr-staff', title: '1. SDM & Karyawan Perusahaan', moduleKey: 'hr', subTabKey: 'staff', icon: Users, color: '#F87171' },
        { id: 'hr-payroll', title: '2. Manajemen Penggajian (Payroll Gaji)', moduleKey: 'hr', subTabKey: 'payroll', icon: DollarSign, color: '#10B981' },
        { id: 'ga-office', title: '3. Site Office & Fasilitas Lapangan', moduleKey: 'ga', subTabKey: 'site-office', icon: Building2, color: '#38BDF8' },
        { id: 'ga-permits', title: '4. Perizinan Lingkungan & Warga', moduleKey: 'ga', subTabKey: 'permits', icon: FileCheck, color: '#34D399' },
        { id: 'ga-fleet', title: '5. Fleet & Transportasi Lapangan', moduleKey: 'ga', subTabKey: 'fleet', icon: Truck, color: '#60A5FA' },
        { id: 'ga-k3', title: '6. K3 & Tanggap Darurat Proyek', moduleKey: 'ga', subTabKey: 'k3', icon: ShieldCheck, color: '#EF4444' },
        { id: 'proc-logistik', title: '7. Pengadaan & Logistik Kantor', moduleKey: 'procurement', subTabKey: 'default', icon: FileText, color: '#FBBF24' },
        { id: 'cr-helpdesk', title: '8. Customer Relation & Helpdesk', moduleKey: 'customer-relation', subTabKey: 'helpdesk', icon: Headphones, color: '#FB7185' }
      ];
    }

    // 2. LEGAL DIVISION (BU SALMA)
    if (roleLower.includes('legal') || roleLower.includes('salma')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'legal-shgb', title: '1. SHGB Master Titling (30-Thn)', moduleKey: 'legal', subTabKey: 'shgb', icon: Scale, color: '#C084FC' },
        { id: 'legal-pbg', title: '2. PBG / IMB Induk & Per-Kavling', moduleKey: 'legal', subTabKey: 'pbg', icon: FileSignature, color: '#C084FC' },
        { id: 'legal-split', title: '3. Splitzing SHM BPN Per-Kavling', moduleKey: 'legal', subTabKey: 'split', icon: FileCheck, color: '#C084FC' },
        { id: 'legal-apht', title: '4. APHT Notaris & PKS Bank Mitra', moduleKey: 'legal', subTabKey: 'apht', icon: Award, color: '#C084FC' },
        { id: 'legal-ppjb', title: '5. Pengikatan Akta PPJB Konsumen', moduleKey: 'legal', subTabKey: 'ppjb', icon: BookOpen, color: '#C084FC' },
        { id: 'legal-dispute', title: '6. Dispute Audit Sengketa Lahan', moduleKey: 'legal', subTabKey: 'dispute', icon: ShieldCheck, color: '#C084FC' },
        { id: 'mkt-spr', title: '7. Verifikasi & Cetak Dokumen SPR', moduleKey: 'marketing', subTabKey: 'spr', icon: Printer, color: '#FBBF24' },
        { id: 'cr-docs', title: '8. Serah Terima Sertifikat SHM & PBG', moduleKey: 'customer-relation', subTabKey: 'documents', icon: KeyRound, color: '#FB7185' }
      ];
    }

    // 3. FINANCE, ACCOUNTING, TAX & COLLECTION (PAK TARKUM, SYAMSUL, JEZEN)
    if (roleLower.includes('finance') || roleLower.includes('accounting') || roleLower.includes('tax') || roleLower.includes('collection') || roleLower.includes('jezen') || roleLower.includes('tarkum')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'fin-tax', title: '1. Akuntansi & Pajak (PPh Final & PPN)', moduleKey: 'finance', subTabKey: 'tax', icon: Landmark, color: '#10B981' },
        { id: 'fin-expenses', title: '2. Pengeluaran Kantor & Kuitansi (OpEx)', moduleKey: 'finance', subTabKey: 'expenses', icon: Receipt, color: '#F87171' },
        { id: 'fin-dp', title: '3. Monitoring DP & Pembayaran Cash In', moduleKey: 'finance', subTabKey: 'dp', icon: DollarSign, color: '#10B981' },
        { id: 'fin-kpr', title: '4. SLA Pencairan KPR Bank Mitra', moduleKey: 'finance', subTabKey: 'kpr', icon: CreditCard, color: '#38BDF8' },
        { id: 'fin-price', title: '5. Penetapan Pricelist & HPP Rumah', moduleKey: 'finance', subTabKey: 'pricelist', icon: Tag, color: '#60A5FA' },
        { id: 'fin-overrun', title: '6. Cost Overrun Inspector (Faktur)', moduleKey: 'finance', subTabKey: 'cost-overrun', icon: AlertTriangle, color: '#F59E0B' },
        { id: 'cr-ipl', title: '7. Customer Relation: Tagihan IPL Estate', moduleKey: 'customer-relation', subTabKey: 'ipl', icon: HeartHandshake, color: '#FB7185' }
      ];
    }

    // 4. MARKETING & SALES (BU YULIEKA, FRESDA, AMANDA, BAMBANG)
    if (roleLower.includes('marketing') || roleLower.includes('sales')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'mkt-leads', title: '1. Pipeline CRM Leads & Komisi Sales', moduleKey: 'marketing', subTabKey: 'leads', icon: Users, color: '#FBBF24' },
        { id: 'mkt-spr', title: '2. Transaksi Unit & Upload Dokumen SPR', moduleKey: 'marketing', subTabKey: 'spr', icon: FileText, color: '#FBBF24' },
        { id: 'cr-tickets', title: '3. Customer Relation & Garansi Konsumen', moduleKey: 'customer-relation', subTabKey: 'tickets', icon: HeartHandshake, color: '#FB7185' },
        { id: 'cr-handover', title: 'BAST Serah Terima Kunci & Meteran', moduleKey: 'customer-relation', subTabKey: 'handover', icon: KeyRound, color: '#FB7185' }
      ];
    }

    // 5. LOGISTIC & PROCUREMENT (PAK FAJAR)
    if (roleLower.includes('logistic') || roleLower.includes('fajar') || roleLower.includes('procurement')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'proc-po', title: '1. Purchase Order & Pengadaan Material', moduleKey: 'procurement', subTabKey: 'default', icon: ShoppingCart, color: '#34D399' },
        { id: 'proc-stock', title: '2. Gudang & Manajemen Stok Logistik', moduleKey: 'procurement', subTabKey: 'default', icon: Package, color: '#38BDF8' },
        { id: 'ga-office', title: '3. Fasilitas & Logistik Lapangan', moduleKey: 'ga', subTabKey: 'site-office', icon: Building2, color: '#FBBF24' },
        { id: 'cr-helpdesk', title: '4. Customer Relation & Helpdesk', moduleKey: 'customer-relation', subTabKey: 'helpdesk', icon: Headphones, color: '#FB7185' }
      ];
    }

    // 6. TEKNIK & SITE OPERATIONS (PAK HAPIP, KHOLIDIN, NAUFAL, NASEH)
    if (roleLower.includes('teknik') || roleLower.includes('site') || roleLower.includes('hapip')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'teknik-absen', title: '1. Absen Tenaga Kerja', moduleKey: 'teknik', subTabKey: 'absen', icon: HardHat, color: '#F97316' },
        { id: 'teknik-rab', title: '2. Input RAB & Monitoring Progress', moduleKey: 'teknik', subTabKey: 'rab', icon: Calculator, color: '#F59E0B' },
        { id: 'cr-tickets', title: 'Customer Relation & Komplain Retensi', moduleKey: 'customer-relation', subTabKey: 'tickets', icon: HeartHandshake, color: '#FB7185' }
      ];
    }

    // 7. CUSTOMER RELATION & CRM
    if (roleLower.includes('customer') || roleLower.includes('crm') || roleLower.includes('relation') || roleLower.includes('after-sales')) {
      return [
        { id: 'todo-attendance', title: 'To-Do List Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
        { id: 'cr-tickets', title: '1. Komplain & Tiket Garansi Retensi', moduleKey: 'customer-relation', subTabKey: 'tickets', icon: Wrench, color: '#FB7185' },
        { id: 'cr-handover', title: 'BAST Serah Terima Kunci (STK) & Meteran', moduleKey: 'customer-relation', subTabKey: 'handover', icon: KeyRound, color: '#FB7185' },
        { id: 'cr-csat', title: '3. Kepuasan Pelanggan (CSAT) & Review', moduleKey: 'customer-relation', subTabKey: 'csat', icon: HeartHandshake, color: '#FB7185' },
        { id: 'cr-ipl', title: '4. Tagihan IPL & Maintenance Estate', moduleKey: 'customer-relation', subTabKey: 'ipl', icon: DollarSign, color: '#10B981' },
        { id: 'cr-docs', title: '5. Penyerahan Sertifikat SHM & PBG', moduleKey: 'customer-relation', subTabKey: 'documents', icon: FileCheck, color: '#38BDF8' },
        { id: 'cr-helpdesk', title: '6. Helpdesk & Broadcast WA Konsumen', moduleKey: 'customer-relation', subTabKey: 'helpdesk', icon: Headphones, color: '#F59E0B' }
      ];
    }

    return [
      { id: 'todo-attendance', title: 'To-Do List & Presensi Harian', moduleKey: 'todo-attendance', subTabKey: 'todo', icon: CheckSquare, color: '#F59E0B' },
      { id: 'cr-all', title: 'Customer Relation & After Sales', moduleKey: 'customer-relation', subTabKey: 'tickets', icon: HeartHandshake, color: '#FB7185' }
    ];
  };

  // FULL MULTI-MODULE LIST FOR BOSS ROLES (USER CONTROL EXCLUSIVELY FOR SUPER ADMIN AHMAD RAFAIL)
  const fullBossModules = [
    { id: 'todo-attendance', mainTitle: 'To-Do List Harian', tab: 'todo-attendance', icon: CheckSquare, color: '#F59E0B' },
    { id: 'executive', mainTitle: 'Eksekutif & Direksi', tab: 'executive', icon: Award, color: '#F59E0B' },
    { id: 'manager', mainTitle: 'Manajer Operasional', tab: 'manager', icon: Briefcase, color: '#38BDF8' },
    { id: 'teknik', mainTitle: 'Teknik & Konstruksi', tab: 'teknik', icon: HardHat, color: '#F97316' },
    { id: 'marketing', mainTitle: 'Marketing & Sales', tab: 'marketing', icon: Tag, color: '#FBBF24' },
    { id: 'legal', mainTitle: 'Legal & Perizinan', tab: 'legal', icon: Scale, color: '#C084FC' },
    { id: 'finance', mainTitle: 'Finance & Payment', tab: 'finance', icon: DollarSign, color: '#60A5FA' },
    { id: 'ga', mainTitle: 'General Affair', tab: 'ga', icon: ShieldCheck, color: '#38BDF8' },
    { id: 'hr', mainTitle: 'Human Resources', tab: 'hr', icon: Users, color: '#F87171' },
    { id: 'cr', mainTitle: 'Customer Relation (STK)', tab: 'customer-relation', icon: HeartHandshake, color: '#FB7185' },
    { id: 'procurement', mainTitle: 'Procurement & Vendor', tab: 'procurement', icon: ShoppingCart, color: '#34D399' },
    // USER CONTROL ONLY VISIBLE TO SUPER ADMIN (AHMAD RAFAIL)
    ...(isSuperAdmin() ? [{ id: 'users', mainTitle: 'User Control', tab: 'users', icon: ShieldCheck, color: '#F59E0B' }] : [])
  ];

  const isBoss = isBossRole();
  const staffSubModules = getStaffSubModules();
  const avatarUrl = getAvatarUrl(currentUser);

  return (
    <>
      <aside 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'var(--sidebar-width)',
          backgroundColor: '#0f172a',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderRight: '1px solid var(--border-color)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transform: 'translateX(0)',
          visibility: 'visible',
          opacity: 1
        }}
      >
        {/* Logo Section */}
        <div style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
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
            <div style={{ fontWeight: '900', fontSize: '1.18rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              ASHOKA
            </div>
            <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800 }}>
              {isBoss ? 'Pusat Pengawasan Direksi' : `Modul ${currentUser?.role || 'Staf'}`}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, padding: '0.9rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          
          {/* Main Dashboard Button (Always Visible for All Users) */}
          <button
            onClick={() => handleNavClick('dashboard')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: currentTab === 'dashboard' ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
              backgroundColor: currentTab === 'dashboard' ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.6)',
              color: currentTab === 'dashboard' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '0.25rem'
            }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: currentTab === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentTab === 'dashboard' ? '#fff' : '#818CF8' }}>
              <LayoutDashboard size={16} />
            </div>
            <span>Dashboard Utama</span>
          </button>

          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.25rem 0.2rem' }}>
            MODUL DEPARTEMEN
          </div>

          {/* RENDER ALL CORE COMPANY MODULES PERMANENTLY FOR ALL ACCOUNTS */}
          {fullBossModules.map((card) => {
            const isActive = currentTab === card.tab;
            const hasAccess = canAccessModule(card.tab);
            const IconComp = card.icon || Building2;

            return (
              <div
                key={card.id}
                onClick={() => handleNavClick(card.tab)}
                style={{
                  width: '100%',
                  padding: '0.58rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? `1.5px solid ${card.color}` : '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.09)' : 'rgba(30, 41, 59, 0.55)',
                  boxShadow: isActive ? `0 0 14px ${card.color}28` : 'none',
                  cursor: hasAccess ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  borderLeft: `4px solid ${card.color}`,
                  opacity: hasAccess ? 1 : 0.45
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', overflow: 'hidden' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: `${card.color}20`,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={15} />
                  </div>
                  <div style={{ fontSize: '0.83rem', fontWeight: isActive ? 900 : 700, color: isActive ? '#ffffff' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {card.mainTitle}
                  </div>
                </div>
                {hasAccess ? (
                  <ChevronRight size={14} color={card.color} style={{ opacity: isActive ? 1 : 0.35 }} />
                ) : (
                  <Lock size={13} color="var(--danger)" title="Restriksi Hak Akses Role" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer User Profile Card */}
        <div 
          style={{
            padding: '0.8rem 1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(30, 41, 59, 0.4)'
          }}
        >
          <div 
            onClick={onOpenProfile}
            title="Klik untuk membuka Profil Pengguna & Hak Akses"
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden', cursor: 'pointer', flex: 1 }}
          >
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
              <div style={{ fontWeight: '800', fontSize: '0.84rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#ffffff' }}>{currentUser?.name || 'User'}</div>
              <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentUser?.role || 'Staff'}</div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onLogout) onLogout();
            }}
            title="Sign Out / Ganti Akun"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.45rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '0.4rem'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};
