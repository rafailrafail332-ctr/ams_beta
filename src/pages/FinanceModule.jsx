import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Briefcase,
  Book,
  Landmark,
  FileBarChart,
  UserCheck,
  Scale,
  TrendingUp,
  Activity,
  FileSpreadsheet,
  ShoppingCart,
  TrendingDown,
  ArrowRightLeft,
  CheckSquare,
  Receipt,
  Package,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Check,
  X,
  Eye,
  Building,
  Wallet,
  CreditCard,
  Percent,
  RefreshCw,
  FolderKanban,
  FileText,
  Printer,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  UploadCloud,
  CalendarDays,
  RotateCcw,
  FileCheck,
  Trash2,
  Paperclip
} from 'lucide-react';
import { FinanceLineChart } from '../components/FinanceLineChart';
import { FinanceDonutChart } from '../components/FinanceDonutChart';
import { TransferProofModal } from '../components/TransferProofModal';

import {
  getFundRequests,
  saveFundRequests,
  submitFundRequest,
  approveFundRequest,
  rejectFundRequest,
  disburseFundRequest,
  deleteFundRequest,
  getBanks,
  saveBanks,
  getCoa,
  saveCoa,
  deleteCoaAccount,
  getJurnal,
  saveJurnal,
  addJurnalEntry,
  deleteJurnalEntry,
  getSales,
  saveSales,
  deleteSale,
  getPayables,
  savePayables,
  deletePayable,
  getTaxes,
  saveTaxes,
  deleteTax,
  getJoblist,
  saveJoblist,
  deleteJoblistItem,
  getAuditLogs,
  addAuditLog
} from '../services/financeService';

export const FINANCE_SUBMODULES = [
  // KELOMPOK 1: MODUL UTAMA (6 MENU)
  { id: 'account_list', label: 'Account List', group: 'utama', icon: BookOpen },
  { id: 'joblist', label: 'Joblist', group: 'utama', icon: Briefcase },
  { id: 'jurnal', label: 'Jurnal', group: 'utama', icon: Book },
  { id: 'bank', label: 'Bank', group: 'utama', icon: Landmark },
  { id: 'laporan', label: 'Laporan', group: 'utama', icon: FileBarChart },
  { id: 'account', label: 'Account', group: 'utama', icon: UserCheck },

  // KELOMPOK 2: LAPORAN & TRANSAKSI OPERASIONAL (11 MENU)
  { id: 'neraca', label: 'Neraca', group: 'laporan_transaksi', icon: Scale },
  { id: 'laba_rugi', label: 'Laba Rugi', group: 'laporan_transaksi', icon: TrendingUp },
  { id: 'neraca_saldo', label: 'Neraca Saldo', group: 'laporan_transaksi', icon: Activity },
  { id: 'worksheet', label: 'Worksheet', group: 'laporan_transaksi', icon: FileSpreadsheet },
  { id: 'penjualan', label: 'Penjualan', group: 'laporan_transaksi', icon: ShoppingCart },
  { id: 'hutang', label: 'Hutang', group: 'laporan_transaksi', icon: TrendingDown },
  { id: 'transaksi_jurnal', label: 'Transaksi Jurnal', group: 'laporan_transaksi', icon: ArrowRightLeft },
  { id: 'job_ativity', label: 'Job Ativity', group: 'laporan_transaksi', icon: CheckSquare },
  { id: 'pajak', label: 'Pajak', group: 'laporan_transaksi', icon: Receipt },
  { id: 'purchase_order', label: 'Purchase Order', group: 'laporan_transaksi', icon: Package },
  { id: 'pengajuan_dana', label: 'Pengajuan Dana', group: 'laporan_transaksi', icon: DollarSign }
];

