// =============================================================================
// AMS ENTERPRISE - FINANCE & ACCOUNTING INTEGRATED SERVICE (TAHAP 1)
// Central Hub Data Store untuk Keuangan, Rekening Bank, Jurnal, dan Pengajuan Dana Lintas Modul
// =============================================================================

import { fetchCloudStore, saveCloudStore } from '../supabase';

export const STORAGE_KEYS = {
  FUND_REQUESTS: 'ams_shared_fund_requests_v1',
  BANKS: 'ams_fin_banks_v1',
  COA: 'ams_fin_coa_v1',
  JURNAL: 'ams_fin_jurnal_v1',
  SALES: 'ams_fin_sales_v1',
  PAYABLES: 'ams_fin_payables_v1',
  TAXES: 'ams_fin_taxes_v1',
  PO: 'ams_fin_po_v1',
  JOBLIST: 'ams_fin_joblist_v1',
  AUDIT: 'ams_fin_audit_v1'
};

// =============================================================================
// 1. DATA AWAL: PENGAJUAN DANA LINTAS SEMUA MODUL (CROSS-MODULE FUND REQUESTS)
// =============================================================================
export const INITIAL_FUND_REQUESTS = [
  {
    id: 'REQ-2026-001',
    originModule: 'marketing',
    originModuleName: 'Marketing & Sales',
    requester: 'Adhi Himawan (GM / Marketing Head)',
    title: 'Sewa Booth & Dekorasi Pameran Properti Grand Metropolitan Mall',
    project: 'Ashoka View',
    category: 'Promosi & Event',
    amount: 15000000,
    requestDate: '2026-09-28',
    dueDate: '2026-10-05',
    priority: 'Mendesak',
    status: 'Disetujui',
    approvedBy: 'Yazid Hizbullah, S.E.,S.T',
    approvedAt: '2026-09-29',
    disbursedBankId: null,
    disbursedBankName: null,
    disbursedAt: null,
    accountCode: '5-201',
    notes: 'DP Sewa lokasi pameran 3 hari untuk penarikan 50 prospek KPR',
    attachments: [{ name: 'Proposal_Pameran_Mall_Metropolitan.pdf', size: '1.4 MB' }]
  },
  {
    id: 'REQ-2026-002',
    originModule: 'teknik',
    originModuleName: 'Teknik & Konstruksi',
    requester: 'Kholidin / Hapip Alamsyah (Teknik)',
    title: 'Termin 2 Progress 50% Pembangunan Unit Rumah Blok A5',
    project: 'Ashoka View',
    category: 'Termin Konstruksi BATP',
    amount: 45000000,
    requestDate: '2026-09-29',
    dueDate: '2026-10-06',
    priority: 'Tinggi',
    status: 'Menunggu Review',
    approvedBy: null,
    approvedAt: null,
    disbursedBankId: null,
    disbursedBankName: null,
    disbursedAt: null,
    accountCode: '5-101',
    notes: 'Sesuai BATP Lapangan No: BATP/ASH/2026/009, pekerjaan atap & dinding selesai',
    attachments: [{ name: 'BATP_Unit_A5_Progress_50.pdf', size: '2.8 MB' }]
  },
  {
    id: 'REQ-2026-003',
    originModule: 'hr-ga',
    originModuleName: 'HR & General Affair',
    requester: 'Dodi Syaiful Nugroho (Head HR & GA)',
    title: 'Peremajaan Unit AC Kantor Pemasaran & Pengadaan APD Rompi Lapangan',
    project: 'Head Office Bizhub',
    category: 'Fasilitas & Pemeliharaan',
    amount: 6800000,
    requestDate: '2026-09-30',
    dueDate: '2026-10-04',
    priority: 'Normal',
    status: 'Dicairkan',
    approvedBy: 'Yazid Hizbullah, S.E.,S.T',
    approvedAt: '2026-09-30',
    disbursedBankId: 'BCA-01',
    disbursedBankName: 'BCA Operasional Utama (002-988-1234)',
    disbursedAt: '2026-10-01',
    disbursedRef: 'TRX-DISB-2026-001',
    transferProofUrl: 'sample_transfer_proof',
    transferProofName: 'Struk_BCA_Transfer_REQ003.jpg',
    transferNotes: 'Transfer via KlikBCA Bisnis ke Rekening CV Sejuk Abadi Mandiri',
    accountCode: '5-301',
    notes: 'Servis rutin 3 unit AC Sharp & pembelian 12 rompi safety K3 satpam/staf',
    attachments: [{ name: 'Invoice_Bengkel_AC_APD.pdf', size: '890 KB' }]
  },
  {
    id: 'REQ-2026-004',
    originModule: 'legal',
    originModuleName: 'Legal & Perizinan',
    requester: 'Wahyu Salma Septiani, S.H (Legal)',
    title: 'Pajak BPHTB & Biaya Validasi Sertifikat BPN Kavling Ashoka 08',
    project: 'Ashoka View',
    category: 'Legalitas & Perizinan',
    amount: 18500000,
    requestDate: '2026-10-01',
    dueDate: '2026-10-08',
    priority: 'Tinggi',
    status: 'Menunggu Review',
    approvedBy: null,
    approvedAt: null,
    disbursedBankId: null,
    disbursedBankName: null,
    disbursedAt: null,
    accountCode: '5-401',
    notes: 'Proses validasi BPN dan pembayaran validasi perpajakan notaris PPAT',
    attachments: [{ name: 'Bukti_Validasi_BPN_Ashoka08.pdf', size: '1.9 MB' }]
  },
  {
    id: 'REQ-2026-005',
    originModule: 'procurement',
    originModuleName: 'Procurement & Logistik',
    requester: 'Divisi Pengadaan Bahan Material',
    title: 'Pelunasan Pembelian Semen Holcim 200 Sak & Besi Beton PO-2026-042',
    project: 'Bizhub Commercial',
    category: 'Pembelian Material PO',
    amount: 32000000,
    requestDate: '2026-10-02',
    dueDate: '2026-10-07',
    priority: 'Mendesak',
    status: 'Menunggu Review',
    approvedBy: null,
    approvedAt: null,
    disbursedBankId: null,
    disbursedBankName: null,
    disbursedAt: null,
    accountCode: '2-101',
    notes: 'Supplier: PT Semen Nusantara Perkasa - Jatuh tempo 7 hari',
    attachments: [{ name: 'PO_Material_042_Invoice.pdf', size: '2.1 MB' }]
  },
  {
    id: 'REQ-2026-006',
    originModule: 'teknik',
    originModuleName: 'Teknik & Konstruksi',
    requester: 'Kholidin (Teknik Lapangan)',
    title: 'Pengurukan & Pematangan Lahan Blok B Ashoka Park',
    project: 'Ashoka Park',
    category: 'Konstruksi & Cut-Fill',
    amount: 28000000,
    requestDate: '2026-10-02',
    dueDate: '2026-10-08',
    priority: 'Tinggi',
    status: 'Menunggu Review',
    approvedBy: null,
    approvedAt: null,
    disbursedBankId: null,
    disbursedBankName: null,
    disbursedAt: null,
    accountCode: '5-101',
    notes: 'Pekerjaan perataan jalan boulevard dan saluran drainase Blok B Ashoka Park',
    attachments: [{ name: 'SPK_Pematangan_Lahan_AshokaPark.pdf', size: '2.4 MB' }]
  },
  {
    id: 'REQ-2026-007',
    originModule: 'marketing',
    originModuleName: 'Marketing & Sales',
    requester: 'Adhi Himawan (Marketing Head)',
    title: 'Pemasangan Billboard & Umbul-umbul Gerbang Masuk Ashoka Park',
    project: 'Ashoka Park',
    category: 'Promosi & Event',
    amount: 12500000,
    requestDate: '2026-10-01',
    dueDate: '2026-10-06',
    priority: 'Normal',
    status: 'Disetujui',
    approvedBy: 'Yazid Hizbullah, S.E.,S.T',
    approvedAt: '2026-10-01',
    disbursedBankId: null,
    disbursedBankName: null,
    disbursedAt: null,
    accountCode: '5-201',
    notes: 'Branding promosi gerbang masuk cluster baru Ashoka Park',
    attachments: [{ name: 'Desain_Billboard_AshokaPark.pdf', size: '3.1 MB' }]
  }
];

