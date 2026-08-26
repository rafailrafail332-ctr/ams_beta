import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Check, 
  X, 
  FileText, 
  PieChart, 
  BarChart3, 
  Users, 
  Briefcase, 
  Sparkles, 
  Printer,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Trash2,
  Plus,
  Edit3,
  Search,
  Eye,
  Percent,
  Calculator,
  Layers,
  MapPin,
  Compass
} from 'lucide-react';

export const ExecutiveModule = () => {
  const { currentUser, units, updateUnitProgress, executiveApprovals, setExecutiveApprovals, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals', 'kpi', 'roi', 'risks', 'expansion', 'bod-minutes'

  // Helper Check Role Can Approve (Only Manager, Director, Super Admin)
  const isManagerOrDirectorOrAdmin = () => {
    if (!currentUser) return false;
    const r = currentUser.role.toLowerCase();
    return r.includes('direktur') || r.includes('manager') || r.includes('admin') || r.includes('gm');
  };

  // -------------------------------------------------------------
  // PILAR 1: CORPORATE TARGET PERFORMANCE KPIS
  // -------------------------------------------------------------
  const [corporateTargets] = useState({
    targetSalesYear: 15000000000, // Rp 15 Miliar
    actualSalesYear: 12800000000, // Rp 12.8 Miliar (85.3%)
    targetUnitsYear: 24,
    actualUnitsYear: units.filter(u => u.progress === 100).length || 20,
    grossProfitMargin: '34.2%',
    roiPercentage: '28.5% p.a'
  });

  // -------------------------------------------------------------
  // PILAR 3: FINANCIAL CASHFLOW & ROI PROFIT DATA (CRUD + PERSISTENT)
  // -------------------------------------------------------------
  const initialClusterRoi = [
    {
      id: 'ROI-EMERALD',
      clusterName: 'Grand Harmoni - Cluster Emerald',
      typeInfo: 'Tipe 45/90 (Subsidized Deluxe - 12 Unit)',
      projectedSales: 7800000000, // Rp 7.8 M
      hppConstruction: 4200000000, // Rp 4.2 M
      operationalCost: 580000000, // Rp 580 Jt
      grossProfit: 3600000000,
      netProfit: 3020000000,
      netMarginPct: '38.7%',
      roiAnnual: '31.2% p.a',
      status: 'High Profitability'
    },
    {
      id: 'ROI-SAPPHIRE',
      clusterName: 'Grand Harmoni - Cluster Sapphire',
      typeInfo: 'Tipe 60/120 (Townhouse Premium - 12 Unit)',
      projectedSales: 10680000000, // Rp 10.68 M
      hppConstruction: 5850000000, // Rp 5.85 M
      operationalCost: 850000000, // Rp 850 Jt
      grossProfit: 4830000000,
      netProfit: 3980000000,
      netMarginPct: '37.3%',
      roiAnnual: '29.8% p.a',
      status: 'High Profitability'
    },
    {
      id: 'ROI-RUBY-F3',
      clusterName: 'Masterplan Fase 3 - Cluster Ruby',
      typeInfo: 'Tipe 70/140 & Ruko Komersil (Fase 3 Expansion)',
      projectedSales: 14500000000, // Rp 14.5 M
      hppConstruction: 8100000000, // Rp 8.1 M
      operationalCost: 1280000000, // Rp 1.28 M
      grossProfit: 6400000000,
      netProfit: 5120000000,
      netMarginPct: '35.3%',
      roiAnnual: '26.5% p.a',
      status: 'Projected Expansion'
    }
  ];

  const [clusterRoiList, setClusterRoiList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_executive_roi_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialClusterRoi;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_executive_roi_v2', JSON.stringify(clusterRoiList));
    } catch (e) {}
  }, [clusterRoiList]);

  // Modal State for Detailed P&L Report
  const [isPlReportModalOpen, setIsPlReportModalOpen] = useState(false);

  // Modal State for Add / Edit Cluster ROI
  const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);
  const [editingRoi, setEditingRoi] = useState(null);
  const [roiForm, setRoiForm] = useState({
    clusterName: '',
    typeInfo: '',
    projectedSales: 8000000000,
    hppConstruction: 4500000000,
    operationalCost: 600000000,
    roiAnnual: '28.5% p.a'
  });

  const handleOpenAddRoi = () => {
    setEditingRoi(null);
    setRoiForm({
      clusterName: '',
      typeInfo: '',
      projectedSales: 8000000000,
      hppConstruction: 4500000000,
      operationalCost: 600000000,
      roiAnnual: '28.5% p.a'
    });
    setIsRoiModalOpen(true);
  };

  const handleOpenEditRoi = (item) => {
    setEditingRoi(item);
    setRoiForm({
      clusterName: item.clusterName,
      typeInfo: item.typeInfo,
      projectedSales: item.projectedSales,
      hppConstruction: item.hppConstruction,
      operationalCost: item.operationalCost,
      roiAnnual: item.roiAnnual
    });
    setIsRoiModalOpen(true);
  };

  const handleSaveRoi = (e) => {
    e.preventDefault();
    const sales = Number(roiForm.projectedSales) || 0;
    const hpp = Number(roiForm.hppConstruction) || 0;
    const opex = Number(roiForm.operationalCost) || 0;
    const gross = sales - hpp;
    const net = gross - opex;
    const marginPct = sales > 0 ? ((net / sales) * 100).toFixed(1) + '%' : '0%';

    if (editingRoi) {
      setClusterRoiList(prev => prev.map(r => r.id === editingRoi.id ? {
        ...r,
        ...roiForm,
        grossProfit: gross,
        netProfit: net,
        netMarginPct: marginPct
      } : r));
      showNotification(`Proyeksi ROI Cluster "${roiForm.clusterName}" berhasil diperbarui!`, 'success');
    } else {
      const newRoi = {
        id: `ROI-${Date.now()}`,
        status: 'Active Projections',
        ...roiForm,
        grossProfit: gross,
        netProfit: net,
        netMarginPct: marginPct
      };
      setClusterRoiList(prev => [newRoi, ...prev]);
      showNotification(`Proyeksi Cluster "${newRoi.clusterName}" berhasil ditambahkan!`, 'success');
    }
    setIsRoiModalOpen(false);
  };

  const handleDeleteRoi = (id, name) => {
    if (window.confirm(`Hapus proyeksi finansial cluster ${name}?`)) {
      setClusterRoiList(prev => prev.filter(r => r.id !== id));
      showNotification(`Proyeksi cluster ${name} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // PILAR 4: HIGH-LEVEL RISKS & AUDIT COMPLIANCE (CRUD + STORE)
  // -------------------------------------------------------------
  const initialRisks = [
    {
      id: 'RSK-01',
      title: 'Penyelesaian Splitzing SHM Induk BPN Pekalongan',
      category: 'Legalitas & Perizinan',
      level: 'High Risk',
      mitigation: 'Follow-up harian oleh Legal Specialist Fitria & Notaris PPAT Rekanan Bank.',
      status: 'Mitigated (On Track)'
    },
    {
      id: 'RSK-02',
      title: 'Kenaikan Harga Semen & Besi Beton Konstruksi Q3/Q4',
      category: 'Procurement & HPP',
      level: 'Medium Risk',
      mitigation: 'Kontrak payung volume discount dengan distributor resmi (PT Semen Gresik).',
      status: 'Locked Price (Safe)'
    },
    {
      id: 'RSK-03',
      title: 'Deviasi S-Curve Pengecoran Akses Jalan Utama Lapangan',
      category: 'Teknik & S-Curve',
      level: 'Low Risk',
      mitigation: 'Penambahan jam lembur mandor kontraktor & alat berat dump truck ready mix.',
      status: 'Resolved'
    }
  ];

  const [risks, setRisks] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_executive_risks_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialRisks;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_executive_risks_v1', JSON.stringify(risks));
    } catch (e) {}
  }, [risks]);

  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [riskForm, setRiskForm] = useState({
    title: '',
    category: 'Legalitas & Perizinan',
    level: 'High Risk',
    mitigation: '',
    status: 'In Monitoring'
  });

  const handleOpenAddRisk = () => {
    setRiskForm({
      title: '',
      category: 'Legalitas & Perizinan',
      level: 'High Risk',
      mitigation: '',
      status: 'In Monitoring'
    });
    setIsRiskModalOpen(true);
  };

  const handleSaveRisk = (e) => {
    e.preventDefault();
    const newRisk = {
      id: `RSK-0${risks.length + 1}`,
      ...riskForm
    };
    setRisks(prev => [newRisk, ...prev]);
    showNotification(`Mitigasi Risiko "${newRisk.title}" berhasil dicatat!`, 'success');
    setIsRiskModalOpen(false);
  };

  const handleDeleteRisk = (id, title) => {
    if (window.confirm(`Hapus catatan risiko ${title}?`)) {
      setRisks(prev => prev.filter(r => r.id !== id));
      showNotification(`Catatan risiko ${id} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // PILAR 5: RENCANA EKSPANSI PROYEK MASTERPLAN (CRUD + STORE)
  // -------------------------------------------------------------
  const initialExpansions = [
    {
      id: 'EXP-01',
      phaseName: 'Pembebasan Lahan Fase 3 (2.5 Hektar)',
      location: 'Sebelah Barat Cluster Sapphire',
      targetLaunch: 'Q1 2026',
      estimatedCapex: 6500000000, // Rp 6.5 M
      projectedRoi: '34.5% p.a',
      status: 'Due Diligence Legal BPN'
    },
    {
      id: 'EXP-02',
      phaseName: 'Clubhouse Komersil, Swimming Pool, & Cafe Rooftop',
      location: 'Area Fasos-Fasum Boulevard Utama',
      targetLaunch: 'Q4 2025',
      estimatedCapex: 1800000000, // Rp 1.8 M
      projectedRoi: '24.0% p.a',
      status: 'Penyusunan Desain Arsitektur'
    }
  ];

  const [expansions, setExpansions] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_executive_expansions_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialExpansions;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_executive_expansions_v1', JSON.stringify(expansions));
    } catch (e) {}
  }, [expansions]);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expForm, setExpForm] = useState({
    phaseName: '',
    location: '',
    targetLaunch: 'Q2 2026',
    estimatedCapex: 3000000000,
    projectedRoi: '30.0% p.a',
    status: 'Perencanaan Masterplan'
  });

  const handleOpenAddExp = () => {
    setExpForm({
      phaseName: '',
      location: '',
      targetLaunch: 'Q2 2026',
      estimatedCapex: 3000000000,
      projectedRoi: '30.0% p.a',
      status: 'Perencanaan Masterplan'
    });
    setIsExpModalOpen(true);
  };

  const handleSaveExp = (e) => {
    e.preventDefault();
    const newExp = {
      id: `EXP-0${expansions.length + 1}`,
      ...expForm
    };
    setExpansions(prev => [newExp, ...prev]);
    showNotification(`Roadmap Ekspansi "${newExp.phaseName}" berhasil dicatat!`, 'success');
    setIsExpModalOpen(false);
  };

  const handleDeleteExp = (id, phaseName) => {
    if (window.confirm(`Hapus roadmap ekspansi ${phaseName}?`)) {
      setExpansions(prev => prev.filter(e => e.id !== id));
      showNotification(`Roadmap ekspansi ${id} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // PILAR 6: BOD MEETING MINUTES (CRUD + STORE)
  // -------------------------------------------------------------
  const initialBodMinutes = [
    { id: 'BOD-M-01', date: '05 Agustus 2025', topic: 'Rapat Evaluasi S-Curve Proyek & Ekspansi Fase 3', decision: 'Direksi menyetujui percepatan pembebasan lahan 2.5 Ha untuk Cluster Ruby Fase 3.' },
    { id: 'BOD-M-02', date: '20 Juli 2025', topic: 'Penyertaan Modal KPR Bank Syariah BSI', decision: 'Penandatanganan PKS Mitra KPR BSI disetujui Direktur Utama.' }
  ];

  const [bodMinutes, setBodMinutes] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_bod_minutes_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialBodMinutes;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_bod_minutes_v2', JSON.stringify(bodMinutes));
    } catch (e) {}
  }, [bodMinutes]);

  const [isBodModalOpen, setIsBodModalOpen] = useState(false);
  const [bodForm, setBodForm] = useState({
    topic: '',
    date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
    decision: ''
  });

  const handleOpenAddBod = () => {
    setBodForm({
      topic: '',
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      decision: ''
    });
    setIsBodModalOpen(true);
  };

  const handleSaveBod = (e) => {
    e.preventDefault();
    const newBod = {
      id: `BOD-M-0${bodMinutes.length + 1}`,
      ...bodForm
    };
    setBodMinutes(prev => [newBod, ...prev]);
    showNotification(`Risalah Rapat Direksi "${newBod.topic}" berhasil disimpan!`, 'success');
    setIsBodModalOpen(false);
  };

  const handleDeleteMinute = (id, topic) => {
    if (window.confirm(`Hapus risalah rapat ${topic}?`)) {
      setBodMinutes(prev => prev.filter(m => m.id !== id));
      showNotification(`Risalah rapat ${topic} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // PILAR 2: EXECUTIVE APPROVAL HANDLERS
  // -------------------------------------------------------------
  const handleApproveDirector = (id) => {
    if (!isManagerOrDirectorOrAdmin()) {
      showNotification(`Akses Terbatas: Hanya Direktur Utama, Manager, atau Super Admin yang berhak memberikan ACC!`, 'danger');
      return;
    }
    
    setExecutiveApprovals(prev => prev.map(a => {
      if (a.id === id) {
        if (a.unitNo && a.unitNo !== '-') {
          updateUnitProgress(a.unitNo, 100, 'Ready (Handover)');
        }
        return { ...a, status: 'APPROVED DIREKSI' };
      }
      return a;
    }));

    showNotification(`PERSETUJUAN DIREKSI SAH! Executive Approval ${id} disahkan oleh Direktur Utama. Terhubung ke Modul Teknik, Finance & CRM!`, 'success');
  };

  const handleRejectDirector = (id) => {
    if (!isManagerOrDirectorOrAdmin()) {
      showNotification(`Akses Terbatas: Hanya Direktur Utama, Manager, atau Super Admin yang berhak memberikan ACC/Penolakan!`, 'danger');
      return;
    }
    setExecutiveApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED DIREKSI' } : a));
    showNotification(`Permohonan ${id} ditolak oleh Direktur Utama untuk direvisi oleh Manager!`, 'warning');
  };

  const handleDeleteApproval = (id, title) => {
    if (window.confirm(`Hapus pengajuan approval ${id} (${title})?`)) {
      setExecutiveApprovals(prev => prev.filter(a => a.id !== id));
      showNotification(`Pengajuan ${id} berhasil dihapus.`, 'warning');
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Aggregated Financial Calculations for ROI
  const totalProjectedSales = clusterRoiList.reduce((acc, curr) => acc + (curr.projectedSales || 0), 0);
  const totalHpp = clusterRoiList.reduce((acc, curr) => acc + (curr.hppConstruction || 0), 0);
  const totalOpex = clusterRoiList.reduce((acc, curr) => acc + (curr.operationalCost || 0), 0);
  const totalGrossProfit = totalProjectedSales - totalHpp;
  const totalNetProfit = totalGrossProfit - totalOpex;
  const avgMarginPct = totalProjectedSales > 0 ? ((totalNetProfit / totalProjectedSales) * 100).toFixed(1) + '%' : '0%';

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Manager & Board of Directors (BOD Executive Suite)</h1>
          <p className="page-subtitle">Pusat persetujuan keputusan Direksi (Executive Approval Hub terhubung 100%), performa KPI omzet, ROI finansial, & risalah rapat BOD.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsPlReportModalOpen(true)} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
          <TrendingUp size={16} /> Buka Laporan Proyeksi Laba Rugi
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Realisasi Omzet Sales 2025</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{formatRupiah(corporateTargets.actualSalesYear)}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Return on Investment (ROI)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{corporateTargets.roiPercentage} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Profit</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Executive Approval</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ef4444' }}>
              {executiveApprovals.filter(a => a.status.includes('Pending')).length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Berkas</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gross Profit Margin</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{corporateTargets.grossProfitMargin}</div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for 6 Executive Pillars */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'approvals' ? 'active' : ''}`} onClick={() => setActiveTab('approvals')}>
          <ShieldAlert size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Executive Approval Hub Direksi (Terhubung)
        </button>
        <button className={`tab-item ${activeTab === 'kpi' ? 'active' : ''}`} onClick={() => setActiveTab('kpi')}>
          <TrendingUp size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Target KPI & Performa Omzet
        </button>
        <button className={`tab-item ${activeTab === 'roi' ? 'active' : ''}`} onClick={() => setActiveTab('roi')}>
          <DollarSign size={16} style={{ display: 'inline', marginRight: '6px' }} /> 3. Financial Cashflow & ROI Profit
        </button>
        <button className={`tab-item ${activeTab === 'risks' ? 'active' : ''}`} onClick={() => setActiveTab('risks')}>
          <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 4. High-Level Risk & Audit Compliance
        </button>
        <button className={`tab-item ${activeTab === 'expansion' ? 'active' : ''}`} onClick={() => setActiveTab('expansion')}>
          <Building2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> 5. Rencana Ekspansi Proyek Masterplan
        </button>
        <button className={`tab-item ${activeTab === 'bod-minutes' ? 'active' : ''}`} onClick={() => setActiveTab('bod-minutes')}>
          <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} /> 6. Risalah Rapat BOD & Action Items
        </button>
      </div>

      {/* PILAR 2: EXECUTIVE APPROVAL HUB DIREKSI & MANAGER */}
      {activeTab === 'approvals' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Pusat Persetujuan Keputusan Direksi (Executive Approval Hub)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Validasi permohonan anggaran besar, tender lelang, & pencairan BATP oleh Direktur Utama. Terkoneksi ke Modul Teknik, Finance, & CRM.</p>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No ID & Pengajuan</th>
                  <th>Departemen Pemohon</th>
                  <th>Nominal Biaya (Rp)</th>
                  <th>Tingkat Urgensi</th>
                  <th>Status Approval Direksi</th>
                  <th>Aksi Decision Direktur</th>
                </tr>
              </thead>
              <tbody>
                {executiveApprovals.map((a) => {
                  const isApproved = a.status.includes('APPROVED');
                  const isRejected = a.status.includes('REJECTED');

                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{a.title}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{a.id} &bull; Pemohon: {a.requestedBy} &bull; {a.date}</div>
                      </td>
                      <td><span className="badge badge-info">{a.department}</span></td>
                      <td><div style={{ fontWeight: 800 }}>{formatRupiah(a.amount)}</div></td>
                      <td>
                        <span className={`badge ${a.urgency.includes('HIGH') ? 'badge-danger' : 'badge-warning'}`}>
                          {a.urgency}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isApproved ? 'badge-success' : isRejected ? 'badge-danger' : 'badge-warning'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                          {!isApproved && !isRejected ? (
                            <>
                              <button className="btn btn-primary btn-sm" onClick={() => handleApproveDirector(a.id)}>
                                <Check size={13} /> ACC Direktur
                              </button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleRejectDirector(a.id)}>
                                <X size={13} /> Tolak
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700 }}>✓ Decision Final</span>
                          )}
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDeleteApproval(a.id, a.title)}
                            style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                            title="Hapus Pengajuan"
                          >
                            <Trash2 size={13} />
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
      )}

      {/* PILAR 1: TARGET KPI & PERFORMA OMZET */}
      {activeTab === 'kpi' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Pencapaian Target KPI Korporat 2025</h3>
          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 700 }}>TARGET OMZET SALES PERUSAHAAN (2025)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, margin: '4px 0' }}>
                {formatRupiah(corporateTargets.actualSalesYear)} / {formatRupiah(corporateTargets.targetSalesYear)}
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ width: '85.3%', height: '100%', background: '#F59E0B' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Tercapai 85.3% dari Target Tahunan</div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700 }}>TARGET PENJUALAN UNIT RUMAH (INTERCONNECTED)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, margin: '4px 0' }}>
                {corporateTargets.actualUnitsYear} / {corporateTargets.targetUnitsYear} Unit Rumah
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ width: '83.3%', height: '100%', background: '#10B981' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Tercapai 83.3% dari Target Penjualan</div>
            </div>
          </div>
        </div>
      )}

      {/* PILAR 3: FINANCIAL CASHFLOW & ROI PROFIT (FULL INTERACTIVE CRUD) */}
      {activeTab === 'roi' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={22} color="#10B981" /> Proyeksi Cashflow & Gross Profit Margin (ROI {corporateTargets.roiPercentage})
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                Analisis margin keuntungan bersih per cluster perumahan & proyeksi imbal hasil investasi (ROI tahunan).
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddRoi} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                <Plus size={14} /> + Tambah Proyeksi Cluster
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setIsPlReportModalOpen(true)} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                <TrendingUp size={14} /> Buka Laporan Proyeksi Laba Rugi
              </button>
            </div>
          </div>

          {/* ROI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Proyeksi Omzet</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: '4px' }}>{formatRupiah(totalProjectedSales)}</div>
            </div>
            <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total HPP Konstruksi</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#EF4444', marginTop: '4px' }}>{formatRupiah(totalHpp)}</div>
            </div>
            <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Laba Kotor (Gross Profit)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>{formatRupiah(totalGrossProfit)}</div>
            </div>
            <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Laba Bersih & Rata-rata ROI</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>{formatRupiah(totalNetProfit)} <span style={{ fontSize: '0.78rem' }}>({avgMarginPct})</span></div>
            </div>
          </div>

          {/* Table Breakdown per Cluster */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Cluster & Tipe Kavling</th>
                  <th>Proyeksi Omzet Penjualan (Rp)</th>
                  <th>HPP Konstruksi & Lahan (Rp)</th>
                  <th>Biaya Opex & Mkt (Rp)</th>
                  <th>Laba Bersih (Net Profit)</th>
                  <th>Net Margin (%)</th>
                  <th>Proyeksi ROI p.a</th>
                  <th>Aksi CRUD</th>
                </tr>
              </thead>
              <tbody>
                {clusterRoiList.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{r.clusterName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{r.typeInfo}</div>
                    </td>
                    <td><div style={{ fontWeight: 800 }}>{formatRupiah(r.projectedSales)}</div></td>
                    <td><div style={{ fontWeight: 700, color: '#EF4444' }}>{formatRupiah(r.hppConstruction)}</div></td>
                    <td><div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{formatRupiah(r.operationalCost)}</div></td>
                    <td><div style={{ fontWeight: 900, color: '#10B981' }}>{formatRupiah(r.netProfit)}</div></td>
                    <td><span className="badge badge-success" style={{ fontWeight: 800 }}>{r.netMarginPct}</span></td>
                    <td>
                      <span className="badge badge-warning" style={{ fontWeight: 900 }}>
                        <Percent size={11} style={{ display: 'inline', marginRight: '2px' }} /> {r.roiAnnual}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditRoi(r)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                          title="Edit Proyeksi Margin"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDeleteRoi(r.id, r.clusterName)}
                          style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                          title="Hapus Proyeksi Cluster"
                        >
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

      {/* PILAR 4: HIGH-LEVEL RISKS & AUDIT COMPLIANCE */}
      {activeTab === 'risks' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>High-Level Corporate Risk & Audit Compliance</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Matriks mitigasi risiko legalitas, kenaikan harga bahan baku, deviasi S-Curve, & pajak.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddRisk} style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none', fontWeight: 800 }}>
              <Plus size={14} /> + Tambah Mitigasi Risiko
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No ID & Uraian Risiko</th>
                  <th>Kategori Risiko</th>
                  <th>Tingkat Dampak (Severity)</th>
                  <th>Rencana Aksi Mitigasi Direksi</th>
                  <th>Status Penanganan</th>
                  <th>Aksi Hapus</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{r.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>ID: {r.id}</div>
                    </td>
                    <td><span className="badge badge-info">{r.category}</span></td>
                    <td>
                      <span className={`badge ${r.level.includes('High') ? 'badge-danger' : r.level.includes('Medium') ? 'badge-warning' : 'badge-neutral'}`}>
                        {r.level}
                      </span>
                    </td>
                    <td><div style={{ fontSize: '0.85rem' }}>{r.mitigation}</div></td>
                    <td><span className="badge badge-success">{r.status}</span></td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDeleteRisk(r.id, r.title)}
                        style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                        title="Hapus Risiko"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 5: RENCANA EKSPANSI PROYEK MASTERPLAN */}
      {activeTab === 'expansion' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Roadmap Ekspansi Proyek & Masterplan Lahan Baru</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Rencana akuisisi lahan tahap lanjutan, pembangunan fasilitas komersil, & diversifikasi proyek.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddExp} style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', border: 'none', fontWeight: 800 }}>
              <Plus size={14} /> + Tambah Roadmap Ekspansi
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Fase & Lokasi Ekspansi</th>
                  <th>Target Peluncuran</th>
                  <th>Estimasi Capex Investasi (Rp)</th>
                  <th>Target ROI (p.a)</th>
                  <th>Status Progress</th>
                  <th>Aksi Hapus</th>
                </tr>
              </thead>
              <tbody>
                {expansions.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{e.phaseName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Lokasi: {e.location}</div>
                    </td>
                    <td><div style={{ fontWeight: 700 }}>{e.targetLaunch}</div></td>
                    <td><div style={{ fontWeight: 800 }}>{formatRupiah(e.estimatedCapex)}</div></td>
                    <td><span className="badge badge-warning" style={{ fontWeight: 800 }}>{e.projectedRoi}</span></td>
                    <td><span className="badge badge-info">{e.status}</span></td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDeleteExp(e.id, e.phaseName)}
                        style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                        title="Hapus Ekspansi"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 6: BOD MINUTES & ACTION ITEMS */}
      {activeTab === 'bod-minutes' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Risalah Rapat Direksi (BOD Minutes) & Komitmen Action Items</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Dokumentasi keputusan strategis, alokasi permodalan, dan notulensi rapat direksi.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddBod} style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800 }}>
              <Plus size={14} /> + Catat Risalah Rapat BOD
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {bodMinutes.map((m) => (
              <div key={m.id} style={{ padding: '1.25rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{m.topic}</div>
                    <span className="badge badge-info">{m.date}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{m.decision}</div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDeleteMinute(m.id, m.topic)}
                  style={{ color: 'var(--danger)', padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  title="Hapus Risalah Rapat"
                >
                  <Trash2 size={13} /> Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: LAPORAN LENGKAP PROYEKSI LABA RUGI & ROI (P&L REPORT)*/}
      {/* ------------------------------------------------------------- */}
      {isPlReportModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 900 }}>
                  <TrendingUp size={22} color="#10B981" /> Laporan Eksekutif Proyeksi Laba Rugi & ROI Korporat 2025/2026
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  ASHOKA Property Management System &bull; Laporan Laba Rugi Konsolidasi Proyek Perumahan
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                >
                  <Printer size={14} /> Cetak / Print PDF
                </button>
                <button onClick={() => setIsPlReportModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="modal-body" style={{ padding: '1.5rem 0' }}>
              {/* Financial Highlight Grid */}
              <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>PROYEKSI REVENUE SALES TOTAL</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
                    {formatRupiah(totalProjectedSales)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Konsolidasi Semua Cluster</div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800 }}>LABA BERSIH SETELAH OPEX & TAX</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>
                    {formatRupiah(totalNetProfit)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Net Profit Margin {avgMarginPct}</div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 800 }}>ESTIMASI ROI TAHUNAN (P.A)</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: '4px' }}>
                    {corporateTargets.roiPercentage}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Return on Equity Investor</div>
                </div>
              </div>

              {/* Detailed Financial Statement Table */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-color)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 800 }}>Komponen Pos Keuangan (Laba Rugi Proyek)</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800 }}>Nominal Akuntansi (Rp)</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800 }}>Rasio (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>1. Pendapatan Penjualan Properti (Gross Revenue)</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800 }}>{formatRupiah(totalProjectedSales)}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>100.0%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', paddingLeft: '2rem', color: '#EF4444' }}>- Beban Pokok Penjualan / HPP Konstruksi & Lahan</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#EF4444', fontWeight: 700 }}>({formatRupiah(totalHpp)})</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#EF4444' }}>{((totalHpp / totalProjectedSales) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(245, 158, 11, 0.05)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#F59E0B' }}>2. Laba Kotor Operasional (Gross Profit Margin)</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 900, color: '#F59E0B' }}>{formatRupiah(totalGrossProfit)}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800, color: '#F59E0B' }}>{((totalGrossProfit / totalProjectedSales) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', paddingLeft: '2rem', color: 'var(--text-muted)' }}>- Biaya Pemasaran, Iklan & Komisi Sales (2.5%)</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>({formatRupiah(totalOpex * 0.45)})</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>{(((totalOpex * 0.45) / totalProjectedSales) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', paddingLeft: '2rem', color: 'var(--text-muted)' }}>- Beban Operasional Kantor & Gaji Tim Proyek</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>({formatRupiah(totalOpex * 0.55)})</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>{(((totalOpex * 0.55) / totalProjectedSales) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr style={{ background: 'rgba(16, 185, 129, 0.1)', borderTop: '2px solid rgba(16, 185, 129, 0.4)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: '#10B981', fontSize: '0.95rem' }}>3. LABA BERSIH KORPORAT (NET PROFIT AFTER TAX)</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 900, color: '#10B981', fontSize: '1.05rem' }}>{formatRupiah(totalNetProfit)}</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 900, color: '#10B981', fontSize: '0.95rem' }}>{avgMarginPct}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cluster Detail Breakdown Table */}
              <h4 style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Rincian Performa Keuntungan per Cluster:
              </h4>
              <div className="table-container">
                <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Nama Cluster</th>
                      <th>Proyeksi Omzet</th>
                      <th>HPP Konstruksi</th>
                      <th>Laba Kotor</th>
                      <th>Laba Bersih</th>
                      <th>Net Margin</th>
                      <th>ROI Tahunan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusterRoiList.map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.clusterName}</strong></td>
                        <td>{formatRupiah(c.projectedSales)}</td>
                        <td style={{ color: '#EF4444' }}>{formatRupiah(c.hppConstruction)}</td>
                        <td style={{ color: '#F59E0B', fontWeight: 700 }}>{formatRupiah(c.grossProfit)}</td>
                        <td style={{ color: '#10B981', fontWeight: 800 }}>{formatRupiah(c.netProfit)}</td>
                        <td><span className="badge badge-success">{c.netMarginPct}</span></td>
                        <td><span className="badge badge-warning">{c.roiAnnual}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsPlReportModalOpen(false)}>Tutup</button>
              <button type="button" className="btn btn-primary" onClick={() => { alert('Laporan Resmi Siap Diekspor ke Excel / PDF.'); setIsPlReportModalOpen(false); }}>
                <CheckCircle2 size={16} /> Verifikasi & Sahkan Laporan BOD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: TAMBAH / EDIT PROYEKSI CLUSTER ROI                    */}
      {/* ------------------------------------------------------------- */}
      {isRoiModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={20} color="#10B981" /> {editingRoi ? `Edit Proyeksi Cluster - ${editingRoi.clusterName}` : 'Tambah Proyeksi Finansial Cluster Baru'}
              </h3>
              <button onClick={() => setIsRoiModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveRoi}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Cluster / Proyek</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="misal: Cluster Diamond Fase 4"
                    value={roiForm.clusterName}
                    onChange={(e) => setRoiForm({ ...roiForm, clusterName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Keterangan Tipe & Jumlah Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="misal: Tipe 50/100 (15 Unit Hunian)"
                    value={roiForm.typeInfo}
                    onChange={(e) => setRoiForm({ ...roiForm, typeInfo: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Proyeksi Omzet Total (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={roiForm.projectedSales}
                      onChange={(e) => setRoiForm({ ...roiForm, projectedSales: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">HPP Konstruksi & Lahan (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={roiForm.hppConstruction}
                      onChange={(e) => setRoiForm({ ...roiForm, hppConstruction: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Biaya Operasional & Marketing (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={roiForm.operationalCost}
                      onChange={(e) => setRoiForm({ ...roiForm, operationalCost: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Proyeksi ROI Tahunan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 30.0% p.a"
                      value={roiForm.roiAnnual}
                      onChange={(e) => setRoiForm({ ...roiForm, roiAnnual: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsRoiModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  {editingRoi ? 'Simpan Perubahan Proyeksi' : 'Simpan Proyeksi Cluster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: TAMBAH MITIGASI RISIKO                               */}
      {/* ------------------------------------------------------------- */}
      {isRiskModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} color="#EF4444" /> Catat Matriks Mitigasi Risiko Baru
              </h3>
              <button onClick={() => setIsRiskModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveRisk}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Uraian / Judul Risiko Korporat</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="misal: Keterlambatan Penerbitan PBG / IMB Klaster"
                    value={riskForm.title}
                    onChange={(e) => setRiskForm({ ...riskForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Kategori Risiko</label>
                    <select
                      className="form-control"
                      value={riskForm.category}
                      onChange={(e) => setRiskForm({ ...riskForm, category: e.target.value })}
                    >
                      <option value="Legalitas & Perizinan">Legalitas & Perizinan</option>
                      <option value="Procurement & HPP">Procurement & HPP</option>
                      <option value="Teknik & S-Curve">Teknik & S-Curve</option>
                      <option value="Finance & Likuiditas">Finance & Likuiditas</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tingkat Dampak (Severity)</label>
                    <select
                      className="form-control"
                      value={riskForm.level}
                      onChange={(e) => setRiskForm({ ...riskForm, level: e.target.value })}
                    >
                      <option value="High Risk">High Risk (Prioritas Utama)</option>
                      <option value="Medium Risk">Medium Risk</option>
                      <option value="Low Risk">Low Risk</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rencana Aksi Mitigasi Direksi</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Tuliskan tindakan pencegahan atau solusi..."
                    value={riskForm.mitigation}
                    onChange={(e) => setRiskForm({ ...riskForm, mitigation: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsRiskModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none', fontWeight: 800 }}>
                  Simpan Mitigasi Risiko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: TAMBAH ROADMAP EKSPANSI MASTERPLAN                   */}
      {/* ------------------------------------------------------------- */}
      {isExpModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="#6366F1" /> Tambah Roadmap Ekspansi Masterplan
              </h3>
              <button onClick={() => setIsExpModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveExp}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Fase / Proyek Ekspansi</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="misal: Pembebasan Lahan Fase 4 (3 Hektar)"
                    value={expForm.phaseName}
                    onChange={(e) => setExpForm({ ...expForm, phaseName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Lokasi Lahan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Sebelah Utara Gerbang Utama"
                      value={expForm.location}
                      onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Peluncuran</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Q2 2026"
                      value={expForm.targetLaunch}
                      onChange={(e) => setExpForm({ ...expForm, targetLaunch: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Estimasi Capex Investasi (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={expForm.estimatedCapex}
                      onChange={(e) => setExpForm({ ...expForm, estimatedCapex: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target ROI Tahunan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={expForm.projectedRoi}
                      onChange={(e) => setExpForm({ ...expForm, projectedRoi: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsExpModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', border: 'none', fontWeight: 800 }}>
                  Simpan Roadmap Ekspansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 5: TAMBAH RISALAH RAPAT BOD                             */}
      {/* ------------------------------------------------------------- */}
      {isBodModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#38BDF8" /> Catat Risalah Rapat BOD Baru
              </h3>
              <button onClick={() => setIsBodModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveBod}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Topik Rapat Direksi</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Topik Bahasan Rapat"
                      value={bodForm.topic}
                      onChange={(e) => setBodForm({ ...bodForm, topic: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Pelaksanaan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={bodForm.date}
                      onChange={(e) => setBodForm({ ...bodForm, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Keputusan / Action Item Direksi</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Tuliskan poin keputusan direksi dan instruksi..."
                    value={bodForm.decision}
                    onChange={(e) => setBodForm({ ...bodForm, decision: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsBodModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800 }}>
                  Simpan Risalah Rapat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
