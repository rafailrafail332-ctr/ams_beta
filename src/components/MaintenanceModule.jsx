import React, { useState, useEffect, useMemo } from 'react';
import {
  Wrench,
  Calendar,
  DollarSign,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  Send,
  Eye,
  Check,
  Package,
  Printer,
  Download,
  Building2,
  TrendingUp,
  Briefcase,
  User,
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';
import { submitFundRequest, getFundRequests } from '../services/financeService';

// =============================================================================
// STORAGE KEYS & SEED DATA
// =============================================================================
const STORAGE_MAINTENANCE_KEY = 'ams_hr_maintenance_v2';
const STORAGE_ASSETS_KEY = 'ams_hr_assets_v2';

const INITIAL_MAINTENANCE_DATA = [
  {
    id: 'MNT-2026-001',
    noDok: 'MNT/AMS-TKT/2026/01',
    tanggalRequest: '2026-09-18',
    tanggalJadwal: '2026-09-20',
    namaBarang: 'Mobil Toyota Hilux Double Cabin 4x4 (B 9102 GA)',
    assetId: 'AST-001',
    lokasiAsset: 'Ashoka Park',
    jenisKerusakan: 'Servis Berkala 10.000 KM & Ganti Kampas Rem Depan',
    urgensi: 'Tinggi', // Tinggi, Normal, Rendah
    pemohon: 'Budi (Driver Site Lapangan)',
    namaVendor: 'Bengkel Resmi Auto2000 Cibinong',
    namaBank: 'BCA',
    noRekening: '002-881-9921',
    namaPenerima: 'PT Astra International Auto2000',
    biaya: 1850000,
    statusMaintenance: 'Selesai', // Menunggu Maintenance, Menunggu Jadwal Vendor, Sedang Dikerjakan, Selesai
    statusPembayaran: 'Lunas', // Pending, Diajukan ke Finance, Lunas
    fundRequestId: 'REQ-2026-001',
    catatan: 'Ganti oli mesin sintetis, filter oli, dan kampas rem depan. Kendaraan sudah kembali beroperasi normal di site.'
  },
  {
    id: 'MNT-2026-002',
    noDok: 'MNT/AMS-TKT/2026/02',
    tanggalRequest: '2026-09-22',
    tanggalJadwal: '2026-09-24',
    namaBarang: 'AC Daikin 2 PK Ruang Galeri Pemasaran',
    assetId: 'AST-004',
    lokasiAsset: 'Ashoka Park',
    jenisKerusakan: 'AC Kurang Dingin, Hembusan Lemah & Tambah Freon R32',
    urgensi: 'Tinggi',
    pemohon: 'Fresda (Marketing Gallery)',
    namaVendor: 'CV Sejuk Abadi Mandiri',
    namaBank: 'Mandiri',
    noRekening: '137-00-112233-4',
    namaPenerima: 'CV Sejuk Abadi Mandiri',
    biaya: 450000,
    statusMaintenance: 'Selesai',
    statusPembayaran: 'Lunas',
    fundRequestId: 'REQ-2026-003',
    catatan: 'Pembersihan evaporator, cuci outdoor, dan pengisian tekanan freon 140 PSI. Suhu ruangan kembali sejuk 22°C.'
  },
  {
    id: 'MNT-2026-003',
    noDok: 'MNT/AMS-TKT/2026/03',
    tanggalRequest: '2026-09-25',
    tanggalJadwal: '2026-10-02',
    namaBarang: 'Genset Silent Denyo 30 kVA Gardu Utama Kawasan',
    assetId: 'AST-003',
    lokasiAsset: 'Ashoka Park',
    jenisKerusakan: 'Running Test Beban 30 Menit, Kuras Tangki & Ganti Filter Solar',
    urgensi: 'Normal',
    pemohon: 'Dedi (Teknik GA)',
    namaVendor: 'Teknisi Diesel Genset Pak Joko',
    namaBank: 'BCA',
    noRekening: '883-019-2819',
    namaPenerima: 'Joko Susanto (Teknisi Genset)',
    biaya: 650000,
    statusMaintenance: 'Sedang Dikerjakan',
    statusPembayaran: 'Diajukan ke Finance',
    fundRequestId: 'REQ-2026-008',
    catatan: 'Penggantian filter solar ganda dan pengecekan aki starter 12V 100Ah.'
  },
  {
    id: 'MNT-2026-004',
    noDok: 'MNT/AMS-TKT/2026/04',
    tanggalRequest: '2026-09-28',
    tanggalJadwal: '2026-10-06',
    namaBarang: 'Pompa Air Jetpump Mess Pekerja & Kantor Lapangan',
    assetId: '',
    lokasiAsset: 'Ashoka View',
    jenisKerusakan: 'Otomatis Saklar Pressure Switch Macet & Kebocoran Seal',
    urgensi: 'Tinggi',
    pemohon: 'Mandor Subur (Site Ashoka View)',
    namaVendor: 'Toko Listrik & Pompa Berkah Jaya',
    namaBank: 'BSI',
    noRekening: '712-4455-890',
    namaPenerima: 'H. Slamet Berkah Jaya',
    biaya: 350000,
    statusMaintenance: 'Menunggu Jadwal Vendor',
    statusPembayaran: 'Pending',
    fundRequestId: null,
    catatan: 'Teknisi dijadwalkan tiba tanggal 6 Oktober untuk pemasangan otomatis pressure switch baru.'
  },
  {
    id: 'MNT-2026-005',
    noDok: 'MNT/AMS-TKT/2026/05',
    tanggalRequest: '2026-10-01',
    tanggalJadwal: '',
    namaBarang: 'Laptop ASUS ROG Staf Arsitek & Rendering 3D',
    assetId: 'AST-002',
    lokasiAsset: 'Head Office Bizhub',
    jenisKerusakan: 'Thermal Throttling Suhu CPU Panas & Kipas Fan Berisik',
    urgensi: 'Normal',
    pemohon: 'Staf Arsitek & Desain (HO)',
    namaVendor: '',
    namaBank: 'BCA',
    noRekening: '',
    namaPenerima: '',
    biaya: 0,
    statusMaintenance: 'Menunggu Maintenance',
    statusPembayaran: 'Pending',
    fundRequestId: null,
    catatan: 'Perlu repasting pasta termal Honeywell PTM7950 dan deep cleaning debu heatsink pendingin.'
  }
];

export const MaintenanceModule = ({ currentUser, showNotification, onSwitchTab }) => {
  // Navigasi 3 Sub-Modul
  const [activeSubTab, setActiveSubTab] = useState('request'); // 'request' | 'jadwal' | 'status'

  // Master Data Maintenance
  const [tickets, setTickets] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_MAINTENANCE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_MAINTENANCE_DATA;
  });

  // Ambil Data Aset dari Management Asset untuk integrasi
  const [assetsList, setAssetsList] = useState([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ASSETS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAssetsList(parsed);
        }
      }
    } catch {}
  }, []);

  // Simpan ke LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MAINTENANCE_KEY, JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  // Sinkronisasi Real-Time dengan Modul Finance & Accounting
  useEffect(() => {
    try {
      const financeRequests = getFundRequests();
      let hasChange = false;
      const updatedTickets = tickets.map(t => {
        if (!t.fundRequestId) return t;
        const matched = financeRequests.find(fr => fr.id === t.fundRequestId);
        if (matched) {
          if ((matched.status === 'Dana Cair' || matched.status === 'Dicairkan' || matched.status === 'Selesai') && t.statusPembayaran !== 'Lunas') {
            hasChange = true;
            return { ...t, statusPembayaran: 'Lunas' };
          } else if (matched.status === 'Disetujui' && t.statusPembayaran === 'Pending') {
            hasChange = true;
            return { ...t, statusPembayaran: 'Diajukan ke Finance' };
          }
        }
        return t;
      });

      if (hasChange) {
        setTickets(updatedTickets);
      }
    } catch {}
  }, []);

  // Helpers Format Rupiah & Tanggal
  const formatRupiah = (val) => {
    if (!val || isNaN(val)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const formatDisplayDate = (dStr) => {
    if (!dStr) return '-';
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return dStr;
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dStr;
    }
  };

  // ===========================================================================
  // SUB-MODUL 1: REQUEST MAINTENANCE
  // ===========================================================================
  const [searchRequest, setSearchRequest] = useState('');
  const [filterRequestStatus, setFilterRequestStatus] = useState('ALL');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const [requestForm, setRequestForm] = useState({
    namaBarang: '',
    assetId: '',
    lokasiAsset: 'Head Office Bizhub',
    jenisKerusakan: '',
    urgensi: 'Tinggi',
    pemohon: '',
    catatan: '',
    tanggalRequest: new Date().toISOString().split('T')[0]
  });

  const filteredRequests = useMemo(() => {
    return tickets.filter(item => {
      const q = searchRequest.toLowerCase().trim();
      const matchSearch = !q ||
        item.namaBarang.toLowerCase().includes(q) ||
        item.jenisKerusakan.toLowerCase().includes(q) ||
        item.lokasiAsset.toLowerCase().includes(q) ||
        item.pemohon.toLowerCase().includes(q) ||
        item.noDok.toLowerCase().includes(q);

      const matchStatus = filterRequestStatus === 'ALL' || item.statusMaintenance === filterRequestStatus;
      return matchSearch && matchStatus;
    });
  }, [tickets, searchRequest, filterRequestStatus]);

  const handleOpenAddRequest = () => {
    setEditingRequest(null);
    setRequestForm({
      namaBarang: '',
      assetId: '',
      lokasiAsset: 'Head Office Bizhub',
      jenisKerusakan: '',
      urgensi: 'Tinggi',
      pemohon: (currentUser && currentUser.name) || 'Staf Operasional',
      catatan: '',
      tanggalRequest: new Date().toISOString().split('T')[0]
    });
    setIsRequestModalOpen(true);
  };

  const handleOpenEditRequest = (item) => {
    setEditingRequest(item);
    setRequestForm({
      namaBarang: item.namaBarang || '',
      assetId: item.assetId || '',
      lokasiAsset: item.lokasiAsset || 'Head Office Bizhub',
      jenisKerusakan: item.jenisKerusakan || '',
      urgensi: item.urgensi || 'Normal',
      pemohon: item.pemohon || '',
      catatan: item.catatan || '',
      tanggalRequest: item.tanggalRequest || new Date().toISOString().split('T')[0]
    });
    setIsRequestModalOpen(true);
  };

  const handleSelectAsset = (assetId) => {
    if (!assetId) {
      setRequestForm(prev => ({ ...prev, assetId: '' }));
      return;
    }
    const selected = assetsList.find(a => (a.id === assetId || a.noDok === assetId));
    if (selected) {
      setRequestForm(prev => ({
        ...prev,
        assetId: selected.id || selected.noDok,
        namaBarang: selected.namaAsset || selected.judulDokumen || selected.nama || '',
        lokasiAsset: selected.lokasiAsset || selected.project || 'Head Office Bizhub'
      }));
    }
  };

  const handleSaveRequest = (e) => {
    e.preventDefault();
    if (!requestForm.namaBarang.trim() || !requestForm.jenisKerusakan.trim()) {
      showNotification && showNotification('Nama Barang dan Jenis Kerusakan wajib diisi!', 'danger');
      return;
    }

    if (editingRequest) {
      setTickets(tickets.map(t => t.id === editingRequest.id ? { ...t, ...requestForm } : t));
      showNotification && showNotification(`Request maintenance ${requestForm.namaBarang} berhasil diperbarui!`, 'success');
    } else {
      const nextSeq = String(tickets.length + 1).padStart(2, '0');
      const newTicket = {
        id: `MNT-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, '0')}`,
        noDok: `MNT/AMS-TKT/${new Date().getFullYear()}/${nextSeq}`,
        ...requestForm,
        tanggalJadwal: '',
        namaVendor: '',
        namaBank: 'BCA',
        noRekening: '',
        namaPenerima: '',
        biaya: 0,
        statusMaintenance: 'Menunggu Maintenance',
        statusPembayaran: 'Pending',
        fundRequestId: null
      };
      setTickets([newTicket, ...tickets]);
      showNotification && showNotification(`Tiket request perbaikan ${requestForm.namaBarang} berhasil dibuat!`, 'success');
    }
    setIsRequestModalOpen(false);
  };

  // ===========================================================================
  // SUB-MODUL 2: JADWAL MAINTENANCE & AKSI BAYAR KE FINANCE
  // ===========================================================================
  const [searchSchedule, setSearchSchedule] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleTicket, setEditingScheduleTicket] = useState(null);
  const [paymentConfirmModal, setPaymentConfirmModal] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    namaBarang: '',
    jenisKerusakan: '',
    lokasiAsset: 'Head Office Bizhub',
    tanggalJadwal: new Date().toISOString().split('T')[0],
    namaVendor: '',
    biaya: '',
    namaBank: 'BCA',
    noRekening: '',
    namaPenerima: '',
    catatan: '',
    statusMaintenance: 'Menunggu Jadwal Vendor'
  });

  const filteredScheduleList = useMemo(() => {
    return tickets.filter(item => {
      const q = searchSchedule.toLowerCase().trim();
      return !q ||
        item.namaBarang.toLowerCase().includes(q) ||
        item.jenisKerusakan.toLowerCase().includes(q) ||
        (item.namaVendor && item.namaVendor.toLowerCase().includes(q)) ||
        item.lokasiAsset.toLowerCase().includes(q);
    });
  }, [tickets, searchSchedule]);

  const handleOpenScheduleFromRequest = (t) => {
    setEditingScheduleTicket(t);
    setScheduleForm({
      namaBarang: t.namaBarang || '',
      jenisKerusakan: t.jenisKerusakan || '',
      lokasiAsset: t.lokasiAsset || 'Head Office Bizhub',
      tanggalJadwal: t.tanggalJadwal || new Date().toISOString().split('T')[0],
      namaVendor: t.namaVendor || '',
      biaya: t.biaya ? String(t.biaya) : '',
      namaBank: t.namaBank || 'BCA',
      noRekening: t.noRekening || '',
      namaPenerima: t.namaPenerima || '',
      catatan: t.catatan || '',
      statusMaintenance: t.statusMaintenance === 'Menunggu Maintenance' ? 'Menunggu Jadwal Vendor' : t.statusMaintenance
    });
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!scheduleForm.namaVendor.trim()) {
      showNotification && showNotification('Nama Vendor / Teknisi wajib diisi!', 'danger');
      return;
    }

    const nominalBiaya = Number(scheduleForm.biaya) || 0;
    const payload = {
      ...scheduleForm,
      biaya: nominalBiaya
    };

    if (editingScheduleTicket) {
      setTickets(tickets.map(t => t.id === editingScheduleTicket.id ? { ...t, ...payload } : t));
      showNotification && showNotification(`Jadwal maintenance ${scheduleForm.namaBarang} berhasil disimpan!`, 'success');
    }
    setIsScheduleModalOpen(false);
  };

  // AKSI BAYAR: OTOMATIS KIRIM PENGAJUAN DANA KE FINANCE & ACCOUNTING
  const handleAksiBayarClick = (ticket) => {
    if (ticket.statusPembayaran === 'Lunas') {
      if (window.confirm(`Status pembayaran sudah "Lunas". Ingin mereset status kembali ke "Pending"?`)) {
        setTickets(tickets.map(t => t.id === ticket.id ? { ...t, statusPembayaran: 'Pending', fundRequestId: null } : t));
        showNotification && showNotification(`Status pembayaran ${ticket.namaBarang} direset ke Pending`, 'info');
      }
      return;
    }

    if (!ticket.biaya || ticket.biaya <= 0) {
      showNotification && showNotification('Nominal biaya perbaikan belum ditentukan. Silakan edit jadwal terlebih dahulu!', 'warning');
      return;
    }

    setPaymentConfirmModal(ticket);
  };

  const handleConfirmSendPaymentToFinance = () => {
    if (!paymentConfirmModal) return;
    const t = paymentConfirmModal;

    try {
      const nominal = Number(t.biaya) || 0;
      const createdRequest = submitFundRequest({
        originModule: 'hrga',
        originModuleName: 'HR & GA (Maintenance)',
        title: `Biaya Maintenance: ${t.namaBarang} (${t.jenisKerusakan})`,
        amount: nominal,
        category: 'Fasilitas & Pemeliharaan',
        project: t.lokasiAsset || 'Head Office Bizhub',
        requester: t.pemohon || 'Divisi GA & Maintenance',
        targetBank: t.namaBank || 'BCA',
        targetAccountNumber: t.noRekening || '-',
        targetAccountHolder: t.namaPenerima || t.namaVendor || 'Vendor Maintenance',
        namaBank: t.namaBank || 'BCA',
        noRekening: t.noRekening || '-',
        namaPenerima: t.namaPenerima || t.namaVendor || 'Vendor Maintenance',
        notes: `Pengajuan biaya perbaikan aset kantor/lapangan.\nBarang: ${t.namaBarang}\nKerusakan: ${t.jenisKerusakan}\nVendor: ${t.namaVendor || '-'}\nRekening Transfer: Bank ${t.namaBank || 'BCA'} ${t.noRekening || '-'} a.n ${t.namaPenerima || t.namaVendor || '-'}.`,
        dueDate: t.tanggalJadwal || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        accountCode: '5-201'
      });

      // Update status tiket
      setTickets(tickets.map(item => {
        if (item.id === t.id) {
          return {
            ...item,
            statusPembayaran: 'Diajukan ke Finance',
            fundRequestId: createdRequest.id
          };
        }
        return item;
      }));

      showNotification && showNotification(
        `Pengajuan dana ${formatRupiah(nominal)} untuk "${t.namaBarang}" berhasil dikirim ke Finance & Accounting! (ID: ${createdRequest.id})`,
        'success'
      );
    } catch (err) {
      console.error(err);
      showNotification && showNotification(`Gagal mengirim ke Finance: ${err.message}`, 'danger');
    }

    setPaymentConfirmModal(null);
  };

  // ===========================================================================
  // SUB-MODUL 3: STATUS MAINTENANCE (DENGAN FILTER TANGGAL, TAHUN, NAMA BARANG)
  // ===========================================================================
  const [searchStatusItem, setSearchStatusItem] = useState('');
  const [filterStatusStartDate, setFilterStatusStartDate] = useState('');
  const [filterStatusEndDate, setFilterStatusEndDate] = useState('');
  const [filterStatusYear, setFilterStatusYear] = useState('ALL');
  const [filterStatusProgress, setFilterStatusProgress] = useState('ALL');

  // List Tahun Dinamis
  const availableYears = useMemo(() => {
    const years = new Set();
    tickets.forEach(t => {
      if (t.tanggalJadwal) years.add(t.tanggalJadwal.substring(0, 4));
      if (t.tanggalRequest) years.add(t.tanggalRequest.substring(0, 4));
    });
    return Array.from(years).sort().reverse();
  }, [tickets]);

  const filteredStatusList = useMemo(() => {
    return tickets.filter(item => {
      // 1. Search Nama Barang / Aset
      const q = searchStatusItem.toLowerCase().trim();
      const matchSearch = !q ||
        item.namaBarang.toLowerCase().includes(q) ||
        item.jenisKerusakan.toLowerCase().includes(q) ||
        (item.namaVendor && item.namaVendor.toLowerCase().includes(q)) ||
        item.lokasiAsset.toLowerCase().includes(q);

      // 2. Filter Status Progress
      const matchProgress = filterStatusProgress === 'ALL' || item.statusMaintenance === filterStatusProgress;

      // 3. Filter Tanggal & Tahun
      const dateToCheck = item.tanggalJadwal || item.tanggalRequest || '';
      const matchStartDate = !filterStatusStartDate || dateToCheck >= filterStatusStartDate;
      const matchEndDate = !filterStatusEndDate || dateToCheck <= filterStatusEndDate;
      const matchYear = filterStatusYear === 'ALL' || dateToCheck.startsWith(filterStatusYear);

      return matchSearch && matchProgress && matchStartDate && matchEndDate && matchYear;
    });
  }, [tickets, searchStatusItem, filterStatusProgress, filterStatusStartDate, filterStatusEndDate, filterStatusYear]);

  // Quick Action Update Status
  const handleQuickUpdateStatus = (ticketId, newStatus) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, statusMaintenance: newStatus } : t));
    showNotification && showNotification(`Status perbaikan diubah menjadi "${newStatus}"`, 'info');
  };

  const handleDeleteTicket = (ticketId, name) => {
    if (window.confirm(`Yakin ingin menghapus tiket maintenance "${name}"?`)) {
      setTickets(tickets.filter(t => t.id !== ticketId));
      showNotification && showNotification(`Tiket maintenance ${name} berhasil dihapus!`, 'info');
    }
  };

  // KPI Ringkasan
  const totalTickets = tickets.length;
  const waitingTickets = tickets.filter(t => t.statusMaintenance === 'Menunggu Maintenance' || t.statusMaintenance === 'Menunggu Jadwal Vendor').length;
  const inProgressTickets = tickets.filter(t => t.statusMaintenance === 'Sedang Dikerjakan').length;
  const completedTickets = tickets.filter(t => t.statusMaintenance === 'Selesai').length;
  const totalBiayaTerbayar = tickets.reduce((acc, t) => t.statusPembayaran === 'Lunas' ? acc + (Number(t.biaya) || 0) : acc, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#f1f5f9' }}>
      {/* HEADER SUB-MODUL MAINTENANCE */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#090d16',
          padding: '1rem 1.4rem',
          borderRadius: '14px',
          border: '1.5px solid #1e293b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Wrench size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Sistem Maintanance & Perbaikan Aset
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Pengajuan perbaikan barang, jadwal vendor servis, monitoring status, dan integrasi pengajuan dana ke Finance.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onSwitchTab && onSwitchTab('management-asset')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Package size={14} color="#10b981" /> Data Asset Perusahaan
          </button>
        </div>
      </div>

      {/* 4 KARTU KPI RINGKASAN MAINTENANCE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL TIKET MAINTENANCE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
            {totalTickets} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Tiket</span>
          </div>
        </div>

        <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>MENUNGGU TINDAKAN / VENDOR</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
            {waitingTickets} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Tiket</span>
          </div>
        </div>

        <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #34d399' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>SEDANG DALAM PENGERJAAN</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
            {inProgressTickets} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Tiket</span>
          </div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1.5px solid #10b981', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>BIAYA SELESAI & LUNAS</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
            {formatRupiah(totalBiayaTerbayar)}
          </div>
        </div>
      </div>

      {/* NAVIGASI 3 SUB-MODUL PERSIS SESUAI INSTRUKSI USER */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: '#090d16',
          padding: '6px',
          borderRadius: '12px',
          border: '1.5px solid #1e293b'
        }}
      >
        <button
          onClick={() => setActiveSubTab('request')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: activeSubTab === 'request' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeSubTab === 'request' ? '#ffffff' : '#94a3b8',
            border: activeSubTab === 'request' ? '1px solid #34d399' : 'none',
            boxShadow: activeSubTab === 'request' ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
          }}
        >
          <Plus size={16} />
          <span>1. Request Maintenance</span>
        </button>

        <button
          onClick={() => setActiveSubTab('jadwal')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: activeSubTab === 'jadwal' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeSubTab === 'jadwal' ? '#ffffff' : '#94a3b8',
            border: activeSubTab === 'jadwal' ? '1px solid #34d399' : 'none',
            boxShadow: activeSubTab === 'jadwal' ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
          }}
        >
          <Calendar size={16} />
          <span>2. Jadwal Maintenance & Biaya</span>
        </button>

        <button
          onClick={() => setActiveSubTab('status')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: activeSubTab === 'status' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeSubTab === 'status' ? '#ffffff' : '#94a3b8',
            border: activeSubTab === 'status' ? '1px solid #34d399' : 'none',
            boxShadow: activeSubTab === 'status' ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
          }}
        >
          <CheckCircle2 size={16} />
          <span>3. Status Maintenance (Monitoring)</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: REQUEST MAINTENANCE (PERMINTAAN PERBAIKAN DARI STAF / DIVISI)   */}
      {/* ===================================================================== */}
      {activeSubTab === 'request' && (
        <div>
          {/* Toolbar Sub-Modul 1 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '10px 14px',
              background: '#090d16',
              borderRadius: '10px',
              border: '1.5px solid #1e293b',
              marginBottom: '1rem'
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
              <Search size={15} color="#10b981" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari barang, kerusakan, lokasi, pemohon..."
                value={searchRequest}
                onChange={(e) => setSearchRequest(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                  height: '38px',
                  fontSize: '0.82rem',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={filterRequestStatus}
                onChange={(e) => setFilterRequestStatus(e.target.value)}
                style={{
                  height: '38px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '0 12px',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">Semua Status Tiket</option>
                <option value="Menunggu Maintenance">Menunggu Maintenance</option>
                <option value="Menunggu Jadwal Vendor">Menunggu Jadwal Vendor</option>
                <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                <option value="Selesai">Selesai</option>
              </select>

              <button
                onClick={handleOpenAddRequest}
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                }}
              >
                <Plus size={16} /> + Buat Request Maintenance Baru
              </button>
            </div>
          </div>

          {/* Tabel Daftar Permintaan Maintenance */}
          <div className="table-container" style={{ border: '1px solid #1e293b', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1050px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b' }}>
                  <th style={{ width: '45px', padding: '10px 8px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>No.</th>
                  <th style={{ width: '130px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>No. Tiket</th>
                  <th style={{ minWidth: '220px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama Barang / Asset</th>
                  <th style={{ minWidth: '240px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Jenis Kerusakan & Gejala</th>
                  <th style={{ width: '160px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Lokasi Asset</th>
                  <th style={{ width: '140px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Pemohon / Pelapor</th>
                  <th style={{ width: '100px', padding: '10px 10px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Urgensi</th>
                  <th style={{ width: '130px', padding: '10px 10px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ width: '130px', padding: '10px 10px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      <Wrench size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Tidak ada tiket request perbaikan</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Klik tombol "+ Buat Request Maintenance Baru" untuk menginput kerusakan barang.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((t, idx) => (
                    <tr
                      key={t.id || idx}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                        transition: 'background 0.15s'
                      }}
                    >
                      <td style={{ verticalAlign: 'middle', padding: '10px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
                        {idx + 1}
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', fontFamily: 'monospace', fontWeight: 800 }}>
                          {t.noDok || t.id}
                        </span>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
                          📅 {formatDisplayDate(t.tanggalRequest)}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.84rem' }}>
                          {t.namaBarang}
                        </div>
                        {t.assetId && (
                          <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Package size={11} /> Asset ID: {t.assetId}
                          </div>
                        )}
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 14px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, lineHeight: 1.4 }}>
                          ⚠️ {t.jenisKerusakan}
                        </div>
                        {t.catatan && (
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.3 }}>
                            {t.catatan}
                          </div>
                        )}
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                          <MapPin size={13} color="#10b981" />
                          <span>{t.lokasiAsset}</span>
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
                          {t.pemohon}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 10px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 800,
                            background: t.urgensi === 'Tinggi' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                            color: t.urgensi === 'Tinggi' ? '#f87171' : '#34d399',
                            border: `1px solid ${t.urgensi === 'Tinggi' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                          }}
                        >
                          {t.urgensi}
                        </span>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 10px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 800,
                            background: t.statusMaintenance === 'Selesai' ? 'rgba(16, 185, 129, 0.2)' :
                              t.statusMaintenance === 'Sedang Dikerjakan' ? 'rgba(52, 211, 153, 0.18)' :
                              'rgba(245, 158, 11, 0.18)',
                            color: t.statusMaintenance === 'Selesai' ? '#34d399' :
                              t.statusMaintenance === 'Sedang Dikerjakan' ? '#10b981' :
                              '#fbbf24',
                            border: `1px solid ${t.statusMaintenance === 'Selesai' ? '#10b981' : t.statusMaintenance === 'Sedang Dikerjakan' ? '#34d399' : '#f59e0b'}`
                          }}
                        >
                          {t.statusMaintenance}
                        </span>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
                          <button
                            onClick={() => handleOpenScheduleFromRequest(t)}
                            className="btn btn-sm"
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              border: '1px solid #10b981',
                              color: '#34d399',
                              padding: '4px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              borderRadius: '6px'
                            }}
                            title="Jadwalkan Vendor & Masukkan Biaya"
                          >
                            <Calendar size={12} /> Jadwal
                          </button>

                          <button
                            onClick={() => handleOpenEditRequest(t)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', fontSize: '0.72rem' }}
                            title="Edit Request"
                          >
                            <Edit3 size={12} />
                          </button>

                          <button
                            onClick={() => handleDeleteTicket(t.id, t.namaBarang)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                            title="Hapus Tiket"
                          >
                            <Trash2 size={12} />
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

      {/* ===================================================================== */}
      {/* TAB 2: JADWAL MAINTENANCE (NAMA VENDOR, BIAYA, KERUSAKAN, AKSI BAYAR)  */}
      {/* ===================================================================== */}
      {activeSubTab === 'jadwal' && (
        <div>
          {/* Toolbar Sub-Modul 2 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '10px 14px',
              background: '#090d16',
              borderRadius: '10px',
              border: '1.5px solid #1e293b',
              marginBottom: '1rem'
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
              <Search size={15} color="#10b981" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari barang, vendor, kerusakan, lokasi..."
                value={searchSchedule}
                onChange={(e) => setSearchSchedule(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                  height: '38px',
                  fontSize: '0.82rem',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={14} color="#10b981" />
              <span>Klik tombol <strong>"Bayar / Ajukan"</strong> untuk meneruskan dana ke Finance</span>
            </div>
          </div>

          {/* TABEL JADWAL MAINTENANCE SESUAI INSTRUKSI PERSIS DARI USER:
              Nama Vendor, Biaya, Jenis Kerusakan, Lokasi Asset, Aksi Bayar (ke Finance) */}
          <div className="table-container" style={{ border: '1px solid #1e293b', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b' }}>
                  <th style={{ width: '45px', padding: '10px 8px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>No.</th>
                  <th style={{ minWidth: '180px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama Vendor / Teknisi</th>
                  <th style={{ width: '150px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Biaya Perbaikan</th>
                  <th style={{ minWidth: '220px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Jenis Kerusakan & Barang</th>
                  <th style={{ width: '160px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Lokasi Asset</th>
                  <th style={{ width: '130px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Jadwal Servis</th>
                  <th style={{ width: '160px', padding: '10px 10px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi Bayar (Finance)</th>
                  <th style={{ width: '90px', padding: '10px 8px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredScheduleList.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      <Calendar size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Belum ada jadwal maintenance terdaftar</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Masuk ke tab "1. Request Maintenance" dan klik tombol "Jadwal" untuk mengatur vendor.</p>
                    </td>
                  </tr>
                ) : (
                  filteredScheduleList.map((t, idx) => (
                    <tr
                      key={t.id || idx}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                        transition: 'background 0.15s'
                      }}
                    >
                      <td style={{ verticalAlign: 'middle', padding: '10px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
                        {idx + 1}
                      </td>

                      {/* 1. Nama Vendor */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.84rem' }}>
                          {t.namaVendor || <span style={{ color: '#64748b', fontStyle: 'italic' }}>Belum ditentukan</span>}
                        </div>
                        {t.noRekening ? (
                          <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '2px', fontFamily: 'monospace' }}>
                            💳 {t.namaBank} {t.noRekening} (a.n {t.namaPenerima || t.namaVendor})
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                            Rekening belum diinput
                          </div>
                        )}
                      </td>

                      {/* 2. Biaya */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#34d399' }}>
                          {formatRupiah(t.biaya)}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: t.statusPembayaran === 'Lunas' ? '#10b981' : '#f59e0b', marginTop: '2px', fontWeight: 700 }}>
                          Status: {t.statusPembayaran}
                        </div>
                      </td>

                      {/* 3. Jenis Kerusakan & Barang */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.82rem' }}>
                          {t.jenisKerusakan}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px' }}>
                          📦 {t.namaBarang}
                        </div>
                      </td>

                      {/* 4. Lokasi Asset */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                          <MapPin size={13} color="#10b981" />
                          <span>{t.lokasiAsset}</span>
                        </div>
                      </td>

                      {/* 5. Tanggal Jadwal */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 700 }}>
                          {formatDisplayDate(t.tanggalJadwal)}
                        </div>
                      </td>

                      {/* 6. Aksi Bayar (Terkoneksi ke Pengajuan Dana Finance) */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 10px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleAksiBayarClick(t)}
                          style={{
                            background: t.statusPembayaran === 'Lunas' ? 'rgba(16, 185, 129, 0.22)' :
                              t.statusPembayaran === 'Diajukan ke Finance' ? 'rgba(52, 211, 153, 0.18)' :
                              'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: t.statusPembayaran === 'Lunas' ? '#34d399' :
                              t.statusPembayaran === 'Diajukan ke Finance' ? '#10b981' :
                              '#ffffff',
                            border: `1.5px solid ${t.statusPembayaran === 'Lunas' ? '#10b981' : t.statusPembayaran === 'Diajukan ke Finance' ? '#34d399' : '#059669'}`,
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: t.statusPembayaran === 'Pending' ? '0 3px 10px rgba(16, 185, 129, 0.35)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          title="Klik untuk proses bayar / ajukan ke Finance"
                        >
                          {t.statusPembayaran === 'Lunas' ? (
                            <>
                              <CheckCircle2 size={13} color="#34d399" />
                              <span>✓ Lunas (Cair)</span>
                            </>
                          ) : t.statusPembayaran === 'Diajukan ke Finance' ? (
                            <>
                              <Clock size={13} color="#10b981" />
                              <span>Menunggu Transfer</span>
                            </>
                          ) : (
                            <>
                              <DollarSign size={13} />
                              <span>💸 Aksi Bayar</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Aksi Tambahan */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleOpenScheduleFromRequest(t)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', fontSize: '0.72rem' }}
                            title="Edit Jadwal & Vendor"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(t.id, t.namaBarang)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                            title="Hapus"
                          >
                            <Trash2 size={12} />
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

      {/* ===================================================================== */}
      {/* TAB 3: STATUS MAINTENANCE (DENGAN FILTER TANGGAL, TAHUN, NAMA BARANG)   */}
      {/* ===================================================================== */}
      {activeSubTab === 'status' && (
        <div>
          {/* BILAH FILTER SUB-MODUL 3 PERSIS SESUAI INSTRUKSI USER:
              Filter Search Nama Barang, Filter Rentang Tanggal, Filter Tahun, Filter Status */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '12px 14px',
              background: '#090d16',
              borderRadius: '10px',
              border: '1.5px solid #1e293b',
              marginBottom: '1rem'
            }}
          >
            {/* Search Nama Barang */}
            <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '300px' }}>
              <Search size={15} color="#10b981" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari nama barang / aset..."
                value={searchStatusItem}
                onChange={(e) => setSearchStatusItem(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                  height: '38px',
                  fontSize: '0.82rem',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filter Rentang Tanggal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Calendar size={13} color="#10b981" /> Dari:
              </span>
              <input
                type="date"
                value={filterStatusStartDate}
                onChange={(e) => setFilterStatusStartDate(e.target.value)}
                style={{
                  height: '38px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '0 8px',
                  outline: 'none',
                  colorScheme: 'dark'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Sampai:</span>
              <input
                type="date"
                value={filterStatusEndDate}
                onChange={(e) => setFilterStatusEndDate(e.target.value)}
                style={{
                  height: '38px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '0 8px',
                  outline: 'none',
                  colorScheme: 'dark'
                }}
              />
            </div>

            {/* Filter Tahun */}
            <select
              value={filterStatusYear}
              onChange={(e) => setFilterStatusYear(e.target.value)}
              style={{
                height: '38px',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: '#0f172a',
                color: '#ffffff',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '0 10px',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">Semua Tahun</option>
              {availableYears.map((yr, i) => (
                <option key={i} value={yr}>Tahun {yr}</option>
              ))}
            </select>

            {/* Filter Status Progress (Menunggu maintenance, Menunggu jadwal vendor, Selesai) */}
            <select
              value={filterStatusProgress}
              onChange={(e) => setFilterStatusProgress(e.target.value)}
              style={{
                height: '38px',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: '#0f172a',
                color: '#ffffff',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '0 10px',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">Semua Status</option>
              <option value="Menunggu Maintenance">Menunggu Maintenance</option>
              <option value="Menunggu Jadwal Vendor">Menunggu Jadwal Vendor</option>
              <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
              <option value="Selesai">Selesai</option>
            </select>

            {/* Reset Filter Jika Aktif */}
            {(searchStatusItem || filterStatusStartDate || filterStatusEndDate || filterStatusYear !== 'ALL' || filterStatusProgress !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchStatusItem('');
                  setFilterStatusStartDate('');
                  setFilterStatusEndDate('');
                  setFilterStatusYear('ALL');
                  setFilterStatusProgress('ALL');
                }}
                style={{
                  height: '38px',
                  padding: '0 10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Reset Semua Filter"
              >
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>

          {/* TABEL STATUS MAINTENANCE */}
          <div className="table-container" style={{ border: '1px solid #1e293b', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b' }}>
                  <th style={{ width: '45px', padding: '10px 8px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>No.</th>
                  <th style={{ minWidth: '200px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama Barang / Asset</th>
                  <th style={{ minWidth: '220px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Jenis Kerusakan</th>
                  <th style={{ width: '160px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Lokasi Asset</th>
                  <th style={{ width: '170px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama Vendor</th>
                  <th style={{ width: '130px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Biaya (Rp)</th>
                  <th style={{ width: '180px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Status Maintenance</th>
                  <th style={{ width: '130px', padding: '10px 10px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Status Bayar</th>
                  <th style={{ width: '120px', padding: '10px 10px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStatusList.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      <CheckCircle2 size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Tidak ada data status maintenance sesuai filter</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Coba ubah filter tanggal, tahun, atau nama barang di atas.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStatusList.map((t, idx) => (
                    <tr
                      key={t.id || idx}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                        transition: 'background 0.15s'
                      }}
                    >
                      <td style={{ verticalAlign: 'middle', padding: '10px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
                        {idx + 1}
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.84rem' }}>
                          {t.namaBarang}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                          Tiket: {t.noDok || t.id}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 14px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                          {t.jenisKerusakan}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                          <MapPin size={13} color="#10b981" />
                          <span>{t.lokasiAsset}</span>
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 700 }}>
                          {t.namaVendor || '-'}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#34d399' }}>
                          {formatRupiah(t.biaya)}
                        </div>
                      </td>

                      {/* Status Maintenance */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 12px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: t.statusMaintenance === 'Selesai' ? 'rgba(16, 185, 129, 0.22)' :
                              t.statusMaintenance === 'Sedang Dikerjakan' ? 'rgba(52, 211, 153, 0.18)' :
                              'rgba(245, 158, 11, 0.18)',
                            color: t.statusMaintenance === 'Selesai' ? '#34d399' :
                              t.statusMaintenance === 'Sedang Dikerjakan' ? '#10b981' :
                              '#fbbf24',
                            border: `1px solid ${t.statusMaintenance === 'Selesai' ? '#10b981' : t.statusMaintenance === 'Sedang Dikerjakan' ? '#34d399' : '#f59e0b'}`
                          }}
                        >
                          {t.statusMaintenance === 'Selesai' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                          <span>{t.statusMaintenance}</span>
                        </span>
                      </td>

                      {/* Status Pembayaran Finance */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 10px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 800,
                            background: t.statusPembayaran === 'Lunas' ? 'rgba(16, 185, 129, 0.2)' :
                              t.statusPembayaran === 'Diajukan ke Finance' ? 'rgba(52, 211, 153, 0.15)' :
                              'rgba(239, 68, 68, 0.15)',
                            color: t.statusPembayaran === 'Lunas' ? '#34d399' :
                              t.statusPembayaran === 'Diajukan ke Finance' ? '#10b981' :
                              '#f87171',
                            border: `1px solid ${t.statusPembayaran === 'Lunas' ? '#10b981' : t.statusPembayaran === 'Diajukan ke Finance' ? '#34d399' : '#ef4444'}`
                          }}
                        >
                          {t.statusPembayaran}
                        </span>
                      </td>

                      {/* Aksi Ubah Status Cepat */}
                      <td style={{ verticalAlign: 'middle', padding: '10px 10px', textAlign: 'center' }}>
                        <select
                          value={t.statusMaintenance}
                          onChange={(e) => handleQuickUpdateStatus(t.id, e.target.value)}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: '#0f172a',
                            color: '#ffffff',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            padding: '3px 6px',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Menunggu Maintenance">Menunggu Maintenance</option>
                          <option value="Menunggu Jadwal Vendor">Menunggu Jadwal Vendor</option>
                          <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: FORM INPUT / EDIT REQUEST MAINTENANCE                        */}
      {/* ===================================================================== */}
      {isRequestModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #10b981',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: '1px solid #1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: 900, fontSize: '1rem' }}>
                <Wrench size={18} color="#10b981" />
                <span>{editingRequest ? 'Edit Request Maintenance' : 'Buat Permintaan Perbaikan (Request Maintenance)'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveRequest} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Pilih dari Management Asset (Opsional untuk integrasi) */}
                {assetsList.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Pilih dari Data Asset Perusahaan (Opsional)
                    </label>
                    <select
                      value={requestForm.assetId}
                      onChange={(e) => handleSelectAsset(e.target.value)}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#34d399',
                        padding: '0 10px',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <option value="">-- Pilih Asset Terdaftar atau Ketik Manual di Bawah --</option>
                      {assetsList.map((a, i) => (
                        <option key={i} value={a.id || a.noDok}>
                          [{a.noDok || a.id}] {a.namaAsset || a.judulDokumen} ({a.lokasiAsset || a.project})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Nama Barang / Aset */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Nama Barang / Aset yang Rusak <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: AC Daikin 2 PK, Toyota Hilux B 9102 GA, Genset Denyo..."
                    value={requestForm.namaBarang}
                    onChange={(e) => setRequestForm({ ...requestForm, namaBarang: e.target.value })}
                    style={{
                      width: '100%',
                      height: '38px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '0 12px',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                {/* Lokasi Asset & Tanggal Request */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Lokasi Asset <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={requestForm.lokasiAsset}
                      onChange={(e) => setRequestForm({ ...requestForm, lokasiAsset: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 10px',
                        fontSize: '0.82rem'
                      }}
                    >
                      <option value="Head Office Bizhub">Head Office Bizhub Commercial</option>
                      <option value="Ashoka Park">Ashoka Park (Marketing Gallery & Cluster)</option>
                      <option value="Ashoka View">Ashoka View (Proyek Lapangan)</option>
                      <option value="Grand Permata">Grand Permata</option>
                      <option value="Pondok Permata">Pondok Permata</option>
                      <option value="Kantor Operasional">Kantor Operasional Lapangan</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Tanggal Pengajuan Request
                    </label>
                    <input
                      type="date"
                      value={requestForm.tanggalRequest}
                      onChange={(e) => setRequestForm({ ...requestForm, tanggalRequest: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 10px',
                        fontSize: '0.82rem',
                        colorScheme: 'dark'
                      }}
                    />
                  </div>
                </div>

                {/* Jenis Kerusakan */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Jenis Kerusakan & Keluhan <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: AC Mati / Tidak Dingin, Rem Bunyi Kasar, Layar Mati, Pipa Bocor..."
                    value={requestForm.jenisKerusakan}
                    onChange={(e) => setRequestForm({ ...requestForm, jenisKerusakan: e.target.value })}
                    style={{
                      width: '100%',
                      height: '38px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#34d399',
                      padding: '0 12px',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}
                  />
                </div>

                {/* Pemohon & Urgensi */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Nama Pemohon / Pelapor
                    </label>
                    <input
                      type="text"
                      placeholder="Nama staf / mandor / divisi"
                      value={requestForm.pemohon}
                      onChange={(e) => setRequestForm({ ...requestForm, pemohon: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 12px',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Tingkat Urgensi
                    </label>
                    <select
                      value={requestForm.urgensi}
                      onChange={(e) => setRequestForm({ ...requestForm, urgensi: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 10px',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <option value="Tinggi">Tinggi / Mendesak (Segera)</option>
                      <option value="Normal">Normal / Standar</option>
                      <option value="Rendah">Rendah (Dapat Ditunda)</option>
                    </select>
                  </div>
                </div>

                {/* Catatan / Keterangan Tambahan */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Keterangan Gejala / Catatan Tambahan
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Tuliskan detail kronologi atau gejala kerusakan barang..."
                    value={requestForm.catatan}
                    onChange={(e) => setRequestForm({ ...requestForm, catatan: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Tombol Simpan */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Check size={15} /> Simpan Request Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: FORM JADWAL MAINTENANCE, VENDOR, BIAYA & REKENING BANK       */}
      {/* ===================================================================== */}
      {isScheduleModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #10b981',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: '1px solid #1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: 900, fontSize: '1rem' }}>
                <Calendar size={18} color="#10b981" />
                <span>Atur Jadwal Vendor, Biaya & Rekening Bank Perbaikan</span>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Info Ringkas Barang & Kerusakan */}
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Barang yang diperbaiki:</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                    {scheduleForm.namaBarang}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>
                    ⚠️ {scheduleForm.jenisKerusakan} • Lokasi: {scheduleForm.lokasiAsset}
                  </div>
                </div>

                {/* Nama Vendor / Teknisi & Tanggal Pelaksanaan */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Nama Vendor / Teknisi <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Auto2000, CV Sejuk Abadi, Pak Joko..."
                      value={scheduleForm.namaVendor}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, namaVendor: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 12px',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Tanggal / Jadwal Perbaikan
                    </label>
                    <input
                      type="date"
                      value={scheduleForm.tanggalJadwal}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, tanggalJadwal: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 10px',
                        fontSize: '0.82rem',
                        colorScheme: 'dark'
                      }}
                    />
                  </div>
                </div>

                {/* Biaya Perbaikan (Rp) - Bersih dari angka 0 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Biaya Perbaikan / Estimasi Biaya (Rp) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10b981', fontWeight: 800, fontSize: '0.82rem' }}>
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Masukkan nominal biaya..."
                      value={scheduleForm.biaya === 0 ? '' : scheduleForm.biaya}
                      onFocus={(e) => {
                        if (e.target.value === '0') setScheduleForm({ ...scheduleForm, biaya: '' });
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        setScheduleForm({ ...scheduleForm, biaya: val === '' ? '' : Math.max(0, Number(val)) });
                      }}
                      style={{
                        width: '100%',
                        height: '38px',
                        paddingLeft: '38px',
                        paddingRight: '12px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#34d399',
                        fontSize: '0.86rem',
                        fontWeight: 800
                      }}
                    />
                  </div>
                  {scheduleForm.biaya && Number(scheduleForm.biaya) > 0 && (
                    <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '3px' }}>
                      Terbilang: {formatRupiah(Number(scheduleForm.biaya))}
                    </div>
                  )}
                </div>

                {/* REKENING TUJUAN TRANSFER VENDOR (UNTUK FINANCE) */}
                <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} /> REKENING VENDOR (UNTUK PENCAIRAN FINANCE)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>Nama Bank</label>
                      <select
                        value={scheduleForm.namaBank}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, namaBank: e.target.value })}
                        style={{ width: '100%', height: '36px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', padding: '0 8px', fontSize: '0.8rem' }}
                      >
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="BRI">BRI</option>
                        <option value="BNI">BNI</option>
                        <option value="BSI">BSI (Syariah)</option>
                        <option value="CIMB">CIMB Niaga</option>
                        <option value="Permata">Permata</option>
                        <option value="Tunai / Kasir">Tunai (Petty Cash)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>Nomor Rekening</label>
                      <input
                        type="text"
                        placeholder="Contoh: 002-881-9921"
                        value={scheduleForm.noRekening}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, noRekening: e.target.value })}
                        style={{ width: '100%', height: '36px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', padding: '0 8px', fontSize: '0.8rem', fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>Nama Penerima</label>
                      <input
                        type="text"
                        placeholder="Atas nama rekening"
                        value={scheduleForm.namaPenerima}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, namaPenerima: e.target.value })}
                        style={{ width: '100%', height: '36px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', padding: '0 8px', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Maintenance */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Status Pekerjaan Maintenance
                  </label>
                  <select
                    value={scheduleForm.statusMaintenance}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, statusMaintenance: e.target.value })}
                    style={{
                      width: '100%',
                      height: '38px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#34d399',
                      padding: '0 10px',
                      fontSize: '0.82rem',
                      fontWeight: 800
                    }}
                  >
                    <option value="Menunggu Jadwal Vendor">Menunggu Jadwal Vendor</option>
                    <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              {/* Tombol Simpan */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Check size={15} /> Simpan Jadwal & Biaya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: KONFIRMASI AKSI BAYAR KE FINANCE                             */}
      {/* ===================================================================== */}
      {paymentConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #10b981',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '22px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.85)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Konfirmasi Pengajuan Pembayaran ke Finance
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Permintaan dana akan langsung diteruskan ke modul Finance & Accounting
                </div>
              </div>
            </div>

            <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94a3b8' }}>Barang yang diperbaiki:</span>
                <span style={{ color: '#ffffff', fontWeight: 800 }}>{paymentConfirmModal.namaBarang}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94a3b8' }}>Jenis Kerusakan:</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>{paymentConfirmModal.jenisKerusakan}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94a3b8' }}>Vendor / Penerima:</span>
                <span style={{ color: '#f8fafc', fontWeight: 800 }}>{paymentConfirmModal.namaVendor || '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94a3b8' }}>Rekening Transfer:</span>
                <span style={{ color: '#34d399', fontFamily: 'monospace', fontWeight: 700 }}>
                  {paymentConfirmModal.namaBank || 'BCA'} {paymentConfirmModal.noRekening || '-'}
                </span>
              </div>
              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 800 }}>Nominal Pencairan:</span>
                <span style={{ fontSize: '1.15rem', color: '#34d399', fontWeight: 900 }}>
                  {formatRupiah(paymentConfirmModal.biaya)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPaymentConfirmModal(null)}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSendPaymentToFinance}
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.45)'
                }}
              >
                <Send size={14} /> Kirim Pengajuan ke Finance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