// =============================================================================
// 2. DATA AWAL: REKENING KAS & BANK PERUSAHAAN (BANK & CASH ACCOUNTS)
// =============================================================================
export const INITIAL_BANKS = [
  {
    id: 'BCA-01',
    name: 'BCA Operasional Utama',
    accountNumber: '002-988-1234',
    accountHolder: 'PT Ashoka Multi Sinergi',
    bankType: 'Bank Operasional',
    balance: 473200000, // Setelah dikurangi REQ-2026-003 Rp 6.8jt
    accountCode: '1-102',
    status: 'Aktif',
    color: '#0284c7'
  },
  {
    id: 'MDR-01',
    name: 'Mandiri Escrow Penjualan Bizhub',
    accountNumber: '137-00-998877-1',
    accountHolder: 'PT Ashoka Multi Sinergi (Escrow)',
    bankType: 'Rekening Escrow / Konsumen',
    balance: 750000000,
    accountCode: '1-103',
    status: 'Aktif',
    color: '#0d9488'
  },
  {
    id: 'BSI-01',
    name: 'BSI Proyek Syariah Ashoka',
    accountNumber: '712-4455-890',
    accountHolder: 'PT Ashoka Properti Syariah',
    bankType: 'Bank Konstruksi',
    balance: 320000000,
    accountCode: '1-104',
    status: 'Aktif',
    color: '#16a34a'
  },
  {
    id: 'KAS-01',
    name: 'Kas Tunai Kecil (Petty Cash)',
    accountNumber: 'KAS-HO-INTERNAL',
    accountHolder: 'Kasir Internal Finance (HO)',
    bankType: 'Kas Tunai',
    balance: 25000000,
    accountCode: '1-101',
    status: 'Aktif',
    color: '#d97706'
  }
];

// =============================================================================
// 3. DATA AWAL: BAGAN AKUN STANDAR PROPERTI (CHART OF ACCOUNTS - COA)
// =============================================================================
export const INITIAL_COA = [
  // 1. ASET
  { code: '1-101', name: 'Kas Tunai / Kas Kecil', category: 'Aset Lancar', normalBalance: 'Debit', balance: 25000000, description: 'Uang kas tunai di brankas kantor HO' },
  { code: '1-102', name: 'Bank BCA Operasional Utama', category: 'Aset Lancar', normalBalance: 'Debit', balance: 473200000, description: 'Rekening operasional harian' },
  { code: '1-103', name: 'Bank Mandiri Escrow Penjualan', category: 'Aset Lancar', normalBalance: 'Debit', balance: 750000000, description: 'Rekening penampungan cicilan konsumen' },
  { code: '1-104', name: 'Bank BSI Proyek Syariah', category: 'Aset Lancar', normalBalance: 'Debit', balance: 320000000, description: 'Rekening konstruksi proyek syariah' },
  { code: '1-105', name: 'Piutang Konsumen (KPR/Cicilan)', category: 'Aset Lancar', normalBalance: 'Debit', balance: 1850000000, description: 'Sisa cicilan unit yang belum lunas' },
  { code: '1-106', name: 'Uang Muka Proyek & Vendor', category: 'Aset Lancar', normalBalance: 'Debit', balance: 85000000, description: 'DP yang telah dibayarkan ke rekanan' },
  { code: '1-201', name: 'Persediaan Lahan & Unit Rumah', category: 'Aset Lancar', normalBalance: 'Debit', balance: 4200000000, description: 'Nilai unit siap huni & kavling siap bangun' },
  { code: '1-301', name: 'Aset Tetap - Tanah & Gedung Kantor', category: 'Aset Tetap', normalBalance: 'Debit', balance: 1500000000, description: 'Kantor Pemasaran & Kantor Operasional' },
  { code: '1-302', name: 'Aset Tetap - Kendaraan Operasional', category: 'Aset Tetap', normalBalance: 'Debit', balance: 340000000, description: 'Mobil operasional & motor dinas' },
  { code: '1-303', name: 'Akumulasi Penyusutan Aset', category: 'Kontra Aset', normalBalance: 'Kredit', balance: 75000000, description: 'Penyusutan kendaraan & perlengkapan' },

  // 2. KEWAJIBAN / HUTANG
  { code: '2-101', name: 'Hutang Usaha / Vendor Material', category: 'Kewajiban Lancar', normalBalance: 'Kredit', balance: 210000000, description: 'Tagihan supplier semen, pasir, besi beton' },
  { code: '2-102', name: 'Hutang Termin Kontraktor (BATP)', category: 'Kewajiban Lancar', normalBalance: 'Kredit', balance: 345000000, description: 'Kewajiban progres fisik rumah ke mandor' },
  { code: '2-103', name: 'Hutang Pajak (PPN & PPh Final)', category: 'Kewajiban Lancar', normalBalance: 'Kredit', balance: 82500000, description: 'Pajak penjualan unit belum disetor' },
  { code: '2-201', name: 'Hutang Bank Jangka Panjang', category: 'Kewajiban Jangka Panjang', normalBalance: 'Kredit', balance: 1200000000, description: 'Pinjaman modal kerja perbankan' },

  // 3. MODAL / EKUITAS
  { code: '3-101', name: 'Modal Disetor Pemegang Saham', category: 'Ekuitas', normalBalance: 'Kredit', balance: 5000000000, description: 'Modal awal pendirian perseroan' },
  { code: '3-102', name: 'Laba Ditahan (Retained Earnings)', category: 'Ekuitas', normalBalance: 'Kredit', balance: 1845700000, description: 'Akumulasi laba bersih periode lampau' },

  // 4. PENDAPATAN
  { code: '4-101', name: 'Pendapatan Penjualan Unit Rumah', category: 'Pendapatan', normalBalance: 'Kredit', balance: 2450000000, description: 'Akad jual beli unit rumah tapak' },
  { code: '4-102', name: 'Pendapatan Penjualan Ruko & Komersil', category: 'Pendapatan', normalBalance: 'Kredit', balance: 850000000, description: 'Penjualan kavling komersil & ruko' },
  { code: '4-201', name: 'Pendapatan Denda & Bunga', category: 'Pendapatan Lain', normalBalance: 'Kredit', balance: 12500000, description: 'Denda keterlambatan angsuran' },

  // 5. BEBAN
  { code: '5-101', name: 'HPP Konstruksi & Pembangunan', category: 'Beban Pokok', normalBalance: 'Debit', balance: 1650000000, description: 'Biaya material, upah tukang & mandor' },
  { code: '5-201', name: 'Beban Pemasaran, Iklan & Event', category: 'Beban Operasional', normalBalance: 'Debit', balance: 85000000, description: 'Iklan sosmed, pameran expo, brosur' },
  { code: '5-301', name: 'Beban Umum, HR & General Affair', category: 'Beban Operasional', normalBalance: 'Debit', balance: 64800000, description: 'Gaji, listrik, pemeliharaan kantor, ATK' },
  { code: '5-401', name: 'Beban Perizinan, Sertifikat & Legal', category: 'Beban Operasional', normalBalance: 'Debit', balance: 42500000, description: 'Notaris, BPHTB, validasi BPN, perizinan' },
  { code: '5-501', name: 'Beban Pajak Penghasilan (PPh)', category: 'Beban Pajak', normalBalance: 'Debit', balance: 61250000, description: 'PPh final penjualan 2.5%' }
];

