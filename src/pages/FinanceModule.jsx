import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Briefcase,
  Book,
  Landmark,
  FileBarChart,
  UserCheck,
  Scale,
  TrendingUp,
  Activity,
  FileSpreadsheet,
  ShoppingCart,
  TrendingDown,
  ArrowRightLeft,
  CheckSquare,
  Receipt,
  Package,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle2,
  FolderKanban
} from 'lucide-react';

export const FINANCE_SUBMODULES = [
  // KELOMPOK 1: MODUL UTAMA (6 MENU)
  { id: 'account_list', label: 'Account List', group: 'utama', icon: BookOpen },
  { id: 'joblist', label: 'Joblist', group: 'utama', icon: Briefcase },
  { id: 'jurnal', label: 'Jurnal', group: 'utama', icon: Book },
  { id: 'bank', label: 'Bank', group: 'utama', icon: Landmark },
  { id: 'laporan', label: 'Laporan', group: 'utama', icon: FileBarChart },
  { id: 'account', label: 'Account', group: 'utama', icon: UserCheck },

  // KELOMPOK 2: LAPORAN & TRANSAKSI OPERASIONAL (11 MENU)
  { id: 'neraca', label: 'Neraca', group: 'laporan_transaksi', icon: Scale },
  { id: 'laba_rugi', label: 'Laba Rugi', group: 'laporan_transaksi', icon: TrendingUp },
  { id: 'neraca_saldo', label: 'Neraca Saldo', group: 'laporan_transaksi', icon: Activity },
  { id: 'worksheet', label: 'Worksheet', group: 'laporan_transaksi', icon: FileSpreadsheet },
  { id: 'penjualan', label: 'Penjualan', group: 'laporan_transaksi', icon: ShoppingCart },
  { id: 'hutang', label: 'Hutang', group: 'laporan_transaksi', icon: TrendingDown },
  { id: 'transaksi_jurnal', label: 'Transaksi Jurnal', group: 'laporan_transaksi', icon: ArrowRightLeft },
  { id: 'job_ativity', label: 'Job Ativity', group: 'laporan_transaksi', icon: CheckSquare },
  { id: 'pajak', label: 'Pajak', group: 'laporan_transaksi', icon: Receipt },
  { id: 'purchase_order', label: 'Purchase Order', group: 'laporan_transaksi', icon: Package },
  { id: 'pengajuan_dana', label: 'Pengajuan Dana', group: 'laporan_transaksi', icon: DollarSign }
];

export const FinanceModule = () => {
  const { activeSubTab, setActiveSubTab } = useApp();
  const [activeSubModule, setActiveSubModule] = useState('account_list');

  // Bersihkan data dummy lama di localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    try {
      const oldKeys = [
        'ams_fin_pendapatan_v2',
        'ams_fin_pengeluaran_v2',
        'ams_fin_piutang_v2',
        'ams_fin_utang_v2',
        'ams_fin_invoices_v2',
        'ams_fin_kasbank_v2',
        'ams_fin_budget_v2'
      ];
      oldKeys.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      // ignore
    }
  }, []);

  // Sinkronisasi dengan activeSubTab jika ada navigasi eksternal
  useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      const match = FINANCE_SUBMODULES.find(m => m.id === activeSubTab);
      if (match) {
        setActiveSubModule(match.id);
      }
    }
  }, [activeSubTab]);

  const handleSelectSubModule = (id) => {
    setActiveSubModule(id);
    if (setActiveSubTab) {
      setActiveSubTab(id);
    }
  };

  const currentModule = FINANCE_SUBMODULES.find(m => m.id === activeSubModule) || FINANCE_SUBMODULES[0];
  const CurrentIcon = currentModule.icon;

  const mainModules = FINANCE_SUBMODULES.filter(m => m.group === 'utama');
  const secondaryModules = FINANCE_SUBMODULES.filter(m => m.group === 'laporan_transaksi');

  return (
    <div className="finance-module-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ========================================================================= */}
      {/* HEADER UTAMA: FINANCE & ACC (BANNER MERAH MAROON SESUAI GAMBAR)           */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Kotak Merah Maroon Finance & Acc seperti di screenshot */}
          <div
            style={{
              background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
              border: '2px solid #b91c1c',
              borderRadius: '8px',
              padding: '10px 24px',
              boxShadow: '0 4px 20px rgba(127, 0, 0, 0.5)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.04em',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              Finance & Acc
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
              Sistem Keuangan, Akuntansi & Laporan Finansial Perusahaan
            </div>
          </div>
        </div>

        {/* Indikator Sub-Modul Aktif */}
        <div
          style={{
            background: '#0f172a',
            border: '1.5px solid #7f0000',
            borderRadius: '10px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#ffffff'
          }}
        >
          <span style={{ color: '#ef4444', fontWeight: 800 }}>Aktif:</span>
          <span style={{ fontWeight: 800, color: '#ffffff' }}>{currentModule.label}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BILAH NAVIGASI SUB-MODUL 1: MODUL UTAMA (6 MENU)                          */}
      {/* ========================================================================= */}
      <div>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f87171', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Navigasi Utama (Master & Jurnal):
        </div>
        <div
          className="glass-card no-print"
          style={{
            background: '#090d16',
            border: '1.5px solid #1e293b',
            borderRadius: '12px',
            padding: '0.55rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          {mainModules.map((tab) => {
            const isActive = activeSubModule === tab.id;
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectSubModule(tab.id)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)'
                    : '#0f172a',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  border: isActive ? '1.5px solid #ef4444' : '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 900 : 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: isActive ? '0 4px 14px rgba(185, 28, 28, 0.45)' : 'none',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComp size={15} color={isActive ? '#ffffff' : '#ef4444'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BILAH NAVIGASI SUB-MODUL 2: LAPORAN & TRANSAKSI (11 MENU)                 */}
      {/* ========================================================================= */}
      <div>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f87171', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Laporan & Transaksi Finansial:
        </div>
        <div
          className="glass-card no-print"
          style={{
            background: '#090d16',
            border: '1.5px solid #1e293b',
            borderRadius: '12px',
            padding: '0.55rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          {secondaryModules.map((tab) => {
            const isActive = activeSubModule === tab.id;
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectSubModule(tab.id)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)'
                    : '#0f172a',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  border: isActive ? '1.5px solid #ef4444' : '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '9px 10px',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 900 : 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: isActive ? '0 4px 14px rgba(185, 28, 28, 0.45)' : 'none',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComp size={15} color={isActive ? '#ffffff' : '#ef4444'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AREA KONTEN KOSONG (BERSIH & SIAP DIISI SESUAI ARAHAN)                    */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          border: '1.5px solid #7f0000',
          borderRadius: '14px',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1.25rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          minHeight: '380px'
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(185, 28, 28, 0.45)'
          }}
        >
          <CurrentIcon size={34} />
        </div>

        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            <FolderKanban size={14} /> Sub-Modul: {currentModule.label}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
            {currentModule.label}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '520px', margin: '0.5rem auto 0', lineHeight: 1.6 }}>
            Navigasi sub-modul <strong>{currentModule.label}</strong> aktif. Ruang kerja ini telah dikosongkan dari data lama dan siap untuk diisi format tabel, formulir, atau laporan baru sesuai kebutuhan Anda.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '0.78rem', background: '#0f172a', padding: '6px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <CheckCircle2 size={14} color="#ef4444" />
            Tema Warna: Merah Maroon
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '0.78rem', background: '#0f172a', padding: '6px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <CheckCircle2 size={14} color="#ef4444" />
            Data Lama: Terhapus & Bersih
          </div>
        </div>
      </div>

    </div>
  );
};
