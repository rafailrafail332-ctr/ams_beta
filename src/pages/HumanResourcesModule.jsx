import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Award, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Edit3, 
  CreditCard, 
  Check, 
  X,
  Sparkles,
  Building2,
  Calendar,
  ArrowUpRight,
  UserCheck,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

export const HumanResourcesModule = () => {
  const { currentUser, users, getAvatarUrl, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('staff'); // 'staff', 'payroll'

  // Helper Check Role Can View Proof / Approve (Only Manager, Director, Super Admin)
  const isManagerOrDirectorOrAdmin = () => {
    if (!currentUser) return false;
    const r = currentUser.role.toLowerCase();
    return r.includes('direktur') || r.includes('manager') || r.includes('admin') || r.includes('gm');
  };

  // Pillar: Payroll Data
  const [payrolls] = useState([
    {
      id: 'PAY-2025-08-01',
      empId: 'EMP-001',
      name: 'Ahmad Rafail',
      position: 'Super Admin & Direktur Utama',
      segment: 'Direksi & Super Admin',
      totalNet: 35000000,
      nextMonthSalary: 35000000,
      adjustReason: 'Gaji Tetap Direksi',
      status: 'Lunas Transfer Bank'
    },
    {
      id: 'PAY-2025-08-02',
      empId: 'EMP-002',
      name: 'Yazid Hizbullah, S.E.,S.T',
      position: 'Direktur Utama & Finance Director',
      segment: 'Direksi & Finance',
      totalNet: 30000000,
      nextMonthSalary: 30000000,
      adjustReason: 'Gaji Tetap Direksi',
      status: 'Lunas Transfer Bank'
    },
    {
      id: 'PAY-2025-08-03',
      empId: 'EMP-003',
      name: 'Adhi Himawan, S.E.Sy',
      position: 'General Manager',
      segment: 'Direksi & Operasional',
      totalNet: 22000000,
      nextMonthSalary: 23500000,
      adjustReason: 'Insentif Key Performance Target Perusahaan',
      status: 'Lunas Transfer Bank'
    },
    {
      id: 'PAY-2025-08-04',
      empId: 'EMP-004',
      name: 'Syamsul Dahari',
      position: 'Finance Staf',
      segment: 'Finance & Accounting',
      totalNet: 8500000,
      nextMonthSalary: 8500000,
      adjustReason: 'Gaji Pokok & Tunjangan Operasional',
      status: 'Lunas Transfer Bank'
    },
    {
      id: 'PAY-2025-08-05',
      empId: 'EMP-005',
      name: 'Tarkum Aditya',
      position: 'Accounting Tax Staf',
      segment: 'Finance & Accounting',
      totalNet: 8500000,
      nextMonthSalary: 8500000,
      adjustReason: 'Gaji Pokok & Tunjangan Pajak',
      status: 'Lunas Transfer Bank'
    }
  ]);

  // Handle View Salary Slip Action
  const handleViewSlipDetail = (empName) => {
    if (!isManagerOrDirectorOrAdmin()) {
      showNotification(`Akses Terbatas: Hanya Manager, Direktur Utama, atau Super Admin yang diizinkan melihat slip gaji rahasia ini!`, 'danger');
      return;
    }
    alert(`Cetak Slip Gaji Resmi Ashoka AMS untuk ${empName}`);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Human Resources (HR & SDM Properti)</h1>
          <p className="page-subtitle">Data Karyawan Resmi Perusahaan (17 Akun), Monitoring SDM, & Sistem Penggajian (Payroll Gaji).</p>
        </div>

        <button className="btn btn-primary" onClick={() => alert('Cetak Laporan Rekapitulasi SDM & Payroll')}>
          <Printer size={16} /> Cetak Rekapitulasi HR & Payroll
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Karyawan Resmi</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{users.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Aktif</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Jam Kerja Standar</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>08:00 - 17:00 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WIB</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status Payroll Gaji</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--success)' }}>100% Lunas</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overtime Rate (Lembur)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>1.5x - 2.0x <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Standard</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for HR Pillars */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>
          <Users size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Daftar SDM & Karyawan Perusahaan ({users.length})
        </button>
        <button className={`tab-item ${activeTab === 'payroll' ? 'active' : ''}`} onClick={() => setActiveTab('payroll')}>
          <DollarSign size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Manajemen Penggajian (Payroll Gaji)
        </button>
      </div>

      {/* TAB 1: DAFTAR KARYAWAN PERUSAHAAN */}
      {activeTab === 'staff' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Daftar SDM & Karyawan Resmi PT Ashoka Enterprise Development</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Profil & Nama Karyawan</th>
                  <th>Jabatan Resmi</th>
                  <th>Email Login</th>
                  <th>Status Keaktifan</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={getAvatarUrl(u)} 
                          alt={u.name} 
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{u.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{u.role}</div>
                    </td>
                    <td><div style={{ fontSize: '0.85rem' }}>{u.email}</div></td>
                    <td><span className="badge badge-success">Aktif (Terverifikasi)</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAYROLL TABLE */}
      {activeTab === 'payroll' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Manajemen Penggajian & Status Bayar Gaji</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID & Nama Karyawan</th>
                  <th>Jabatan & Segmen</th>
                  <th>Gaji Net Sekarang (Rp)</th>
                  <th>Estimasi Gaji Bulan Depan (Rp)</th>
                  <th>Alasan Penyesuaian Gaji</th>
                  <th>Status Pembayaran Gaji</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{p.empId}</div>
                    </td>
                    <td>{p.position}</td>
                    <td><div style={{ fontWeight: 800 }}>{formatRupiah(p.totalNet)}</div></td>
                    <td><div style={{ fontWeight: 800, color: '#F59E0B' }}>{formatRupiah(p.nextMonthSalary)}</div></td>
                    <td><div style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{p.adjustReason}</div></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleViewSlipDetail(p.name)}>
                        <FileText size={12} /> Lihat Slip Gaji
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