// =============================================================================
// 4. DATA AWAL: BUKU JURNAL UMUM (GENERAL JOURNAL)
// =============================================================================
export const INITIAL_JURNAL = [
  {
    id: 'JRN-2026-001',
    refNo: 'BKK/BCA/26/091',
    date: '2026-10-01',
    description: 'Pencairan Pengajuan Dana REQ-2026-003: Servis AC & APD Kantor HR/GA',
    debitAccountCode: '5-301',
    debitAccountName: 'Beban Umum, HR & General Affair',
    creditAccountCode: '1-102',
    creditAccountName: 'Bank BCA Operasional Utama',
    amount: 6800000,
    project: 'Head Office Bizhub',
    status: 'Posted',
    moduleSource: 'HR & General Affair'
  },
  {
    id: 'JRN-2026-002',
    refNo: 'BKM/MDR/26/044',
    date: '2026-09-30',
    description: 'Penerimaan Pembayaran DP Konsumen Unit A12 Ashoka View',
    debitAccountCode: '1-103',
    debitAccountName: 'Bank Mandiri Escrow Penjualan',
    creditAccountCode: '4-101',
    creditAccountName: 'Pendapatan Penjualan Unit Rumah',
    amount: 75000000,
    project: 'Ashoka View',
    status: 'Posted',
    moduleSource: 'Marketing & Sales'
  },
  {
    id: 'JRN-2026-003',
    refNo: 'BKK/BSI/26/018',
    date: '2026-09-28',
    description: 'Pembayaran Termin 1 Konstruksi Pondasi Blok C3',
    debitAccountCode: '5-101',
    debitAccountName: 'HPP Konstruksi & Pembangunan',
    creditAccountCode: '1-104',
    creditAccountName: 'Bank BSI Proyek Syariah',
    amount: 35000000,
    project: 'Ashoka View',
    status: 'Posted',
    moduleSource: 'Teknik & Konstruksi'
  },
  {
    id: 'JRN-2026-004',
    refNo: 'BKM/BCA/26/092',
    date: '2026-10-02',
    description: 'Penerimaan DP Konsumen Unit PK-05 Ashoka Park',
    debitAccountCode: '1-102',
    debitAccountName: 'Bank BCA Operasional',
    creditAccountCode: '4-101',
    creditAccountName: 'Pendapatan Penjualan Unit Rumah',
    amount: 120000000,
    project: 'Ashoka Park',
    status: 'Posted',
    moduleSource: 'Marketing & Sales'
  }
];

// =============================================================================
// 5. DATA AWAL: PENJUALAN PROPERTI (SALES LEDGER)
// =============================================================================
export const INITIAL_SALES = [
  {
    id: 'SLS-2026-001',
    unitNo: 'A-12',
    consumerName: 'Bambang Kusuma',
    project: 'Ashoka View',
    type: 'Rumah Tipe 45/90',
    salePrice: 485000000,
    paidAmount: 75000000,
    unpaidAmount: 410000000,
    paymentMethod: 'KPR Bank Mandiri',
    status: 'Proses Akad KPR',
    contractDate: '2026-09-20'
  },
  {
    id: 'SLS-2026-002',
    unitNo: 'B-04',
    consumerName: 'Siti Handayani, S.Pd',
    project: 'Ashoka View',
    type: 'Rumah Tipe 36/72',
    salePrice: 380000000,
    paidAmount: 380000000,
    unpaidAmount: 0,
    paymentMethod: 'Cash Keras',
    status: 'Lunas 100%',
    contractDate: '2026-09-15'
  },
  {
    id: 'SLS-2026-003',
    unitNo: 'RUKO-02',
    consumerName: 'Hendro Wijaya',
    project: 'Head Office Bizhub',
    type: 'Ruko 2 Lantai 60/120',
    salePrice: 850000000,
    paidAmount: 250000000,
    unpaidAmount: 600000000,
    paymentMethod: 'Cash Bertahap 12x',
    status: 'Cicilan Berjalan (3/12)',
    contractDate: '2026-08-10'
  },
  {
    id: 'SLS-2026-004',
    unitNo: 'PK-05',
    consumerName: 'dr. Hendra Gunawan, Sp.A',
    project: 'Ashoka Park',
    type: 'Rumah Tipe 54/105 Hook',
    salePrice: 560000000,
    paidAmount: 120000000,
    unpaidAmount: 440000000,
    paymentMethod: 'KPR Bank BCA',
    status: 'Persetujuan SP3K Bank',
    contractDate: '2026-09-22'
  }
];