export const FinanceModule = () => {
  const { activeSubTab, setActiveSubTab } = useApp();
  const [activeSubModule, setActiveSubModule] = useState('pengajuan_dana');

  // Master Data States
  const [fundRequests, setFundRequests] = useState(() => getFundRequests());
  const [banks, setBanks] = useState(() => getBanks());
  const [coa, setCoa] = useState(() => getCoa());
  const [jurnal, setJurnal] = useState(() => getJurnal());
  const [sales, setSales] = useState(() => getSales());
  const [payables, setPayables] = useState(() => getPayables());
  const [taxes, setTaxes] = useState(() => getTaxes());
  const [joblist, setJoblist] = useState(() => getJoblist());
  const [auditLogs, setAuditLogs] = useState(() => getAuditLogs());

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModuleOrigin, setFilterModuleOrigin] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedGlAccount, setSelectedGlAccount] = useState('1-102'); // untuk submodul Account (buku besar)

  // Filter Proyek & Periode Waktu
  const [filterProject, setFilterProject] = useState('ALL'); // 'ALL' | 'Ashoka View' | 'Ashoka Park' | 'Head Office Bizhub' | 'Bizhub Commercial'
  const [filterDateMode, setFilterDateMode] = useState('ALL'); // 'ALL' | 'MONTHLY' | 'DAILY'
  const [filterMonth, setFilterMonth] = useState('2026-10');
  const [filterDay, setFilterDay] = useState(new Date().toISOString().split('T')[0]);

  // Modal Bukti Transfer & Struk Digital
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedProofItem, setSelectedProofItem] = useState(null);

  // Form Disburse Extra (Bukti TF, Nomor Referensi, Catatan)
  const [disburseTransferProof, setDisburseTransferProof] = useState({ url: null, name: '' });
  const [disburseTransferRef, setDisburseTransferRef] = useState('');
  const [disburseTransferNotes, setDisburseTransferNotes] = useState('');

  // Modal States
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [selectedReqForDisburse, setSelectedReqForDisburse] = useState(null);
  const [disburseSelectedBankId, setDisburseSelectedBankId] = useState('BCA-01');

  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [newReqForm, setNewReqForm] = useState({
    title: '',
    originModule: 'finance',
    originModuleName: 'Finance & Acc',
    requester: 'Staf Keuangan',
    project: 'Head Office Bizhub',
    category: 'Operasional',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Normal',
    accountCode: '5-301',
    notes: ''
  });

  const [isNewJvModalOpen, setIsNewJvModalOpen] = useState(false);
  const [newJvForm, setNewJvForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    debitAccountCode: '5-301',
    creditAccountCode: '1-101',
    amount: '',
    project: 'Head Office Bizhub'
  });

  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({
    code: '',
    name: '',
    category: 'Aset Lancar',
    normalBalance: 'Debit',
    balance: '',
    description: ''
  });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  // Notification State
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Sync dengan event global jika modul lain menyimpan pengajuan dana
  useEffect(() => {
    const handleDataChanged = () => {
      setFundRequests(getFundRequests());
      setBanks(getBanks());
      setCoa(getCoa());
      setJurnal(getJurnal());
      setSales(getSales());
      setPayables(getPayables());
      setTaxes(getTaxes());
      setJoblist(getJoblist());
      setAuditLogs(getAuditLogs());
    };
    window.addEventListener('ams-finance-data-changed', handleDataChanged);
    return () => window.removeEventListener('ams-finance-data-changed', handleDataChanged);
  }, []);

  // Sync dengan activeSubTab eksternal jika ada
  useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      const match = FINANCE_SUBMODULES.find(m => m.id === activeSubTab);
      if (match) {
        setActiveSubModule(match.id);
      }
    }
  }, [activeSubTab]);

  const handleSelectSubModule = (id) => {
    setActiveSubModule(id);
    if (setActiveSubTab) {
      setActiveSubTab(id);
    }
    setSearchTerm('');
  };

  const currentModule = FINANCE_SUBMODULES.find(m => m.id === activeSubModule) || FINANCE_SUBMODULES[0];
  const CurrentIcon = currentModule.icon;

  const mainModules = FINANCE_SUBMODULES.filter(m => m.group === 'utama');
  const secondaryModules = FINANCE_SUBMODULES.filter(m => m.group === 'laporan_transaksi');

  // ===========================================================================
  // HANDLERS FOR PENGAJUAN DANA (STAR FEATURE)
  // ===========================================================================
  const handleApproveRequest = (id) => {
    try {
      approveFundRequest(id, 'Yazid Hizbullah, S.E.,S.T (Finance Director)');
      setFundRequests(getFundRequests());
      showNotification(`Pengajuan ${id} berhasil disetujui (ACC)! Siap dicairkan.`);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleRejectRequest = (id) => {
    const reason = prompt('Masukkan alasan penolakan pengajuan dana:');
    if (reason === null) return;
    try {
      rejectFundRequest(id, reason || 'Alokasi anggaran belum tersedia');
      setFundRequests(getFundRequests());
      showNotification(`Pengajuan ${id} telah ditolak.`, 'warning');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleOpenDisburseModal = (req) => {
    setSelectedReqForDisburse(req);
    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    setDisburseTransferRef(`BKK/TRF/${todayStr}/${Math.floor(100 + Math.random() * 900)}`);
    setDisburseTransferNotes(`Pencairan dana ${req.id} untuk keperluan: ${req.title}`);
    setDisburseTransferProof({ url: null, name: '' });
    setIsDisburseModalOpen(true);
  };

  const handleExecuteDisburse = (e) => {
    e.preventDefault();
    if (!selectedReqForDisburse) return;
    try {
      const result = disburseFundRequest(
        selectedReqForDisburse.id,
        disburseSelectedBankId,
        'Yazid Hizbullah, S.E.,S.T',
        {
          transferRefNo: disburseTransferRef,
          transferNotes: disburseTransferNotes,
          transferProofUrl: disburseTransferProof.url,
          transferProofName: disburseTransferProof.name
        }
      );
      setFundRequests(getFundRequests());
      setBanks(getBanks());
      setJurnal(getJurnal());
      setAuditLogs(getAuditLogs());
      setIsDisburseModalOpen(false);
      showNotification(`DANA SEBESAR Rp ${selectedReqForDisburse.amount.toLocaleString('id-ID')} BERHASIL DICAIRKAN! (Ref: ${result.refDisburseNo}). Saldo bank & Jurnal Umum telah terupdate otomatis.`);
    } catch (err) {
      alert(`Gagal mencairkan dana: ${err.message}`);
    }
  };

  // ===========================================================================
  // DELETE HANDLERS (FITUR HAPUS CRUD DI SELURUH MODUL FINANCE)
  // ===========================================================================
  const handleDeleteFundRequest = (item) => {
    if (window.confirm(`Hapus pengajuan dana ${item.id} - "${item.title}"?\nTindakan ini tidak dapat dibatalkan.`)) {
      deleteFundRequest(item.id, 'Yazid Hizbullah, S.E.,S.T');
      setFundRequests(getFundRequests());
      setAuditLogs(getAuditLogs());
      showNotification(`Pengajuan dana ${item.id} berhasil dihapus.`);
    }
  };

  const handleDeleteJurnal = (item) => {
    if (window.confirm(`Hapus transaksi jurnal ${item.refNo || item.id} - "${item.description}"?\nTindakan ini akan membatalkan pembukuan jurnal ini.`)) {
      deleteJurnalEntry(item.id, 'Yazid Hizbullah, S.E.,S.T');
      setJurnal(getJurnal());
      setAuditLogs(getAuditLogs());
      showNotification(`Ayat jurnal ${item.refNo || item.id} berhasil dihapus.`);
    }
  };

  const handleDeleteCoa = (item) => {
    if (window.confirm(`Hapus akun COA ${item.code} - "${item.name}"?\nPastikan akun tidak lagi memiliki mutasi aktif.`)) {
      deleteCoaAccount(item.code, 'Yazid Hizbullah, S.E.,S.T');
      setCoa(getCoa());
      setAuditLogs(getAuditLogs());
      showNotification(`Akun COA ${item.code} berhasil dihapus.`);
    }
  };

  const handleDeletePayable = (item) => {
    if (window.confirm(`Hapus catatan hutang vendor ${item.vendor} (${item.billNo || item.id})?\nTotal: Rp ${Number(item.totalBill).toLocaleString('id-ID')}`)) {
      deletePayable(item.id, 'Yazid Hizbullah, S.E.,S.T');
      setPayables(getPayables());
      setAuditLogs(getAuditLogs());
      showNotification(`Catatan hutang vendor ${item.vendor} berhasil dihapus.`);
    }
  };

  const handleDeleteSale = (item) => {
    if (window.confirm(`Hapus catatan penjualan unit ${item.unitNo} konsumen "${item.consumerName}"?`)) {
      deleteSale(item.id, 'Yazid Hizbullah, S.E.,S.T');
      setSales(getSales());
      setAuditLogs(getAuditLogs());
      showNotification(`Catatan penjualan unit ${item.unitNo} berhasil dihapus.`);
    }
  };

  const handleDeleteTax = (item) => {
    if (window.confirm(`Hapus data kewajiban pajak ${item.taxType} - ${item.taxObject}?`)) {
      deleteTax(item.id, 'Yazid Hizbullah, S.E.,S.T');
      setTaxes(getTaxes());
      setAuditLogs(getAuditLogs());
      showNotification(`Data pajak ${item.taxType} berhasil dihapus.`);
    }
  };

  const handleDeleteJoblist = (item) => {
    if (window.confirm(`Hapus agenda tugas "${item.task}"?`)) {
      deleteJoblistItem(item.id, 'Yazid Hizbullah, S.E.,S.T');
      setJoblist(getJoblist());
      setAuditLogs(getAuditLogs());
      showNotification(`Agenda tugas berhasil dihapus.`);
    }
  };

  const handleCreateNewRequest = (e) => {
    e.preventDefault();
    if (!newReqForm.title || !newReqForm.amount) {
      alert('Mohon isi judul dan nominal pengajuan!');
      return;
    }
    try {
      const created = submitFundRequest(newReqForm);
      setFundRequests(getFundRequests());
      setIsNewRequestModalOpen(false);
      setNewReqForm({
        title: '',
        originModule: 'finance',
        originModuleName: 'Finance & Acc',
        requester: 'Staf Keuangan',
        project: 'Head Office Bizhub',
        category: 'Operasional',
        amount: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'Normal',
        accountCode: '5-301',
        notes: ''
      });
      showNotification(`Pengajuan ${created.id} berhasil diajukan dan masuk ke antrean Finance!`);
    } catch (err) {
      alert(err.message);
    }
  };

  // ===========================================================================
  // HANDLERS FOR TRANSAKSI JURNAL (MANUAL JV)
  // ===========================================================================
  const handleCreateJv = (e) => {
    e.preventDefault();
    if (!newJvForm.description || !newJvForm.amount) {
      alert('Mohon lengkapi keterangan dan nominal jurnal!');
      return;
    }
    const debitAcc = coa.find(c => c.code === newJvForm.debitAccountCode);
    const creditAcc = coa.find(c => c.code === newJvForm.creditAccountCode);

    addJurnalEntry({
      date: newJvForm.date,
      description: newJvForm.description,
      debitAccountCode: newJvForm.debitAccountCode,
      debitAccountName: debitAcc ? debitAcc.name : 'Debit Account',
      creditAccountCode: newJvForm.creditAccountCode,
      creditAccountName: creditAcc ? creditAcc.name : 'Credit Account',
      amount: Number(newJvForm.amount),
      project: newJvForm.project,
      status: 'Posted',
      moduleSource: 'Manual Journal Voucher'
    });

    setJurnal(getJurnal());
    setIsNewJvModalOpen(false);
    setNewJvForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      debitAccountCode: '5-301',
      creditAccountCode: '1-101',
      amount: '',
      project: 'Head Office Bizhub'
    });
    showNotification('Voucher Jurnal berhasil diposting ke Buku Jurnal Umum!');
  };

  // ===========================================================================
  // HANDLERS FOR ACCOUNT LIST (COA)
  // ===========================================================================
  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newAccountForm.code || !newAccountForm.name) {
      alert('Mohon lengkapi kode dan nama akun!');
      return;
    }
    const updated = [
      ...coa,
      {
        ...newAccountForm,
        balance: Number(newAccountForm.balance) || 0
      }
    ];
    saveCoa(updated);
    setCoa(updated);
    setIsNewAccountModalOpen(false);
    setNewAccountForm({
      code: '',
      name: '',
      category: 'Aset Lancar',
      normalBalance: 'Debit',
      balance: '',
      description: ''
    });
    showNotification(`Akun ${newAccountForm.code} - ${newAccountForm.name} berhasil ditambahkan ke COA!`);
  };

  // ===========================================================================
  // FILTERED DATASETS & METRICS (PROYEK & PERIODE FILTER)
  // ===========================================================================
  const filteredFundRequests = useMemo(() => {
    return fundRequests.filter(item => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project.toLowerCase().includes(searchTerm.toLowerCase());

      const matchModule = filterModuleOrigin === 'ALL' || item.originModule === filterModuleOrigin;
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;

      // Filter Proyek
      const matchProject =
        filterProject === 'ALL' ||
        (item.project && item.project.toLowerCase().includes(filterProject.toLowerCase()));

      // Filter Periode Waktu
      let matchDate = true;
      const itemDate = item.requestDate || item.disbursedAt || '';
      if (filterDateMode === 'MONTHLY' && filterMonth) {
        matchDate = itemDate.startsWith(filterMonth);
      } else if (filterDateMode === 'DAILY' && filterDay) {
        matchDate = itemDate === filterDay;
      }

      return matchSearch && matchModule && matchStatus && matchProject && matchDate;
    });
  }, [fundRequests, searchTerm, filterModuleOrigin, filterStatus, filterProject, filterDateMode, filterMonth, filterDay]);

  // Filter Penjualan berdasarkan Proyek & Periode
  const filteredSales = useMemo(() => {
    return sales.filter(item => {
      const matchProject =
        filterProject === 'ALL' ||
        (item.project && item.project.toLowerCase().includes(filterProject.toLowerCase()));

      let matchDate = true;
      const itemDate = item.contractDate || '';
      if (filterDateMode === 'MONTHLY' && filterMonth) {
        matchDate = itemDate.startsWith(filterMonth);
      } else if (filterDateMode === 'DAILY' && filterDay) {
        matchDate = itemDate === filterDay;
      }

      return matchProject && matchDate;
    });
  }, [sales, filterProject, filterDateMode, filterMonth, filterDay]);

  // Filter Jurnal Umum berdasarkan Proyek & Periode
  const filteredJurnal = useMemo(() => {
    return jurnal.filter(item => {
      const matchProject =
        filterProject === 'ALL' ||
        (item.project && item.project.toLowerCase().includes(filterProject.toLowerCase()));

      let matchDate = true;
      const itemDate = item.date || '';
      if (filterDateMode === 'MONTHLY' && filterMonth) {
        matchDate = itemDate.startsWith(filterMonth);
      } else if (filterDateMode === 'DAILY' && filterDay) {
        matchDate = itemDate === filterDay;
      }

      return matchProject && matchDate;
    });
  }, [jurnal, filterProject, filterDateMode, filterMonth, filterDay]);

  // Filter Hutang berdasarkan Proyek & Periode
  const filteredPayables = useMemo(() => {
    return payables.filter(item => {
      const matchProject =
        filterProject === 'ALL' ||
        (item.project && item.project.toLowerCase().includes(filterProject.toLowerCase()));

      let matchDate = true;
      const itemDate = item.dueDate || '';
      if (filterDateMode === 'MONTHLY' && filterMonth) {
        matchDate = itemDate.startsWith(filterMonth);
      } else if (filterDateMode === 'DAILY' && filterDay) {
        matchDate = itemDate === filterDay;
      }

      return matchProject && matchDate;
    });
  }, [payables, filterProject, filterDateMode, filterMonth, filterDay]);

  // Filter Pajak berdasarkan Proyek & Periode
  const filteredTaxes = useMemo(() => {
    return taxes.filter(item => {
      const matchProject =
        filterProject === 'ALL' ||
        (item.project && item.project.toLowerCase().includes(filterProject.toLowerCase())) ||
        (item.taxObject && item.taxObject.toLowerCase().includes(filterProject.toLowerCase()));

      let matchDate = true;
      const itemDate = item.dueDate || '';
      if (filterDateMode === 'MONTHLY' && filterMonth) {
        matchDate = itemDate.startsWith(filterMonth);
      } else if (filterDateMode === 'DAILY' && filterDay) {
        matchDate = itemDate === filterDay;
      }

      return matchProject && matchDate;
    });
  }, [taxes, filterProject, filterDateMode, filterMonth, filterDay]);

  // Statistik Pengajuan Dana (Reaktif terhadap filter Proyek & Periode)
  const fundStats = useMemo(() => {
    const totalAmount = filteredFundRequests.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    const pendingList = filteredFundRequests.filter(c => c.status === 'Menunggu Review');
    const approvedList = filteredFundRequests.filter(c => c.status === 'Disetujui');
    const disbursedList = filteredFundRequests.filter(c => c.status === 'Dicairkan');

    return {
      totalCount: filteredFundRequests.length,
      totalAmount,
      pendingCount: pendingList.length,
      pendingAmount: pendingList.reduce((acc, c) => acc + (Number(c.amount) || 0), 0),
      approvedCount: approvedList.length,
      approvedAmount: approvedList.reduce((acc, c) => acc + (Number(c.amount) || 0), 0),
      disbursedCount: disbursedList.length,
      disbursedAmount: disbursedList.reduce((acc, c) => acc + (Number(c.amount) || 0), 0)
    };
  }, [filteredFundRequests]);

  // Total Saldo Kas & Bank
  const totalBankBalance = useMemo(() => {
    return banks.reduce((acc, b) => acc + (Number(b.balance) || 0), 0);
  }, [banks]);

  // ===========================================================================
  // KALKULASI LAPORAN KEUANGAN (NERACA & LABA RUGI)
  // ===========================================================================
  const financialTotals = useMemo(() => {
    // Pendapatan (Akun 4-xxx)
    const pendapatan = coa
      .filter(c => c.category.includes('Pendapatan'))
      .reduce((acc, c) => acc + c.balance, 0);

    // HPP (Akun 5-101)
    const hpp = coa
      .filter(c => c.category === 'Beban Pokok')
      .reduce((acc, c) => acc + c.balance, 0);

    // Beban Operasional (Akun 5-2xx s.d 5-4xx)
    const bebanOps = coa
      .filter(c => c.category === 'Beban Operasional')
      .reduce((acc, c) => acc + c.balance, 0);

    // Beban Pajak (Akun 5-5xx)
    const bebanPajak = coa
      .filter(c => c.category === 'Beban Pajak')
      .reduce((acc, c) => acc + c.balance, 0);

    const labaKotor = pendapatan - hpp;
    const labaOperasional = labaKotor - bebanOps;
    const labaBersih = labaOperasional - bebanPajak;

    // Aset
    const asetLancar = coa
      .filter(c => c.category === 'Aset Lancar')
      .reduce((acc, c) => acc + c.balance, 0);

    const asetTetap = coa
      .filter(c => c.category === 'Aset Tetap')
      .reduce((acc, c) => acc + c.balance, 0);

    const kontraAset = coa
      .filter(c => c.category === 'Kontra Aset')
      .reduce((acc, c) => acc + c.balance, 0);

    const totalAset = asetLancar + asetTetap - kontraAset;

    // Kewajiban
    const kewajibanLancar = coa
      .filter(c => c.category === 'Kewajiban Lancar')
      .reduce((acc, c) => acc + c.balance, 0);

    const kewajibanPanjang = coa
      .filter(c => c.category === 'Kewajiban Jangka Panjang')
      .reduce((acc, c) => acc + c.balance, 0);

    const totalKewajiban = kewajibanLancar + kewajibanPanjang;

    // Ekuitas
    const ekuitasAwal = coa
      .filter(c => c.category === 'Ekuitas')
      .reduce((acc, c) => acc + c.balance, 0);

    const totalEkuitas = ekuitasAwal;

    return {
      pendapatan,
      hpp,
      labaKotor,
      bebanOps,
      bebanPajak,
      labaOperasional,
      labaBersih,
      totalAset,
      asetLancar,
      asetTetap,
      kontraAset,
      totalKewajiban,
      kewajibanLancar,
      kewajibanPanjang,
      totalEkuitas
    };
  }, [coa]);

  // ===========================================================================
  // DATASET DONUT CHARTS (KOMPOSISI & ALOKASI DANA MODERN)
  // ===========================================================================
  // 1. Donut Dataset: Alokasi Pengajuan Dana per Departemen
  const fundDonutData = useMemo(() => {
    const map = {};
    filteredFundRequests.forEach(req => {
      const origin = req.originModuleName || req.originModule || 'Lainnya';
      map[origin] = (map[origin] || 0) + (Number(req.amount) || 0);
    });
    const palette = {
      'Marketing & Sales': '#03cafc',
      'Teknik & Konstruksi': '#f97316',
      'HR & General Affair': '#10b981',
      'Legal & Perizinan': '#a855f7',
      'Procurement & Logistik': '#3b82f6',
      'Finance & Acc': '#ef4444'
    };
    const items = Object.entries(map).map(([label, value]) => ({
      label,
      value,
      color: palette[label] || '#94a3b8'
    }));
    if (items.length === 0) {
      return [
        { label: 'Teknik & Konstruksi', value: 73000000, color: '#f97316' },
        { label: 'Marketing & Promosi', value: 27500000, color: '#03cafc' },
        { label: 'Legal & Perizinan', value: 18500000, color: '#a855f7' },
        { label: 'Procurement Material', value: 32000000, color: '#3b82f6' },
        { label: 'HR & General Affair', value: 6800000, color: '#10b981' }
      ];
    }
    return items;
  }, [filteredFundRequests]);

  // 2. Donut Dataset: Distribusi Saldo Kas & Bank
  const bankDonutData = useMemo(() => {
    return banks.map(b => ({
      label: b.name.replace(/Operasional|Escrow Penjualan|Proyek/g, '').trim(),
      value: Number(b.balance) || 0,
      color: b.color || '#38bdf8'
    }));
  }, [banks]);

  // 3. Donut Dataset: Proporsi Penjualan Properti per Proyek
  const salesDonutData = useMemo(() => {
    const map = {
      'Ashoka View': 0,
      'Ashoka Park': 0,
      'Bizhub Commercial': 0
    };
    filteredSales.forEach(s => {
      const proj = s.project || 'Ashoka View';
      const val = Number(s.salePrice) || 0;
      if (proj.toLowerCase().includes('view')) map['Ashoka View'] += val;
      else if (proj.toLowerCase().includes('park')) map['Ashoka Park'] += val;
      else map['Bizhub Commercial'] += val;
    });
    const items = [
      { label: 'Ashoka View', value: map['Ashoka View'], color: '#38bdf8' },
      { label: 'Ashoka Park', value: map['Ashoka Park'], color: '#10b981' },
      { label: 'Bizhub Commercial', value: map['Bizhub Commercial'], color: '#f59e0b' }
    ].filter(i => i.value > 0);

    if (items.length === 0) {
      return [
        { label: 'Ashoka View', value: 865000000, color: '#38bdf8' },
        { label: 'Ashoka Park', value: 560000000, color: '#10b981' },
        { label: 'Bizhub Commercial', value: 850000000, color: '#f59e0b' }
      ];
    }
    return items;
  }, [filteredSales]);

  // 4. Donut Dataset: Komposisi Finansial Laba Rugi
  const pnlDonutData = useMemo(() => {
    return [
      { label: 'HPP Konstruksi', value: financialTotals.hpp || 420000000, color: '#f97316' },
      { label: 'Beban Operasional', value: financialTotals.bebanOps || 120000000, color: '#f59e0b' },
      { label: 'Beban Pajak', value: financialTotals.bebanPajak || 48000000, color: '#ef4444' },
      { label: 'Laba Bersih (Net)', value: Math.max(0, financialTotals.labaBersih || 392000000), color: '#10b981' }
    ];
  }, [financialTotals]);

  // Badge warna modul asal pengajuan
  const getOriginModuleBadge = (origin, originName) => {
    switch (origin) {
      case 'marketing':
        return { bg: 'rgba(3, 202, 252, 0.15)', border: '#03cafc', color: '#38bdf8', label: originName || 'Marketing' };
      case 'teknik':
        return { bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', color: '#fb923c', label: originName || 'Teknik & BATP' };
      case 'hr-ga':
      case 'hr':
      case 'ga':
        return { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', color: '#34d399', label: originName || 'HR & GA' };
      case 'legal':
        return { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', color: '#c084fc', label: originName || 'Legal' };
      case 'procurement':
        return { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', color: '#60a5fa', label: originName || 'Procurement' };
      default:
        return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', color: '#f87171', label: originName || 'Finance' };
    }
  };

  return (
    <div className="finance-module-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ========================================================================= */}
      {/* FLOATING NOTIFICATION BANNER                                              */}
      {/* ========================================================================= */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 9999,
            background: notification.type === 'error' ? '#991b1b' : notification.type === 'warning' ? '#b45309' : '#065f46',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.88rem',
            fontWeight: 700,
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADER UTAMA: FINANCE & ACC (BANNER MERAH MAROON)                         */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
              border: '2px solid #b91c1c',
              borderRadius: '8px',
              padding: '10px 24px',
              boxShadow: '0 4px 20px rgba(127, 0, 0, 0.5)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.04em',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              Finance & Acc
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', fontWeight: 600 }}>
              Sistem Keuangan, Kas-Bank, Jurnal Akuntansi & Hub Pengajuan Dana Terintegrasi
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Total Likuiditas Kas & Bank: <strong style={{ color: '#38bdf8' }}>Rp {totalBankBalance.toLocaleString('id-ID')}</strong> • Pengajuan Menunggu: <strong style={{ color: '#f59e0b' }}>{fundStats.pendingCount} Tiket</strong>
            </div>
          </div>
        </div>

        {/* Indikator Sub-Modul Aktif */}
        <div
          style={{
            background: '#0f172a',
            border: '1.5px solid #7f0000',
            borderRadius: '10px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}
        >
          <span style={{ color: '#ef4444', fontWeight: 800 }}>Aktif:</span>
          <span style={{ fontWeight: 800, color: '#ffffff' }}>{currentModule.label}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BILAH NAVIGASI SUB-MODUL 1: MODUL UTAMA (6 MENU)                          */}
      {/* ========================================================================= */}
      <div>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f87171', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Navigasi Utama (Master & Jurnal):
        </div>
        <div
          className="glass-card no-print"
          style={{
            background: '#090d16',
            border: '1.5px solid #1e293b',
            borderRadius: '12px',
            padding: '0.55rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          {mainModules.map((tab) => {
            const isActive = activeSubModule === tab.id;
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectSubModule(tab.id)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)'
                    : '#0f172a',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  border: isActive ? '1.5px solid #ef4444' : '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 900 : 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: isActive ? '0 4px 14px rgba(185, 28, 28, 0.45)' : 'none',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComp size={15} color={isActive ? '#ffffff' : '#ef4444'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BILAH NAVIGASI SUB-MODUL 2: LAPORAN & TRANSAKSI (11 MENU)                 */}
      {/* ========================================================================= */}
      <div>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f87171', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Laporan & Transaksi Finansial:
        </div>
        <div
          className="glass-card no-print"
          style={{
            background: '#090d16',
            border: '1.5px solid #1e293b',
            borderRadius: '12px',
            padding: '0.55rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          {secondaryModules.map((tab) => {
            const isActive = activeSubModule === tab.id;
            const IconComp = tab.icon;
            const isHighlight = tab.id === 'pengajuan_dana';
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectSubModule(tab.id)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)'
                    : isHighlight
                    ? '#1e1b4b'
                    : '#0f172a',
                  color: isActive ? '#ffffff' : isHighlight ? '#a5b4fc' : '#cbd5e1',
                  border: isActive
                    ? '1.5px solid #ef4444'
                    : isHighlight
                    ? '1px solid #6366f1'
                    : '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '9px 10px',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 900 : 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: isActive ? '0 4px 14px rgba(185, 28, 28, 0.45)' : 'none',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComp size={15} color={isActive ? '#ffffff' : isHighlight ? '#818cf8' : '#ef4444'} />
                <span>{tab.label}</span>
                {tab.id === 'pengajuan_dana' && fundStats.pendingCount > 0 && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      padding: '1px 6px',
                      borderRadius: '10px'
                    }}
                  >
                    {fundStats.pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🔍 MASTER TOOLBAR FILTER: FILTER PROYEK & WAKTU (BULANAN / HARIAN)         */}
      {/* ========================================================================= */}
      <div
        className="glass-card no-print"
        style={{
          background: 'linear-gradient(180deg, #0b1120 0%, #090d16 100%)',
          border: '1.5px solid #1e293b',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Label Filter Proyek */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Building size={16} color="#ef4444" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f87171', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Filter Proyek:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'Semua Proyek' },
                { id: 'Ashoka View', label: '🏡 Ashoka View', highlight: '#38bdf8' },
                { id: 'Ashoka Park', label: '🌳 Ashoka Park', highlight: '#10b981' },
                { id: 'Bizhub Commercial', label: '🏢 Bizhub Commercial' },
                { id: 'Head Office Bizhub', label: '🏛️ Head Office' }
              ].map((proj) => {
                const isActive = filterProject === proj.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setFilterProject(proj.id)}
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)'
                        : '#0f172a',
                      color: isActive ? '#ffffff' : proj.highlight || '#cbd5e1',
                      border: isActive ? '1.5px solid #ef4444' : '1px solid #1e293b',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.76rem',
                      fontWeight: isActive ? 800 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 2px 8px rgba(185, 28, 28, 0.4)' : 'none'
                    }}
                  >
                    {proj.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Filter Button jika ada filter aktif */}
          {(filterProject !== 'ALL' || filterDateMode !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setFilterProject('ALL');
                setFilterDateMode('ALL');
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#f87171',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Baris Kedua: Filter Periode Waktu */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <CalendarDays size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Periode Waktu:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setFilterDateMode('ALL')}
                style={{
                  background: filterDateMode === 'ALL' ? '#1e3a8a' : '#0f172a',
                  color: filterDateMode === 'ALL' ? '#ffffff' : '#cbd5e1',
                  border: filterDateMode === 'ALL' ? '1.5px solid #3b82f6' : '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.76rem',
                  fontWeight: filterDateMode === 'ALL' ? 800 : 600,
                  cursor: 'pointer'
                }}
              >
                Semua Waktu
              </button>

              <button
                type="button"
                onClick={() => setFilterDateMode('MONTHLY')}
                style={{
                  background: filterDateMode === 'MONTHLY' ? '#1e3a8a' : '#0f172a',
                  color: filterDateMode === 'MONTHLY' ? '#ffffff' : '#cbd5e1',
                  border: filterDateMode === 'MONTHLY' ? '1.5px solid #3b82f6' : '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.76rem',
                  fontWeight: filterDateMode === 'MONTHLY' ? 800 : 600,
                  cursor: 'pointer'
                }}
              >
                📅 Per Bulan
              </button>

              <button
                type="button"
                onClick={() => setFilterDateMode('DAILY')}
                style={{
                  background: filterDateMode === 'DAILY' ? '#1e3a8a' : '#0f172a',
                  color: filterDateMode === 'DAILY' ? '#ffffff' : '#cbd5e1',
                  border: filterDateMode === 'DAILY' ? '1.5px solid #3b82f6' : '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.76rem',
                  fontWeight: filterDateMode === 'DAILY' ? 800 : 600,
                  cursor: 'pointer'
                }}
              >
                📆 Per Hari
              </button>
            </div>

            {/* Input Picker sesuai mode */}
            {filterDateMode === 'MONTHLY' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Pilih Bulan:</span>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  style={{
                    background: '#0f172a',
                    border: '1.5px solid #3b82f6',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 700
                  }}
                />
              </div>
            )}

            {filterDateMode === 'DAILY' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Pilih Tanggal:</span>
                <input
                  type="date"
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value)}
                  style={{
                    background: '#0f172a',
                    border: '1.5px solid #3b82f6',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 700
                  }}
                />
              </div>
            )}
          </div>

          {/* Status Keterangan Filter */}
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Menampilkan data:</span>
            <strong style={{ color: filterProject === 'ALL' ? '#ffffff' : '#38bdf8' }}>
              {filterProject === 'ALL' ? 'Semua Proyek' : filterProject}
            </strong>
            <span>•</span>
            <strong style={{ color: filterDateMode === 'ALL' ? '#ffffff' : '#f59e0b' }}>
              {filterDateMode === 'ALL' ? 'Semua Periode' : filterDateMode === 'MONTHLY' ? `Bulan ${filterMonth}` : `Tgl ${filterDay}`}
            </strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 KONTEN DINAMIS: MENAMPILKAN 17 SUB-MODUL FINANCE SECARA LENGKAP         */}
      {/* ========================================================================= */}

      {/* ========================================================================= */}
      {/* 17. SUB-MODUL: PENGAJUAN DANA (THE STAR DISBURSEMENT HUB)                  */}
      {/* ========================================================================= */}
      {activeSubModule === 'pengajuan_dana' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* 4 Kartu Metrik Pengajuan Dana */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Total Pengajuan Masuk</span>
                <DollarSign size={18} color="#ef4444" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', marginTop: '6px' }}>
                Rp {fundStats.totalAmount.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                {fundStats.totalCount} Pengajuan Lintas Departemen
              </div>
            </div>

            <div className="glass-card" style={{ background: '#090d16', border: '1px solid #854d0e', borderRadius: '12px', padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fef08a', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Menunggu Review (Pending)</span>
                <Clock size={18} color="#eab308" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#facc15', marginTop: '6px' }}>
                Rp {fundStats.pendingAmount.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#ca8a04', marginTop: '4px' }}>
                {fundStats.pendingCount} Tiket Butuh Keputusan Segera
              </div>
            </div>

            <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e3a8a', borderRadius: '12px', padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#bfdbfe', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Disetujui (Siap Dicairkan)</span>
                <CheckCircle2 size={18} color="#3b82f6" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#60a5fa', marginTop: '6px' }}>
                Rp {fundStats.approvedAmount.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#3b82f6', marginTop: '4px' }}>
                {fundStats.approvedCount} Tiket Siap Bayar via Kas/Bank
              </div>
            </div>

            <div className="glass-card" style={{ background: '#090d16', border: '1px solid #065f46', borderRadius: '12px', padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Telah Dicairkan (Lunas)</span>
                <Check size={18} color="#10b981" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399', marginTop: '6px' }}>
                Rp {fundStats.disbursedAmount.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px' }}>
                {fundStats.disbursedCount} Tiket Terbukukan ke Jurnal Umum
              </div>
            </div>
          </div>

          {/* Dual Visual: Grafik Garis Tren & Donut Chart Alokasi Departemen */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
            <FinanceLineChart
              title="Tren Pengajuan vs Realisasi Pencairan Dana"
              subtitle={`Analisis tren pengeluaran operasional & konstruksi (${filterProject === 'ALL' ? 'Semua Proyek' : filterProject})`}
              data={[
                { label: 'Jan', Total: 42000000, Dicairkan: 40000000 },
                { label: 'Feb', Total: 48000000, Dicairkan: 45000000 },
                { label: 'Mar', Total: 55000000, Dicairkan: 52000000 },
                { label: 'Apr', Total: 60000000, Dicairkan: 56000000 },
                { label: 'Mei', Total: 65000000, Dicairkan: 58000000 },
                { label: 'Jun', Total: 82000000, Dicairkan: 75000000 },
                { label: 'Jul', Total: 95000000, Dicairkan: 88000000 },
                { label: 'Agt', Total: 110000000, Dicairkan: 102000000 },
                { label: 'Sep', Total: 135000000, Dicairkan: 125000000 },
                { label: 'Okt', Total: fundStats.totalAmount || 146000000, Dicairkan: fundStats.disbursedAmount || 118000000 }
              ]}
              series={[
                { key: 'Total', label: 'Total Diajukan', color: '#f59e0b' },
                { key: 'Dicairkan', label: 'Realisasi Dicairkan', color: '#10b981' }
              ]}
              badgeText="Disbursement Tracking"
              height={180}
              projectFilter={filterProject}
              onProjectChange={setFilterProject}
            />

            <FinanceDonutChart
              title="Alokasi Dana per Departemen"
              subtitle={`Distribusi porsi pengajuan berdasarkan divisi asal (${filterProject === 'ALL' ? 'Semua Proyek' : filterProject})`}
              data={fundDonutData}
              badgeText="Department Share"
              height={180}
            />
          </div>

          {/* Filter Bar & Tombol Tambah */}
          <div
            className="glass-card"
            style={{
              background: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
              {/* Search */}
              <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Cari ID, Judul, Pemohon, Proyek..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px 8px 36px',
                    color: '#ffffff',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              {/* Filter Modul Pengaju */}
              <select
                value={filterModuleOrigin}
                onChange={(e) => setFilterModuleOrigin(e.target.value)}
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.82rem'
                }}
              >
                <option value="ALL">Semua Departemen Pengaju</option>
                <option value="marketing">Marketing & Sales</option>
                <option value="teknik">Teknik & Konstruksi (BATP)</option>
                <option value="hr-ga">HR & General Affair</option>
                <option value="legal">Legal & Perizinan</option>
                <option value="procurement">Procurement (PO Material)</option>
                <option value="finance">Finance Internal</option>
              </select>

              {/* Filter Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.82rem'
                }}
              >
                <option value="ALL">Semua Status</option>
                <option value="Menunggu Review">Menunggu Review</option>
                <option value="Disetujui">Disetujui (ACC)</option>
                <option value="Dicairkan">Dicairkan (Lunas)</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>

            {/* Tombol Buat Pengajuan Manual */}
            <button
              type="button"
              onClick={() => setIsNewRequestModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                border: '1px solid #ef4444',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '9px 18px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)'
              }}
            >
              <Plus size={16} /> Buat Pengajuan Dana Manual
            </button>
          </div>

          {/* Tabel Pengajuan Dana Lintas Modul */}
          <div
            className="glass-card"
            style={{
              background: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="#ef4444" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                  Daftar Pengajuan Dana Masuk (Sentral Seluruh Departemen)
                </span>
                <span style={{ background: '#7f0000', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                  {filteredFundRequests.length} Tiket
                </span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <th style={{ padding: '12px 14px' }}>No Tiket & Tanggal</th>
                    <th style={{ padding: '12px 14px' }}>Asal Modul / Pemohon</th>
                    <th style={{ padding: '12px 14px' }}>Keperluan & Proyek</th>
                    <th style={{ padding: '12px 14px' }}>Nominal (Rp)</th>
                    <th style={{ padding: '12px 14px' }}>Prioritas</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Aksi Finance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFundRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        Tidak ada pengajuan dana yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredFundRequests.map((item) => {
                      const modBadge = getOriginModuleBadge(item.originModule, item.originModuleName);
                      return (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: '1px solid #1e293b',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#0d1527')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: 800, color: '#ffffff' }}>{item.id}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.requestDate}</div>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: modBadge.bg,
                                border: `1px solid ${modBadge.border}`,
                                color: modBadge.color,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                marginBottom: '4px'
                              }}
                            >
                              {modBadge.label}
                            </div>
                            <div style={{ color: '#cbd5e1', fontSize: '0.76rem' }}>{item.requester}</div>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, color: '#ffffff', maxWidth: '320px', lineHeight: 1.4 }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                              Proyek: <strong style={{ color: '#f87171' }}>{item.project}</strong> • {item.category}
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: 900, color: '#38bdf8', fontSize: '0.92rem' }}>
                              Rp {Number(item.amount).toLocaleString('id-ID')}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              COA: {item.accountCode || '5-301'}
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                background:
                                  item.priority === 'Mendesak'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : item.priority === 'Tinggi'
                                    ? 'rgba(249, 115, 22, 0.2)'
                                    : 'rgba(59, 130, 246, 0.2)',
                                color:
                                  item.priority === 'Mendesak'
                                    ? '#ef4444'
                                    : item.priority === 'Tinggi'
                                    ? '#f97316'
                                    : '#60a5fa',
                                border:
                                  item.priority === 'Mendesak'
                                    ? '1px solid #ef4444'
                                    : item.priority === 'Tinggi'
                                    ? '1px solid #f97316'
                                    : '1px solid #3b82f6'
                              }}
                            >
                              {item.priority}
                            </span>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            {item.status === 'Menunggu Review' && (
                              <span style={{ color: '#facc15', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid #eab308', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                                ⏳ Menunggu Review
                              </span>
                            )}
                            {item.status === 'Disetujui' && (
                              <span style={{ color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                                ✓ Disetujui (Siap Bayar)
                              </span>
                            )}
                            {item.status === 'Dicairkan' && (
                              <div>
                                <span style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                                  ✓ Dicairkan
                                </span>
                                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px' }}>
                                  via {item.disbursedBankName || 'Kas/Bank'}
                                </div>
                              </div>
                            )}
                            {item.status === 'Ditolak' && (
                              <span style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                                ✕ Ditolak
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '12px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {item.status === 'Menunggu Review' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveRequest(item.id)}
                                    title="Setujui (ACC)"
                                    style={{
                                      background: '#15803d',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '6px 10px',
                                      fontSize: '0.74rem',
                                      fontWeight: 800,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Setujui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectRequest(item.id)}
                                    title="Tolak"
                                    style={{
                                      background: '#991b1b',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '6px 10px',
                                      fontSize: '0.74rem',
                                      fontWeight: 800,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Tolak
                                  </button>
                                </>
                              )}

                              {item.status === 'Disetujui' && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenDisburseModal(item)}
                                  title="Cairkan Dana via Bank"
                                  style={{
                                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                    border: '1px solid #38bdf8',
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '0.74rem',
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
                                  }}
                                >
                                  ⚡ Cairkan Dana
                                </button>
                              )}

                              {item.status === 'Dicairkan' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProofItem(item);
                                    setIsProofModalOpen(true);
                                  }}
                                  title="Lihat Bukti Transfer & Cetak Struk"
                                  style={{
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    border: '1px solid #10b981',
                                    color: '#34d399',
                                    borderRadius: '6px',
                                    padding: '6px 10px',
                                    fontSize: '0.74rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                                  }}
                                >
                                  <Receipt size={13} />
                                  <span>Bukti TF</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDetailItem(item);
                                  setIsDetailModalOpen(true);
                                }}
                                title="Lihat Rincian & Lampiran"
                                style={{
                                  background: '#1e293b',
                                  color: '#cbd5e1',
                                  border: '1px solid #334155',
                                  borderRadius: '6px',
                                  padding: '6px 8px',
                                  fontSize: '0.74rem',
                                  cursor: 'pointer'
                                }}
                              >
                                <Eye size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteFundRequest(item)}
                                title="Hapus Pengajuan Dana"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  color: '#f87171',
                                  border: '1px solid rgba(239, 68, 68, 0.4)',
                                  borderRadius: '6px',
                                  padding: '6px 8px',
                                  fontSize: '0.74rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-MODUL: BANK (MANAJEMEN REKENING KAS & BANK)                         */}
      {/* ========================================================================= */}
      {activeSubModule === 'bank' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Header Ringkasan Saldo Bank */}
          <div
            className="glass-card"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              border: '1.5px solid #6366f1',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 700 }}>
                TOTAL SALDO KAS & REKENING OPERASIONAL PERUSAHAAN
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
                Rp {totalBankBalance.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: '4px' }}>
                Terdiri dari 4 Rekening Aktif (BCA, Mandiri Escrow, BSI Syariah, Kas Tunai)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSelectSubModule('pengajuan_dana')}
                style={{
                  background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                  border: '1px solid #ef4444',
                  color: '#ffffff',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Lihat Pengajuan Siap Dicairkan
              </button>
            </div>
          </div>

          {/* Dual Visual: Grafik Garis Arus Kas & Donut Chart Likuiditas Bank */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
            <FinanceLineChart
              title="Tren Arus Kas Masuk vs Keluar (Cash In vs Cash Out)"
              subtitle={`Monitoring likuiditas transaksi operasional & proyek (${filterProject === 'ALL' ? 'Semua Proyek' : filterProject})`}
              data={[
                { label: 'Jan', In: 280000000, Out: 190000000 },
                { label: 'Feb', In: 310000000, Out: 210000000 },
                { label: 'Mar', In: 350000000, Out: 240000000 },
                { label: 'Apr', In: 320000000, Out: 230000000 },
                { label: 'Mei', In: 340000000, Out: 220000000 },
                { label: 'Jun', In: 420000000, Out: 290000000 },
                { label: 'Jul', In: 480000000, Out: 310000000 },
                { label: 'Agt', In: 550000000, Out: 390000000 },
                { label: 'Sep', In: 610000000, Out: 430000000 },
                { label: 'Okt', In: 680000000, Out: 485000000 }
              ]}
              series={[
                { key: 'In', label: 'Cash In (Penerimaan)', color: '#10b981' },
                { key: 'Out', label: 'Cash Out (Pengeluaran)', color: '#ef4444' }
              ]}
              badgeText="Cash Runway"
              height={180}
              projectFilter={filterProject}
              onProjectChange={setFilterProject}
            />

            <FinanceDonutChart
              title="Komposisi Saldo Kas & Bank"
              subtitle="Porsi saldo riil yang tersimpan di seluruh rekening operasional & escrow"
              data={bankDonutData}
              badgeText="Liquidity Spread"
              height={180}
            />
          </div>

          {/* Grid Kartu 4 Rekening Bank */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {banks.map((bank) => (
              <div
                key={bank.id}
                className="glass-card"
                style={{
                  background: '#090d16',
                  border: `1.5px solid ${bank.color || '#334155'}`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: bank.color, background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                      {bank.bankType}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px' }}>
                      {bank.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      No. Rek: <strong style={{ color: '#cbd5e1' }}>{bank.accountNumber}</strong>
                    </div>
                  </div>
                  <Landmark size={24} color={bank.color} />
                </div>

                <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Saldo Tersedia:</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8' }}>
                    Rp {Number(bank.balance).toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                    a.n {bank.accountHolder}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                  <span>Kode COA: <strong style={{ color: '#ffffff' }}>{bank.accountCode}</strong></span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>● {bank.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Riwayat Mutasi Rekening dari Jurnal Umum */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowRightLeft size={18} color="#ef4444" /> Riwayat Mutasi Transaksi Kas & Bank Terkini
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <th style={{ padding: '10px 12px' }}>No Bukti</th>
                    <th style={{ padding: '10px 12px' }}>Tanggal</th>
                    <th style={{ padding: '10px 12px' }}>Keterangan Transaksi</th>
                    <th style={{ padding: '10px 12px' }}>Rekening Terkait</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Jumlah (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJurnal.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '1.75rem', color: '#64748b' }}>
                        Tidak ada riwayat mutasi untuk filter ({filterProject} • {filterDateMode}).
                      </td>
                    </tr>
                  ) : (
                    filteredJurnal.slice(0, 5).map((jrn) => (
                      <tr key={jrn.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#f87171' }}>{jrn.refNo}</td>
                        <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{jrn.date}</td>
                        <td style={{ padding: '10px 12px', color: '#ffffff' }}>{jrn.description}</td>
                        <td style={{ padding: '10px 12px', color: '#38bdf8' }}>{jrn.creditAccountName}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#f87171' }}>
                          - Rp {Number(jrn.amount).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-MODUL: JURNAL (BUKU JURNAL UMUM - GENERAL LEDGER)                   */}
      {/* ========================================================================= */}
      {activeSubModule === 'jurnal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Buku Jurnal Umum (General Ledger)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Pencatatan ganda debit & kredit yang tersinkronisasi otomatis saat ada pencairan pengajuan dana dan penerimaan penjualan.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsNewJvModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                  border: '1px solid #ef4444',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} /> Entri Voucher Jurnal Baru
              </button>
            </div>
          </div>

          {/* Status Balance Jurnal */}
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #10b981',
              borderRadius: '10px',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} color="#10b981" />
              <div>
                <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.88rem' }}>
                  STATUS JURNAL: BALANCE (SEIMBANG)
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Total {filteredJurnal.length} Transaksi Tercatat ({filterProject === 'ALL' ? 'Semua Proyek' : filterProject}) • Debit & Kredit Sesuai Standar Akuntansi
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 800 }}>
              Total Nilai Jurnal: <span style={{ color: '#38bdf8' }}>Rp {filteredJurnal.reduce((a, b) => a + (Number(b.amount) || 0), 0).toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Tabel Jurnal Umum */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <th style={{ padding: '12px 14px' }}>Tanggal & No Bukti</th>
                    <th style={{ padding: '12px 14px' }}>Keterangan Transaksi & Modul</th>
                    <th style={{ padding: '12px 14px' }}>Akun Debit</th>
                    <th style={{ padding: '12px 14px' }}>Akun Kredit</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Nominal (Rp)</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJurnal.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        Tidak ada transaksi jurnal yang cocok dengan filter ({filterProject} • {filterDateMode}).
                      </td>
                    </tr>
                  ) : filteredJurnal.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{item.refNo}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.date}</div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#ffffff', maxWidth: '300px' }}>
                          {item.description}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '2px' }}>
                          Sumber: {item.moduleSource} • Proyek: {item.project}
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#34d399' }}>{item.debitAccountName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Kode: {item.debitAccountCode}</div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#f87171' }}>{item.creditAccountName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Kode: {item.creditAccountCode}</div>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 900, color: '#38bdf8', fontSize: '0.92rem' }}>
                          Rp {Number(item.amount).toLocaleString('id-ID')}
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid #10b981', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                          ✓ {item.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteJurnal(item)}
                          title="Hapus Transaksi Jurnal"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '6px',
                            padding: '5px 8px',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SUB-MODUL: ACCOUNT LIST (COA - BAGAN AKUN STANDAR)                      */}
      {/* ========================================================================= */}
      {activeSubModule === 'account_list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Bagan Akun (Chart of Accounts / COA)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Master kode akun standar akuntansi properti untuk seluruh klasifikasi Aset, Kewajiban, Modal, Pendapatan, dan Beban.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNewAccountModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                border: '1px solid #ef4444',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Tambah Akun Baru
            </button>
          </div>

          {/* Tabel COA */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <th style={{ padding: '12px 14px' }}>Kode Akun</th>
                    <th style={{ padding: '12px 14px' }}>Nama Akun</th>
                    <th style={{ padding: '12px 14px' }}>Kategori Klasifikasi</th>
                    <th style={{ padding: '12px 14px' }}>Posisi Normal</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Saldo Berjalan (Rp)</th>
                    <th style={{ padding: '12px 14px' }}>Keterangan</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {coa.map((item) => (
                    <tr key={item.code} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 900, color: '#f87171' }}>{item.code}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#ffffff' }}>{item.name}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: '#0f172a', border: '1px solid #334155', color: '#93c5fd', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: item.normalBalance === 'Debit' ? '#34d399' : '#f87171', fontWeight: 700 }}>
                        {item.normalBalance}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#38bdf8' }}>
                        Rp {Number(item.balance).toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.74rem' }}>
                        {item.description}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteCoa(item)}
                          title="Hapus Akun COA"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '6px',
                            padding: '5px 8px',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SUB-MODUL: ACCOUNT (BUKU BESAR DRILLDOWN)                               */}
      {/* ========================================================================= */}
      {activeSubModule === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Buku Besar Akun (General Ledger Drill-Down)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Pilih akun spesifik untuk melihat riwayat mutasi debit dan kredit secara kronologis.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700 }}>Pilih Akun:</span>
              <select
                value={selectedGlAccount}
                onChange={(e) => setSelectedGlAccount(e.target.value)}
                style={{
                  background: '#0f172a',
                  border: '1.5px solid #ef4444',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 800
                }}
              >
                {coa.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kartu Ringkasan Akun Terpilih */}
          {(() => {
            const accInfo = coa.find(c => c.code === selectedGlAccount) || coa[0];
            const relatedTrx = filteredJurnal.filter(
              j => j.debitAccountCode === accInfo.code || j.creditAccountCode === accInfo.code
            );

            return (
              <>
                <div
                  className="glass-card"
                  style={{
                    background: '#090d16',
                    border: '1.5px solid #334155',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#f87171', fontWeight: 800 }}>KODE: {accInfo.code} • {accInfo.category}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>{accInfo.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{accInfo.description}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Saldo Akhir Berjalan:</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>
                      Rp {Number(accInfo.balance).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #1e293b', fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>
                    Histori Mutasi Akun: {accInfo.name} ({relatedTrx.length} Transaksi)
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                        <th style={{ padding: '10px 12px' }}>Tanggal & No Bukti</th>
                        <th style={{ padding: '10px 12px' }}>Keterangan Mutasi</th>
                        <th style={{ padding: '10px 12px' }}>Posisi Mutasi</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Nominal (Rp)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedTrx.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            Belum ada mutasi jurnal untuk akun ini pada filter ({filterProject} • {filterDateMode}).
                          </td>
                        </tr>
                      ) : (
                        relatedTrx.map((trx) => {
                          const isDebit = trx.debitAccountCode === accInfo.code;
                          return (
                            <tr key={trx.id} style={{ borderBottom: '1px solid #1e293b' }}>
                              <td style={{ padding: '10px 12px' }}>
                                <div style={{ fontWeight: 800, color: '#ffffff' }}>{trx.refNo}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{trx.date}</div>
                              </td>
                              <td style={{ padding: '10px 12px', color: '#ffffff' }}>{trx.description}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: isDebit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isDebit ? '#34d399' : '#f87171' }}>
                                  {isDebit ? 'DEBIT' : 'KREDIT'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: isDebit ? '#34d399' : '#f87171' }}>
                                {isDebit ? '+' : '-'} Rp {Number(trx.amount).toLocaleString('id-ID')}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SUB-MODUL: NERACA (BALANCE SHEET)                                       */}
      {/* ========================================================================= */}
      {activeSubModule === 'neraca' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Laporan Neraca Keuangan (Balance Sheet)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Posisi Keuangan Perseroan: Aset = Kewajiban + Ekuitas
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={15} /> Cetak Neraca
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            
            {/* Kolom Kiri: ASET */}
            <div className="glass-card" style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #ef4444', paddingBottom: '8px', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#f87171', margin: 0 }}>
                  AKTIVA / TOTAL ASET
                </h3>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8' }}>
                  Rp {financialTotals.totalAset.toLocaleString('id-ID')}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.76rem', textTransform: 'uppercase' }}>Aset Lancar:</div>
                {coa.filter(c => c.category === 'Aset Lancar').map(c => (
                  <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px dashed #1e293b', paddingBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>{c.name}</span>
                    <strong style={{ color: '#ffffff' }}>Rp {c.balance.toLocaleString('id-ID')}</strong>
                  </div>
                ))}

                <div style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.76rem', textTransform: 'uppercase', marginTop: '10px' }}>Aset Tetap & Non-Lancar:</div>
                {coa.filter(c => c.category === 'Aset Tetap' || c.category === 'Kontra Aset').map(c => (
                  <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px dashed #1e293b', paddingBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>{c.name}</span>
                    <strong style={{ color: c.category === 'Kontra Aset' ? '#f87171' : '#ffffff' }}>
                      {c.category === 'Kontra Aset' ? `(Rp ${c.balance.toLocaleString('id-ID')})` : `Rp ${c.balance.toLocaleString('id-ID')}`}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Kanan: KEWAJIBAN & EKUITAS */}
            <div className="glass-card" style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #ef4444', paddingBottom: '8px', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#f87171', margin: 0 }}>
                  PASIVA (KEWAJIBAN & EKUITAS)
                </h3>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8' }}>
                  Rp {(financialTotals.totalKewajiban + financialTotals.totalEkuitas).toLocaleString('id-ID')}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.76rem', textTransform: 'uppercase' }}>Kewajiban / Hutang:</div>
                {coa.filter(c => c.category.includes('Kewajiban')).map(c => (
                  <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px dashed #1e293b', paddingBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>{c.name}</span>
                    <strong style={{ color: '#ffffff' }}>Rp {c.balance.toLocaleString('id-ID')}</strong>
                  </div>
                ))}

                <div style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.76rem', textTransform: 'uppercase', marginTop: '10px' }}>Ekuitas / Modal:</div>
                {coa.filter(c => c.category === 'Ekuitas').map(c => (
                  <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px dashed #1e293b', paddingBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>{c.name}</span>
                    <strong style={{ color: '#ffffff' }}>Rp {c.balance.toLocaleString('id-ID')}</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SUB-MODUL: LABA RUGI (INCOME STATEMENT / P&L)                           */}
      {/* ========================================================================= */}
      {activeSubModule === 'laba_rugi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Laporan Laba Rugi Komprehensif (Income Statement)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Kalkulasi Omzet Penjualan Unit Properti dikurangi HPP dan Beban Operasional Departemen.
              </p>
            </div>
          </div>

          {/* Highlight Laba Bersih & Donut Chart Proporsi Biaya */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
            <div
              className="glass-card"
              style={{
                background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: '#a7f3d0', fontWeight: 800 }}>LABA BERSIH SETELAH PAJAK (NET PROFIT)</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>
                  Rp {financialTotals.labaBersih.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Net Profit Margin: <strong style={{ color: '#38bdf8' }}>{((financialTotals.labaBersih / (financialTotals.pendapatan || 1)) * 100).toFixed(1)}%</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Pendapatan (Revenue)</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                    Rp {financialTotals.pendapatan.toLocaleString('id-ID')}
                  </div>
                </div>
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total HPP & Beban</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f87171' }}>
                    Rp {(financialTotals.hpp + financialTotals.bebanOps + financialTotals.bebanPajak).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>

            <FinanceDonutChart
              title="Struktur Biaya vs Profitabilitas"
              subtitle={`Komposisi HPP, beban operasional, beban pajak, dan margin profit (${filterProject === 'ALL' ? 'Semua Proyek' : filterProject})`}
              data={pnlDonutData}
              badgeText="Margin Ratio"
              height={180}
            />
          </div>

          {/* Rincian Baris Laba Rugi */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
              
              {/* 1. Pendapatan */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#38bdf8', borderBottom: '1.5px solid #1e293b', paddingBottom: '6px' }}>
                <span>1. PENDAPATAN USAHA (REVENUE)</span>
                <span>Rp {financialTotals.pendapatan.toLocaleString('id-ID')}</span>
              </div>
              {coa.filter(c => c.category.includes('Pendapatan')).map(c => (
                <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '1.25rem', color: '#cbd5e1' }}>
                  <span>{c.name}</span>
                  <strong>Rp {c.balance.toLocaleString('id-ID')}</strong>
                </div>
              ))}

              {/* 2. HPP */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#f87171', borderBottom: '1.5px solid #1e293b', paddingBottom: '6px', marginTop: '10px' }}>
                <span>2. HARGA POKOK PENJUALAN (HPP KONSTRUKSI)</span>
                <span>(Rp {financialTotals.hpp.toLocaleString('id-ID')})</span>
              </div>
              {coa.filter(c => c.category === 'Beban Pokok').map(c => (
                <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '1.25rem', color: '#cbd5e1' }}>
                  <span>{c.name}</span>
                  <strong>(Rp {c.balance.toLocaleString('id-ID')})</strong>
                </div>
              ))}

              {/* Laba Kotor */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#ffffff', background: '#0f172a', padding: '8px 12px', borderRadius: '6px', marginTop: '6px' }}>
                <span>LABA KOTOR (GROSS PROFIT)</span>
                <span style={{ color: '#38bdf8' }}>Rp {financialTotals.labaKotor.toLocaleString('id-ID')}</span>
              </div>

              {/* 3. Beban Operasional */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#f87171', borderBottom: '1.5px solid #1e293b', paddingBottom: '6px', marginTop: '10px' }}>
                <span>3. BEBAN OPERASIONAL PERUSAHAAN</span>
                <span>(Rp {financialTotals.bebanOps.toLocaleString('id-ID')})</span>
              </div>
              {coa.filter(c => c.category === 'Beban Operasional').map(c => (
                <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '1.25rem', color: '#cbd5e1' }}>
                  <span>{c.name}</span>
                  <strong>(Rp {c.balance.toLocaleString('id-ID')})</strong>
                </div>
              ))}

              {/* 4. Beban Pajak */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#f87171', borderBottom: '1.5px solid #1e293b', paddingBottom: '6px', marginTop: '10px' }}>
                <span>4. BEBAN PAJAK PENGHASILAN (PPH FINAL)</span>
                <span>(Rp {financialTotals.bebanPajak.toLocaleString('id-ID')})</span>
              </div>

              {/* Laba Bersih Akhir */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#ffffff', background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)', padding: '12px 16px', borderRadius: '8px', marginTop: '12px', fontSize: '1rem', border: '1.5px solid #ef4444' }}>
                <span>LABA BERSIH AKHIR PERIODE (NET PROFIT)</span>
                <span style={{ color: '#34d399' }}>Rp {financialTotals.labaBersih.toLocaleString('id-ID')}</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SUB-MODUL: NERACA SALDO (TRIAL BALANCE)                                 */}
      {/* ========================================================================= */}
      {activeSubModule === 'neraca_saldo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Neraca Saldo (Trial Balance)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Daftar seluruh saldo akun debit dan kredit sebelum penyesuaian akhir periode.
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '12px 14px' }}>Kode</th>
                  <th style={{ padding: '12px 14px' }}>Nama Akun</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Debit (Rp)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Kredit (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {coa.map((c) => {
                  const isDebit = c.normalBalance === 'Debit';
                  return (
                    <tr key={c.code} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: '#f87171' }}>{c.code}</td>
                      <td style={{ padding: '10px 14px', color: '#ffffff' }}>{c.name}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: isDebit ? '#34d399' : '#64748b' }}>
                        {isDebit ? `Rp ${c.balance.toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: !isDebit ? '#f87171' : '#64748b' }}>
                        {!isDebit ? `Rp ${c.balance.toLocaleString('id-ID')}` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. SUB-MODUL: WORKSHEET (KERTAS KERJA 10 KOLOM)                          */}
      {/* ========================================================================= */}
      {activeSubModule === 'worksheet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Kertas Kerja Akuntansi (Worksheet 10 Kolom)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Lembar kerja lajur: Neraca Saldo, AJP, Neraca Disesuaikan, Laba Rugi, dan Neraca Akhir.
            </p>
          </div>

          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <th rowSpan="2" style={{ padding: '10px' }}>Kode & Nama Akun</th>
                    <th colSpan="2" style={{ padding: '6px', textAlign: 'center', borderRight: '1px solid #1e293b', color: '#38bdf8' }}>Neraca Saldo</th>
                    <th colSpan="2" style={{ padding: '6px', textAlign: 'center', borderRight: '1px solid #1e293b', color: '#eab308' }}>Penyesuaian (AJP)</th>
                    <th colSpan="2" style={{ padding: '6px', textAlign: 'center', borderRight: '1px solid #1e293b', color: '#a855f7' }}>Neraca Disesuaikan</th>
                    <th colSpan="2" style={{ padding: '6px', textAlign: 'center', color: '#34d399' }}>Laba Rugi</th>
                  </tr>
                  <tr style={{ background: '#0f172a', color: '#64748b', borderBottom: '1px solid #1e293b', fontSize: '0.72rem' }}>
                    <th style={{ padding: '4px 8px', textAlign: 'right' }}>D</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right', borderRight: '1px solid #1e293b' }}>K</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right' }}>D</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right', borderRight: '1px solid #1e293b' }}>K</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right' }}>D</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right', borderRight: '1px solid #1e293b' }}>K</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right' }}>D</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right' }}>K</th>
                  </tr>
                </thead>
                <tbody>
                  {coa.slice(0, 10).map((c) => {
                    const isDebit = c.normalBalance === 'Debit';
                    return (
                      <tr key={c.code} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '8px 10px', color: '#ffffff', fontWeight: 600 }}>
                          <span style={{ color: '#f87171', marginRight: '6px' }}>{c.code}</span> {c.name}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', color: isDebit ? '#38bdf8' : '#475569' }}>
                          {isDebit ? c.balance.toLocaleString('id-ID') : '-'}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', borderRight: '1px solid #1e293b', color: !isDebit ? '#f87171' : '#475569' }}>
                          {!isDebit ? c.balance.toLocaleString('id-ID') : '-'}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', color: '#475569' }}>-</td>
                        <td style={{ padding: '8px', textAlign: 'right', borderRight: '1px solid #1e293b', color: '#475569' }}>-</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: isDebit ? '#a855f7' : '#475569' }}>
                          {isDebit ? c.balance.toLocaleString('id-ID') : '-'}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', borderRight: '1px solid #1e293b', color: !isDebit ? '#a855f7' : '#475569' }}>
                          {!isDebit ? c.balance.toLocaleString('id-ID') : '-'}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', color: c.category.includes('Beban') ? '#f87171' : '#475569' }}>
                          {c.category.includes('Beban') ? c.balance.toLocaleString('id-ID') : '-'}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', color: c.category.includes('Pendapatan') ? '#34d399' : '#475569' }}>
                          {c.category.includes('Pendapatan') ? c.balance.toLocaleString('id-ID') : '-'}
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
      {/* 11. SUB-MODUL: PENJUALAN (SALES & REVENUE PROPERTI)                        */}
      {/* ========================================================================= */}
      {activeSubModule === 'penjualan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Penjualan Properti (Property Sales Ledger)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Rekapitulasi penjualan unit rumah, ruko komersil, metode pembayaran dan sisa piutang konsumen.
              </p>
            </div>
          </div>

          {/* Dual Visual: Tren Penjualan & Donut Chart Proporsi Omzet Proyek */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
            <FinanceLineChart
              title="Tren Omzet Penjualan Unit: Ashoka View vs Ashoka Park"
              subtitle={`Perbandingan performa penjualan unit properti perumahan (${filterProject === 'ALL' ? 'Semua Proyek' : filterProject})`}
              data={[
                { label: 'Jan', AshokaView: 320000000, AshokaPark: 250000000 },
                { label: 'Feb', AshokaView: 390000000, AshokaPark: 310000000 },
                { label: 'Mar', AshokaView: 420000000, AshokaPark: 340000000 },
                { label: 'Apr', AshokaView: 450000000, AshokaPark: 360000000 },
                { label: 'Mei', AshokaView: 485000000, AshokaPark: 380000000 },
                { label: 'Jun', AshokaView: 560000000, AshokaPark: 450000000 },
                { label: 'Jul', AshokaView: 680000000, AshokaPark: 560000000 },
                { label: 'Agt', AshokaView: 750000000, AshokaPark: 680000000 },
                { label: 'Sep', AshokaView: 865000000, AshokaPark: 810000000 },
                { label: 'Okt', AshokaView: 940000000, AshokaPark: 890000000 }
              ]}
              series={[
                { key: 'AshokaView', label: 'Ashoka View (Blok A, B, C)', color: '#38bdf8' },
                { key: 'AshokaPark', label: 'Ashoka Park (Blok PK)', color: '#10b981' }
              ]}
              badgeText="Head-to-Head Comparison"
              height={180}
              projectFilter={filterProject}
              onProjectChange={setFilterProject}
            />

            <FinanceDonutChart
              title="Proporsi Omzet Properti"
              subtitle={`Porsi kontribusi omzet penjualan per kawasan perumahan (${filterProject === 'ALL' ? 'Semua Proyek' : filterProject})`}
              data={salesDonutData}
              badgeText="Revenue Contribution"
              height={180}
            />
          </div>

          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '12px 14px' }}>No Unit & Proyek</th>
                  <th style={{ padding: '12px 14px' }}>Nama Konsumen</th>
                  <th style={{ padding: '12px 14px' }}>Tipe Unit</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Harga Jual</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Terbayar (DP/Cash)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Sisa Piutang</th>
                  <th style={{ padding: '12px 14px' }}>Metode & Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      Tidak ada catatan penjualan unit untuk filter ({filterProject} • {filterDateMode}).
                    </td>
                  </tr>
                ) : filteredSales.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 800, color: '#f87171' }}>{item.unitNo}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.project}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#ffffff' }}>
                      {item.consumerName}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{item.type}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#ffffff' }}>
                      Rp {Number(item.salePrice).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#34d399' }}>
                      Rp {Number(item.paidAmount).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: item.unpaidAmount > 0 ? '#f87171' : '#94a3b8' }}>
                      Rp {Number(item.unpaidAmount).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ color: '#38bdf8', fontSize: '0.74rem', fontWeight: 700 }}>{item.paymentMethod}</div>
                      <div style={{ color: item.unpaidAmount === 0 ? '#10b981' : '#f59e0b', fontSize: '0.72rem' }}>{item.status}</div>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteSale(item)}
                        title="Hapus Penjualan"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          borderRadius: '6px',
                          padding: '5px 8px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
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

      {/* ========================================================================= */}
      {/* 12. SUB-MODUL: HUTANG (ACCOUNTS PAYABLE - AP)                              */}
      {/* ========================================================================= */}
      {activeSubModule === 'hutang' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Buku Hutang Usaha (Accounts Payable / AP)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Kewajiban tagihan kepada rekanan vendor material, mandor kontraktor, dan tanggal jatuh tempo.
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '12px 14px' }}>Vendor / Rekanan</th>
                  <th style={{ padding: '12px 14px' }}>Kategori & No Tagihan</th>
                  <th style={{ padding: '12px 14px' }}>Proyek</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Total Tagihan</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Sisa Hutang</th>
                  <th style={{ padding: '12px 14px' }}>Jatuh Tempo</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayables.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      Tidak ada data hutang usaha untuk filter ({filterProject} • {filterDateMode}).
                    </td>
                  </tr>
                ) : filteredPayables.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#ffffff' }}>
                      {item.vendor}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ color: '#cbd5e1' }}>{item.category}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.billNo}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#f87171' }}>{item.project}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#ffffff', fontWeight: 700 }}>
                      Rp {Number(item.totalBill).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#f87171', fontWeight: 900 }}>
                      Rp {Number(item.remainingAmount).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#f59e0b', fontWeight: 700 }}>
                      {item.dueDate}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setNewReqForm({
                              title: `Pelunasan Hutang: ${item.vendor} (${item.category})`,
                              originModule: 'procurement',
                              originModuleName: 'Procurement & Logistik',
                              requester: 'Finance Hutang Staff',
                              project: item.project,
                              category: 'Pembayaran Hutang Vendor',
                              amount: item.remainingAmount,
                              dueDate: item.dueDate,
                              priority: 'Mendesak',
                              accountCode: '2-101',
                              notes: `Pelunasan faktur tagihan ${item.billNo}`
                            });
                            setIsNewRequestModalOpen(true);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                            border: '1px solid #ef4444',
                            color: '#ffffff',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Ajukan Bayar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePayable(item)}
                          title="Hapus Hutang"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '6px',
                            padding: '5px 8px',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
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

      {/* ========================================================================= */}
      {/* 13. SUB-MODUL: TRANSAKSI JURNAL (MANUAL JV FORM)                           */}
      {/* ========================================================================= */}
      {activeSubModule === 'transaksi_jurnal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Transaksi Jurnal (Journal Voucher Entry)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Formulir cepat pembuatan ayat jurnal umum manual, penyesuaian penyusutan aset, dan koreksi pembukuan.
            </p>
          </div>

          <div className="glass-card" style={{ background: '#090d16', border: '1.5px solid #7f0000', borderRadius: '12px', padding: '1.5rem', maxWidth: '720px' }}>
            <form onSubmit={handleCreateJv} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    required
                    value={newJvForm.date}
                    onChange={(e) => setNewJvForm({ ...newJvForm, date: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Proyek Terkait
                  </label>
                  <input
                    type="text"
                    required
                    value={newJvForm.project}
                    onChange={(e) => setNewJvForm({ ...newJvForm, project: e.target.value })}
                    placeholder="Ashoka View / Bizhub / HO"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Keterangan Transaksi / Narasi Jurnal
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beban penyusutan inventaris laptop kantor bulan berjalan..."
                  value={newJvForm.description}
                  onChange={(e) => setNewJvForm({ ...newJvForm, description: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                    Akun Debit (+)
                  </label>
                  <select
                    value={newJvForm.debitAccountCode}
                    onChange={(e) => setNewJvForm({ ...newJvForm, debitAccountCode: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #10b981', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  >
                    {coa.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                    Akun Kredit (-)
                  </label>
                  <select
                    value={newJvForm.creditAccountCode}
                    onChange={(e) => setNewJvForm({ ...newJvForm, creditAccountCode: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #ef4444', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  >
                    {coa.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Nominal Transaksi (Rp)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 5000000"
                  value={newJvForm.amount}
                  onChange={(e) => setNewJvForm({ ...newJvForm, amount: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.95rem', fontWeight: 800 }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                  border: '1px solid #ef4444',
                  color: '#ffffff',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)'
                }}
              >
                Posting ke Buku Jurnal Umum Sekarang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 15. SUB-MODUL: PAJAK (TAX MANAGEMENT PROPERTI)                             */}
      {/* ========================================================================= */}
      {activeSubModule === 'pajak' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Manajemen Perpajakan Properti (Tax Management)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Kewajiban PPh Final 2.5% Penjualan Rumah, PPN 11% Komersil, dan PPh 21 Karyawan.
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '12px 14px' }}>Jenis Pajak</th>
                  <th style={{ padding: '12px 14px' }}>Objek Pajak</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Dasar Pengenaan (DPP)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Tarif</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Pajak Terutang (Rp)</th>
                  <th style={{ padding: '12px 14px' }}>Masa Pajak & Jatuh Tempo</th>
                  <th style={{ padding: '12px 14px' }}>Status & NTPN</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTaxes.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      Tidak ada data kewajiban pajak untuk filter ({filterProject} • {filterDateMode}).
                    </td>
                  </tr>
                ) : filteredTaxes.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#f87171' }}>{item.taxType}</td>
                    <td style={{ padding: '12px 14px', color: '#ffffff' }}>
                      <div>{item.taxObject}</div>
                      {item.project && <div style={{ fontSize: '0.7rem', color: '#f87171' }}>{item.project}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#cbd5e1' }}>
                      Rp {Number(item.taxBase).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: '#38bdf8', fontWeight: 800 }}>
                      {item.rate}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#f87171' }}>
                      Rp {Number(item.taxAmount).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ color: '#ffffff' }}>{item.period}</div>
                      <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>Jatuh Tempo: {item.dueDate}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: item.status === 'Disetor & Lapor' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: item.status === 'Disetor & Lapor' ? '#34d399' : '#facc15' }}>
                        {item.status}
                      </span>
                      {item.ntpn && <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{item.ntpn}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteTax(item)}
                        title="Hapus Pajak"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          borderRadius: '6px',
                          padding: '5px 8px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
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

      {/* ========================================================================= */}
      {/* 2. SUB-MODUL: JOBLIST (AGENDA & TUGAS TIM FINANCE)                         */}
      {/* ========================================================================= */}
      {activeSubModule === 'joblist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Joblist & Agenda Tim Keuangan
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Daftar penugasan closing bulanan, audit rekonsiliasi kas, dan batas waktu pelaporan pajak.
            </p>
          </div>

          {joblist.length === 0 ? (
            <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
              Tidak ada agenda tugas tim keuangan saat ini.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {joblist.map((job) => (
                <div
                  key={job.id}
                  className="glass-card"
                  style={{
                    background: '#090d16',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f87171' }}>{job.id}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: job.status === 'In Progress' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: job.status === 'In Progress' ? '#60a5fa' : '#facc15' }}>
                      {job.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {job.task}
                  </h4>
                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                    PIC: <strong style={{ color: '#38bdf8' }}>{job.assignee}</strong>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    {job.notes}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.72rem', color: '#f59e0b' }}>
                    <span>Jatuh Tempo: {job.dueDate}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#ef4444', fontWeight: 800 }}>Prioritas {job.priority}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteJoblist(job)}
                        title="Hapus Agenda Tugas"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. SUB-MODUL: JOB ACTIVITY (AUDIT TRAIL LOG)                              */}
      {/* ========================================================================= */}
      {activeSubModule === 'job_ativity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Job Activity (Audit Trail & Log Keuangan)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Catatan riwayat rekam jejak setiap aksi finansial, otorisasi dana, dan pembukuan jurnal untuk integritas data.
            </p>
          </div>

          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '12px 14px' }}>Waktu & Tanggal</th>
                  <th style={{ padding: '12px 14px' }}>Staf / User Pelaksana</th>
                  <th style={{ padding: '12px 14px' }}>Jenis Tindakan</th>
                  <th style={{ padding: '12px 14px' }}>Rincian Detail Transaksi</th>
                  <th style={{ padding: '12px 14px' }}>Modul Terkait</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '12px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#ffffff' }}>{log.user}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#38bdf8' }}>{log.action}</td>
                    <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{log.details}</td>
                    <td style={{ padding: '12px 14px', color: '#f87171' }}>{log.module}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 16. SUB-MODUL: PURCHASE ORDER (PO FINANCE VALIDATION)                      */}
      {/* ========================================================================= */}
      {activeSubModule === 'purchase_order' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Purchase Order (PO Finance Verification)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Validasi kesesuaian anggaran untuk pesanan pembelian bahan bangunan dari divisi Pengadaan sebelum diterbitkan pembayaran.
            </p>
          </div>

          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 800, color: '#ffffff' }}>PO Pembelian Terverifikasi Anggaran</span>
              <button
                type="button"
                onClick={() => handleSelectSubModule('pengajuan_dana')}
                style={{
                  background: '#7f0000',
                  color: '#ffffff',
                  border: '1px solid #ef4444',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Lihat Pengajuan Pembayaran PO
              </button>
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.6 }}>
              Setiap Purchase Order material bernilai di atas Rp 10.000.000 yang diterbitkan dari modul Procurement akan secara otomatis meminta verifikasi anggaran kas ke Finance & Acc, dan diteruskan menjadi Pengajuan Dana untuk pencairan terjadwal.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SUB-MODUL: LAPORAN (FINANCIAL EXECUTIVE SUMMARY)                        */}
      {/* ========================================================================= */}
      {activeSubModule === 'laporan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Pusat Laporan Keuangan Eksekutif (Financial Reports Center)
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Konsolidasi laporan arus kas, neraca, laba rugi, dan performa keuangan per proyek perumahan.
              </p>
            </div>
          </div>

          {/* Dual Visual: Tren Finansial Eksekutif & Donut Chart Alokasi Laba Rugi */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
            <FinanceLineChart
              title="Tren Pendapatan (Omzet) & Laba Bersih Perusahaan"
              subtitle={`Kinerja profitabilitas konsolidasi tahun berjalan (${filterProject === 'ALL' ? 'Semua Proyek' : filterProject})`}
              data={[
                { label: 'Jan', Pendapatan: 380000000, LabaBersih: 110000000 },
                { label: 'Feb', Pendapatan: 410000000, LabaBersih: 120000000 },
                { label: 'Mar', Pendapatan: 440000000, LabaBersih: 130000000 },
                { label: 'Apr', Pendapatan: 460000000, LabaBersih: 135000000 },
                { label: 'Mei', Pendapatan: 480000000, LabaBersih: 140000000 },
                { label: 'Jun', Pendapatan: 590000000, LabaBersih: 185000000 },
                { label: 'Jul', Pendapatan: 670000000, LabaBersih: 220000000 },
                { label: 'Agt', Pendapatan: 790000000, LabaBersih: 280000000 },
                { label: 'Sep', Pendapatan: 890000000, LabaBersih: 335000000 },
                { label: 'Okt', Pendapatan: financialTotals.pendapatan || 980000000, LabaBersih: financialTotals.labaBersih || 390000000 }
              ]}
              series={[
                { key: 'Pendapatan', label: 'Pendapatan (Revenue)', color: '#38bdf8' },
                { key: 'LabaBersih', label: 'Laba Bersih (Net Profit)', color: '#10b981' }
              ]}
              badgeText="Executive Financial Performance"
              height={180}
              projectFilter={filterProject}
              onProjectChange={setFilterProject}
            />

            <FinanceDonutChart
              title="Struktur Biaya vs Profitabilitas"
              subtitle={`Komposisi HPP, beban operasional, pajak & net profit (${filterProject === 'ALL' ? 'Semua Proyek' : filterProject})`}
              data={pnlDonutData}
              badgeText="Cost & Margin Breakdown"
              height={180}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            
            <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 800 }}>
                <Scale size={20} /> Laporan Posisi Keuangan (Neraca)
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                Total Aset Perusahaan: Rp {financialTotals.totalAset.toLocaleString('id-ID')}
              </p>
              <button
                type="button"
                onClick={() => handleSelectSubModule('neraca')}
                style={{ background: '#0f172a', border: '1px solid #ef4444', color: '#ffffff', padding: '8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Buka Neraca →
              </button>
            </div>

            <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 800 }}>
                <TrendingUp size={20} /> Laporan Laba Rugi (P&L)
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                Laba Bersih Berjalan: Rp {financialTotals.labaBersih.toLocaleString('id-ID')}
              </p>
              <button
                type="button"
                onClick={() => handleSelectSubModule('laba_rugi')}
                style={{ background: '#0f172a', border: '1px solid #10b981', color: '#ffffff', padding: '8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Buka Laba Rugi →
              </button>
            </div>

            <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 800 }}>
                <DollarSign size={20} /> Hub Pengajuan Dana Lintas Modul
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                {fundStats.totalCount} Tiket Masuk • Siap Dicairkan: {fundStats.approvedCount} Tiket
              </p>
              <button
                type="button"
                onClick={() => handleSelectSubModule('pengajuan_dana')}
                style={{ background: '#7f0000', border: '1px solid #ef4444', color: '#ffffff', padding: '8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Buka Pengajuan Dana →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CAIRKAN DANA (DISBURSEMENT MODAL)                                 */}
      {/* ========================================================================= */}
      {isDisburseModalOpen && selectedReqForDisburse && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              background: '#090d16',
              border: '2px solid #ef4444',
              borderRadius: '14px',
              maxWidth: '560px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1.5px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={20} color="#ef4444" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Konfirmasi Pencairan Dana & Bukti TF
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDisburseModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px', border: '1px solid #1e293b', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 800 }}>
                {selectedReqForDisburse.id} • {selectedReqForDisburse.originModuleName}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                {selectedReqForDisburse.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                Pemohon: {selectedReqForDisburse.requester} • Proyek: {selectedReqForDisburse.project}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8', marginTop: '10px' }}>
                Rp {Number(selectedReqForDisburse.amount).toLocaleString('id-ID')}
              </div>
            </div>

            <form onSubmit={handleExecuteDisburse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Pilih Rekening Kas / Bank Sumber Pencairan:
                </label>
                <select
                  value={disburseSelectedBankId}
                  onChange={(e) => setDisburseSelectedBankId(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1.5px solid #ef4444',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 800
                  }}
                >
                  {banks.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.balance < selectedReqForDisburse.amount}>
                      {b.name} (Saldo: Rp {b.balance.toLocaleString('id-ID')}) {b.balance < selectedReqForDisburse.amount ? '- [SALDO KURANG]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* No Bukti / Ref & Catatan Transfer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nomor Referensi Transfer / BKK:
                  </label>
                  <input
                    type="text"
                    required
                    value={disburseTransferRef}
                    onChange={(e) => setDisburseTransferRef(e.target.value)}
                    placeholder="Contoh: BKK/BCA/20261002/101"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Metode / Catatan Transfer:
                  </label>
                  <input
                    type="text"
                    value={disburseTransferNotes}
                    onChange={(e) => setDisburseTransferNotes(e.target.value)}
                    placeholder="Contoh: Transfer Real-time BCA"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Upload Bukti TF */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Lampirkan Bukti TF (Struk Transfer / Screenshot / Slip Bank):
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#1e293b',
                      border: '1.5px dashed #38bdf8',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      color: '#38bdf8',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <UploadCloud size={16} />
                    <span>Unggah Struk Bukti TF</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setDisburseTransferProof({
                            name: file.name,
                            url: ev.target.result
                          });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {disburseTransferProof.name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '6px 10px', borderRadius: '6px', color: '#34d399', fontSize: '0.74rem' }}>
                      <FileCheck size={14} />
                      <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{disburseTransferProof.name}</span>
                      <button
                        type="button"
                        onClick={() => setDisburseTransferProof({ url: null, name: '' })}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
                {disburseTransferProof.url && disburseTransferProof.url.startsWith('data:image') && (
                  <div style={{ marginTop: '8px', maxWidth: '160px', maxHeight: '100px', overflow: 'hidden', borderRadius: '6px', border: '1px solid #334155' }}>
                    <img src={disburseTransferProof.url} alt="Preview Bukti TF" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.74rem', color: '#94a3b8', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                 <strong>Otomatisasi Sistem:</strong> Saldo rekening bank akan langsung terpotong, status berubah "Dicairkan", bukti TF tersimpan, dan voucher jurnal umum terposting otomatis!
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsDisburseModalOpen(false)}
                  style={{
                    background: '#1e293b',
                    color: '#cbd5e1',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 16px',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                    border: '1px solid #ef4444',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '9px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)'
                  }}
                >
                  Konfirmasi & Cairkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUAT PENGAJUAN DANA MANUAL                                        */}
      {/* ========================================================================= */}
      {isNewRequestModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              background: '#090d16',
              border: '2px solid #ef4444',
              borderRadius: '14px',
              maxWidth: '600px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1.5px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={20} color="#ef4444" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Buat Pengajuan Dana Manual
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRequestModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Judul Keperluan Pengajuan Dana *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Biaya Cetak Brosur & Spanduk Promo Ashoka..."
                  value={newReqForm.title}
                  onChange={(e) => setNewReqForm({ ...newReqForm, title: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Departemen / Asal Modul
                  </label>
                  <select
                    value={newReqForm.originModule}
                    onChange={(e) => {
                      const modNameMap = {
                        marketing: 'Marketing & Sales',
                        teknik: 'Teknik & Konstruksi',
                        'hr-ga': 'HR & General Affair',
                        legal: 'Legal & Perizinan',
                        procurement: 'Procurement & Logistik',
                        finance: 'Finance & Acc'
                      };
                      setNewReqForm({
                        ...newReqForm,
                        originModule: e.target.value,
                        originModuleName: modNameMap[e.target.value] || 'Operasional'
                      });
                    }}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  >
                    <option value="marketing">Marketing & Sales</option>
                    <option value="teknik">Teknik & Konstruksi</option>
                    <option value="hr-ga">HR & General Affair</option>
                    <option value="legal">Legal & Perizinan</option>
                    <option value="procurement">Procurement & Logistik</option>
                    <option value="finance">Finance & Acc</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nama Pemohon
                  </label>
                  <input
                    type="text"
                    required
                    value={newReqForm.requester}
                    onChange={(e) => setNewReqForm({ ...newReqForm, requester: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Proyek Terkait
                  </label>
                  <input
                    type="text"
                    required
                    value={newReqForm.project}
                    onChange={(e) => setNewReqForm({ ...newReqForm, project: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nominal Yang Diajukan (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 15000000"
                    value={newReqForm.amount}
                    onChange={(e) => setNewReqForm({ ...newReqForm, amount: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #ef4444', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.95rem', fontWeight: 800 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tingkat Prioritas
                  </label>
                  <select
                    value={newReqForm.priority}
                    onChange={(e) => setNewReqForm({ ...newReqForm, priority: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Mendesak">Mendesak</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Alokasi Akun Beban (COA)
                  </label>
                  <select
                    value={newReqForm.accountCode}
                    onChange={(e) => setNewReqForm({ ...newReqForm, accountCode: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  >
                    {coa.filter(c => c.category.includes('Beban') || c.category.includes('Kewajiban')).map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Catatan / Keterangan Tambahan
                </label>
                <textarea
                  rows="3"
                  placeholder="Deskripsi detail kebutuhan dana..."
                  value={newReqForm.notes}
                  onChange={(e) => setNewReqForm({ ...newReqForm, notes: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  style={{ background: '#1e293b', color: '#cbd5e1', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                    border: '1px solid #ef4444',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '9px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)'
                  }}
                >
                  Kirim Pengajuan ke Finance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DETAIL PENGAJUAN DANA                                             */}
      {/* ========================================================================= */}
      {isDetailModalOpen && selectedDetailItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              background: '#090d16',
              border: '1.5px solid #1e293b',
              borderRadius: '14px',
              maxWidth: '580px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1.5px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Rincian Tiket Pengajuan {selectedDetailItem.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Judul Pengajuan:</span>
                <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', marginTop: '2px' }}>
                  {selectedDetailItem.title}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Departemen Asal:</span>
                  <div style={{ fontWeight: 800, color: '#38bdf8' }}>{selectedDetailItem.originModuleName}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Pemohon:</span>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{selectedDetailItem.requester}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Proyek Terkait:</span>
                  <div style={{ fontWeight: 700, color: '#f87171' }}>{selectedDetailItem.project}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Nominal:</span>
                  <div style={{ fontWeight: 900, color: '#34d399', fontSize: '1.1rem' }}>
                    Rp {Number(selectedDetailItem.amount).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Catatan / Justifikasi:</span>
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px', color: '#cbd5e1', marginTop: '4px', border: '1px solid #1e293b' }}>
                  {selectedDetailItem.notes || 'Tidak ada catatan tambahan.'}
                </div>
              </div>

              {selectedDetailItem.attachments && selectedDetailItem.attachments.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Paperclip size={14} /> Dokumen Lampiran Pendukung ({selectedDetailItem.attachments.length}):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                    {selectedDetailItem.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.dataUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        download={att.name || `lampiran_${idx + 1}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.74rem',
                          color: '#e2e8f0',
                          textDecoration: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={13} color="#38bdf8" />
                        <span>{att.name}</span>
                        {att.size && <span style={{ color: '#64748b', fontSize: '0.68rem' }}>({att.size})</span>}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedDetailItem.disbursedBankName && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '10px', borderRadius: '8px', marginTop: '6px' }}>
                  <div style={{ color: '#34d399', fontWeight: 800 }}>Telah Dicairkan:</div>
                  <div style={{ color: '#ffffff', fontSize: '0.8rem', marginTop: '2px' }}>
                    via {selectedDetailItem.disbursedBankName} • Ref: {selectedDetailItem.disbursedRef} • Tanggal: {selectedDetailItem.disbursedAt}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
              {selectedDetailItem.status === 'Dicairkan' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProofItem(selectedDetailItem);
                    setIsProofModalOpen(true);
                  }}
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1.5px solid #10b981',
                    color: '#34d399',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Receipt size={16} /> Buka Bukti Transfer & Struk Resmi
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                style={{ background: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', cursor: 'pointer', marginLeft: selectedDetailItem.status === 'Dicairkan' ? 'auto' : '0' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TAMBAH AKUN COA BARU                                              */}
      {/* ========================================================================= */}
      {isNewAccountModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              background: '#090d16',
              border: '2px solid #ef4444',
              borderRadius: '14px',
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1.5px solid #1e293b', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Tambah Akun Baru ke COA
              </h3>
              <button
                type="button"
                onClick={() => setIsNewAccountModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Kode Akun (Contoh: 5-202)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 5-202"
                  value={newAccountForm.code}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, code: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Akun</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beban Pemeliharaan Website & Aplikasi"
                  value={newAccountForm.name}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, name: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Kategori</label>
                  <select
                    value={newAccountForm.category}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, category: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  >
                    <option value="Aset Lancar">Aset Lancar</option>
                    <option value="Aset Tetap">Aset Tetap</option>
                    <option value="Kewajiban Lancar">Kewajiban Lancar</option>
                    <option value="Kewajiban Jangka Panjang">Kewajiban Jangka Panjang</option>
                    <option value="Ekuitas">Ekuitas</option>
                    <option value="Pendapatan">Pendapatan</option>
                    <option value="Beban Pokok">Beban Pokok</option>
                    <option value="Beban Operasional">Beban Operasional</option>
                    <option value="Beban Pajak">Beban Pajak</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Posisi Normal</label>
                  <select
                    value={newAccountForm.normalBalance}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, normalBalance: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  >
                    <option value="Debit">Debit</option>
                    <option value="Kredit">Kredit</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Saldo Awal (Rp)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newAccountForm.balance}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, balance: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewAccountModalOpen(false)}
                  style={{ background: '#1e293b', color: '#cbd5e1', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)', border: '1px solid #ef4444', color: '#ffffff', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: BUKTI TRANSFER & STRUK DIGITAL RESMI                              */}
      {/* ========================================================================= */}
      <TransferProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        item={selectedProofItem}
      />

    </div>
  );
};
