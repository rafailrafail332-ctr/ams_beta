import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Trash2,
  Eye,
  Briefcase,
  HelpCircle
} from 'lucide-react';

export const HumanResourcesModule = () => {
  const { currentUser, users, getAvatarUrl, showNotification, activeSubTab } = useApp();
  const [activeTab, setActiveTab] = useState(activeSubTab && activeSubTab !== 'default' ? activeSubTab : 'staff'); // 'staff', 'payroll'

  useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Search Filter States
  const [searchStaff, setSearchStaff] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');

  // Helper Check Role Can View Proof / Approve (Manager, Director, Super Admin, HR)
  const isManagerOrDirectorOrAdmin = () => {
    if (!currentUser) return false;
    const r = currentUser.role.toLowerCase();
    return r.includes('direktur') || r.includes('manager') || r.includes('admin') || r.includes('gm') || r.includes('hr') || r.includes('dodi');
  };

  // Initial Payroll Records
  const initialPayrolls = [
    {
      id: 'PAY-2025-08-01',
      empId: 'EMP-001',
      name: 'Ahmad Rafail',
      position: 'Super Admin & Direktur Utama',
      segment: 'Direksi & Super Admin',
      baseSalary: 25000000,
      allowance: 7000000,
      incentive: 3000000,
      deduction: 0,
      totalNet: 35000000,
      nextMonthSalary: 35000000,
      adjustReason: 'Gaji Tetap Direksi',
      status: 'Lunas Transfer Bank',
      paymentMethod: 'BCA Auto Payroll',
      bankAccount: 'BCA 8899-2341-01',
      payDate: '25 Agustus 2025'
    },
    {
      id: 'PAY-2025-08-02',
      empId: 'EMP-002',
      name: 'Yazid Hizbullah, S.E.,S.T',
      position: 'Direktur Utama & Finance Director',
      segment: 'Direksi & Finance',
      baseSalary: 22000000,
      allowance: 5000000,
      incentive: 3000000,
      deduction: 0,
      totalNet: 30000000,
      nextMonthSalary: 30000000,
      adjustReason: 'Gaji Tetap Direksi',
      status: 'Lunas Transfer Bank',
      paymentMethod: 'Mandiri Payroll',
      bankAccount: 'MDR 1400-0987-1234',
      payDate: '25 Agustus 2025'
    },
    {
      id: 'PAY-2025-08-03',
      empId: 'EMP-003',
      name: 'Adhi Himawan, S.E.Sy',
      position: 'General Manager',
      segment: 'Direksi & Operasional',
      baseSalary: 16000000,
      allowance: 4000000,
      incentive: 2000000,
      deduction: 0,
      totalNet: 22000000,
      nextMonthSalary: 23500000,
      adjustReason: 'Insentif Key Performance Target Perusahaan',
      status: 'Lunas Transfer Bank',
      paymentMethod: 'BCA Auto Payroll',
      bankAccount: 'BCA 8899-7711-22',
      payDate: '25 Agustus 2025'
    },
    {
      id: 'PAY-2025-08-04',
      empId: 'EMP-004',
      name: 'Syamsul Dahari',
      position: 'Finance Staf',
      segment: 'Finance & Accounting',
      baseSalary: 6500000,
      allowance: 1500000,
      incentive: 500000,
      deduction: 0,
      totalNet: 8500000,
      nextMonthSalary: 8500000,
      adjustReason: 'Gaji Pokok & Tunjangan Operasional',
      status: 'Lunas Transfer Bank',
      paymentMethod: 'BNI Payroll',
      bankAccount: 'BNI 0388-1928-11',
      payDate: '25 Agustus 2025'
    },
    {
      id: 'PAY-2025-08-05',
      empId: 'EMP-005',
      name: 'Tarkum Aditya',
      position: 'Accounting Tax Staf',
      segment: 'Finance & Accounting',
      baseSalary: 6500000,
      allowance: 1500000,
      incentive: 500000,
      deduction: 0,
      totalNet: 8500000,
      nextMonthSalary: 8500000,
      adjustReason: 'Gaji Pokok & Tunjangan Pajak',
      status: 'Lunas Transfer Bank',
      paymentMethod: 'BCA Auto Payroll',
      bankAccount: 'BCA 7711-8899-00',
      payDate: '25 Agustus 2025'
    },
    {
      id: 'PAY-2025-08-06',
      empId: 'EMP-006',
      name: 'Dodi Irawan, S.H',
      position: 'HRD & GA Staf',
      segment: 'HR & General Affair',
      baseSalary: 6500000,
      allowance: 1500000,
      incentive: 500000,
      deduction: 0,
      totalNet: 8500000,
      nextMonthSalary: 8500000,
      adjustReason: 'Gaji Pokok & Tunjangan Legalitas SDM',
      status: 'Lunas Transfer Bank',
      paymentMethod: 'BCA Auto Payroll',
      bankAccount: 'BCA 5544-1122-33',
      payDate: '25 Agustus 2025'
    },
    {
      id: 'PAY-2025-08-07',
      empId: 'EMP-007',
      name: 'Iwan Prasetyo, S.T',
      position: 'Site Manager & Proyek',
      segment: 'Teknik & Lapangan',
      baseSalary: 8000000,
      allowance: 2000000,
      incentive: 1000000,
      deduction: 0,
      totalNet: 11000000,
      nextMonthSalary: 11000000,
      adjustReason: 'Gaji Pokok & Tunjangan Lapangan K3',
      status: 'Lunas Transfer Bank',
      paymentMethod: 'Mandiri Payroll',
      bankAccount: 'MDR 1400-3322-1199',
      payDate: '25 Agustus 2025'
    },
    {
      id: 'PAY-2025-08-08',
      empId: 'EMP-008',
      name: 'Laras Safitri, S.I.Kom',
      position: 'Marketing & Sales Manager',
      segment: 'Marketing & Sales',
      baseSalary: 7500000,
      allowance: 1500000,
      incentive: 3500000,
      deduction: 0,
      totalNet: 12500000,
      nextMonthSalary: 14000000,
      adjustReason: 'Komisi Closing Unit Cluster Emerald & Sapphire',
      status: 'Lunas Transfer Bank',
      paymentMethod: 'BCA Auto Payroll',
      bankAccount: 'BCA 8822-9900-11',
      payDate: '25 Agustus 2025'
    }
  ];

  // Persistent Payroll State
  const getSavedPayrolls = () => {
    try {
      const saved = localStorage.getItem('ams_payroll_data_clean_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialPayrolls;
  };

  const [payrolls, setPayrolls] = useState(getSavedPayrolls);

  useEffect(() => {
    try {
      localStorage.setItem('ams_payroll_data_clean_v2', JSON.stringify(payrolls));
    } catch (e) {}
  }, [payrolls]);

  // Payroll Add/Edit Modal State
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [payrollForm, setPayrollForm] = useState({
    empId: 'EMP-001',
    name: '',
    position: '',
    segment: 'Finance & Accounting',
    baseSalary: 0,
    allowance: 0,
    incentive: 0,
    deduction: 0,
    nextMonthSalary: 0,
    adjustReason: '',
    status: 'Lunas Transfer Bank',
    paymentMethod: 'BCA Auto Payroll',
    bankAccount: '',
    payDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  });

  // Salary Slip Modal State
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Handlers for Add/Edit Payroll
  const handleOpenAddPayroll = () => {
    setEditingPayroll(null);
    setPayrollForm({
      empId: `EMP-${String(payrolls.length + 1).padStart(3, '0')}`,
      name: '',
      position: '',
      segment: 'Operasional Lapangan',
      baseSalary: 5000000,
      allowance: 1000000,
      incentive: 500000,
      deduction: 0,
      nextMonthSalary: 6500000,
      adjustReason: 'Gaji Pokok Standar & Tunjangan',
      status: 'Lunas Transfer Bank',
      paymentMethod: 'BCA Auto Payroll',
      bankAccount: 'BCA 0000-0000-00',
      payDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    setIsPayrollModalOpen(true);
  };

  const handleOpenEditPayroll = (p) => {
    setEditingPayroll(p);
    setPayrollForm({
      empId: p.empId || '',
      name: p.name || '',
      position: p.position || '',
      segment: p.segment || 'Finance & Accounting',
      baseSalary: p.baseSalary || 0,
      allowance: p.allowance || 0,
      incentive: p.incentive || 0,
      deduction: p.deduction || 0,
      nextMonthSalary: p.nextMonthSalary || (p.totalNet || 0),
      adjustReason: p.adjustReason || '',
      status: p.status || 'Lunas Transfer Bank',
      paymentMethod: p.paymentMethod || 'BCA Auto Payroll',
      bankAccount: p.bankAccount || '',
      payDate: p.payDate || ''
    });
    setIsPayrollModalOpen(true);
  };

  const handleSavePayroll = (e) => {
    e.preventDefault();
    const base = Number(payrollForm.baseSalary) || 0;
    const allow = Number(payrollForm.allowance) || 0;
    const inc = Number(payrollForm.incentive) || 0;
    const ded = Number(payrollForm.deduction) || 0;
    const net = Math.max(0, base + allow + inc - ded);
    const nextSalary = Number(payrollForm.nextMonthSalary) || net;

    if (editingPayroll) {
      setPayrolls(payrolls.map(p => p.id === editingPayroll.id ? {
        ...p,
        ...payrollForm,
        baseSalary: base,
        allowance: allow,
        incentive: inc,
        deduction: ded,
        totalNet: net,
        nextMonthSalary: nextSalary
      } : p));
      showNotification(`Data Payroll & Gaji ${payrollForm.name} berhasil diperbarui!`, 'success');
    } else {
      const newPay = {
        id: `PAY-2025-08-${String(payrolls.length + 1).padStart(2, '0')}`,
        ...payrollForm,
        baseSalary: base,
        allowance: allow,
        incentive: inc,
        deduction: ded,
        totalNet: net,
        nextMonthSalary: nextSalary
      };
      setPayrolls([newPay, ...payrolls]);
      showNotification(`Data Payroll baru untuk ${payrollForm.name} berhasil ditambahkan!`, 'success');
    }
    setIsPayrollModalOpen(false);
  };

  const handleDeletePayroll = (id, name) => {
    if (window.confirm(`Hapus catatan penggajian untuk ${name}?`)) {
      setPayrolls(payrolls.filter(p => p.id !== id));
      showNotification(`Data penggajian ${name} berhasil dihapus.`, 'warning');
    }
  };

  const handleTogglePayStatus = (p) => {
    const newStatus = p.status.includes('Lunas') ? 'Menunggu Approval Transfer' : 'Lunas Transfer Bank';
    setPayrolls(payrolls.map(item => item.id === p.id ? { ...item, status: newStatus } : item));
    showNotification(`Status pembayaran gaji ${p.name} diubah menjadi: ${newStatus}`, 'info');
  };

  // View Slip Gaji Handler
  const handleViewSlipDetail = (payroll) => {
    if (!isManagerOrDirectorOrAdmin()) {
      showNotification(`Akses Terbatas: Hanya Manager, Direktur Utama, atau Super Admin yang diizinkan melihat slip gaji rahasia ini!`, 'danger');
      return;
    }
    setSelectedSlip(payroll);
    setIsSlipModalOpen(true);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // KPI Calculations
  const totalPayrollAmount = payrolls.reduce((acc, p) => acc + (p.totalNet || 0), 0);
  const totalPaidAmount = payrolls.filter(p => p.status.includes('Lunas')).reduce((acc, p) => acc + (p.totalNet || 0), 0);
  const totalNextMonthAmount = payrolls.reduce((acc, p) => acc + (p.nextMonthSalary || p.totalNet || 0), 0);
  const paidCount = payrolls.filter(p => p.status.includes('Lunas')).length;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Human Resources (HR & SDM Properti)</h1>
          <p className="page-subtitle">Data Karyawan Resmi Perusahaan (17 Akun), Monitoring SDM, & Sistem Penggajian (Payroll Gaji).</p>
        </div>

        <button className="btn btn-primary" onClick={() => window.print()} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
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
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Realisasi Payroll</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--success)' }}>{formatRupiah(totalPayrollAmount)}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status Pelunasan Gaji</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {paidCount}/{payrolls.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Lunas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for HR Pillars */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>
          <Users size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Daftar SDM & Karyawan Perusahaan ({users.length})
        </button>
        <button className={`tab-item ${activeTab === 'payroll' ? 'active' : ''}`} onClick={() => setActiveTab('payroll')}>
          <DollarSign size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Manajemen Penggajian (Payroll Gaji) ({payrolls.length})
        </button>
      </div>

      {/* TAB 1: DAFTAR KARYAWAN PERUSAHAAN */}
      {activeTab === 'staff' && (() => {
        const filteredUsers = users.filter(u => !searchStaff || [u.name, u.role, u.email, u.id, u.phone].some(val => (val || '').toLowerCase().includes(searchStaff.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Daftar SDM & Karyawan Resmi PT Ashoka Enterprise Development</h3>
            </div>

            {/* Search Bar Staff */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari nama karyawan, jabatan, email login, ID..."
                  value={searchStaff}
                  onChange={(e) => setSearchStaff(e.target.value)}
                />
                {searchStaff && (
                  <button onClick={() => setSearchStaff('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredUsers.length}</span> dari {users.length} Karyawan
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Users size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada data karyawan yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchStaff('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
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
                    {filteredUsers.map((u) => (
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
            )}
          </div>
        );
      })()}

      {/* TAB 2: PAYROLL TABLE (FULL CRUD & SEARCH) */}
      {activeTab === 'payroll' && (() => {
        const filteredPayrolls = payrolls.filter(p => !searchPayroll || [p.name, p.empId, p.position, p.segment, p.adjustReason, p.status, p.paymentMethod, p.bankAccount, p.totalNet?.toString(), p.nextMonthSalary?.toString()].some(val => (val || '').toLowerCase().includes(searchPayroll.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign color="#10B981" size={24} /> Manajemen Penggajian & Status Bayar Gaji (Payroll)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Pusat pengelolaan gaji pokok, tunjangan jabatan, insentif performa, penyesuaian kompensasi, & cetak slip gaji resmi.
                </p>
              </div>

              <button className="btn btn-primary" onClick={handleOpenAddPayroll} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                <Plus size={16} /> Catat Data Penggajian Baru
              </button>
            </div>

            {/* KPI Mini Cards for Payroll */}
            <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Total Beban Gaji Net</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10B981' }}>{formatRupiah(totalPayrollAmount)}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{payrolls.length} Karyawan Terdata</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700 }}>Gaji Lunas Ditransfer</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38BDF8' }}>{formatRupiah(totalPaidAmount)}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{paidCount} Karyawan Selesai</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700 }}>Estimasi Bulan Depan</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#F59E0B' }}>{formatRupiah(totalNextMonthAmount)}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Proyeksi Anggaran SDM</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#A855F7', fontWeight: 700 }}>Tingkat Kepatuhan Gaji</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#A855F7' }}>
                  {payrolls.length > 0 ? Math.round((paidCount / payrolls.length) * 100) : 0}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SLA Pembayaran Tepat Waktu</div>
              </div>
            </div>

            {/* Search Bar Payroll */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari nama karyawan, jabatan, ID karyawan, alasan penyesuaian, status..."
                  value={searchPayroll}
                  onChange={(e) => setSearchPayroll(e.target.value)}
                />
                {searchPayroll && (
                  <button onClick={() => setSearchPayroll('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredPayrolls.length}</span> dari {payrolls.length} Data Payroll
              </div>
            </div>

            {filteredPayrolls.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <DollarSign size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada data penggajian yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchPayroll('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID & Nama Karyawan</th>
                      <th>Jabatan & Segmen</th>
                      <th>Rincian Gaji Net (Rp)</th>
                      <th>Estimasi Bulan Depan</th>
                      <th>Alasan Penyesuaian</th>
                      <th>Status Pembayaran</th>
                      <th>Aksi Manajemen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayrolls.map((p) => {
                      const isPaid = p.status.includes('Lunas');
                      return (
                        <tr key={p.id}>
                          <td>
                            <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{p.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{p.empId} &bull; {p.bankAccount || p.paymentMethod || 'Bank Transfer'}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.825rem' }}>{p.position}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.segment}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#10B981' }}>{formatRupiah(p.totalNet)}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                              Pokok: {formatRupiah(p.baseSalary || p.totalNet * 0.7)} | Tunj: {formatRupiah(p.allowance || 0)}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 800, color: '#F59E0B' }}>{formatRupiah(p.nextMonthSalary || p.totalNet)}</div>
                          </td>
                          <td>
                            <div style={{ fontStyle: 'italic', fontSize: '0.8rem', maxWidth: '180px', color: 'var(--text-main)' }}>
                              {p.adjustReason || 'Standar Operasional'}
                            </div>
                          </td>
                          <td>
                            <button 
                              onClick={() => handleTogglePayStatus(p)}
                              className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`}
                              style={{ cursor: 'pointer', border: 'none', padding: '0.35rem 0.6rem' }}
                              title="Klik untuk ubah status pembayaran"
                            >
                              {isPaid ? <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> : <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                              {p.status}
                            </button>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => handleViewSlipDetail(p)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                                title="Lihat & Cetak Slip Gaji"
                              >
                                <FileText size={12} /> Slip
                              </button>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => handleOpenEditPayroll(p)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                title="Edit Rincian Gaji"
                              >
                                <Edit3 size={12} /> Edit
                              </button>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => handleDeletePayroll(p.id, p.name)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}
                                title="Hapus Data"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}

      {/* MODAL: ADD / EDIT DATA PENGGAJIAN (PAYROLL) */}
      {isPayrollModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '650px', width: '95%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={20} color="#10B981" />
                <h3 className="modal-title">
                  {editingPayroll ? `Edit Payroll Gaji - ${editingPayroll.name}` : 'Catat Data Penggajian Karyawan Baru'}
                </h3>
              </div>
              <button onClick={() => setIsPayrollModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePayroll}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">ID Karyawan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: EMP-009"
                      value={payrollForm.empId}
                      onChange={(e) => setPayrollForm({ ...payrollForm, empId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap Karyawan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Lengkap"
                      value={payrollForm.name}
                      onChange={(e) => setPayrollForm({ ...payrollForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Jabatan Resmi</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Finance & Accounting Staf"
                      value={payrollForm.position}
                      onChange={(e) => setPayrollForm({ ...payrollForm, position: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Divisi / Segmen</label>
                    <select
                      className="form-control"
                      value={payrollForm.segment}
                      onChange={(e) => setPayrollForm({ ...payrollForm, segment: e.target.value })}
                    >
                      <option value="Direksi & Super Admin">Direksi & Super Admin</option>
                      <option value="Finance & Accounting">Finance & Accounting</option>
                      <option value="HR & General Affair">HR & General Affair</option>
                      <option value="Teknik & Lapangan">Teknik & Lapangan</option>
                      <option value="Marketing & Sales">Marketing & Sales</option>
                      <option value="Legal & Perizinan">Legal & Perizinan</option>
                      <option value="Customer Relation">Customer Relation</option>
                    </select>
                  </div>
                </div>

                {/* Komponen Gaji */}
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#10B981', marginBottom: '0.5rem' }}>
                    💰 Komponen Rincian Penghasilan & Gaji Bersih (Net)
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Gaji Pokok (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Contoh: 6500000"
                        value={payrollForm.baseSalary}
                        onChange={(e) => setPayrollForm({ ...payrollForm, baseSalary: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tunjangan Jabatan & Ops (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Contoh: 1500000"
                        value={payrollForm.allowance}
                        onChange={(e) => setPayrollForm({ ...payrollForm, allowance: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Insentif & Bonus Lembur (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Contoh: 500000"
                        value={payrollForm.incentive}
                        onChange={(e) => setPayrollForm({ ...payrollForm, incentive: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Potongan Kasbon / PPh (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Contoh: 0"
                        value={payrollForm.deduction}
                        onChange={(e) => setPayrollForm({ ...payrollForm, deduction: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Total Take Home Pay (Net):</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10B981' }}>
                      {formatRupiah(Math.max(0, (Number(payrollForm.baseSalary) || 0) + (Number(payrollForm.allowance) || 0) + (Number(payrollForm.incentive) || 0) - (Number(payrollForm.deduction) || 0)))}
                    </span>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Estimasi Gaji Bulan Depan (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Contoh: 8500000"
                      value={payrollForm.nextMonthSalary}
                      onChange={(e) => setPayrollForm({ ...payrollForm, nextMonthSalary: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alasan Penyesuaian Gaji</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Kenaikan KPI & Insentif Closing"
                      value={payrollForm.adjustReason}
                      onChange={(e) => setPayrollForm({ ...payrollForm, adjustReason: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Metode Pembayaran</label>
                    <select
                      className="form-control"
                      value={payrollForm.paymentMethod}
                      onChange={(e) => setPayrollForm({ ...payrollForm, paymentMethod: e.target.value })}
                    >
                      <option value="BCA Auto Payroll">BCA Auto Payroll</option>
                      <option value="Mandiri Payroll">Mandiri Payroll</option>
                      <option value="BNI Payroll">BNI Payroll</option>
                      <option value="BRI Payroll">BRI Payroll</option>
                      <option value="Tunai Cash Kasir">Tunai Cash Kasir</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">No. Rekening Bank Karyawan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: BCA 8899-2233-11"
                      value={payrollForm.bankAccount}
                      onChange={(e) => setPayrollForm({ ...payrollForm, bankAccount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status Pembayaran Gaji</label>
                  <select
                    className="form-control"
                    value={payrollForm.status}
                    onChange={(e) => setPayrollForm({ ...payrollForm, status: e.target.value })}
                  >
                    <option value="Lunas Transfer Bank">Lunas Transfer Bank</option>
                    <option value="Menunggu Approval Transfer">Menunggu Approval Transfer</option>
                    <option value="Pending Otorisasi Direksi">Pending Otorisasi Direksi</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPayrollModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  Simpan Data Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CETAK / LIHAT SLIP GAJI RESMI */}
      {isSlipModalOpen && selectedSlip && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '750px', width: '95%', color: '#0f172a' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#10B981" />
                <h3 className="modal-title" style={{ color: '#0f172a' }}>
                  Slip Gaji Resmi Karyawan - {selectedSlip.name}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => window.print()} 
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', fontWeight: 800, border: 'none' }}
                >
                  <Printer size={16} /> Cetak / Export PDF Slip
                </button>
                <button onClick={() => setIsSlipModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Paper */}
            <div 
              id="printable-salary-slip"
              style={{
                backgroundColor: '#ffffff',
                padding: '2.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: 1.5,
                color: '#1e293b'
              }}
            >
              {/* Kop Surat */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src="/company-logo.png" alt="Ashoka Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      PT ASHOKA ENTERPRISE DEVELOPMENT
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Divisi Human Resources & Payroll Management
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>SLIP GAJI RESMI (CONFIDENTIAL)</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    NO: SLIP/AMS/{selectedSlip.empId}/2025/08
                  </div>
                </div>
              </div>

              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', margin: 0 }}>
                  SLIP GAJI BULAN AGUSTUS 2025
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
                  Bukti Pembayaran Hak Finansial & Kompensasi Karyawan
                </p>
              </div>

              {/* Identitas Karyawan */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Nama Karyawan</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{selectedSlip.name}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Nomor Induk Karyawan</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedSlip.empId}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Jabatan & Divisi</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedSlip.position} ({selectedSlip.segment})</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.35rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Metode Pembayaran</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>{selectedSlip.bankAccount || selectedSlip.paymentMethod} &bull; {selectedSlip.status}</span>
                </div>
              </div>

              {/* Rincian Penghasilan vs Potongan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                {/* Penerimaan */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#16a34a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.5rem' }}>
                    (+) PENGHASILAN (EARNINGS)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span>Gaji Pokok:</span>
                    <span style={{ fontWeight: 700 }}>{formatRupiah(selectedSlip.baseSalary || selectedSlip.totalNet * 0.7)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span>Tunjangan Operasional/Jabatan:</span>
                    <span style={{ fontWeight: 700 }}>{formatRupiah(selectedSlip.allowance || selectedSlip.totalNet * 0.2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span>Insentif KPI & Bonus Closing:</span>
                    <span style={{ fontWeight: 700 }}>{formatRupiah(selectedSlip.incentive || selectedSlip.totalNet * 0.1)}</span>
                  </div>
                </div>

                {/* Potongan */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ef4444', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.5rem' }}>
                    (-) POTONGAN (DEDUCTIONS)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span>PPh 21 Pajak Penghasilan:</span>
                    <span style={{ fontWeight: 700 }}>Rp 0 (Ditanggung Perusahaan)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span>BPJS Ketenagakerjaan & Kesehatan:</span>
                    <span style={{ fontWeight: 700 }}>Rp 0 (Lengkap)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span>Potongan Kasbon / Lainnya:</span>
                    <span style={{ fontWeight: 700 }}>{formatRupiah(selectedSlip.deduction || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Total Take Home Pay */}
              <div style={{ padding: '0.85rem 1.25rem', borderRadius: '8px', background: '#ecfdf5', border: '2px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#065f46' }}>GAJI BERSIH DITERIMA (TAKE HOME PAY):</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#047857' }}>{formatRupiah(selectedSlip.totalNet)}</span>
              </div>

              {/* Klausul & Tanda Tangan */}
              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '1.5rem', pageBreakInside: 'avoid' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '3.5rem' }}>
                    Disetujui Oleh HRD / Finance:<br />
                    <strong>PT ASHOKA ENTERPRISE DEVELOPMENT</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', textDecoration: 'underline' }}>
                    Dodi Irawan, S.H / Yazid Hizbullah
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>HR & Finance Director</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '3.5rem' }}>
                    Diterima Oleh Karyawan:<br />
                    <strong>Penerima Hak Gaji</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', textDecoration: 'underline' }}>
                    {selectedSlip.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{selectedSlip.position}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