// =============================================================================
// 6. DATA AWAL: HUTANG USAHA (ACCOUNTS PAYABLE)
// =============================================================================
export const INITIAL_PAYABLES = [
  {
    id: 'AP-2026-001',
    vendor: 'PT Semen Nusantara Perkasa',
    category: 'Material Semen & Pasir',
    billNo: 'INV/SNP/IX/2026-99',
    totalBill: 32000000,
    paidAmount: 0,
    remainingAmount: 32000000,
    project: 'Bizhub Commercial',
    dueDate: '2026-10-07',
    status: 'Menunggu Pengajuan Dana'
  },
  {
    id: 'AP-2026-002',
    vendor: 'Mandor Wawan (CV Berkah Konstruksi)',
    category: 'Termin BATP Fisik',
    billNo: 'BATP/ASH/2026/009',
    totalBill: 45000000,
    paidAmount: 0,
    remainingAmount: 45000000,
    project: 'Ashoka View',
    dueDate: '2026-10-06',
    status: 'Menunggu Pengajuan Dana'
  },
  {
    id: 'AP-2026-003',
    vendor: 'CV Baja Megah Sejahtera',
    category: 'Besi Ulir & WF',
    billNo: 'INV/BMS/26/102',
    totalBill: 58000000,
    paidAmount: 20000000,
    remainingAmount: 38000000,
    project: 'Head Office Bizhub',
    dueDate: '2026-10-18',
    status: 'Cicil Sebagian'
  },
  {
    id: 'AP-2026-004',
    vendor: 'CV Citra Alam Konstruksi',
    category: 'Cut & Fill Tanah Lahan',
    billNo: 'INV/CAK/26/04',
    totalBill: 28000000,
    paidAmount: 0,
    remainingAmount: 28000000,
    project: 'Ashoka Park',
    dueDate: '2026-10-08',
    status: 'Menunggu Pengajuan Dana'
  }
];

// =============================================================================
// 7. DATA AWAL: PAJAK PROPERTI (TAX MANAGEMENT)
// =============================================================================
export const INITIAL_TAXES = [
  {
    id: 'TAX-2026-001',
    taxType: 'PPh Final 2.5% Penjualan Rumah',
    taxObject: 'Unit B-04 Ashoka View (Lunas)',
    project: 'Ashoka View',
    taxBase: 380000000,
    rate: '2.5%',
    taxAmount: 9500000,
    period: 'September 2026',
    dueDate: '2026-10-15',
    status: 'Siap Disetor',
    ntpn: ''
  },
  {
    id: 'TAX-2026-002',
    taxType: 'PPN 11% Unit Komersil',
    taxObject: 'Ruko 02 Bizhub (Tahap 1)',
    project: 'Bizhub Commercial',
    taxBase: 250000000,
    rate: '11%',
    taxAmount: 27500000,
    period: 'September 2026',
    dueDate: '2026-10-31',
    status: 'Disetor & Lapor',
    ntpn: 'NTPN-883920199482103'
  },
  {
    id: 'TAX-2026-003',
    taxType: 'PPh 21 Karyawan & Staf',
    taxObject: 'Gaji Staf & Pimpinan HO',
    project: 'Head Office Bizhub',
    taxBase: 85000000,
    rate: 'Variatif',
    taxAmount: 4250000,
    period: 'September 2026',
    dueDate: '2026-10-10',
    status: 'Disetor & Lapor',
    ntpn: 'NTPN-110294820198421'
  },
  {
    id: 'TAX-2026-004',
    taxType: 'PPh Final 2.5% Penjualan Rumah',
    taxObject: 'Unit PK-05 Ashoka Park (DP)',
    project: 'Ashoka Park',
    taxBase: 120000000,
    rate: '2.5%',
    taxAmount: 3000000,
    period: 'September 2026',
    dueDate: '2026-10-15',
    status: 'Siap Disetor',
    ntpn: ''
  }
];

// =============================================================================
// 8. DATA AWAL: JOBLIST & AGENDA TIM FINANCE
// =============================================================================
export const INITIAL_JOBLIST = [
  {
    id: 'JOB-001',
    task: 'Rekonsiliasi Mutasi Rekening Koran Bank BCA & Mandiri',
    assignee: 'Yazid Hizbullah, S.E.,S.T',
    priority: 'Tinggi',
    dueDate: '2026-10-03',
    status: 'In Progress',
    notes: 'Cocokkan mutasi kas masuk DP konsumen unit A12'
  },
  {
    id: 'JOB-002',
    task: 'Review & Otorisasi Pengajuan Dana Termin BATP Blok A5',
    assignee: 'Ahmad Rafail (Super Admin)',
    priority: 'Mendesak',
    dueDate: '2026-10-04',
    status: 'To Do',
    notes: 'Periksa lampiran BATP dari Pak Hapip & Kholidin'
  },
  {
    id: 'JOB-003',
    task: 'Penyusunan Kertas Kerja Worksheet & Laba Rugi Akhir Kuartal',
    assignee: 'Staff Akuntansi',
    priority: 'Sedang',
    dueDate: '2026-10-10',
    status: 'To Do',
    notes: 'Kompilasi neraca saldo dan ayat jurnal penyesuaian'
  },
  {
    id: 'JOB-004',
    task: 'Pelaporan SPT Masa PPh Final 2.5% Penjualan Rumah',
    assignee: 'Staff Pajak',
    priority: 'Tinggi',
    dueDate: '2026-10-15',
    status: 'To Do',
    notes: 'Generate kode billing dan setor via internet banking'
  }
];

// =============================================================================
// 9. DATA AWAL: AUDIT LOG AKTIVITAS KEUANGAN
// =============================================================================
export const INITIAL_AUDIT = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-01 10:15:22',
    user: 'Yazid Hizbullah, S.E.,S.T',
    action: 'Pencairan Dana (Disbursement)',
    details: 'Mencairkan REQ-2026-003 Rp 6.800.000 via BCA Operasional',
    module: 'Finance & Acc'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-09-30 16:40:10',
    user: 'Ahmad Rafail',
    action: 'Auto-Posting Jurnal',
    details: 'Membukukan pendapatan DP Rp 75.000.000 unit A12 ke Mandiri Escrow',
    module: 'Finance & Acc'
  }
];

// =============================================================================
// FUNGSI-FUNGSI HELPER PENYIMPANAN & SINKRONISASI (LOCAL STORAGE & CLOUD READY)
// =============================================================================

const getStoredItem = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && Array.isArray(fallback) && fallback.length > 0 && fallback[0].id) {
        const existingIds = new Set(parsed.map(p => p.id));
        const missingFromFallback = fallback.filter(f => !existingIds.has(f.id));
        if (missingFromFallback.length > 0) {
          const merged = [...parsed, ...missingFromFallback];
          localStorage.setItem(key, JSON.stringify(merged));
          return merged;
        }
      }
      return parsed;
    }
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
  }
  return fallback;
};

const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom event agar komponen React lain di halaman langsung bereaksi
    window.dispatchEvent(new CustomEvent('ams-finance-data-changed', { detail: { key } }));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
  // Simpan secara asinkron ke MySQL database hosting via CloudStore
  try {
    saveCloudStore(key, value);
  } catch (err) {
    console.warn(`[CloudStore auto-save warning for ${key}]:`, err);
  }
};

