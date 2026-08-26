import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SCurveForecasting } from '../components/SCurveForecasting';
import { DocumentGeneratorModal } from '../components/DocumentGeneratorModal';
import { COMPANY_DIVISIONS, MEDIA_CATEGORIES } from './TodoAttendanceModule';
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
  MessageSquare,
  Megaphone,
  Pin,
  Heart,
  Eye,
  Upload,
  UserCheck,
  Send,
  ArrowRight
} from 'lucide-react';

export const Dashboard = ({ setCurrentTab }) => {
  const { 
    units, 
    addUnit, 
    updateUnit, 
    deleteUnit, 
    currentUser, 
    showNotification, 
    workingHours, 
    updateWorkingHours,
    mediaInfoList,
    setMediaInfoList
  } = useApp();

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docType, setDocType] = useState('BATP');

  // -------------------------------------------------------------
  // 0. MEDIA INFORMASI & PENGUMUMAN WIDGET (UNIVERSAL FEED)
  // -------------------------------------------------------------
  const safeMediaInfo = Array.isArray(mediaInfoList) ? mediaInfoList : [];
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState('Pengumuman Kantor');
  const [mediaTargetDivision, setMediaTargetDivision] = useState('Seluruh Karyawan & Divisi');
  const [mediaContent, setMediaContent] = useState('');
  const [mediaIsPinned, setMediaIsPinned] = useState(false);
  const [mediaPhoto, setMediaPhoto] = useState(null);
  const mediaFileInputRef = useRef(null);

  // Detail Modal State
  const [selectedMediaDetail, setSelectedMediaDetail] = useState(null);
  const [isMediaDetailModalOpen, setIsMediaDetailModalOpen] = useState(false);

  const handleMediaPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setMediaPhoto(dataUrl);
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddMediaModal = () => {
    setMediaTitle('');
    setMediaCategory('Pengumuman Kantor');
    setMediaTargetDivision('Seluruh Karyawan & Divisi');
    setMediaContent('');
    setMediaIsPinned(false);
    setMediaPhoto(null);
    setIsMediaModalOpen(true);
  };

  const handleSaveMedia = (e) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaContent.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const dateStr = now.toISOString().split('T')[0];

    const matchedCat = MEDIA_CATEGORIES.find(c => c.label === mediaCategory);
    const catColor = matchedCat ? matchedCat.color : '#38BDF8';

    const newNotice = {
      id: `INFO-${Date.now().toString().slice(-4)}`,
      title: mediaTitle.trim(),
      category: mediaCategory,
      categoryColor: catColor,
      targetDivision: mediaTargetDivision,
      content: mediaContent.trim(),
      author: currentUser?.name || 'Staf AMS',
      authorRole: currentUser?.role || 'Karyawan',
      date: dateStr,
      time: timeStr,
      isPinned: mediaIsPinned,
      likesCount: 1,
      likedBy: [currentUser?.id || 'USR-001'],
      readBy: [currentUser?.name || 'Staf'],
      photo: mediaPhoto || null
    };

    setMediaInfoList([newNotice, ...safeMediaInfo]);
    showNotification('Informasi / Pengumuman baru berhasil diterbitkan untuk seluruh tim!', 'success');
    setIsMediaModalOpen(false);
  };

  const handleToggleLikeMedia = (id) => {
    const myId = currentUser?.id || 'USR-001';
    setMediaInfoList(safeMediaInfo.map(m => {
      if (m.id === id) {
        const liked = Array.isArray(m.likedBy) && m.likedBy.includes(myId);
        const nextLikedBy = liked ? m.likedBy.filter(x => x !== myId) : [...(m.likedBy || []), myId];
        return {
          ...m,
          likedBy: nextLikedBy,
          likesCount: nextLikedBy.length
        };
      }
      return m;
    }));
  };

  const handleMarkAsReadMedia = (id) => {
    const myName = currentUser?.name || 'Staf';
    setMediaInfoList(safeMediaInfo.map(m => {
      if (m.id === id) {
        const reads = Array.isArray(m.readBy) ? m.readBy : [];
        if (!reads.includes(myName)) {
          return { ...m, readBy: [...reads, myName] };
        }
      }
      return m;
    }));
  };

  // -------------------------------------------------------------
  // 1. WORKING HOURS FORM & MODAL STATE
  // -------------------------------------------------------------
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [hoursForm, setHoursForm] = useState(() => JSON.parse(JSON.stringify(workingHours || {})));

  useEffect(() => {
    if (workingHours) {
      setHoursForm(JSON.parse(JSON.stringify(workingHours)));
    }
  }, [workingHours]);

  const handleOpenHoursModal = () => {
    setHoursForm(JSON.parse(JSON.stringify(workingHours)));
    setIsHoursModalOpen(true);
  };

  const handleSaveWorkingHours = (e) => {
    e.preventDefault();
    updateWorkingHours(hoursForm);
    showNotification('Jadwal Jam Kerja Operasional berhasil diperbarui & disimpan permanen!', 'success');
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
          <button className="btn btn-secondary" onClick={handleOpenHoursModal}>
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
            <button className="btn btn-secondary btn-sm" onClick={handleOpenHoursModal}>
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
      {/* 2. MEDIA INFORMASI & PENGUMUMAN TIM (UNIVERSAL FEED DASHBOARD)            */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.5rem', borderLeft: '4px solid #38BDF8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #38BDF8, #0284C7)', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(56, 189, 248, 0.3)' }}>
                <Megaphone size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Media Informasi & Pengumuman Tim ({safeMediaInfo.length})
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Papan pengumuman digital & memo resmi Ashoka &bull; Terbuka untuk dibaca & diterbitkan oleh seluruh karyawan
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleOpenAddMediaModal}
              style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800, padding: '0.45rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <Plus size={15} /> + Terbitkan Informasi
            </button>
            {setCurrentTab && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentTab('todo-attendance')}
                style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Lihat Selengkapnya <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

        {safeMediaInfo.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
            <Megaphone size={32} color="#38BDF8" style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Belum ada pengumuman terbaru hari ini</div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddMediaModal} style={{ marginTop: '0.75rem', background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none' }}>
              <Plus size={14} /> Terbitkan Informasi Pertama
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {safeMediaInfo.slice(0, 3).map((item) => {
              const isLiked = Array.isArray(item.likedBy) && item.likedBy.includes(currentUser?.id || 'USR-001');
              const isRead = Array.isArray(item.readBy) && item.readBy.includes(currentUser?.name || '');

              return (
                <div
                  key={item.id}
                  style={{
                    padding: '1.1rem',
                    borderRadius: '10px',
                    background: item.isPinned ? 'rgba(245, 158, 11, 0.05)' : 'rgba(255,255,255,0.03)',
                    border: item.isPinned ? '1.5px solid #F59E0B' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: item.isPinned ? '0 0 10px rgba(245, 158, 11, 0.15)' : undefined
                  }}
                >
                  <div>
                    {/* Header: Category & Pinned */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ background: `${item.categoryColor || '#38BDF8'}20`, color: item.categoryColor || '#38BDF8', padding: '2px 8px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 800 }}>
                        {item.category}
                      </span>
                      {item.isPinned && (
                        <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', border: '1px solid #F59E0B', padding: '2px 6px', borderRadius: '5px', fontSize: '0.68rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <Pin size={10} /> PINNED
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.4rem 0', lineHeight: 1.35 }}>
                      {item.title}
                    </h4>

                    {/* Author & Timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#38BDF8', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.68rem' }}>
                        {item.author?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <strong>{item.author}</strong> ({item.authorRole}) &bull; <span style={{ color: 'var(--text-subtle)' }}>{item.date} {item.time}</span>
                      </div>
                    </div>

                    {/* Content Snippet */}
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 0.75rem 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.content}
                    </p>

                    {/* Photo thumbnail */}
                    {item.photo && (
                      <div 
                        onClick={() => { setSelectedMediaDetail(item); setIsMediaDetailModalOpen(true); }}
                        style={{ marginBottom: '0.75rem', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)', cursor: 'pointer', height: '110px' }}
                      >
                        <img src={item.photo} alt="Lampiran" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    )}
                  </div>

                  {/* Actions: Suka & Tandai Dibaca */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                      onClick={() => handleToggleLikeMedia(item.id)}
                      style={{
                        background: isLiked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: isLiked ? '#EF4444' : 'var(--text-muted)',
                        border: isLiked ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)',
                        borderRadius: '5px',
                        padding: '2px 7px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Heart size={12} fill={isLiked ? '#EF4444' : 'none'} /> {item.likesCount || 0} Suka
                    </button>

                    <button
                      onClick={() => handleMarkAsReadMedia(item.id)}
                      style={{
                        background: isRead ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.05)',
                        color: isRead ? '#10B981' : 'var(--text-muted)',
                        border: isRead ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                        borderRadius: '5px',
                        padding: '2px 7px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                      title={item.readBy ? `Dibaca oleh: ${item.readBy.join(', ')}` : 'Tandai sudah membaca'}
                    >
                      <Eye size={11} /> {isRead ? `✓ Dibaca (${item.readBy?.length || 1})` : `Tandai Dibaca (${item.readBy?.length || 0})`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TERBITKAN INFORMASI / PENGUMUMAN DARI DASHBOARD        */}
      {/* ------------------------------------------------------------- */}
      {isMediaModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Megaphone size={20} color="#38BDF8" /> Terbitkan Informasi / Pengumuman Baru
              </h3>
              <button onClick={() => setIsMediaModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMedia}>
              <div className="modal-body">
                {/* Author Info Pill */}
                <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <UserCheck size={16} color="#38BDF8" />
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Penerbit:</span> <strong>{currentUser?.name || 'Staf AMS'}</strong> ({currentUser?.role || 'Karyawan'}) &bull; <span style={{ color: '#10B981', fontWeight: 700 }}>Terbuka untuk Semua Tim</span>
                  </div>
                </div>

                {/* Judul Pengumuman */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📢 Judul Informasi / Pengumuman</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Update Jadwal Pengecoran Blok A / Memo Libur Nasional..."
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    required
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  {/* Kategori Informasi */}
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>🏷️ Kategori Informasi</label>
                    <select
                      className="form-control"
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value)}
                      style={{ fontWeight: 700 }}
                    >
                      {MEDIA_CATEGORIES.filter(c => c.id !== 'CAT-ALL').map(c => (
                        <option key={c.id} value={c.label}>{c.icon} {c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Divisi */}
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>🎯 Target Pembaca</label>
                    <select
                      className="form-control"
                      value={mediaTargetDivision}
                      onChange={(e) => setMediaTargetDivision(e.target.value)}
                      style={{ fontWeight: 700 }}
                    >
                      <option value="Seluruh Karyawan & Divisi">🌐 Seluruh Karyawan & Divisi</option>
                      {COMPANY_DIVISIONS.map(d => (
                        <option key={d.id} value={d.name}>🏢 {d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Isi Informasi Lengkap */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📝 Isi Pesan / Uraian Lengkap</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Tuliskan isi pengumuman, detail teknis, instruksi koordinasi, atau informasi penting di sini..."
                    value={mediaContent}
                    onChange={(e) => setMediaContent(e.target.value)}
                    required
                  />
                </div>

                {/* Upload Foto / Brosur Lampiran */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📸 Lampiran Foto / Gambar / Brosur (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={mediaFileInputRef}
                    onChange={handleMediaPhotoUpload}
                    style={{ display: 'none' }}
                  />

                  {mediaPhoto ? (
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '160px' }}>
                      <img src={mediaPhoto} alt="Lampiran" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                      <button
                        type="button"
                        onClick={() => setMediaPhoto(null)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => mediaFileInputRef.current && mediaFileInputRef.current.click()}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
                    >
                      <Upload size={14} /> Pilih Foto / Gambar dari Galeri
                    </button>
                  )}
                </div>

                {/* Pin Notice Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="pinNoticeDashCheckbox"
                    checked={mediaIsPinned}
                    onChange={(e) => setMediaIsPinned(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="pinNoticeDashCheckbox" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Pin size={13} color="#F59E0B" /> Sematkan Pengumuman di Paling Atas (Pinned Notice)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsMediaModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800 }}>
                  <Send size={15} /> 🚀 Terbitkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DETAIL & ZOOM FOTO PENGUMUMAN DARI DASHBOARD           */}
      {/* ------------------------------------------------------------- */}
      {isMediaDetailModalOpen && selectedMediaDetail && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                <Megaphone size={18} color="#38BDF8" /> {selectedMediaDetail.title}
              </h3>
              <button onClick={() => setIsMediaDetailModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {selectedMediaDetail.photo && (
                <div style={{ marginBottom: '1rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#000' }}>
                  <img src={selectedMediaDetail.photo} alt="Lampiran" style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', display: 'block' }} />
                </div>
              )}

              <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: `${selectedMediaDetail.categoryColor || '#38BDF8'}20`, color: selectedMediaDetail.categoryColor || '#38BDF8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                    {selectedMediaDetail.category}
                  </span>
                  {selectedMediaDetail.targetDivision && (
                    <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      🎯 {selectedMediaDetail.targetDivision}
                    </span>
                  )}
                </div>

                <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
                  {selectedMediaDetail.content}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem' }}>
                  <div><strong>👤 Diterbitkan Oleh:</strong> {selectedMediaDetail.author} ({selectedMediaDetail.authorRole})</div>
                  <div><strong>📅 Waktu Terbit:</strong> {selectedMediaDetail.date} &bull; {selectedMediaDetail.time}</div>
                  {selectedMediaDetail.readBy && (
                    <div style={{ marginTop: '4px', color: '#10B981' }}>
                      <strong>👁️ Telah Dibaca ({selectedMediaDetail.readBy.length} Orang):</strong> {selectedMediaDetail.readBy.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsMediaDetailModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
