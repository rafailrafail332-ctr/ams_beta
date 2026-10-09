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
  Paperclip,
  CornerDownRight
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
  updateFundRequestMaterialRows,
  getBanks,
  saveBanks,
  getCoa,
  saveCoa,
  deleteCoaAccount,
  calculateCoaBalances,
  sortCoaTree,
  generateNextAccountCode,
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
  sortJoblistTree,
  generateNextJobCode,
  getAuditLogs,
  addAuditLog,
  syncFundRequestsFromCloud,
  STORAGE_KEYS
} from '../services/financeService';

export const FINANCE_SUBMODULES = [
  // KELOMPOK 1: MODUL UTAMA (6 MENU)
  { id: 'account_list', label: 'Chart of Accounts', group: 'utama', icon: BookOpen },
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
  const [filterCategoryType, setFilterCategoryType] = useState('ALL'); // 'ALL' | 'MATERIAL' | 'OPERASIONAL'
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
    notes: '',
    targetBank: 'BCA',
    targetAccountNumber: '',
    targetAccountHolder: ''
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

  // State Filter & Pencarian Khusus Account List (COA)
  const [coaSearch, setCoaSearch] = useState('');
  const [coaFilterKriteria, setCoaFilterKriteria] = useState('ALL'); // 'ALL' | 'Header' | 'Detail'
  const [coaFilterGroup, setCoaFilterGroup] = useState('ALL'); // 'ALL' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'

  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({
    code: '',
    name: '',
    parentCode: '',
    level: 4,
    kriteria: 'Detail',
    posisi: 'Debet',
    category: 'Aktiva',
    balance: '',
    description: ''
  });

  // State Filter & Form Khusus Joblist (Struktur 2-Level: Proyek & Sub-Pekerjaan)
  const [joblistSearch, setJoblistSearch] = useState('');
  const [joblistFilterProject, setJoblistFilterProject] = useState('ALL');
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    code: '',
    name: '',
    parentCode: '',
    level: 1, // 1: Proyek (Header), 2: Sub-Pekerjaan (Detail)
    type: 'Header', // 'Header' | 'Detail'
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

  // Real-time Multi-Device & Cloud Sync dengan Hosting Sengked MySQL Database
  useEffect(() => {
    // 1. Initial Cloud Sync from MySQL
    syncFundRequestsFromCloud().then(res => {
      if (res && Array.isArray(res) && res.length > 0) {
        setFundRequests(res);
      }
    });

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

    const handleStorageEvent = (e) => {
      if (!e.key || e.key === STORAGE_KEYS.FUND_REQUESTS) {
        handleDataChanged();
      }
    };

    window.addEventListener('ams-finance-data-changed', handleDataChanged);
    window.addEventListener('storage', handleStorageEvent);

    // 2. 5-second polling interval for real-time consistency across all laptops in office
    const interval = setInterval(() => {
      syncFundRequestsFromCloud().then(res => {
        if (res && Array.isArray(res) && res.length > 0) {
          setFundRequests(res);
        }
      });
    }, 5000);

    return () => {
      window.removeEventListener('ams-finance-data-changed', handleDataChanged);
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(interval);
    };
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

  // State untuk Checklist & Verifikasi Approval Per Baris Material SPbM
  const [materialReviewRows, setMaterialReviewRows] = useState([]);

  useEffect(() => {
    if (selectedDetailItem && Array.isArray(selectedDetailItem.materialRows)) {
      setMaterialReviewRows(JSON.parse(JSON.stringify(selectedDetailItem.materialRows)));
    } else {
      setMaterialReviewRows([]);
    }
  }, [selectedDetailItem]);

  const handleToggleMaterialRowStatus = (rowId, newStatus) => {
    setMaterialReviewRows(prev => prev.map(r => {
      if (r.id === rowId) {
        return {
          ...r,
          status: newStatus,
          isApproved: newStatus === 'Disetujui'
        };
      }
      return r;
    }));
  };

  const handleUpdateMaterialRowPrice = (rowId, priceVal) => {
    const p = Math.max(0, Number(priceVal) || 0);
    setMaterialReviewRows(prev => prev.map(r => {
      if (r.id === rowId) {
        const q = Number(r.qty) || 0;
        return {
          ...r,
          hargaSatuan: p,
          subtotal: p * q
        };
      }
      return r;
    }));
  };

  const handleSaveMaterialReview = (andDisburse = false) => {
    if (!selectedDetailItem) return;
    try {
      const res = updateFundRequestMaterialRows(
        selectedDetailItem.id,
        materialReviewRows,
        'Yazid Hizbullah, S.E.,S.T (Finance Director)'
      );
      const updatedList = getFundRequests();
      setFundRequests(updatedList);
      const updatedSelected = updatedList.find(x => x.id === selectedDetailItem.id);
      setSelectedDetailItem(updatedSelected);

      showNotification(`Verifikasi item material berhasil disimpan! Disetujui total: Rp ${res.approvedAmount.toLocaleString('id-ID')}`, 'success');

      if (andDisburse) {
        if (res.approvedAmount <= 0) {
          alert('Belum ada nominal yang disetujui untuk dicairkan (Rp 0). Pastikan minimal 1 baris material disetujui dan memiliki harga satuan/subtotal.');
          return;
        }
        setIsDetailModalOpen(false);
        handleOpenDisburseModal(updatedSelected);
      }
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
      const nominalCair = result.disburseAmount ? result.disburseAmount : (selectedReqForDisburse.approvedAmount > 0 ? selectedReqForDisburse.approvedAmount : selectedReqForDisburse.amount);
      showNotification(`DANA SEBESAR Rp ${nominalCair.toLocaleString('id-ID')} BERHASIL DICAIRKAN! (Ref: ${result.refDisburseNo}). Saldo bank & Jurnal Umum telah terupdate otomatis.`);
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
    if (item.level === 1 || !item.parentCode) {
      alert(`Akun "${item.name}" (${item.code}) merupakan Kelompok Utama Puncak dan tidak dapat dihapus.`);
      return;
    }
    const hasChildren = coa.some(c => c.parentCode === item.code);
    if (hasChildren) {
      alert(`Akun ${item.code} - "${item.name}" memiliki sub-anak akun di bawahnya! Harap hapus atau pindahkan sub-anak akun terlebih dahulu sebelum menghapus akun induk ini.`);
      return;
    }
    if (window.confirm(`Hapus akun Bagan Akun (COA) ${item.code} - "${item.name}"?\nPastikan akun tidak lagi memiliki mutasi aktif.`)) {
      deleteCoaAccount(item.code, 'Yazid Hizbullah, S.E.,S.T');
      setCoa(getCoa());
      setAuditLogs(getAuditLogs());
      showNotification(`Akun ${item.code} berhasil dihapus.`);
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

  // ===========================================================================
  // HANDLERS FOR JOBLIST (PROJECT & SUB-JOB 2-LEVEL COST CENTER)
  // ===========================================================================
  const handleOpenAddJobProject = () => {
    setNewJobForm({
      code: '',
      name: '',
      parentCode: '',
      level: 1,
      type: 'Header',
      description: ''
    });
    setIsNewJobModalOpen(true);
  };

  const handleOpenAddSubJob = (parentProject) => {
    const suggestedCode = parentProject ? generateNextJobCode(parentProject, joblist) : '';
    setNewJobForm({
      code: suggestedCode,
      name: '',
      parentCode: parentProject ? parentProject.code : '',
      level: 2,
      type: 'Detail',
      description: ''
    });
    setIsNewJobModalOpen(true);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (!newJobForm.code || !newJobForm.name) {
      alert('Mohon lengkapi kode dan nama pekerjaan/proyek!');
      return;
    }

    const cleanCode = newJobForm.code.trim().toUpperCase();
    if (joblist.some(j => j.code.toUpperCase() === cleanCode)) {
      alert(`Kode pekerjaan ${cleanCode} sudah ada di Joblist! Silakan gunakan kode lain.`);
      return;
    }

    const parent = joblist.find(j => j.code === newJobForm.parentCode);
    const calculatedLevel = parent ? 2 : (newJobForm.level || 1);
    const calculatedType = calculatedLevel === 1 ? 'Header' : 'Detail';

    const newJob = {
      code: cleanCode,
      name: newJobForm.name.trim(),
      parentCode: parent ? parent.code : null,
      level: calculatedLevel,
      type: calculatedType,
      description: newJobForm.description ? newJobForm.description.trim() : ''
    };

    const updated = sortJoblistTree([...joblist, newJob]);
    saveJoblist(updated);
    setJoblist(updated);
    setIsNewJobModalOpen(false);
    setNewJobForm({
      code: '',
      name: '',
      parentCode: '',
      level: 1,
      type: 'Header',
      description: ''
    });
    showNotification(`Pekerjaan ${newJob.code} - ${newJob.name} (${newJob.type}) berhasil disimpan ke Joblist!`);
  };

  const handleDeleteJob = (item) => {
    const isParent = item.level === 1;
    const childCount = joblist.filter(j => j.parentCode === item.code).length;

    const confirmMsg = isParent && childCount > 0
      ? `Hapus Proyek "${item.code} - ${item.name}" beserta ${childCount} sub-pekerjaan di dalamnya?`
      : `Hapus pekerjaan "${item.code} - ${item.name}" dari Joblist?`;

    if (window.confirm(confirmMsg)) {
      deleteJoblistItem(item.code, 'Yazid Hizbullah, S.E.,S.T');
      setJoblist(getJoblist());
      setAuditLogs(getAuditLogs());
      showNotification(`Pekerjaan ${item.code} berhasil dihapus dari Joblist.`);
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
        notes: '',
        targetBank: 'BCA',
        targetAccountNumber: '',
        targetAccountHolder: ''
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
  const handleOpenAddSubAccount = (parentAcc) => {
    const suggestedCode = parentAcc ? generateNextAccountCode(parentAcc, coa) : '';

    setNewAccountForm({
      code: suggestedCode,
      name: '',
      parentCode: parentAcc ? parentAcc.code : '',
      level: parentAcc ? (parentAcc.level || 1) + 1 : 1,
      kriteria: 'Detail',
      posisi: parentAcc ? (parentAcc.posisi || 'Debet') : 'Debet',
      category: parentAcc ? (parentAcc.category || 'Aktiva') : 'Aktiva',
      balance: '',
      description: ''
    });
    setIsNewAccountModalOpen(true);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newAccountForm.code || !newAccountForm.name) {
      alert('Mohon lengkapi kode dan nama akun!');
      return;
    }

    const cleanCode = newAccountForm.code.trim();
    if (coa.some(c => c.code.toLowerCase() === cleanCode.toLowerCase())) {
      alert(`Kode akun ${cleanCode} sudah ada di Bagan Akun! Silakan gunakan kode lain.`);
      return;
    }

    const parent = coa.find(c => c.code === newAccountForm.parentCode);
    const calculatedLevel = parent ? (parent.level || 1) + 1 : (newAccountForm.level || 1);

    const newAcc = {
      code: cleanCode,
      name: newAccountForm.name.trim(),
      parentCode: newAccountForm.parentCode || null,
      level: calculatedLevel,
      kriteria: newAccountForm.kriteria || 'Detail',
      posisi: newAccountForm.posisi || (parent ? (parent.posisi || 'Debet') : 'Debet'),
      category: parent ? (parent.category || 'Aktiva') : (newAccountForm.category || 'Aktiva'),
      balance: newAccountForm.kriteria === 'Header' ? 0 : (Number(newAccountForm.balance) || 0),
      description: newAccountForm.description || ''
    };

    const updated = sortCoaTree(calculateCoaBalances([...coa, newAcc]));
    saveCoa(updated);
    setCoa(updated);
    setIsNewAccountModalOpen(false);
    setNewAccountForm({
      code: '',
      name: '',
      parentCode: '',
      level: 4,
      kriteria: 'Detail',
      posisi: 'Debet',
      category: 'Aktiva',
      balance: '',
      description: ''
    });
    showNotification(`Akun ${newAcc.code} - ${newAcc.name} (${newAcc.kriteria}) berhasil ditambahkan ke Bagan Akun!`);
  };

  // ===========================================================================
  // FILTERED DATASETS & METRICS (PROYEK & PERIODE FILTER)
  // ===========================================================================
  const filteredCoa = useMemo(() => {
    const treeOrdered = sortCoaTree(coa);
    return treeOrdered.filter(item => {
      if (!item) return false;
      if (coaSearch.trim()) {
        const q = coaSearch.toLowerCase().trim();
        const match = item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || (item.category && item.category.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (coaFilterKriteria !== 'ALL') {
        if (item.kriteria !== coaFilterKriteria) return false;
      }
      if (coaFilterGroup !== 'ALL') {
        if (!item.code.startsWith(coaFilterGroup + '-')) return false;
      }
      return true;
    });
  }, [coa, coaSearch, coaFilterKriteria, coaFilterGroup]);

  const filteredJoblist = useMemo(() => {
    const treeOrdered = sortJoblistTree(joblist);
    return treeOrdered.filter(item => {
      if (!item) return false;
      if (joblistSearch.trim()) {
        const q = joblistSearch.toLowerCase().trim();
        const match =
          (item.code || '').toLowerCase().includes(q) ||
          (item.name || '').toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (joblistFilterProject !== 'ALL') {
        if (item.code !== joblistFilterProject && item.parentCode !== joblistFilterProject) return false;
      }
      return true;
    });
  }, [joblist, joblistSearch, joblistFilterProject]);

  const filteredFundRequests = useMemo(() => {
    return fundRequests.filter(item => {
      if (!item) return false;

      const q = (searchTerm || '').toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.id || '').toLowerCase().includes(q) ||
        (item.requester || '').toLowerCase().includes(q) ||
        (item.project || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.spbmNo || '').toLowerCase().includes(q);

      const matchModule = filterModuleOrigin === 'ALL' || item.originModule === filterModuleOrigin;
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;

      // Filter Kategori Khusus (Material vs Operasional Lain)
      let matchCatType = true;
      const isMaterial = (item.category || '').toLowerCase().includes('material') || (item.materialRows && item.materialRows.length > 0) || Boolean(item.spbmNo);
      if (filterCategoryType === 'MATERIAL') {
        matchCatType = isMaterial;
      } else if (filterCategoryType === 'OPERASIONAL') {
        matchCatType = !isMaterial;
      }

      // Filter Proyek
      const matchProject =
        filterProject === 'ALL' ||
        ((item.project || '').toLowerCase().includes(filterProject.toLowerCase()));

      // Filter Periode Waktu
      let matchDate = true;
      const itemDate = item.requestDate || item.disbursedAt || '';
      if (filterDateMode === 'MONTHLY' && filterMonth) {
        matchDate = itemDate.startsWith(filterMonth);
      } else if (filterDateMode === 'DAILY' && filterDay) {
        matchDate = itemDate === filterDay;
      }

      return matchSearch && matchModule && matchStatus && matchCatType && matchProject && matchDate;
    });
  }, [fundRequests, searchTerm, filterModuleOrigin, filterStatus, filterCategoryType, filterProject, filterDateMode, filterMonth, filterDay]);

  // Tiket Pengajuan Material yang Menunggu Review dari Finance
  const pendingMaterialTickets = useMemo(() => {
    return fundRequests.filter(r => 
      r.status === 'Menunggu Review' && 
      ((r.category || '').toLowerCase().includes('material') || (r.materialRows && r.materialRows.length > 0) || Boolean(r.spbmNo))
    );
  }, [fundRequests]);

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
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🔍 MASTER TOOLBAR FILTER: FILTER PROYEK & WAKTU (BULANAN / HARIAN)         */}
      {/* ========================================================================= */}
      {activeSubModule !== 'account_list' && activeSubModule !== 'joblist' && (
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
      )}

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

          {/* Banner Notifikasi Khusus Pengajuan Material Baru dari Teknik */}
          {pendingMaterialTickets.length > 0 && (
            <div
              className="glass-card"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(37, 99, 235, 0.25) 100%)',
                border: '1.5px solid #3b82f6',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '1.25rem'
                }}>
                  📦
                </div>
                <div>
                  <div style={{ fontWeight: 900, color: '#ffffff', fontSize: '0.94rem' }}>
                    Terdapat {pendingMaterialTickets.length} Berkas Pengajuan Material (SPbM) Baru dari Tim Teknik & Konstruksi!
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#93c5fd', marginTop: '2px' }}>
                    Silakan klik tombol <strong>"📋 Verifikasi Item Material"</strong> di tabel untuk menetapkan harga dan mencentang baris material yang disetujui.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setFilterCategoryType('MATERIAL');
                    setFilterStatus('Menunggu Review');
                    setFilterProject('ALL');
                    setFilterDateMode('ALL');
                  }}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  Lihat Tiket Material Ini ({pendingMaterialTickets.length})
                </button>
              </div>
            </div>
          )}

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
              {/* Category Pills: All vs Material SPbM vs Operasional */}
              <div style={{ display: 'flex', gap: '5px', background: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <button
                  type="button"
                  onClick={() => setFilterCategoryType('ALL')}
                  style={{
                    background: filterCategoryType === 'ALL' ? '#334155' : 'transparent',
                    color: filterCategoryType === 'ALL' ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    fontWeight: filterCategoryType === 'ALL' ? 800 : 600,
                    cursor: 'pointer'
                  }}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategoryType('MATERIAL')}
                  style={{
                    background: filterCategoryType === 'MATERIAL' ? '#1d4ed8' : 'transparent',
                    color: filterCategoryType === 'MATERIAL' ? '#ffffff' : '#93c5fd',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    fontWeight: filterCategoryType === 'MATERIAL' ? 900 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>📦 Material (SPbM)</span>
                  {pendingMaterialTickets.length > 0 && (
                    <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.62rem', padding: '1px 5px', borderRadius: '8px', fontWeight: 900 }}>
                      {pendingMaterialTickets.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategoryType('OPERASIONAL')}
                  style={{
                    background: filterCategoryType === 'OPERASIONAL' ? '#334155' : 'transparent',
                    color: filterCategoryType === 'OPERASIONAL' ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    fontWeight: filterCategoryType === 'OPERASIONAL' ? 800 : 600,
                    cursor: 'pointer'
                  }}
                >
                  Operasional Lain
                </button>
              </div>

              {/* Search */}
              <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Cari ID, Judul, No SPbM, Pemohon, Proyek..."
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
                <option value="ALL">Semua Departemen</option>
                <option value="teknik">Teknik & Konstruksi (Material & BATP)</option>
                <option value="marketing">Marketing & Sales</option>
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
                            {(item.targetBank || item.namaBank || item.targetAccountNumber || item.noRekening) && (
                              <div style={{ fontSize: '0.71rem', color: '#34d399', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CreditCard size={12} />
                                <span>Rek. Tujuan: <strong>{item.targetBank || item.namaBank || 'BCA'}</strong> - {item.targetAccountNumber || item.noRekening || '-'} (a.n {item.targetAccountHolder || item.namaPenerima || item.requester})</span>
                              </div>
                            )}
                            {item.spbmNo && (
                              <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, marginTop: '2px' }}>
                                No. SPbM: {item.spbmNo}
                              </div>
                            )}
                            {item.materialRows && item.materialRows.length > 0 && (
                              <div style={{ marginTop: '4px' }}>
                                <span style={{
                                  background: 'rgba(30, 58, 138, 0.5)',
                                  border: '1px solid #3b82f6',
                                  color: '#93c5fd',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  📦 {item.materialRows.length} Item Baris Material
                                </span>
                              </div>
                            )}
                          </td>

                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            {Number(item.amount) > 0 ? (
                              <div style={{ fontWeight: 900, color: '#38bdf8', fontSize: '0.92rem' }}>
                                Rp {Number(item.amount).toLocaleString('id-ID')}
                              </div>
                            ) : (item.materialRows && item.materialRows.length > 0) ? (
                              <div>
                                <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.78rem' }}>
                                  Estimasi Belum Diisi
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                  (Diverifikasi oleh Finance)
                                </div>
                              </div>
                            ) : (
                              <div style={{ fontWeight: 900, color: '#38bdf8', fontSize: '0.92rem' }}>
                                Rp 0
                              </div>
                            )}
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                              COA: {item.accountCode || '5-101'}
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
                                  {item.materialRows && item.materialRows.length > 0 ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedDetailItem(item);
                                        setIsDetailModalOpen(true);
                                      }}
                                      title="Buka Verifikasi & Approval Baris Material"
                                      style={{
                                        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                                        color: '#ffffff',
                                        border: '1px solid #3b82f6',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        fontSize: '0.74rem',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
                                      }}
                                    >
                                      📋 Verifikasi ({item.materialRows.length})
                                    </button>
                                  ) : (
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
                                  )}
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
          
          {/* Header & Aksi Utama */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Account List
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px', fontSize: '0.74rem' }}>
                <span style={{ background: '#0f172a', border: '1px solid #334155', padding: '4px 10px', borderRadius: '6px', color: '#94a3b8' }}>
                  Total: <strong style={{ color: '#ffffff' }}>{coa.length}</strong>
                </span>
                <span style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '4px 10px', borderRadius: '6px', color: '#60a5fa' }}>
                  Header: <strong style={{ color: '#93c5fd' }}>{coa.filter(c => c.kriteria === 'Header').length}</strong>
                </span>
                <span style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '6px', color: '#34d399' }}>
                  Detail: <strong style={{ color: '#6ee7b7' }}>{coa.filter(c => c.kriteria === 'Detail').length}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNewAccountForm({
                    code: '',
                    name: '',
                    parentCode: '',
                    level: 1,
                    kriteria: 'Detail',
                    posisi: 'Debet',
                    category: 'Aktiva',
                    balance: '',
                    description: ''
                  });
                  setIsNewAccountModalOpen(true);
                }}
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
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                }}
              >
                <Plus size={16} /> + Tambah Akun Baru
              </button>
            </div>
          </div>

          {/* Bar Filter & Pencarian */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '220px' }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Cari kode atau nama akun..."
                value={coaSearch}
                onChange={(e) => setCoaSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', width: '100%', outline: 'none' }}
              />
              {coaSearch && (
                <button onClick={() => setCoaSearch('')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Filter Kriteria */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Kriteria:</span>
                <select
                  value={coaFilterKriteria}
                  onChange={(e) => setCoaFilterKriteria(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', padding: '5px 8px', fontSize: '0.76rem', fontWeight: 700 }}
                >
                  <option value="ALL">Semua Kriteria</option>
                  <option value="Header">Header Saja (Induk)</option>
                  <option value="Detail">Detail Saja (Transaksi)</option>
                </select>
              </div>

              {/* Filter Kelompok / Golongan */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Kelompok:</span>
                <select
                  value={coaFilterGroup}
                  onChange={(e) => setCoaFilterGroup(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', padding: '5px 8px', fontSize: '0.76rem', fontWeight: 700 }}
                >
                  <option value="ALL">Semua Kelompok (1 - 8)</option>
                  <option value="1">1 - Aktiva (Aset)</option>
                  <option value="2">2 - Hutang (Kewajiban)</option>
                  <option value="3">3 - Ekuitas (Modal)</option>
                  <option value="4">4 - Pendapatan</option>
                  <option value="5">5 - HPP Proyek</option>
                  <option value="6">6 - Beban Operasional</option>
                  <option value="7">7 - Pendapatan Lain-lain</option>
                  <option value="8">8 - Biaya Lain-lain</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabel COA Berjenjang */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1.5px solid #1e293b' }}>
                    <th style={{ padding: '12px 14px', width: '130px' }}>Kode Akun</th>
                    <th style={{ padding: '12px 14px', minWidth: '340px' }}>Nama Akun & Struktur Hierarki</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', width: '110px' }}>Kriteria</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', width: '90px' }}>Posisi</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', width: '160px' }}>Saldo Berjalan (Rp)</th>
                    <th style={{ padding: '12px 14px' }}>Keterangan Fungsi</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', width: '110px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoa.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                        Tidak ada akun yang cocok dengan kata kunci atau filter yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    filteredCoa.map((item) => {
                      const isHeader = item.kriteria === 'Header';
                      const isDebet = item.posisi === 'Debet' || item.normalBalance === 'Debit';
                      const level = item.level || (item.parentCode ? 4 : 1);
                      const indentPx = (level - 1) * 22;

                      return (
                        <tr
                          key={item.code}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: level === 1 ? 'rgba(239, 68, 68, 0.06)' : level === 2 ? 'rgba(15, 23, 42, 0.4)' : 'transparent',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          {/* Kode Akun */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                fontWeight: isHeader ? 900 : 700,
                                color: level === 1 ? '#ef4444' : isHeader ? '#f87171' : '#cbd5e1',
                                fontSize: level === 1 ? '0.88rem' : '0.82rem',
                                letterSpacing: '0.02em'
                              }}
                            >
                              {item.code}
                            </span>
                          </td>

                          {/* Nama Akun dengan Indentasi Pohon Hierarki */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: `${indentPx}px` }}>
                              {level > 1 && (
                                <CornerDownRight
                                  size={12}
                                  color={level === 2 ? '#60a5fa' : level === 3 ? '#94a3b8' : '#64748b'}
                                  style={{ marginRight: '6px', flexShrink: 0 }}
                                />
                              )}
                              <span
                                style={{
                                  fontWeight: level === 1 ? 900 : level === 2 ? 800 : level === 3 ? 700 : 500,
                                  color: level === 1 ? '#ffffff' : level === 2 ? '#f1f5f9' : level === 3 ? '#e2e8f0' : '#cbd5e1',
                                  fontSize: level === 1 ? '0.88rem' : level === 2 ? '0.84rem' : '0.81rem',
                                  textTransform: level === 1 ? 'uppercase' : 'none'
                                }}
                              >
                                {item.name}
                              </span>
                            </div>
                          </td>

                          {/* Kriteria (Header / Detail) */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                            {isHeader ? (
                              <span
                                style={{
                                  background: 'rgba(59, 130, 246, 0.15)',
                                  border: '1px solid rgba(59, 130, 246, 0.4)',
                                  color: '#60a5fa',
                                  padding: '2px 8px',
                                  borderRadius: '5px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Akun Induk (Penampung Akumulasi Saldo Sub-Akun)"
                              >
                                Header (H)
                              </span>
                            ) : (
                              <span
                                style={{
                                  background: 'rgba(16, 185, 129, 0.15)',
                                  border: '1px solid rgba(16, 185, 129, 0.4)',
                                  color: '#34d399',
                                  padding: '2px 8px',
                                  borderRadius: '5px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Akun Detail Transaksi Langsung"
                              >
                                Detail (D)
                              </span>
                            )}
                          </td>

                          {/* Posisi Normal (Debet / Kredit) */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                            {isDebet ? (
                              <span
                                style={{
                                  background: 'rgba(245, 158, 11, 0.15)',
                                  border: '1px solid rgba(245, 158, 11, 0.35)',
                                  color: '#fbbf24',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800
                                }}
                              >
                                Debet
                              </span>
                            ) : (
                              <span
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.35)',
                                  color: '#f87171',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800
                                }}
                              >
                                Kredit
                              </span>
                            )}
                          </td>

                          {/* Saldo Berjalan (Rp) */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div
                              style={{
                                fontWeight: isHeader ? 900 : 700,
                                color: isHeader ? '#38bdf8' : '#f8fafc',
                                fontSize: isHeader ? '0.88rem' : '0.80rem'
                              }}
                            >
                              Rp {Number(item.balance || 0).toLocaleString('id-ID')}
                            </div>
                            {isHeader && (
                              <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
                                (Total Akumulasi)
                              </div>
                            )}
                          </td>

                          {/* Keterangan */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', color: '#94a3b8', fontSize: '0.74rem', maxWidth: '240px' }}>
                            {item.description || '-'}
                          </td>

                          {/* Aksi */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              {isHeader && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenAddSubAccount(item)}
                                  title={`Tambah Sub-Akun di bawah ${item.name}`}
                                  style={{
                                    background: 'rgba(59, 130, 246, 0.15)',
                                    color: '#60a5fa',
                                    border: '1px solid rgba(59, 130, 246, 0.35)',
                                    borderRadius: '5px',
                                    padding: '3px 7px',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Plus size={11} /> + Sub
                                </button>
                              )}

                              {item.level > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCoa(item)}
                                  title={`Hapus Akun ${item.code}`}
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.12)',
                                    color: '#f87171',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '5px',
                                    padding: '4px 6px',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
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
      {/* 2. SUB-MODUL: JOBLIST (STRUKTUR 2-LEVEL: PROYEK & SUB-PEKERJAAN)           */}
      {/* ========================================================================= */}
      {activeSubModule === 'joblist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Header & Aksi Utama */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Joblist
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px', fontSize: '0.74rem' }}>
                <span style={{ background: '#0f172a', border: '1px solid #334155', padding: '4px 10px', borderRadius: '6px', color: '#94a3b8' }}>
                  Total Item: <strong style={{ color: '#ffffff' }}>{joblist.length}</strong>
                </span>
                <span style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', borderRadius: '6px', color: '#f87171' }}>
                  Proyek: <strong style={{ color: '#fca5a5' }}>{joblist.filter(j => j.level === 1).length}</strong>
                </span>
                <span style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '6px', color: '#34d399' }}>
                  Sub-Pekerjaan: <strong style={{ color: '#6ee7b7' }}>{joblist.filter(j => j.level === 2).length}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={handleOpenAddJobProject}
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
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                }}
              >
                <Plus size={16} /> + Tambah Proyek Baru
              </button>
            </div>
          </div>

          {/* Bar Filter & Pencarian */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '220px' }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Cari kode atau nama pekerjaan/proyek..."
                value={joblistSearch}
                onChange={(e) => setJoblistSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', width: '100%', outline: 'none' }}
              />
              {joblistSearch && (
                <button onClick={() => setJoblistSearch('')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Filter Proyek:</span>
                <select
                  value={joblistFilterProject}
                  onChange={(e) => setJoblistFilterProject(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', padding: '5px 8px', fontSize: '0.76rem', fontWeight: 700 }}
                >
                  <option value="ALL">Semua Proyek</option>
                  {joblist.filter(j => j.level === 1).map((proj) => (
                    <option key={proj.code} value={proj.code}>
                      {proj.code} - {proj.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabel Joblist Berjenjang 2-Level */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#0b1120', color: '#94a3b8', borderBottom: '1.5px solid #1e293b' }}>
                    <th style={{ padding: '12px 14px', width: '120px' }}>Kode Job</th>
                    <th style={{ padding: '12px 14px', minWidth: '320px' }}>Nama Proyek / Sub-Pekerjaan</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', width: '140px' }}>Tingkat</th>
                    <th style={{ padding: '12px 14px', width: '180px' }}>Induk Proyek</th>
                    <th style={{ padding: '12px 14px' }}>Keterangan</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', width: '140px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJoblist.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                        Tidak ada item pekerjaan yang cocok dengan pencarian atau filter yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    filteredJoblist.map((item) => {
                      const isLevel1 = item.level === 1;
                      const parent = !isLevel1 ? joblist.find(j => j.code === item.parentCode) : null;

                      return (
                        <tr
                          key={item.code}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: isLevel1 ? 'rgba(239, 68, 68, 0.06)' : 'transparent',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          {/* Kode Job */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                fontWeight: isLevel1 ? 900 : 700,
                                color: isLevel1 ? '#ef4444' : '#cbd5e1',
                                fontSize: isLevel1 ? '0.88rem' : '0.82rem',
                                letterSpacing: '0.02em'
                              }}
                            >
                              {item.code}
                            </span>
                          </td>

                          {/* Nama Proyek / Sub-Pekerjaan */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: isLevel1 ? '0px' : '26px' }}>
                              {!isLevel1 && (
                                <CornerDownRight
                                  size={13}
                                  color="#38bdf8"
                                  style={{ marginRight: '8px', flexShrink: 0 }}
                                />
                              )}
                              <span
                                style={{
                                  fontWeight: isLevel1 ? 900 : 600,
                                  color: isLevel1 ? '#ffffff' : '#e2e8f0',
                                  fontSize: isLevel1 ? '0.88rem' : '0.82rem',
                                  textTransform: isLevel1 ? 'uppercase' : 'none'
                                }}
                              >
                                {item.name}
                              </span>
                            </div>
                          </td>

                          {/* Tingkat */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                            {isLevel1 ? (
                              <span
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.4)',
                                  color: '#f87171',
                                  padding: '2px 8px',
                                  borderRadius: '5px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Tingkat 1: Proyek Utama (Header)"
                              >
                                Level 1 (Proyek)
                              </span>
                            ) : (
                              <span
                                style={{
                                  background: 'rgba(16, 185, 129, 0.15)',
                                  border: '1px solid rgba(16, 185, 129, 0.4)',
                                  color: '#34d399',
                                  padding: '2px 8px',
                                  borderRadius: '5px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Tingkat 2: Sub-Pekerjaan Lapangan (Detail)"
                              >
                                Level 2 (Sub-Job)
                              </span>
                            )}
                          </td>

                          {/* Induk Proyek */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', fontSize: '0.74rem' }}>
                            {isLevel1 ? (
                              <span style={{ color: '#64748b' }}>- (Proyek Induk)</span>
                            ) : (
                              <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                                {parent ? `${parent.code} - ${parent.name}` : item.parentCode}
                              </span>
                            )}
                          </td>

                          {/* Keterangan */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', color: '#94a3b8', fontSize: '0.74rem', maxWidth: '260px' }}>
                            {item.description || '-'}
                          </td>

                          {/* Aksi */}
                          <td style={{ padding: '10px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              {/* HANYA Level 1 yang memiliki tombol "+ Sub", Level 2 TIDAK BISA tambah anak lagi (maksimal 2 tingkat) */}
                              {isLevel1 && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenAddSubJob(item)}
                                  title={`Tambah Sub-Pekerjaan di bawah ${item.name}`}
                                  style={{
                                    background: 'rgba(59, 130, 246, 0.15)',
                                    color: '#60a5fa',
                                    border: '1px solid rgba(59, 130, 246, 0.35)',
                                    borderRadius: '5px',
                                    padding: '3px 8px',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Plus size={11} /> + Sub
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeleteJob(item)}
                                title={`Hapus ${isLevel1 ? 'Proyek' : 'Pekerjaan'} ${item.code}`}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.12)',
                                  color: '#f87171',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  borderRadius: '5px',
                                  padding: '4px 6px',
                                  fontSize: '0.7rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Trash2 size={12} />
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

            {/* KARTU REKENING TUJUAN TRANSFER (PENCAIRAN DANA OLEH FINANCE) */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={15} /> REKENING TUJUAN TRANSFER (PENCAIRAN DANA OLEH FINANCE)
                </span>
                {(selectedReqForDisburse.targetAccountNumber || selectedReqForDisburse.noRekening) && (
                  <button
                    type="button"
                    onClick={() => {
                      const accNo = selectedReqForDisburse.targetAccountNumber || selectedReqForDisburse.noRekening;
                      navigator.clipboard.writeText(accNo);
                      alert(`Nomor rekening ${accNo} berhasil disalin ke clipboard!`);
                    }}
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid #10b981',
                      color: '#34d399',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      fontWeight: 700
                    }}
                  >
                    Salin No Rek
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Bank Tujuan:</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
                    {selectedReqForDisburse.targetBank || selectedReqForDisburse.namaBank || selectedReqForDisburse.bankName || 'BCA (Default)'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Nomor Rekening:</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
                    {selectedReqForDisburse.targetAccountNumber || selectedReqForDisburse.noRekening || selectedReqForDisburse.accountNumber || '-'}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Nama Pemilik Rekening / Penerima: </span>
                <strong style={{ fontSize: '0.84rem', color: '#f8fafc' }}>
                  {selectedReqForDisburse.targetAccountHolder || selectedReqForDisburse.namaPenerima || selectedReqForDisburse.accountHolder || selectedReqForDisburse.requester}
                </strong>
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
              {/* KARTU REKENING TUJUAN TRANSFER (PENCAIRAN DANA OLEH FINANCE) */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1.5px solid #10b981',
                  borderRadius: '12px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={15} />
                  <span>REKENING TUJUAN TRANSFER (PENCAIRAN DANA OLEH FINANCE) *</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Nama Bank Tujuan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="BCA / Mandiri / BRI / BSI / BNI"
                      value={newReqForm.targetBank}
                      onChange={(e) => setNewReqForm({ ...newReqForm, targetBank: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        border: '1px solid #10b981',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#ffffff',
                        fontSize: '0.84rem',
                        fontWeight: 800
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Nomor Rekening Tujuan (No. Rek) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 002-988-1234"
                      value={newReqForm.targetAccountNumber}
                      onChange={(e) => setNewReqForm({ ...newReqForm, targetAccountNumber: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        border: '1px solid #10b981',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#34d399',
                        fontSize: '0.84rem',
                        fontFamily: 'monospace',
                        fontWeight: 800
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nama Pemilik Rekening / Penerima Transfer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Vendor Sukses / CV Berkah"
                    value={newReqForm.targetAccountHolder}
                    onChange={(e) => setNewReqForm({ ...newReqForm, targetAccountHolder: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>
              </div>

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
              maxWidth: (selectedDetailItem.materialRows && selectedDetailItem.materialRows.length > 0) ? '980px' : '580px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1.5px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Rincian Tiket Pengajuan {selectedDetailItem.id} {selectedDetailItem.spbmNo ? `(${selectedDetailItem.spbmNo})` : ''}
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '6px' }}>
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
                  <span style={{ color: '#94a3b8' }}>Tanggal Pengajuan:</span>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{selectedDetailItem.requestDate}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Status Pengajuan:</span>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: selectedDetailItem.status === 'Dicairkan' ? 'rgba(16, 185, 129, 0.2)' : (selectedDetailItem.status === 'Disetujui' ? 'rgba(56, 189, 248, 0.2)' : (selectedDetailItem.status === 'Ditolak' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)')),
                      color: selectedDetailItem.status === 'Dicairkan' ? '#34d399' : (selectedDetailItem.status === 'Disetujui' ? '#38bdf8' : (selectedDetailItem.status === 'Ditolak' ? '#f87171' : '#fbbf24')),
                      border: `1px solid ${selectedDetailItem.status === 'Dicairkan' ? '#10b981' : (selectedDetailItem.status === 'Disetujui' ? '#38bdf8' : (selectedDetailItem.status === 'Ditolak' ? '#ef4444' : '#f59e0b'))}`
                    }}>
                      {selectedDetailItem.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Total Nominal:</span>
                  <div style={{ fontWeight: 900, color: '#34d399', fontSize: '1.1rem' }}>
                    Rp {Number(selectedDetailItem.approvedAmount > 0 ? selectedDetailItem.approvedAmount : selectedDetailItem.amount).toLocaleString('id-ID')}
                    {selectedDetailItem.approvedAmount > 0 && selectedDetailItem.approvedAmount !== selectedDetailItem.amount && (
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                        (Dari total diajukan: Rp {Number(selectedDetailItem.amount).toLocaleString('id-ID')})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* KARTU REKENING TUJUAN TRANSFER (PENCAIRAN DANA OLEH FINANCE) */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1.5px solid #10b981',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginTop: '10px'
                }}
              >
                <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} /> REKENING TUJUAN TRANSFER (PENCAIRAN DANA)
                  </span>
                  {(selectedDetailItem.targetAccountNumber || selectedDetailItem.noRekening) && (
                    <button
                      type="button"
                      onClick={() => {
                        const accNo = selectedDetailItem.targetAccountNumber || selectedDetailItem.noRekening;
                        navigator.clipboard.writeText(accNo);
                        alert(`Nomor rekening ${accNo} berhasil disalin!`);
                      }}
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid #10b981',
                        color: '#34d399',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      Salin No Rek
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Bank Tujuan:</span>
                    <div style={{ fontWeight: 800, color: '#ffffff' }}>
                      {selectedDetailItem.targetBank || selectedDetailItem.namaBank || selectedDetailItem.bankName || 'BCA (Default)'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Nomor Rekening:</span>
                    <div style={{ fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
                      {selectedDetailItem.targetAccountNumber || selectedDetailItem.noRekening || selectedDetailItem.accountNumber || '-'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Nama Pemilik Rekening:</span>
                    <div style={{ fontWeight: 800, color: '#f8fafc' }}>
                      {selectedDetailItem.targetAccountHolder || selectedDetailItem.namaPenerima || selectedDetailItem.accountHolder || selectedDetailItem.requester}
                    </div>
                  </div>
                </div>
              </div>

              {/* JIKA MEMILIKI RINCIAN BARIS MATERIAL (SPbM DARI TEKNIK) */}
              {selectedDetailItem.materialRows && selectedDetailItem.materialRows.length > 0 && (
                <div style={{ marginTop: '14px', borderTop: '1px solid #1e293b', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: '1px solid #3b82f6'
                      }}>
                        Tabel Rincian Material SPbM
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Pilih baris yang <strong>Disetujui [✓]</strong> atau <strong>Ditolak [✗]</strong>. Finance hanya membayar yang disetujui saja.
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setMaterialReviewRows(prev => prev.map(r => ({ ...r, status: 'Disetujui', isApproved: true })));
                        }}
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          color: '#34d399',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        ✓ Setujui Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMaterialReviewRows(prev => prev.map(r => ({ ...r, status: 'Ditolak', isApproved: false })));
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#f87171',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        ✗ Tolak Semua
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive" style={{ overflowX: 'auto', border: '1px solid #1e3a8a', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)', color: '#ffffff' }}>
                          <th style={{ width: '35px', border: '1px solid #2563eb', padding: '8px 6px', textAlign: 'center' }}>No</th>
                          <th style={{ width: '85px', border: '1px solid #2563eb', padding: '8px 8px', textAlign: 'center' }}>Tanggal</th>
                          <th style={{ width: '80px', border: '1px solid #2563eb', padding: '8px 8px', textAlign: 'center' }}>Kode</th>
                          <th style={{ minWidth: '160px', border: '1px solid #2563eb', padding: '8px 10px' }}>Material</th>
                          <th style={{ width: '60px', border: '1px solid #2563eb', padding: '8px 6px', textAlign: 'center' }}>Qty</th>
                          <th style={{ width: '55px', border: '1px solid #2563eb', padding: '8px 6px', textAlign: 'center' }}>Sat</th>
                          <th style={{ width: '65px', border: '1px solid #2563eb', padding: '8px 6px', textAlign: 'center' }}>Blok/No</th>
                          <th style={{ minWidth: '130px', border: '1px solid #2563eb', padding: '8px 8px' }}>Keterangan</th>
                          <th style={{ width: '115px', border: '1px solid #2563eb', padding: '8px 8px', textAlign: 'right' }}>Harga Satuan</th>
                          <th style={{ width: '115px', border: '1px solid #2563eb', padding: '8px 8px', textAlign: 'right' }}>Subtotal</th>
                          <th style={{ width: '150px', border: '1px solid #2563eb', padding: '8px 8px', textAlign: 'center' }}>Approval Finance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materialReviewRows.map((row, idx) => {
                          const isApp = row.status === 'Disetujui' || row.isApproved === true;
                          const isRej = row.status === 'Ditolak' || row.isApproved === false;
                          const rowBg = isApp ? 'rgba(16, 185, 129, 0.08)' : (isRej ? 'rgba(239, 68, 68, 0.08)' : (idx % 2 === 0 ? '#090f1d' : '#0d1527'));

                          return (
                            <tr key={row.id || idx} style={{ background: rowBg, borderBottom: '1px solid #1e293b' }}>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 4px', textAlign: 'center', color: '#94a3b8' }}>
                                {idx + 1}
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 8px', textAlign: 'center', color: '#cbd5e1', fontSize: '0.74rem' }}>
                                {row.tanggal || selectedDetailItem.requestDate}
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 8px', textAlign: 'center' }}>
                                <span style={{ background: 'rgba(30, 58, 138, 0.4)', border: '1px solid #3b82f6', color: '#93c5fd', fontFamily: 'monospace', fontWeight: 800, padding: '1px 5px', borderRadius: '3px', fontSize: '0.72rem' }}>
                                  {row.kode || '-'}
                                </span>
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 10px', fontWeight: 700, color: '#ffffff' }}>
                                {row.material}
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 6px', textAlign: 'center', fontWeight: 900, color: '#38bdf8' }}>
                                {row.qty}
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 6px', textAlign: 'center', color: '#cbd5e1' }}>
                                {row.sat}
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 6px', textAlign: 'center', color: '#cbd5e1' }}>
                                {row.blok || '-'} {row.unitNo || row.no ? `/${row.unitNo || row.no}` : ''}
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 8px', color: '#94a3b8', fontSize: '0.74rem' }}>
                                {row.keterangan || '-'}
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'right' }}>
                                {selectedDetailItem.status === 'Dicairkan' ? (
                                  <span style={{ color: '#ffffff', fontWeight: 700 }}>
                                    Rp {Number(row.hargaSatuan || 0).toLocaleString('id-ID')}
                                  </span>
                                ) : (
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={row.hargaSatuan || ''}
                                    onChange={(e) => handleUpdateMaterialRowPrice(row.id, e.target.value)}
                                    style={{
                                      width: '90px',
                                      height: '28px',
                                      background: '#0f172a',
                                      border: '1px solid #334155',
                                      borderRadius: '4px',
                                      color: '#ffffff',
                                      textAlign: 'right',
                                      padding: '0 6px',
                                      fontSize: '0.76rem'
                                    }}
                                  />
                                )}
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 8px', textAlign: 'right', fontWeight: 800, color: isApp ? '#34d399' : (isRej ? '#64748b' : '#38bdf8') }}>
                                Rp {Number(row.subtotal || ((Number(row.hargaSatuan || 0)) * (Number(row.qty || 0)))).toLocaleString('id-ID')}
                              </td>
                              <td style={{ border: '1px solid #1e293b', padding: '6px 8px', textAlign: 'center' }}>
                                {selectedDetailItem.status === 'Dicairkan' ? (
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    background: isApp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: isApp ? '#34d399' : '#f87171',
                                    border: `1px solid ${isApp ? '#10b981' : '#ef4444'}`
                                  }}>
                                    {isApp ? '✓ Disetujui' : (isRej ? '✗ Ditolak' : 'Menunggu')}
                                  </span>
                                ) : (
                                  <div style={{ display: 'inline-flex', gap: '4px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleMaterialRowStatus(row.id, 'Disetujui')}
                                      style={{
                                        background: isApp ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                                        border: `1.5px solid ${isApp ? '#34d399' : 'rgba(16, 185, 129, 0.4)'}`,
                                        color: isApp ? '#ffffff' : '#34d399',
                                        borderRadius: '5px',
                                        padding: '3px 8px',
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      ✓ Setuju
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleMaterialRowStatus(row.id, 'Ditolak')}
                                      style={{
                                        background: isRej ? '#ef4444' : 'rgba(239, 68, 68, 0.15)',
                                        border: `1.5px solid ${isRej ? '#f87171' : 'rgba(239, 68, 68, 0.4)'}`,
                                        color: isRej ? '#ffffff' : '#f87171',
                                        borderRadius: '5px',
                                        padding: '3px 8px',
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      ✗ Tolak
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

                  {/* Summary baris yang disetujui / ditolak */}
                  <div style={{
                    marginTop: '8px',
                    background: '#090d16',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontSize: '0.78rem'
                  }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <span>Total Item: <strong style={{ color: '#ffffff' }}>{materialReviewRows.length}</strong></span>
                      <span style={{ color: '#34d399' }}>✓ Disetujui: <strong>{materialReviewRows.filter(r => r.status === 'Disetujui' || r.isApproved).length}</strong></span>
                      <span style={{ color: '#f87171' }}>✗ Ditolak: <strong>{materialReviewRows.filter(r => r.status === 'Ditolak').length}</strong></span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#94a3b8' }}>Total Yang Disetujui Untuk Dibayar: </span>
                      <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>
                        Rp {materialReviewRows.reduce((sum, r) => (r.status === 'Disetujui' || r.isApproved) ? sum + (Number(r.subtotal) || (Number(r.hargaSatuan || 0) * Number(r.qty || 0)) || 0) : sum, 0).toLocaleString('id-ID')}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

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
                    {selectedDetailItem.disbursedAmount && (
                      <div style={{ fontWeight: 800, color: '#34d399', marginTop: '3px' }}>
                        Nominal Dicairkan: Rp {Number(selectedDetailItem.disbursedAmount).toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedDetailItem.materialRows && selectedDetailItem.materialRows.length > 0 && selectedDetailItem.status !== 'Dicairkan' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveMaterialReview(false)}
                      style={{
                        background: '#1e3a8a',
                        border: '1px solid #3b82f6',
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      💾 Simpan Status Checklist Baris
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveMaterialReview(true)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: '1px solid #34d399',
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      💰 Setujui & Lanjutkan Bayar Yang Disetujui
                    </button>
                  </>
                )}

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
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                style={{ background: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', cursor: 'pointer', marginLeft: 'auto' }}
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
              {/* 1. Pilih Akun Induk */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  1. Pilih Akun Induk (Parent)
                </label>
                <select
                  value={newAccountForm.parentCode || ''}
                  onChange={(e) => {
                    const selCode = e.target.value;
                    const parent = coa.find(c => c.code === selCode);
                    const suggested = parent ? generateNextAccountCode(parent, coa) : '';
                    setNewAccountForm({
                      ...newAccountForm,
                      parentCode: selCode,
                      code: suggested || newAccountForm.code,
                      posisi: parent ? (parent.posisi || 'Debet') : newAccountForm.posisi,
                      category: parent ? (parent.category || 'Aktiva') : newAccountForm.category,
                      level: parent ? (parent.level || 1) + 1 : 1
                    });
                  }}
                  style={{ width: '100%', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                >
                  <option value="">(Tanpa Induk - Sebagai Puncak Level 1)</option>
                  {coa.filter(c => c.kriteria === 'Header').map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.category})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  Pilih induk untuk menempatkan akun ini di bawah kelompok tertentu.
                </span>
              </div>

              {/* 2. Opsi: Apakah Mau Didetailkan Lagi? */}
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                  2. Apakah akun ini mau didetailkan lagi (punya sub-anak)?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      background: newAccountForm.kriteria === 'Header' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: newAccountForm.kriteria === 'Header' ? '1.5px solid #3b82f6' : '1px solid #334155',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="kriteriaOption"
                      value="Header"
                      checked={newAccountForm.kriteria === 'Header'}
                      onChange={() => setNewAccountForm({ ...newAccountForm, kriteria: 'Header' })}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: newAccountForm.kriteria === 'Header' ? '#60a5fa' : '#ffffff' }}>
                        Ya, sebagai Header (H)
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.3 }}>
                        Akun induk/kelompok yang akan punya anak lagi.
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      background: newAccountForm.kriteria === 'Detail' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: newAccountForm.kriteria === 'Detail' ? '1.5px solid #10b981' : '1px solid #334155',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="kriteriaOption"
                      value="Detail"
                      checked={newAccountForm.kriteria === 'Detail'}
                      onChange={() => setNewAccountForm({ ...newAccountForm, kriteria: 'Detail' })}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: newAccountForm.kriteria === 'Detail' ? '#34d399' : '#ffffff' }}>
                        Tidak, sebagai Detail (D)
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.3 }}>
                        Akun transaksi langsung (ujung) untuk jurnal & kas.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. Kode Akun & Nama Akun */}
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Kode Akun *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1-1000"
                    value={newAccountForm.code}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, code: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  />
                  <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                    Saran otomatis (bebas diedit manual)
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nama Akun *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bank Danamon Operasional"
                    value={newAccountForm.name}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, name: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* 4. Posisi Normal (Debet / Kredit) */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Posisi Normal (Debet / Kredit)
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#fbbf24' }}>
                    <input
                      type="radio"
                      name="posisiNormal"
                      value="Debet"
                      checked={newAccountForm.posisi === 'Debet'}
                      onChange={() => setNewAccountForm({ ...newAccountForm, posisi: 'Debet' })}
                    />
                    <strong>Debet</strong> (Aset, HPP, Beban)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#f87171' }}>
                    <input
                      type="radio"
                      name="posisiNormal"
                      value="Kredit"
                      checked={newAccountForm.posisi === 'Kredit'}
                      onChange={() => setNewAccountForm({ ...newAccountForm, posisi: 'Kredit' })}
                    />
                    <strong>Kredit</strong> (Hutang, Ekuitas, Pendapatan)
                  </label>
                </div>
              </div>

              {/* 5. Saldo Awal (Hanya untuk Detail) */}
              {newAccountForm.kriteria === 'Detail' ? (
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Saldo Awal (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newAccountForm.balance}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, balance: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                  />
                </div>
              ) : (
                <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px dashed rgba(59, 130, 246, 0.3)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.72rem', color: '#93c5fd' }}>
                  💡 Akun <strong>Header</strong> tidak memerlukan input saldo awal. Saldonya dihitung otomatis oleh sistem dari akumulasi seluruh sub-anak akunnya.
                </div>
              )}

              {/* 6. Keterangan */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Keterangan Fungsi Akun
                </label>
                <input
                  type="text"
                  placeholder="Keterangan singkat peruntukan akun..."
                  value={newAccountForm.description}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, description: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
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
                  Simpan Akun Bagan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4B: TAMBAH ITEM JOBLIST (PROYEK ATAU SUB-PEKERJAAN 2-LEVEL)          */}
      {/* ========================================================================= */}
      {isNewJobModalOpen && (
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
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  {newJobForm.level === 1 ? 'Tambah Proyek Baru (Level 1)' : 'Tambah Sub-Pekerjaan (Level 2)'}
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {newJobForm.level === 1
                    ? 'Membuat Proyek Induk Utama (Cost Center Level 1)'
                    : `Membuat Sub-Pekerjaan Lapangan di bawah ${newJobForm.parentCode}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNewJobModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveJob} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* 1. Pilih Proyek Induk */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  Proyek Induk (Parent)
                </label>
                <select
                  value={newJobForm.parentCode || ''}
                  onChange={(e) => {
                    const selCode = e.target.value;
                    const parent = joblist.find(j => j.code === selCode);
                    const suggested = parent ? generateNextJobCode(parent, joblist) : '';
                    setNewJobForm({
                      ...newJobForm,
                      parentCode: selCode,
                      code: suggested || newJobForm.code,
                      level: parent ? 2 : 1,
                      type: parent ? 'Detail' : 'Header'
                    });
                  }}
                  style={{ width: '100%', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                >
                  <option value="">(Tanpa Induk - Sebagai Proyek Baru Level 1)</option>
                  {joblist.filter(j => j.level === 1).map(p => (
                    <option key={p.code} value={p.code}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  {newJobForm.parentCode ? 'Item ini otomatis menjadi Sub-Pekerjaan (Level 2).' : 'Kosongkan jika membuat Proyek Induk baru (Level 1).'}
                </span>
              </div>

              {/* 2. Kode Pekerjaan & Nama Pekerjaan */}
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Kode Job *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={newJobForm.level === 1 ? 'Contoh: AV-100' : 'Contoh: AV-110'}
                    value={newJobForm.code}
                    onChange={(e) => setNewJobForm({ ...newJobForm, code: e.target.value.toUpperCase() })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800 }}
                  />
                  <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                    Saran otomatis (bebas edit)
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nama {newJobForm.level === 1 ? 'Proyek' : 'Sub-Pekerjaan'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={newJobForm.level === 1 ? 'Contoh: Bizhub Commercial' : 'Contoh: Konstruksi unit'}
                    value={newJobForm.name}
                    onChange={(e) => setNewJobForm({ ...newJobForm, name: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              {/* 3. Deskripsi / Keterangan */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Keterangan / Uraian Pekerjaan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pekerjaan cut and fill, pengurugan dan pemadatan tanah..."
                  value={newJobForm.description}
                  onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  style={{ background: '#1e293b', color: '#cbd5e1', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)', border: '1px solid #ef4444', color: '#ffffff', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Simpan ke Joblist
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