// -----------------------------------------------------------------------------
// PENGAJUAN DANA LINTAS MODUL (FUND REQUESTS CRUD & DISBURSEMENT)
// -----------------------------------------------------------------------------
export const getFundRequests = () => {
  const base = getStoredItem(STORAGE_KEYS.FUND_REQUESTS, INITIAL_FUND_REQUESTS);
  try {
    const spbmLocal = localStorage.getItem('ams_teknik_spbm_batches_v1');
    if (spbmLocal) {
      const batches = JSON.parse(spbmLocal);
      if (Array.isArray(batches) && batches.length > 0) {
        const map = new Map(base.map(x => [x.id, x]));
        batches.forEach(b => {
          if (!b) return;
          const reqId = b.fundRequestId || `REQ-${b.id || b.noDok}`;
          const existing = map.get(reqId) || Array.from(map.values()).find(r => r.spbmNo === b.noDok || r.spbmId === b.id);
          const rows = b.rows || b.items || [];
          let totalEst = Number(b.totalEstimatedAmount || b.totalEstimasi || 0);
          if (totalEst === 0 && rows.length > 0) {
            totalEst = rows.reduce((acc, r) => acc + (Number(r.subtotal) || (Number(r.hargaSatuan || 0) * Number(r.qty || 0)) || 0), 0);
          }
          if (!existing) {
            map.set(reqId, {
              id: reqId,
              originModule: 'teknik',
              originModuleName: 'Teknik & Konstruksi',
              requester: b.pemohon || 'Staf Teknik',
              title: `Pengajuan Material [${b.noDok}] - ${b.proyek || 'Proyek'} (${rows.length} Item)`,
              project: b.proyek || 'Ashoka View',
              category: 'Pengajuan Material Konstruksi',
              amount: totalEst,
              approvedAmount: Number(b.totalApprovedAmount || 0),
              requestDate: b.tanggal || (b.createdAt ? b.createdAt.split('T')[0] : '2026-10-03'),
              dueDate: b.tanggal || '2026-10-03',
              priority: 'Tinggi',
              status: b.status || 'Menunggu Review',
              accountCode: '5-101',
              notes: b.catatan || `Pengajuan SPbM No: ${b.noDok}`,
              attachments: [],
              spbmNo: b.noDok,
              spbmId: b.id,
              materialRows: rows
            });
          }
        });
        return Array.from(map.values());
      }
    }
  } catch (e) {}
  return base;
};
export const saveFundRequests = (list) => setStoredItem(STORAGE_KEYS.FUND_REQUESTS, list);

/**
 * Sinkronisasi Real-Time Pengajuan Dana & Material dari Database Cloud Hosting
 * Menggabungkan pengajuan umum dan SPbM Teknik secara menyeluruh
 */
export const syncFundRequestsFromCloud = async () => {
  try {
    const [cloudFundRequests, cloudSpbmBatches] = await Promise.all([
      fetchCloudStore(STORAGE_KEYS.FUND_REQUESTS, null),
      fetchCloudStore('ams_teknik_spbm_batches_v1', null)
    ]);

    const localData = getFundRequests();
    const map = new Map();

    localData.forEach(item => {
      if (item && item.id) map.set(item.id, item);
    });

    if (cloudFundRequests && Array.isArray(cloudFundRequests)) {
      cloudFundRequests.forEach(cloudItem => {
        if (!cloudItem || !cloudItem.id) return;
        if (!map.has(cloudItem.id)) {
          map.set(cloudItem.id, cloudItem);
        } else {
          const localItem = map.get(cloudItem.id);
          map.set(cloudItem.id, { ...localItem, ...cloudItem });
        }
      });
    }

    if (cloudSpbmBatches && Array.isArray(cloudSpbmBatches)) {
      cloudSpbmBatches.forEach(b => {
        if (!b) return;
        const targetReqId = b.fundRequestId || `REQ-${b.id || b.noDok}`;
        const existing = map.get(targetReqId) || Array.from(map.values()).find(r => r.spbmNo === b.noDok || r.spbmId === b.id);
        const rows = b.rows || b.items || [];
        let totalEst = Number(b.totalEstimatedAmount || b.totalEstimasi || 0);
        if (totalEst === 0 && rows.length > 0) {
          totalEst = rows.reduce((acc, r) => acc + (Number(r.subtotal) || (Number(r.hargaSatuan || 0) * Number(r.qty || 0)) || 0), 0);
        }

        if (!existing) {
          map.set(targetReqId, {
            id: targetReqId,
            originModule: 'teknik',
            originModuleName: 'Teknik & Konstruksi',
            requester: b.pemohon || 'Staf Teknik',
            title: `Pengajuan Material [${b.noDok}] - ${b.proyek || 'Proyek'} (${rows.length} Item)`,
            project: b.proyek || 'Ashoka View',
            category: 'Pengajuan Material Konstruksi',
            amount: totalEst,
            approvedAmount: Number(b.totalApprovedAmount || 0),
            requestDate: b.tanggal || (b.createdAt ? b.createdAt.split('T')[0] : '2026-10-03'),
            dueDate: b.tanggal || '2026-10-03',
            priority: 'Tinggi',
            status: b.status || 'Menunggu Review',
            accountCode: '5-101',
            notes: b.catatan || `Pengajuan SPbM No: ${b.noDok}`,
            attachments: [],
            spbmNo: b.noDok,
            spbmId: b.id,
            materialRows: rows
          });
        } else {
          map.set(existing.id, {
            ...existing,
            materialRows: rows.length > 0 ? rows : existing.materialRows,
            spbmNo: b.noDok || existing.spbmNo,
            spbmId: b.id || existing.spbmId,
            amount: (existing.amount || 0) === 0 && totalEst > 0 ? totalEst : existing.amount
          });
        }
      });
    }

    const merged = Array.from(map.values());
    localStorage.setItem(STORAGE_KEYS.FUND_REQUESTS, JSON.stringify(merged));
    saveCloudStore(STORAGE_KEYS.FUND_REQUESTS, merged);
    window.dispatchEvent(new CustomEvent('ams-finance-data-changed', { detail: { key: STORAGE_KEYS.FUND_REQUESTS } }));
    return merged;
  } catch (err) {
    console.warn('Sync fund requests from cloud failed:', err);
  }
  return getFundRequests();
};

/**
 * Dipanggil dari modul mana saja (Marketing, HR/GA, Teknik, Legal, Procurement)
 * untuk mengirimkan pengajuan dana ke Finance.
 */
