import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Check, 
  X, 
  Printer, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck,
  Plus,
  Edit3,
  Trash2,
  Filter,
  Activity,
  Zap,
  Tag,
  Scale
} from 'lucide-react';

export const ManagerModule = () => {
  const { currentUser, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('dept-kpi'); // Default to SLA dashboard or approvals

  // Helper Check Role Can Approve (Only Manager, Director, Super Admin)
  const isManagerOrDirectorOrAdmin = () => {
    if (!currentUser) return false;
    const r = currentUser.role.toLowerCase();
    return r.includes('direktur') || r.includes('manager') || r.includes('admin') || r.includes('gm');
  };

  // -------------------------------------------------------------
  // 1. APPROVAL OPERASIONAL MANAJER STORE (CRUD)
  // -------------------------------------------------------------
  const initialMgrApprovals = [
    {
      id: 'MGR-APP-01',
      type: 'Persetujuan Jam Lembur Kejar Target S-Curve',
      department: 'Teknik Lapangan',
      requester: 'Ir. Dimas Suryo, ST',
      amount: '3 Jam Lembur (5 Staf)',
      status: 'Pending Manager Approval',
      date: '2025-08-12',
      notes: 'Pengecoran plat lantai 2 Cluster Sapphire Blok B'
    },
    {
      id: 'MGR-APP-02',
      type: 'Diskon Standar SPR Penjualan Unit A-02 (2%)',
      department: 'Marketing & Sales',
      requester: 'Rina Kartika, SE',
      amount: 'Rp 13.400.000 (Diskon 2%)',
      status: 'Approved Manager',
      date: '2025-08-11',
      notes: 'Konsumen Cash Keras 1 Bulan'
    },
    {
      id: 'MGR-APP-03',
      type: 'Permintaan Bahan Material Rutin (50 Sak Semen)',
      department: 'Procurement & Site',
      requester: 'Rudy Hermawan, ST',
      amount: 'Rp 3.500.000',
      status: 'Approved Manager',
      date: '2025-08-10',
      notes: 'Plesteran dinding pembatas kavling Emerald'
    }
  ];

  const [mgrApprovals, setMgrApprovals] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_mgr_approvals_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialMgrApprovals;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_mgr_approvals_v2', JSON.stringify(mgrApprovals));
    } catch (e) {}
  }, [mgrApprovals]);

  // Modal State for Manager Approval
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [appForm, setAppForm] = useState({
    type: '',
    department: 'Teknik Lapangan',
    requester: currentUser?.name || 'Staf Operasional',
    amount: '',
    notes: ''
  });

  const handleOpenAddApp = () => {
    setAppForm({
      type: '',
      department: 'Teknik Lapangan',
      requester: currentUser?.name || 'Staf Operasional',
      amount: '',
      notes: ''
    });
    setIsAppModalOpen(true);
  };

  const handleSaveApp = (e) => {
    e.preventDefault();
    const newApp = {
      id: `MGR-APP-0${mgrApprovals.length + 1}`,
      ...appForm,
      status: 'Pending Manager Approval',
      date: new Date().toISOString().split('T')[0]
    };
    setMgrApprovals(prev => [newApp, ...prev]);
    showNotification(`Pengajuan Operasional "${appForm.type}" berhasil dikirim ke Manager!`);
    setIsAppModalOpen(false);
  };

  const handleApproveMgr = (id) => {
    if (!isManagerOrDirectorOrAdmin()) {
      showNotification(`Akses Terbatas: Hanya Manager, Direktur Utama, atau Super Admin yang berhak memberikan ACC!`, 'danger');
      return;
    }
    setMgrApprovals(prev => prev.map(m => m.id === id ? { ...m, status: 'Approved Manager' } : m));
    showNotification(`ACC MANAJER BERHASIL! Pengajuan operasional ${id} telah disetujui!`);
  };

  const handleRejectMgr = (id) => {
    if (!isManagerOrDirectorOrAdmin()) {
      showNotification(`Akses Terbatas: Hanya Manager, Direktur Utama, atau Super Admin yang berhak menolak!`, 'danger');
      return;
    }
    setMgrApprovals(prev => prev.map(m => m.id === id ? { ...m, status: 'Rejected Manager' } : m));
    showNotification(`Pengajuan operasional ${id} ditolak oleh Manager.`, 'warning');
  };

  const handleDeleteApp = (id) => {
    if (window.confirm(`Hapus pengajuan operasional ${id}?`)) {
      setMgrApprovals(prev => prev.filter(m => m.id !== id));
      showNotification(`Pengajuan ${id} berhasil dihapus.`);
    }
  };

  // -------------------------------------------------------------
  // 2. MONITORING SLA DEPARTEMEN STORE (CRUD)
  // -------------------------------------------------------------
  const initialSlaList = [
    {
      id: 'SLA-LEG-01',
      department: 'Legal & Perizinan',
      service: 'Penerbitan & Pengikatan Akta PPJB Notaris',
      targetSla: '3 Hari Kerja',
      targetDays: 3,
      avgRealization: '2.1 Hari Kerja',
      complianceRate: 98,
      processedCount: 42,
      pic: 'Wahyu Salma Septiani, S.H',
      status: 'Optimal (On-Track)',
      notes: 'Koordinasi aktif dengan Notaris rekanan Bank'
    },
    {
      id: 'SLA-LEG-02',
      department: 'Legal & Perizinan',
      service: 'Pecah Sertifikat (Splitzing SHM) BPN',
      targetSla: '14 Hari Kerja',
      targetDays: 14,
      avgRealization: '11.5 Hari Kerja',
      complianceRate: 95,
      processedCount: 28,
      pic: 'Wahyu Salma Septiani, S.H',
      status: 'Optimal (On-Track)',
      notes: 'Pendaftaran berkas ukur BPN terpantau lancar'
    },
    {
      id: 'SLA-FIN-01',
      department: 'Finance & Accounting',
      service: 'Verifikasi DP Masuk & Validasi Rekening Koran',
      targetSla: '24 Jam',
      targetDays: 1,
      avgRealization: '4 Jam',
      complianceRate: 100,
      processedCount: 65,
      pic: 'Tarkum Aditya / Yazid H.',
      status: 'Optimal (On-Track)',
      notes: 'Notifikasi internet banking terintegrasi'
    },
    {
      id: 'SLA-FIN-02',
      department: 'Finance & Accounting',
      service: 'Pencairan KPR Bank Mitra (Mandiri/BTN/BSI)',
      targetSla: '7 Hari Kerja',
      targetDays: 7,
      avgRealization: '6.2 Hari Kerja',
      complianceRate: 94,
      processedCount: 19,
      pic: 'Yazid Hizbullah, S.E',
      status: 'Optimal (On-Track)',
      notes: 'Follow-up intensif ke Loan Officer Bank'
    },
    {
      id: 'SLA-TEK-01',
      department: 'Teknik & Konstruksi',
      service: 'Inspeksi Opname Lapangan & Verifikasi BATP',
      targetSla: '24 Jam',
      targetDays: 1,
      avgRealization: '18 Jam',
      complianceRate: 100,
      processedCount: 34,
      pic: 'Hapip Alamsyah / Kholidin',
      status: 'Optimal (On-Track)',
      notes: 'Checklist fisik via aplikasi lapangan langsung'
    },
    {
      id: 'SLA-MKT-01',
      department: 'Marketing & Sales',
      service: 'Follow-Up Hot Leads CRM & Penjadwalan Survey Lokasi',
      targetSla: '2 Jam',
      targetDays: 0.1,
      avgRealization: '45 Menit',
      complianceRate: 97,
      processedCount: 112,
      pic: 'Adhi Himawan / Tim Sales',
      status: 'Optimal (On-Track)',
      notes: 'Respon cepat chat WhatsApp konsumen'
    },
    {
      id: 'SLA-CRM-01',
      department: 'Customer Relation',
      service: 'Penyelesaian Tiket Komplain Konsumen (After Sales)',
      targetSla: '48 Jam',
      targetDays: 2,
      avgRealization: '36 Jam',
      complianceRate: 96,
      processedCount: 22,
      pic: 'Dodi Syaiful Nugroho',
      status: 'Optimal (On-Track)',
      notes: 'Perbaikan retak rambut / kebocoran minor tuntas'
    },
    {
      id: 'SLA-PRO-01',
      department: 'Procurement & Site',
      service: 'Penerbitan Purchase Order (PO) Material Bangunan',
      targetSla: '2 Hari Kerja',
      targetDays: 2,
      avgRealization: '1.8 Hari Kerja',
      complianceRate: 99,
      processedCount: 50,
      pic: 'Hapip Alamsyah',
      status: 'Optimal (On-Track)',
      notes: 'Daftar vendor suplier ready stock'
    }
  ];

  const [slaList, setSlaList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_sla_matrix_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialSlaList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_sla_matrix_v2', JSON.stringify(slaList));
    } catch (e) {}
  }, [slaList]);

  // SLA Filter & Modals
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
  const [editingSla, setEditingSla] = useState(null);
  const [slaForm, setSlaForm] = useState({
    department: 'Legal & Perizinan',
    service: '',
    targetSla: '3 Hari Kerja',
    avgRealization: '2 Hari Kerja',
    complianceRate: 98,
    processedCount: 10,
    pic: 'Wahyu Salma Septiani, S.H',
    status: 'Optimal (On-Track)',
    notes: ''
  });

  const filteredSla = slaList.filter(s => selectedDeptFilter === 'All' || s.department === selectedDeptFilter);

  // Overall Stats Calculation
  const totalServices = slaList.length;
  const avgCompliance = Math.round(slaList.reduce((acc, curr) => acc + curr.complianceRate, 0) / (totalServices || 1));
  const totalProcessed = slaList.reduce((acc, curr) => acc + (Number(curr.processedCount) || 0), 0);
  const onTrackCount = slaList.filter(s => s.complianceRate >= 90).length;

  const handleOpenAddSla = () => {
    setEditingSla(null);
    setSlaForm({
      department: 'Legal & Perizinan',
      service: '',
      targetSla: '3 Hari Kerja',
      avgRealization: '2 Hari Kerja',
      complianceRate: 95,
      processedCount: 0,
      pic: currentUser?.name || 'Kepala Divisi',
      status: 'Optimal (On-Track)',
      notes: ''
    });
    setIsSlaModalOpen(true);
  };

  const handleOpenEditSla = (item) => {
    setEditingSla(item);
    setSlaForm(item);
    setIsSlaModalOpen(true);
  };

  const handleSaveSla = (e) => {
    e.preventDefault();
    if (editingSla) {
      setSlaList(prev => prev.map(s => s.id === editingSla.id ? { ...s, ...slaForm, complianceRate: Number(slaForm.complianceRate) } : s));
      showNotification(`Target SLA "${slaForm.service}" berhasil diperbarui!`);
    } else {
      const newSla = {
        id: `SLA-${Date.now().toString().slice(-4)}`,
        ...slaForm,
        complianceRate: Number(slaForm.complianceRate)
      };
      setSlaList(prev => [newSla, ...prev]);
      showNotification(`Target SLA Baru "${slaForm.service}" berhasil ditambahkan!`);
    }
    setIsSlaModalOpen(false);
  };

  const handleDeleteSla = (id, service) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus target SLA "${service}"?`)) {
      setSlaList(prev => prev.filter(s => s.id !== id));
      showNotification(`Target SLA "${service}" berhasil dihapus.`, 'warning');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Manajer Operasional (Manager Suite)</h1>
          <p className="page-subtitle">Pusat persetujuan operasional harian manajer departemen & monitoring Service Level Agreement (SLA) antar divisi.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeTab === 'dept-kpi' ? (
            <button className="btn btn-primary" onClick={handleOpenAddSla}>
              <Plus size={16} /> + Tambah Target SLA Departemen
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleOpenAddApp}>
              <Plus size={16} /> + Buat Pengajuan Operasional
            </button>
          )}
          <button className="btn btn-outline" onClick={() => window.print()}>
            <Printer size={16} /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rata-rata Kepatuhan SLA</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{avgCompliance}% <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>On-Time</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pengajuan Manager Pending</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>
              {mgrApprovals.filter(m => m.status.includes('Pending')).length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Berkas</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Layanan SLA Sesuai Target</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{onTrackCount} / {totalServices} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Optimal</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Berkas Diproses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalProcessed} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Task</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for Manager */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'dept-kpi' ? 'active' : ''}`} onClick={() => setActiveTab('dept-kpi')}>
          <TrendingUp size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Monitoring SLA Departemen (Dashboard Aktif)
        </button>
        <button className={`tab-item ${activeTab === 'manager-approvals' ? 'active' : ''}`} onClick={() => setActiveTab('manager-approvals')}>
          <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Approval Operasional Manajer
        </button>
      </div>

      {/* PILAR 2: DASHBOARD MONITORING SLA DEPARTEMEN (FULL INTERACTIVE & CRUD) */}
      {activeTab === 'dept-kpi' && (
        <div className="glass-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#38BDF8" /> Dashboard Service Level Agreement (SLA) Antar Departemen
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Standar baku waktu pengerjaan tugas & kepatuhan SLA lintas divisi (Legal, Finance, Teknik, Marketing, CRM, Procurement).
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Filter size={15} /> Filter Divisi:
              </div>
              <select 
                className="form-control" 
                value={selectedDeptFilter} 
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', minWidth: '180px' }}
              >
                <option value="All">Semua Departemen</option>
                <option value="Legal & Perizinan">Legal & Perizinan</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Teknik & Konstruksi">Teknik & Konstruksi</option>
                <option value="Marketing & Sales">Marketing & Sales</option>
                <option value="Customer Relation">Customer Relation</option>
                <option value="Procurement & Site">Procurement & Site</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No ID & Nama Layanan / Task</th>
                  <th>Departemen & PIC</th>
                  <th>Standar Target SLA</th>
                  <th>Realisasi Rata-rata</th>
                  <th>Kepatuhan SLA</th>
                  <th>Status Performa</th>
                  <th>Aksi CRUD</th>
                </tr>
              </thead>
              <tbody>
                {filteredSla.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ada target SLA untuk departemen yang dipilih.
                    </td>
                  </tr>
                ) : (
                  filteredSla.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{s.service}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{s.id} &bull; Diproses: {s.processedCount} Berkas</div>
                        {s.notes && <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', marginTop: '2px' }}>Note: {s.notes}</div>}
                      </td>
                      <td>
                        <span className="badge badge-info">{s.department}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>PIC: {s.pic}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{s.targetSla}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#38BDF8' }}>{s.avgRealization}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ flex: 1, height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                            <div 
                              style={{ 
                                width: `${s.complianceRate}%`, 
                                height: '100%', 
                                background: s.complianceRate >= 95 ? 'var(--success)' : s.complianceRate >= 90 ? '#F59E0B' : '#EF4444' 
                              }} 
                            />
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{s.complianceRate}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${s.complianceRate >= 95 ? 'badge-success' : s.complianceRate >= 90 ? 'badge-warning' : 'badge-danger'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditSla(s)} title="Edit Target SLA">
                            <Edit3 size={13} />
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteSla(s.id, s.service)} title="Hapus SLA">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 1: APPROVAL OPERASIONAL MANAJER */}
      {activeTab === 'manager-approvals' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daftar Approval Operasional Harian Manajer</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Validasi permohonan jam lembur lapangan, diskon SPR standar, dan permintaan material rutin proyek.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddApp}>
              <Plus size={14} /> Buat Pengajuan Operasional
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No ID & Jenis Pengajuan</th>
                  <th>Departemen</th>
                  <th>Pemohon Staf</th>
                  <th>Rincian Biaya / Volume</th>
                  <th>Status Approval</th>
                  <th>Aksi ACC Manajer</th>
                </tr>
              </thead>
              <tbody>
                {mgrApprovals.map((m) => {
                  const isDone = m.status.includes('Approved');
                  const isRejected = m.status.includes('Rejected');

                  return (
                    <tr key={m.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{m.type}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{m.id} &bull; {m.date}</div>
                        {m.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{m.notes}</div>}
                      </td>
                      <td><span className="badge badge-info">{m.department}</span></td>
                      <td><div style={{ fontWeight: 700 }}>{m.requester}</div></td>
                      <td><div style={{ fontWeight: 700 }}>{m.amount}</div></td>
                      <td>
                        <span className={`badge ${isDone ? 'badge-success' : isRejected ? 'badge-danger' : 'badge-warning'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        {!isDone && !isRejected ? (
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => handleApproveMgr(m.id)}>
                              <Check size={13} /> ACC
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleRejectMgr(m.id)}>
                              <X size={13} /> Tolak
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => handleDeleteApp(m.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.78rem', color: isDone ? 'var(--success)' : '#EF4444', fontWeight: 700 }}>
                              {isDone ? '✓ Approved' : '✕ Ditolak'}
                            </span>
                            <button className="btn btn-outline btn-sm" onClick={() => handleDeleteApp(m.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: FORM TAMBAH / EDIT TARGET SLA */}
      {isSlaModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '550px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#38BDF8" /> {editingSla ? 'Edit Target SLA Departemen' : 'Tambah Target SLA Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsSlaModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSla}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Departemen</label>
                  <select 
                    className="form-control" 
                    value={slaForm.department} 
                    onChange={(e) => setSlaForm({ ...slaForm, department: e.target.value })} 
                    required
                  >
                    <option value="Legal & Perizinan">Legal & Perizinan</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Teknik & Konstruksi">Teknik & Konstruksi</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                    <option value="Customer Relation">Customer Relation</option>
                    <option value="Procurement & Site">Procurement & Site</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nama Layanan / Standar Task</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Penerbitan Akta PPJB Notaris" 
                    value={slaForm.service} 
                    onChange={(e) => setSlaForm({ ...slaForm, service: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Standar Target SLA</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: 3 Hari Kerja / 24 Jam" 
                      value={slaForm.targetSla} 
                      onChange={(e) => setSlaForm({ ...slaForm, targetSla: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Realisasi Rata-rata</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: 2.1 Hari Kerja" 
                      value={slaForm.avgRealization} 
                      onChange={(e) => setSlaForm({ ...slaForm, avgRealization: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tingkat Kepatuhan SLA (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      className="form-control" 
                      value={slaForm.complianceRate} 
                      onChange={(e) => setSlaForm({ ...slaForm, complianceRate: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>PIC Penanggung Jawab</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nama Staf / Pejabat Divisi" 
                      value={slaForm.pic} 
                      onChange={(e) => setSlaForm({ ...slaForm, pic: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Performa</label>
                  <select 
                    className="form-control" 
                    value={slaForm.status} 
                    onChange={(e) => setSlaForm({ ...slaForm, status: e.target.value })}
                  >
                    <option value="Optimal (On-Track)">Optimal (On-Track)</option>
                    <option value="Perhatian (Warning)">Perhatian (Warning)</option>
                    <option value="Perlu Evaluasi (Delayed)">Perlu Evaluasi (Delayed)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Catatan / SOP Baku</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    placeholder="Catatan standar operasional atau kendala lapangan..." 
                    value={slaForm.notes} 
                    onChange={(e) => setSlaForm({ ...slaForm, notes: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsSlaModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSla ? 'Simpan Perubahan' : 'Tambah Target SLA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FORM BUAT PENGAJUAN OPERASIONAL MANAJER */}
      {isAppModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} color="var(--accent-primary)" /> Buat Pengajuan Operasional Baru
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsAppModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveApp}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Jenis Permohonan / Pengajuan</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Persetujuan Jam Lembur Pengecoran" 
                    value={appForm.type} 
                    onChange={(e) => setAppForm({ ...appForm, type: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Departemen</label>
                  <select 
                    className="form-control" 
                    value={appForm.department} 
                    onChange={(e) => setAppForm({ ...appForm, department: e.target.value })} 
                    required
                  >
                    <option value="Teknik Lapangan">Teknik Lapangan</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                    <option value="Procurement & Site">Procurement & Site</option>
                    <option value="General Affair (GA)">General Affair (GA)</option>
                    <option value="Human Resources (HR)">Human Resources (HR)</option>
                    <option value="Legal Division">Legal Division</option>
                  </select>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Pemohon Staf</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={appForm.requester} 
                      onChange={(e) => setAppForm({ ...appForm, requester: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Rincian Biaya / Volume</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: Rp 2.500.000 / 4 Jam" 
                      value={appForm.amount} 
                      onChange={(e) => setAppForm({ ...appForm, amount: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Catatan / Keterangan Kebutuhan</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    placeholder="Jelaskan urgensi permohonan operasional..." 
                    value={appForm.notes} 
                    onChange={(e) => setAppForm({ ...appForm, notes: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAppModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Kirim Pengajuan ke Manager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
