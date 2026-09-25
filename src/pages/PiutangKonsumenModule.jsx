import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  CreditCard,
  Calendar,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Printer,
  ArrowDownCircle,
  FileText,
  Building2,
  Filter,
  RotateCcw,
  Eye,
  Download,
  AlertCircle,
  User,
  X,
  Clock,
  Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchCloudStore, saveCloudStore } from '../supabase';

const STORAGE_KEY_PIUTANG = 'ams_piutang_konsumen_v1';

// Initial realistic default data linked with Ashoka projects & sales
const initialPiutangData = [
  {
    id: 'PTG-001',
    namaKonsumen: 'Budi Santoso',
    proyek: 'Ashoka View',
    type: 'Type 36/60',
    blok: 'A',
    noUnit: '01',
    lb: 36,
    lt: 60,
    ltPlus: 0,
    hargaJual: 450000000,
    disc: 15000000,
    booking: 10000000,
    periode: '2026-09',
    catatan: 'Pembelian unit A-01 Ashoka View. Cash bertahap.',
    dpPayments: [
      { id: 'dp-1', tanggal: '2026-09-02', jumlah: 25000000, keterangan: 'DP Tahap 1 - Transfer Bank Mandiri' },
      { id: 'dp-2', tanggal: '2026-09-16', jumlah: 20000000, keterangan: 'DP Tahap 2 - Pelunasan Uang Muka' }
    ],
    angsuranPayments: [
      { id: 'ang-1', tanggal: '2026-09-22', jumlah: 30000000, keterangan: 'Angsuran 1 - Cash Bertahap' }
    ]
  },
  {
    id: 'PTG-002',
    namaKonsumen: 'Siti Rahmawati',
    proyek: 'Ashoka Park',
    type: 'Type 60/100',
    blok: 'B',
    noUnit: '03',
    lb: 60,
    lt: 100,
    ltPlus: 12,
    hargaJual: 650000000,
    disc: 0,
    booking: 15000000,
    periode: '2026-09',
    catatan: 'Unit hook B-03 kelebihan tanah 12m2. Skema KPR Bank BTN.',
    dpPayments: [
      { id: 'dp-3', tanggal: '2026-09-05', jumlah: 50000000, keterangan: 'DP Tahap 1 - Transfer BCA' }
    ],
    angsuranPayments: [
      { id: 'ang-2', tanggal: '2026-09-20', jumlah: 85000000, keterangan: 'Pencairan KPR Bank Tahap 1' }
    ]
  },
  {
    id: 'PTG-003',
    namaKonsumen: 'Hendra Gunawan',
    proyek: 'Ashoka View',
    type: 'Type 45/84',
    blok: 'B',
    noUnit: '05',
    lb: 45,
    lt: 84,
    ltPlus: 0,
    hargaJual: 520000000,
    disc: 10000000,
    booking: 10000000,
    periode: '2026-08',
    catatan: 'Pelunasan unit B-05 Ashoka View.',
    dpPayments: [
      { id: 'dp-4', tanggal: '2026-08-15', jumlah: 50000000, keterangan: 'DP Full Lunas' }
    ],
    angsuranPayments: [
      { id: 'ang-3', tanggal: '2026-09-10', jumlah: 450000000, keterangan: 'Pelunasan KPR Bank Mandiri 100%' }
    ]
  }
];