export const submitFundRequest = (newRequest) => {
  const currentList = getFundRequests();
  const nextIdSeq = String(currentList.length + 1).padStart(3, '0');
  const uniqueId = newRequest.id || `REQ-2026-${nextIdSeq}-${Date.now().toString().slice(-3)}`;
  const createdItem = {
    id: uniqueId,
    originModule: newRequest.originModule || 'teknik',
    originModuleName: newRequest.originModuleName || 'Teknik & Konstruksi',
    requester: newRequest.requester || 'Staf Pemohon',
    title: newRequest.title || 'Pengajuan Material Konstruksi',
    project: newRequest.project || 'Ashoka View',
    category: newRequest.category || 'Pengajuan Material Konstruksi',
    amount: Number(newRequest.amount) || 0,
    approvedAmount: newRequest.approvedAmount !== undefined ? Number(newRequest.approvedAmount) : (Number(newRequest.amount) || 0),
    requestDate: newRequest.requestDate || new Date().toISOString().split('T')[0],
    dueDate: newRequest.dueDate || new Date().toISOString().split('T')[0],
    priority: newRequest.priority || 'Tinggi',
    status: 'Menunggu Review',
    approvedBy: null,
    approvedAt: null,
    disbursedBankId: null,
    disbursedBankName: null,
    disbursedAt: null,
    disbursedRef: null,
    accountCode: newRequest.accountCode || '5-101',
    notes: newRequest.notes || '',
    attachments: newRequest.attachments || [],
    spbmNo: newRequest.spbmNo || null,
    spbmId: newRequest.spbmId || null,
    materialRows: Array.isArray(newRequest.materialRows) ? newRequest.materialRows : []
  };

  const updated = [createdItem, ...currentList.filter(x => x.id !== uniqueId)];
  saveFundRequests(updated);

  // Sync instan ke CloudStore
  saveCloudStore(STORAGE_KEYS.FUND_REQUESTS, updated);

  // Catat ke audit log
  addAuditLog({
    user: createdItem.requester,
    action: 'Pengajuan Dana Baru',
    details: `${createdItem.id} diajukan senilai Rp ${createdItem.amount.toLocaleString('id-ID')} (${createdItem.title})`,
    module: createdItem.originModuleName
  });

  return createdItem;
};

/**
 * Update status approval per baris material dan hitung total dana yang disetujui oleh Finance
 */
export const updateFundRequestMaterialRows = (requestId, updatedRows, financeOfficer = 'Finance Team') => {
  const currentList = getFundRequests();
  let calculatedApprovedAmount = 0;
  let allApproved = true;
  let anyApproved = false;
  let allRejected = true;

  updatedRows.forEach(r => {
    const isApp = r.status === 'Disetujui' || r.isApproved === true;
    const isRej = r.status === 'Ditolak' || r.isApproved === false;
    if (isApp) {
      anyApproved = true;
      allRejected = false;
      const rowVal = Number(r.subtotal) || (Number(r.hargaSatuan || 0) * Number(r.qty || 0)) || 0;
      calculatedApprovedAmount += rowVal;
    } else if (isRej) {
      allApproved = false;
    } else {
      allApproved = false;
      allRejected = false;
    }
  });

  let newStatus = 'Menunggu Review';
  if (allRejected && updatedRows.length > 0) {
    newStatus = 'Ditolak';
  } else if (allApproved && updatedRows.length > 0) {
    newStatus = 'Disetujui';
  } else if (anyApproved) {
    newStatus = 'Disetujui Sebagian';
  }

  const updated = currentList.map(req => {
    if (req.id === requestId) {
      return {
        ...req,
        materialRows: updatedRows,
        approvedAmount: calculatedApprovedAmount,
        status: newStatus !== 'Menunggu Review' ? newStatus : req.status,
        approvedBy: anyApproved ? financeOfficer : req.approvedBy,
        approvedAt: anyApproved ? new Date().toISOString().split('T')[0] : req.approvedAt
      };
    }
    return req;
  });
  saveFundRequests(updated);

  // Sinkronisasi status ke batch SPbM di Modul Teknik
  try {
    const BATCH_KEY = 'ams_teknik_spbm_batches_v1';
    const rawBatches = localStorage.getItem(BATCH_KEY);
    if (rawBatches) {
      const parsed = JSON.parse(rawBatches);
      if (Array.isArray(parsed)) {
        const syncUpdated = parsed.map(b => {
          if (b.fundRequestId === requestId || b.noDok === currentList.find(x => x.id === requestId)?.spbmNo) {
            return {
              ...b,
              rows: updatedRows,
              status: newStatus,
              totalApprovedAmount: calculatedApprovedAmount
            };
          }
          return b;
        });
        localStorage.setItem(BATCH_KEY, JSON.stringify(syncUpdated));
        saveCloudStore(BATCH_KEY, syncUpdated);
        window.dispatchEvent(new CustomEvent('ams-finance-data-changed', { detail: { key: BATCH_KEY } }));
      }
    }
  } catch (e) {}

  addAuditLog({
    user: financeOfficer,
    action: 'Verifikasi Item Material',
    details: `${requestId}: Verifikasi item SPbM disetujui total Rp ${calculatedApprovedAmount.toLocaleString('id-ID')} (${updatedRows.filter(r => r.status === 'Disetujui').length}/${updatedRows.length} item disetujui)`,
    module: 'Finance & Acc'
  });

  return { success: true, newStatus, approvedAmount: calculatedApprovedAmount };
};

/**
 * Persetujuan Pengajuan Dana oleh Pimpinan/Finance
 */
export const approveFundRequest = (requestId, approverName = 'Pimpinan / Finance') => {
  const currentList = getFundRequests();
  const updated = currentList.map(req => {
    if (req.id === requestId) {
      return {
        ...req,
        status: 'Disetujui',
        approvedBy: approverName,
        approvedAt: new Date().toISOString().split('T')[0]
      };
    }
    return req;
  });
  saveFundRequests(updated);

  // Sync status to Teknik batches if SPbM
  try {
    const BATCH_KEY = 'ams_teknik_spbm_batches_v1';
    const rawBatches = localStorage.getItem(BATCH_KEY);
    if (rawBatches) {
      const parsed = JSON.parse(rawBatches);
      if (Array.isArray(parsed)) {
        const syncUpdated = parsed.map(b => {
          if (b.fundRequestId === requestId || b.noDok === currentList.find(x => x.id === requestId)?.spbmNo) {
            return { ...b, status: 'Disetujui Penuh' };
          }
          return b;
        });
        localStorage.setItem(BATCH_KEY, JSON.stringify(syncUpdated));
      }
    }
  } catch (e) {}

  addAuditLog({
    user: approverName,
    action: 'Approval Pengajuan Dana',
    details: `Pengajuan ${requestId} telah disetujui untuk dicairkan`,
    module: 'Finance & Acc'
  });
};

/**
 * Penolakan Pengajuan Dana
 */
