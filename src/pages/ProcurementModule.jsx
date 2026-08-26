import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Truck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Star, 
  DollarSign, 
  Building2, 
  PackageCheck, 
  Award, 
  Printer, 
  X,
  FileCheck2,
  Boxes,
  Briefcase,
  Trash2,
  Edit3,
  Check,
  Percent
} from 'lucide-react';

export const ProcurementModule = () => {
  const { showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('vendors'); // 'vendors', 'po', 'tender', 'gr', 'contracts', 'matching'

  // Search filter states for each tab
  const [searchVendor, setSearchVendor] = useState('');
  const [searchPo, setSearchPo] = useState('');
  const [searchTender, setSearchTender] = useState('');
  const [searchGr, setSearchGr] = useState('');
  const [searchContract, setSearchContract] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');

  // -------------------------------------------------------------
  // PILAR 1: VENDORS & CONTRACTORS (CRUD + STORE)
  // -------------------------------------------------------------
  const initialVendors = [
    {
      id: 'VND-001',
      name: 'PT Bangun Jaya Perdana',
      category: 'Kontraktor Utama',
      contactPerson: 'Herman Wijaya',
      phone: '0811-3344-5566',
      rating: 4.9,
      status: 'Terverifikasi (Vendor Utama)',
      completedProjects: 12
    },
    {
      id: 'VND-002',
      name: 'CV Karya Mandiri Teknik',
      category: 'Sub-Kontraktor Struktur',
      contactPerson: 'Suryo Utomo',
      phone: '0812-7788-9900',
      rating: 4.6,
      status: 'Terverifikasi',
      completedProjects: 7
    },
    {
      id: 'VND-003',
      name: 'PT Semen Gresik Distributor',
      category: 'Supplier Material (Semen/Besi)',
      contactPerson: 'Budi Hartono',
      phone: '0813-1122-3344',
      rating: 4.8,
      status: 'Terverifikasi (Kontrak Payung)',
      completedProjects: 25
    }
  ];

  const [vendors, setVendors] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_vendors_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialVendors;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_vendors_v2', JSON.stringify(vendors));
    } catch (e) {}
  }, [vendors]);

  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [vendorForm, setVendorForm] = useState({
    name: '',
    category: 'Supplier Material (Semen/Besi)',
    contactPerson: '',
    phone: '',
    rating: 5.0,
    status: 'Terverifikasi'
  });

  const handleOpenAddVendor = () => {
    setEditingVendor(null);
    setVendorForm({
      name: '',
      category: 'Supplier Material (Semen/Besi)',
      contactPerson: '',
      phone: '',
      rating: 5.0,
      status: 'Terverifikasi'
    });
    setIsVendorModalOpen(true);
  };

  const handleOpenEditVendor = (v) => {
    setEditingVendor(v);
    setVendorForm({
      name: v.name,
      category: v.category,
      contactPerson: v.contactPerson,
      phone: v.phone,
      rating: v.rating || 5.0,
      status: v.status || 'Terverifikasi'
    });
    setIsVendorModalOpen(true);
  };

  const handleSaveVendor = (e) => {
    e.preventDefault();
    if (editingVendor) {
      setVendors(prev => prev.map(v => v.id === editingVendor.id ? { ...v, ...vendorForm } : v));
      showNotification(`Data vendor "${vendorForm.name}" berhasil diperbarui!`, 'success');
    } else {
      const newV = {
        id: `VND-00${vendors.length + 1}`,
        completedProjects: 0,
        ...vendorForm
      };
      setVendors(prev => [newV, ...prev]);
      showNotification(`Vendor Baru "${newV.name}" berhasil didaftarkan!`, 'success');
    }
    setIsVendorModalOpen(false);
  };

  const handleDeleteVendor = (id, name) => {
    if (window.confirm(`Hapus data vendor ${name}?`)) {
      setVendors(prev => prev.filter(v => v.id !== id));
      showNotification(`Vendor ${name} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // PILAR 2: PURCHASE ORDERS (PO) (CRUD + STORE)
  // -------------------------------------------------------------
  const initialOrders = [
    {
      id: 'PO-2025-081',
      prNo: 'PR-TECH-102',
      itemDesc: '500 Sak Semen Portland 50kg & Besi Beton 12mm (100 Batang)',
      vendorName: 'PT Semen Gresik Distributor',
      amount: 68500000,
      requestDate: '2025-08-01',
      status: 'Approved PO (Siap Kirim)',
      approvedBy: 'Kevin Anderson, MBA'
    },
    {
      id: 'PO-2025-082',
      prNo: 'PR-TECH-105',
      itemDesc: '200 Dus Keramik Homogeneous Tile 60x60 Cluster Emerald',
      vendorName: 'PT Keramik Asia Utama',
      amount: 42000000,
      requestDate: '2025-08-05',
      status: 'In Review Procurement',
      approvedBy: '-'
    }
  ];

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_orders_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialOrders;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_orders_v2', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [editingPo, setEditingPo] = useState(null);
  const [poForm, setPoForm] = useState({
    prNo: 'PR-TECH-108',
    itemDesc: '',
    vendorName: 'PT Semen Gresik Distributor',
    amount: 50000000,
    requestDate: new Date().toISOString().split('T')[0],
    status: 'In Review Procurement'
  });

  const handleOpenAddPo = () => {
    setEditingPo(null);
    setPoForm({
      prNo: `PR-TECH-${Math.floor(100 + Math.random() * 900)}`,
      itemDesc: '',
      vendorName: vendors[0]?.name || 'PT Semen Gresik Distributor',
      amount: 25000000,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'In Review Procurement'
    });
    setIsPoModalOpen(true);
  };

  const handleOpenEditPo = (o) => {
    setEditingPo(o);
    setPoForm({
      prNo: o.prNo,
      itemDesc: o.itemDesc,
      vendorName: o.vendorName,
      amount: o.amount,
      requestDate: o.requestDate,
      status: o.status
    });
    setIsPoModalOpen(true);
  };

  const handleSavePo = (e) => {
    e.preventDefault();
    if (editingPo) {
      setOrders(prev => prev.map(o => o.id === editingPo.id ? { ...o, ...poForm } : o));
      showNotification(`Purchase Order ${editingPo.id} berhasil diperbarui!`, 'success');
    } else {
      const newPo = {
        id: `PO-2025-08${orders.length + 3}`,
        approvedBy: '-',
        ...poForm
      };
      setOrders(prev => [newPo, ...prev]);
      showNotification(`Purchase Order ${newPo.id} berhasil diterbitkan!`, 'success');
    }
    setIsPoModalOpen(false);
  };

  const handleApprovePO = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Approved PO (Siap Kirim)', approvedBy: 'Rudy Hermawan, ST' } : o));
    showNotification(`Surat Pesanan PO ${id} berhasil disetujui!`, 'success');
  };

  const handleDeleteOrder = (id, prNo) => {
    if (window.confirm(`Hapus Purchase Order ${id} (${prNo})?`)) {
      setOrders(prev => prev.filter(o => o.id !== id));
      showNotification(`Purchase Order ${id} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // PILAR 3: TENDERS & BIDDING (CRUD + STORE)
  // -------------------------------------------------------------
  const initialTenders = [
    {
      id: 'TND-2025-03',
      title: 'Tender Pembangunan Main Road Boulevard & Drainase U-Ditch 12m',
      budgetRAB: 850000000,
      bidders: [
        { name: 'PT Bangun Jaya Perdana', bid: 820000000, score: '95/100 (Rekomendasi Utama)' },
        { name: 'CV Karya Mandiri Teknik', bid: 840000000, score: '88/100' },
        { name: 'PT Nusantara Konstruksi', bid: 875000000, score: '82/100' }
      ],
      winner: 'PT Bangun Jaya Perdana',
      status: 'Penetapan Pemenang'
    }
  ];

  const [tenders, setTenders] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_tenders_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialTenders;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_tenders_v2', JSON.stringify(tenders));
    } catch (e) {}
  }, [tenders]);

  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [editingTender, setEditingTender] = useState(null);
  const [tenderForm, setTenderForm] = useState({
    title: '',
    budgetRAB: 500000000,
    winner: 'PT Bangun Jaya Perdana',
    status: 'Proses Bidding & Seleksi'
  });

  const handleOpenAddTender = () => {
    setEditingTender(null);
    setTenderForm({
      title: '',
      budgetRAB: 500000000,
      winner: vendors[0]?.name || 'PT Bangun Jaya Perdana',
      status: 'Proses Bidding & Seleksi'
    });
    setIsTenderModalOpen(true);
  };

  const handleOpenEditTender = (t) => {
    setEditingTender(t);
    setTenderForm({
      title: t.title,
      budgetRAB: t.budgetRAB,
      winner: t.winner,
      status: t.status
    });
    setIsTenderModalOpen(true);
  };

  const handleSaveTender = (e) => {
    e.preventDefault();
    if (editingTender) {
      setTenders(prev => prev.map(t => t.id === editingTender.id ? { ...t, ...tenderForm } : t));
      showNotification(`Lelang Tender ${editingTender.id} berhasil diperbarui!`, 'success');
    } else {
      const newTnd = {
        id: `TND-2025-0${tenders.length + 4}`,
        bidders: [
          { name: tenderForm.winner, bid: tenderForm.budgetRAB * 0.96, score: '92/100 (Lead Bidder)' },
          { name: 'CV Karya Mandiri Teknik', bid: tenderForm.budgetRAB * 0.99, score: '87/100' }
        ],
        ...tenderForm
      };
      setTenders(prev => [newTnd, ...prev]);
      showNotification(`Lelang Tender ${newTnd.id} berhasil dipublikasikan!`, 'success');
    }
    setIsTenderModalOpen(false);
  };

  const handleDeleteTender = (id, title) => {
    if (window.confirm(`Hapus data lelang tender "${title}"?`)) {
      setTenders(prev => prev.filter(t => t.id !== id));
      showNotification(`Tender ${id} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // PILAR 4: GOODS RECEIPT (GR) (CRUD + STORE)
  // -------------------------------------------------------------
  const initialGoodsReceipts = [
    {
      id: 'GR-2025-44',
      poNo: 'PO-2025-081',
      item: 'Semen Portland 50kg (500 Sak)',
      receivedDate: '08 Agustus 2025',
      inspector: 'Agus Subekti (Gudang Site Office)',
      qcStatus: 'Lolos QC 100% (Bebas Rusak)'
    }
  ];

  const [goodsReceipts, setGoodsReceipts] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_gr_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialGoodsReceipts;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_gr_v2', JSON.stringify(goodsReceipts));
    } catch (e) {}
  }, [goodsReceipts]);

  const [isGrModalOpen, setIsGrModalOpen] = useState(false);
  const [editingGr, setEditingGr] = useState(null);
  const [grForm, setGrForm] = useState({
    poNo: 'PO-2025-081',
    item: '',
    receivedDate: new Date().toISOString().split('T')[0],
    inspector: 'Agus Subekti (Gudang Site Office)',
    qcStatus: 'Lolos QC 100% (Bebas Rusak)'
  });

  const handleOpenAddGr = () => {
    setEditingGr(null);
    setGrForm({
      poNo: orders[0]?.id || 'PO-2025-081',
      item: '',
      receivedDate: new Date().toISOString().split('T')[0],
      inspector: 'Agus Subekti (Gudang Site Office)',
      qcStatus: 'Lolos QC 100% (Bebas Rusak)'
    });
    setIsGrModalOpen(true);
  };

  const handleOpenEditGr = (g) => {
    setEditingGr(g);
    setGrForm({
      poNo: g.poNo,
      item: g.item,
      receivedDate: g.receivedDate,
      inspector: g.inspector,
      qcStatus: g.qcStatus
    });
    setIsGrModalOpen(true);
  };

  const handleSaveGr = (e) => {
    e.preventDefault();
    if (editingGr) {
      setGoodsReceipts(prev => prev.map(g => g.id === editingGr.id ? { ...g, ...grForm } : g));
      showNotification(`Surat jalan ${editingGr.id} berhasil diperbarui!`, 'success');
    } else {
      const newGr = {
        id: `GR-2025-${Math.floor(50 + Math.random() * 50)}`,
        ...grForm
      };
      setGoodsReceipts(prev => [newGr, ...prev]);
      showNotification(`Penerimaan Barang ${newGr.id} berhasil diverifikasi QC!`, 'success');
    }
    setIsGrModalOpen(false);
  };

  const handleDeleteGR = (id, item) => {
    if (window.confirm(`Hapus catatan Goods Receipt ${id} (${item})?`)) {
      setGoodsReceipts(prev => prev.filter(g => g.id !== id));
      showNotification(`Goods Receipt ${id} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // PILAR 5: SPK CONTRACTS & VOLUME DISCOUNT (CRUD + STORE)
  // -------------------------------------------------------------
  const initialContracts = [
    {
      id: 'SPK-2025-01',
      title: 'SPK Borongan Pembangunan 10 Unit Tipe 45 Cluster Emerald',
      vendorName: 'PT Bangun Jaya Perdana',
      contractAmount: 1850000000,
      discountPct: 5.0,
      validUntil: '31 Desember 2025',
      status: 'Kontrak Aktif (Berjalan)'
    },
    {
      id: 'SPK-2025-02',
      title: 'Kontrak Payung Pasokan Semen Gresik 5.000 Sak (Volume Discount)',
      vendorName: 'PT Semen Gresik Distributor',
      contractAmount: 340000000,
      discountPct: 8.5,
      validUntil: '30 November 2025',
      status: 'Kontrak Aktif (Berjalan)'
    },
    {
      id: 'SPK-2025-03',
      title: 'SPK Pemasangan Jaringan Listrik & PJU Underground Cluster Sapphire',
      vendorName: 'CV Karya Mandiri Teknik',
      contractAmount: 215000000,
      discountPct: 3.0,
      validUntil: '15 Oktober 2025',
      status: 'Kontrak Selesai 100%'
    }
  ];

  const [contracts, setContracts] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_contracts_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialContracts;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_contracts_v2', JSON.stringify(contracts));
    } catch (e) {}
  }, [contracts]);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [contractForm, setContractForm] = useState({
    title: '',
    vendorName: 'PT Bangun Jaya Perdana',
    contractAmount: 500000000,
    discountPct: 5.0,
    validUntil: '31 Desember 2025',
    status: 'Kontrak Aktif (Berjalan)'
  });

  const handleOpenAddContract = () => {
    setEditingContract(null);
    setContractForm({
      title: '',
      vendorName: vendors[0]?.name || 'PT Bangun Jaya Perdana',
      contractAmount: 500000000,
      discountPct: 5.0,
      validUntil: '31 Desember 2025',
      status: 'Kontrak Aktif (Berjalan)'
    });
    setIsContractModalOpen(true);
  };

  const handleOpenEditContract = (c) => {
    setEditingContract(c);
    setContractForm({
      title: c.title,
      vendorName: c.vendorName,
      contractAmount: c.contractAmount,
      discountPct: c.discountPct,
      validUntil: c.validUntil,
      status: c.status
    });
    setIsContractModalOpen(true);
  };

  const handleSaveContract = (e) => {
    e.preventDefault();
    if (editingContract) {
      setContracts(prev => prev.map(c => c.id === editingContract.id ? { ...c, ...contractForm } : c));
      showNotification(`Kontrak SPK ${editingContract.id} berhasil diperbarui!`, 'success');
    } else {
      const newSpk = {
        id: `SPK-2025-0${contracts.length + 4}`,
        ...contractForm
      };
      setContracts(prev => [newSpk, ...prev]);
      showNotification(`Kontrak SPK ${newSpk.id} berhasil diterbitkan!`, 'success');
    }
    setIsContractModalOpen(false);
  };

  const handleDeleteContract = (id, title) => {
    if (window.confirm(`Hapus Kontrak ${id} (${title})?`)) {
      setContracts(prev => prev.filter(c => c.id !== id));
      showNotification(`Kontrak ${id} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // PILAR 6: 3-WAY MATCHING INVOICE (CRUD + STORE)
  // -------------------------------------------------------------
  const initialInvoices = [
    {
      id: 'INV-VND-88',
      vendorName: 'PT Semen Gresik Distributor',
      poNo: 'PO-2025-081',
      grNo: 'GR-2025-44',
      amount: 68500000,
      matchingStatus: '3-Way Match Verified (Valid)',
      paymentStatus: 'Approved Payment Release'
    }
  ];

  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_invoices_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialInvoices;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_invoices_v2', JSON.stringify(invoices));
    } catch (e) {}
  }, [invoices]);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({
    vendorName: 'PT Semen Gresik Distributor',
    poNo: 'PO-2025-081',
    grNo: 'GR-2025-44',
    amount: 68500000,
    matchingStatus: '3-Way Match Verified (Valid)',
    paymentStatus: 'Approved Payment Release'
  });

  const handleOpenAddInvoice = () => {
    setEditingInvoice(null);
    setInvoiceForm({
      vendorName: vendors[0]?.name || 'PT Semen Gresik Distributor',
      poNo: orders[0]?.id || 'PO-2025-081',
      grNo: goodsReceipts[0]?.id || 'GR-2025-44',
      amount: 45000000,
      matchingStatus: '3-Way Match Verified (Valid)',
      paymentStatus: 'Approved Payment Release'
    });
    setIsInvoiceModalOpen(true);
  };

  const handleOpenEditInvoice = (inv) => {
    setEditingInvoice(inv);
    setInvoiceForm({
      vendorName: inv.vendorName,
      poNo: inv.poNo,
      grNo: inv.grNo,
      amount: inv.amount,
      matchingStatus: inv.matchingStatus,
      paymentStatus: inv.paymentStatus
    });
    setIsInvoiceModalOpen(true);
  };

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    if (editingInvoice) {
      setInvoices(prev => prev.map(i => i.id === editingInvoice.id ? { ...i, ...invoiceForm } : i));
      showNotification(`Tagihan Invoice ${editingInvoice.id} berhasil diperbarui!`, 'success');
    } else {
      const newInv = {
        id: `INV-VND-${Math.floor(100 + Math.random() * 900)}`,
        ...invoiceForm
      };
      setInvoices(prev => [newInv, ...prev]);
      showNotification(`Tagihan Invoice ${newInv.id} berhasil dicatat & diverifikasi!`, 'success');
    }
    setIsInvoiceModalOpen(false);
  };

  const handleReleasePayment = (id) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, paymentStatus: 'Paid / Transfered (Finance)' } : i));
    showNotification(`Persetujuan Pencairan Dana Tagihan Vendor ${id} disetujui!`, 'success');
  };

  const handleDeleteInvoice = (id, vendorName) => {
    if (window.confirm(`Hapus invoice ${id} dari ${vendorName}?`)) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      showNotification(`Invoice ${id} berhasil dihapus.`, 'warning');
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Procurement (Pengadaan Material & Vendor Properti)</h1>
          <p className="page-subtitle">Pusat pengadaan bahan bangunan, lelang tender kontraktor, PO material, SPK kontrak, & 3-way invoice matching.</p>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vendor Terverifikasi</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{vendors.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Perusahaan</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total PO Terbit</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{orders.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pesanan</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kontrak SPK Aktif</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{contracts.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Kontrak</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PackageCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>3-Way Invoice Matching</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{invoices.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Verified</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for 6 Pillars */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'vendors' ? 'active' : ''}`} onClick={() => setActiveTab('vendors')}>
          <Briefcase size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Direktori Vendor & Kontraktor
        </button>
        <button className={`tab-item ${activeTab === 'po' ? 'active' : ''}`} onClick={() => setActiveTab('po')}>
          <ShoppingBag size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. PR & Purchase Order (PO)
        </button>
        <button className={`tab-item ${activeTab === 'tender' ? 'active' : ''}`} onClick={() => setActiveTab('tender')}>
          <Award size={16} style={{ display: 'inline', marginRight: '6px' }} /> 3. E-Tendering & Bidding
        </button>
        <button className={`tab-item ${activeTab === 'gr' ? 'active' : ''}`} onClick={() => setActiveTab('gr')}>
          <Truck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 4. Goods Receipt (Gudang)
        </button>
        <button className={`tab-item ${activeTab === 'contracts' ? 'active' : ''}`} onClick={() => setActiveTab('contracts')}>
          <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} /> 5. Kontrak SPK & Diskon Volume
        </button>
        <button className={`tab-item ${activeTab === 'matching' ? 'active' : ''}`} onClick={() => setActiveTab('matching')}>
          <FileCheck2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> 6. 3-Way Matching Invoice
        </button>
      </div>

      {/* PILAR 1: VENDOR & CONTRACTOR DIRECTORY */}
      {activeTab === 'vendors' && (() => {
        const filteredVendors = vendors.filter(v => !searchVendor || [v.id, v.name, v.category, v.contactPerson, v.phone, v.status].some(val => (val || '').toLowerCase().includes(searchVendor.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Direktori Mitra Vendor & Rating Performa</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Manajemen database rekanan kontraktor, sub-kon struktur, & toko material resmi.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddVendor} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                <Plus size={14} /> + Registrasi Vendor Baru
              </button>
            </div>

            {/* Search Bar Vendor */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari ID vendor (VND-001), nama perusahaan, kategori, kontak PIC..."
                  value={searchVendor}
                  onChange={(e) => setSearchVendor(e.target.value)}
                />
                {searchVendor && (
                  <button onClick={() => setSearchVendor('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredVendors.length}</span> dari {vendors.length} Vendor
              </div>
            </div>

            {filteredVendors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Briefcase size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada vendor yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau daftarkan mitra vendor baru.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchVendor('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID & Nama Vendor</th>
                      <th>Kategori Spesialisasi</th>
                      <th>Contact Person & WA</th>
                      <th>Rating KPI</th>
                      <th>Proyek Selesai</th>
                      <th>Status Kualifikasi</th>
                      <th>Aksi CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{v.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{v.id}</div>
                        </td>
                        <td><span className="badge badge-info">{v.category}</span></td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{v.contactPerson}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.phone}</div>
                        </td>
                        <td>
                          <div style={{ color: '#F59E0B', fontWeight: 900 }}>
                            {v.rating} ★
                          </div>
                        </td>
                        <td><div style={{ fontWeight: 700 }}>{v.completedProjects} Proyek</div></td>
                        <td><span className="badge badge-success">{v.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditVendor(v)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Edit Vendor"
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteVendor(v.id, v.name)}
                              style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Hapus Vendor"
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
            )}
          </div>
        );
      })()}

      {/* PILAR 2: PURCHASE REQUISITION & PURCHASE ORDER */}
      {activeTab === 'po' && (() => {
        const filteredOrders = orders.filter(o => !searchPo || [o.id, o.prNo, o.itemDesc, o.vendorName, o.status, o.amount?.toString()].some(val => (val || '').toLowerCase().includes(searchPo.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Purchase Order (PO Material) & Approval Berjenjang</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Order bahan bangunan resmi terkoneksi langsung ke Gudang Site dan Accounting.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddPo} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                <Plus size={14} /> + Buat Purchase Order (PO) Baru
              </button>
            </div>

            {/* Search Bar PO */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari No PO (PO-2025), No PR, Deskripsi material semen/besi, vendor..."
                  value={searchPo}
                  onChange={(e) => setSearchPo(e.target.value)}
                />
                {searchPo && (
                  <button onClick={() => setSearchPo('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredOrders.length}</span> dari {orders.length} Order
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <ShoppingBag size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada Purchase Order yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau buat Purchase Order baru.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchPo('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>No PO & PR Ref</th>
                      <th>Deskripsi Kebutuhan Material</th>
                      <th>Vendor Supplier</th>
                      <th>Total Biaya (Rp)</th>
                      <th>Tanggal Usulan</th>
                      <th>Status Approval</th>
                      <th>Aksi PO & Hapus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{o.id}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Ref: {o.prNo}</div>
                        </td>
                        <td><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{o.itemDesc}</div></td>
                        <td>{o.vendorName}</td>
                        <td><div style={{ fontWeight: 800 }}>{formatRupiah(o.amount)}</div></td>
                        <td>{o.requestDate}</td>
                        <td>
                          <span className={`badge ${o.status.includes('Approved') ? 'badge-success' : 'badge-warning'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            {o.status.includes('Approved') ? (
                              <button className="btn btn-secondary btn-sm" onClick={() => alert(`Cetak Dokumen Resmi ${o.id}`)} style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}>
                                <Printer size={13} /> Cetak
                              </button>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => handleApprovePO(o.id)} style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}>
                                <CheckCircle2 size={13} /> Setujui
                              </button>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditPo(o)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Edit PO"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteOrder(o.id, o.prNo)}
                              style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Hapus PO"
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
            )}
          </div>
        );
      })()}

      {/* PILAR 3: E-TENDERING & BIDDING MATRIX */}
      {activeTab === 'tender' && (() => {
        const filteredTenders = tenders.filter(t => !searchTender || [t.id, t.title, t.winner, t.status, t.budgetRAB?.toString()].some(val => (val || '').toLowerCase().includes(searchTender.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Matriks Bidding Tender Proyek Konstruksi</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Transparansi lelang tender fasilitas umum, jalan boulevard, & gerbang klaster.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddTender} style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', border: 'none', fontWeight: 800 }}>
                <Plus size={14} /> + Buka Lelang Tender Baru
              </button>
            </div>

            {/* Search Bar Tender */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari ID tender (TND-2025), judul proyek konstruksi, nama pemenang..."
                  value={searchTender}
                  onChange={(e) => setSearchTender(e.target.value)}
                />
                {searchTender && (
                  <button onClick={() => setSearchTender('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredTenders.length}</span> dari {tenders.length} Tender
              </div>
            </div>

            {filteredTenders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Award size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada tender lelang yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau buka lelang tender baru.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchTender('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div>
                {filteredTenders.map((t) => (
                  <div key={t.id} style={{ marginBottom: '1.5rem', padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700 }}>LELANG TENDER PROYEK: {t.id}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>{t.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: 700, marginTop: '2px' }}>Pagu RAB: {formatRupiah(t.budgetRAB)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>Pemenang: {t.winner}</span>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditTender(t)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                          title="Edit Tender"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDeleteTender(t.id, t.title)}
                          style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                          title="Hapus Tender"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Peserta Kontraktor</th>
                            <th>Penawaran Harga (Bid)</th>
                            <th>Selisih vs RAB</th>
                            <th>Skor Evaluasi & Track Record</th>
                            <th>Status Seleksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(t.bidders || []).map((b, idx) => {
                            const diff = b.bid - t.budgetRAB;
                            return (
                              <tr key={idx}>
                                <td><div style={{ fontWeight: 800 }}>{b.name}</div></td>
                                <td><div style={{ fontWeight: 800 }}>{formatRupiah(b.bid)}</div></td>
                                <td>
                                  <div style={{ fontWeight: 700, color: diff < 0 ? 'var(--success)' : '#ef4444' }}>
                                    {diff < 0 ? formatRupiah(diff) : `+${formatRupiah(diff)}`}
                                  </div>
                                </td>
                                <td><span className="badge badge-info">{b.score}</span></td>
                                <td>
                                  {b.name === t.winner ? (
                                    <span className="badge badge-success"><Award size={12} /> PEMENANG TENDER</span>
                                  ) : (
                                    <span className="badge badge-neutral">Peserta Bidding</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* PILAR 4: GOODS RECEIPT (GR) GUDANG */}
      {activeTab === 'gr' && (() => {
        const filteredGr = goodsReceipts.filter(g => !searchGr || [g.id, g.poNo, g.item, g.receivedDate, g.inspector, g.qcStatus].some(val => (val || '').toLowerCase().includes(searchGr.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Verifikasi Penerimaan Material (Goods Receipt Gudang Lapangan)</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Pengecekan fisik surat jalan, kuantitas semen/besi, & kontrol kualitas bebas retak.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddGr} style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', border: 'none', fontWeight: 800 }}>
                <Plus size={14} /> + Catat Surat Jalan (GR) Baru
              </button>
            </div>

            {/* Search Bar GR */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari No GR (GR-2025), No PO ref, nama material semen/pasir, petugas QC..."
                  value={searchGr}
                  onChange={(e) => setSearchGr(e.target.value)}
                />
                {searchGr && (
                  <button onClick={() => setSearchGr('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredGr.length}</span> dari {goodsReceipts.length} Surat Jalan
              </div>
            </div>

            {filteredGr.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Truck size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada surat jalan penerimaan yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau catat penerimaan material baru.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchGr('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>No Surat Jalan (GR) & PO Ref</th>
                      <th>Material Bahan Terima</th>
                      <th>Tanggal Tiba di Site</th>
                      <th>Petugas Inspeksi Gudang</th>
                      <th>Status QC & Volume Check</th>
                      <th>Aksi CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGr.map((g) => (
                      <tr key={g.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{g.id}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Ref: {g.poNo}</div>
                        </td>
                        <td><div style={{ fontWeight: 700 }}>{g.item}</div></td>
                        <td>{g.receivedDate}</td>
                        <td>{g.inspector}</td>
                        <td><span className="badge badge-success">{g.qcStatus}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditGr(g)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Edit GR"
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteGR(g.id, g.item)}
                              style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Hapus Catatan GR"
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
            )}
          </div>
        );
      })()}

      {/* PILAR 5: SPK KONTRAK & VOLUME DISCOUNT */}
      {activeTab === 'contracts' && (() => {
        const filteredContracts = contracts.filter(c => !searchContract || [c.id, c.title, c.vendorName, c.status, c.validUntil, c.contractAmount?.toString()].some(val => (val || '').toLowerCase().includes(searchContract.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Manajemen SPK & Kontrak Diskon Grosir Volume</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Perjanjian borongan kerja kontraktor & potongan harga pembelian grosir semen/besi.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddContract} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                <Plus size={14} /> + Terbitkan Kontrak SPK Baru
              </button>
            </div>

            {/* Search Bar Contracts */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari No SPK (SPK-2025), judul pekerjaan, nama kontraktor/supplier..."
                  value={searchContract}
                  onChange={(e) => setSearchContract(e.target.value)}
                />
                {searchContract && (
                  <button onClick={() => setSearchContract('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredContracts.length}</span> dari {contracts.length} Kontrak SPK
              </div>
            </div>

            {filteredContracts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <FileText size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada kontrak SPK yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau terbitkan kontrak SPK baru.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchContract('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>No SPK & Judul Pekerjaan</th>
                      <th>Mitra Kontraktor / Supplier</th>
                      <th>Nilai Kontrak (Rp)</th>
                      <th>Diskon Volume (%)</th>
                      <th>Masa Berlaku</th>
                      <th>Status Kontrak</th>
                      <th>Aksi CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContracts.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{c.id}</div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{c.title}</div>
                        </td>
                        <td>{c.vendorName}</td>
                        <td><div style={{ fontWeight: 800 }}>{formatRupiah(c.contractAmount)}</div></td>
                        <td>
                          <span className="badge badge-warning" style={{ fontWeight: 800 }}>
                            <Percent size={11} style={{ display: 'inline', marginRight: '2px' }} /> {c.discountPct}%
                          </span>
                        </td>
                        <td><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>s/d {c.validUntil}</div></td>
                        <td>
                          <span className={`badge ${c.status.includes('Aktif') ? 'badge-success' : 'badge-neutral'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditContract(c)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Edit SPK"
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteContract(c.id, c.title)}
                              style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Hapus Kontrak SPK"
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
            )}
          </div>
        );
      })()}

      {/* PILAR 6: 3-WAY MATCHING INVOICE PAYMENT */}
      {activeTab === 'matching' && (() => {
        const filteredInvoices = invoices.filter(inv => !searchInvoice || [inv.id, inv.vendorName, inv.poNo, inv.grNo, inv.matchingStatus, inv.paymentStatus, inv.amount?.toString()].some(val => (val || '').toLowerCase().includes(searchInvoice.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Pencocokan 3 Arah (3-Way Matching: PO vs GR vs Invoice)</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Validasi silang tagihan supplier dengan pesanan PO dan bukti terima fisik gudang.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddInvoice} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                <Plus size={14} /> + Catat Tagihan Invoice Baru
              </button>
            </div>

            {/* Search Bar Invoice */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari No Invoice (INV-VND), nama vendor, No PO, No GR, status..."
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                />
                {searchInvoice && (
                  <button onClick={() => setSearchInvoice('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredInvoices.length}</span> dari {invoices.length} Tagihan
              </div>
            </div>

            {filteredInvoices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <FileCheck2 size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada invoice tagihan yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau catat tagihan baru.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchInvoice('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>No Tagihan Invoice</th>
                      <th>Vendor Tagihan</th>
                      <th>PO & Goods Receipt Ref</th>
                      <th>Nominal Tagihan (Rp)</th>
                      <th>Status 3-Way Matching</th>
                      <th>Status Pencairan Finance</th>
                      <th>Aksi Release & CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td><div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{inv.id}</div></td>
                        <td>{inv.vendorName}</td>
                        <td>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{inv.poNo}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{inv.grNo}</div>
                        </td>
                        <td><div style={{ fontWeight: 800 }}>{formatRupiah(inv.amount)}</div></td>
                        <td><span className="badge badge-success">{inv.matchingStatus}</span></td>
                        <td><span className="badge badge-info">{inv.paymentStatus}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            {inv.paymentStatus.includes('Approved') ? (
                              <button className="btn btn-primary btn-sm" onClick={() => handleReleasePayment(inv.id)} style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', background: '#10B981', border: 'none' }}>
                                <CheckCircle2 size={13} /> Cairkan
                              </button>
                            ) : (
                              <span className="badge badge-success"><CheckCircle2 size={12} /> Lunas</span>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditInvoice(inv)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Edit Invoice"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteInvoice(inv.id, inv.vendorName)}
                              style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Hapus Invoice"
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
            )}
          </div>
        );
      })()}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: REGISTRASI & EDIT VENDOR                             */}
      {/* ------------------------------------------------------------- */}
      {isVendorModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={20} color="#F59E0B" /> {editingVendor ? `Edit Mitra Vendor - ${editingVendor.name}` : 'Registrasi Mitra Vendor / Supplier Baru'}
              </h3>
              <button onClick={() => setIsVendorModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveVendor}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Perusahaan Vendor / Toko Material</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="misal: PT Semen Indonesia Tbk"
                    value={vendorForm.name}
                    onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Kategori Spesialisasi</label>
                    <select
                      className="form-control"
                      value={vendorForm.category}
                      onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
                    >
                      <option value="Kontraktor Utama">Kontraktor Utama (General Contractor)</option>
                      <option value="Sub-Kontraktor Struktur">Sub-Kontraktor Struktur & Pondasi</option>
                      <option value="Supplier Material (Semen/Besi)">Supplier Material (Semen/Besi)</option>
                      <option value="Supplier Keramik & Tile">Supplier Keramik & Finishing</option>
                      <option value="Vendor Utilitas PLN/PDAM">Vendor Utilitas & MEP</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Person (PIC)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Penanggung Jawab"
                      value={vendorForm.contactPerson}
                      onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0812-xxxx-xxxx"
                      value={vendorForm.phone}
                      onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status Kualifikasi</label>
                    <select
                      className="form-control"
                      value={vendorForm.status}
                      onChange={(e) => setVendorForm({ ...vendorForm, status: e.target.value })}
                    >
                      <option value="Terverifikasi (Vendor Utama)">Terverifikasi (Vendor Utama)</option>
                      <option value="Terverifikasi (Kontrak Payung)">Terverifikasi (Kontrak Payung)</option>
                      <option value="Terverifikasi">Terverifikasi</option>
                      <option value="Evaluasi Berkala">Evaluasi Berkala</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsVendorModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                  {editingVendor ? 'Simpan Perubahan Vendor' : 'Daftarkan Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: BUAT & EDIT PURCHASE ORDER (PO)                      */}
      {/* ------------------------------------------------------------- */}
      {isPoModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} color="#10B981" /> {editingPo ? `Edit Purchase Order - ${editingPo.id}` : 'Terbitkan Purchase Order (PO) Baru'}
              </h3>
              <button onClick={() => setIsPoModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePo}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">No Ref PR (Purchase Requisition)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={poForm.prNo}
                      onChange={(e) => setPoForm({ ...poForm, prNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vendor Supplier</label>
                    <input
                      type="text"
                      className="form-control"
                      value={poForm.vendorName}
                      onChange={(e) => setPoForm({ ...poForm, vendorName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rincian Deskripsi Material & Spesifikasi</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="Contoh: 500 Sak Semen Gresik 50kg & Besi Beton 12mm..."
                    value={poForm.itemDesc}
                    onChange={(e) => setPoForm({ ...poForm, itemDesc: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Total Anggaran Biaya PO (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={poForm.amount}
                      onChange={(e) => setPoForm({ ...poForm, amount: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status PO</label>
                    <select
                      className="form-control"
                      value={poForm.status}
                      onChange={(e) => setPoForm({ ...poForm, status: e.target.value })}
                    >
                      <option value="In Review Procurement">In Review Procurement</option>
                      <option value="Approved PO (Siap Kirim)">Approved PO (Siap Kirim)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPoModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  {editingPo ? 'Simpan Perubahan PO' : 'Terbitkan PO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: BUAT & EDIT LELANG TENDER                            */}
      {/* ------------------------------------------------------------- */}
      {isTenderModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="#6366F1" /> {editingTender ? `Edit Lelang Tender - ${editingTender.id}` : 'Buka Pengadaan Lelang Tender Baru'}
              </h3>
              <button onClick={() => setIsTenderModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTender}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Paket Pekerjaan / Proyek Konstruksi</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="misal: Pembangunan Main Road Boulevard & Drainase"
                    value={tenderForm.title}
                    onChange={(e) => setTenderForm({ ...tenderForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Pagu Anggaran RAB (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={tenderForm.budgetRAB}
                      onChange={(e) => setTenderForm({ ...tenderForm, budgetRAB: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pemenang Tender Terpilih</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Kontraktor Pemenang"
                      value={tenderForm.winner}
                      onChange={(e) => setTenderForm({ ...tenderForm, winner: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status Tahapan Lelang</label>
                  <select
                    className="form-control"
                    value={tenderForm.status}
                    onChange={(e) => setTenderForm({ ...tenderForm, status: e.target.value })}
                  >
                    <option value="Proses Bidding & Seleksi">Proses Bidding & Seleksi</option>
                    <option value="Penetapan Pemenang">Penetapan Pemenang</option>
                    <option value="SPK Diterbitkan">SPK Diterbitkan</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsTenderModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', border: 'none', fontWeight: 800 }}>
                  {editingTender ? 'Simpan Perubahan Tender' : 'Publikasikan Tender'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: CATAT & EDIT GOODS RECEIPT (GR)                      */}
      {/* ------------------------------------------------------------- */}
      {isGrModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="#0EA5E9" /> {editingGr ? `Edit Surat Jalan GR - ${editingGr.id}` : 'Catat Surat Jalan Penerimaan Barang (GR)'}
              </h3>
              <button onClick={() => setIsGrModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveGr}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">No Referensi PO</label>
                    <input
                      type="text"
                      className="form-control"
                      value={grForm.poNo}
                      onChange={(e) => setGrForm({ ...grForm, poNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Tiba di Site</label>
                    <input
                      type="text"
                      className="form-control"
                      value={grForm.receivedDate}
                      onChange={(e) => setGrForm({ ...grForm, receivedDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Material & Kuantitas Riil</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="misal: Semen Portland 50kg (500 Sak)"
                    value={grForm.item}
                    onChange={(e) => setGrForm({ ...grForm, item: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Petugas Inspeksi Gudang</label>
                    <input
                      type="text"
                      className="form-control"
                      value={grForm.inspector}
                      onChange={(e) => setGrForm({ ...grForm, inspector: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Hasil QC</label>
                    <select
                      className="form-control"
                      value={grForm.qcStatus}
                      onChange={(e) => setGrForm({ ...grForm, qcStatus: e.target.value })}
                    >
                      <option value="Lolos QC 100% (Bebas Rusak)">Lolos QC 100% (Bebas Rusak)</option>
                      <option value="Lolos QC Bersyarat">Lolos QC Bersyarat</option>
                      <option value="Retur / Rusak Sebagian">Retur / Rusak Sebagian</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsGrModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', border: 'none', fontWeight: 800 }}>
                  {editingGr ? 'Simpan Perubahan GR' : 'Simpan Surat Jalan GR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 5: TERBITKAN & EDIT KONTRAK SPK                         */}
      {/* ------------------------------------------------------------- */}
      {isContractModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#F59E0B" /> {editingContract ? `Edit Kontrak SPK - ${editingContract.id}` : 'Terbitkan Kontrak SPK & Diskon Volume Baru'}
              </h3>
              <button onClick={() => setIsContractModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveContract}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Kontrak SPK / Paket Borongan</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="misal: SPK Borongan Pembangunan 10 Unit Tipe 45"
                    value={contractForm.title}
                    onChange={(e) => setContractForm({ ...contractForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Mitra Kontraktor / Supplier</label>
                    <input
                      type="text"
                      className="form-control"
                      value={contractForm.vendorName}
                      onChange={(e) => setContractForm({ ...contractForm, vendorName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nilai Kontrak Total (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={contractForm.contractAmount}
                      onChange={(e) => setContractForm({ ...contractForm, contractAmount: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Diskon Volume Grosir (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={contractForm.discountPct}
                      onChange={(e) => setContractForm({ ...contractForm, discountPct: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Masa Berlaku Kontrak s/d</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 31 Desember 2025"
                      value={contractForm.validUntil}
                      onChange={(e) => setContractForm({ ...contractForm, validUntil: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status Kontrak</label>
                  <select
                    className="form-control"
                    value={contractForm.status}
                    onChange={(e) => setContractForm({ ...contractForm, status: e.target.value })}
                  >
                    <option value="Kontrak Aktif (Berjalan)">Kontrak Aktif (Berjalan)</option>
                    <option value="Kontrak Selesai 100%">Kontrak Selesai 100%</option>
                    <option value="Dalam Masa Retensi Garansi">Dalam Masa Retensi Garansi</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsContractModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                  {editingContract ? 'Simpan Perubahan SPK' : 'Terbitkan Kontrak SPK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 6: CATAT & EDIT 3-WAY MATCHING INVOICE                  */}
      {/* ------------------------------------------------------------- */}
      {isInvoiceModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck2 size={20} color="#10B981" /> {editingInvoice ? `Edit Tagihan Invoice - ${editingInvoice.id}` : 'Catat Tagihan Invoice Supplier Baru'}
              </h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveInvoice}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Perusahaan Vendor / Penagih</label>
                  <input
                    type="text"
                    className="form-control"
                    value={invoiceForm.vendorName}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, vendorName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">No Referensi PO</label>
                    <input
                      type="text"
                      className="form-control"
                      value={invoiceForm.poNo}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, poNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">No Referensi Surat Jalan (GR)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={invoiceForm.grNo}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, grNo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nominal Tagihan Invoice (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={invoiceForm.amount}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Pencairan Dana</label>
                    <select
                      className="form-control"
                      value={invoiceForm.paymentStatus}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentStatus: e.target.value })}
                    >
                      <option value="Approved Payment Release">Approved Payment Release</option>
                      <option value="Paid / Transfered (Finance)">Paid / Transfered (Finance)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsInvoiceModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  {editingInvoice ? 'Simpan Perubahan Invoice' : 'Simpan Tagihan Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
