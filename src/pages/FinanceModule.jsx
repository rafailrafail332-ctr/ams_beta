import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CostOverrunInspector } from '../components/CostOverrunInspector';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Edit3, 
  PieChart, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tag,
  Check,
  X,
  Receipt,
  Scale,
  Calculator,
  FileCheck2,
  Percent,
  Landmark,
  Trash2,
  Camera,
  Image,
  Eye,
  Upload,
  ZoomIn,
  Lock
} from 'lucide-react';

export const FinanceModule = () => {
  const { currentUser, units, activeSubTab, updateUnit, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('pricelist');

  // Search Filter States for all Finance Sub-modules
  const [searchPricelist, setSearchPricelist] = useState('');
  const [searchDp, setSearchDp] = useState('');
  const [searchKpr, setSearchKpr] = useState('');
  const [searchTax, setSearchTax] = useState('');
  const [searchExpenses, setSearchExpenses] = useState('');

  useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Helper Check Role Can Approve / Set Price (Finance, Accounting, Tax, Collection, Manager, Director, Super Admin)
  const isFinanceOrManagerOrAdmin = () => {
    if (!currentUser) return false;
    const r = currentUser.role.toLowerCase();
    return (
      r.includes('finance') || 
      r.includes('accounting') || 
      r.includes('tax') || 
      r.includes('collection') || 
      r.includes('direktur') || 
      r.includes('manager') || 
      r.includes('admin') || 
      r.includes('gm')
    );
  };

  // Initial Pricelist Data
  const initialPricelists = [
    {
      id: 'PRC-001',
      cluster: 'Grand Harmoni - Cluster Emerald',
      type: 'Tipe 45/90 (Subsidized Deluxe)',
      baseCostHPP: 380000000,
      cashPrice: 650000000,
      kprPrice: 670000000,
      minDpAmount: 134000000,
      marginProfit: '41.5%',
      status: 'Pricelist Resmi Sah (Finance ACC)'
    },
    {
      id: 'PRC-002',
      cluster: 'Grand Harmoni - Cluster Sapphire',
      type: 'Tipe 60/120 (Townhouse Premium)',
      baseCostHPP: 520000000,
      cashPrice: 890000000,
      kprPrice: 920000000,
      minDpAmount: 184000000,
      marginProfit: '43.4%',
      status: 'Pricelist Resmi Sah (Finance ACC)'
    }
  ];

  const getSavedPricelists = () => {
    try {
      const saved = localStorage.getItem('ams_pricelists_clean_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialPricelists;
  };

  const [pricelists, setPricelists] = useState(getSavedPricelists);

  useEffect(() => {
    try {
      localStorage.setItem('ams_pricelists_clean_v1', JSON.stringify(pricelists));
    } catch (e) {}
  }, [pricelists]);

  // Modal State Edit Unit Price (Finance Only)
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [priceForm, setPriceForm] = useState({
    cashPrice: 0,
    kprPrice: 0,
    minDpAmount: 0
  });

  // Dedicated Accounting & Tax State (Managed by Tarkum Aditya)
  const initialTaxLedger = [
    {
      id: 'TAX-001',
      unitNo: 'A-01',
      cluster: 'Cluster Emerald',
      customerName: 'Budi Santoso',
      hargaTransaksi: 650000000,
      pphFinalRate: 2.5,
      pphAmount: 16250000, // 2.5% x 650jt
      ppnRate: 11,
      ppnAmount: 71500000, // 11% x 650jt
      bphtbAmount: 32500000, // 5% x 650jt
      efakturNo: '010.003-25.00001892',
      ntpnStatus: 'NTPN 9821873612873 (Disetor Kas Negara)',
      statusPajak: 'Lunas & Valid e-Faktur',
      verifiedBy: 'Tarkum Aditya (Accounting Tax Staf)'
    },
    {
      id: 'TAX-002',
      unitNo: 'A-02',
      cluster: 'Cluster Emerald',
      customerName: 'Siti Rahmawati',
      hargaTransaksi: 670000000,
      pphFinalRate: 2.5,
      pphAmount: 16750000,
      ppnRate: 11,
      ppnAmount: 73700000,
      bphtbAmount: 33500000,
      efakturNo: '010.003-25.00001893',
      ntpnStatus: 'Pengajuan Billing SSE Pajak',
      statusPajak: 'Proses Billing PPh Final',
      verifiedBy: 'Tarkum Aditya (Accounting Tax Staf)'
    },
    {
      id: 'TAX-003',
      unitNo: 'B-05',
      cluster: 'Cluster Sapphire',
      customerName: 'Dr. Ahmad Fauzi',
      hargaTransaksi: 890000000,
      pphFinalRate: 2.5,
      pphAmount: 22250000,
      ppnRate: 11,
      ppnAmount: 97900000,
      bphtbAmount: 44500000,
      efakturNo: '010.003-25.00001894',
      ntpnStatus: 'NTPN 7726318927162 (Disetor Kas Negara)',
      statusPajak: 'Lunas & Valid e-Faktur',
      verifiedBy: 'Tarkum Aditya (Accounting Tax Staf)'
    }
  ];

  const getSavedTaxLedger = () => {
    try {
      const saved = localStorage.getItem('ams_tax_ledger_clean_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialTaxLedger;
  };

  const [taxLedger, setTaxLedger] = useState(getSavedTaxLedger);

  useEffect(() => {
    try {
      localStorage.setItem('ams_tax_ledger_clean_v1', JSON.stringify(taxLedger));
    } catch (e) {}
  }, [taxLedger]);

  // Modal State Edit Tax & e-Faktur
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [selectedTaxItem, setSelectedTaxItem] = useState(null);
  const [taxForm, setTaxForm] = useState({
    efakturNo: '',
    ntpnStatus: '',
    statusPajak: 'Lunas & Valid e-Faktur'
  });

  const handleOpenEditTax = (item) => {
    setSelectedTaxItem(item);
    setTaxForm({
      efakturNo: item.efakturNo || '',
      ntpnStatus: item.ntpnStatus || '',
      statusPajak: item.statusPajak || 'Lunas & Valid e-Faktur'
    });
    setIsTaxModalOpen(true);
  };

  const handleSaveTax = (e) => {
    e.preventDefault();
    if (!selectedTaxItem) return;

    setTaxLedger(prev => prev.map(t => t.id === selectedTaxItem.id ? {
      ...t,
      efakturNo: taxForm.efakturNo,
      ntpnStatus: taxForm.ntpnStatus,
      statusPajak: taxForm.statusPajak,
      verifiedBy: `${currentUser?.name || 'Tarkum Aditya'} (${currentUser?.role || 'Accounting Tax Staf'})`
    } : t));

    showNotification(`REKONSILIASI PAJAK TER-RECORD! Data e-Faktur & NTPN Pajak Unit ${selectedTaxItem.unitNo} diverifikasi oleh Pak Tarkum Aditya.`);
    setIsTaxModalOpen(false);
  };

  const handleOpenEditPrice = (prc) => {
    if (!isFinanceOrManagerOrAdmin()) {
      showNotification(`Akses Terbatas: Hanya Tim Finance & Accounting, Manager, atau Direktur yang berhak mengubah Harga Jual!`, 'danger');
      return;
    }
    setSelectedPrice(prc);
    setPriceForm({
      cashPrice: prc.cashPrice,
      kprPrice: prc.kprPrice,
      minDpAmount: prc.minDpAmount
    });
    setIsEditPriceModalOpen(true);
  };

  const handleSavePrice = (e) => {
    e.preventDefault();
    if (!selectedPrice) return;

    const cash = Number(priceForm.cashPrice) || 0;
    const kpr = Number(priceForm.kprPrice) || 0;
    const dp = Number(priceForm.minDpAmount) || 0;
    const hpp = selectedPrice.baseCostHPP;
    const margin = (((cash - hpp) / cash) * 100).toFixed(1) + '%';

    setPricelists(prev => prev.map(p => p.id === selectedPrice.id ? {
      ...p,
      cashPrice: cash,
      kprPrice: kpr,
      minDpAmount: dp,
      marginProfit: margin
    } : p));

    showNotification(`HARGA JUAL DIPERBARUI OLEH FINANCE! Pricelist ${selectedPrice.type} disahkan oleh Tim Finance & Accounting.`);
    setIsEditPriceModalOpen(false);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Helper check Access for Akuntansi & Perpajakan
  // Pak Yazid Hizbullah, Pak Adhi Himawan, Pak Tarkum Aditya, Pak Ahmad Rafail, and Finance/Management
  const canAccessTaxCenter = () => {
    if (!currentUser) return true;
    const nameLower = (currentUser.name || '').toLowerCase();
    const roleLower = (currentUser.role || '').toLowerCase();

    // Explicitly allow key leaders & tax staff
    if (
      nameLower.includes('yazid') ||
      nameLower.includes('adhi') ||
      nameLower.includes('himawan') ||
      nameLower.includes('tarkum') ||
      nameLower.includes('rafail')
    ) {
      return true;
    }

    // Role based
    return (
      roleLower.includes('direktur') || 
      roleLower.includes('director') || 
      roleLower.includes('admin') || 
      roleLower.includes('gm') || 
      roleLower.includes('general manager') ||
      roleLower.includes('manager') ||
      roleLower.includes('tax') || 
      roleLower.includes('pajak') ||
      roleLower.includes('accounting') ||
      roleLower.includes('akuntansi') ||
      roleLower.includes('finance')
    );
  };

  // -------------------------------------------------------------
  // PENGELUARAN KANTOR & OPERASIONAL (OPEX / PETTY CASH TRACKER)
  // -------------------------------------------------------------
  const initialOfficeExpenses = [
    {
      id: 'EXP-2025-001',
      date: '2025-08-15',
      category: 'Operasional Kantor (Office Supplies)',
      title: 'Pembelian Kertas A4, Tinta Printer, & ATK Kantor Head Office',
      amount: 2450000,
      requestedBy: 'Dodi Syaiful Nugroho (Head HR & GA)',
      approvedBy: 'Yazid Hizbullah, S.E.,S.T (Finance Director)',
      status: 'Disetujui & Dibayar (Cash Out)',
      receiptImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      notes: 'Nota ATK Toko Buku Gramedia'
    },
    {
      id: 'EXP-2025-002',
      date: '2025-08-18',
      category: 'Listrik, Air & Internet',
      title: 'Tagihan PLN & PDAM Kantor Pemasaran & Site Office',
      amount: 3850000,
      requestedBy: 'Fajar Almizan (Logistic Staf)',
      approvedBy: 'Yazid Hizbullah, S.E.,S.T (Finance Director)',
      status: 'Disetujui & Dibayar (Cash Out)',
      receiptImage: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80',
      notes: 'Struk Pembayaran PLN Postpaid'
    },
    {
      id: 'EXP-2025-003',
      date: '2025-08-20',
      category: 'BBM & Servis Kendaraan Ops',
      title: 'BBM & Service Rutin Mobil Operasional Lapangan (Innova & Pick-Up)',
      amount: 1750000,
      requestedBy: 'Hapip Alamsyah (Head Operation Site)',
      approvedBy: 'Adhi Himawan, S.E.Sy (General Manager)',
      status: 'Proses Verifikasi Finance',
      receiptImage: null,
      notes: 'Kuitansi bengkel resmi Toyota'
    }
  ];

  const getSavedOfficeExpenses = () => {
    try {
      const saved = localStorage.getItem('ams_office_expenses_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialOfficeExpenses;
  };

  const [officeExpenses, setOfficeExpenses] = useState(getSavedOfficeExpenses);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('ams_office_expenses_v3', JSON.stringify(officeExpenses));
    } catch (e) {}
  }, [officeExpenses]);

  // Modal State for Expense CRUD
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Operasional Kantor (Office Supplies)',
    title: '',
    amount: 500000,
    requestedBy: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Staf Operasional',
    approvedBy: 'Yazid Hizbullah, S.E.,S.T (Finance Director)',
    status: 'Disetujui & Dibayar (Cash Out)',
    receiptImage: null,
    notes: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Ukuran foto maksimal 5 MB!', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setExpenseForm(prev => ({
        ...prev,
        receiptImage: reader.result
      }));
      showNotification('Foto Nota / Kuitansi berhasil diunggah!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setExpenseForm(prev => ({
      ...prev,
      receiptImage: null
    }));
  };

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setExpenseForm({
      date: new Date().toISOString().split('T')[0],
      category: 'Operasional Kantor (Office Supplies)',
      title: '',
      amount: 500000,
      requestedBy: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Staf Operasional',
      approvedBy: 'Yazid Hizbullah, S.E.,S.T (Finance Director)',
      status: 'Disetujui & Dibayar (Cash Out)',
      receiptImage: null,
      notes: ''
    });
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (item) => {
    setEditingExpense(item);
    setExpenseForm({
      date: item.date,
      category: item.category,
      title: item.title,
      amount: item.amount,
      requestedBy: item.requestedBy,
      approvedBy: item.approvedBy || 'Finance & Management',
      status: item.status,
      receiptImage: item.receiptImage || null,
      notes: item.notes || ''
    });
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    const amt = Number(expenseForm.amount) || 0;
    const payload = {
      ...expenseForm,
      amount: amt
    };

    if (editingExpense) {
      setOfficeExpenses(prev => prev.map(i => i.id === editingExpense.id ? { ...i, ...payload } : i));
      showNotification(`PENGELUARAN KANTOR DIPERBARUI! Data "${expenseForm.title}" berhasil disimpan.`);
    } else {
      const newItem = {
        id: `EXP-2025-00${officeExpenses.length + 1}`,
        ...payload
      };
      setOfficeExpenses(prev => [newItem, ...prev]);
      showNotification(`PENGELUARAN KANTOR DITAMBAHKAN! Nominal Rp ${new Intl.NumberFormat('id-ID').format(amt)} tercatat di Kas Keluar.`);
    }
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus catatan pengeluaran "${title}"?`)) {
      setOfficeExpenses(prev => prev.filter(i => i.id !== id));
      showNotification(`PENGELUARAN DIHAPUS! Catatan "${title}" berhasil dihapus dari sistem.`, 'warning');
    }
  };

  const handleApproveExpenseQuick = (id) => {
    setOfficeExpenses(prev => prev.map(i => i.id === id ? {
      ...i,
      status: 'Disetujui & Dibayar (Cash Out)',
      approvedBy: `${currentUser?.name || 'Manager'} (${currentUser?.role || 'Finance'})`
    } : i));
    showNotification(`PENGELUARAN DI-ACC! Kas keluar ID ${id} berhasil disetujui & dibayar.`);
  };

  // Office Expenses Summary Calculations
  const totalOfficeExpenses = officeExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalApprovedExpenses = officeExpenses.filter(i => i.status.includes('Disetujui')).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalPendingExpenses = officeExpenses.filter(i => !i.status.includes('Disetujui')).reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Tax Ledger Summary Calculations
  const totalPphFinal = taxLedger.reduce((acc, curr) => acc + curr.pphAmount, 0);
  const totalPpn = taxLedger.reduce((acc, curr) => acc + curr.ppnAmount, 0);
  const totalBphtb = taxLedger.reduce((acc, curr) => acc + curr.bphtbAmount, 0);

  // REAL-TIME SEARCH FILTERED DATA FOR ALL TABS
  const filteredPricelists = pricelists.filter((prc) => {
    if (!searchPricelist) return true;
    const q = searchPricelist.toLowerCase().trim();
    return (
      (prc.type || '').toLowerCase().includes(q) ||
      (prc.cluster || '').toLowerCase().includes(q) ||
      (prc.status || '').toLowerCase().includes(q) ||
      (prc.marginProfit || '').toLowerCase().includes(q) ||
      prc.cashPrice?.toString().includes(q) ||
      prc.kprPrice?.toString().includes(q) ||
      prc.baseCostHPP?.toString().includes(q)
    );
  });

  const filteredDpUnits = units.filter((u) => {
    if (!searchDp) return true;
    const q = searchDp.toLowerCase().trim();
    return (
      (u.unitNo || '').toLowerCase().includes(q) ||
      (u.owner || '').toLowerCase().includes(q) ||
      (u.cluster || '').toLowerCase().includes(q) ||
      (u.finance?.skema || '').toLowerCase().includes(q) ||
      (u.finance?.dpStatus || '').toLowerCase().includes(q) ||
      (u.finance?.pencairanKpr || '').toLowerCase().includes(q) ||
      u.finance?.harga?.toString().includes(q)
    );
  });

  const filteredKprUnits = units.filter((u) => {
    if (!searchKpr) return true;
    const q = searchKpr.toLowerCase().trim();
    return (
      (u.unitNo || '').toLowerCase().includes(q) ||
      (u.owner || '').toLowerCase().includes(q) ||
      (u.finance?.skema || '').toLowerCase().includes(q) ||
      (u.finance?.pencairanKpr || '').toLowerCase().includes(q)
    );
  });

  const filteredTaxLedger = taxLedger.filter((t) => {
    if (!searchTax) return true;
    const q = searchTax.toLowerCase().trim();
    return (
      (t.unitNo || '').toLowerCase().includes(q) ||
      (t.customerName || '').toLowerCase().includes(q) ||
      (t.cluster || '').toLowerCase().includes(q) ||
      (t.efakturNo || '').toLowerCase().includes(q) ||
      (t.ntpnStatus || '').toLowerCase().includes(q) ||
      (t.statusPajak || '').toLowerCase().includes(q) ||
      (t.verifiedBy || '').toLowerCase().includes(q) ||
      t.hargaTransaksi?.toString().includes(q)
    );
  });

  const filteredExpenses = officeExpenses.filter((exp) => {
    if (!searchExpenses) return true;
    const q = searchExpenses.toLowerCase().trim();
    return (
      (exp.id || '').toLowerCase().includes(q) ||
      (exp.title || '').toLowerCase().includes(q) ||
      (exp.category || '').toLowerCase().includes(q) ||
      (exp.requestedBy || '').toLowerCase().includes(q) ||
      (exp.approvedBy || '').toLowerCase().includes(q) ||
      (exp.status || '').toLowerCase().includes(q) ||
      (exp.notes || '').toLowerCase().includes(q) ||
      (exp.date || '').includes(q) ||
      exp.amount?.toString().includes(q)
    );
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Keuangan, Akuntansi & Perpajakan</h1>
          <p className="page-subtitle">Penetapan pricelist resmi perumahan, monitoring DP konsumen, & Command Center Akuntansi & Pajak (Ditangani Tarkum Aditya).</p>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="glass-card" style={{ padding: '0.5rem 0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
          <button 
            className={`btn ${activeTab === 'pricelist' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('pricelist')}
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          >
            <Tag size={15} /> Pricelist & SK Harga
          </button>
          <button 
            className={`btn ${activeTab === 'dp' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dp')}
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          >
            <DollarSign size={15} /> Monitoring DP & Cash In
          </button>
          <button 
            className={`btn ${activeTab === 'kpr' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('kpr')}
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          >
            <CreditCard size={15} /> SLA Pencairan KPR
          </button>
          
          {/* DEDICATED TAB FOR TARKUM ADITYA (ACCOUNTING & TAX STAFF) */}
          <button 
            className={`btn ${activeTab === 'tax' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('tax')}
            style={{ 
              fontSize: '0.82rem', 
              padding: '0.5rem 1rem',
              background: activeTab === 'tax' ? 'linear-gradient(135deg, #10B981, #059669)' : undefined,
              border: activeTab === 'tax' ? 'none' : undefined,
              fontWeight: 800
            }}
          >
            <Landmark size={15} /> 🏛️ Akuntansi & Pajak (Pak Tarkum)
          </button>

          <button 
            className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('expenses')}
            style={{ 
              fontSize: '0.82rem', 
              padding: '0.5rem 1rem',
              background: activeTab === 'expenses' ? 'linear-gradient(135deg, #EF4444, #DC2626)' : undefined,
              border: activeTab === 'expenses' ? 'none' : undefined,
              fontWeight: 800
            }}
          >
            <Receipt size={15} /> 💸 Pengeluaran Kantor & Operasional (OpEx)
          </button>

          <button 
            className={`btn ${activeTab === 'cost-overrun' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('cost-overrun')}
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          >
            <AlertTriangle size={15} /> Cost Overrun Inspector
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pricelist Resmi Perumahan</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>Finance ACC <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Valid</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Landmark size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Setor PPh Final (2.5%)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>{formatRupiah(totalPphFinal)}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>e-Faktur PPN (11%) Terbit</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38BDF8' }}>{formatRupiah(totalPpn)}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gross Profit Margin</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>41.5% - 43.4%</div>
          </div>
        </div>
      </div>

      {/* TAB 1: PENETAPAN PRICELIST RESMI OLEH TIM FINANCE */}
      {activeTab === 'pricelist' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Struktur Harga Jual & Pricelist Resmi (Wewenang Tim Finance)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Perhitungan HPP pokok lahan/fisik, penentuan harga Cash/KPR, & penetapan DP minimum oleh Finance Officer & Tax Staf (Pak Tarkum Aditya).</p>
            </div>
          </div>

          {/* Search Bar Pricelist */}
          <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={16} color="var(--accent-primary)" />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                placeholder="Cari cluster perumahan, tipe unit, harga cash/KPR, margin..."
                value={searchPricelist}
                onChange={(e) => setSearchPricelist(e.target.value)}
              />
              {searchPricelist && (
                <button onClick={() => setSearchPricelist('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredPricelists.length}</span> dari {pricelists.length} Pricelist
            </div>
          </div>

          {filteredPricelists.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <Tag size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada pricelist yang sesuai</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setSearchPricelist('')} style={{ marginTop: '0.75rem' }}>
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Cluster & Tipe Unit</th>
                    <th>HPP Pokok Lahan & Fisik</th>
                    <th>Harga Cash Keras (Rp)</th>
                    <th>Harga KPR Bank (Rp)</th>
                    <th>Minimal Uang Muka / DP 20%</th>
                    <th>Margin Keuntungan (Gross)</th>
                    <th>Status SK Finance</th>
                    <th>Aksi Edit Harga Finance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPricelists.map((prc) => (
                    <tr key={prc.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{prc.type}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{prc.cluster}</div>
                      </td>
                      <td><div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatRupiah(prc.baseCostHPP)}</div></td>
                      <td><div style={{ fontWeight: 900, color: 'var(--success)', fontSize: '0.95rem' }}>{formatRupiah(prc.cashPrice)}</div></td>
                      <td><div style={{ fontWeight: 900, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{formatRupiah(prc.kprPrice)}</div></td>
                      <td><div style={{ fontWeight: 700 }}>{formatRupiah(prc.minDpAmount)}</div></td>
                      <td><span className="badge badge-success">{prc.marginProfit}</span></td>
                      <td><span className="badge badge-info">{prc.status}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditPrice(prc)}>
                          <Edit3 size={13} /> Edit Harga Finance
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MONITORING DP & CASH IN */}
      {activeTab === 'dp' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Monitoring DP & Angsuran Cash In Konsumen</h3>

          {/* Search Bar DP */}
          <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={16} color="#10B981" />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                placeholder="Cari nomor kavling (A-01), nama pemilik, skema bayar, status DP..."
                value={searchDp}
                onChange={(e) => setSearchDp(e.target.value)}
              />
              {searchDp && (
                <button onClick={() => setSearchDp('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Menampilkan <span style={{ color: '#10B981', fontWeight: 800 }}>{filteredDpUnits.length}</span> dari {units.length} Unit
            </div>
          </div>

          {filteredDpUnits.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <DollarSign size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada data pembayaran DP yang sesuai</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setSearchDp('')} style={{ marginTop: '0.75rem' }}>
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Kavling Unit & Pemilik</th>
                    <th>Harga Jual Unit</th>
                    <th>Skema Pembayaran</th>
                    <th>Status Pelunasan DP</th>
                    <th>Status Pencairan KPR Bank</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDpUnits.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {u.unitNo}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{u.owner}</div>
                      </td>
                      <td><div style={{ fontWeight: 800 }}>{formatRupiah(u.finance.harga)}</div></td>
                      <td><span className="badge badge-info">{u.finance.skema}</span></td>
                      <td><span className="badge badge-success">{u.finance.dpStatus}</span></td>
                      <td><span className="badge badge-success">{u.finance.pencairanKpr}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SLA PENCAIRAN KPR */}
      {activeTab === 'kpr' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Monitoring SLA Pencairan KPR Bank Mitra</h3>

          {/* Search Bar KPR */}
          <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={16} color="#38BDF8" />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                placeholder="Cari nomor kavling, nama pemilik, nama bank penyalur KPR..."
                value={searchKpr}
                onChange={(e) => setSearchKpr(e.target.value)}
              />
              {searchKpr && (
                <button onClick={() => setSearchKpr('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Menampilkan <span style={{ color: '#38BDF8', fontWeight: 800 }}>{filteredKprUnits.length}</span> dari {units.length} Unit
            </div>
          </div>

          {filteredKprUnits.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <CreditCard size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada data KPR yang sesuai</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setSearchKpr('')} style={{ marginTop: '0.75rem' }}>
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Kavling Unit</th>
                    <th>Bank Penyalur KPR</th>
                    <th>Status SP3K Bank</th>
                    <th>Pencairan Rekening Escrow</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKprUnits.map((u) => (
                    <tr key={u.id}>
                      <td><div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {u.unitNo}</div></td>
                      <td>{u.finance.skema}</td>
                      <td><span className="badge badge-success">{u.finance.pencairanKpr}</span></td>
                      <td><span className="badge badge-info">Escrow Realized</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DEDICATED COMMAND CENTER AKUNTANSI & PERPAJAKAN (TARKUM ADITYA) */}
      {activeTab === 'tax' && !canAccessTaxCenter() ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <Lock size={44} color="#EF4444" style={{ marginBottom: '0.75rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Restriksi Wewenang Modul Akuntansi & Perpajakan
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0.5rem auto 1.25rem' }}>
            Modul Command Center Akuntansi & e-Faktur Pajak ini dispesialisasi khusus untuk <strong>Pak Tarkum Aditya (Accounting Tax Staf)</strong>, <strong>Pak Yazid Hizbullah (Direktur Keuangan)</strong>, <strong>Pak Adhi Himawan (General Manager)</strong>, dan <strong>Direksi Perusahaan</strong>.
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab('pricelist')}>
            Kembali ke Modul Pricelist & Finance
          </button>
        </div>
      ) : activeTab === 'tax' && (
        <div>
          {/* TAX COMMAND CENTER HEADER BANNER */}
          <div 
            className="glass-card" 
            style={{ 
              marginBottom: '1.5rem', 
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.05))',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 800, fontSize: '0.85rem' }}>
                  <Landmark size={18} /> COMMAND CENTER AKUNTANSI & PERPAJAKAN (ACCOUNTING TAX LEDGER)
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginTop: '2px', color: 'var(--text-main)' }}>
                  Modul Khusus Pak Tarkum Aditya (Accounting Tax Staf)
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Kelola PPh Final 2.5%, e-Faktur PPN 11%, BPHTB 5%, PBB Induk Lahan, & Rekonsiliasi Jurnal Laba Rugi Proyek.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ padding: '0.6rem 1rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Status PBB Induk Lahan:</div>
                  <div style={{ fontWeight: 800, color: '#10B981' }}>NOP: 33.74.010.005.012-0 (LUNAS 2025)</div>
                </div>
              </div>
            </div>
          </div>

          {/* TAX LEDGER TABLE */}
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                📋 Rekapitulasi Pajak Penjualan Unit Properti (PPh Final 2.5% & PPN 11%)
              </h3>
            </div>

            {/* Search Bar Tax */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="#10B981" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari unit kavling, nama konsumen, no e-Faktur DJP, status NTPN, atau status pajak..."
                  value={searchTax}
                  onChange={(e) => setSearchTax(e.target.value)}
                />
                {searchTax && (
                  <button onClick={() => setSearchTax('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: '#10B981', fontWeight: 800 }}>{filteredTaxLedger.length}</span> dari {taxLedger.length} Rekap Pajak
              </div>
            </div>

            {filteredTaxLedger.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Landmark size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada data pajak yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchTax('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Unit & Pembeli</th>
                      <th>Harga Transaksi (Rp)</th>
                      <th>PPh Final 2.5% (Setor Kas Negara)</th>
                      <th>e-Faktur PPN 11%</th>
                      <th>BPHTB 5% Konsumen</th>
                      <th>Nomor e-Faktur & Kode NTPN Pajak</th>
                      <th>Status Audit Pajak</th>
                      <th>Aksi Verifikasi Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTaxLedger.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {t.unitNo}</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t.customerName}</div>
                        </td>
                        <td><div style={{ fontWeight: 800 }}>{formatRupiah(t.hargaTransaksi)}</div></td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#10B981' }}>{formatRupiah(t.pphAmount)}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Tarif PPh Final {t.pphFinalRate}%</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#38BDF8' }}>{formatRupiah(t.ppnAmount)}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Tarif PPN {t.ppnRate}%</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{formatRupiah(t.bphtbAmount)}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{t.efakturNo}</div>
                          <div style={{ fontSize: '0.72rem', color: t.ntpnStatus.includes('NTPN') ? 'var(--success)' : 'var(--warning)' }}>
                            {t.ntpnStatus}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${t.statusPajak.includes('Lunas') ? 'badge-success' : 'badge-warning'}`}>
                            {t.statusPajak}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenEditTax(t)}
                            style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}
                          >
                            <FileCheck2 size={13} /> Edit e-Faktur / NTPN
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* FINANCIAL PROFIT & LOSS LEDGER SUMMARY */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              📈 Ringkasan Laporan Laba Rugi Akuntansi (Profit & Loss Statement)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  💵 Komponen Pendapatan & Gross Profit:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <span>Total Gross Sales (Omzet Penjualan Unit Closed)</span>
                  <span style={{ fontWeight: 800 }}>Rp 2.210.000.000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <span>Total HPP Pokok Lahan & Konstruksi (COGS)</span>
                  <span style={{ fontWeight: 800, color: '#ef4444' }}>(Rp 1.280.000.000)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontWeight: 900, color: 'var(--success)', fontSize: '0.95rem' }}>
                  <span>Laba Kotor Akuntansi (Gross Margin)</span>
                  <span>Rp 930.000.000 (42.1%)</span>
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 800, color: '#F59E0B', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  ⚖️ Beban Pajak & Net Accounting Income:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <span>Estimasi Setor PPh Final (2.5%)</span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>(Rp 55.250.000)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <span>Beban Operasional HR, GA & Marketing</span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>(Rp 142.000.000)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontWeight: 900, color: '#38BDF8', fontSize: '0.95rem' }}>
                  <span>Estimasi Net Profit Keuangan Properti</span>
                  <span>Rp 732.750.000 (33.1%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PENGELUARAN KANTOR & OPERASIONAL (OPEX / PETTY CASH TRACKER) */}
      {activeTab === 'expenses' && (
        <div className="glass-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt color="#EF4444" size={22} /> Pencatatan & Kelola Pengeluaran Kantor (Petty Cash & OpEx)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Input kas keluar operasional kantor, tagihan utilitas Head Office, BBM/kendaraan, & pengeluaran tak terduga.</p>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddExpense} style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none' }}>
              <Plus size={16} /> Input Pengeluaran Baru
            </button>
          </div>

          {/* KPI Banner Expenses */}
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', color: '#EF4444', fontWeight: 700 }}>Total Kas Keluar (Cash Out)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{formatRupiah(totalOfficeExpenses)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{officeExpenses.length} Item Transaksi Pengeluaran</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Pengeluaran Disetujui (ACC Finance)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>{formatRupiah(totalApprovedExpenses)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sah & Terbayar via Kasubag</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700 }}>Proses Verifikasi / Pending ACC</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F59E0B' }}>{formatRupiah(totalPendingExpenses)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Menunggu Approval Manajer</div>
            </div>
          </div>

          {/* Search Bar Expenses */}
          <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={16} color="#EF4444" />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                placeholder="Cari judul keperluan, kategori pengeluaran, nama pemohon, tanggal, status..."
                value={searchExpenses}
                onChange={(e) => setSearchExpenses(e.target.value)}
              />
              {searchExpenses && (
                <button onClick={() => setSearchExpenses('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Menampilkan <span style={{ color: '#EF4444', fontWeight: 800 }}>{filteredExpenses.length}</span> dari {officeExpenses.length} Pengeluaran
            </div>
          </div>

          {/* Table Expenses */}
          {filteredExpenses.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <Receipt size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada catatan pengeluaran yang sesuai</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setSearchExpenses('')} style={{ marginTop: '0.75rem' }}>
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID & Tanggal</th>
                    <th>Kategori Pengeluaran</th>
                    <th>Judul Keperluan</th>
                    <th>Foto Nota / Kuitansi</th>
                    <th>Nominal (Rp)</th>
                    <th>Pemohon (Staf)</th>
                    <th>Disetujui Oleh</th>
                    <th>Status</th>
                    <th>Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((exp) => {
                    const isApproved = exp.status.includes('Disetujui');
                    return (
                      <tr key={exp.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{exp.id}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{exp.date}</div>
                        </td>
                        <td><span className="badge badge-neutral">{exp.category}</span></td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{exp.title}</div>
                          {exp.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{exp.notes}</div>}
                        </td>
                      <td>
                        {exp.receiptImage ? (
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                            onClick={() => setViewingReceipt(exp)}
                            title="Klik untuk perbesar foto nota / kuitansi"
                          >
                            <img 
                              src={exp.receiptImage} 
                              alt="Nota" 
                              style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} 
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Eye size={12} /> Lihat Foto
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Camera size={12} /> Belum Ada Foto
                          </span>
                        )}
                      </td>
                      <td><div style={{ fontWeight: 900, color: '#EF4444' }}>{formatRupiah(exp.amount)}</div></td>
                      <td><div style={{ fontSize: '0.85rem' }}>{exp.requestedBy}</div></td>
                      <td><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{exp.approvedBy || '-'}</div></td>
                      <td>
                        <span className={`badge ${isApproved ? 'badge-success' : 'badge-warning'}`}>
                          {isApproved ? <CheckCircle2 size={12} /> : <Clock size={12} />} {exp.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {!isApproved && (
                            <button 
                              className="btn btn-primary btn-sm" 
                              onClick={() => handleApproveExpenseQuick(exp.id)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', background: '#10B981', border: 'none' }}
                              title="ACC & Bayar Kas Keluar"
                            >
                              ACC & Bayar
                            </button>
                          )}
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handleOpenEditExpense(exp)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                            title="Edit"
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handleDeleteExpense(exp.id, exp.title)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}
                            title="Hapus"
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
        )}
      </div>
    )}

      {/* TAB 5: COST OVERRUN INSPECTOR */}
      {activeTab === 'cost-overrun' && (
        <CostOverrunInspector />
      )}

      {/* EDIT PRICE MODAL (FINANCE ONLY) */}
      {isEditPriceModalOpen && selectedPrice && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Penetapan Harga Jual Finance - {selectedPrice.type}</h3>
              <button onClick={() => setIsEditPriceModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePrice}>
              <div className="modal-body">
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  HPP Pokok Lahan & Fisik: <strong>{formatRupiah(selectedPrice.baseCostHPP)}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">Harga Cash Keras Resmi (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={priceForm.cashPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, cashPrice: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Harga Skema KPR Bank (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={priceForm.kprPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, kprPrice: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Minimal Uang Muka / DP (20%) (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={priceForm.minDpAmount}
                    onChange={(e) => setPriceForm({ ...priceForm, minDpAmount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditPriceModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Sah & Terbitkan Harga Jual Finance</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TAX & E-FAKTUR MODAL (PAK TARKUM ADITYA) */}
      {isTaxModalOpen && selectedTaxItem && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Landmark size={20} color="#10B981" />
                <h3 className="modal-title">Rekonsiliasi Pajak & e-Faktur Unit {selectedTaxItem.unitNo}</h3>
              </div>
              <button onClick={() => setIsTaxModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTax}>
              <div className="modal-body">
                <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  <div>Konsumen: <strong>{selectedTaxItem.customerName}</strong></div>
                  <div>Nilai Transaksi: <strong>{formatRupiah(selectedTaxItem.hargaTransaksi)}</strong></div>
                  <div>PPh Final (2.5%): <strong>{formatRupiah(selectedTaxItem.pphAmount)}</strong> &bull; PPN (11%): <strong>{formatRupiah(selectedTaxItem.ppnAmount)}</strong></div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor Seri e-Faktur Pajak (DJPA)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taxForm.efakturNo}
                    onChange={(e) => setTaxForm({ ...taxForm, efakturNo: e.target.value })}
                    placeholder="Contoh: 010.003-25.00001895"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Keterangan Kode NTPN / Resi Billing Setor Pajak</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taxForm.ntpnStatus}
                    onChange={(e) => setTaxForm({ ...taxForm, ntpnStatus: e.target.value })}
                    placeholder="Contoh: NTPN 9821873612873 (Disetor Kas Negara)"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status Verifikasi Rekonsiliasi Tax</label>
                  <select
                    className="form-control"
                    value={taxForm.statusPajak}
                    onChange={(e) => setTaxForm({ ...taxForm, statusPajak: e.target.value })}
                  >
                    <option value="Lunas & Valid e-Faktur">Lunas & Valid e-Faktur (Tercatat DJP)</option>
                    <option value="Proses Billing PPh Final">Proses Billing PPh Final SSE</option>
                    <option value="Menunggu Validasi e-Faktur">Menunggu Validasi e-Faktur</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsTaxModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  Sah & Simpan Rekonsiliasi Pajak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INPUT / EDIT PENGELUARAN KANTOR */}
      {isExpenseModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={20} color="#EF4444" /> {editingExpense ? `Edit Pengeluaran - ${editingExpense.id}` : 'Input Pengeluaran Kantor Baru'}
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveExpense}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tanggal Kas Keluar</label>
                    <input
                      type="date"
                      className="form-control"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kategori Pengeluaran</label>
                    <select
                      className="form-control"
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    >
                      <option value="Operasional Kantor (Office Supplies)">Operasional Kantor (ATK / Office Supplies)</option>
                      <option value="Listrik, Air & Internet">Listrik, Air & Internet (PLN/PDAM/Telkom)</option>
                      <option value="BBM & Servis Kendaraan Ops">BBM & Servis Kendaraan Ops</option>
                      <option value="Konsumsi & Rapat Manajemen">Konsumsi & Rapat Manajemen</option>
                      <option value="Promosi & Perizinan GA">Promosi & Perizinan GA</option>
                      <option value="Lain-lain / Tak Terduga">Lain-lain / Tak Terduga</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Judul Keperluan Pengeluaran</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Pembelian Kertas A4, Tinta Printer, & ATK Kantor"
                    value={expenseForm.title}
                    onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nominal Pengeluaran (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Staf Pemohon / Pengaju</label>
                    <input
                      type="text"
                      className="form-control"
                      value={expenseForm.requestedBy}
                      onChange={(e) => setExpenseForm({ ...expenseForm, requestedBy: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Status Persetujuan ACC</label>
                    <select
                      className="form-control"
                      value={expenseForm.status}
                      onChange={(e) => setExpenseForm({ ...expenseForm, status: e.target.value })}
                    >
                      <option value="Disetujui & Dibayar (Cash Out)">Disetujui & Dibayar (Cash Out)</option>
                      <option value="Proses Verifikasi Finance">Proses Verifikasi Finance</option>
                      <option value="Menunggu Approval Manajer">Menunggu Approval Manajer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pejabat Yang Menyetujui</label>
                    <input
                      type="text"
                      className="form-control"
                      value={expenseForm.approvedBy}
                      onChange={(e) => setExpenseForm({ ...expenseForm, approvedBy: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <Camera size={16} color="var(--accent-primary)" /> Foto Bukti Nota / Kuitansi (Foto / Unggah Gambar)
                  </label>

                  {expenseForm.receiptImage ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)' }}>
                      <img 
                        src={expenseForm.receiptImage} 
                        alt="Preview Nota" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--accent-primary)' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--success)' }}>✓ Foto Nota Berhasil Terlampir</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Klik tombol di bawah jika ingin mengganti foto atau menghapusnya.</div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '6px' }}>
                          <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                            <Upload size={12} /> Ganti Foto
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                          </label>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleRemoveImage} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                            <Trash2 size={12} /> Hapus Foto
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ border: '2px dashed var(--border-color)', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Camera size={24} />
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '2px' }}>Unggah / Ambil Foto Nota & Kuitansi</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Format JPG, PNG, atau WEBP (Maksimal 5MB)</div>
                      
                      <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none' }}>
                        <Upload size={14} /> Pilih Foto dari Galeri / Kamera
                        <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ display: 'none' }} />
                      </label>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">Keterangan Tambahan / Toko (Opsional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Toko Buku Gramedia / Pom Bensin Pertamina"
                    value={expenseForm.notes}
                    onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsExpenseModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none' }}>
                  Simpan Pengeluaran & Foto Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL: FULL PREVIEW FOTO NOTA / KUITANSI */}
      {viewingReceipt && (
        <div className="modal-backdrop" onClick={() => setViewingReceipt(null)} style={{ zIndex: 10000 }}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '650px', background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Receipt size={18} color="#EF4444" /> Bukti Foto Nota - {viewingReceipt.id}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {viewingReceipt.title} &bull; <strong style={{ color: '#EF4444' }}>{formatRupiah(viewingReceipt.amount)}</strong>
                </div>
              </div>
              <button 
                onClick={() => setViewingReceipt(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ textAlign: 'center', background: '#000', borderRadius: '10px', overflow: 'hidden', padding: '0.5rem', maxHeight: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={viewingReceipt.receiptImage} 
                alt="Foto Kuitansi" 
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '6px' }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Pemohon: <strong>{viewingReceipt.requestedBy}</strong> &bull; Tgl: {viewingReceipt.date}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a 
                  href={viewingReceipt.receiptImage} 
                  download={`Nota-${viewingReceipt.id}.jpg`}
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <ZoomIn size={14} /> Buka / Unduh Full
                </a>
                <button className="btn btn-primary btn-sm" onClick={() => setViewingReceipt(null)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
