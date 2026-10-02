// =============================================================================
// AMS ENTERPRISE - FINANCE & ACCOUNTING INTEGRATED SERVICE (TAHAP 1)
// Central Hub Data Store untuk Keuangan, Rekening Bank, Jurnal, dan Pengajuan Dana Lintas Modul
// =============================================================================

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
    taxBase: 85000000,
    rate: 'Variatif',
    taxAmount: 4250000,
    period: 'September 2026',
    dueDate: '2026-10-10',
    status: 'Disetor & Lapor',
    ntpn: 'NTPN-110294820198421'
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
    if (data) return JSON.parse(data);
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
};

// -----------------------------------------------------------------------------
// PENGAJUAN DANA LINTAS MODUL (FUND REQUESTS CRUD & DISBURSEMENT)
// -----------------------------------------------------------------------------
export const getFundRequests = () => getStoredItem(STORAGE_KEYS.FUND_REQUESTS, INITIAL_FUND_REQUESTS);
export const saveFundRequests = (list) => setStoredItem(STORAGE_KEYS.FUND_REQUESTS, list);

/**
 * Dipanggil dari modul mana saja (Marketing, HR/GA, Teknik, Legal, Procurement)
 * untuk mengirimkan pengajuan dana ke Finance.
 */
export const submitFundRequest = (newRequest) => {
  const currentList = getFundRequests();
  const nextIdSeq = String(currentList.length + 1).padStart(3, '0');
  const createdItem = {
    id: newRequest.id || `REQ-2026-${nextIdSeq}`,
    originModule: newRequest.originModule || 'operasional',
    originModuleName: newRequest.originModuleName || 'Operasional Lapangan',
    requester: newRequest.requester || 'Staf Pemohon',
    title: newRequest.title || 'Pengajuan Dana Operasional',
    project: newRequest.project || 'Umum / Head Office',
    category: newRequest.category || 'Operasional',
    amount: Number(newRequest.amount) || 0,
    requestDate: newRequest.requestDate || new Date().toISOString().split('T')[0],
    dueDate: newRequest.dueDate || new Date().toISOString().split('T')[0],
    priority: newRequest.priority || 'Normal',
    status: 'Menunggu Review',
    approvedBy: null,
    approvedAt: null,
    disbursedBankId: null,
    disbursedBankName: null,
    disbursedAt: null,
    disbursedRef: null,
    accountCode: newRequest.accountCode || '5-301',
    notes: newRequest.notes || '',
    attachments: newRequest.attachments || []
  };

  const updated = [createdItem, ...currentList];
  saveFundRequests(updated);

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
 */
export const disburseFundRequest = (requestId, bankId, officerName = 'Finance Staff', extraData = {}) => {
  const reqList = getFundRequests();
  const targetReq = reqList.find(r => r.id === requestId);
  if (!targetReq) throw new Error('Pengajuan dana tidak ditemukan!');

  const banks = getBanks();
  const targetBank = banks.find(b => b.id === bankId);
  if (!targetBank) throw new Error('Rekening bank pencairan tidak valid!');

  if (targetBank.balance < targetReq.amount) {
    throw new Error(`Saldo bank ${targetBank.name} tidak mencukupi! (Saldo: Rp ${targetBank.balance.toLocaleString('id-ID')}, Dibutuhkan: Rp ${targetReq.amount.toLocaleString('id-ID')})`);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const refDisburseNo = extraData.transferRefNo || `BKK/${targetBank.id}/${todayStr.replace(/-/g, '')}/${Math.floor(100 + Math.random() * 900)}`;

  // 1. Update status Pengajuan Dana
  const updatedReqs = reqList.map(r => {
    if (r.id === requestId) {
      return {
        ...r,
        status: 'Dicairkan',
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
        balance: b.balance - targetReq.amount
      };
    }
    return b;
  });
  saveBanks(updatedBanks);

  // 3. Auto-Posting ke Jurnal Umum
  const coaList = getCoa();
  const debitCoa = coaList.find(c => c.code === targetReq.accountCode) || { name: 'Beban Operasional Lainnya', code: targetReq.accountCode || '5-301' };
  const creditCoa = coaList.find(c => c.code === targetBank.accountCode) || { name: targetBank.name, code: targetBank.accountCode || '1-102' };

  addJurnalEntry({
    refNo: refDisburseNo,
    date: todayStr,
    description: `Pencairan ${targetReq.id} [${targetReq.originModuleName}]: ${targetReq.title}`,
    debitAccountCode: debitCoa.code,
    debitAccountName: debitCoa.name,
    creditAccountCode: creditCoa.code,
    creditAccountName: creditCoa.name,
    amount: targetReq.amount,
    project: targetReq.project,
    status: 'Posted',
    moduleSource: targetReq.originModuleName
  });

  // 4. Catat Audit Log
  addAuditLog({
    user: officerName,
    action: 'Pencairan Dana (Disbursement)',
    details: `Dana ${targetReq.id} Rp ${targetReq.amount.toLocaleString('id-ID')} dicairkan via ${targetBank.name}. Ref: ${refDisburseNo}`,
    module: 'Finance & Acc'
  });

  return { success: true, refDisburseNo };
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
