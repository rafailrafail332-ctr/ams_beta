import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  FileCheck, 
  ShieldCheck, 
  BookOpen, 
  Award,
  ChevronRight,
  Sparkles,
  FileSignature,
  X,
  Edit3,
  Trash2,
  Check,
  Building2,
  CreditCard,
  MapPin,
  Calendar
} from 'lucide-react';

export const LegalModule = () => {
  const { currentUser, units, updateUnit, activeSubTab, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('shgb');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  // -------------------------------------------------------------
  // 1. SHGB MASTER TITLING STORE (MULTI-PROJECT CRUD)
  // -------------------------------------------------------------
  const initialMasterShgbList = [
    {
      id: 'SHGB-01',
      projectName: 'Perumahan Grand Harmoni Residence (Kawasan 1)',
      noSertifikat: 'SHGB No. 405/Kedungwuni (Sertifikat Induk 30 Tahun)',
      expDate: '2045-08-17 (Sisa Masa Berlaku 20 Tahun)',
      luasTotal: '15.000 m² (Fase 1 & Fase 2)',
      nib: 'NIB 12.04.05.00891',
      kantorBpn: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
      bpnStatus: 'Clean & Clear Valid',
      pemegangHak: 'PT Ashoka Enterprise Development'
    },
    {
      id: 'SHGB-02',
      projectName: 'Perumahan Emerald Sapphire Hill (Kawasan 2)',
      noSertifikat: 'SHGB No. 512/Kedungwuni (Sertifikat Induk 30 Tahun)',
      expDate: '2048-11-20 (Sisa Masa Berlaku 23 Tahun)',
      luasTotal: '22.500 m² (Cluster Sapphire & Topaz)',
      nib: 'NIB 12.04.05.00942',
      kantorBpn: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
      bpnStatus: 'Clean & Clear Valid',
      pemegangHak: 'PT Ashoka Enterprise Development'
    }
  ];

  const [shgbList, setShgbList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_master_shgb_list_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialMasterShgbList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_master_shgb_list_v2', JSON.stringify(shgbList));
    } catch (e) {}
  }, [shgbList]);

  const [isShgbModalOpen, setIsShgbModalOpen] = useState(false);
  const [editingShgb, setEditingShgb] = useState(null);
  const [shgbForm, setShgbForm] = useState({
    projectName: '',
    noSertifikat: '',
    expDate: '',
    luasTotal: '',
    nib: '',
    kantorBpn: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
    bpnStatus: 'Clean & Clear Valid',
    pemegangHak: 'PT Ashoka Enterprise Development'
  });

  const handleOpenAddShgb = () => {
    setEditingShgb(null);
    setShgbForm({
      projectName: '',
      noSertifikat: '',
      expDate: '2045-12-31',
      luasTotal: '',
      nib: '',
      kantorBpn: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
      bpnStatus: 'Clean & Clear Valid',
      pemegangHak: 'PT Ashoka Enterprise Development'
    });
    setIsShgbModalOpen(true);
  };

  const handleOpenEditShgb = (item) => {
    setEditingShgb(item);
    setShgbForm(item);
    setIsShgbModalOpen(true);
  };

  const handleSaveShgb = (e) => {
    e.preventDefault();
    if (editingShgb) {
      setShgbList(prev => prev.map(s => s.id === editingShgb.id ? { ...s, ...shgbForm } : s));
      showNotification(`Sertifikat Induk untuk "${shgbForm.projectName}" berhasil diperbarui!`);
    } else {
      const newShgb = {
        id: `SHGB-0${shgbList.length + 1}`,
        ...shgbForm
      };
      setShgbList(prev => [newShgb, ...prev]);
      showNotification(`Sertifikat Induk Baru untuk "${shgbForm.projectName}" berhasil ditambahkan!`);
    }
    setIsShgbModalOpen(false);
  };

  const handleDeleteShgb = (id, projectName) => {
    if (window.confirm(`Hapus sertifikat induk untuk ${projectName}?`)) {
      setShgbList(prev => prev.filter(s => s.id !== id));
      showNotification(`Sertifikat induk ${projectName} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // 2. PBG / IMB INDUK STORE (CRUD)
  // -------------------------------------------------------------
  const initialPbgList = [
    { id: 'PBG-01', noPbg: 'PBG No. 503/PBG/2024', peruntukan: 'Kawasan Perumahan Grand Harmoni (24 Unit Kavling)', tglTerbit: '2024-05-10', dinas: 'DPMPTSP & Dinas PUPR', status: 'Terbit Valid (Aktif)', notes: 'Izin PBG Induk untuk seluruh site plan' },
    { id: 'PBG-02', noPbg: 'PBG No. 503/PBG-RUKO/2024', peruntukan: 'Ruko Komersil Boulevard Emerald Block A', tglTerbit: '2024-07-15', dinas: 'DPMPTSP & Dinas PUPR', status: 'Terbit Valid (Aktif)', notes: 'Izin PBG Komersil 3 Lantai' },
    { id: 'PBG-03', noPbg: 'PBG No. 503/PBG-FAS/2024', peruntukan: 'Clubhouse, Kolam Renang & Sarana Fasum', tglTerbit: '2024-08-20', dinas: 'DPMPTSP & Dinas PUPR', status: 'Terbit Valid (Aktif)', notes: 'Izin Fasilitas Kawasan' }
  ];

  const [pbgList, setPbgList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_pbg_list_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialPbgList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_pbg_list_v2', JSON.stringify(pbgList));
    } catch (e) {}
  }, [pbgList]);

  const [isPbgModalOpen, setIsPbgModalOpen] = useState(false);
  const [editingPbg, setEditingPbg] = useState(null);
  const [pbgForm, setPbgForm] = useState({
    noPbg: '',
    peruntukan: '',
    tglTerbit: '',
    dinas: 'DPMPTSP & Dinas PUPR',
    status: 'Terbit Valid (Aktif)',
    notes: ''
  });

  const handleOpenAddPbg = () => {
    setEditingPbg(null);
    setPbgForm({
      noPbg: '',
      peruntukan: '',
      tglTerbit: new Date().toISOString().split('T')[0],
      dinas: 'DPMPTSP & Dinas PUPR',
      status: 'Terbit Valid (Aktif)',
      notes: ''
    });
    setIsPbgModalOpen(true);
  };

  const handleOpenEditPbg = (item) => {
    setEditingPbg(item);
    setPbgForm(item);
    setIsPbgModalOpen(true);
  };

  const handleSavePbg = (e) => {
    e.preventDefault();
    if (editingPbg) {
      setPbgList(prev => prev.map(p => p.id === editingPbg.id ? { ...p, ...pbgForm } : p));
      showNotification(`Izin PBG "${pbgForm.noPbg}" berhasil diperbarui!`);
    } else {
      const newPbg = {
        id: `PBG-0${pbgList.length + 1}`,
        ...pbgForm
      };
      setPbgList(prev => [newPbg, ...prev]);
      showNotification(`Izin PBG Baru "${pbgForm.noPbg}" berhasil ditambahkan!`);
    }
    setIsPbgModalOpen(false);
  };

  const handleDeletePbg = (id, noPbg) => {
    if (window.confirm(`Hapus izin ${noPbg}?`)) {
      setPbgList(prev => prev.filter(p => p.id !== id));
      showNotification(`Izin PBG ${noPbg} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // 3. SPLITZING SHM BPN STORE (CRUD Status Unit)
  // -------------------------------------------------------------
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [editingSplitUnit, setEditingSplitUnit] = useState(null);
  const [splitForm, setSplitForm] = useState({
    unitNo: '',
    owner: '',
    shgb: 'SHGB No 405 (Exp 2045)',
    status: 'SHM Ready (No. 1024/SHM)',
    splitStatus: 'SELESAI BALIK NAMA'
  });

  const handleOpenEditSplit = (u) => {
    setEditingSplitUnit(u);
    setSplitForm({
      unitNo: u.unitNo,
      owner: u.owner,
      shgb: u.legal?.shgb || 'SHGB No 405 (Exp 2045)',
      status: u.legal?.status || 'SHM Ready (No. 1024/SHM)',
      splitStatus: u.legal?.splitStatus || 'SELESAI BALIK NAMA'
    });
    setIsSplitModalOpen(true);
  };

  const handleSaveSplit = (e) => {
    e.preventDefault();
    if (editingSplitUnit) {
      updateUnit(editingSplitUnit.id, {
        ...editingSplitUnit,
        legal: {
          ...editingSplitUnit.legal,
          shgb: splitForm.shgb,
          status: splitForm.status,
          splitStatus: splitForm.splitStatus
        }
      });
      showNotification(`Status Splitzing Unit ${splitForm.unitNo} berhasil diperbarui!`);
    }
    setIsSplitModalOpen(false);
  };

  // -------------------------------------------------------------
  // 4. APHT & BANK MITRA STORE (CRUD)
  // -------------------------------------------------------------
  const initialBanks = [
    { id: 'BNK-01', bankName: 'Bank Mandiri', pksNo: 'PKS No. 042/PKS-MANDIRI/2024', aphtStatus: 'APHT Terbit Valid', plafon: 'Rp 10.000.000.000', pic: 'Aditya (Loan Officer)', status: 'Kerjasama Aktif' },
    { id: 'BNK-02', bankName: 'Bank Central Asia (BCA)', pksNo: 'PKS No. 118/PKS-BCA/2024', aphtStatus: 'APHT Terbit Valid', plafon: 'Rp 8.500.000.000', pic: 'Dewi (Mortgage Head)', status: 'Kerjasama Aktif' },
    { id: 'BNK-03', bankName: 'Bank Syariah Indonesia (BSI)', pksNo: 'PKS No. 089/PKS-BSI/2024', aphtStatus: 'Akad Syariah & APHT Valid', plafon: 'Rp 7.000.000.000', pic: 'Hendra (Branch Manager)', status: 'Kerjasama Aktif' },
    { id: 'BNK-04', bankName: 'Bank Tabungan Negara (BTN)', pksNo: 'PKS No. 201/PKS-BTN/2024', aphtStatus: 'APHT Terbit Valid', plafon: 'Rp 12.000.000.000', pic: 'Rian (Consumer Loan)', status: 'Kerjasama Aktif' }
  ];

  const [bankList, setBankList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_bank_pks_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialBanks;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_bank_pks_v2', JSON.stringify(bankList));
    } catch (e) {}
  }, [bankList]);

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [bankForm, setBankForm] = useState({
    bankName: '',
    pksNo: '',
    aphtStatus: 'APHT Terbit Valid',
    plafon: '',
    pic: '',
    status: 'Kerjasama Aktif'
  });

  const handleOpenAddBank = () => {
    setEditingBank(null);
    setBankForm({
      bankName: '',
      pksNo: '',
      aphtStatus: 'APHT Terbit Valid',
      plafon: 'Rp 5.000.000.000',
      pic: '',
      status: 'Kerjasama Aktif'
    });
    setIsBankModalOpen(true);
  };

  const handleOpenEditBank = (item) => {
    setEditingBank(item);
    setBankForm(item);
    setIsBankModalOpen(true);
  };

  const handleSaveBank = (e) => {
    e.preventDefault();
    if (editingBank) {
      setBankList(prev => prev.map(b => b.id === editingBank.id ? { ...b, ...bankForm } : b));
      showNotification(`PKS Mitra Bank "${bankForm.bankName}" berhasil diperbarui!`);
    } else {
      const newBank = {
        id: `BNK-0${bankList.length + 1}`,
        ...bankForm
      };
      setBankList(prev => [newBank, ...prev]);
      showNotification(`PKS Mitra Bank Baru "${bankForm.bankName}" berhasil didaftarkan!`);
    }
    setIsBankModalOpen(false);
  };

  const handleDeleteBank = (id, bankName) => {
    if (window.confirm(`Hapus mitra bank ${bankName}?`)) {
      setBankList(prev => prev.filter(b => b.id !== id));
      showNotification(`Mitra Bank ${bankName} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // 5. AKTA PPJB NOTARIS STORE (CRUD)
  // -------------------------------------------------------------
  const initialNotaryDeeds = [
    { id: 'PPJB-2025-01', kavling: 'Unit A-01', owner: 'Budi Santoso', notaris: 'Hj. Ratna Sari, SH, M.Kn', status: 'PPJB Selesai TTD', bankPks: 'PKS KPR Mandiri', date: '2025-08-01' },
    { id: 'PPJB-2025-02', kavling: 'Unit A-02', owner: 'Siti Rahmawati', notaris: 'Hj. Ratna Sari, SH, M.Kn', status: 'Proses TTD Notaris', bankPks: 'PKS KPR BCA', date: '2025-08-05' },
    { id: 'PPJB-2025-03', kavling: 'Unit B-05', owner: 'Dr. Ahmad Fauzi', notaris: 'Bambang Irawan, SH', status: 'Drafting PPJB', bankPks: 'Cash Bertahap', date: '2025-08-10' }
  ];

  const [notaryDeeds, setNotaryDeeds] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_notary_deeds_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialNotaryDeeds;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_notary_deeds_v2', JSON.stringify(notaryDeeds));
    } catch (e) {}
  }, [notaryDeeds]);

  const [isPpjbModalOpen, setIsPpjbModalOpen] = useState(false);
  const [editingPpjb, setEditingPpjb] = useState(null);
  const [ppjbForm, setPpjbForm] = useState({
    kavling: 'Unit A-01',
    owner: '',
    notaris: 'Hj. Ratna Sari, SH, M.Kn',
    status: 'Drafting PPJB',
    bankPks: 'PKS KPR Mandiri'
  });

  const handleOpenAddPpjb = () => {
    setEditingPpjb(null);
    setPpjbForm({
      kavling: 'Unit A-01',
      owner: '',
      notaris: 'Hj. Ratna Sari, SH, M.Kn',
      status: 'Drafting PPJB',
      bankPks: 'PKS KPR Mandiri'
    });
    setIsPpjbModalOpen(true);
  };

  const handleOpenEditPpjb = (item) => {
    setEditingPpjb(item);
    setPpjbForm(item);
    setIsPpjbModalOpen(true);
  };

  const handleSavePpjb = (e) => {
    e.preventDefault();
    if (editingPpjb) {
      setNotaryDeeds(prev => prev.map(n => n.id === editingPpjb.id ? { ...n, ...ppjbForm } : n));
      showNotification(`Berkas PPJB "${ppjbForm.kavling}" berhasil diperbarui!`);
    } else {
      const newPpjb = {
        id: `PPJB-2025-0${notaryDeeds.length + 1}`,
        ...ppjbForm,
        date: new Date().toISOString().split('T')[0]
      };
      setNotaryDeeds(prev => [newPpjb, ...prev]);
      showNotification(`Berkas PPJB baru untuk ${ppjbForm.kavling} berhasil didaftarkan!`);
    }
    setIsPpjbModalOpen(false);
  };

  const handleDeletePpjb = (id, kavling) => {
    if (window.confirm(`Hapus berkas PPJB untuk ${kavling}?`)) {
      setNotaryDeeds(prev => prev.filter(n => n.id !== id));
      showNotification(`Berkas PPJB ${id} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // 6. DISPUTE AUDIT SENGKETA STORE (CRUD)
  // -------------------------------------------------------------
  const initialDisputes = [
    { id: 'AUD-01', objectLand: 'Hamparan Lahan Induk Grand Harmoni (1.5 Ha)', date: '2025-08-01', auditor: 'Wahyu Salma Septiani, S.H (Legal)', result: 'Clean & Clear (Bebas Perkara)', status: 'Verified Clean', conclusion: 'Tidak ada riwayat sengketa batas tanah atau klaim pihak ketiga.' },
    { id: 'AUD-02', objectLand: 'Lahan Fasum / Fasos & Rencana Pelebaran Jalan Utama', date: '2025-08-10', auditor: 'Wahyu Salma Septiani, S.H (Legal)', result: 'Clean & Clear (Bebas Klaim Warga)', status: 'Verified Clean', conclusion: 'Sosialisasi batas lahan dengan warga sekitar tuntas 100%.' }
  ];

  const [disputeList, setDisputeList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_dispute_audits_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialDisputes;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_dispute_audits_v2', JSON.stringify(disputeList));
    } catch (e) {}
  }, [disputeList]);

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [editingDispute, setEditingDispute] = useState(null);
  const [disputeForm, setDisputeForm] = useState({
    objectLand: '',
    auditor: 'Wahyu Salma Septiani, S.H (Legal)',
    result: 'Clean & Clear (Bebas Perkara)',
    status: 'Verified Clean',
    conclusion: ''
  });

  const handleOpenAddDispute = () => {
    setEditingDispute(null);
    setDisputeForm({
      objectLand: '',
      auditor: currentUser?.name || 'Wahyu Salma Septiani, S.H (Legal)',
      result: 'Clean & Clear (Bebas Perkara)',
      status: 'Verified Clean',
      conclusion: ''
    });
    setIsDisputeModalOpen(true);
  };

  const handleOpenEditDispute = (item) => {
    setEditingDispute(item);
    setDisputeForm(item);
    setIsDisputeModalOpen(true);
  };

  const handleSaveDispute = (e) => {
    e.preventDefault();
    if (editingDispute) {
      setDisputeList(prev => prev.map(d => d.id === editingDispute.id ? { ...d, ...disputeForm } : d));
      showNotification(`Hasil Audit Lahan "${disputeForm.objectLand}" berhasil diperbarui!`);
    } else {
      const newDispute = {
        id: `AUD-0${disputeList.length + 1}`,
        ...disputeForm,
        date: new Date().toISOString().split('T')[0]
      };
      setDisputeList(prev => [newDispute, ...prev]);
      showNotification(`Audit Bebas Sengketa Baru berhasil ditambahkan!`);
    }
    setIsDisputeModalOpen(false);
  };

  const handleDeleteDispute = (id, objectLand) => {
    if (window.confirm(`Hapus laporan audit ${objectLand}?`)) {
      setDisputeList(prev => prev.filter(d => d.id !== id));
      showNotification(`Laporan audit ${id} berhasil dihapus.`, 'warning');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Legal & Perizinan</h1>
          <p className="page-subtitle">Master titling SHGB 30-thn untuk seluruh perumahan, PBG Induk, pemecahan SHM per-kavling BPN, APHT Notaris, & Audit Sengketa Lahan.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setIsReportModalOpen(true)}>
            <Printer size={16} /> Cetak Legality Audit Report
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.15)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Master SHGB Induk</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{shgbList.length} Kawasan Proyek</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSignature size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Izin PBG Terbit</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{pbgList.length} Berkas Valid</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Splitzing SHM BPN</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{units.filter(u => u.legal?.status?.includes('Ready') || u.legal?.status?.includes('SHM')).length} Unit Selesai</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dispute Audit Status</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>0 Sengketa</div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for Legal */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'shgb' ? 'active' : ''}`} onClick={() => setActiveTab('shgb')}>
          <Scale size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. SHGB Master Titling ({shgbList.length} Perumahan)
        </button>
        <button className={`tab-item ${activeTab === 'pbg' ? 'active' : ''}`} onClick={() => setActiveTab('pbg')}>
          <FileSignature size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. PBG / IMB Induk
        </button>
        <button className={`tab-item ${activeTab === 'split' ? 'active' : ''}`} onClick={() => setActiveTab('split')}>
          <FileCheck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 3. Splitzing SHM BPN
        </button>
        <button className={`tab-item ${activeTab === 'apht' ? 'active' : ''}`} onClick={() => setActiveTab('apht')}>
          <Award size={16} style={{ display: 'inline', marginRight: '6px' }} /> 4. APHT & Bank Mitra
        </button>
        <button className={`tab-item ${activeTab === 'ppjb' ? 'active' : ''}`} onClick={() => setActiveTab('ppjb')}>
          <BookOpen size={16} style={{ display: 'inline', marginRight: '6px' }} /> 5. Akta PPJB Notaris
        </button>
        <button className={`tab-item ${activeTab === 'dispute' ? 'active' : ''}`} onClick={() => setActiveTab('dispute')}>
          <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 6. Dispute Audit Sengketa
        </button>
      </div>

      {/* 1. SHGB MASTER TITLING (MULTI-PROJECT CRUD) */}
      {activeTab === 'shgb' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>1. SHGB Master Titling (Sertifikat Induk Kawasan Perumahan)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Daftar Hak Guna Bangunan Induk atas nama <strong>PT Ashoka Enterprise Development</strong> untuk semua portofolio proyek perumahan.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenAddShgb}>
              <Plus size={16} /> + Tambah Sertifikat Induk Proyek
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {shgbList.map((item, idx) => (
              <div key={item.id} className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                      <span className="badge badge-primary">{item.id}</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                        {item.projectName}
                      </h4>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Pemegang Hak: <strong style={{ color: 'var(--text-main)' }}>{item.pemegangHak || 'PT Ashoka Enterprise Development'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditShgb(item)} title="Edit Sertifikat Induk">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteShgb(item.id, item.projectName)} title="Hapus">
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Nomor Sertifikat Induk</div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--accent-primary)', marginTop: '2px' }}>{item.noSertifikat}</div>
                  </div>

                  <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Masa Berlaku HGB</div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--success)', marginTop: '2px' }}>{item.expDate}</div>
                  </div>

                  <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Luas Lahan Terdaftar</div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)', marginTop: '2px' }}>{item.luasTotal}</div>
                  </div>

                  <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status BPN & NIB</div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--success)', marginTop: '2px' }}>
                      ✓ {item.bpnStatus} &bull; {item.nib}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={13} color="var(--accent-primary)" /> {item.kantorBpn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PBG / IMB INDUK (FULL CRUD) */}
      {activeTab === 'pbg' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>2. PBG / IMB Induk & Per-Kavling Unit</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daftar Surat Persetujuan Bangunan Gedung (PBG) resmi dari Dinas Penanaman Modal (DPMPTSP) & PUPR.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddPbg}>
              <Plus size={14} /> + Tambah Izin PBG
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No ID & Nomor PBG</th>
                  <th>Peruntukan Bangunan</th>
                  <th>Instansi Penerbit</th>
                  <th>Tanggal Terbit</th>
                  <th>Status Izin</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pbgList.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{p.noPbg}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{p.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.peruntukan}</div>
                      {p.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.notes}</div>}
                    </td>
                    <td><span className="badge badge-info">{p.dinas}</span></td>
                    <td>{p.tglTerbit}</td>
                    <td><span className="badge badge-success">{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditPbg(p)} title="Edit PBG">
                          <Edit3 size={13} />
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeletePbg(p.id, p.noPbg)} title="Hapus">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SPLITZING SHM BPN (FULL CRUD STATUS) */}
      {activeTab === 'split' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>3. Pemecahan SHM Per-Kavling BPN (Splitzing)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monitoring dan update pemecahan sertifikat induk menjadi Sertipikat Hak Milik (SHM) per kavling.</p>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No Unit Kavling</th>
                  <th>Pemilik (Owner)</th>
                  <th>Sertifikat Induk Asal</th>
                  <th>Nomor SHM Pecahan & Status BPN</th>
                  <th>Proses Balik Nama</th>
                  <th>Aksi Update</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr key={u.id}>
                    <td><div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {u.unitNo}</div></td>
                    <td><div style={{ fontWeight: 700 }}>{u.owner}</div></td>
                    <td>{u.legal?.shgb || 'SHGB No 405 (Exp 2045)'}</td>
                    <td><span className="badge badge-success">{u.legal?.status || 'SHM Ready (No. 1024/SHM)'}</span></td>
                    <td>
                      <span className="badge badge-info">{u.legal?.splitStatus || 'SELESAI BALIK NAMA'}</span>
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditSplit(u)}>
                        <Edit3 size={13} /> Edit Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. APHT NOTARIS & BANK MITRA (FULL CRUD) */}
      {activeTab === 'apht' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>4. APHT Notaris & PKS Kerjasama Bank Mitra KPR</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Perjanjian Kerjasama (PKS) pembiayaan KPR & Akta Pembebanan Hak Tanggungan (APHT).</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddBank}>
              <Plus size={14} /> + Tambah Mitra Bank
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Bank Mitra</th>
                  <th>Nomor PKS Kerjasama</th>
                  <th>Status APHT Notaris</th>
                  <th>Plafon Kerjasama</th>
                  <th>PIC / Loan Officer</th>
                  <th>Status PKS</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bankList.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{b.bankName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{b.id}</div>
                    </td>
                    <td><div style={{ fontWeight: 700 }}>{b.pksNo}</div></td>
                    <td><span className="badge badge-success">{b.aphtStatus}</span></td>
                    <td><div style={{ fontWeight: 700 }}>{b.plafon}</div></td>
                    <td>{b.pic}</td>
                    <td><span className="badge badge-info">{b.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditBank(b)} title="Edit Bank">
                          <Edit3 size={13} />
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteBank(b.id, b.bankName)} title="Hapus">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PPJB (FULL CRUD) */}
      {activeTab === 'ppjb' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>5. Akta Pengikatan PPJB & Notaris Mitras</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daftar akta pengikatan jual beli (PPJB) resmi dihadapan Notaris rekanan.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddPpjb}>
              <Plus size={14} /> + Tambah Berkas PPJB
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No Berkas PPJB</th>
                  <th>Kavling Unit</th>
                  <th>Nama Pembeli</th>
                  <th>Notaris Rekanan</th>
                  <th>Skema Pembayaran</th>
                  <th>Status Akta Notaris</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {notaryDeeds.map((n) => (
                  <tr key={n.id}>
                    <td><div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{n.id}</div></td>
                    <td>{n.kavling}</td>
                    <td><div style={{ fontWeight: 700 }}>{n.owner}</div></td>
                    <td>{n.notaris}</td>
                    <td><span className="badge badge-info">{n.bankPks}</span></td>
                    <td>
                      <span className={`badge ${n.status.includes('Selesai') ? 'badge-success' : 'badge-warning'}`}>
                        {n.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditPpjb(n)} title="Edit PPJB">
                          <Edit3 size={13} />
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeletePpjb(n.id, n.kavling)} title="Hapus">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. DISPUTE AUDIT (FULL CRUD) */}
      {activeTab === 'dispute' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>6. Dispute Audit Sengketa & Legal Due Diligence Lahan</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dokumen hasil uji kelayakan hukum dan sertifikasi bebas sengketa lahan proyek.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddDispute}>
              <Plus size={14} /> + Tambah Laporan Audit
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No ID & Objek Tanah</th>
                  <th>Tanggal Audit</th>
                  <th>Auditor Legal</th>
                  <th>Hasil Uji Kelayakan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {disputeList.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{d.objectLand}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{d.id} &bull; {d.conclusion}</div>
                    </td>
                    <td>{d.date}</td>
                    <td><div style={{ fontWeight: 700 }}>{d.auditor}</div></td>
                    <td><span className="badge badge-success">{d.result}</span></td>
                    <td><span className="badge badge-info">{d.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditDispute(d)} title="Edit Audit">
                          <Edit3 size={13} />
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteDispute(d.id, d.objectLand)} title="Hapus">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: TAMBAH / EDIT SHGB MASTER (MULTI-PROJECT) */}
      {isShgbModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '580px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={20} color="var(--accent-primary)" /> {editingShgb ? 'Edit Data Sertifikat Induk SHGB' : 'Tambah Sertifikat Induk Perumahan Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsShgbModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveShgb}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nama Proyek Perumahan / Kawasan</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Perumahan Grand Harmoni Residence (Kawasan 2)" 
                    value={shgbForm.projectName} 
                    onChange={(e) => setShgbForm({ ...shgbForm, projectName: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Sertifikat Induk SHGB</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: SHGB No. 512/Kedungwuni (Sertifikat Induk 30 Tahun)" 
                    value={shgbForm.noSertifikat} 
                    onChange={(e) => setShgbForm({ ...shgbForm, noSertifikat: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Masa Berlaku Hak Guna Bangunan</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: 2048-11-20 (Sisa 23 Tahun)" 
                      value={shgbForm.expDate} 
                      onChange={(e) => setShgbForm({ ...shgbForm, expDate: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Total Luas Lahan Terdaftar</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: 22.500 m²" 
                      value={shgbForm.luasTotal} 
                      onChange={(e) => setShgbForm({ ...shgbForm, luasTotal: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Induk Bidang (NIB)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: NIB 12.04.05.00942" 
                      value={shgbForm.nib} 
                      onChange={(e) => setShgbForm({ ...shgbForm, nib: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Pemegang Hak Atas Tanah</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={shgbForm.pemegangHak} 
                      onChange={(e) => setShgbForm({ ...shgbForm, pemegangHak: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Kantor Pertanahan BPN</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={shgbForm.kantorBpn} 
                    onChange={(e) => setShgbForm({ ...shgbForm, kantorBpn: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Verifikasi BPN</label>
                  <select 
                    className="form-control" 
                    value={shgbForm.bpnStatus} 
                    onChange={(e) => setShgbForm({ ...shgbForm, bpnStatus: e.target.value })}
                  >
                    <option value="Clean & Clear Valid">Clean & Clear Valid (Bebas Sengketa)</option>
                    <option value="Dalam Proses Perpanjangan">Dalam Proses Perpanjangan</option>
                    <option value="Tahap Validasi Buku Tanah">Tahap Validasi Buku Tanah</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsShgbModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingShgb ? 'Simpan Perubahan SHGB' : 'Tambah Sertifikat Induk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PBG MODAL */}
      {isPbgModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileSignature size={20} color="var(--accent-primary)" /> {editingPbg ? 'Edit Izin PBG' : 'Tambah Izin PBG Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsPbgModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePbg}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Surat PBG</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: PBG No. 503/PBG/2024" 
                    value={pbgForm.noPbg} 
                    onChange={(e) => setPbgForm({ ...pbgForm, noPbg: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Peruntukan Bangunan</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Kavling Unit Rumah Blok B" 
                    value={pbgForm.peruntukan} 
                    onChange={(e) => setPbgForm({ ...pbgForm, peruntukan: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tanggal Terbit</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={pbgForm.tglTerbit} 
                      onChange={(e) => setPbgForm({ ...pbgForm, tglTerbit: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Izin</label>
                    <select 
                      className="form-control" 
                      value={pbgForm.status} 
                      onChange={(e) => setPbgForm({ ...pbgForm, status: e.target.value })}
                    >
                      <option value="Terbit Valid (Aktif)">Terbit Valid (Aktif)</option>
                      <option value="Dalam Proses Dinas">Dalam Proses Dinas</option>
                      <option value="Revisi Teknis PUPR">Revisi Teknis PUPR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Instansi Penerbit</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={pbgForm.dinas} 
                    onChange={(e) => setPbgForm({ ...pbgForm, dinas: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Catatan Izin</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    placeholder="Keterangan lampiran gambar IMB/PBG..." 
                    value={pbgForm.notes} 
                    onChange={(e) => setPbgForm({ ...pbgForm, notes: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsPbgModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPbg ? 'Simpan Perubahan' : 'Tambah Izin PBG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SPLITZING UPDATE MODAL */}
      {isSplitModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={20} color="var(--accent-primary)" /> Update Splitzing Unit {splitForm.unitNo}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsSplitModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSplit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Pemilik (Owner)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={splitForm.owner} 
                    disabled 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Sertifikat Induk Asal</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={splitForm.shgb} 
                    onChange={(e) => setSplitForm({ ...splitForm, shgb: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor SHM Hasil Pecahan (BPN)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: SHM No. 1024/Kedungwuni" 
                    value={splitForm.status} 
                    onChange={(e) => setSplitForm({ ...splitForm, status: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Proses Balik Nama</label>
                  <select 
                    className="form-control" 
                    value={splitForm.splitStatus} 
                    onChange={(e) => setSplitForm({ ...splitForm, splitStatus: e.target.value })}
                  >
                    <option value="SELESAI BALIK NAMA">SELESAI BALIK NAMA (SHM Terbit)</option>
                    <option value="PROSES UKUR BPN">PROSES UKUR BPN</option>
                    <option value="PLOTING BIDANG BPN">PLOTING BIDANG BPN</option>
                    <option value="PENDAFTARAN LOKET BPN">PENDAFTARAN LOKET BPN</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsSplitModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Status Splitzing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: BANK MITRA MODAL */}
      {isBankModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="var(--accent-primary)" /> {editingBank ? 'Edit PKS Bank Mitra' : 'Tambah PKS Bank Mitra Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsBankModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBank}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nama Bank Mitra</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Bank Mandiri / Bank BSI" 
                    value={bankForm.bankName} 
                    onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Surat PKS</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: PKS No. 042/PKS-MANDIRI/2024" 
                    value={bankForm.pksNo} 
                    onChange={(e) => setBankForm({ ...bankForm, pksNo: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Plafon Kerjasama</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: Rp 10.000.000.000" 
                      value={bankForm.plafon} 
                      onChange={(e) => setBankForm({ ...bankForm, plafon: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status APHT</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={bankForm.aphtStatus} 
                      onChange={(e) => setBankForm({ ...bankForm, aphtStatus: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>PIC Loan Officer</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={bankForm.pic} 
                      onChange={(e) => setBankForm({ ...bankForm, pic: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status PKS</label>
                    <select 
                      className="form-control" 
                      value={bankForm.status} 
                      onChange={(e) => setBankForm({ ...bankForm, status: e.target.value })}
                    >
                      <option value="Kerjasama Aktif">Kerjasama Aktif</option>
                      <option value="Proses Perpanjangan PKS">Proses Perpanjangan PKS</option>
                      <option value="Tahap Review Legal Bank">Tahap Review Legal Bank</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsBankModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBank ? 'Simpan Perubahan' : 'Tambah Bank Mitra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: FORM TAMBAH / EDIT PPJB */}
      {isPpjbModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} color="var(--accent-primary)" /> {editingPpjb ? 'Edit Berkas PPJB' : 'Tambah Berkas PPJB Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsPpjbModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePpjb}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Unit Kavling</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: Unit A-03" 
                      value={ppjbForm.kavling} 
                      onChange={(e) => setPpjbForm({ ...ppjbForm, kavling: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nama Pembeli (Owner)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nama Konsumen" 
                      value={ppjbForm.owner} 
                      onChange={(e) => setPpjbForm({ ...ppjbForm, owner: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Notaris Rekanan</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={ppjbForm.notaris} 
                    onChange={(e) => setPpjbForm({ ...ppjbForm, notaris: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Skema / Bank Mitra</label>
                    <select 
                      className="form-control" 
                      value={ppjbForm.bankPks} 
                      onChange={(e) => setPpjbForm({ ...ppjbForm, bankPks: e.target.value })}
                    >
                      <option value="PKS KPR Mandiri">PKS KPR Mandiri</option>
                      <option value="PKS KPR BCA">PKS KPR BCA</option>
                      <option value="PKS KPR BSI">PKS KPR BSI</option>
                      <option value="PKS KPR BTN">PKS KPR BTN</option>
                      <option value="Cash Bertahap">Cash Bertahap</option>
                      <option value="Cash Keras">Cash Keras</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Akta</label>
                    <select 
                      className="form-control" 
                      value={ppjbForm.status} 
                      onChange={(e) => setPpjbForm({ ...ppjbForm, status: e.target.value })}
                    >
                      <option value="Drafting PPJB">Drafting PPJB</option>
                      <option value="Proses TTD Notaris">Proses TTD Notaris</option>
                      <option value="PPJB Selesai TTD">PPJB Selesai TTD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsPpjbModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPpjb ? 'Simpan Perubahan' : 'Tambah Berkas PPJB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: DISPUTE AUDIT MODAL */}
      {isDisputeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '550px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--success)" /> {editingDispute ? 'Edit Laporan Audit Sengketa' : 'Tambah Laporan Audit Sengketa Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsDisputeModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDispute}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Objek Lahan / Wilayah Audit</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Lahan Blok C Cluster Sapphire" 
                    value={disputeForm.objectLand} 
                    onChange={(e) => setDisputeForm({ ...disputeForm, objectLand: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Auditor / Tim Legal</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={disputeForm.auditor} 
                      onChange={(e) => setDisputeForm({ ...disputeForm, auditor: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Hasil Uji Kelayakan</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={disputeForm.result} 
                      onChange={(e) => setDisputeForm({ ...disputeForm, result: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Verifikasi</label>
                  <select 
                    className="form-control" 
                    value={disputeForm.status} 
                    onChange={(e) => setDisputeForm({ ...disputeForm, status: e.target.value })}
                  >
                    <option value="Verified Clean">Verified Clean & Clear</option>
                    <option value="Dalam Proses Klarifikasi BPN">Dalam Proses Klarifikasi BPN</option>
                    <option value="Perlu Mediasi Batas Lahan">Perlu Mediasi Batas Lahan</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Kesimpulan Audit Hukum</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    placeholder="Keterangan kesimpulan hasil pengecekan buku tanah..." 
                    value={disputeForm.conclusion} 
                    onChange={(e) => setDisputeForm({ ...disputeForm, conclusion: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsDisputeModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDispute ? 'Simpan Perubahan' : 'Tambah Laporan Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: PRINTABLE OFFICIAL LEGALITY AUDIT REPORT */}
      {isReportModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '850px', width: '95%', color: '#0f172a' }}>
            {/* Header Modal Bar */}
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={20} color="#C084FC" />
                <h3 className="modal-title" style={{ color: '#0f172a' }}>
                  Dokumen Resmi - Laporan Audit Legalitas Induk Properti (Legality Audit Report)
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={handlePrint} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 800, border: 'none' }}>
                  <Printer size={16} /> Cetak / Export PDF Dokumen
                </button>
                <button onClick={() => setIsReportModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Paper Document */}
            <div 
              id="printable-paper"
              style={{
                backgroundColor: '#ffffff',
                padding: '2.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: 1.6,
                color: '#1e293b'
              }}
            >
              {/* Document Letterhead */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src="/company-logo.png" alt="Ashoka Logo" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                      PT ASHOKA ENTERPRISE DEVELOPMENT
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Divisi Legal, Perizinan & Hubungan Agraria &bull; Kawasan Grand Harmoni Residence Block A-01, Jakarta &bull; Telp: (021) 8899-7766
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '0.1em' }}>LEGAL AUDIT PASSPORT</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>NO: AUDIT-LEG/AMS/2025/VIII-009</div>
                </div>
              </div>

              {/* Document Title */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline', color: '#0f172a', margin: 0 }}>
                  LAPORAN HASIL AUDIT KELAYAKAN HUKUM & LEGALITAS PROPERTI
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
                  (COMPREHENSIVE PROPERTY LEGALITY & TITLE AUDIT REPORT)
                </p>
              </div>

              <div style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Berdasarkan hasil pemeriksaan dokumen hukum (*Legal Due Diligence*), buku tanah di Kantor ATR/BPN, serta izin peruntukan pemanfaatan ruang (ITR/KKPR), dengan ini Direksi dan Divisi Legal menyatakan bahwa status legalitas kawasan perumahan di bawah naungan <strong>PT ASHOKA ENTERPRISE DEVELOPMENT</strong> adalah sebagai berikut:
              </div>

              {/* Section 1: Land Titling Master (All Projects) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  I. STATUS KEPEMILIKAN HAK ATAS TANAH INDUK ({shgbList.length} KAWASAN PROYEK)
                </h4>
                {shgbList.map((item, idx) => (
                  <div key={item.id} style={{ marginBottom: '0.85rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '4px' }}>
                      {idx + 1}. {item.projectName}
                    </div>
                    <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '35%', color: '#64748b' }}>Nomor Sertifikat Induk</td>
                          <td style={{ fontWeight: 700 }}>: {item.noSertifikat}</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b' }}>Masa Berlaku Hak Guna Bangunan</td>
                          <td style={{ fontWeight: 700 }}>: {item.expDate}</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b' }}>Total Luas Lahan Terdaftar</td>
                          <td style={{ fontWeight: 700 }}>: {item.luasTotal} (NIB: {item.nib})</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b' }}>Status Verifikasi BPN</td>
                          <td style={{ fontWeight: 700, color: '#16a34a' }}>: ✓ {item.bpnStatus} &bull; {item.kantorBpn}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Section 2: Building Approval & Permits */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  II. PERIZINAN GEDUNG & BANGUNAN (PBG / IMB INDUK)
                </h4>
                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 0', width: '35%', color: '#64748b' }}>Nomor PBG Induk Kawasan</td>
                      <td style={{ padding: '6px 0', fontWeight: 700 }}>: {pbgList[0]?.noPbg || 'PBG No. 503/PBG/2024'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 0', color: '#64748b' }}>Instansi Penerbit</td>
                      <td style={{ padding: '6px 0', fontWeight: 700 }}>: {pbgList[0]?.dinas || 'DPMPTSP & Dinas Pekerjaan Umum (PUPR)'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 0', color: '#64748b' }}>Kesesuaian Tata Ruang (KKPR)</td>
                      <td style={{ padding: '6px 0', fontWeight: 700, color: '#16a34a' }}>: ✓ Sesuai Zonasi Perumahan Kepadatan Menengah</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 3: Notary & Bank Partnerships */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  III. REKANAN NOTARIS (PPJB/APHT) & BANK MITRA KPR
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                  • <strong>Notaris & PPAT Rekanan:</strong> Hj. Ratna Sari, SH, M.Kn & Bambang Irawan, SH<br />
                  • <strong>Perjanjian Kerjasama (PKS) Bank KPR:</strong> {bankList.map(b => b.bankName).join(', ')}.
                </div>
              </div>

              {/* Legal Conclusion Badge */}
              <div style={{ padding: '0.85rem', borderRadius: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534', marginBottom: '2px' }}>
                  KESIMPULAN AUDIT HUKUM:
                </div>
                <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
                  Seluruh legalitas tanah induk, perizinan gedung, serta akta pengikatan konsumen untuk seluruh portofolio proyek perumahan dinyatakan <strong>LENGKAP, SAH MENURUT HUKUM, DAN SIAP UNTUK AKAD KREDIT / AJB SERTIPIKAT SHM</strong>.
                </div>
              </div>

              {/* Document Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '2rem', pageBreakInside: 'avoid' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4rem' }}>
                    Dibuat & Diverifikasi Oleh:<br />
                    <strong>Head of Legal Division</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', textDecoration: 'underline' }}>
                    Wahyu Salma Septiani, S.H
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Staf Legal & Perizinan Properti</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4rem' }}>
                    Mengetahui & Mengesahkan:<br />
                    <strong>Direktur Utama / General Manager</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', textDecoration: 'underline' }}>
                    {currentUser?.name || 'Ahmad Rafail'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentUser?.role || 'Super Admin & Direktur Utama'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