export const rejectFundRequest = (requestId, reason = '', rejectorName = 'Finance Director') => {
  const currentList = getFundRequests();
  const updated = currentList.map(req => {
    if (req.id === requestId) {
      return {
        ...req,
        status: 'Ditolak',
        notes: req.notes ? `${req.notes} [Alasan Penolakan: ${reason}]` : `[Alasan Penolakan: ${reason}]`
      };
    }
    return req;
  });
  saveFundRequests(updated);

  // Sync status to Teknik batches if SPbM
  try {
    const BATCH_KEY = 'ams_teknik_spbm_batches_v1';
    const rawBatches = localStorage.getItem(BATCH_KEY);
    if (rawBatches) {
      const parsed = JSON.parse(rawBatches);
      if (Array.isArray(parsed)) {
        const syncUpdated = parsed.map(b => {
          if (b.fundRequestId === requestId || b.noDok === currentList.find(x => x.id === requestId)?.spbmNo) {
            return { ...b, status: 'Ditolak' };
          }
          return b;
        });
        localStorage.setItem(BATCH_KEY, JSON.stringify(syncUpdated));
      }
    }
  } catch (e) {}

  addAuditLog({
    user: rejectorName,
    action: 'Penolakan Pengajuan Dana',
    details: `Pengajuan ${requestId} ditolak. Alasan: ${reason}`,
    module: 'Finance & Acc'
  });
};

/**
 * EKSEKUSI PENCAIRAN DANA OTOMATIS (DISBURSEMENT ENGINE):
 * 1. Status pengajuan dana menjadi "Dicairkan".
 * 2. Saldo rekening Bank yang dipilih langsung terpotong.
 * 3. Otomatis membuat baris pembukuan di Jurnal Umum (Debit Beban, Kredit Bank).
 * 4. Catat riwayat di Audit Log.
 * 
 * KHUSUS PENGAJUAN MATERIAL:
 * Finance hanya mencairkan/membayar total dana untuk baris material yang DISETUJUI.
 */