export const PiutangKonsumenModule = () => {
  const { showNotification } = useApp();

  // Primary list state with LocalStorage + Cloud Store sync
  const [piutangList, setPiutangList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PIUTANG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialPiutangData;
  });

  // Fetch from MySQL Cloud Store on Mount
  useEffect(() => {
    fetchCloudStore(STORAGE_KEY_PIUTANG, null).then((val) => {
      if (val && Array.isArray(val) && val.length > 0) {
        setPiutangList(val);
      }
    });
  }, []);

  // Sync back to LocalStorage & MySQL
  const persistPiutangList = (newList) => {
    setPiutangList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_PIUTANG, JSON.stringify(newList));
    } catch (e) {}
    saveCloudStore(STORAGE_KEY_PIUTANG, newList);
  };

  // Top Filter States (as seen in user spreadsheet screenshot)
  const [filterProyek, setFilterProyek] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterBlok, setFilterBlok] = useState('ALL');
  const [filterBulan, setFilterBulan] = useState('ALL'); // 'ALL' | '01'..'12'
  const [filterTahun, setFilterTahun] = useState('ALL'); // 'ALL' | '2025'..'2028'
  const [searchTerm, setSearchTerm] = useState('');

  // Payment Modal State
  const [activePaymentRow, setActivePaymentRow] = useState(null);
  const [paymentSubTab, setPaymentSubTab] = useState('dp'); // 'dp' | 'angsuran'

  // Input states for New DP Payment
  const [newDpDate, setNewDpDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDpNominal, setNewDpNominal] = useState('');
  const [newDpKeterangan, setNewDpKeterangan] = useState('');

  // Input states for New Angsuran Payment
  const [newAngsuranDate, setNewAngsuranDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAngsuranNominal, setNewAngsuranNominal] = useState('');
  const [newAngsuranKeterangan, setNewAngsuranKeterangan] = useState('');

  // Add/Edit Row Modal State
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [rowFormData, setRowFormData] = useState({
    namaKonsumen: '',
    proyek: 'Ashoka View',
    type: 'Type 36/60',
    blok: 'A',
    noUnit: '',
    lb: 36,
    lt: 60,
    ltPlus: 0,
    hargaJual: 450000000,
    disc: 0,
    booking: 10000000,
    periode: new Date().toISOString().slice(0, 7),
    catatan: ''
  });

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState(null);
  const [kwitansiSelectRow, setKwitansiSelectRow] = useState(null);

  // Formatting helpers
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatNumber = (val) => {
    if (val === null || val === undefined || val === '') return '0';
    return Number(val).toLocaleString('en-US');
  };

  const formatMonthYear = (periodeStr) => {
    if (!periodeStr) return '';
    const parts = periodeStr.split('-');
    if (parts.length < 2) return periodeStr;
    const year = parts[0];
    const month = parts[1];
    const monthNames = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
      '05': 'Mei', '06': 'Jun', '07': 'Jul', '08': 'Agt',
      '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des'
    };
    return `${monthNames[month] || month} ${year}`;
  };

  // Dynamic Years for Filter Options
  const tahunOptions = useMemo(() => {
    const years = new Set(['2024', '2025', '2026', '2027', '2028']);
    piutangList.forEach((p) => {
      if (p.periode) {
        const y = p.periode.split('-')[0];
        if (y && y.length === 4) years.add(y);
      }
      (p.dpPayments || []).forEach((dp) => {
        if (dp.tanggal) {
          const y = dp.tanggal.split('-')[0];
          if (y && y.length === 4) years.add(y);
        }
      });
      (p.angsuranPayments || []).forEach((ang) => {
        if (ang.tanggal) {
          const y = ang.tanggal.split('-')[0];
          if (y && y.length === 4) years.add(y);
        }
      });
    });
    return Array.from(years).sort();
  }, [piutangList]);

  // Calculated Row Values
  const getCalculatedRow = (item) => {
    const hargaJual = Number(item.hargaJual || 0);
    const disc = Number(item.disc || 0);
    const hargaJualNet = Math.max(0, hargaJual - disc);
    const booking = Number(item.booking || 0);

    const totalDp = (item.dpPayments || []).reduce((sum, p) => sum + (Number(p.jumlah) || 0), 0);
    const sisaPembayaran = Math.max(0, hargaJualNet - booking - totalDp);

    const totalAngsuran = (item.angsuranPayments || []).reduce((sum, p) => sum + (Number(p.jumlah) || 0), 0);
    const saldo = Math.max(0, sisaPembayaran - totalAngsuran);

    const ltTotal = Number(item.lt || 0) + Number(item.ltPlus || 0);
    const totalLbLt = `${item.lb || 0} / ${ltTotal}`;

    return {
      ...item,
      hargaJual,
      disc,
      hargaJualNet,
      booking,
      totalDp,
      sisaPembayaran,
      totalAngsuran,
      saldo,
      ltTotal,
      totalLbLt
    };
  };

  // Filtered Rows (Filtering Proyek, Type, Blok, Bulan, Tahun, Search)
  const filteredRows = useMemo(() => {
    return piutangList
      .map(getCalculatedRow)
      .filter((row) => {
        if (filterProyek !== 'ALL' && row.proyek !== filterProyek) return false;
        if (filterType !== 'ALL' && row.type !== filterType) return false;
        if (filterBlok !== 'ALL' && row.blok !== filterBlok) return false;

        // Filter Periode (Bulan & Tahun)
        if (filterTahun !== 'ALL' || filterBulan !== 'ALL') {
          if (filterTahun !== 'ALL' && filterBulan !== 'ALL') {
            const targetPeriod = `${filterTahun}-${filterBulan}`;
            const matchRow = row.periode?.startsWith(targetPeriod);
            const matchDp = (row.dpPayments || []).some((p) => p.tanggal?.startsWith(targetPeriod));
            const matchAng = (row.angsuranPayments || []).some((p) => p.tanggal?.startsWith(targetPeriod));
            if (!matchRow && !matchDp && !matchAng) return false;
          } else if (filterTahun !== 'ALL') {
            const matchRow = row.periode?.startsWith(filterTahun);
            const matchDp = (row.dpPayments || []).some((p) => p.tanggal?.startsWith(filterTahun));
            const matchAng = (row.angsuranPayments || []).some((p) => p.tanggal?.startsWith(filterTahun));
            if (!matchRow && !matchDp && !matchAng) return false;
          } else if (filterBulan !== 'ALL') {
            const matchRow = row.periode ? row.periode.split('-')[1] === filterBulan : false;
            const matchDp = (row.dpPayments || []).some((p) => p.tanggal?.split('-')[1] === filterBulan);
            const matchAng = (row.angsuranPayments || []).some((p) => p.tanggal?.split('-')[1] === filterBulan);
            if (!matchRow && !matchDp && !matchAng) return false;
          }
        }

        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          const match =
            (row.namaKonsumen || '').toLowerCase().includes(s) ||
            (row.proyek || '').toLowerCase().includes(s) ||
            (row.blok || '').toLowerCase().includes(s) ||
            (row.noUnit || '').toLowerCase().includes(s) ||
            (row.type || '').toLowerCase().includes(s);
          if (!match) return false;
        }

        return true;
      });
  }, [piutangList, filterProyek, filterType, filterBlok, filterBulan, filterTahun, searchTerm]);

  // Aggregate Totals for Table Footer
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => {
        acc.hargaJual += r.hargaJual;
        acc.disc += r.disc;
        acc.hargaJualNet += r.hargaJualNet;
        acc.booking += r.booking;
        acc.dp += r.totalDp;
        acc.sisaPembayaran += r.sisaPembayaran;
        acc.angsuran += r.totalAngsuran;
        acc.saldo += r.saldo;
        return acc;
      },
      {
        hargaJual: 0,
        disc: 0,
        hargaJualNet: 0,
        booking: 0,
        dp: 0,
        sisaPembayaran: 0,
        angsuran: 0,
        saldo: 0
      }
    );
  }, [filteredRows]);

  // Unique Filter Options
  const proyekOptions = Array.from(new Set(piutangList.map((p) => p.proyek))).filter(Boolean);
  const typeOptions = Array.from(new Set(piutangList.map((p) => p.type))).filter(Boolean);
  const blokOptions = Array.from(new Set(piutangList.map((p) => p.blok))).filter(Boolean);

  // Sync from Marketing Closing Database
  const handleSyncFromSales = () => {
    try {
      const salesRaw = localStorage.getItem('ams_sales_list_clean_v2');
      const sales = salesRaw ? JSON.parse(salesRaw) : [];
      let addedCount = 0;

      const updated = [...piutangList];
      sales.forEach((s) => {
        const exists = updated.some(
          (p) =>
            p.namaKonsumen?.toLowerCase() === (s.customerName || '').toLowerCase() &&
            p.noUnit?.toLowerCase() === (s.unitNo || '').toLowerCase()
        );
        if (!exists && s.customerName) {
          addedCount++;
          const unitParts = (s.unitNo || '').split('-');
          const blok = unitParts[0] || 'A';
          const noUnit = unitParts[1] || '01';

          updated.push({
            id: `PTG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            namaKonsumen: s.customerName,
            proyek: s.cluster?.includes('Emerald') ? 'Ashoka Park' : 'Ashoka View',
            type: 'Type 45/90',
            blok: blok.replace(/[^A-Za-z0-9]/g, ''),
            noUnit: noUnit.replace(/[^A-Za-z0-9]/g, ''),
            lb: 45,
            lt: 90,
            ltPlus: 0,
            hargaJual: Number(s.hargaUnit) || 500000000,
            disc: 0,
            booking: Number(s.bookingFee) || 10000000,
            periode: s.bookingDate ? s.bookingDate.slice(0, 7) : new Date().toISOString().slice(0, 7),
            catatan: `Sinkronisasi dari Transaksi SPR: ${s.salesId || s.id}`,
            dpPayments: [],
            angsuranPayments: []
          });
        }
      });

      if (addedCount > 0) {
        persistPiutangList(updated);
        showNotification(`Berhasil menyinkronkan ${addedCount} data konsumen baru ke Piutang!`, 'success');
      } else {
        showNotification('Semua data transaksi closing sudah tercatat di Piutang Konsumen.', 'info');
      }
    } catch (e) {
      showNotification('Gagal menyinkronkan data: ' + e.message, 'danger');
    }
  };

  // Open Payment Modal
  const handleOpenPaymentModal = (item, defaultTab = 'dp') => {
    setActivePaymentRow(getCalculatedRow(item));
    setPaymentSubTab(defaultTab);
    setNewDpNominal('');
    setNewDpKeterangan('');
    setNewAngsuranNominal('');
    setNewAngsuranKeterangan('');
  };

  // Add DP Payment
  const handleAddDpPayment = (e) => {
    e.preventDefault();
    if (!activePaymentRow) return;

    const raw = (newDpNominal || '').toString().replace(/[^0-9]/g, '');
    const nominal = parseInt(raw, 10);
    if (!nominal || nominal <= 0) {
      showNotification('Masukkan jumlah nominal pembayaran DP yang valid!', 'warning');
      return;
    }

    const newPayment = {
      id: `dp-${Date.now()}`,
      tanggal: newDpDate || new Date().toISOString().split('T')[0],
      jumlah: nominal,
      keterangan: newDpKeterangan.trim() || 'Pembayaran DP'
    };

    const updatedList = piutangList.map((item) => {
      if (item.id === activePaymentRow.id) {
        const dpPayments = [...(item.dpPayments || []), newPayment];
        return { ...item, dpPayments };
      }
      return item;
    });

    persistPiutangList(updatedList);
    const updatedRow = updatedList.find((i) => i.id === activePaymentRow.id);
    setActivePaymentRow(getCalculatedRow(updatedRow));
    setNewDpNominal('');
    setNewDpKeterangan('');
    showNotification(`Pembayaran DP sebesar ${formatRupiah(nominal)} berhasil dicatat!`, 'success');
  };

  // Delete DP Payment
  const handleDeleteDpPayment = (paymentId) => {
    if (!window.confirm('Yakin ingin menghapus riwayat pembayaran DP ini?')) return;
    const updatedList = piutangList.map((item) => {
      if (item.id === activePaymentRow.id) {
        const dpPayments = (item.dpPayments || []).filter((p) => p.id !== paymentId);
        return { ...item, dpPayments };
      }
      return item;
    });

    persistPiutangList(updatedList);
    const updatedRow = updatedList.find((i) => i.id === activePaymentRow.id);
    setActivePaymentRow(getCalculatedRow(updatedRow));
    showNotification('Riwayat pembayaran DP berhasil dihapus.', 'info');
  };

  // Add Angsuran Payment
  const handleAddAngsuranPayment = (e) => {
    e.preventDefault();
    if (!activePaymentRow) return;

    const raw = (newAngsuranNominal || '').toString().replace(/[^0-9]/g, '');
    const nominal = parseInt(raw, 10);
    if (!nominal || nominal <= 0) {
      showNotification('Masukkan jumlah nominal angsuran yang valid!', 'warning');
      return;
    }

    const newPayment = {
      id: `ang-${Date.now()}`,
      tanggal: newAngsuranDate || new Date().toISOString().split('T')[0],
      jumlah: nominal,
      keterangan: newAngsuranKeterangan.trim() || 'Pembayaran Angsuran'
    };

    const updatedList = piutangList.map((item) => {
      if (item.id === activePaymentRow.id) {
        const angsuranPayments = [...(item.angsuranPayments || []), newPayment];
        return { ...item, angsuranPayments };
      }
      return item;
    });

    persistPiutangList(updatedList);
    const updatedRow = updatedList.find((i) => i.id === activePaymentRow.id);
    setActivePaymentRow(getCalculatedRow(updatedRow));
    setNewAngsuranNominal('');
    setNewAngsuranKeterangan('');
    showNotification(`Pembayaran Angsuran sebesar ${formatRupiah(nominal)} berhasil dicatat!`, 'success');
  };

  // Delete Angsuran Payment
  const handleDeleteAngsuranPayment = (paymentId) => {
    if (!window.confirm('Yakin ingin menghapus riwayat pembayaran angsuran ini?')) return;
    const updatedList = piutangList.map((item) => {
      if (item.id === activePaymentRow.id) {
        const angsuranPayments = (item.angsuranPayments || []).filter((p) => p.id !== paymentId);
        return { ...item, angsuranPayments };
      }
      return item;
    });

    persistPiutangList(updatedList);
    const updatedRow = updatedList.find((i) => i.id === activePaymentRow.id);
    setActivePaymentRow(getCalculatedRow(updatedRow));
    showNotification('Riwayat pembayaran angsuran berhasil dihapus.', 'info');
  };

  // Open Add / Edit Row Modal
  const handleOpenAddRow = () => {
    setEditingRowId(null);
    setRowFormData({
      namaKonsumen: '',
      proyek: 'Ashoka View',
      type: 'Type 36/60',
      blok: 'A',
      noUnit: '',
      lb: 36,
      lt: 60,
      ltPlus: 0,
      hargaJual: 450000000,
      disc: 0,
      booking: 10000000,
      periode: new Date().toISOString().slice(0, 7),
      catatan: ''
    });
    setIsRowModalOpen(true);
  };

  const handleOpenEditRow = (item) => {
    setEditingRowId(item.id);
    setRowFormData({
      namaKonsumen: item.namaKonsumen || '',
      proyek: item.proyek || 'Ashoka View',
      type: item.type || 'Type 36/60',
      blok: item.blok || 'A',
      noUnit: item.noUnit || '',
      lb: item.lb || 36,
      lt: item.lt || 60,
      ltPlus: item.ltPlus || 0,
      hargaJual: item.hargaJual || 0,
      disc: item.disc || 0,
      booking: item.booking || 0,
      periode: item.periode || new Date().toISOString().slice(0, 7),
      catatan: item.catatan || ''
    });
    setIsRowModalOpen(true);
  };

  const handleSaveRow = (e) => {
    e.preventDefault();
    if (!rowFormData.namaKonsumen.trim()) {
      showNotification('Nama konsumen wajib diisi!', 'warning');
      return;
    }

    if (editingRowId) {
      const updated = piutangList.map((item) => {
        if (item.id === editingRowId) {
          return {
            ...item,
            ...rowFormData,
            lb: Number(rowFormData.lb) || 0,
            lt: Number(rowFormData.lt) || 0,
            ltPlus: Number(rowFormData.ltPlus) || 0,
            hargaJual: Number(rowFormData.hargaJual) || 0,
            disc: Number(rowFormData.disc) || 0,
            booking: Number(rowFormData.booking) || 0
          };
        }
        return item;
      });
      persistPiutangList(updated);
      showNotification('Data Piutang Konsumen berhasil diperbarui!', 'success');
    } else {
      const newEntry = {
        id: `PTG-${Date.now()}`,
        ...rowFormData,
        lb: Number(rowFormData.lb) || 0,
        lt: Number(rowFormData.lt) || 0,
        ltPlus: Number(rowFormData.ltPlus) || 0,
        hargaJual: Number(rowFormData.hargaJual) || 0,
        disc: Number(rowFormData.disc) || 0,
        booking: Number(rowFormData.booking) || 0,
        dpPayments: [],
        angsuranPayments: []
      };
      persistPiutangList([newEntry, ...piutangList]);
      showNotification('Data Piutang Konsumen baru berhasil ditambahkan!', 'success');
    }

    setIsRowModalOpen(false);
  };

  const handleDeleteRow = (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus data piutang untuk konsumen "${name}"?`)) return;
    const updated = piutangList.filter((item) => item.id !== id);
    persistPiutangList(updated);
    showNotification('Data piutang konsumen berhasil dihapus.', 'info');
  };

  // Helper Terbilang Bahasa Indonesia
  const terbilang = (n) => {
    const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    const num = Math.floor(Math.abs(Number(n) || 0));
    if (num === 0) return 'Nol Rupiah';

    const convert = (x) => {
      if (x < 12) return bilangan[x];
      if (x < 20) return convert(x - 10) + ' Belas';
      if (x < 100) return convert(Math.floor(x / 10)) + ' Puluh' + (x % 10 !== 0 ? ' ' + convert(x % 10) : '');
      if (x < 200) return 'Seratus' + (x - 100 !== 0 ? ' ' + convert(x - 100) : '');
      if (x < 1000) return convert(Math.floor(x / 100)) + ' Ratus' + (x % 100 !== 0 ? ' ' + convert(x % 100) : '');
      if (x < 2000) return 'Seribu' + (x - 1000 !== 0 ? ' ' + convert(x - 1000) : '');
      if (x < 1000000) return convert(Math.floor(x / 1000)) + ' Ribu' + (x % 1000 !== 0 ? ' ' + convert(x % 1000) : '');
      if (x < 1000000000) return convert(Math.floor(x / 1000000)) + ' Juta' + (x % 1000000 !== 0 ? ' ' + convert(x % 1000000) : '');
      if (x < 1000000000000) return convert(Math.floor(x / 1000000000)) + ' Milyar' + (x % 1000000000 !== 0 ? ' ' + convert(x % 1000000000) : '');
      return convert(Math.floor(x / 1000000000000)) + ' Triliun' + (x % 1000000000000 !== 0 ? ' ' + convert(x % 1000000000000) : '');
    };

    return convert(num).trim() + ' Rupiah';
  };

  const formatTanggalIndo = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parts[0];
    return `${day} ${monthNames[month] || month} ${year}`;
  };

  const generateKwitansiPrintHtml = ({ payment, type, row, kwitansiNo }) => {
    const terbilangText = terbilang(payment.jumlah);
    const tanggalIndo = formatTanggalIndo(payment.tanggal || new Date().toISOString().split('T')[0]);
    const companyName = row.proyek?.includes('Park') ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Kwitansi - ${kwitansiNo} - ${row.namaKonsumen}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 15mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Times, serif;
      background: #ffffff;
      color: #000000;
      margin: 0;
      padding: 15px;
    }
    .kwitansi-card {
      border: 3px double #92400e;
      border-radius: 8px;
      padding: 24px 30px;
      background: #ffffff;
      max-width: 820px;
      margin: 0 auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .k-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #b45309;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .company-name {
      font-size: 20px;
      font-weight: 900;
      color: #92400e;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .company-sub {
      font-size: 11px;
      color: #4b5563;
      margin-top: 2px;
    }
    .title-box {
      text-align: right;
    }
    .title-kwitansi {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 3px;
      text-decoration: underline;
      margin: 0;
      color: #000000;
    }
    .no-kwitansi {
      font-size: 12px;
      font-weight: 800;
      color: #b45309;
      margin-top: 3px;
    }
    .k-row {
      display: flex;
      margin-bottom: 12px;
      font-size: 13.5px;
      line-height: 1.5;
    }
    .k-label {
      width: 175px;
      font-weight: 800;
      color: #1f2937;
      flex-shrink: 0;
    }
    .k-colon {
      width: 15px;
      font-weight: 800;
    }
    .k-val {
      flex: 1;
      border-bottom: 1px dashed #9ca3af;
      padding-bottom: 2px;
    }
    .terbilang-box {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 7px 14px;
      border-radius: 5px;
      font-style: italic;
      font-weight: 800;
      color: #92400e;
      font-size: 13.5px;
    }
    .nominal-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 20px;
      padding-top: 10px;
    }
    .nominal-box {
      display: inline-block;
      border: 2px solid #000;
      background: #f1f5f9;
      padding: 10px 22px;
      font-size: 21px;
      font-weight: 900;
      color: #047857;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .summary-strip {
      margin-top: 14px;
      padding: 8px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 11.5px;
      display: flex;
      justify-content: space-between;
      color: #334155;
    }
    .signs {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding-top: 10px;
    }
    .sign-col {
      width: 220px;
      text-align: center;
      font-size: 12.5px;
    }
    .sign-space {
      height: 65px;
    }
    .sign-person {
      font-weight: 800;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
      font-size: 13px;
    }
    .stamp-pill {
      display: inline-block;
      border: 2px solid #059669;
      color: #059669;
      font-size: 10px;
      font-weight: 900;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 1px;
    }
    @media print {
      body { padding: 0; }
      .kwitansi-card { box-shadow: none; max-width: 100%; border: 2px solid #000; }
    }
  </style>
</head>
<body>
  <div class="kwitansi-card">
    <div class="k-header">
      <div>
        <h1 class="company-name">${companyName}</h1>
        <div class="company-sub">DEVELOPER & REAL ESTATE • ASHOKA RESIDENCE</div>
        <div class="company-sub">Ruko Ashoka View, Jl. Pemuda No. 142, Kota Semarang • Telp: (024) 845-9988</div>
      </div>
      <div class="title-box">
        <h2 class="title-kwitansi">KWITANSI</h2>
        <div class="no-kwitansi">${kwitansiNo}</div>
      </div>
    </div>

    <div class="k-row">
      <div class="k-label">Telah Terima Dari</div>
      <div class="k-colon">:</div>
      <div class="k-val" style="font-size: 15px; font-weight: 900; text-transform: uppercase;">
        ${row.namaKonsumen}
      </div>
    </div>

    <div class="k-row" style="align-items: center;">
      <div class="k-label">Uang Sejumlah</div>
      <div class="k-colon">:</div>
      <div class="k-val" style="border: none;">
        <div class="terbilang-box">
          # ${terbilangText} #
        </div>
      </div>
    </div>

    <div class="k-row">
      <div class="k-label">Untuk Pembayaran</div>
      <div class="k-colon">:</div>
      <div class="k-val">
        <strong>Pembayaran ${type}</strong> untuk pembelian unit properti <strong>${row.proyek}</strong>, 
        Blok <strong>${row.blok}</strong> No. <strong>${row.noUnit}</strong> (Tipe ${row.type}, LB: ${row.lb} m², LT: ${row.ltTotal} m²).
        ${payment.keterangan ? `<br/><span style="color: #4b5563; font-size: 12px;">Keterangan Berita: ${payment.keterangan}</span>` : ''}
      </div>
    </div>

    <div class="summary-strip">
      <span>Harga Net: <strong>${formatRupiah(row.hargaJualNet)}</strong></span>
      <span>Booking: <strong>${formatRupiah(row.booking)}</strong></span>
      <span>DP: <strong>${formatRupiah(row.totalDp)}</strong></span>
      <span>Angsuran: <strong>${formatRupiah(row.totalAngsuran)}</strong></span>
      <span>Sisa Saldo: <strong style="color: ${row.saldo <= 0 ? '#059669' : '#b45309'}">${row.saldo <= 0 ? 'LUNAS (Rp 0)' : formatRupiah(row.saldo)}</strong></span>
    </div>

    <div class="nominal-container">
      <div>
        <div style="font-size: 11px; color: #4b5563; font-weight: 800; margin-bottom: 4px;">JUMLAH:</div>
        <div class="nominal-box">
          Rp ${Number(payment.jumlah || 0).toLocaleString('id-ID')},-
        </div>
      </div>

      <div style="text-align: right; font-size: 12.5px; color: #374151;">
        Semarang, ${tanggalIndo}
      </div>
    </div>

    <div class="signs">
      <div class="sign-col">
        <div>Penyetor / Konsumen,</div>
        <div class="sign-space"></div>
        <div class="sign-person">${row.namaKonsumen}</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 3px;">Pembeli Unit</div>
      </div>

      <div class="sign-col">
        <div>Finance & Kasir,</div>
        <div class="sign-space" style="display: flex; align-items: center; justify-content: center;">
          <span class="stamp-pill">✓ LUNAS TERCATAT</span>
        </div>
        <div class="sign-person">${companyName}</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 3px;">Bagian Keuangan & Kasir</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  // Cetak Kwitansi Langsung (Isolated iframe Print)
  const handlePrintKwitansiDirect = (payment, type, row) => {
    let iframe = document.getElementById('kwitansi-print-isolated-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'kwitansi-print-isolated-iframe';
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '900px';
      iframe.style.height = '1200px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
    }

    const tgl = payment.tanggal || new Date().toISOString().split('T')[0];
    const kwitansiNo = `KW/${row.proyek?.includes('Park') ? 'YSP' : 'YGP'}/${tgl.slice(0, 4)}/${tgl.slice(5, 7)}/${String(Math.floor(100 + Math.random() * 900))}`;

    const html = generateKwitansiPrintHtml({
      payment,
      type,
      row,
      kwitansiNo
    });

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 400);
  };

  // Buka Modal Cetak / Pilih Kwitansi dari Baris Tabel
  const handleOpenKwitansiModal = (row) => {
    setKwitansiSelectRow(getCalculatedRow(row));
  };

  // Print Kwitansi Preview Modal
  const handlePrintReceipt = (payment, type, row) => {
    setReceiptData({
      payment,
      type,
      row
    });
  };

  return (
    <div style={{ padding: '0 0 2.5rem' }}>
      {/* ------------------------------------------------------------- */}
      {/* EXCEL TITLE BANNER & FILTER BAR (SESUAI DOKUMEN SCREENSHOT)   */}
      {/* ------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          background: '#0f172a',
          border: '1.5px solid #d97706',
          borderRadius: '14px',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(217, 119, 6, 0.15)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}
        >
          {/* TITLE BANNER (KOTAK COKELAT KEEMASAN SEPERTI DI EXCEL) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #b45309, #d97706)',
                color: '#ffffff',
                padding: '0.65rem 1.85rem',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '1.45rem',
                letterSpacing: '0.03em',
                boxShadow: '0 4px 12px rgba(180, 83, 9, 0.4)',
                border: '1px solid #f59e0b',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <CreditCard size={24} /> Piutang Konsumen
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
              Monitoring Pembayaran DP, Angsuran, & Sisa Saldo Piutang Per-Unit
            </div>
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleSyncFromSales}
              title="Tarik data otomatis dari transaksi penjualan SPR yang sudah closing"
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid #0284c7',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px'
              }}
            >
              <RotateCcw size={14} /> Sinkron dari Penjualan
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenAddRow}
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                border: '1px solid #f59e0b',
                color: '#ffffff',
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
              }}
            >
              <Plus size={16} /> + Tambah Piutang Konsumen
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => window.print()}
              title="Cetak atau unduh halaman rekap piutang"
              style={{
                background: '#1e293b',
                color: '#cbd5e1',
                border: '1px solid #475569',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px'
              }}
            >
              <Printer size={15} /> Cetak Rekap
            </button>
          </div>
        </div>

        {/* TOP FILTER CONTROLS (SEPERTI DI EXCEL: Proyek :, Type :, Blok :, Periode :) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: '#1e293b',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid #334155'
          }}
        >
          {/* Proyek Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                background: '#d97706',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '3px 8px',
                borderRadius: '4px'
              }}
            >
              Proyek :
            </span>
            <select
              value={filterProyek}
              onChange={(e) => setFilterProyek(e.target.value)}
              style={{
                background: '#0f172a',
                border: '1px solid #475569',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                outline: 'none'
              }}
            >
              <option value="ALL">Semua Proyek</option>
              {proyekOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                background: '#d97706',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '3px 8px',
                borderRadius: '4px'
              }}
            >
              Type :
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                background: '#0f172a',
                border: '1px solid #475569',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                outline: 'none'
              }}
            >
              <option value="ALL">Semua Tipe</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Blok Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                background: '#d97706',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '3px 8px',
                borderRadius: '4px'
              }}
            >
              Blok :
            </span>
            <select
              value={filterBlok}
              onChange={(e) => setFilterBlok(e.target.value)}
              style={{
                background: '#0f172a',
                border: '1px solid #475569',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                outline: 'none'
              }}
            >
              <option value="ALL">Semua Blok</option>
              {blokOptions.map((b) => (
                <option key={b} value={b}>
                  Blok {b}
                </option>
              ))}
            </select>
          </div>

          {/* Periode Filter (Bulan & Tahun) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span
              style={{
                background: '#d97706',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '3px 8px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Calendar size={13} /> Periode :
            </span>

            {/* Filter Bulan */}
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              title="Filter Berdasarkan Bulan"
              style={{
                background: '#0f172a',
                border: '1px solid #475569',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                outline: 'none'
              }}
            >
              <option value="ALL">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>

            {/* Filter Tahun */}
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              title="Filter Berdasarkan Tahun"
              style={{
                background: '#0f172a',
                border: '1px solid #475569',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                outline: 'none'
              }}
            >
              <option value="ALL">Semua Tahun</option>
              {tahunOptions.map((thn) => (
                <option key={thn} value={thn}>
                  {thn}
                </option>
              ))}
            </select>

            {/* Tombol Reset Periode */}
            {(filterBulan !== 'ALL' || filterTahun !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setFilterBulan('ALL');
                  setFilterTahun('ALL');
                }}
                title="Reset filter periode"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#f87171',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                ✕ Reset
              </button>
            )}
          </div>

          {/* Quick Search Box */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0f172a',
              border: '1px solid #475569',
              padding: '4px 10px',
              borderRadius: '6px'
            }}
          >
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Cari konsumen / no unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                width: '180px',
                outline: 'none'
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUMMARY KPI CARDS                                             */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '10px'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>Total Harga Jual Net</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
            {formatRupiah(totals.hargaJualNet)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
            Dari {filteredRows.length} unit transaksi
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '10px'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>Total DP Terkumpul</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>
            {formatRupiah(totals.dp)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
            Booking: {formatRupiah(totals.booking)}
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '10px'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>Total Angsuran Masuk</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a78bfa', marginTop: '4px' }}>
            {formatRupiah(totals.angsuran)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Cicilan & pencairan KPR</div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            background: '#1e293b',
            border: '1.5px solid #d97706',
            borderRadius: '10px'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 800 }}>Total Sisa Saldo Piutang</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>
            {formatRupiah(totals.saldo)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Sisa kewajiban konsumen</div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TABEL UTAMA PIUTANG KONSUMEN (EXACT MATCH EXCEL SCREENSHOT)   */}
      {/* ------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: 0,
          background: '#0f172a',
          border: '1.5px solid #d97706',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.78rem',
              color: '#ffffff',
              textAlign: 'left'
            }}
          >
            {/* ORANGE / AMBER HEADER ROW FROM SCREENSHOT */}
            <thead>
              <tr
                style={{
                  background: 'linear-gradient(135deg, #d97706, #ea580c)',
                  color: '#ffffff',
                  textAlign: 'center',
                  fontWeight: 900,
                  borderBottom: '2px solid #b45309'
                }}
              >
                <th style={{ padding: '11px 6px', border: '1px solid #b45309', minWidth: '35px' }}>No.</th>
                <th style={{ padding: '11px 12px', border: '1px solid #b45309', minWidth: '160px', textAlign: 'left' }}>
                  Nama Konsumen
                </th>
                <th style={{ padding: '11px 10px', border: '1px solid #b45309', minWidth: '105px' }}>Proyek</th>
                <th style={{ padding: '11px 8px', border: '1px solid #b45309', minWidth: '85px' }}>Type</th>
                <th style={{ padding: '11px 6px', border: '1px solid #b45309', minWidth: '50px' }}>Blok</th>
                <th style={{ padding: '11px 6px', border: '1px solid #b45309', minWidth: '45px' }}>No.</th>
                <th style={{ padding: '11px 6px', border: '1px solid #b45309', minWidth: '45px' }}>LB</th>
                <th style={{ padding: '11px 6px', border: '1px solid #b45309', minWidth: '45px' }}>LT</th>
                <th style={{ padding: '11px 6px', border: '1px solid #b45309', minWidth: '45px' }}>LT+</th>
                <th style={{ padding: '11px 8px', border: '1px solid #b45309', minWidth: '85px' }}>Total LB/LT</th>
                <th style={{ padding: '11px 10px', border: '1px solid #b45309', minWidth: '105px', textAlign: 'right' }}>
                  Harga Jual
                </th>
                <th style={{ padding: '11px 8px', border: '1px solid #b45309', minWidth: '75px', textAlign: 'right' }}>
                  Disc
                </th>
                <th style={{ padding: '11px 10px', border: '1px solid #b45309', minWidth: '110px', textAlign: 'right' }}>
                  Harga Jual Net
                </th>
                <th style={{ padding: '11px 9px', border: '1px solid #b45309', minWidth: '85px', textAlign: 'right' }}>
                  Booking
                </th>
                <th
                  style={{
                    padding: '11px 9px',
                    border: '1px solid #b45309',
                    minWidth: '95px',
                    textAlign: 'right',
                    background: '#ca8a04'
                  }}
                  title="Total DP yang telah dibayar oleh konsumen"
                >
                  Dp
                </th>
                <th style={{ padding: '11px 10px', border: '1px solid #b45309', minWidth: '110px', textAlign: 'right' }}>
                  Sisa Pembayaran
                </th>
                {/* RENAMED FROM 'Pembayaran' TO 'Angsuran' PER USER EXPLICIT REQUEST */}
                <th
                  style={{
                    padding: '11px 10px',
                    border: '1px solid #b45309',
                    minWidth: '100px',
                    textAlign: 'right',
                    background: '#9333ea'
                  }}
                  title="Total Angsuran yang telah dibayar oleh konsumen"
                >
                  Angsuran
                </th>
                <th
                  style={{
                    padding: '11px 10px',
                    border: '1px solid #b45309',
                    minWidth: '110px',
                    textAlign: 'right',
                    background: '#b45309'
                  }}
                  title="Sisa saldo hutang / piutang konsumen yang belum dibayar"
                >
                  Saldo
                </th>
                <th
                  style={{
                    padding: '11px 10px',
                    border: '1px solid #b45309',
                    minWidth: '200px',
                    textAlign: 'center',
                    background: '#047857'
                  }}
                >
                  Aksi
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {filteredRows.map((row, idx) => {
                const isLunas = row.saldo <= 0;
                return (
                  <tr
                    key={row.id || idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a',
                      borderBottom: '1px solid #334155',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <td style={{ textAlign: 'center', padding: '9px 6px', border: '1px solid #334155', fontWeight: 800, color: '#94a3b8' }}>
                      {idx + 1}
                    </td>

                    {/* Nama Konsumen */}
                    <td style={{ padding: '9px 12px', border: '1px solid #334155', fontWeight: 800 }}>
                      <div style={{ color: '#ffffff', fontSize: '0.84rem' }}>{row.namaKonsumen}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                        {row.periode && (
                          <span
                            style={{
                              fontSize: '0.67rem',
                              color: '#38bdf8',
                              background: 'rgba(56, 189, 248, 0.1)',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}
                            title={`Periode Transaksi: ${formatMonthYear(row.periode)}`}
                          >
                            📅 {formatMonthYear(row.periode)}
                          </span>
                        )}
                        {isLunas && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 900,
                              color: '#10b981',
                              background: 'rgba(16, 185, 129, 0.15)',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              display: 'inline-block'
                            }}
                          >
                            ✓ LUNAS
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Proyek */}
                    <td style={{ textAlign: 'center', padding: '9px 8px', border: '1px solid #334155', fontWeight: 700, color: '#cbd5e1' }}>
                      {row.proyek}
                    </td>

                    {/* Type */}
                    <td style={{ textAlign: 'center', padding: '9px 6px', border: '1px solid #334155', fontWeight: 700, color: '#94a3b8' }}>
                      {row.type}
                    </td>

                    {/* Blok */}
                    <td style={{ textAlign: 'center', padding: '9px 6px', border: '1px solid #334155', fontWeight: 800, color: '#38bdf8' }}>
                      {row.blok}
                    </td>

                    {/* No Kavling */}
                    <td style={{ textAlign: 'center', padding: '9px 6px', border: '1px solid #334155', fontWeight: 800, color: '#ffffff' }}>
                      {row.noUnit}
                    </td>

                    {/* LB */}
                    <td style={{ textAlign: 'center', padding: '9px 6px', border: '1px solid #334155', color: '#cbd5e1' }}>
                      {row.lb}
                    </td>

                    {/* LT */}
                    <td style={{ textAlign: 'center', padding: '9px 6px', border: '1px solid #334155', color: '#cbd5e1' }}>
                      {row.lt}
                    </td>

                    {/* LT+ */}
                    <td style={{ textAlign: 'center', padding: '9px 6px', border: '1px solid #334155', color: row.ltPlus > 0 ? '#f59e0b' : '#64748b', fontWeight: row.ltPlus > 0 ? 800 : 500 }}>
                      {row.ltPlus || 0}
                    </td>

                    {/* Total LB/LT */}
                    <td style={{ textAlign: 'center', padding: '9px 8px', border: '1px solid #334155', fontWeight: 800, color: '#38bdf8' }}>
                      {row.totalLbLt}
                    </td>

                    {/* Harga Jual */}
                    <td style={{ textAlign: 'right', padding: '9px 10px', border: '1px solid #334155', fontWeight: 700, color: '#ffffff' }}>
                      {formatNumber(row.hargaJual)}
                    </td>

                    {/* Disc */}
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1px solid #334155', color: row.disc > 0 ? '#f87171' : '#64748b', fontWeight: 700 }}>
                      {formatNumber(row.disc)}
                    </td>

                    {/* Harga Jual Net */}
                    <td style={{ textAlign: 'right', padding: '9px 10px', border: '1px solid #334155', fontWeight: 900, color: '#38bdf8' }}>
                      {formatNumber(row.hargaJualNet)}
                    </td>

                    {/* Booking */}
                    <td style={{ textAlign: 'right', padding: '9px 9px', border: '1px solid #334155', fontWeight: 700, color: '#34d399' }}>
                      {formatNumber(row.booking)}
                    </td>

                    {/* Dp (Klik untuk kelola DP) */}
                    <td style={{ textAlign: 'right', padding: '9px 9px', border: '1px solid #334155', fontWeight: 900, color: '#fbbf24' }}>
                      <div>{formatNumber(row.totalDp)}</div>
                      {(row.dpPayments || []).length > 0 && (
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
                          {(row.dpPayments || []).length}x bayar
                        </div>
                      )}
                    </td>

                    {/* Sisa Pembayaran */}
                    <td style={{ textAlign: 'right', padding: '9px 10px', border: '1px solid #334155', fontWeight: 800, color: '#cbd5e1' }}>
                      {formatNumber(row.sisaPembayaran)}
                    </td>

                    {/* Angsuran (Klik untuk kelola Angsuran) */}
                    <td style={{ textAlign: 'right', padding: '9px 10px', border: '1px solid #334155', fontWeight: 900, color: '#c084fc' }}>
                      <div>{formatNumber(row.totalAngsuran)}</div>
                      {(row.angsuranPayments || []).length > 0 && (
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
                          {(row.angsuranPayments || []).length}x bayar
                        </div>
                      )}
                    </td>

                    {/* Saldo Akhir */}
                    <td style={{ textAlign: 'right', padding: '9px 10px', border: '1px solid #334155', fontWeight: 900, color: isLunas ? '#10b981' : '#f59e0b' }}>
                      {formatNumber(row.saldo)}
                    </td>

                    {/* Aksi (Tombol Bayar & Edit) */}
                    <td style={{ textAlign: 'center', padding: '6px 8px', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        {/* TOMBOL BAYAR (USER EXPLICIT REQUEST) */}
                        <button
                          type="button"
                          onClick={() => handleOpenPaymentModal(row, 'dp')}
                          title="Buka Menu Pembayaran DP & Angsuran"
                          style={{
                            background: 'linear-gradient(135deg, #059669, #047857)',
                            border: '1px solid #10b981',
                            color: '#ffffff',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            padding: '4px 9px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                          }}
                        >
                          <CreditCard size={13} /> Bayar
                        </button>

                        {/* TOMBOL CETAK KWITANSI (PILIH JENIS KWITANSI) */}
                        <button
                          type="button"
                          onClick={() => handleOpenKwitansiModal(row)}
                          title="Cetak Bukti Kwitansi (Booking / DP / Angsuran / Rekap)"
                          style={{
                            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                            border: '1px solid #38bdf8',
                            color: '#ffffff',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            padding: '4px 9px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
                          }}
                        >
                          <Printer size={13} /> Kwitansi
                        </button>

                        {/* Edit Baris */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditRow(row)}
                          title="Edit Data Konsumen & Nilai Transaksi"
                          style={{
                            background: '#1e293b',
                            border: '1px solid #475569',
                            color: '#38bdf8',
                            padding: '4px 6px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={13} />
                        </button>

                        {/* Hapus Baris */}
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id, row.namaKonsumen)}
                          title="Hapus Data Baris"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid #ef4444',
                            color: '#f87171',
                            padding: '4px 6px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={19} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    Belum ada data piutang konsumen yang cocok dengan filter. Klik{' '}
                    <strong style={{ color: '#f59e0b' }}>"+ Tambah Piutang Konsumen"</strong> atau{' '}
                    <strong style={{ color: '#38bdf8' }}>"Sinkron dari Penjualan"</strong>.
                  </td>
                </tr>
              )}
            </tbody>

            {/* ORANGE / AMBER TOTAL ROW (EXACT MATCH FOOTER IN SCREENSHOT) */}
            <tfoot>
              <tr
                style={{
                  background: 'linear-gradient(135deg, #d97706, #ea580c)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  borderTop: '2px solid #b45309'
                }}
              >
                <td
                  colSpan={10}
                  style={{
                    padding: '11px 14px',
                    border: '1px solid #b45309',
                    textAlign: 'left',
                    fontWeight: 900,
                    letterSpacing: '0.04em'
                  }}
                >
                  Total
                </td>
                <td style={{ textAlign: 'right', padding: '11px 10px', border: '1px solid #b45309' }}>
                  {formatNumber(totals.hargaJual)}
                </td>
                <td style={{ textAlign: 'right', padding: '11px 8px', border: '1px solid #b45309' }}>
                  {formatNumber(totals.disc)}
                </td>
                <td style={{ textAlign: 'right', padding: '11px 10px', border: '1px solid #b45309' }}>
                  {formatNumber(totals.hargaJualNet)}
                </td>
                <td style={{ textAlign: 'right', padding: '11px 9px', border: '1px solid #b45309' }}>
                  {formatNumber(totals.booking)}
                </td>
                <td style={{ textAlign: 'right', padding: '11px 9px', border: '1px solid #b45309' }}>
                  {formatNumber(totals.dp)}
                </td>
                <td style={{ textAlign: 'right', padding: '11px 10px', border: '1px solid #b45309' }}>
                  {formatNumber(totals.sisaPembayaran)}
                </td>
                <td style={{ textAlign: 'right', padding: '11px 10px', border: '1px solid #b45309' }}>
                  {formatNumber(totals.angsuran)}
                </td>
                <td style={{ textAlign: 'right', padding: '11px 10px', border: '1px solid #b45309' }}>
                  {formatNumber(totals.saldo)}
                </td>
                <td style={{ textAlign: 'center', padding: '11px 10px', border: '1px solid #b45309' }}>-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL BAYAR (DP & ANGSURAN - USER EXPLICIT REQUEST)          */}
      {/* ------------------------------------------------------------- */}
      {activePaymentRow && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '820px',
              maxHeight: '92vh',
              background: '#0f172a',
              border: '2px solid #059669',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #064e3b, #0f172a)'
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <CreditCard size={22} color="#10b981" /> Kelola Pembayaran: {activePaymentRow.namaKonsumen}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '3px' }}>
                  {activePaymentRow.proyek} • Blok {activePaymentRow.blok} No. {activePaymentRow.noUnit} ({activePaymentRow.type})
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePaymentRow(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick Financial Summary Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                background: '#1e293b',
                borderBottom: '1px solid #334155'
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Harga Net</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#38bdf8' }}>
                  {formatRupiah(activePaymentRow.hargaJualNet)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Booking Fee</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399' }}>
                  {formatRupiah(activePaymentRow.booking)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Total DP Terbayar</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fbbf24' }}>
                  {formatRupiah(activePaymentRow.totalDp)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#c084fc' }}>Total Angsuran</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#c084fc' }}>
                  {formatRupiah(activePaymentRow.totalAngsuran)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>Sisa Saldo Piutang</div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: activePaymentRow.saldo <= 0 ? '#10b981' : '#f59e0b'
                  }}
                >
                  {activePaymentRow.saldo <= 0 ? 'LUNAS (Rp 0)' : formatRupiah(activePaymentRow.saldo)}
                </div>
              </div>
            </div>

            {/* Sub-tab Switcher: DP vs Angsuran */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #334155',
                background: '#0f172a',
                padding: '0 1.5rem'
              }}
            >
              <button
                type="button"
                onClick={() => setPaymentSubTab('dp')}
                style={{
                  padding: '0.75rem 1.25rem',
                  border: 'none',
                  borderBottom: paymentSubTab === 'dp' ? '3px solid #f59e0b' : '3px solid transparent',
                  background: 'transparent',
                  color: paymentSubTab === 'dp' ? '#f59e0b' : '#94a3b8',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                💳 Pembayaran DP (Uang Muka)
                <span
                  style={{
                    background: paymentSubTab === 'dp' ? '#f59e0b' : '#334155',
                    color: '#000',
                    fontSize: '0.72rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 900
                  }}
                >
                  {(activePaymentRow.dpPayments || []).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentSubTab('angsuran')}
                style={{
                  padding: '0.75rem 1.25rem',
                  border: 'none',
                  borderBottom: paymentSubTab === 'angsuran' ? '3px solid #a855f7' : '3px solid transparent',
                  background: 'transparent',
                  color: paymentSubTab === 'angsuran' ? '#a855f7' : '#94a3b8',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                🏦 Pembayaran Angsuran
                <span
                  style={{
                    background: paymentSubTab === 'angsuran' ? '#a855f7' : '#334155',
                    color: '#fff',
                    fontSize: '0.72rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 900
                  }}
                >
                  {(activePaymentRow.angsuranPayments || []).length}
                </span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {/* ======================================================= */}
              {/* TAB 1: PEMBAYARAN DP (UANG MUKA)                       */}
              {/* ======================================================= */}
              {paymentSubTab === 'dp' && (
                <div>
                  {/* Form Input Pembayaran DP Baru */}
                  <form
                    onSubmit={handleAddDpPayment}
                    style={{
                      background: '#1e293b',
                      padding: '1.15rem',
                      borderRadius: '10px',
                      border: '1px solid #475569',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                      + Catat Pembayaran DP (Uang Muka) Baru
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '0.75rem'
                      }}
                    >
                      {/* Tanggal DP */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>
                          Tanggal Pembayaran:
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={newDpDate}
                          onChange={(e) => setNewDpDate(e.target.value)}
                          required
                          style={{ fontSize: '0.82rem', padding: '0.45rem' }}
                        />
                      </div>

                      {/* Jumlah Nominal DP */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>
                          Jumlah Nominal (Rp):
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: 25,000,000"
                          value={newDpNominal ? Number(newDpNominal).toLocaleString('en-US') : ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            setNewDpNominal(raw);
                          }}
                          required
                          style={{
                            fontSize: '0.82rem',
                            padding: '0.45rem',
                            fontWeight: 800,
                            color: '#34d399',
                            textAlign: 'right'
                          }}
                        />
                      </div>

                      {/* Keterangan DP */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>
                          Keterangan / Berita Transfer:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="DP Tahap 1 - Transfer BCA"
                          value={newDpKeterangan}
                          onChange={(e) => setNewDpKeterangan(e.target.value)}
                          style={{ fontSize: '0.82rem', padding: '0.45rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        style={{
                          background: 'linear-gradient(135deg, #d97706, #b45309)',
                          border: 'none',
                          fontWeight: 900,
                          padding: '0.45rem 1.25rem',
                          borderRadius: '6px'
                        }}
                      >
                        + Tambah Pembayaran DP
                      </button>
                    </div>
                  </form>

                  {/* Tabel Riwayat DP */}
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                    Riwayat Pembayaran DP Konsumen ({activePaymentRow.namaKonsumen})
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="custom-table" style={{ width: '100%', marginBottom: 0 }}>
                      <thead>
                        <tr>
                          <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                          <th style={{ width: '120px' }}>Tanggal</th>
                          <th style={{ width: '150px', textAlign: 'right' }}>Jumlah (Rp)</th>
                          <th>Keterangan</th>
                          <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activePaymentRow.dpPayments || []).map((p, idx) => (
                          <tr key={p.id || idx}>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                            <td style={{ fontWeight: 700 }}>{p.tanggal}</td>
                            <td style={{ textAlign: 'right', fontWeight: 900, color: '#34d399' }}>
                              {formatRupiah(p.jumlah)}
                            </td>
                            <td>{p.keterangan || '-'}</td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                <button
                                  type="button"
                                  onClick={() => handlePrintKwitansiDirect(p, `DP (Uang Muka) Ke-${idx + 1}`, activePaymentRow)}
                                  title="Cetak Bukti Kwitansi DP Ini"
                                  style={{
                                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                                    border: '1px solid #38bdf8',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    borderRadius: '4px',
                                    padding: '3px 8px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Printer size={12} /> Kwitansi
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePrintReceipt(p, `DP (Uang Muka) Ke-${idx + 1}`, activePaymentRow)}
                                  title="Preview Kwitansi DP"
                                  style={{
                                    background: '#1e293b',
                                    border: '1px solid #475569',
                                    color: '#cbd5e1',
                                    borderRadius: '4px',
                                    padding: '3px 6px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDpPayment(p.id)}
                                  title="Hapus data pembayaran ini"
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    border: '1px solid #ef4444',
                                    color: '#f87171',
                                    borderRadius: '4px',
                                    padding: '3px 7px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {(activePaymentRow.dpPayments || []).length === 0 && (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                              Belum ada catatan pembayaran DP. Silakan isi form di atas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: '#1e293b', fontWeight: 900 }}>
                          <td colSpan={2} style={{ textAlign: 'right', color: '#94a3b8' }}>
                            Total DP Terbayar:
                          </td>
                          <td style={{ textAlign: 'right', color: '#fbbf24', fontSize: '0.95rem' }}>
                            {formatRupiah(activePaymentRow.totalDp)}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* TAB 2: PEMBAYARAN ANGSURAN                             */}
              {/* ======================================================= */}
              {paymentSubTab === 'angsuran' && (
                <div>
                  {/* Form Input Pembayaran Angsuran Baru */}
                  <form
                    onSubmit={handleAddAngsuranPayment}
                    style={{
                      background: '#1e293b',
                      padding: '1.15rem',
                      borderRadius: '10px',
                      border: '1px solid #475569',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#c084fc', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                      + Catat Pembayaran Angsuran Baru
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '0.75rem'
                      }}
                    >
                      {/* Tanggal Angsuran */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>
                          Tanggal Pembayaran:
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={newAngsuranDate}
                          onChange={(e) => setNewAngsuranDate(e.target.value)}
                          required
                          style={{ fontSize: '0.82rem', padding: '0.45rem' }}
                        />
                      </div>

                      {/* Jumlah Nominal Angsuran */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>
                          Jumlah Nominal (Rp):
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: 30,000,000"
                          value={newAngsuranNominal ? Number(newAngsuranNominal).toLocaleString('en-US') : ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            setNewAngsuranNominal(raw);
                          }}
                          required
                          style={{
                            fontSize: '0.82rem',
                            padding: '0.45rem',
                            fontWeight: 800,
                            color: '#34d399',
                            textAlign: 'right'
                          }}
                        />
                      </div>

                      {/* Keterangan Angsuran */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>
                          Keterangan / Skema Angsuran:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Angsuran 1 - Cash Bertahap"
                          value={newAngsuranKeterangan}
                          onChange={(e) => setNewAngsuranKeterangan(e.target.value)}
                          style={{ fontSize: '0.82rem', padding: '0.45rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                          border: 'none',
                          fontWeight: 900,
                          padding: '0.45rem 1.25rem',
                          borderRadius: '6px'
                        }}
                      >
                        + Tambah Pembayaran Angsuran
                      </button>
                    </div>
                  </form>

                  {/* Tabel Riwayat Angsuran */}
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                    Riwayat Pembayaran Angsuran Konsumen ({activePaymentRow.namaKonsumen})
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="custom-table" style={{ width: '100%', marginBottom: 0 }}>
                      <thead>
                        <tr>
                          <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                          <th style={{ width: '120px' }}>Tanggal</th>
                          <th style={{ width: '150px', textAlign: 'right' }}>Jumlah (Rp)</th>
                          <th>Keterangan</th>
                          <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activePaymentRow.angsuranPayments || []).map((p, idx) => (
                          <tr key={p.id || idx}>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                            <td style={{ fontWeight: 700 }}>{p.tanggal}</td>
                            <td style={{ textAlign: 'right', fontWeight: 900, color: '#34d399' }}>
                              {formatRupiah(p.jumlah)}
                            </td>
                            <td>{p.keterangan || '-'}</td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                <button
                                  type="button"
                                  onClick={() => handlePrintKwitansiDirect(p, `Angsuran Ke-${idx + 1}`, activePaymentRow)}
                                  title="Cetak Bukti Kwitansi Angsuran Ini"
                                  style={{
                                    background: 'linear-gradient(135deg, #7e22ce, #6b21a8)',
                                    border: '1px solid #c084fc',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    borderRadius: '4px',
                                    padding: '3px 8px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Printer size={12} /> Kwitansi
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePrintReceipt(p, `Angsuran Ke-${idx + 1}`, activePaymentRow)}
                                  title="Preview Kwitansi Angsuran"
                                  style={{
                                    background: '#1e293b',
                                    border: '1px solid #475569',
                                    color: '#cbd5e1',
                                    borderRadius: '4px',
                                    padding: '3px 6px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAngsuranPayment(p.id)}
                                  title="Hapus data pembayaran angsuran ini"
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    border: '1px solid #ef4444',
                                    color: '#f87171',
                                    borderRadius: '4px',
                                    padding: '3px 7px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {(activePaymentRow.angsuranPayments || []).length === 0 && (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                              Belum ada catatan pembayaran angsuran. Silakan isi form di atas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: '#1e293b', fontWeight: 900 }}>
                          <td colSpan={2} style={{ textAlign: 'right', color: '#94a3b8' }}>
                            Total Angsuran Terbayar:
                          </td>
                          <td style={{ textAlign: 'right', color: '#c084fc', fontSize: '0.95rem' }}>
                            {formatRupiah(activePaymentRow.totalAngsuran)}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#0f172a'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Perubahan tersimpan otomatis ke database real-time
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActivePaymentRow(null)}
                style={{ padding: '0.45rem 1.5rem', fontWeight: 800 }}
              >
                Selesai / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL TAMBAH / EDIT BARIS DATA PIUTANG                       */}
      {/* ------------------------------------------------------------- */}
      {isRowModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '92vh',
              background: '#0f172a',
              border: '2px solid #d97706',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #78350f, #0f172a)'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} color="#f59e0b" /> {editingRowId ? 'Edit Data Piutang Konsumen' : 'Tambah Piutang Konsumen Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsRowModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRow} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Nama Konsumen:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Budi Santoso"
                    value={rowFormData.namaKonsumen}
                    onChange={(e) => setRowFormData({ ...rowFormData, namaKonsumen: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Proyek Perumahan:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Ashoka View"
                    value={rowFormData.proyek}
                    onChange={(e) => setRowFormData({ ...rowFormData, proyek: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Tipe Unit:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Type 36/60"
                    value={rowFormData.type}
                    onChange={(e) => setRowFormData({ ...rowFormData, type: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Blok & No Kavling:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Blok (A/B)"
                      value={rowFormData.blok}
                      onChange={(e) => setRowFormData({ ...rowFormData, blok: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="No (01)"
                      value={rowFormData.noUnit}
                      onChange={(e) => setRowFormData({ ...rowFormData, noUnit: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Luas Bangunan (LB):
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={rowFormData.lb}
                    onChange={(e) => setRowFormData({ ...rowFormData, lb: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Luas Tanah Standar (LT):
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={rowFormData.lt}
                    onChange={(e) => setRowFormData({ ...rowFormData, lt: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Luas Tanah Lebih (LT+):
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={rowFormData.ltPlus}
                    onChange={(e) => setRowFormData({ ...rowFormData, ltPlus: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Periode Transaksi (Bulan & Tahun):
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <select
                      className="form-control"
                      value={(rowFormData.periode || '').split('-')[1] || '09'}
                      onChange={(e) => {
                        const y = (rowFormData.periode || '2026-09').split('-')[0] || '2026';
                        setRowFormData({ ...rowFormData, periode: `${y}-${e.target.value}` });
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.45rem' }}
                    >
                      <option value="01">Januari</option>
                      <option value="02">Februari</option>
                      <option value="03">Maret</option>
                      <option value="04">April</option>
                      <option value="05">Mei</option>
                      <option value="06">Juni</option>
                      <option value="07">Juli</option>
                      <option value="08">Agustus</option>
                      <option value="09">September</option>
                      <option value="10">Oktober</option>
                      <option value="11">November</option>
                      <option value="12">Desember</option>
                    </select>

                    <select
                      className="form-control"
                      value={(rowFormData.periode || '').split('-')[0] || '2026'}
                      onChange={(e) => {
                        const m = (rowFormData.periode || '2026-09').split('-')[1] || '09';
                        setRowFormData({ ...rowFormData, periode: `${e.target.value}-${m}` });
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.45rem', width: '105px' }}
                    >
                      {tahunOptions.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Nilai Harga & Diskon */}
              <div
                style={{
                  background: '#1e293b',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.84rem', marginBottom: '0.75rem' }}>
                  Nilai Transaksi & Diskon
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>
                      Harga Jual (Rp):
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={rowFormData.hargaJual ? Number(rowFormData.hargaJual).toLocaleString('en-US') : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setRowFormData({ ...rowFormData, hargaJual: raw ? parseInt(raw, 10) : 0 });
                      }}
                      style={{ textAlign: 'right', fontWeight: 800 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>
                      Diskon (Rp):
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={rowFormData.disc ? Number(rowFormData.disc).toLocaleString('en-US') : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setRowFormData({ ...rowFormData, disc: raw ? parseInt(raw, 10) : 0 });
                      }}
                      style={{ textAlign: 'right', fontWeight: 800, color: '#f87171' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>
                      Booking Fee (Rp):
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={rowFormData.booking ? Number(rowFormData.booking).toLocaleString('en-US') : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setRowFormData({ ...rowFormData, booking: raw ? parseInt(raw, 10) : 0 });
                      }}
                      style={{ textAlign: 'right', fontWeight: 800, color: '#34d399' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#0f172a', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  Harga Net Terhitung: <strong style={{ color: '#38bdf8' }}>{formatRupiah(Math.max(0, (rowFormData.hargaJual || 0) - (rowFormData.disc || 0)))}</strong>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                  Catatan Transaksi:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Keterangan tambahan transaksi"
                  value={rowFormData.catatan}
                  onChange={(e) => setRowFormData({ ...rowFormData, catatan: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsRowModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', border: 'none', fontWeight: 900 }}
                >
                  Simpan Data Piutang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL PILIH & CETAK KWITANSI (BOOKING, DP, ANGSURAN, REKAP)  */}
      {/* ------------------------------------------------------------- */}
      {kwitansiSelectRow && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(4px)',
            zIndex: 999990,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '740px',
              background: '#0f172a',
              border: '1px solid #38bdf8',
              borderRadius: '14px',
              padding: '1.75rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
              color: '#f8fafc',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🖨️</span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8' }}>
                    Cetak Bukti Kwitansi Pembayaran
                  </h3>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                  Konsumen: <strong style={{ color: '#ffffff' }}>{kwitansiSelectRow.namaKonsumen}</strong> • Properti: <strong style={{ color: '#fbbf24' }}>{kwitansiSelectRow.proyek} - Blok {kwitansiSelectRow.blok} No. {kwitansiSelectRow.noUnit}</strong> (Tipe {kwitansiSelectRow.type})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setKwitansiSelectRow(null)}
                style={{
                  background: '#1e293b',
                  border: '1px solid #475569',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Summary Box */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#1e293b', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1.5rem', fontSize: '0.78rem' }}>
              <div>
                <div style={{ color: '#94a3b8' }}>Harga Net Unit:</div>
                <div style={{ fontWeight: 800, color: '#ffffff' }}>{formatRupiah(kwitansiSelectRow.hargaJualNet)}</div>
              </div>
              <div>
                <div style={{ color: '#94a3b8' }}>Total DP Masuk:</div>
                <div style={{ fontWeight: 800, color: '#34d399' }}>{formatRupiah(kwitansiSelectRow.totalDp)}</div>
              </div>
              <div>
                <div style={{ color: '#94a3b8' }}>Total Angsuran Masuk:</div>
                <div style={{ fontWeight: 800, color: '#a78bfa' }}>{formatRupiah(kwitansiSelectRow.totalAngsuran)}</div>
              </div>
              <div>
                <div style={{ color: '#94a3b8' }}>Sisa Saldo Piutang:</div>
                <div style={{ fontWeight: 900, color: kwitansiSelectRow.saldo <= 0 ? '#10b981' : '#f87171' }}>
                  {kwitansiSelectRow.saldo <= 0 ? '✓ LUNAS' : formatRupiah(kwitansiSelectRow.saldo)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* 1. SEKSI BOOKING FEE */}
              <div style={{ background: '#131d33', border: '1px solid #1e3a8a', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem', color: '#60a5fa' }}>📌</span>
                      <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#93c5fd' }}>Uang Tanda Jadi (Booking Fee)</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                        Awal Pemesanan
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                      Nominal Booking: <strong style={{ color: '#38bdf8', fontSize: '0.95rem' }}>{formatRupiah(kwitansiSelectRow.booking)}</strong>
                      {kwitansiSelectRow.periode && <span style={{ color: '#94a3b8', marginLeft: '8px' }}>(Periode: {formatMonthYear(kwitansiSelectRow.periode)})</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const bkgPayment = {
                          id: `bkg-${kwitansiSelectRow.id}`,
                          tanggal: kwitansiSelectRow.periode ? `${kwitansiSelectRow.periode}-01` : new Date().toISOString().split('T')[0],
                          jumlah: kwitansiSelectRow.booking,
                          keterangan: `Pembayaran Uang Tanda Jadi (Booking Fee) Unit ${kwitansiSelectRow.blok}-${kwitansiSelectRow.noUnit}`
                        };
                        handlePrintKwitansiDirect(bkgPayment, 'Uang Tanda Jadi (Booking Fee)', kwitansiSelectRow);
                      }}
                      disabled={!kwitansiSelectRow.booking || kwitansiSelectRow.booking <= 0}
                      style={{
                        background: kwitansiSelectRow.booking > 0 ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#334155',
                        border: '1px solid #38bdf8',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        padding: '7px 12px',
                        borderRadius: '6px',
                        cursor: kwitansiSelectRow.booking > 0 ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Printer size={14} /> Cetak Kwitansi Booking
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const bkgPayment = {
                          id: `bkg-${kwitansiSelectRow.id}`,
                          tanggal: kwitansiSelectRow.periode ? `${kwitansiSelectRow.periode}-01` : new Date().toISOString().split('T')[0],
                          jumlah: kwitansiSelectRow.booking,
                          keterangan: `Pembayaran Uang Tanda Jadi (Booking Fee) Unit ${kwitansiSelectRow.blok}-${kwitansiSelectRow.noUnit}`
                        };
                        handlePrintReceipt(bkgPayment, 'Uang Tanda Jadi (Booking Fee)', kwitansiSelectRow);
                      }}
                      disabled={!kwitansiSelectRow.booking || kwitansiSelectRow.booking <= 0}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #475569',
                        color: '#cbd5e1',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        cursor: kwitansiSelectRow.booking > 0 ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <Eye size={13} /> Preview
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. SEKSI PEMBAYARAN DP (UANG MUKA) */}
              <div style={{ background: '#122521', border: '1px solid #065f46', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1rem', color: '#10b981' }}>💳</span>
                    <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#6ee7b7' }}>Pembayaran Uang Muka (DP)</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                      {(kwitansiSelectRow.dpPayments || []).length} Transaksi Tercatat
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    Total DP Masuk: <strong style={{ color: '#34d399', fontSize: '1rem' }}>{formatRupiah(kwitansiSelectRow.totalDp)}</strong>
                  </div>
                </div>

                {(kwitansiSelectRow.dpPayments || []).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(kwitansiSelectRow.dpPayments || []).map((p, pIdx) => (
                      <div
                        key={p.id || pIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#0a1614',
                          border: '1px solid #134e4a',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div>
                          <strong style={{ color: '#a7f3d0' }}>DP Termin {pIdx + 1}</strong> • <span style={{ color: '#94a3b8' }}>{p.tanggal}</span> • <strong style={{ color: '#ffffff' }}>{formatRupiah(p.jumlah)}</strong>
                          {p.keterangan && <div style={{ fontSize: '0.72rem', color: '#6ee7b7', marginTop: '2px' }}>{p.keterangan}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            type="button"
                            onClick={() => handlePrintKwitansiDirect(p, `DP (Uang Muka) Ke-${pIdx + 1}`, kwitansiSelectRow)}
                            title="Cetak Kwitansi Termin Ini Langsung"
                            style={{
                              background: 'linear-gradient(135deg, #059669, #047857)',
                              border: '1px solid #10b981',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              padding: '4px 9px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Printer size={12} /> Cetak Kwitansi DP {pIdx + 1}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePrintReceipt(p, `DP (Uang Muka) Ke-${pIdx + 1}`, kwitansiSelectRow)}
                            style={{
                              background: '#1e293b',
                              border: '1px solid #475569',
                              color: '#cbd5e1',
                              padding: '4px 7px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {(kwitansiSelectRow.dpPayments || []).length > 1 && (
                      <div style={{ marginTop: '4px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const totalDpPayment = {
                              id: `tot-dp-${kwitansiSelectRow.id}`,
                              tanggal: kwitansiSelectRow.dpPayments[kwitansiSelectRow.dpPayments.length - 1]?.tanggal || new Date().toISOString().split('T')[0],
                              jumlah: kwitansiSelectRow.totalDp,
                              keterangan: `Total Akumulasi Pembayaran DP (Uang Muka) Sebanyak ${(kwitansiSelectRow.dpPayments || []).length} Kali Termin`
                            };
                            handlePrintKwitansiDirect(totalDpPayment, 'Total Akumulasi DP', kwitansiSelectRow);
                          }}
                          style={{
                            background: '#047857',
                            border: '1px solid #34d399',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.73rem',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Printer size={12} /> Cetak Kwitansi Akumulasi Total DP ({formatRupiah(kwitansiSelectRow.totalDp)})
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
                    Belum ada riwayat pembayaran DP. Silakan klik tombol <strong>[Bayar]</strong> pada tabel utama untuk mencatat pembayaran DP konsumen.
                  </div>
                )}
              </div>

              {/* 3. SEKSI PEMBAYARAN ANGSURAN */}
              <div style={{ background: '#251b36', border: '1px solid #6b21a8', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1rem', color: '#c084fc' }}>🏦</span>
                    <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#e9d5ff' }}>Pembayaran Angsuran Konsumen</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.2)', color: '#d8b4fe', border: '1px solid rgba(192, 132, 252, 0.4)' }}>
                      {(kwitansiSelectRow.angsuranPayments || []).length} Transaksi Tercatat
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    Total Angsuran Masuk: <strong style={{ color: '#c084fc', fontSize: '1rem' }}>{formatRupiah(kwitansiSelectRow.totalAngsuran)}</strong>
                  </div>
                </div>

                {(kwitansiSelectRow.angsuranPayments || []).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(kwitansiSelectRow.angsuranPayments || []).map((p, pIdx) => (
                      <div
                        key={p.id || pIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#160e24',
                          border: '1px solid #581c87',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div>
                          <strong style={{ color: '#e9d5ff' }}>Angsuran Termin {pIdx + 1}</strong> • <span style={{ color: '#94a3b8' }}>{p.tanggal}</span> • <strong style={{ color: '#ffffff' }}>{formatRupiah(p.jumlah)}</strong>
                          {p.keterangan && <div style={{ fontSize: '0.72rem', color: '#d8b4fe', marginTop: '2px' }}>{p.keterangan}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            type="button"
                            onClick={() => handlePrintKwitansiDirect(p, `Angsuran Ke-${pIdx + 1}`, kwitansiSelectRow)}
                            title="Cetak Kwitansi Angsuran Ini Langsung"
                            style={{
                              background: 'linear-gradient(135deg, #7e22ce, #6b21a8)',
                              border: '1px solid #a855f7',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              padding: '4px 9px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Printer size={12} /> Cetak Kwitansi Angsuran {pIdx + 1}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePrintReceipt(p, `Angsuran Ke-${pIdx + 1}`, kwitansiSelectRow)}
                            style={{
                              background: '#1e293b',
                              border: '1px solid #475569',
                              color: '#cbd5e1',
                              padding: '4px 7px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {(kwitansiSelectRow.angsuranPayments || []).length > 1 && (
                      <div style={{ marginTop: '4px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const totalAngPayment = {
                              id: `tot-ang-${kwitansiSelectRow.id}`,
                              tanggal: kwitansiSelectRow.angsuranPayments[kwitansiSelectRow.angsuranPayments.length - 1]?.tanggal || new Date().toISOString().split('T')[0],
                              jumlah: kwitansiSelectRow.totalAngsuran,
                              keterangan: `Total Akumulasi Pembayaran Angsuran Sebanyak ${(kwitansiSelectRow.angsuranPayments || []).length} Kali Termin`
                            };
                            handlePrintKwitansiDirect(totalAngPayment, 'Total Akumulasi Angsuran', kwitansiSelectRow);
                          }}
                          style={{
                            background: '#6b21a8',
                            border: '1px solid #c084fc',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.73rem',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Printer size={12} /> Cetak Kwitansi Akumulasi Total Angsuran ({formatRupiah(kwitansiSelectRow.totalAngsuran)})
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
                    Belum ada riwayat pembayaran Angsuran. Silakan klik tombol <strong>[Bayar]</strong> pada tabel utama untuk mencatat pembayaran Angsuran.
                  </div>
                )}
              </div>

              {/* 4. SEKSI TOTAL AKUMULASI SELURUH PEMBAYARAN MASUK */}
              <div style={{ background: '#2c1e0f', border: '1px solid #b45309', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem', color: '#f59e0b' }}>📑</span>
                      <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#fde68a' }}>Rekap Total Seluruh Pembayaran Masuk</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                      Akumulasi: Booking ({formatRupiah(kwitansiSelectRow.booking)}) + DP ({formatRupiah(kwitansiSelectRow.totalDp)}) + Angsuran ({formatRupiah(kwitansiSelectRow.totalAngsuran)})
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '0.95rem' }}>
                      Total Diterima: <strong style={{ color: '#fbbf24', fontSize: '1.05rem' }}>{formatRupiah(kwitansiSelectRow.booking + kwitansiSelectRow.totalDp + kwitansiSelectRow.totalAngsuran)}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const grandTotal = kwitansiSelectRow.booking + kwitansiSelectRow.totalDp + kwitansiSelectRow.totalAngsuran;
                        const totalPayment = {
                          id: `grand-tot-${kwitansiSelectRow.id}`,
                          tanggal: new Date().toISOString().split('T')[0],
                          jumlah: grandTotal,
                          keterangan: `Total Seluruh Pembayaran Diterima (Booking Fee, Uang Muka DP, & Angsuran) untuk Unit ${kwitansiSelectRow.blok}-${kwitansiSelectRow.noUnit}`
                        };
                        handlePrintKwitansiDirect(totalPayment, 'Akumulasi Seluruh Pembayaran Masuk', kwitansiSelectRow);
                      }}
                      disabled={(kwitansiSelectRow.booking + kwitansiSelectRow.totalDp + kwitansiSelectRow.totalAngsuran) <= 0}
                      style={{
                        background: 'linear-gradient(135deg, #d97706, #b45309)',
                        border: '1px solid #f59e0b',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        padding: '7px 12px',
                        borderRadius: '6px',
                        cursor: (kwitansiSelectRow.booking + kwitansiSelectRow.totalDp + kwitansiSelectRow.totalAngsuran) > 0 ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Printer size={14} /> Cetak Kwitansi Rekap Total
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const grandTotal = kwitansiSelectRow.booking + kwitansiSelectRow.totalDp + kwitansiSelectRow.totalAngsuran;
                        const totalPayment = {
                          id: `grand-tot-${kwitansiSelectRow.id}`,
                          tanggal: new Date().toISOString().split('T')[0],
                          jumlah: grandTotal,
                          keterangan: `Total Seluruh Pembayaran Diterima (Booking Fee, Uang Muka DP, & Angsuran) untuk Unit ${kwitansiSelectRow.blok}-${kwitansiSelectRow.noUnit}`
                        };
                        handlePrintReceipt(totalPayment, 'Akumulasi Seluruh Pembayaran Masuk', kwitansiSelectRow);
                      }}
                      disabled={(kwitansiSelectRow.booking + kwitansiSelectRow.totalDp + kwitansiSelectRow.totalAngsuran) <= 0}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #475569',
                        color: '#cbd5e1',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        cursor: (kwitansiSelectRow.booking + kwitansiSelectRow.totalDp + kwitansiSelectRow.totalAngsuran) > 0 ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <Eye size={13} /> Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
              <button
                type="button"
                onClick={() => setKwitansiSelectRow(null)}
                style={{
                  background: '#334155',
                  color: '#f8fafc',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL PREVIEW KWITANSI PEMBAYARAN                             */}
      {/* ------------------------------------------------------------- */}
      {receiptData && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '620px',
              background: '#ffffff',
              color: '#000000',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
              border: '2px double #b45309'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #b45309', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#92400e' }}>
                  {receiptData.row.proyek?.includes('Park') ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                  DEVELOPER & REAL ESTATE • ASHOKA RESIDENCE
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                  Ruko Ashoka View, Jl. Pemuda No. 142, Semarang
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#000', letterSpacing: '1px', textDecoration: 'underline' }}>KWITANSI</div>
                <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 800 }}>Tgl: {receiptData.payment.tanggal}</div>
              </div>
            </div>

            <table style={{ width: '100%', fontSize: '0.85rem', marginBottom: '1.25rem', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', width: '150px', fontWeight: 700, color: '#374151' }}>Telah Terima Dari</td>
                  <td style={{ padding: '6px 0', fontWeight: 900, fontSize: '0.95rem' }}>: {receiptData.row.namaKonsumen}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#374151' }}>Uang Sejumlah</td>
                  <td style={{ padding: '6px 0', fontStyle: 'italic', fontWeight: 800, color: '#92400e' }}>
                    : # {terbilang(receiptData.payment.jumlah)} #
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#374151' }}>Untuk Pembayaran</td>
                  <td style={{ padding: '6px 0' }}>
                    : <strong>Pembayaran {receiptData.type}</strong> unit <strong>{receiptData.row.proyek}</strong> Blok <strong>{receiptData.row.blok}</strong> No. <strong>{receiptData.row.noUnit}</strong> (Tipe {receiptData.row.type})
                  </td>
                </tr>
                {receiptData.payment.keterangan && (
                  <tr>
                    <td style={{ padding: '6px 0', fontWeight: 700, color: '#374151' }}>Keterangan / Berita</td>
                    <td style={{ padding: '6px 0', color: '#4b5563' }}>: {receiptData.payment.keterangan}</td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: '12px 0', fontWeight: 700, color: '#374151' }}>Jumlah Nominal</td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ border: '2px solid #000', background: '#f1f5f9', padding: '6px 14px', borderRadius: '4px', fontSize: '1.15rem', fontWeight: 900, color: '#047857' }}>
                      : {formatRupiah(receiptData.payment.jumlah)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #ccc' }}>
              <div style={{ textAlign: 'center', width: '180px' }}>
                <div style={{ fontSize: '0.78rem', color: '#666', marginBottom: '45px' }}>Penyetor / Konsumen,</div>
                <div style={{ fontWeight: 800, borderTop: '1px solid #000', paddingTop: '4px', fontSize: '0.82rem' }}>
                  {receiptData.row.namaKonsumen}
                </div>
              </div>
              <div style={{ textAlign: 'center', width: '180px' }}>
                <div style={{ fontSize: '0.78rem', color: '#666', marginBottom: '45px' }}>Finance & Kasir,</div>
                <div style={{ fontWeight: 800, borderTop: '1px solid #000', paddingTop: '4px', fontSize: '0.82rem' }}>
                  {receiptData.row.proyek?.includes('Park') ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setReceiptData(null)}
                style={{ background: '#e2e8f0', color: '#000', border: 'none', fontWeight: 800, padding: '7px 14px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Tutup
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handlePrintKwitansiDirect(receiptData.payment, receiptData.type, receiptData.row)}
                style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', border: 'none', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer' }}
              >
                <Printer size={15} /> Cetak Kwitansi Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PiutangKonsumenModule;
