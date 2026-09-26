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
import * as XLSX from 'xlsx';
import { ASHOKA_PARK_SIGNATURE_BASE64, PERSADA_FOUR_LAND_LOGO_BASE64 } from './ashokaParkSignatureBase64';

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

  // Editing state for individual payment in history (DP / Angsuran)
  const [editingPayment, setEditingPayment] = useState(null);

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
    setEditingPayment(null);
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

  // Start Editing Payment in History
  const handleStartEditPayment = (payment, type) => {
    setEditingPayment({
      id: payment.id,
      type, // 'dp' | 'angsuran'
      tanggal: payment.tanggal || new Date().toISOString().split('T')[0],
      jumlah: payment.jumlah || 0,
      keterangan: payment.keterangan || ''
    });
  };

  // Save Edited Payment in History
  const handleSaveEditPayment = () => {
    if (!editingPayment || !activePaymentRow) return;

    const raw = (editingPayment.jumlah || '').toString().replace(/[^0-9]/g, '');
    const nominal = parseInt(raw, 10);
    if (!nominal || nominal <= 0) {
      showNotification('Masukkan jumlah nominal pembayaran yang valid!', 'warning');
      return;
    }

    const isDp = editingPayment.type === 'dp';
    const updatedList = piutangList.map((item) => {
      if (item.id === activePaymentRow.id) {
        if (isDp) {
          const dpPayments = (item.dpPayments || []).map((p) => {
            if (p.id === editingPayment.id) {
              return {
                ...p,
                tanggal: editingPayment.tanggal,
                jumlah: nominal,
                keterangan: (editingPayment.keterangan || '').trim() || 'Pembayaran DP'
              };
            }
            return p;
          });
          return { ...item, dpPayments };
        } else {
          const angsuranPayments = (item.angsuranPayments || []).map((p) => {
            if (p.id === editingPayment.id) {
              return {
                ...p,
                tanggal: editingPayment.tanggal,
                jumlah: nominal,
                keterangan: (editingPayment.keterangan || '').trim() || 'Pembayaran Angsuran'
              };
            }
            return p;
          });
          return { ...item, angsuranPayments };
        }
      }
      return item;
    });

    persistPiutangList(updatedList);
    const updatedRow = updatedList.find((i) => i.id === activePaymentRow.id);
    setActivePaymentRow(getCalculatedRow(updatedRow));
    setEditingPayment(null);
    showNotification(`Riwayat pembayaran ${isDp ? 'DP' : 'Angsuran'} berhasil diperbarui!`, 'success');
  };

  // Cancel Editing Payment
  const handleCancelEditPayment = () => {
    setEditingPayment(null);
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

  // Roman Month Helper for Receipt Numbering
  const getRomanMonth = (monthNum) => {
    const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return roman[parseInt(monthNum, 10)] || 'VI';
  };

  // Generate Receipt Number Matching User Photos
  const getKwitansiNumber = (row, dateStr) => {
    const isPark = row.proyek?.toLowerCase().includes('park');
    const d = dateStr ? new Date(dateStr) : new Date();
    const year = isNaN(d.getFullYear()) ? '2026' : d.getFullYear();
    const m = isNaN(d.getMonth()) ? 6 : d.getMonth() + 1;
    const romanMonth = getRomanMonth(m);

    if (isPark) {
      // Photo 1 format: FIN 0001/AP/KWI/VI/2026
      const seq = String(Math.floor(1 + Math.random() * 99)).padStart(4, '0');
      return `FIN ${seq}/AP/KWI/${romanMonth}/${year}`;
    } else {
      // Photo 2 format: FIN-001/AV/KWI/VI/2026
      const seq = String(Math.floor(1 + Math.random() * 99)).padStart(3, '0');
      return `FIN-${seq}/AV/KWI/${romanMonth}/${year}`;
    }
  };

  // Format Date with Bogor prefix (as seen in user photos)
  const formatTanggalBogor = (dateStr) => {
    if (!dateStr) {
      const now = new Date();
      return `Bogor, ${now.getDate()} ${['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][now.getMonth() + 1]} ${now.getFullYear()}`;
    }
    const parts = dateStr.split('-');
    if (parts.length < 3) return `Bogor, ${dateStr}`;
    const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parts[0];
    return `Bogor, ${day} ${monthNames[month] || month} ${year}`;
  };

  // Template Configuration for Ashoka Park vs Ashoka View
  const getKwitansiTemplateConfig = (row) => {
    const isPark = row.proyek?.toLowerCase().includes('park');
    if (isPark) {
      // Foto Sebelah Kiri (Ashoka Park / Persada Four Land)
      return {
        isPark: true,
        brandName: 'Persada Four Land',
        companyName: 'PT. Yazfi Setia Persada',
        companyNameUpper: 'PT. YAZFI SETIA PERSADA',
        projectCode: 'AP',
        accentColor: '#2b3a55', // Dark Navy Box
        accentTextColor: '#ffffff',
        footerBgColor: '#2b3a55',
        footerTextColor: '#ffffff',
        footerText: 'Komplek Ruko Bizhub, Blok RA-3, Jl. Raya Serpong Puspitek, Gunung Sindur - Bogor, Jawa Barat - Indonesia\nTelp. (021) 75678196',
        notesCompany: 'PT. Yazfi Setia Persada',
        signerName: 'Tarkum Aditiya'
      };
    } else {
      // Foto Sebelah Kanan (Ashoka View / Gema Persada Land)
      return {
        isPark: false,
        brandName: 'Gema Persada Land',
        companyName: 'PT. YAZFI GEMA PERSADA',
        companyNameUpper: 'PT YAZFI GEMA PERSADA',
        projectCode: 'AV',
        accentColor: '#d1a679', // Caramel / Tan / Gold Box
        accentTextColor: '#1e2022',
        footerBgColor: '#d1a679',
        footerTextColor: '#1e2022',
        footerText: 'Komplek Ruko Bizhub, Blok RA-3, Jl. Raya Serpong Puspitek, Gunung Sindur - Bogor, Jawa Barat - Indonesia. Telp. (021) 75678196',
        notesCompany: 'PT. Yazfi Setia Persada',
        signerName: 'Tarkum Aditiya'
      };
    }
  };

  // Generate Print HTML Exact Match to User's Two Photos
  const generateKwitansiPrintHtml = ({ payment, type, row, kwitansiNo }) => {
    const terbilangText = terbilang(payment.jumlah);
    const cfg = getKwitansiTemplateConfig(row);
    const tanggalBogor = formatTanggalBogor(payment.tanggal);
    const nominalFormatted = Number(payment.jumlah || 0).toLocaleString('id-ID');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Kwitansi - ${kwitansiNo} - ${row.namaKonsumen}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 10px;
      background: #ffffff;
      color: #000000;
    }
    .kwitansi-container {
      border: 1.5px solid #334155;
      background: #ffffff;
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
      position: relative;
      padding: 22px 26px 0;
    }
    .k-top-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 22px;
    }
    .k-brand-col {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .k-brand-text {
      display: flex;
      flex-direction: column;
    }
    .k-brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: 0.2px;
    }
    .k-company-sub {
      font-size: 11px;
      color: #475569;
      margin-top: 1px;
    }
    .k-banner-col {
      text-align: right;
    }
    .k-banner-box {
      font-size: 13.5px;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 6px 26px;
      text-align: center;
      display: inline-block;
    }
    .k-receipt-no {
      font-size: 12px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 5px;
      letter-spacing: 0.2px;
    }
    .k-body-rows {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 20px;
    }
    .k-form-row {
      display: flex;
      align-items: center;
    }
    .k-label-col {
      width: 155px;
      flex-shrink: 0;
    }
    .k-lbl-id {
      font-weight: 700;
      font-size: 12.5px;
      color: #1e293b;
    }
    .k-lbl-en {
      font-style: italic;
      font-size: 11px;
      color: #64748b;
      margin-top: 1px;
    }
    .k-colon {
      width: 18px;
      font-weight: 700;
      font-size: 13px;
      color: #1e293b;
      text-align: center;
    }
    .k-val-field {
      flex: 1;
      background: repeating-linear-gradient(to bottom, #ffffff 0px, #ffffff 21px, #e2e8f0 21px, #e2e8f0 22px);
      border-bottom: 1px solid #94a3b8;
      height: 24px;
      line-height: 24px;
      padding: 0 10px;
      display: flex;
      align-items: center;
    }
    .k-val-text {
      font-size: 13px;
      color: #0f172a;
    }
    .k-val-text.bold {
      font-weight: 700;
    }
    .k-multiline-field {
      flex: 1;
      background: repeating-linear-gradient(to bottom, #ffffff 0px, #ffffff 21px, #cbd5e1 21px, #cbd5e1 22px);
      border-bottom: 1px solid #94a3b8;
      display: flex;
      flex-direction: column;
    }
    .k-multi-line {
      height: 22px;
      line-height: 22px;
      padding: 0 10px;
      font-size: 12.5px;
      color: #0f172a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .k-multi-line.bold {
      font-weight: 700;
    }
    .k-divider-line {
      width: 100%;
      margin-bottom: 16px;
    }
    .k-bottom-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 22px;
      padding-top: 4px;
    }
    .k-bottom-left {
      width: 55%;
    }
    .k-rp-box {
      display: inline-flex;
      align-items: center;
      border-top: 3px double #334155;
      border-bottom: 3px double #334155;
      background: #f1f5f9;
      padding: 4px 18px;
      min-width: 250px;
      margin-bottom: 18px;
    }
    .k-rp-lbl {
      font-weight: 800;
      font-size: 13.5px;
      letter-spacing: 2px;
      color: #1e293b;
      margin-right: 18px;
    }
    .k-rp-val {
      font-weight: 900;
      font-size: 16px;
      letter-spacing: 0.5px;
      color: #0f172a;
    }
    .k-notes-box {
      font-size: 10.5px;
      color: #334155;
      line-height: 1.45;
    }
    .k-notes-title {
      font-weight: 700;
      margin-bottom: 2px;
    }
    .k-notes-item {
      color: #475569;
    }
    .k-sheet-no {
      font-size: 10px;
      color: #64748b;
      margin-top: 10px;
    }
    .k-bottom-right {
      width: 40%;
      text-align: center;
    }
    .k-sign-date {
      font-size: 12.5px;
      color: #1e293b;
      margin-bottom: 3px;
    }
    .k-sign-company {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
    }
    .k-stamp-sig-box {
      position: relative;
      width: 210px;
      height: 75px;
      margin: 4px auto 0;
    }
    .k-stamp-wrap {
      position: absolute;
      right: 10px;
      top: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      transform: rotate(-5deg);
      opacity: 0.88;
    }
    .k-stamp-txt {
      font-size: 11px;
      font-weight: 900;
      color: #0284c7;
      line-height: 1.1;
      text-align: left;
      letter-spacing: 0.4px;
    }
    .k-sig-svg {
      width: 190px;
      height: 75px;
      position: absolute;
      left: 5px;
      top: 0;
      pointer-events: none;
      z-index: 2;
    }
    .k-signer-name-wrap {
      margin-top: 2px;
    }
    .k-signer-name {
      font-weight: 800;
      font-size: 13px;
      color: #0f172a;
      border-bottom: 1.5px solid #000000;
      padding-bottom: 1px;
      display: inline-block;
      min-width: 140px;
    }
    .k-footer-bar {
      width: calc(100% + 52px);
      margin-left: -26px;
      padding: 7px 16px;
      text-align: center;
      font-size: 10px;
      line-height: 1.35;
      font-weight: 500;
    }
    @media print {
      body { padding: 0; }
      .kwitansi-container { box-shadow: none; max-width: 100%; border: 1.5px solid #000; }
    }
  </style>
</head>
<body>
  <div class="kwitansi-container">
    <!-- Top Header -->
    <div class="k-top-header">
      <!-- Left: Logo & Company -->
      <div class="k-brand-col">
        ${cfg.isPark ? `
          <img src="${PERSADA_FOUR_LAND_LOGO_BASE64}" alt="Persada Four Land Logo" style="width: 44px; height: 44px; object-fit: contain; display: block;" />
        ` : `
          <svg width="46" height="42" viewBox="0 0 110 90" fill="none">
            <circle cx="36" cy="40" r="22" stroke="#d4a373" stroke-width="11" fill="none"/>
            <circle cx="66" cy="38" r="22" stroke="#2b3a55" stroke-width="11" fill="none"/>
            <rect x="55" y="38" width="11" height="42" rx="4" fill="#2b3a55"/>
          </svg>
        `}
        <div class="k-brand-text">
          <div class="k-brand-title">${cfg.brandName}</div>
          <div class="k-company-sub">${cfg.companyName}</div>
        </div>
      </div>

      <!-- Right: Banner & No Kwitansi -->
      <div class="k-banner-col">
        <div class="k-banner-box" style="background-color: ${cfg.accentColor}; color: ${cfg.accentTextColor};">
          KWITANSI PEMBAYARAN
        </div>
        <div class="k-receipt-no">
          No. &nbsp;: &nbsp;<strong>${kwitansiNo}</strong>
        </div>
      </div>
    </div>

    <!-- 3 Data Rows -->
    <div class="k-body-rows">
      <!-- Row 1: Sudah Terima Dari -->
      <div class="k-form-row">
        <div class="k-label-col">
          <div class="k-lbl-id">Sudah Terima Dari</div>
          <div class="k-lbl-en">Received from</div>
        </div>
        <div class="k-colon">:</div>
        <div class="k-val-field">
          <span class="k-val-text bold">${(row.namaKonsumen || '').toUpperCase()}</span>
        </div>
      </div>

      <!-- Row 2: Uang Sebesar -->
      <div class="k-form-row">
        <div class="k-label-col">
          <div class="k-lbl-id">Uang Sebesar</div>
          <div class="k-lbl-en">Amount Received</div>
        </div>
        <div class="k-colon">:</div>
        <div class="k-val-field">
          <span class="k-val-text bold">${terbilangText}</span>
        </div>
      </div>

      <!-- Row 3: Untuk Pembayaran -->
      <div class="k-form-row" style="align-items: flex-start;">
        <div class="k-label-col" style="padding-top: 3px;">
          <div class="k-lbl-id">Untuk Pembayaran</div>
          <div class="k-lbl-en">In Payment Of</div>
        </div>
        <div class="k-colon" style="padding-top: 3px;">:</div>
        <div class="k-multiline-field">
          <div class="k-multi-line bold">Pembayaran ${type} Kavling ${row.proyek} Blok ${row.blok} No. ${row.noUnit}</div>
          <div class="k-multi-line">Tipe ${row.type} (Luas Bangunan: ${row.lb || 0} m², Luas Tanah: ${row.ltTotal || (Number(row.lt || 0) + Number(row.ltPlus || 0))} m²)</div>
          <div class="k-multi-line">${payment.keterangan ? 'Keterangan: ' + payment.keterangan : ''}</div>
          <div class="k-multi-line"></div>
        </div>
      </div>
    </div>

    <!-- Divider Line -->
    <div class="k-divider-line" style="border-top: 1.5px solid ${cfg.isPark ? '#2b3a55' : '#c89666'};"></div>

    <!-- Bottom Section -->
    <div class="k-bottom-section">
      <!-- Left: RP Box & Catatan -->
      <div class="k-bottom-left">
        <div class="k-rp-box">
          <span class="k-rp-lbl">RP</span>
          <span class="k-rp-val">${nominalFormatted},-</span>
        </div>

        <div class="k-notes-box">
          <div class="k-notes-title">catatan :</div>
          <div class="k-notes-item">1. Pembayaran dianggap sah apabila cek/bilyet giro telah dicairkan.</div>
          <div class="k-notes-item">2. Pembayaran melalui transfer efektif diterima jika sudah tertera di rekening ${cfg.notesCompany}.</div>
          <div class="k-sheet-no">Lembar 1</div>
        </div>
      </div>

      <!-- Right: Date, Company, Stamp, Signature -->
      <div class="k-bottom-right">
        <div class="k-sign-date">${tanggalBogor}</div>
        <div class="k-sign-company">${cfg.companyNameUpper}</div>

        ${cfg.isPark ? `
          <div style="display: flex; justify-content: center; margin-top: 4px; margin-bottom: 2px;">
            <img src="${ASHOKA_PARK_SIGNATURE_BASE64}" alt="Tanda Tangan & Stempel PT. Yazfi Setia Persada" style="width: 215px; height: auto; display: block;" />
          </div>
        ` : `
          <div class="k-stamp-sig-box">
            <!-- Stamp -->
            <div class="k-stamp-wrap">
              <svg width="36" height="32" viewBox="0 0 110 90" fill="none">
                <circle cx="36" cy="40" r="22" stroke="#d4a373" stroke-width="11" fill="none"/>
                <circle cx="66" cy="38" r="22" stroke="#0284c7" stroke-width="11" fill="none"/>
                <rect x="55" y="38" width="11" height="42" rx="4" fill="#0284c7"/>
              </svg>
              <div class="k-stamp-txt">
                PT Yazfi Gema<br/>Persada
              </div>
            </div>

            <!-- Signature Stroke -->
            <svg class="k-sig-svg" viewBox="0 0 190 75" fill="none">
              <path d="M 25 58 C 35 48, 48 35, 55 42 C 62 48, 68 55, 78 35 C 88 15, 95 10, 102 18 C 108 25, 112 40, 122 30 C 130 22, 138 18, 148 24 C 135 42, 120 54, 98 60 C 65 68, 38 68, 22 66" stroke="#111827" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M 92 24 L 126 26" stroke="#111827" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="k-signer-name-wrap">
            <span class="k-signer-name">${cfg.signerName}</span>
          </div>
        `}
      </div>
    </div>

    <!-- Full Width Footer Bar -->
    <div class="k-footer-bar" style="background-color: ${cfg.footerBgColor}; color: ${cfg.footerTextColor};">
      ${cfg.footerText.replace(/\n/g, '<br/>')}
    </div>
  </div>
</body>
</html>`;
  };

  // Download Kwitansi Format Excel (.xlsx) Sesuai Desain Foto
  const handleDownloadKwitansiExcel = (payment, type, row) => {
    try {
      const cfg = getKwitansiTemplateConfig(row);
      const kwitansiNo = getKwitansiNumber(row, payment.tanggal);
      const tanggalBogor = formatTanggalBogor(payment.tanggal);
      const terbilangText = terbilang(payment.jumlah);
      const ltTotal = row.ltTotal || (Number(row.lt || 0) + Number(row.ltPlus || 0));

      const wsData = [
        [cfg.brandName, '', '', '', 'KWITANSI PEMBAYARAN'],
        [cfg.companyName, '', '', '', `No.  : ${kwitansiNo}`],
        [],
        ['Sudah Terima Dari', ':', (row.namaKonsumen || '').toUpperCase()],
        ['Received from', '', ''],
        ['Uang Sebesar', ':', terbilangText],
        ['Amount Received', '', ''],
        ['Untuk Pembayaran', ':', `Pembayaran ${type} Kavling ${row.proyek} Blok ${row.blok} No. ${row.noUnit}`],
        ['In Payment Of', '', `Tipe ${row.type} (LB: ${row.lb || 0} m², LT: ${ltTotal} m²)`],
        ['', '', payment.keterangan ? `Keterangan: ${payment.keterangan}` : ''],
        [],
        ['====================================', '', '', '', tanggalBogor],
        [`RP   ${Number(payment.jumlah || 0).toLocaleString('id-ID')},-`, '', '', '', cfg.companyNameUpper],
        ['====================================', '', '', '', ''],
        [],
        ['catatan :', '', '', '', ''],
        ['1. Pembayaran dianggap sah apabila cek/bilyet giro telah dicairkan.', '', '', '', ''],
        [`2. Pembayaran melalui transfer efektif diterima jika sudah tertera di rekening ${cfg.notesCompany}.`, '', '', '', cfg.signerName],
        ['Lembar 1', '', '', '', '( Penanggung Jawab Keuangan )'],
        [],
        [cfg.footerText.replace(/\n/g, ' - '), '', '', '', '']
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws['!cols'] = [
        { wch: 22 },
        { wch: 4 },
        { wch: 38 },
        { wch: 10 },
        { wch: 34 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Kwitansi Resmi');

      const safeName = (row.namaKonsumen || 'Konsumen').replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeUnit = `${row.blok || 'X'}-${row.noUnit || '0'}`;
      const filename = `Kwitansi_${cfg.projectCode}_${safeUnit}_${safeName}.xlsx`;

      XLSX.writeFile(wb, filename);
      showNotification(`Kwitansi berhasil di-download format Excel: ${filename}`, 'success');
    } catch (err) {
      console.error('Download Excel error:', err);
      showNotification('Gagal mengunduh kwitansi format Excel: ' + err.message, 'error');
    }
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

    const kwitansiNo = getKwitansiNumber(row, payment.tanggal);

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
      row,
      kwitansiNo: getKwitansiNumber(row, payment.tanggal)
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
                    <td
                      style={{
                        textAlign: 'right',
                        padding: '8px 10px',
                        border: '1px solid #334155',
                        fontWeight: 900,
                        color: '#fbbf24',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleOpenPaymentModal(row, 'dp')}
                      title="Klik untuk melihat riwayat / history & edit pembayaran DP"
                    >
                      <div style={{ fontSize: '0.88rem' }}>{formatNumber(row.totalDp)}</div>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: '#94a3b8',
                          fontWeight: 600,
                          marginTop: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '3px',
                          textDecoration: 'underline',
                          textDecorationStyle: 'dotted'
                        }}
                      >
                        <Clock size={10} color="#94a3b8" />
                        <span>{(row.dpPayments || []).length}x bayar (History & Edit)</span>
                      </div>
                    </td>

                    {/* Sisa Pembayaran */}
                    <td style={{ textAlign: 'right', padding: '9px 10px', border: '1px solid #334155', fontWeight: 800, color: '#cbd5e1' }}>
                      {formatNumber(row.sisaPembayaran)}
                    </td>

                    {/* Angsuran (Klik untuk kelola Angsuran) */}
                    <td
                      style={{
                        textAlign: 'right',
                        padding: '8px 10px',
                        border: '1px solid #334155',
                        fontWeight: 900,
                        color: '#c084fc',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleOpenPaymentModal(row, 'angsuran')}
                      title="Klik untuk melihat riwayat / history & edit pembayaran Angsuran"
                    >
                      <div style={{ fontSize: '0.88rem' }}>{formatNumber(row.totalAngsuran)}</div>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: '#94a3b8',
                          fontWeight: 600,
                          marginTop: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '3px',
                          textDecoration: 'underline',
                          textDecorationStyle: 'dotted'
                        }}
                      >
                        <Clock size={10} color="#94a3b8" />
                        <span>{(row.angsuranPayments || []).length}x bayar (History & Edit)</span>
                      </div>
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
                  <CreditCard size={22} color="#10b981" /> Riwayat & Edit Pembayaran: {activePaymentRow.namaKonsumen}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '3px' }}>
                  {activePaymentRow.proyek} • Blok {activePaymentRow.blok} No. {activePaymentRow.noUnit} ({activePaymentRow.type})
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActivePaymentRow(null);
                  setEditingPayment(null);
                }}
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
                onClick={() => {
                  setPaymentSubTab('dp');
                  setEditingPayment(null);
                }}
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
                💳 Riwayat & Edit DP (Uang Muka)
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
                onClick={() => {
                  setPaymentSubTab('angsuran');
                  setEditingPayment(null);
                }}
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
                🏦 Riwayat & Edit Angsuran
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
                        {(activePaymentRow.dpPayments || []).map((p, idx) => {
                          const isEditing = editingPayment && editingPayment.id === p.id;
                          if (isEditing) {
                            return (
                              <tr key={p.id || idx} style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid #38bdf8' }}>
                                <td style={{ textAlign: 'center', fontWeight: 800, color: '#38bdf8' }}>{idx + 1}</td>
                                <td>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={editingPayment.tanggal}
                                    onChange={(e) => setEditingPayment({ ...editingPayment, tanggal: e.target.value })}
                                    style={{
                                      fontSize: '0.78rem',
                                      padding: '0.3rem 0.4rem',
                                      background: '#0f172a',
                                      color: '#ffffff',
                                      border: '1px solid #38bdf8',
                                      borderRadius: '4px',
                                      width: '100%'
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editingPayment.jumlah ? Number(editingPayment.jumlah).toLocaleString('en-US') : ''}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/[^0-9]/g, '');
                                      setEditingPayment({ ...editingPayment, jumlah: raw });
                                    }}
                                    placeholder="Nominal DP"
                                    style={{
                                      fontSize: '0.78rem',
                                      padding: '0.3rem 0.4rem',
                                      background: '#0f172a',
                                      color: '#34d399',
                                      fontWeight: 800,
                                      textAlign: 'right',
                                      border: '1px solid #38bdf8',
                                      borderRadius: '4px',
                                      width: '100%'
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editingPayment.keterangan}
                                    onChange={(e) => setEditingPayment({ ...editingPayment, keterangan: e.target.value })}
                                    placeholder="Keterangan DP"
                                    style={{
                                      fontSize: '0.78rem',
                                      padding: '0.3rem 0.4rem',
                                      background: '#0f172a',
                                      color: '#ffffff',
                                      border: '1px solid #38bdf8',
                                      borderRadius: '4px',
                                      width: '100%'
                                    }}
                                  />
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                    <button
                                      type="button"
                                      onClick={handleSaveEditPayment}
                                      title="Simpan Perubahan DP"
                                      style={{
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        fontSize: '0.72rem',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3px'
                                      }}
                                    >
                                      <CheckCircle2 size={12} /> Simpan
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEditPayment}
                                      title="Batal Edit"
                                      style={{
                                        background: '#334155',
                                        border: '1px solid #64748b',
                                        color: '#cbd5e1',
                                        fontWeight: 700,
                                        fontSize: '0.72rem',
                                        borderRadius: '4px',
                                        padding: '4px 7px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3px'
                                      }}
                                    >
                                      <X size={12} /> Batal
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return (
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
                                    onClick={() => handleStartEditPayment(p, 'dp')}
                                    title="Edit riwayat pembayaran DP ini"
                                    style={{
                                      background: 'rgba(234, 179, 8, 0.15)',
                                      border: '1px solid #eab308',
                                      color: '#facc15',
                                      borderRadius: '4px',
                                      padding: '3px 7px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      fontSize: '0.72rem',
                                      fontWeight: 800
                                    }}
                                  >
                                    <Edit3 size={11} /> Edit
                                  </button>
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
                          );
                        })}
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
                        {(activePaymentRow.angsuranPayments || []).map((p, idx) => {
                          const isEditing = editingPayment && editingPayment.id === p.id;
                          if (isEditing) {
                            return (
                              <tr key={p.id || idx} style={{ background: 'rgba(192, 132, 252, 0.12)', border: '1px solid #c084fc' }}>
                                <td style={{ textAlign: 'center', fontWeight: 800, color: '#c084fc' }}>{idx + 1}</td>
                                <td>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={editingPayment.tanggal}
                                    onChange={(e) => setEditingPayment({ ...editingPayment, tanggal: e.target.value })}
                                    style={{
                                      fontSize: '0.78rem',
                                      padding: '0.3rem 0.4rem',
                                      background: '#0f172a',
                                      color: '#ffffff',
                                      border: '1px solid #c084fc',
                                      borderRadius: '4px',
                                      width: '100%'
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editingPayment.jumlah ? Number(editingPayment.jumlah).toLocaleString('en-US') : ''}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/[^0-9]/g, '');
                                      setEditingPayment({ ...editingPayment, jumlah: raw });
                                    }}
                                    placeholder="Nominal Angsuran"
                                    style={{
                                      fontSize: '0.78rem',
                                      padding: '0.3rem 0.4rem',
                                      background: '#0f172a',
                                      color: '#34d399',
                                      fontWeight: 800,
                                      textAlign: 'right',
                                      border: '1px solid #c084fc',
                                      borderRadius: '4px',
                                      width: '100%'
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editingPayment.keterangan}
                                    onChange={(e) => setEditingPayment({ ...editingPayment, keterangan: e.target.value })}
                                    placeholder="Keterangan Angsuran"
                                    style={{
                                      fontSize: '0.78rem',
                                      padding: '0.3rem 0.4rem',
                                      background: '#0f172a',
                                      color: '#ffffff',
                                      border: '1px solid #c084fc',
                                      borderRadius: '4px',
                                      width: '100%'
                                    }}
                                  />
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                    <button
                                      type="button"
                                      onClick={handleSaveEditPayment}
                                      title="Simpan Perubahan Angsuran"
                                      style={{
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        fontSize: '0.72rem',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3px'
                                      }}
                                    >
                                      <CheckCircle2 size={12} /> Simpan
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEditPayment}
                                      title="Batal Edit"
                                      style={{
                                        background: '#334155',
                                        border: '1px solid #64748b',
                                        color: '#cbd5e1',
                                        fontWeight: 700,
                                        fontSize: '0.72rem',
                                        borderRadius: '4px',
                                        padding: '4px 7px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3px'
                                      }}
                                    >
                                      <X size={12} /> Batal
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return (
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
                                    onClick={() => handleStartEditPayment(p, 'angsuran')}
                                    title="Edit riwayat pembayaran angsuran ini"
                                    style={{
                                      background: 'rgba(234, 179, 8, 0.15)',
                                      border: '1px solid #eab308',
                                      color: '#facc15',
                                      borderRadius: '4px',
                                      padding: '3px 7px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      fontSize: '0.72rem',
                                      fontWeight: 800
                                    }}
                                  >
                                    <Edit3 size={11} /> Edit
                                  </button>
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
                          );
                        })}
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
                        handleDownloadKwitansiExcel(bkgPayment, 'Uang Tanda Jadi (Booking Fee)', kwitansiSelectRow);
                      }}
                      disabled={!kwitansiSelectRow.booking || kwitansiSelectRow.booking <= 0}
                      title="Download Excel Kwitansi Booking"
                      style={{
                        background: kwitansiSelectRow.booking > 0 ? 'linear-gradient(135deg, #10b981, #059669)' : '#334155',
                        border: '1px solid #10b981',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '7px 11px',
                        borderRadius: '6px',
                        cursor: kwitansiSelectRow.booking > 0 ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <FileText size={13} /> Excel
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
                            onClick={() => handlePrintKwitansiDirect(p, `Uang Muka (DP) Ke-${pIdx + 1}`, kwitansiSelectRow)}
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
                            onClick={() => handleDownloadKwitansiExcel(p, `Uang Muka (DP) Ke-${pIdx + 1}`, kwitansiSelectRow)}
                            title="Download Excel Kwitansi DP Ini"
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              border: '1px solid #34d399',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <FileText size={12} /> Excel
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePrintReceipt(p, `Uang Muka (DP) Ke-${pIdx + 1}`, kwitansiSelectRow)}
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
                      <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
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
                          <Printer size={12} /> Cetak Total DP ({formatRupiah(kwitansiSelectRow.totalDp)})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const totalDpPayment = {
                              id: `tot-dp-${kwitansiSelectRow.id}`,
                              tanggal: kwitansiSelectRow.dpPayments[kwitansiSelectRow.dpPayments.length - 1]?.tanggal || new Date().toISOString().split('T')[0],
                              jumlah: kwitansiSelectRow.totalDp,
                              keterangan: `Total Akumulasi Pembayaran DP (Uang Muka) Sebanyak ${(kwitansiSelectRow.dpPayments || []).length} Kali Termin`
                            };
                            handleDownloadKwitansiExcel(totalDpPayment, 'Total Akumulasi DP', kwitansiSelectRow);
                          }}
                          style={{
                            background: '#059669',
                            border: '1px solid #10b981',
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
                          <FileText size={12} /> Download Excel Total DP
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
                            onClick={() => handleDownloadKwitansiExcel(p, `Angsuran Ke-${pIdx + 1}`, kwitansiSelectRow)}
                            title="Download Excel Kwitansi Angsuran Ini"
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              border: '1px solid #34d399',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <FileText size={12} /> Excel
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
                      <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
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
                        <button
                          type="button"
                          onClick={() => {
                            const totalAngPayment = {
                              id: `tot-ang-${kwitansiSelectRow.id}`,
                              tanggal: kwitansiSelectRow.angsuranPayments[kwitansiSelectRow.angsuranPayments.length - 1]?.tanggal || new Date().toISOString().split('T')[0],
                              jumlah: kwitansiSelectRow.totalAngsuran,
                              keterangan: `Total Akumulasi Pembayaran Angsuran Sebanyak ${(kwitansiSelectRow.angsuranPayments || []).length} Kali Termin`
                            };
                            handleDownloadKwitansiExcel(totalAngPayment, 'Total Akumulasi Angsuran', kwitansiSelectRow);
                          }}
                          style={{
                            background: '#059669',
                            border: '1px solid #10b981',
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
                          <FileText size={12} /> Download Excel Total Angsuran
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
                        handleDownloadKwitansiExcel(totalPayment, 'Akumulasi Seluruh Pembayaran Masuk', kwitansiSelectRow);
                      }}
                      disabled={(kwitansiSelectRow.booking + kwitansiSelectRow.totalDp + kwitansiSelectRow.totalAngsuran) <= 0}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: '1px solid #34d399',
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
                      <FileText size={14} /> Download Excel
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
      {/* MODAL PREVIEW KWITANSI PEMBAYARAN (DESAIN FOTO ASLI)          */}
      {/* ------------------------------------------------------------- */}
      {receiptData && (() => {
        const cfg = getKwitansiTemplateConfig(receiptData.row);
        const kwitansiNo = receiptData.kwitansiNo || getKwitansiNumber(receiptData.row, receiptData.payment.tanggal);
        const tanggalBogor = formatTanggalBogor(receiptData.payment.tanggal);
        const terbilangText = terbilang(receiptData.payment.jumlah);
        const nominalFormatted = Number(receiptData.payment.jumlah || 0).toLocaleString('id-ID');
        const ltTotal = receiptData.row.ltTotal || (Number(receiptData.row.lt || 0) + Number(receiptData.row.ltPlus || 0));

        return (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(5px)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '820px',
                background: '#ffffff',
                color: '#000000',
                borderRadius: '8px',
                padding: '24px 26px 0',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
                border: '1.5px solid #334155',
                maxHeight: '92vh',
                overflowY: 'auto',
                fontFamily: 'Arial, Helvetica, sans-serif',
                position: 'relative'
              }}
            >
              {/* Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
                {/* Brand Col */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {cfg.isPark ? (
                    <img
                      src={PERSADA_FOUR_LAND_LOGO_BASE64}
                      alt="Persada Four Land Logo"
                      style={{ width: '44px', height: '44px', objectFit: 'contain', display: 'block' }}
                    />
                  ) : (
                    <svg width="46" height="42" viewBox="0 0 110 90" fill="none">
                      <circle cx="36" cy="40" r="22" stroke="#d4a373" strokeWidth="11" fill="none" />
                      <circle cx="66" cy="38" r="22" stroke="#2b3a55" strokeWidth="11" fill="none" />
                      <rect x="55" y="38" width="11" height="42" rx="4" fill="#2b3a55" />
                    </svg>
                  )}
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', letterSpacing: '0.2px' }}>
                      {cfg.brandName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>
                      {cfg.companyName}
                    </div>
                  </div>
                </div>

                {/* Banner Col */}
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      background: cfg.accentColor,
                      color: cfg.accentTextColor,
                      padding: '6px 26px',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      letterSpacing: '1px',
                      display: 'inline-block'
                    }}
                  >
                    KWITANSI PEMBAYARAN
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '5px' }}>
                    No. &nbsp;: &nbsp;<strong>{kwitansiNo}</strong>
                  </div>
                </div>
              </div>

              {/* Body 3 rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {/* Row 1: Sudah Terima Dari */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '155px', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#1e293b' }}>Sudah Terima Dari</div>
                    <div style={{ fontStyle: 'italic', fontSize: '11px', color: '#64748b', marginTop: '1px' }}>Received from</div>
                  </div>
                  <div style={{ width: '18px', fontWeight: 700, fontSize: '13px', color: '#1e293b', textAlign: 'center' }}>:</div>
                  <div style={{ flex: 1, background: 'repeating-linear-gradient(to bottom, #ffffff 0px, #ffffff 21px, #e2e8f0 21px, #e2e8f0 22px)', borderBottom: '1px solid #94a3b8', height: '24px', lineHeight: '24px', padding: '0 10px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                      {(receiptData.row.namaKonsumen || '').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Row 2: Uang Sebesar */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '155px', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#1e293b' }}>Uang Sebesar</div>
                    <div style={{ fontStyle: 'italic', fontSize: '11px', color: '#64748b', marginTop: '1px' }}>Amount Received</div>
                  </div>
                  <div style={{ width: '18px', fontWeight: 700, fontSize: '13px', color: '#1e293b', textAlign: 'center' }}>:</div>
                  <div style={{ flex: 1, background: 'repeating-linear-gradient(to bottom, #ffffff 0px, #ffffff 21px, #e2e8f0 21px, #e2e8f0 22px)', borderBottom: '1px solid #94a3b8', height: '24px', lineHeight: '24px', padding: '0 10px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                      {terbilangText}
                    </span>
                  </div>
                </div>

                {/* Row 3: Untuk Pembayaran */}
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ width: '155px', flexShrink: 0, paddingTop: '3px' }}>
                    <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#1e293b' }}>Untuk Pembayaran</div>
                    <div style={{ fontStyle: 'italic', fontSize: '11px', color: '#64748b', marginTop: '1px' }}>In Payment Of</div>
                  </div>
                  <div style={{ width: '18px', fontWeight: 700, fontSize: '13px', color: '#1e293b', textAlign: 'center', paddingTop: '3px' }}>:</div>
                  <div style={{ flex: 1, background: 'repeating-linear-gradient(to bottom, #ffffff 0px, #ffffff 21px, #cbd5e1 21px, #cbd5e1 22px)', borderBottom: '1px solid #94a3b8', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '22px', lineHeight: '22px', padding: '0 10px', fontSize: '12.5px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Pembayaran {receiptData.type} Kavling {receiptData.row.proyek} Blok {receiptData.row.blok} No. {receiptData.row.noUnit}
                    </div>
                    <div style={{ height: '22px', lineHeight: '22px', padding: '0 10px', fontSize: '12.5px', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Tipe {receiptData.row.type} (Luas Bangunan: {receiptData.row.lb || 0} m², Luas Tanah: {ltTotal} m²)
                    </div>
                    <div style={{ height: '22px', lineHeight: '22px', padding: '0 10px', fontSize: '12.5px', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {receiptData.payment.keterangan ? 'Keterangan: ' + receiptData.payment.keterangan : ''}
                    </div>
                    <div style={{ height: '22px', lineHeight: '22px', padding: '0 10px' }}></div>
                  </div>
                </div>
              </div>

              {/* Divider Line */}
              <div style={{ width: '100%', borderTop: `1.5px solid ${cfg.isPark ? '#2b3a55' : '#c89666'}`, marginBottom: '16px' }} />

              {/* Bottom Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', paddingTop: '4px' }}>
                {/* Left: RP & Catatan */}
                <div style={{ width: '55%' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', borderTop: '3px double #334155', borderBottom: '3px double #334155', background: '#f1f5f9', padding: '4px 18px', minWidth: '250px', marginBottom: '18px' }}>
                    <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '2px', color: '#1e293b', marginRight: '18px' }}>RP</span>
                    <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '0.5px', color: '#0f172a' }}>
                      {nominalFormatted},-
                    </span>
                  </div>

                  <div style={{ fontSize: '10.5px', color: '#334155', lineHeight: 1.45 }}>
                    <div style={{ fontWeight: 700, marginBottom: '2px' }}>catatan :</div>
                    <div style={{ color: '#475569' }}>1. Pembayaran dianggap sah apabila cek/bilyet giro telah dicairkan.</div>
                    <div style={{ color: '#475569' }}>2. Pembayaran melalui transfer efektif diterima jika sudah tertera di rekening ${cfg.notesCompany}.</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '10px' }}>Lembar 1</div>
                  </div>
                </div>

                {/* Right: Date, Company, Stamp, Signature */}
                <div style={{ width: '40%', textAlign: 'center' }}>
                  <div style={{ fontSize: '12.5px', color: '#1e293b', marginBottom: '3px' }}>{tanggalBogor}</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{cfg.companyNameUpper}</div>

                  {cfg.isPark ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px', marginBottom: '2px' }}>
                      <img
                        src={ASHOKA_PARK_SIGNATURE_BASE64}
                        alt="Tanda Tangan & Stempel PT. Yazfi Setia Persada"
                        style={{ width: '215px', height: 'auto', display: 'block' }}
                      />
                    </div>
                  ) : (
                    <>
                      <div style={{ position: 'relative', width: '210px', height: '75px', margin: '4px auto 0' }}>
                        {/* Stamp */}
                        <div style={{ position: 'absolute', right: '10px', top: '10px', display: 'flex', alignItems: 'center', gap: '6px', transform: 'rotate(-5deg)', opacity: 0.88 }}>
                          <svg width="36" height="32" viewBox="0 0 110 90" fill="none">
                            <circle cx="36" cy="40" r="22" stroke="#d4a373" strokeWidth="11" fill="none" />
                            <circle cx="66" cy="38" r="22" stroke="#0284c7" strokeWidth="11" fill="none" />
                            <rect x="55" y="38" width="11" height="42" rx="4" fill="#0284c7" />
                          </svg>
                          <div style={{ fontSize: '11px', fontWeight: 900, color: '#0284c7', lineHeight: 1.1, textAlign: 'left', letterSpacing: '0.4px' }}>
                            PT Yazfi Gema<br />Persada
                          </div>
                        </div>

                        {/* Signature */}
                        <svg style={{ width: '190px', height: '75px', position: 'absolute', left: '5px', top: 0, pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 190 75" fill="none">
                          <path d="M 25 58 C 35 48, 48 35, 55 42 C 62 48, 68 55, 78 35 C 88 15, 95 10, 102 18 C 108 25, 112 40, 122 30 C 130 22, 138 18, 148 24 C 135 42, 120 54, 98 60 C 65 68, 38 68, 22 66" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M 92 24 L 126 26" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </div>

                      <div style={{ marginTop: '2px' }}>
                        <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a', borderBottom: '1.5px solid #000000', paddingBottom: '1px', display: 'inline-block', minWidth: '140px' }}>
                          {cfg.signerName}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer Bar */}
              <div style={{ width: 'calc(100% + 52px)', marginLeft: '-26px', padding: '7px 16px', textAlign: 'center', fontSize: '10px', lineHeight: 1.35, fontWeight: 500, background: cfg.footerBgColor, color: cfg.footerTextColor }}>
                {cfg.footerText.split('\n').map((line, lIdx) => (
                  <div key={lIdx}>{line}</div>
                ))}
              </div>

              {/* Action Buttons at bottom of modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '16px 0', borderTop: '1px solid #e2e8f0', marginTop: '14px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setReceiptData(null)}
                  style={{ background: '#475569', color: '#ffffff', border: 'none', fontWeight: 800, padding: '7px 14px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  ✕ Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadKwitansiExcel(receiptData.payment, receiptData.type, receiptData.row)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <FileText size={15} /> Download Excel (.xlsx)
                </button>
                <button
                  type="button"
                  onClick={() => handlePrintKwitansiDirect(receiptData.payment, receiptData.type, receiptData.row)}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  <Printer size={15} /> Cetak / Download PDF
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default PiutangKonsumenModule;