export const disburseFundRequest = (requestId, bankId, officerName = 'Finance Staff', extraData = {}) => {
  const reqList = getFundRequests();
  const targetReq = reqList.find(r => r.id === requestId);
  if (!targetReq) throw new Error('Pengajuan dana tidak ditemukan!');

  const banks = getBanks();
  const targetBank = banks.find(b => b.id === bankId);
  if (!targetBank) throw new Error('Rekening bank pencairan tidak valid!');

  // Tentukan nominal pencairan riil: Jika pengajuan material berbaris, cairkan hanya yang disetujui!
  let disburseAmount = targetReq.amount;
  if (targetReq.materialRows && targetReq.materialRows.length > 0) {
    if (targetReq.approvedAmount !== undefined && targetReq.approvedAmount > 0) {
      disburseAmount = targetReq.approvedAmount;
    } else if (extraData.customAmount !== undefined && Number(extraData.customAmount) > 0) {
      disburseAmount = Number(extraData.customAmount);
    }
  } else if (extraData.customAmount !== undefined && Number(extraData.customAmount) > 0) {
    disburseAmount = Number(extraData.customAmount);
  }

  if (targetBank.balance < disburseAmount) {
    throw new Error(`Saldo bank ${targetBank.name} tidak mencukupi! (Saldo: Rp ${targetBank.balance.toLocaleString('id-ID')}, Dibutuhkan: Rp ${disburseAmount.toLocaleString('id-ID')})`);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const refDisburseNo = extraData.transferRefNo || `BKK/${targetBank.id}/${todayStr.replace(/-/g, '')}/${Math.floor(100 + Math.random() * 900)}`;

  // 1. Update status Pengajuan Dana
  const updatedReqs = reqList.map(r => {
    if (r.id === requestId) {
      return {
        ...r,
        status: 'Dicairkan',
        disbursedAmount: disburseAmount,
        disbursedBankId: targetBank.id,
        disbursedBankName: targetBank.name,
        disbursedAt: todayStr,
        disbursedRef: refDisburseNo,
        transferProofUrl: extraData.transferProofUrl || null,
        transferProofName: extraData.transferProofName || null,
        transferNotes: extraData.transferNotes || ''
      };
    }
    return r;
  });
  saveFundRequests(updatedReqs);

  // 2. Potong saldo Bank
  const updatedBanks = banks.map(b => {
    if (b.id === bankId) {
      return {
        ...b,
        balance: b.balance - disburseAmount
      };
    }
    return b;
  });
  saveBanks(updatedBanks);

  // 3. Auto-Posting ke Jurnal Umum
  const coaList = getCoa();
  const debitCoa = coaList.find(c => c.code === targetReq.accountCode) || { name: 'Beban Pokok Konstruksi & Pembangunan', code: targetReq.accountCode || '5-101' };
  const creditCoa = coaList.find(c => c.code === targetBank.accountCode) || { name: targetBank.name, code: targetBank.accountCode || '1-102' };

  addJurnalEntry({
    refNo: refDisburseNo,
    date: todayStr,
    description: `Pencairan ${targetReq.id} [${targetReq.originModuleName}]: ${targetReq.title} (Hanya yang disetujui Rp ${disburseAmount.toLocaleString('id-ID')})`,
    debitAccountCode: debitCoa.code,
    debitAccountName: debitCoa.name,
    creditAccountCode: creditCoa.code,
    creditAccountName: creditCoa.name,
    amount: disburseAmount,
    project: targetReq.project,
    status: 'Posted',
    moduleSource: targetReq.originModuleName
  });

  // 4. Sinkronisasi status ke SPbM di Modul Teknik
  try {
    const BATCH_KEY = 'ams_teknik_spbm_batches_v1';
    const rawBatches = localStorage.getItem(BATCH_KEY);
    if (rawBatches) {
      const parsed = JSON.parse(rawBatches);
      if (Array.isArray(parsed)) {
        const syncUpdated = parsed.map(b => {
          if (b.fundRequestId === requestId || b.noDok === targetReq.spbmNo) {
            return {
              ...b,
              status: 'Dicairkan',
              disbursedAt: todayStr,
              disbursedBankName: targetBank.name,
              disbursedAmount: disburseAmount
            };
          }
          return b;
        });
        localStorage.setItem(BATCH_KEY, JSON.stringify(syncUpdated));
        saveCloudStore(BATCH_KEY, syncUpdated);
        window.dispatchEvent(new CustomEvent('ams-finance-data-changed', { detail: { key: BATCH_KEY } }));
      }
    }
  } catch (e) {}

  addAuditLog({
    user: officerName,
    action: 'Pencairan Dana (Disbursement)',
    details: `Mencairkan ${targetReq.id} senilai Rp ${disburseAmount.toLocaleString('id-ID')} via ${targetBank.name} (Ref: ${refDisburseNo})`,
    module: 'Finance & Acc'
  });

  return { success: true, refDisburseNo, disburseAmount };
};

// -----------------------------------------------------------------------------
// REKENING KAS & BANK
// -----------------------------------------------------------------------------
export const getBanks = () => getStoredItem(STORAGE_KEYS.BANKS, INITIAL_BANKS);
export const saveBanks = (list) => setStoredItem(STORAGE_KEYS.BANKS, list);

// -----------------------------------------------------------------------------
// BAGAN AKUN (COA)
// -----------------------------------------------------------------------------
export const getCoa = () => getStoredItem(STORAGE_KEYS.COA, INITIAL_COA);
export const saveCoa = (list) => setStoredItem(STORAGE_KEYS.COA, list);

// -----------------------------------------------------------------------------
// BUKU JURNAL UMUM
// -----------------------------------------------------------------------------
export const getJurnal = () => getStoredItem(STORAGE_KEYS.JURNAL, INITIAL_JURNAL);
export const saveJurnal = (list) => setStoredItem(STORAGE_KEYS.JURNAL, list);
export const addJurnalEntry = (entry) => {
  const current = getJurnal();
  const nextSeq = String(current.length + 1).padStart(3, '0');
  const newEntry = {
    id: entry.id || `JRN-2026-${nextSeq}`,
    refNo: entry.refNo || `JV/2026/${nextSeq}`,
    date: entry.date || new Date().toISOString().split('T')[0],
    description: entry.description || 'Entri Jurnal Umum',
    debitAccountCode: entry.debitAccountCode,
    debitAccountName: entry.debitAccountName,
    creditAccountCode: entry.creditAccountCode,
    creditAccountName: entry.creditAccountName,
    amount: Number(entry.amount) || 0,
    project: entry.project || 'Umum',
    status: entry.status || 'Posted',
    moduleSource: entry.moduleSource || 'Manual JV'
  };
  saveJurnal([newEntry, ...current]);
  return newEntry;
};

// -----------------------------------------------------------------------------
// PENJUALAN PROPERTI
// -----------------------------------------------------------------------------
export const getSales = () => getStoredItem(STORAGE_KEYS.SALES, INITIAL_SALES);
export const saveSales = (list) => setStoredItem(STORAGE_KEYS.SALES, list);

// -----------------------------------------------------------------------------
// HUTANG USAHA (ACCOUNTS PAYABLE)
// -----------------------------------------------------------------------------
export const getPayables = () => getStoredItem(STORAGE_KEYS.PAYABLES, INITIAL_PAYABLES);
export const savePayables = (list) => setStoredItem(STORAGE_KEYS.PAYABLES, list);

// -----------------------------------------------------------------------------
// PAJAK PROPERTI
// -----------------------------------------------------------------------------
export const getTaxes = () => getStoredItem(STORAGE_KEYS.TAXES, INITIAL_TAXES);
export const saveTaxes = (list) => setStoredItem(STORAGE_KEYS.TAXES, list);

// -----------------------------------------------------------------------------
// JOBLIST & AGENDA TIM FINANCE
// -----------------------------------------------------------------------------
export const getJoblist = () => getStoredItem(STORAGE_KEYS.JOBLIST, INITIAL_JOBLIST);
export const saveJoblist = (list) => setStoredItem(STORAGE_KEYS.JOBLIST, list);

// -----------------------------------------------------------------------------
// AUDIT LOG
// -----------------------------------------------------------------------------
export const getAuditLogs = () => getStoredItem(STORAGE_KEYS.AUDIT, INITIAL_AUDIT);
export const addAuditLog = (logItem) => {
  const current = getAuditLogs();
  const nextSeq = String(current.length + 1).padStart(3, '0');
  const newLog = {
    id: `AUD-${nextSeq}`,
    timestamp: new Date().toLocaleString('id-ID'),
    user: logItem.user || 'Sistem AMS',
    action: logItem.action || 'Aktivitas Keuangan',
    details: logItem.details || '',
    module: logItem.module || 'Finance & Acc'
  };
  setStoredItem(STORAGE_KEYS.AUDIT, [newLog, ...current]);
};

// =============================================================================
// FUNGSI-FUNGSI PENGHAPUSAN DATA (DELETE CRUD) DILENGKAPI AUDIT LOG
// =============================================================================

export const deleteFundRequest = (id, user = 'Finance User') => {
  const current = getFundRequests();
  const target = current.find(r => r.id === id);
  const updated = current.filter(r => r.id !== id);
  saveFundRequests(updated);
  if (target) {
    addAuditLog({
      user,
      action: 'Hapus Pengajuan Dana',
      details: `Menghapus ${id} (${target.title}) senilai Rp ${Number(target.amount).toLocaleString('id-ID')}`,
      module: 'Finance & Acc'
    });
  }
  return updated;
};

export const deleteJurnalEntry = (id, user = 'Finance User') => {
  const current = getJurnal();
  const target = current.find(j => j.id === id);
  const updated = current.filter(j => j.id !== id);
  saveJurnal(updated);
  if (target) {
    addAuditLog({
      user,
      action: 'Hapus Ayat Jurnal',
      details: `Menghapus jurnal ${target.refNo || id} (${target.description}) Rp ${Number(target.amount).toLocaleString('id-ID')}`,
      module: 'Finance & Acc'
    });
  }
  return updated;
};

export const deleteCoaAccount = (code, user = 'Finance User') => {
  const current = getCoa();
  const target = current.find(c => c.code === code);
  const updated = current.filter(c => c.code !== code);
  saveCoa(updated);
  if (target) {
    addAuditLog({
      user,
      action: 'Hapus Akun COA',
      details: `Menghapus akun ${code} - ${target.name} (${target.category})`,
      module: 'Finance & Acc'
    });
  }
  return updated;
};

export const deleteSale = (id, user = 'Finance User') => {
  const current = getSales();
  const target = current.find(s => s.id === id);
  const updated = current.filter(s => s.id !== id);
  saveSales(updated);
  if (target) {
    addAuditLog({
      user,
      action: 'Hapus Penjualan Unit',
      details: `Menghapus penjualan unit ${target.unitNo} konsumen ${target.consumerName}`,
      module: 'Finance & Acc'
    });
  }
  return updated;
};

export const deletePayable = (id, user = 'Finance User') => {
  const current = getPayables();
  const target = current.find(p => p.id === id);
  const updated = current.filter(p => p.id !== id);
  savePayables(updated);
  if (target) {
    addAuditLog({
      user,
      action: 'Hapus Hutang Usaha',
      details: `Menghapus hutang ${target.billNo || id} vendor ${target.vendor} Rp ${Number(target.remainingAmount).toLocaleString('id-ID')}`,
      module: 'Finance & Acc'
    });
  }
  return updated;
};

export const deleteTax = (id, user = 'Finance User') => {
  const current = getTaxes();
  const target = current.find(t => t.id === id);
  const updated = current.filter(t => t.id !== id);
  saveTaxes(updated);
  if (target) {
    addAuditLog({
      user,
      action: 'Hapus Pajak Properti',
      details: `Menghapus data pajak ${target.taxType} untuk ${target.taxObject}`,
      module: 'Finance & Acc'
    });
  }
  return updated;
};

export const deleteJoblistItem = (id, user = 'Finance User') => {
  const current = getJoblist();
  const target = current.find(j => j.id === id);
  const updated = current.filter(j => j.id !== id);
  saveJoblist(updated);
  if (target) {
    addAuditLog({
      user,
      action: 'Hapus Tugas Joblist',
      details: `Menghapus tugas ${id}: ${target.task}`,
      module: 'Finance & Acc'
    });
  }
  return updated;
};
