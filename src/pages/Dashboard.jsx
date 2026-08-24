import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SCurveForecasting } from '../components/SCurveForecasting';
import { DocumentGeneratorModal } from '../components/DocumentGeneratorModal';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ChevronRight, 
  Plus,
  Users,
  FileText,
  Sparkles,
  Printer,
  ShoppingBag,
  Briefcase,
  Sun,
  Moon,
  ShieldAlert,
  ClipboardCheck,
  Edit3,
  Trash2,
  X,
  Check,
  Tag,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

export const Dashboard = ({ setCurrentTab }) => {
  const { units, addUnit, updateUnit, deleteUnit, currentUser, showNotification } = useApp();

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docType, setDocType] = useState('BATP');

  // -------------------------------------------------------------
  // 1. WORKING HOURS (CRUD)
  // -------------------------------------------------------------
  const initialWorkingHours = {
    status: 'Jam Kerja Operasional Berlangsung (OPEN)',
    isOpen: true,
    headOffice: { hours: '08:00 - 17:00 WIB', days: 'Senin - Jumat • Toleransi 15m' },
    siteOffice: { hours: '07:30 - 16:30 WIB', days: 'Senin - Sabtu • Overtime 2.0x' },
    security: { hours: '24 Jam (3 Rotasi Shift)', days: '7 Hari / Minggu • Siaga Pos' }
  };

  const [workingHours, setWorkingHours] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_working_hours_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialWorkingHours;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_working_hours_v2', JSON.stringify(workingHours));
    } catch (e) {}
  }, [workingHours]);

  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [hoursForm, setHoursForm] = useState(workingHours);

  const handleSaveWorkingHours = (e) => {
    e.preventDefault();
    setWorkingHours(hoursForm);
    showNotification('Jadwal Jam Kerja Operasional berhasil diperbarui!');
    setIsHoursModalOpen(false);
  };

  // -------------------------------------------------------------
  // 2. EXECUTIVE ACTION MEMOS & INSTRUCTIONS (CRUD)
  // -------------------------------------------------------------
  const initialMemos = [
    {
      id: 'MEMO-01',
      title: 'Percepatan Cut & Fill dan Pematangan Lahan Blok C Cluster Sapphire',
      targetDept: 'Teknik & Konstruksi',
      priority: 'Tinggi (High)',
      deadline: '28 Agustus 2025',
      pic: 'Hapip Alamsyah (Head Operation Site)',
      status: 'Dalam Pengerjaan',
      notes: 'Alat berat eskavator tambahan sudah disetujui Finance.'
    },
    {
      id: 'MEMO-02',
      title: 'Audit Dokumen e-Faktur Pajak & NTPN PPh Final Semester 1',
      targetDept: 'Finance & Tax',
      priority: 'Medium',
      deadline: '30 Agustus 2025',
      pic: 'Tarkum Aditya (Accounting Tax Staf)',
      status: 'Selesai (ACC)',
      notes: 'Rekonsiliasi kas negara dengan BPN selesai.'
    },
    {
      id: 'MEMO-03',
      title: 'Penandatanganan Akta PPJB Massal Konsumen Bank Mandiri',
      targetDept: 'Legal & Marketing',
      priority: 'Tinggi (High)',
      deadline: '05 September 2025',
      pic: 'Wahyu Salma Septiani, S.H (Legal Division)',
      status: 'Dalam Pengerjaan',
      notes: 'Jadwal notaris rekanan di Kantor Pemasaran.'
    }
  ];

  const [memos, setMemos] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_executive_memos_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialMemos;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_executive_memos_v2', JSON.stringify(memos));
    } catch (e) {}
  }, [memos]);

  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null);
  const [memoForm, setMemoForm] = useState({
    title: '',
    targetDept: 'Teknik & Konstruksi',
    priority: 'Tinggi (High)',
    deadline: '31 Agustus 2025',
    pic: 'Hapip Alamsyah',
    status: 'Dalam Pengerjaan',
    notes: ''
  });

  const handleOpenAddMemo = () => {
    setEditingMemo(null);
    setMemoForm({
      title: '',
      targetDept: 'Teknik & Konstruksi',
      priority: 'Tinggi (High)',
      deadline: '31 Agustus 2025',
      pic: currentUser?.name || 'Staf Operasional',
      status: 'Dalam Pengerjaan',
      notes: ''
    });
    setIsMemoModalOpen(true);
  };

  const handleOpenEditMemo = (item) => {
    setEditingMemo(item);
    setMemoForm(item);
    setIsMemoModalOpen(true);
  };

  const handleSaveMemo = (e) => {
    e.preventDefault();
    if (editingMemo) {
      setMemos(prev => prev.map(m => m.id === editingMemo.id ? { ...m, ...memoForm } : m));
      showNotification(`Instruksi Memo "${memoForm.title}" berhasil diperbarui!`);
    } else {
      const newMemoObj = {
        id: `MEMO-0${memos.length + 1}`,
        ...memoForm
      };
      setMemos(prev => [newMemoObj, ...prev]);
      showNotification(`Memo Baru "${memoForm.title}" diterbitkan ke ${memoForm.targetDept}!`);
    }
    setIsMemoModalOpen(false);
  };

  const handleDeleteMemo = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus memo "${title}"?`)) {
      setMemos(prev => prev.filter(m => m.id !== id));
      showNotification(`Memo "${title}" berhasil dihapus.`, 'warning');
    }
  };

  const handleToggleMemoStatus = (id) => {
    setMemos(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status.includes('Selesai') ? 'Dalam Pengerjaan' : 'Selesai (ACC)';
        showNotification(`Status memo ${m.id} diubah menjadi: ${nextStatus}`);
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  // -------------------------------------------------------------
  // 3. HOUSING UNITS TABLE (CRUD)
  // -------------------------------------------------------------
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [unitFormData, setUnitFormData] = useState({
    unitNo: '',
    cluster: 'Grand Harmoni - Cluster Emerald',
    owner: '',
    tipe: '45/90',
    progress: 0,
    contractor: 'PT Bangun Jaya Perdana',
    legalStatus: 'PBG Induk Valid',
    batpPayment: 'Termin 1 (Uang Muka)'
  });

  const handleOpenAddUnit = () => {
    setEditingUnit(null);
    setUnitFormData({
      unitNo: '',
      cluster: 'Grand Harmoni - Cluster Emerald',
      owner: '',
      tipe: '45/90',
      progress: 0,
      contractor: 'PT Bangun Jaya Perdana',
      legalStatus: 'PBG Induk Valid',
      batpPayment: 'Termin 1 (Uang Muka)'
    });
    setIsUnitModalOpen(true);
  };

  const handleOpenEditUnit = (u) => {
    setEditingUnit(u);
    setUnitFormData({
      unitNo: u.unitNo,
      cluster: u.cluster,
      owner: u.owner,
      tipe: u.tipe,
      progress: u.progress,
      contractor: u.contractor,
      legalStatus: u.legal?.status || 'PBG Induk Valid',
      batpPayment: u.finance?.batpPayment || 'Termin 1'
    });
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = (e) => {
    e.preventDefault();
    const newProg = Number(unitFormData.progress);
    let newStatus = 'Pekerjaan Pondasi & Struktur';
    if (newProg === 100) newStatus = 'Ready (Handover)';
    else if (newProg >= 75) newStatus = 'Finishing & Cat Dinding';
    else if (newProg >= 40) newStatus = 'Pasangan Dinding & Atap';

    if (editingUnit) {
      updateUnit(editingUnit.id, {
        unitNo: unitFormData.unitNo,
        cluster: unitFormData.cluster,
        owner: unitFormData.owner,
        tipe: unitFormData.tipe,
        progress: newProg,
        status: newStatus,
        contractor: unitFormData.contractor,
        legal: { ...editingUnit.legal, status: unitFormData.legalStatus },
        finance: { ...editingUnit.finance, batpPayment: unitFormData.batpPayment }
      });
      showNotification(`Unit Kavling ${unitFormData.unitNo} berhasil diperbarui dari Dashboard!`);
    } else {
      addUnit({
        unitNo: unitFormData.unitNo,
        cluster: unitFormData.cluster,
        owner: unitFormData.owner,
        tipe: unitFormData.tipe,
        progress: newProg,
        status: newStatus,
        contractor: unitFormData.contractor
      });
      showNotification(`Unit Kavling ${unitFormData.unitNo} berhasil ditambahkan dari Dashboard!`);
    }
    setIsUnitModalOpen(false);
  };

  const handleDeleteUnitClick = (id, unitNo) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data Unit ${unitNo}?`)) {
      deleteUnit(id);
    }
  };

  // Calculations
  const totalUnits = units.length;
  const readyUnits = units.filter((u) => u.progress === 100).length;
  const avgProgress = Math.round(
    units.reduce((acc, curr) => acc + curr.progress, 0) / (totalUnits || 1)
  );

  const handleOpenDocGen = (type) => {
    setDocType(type);
    setIsDocModalOpen(true);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Utama Ashoka AMS</h1>
          <p className="page-subtitle">Pusat pemantauan S-Curve forecasting, jam kerja operasional, status unit rumah, instruksi memo direksi & keuangan real-time.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => { setHoursForm(workingHours); setIsHoursModalOpen(true); }}>
            <Clock size={16} /> Edit Jam Kerja Operasional
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenDocGen('BATP')}>
            <Printer size={16} /> Cetak Dokumen PDF (BATP/QC)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. OPERATIONAL WORKING HOURS CARD (WITH EDIT CRUD)                        */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem', borderLeft: '4px solid #F59E0B' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock color="#F59E0B" size={22} /> Informasi Jam Kerja Operasional (Working Hours Ashoka)
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Jadwal operasional aktif kantor pusat, site office proyek, & pos keamanan.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className={`badge ${workingHours.isOpen ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.825rem', padding: '0.4rem 0.8rem' }}>
              {workingHours.isOpen ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />} {workingHours.status}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => { setHoursForm(workingHours); setIsHoursModalOpen(true); }}>
              <Edit3 size={13} /> Edit Jam Kerja
            </button>
          </div>
        </div>

        <div className="grid-3">
          <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🏢 Kantor Pusat & Direksi</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0' }}>{workingHours.headOffice.hours}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{workingHours.headOffice.days}</div>
          </div>

          <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>👷 Site Office & Mandor Proyek</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0' }}>{workingHours.siteOffice.hours}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{workingHours.siteOffice.days}</div>
          </div>

          <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🛡️ Security & Pos GA</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0' }}>{workingHours.security.hours}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{workingHours.security.days}</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KPI STATS BAR                                                             */}
      {/* ========================================================================= */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Unit Rumah</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalUnits} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unit</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Unit 100% Ready (Handover)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{readyUnits} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unit</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Procurement Material</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>100% <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>PO Approved</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.15)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Legalitas SHM / PBG</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>100% <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Verified</span></div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE S-CURVE FORECASTING */}
      <SCurveForecasting />

      {/* ========================================================================= */}
      {/* 2. PAPAN MEMO & INSTRUKSI DIREKSI (FULL CRUD)                             */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText color="#F59E0B" size={20} /> Papan Memo & Instruksi Keputusan Direksi (Executive Action Items)
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Pusat koordinasi tugas antar-divisi, memo penting direktur, & tenggat waktu operasional.</p>
          </div>

          <button className="btn btn-primary btn-sm" onClick={handleOpenAddMemo}>
            <Plus size={14} /> Buat Memo Baru
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID Memo</th>
                <th>Judul Instruksi / Keputusan</th>
                <th>Divisi Tujuan</th>
                <th>Prioritas</th>
                <th>Deadline</th>
                <th>PIC Pelaksana</th>
                <th>Status</th>
                <th>Aksi CRUD</th>
              </tr>
            </thead>
            <tbody>
              {memos.map((m) => {
                const isCompleted = m.status.includes('Selesai');
                return (
                  <tr key={m.id}>
                    <td><span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{m.id}</span></td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{m.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.notes || '-'}</div>
                    </td>
                    <td><span className="badge badge-neutral">{m.targetDept}</span></td>
                    <td>
                      <span className={`badge ${m.priority.includes('Tinggi') ? 'badge-danger' : 'badge-warning'}`}>
                        {m.priority}
                      </span>
                    </td>
                    <td><div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{m.deadline}</div></td>
                    <td><div style={{ fontSize: '0.82rem' }}>{m.pic}</div></td>
                    <td>
                      <span className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}>
                        {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />} {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button 
                          className="btn btn-primary btn-sm" 
                          onClick={() => handleToggleMemoStatus(m.id)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', background: isCompleted ? 'rgba(245,158,11,0.2)' : '#10B981', border: 'none', color: isCompleted ? '#F59E0B' : '#000' }}
                          title="Ubah Status Selesai / Pengerjaan"
                        >
                          {isCompleted ? 'Re-open' : 'Selesai'}
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleOpenEditMemo(m)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                        >
                          <Edit3 size={12} />
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleDeleteMemo(m.id, m.title)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: 'var(--danger)' }}
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
      </div>

      {/* ========================================================================= */}
      {/* 3. RINGKASAN UNIT RUMAH & PROGRES FISIK (FULL CRUD)                       */}
      {/* ========================================================================= */}
      <div className="glass-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Ringkasan Unit Rumah & Progress Fisik Lapangan</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{units.length} Unit Kavling Terdaftar</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddUnit}>
              <Plus size={14} /> Tambah Kavling Baru
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentTab('teknik-rumah')}>
              Modul Teknik Lengkap <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Kavling Unit</th>
                <th>Cluster Perumahan</th>
                <th>Pemilik (Owner)</th>
                <th>Progress Fisik</th>
                <th>Status Legalitas</th>
                <th>Status KPR / Payment</th>
                <th>Aksi CRUD & Dokumen</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{unit.unitNo}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{unit.tipe}</div>
                  </td>
                  <td>{unit.cluster}</td>
                  <td><div style={{ fontWeight: 700 }}>{unit.owner}</div></td>
                  <td style={{ minWidth: '130px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '2px' }}>{unit.progress}%</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${unit.progress}%`, height: '100%', backgroundColor: unit.progress === 100 ? 'var(--success)' : 'var(--accent-primary)' }} />
                    </div>
                  </td>
                  <td><span className="badge badge-info">{unit.legal?.status || 'PBG Induk Valid'}</span></td>
                  <td><span className="badge badge-success">{unit.finance?.batpPayment || 'Termin 1'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenDocGen('BATP')} title="Dokumen BATP Kontraktor">
                        <FileText size={12} /> BATP
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleOpenEditUnit(unit)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>
                        <Edit3 size={12} /> Edit
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteUnitClick(unit.id, unit.unitNo)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }} title="Hapus Unit">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: EDIT JAM KERJA OPERASIONAL                                         */}
      {/* ========================================================================= */}
      {isHoursModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="#F59E0B" /> Edit Jadwal Jam Kerja Operasional
              </h3>
              <button onClick={() => setIsHoursModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveWorkingHours}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Status Operasional Perusahaan</label>
                  <select 
                    className="form-control"
                    value={hoursForm.isOpen ? 'open' : 'closed'}
                    onChange={(e) => {
                      const isOpen = e.target.value === 'open';
                      setHoursForm({
                        ...hoursForm,
                        isOpen,
                        status: isOpen ? 'Jam Kerja Operasional Berlangsung (OPEN)' : 'Kantor Sedang Libur / Tutup (CLOSED)'
                      });
                    }}
                  >
                    <option value="open">Jam Kerja Operasional Berlangsung (OPEN)</option>
                    <option value="closed">Kantor Sedang Libur / Tutup (CLOSED)</option>
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Jam Kerja Kantor Pusat & Direksi</label>
                    <input type="text" className="form-control" value={hoursForm.headOffice.hours} onChange={(e) => setHoursForm({ ...hoursForm, headOffice: { ...hoursForm.headOffice, hours: e.target.value } })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hari & Ketentuan Kantor Pusat</label>
                    <input type="text" className="form-control" value={hoursForm.headOffice.days} onChange={(e) => setHoursForm({ ...hoursForm, headOffice: { ...hoursForm.headOffice, days: e.target.value } })} required />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Jam Kerja Site Office & Mandor</label>
                    <input type="text" className="form-control" value={hoursForm.siteOffice.hours} onChange={(e) => setHoursForm({ ...hoursForm, siteOffice: { ...hoursForm.siteOffice, hours: e.target.value } })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hari & Ketentuan Site Office</label>
                    <input type="text" className="form-control" value={hoursForm.siteOffice.days} onChange={(e) => setHoursForm({ ...hoursForm, siteOffice: { ...hoursForm.siteOffice, days: e.target.value } })} required />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Jam Kerja Security & Pos GA</label>
                    <input type="text" className="form-control" value={hoursForm.security.hours} onChange={(e) => setHoursForm({ ...hoursForm, security: { ...hoursForm.security, hours: e.target.value } })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ketentuan Shift Security</label>
                    <input type="text" className="form-control" value={hoursForm.security.days} onChange={(e) => setHoursForm({ ...hoursForm, security: { ...hoursForm.security, days: e.target.value } })} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsHoursModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Jadwal Jam Kerja</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT MEMO INSTRUKSI DIREKSI                               */}
      {/* ========================================================================= */}
      {isMemoModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#F59E0B" /> {editingMemo ? `Edit Memo - ${editingMemo.id}` : 'Terbitkan Memo / Instruksi Direksi Baru'}
              </h3>
              <button onClick={() => setIsMemoModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveMemo}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Instruksi / Keputusan Direksi</label>
                  <input type="text" className="form-control" placeholder="Contoh: Percepatan Cut & Fill Blok C" value={memoForm.title} onChange={(e) => setMemoForm({ ...memoForm, title: e.target.value })} required />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Divisi Tujuan</label>
                    <select className="form-control" value={memoForm.targetDept} onChange={(e) => setMemoForm({ ...memoForm, targetDept: e.target.value })}>
                      <option value="Teknik & Konstruksi">Teknik & Konstruksi</option>
                      <option value="Finance & Tax">Finance & Tax</option>
                      <option value="Legal & Perizinan">Legal & Perizinan</option>
                      <option value="Marketing & Sales">Marketing & Sales</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="General Affair">General Affair</option>
                      <option value="Procurement & Vendor">Procurement & Vendor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tingkat Prioritas</label>
                    <select className="form-control" value={memoForm.priority} onChange={(e) => setMemoForm({ ...memoForm, priority: e.target.value })}>
                      <option value="Tinggi (High)">Tinggi (High)</option>
                      <option value="Medium">Medium</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Batas Waktu (Deadline)</label>
                    <input type="text" className="form-control" placeholder="31 Agustus 2025" value={memoForm.deadline} onChange={(e) => setMemoForm({ ...memoForm, deadline: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PIC Pelaksana</label>
                    <input type="text" className="form-control" value={memoForm.pic} onChange={(e) => setMemoForm({ ...memoForm, pic: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan Tambahan & Instruksi Khusus</label>
                  <input type="text" className="form-control" placeholder="Catatan atau lampiran instruksi" value={memoForm.notes} onChange={(e) => setMemoForm({ ...memoForm, notes: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsMemoModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan & Terbitkan Memo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT KAVLING UNIT DARI DASHBOARD                          */}
      {/* ========================================================================= */}
      {isUnitModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="#F59E0B" /> {editingUnit ? `Edit Unit Kavling - ${editingUnit.unitNo}` : 'Tambah Unit Kavling Baru (Dashboard)'}
              </h3>
              <button onClick={() => setIsUnitModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveUnit}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor Kavling Unit</label>
                    <input type="text" className="form-control" placeholder="A-01 / B-05" value={unitFormData.unitNo} onChange={(e) => setUnitFormData({ ...unitFormData, unitNo: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cluster Perumahan</label>
                    <select className="form-control" value={unitFormData.cluster} onChange={(e) => setUnitFormData({ ...unitFormData, cluster: e.target.value })}>
                      <option value="Grand Harmoni - Cluster Emerald">Grand Harmoni - Cluster Emerald</option>
                      <option value="Grand Harmoni - Cluster Sapphire">Grand Harmoni - Cluster Sapphire</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nama Pemilik (Owner)</label>
                    <input type="text" className="form-control" placeholder="Budi Santoso" value={unitFormData.owner} onChange={(e) => setUnitFormData({ ...unitFormData, owner: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tipe Bangunan</label>
                    <input type="text" className="form-control" value={unitFormData.tipe} onChange={(e) => setUnitFormData({ ...unitFormData, tipe: e.target.value })} required />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Progress Fisik (%)</label>
                    <input type="number" className="form-control" min="0" max="100" value={unitFormData.progress} onChange={(e) => setUnitFormData({ ...unitFormData, progress: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kontraktor Pelaksana</label>
                    <input type="text" className="form-control" value={unitFormData.contractor} onChange={(e) => setUnitFormData({ ...unitFormData, contractor: e.target.value })} required />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Status Legalitas</label>
                    <input type="text" className="form-control" value={unitFormData.legalStatus} onChange={(e) => setUnitFormData({ ...unitFormData, legalStatus: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status BATP / Payment</label>
                    <input type="text" className="form-control" value={unitFormData.batpPayment} onChange={(e) => setUnitFormData({ ...unitFormData, batpPayment: e.target.value })} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsUnitModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Data Unit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT GENERATOR MODAL */}
      <DocumentGeneratorModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        docType={docType}
      />
    </div>
  );
};
