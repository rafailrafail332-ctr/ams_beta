import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Receipt, 
  DollarSign, 
  CreditCard, 
  FileText, 
  Landmark, 
  Calculator, 
  PieChart, 
  Search, 
  Plus, 
  Printer, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  X, 
  ShieldCheck, 
  BarChart3, 
  Layers,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Building,
  RefreshCw,
  Wallet,
  Calendar,
  FileCheck,
  TrendingDown,
  ArrowRightLeft,
  Check
} from 'lucide-react';

export const FinanceModule = () => {
  const { currentUser, activeSubTab, setActiveSubTab, showNotification } = useApp();
  
  // 8 Exact Sub-Modules defined by user request
  const [activeTab, setActiveTab] = useState('pendapatan');

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProyek, setSelectedProyek] = useState('Semua Proyek');

  // Synchronization with Sidebar subTabKey
  useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      const validTabs = ['pendapatan', 'pengeluaran', 'piutang', 'utang', 'invoice', 'kas_bank', 'budget', 'laporan_keuangan'];
      if (validTabs.includes(activeSubTab)) {
        setActiveTab(activeSubTab);
      }
    }
  }, [activeSubTab]);

  const switchTab = (tabKey) => {
    setActiveTab(tabKey);
    if (setActiveSubTab) {
      setActiveSubTab(tabKey);
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // =========================================================================
  // 1. DATA PENDAPATAN (REVENUE)
  // =========================================================================
  const defaultPendapatan = [
    { id: 'REV-2026-001', tanggal: '2026-08-25', kategori: 'Uang Muka (DP)', customer: 'Budi Santoso', proyek: 'Ashoka Park', unit: 'A-01', nominal: 130000000, tipeBayar: 'Transfer Bank Mandiri', status: 'Lunas', rekening: 'Bank Mandiri (131-00-1928374-1)', catatan: 'DP Tahap 1 Unit Emerald' },
    { id: 'REV-2026-002', tanggal: '2026-08-26', kategori: 'Pencairan KPR Bank', customer: 'Siti Rahmawati', proyek: 'Ashoka Park', unit: 'A-02', nominal: 536000000, tipeBayar: 'Pencairan Akad 100%', status: 'Lunas', rekening: 'Bank BTN (001-22-9018273-0)', catatan: 'Akad KPR BTN Syariah' },
    { id: 'REV-2026-003', tanggal: '2026-08-27', kategori: 'Cash Bertahap', customer: 'Dr. Ahmad Fauzi', proyek: 'Ashoka View', unit: 'B-05', nominal: 250000000, tipeBayar: 'Transfer BCA Giro', status: 'Lunas', rekening: 'BCA Bisnis (283-091-8821)', catatan: 'Cicilan 3 dari 12 bln' },
    { id: 'REV-2026-004', tanggal: '2026-08-28', kategori: 'Booking Fee (NUP)', customer: 'Hendrik Pratama', proyek: 'Ashoka View', unit: 'C-08', nominal: 10000000, tipeBayar: 'Transfer Bank Mandiri', status: 'Lunas', rekening: 'Bank Mandiri (131-00-1928374-1)', catatan: 'Booking Fee KPR Blok C' },
    { id: 'REV-2026-005', tanggal: '2026-08-30', kategori: 'Kelebihan Tanah (Hook)', customer: 'Rudi Hartono', proyek: 'Grand Ashoka', unit: 'H-01', nominal: 45000000, tipeBayar: 'Transfer BCA Giro', status: 'Lunas', rekening: 'BCA Bisnis (283-091-8821)', catatan: 'Kelebihan luas 30m2' },
    { id: 'REV-2026-006', tanggal: '2026-09-02', kategori: 'IPL & Pengelolaan Kawasan', customer: 'Paguyuban Warga Cluster Sapphire', proyek: 'Ashoka Park', unit: 'Fasum', nominal: 24500000, tipeBayar: 'Transfer Bank Mandiri', status: 'Lunas', rekening: 'Bank Mandiri (131-00-1928374-1)', catatan: 'Iuran Pengelolaan Lingkungan Q3' }
  ];

  const [pendapatanList, setPendapatanList] = useState(() => {
    try {
      const s = localStorage.getItem('ams_fin_pendapatan_v2');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return defaultPendapatan;
  });
  useEffect(() => {
    try { localStorage.setItem('ams_fin_pendapatan_v2', JSON.stringify(pendapatanList)); } catch(e) {}
  }, [pendapatanList]);

  const [isModalPendapatan, setIsModalPendapatan] = useState(false);
  const [formPendapatan, setFormPendapatan] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: 'Uang Muka (DP)',
    customer: '',
    proyek: 'Ashoka Park',
    unit: '',
    nominal: '',
    tipeBayar: 'Transfer Bank Mandiri',
    status: 'Lunas',
    rekening: 'Bank Mandiri (131-00-1928374-1)',
    catatan: ''
  });

  const handleSavePendapatan = (e) => {
    e.preventDefault();
    const item = {
      id: 'REV-2026-' + Date.now().toString().slice(-4),
      ...formPendapatan,
      nominal: Number(formPendapatan.nominal) || 0
    };
    setPendapatanList([item, ...pendapatanList]);
    setIsModalPendapatan(false);
    showNotification('Pemasukan ' + formatRupiah(item.nominal) + ' berhasil dicatat di Jurnal Penerimaan!', 'success');
  };

  // =========================================================================
  // 2. DATA PENGELUARAN (OPEX & CAPEX)
  // =========================================================================
  const defaultPengeluaran = [
    { id: 'EXP-2026-001', tanggal: '2026-08-20', kategori: 'Material & Konstruksi', deskripsi: 'Pembelian Semen Padang 400 Sak & Pasir Muntilan 6 Truk', proyek: 'Ashoka Park', penerima: 'CV Mitra Semen Abadi', nominal: 58000000, tipe: 'CapEx Proyek', status: 'Disetujui', sumberDana: 'Bank Mandiri Operasional', approvedBy: 'Pak Tarkum (CFO)' },
    { id: 'EXP-2026-002', tanggal: '2026-08-22', kategori: 'Upah & Borongan Kerja', deskripsi: 'Pembayaran Opname Progress Fisik Unit A-01 s/d A-04 (Plesteran)', proyek: 'Ashoka View', penerima: 'Mandor Joko Susanto', nominal: 34500000, tipe: 'CapEx Proyek', status: 'Disetujui', sumberDana: 'BCA Giro Proyek', approvedBy: 'Pak Fajar (Site Eng)' },
    { id: 'EXP-2026-003', tanggal: '2026-08-24', kategori: 'Pajak & BPHTB / PPh Final', deskripsi: 'Setoran PPh Final 2.5% Penjualan Unit A-01 & A-02 ke Kas Negara', proyek: 'Semua Proyek', penerima: 'KPP Pratama / Kas Negara', nominal: 32500000, tipe: 'Legal & Pajak', status: 'Disetujui', sumberDana: 'Bank BTN Khusus Pajak', approvedBy: 'Pak Syamsul (Tax)' },
    { id: 'EXP-2026-004', tanggal: '2026-08-26', kategori: 'Marketing & Promosi', deskripsi: 'Sewa Billboard Tol Pasteur & Budget Kampanye Meta & TikTok Ads', proyek: 'Semua Proyek', penerima: 'Agency Kreasi Media Promosindo', nominal: 22000000, tipe: 'OpEx Kantor', status: 'Disetujui', sumberDana: 'BCA Giro Proyek', approvedBy: 'Bu Yulieka (Head Mkt)' },
    { id: 'EXP-2026-005', tanggal: '2026-08-28', kategori: 'Operasional Kantor (GA)', deskripsi: 'Biaya Utilitas PLN, Internet Kantor, Kendaraan Operasional & Konsumsi', proyek: 'Head Office', penerima: 'General Affair (Pak Dodi)', nominal: 16800000, tipe: 'OpEx Kantor', status: 'Disetujui', sumberDana: 'Kas Kecil (Petty Cash)', approvedBy: 'Pak Dodi (GA)' },
    { id: 'EXP-2026-006', tanggal: '2026-09-01', kategori: 'Legalitas & Notaris', deskripsi: 'Biaya Pemecahan / Splitzing Sertifikat SHM 12 Kavling BPN', proyek: 'Ashoka View', penerima: 'Kantor Notaris Anita Wardani, SH., M.Kn', nominal: 42000000, tipe: 'Legal & Pajak', status: 'Disetujui', sumberDana: 'Bank Mandiri Operasional', approvedBy: 'Bu Salma (Legal)' }
  ];

  const [pengeluaranList, setPengeluaranList] = useState(() => {
    try {
      const s = localStorage.getItem('ams_fin_pengeluaran_v2');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return defaultPengeluaran;
  });
  useEffect(() => {
    try { localStorage.setItem('ams_fin_pengeluaran_v2', JSON.stringify(pengeluaranList)); } catch(e) {}
  }, [pengeluaranList]);

  const [isModalPengeluaran, setIsModalPengeluaran] = useState(false);
  const [formPengeluaran, setFormPengeluaran] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: 'Material & Konstruksi',
    deskripsi: '',
    proyek: 'Ashoka Park',
    penerima: '',
    nominal: '',
    tipe: 'CapEx Proyek',
    status: 'Disetujui',
    sumberDana: 'Bank Mandiri Operasional',
    approvedBy: currentUser?.name || 'Direksi'
  });

  const handleSavePengeluaran = (e) => {
    e.preventDefault();
    const item = {
      id: 'EXP-2026-' + Date.now().toString().slice(-4),
      ...formPengeluaran,
      nominal: Number(formPengeluaran.nominal) || 0
    };
    setPengeluaranList([item, ...pengeluaranList]);
    setIsModalPengeluaran(false);
    showNotification('Pengeluaran ' + formatRupiah(item.nominal) + ' berhasil dicatat di Jurnal Pengeluaran!', 'success');
  };

  // =========================================================================
  // 3. DATA PIUTANG (ACCOUNTS RECEIVABLE - KONSUMEN & BANK)
  // =========================================================================
  const defaultPiutang = [
    { id: 'AR-2026-001', debitur: 'Bank BTN KC Bandung', kategori: 'Pencairan KPR (Akad Selesai)', unit: 'Unit A-05 (Rizal Hamdani)', proyek: 'Ashoka Park', totalPiutang: 485000000, terbayar: 0, sisaPiutang: 485000000, jatuhTempo: '2026-09-20', status: 'Proses BAST', usiaHari: 14, kontak: '0812-3344-5566' },
    { id: 'AR-2026-002', debitur: 'Budi Santoso', kategori: 'Sisa Cicilan DP Unit', unit: 'Unit A-01 (Emerald)', proyek: 'Ashoka Park', totalPiutang: 65000000, terbayar: 35000000, sisaPiutang: 30000000, jatuhTempo: '2026-09-12', status: 'Jatuh Tempo Dekat', usiaHari: 28, kontak: '0813-8877-1122' },
    { id: 'AR-2026-003', debitur: 'Hendra Gunawan', kategori: 'Pelunasan Cash Bertahap (Tahap 4)', unit: 'Unit B-02 (Sapphire)', proyek: 'Ashoka View', totalPiutang: 120000000, terbayar: 60000000, sisaPiutang: 60000000, jatuhTempo: '2026-09-02', status: 'Lewat Jatuh Tempo', usiaHari: 36, kontak: '0811-9988-7766' },
    { id: 'AR-2026-004', debitur: 'Bank Mandiri KC Dago', kategori: 'Retensi KPR 5% Pasca Garansi', unit: 'Unit C-03 (Kurniawan)', proyek: 'Ashoka Park', totalPiutang: 35000000, terbayar: 0, sisaPiutang: 35000000, jatuhTempo: '2026-10-15', status: 'Lancar', usiaHari: 8, kontak: '0812-7766-3321' },
    { id: 'AR-2026-005', debitur: 'Warga Cluster Sapphire (12 KK)', kategori: 'Tunggakan Retribusi & IPL Q2', unit: 'Blok A & B', proyek: 'Ashoka Park', totalPiutang: 14500000, terbayar: 0, sisaPiutang: 14500000, jatuhTempo: '2026-08-31', status: 'Lewat Jatuh Tempo', usiaHari: 48, kontak: 'Pengurus Paguyuban' }
  ];

  const [piutangList, setPiutangList] = useState(() => {
    try {
      const s = localStorage.getItem('ams_fin_piutang_v2');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return defaultPiutang;
  });
  useEffect(() => {
    try { localStorage.setItem('ams_fin_piutang_v2', JSON.stringify(piutangList)); } catch(e) {}
  }, [piutangList]);

  const handlePelunasanPiutang = (id) => {
    const item = piutangList.find(p => p.id === id);
    if (!item) return;
    const nominal = item.sisaPiutang;
    setPiutangList(piutangList.map(p => p.id === id ? { ...p, terbayar: p.totalPiutang, sisaPiutang: 0, status: 'Lunas' } : p));
    // otomatis catat di pendapatan
    const newRev = {
      id: 'REV-2026-' + Date.now().toString().slice(-4),
      tanggal: new Date().toISOString().split('T')[0],
      kategori: 'Pelunasan Piutang (' + item.kategori + ')',
      customer: item.debitur,
      proyek: item.proyek,
      unit: item.unit,
      nominal: nominal,
      tipeBayar: 'Transfer Bank Pelunasan',
      status: 'Lunas',
      rekening: 'Bank Mandiri (131-00-1928374-1)',
      catatan: 'Pelunasan otomatis piutang kode ' + item.id
    };
    setPendapatanList(prev => [newRev, ...prev]);
    showNotification('Piutang ' + item.debitur + ' sebesar ' + formatRupiah(nominal) + ' berhasil dilunasi & masuk ke Pendapatan!', 'success');
  };

  // =========================================================================
  // 4. DATA UTANG (ACCOUNTS PAYABLE - VENDOR & KONTRAKTOR)
  // =========================================================================
  const defaultUtang = [
    { id: 'AP-2026-001', kreditur: 'PT Holcim Beton ReadyMix', kategori: 'Pengecoran Jalan Utama Fasum', proyek: 'Ashoka Park', totalUtang: 110000000, terbayar: 40000000, sisaUtang: 70000000, jatuhTempo: '2026-09-18', status: 'Tempo 30 Hari', nomorPO: 'PO-BETON-092' },
    { id: 'AP-2026-002', kreditur: 'CV Sumber Besi Baja Utama', kategori: 'Besi Ulir 10mm & 12mm 5 Ton', proyek: 'Ashoka View', totalUtang: 85000000, terbayar: 35000000, sisaUtang: 50000000, jatuhTempo: '2026-09-25', status: 'Tempo 45 Hari', nomorPO: 'PO-BESI-114' },
    { id: 'AP-2026-003', kreditur: 'Mandor Supardi & Tim (Subkon Struktur)', kategori: 'Termin 2 Pembangunan Dinding & Dak Unit C-01 s/d C-03', proyek: 'Ashoka Park', totalUtang: 48000000, terbayar: 0, sisaUtang: 48000000, jatuhTempo: '2026-09-10', status: 'Jatuh Tempo Dekat', nomorPO: 'SPK-STRUKTUR-03' },
    { id: 'AP-2026-004', kreditur: 'Kantor Notaris & PPAT Anita SH', kategori: 'Akta PPJB & Kuasa Membebankan Hak Tanggungan (SKMHT)', proyek: 'Semua Proyek', totalUtang: 28000000, terbayar: 10000000, sisaUtang: 18000000, jatuhTempo: '2026-10-05', status: 'Lancar', nomorPO: 'INV-NOTARIS-88' },
    { id: 'AP-2026-005', kreditur: 'Dinas Penanaman Modal & PTSP', kategori: 'Retribusi PBG Induk Blok Perluasan', proyek: 'Grand Ashoka', totalUtang: 38000000, terbayar: 0, sisaUtang: 38000000, jatuhTempo: '2026-09-30', status: 'Tempo 30 Hari', nomorPO: 'SKRD-PBG-2026' }
  ];

  const [utangList, setUtangList] = useState(() => {
    try {
      const s = localStorage.getItem('ams_fin_utang_v2');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return defaultUtang;
  });
  useEffect(() => {
    try { localStorage.setItem('ams_fin_utang_v2', JSON.stringify(utangList)); } catch(e) {}
  }, [utangList]);

  const handleBayarUtang = (id) => {
    const item = utangList.find(u => u.id === id);
    if (!item) return;
    const nominal = item.sisaUtang;
    setUtangList(utangList.map(u => u.id === id ? { ...u, terbayar: u.totalUtang, sisaUtang: 0, status: 'Lunas' } : u));
    // otomatis catat di pengeluaran
    const newExp = {
      id: 'EXP-2026-' + Date.now().toString().slice(-4),
      tanggal: new Date().toISOString().split('T')[0],
      kategori: 'Pelunasan Utang (' + item.kategori + ')',
      deskripsi: 'Pelunasan tagihan ke ' + item.kreditur + ' (Ref: ' + item.nomorPO + ')',
      proyek: item.proyek,
      penerima: item.kreditur,
      nominal: nominal,
      tipe: 'CapEx Proyek',
      status: 'Disetujui',
      sumberDana: 'Bank Mandiri Operasional',
      approvedBy: currentUser?.name || 'CFO Tarkum'
    };
    setPengeluaranList(prev => [newExp, ...prev]);
    showNotification('Utang ke ' + item.kreditur + ' sebesar ' + formatRupiah(nominal) + ' berhasil dibayarkan & tercatat di Pengeluaran!', 'success');
  };

  // =========================================================================
  // 5. DATA INVOICE & PEMBAYARAN (BILLING & OFFICIAL KWITANSI)
  // =========================================================================
  const defaultInvoices = [
    { id: 'INV-2026-081', nomorKwitansi: 'KW-081/AMS/2026', tanggal: '2026-08-28', jatuhTempo: '2026-09-12', customer: 'Budi Santoso', proyek: 'Ashoka Park', unit: 'A-01 (Emerald)', deskripsi: 'Tagihan Uang Muka (DP) Tahap 2 & Peningkatan Mutu Granit', nominal: 45000000, terbayar: 45000000, status: 'Lunas', metode: 'Transfer Bank Mandiri' },
    { id: 'INV-2026-082', nomorKwitansi: 'KW-082/AMS/2026', tanggal: '2026-08-30', jatuhTempo: '2026-09-14', customer: 'Hendra Gunawan', proyek: 'Ashoka View', unit: 'B-02 (Sapphire)', deskripsi: 'Cicilan Cash Bertahap Tahap Ke-4 (Bulan Ke-4 dari 12)', nominal: 60000000, terbayar: 0, status: 'Menunggu Pembayaran', metode: 'BCA Bisnis Virtual Account' },
    { id: 'INV-2026-083', nomorKwitansi: 'KW-083/AMS/2026', tanggal: '2026-09-01', jatuhTempo: '2026-09-15', customer: 'Bank BTN KC Bandung', proyek: 'Ashoka Park', unit: 'A-05 (Rizal Hamdani)', deskripsi: 'Klaim Pencairan KPR 100% Akad Kredit SP3K Terbit', nominal: 485000000, terbayar: 0, status: 'Verifikasi Bank', metode: 'RTGS BTN Escrow' },
    { id: 'INV-2026-084', nomorKwitansi: 'KW-084/AMS/2026', tanggal: '2026-09-02', jatuhTempo: '2026-09-10', customer: 'Rudi Hartono', proyek: 'Grand Ashoka', unit: 'H-01 (Hook)', deskripsi: 'Pelunasan Pembelian Sisa Tanah Sudut (30m2)', nominal: 45000000, terbayar: 45000000, status: 'Lunas', metode: 'Transfer BCA Giro' }
  ];

  const [invoiceList, setInvoiceList] = useState(() => {
    try {
      const s = localStorage.getItem('ams_fin_invoice_v2');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return defaultInvoices;
  });
  useEffect(() => {
    try { localStorage.setItem('ams_fin_invoice_v2', JSON.stringify(invoiceList)); } catch(e) {}
  }, [invoiceList]);

  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [isModalInvoice, setIsModalInvoice] = useState(false);
  const [formInvoice, setFormInvoice] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jatuhTempo: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    customer: '',
    proyek: 'Ashoka Park',
    unit: '',
    deskripsi: '',
    nominal: '',
    metode: 'Transfer Bank Mandiri'
  });

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    const count = invoiceList.length + 1;
    const invNo = 'INV-2026-' + count.toString().padStart(3, '0');
    const kwNo = 'KW-' + count.toString().padStart(3, '0') + '/AMS/2026';
    const item = {
      id: invNo,
      nomorKwitansi: kwNo,
      ...formInvoice,
      nominal: Number(formInvoice.nominal) || 0,
      terbayar: 0,
      status: 'Menunggu Pembayaran'
    };
    setInvoiceList([item, ...invoiceList]);
    setIsModalInvoice(false);
    showNotification('Invoice tagihan ' + item.id + ' berhasil diterbitkan!', 'success');
  };

  // =========================================================================
  // 6. DATA KAS & BANK (MULTI-ACCOUNT & RECONCILIATION)
  // =========================================================================
  const defaultBankAccounts = [
    { id: 'ACC-01', bank: 'Bank Mandiri (Persero) Tbk', noRek: '131-00-1928374-1', atasNama: 'PT Ashoka Maha Samasta', jenis: 'Operasional Utama & Payroll', saldo: 1485000000, warna: '#0369a1' },
    { id: 'ACC-02', bank: 'Bank BTN (Persero) Tbk', noRek: '001-22-9018273-0', atasNama: 'PT Ashoka Maha Samasta (Escrow)', jenis: 'Escrow KPR & Pencairan Bank', saldo: 2340000000, warna: '#1d4ed8' },
    { id: 'ACC-03', bank: 'Bank Central Asia (BCA)', noRek: '283-091-8821', atasNama: 'PT Ashoka Maha Samasta', jenis: 'Giro Penerimaan Konsumen', saldo: 890000000, warna: '#047857' },
    { id: 'ACC-04', bank: 'Kas Brankas & Petty Cash Lapangan', noRek: 'CASH-SITE-01', atasNama: 'Pemegang Kas: Bu Salma / Pak Dodi', jenis: 'Kas Kecil Operasional Harian', saldo: 35400000, warna: '#d97706' }
  ];

  const [bankAccounts, setBankAccounts] = useState(() => {
    try {
      const s = localStorage.getItem('ams_fin_bank_accounts_v2');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return defaultBankAccounts;
  });

  const [isModalTransfer, setIsModalTransfer] = useState(false);
  const [formTransfer, setFormTransfer] = useState({
    dariRekening: 'Bank Mandiri (Persero) Tbk',
    keRekening: 'Kas Brankas & Petty Cash Lapangan',
    nominal: '',
    keterangan: 'Top-up Petty Cash Operasional Lapangan'
  });

  const handleExecuteTransfer = (e) => {
    e.preventDefault();
    const amount = Number(formTransfer.nominal) || 0;
    if (amount <= 0) return;
    setBankAccounts(bankAccounts.map(acc => {
      if (acc.bank.includes(formTransfer.dariRekening)) {
        return { ...acc, saldo: acc.saldo - amount };
      }
      if (acc.bank.includes(formTransfer.keRekening)) {
        return { ...acc, saldo: acc.saldo + amount };
      }
      return acc;
    }));
    setIsModalTransfer(false);
    showNotification('Transfer internal sebesar ' + formatRupiah(amount) + ' sukses diproses!', 'success');
  };

  // =========================================================================
  // 7. DATA BUDGET / ANGGARAN PROYEK (WBS COST CONTROL)
  // =========================================================================
  const defaultBudgetWBS = [
    { kode: 'WBS-1.0', kategori: 'Akuisisi Lahan & Legalitas Induk', alokasiBudget: 3500000000, realisasiAktual: 3200000000, proyek: 'Ashoka Park', pic: 'Direksi & Legal' },
    { kode: 'WBS-2.0', kategori: 'Perizinan PBG, Amdal & Pemda', alokasiBudget: 650000000, realisasiAktual: 580000000, proyek: 'Ashoka Park', pic: 'Legal Division' },
    { kode: 'WBS-3.0', kategori: 'Infrastruktur, Cut & Fill, Jalan & Drainase', alokasiBudget: 2200000000, realisasiAktual: 2150000000, proyek: 'Ashoka Park', pic: 'Tim Teknik' },
    { kode: 'WBS-4.0', kategori: 'Konstruksi Bangunan Unit (36/72 & 45/90)', alokasiBudget: 7800000000, realisasiAktual: 6950000000, proyek: 'Ashoka Park', pic: 'Teknik & Mandor' },
    { kode: 'WBS-5.0', kategori: 'Fasilitas Umum (Masjid, Taman & Gate)', alokasiBudget: 850000000, realisasiAktual: 790000000, proyek: 'Ashoka Park', pic: 'Teknik' },
    { kode: 'WBS-6.0', kategori: 'Marketing, Promosi Billboard & Komisi', alokasiBudget: 950000000, realisasiAktual: 880000000, proyek: 'Semua Proyek', pic: 'Marketing' },
    { kode: 'WBS-7.0', kategori: 'Overhead Kantor, GA & Gaji Karyawan', alokasiBudget: 1200000000, realisasiAktual: 1050000000, proyek: 'Head Office', pic: 'HR & GA' }
  ];

  const [budgetList] = useState(defaultBudgetWBS);

  // =========================================================================
  // 8. DATA LAPORAN KEUANGAN (PSAK 72 LABA RUGI & NERACA)
  // =========================================================================
  const totalRevenue = useMemo(() => {
    return pendapatanList.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  }, [pendapatanList]);

  const totalExpense = useMemo(() => {
    return pengeluaranList.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  }, [pengeluaranList]);

  const totalPiutangOutstanding = useMemo(() => {
    return piutangList.reduce((acc, curr) => acc + (Number(curr.sisaPiutang) || 0), 0);
  }, [piutangList]);

  const totalUtangOutstanding = useMemo(() => {
    return utangList.reduce((acc, curr) => acc + (Number(curr.sisaUtang) || 0), 0);
  }, [utangList]);

  const totalKasBank = useMemo(() => {
    return bankAccounts.reduce((acc, curr) => acc + curr.saldo, 0);
  }, [bankAccounts]);

  // HPP & Laba Rugi Calculations
  const hppKonstruksi = useMemo(() => {
    return pengeluaranList.filter(p => p.tipe === 'CapEx Proyek').reduce((a, b) => a + Number(b.nominal), 0);
  }, [pengeluaranList]);

  const labaKotor = totalRevenue - hppKonstruksi;
  const opexKantor = useMemo(() => {
    return pengeluaranList.filter(p => p.tipe !== 'CapEx Proyek').reduce((a, b) => a + Number(b.nominal), 0);
  }, [pengeluaranList]);

  const labaOperasional = labaKotor - opexKantor;
  const estimasiPajak = Math.max(0, totalRevenue * 0.025); // PPh Final 2.5% properti
  const labaBersihNet = labaOperasional - estimasiPajak;

  // Filtered Lists
  const filteredPendapatan = useMemo(() => {
    return pendapatanList.filter(item => {
      const matchSearch = (item.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.kategori || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.unit || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.id || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchProyek = selectedProyek === 'Semua Proyek' || item.proyek === selectedProyek;
      return matchSearch && matchProyek;
    });
  }, [pendapatanList, searchQuery, selectedProyek]);

  const filteredPengeluaran = useMemo(() => {
    return pengeluaranList.filter(item => {
      const matchSearch = (item.deskripsi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.penerima || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.kategori || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.id || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchProyek = selectedProyek === 'Semua Proyek' || item.proyek === selectedProyek || item.proyek === 'Semua Proyek';
      return matchSearch && matchProyek;
    });
  }, [pengeluaranList, searchQuery, selectedProyek]);

  return (
    <div className="module-container" style={{ padding: '1.25rem', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* EXECUTIVE HEADER */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.25rem',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}>
              <Landmark size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Direktorat Keuangan & Treasury
              </h1>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                Ashoka Real Estate Enterprise Financial Management System &bull; Standar PSAK 72
              </div>
            </div>
          </div>
        </div>

        {/* Proyek Filter Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.06)', padding: '0.4rem 0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Building size={16} color="#F59E0B" />
            <select
              value={selectedProyek}
              onChange={(e) => setSelectedProyek(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Semua Proyek" style={{ background: '#0f172a' }}>Semua Kawasan Proyek</option>
              <option value="Ashoka Park" style={{ background: '#0f172a' }}>Ashoka Park (Soreang)</option>
              <option value="Ashoka View" style={{ background: '#0f172a' }}>Ashoka View (Dago Hills)</option>
              <option value="Grand Ashoka" style={{ background: '#0f172a' }}>Grand Ashoka City</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#f8fafc' }}
          >
            <Printer size={15} /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* TOP 4 EXECUTIVE KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* KPI 1: TOTAL PENDAPATAN */}
        <div style={{ background: 'var(--bg-card)', padding: '1.1rem', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1, color: '#10B981' }}>
            <TrendingUp size={90} />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
            Total Pendapatan (Revenue)
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#10B981', marginTop: '0.35rem' }}>
            {formatRupiah(totalRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowUpRight size={14} /> Realisasi Pemasukan Akumulatif
          </div>
        </div>

        {/* KPI 2: TOTAL PENGELUARAN */}
        <div style={{ background: 'var(--bg-card)', padding: '1.1rem', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1, color: '#EF4444' }}>
            <TrendingDown size={90} />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
            Total Pengeluaran (OpEx/CapEx)
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#EF4444', marginTop: '0.35rem' }}>
            {formatRupiah(totalExpense)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowDownRight size={14} /> Konstruksi, Proyek & Kantor
          </div>
        </div>

        {/* KPI 3: SISA PIUTANG */}
        <div style={{ background: 'var(--bg-card)', padding: '1.1rem', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1, color: '#F59E0B' }}>
            <DollarSign size={90} />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
            Sisa Piutang (KPR & DP)
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#F59E0B', marginTop: '0.35rem' }}>
            {formatRupiah(totalPiutangOutstanding)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={14} /> Klaim Bank & Cicilan Konsumen
          </div>
        </div>

        {/* KPI 4: KAS & LIQUIDITY */}
        <div style={{ background: 'var(--bg-card)', padding: '1.1rem', borderRadius: '14px', border: '1px solid rgba(99, 102, 241, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1, color: '#6366F1' }}>
            <Wallet size={90} />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
            Likuiditas Kas & Bank
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#6366F1', marginTop: '0.35rem' }}>
            {formatRupiah(totalKasBank)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6366F1', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} /> Total Saldo 4 Rekening Resmi
          </div>
        </div>

      </div>

      {/* 8 EXACT TAB NAVIGATION BUTTONS */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        padding: '0.5rem',
        background: 'rgba(15, 23, 42, 0.7)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        marginBottom: '1.25rem'
      }}>
        {[
          { id: 'pendapatan', label: '1. Pendapatan', icon: TrendingUp, color: '#10B981' },
          { id: 'pengeluaran', label: '2. Pengeluaran', icon: Receipt, color: '#EF4444' },
          { id: 'piutang', label: '3. Piutang', icon: DollarSign, color: '#F59E0B' },
          { id: 'utang', label: '4. Utang', icon: CreditCard, color: '#EC4899' },
          { id: 'invoice', label: '5. Invoice & Pembayaran', icon: FileText, color: '#38BDF8' },
          { id: 'kas_bank', label: '6. Kas & Bank', icon: Landmark, color: '#6366F1' },
          { id: 'budget', label: '7. Budget / Anggaran', icon: Calculator, color: '#8B5CF6' },
          { id: 'laporan_keuangan', label: '8. Laporan Keuangan', icon: PieChart, color: '#14B8A6' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.1rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                background: isActive ? tab.color : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                boxShadow: isActive ? ('0 4px 14px ' + tab.color + '50') : 'none'
              }}
            >
              <Icon size={16} color={isActive ? '#ffffff' : tab.color} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: PENDAPATAN */}
      {/* ===================================================================== */}
      {activeTab === 'pendapatan' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Cari konsumen, unit, kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsModalPendapatan(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}
              >
                <Plus size={16} /> Catat Pendapatan Baru
              </button>
            </div>
          </div>

          <div className="table-responsive" style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table className="table" style={{ margin: 0, width: '100%' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KODE & TANGGAL</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KONSUMEN & PROYEK</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>ALIRAN PENDAPATAN</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>REKENING PENERIMA</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>NOMINAL (RP)</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPendapatan.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.85rem' }}>{item.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.tanggal}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.customer}</div>
                      <div style={{ fontSize: '0.75rem', color: '#F59E0B' }}>{item.proyek} &bull; Unit {item.unit}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                        {item.kategori}
                      </span>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.catatan}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.rekening}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 900, color: '#10B981', fontSize: '0.95rem' }}>
                      {formatRupiah(item.nominal)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <span className="badge" style={{ background: '#10B981', color: '#ffffff', fontSize: '0.72rem', padding: '0.25rem 0.6rem', borderRadius: '20px' }}>
                        ✓ {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: PENGELUARAN */}
      {/* ===================================================================== */}
      {activeTab === 'pengeluaran' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Cari penerima, deskripsi, kode pengeluaran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsModalPengeluaran(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none', fontWeight: 800 }}
              >
                <Plus size={16} /> Catat Pengeluaran Baru
              </button>
            </div>
          </div>

          <div className="table-responsive" style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table className="table" style={{ margin: 0, width: '100%' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KODE & TANGGAL</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>PENERIMA & PROYEK</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KEPERLUAN & KATEGORI</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>SUMBER DANA / BANK</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>NOMINAL (RP)</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>APPROVAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredPengeluaran.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.85rem' }}>{item.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.tanggal}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.penerima}</div>
                      <div style={{ fontSize: '0.75rem', color: '#F59E0B' }}>{item.proyek}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                        <span className="badge" style={{ background: item.tipe === 'CapEx Proyek' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: item.tipe === 'CapEx Proyek' ? '#60A5FA' : '#F87171', fontSize: '0.72rem' }}>
                          {item.tipe}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({item.kategori})</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{item.deskripsi}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.sumberDana}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 900, color: '#EF4444', fontSize: '0.95rem' }}>
                      {formatRupiah(item.nominal)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.72rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        ✓ {item.approvedBy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: PIUTANG */}
      {/* ===================================================================== */}
      {activeTab === 'piutang' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Schedule Umur Piutang (Aging Accounts Receivable)</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pemantauan pencairan KPR perbankan dan cicilan DP konsumen aktif</div>
            </div>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#F59E0B', fontWeight: 800, fontSize: '0.85rem' }}>
              Total Piutang Berjalan: {formatRupiah(totalPiutangOutstanding)}
            </div>
          </div>

          <div className="table-responsive" style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table className="table" style={{ margin: 0, width: '100%' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KODE & DEBITUR</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>OBJEK UNIT & PROYEK</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KATEGORI PIUTANG</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>JATUH TEMPO & UMUR</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>SISA PIUTANG</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {piutangList.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#F59E0B', fontSize: '0.85rem' }}>{item.id}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.debitur}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.kontak}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.unit}</div>
                      <div style={{ fontSize: '0.75rem', color: '#F59E0B' }}>{item.proyek}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontSize: '0.75rem' }}>
                        {item.kategori}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: item.status === 'Lewat Jatuh Tempo' ? '#EF4444' : 'var(--text-primary)' }}>
                        {item.jatuhTempo}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Usia: {item.usiaHari} Hari ({item.status})
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, color: item.sisaPiutang > 0 ? '#F59E0B' : '#10B981', fontSize: '0.95rem' }}>
                        {formatRupiah(item.sisaPiutang)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Total: {formatRupiah(item.totalPiutang)}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      {item.sisaPiutang > 0 ? (
                        <button
                          onClick={() => handlePelunasanPiutang(item.id)}
                          className="btn btn-sm"
                          style={{ background: '#10B981', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                        >
                          Pelunasan Lunas
                        </button>
                      ) : (
                        <span className="badge" style={{ background: '#10B981', color: '#fff' }}>✓ Lunas</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: UTANG */}
      {/* ===================================================================== */}
      {activeTab === 'utang' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Kewajiban & Utang Dagang (Accounts Payable)</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Jadwal termin subkontraktor borongan, suplier semen beton, dan rekanan</div>
            </div>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '10px', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#EC4899', fontWeight: 800, fontSize: '0.85rem' }}>
              Total Utang Vendor: {formatRupiah(totalUtangOutstanding)}
            </div>
          </div>

          <div className="table-responsive" style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table className="table" style={{ margin: 0, width: '100%' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KODE & KREDITUR</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>DESKRIPSI & PO / SPK</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>PROYEK</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>JATUH TEMPO</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>SISA UTANG</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {utangList.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#EC4899', fontSize: '0.85rem' }}>{item.id}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.kreditur}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.kategori}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)' }}>Ref: {item.nomorPO}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)' }}>{item.proyek}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: item.status === 'Jatuh Tempo Dekat' ? '#EF4444' : 'var(--text-primary)' }}>
                        {item.jatuhTempo}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.status}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, color: item.sisaUtang > 0 ? '#EC4899' : '#10B981', fontSize: '0.95rem' }}>
                        {formatRupiah(item.sisaUtang)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Total: {formatRupiah(item.totalUtang)}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      {item.sisaUtang > 0 ? (
                        <button
                          onClick={() => handleBayarUtang(item.id)}
                          className="btn btn-sm"
                          style={{ background: '#EC4899', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                        >
                          Bayar Utang
                        </button>
                      ) : (
                        <span className="badge" style={{ background: '#10B981', color: '#fff' }}>✓ Lunas</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: INVOICE & PEMBAYARAN */}
      {/* ===================================================================== */}
      {activeTab === 'invoice' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Invoice Tagihan & Kwitansi Resmi</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pembuatan faktur billing unit, tanda terima uang muka, dan kwitansi legal developer</div>
            </div>
            <button
              onClick={() => setIsModalInvoice(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800 }}
            >
              <Plus size={16} /> Buat Invoice Baru
            </button>
          </div>

          <div className="table-responsive" style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table className="table" style={{ margin: 0, width: '100%' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>NO INVOICE & KWITANSI</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KONSUMEN / PEMOHON</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>UNIT & PROYEK</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>URAIAN PEMBAYARAN</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>NOMINAL (RP)</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>AKSI & CETAK</th>
                </tr>
              </thead>
              <tbody>
                {invoiceList.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.85rem' }}>{inv.id}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inv.nomorKwitansi}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{inv.customer}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tgl: {inv.tanggal}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{inv.unit}</div>
                      <div style={{ fontSize: '0.72rem', color: '#F59E0B' }}>{inv.proyek}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                      {inv.deskripsi}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 900, color: '#38BDF8', fontSize: '0.95rem' }}>
                      {formatRupiah(inv.nominal)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => setPreviewInvoice(inv)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', borderColor: '#38BDF8', color: '#38BDF8' }}
                      >
                        <Printer size={13} /> Cetak Kwitansi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: KAS & BANK */}
      {/* ===================================================================== */}
      {activeTab === 'kas_bank' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Rekonsiliasi Kas, Rekening Bank & Treasury</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manajemen multi rekening bank, escrow BTN, rekening giro BCA & kas kecil</div>
            </div>
            <button
              onClick={() => setIsModalTransfer(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', border: 'none', fontWeight: 800 }}
            >
              <ArrowRightLeft size={16} /> Transfer Antar Bank (Internal)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {bankAccounts.map(acc => (
              <div
                key={acc.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ height: '4px', width: '100%', background: acc.warna, position: 'absolute', top: 0, left: 0 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className="badge" style={{ background: acc.warna + '20', color: acc.warna, border: '1px solid ' + acc.warna + '40', fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                      {acc.jenis}
                    </span>
                    <h4 style={{ margin: '0.5rem 0 0.2rem', fontSize: '1.05rem', fontWeight: 800 }}>{acc.bank}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No. Rek: <strong style={{ color: '#fff' }}>{acc.noRek}</strong></div>
                  </div>
                  <Landmark size={28} color={acc.warna} />
                </div>

                <div style={{ margin: '1rem 0 0.5rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saldo Efektif Tersedia</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff' }}>
                    {formatRupiah(acc.saldo)}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  A/N: <strong>{acc.atasNama}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 7: BUDGET / ANGGARAN */}
      {/* ===================================================================== */}
      {activeTab === 'budget' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>WBS Cost Control & Realisasi Anggaran Proyek</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Alokasi plafon RAB developer vs penyerapan riil di lapangan</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>✓ Status Budget: Aman</span>
            </div>
          </div>

          <div className="table-responsive" style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table className="table" style={{ margin: 0, width: '100%' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KODE WBS</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>KOMPONEN ANGGARAN</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>PLAFON BUDGET</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>REALISASI AKTUAL</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>SISA BUDGET</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', width: '160px' }}>PENYERAPAN</th>
                </tr>
              </thead>
              <tbody>
                {budgetList.map(b => {
                  const sisa = b.alokasiBudget - b.realisasiAktual;
                  const pct = Math.min(100, Math.round((b.realisasiAktual / b.alokasiBudget) * 100));
                  const isWarning = pct > 90;
                  return (
                    <tr key={b.kode} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{b.kode}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{b.kategori}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PIC: {b.pic} &bull; Proyek: {b.proyek}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }}>{formatRupiah(b.alokasiBudget)}</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#EF4444' }}>{formatRupiah(b.realisasiAktual)}</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#10B981' }}>{formatRupiah(sisa)}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, color: isWarning ? '#EF4444' : '#38BDF8' }}>{pct}%</span>
                          <span style={{ color: 'var(--text-muted)' }}>{isWarning ? 'Mendekati Limit' : 'Aman'}</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: pct + '%', height: '100%', background: isWarning ? '#EF4444' : '#38BDF8', borderRadius: '3px' }} />
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

      {/* ===================================================================== */}
      {/* TAB 8: LAPORAN KEUANGAN */}
      {/* ===================================================================== */}
      {activeTab === 'laporan_keuangan' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Laporan Keuangan Komprehensif (Laba Rugi & Neraca PSAK 72)</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Audit internal manajemen properti, pengakuan pendapatan kontrak konsumen & posisi kas</div>
            </div>
            <button
              onClick={() => window.print()}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #14B8A6, #0D9488)', border: 'none', fontWeight: 800 }}
            >
              <Printer size={16} /> Cetak Laporan Keuangan (A4)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
            
            {/* 1. LAPORAN LABA RUGI */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <TrendingUp size={20} color="#10B981" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>LAPORAN LABA RUGI (INCOME STATEMENT)</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800, color: '#10B981' }}>
                  <span>PENDAPATAN USAHA (REVENUE)</span>
                  <span>{formatRupiah(totalRevenue)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                  <span>HPP Konstruksi & Pembangunan Fisik</span>
                  <span>({formatRupiah(hppKonstruksi)})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                  <span>LABA KOTOR (GROSS PROFIT)</span>
                  <span style={{ color: '#10B981' }}>{formatRupiah(labaKotor)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                  <span>Beban Operasional Kantor (OpEx) & Marketing</span>
                  <span>({formatRupiah(opexKantor)})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                  <span>LABA OPERASIONAL (EBITDA)</span>
                  <span style={{ color: '#10B981' }}>{formatRupiah(labaOperasional)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                  <span>Estimasi PPh Final 2.5% Penjualan Real Estate</span>
                  <span>({formatRupiah(estimasiPajak)})</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  borderTop: '2px solid var(--border-color)',
                  paddingTop: '0.75rem',
                  marginTop: '0.5rem',
                  color: labaBersihNet >= 0 ? '#10B981' : '#EF4444',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px'
                }}>
                  <span>LABA BERSIH (NET PROFIT)</span>
                  <span>{formatRupiah(labaBersihNet)}</span>
                </div>
              </div>
            </div>

            {/* 2. LAPORAN POSISI KEUANGAN (NERACA) */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <PieChart size={20} color="#38BDF8" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>NERACA KEUANGAN (BALANCE SHEET)</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.9rem' }}>AKTIVA / ASET LANCAR</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                  <span>Kas & Setara Kas di Bank</span>
                  <span>{formatRupiah(totalKasBank)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                  <span>Piutang Konsumen & Klaim KPR</span>
                  <span>{formatRupiah(totalPiutangOutstanding)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800, borderTop: '1px dashed var(--border-color)', paddingTop: '0.4rem' }}>
                  <span>TOTAL ASET LANCAR</span>
                  <span style={{ color: '#38BDF8' }}>{formatRupiah(totalKasBank + totalPiutangOutstanding)}</span>
                </div>

                <div style={{ fontWeight: 800, color: '#EC4899', fontSize: '0.9rem', marginTop: '0.5rem' }}>PASIVA / KEWAJIBAN & UTANG</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                  <span>Utang Dagang Subkon & Suplier Semen</span>
                  <span>{formatRupiah(totalUtangOutstanding)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                  <span>Uang Muka Diterima Dimuka</span>
                  <span>{formatRupiah(130000000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800, borderTop: '1px dashed var(--border-color)', paddingTop: '0.4rem' }}>
                  <span>TOTAL KEWAJIBAN</span>
                  <span style={{ color: '#EC4899' }}>{formatRupiah(totalUtangOutstanding + 130000000)}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  borderTop: '2px solid var(--border-color)',
                  paddingTop: '0.75rem',
                  marginTop: '0.5rem',
                  color: '#ffffff',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px'
                }}>
                  <span>EKUITAS BERSIH PERUSAHAAN</span>
                  <span style={{ color: '#10B981' }}>{formatRupiah((totalKasBank + totalPiutangOutstanding) - (totalUtangOutstanding + 130000000))}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODALS SECTION */}
      {/* ===================================================================== */}
      
      {/* MODAL 1: INPUT PENDAPATAN */}
      {isModalPendapatan && (
        <div className="modal-backdrop" onClick={() => setIsModalPendapatan(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Catat Pendapatan & Kas Masuk</h3>
              <button onClick={() => setIsModalPendapatan(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePendapatan}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Konsumen / Instansi</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: Budi Santoso / Bank BTN"
                    value={formPendapatan.customer}
                    onChange={e => setFormPendapatan({ ...formPendapatan, customer: e.target.value })}
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Kawasan Proyek</label>
                    <select
                      className="form-control"
                      value={formPendapatan.proyek}
                      onChange={e => setFormPendapatan({ ...formPendapatan, proyek: e.target.value })}
                    >
                      <option value="Ashoka Park">Ashoka Park</option>
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Grand Ashoka">Grand Ashoka</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit Blok / No</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: A-01"
                      value={formPendapatan.unit}
                      onChange={e => setFormPendapatan({ ...formPendapatan, unit: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Aliran Pendapatan</label>
                    <select
                      className="form-control"
                      value={formPendapatan.kategori}
                      onChange={e => setFormPendapatan({ ...formPendapatan, kategori: e.target.value })}
                    >
                      <option value="Uang Muka (DP)">Uang Muka (DP)</option>
                      <option value="Pencairan KPR Bank">Pencairan KPR Bank</option>
                      <option value="Cash Bertahap">Cash Bertahap</option>
                      <option value="Booking Fee (NUP)">Booking Fee (NUP)</option>
                      <option value="Kelebihan Tanah (Hook)">Kelebihan Tanah (Hook)</option>
                      <option value="IPL & Pengelolaan Kawasan">IPL & Pengelolaan Kawasan</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nominal (Rp)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      placeholder="0"
                      value={formPendapatan.nominal}
                      onChange={e => setFormPendapatan({ ...formPendapatan, nominal: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Rekening Bank Penerima</label>
                  <select
                    className="form-control"
                    value={formPendapatan.rekening}
                    onChange={e => setFormPendapatan({ ...formPendapatan, rekening: e.target.value })}
                  >
                    <option value="Bank Mandiri (131-00-1928374-1)">Bank Mandiri (131-00-1928374-1)</option>
                    <option value="Bank BTN (001-22-9018273-0)">Bank BTN Escrow (001-22-9018273-0)</option>
                    <option value="BCA Bisnis (283-091-8821)">BCA Bisnis (283-091-8821)</option>
                    <option value="Kas Tunai Lapangan">Kas Tunai Lapangan</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalPendapatan(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#10B981', border: 'none', fontWeight: 800 }}>Simpan Pendapatan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INPUT PENGELUARAN */}
      {isModalPengeluaran && (
        <div className="modal-backdrop" onClick={() => setIsModalPengeluaran(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Catat Pengeluaran & Biaya</h3>
              <button onClick={() => setIsModalPengeluaran(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePengeluaran}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Vendor / Penerima Dana</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: Mandor Joko / CV Mitra Semen"
                    value={formPengeluaran.penerima}
                    onChange={e => setFormPengeluaran({ ...formPengeluaran, penerima: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Uraian / Deskripsi Pengeluaran</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: Pembelian Semen 200 Sak Proyek Ashoka Park"
                    value={formPengeluaran.deskripsi}
                    onChange={e => setFormPengeluaran({ ...formPengeluaran, deskripsi: e.target.value })}
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Klasifikasi Akuntansi</label>
                    <select
                      className="form-control"
                      value={formPengeluaran.tipe}
                      onChange={e => setFormPengeluaran({ ...formPengeluaran, tipe: e.target.value })}
                    >
                      <option value="CapEx Proyek">CapEx Proyek (Konstruksi & Material)</option>
                      <option value="OpEx Kantor">OpEx Kantor (Operasional & GA)</option>
                      <option value="Legal & Pajak">Legal Notaris & Pajak</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nominal (Rp)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      placeholder="0"
                      value={formPengeluaran.nominal}
                      onChange={e => setFormPengeluaran({ ...formPengeluaran, nominal: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Sumber Dana Rekening</label>
                    <select
                      className="form-control"
                      value={formPengeluaran.sumberDana}
                      onChange={e => setFormPengeluaran({ ...formPengeluaran, sumberDana: e.target.value })}
                    >
                      <option value="Bank Mandiri Operasional">Bank Mandiri Operasional</option>
                      <option value="BCA Giro Proyek">BCA Giro Proyek</option>
                      <option value="Kas Kecil (Petty Cash)">Kas Kecil (Petty Cash)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Proyek Terkait</label>
                    <select
                      className="form-control"
                      value={formPengeluaran.proyek}
                      onChange={e => setFormPengeluaran({ ...formPengeluaran, proyek: e.target.value })}
                    >
                      <option value="Ashoka Park">Ashoka Park</option>
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Grand Ashoka">Grand Ashoka</option>
                      <option value="Semua Proyek">Semua Proyek / Head Office</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalPengeluaran(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#EF4444', border: 'none', fontWeight: 800 }}>Simpan Pengeluaran</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: BUAT INVOICE */}
      {isModalInvoice && (
        <div className="modal-backdrop" onClick={() => setIsModalInvoice(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Terbitkan Invoice & Tagihan</h3>
              <button onClick={() => setIsModalInvoice(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveInvoice}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Ditagihkan Kepada (Konsumen / Bank)</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Nama Konsumen / Lembaga"
                    value={formInvoice.customer}
                    onChange={e => setFormInvoice({ ...formInvoice, customer: e.target.value })}
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Kawasan Proyek</label>
                    <select
                      className="form-control"
                      value={formInvoice.proyek}
                      onChange={e => setFormInvoice({ ...formInvoice, proyek: e.target.value })}
                    >
                      <option value="Ashoka Park">Ashoka Park</option>
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Grand Ashoka">Grand Ashoka</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Objek Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: A-01 (Emerald)"
                      value={formInvoice.unit}
                      onChange={e => setFormInvoice({ ...formInvoice, unit: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Uraian Pembayaran</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: Pembayaran Cicilan DP Tahap 2"
                    value={formInvoice.deskripsi}
                    onChange={e => setFormInvoice({ ...formInvoice, deskripsi: e.target.value })}
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nominal Tagihan (Rp)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      placeholder="0"
                      value={formInvoice.nominal}
                      onChange={e => setFormInvoice({ ...formInvoice, nominal: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jatuh Tempo Tagihan</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={formInvoice.jatuhTempo}
                      onChange={e => setFormInvoice({ ...formInvoice, jatuhTempo: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalInvoice(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#38BDF8', border: 'none', fontWeight: 800 }}>Terbitkan Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: INTERNAL TRANSFER BANK */}
      {isModalTransfer && (
        <div className="modal-backdrop" onClick={() => setIsModalTransfer(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Transfer Dana Antar Bank (Internal)</h3>
              <button onClick={() => setIsModalTransfer(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleExecuteTransfer}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Dari Rekening Sumber</label>
                  <select
                    className="form-control"
                    value={formTransfer.dariRekening}
                    onChange={e => setFormTransfer({ ...formTransfer, dariRekening: e.target.value })}
                  >
                    <option value="Bank Mandiri">Bank Mandiri Operasional</option>
                    <option value="Bank BTN">Bank BTN Escrow</option>
                    <option value="Bank Central Asia">BCA Giro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ke Rekening Tujuan</label>
                  <select
                    className="form-control"
                    value={formTransfer.keRekening}
                    onChange={e => setFormTransfer({ ...formTransfer, keRekening: e.target.value })}
                  >
                    <option value="Kas Brankas">Kas Kecil (Petty Cash Lapangan)</option>
                    <option value="Bank Mandiri">Bank Mandiri Operasional</option>
                    <option value="Bank Central Asia">BCA Giro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Nominal Transfer (Rp)</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    placeholder="0"
                    value={formTransfer.nominal}
                    onChange={e => setFormTransfer({ ...formTransfer, nominal: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Keterangan / Catatan Treasury</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formTransfer.keterangan}
                    onChange={e => setFormTransfer({ ...formTransfer, keterangan: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalTransfer(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#6366F1', border: 'none', fontWeight: 800 }}>Proses Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PREVIEW KWITANSI RESMI DEVELOPER */}
      {previewInvoice && (
        <div className="modal-backdrop" onClick={() => setPreviewInvoice(null)} style={{ zIndex: 10000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', background: '#ffffff', color: '#0f172a', padding: '2rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>PT ASHOKA MAHA SAMASTA</h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Developer & Real Estate Construction &bull; Grand Soreang Bandung</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0284c7' }}>KWITANSI RESMI</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{previewInvoice.nomorKwitansi}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex' }}>
                <span style={{ width: '180px', color: '#64748b' }}>Sudah Terima Dari</span>
                <strong style={{ flex: 1, color: '#0f172a' }}>: {previewInvoice.customer}</strong>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ width: '180px', color: '#64748b' }}>Sejumlah Uang</span>
                <strong style={{ flex: 1, color: '#0f172a' }}>: {formatRupiah(previewInvoice.nominal)}</strong>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ width: '180px', color: '#64748b' }}>Untuk Pembayaran</span>
                <span style={{ flex: 1, color: '#334155' }}>: {previewInvoice.deskripsi} (Unit: {previewInvoice.unit} - {previewInvoice.proyek})</span>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ width: '180px', color: '#64748b' }}>Metode Penyetoran</span>
                <span style={{ flex: 1, color: '#334155' }}>: {previewInvoice.metode}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ border: '2px solid #10b981', color: '#10b981', fontWeight: 900, fontSize: '1.1rem', padding: '0.4rem 1.2rem', borderRadius: '8px', transform: 'rotate(-5deg)', display: 'inline-block' }}>
                  LUNAS / DIVERIFIKASI
                </div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '180px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Bandung, {previewInvoice.tanggal}</div>
                <div style={{ height: '60px' }} />
                <div style={{ fontWeight: 800, borderTop: '1px solid #0f172a', paddingTop: '4px' }}>Direktur Keuangan (CFO)</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>PT Ashoka Maha Samasta</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" onClick={() => setPreviewInvoice(null)} style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                Tutup
              </button>
              <button className="btn btn-primary" onClick={() => window.print()} style={{ background: '#0284c7', border: 'none' }}>
                <Printer size={15} /> Cetak Kwitansi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default FinanceModule;
