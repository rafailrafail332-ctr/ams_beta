import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  X,
  Sparkles,
  ArrowUpRight,
  Printer,
  FileText,
  Building2,
  Check,
  Award,
  ShieldCheck,
  Upload,
  Eye,
  FileCheck2,
  Download,
  Lock,
  MessageSquare,
  PhoneCall,
  Tag,
  PieChart,
  Briefcase,
  ChevronRight,
  Send
} from 'lucide-react';

export const MarketingModule = () => {
  const { currentUser, activeSubTab, setActiveSubTab, showNotification } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSales, setEditingSales] = useState(null);

  // Hidden File Input Ref for Device SPR Upload (.pdf, .jpg, .png)
  const sprFileInputRef = useRef(null);
  const [activeUploadTargetId, setActiveUploadTargetId] = useState(null);

  // Active Tab Control (Default to leads if subTab is 'leads' or 'default')
  const currentSubView = (activeSubTab === 'spr') ? 'spr' : 'leads';

  // -------------------------------------------------------------
  // CRM LEADS & KOMISI SALES TRACKER STORE
  // -------------------------------------------------------------
  const initialLeads = [
    {
      id: 'LEAD-001',
      customerName: 'Drs. Hendra Wijaya',
      phone: '0812-3456-7890',
      unitInterest: 'Cluster Emerald - Unit A-01 (Tipe 45/90)',
      budget: 650000000,
      source: 'Instagram Ads',
      salesPerson: 'Yulieka Rachmawati, S.Si (Head Marketing)',
      commissionPct: 2.5,
      stage: 'Prospect Hot (SP3K)',
      notes: 'SP3K KPR Mandiri sudah disetujui, janji akad akhir bulan.',
      createdDate: '2025-08-05',
      commissionStatus: 'Pending ACC Finance'
    },
    {
      id: 'LEAD-002',
      customerName: 'Ibu Ratna Pertiwi',
      phone: '0813-8877-6655',
      unitInterest: 'Cluster Sapphire - Unit B-02 (Tipe 60/120)',
      budget: 850000000,
      source: 'Walk-In Customer',
      salesPerson: 'Fresda Destifani (Marketing Staf)',
      commissionPct: 2.5,
      stage: 'Closed Sold',
      notes: 'Pencairan KPR Selesai. Unit diserahterimakan.',
      createdDate: '2025-07-15',
      commissionStatus: 'Cair Rekening Sales'
    },
    {
      id: 'LEAD-003',
      customerName: 'Bpk. Agus Setiawan',
      phone: '0857-1122-3344',
      unitInterest: 'Cluster Emerald - Unit A-08 (Tipe 45/90)',
      budget: 670000000,
      source: 'Facebook Ads',
      salesPerson: 'Bambang Hermawan (Marketing Staf)',
      commissionPct: 2.5,
      stage: 'Survey Site',
      notes: 'Janji ketemu di rumah contoh hari Sabtu jam 10 pagi.',
      createdDate: '2025-08-18',
      commissionStatus: 'Estimasi Prospek'
    },
    {
      id: 'LEAD-004',
      customerName: 'Dr. Maya Indah',
      phone: '0811-9988-7711',
      unitInterest: 'Cluster Emerald - Unit A-03 (Tipe 45/90)',
      budget: 650000000,
      source: 'Referral Konsumen',
      salesPerson: 'Amanda Chesyarini (Marketing Staf)',
      commissionPct: 2.5,
      stage: 'Booking Fee SPR',
      notes: 'Booking fee Rp 10 Juta lunas via transfer BCA.',
      createdDate: '2025-08-12',
      commissionStatus: 'Proses Verifikasi Finance'
    }
  ];

  const getSavedLeads = () => {
    try {
      const saved = localStorage.getItem('ams_crm_leads_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialLeads;
  };

  const [leadsList, setLeadsList] = useState(getSavedLeads);

  useEffect(() => {
    try {
      localStorage.setItem('ams_crm_leads_v2', JSON.stringify(leadsList));
    } catch (e) {}
  }, [leadsList]);

  // Modal State for Adding Lead
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leadFormData, setLeadFormData] = useState({
    customerName: '',
    phone: '',
    unitInterest: 'Cluster Emerald - Unit A-01 (Tipe 45/90)',
    budget: 650000000,
    source: 'Instagram Ads',
    salesPerson: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Yulieka Rachmawati, S.Si (Head Marketing)',
    commissionPct: 2.5,
    stage: 'Lead Baru (Cold)',
    notes: ''
  });

  // SPR Print & Edit Modal State
  const [isSprModalOpen, setIsSprModalOpen] = useState(false);
  const [sprFormData, setSprFormData] = useState({
    sprNumber: 'SPR/ASHOKA/2025/08/001',
    bookingDate: new Date().toISOString().split('T')[0],
    customerName: 'Budi Santoso',
    customerNik: '3374102908850003',
    customerPhone: '0812-9988-7766',
    customerAddress: 'Jl. Pemuda No. 142, Semarang Tengah, Kota Semarang',
    customerJob: 'Wiraswasta / Pengusaha',
    unitNo: 'A-01',
    cluster: 'Cluster Emerald',
    unitType: 'Tipe 45/90 (Standard Emerald)',
    hargaJual: 650000000,
    diskonPromo: 10000000,
    bookingFee: 10000000,
    uangMukaDp: 65000000,
    sisaPlafondKpr: 575000000,
    skemaBayar: 'KPR Bank Mandiri (Plafond Rp 575 Juta)',
    salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
    directorName: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)'
  });

  // Modal State for Viewing Uploaded SPR Document
  const [isViewUploadedSprModalOpen, setIsViewUploadedSprModalOpen] = useState(false);
  const [selectedSprViewItem, setSelectedSprViewItem] = useState(null);

  // Initial Sales & Marketing Data with Uploaded SPR Files Store
  const initialSalesData = [
    {
      id: 'SLS-001',
      unitNo: 'A-01',
      cluster: 'Cluster Emerald',
      customerName: 'Budi Santoso',
      customerPhone: '0812-9988-7766',
      salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
      hargaUnit: 650000000,
      bookingFee: 10000000,
      status: 'Closed / Sold',
      bookingDate: '2025-01-05',
      notes: 'Lunas Booking Fee & DP 10%',
      sprFileUrl: null,
      sprFileType: null,
      sprFileName: null,
      sprUploadDate: null,
      sprUploadedBy: null
    },
    {
      id: 'SLS-002',
      unitNo: 'A-02',
      cluster: 'Cluster Emerald',
      customerName: 'Siti Rahmawati',
      customerPhone: '0813-1122-3344',
      salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
      hargaUnit: 670000000,
      bookingFee: 10000000,
      status: 'Booking / SPR',
      bookingDate: '2025-01-20',
      notes: 'Pengajuan SP3K KPR BCA',
      sprFileUrl: null,
      sprFileType: null,
      sprFileName: null,
      sprUploadDate: null,
      sprUploadedBy: null
    },
    {
      id: 'SLS-003',
      unitNo: 'B-05',
      cluster: 'Cluster Sapphire',
      customerName: 'Dr. Ahmad Fauzi',
      customerPhone: '0857-4455-6677',
      salesPerson: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)',
      hargaUnit: 890000000,
      bookingFee: 15000000,
      status: 'Booking / SPR',
      bookingDate: '2025-03-10',
      notes: 'Skema Cash Bertahap 12x',
      sprFileUrl: null,
      sprFileType: null,
      sprFileName: null,
      sprUploadDate: null,
      sprUploadedBy: null
    }
  ];

  const getSavedSalesList = () => {
    try {
      const saved = localStorage.getItem('ams_sales_list_clean_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialSalesData;
  };

  const [salesList, setSalesList] = useState(getSavedSalesList);

  useEffect(() => {
    try {
      localStorage.setItem('ams_sales_list_clean_v1', JSON.stringify(salesList));
    } catch (e) {}
  }, [salesList]);

  // Form State for Sales Item
  const [formData, setFormData] = useState({
    unitNo: '',
    cluster: 'Cluster Emerald',
    customerName: '',
    customerPhone: '',
    salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
    hargaUnit: 650000000,
    bookingFee: 10000000,
    status: 'Prospek Hot',
    bookingDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Handle Direct Local SPR File Upload (.pdf, .jpg, .png)
  const handleSprFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeUploadTargetId) {
      const reader = new FileReader();
      const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

      reader.onloadend = () => {
        setSalesList((prev) =>
          prev.map((item) => {
            if (item.id === activeUploadTargetId) {
              return {
                ...item,
                sprFileUrl: reader.result,
                sprFileType: file.type,
                sprFileName: file.name,
                sprUploadDate: `${new Date().toISOString().split('T')[0]} ${timeNow}`,
                sprUploadedBy: `${currentUser?.name || 'Staf Marketing'} (${currentUser?.role || 'Staf'})`
              };
            }
            return item;
          })
        );
        showNotification(`DOKUMEN SPR TER-UPLOAD! Berkas "${file.name}" berhasil diunggah oleh Staf & tersimpan untuk seluruh pihak berkepentingan (Legal, Finance, Direksi).`);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const triggerUploadForSales = (id) => {
    setActiveUploadTargetId(id);
    if (sprFileInputRef.current) {
      sprFileInputRef.current.click();
    }
  };

  // -------------------------------------------------------------
  // CRM LEADS HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddLead = () => {
    setEditingLead(null);
    setLeadFormData({
      customerName: '',
      phone: '',
      unitInterest: 'Cluster Emerald - Unit A-01 (Tipe 45/90)',
      budget: 650000000,
      source: 'Instagram Ads',
      salesPerson: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Yulieka Rachmawati, S.Si (Head Marketing)',
      commissionPct: 2.5,
      stage: 'Lead Baru (Cold)',
      notes: ''
    });
    setIsLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead) => {
    setEditingLead(lead);
    setLeadFormData({
      customerName: lead.customerName,
      phone: lead.phone,
      unitInterest: lead.unitInterest,
      budget: lead.budget,
      source: lead.source,
      salesPerson: lead.salesPerson,
      commissionPct: lead.commissionPct || 2.5,
      stage: lead.stage,
      notes: lead.notes || ''
    });
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (e) => {
    e.preventDefault();
    if (editingLead) {
      setLeadsList((prev) =>
        prev.map((l) => (l.id === editingLead.id ? { ...l, ...leadFormData } : l))
      );
      showNotification(`PROSPEK LEAD DIPERBARUI! Data ${leadFormData.customerName} tersimpan.`);
    } else {
      const newLead = {
        id: `LEAD-00${leadsList.length + 1}`,
        ...leadFormData,
        createdDate: new Date().toISOString().split('T')[0],
        commissionStatus: leadFormData.stage === 'Closed Sold' ? 'Pending ACC Finance' : 'Estimasi Prospek'
      };
      setLeadsList([newLead, ...leadsList]);
      showNotification(`LEAD PROSPEK BARU DITAMBAHKAN! Prospek ${leadFormData.customerName} masuk ke pipeline CRM Sales.`);
    }
    setIsLeadModalOpen(false);
  };

  const handleClaimCommission = (lead) => {
    const nominal = Math.round(lead.budget * ((lead.commissionPct || 2.5) / 100));
    setLeadsList((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, commissionStatus: 'Cair Rekening Sales (ACC Finance)' } : l))
    );
    showNotification(`KLAIM KOMISI DIKIRIM! Komisi Rp ${new Intl.NumberFormat('id-ID').format(nominal)} (Unit ${lead.unitInterest}) diteruskan ke Direksi & Finance untuk dicairkan ke ${lead.salesPerson}.`);
  };

  const handleOpenWALeadTracker = (lead) => {
    const phoneNum = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '6281234567890';
    let msgText = `Halo Kak ${lead.customerName},\n\nTerima kasih telah menanyakan informasi hunian idaman di Ashoka (${lead.unitInterest}).\n\nApakah Kakak ada waktu luang minggu ini untuk cek lokasi (survey site) dan konsultasi simulasi angsuran KPR dengan kami? Hubungi kami kapan saja ya Kak! 😊`;
    
    if (lead.stage.includes('Closed')) {
      msgText = `Selamat Kak ${lead.customerName}! Unit hunian ${lead.unitInterest} di Ashoka telah resmi Akad & Terjadwal Serah Terima. Terima kasih telah mempercayakan hunian impian Anda kepada kami! 🎉`;
    } else if (lead.stage.includes('Booking')) {
      msgText = `Halo Kak ${lead.customerName},\n\nTerima kasih! Pembayaran Booking Fee & Surat Pesanan Rumah (SPR) untuk unit ${lead.unitInterest} telah kami terima & diverifikasi oleh manajemen Ashoka.`;
    }

    const encoded = encodeURIComponent(msgText);
    window.open(`https://wa.me/${phoneNum}?text=${encoded}`, '_blank');
  };

  // -------------------------------------------------------------
  // SALES ITEM HANDLERS (SPR)
  // -------------------------------------------------------------
  const handleOpenAdd = () => {
    setEditingSales(null);
    setFormData({
      unitNo: '',
      cluster: 'Cluster Emerald',
      customerName: '',
      customerPhone: '',
      salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
      hargaUnit: 650000000,
      bookingFee: 10000000,
      status: 'Prospek Hot',
      bookingDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingSales(item);
    setFormData({
      unitNo: item.unitNo,
      cluster: item.cluster,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      salesPerson: item.salesPerson,
      hargaUnit: item.hargaUnit,
      bookingFee: item.bookingFee,
      status: item.status,
      bookingDate: item.bookingDate,
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveSales = (e) => {
    e.preventDefault();
    if (!formData.unitNo || !formData.customerName) {
      showNotification('Nomor unit dan nama konsumen wajib diisi!', 'warning');
      return;
    }

    if (editingSales) {
      setSalesList((prev) =>
        prev.map((s) => (s.id === editingSales.id ? { ...s, ...formData } : s))
      );
      showNotification(`Data Penjualan Unit ${formData.unitNo} berhasil diperbarui!`);
    } else {
      const newItem = {
        ...formData,
        id: `SLS-00${salesList.length + 1}`,
        sprFileUrl: null,
        sprFileName: null,
        sprUploadDate: null,
        sprUploadedBy: null
      };
      setSalesList([newItem, ...salesList]);
      showNotification(`Transaksi/Prospek Penjualan Unit ${formData.unitNo} berhasil dibuat!`);
    }
    setIsModalOpen(false);
  };

  const handleOpenSprModal = (item) => {
    const netPrice = item.hargaUnit || 650000000;
    const dpVal = Math.round(netPrice * 0.1);
    const kprVal = netPrice - dpVal;

    setSprFormData({
      sprNumber: `SPR/ASHOKA/2025/${item.unitNo.replace('-', '')}/${Math.floor(100 + Math.random() * 900)}`,
      bookingDate: item.bookingDate || new Date().toISOString().split('T')[0],
      customerName: item.customerName || 'Budi Santoso',
      customerNik: '3374102908850003',
      customerPhone: item.customerPhone || '0812-9988-7766',
      customerAddress: 'Jl. Pemuda No. 142, Semarang Tengah, Kota Semarang',
      customerJob: 'Wiraswasta / Swasta',
      unitNo: item.unitNo,
      cluster: item.cluster || 'Cluster Emerald',
      unitType: `Tipe 45/90 (${item.cluster})`,
      hargaJual: netPrice,
      diskonPromo: 10000000,
      bookingFee: item.bookingFee || 10000000,
      uangMukaDp: dpVal,
      sisaPlafondKpr: kprVal,
      skemaBayar: `KPR Bank Mitra (Plafond Rp ${new Intl.NumberFormat('id-ID').format(kprVal)})`,
      salesPerson: item.salesPerson || 'Yulieka Rachmawati, S.Si (Head Marketing)',
      directorName: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)'
    });
    setIsSprModalOpen(true);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Calculations for Commission Tracker
  const totalLeadsValue = leadsList.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const totalCommissionPotential = leadsList.reduce((acc, curr) => acc + Math.round((curr.budget || 0) * ((curr.commissionPct || 2.5) / 100)), 0);
  const totalCommissionCair = leadsList
    .filter(l => l.commissionStatus.includes('Cair'))
    .reduce((acc, curr) => acc + Math.round((curr.budget || 0) * ((curr.commissionPct || 2.5) / 100)), 0);

  const filteredLeads = leadsList.filter((l) => {
    const matchesSearch =
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.unitInterest.toLowerCase().includes(search.toLowerCase()) ||
      l.salesPerson.toLowerCase().includes(search.toLowerCase());
    const matchesStage = statusFilter === 'All' || l.stage === statusFilter;
    return matchesSearch && matchesStage;
  });

  const filteredSales = salesList.filter((s) => {
    const matchesSearch =
      s.unitNo.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.salesPerson.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOmzet = salesList.reduce((acc, curr) => acc + (curr.status === 'Closed / Sold' ? curr.hargaUnit : 0), 0);

  return (
    <div>
      {/* Hidden File Input for Device SPR File Upload */}
      <input
        type="file"
        ref={sprFileInputRef}
        accept=".pdf,image/*"
        style={{ display: 'none' }}
        onChange={handleSprFileUpload}
      />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Marketing & Sales</h1>
          <p className="page-subtitle">Pipeline CRM Prospek Leads, Tracker Komisi Sales (2.5%), & Unggah Dokumen Transaksi SPR.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {currentSubView === 'leads' ? (
            <button className="btn btn-primary" onClick={handleOpenAddLead}>
              <Plus size={16} /> Tambah Lead Prospek Baru
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} /> Input Transaksi Penjualan
            </button>
          )}
        </div>
      </div>

      {/* SUB-MODULE TABS NAVIGATION */}
      <div className="tab-list" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`tab-item ${currentSubView === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('leads')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
        >
          <Users size={16} /> 1. Pipeline CRM Leads & Komisi Sales Tracker
        </button>
        <button
          className={`tab-item ${currentSubView === 'spr' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('spr')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
        >
          <FileText size={16} /> 2. Transaksi Penjualan & Upload Dokumen SPR
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PIPELINE CRM LEADS & KOMISI SALES TRACKER                          */}
      {/* ========================================================================= */}
      {currentSubView === 'leads' && (
        <div>
          {/* COMMISSION & LEADS KPI SUMMARY BANNER */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #F59E0B' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Potensi Komisi Sales (2.5%)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>{formatRupiah(totalCommissionPotential)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10B981' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Komisi Sudah Cair (Rekening)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>{formatRupiah(totalCommissionCair)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #38BDF8' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Lead Prospek</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{leadsList.length} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Konsumen</span></div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #EC4899' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nilai Pipeline Prospek</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatRupiah(totalLeadsValue)}</div>
              </div>
            </div>
          </div>

          {/* PIPELINE FILTER & SEARCH TOOLBAR */}
          <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama konsumen, unit minat, atau sales agent..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ minWidth: '200px' }}
                >
                  <option value="All">Semua Tahap Pipeline</option>
                  <option value="Lead Baru (Cold)">Lead Baru (Cold)</option>
                  <option value="Survey Site">Survey Site (Visit Lokasi)</option>
                  <option value="Prospect Hot (SP3K)">Prospect Hot (SP3K)</option>
                  <option value="Booking Fee SPR">Booking Fee SPR</option>
                  <option value="Closed Sold">Closed Sold (Akad)</option>
                </select>
              </div>
            </div>
          </div>

          {/* LEADS & COMMISSION TABLE */}
          <div className="glass-card" style={{ padding: '0.5rem' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID & Tanggal</th>
                    <th>Nama Konsumen & No WA</th>
                    <th>Target Unit & Budget</th>
                    <th>Sumber Lead</th>
                    <th>Sales Agent</th>
                    <th>Potensi Komisi (2.5%)</th>
                    <th>Tahap Pipeline</th>
                    <th>Status Pencairan Komisi</th>
                    <th>Aksi Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((l) => {
                    const commissionAmount = Math.round((l.budget || 0) * ((l.commissionPct || 2.5) / 100));

                    return (
                      <tr key={l.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{l.id}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{l.createdDate}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{l.customerName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{l.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{l.unitInterest}</div>
                          <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>{formatRupiah(l.budget)}</div>
                        </td>
                        <td><span className="badge badge-neutral">{l.source}</span></td>
                        <td><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{l.salesPerson}</div></td>
                        <td>
                          <div style={{ fontWeight: 900, color: '#10B981', fontSize: '0.9rem' }}>
                            {formatRupiah(commissionAmount)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>({l.commissionPct || 2.5}% dari harga)</div>
                        </td>
                        <td>
                          <span className={`badge ${
                            l.stage.includes('Closed') ? 'badge-success' :
                            l.stage.includes('Booking') ? 'badge-warning' :
                            l.stage.includes('Hot') ? 'badge-info' : 'badge-neutral'
                          }`}>
                            {l.stage}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${l.commissionStatus.includes('Cair') ? 'badge-success' : 'badge-warning'}`}>
                            {l.commissionStatus}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenWALeadTracker(l)}
                              style={{ color: '#25D366', fontWeight: 700 }}
                              title="Kirim Pesan Follow-Up WA"
                            >
                              <MessageSquare size={13} /> Chat WA
                            </button>
                            {l.stage.includes('Closed') && !l.commissionStatus.includes('Cair') && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleClaimCommission(l)}
                                style={{ fontSize: '0.72rem' }}
                              >
                                <DollarSign size={13} /> Klaim Komisi
                              </button>
                            )}
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditLead(l)}>
                              <Edit3 size={13} /> Edit
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRANSAKSI PENJUALAN & UPLOAD DOKUMEN SPR                           */}
      {/* ========================================================================= */}
      {currentSubView === 'spr' && (
        <div>
          {/* KPI Cards Grid */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Omzet Closed</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatRupiah(totalOmzet)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dokumen SPR Ter-Upload</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{salesList.filter(s => s.sprFileUrl).length} / {salesList.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Tersimpan</span></div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Unit Booking (SPR)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{salesList.filter(s => s.status.includes('Booking')).length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unit</span></div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lead Prospek Hot</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{salesList.filter(s => s.status.includes('Prospek')).length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lead</span></div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari No Unit, Konsumen, atau Sales Agent..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ minWidth: '200px' }}
                >
                  <option value="All">Semua Status Marketing</option>
                  <option value="Closed / Sold">Closed / Sold</option>
                  <option value="Booking / SPR">Booking / SPR</option>
                  <option value="Prospek Hot">Prospek Hot</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Sales Table */}
          <div className="glass-card" style={{ padding: '0.5rem' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID & Unit</th>
                    <th>Nama Konsumen</th>
                    <th>Harga Jual (Rp)</th>
                    <th>Status Berkas SPR (Staf Upload)</th>
                    <th>Sales Agent</th>
                    <th>Status Penjualan</th>
                    <th>Aksi Dokumen SPR</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{item.id}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Unit {item.unitNo}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{item.cluster}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.customerName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.customerPhone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{formatRupiah(item.hargaUnit)}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>BF: {formatRupiah(item.bookingFee)}</div>
                      </td>
                      <td>
                        {item.sprFileUrl ? (
                          <div>
                            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '4px' }}>
                              <ShieldCheck size={13} /> Dokumen TER-UPLOAD
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{item.sprFileName}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 600 }}>Oleh: {item.sprUploadedBy}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '4px' }}>
                              <Clock size={13} /> Belum Ada Berkas
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Staf Belum Unggah SPR</div>
                          </div>
                        )}
                      </td>
                      <td><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.salesPerson}</div></td>
                      <td>
                        <span className={`badge ${
                          item.status === 'Closed / Sold' ? 'badge-success' :
                          item.status === 'Booking / SPR' ? 'badge-warning' : 'badge-neutral'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => triggerUploadForSales(item.id)}
                            style={{ fontSize: '0.72rem', gap: '0.25rem' }}
                            title="Unggah / Perbarui File Dokumen SPR Resmi"
                          >
                            <Upload size={13} /> Upload SPR
                          </button>

                          {item.sprFileUrl ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => { setSelectedSprViewItem(item); setIsViewUploadedSprModalOpen(true); }}
                              style={{ fontSize: '0.72rem', gap: '0.25rem', color: '#10B981' }}
                            >
                              <Eye size={13} /> Lihat Berkas
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenSprModal(item)}
                              style={{ fontSize: '0.72rem', gap: '0.25rem' }}
                            >
                              <Printer size={13} /> Cetak Form
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT LEAD PROSPEK                                          */}
      {/* ========================================================================= */}
      {isLeadModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingLead ? 'Edit Data Lead Prospek' : 'Tambah Lead Prospek CRM Baru'}</h3>
              <button onClick={() => setIsLeadModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveLead}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Calon Konsumen / Lead</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Drs. Hendra Wijaya"
                    value={leadFormData.customerName}
                    onChange={(e) => setLeadFormData({ ...leadFormData, customerName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor WA Konsumen</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0812-xxxx-xxxx"
                      value={leadFormData.phone}
                      onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sumber Prospek (Source)</label>
                    <select
                      className="form-control"
                      value={leadFormData.source}
                      onChange={(e) => setLeadFormData({ ...leadFormData, source: e.target.value })}
                    >
                      <option value="Instagram Ads">Instagram Ads</option>
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Walk-In Customer">Walk-In Customer</option>
                      <option value="Referral Konsumen">Referral Konsumen</option>
                      <option value="Pameran Properti">Pameran Properti</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Unit Minat / Kavling Target</label>
                    <input
                      type="text"
                      className="form-control"
                      value={leadFormData.unitInterest}
                      onChange={(e) => setLeadFormData({ ...leadFormData, unitInterest: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Budget Konsumen (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={leadFormData.budget}
                      onChange={(e) => setLeadFormData({ ...leadFormData, budget: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tahap Pipeline CRM</label>
                    <select
                      className="form-control"
                      value={leadFormData.stage}
                      onChange={(e) => setLeadFormData({ ...leadFormData, stage: e.target.value })}
                    >
                      <option value="Lead Baru (Cold)">Lead Baru (Cold)</option>
                      <option value="Survey Site">Survey Site (Visit Lokasi)</option>
                      <option value="Prospect Hot (SP3K)">Prospect Hot (SP3K)</option>
                      <option value="Booking Fee SPR">Booking Fee SPR</option>
                      <option value="Closed Sold">Closed Sold (Akad & Komisi Cair)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Persentase Komisi Sales (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={leadFormData.commissionPct}
                      onChange={(e) => setLeadFormData({ ...leadFormData, commissionPct: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan Follow-Up Sales</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Hasil pembicaraan / jadwal survey..."
                    value={leadFormData.notes}
                    onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLeadModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Lead Prospek</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT & PRINT SPR FORM DOCUMENT MODAL */}
      {isSprModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSprModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '850px', background: '#0f172a' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header no-print">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Printer size={20} color="#F59E0B" /> Form Surat Pesanan Rumah (SPR) Resmi
              </h3>
              <button onClick={() => setIsSprModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
              {/* PRINTABLE DRAFT CONTENT */}
              <div id="spr-printable-area" style={{ background: '#ffffff', color: '#000000', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                {/* SPR HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/company-logo.png" alt="Ashoka" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#000000', letterSpacing: '-0.02em' }}>ASHOKA</div>
                      <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>Housing & Property Development</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#000000' }}>SURAT PESANAN RUMAH (SPR)</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#d97706' }}>No: {sprFormData.sprNumber}</div>
                  </div>
                </div>

                {/* SECTION 1: CUSTOMER DATA */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderRadius: '4px', marginBottom: '0.6rem' }}>
                    I. DATA PEMESAN / KONSUMEN
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', fontSize: '0.83rem' }}>
                    <div>Nama Lengkap Pemesan: <strong>{sprFormData.customerName}</strong></div>
                    <div>NIK KTP: <strong>{sprFormData.customerNik}</strong></div>
                    <div>No. Telepon / WA: <strong>{sprFormData.customerPhone}</strong></div>
                    <div>Pekerjaan: <strong>{sprFormData.customerJob}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}>Alamat KTP: <strong>{sprFormData.customerAddress}</strong></div>
                  </div>
                </div>

                {/* SECTION 2: UNIT & PRICE DETAIL */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderRadius: '4px', marginBottom: '0.6rem' }}>
                    II. SPESIFIKASI UNIT & RINCIAN HARGA
                  </div>
                  <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', marginBottom: '0.5rem' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Nomor Kavling & Cluster:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>Unit {sprFormData.unitNo} &bull; {sprFormData.cluster}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Tipe Bangunan / Tanah:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>{sprFormData.unitType}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Harga Jual Kesepakatan:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '800' }}>{formatRupiah(sprFormData.hargaJual)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Booking Fee (Tanda Jadi):</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', color: '#16a34a', fontWeight: '800' }}>{formatRupiah(sprFormData.bookingFee)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Uang Muka / DP (10%):</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>{formatRupiah(sprFormData.uangMukaDp)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Skema Pembayaran Pelunasan:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '700' }}>{sprFormData.skemaBayar}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SIGNATURE SECTION */}
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center', fontSize: '0.78rem' }}>
                  <div>
                    <div>Pemesan / Konsumen</div>
                    <div style={{ height: '55px' }}></div>
                    <div style={{ fontWeight: '800', borderTop: '1px solid #000', paddingTop: '4px' }}>({sprFormData.customerName})</div>
                  </div>
                  <div>
                    <div>Sales Executive</div>
                    <div style={{ height: '55px' }}></div>
                    <div style={{ fontWeight: '800', borderTop: '1px solid #000', paddingTop: '4px' }}>({sprFormData.salesPerson})</div>
                  </div>
                  <div>
                    <div>Direktur Utama / Manajemen</div>
                    <div style={{ height: '55px' }}></div>
                    <div style={{ fontWeight: '800', borderTop: '1px solid #000', paddingTop: '4px' }}>({sprFormData.directorName})</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER WITH PRINT BUTTON */}
            <div className="modal-footer no-print" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setIsSprModalOpen(false)}>Tutup</button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={() => window.print()}>
                  <Printer size={16} /> Cetak / Download PDF (SPR)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW UPLOADED SPR DOCUMENT MODAL */}
      {isViewUploadedSprModalOpen && selectedSprViewItem && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Dokumen SPR Resmi - Unit {selectedSprViewItem.unitNo}</h3>
              <button onClick={() => setIsViewUploadedSprModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {selectedSprViewItem.sprFileUrl?.startsWith('data:image') ? (
                <img src={selectedSprViewItem.sprFileUrl} alt="SPR" style={{ width: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '8px' }} />
              ) : (
                <iframe src={selectedSprViewItem.sprFileUrl} title="SPR PDF" style={{ width: '100%', height: '450px', border: 'none', borderRadius: '8px' }} />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsViewUploadedSprModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
