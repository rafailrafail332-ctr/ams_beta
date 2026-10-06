import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Target,
  CheckCircle2,
  FileText,
  Camera,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Printer,
  Download,
  X,
  MessageSquare,
  Eye,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Paperclip,
  Share2,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Check,
  CreditCard,
  Send,
  RotateCcw
} from 'lucide-react';
import { submitFundRequest, getFundRequests } from '../services/financeService';

// =============================================================================
// STORAGE KEYS & SEED DATA
// =============================================================================
const STORAGE_GATHERING_SCHEDULES = 'ams_hr_gathering_schedules_v1';
const STORAGE_GATHERING_MOMS = 'ams_hr_gathering_moms_v1';
const STORAGE_GATHERING_DOCS = 'ams_hr_gathering_docs_v1';
const STORAGE_GATHERING_BUDGETS = 'ams_hr_gathering_budgets_v1';

// 1. DATA SEED JADWAL GATHERING
const INITIAL_SCHEDULES = [
  {
    id: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering & Kick-Off Proyek 2026',
    tema: 'Sinergi Bersama, Meraih Puncak Prestasi Bisnis Properti',
    tanggalMulai: '2026-11-20',
    tanggalSelesai: '2026-11-22',
    lokasi: 'Jambuluwuk Resort & Convention Hall, Puncak Bogor',
    meetingPoint: 'Head Office Bizhub Commercial Estate (Bus Pariwisata Eksekutif)',
    targetPeserta: '85 Orang (Seluruh Karyawan & Keluarga)',
    pic: 'Dodi Syaiful Nugroho (Head HR & GA)',
    status: 'Mendatang', // Mendatang, Berjalan, Selesai
    rundown: 'Hari 1: Check-in, Fun Team Building & Games;\nHari 2: Outbound Leadership & Gala Dinner Keakraban;\nHari 3: Pembagian Grand Doorprize & Perjalanan Pulang.',
    catatan: 'Dress code Hari ke-1 kaos hijau tosca AMS, Hari ke-2 polo shirt putih, Hari ke-3 bebas santai.',
    phonePic: '0812-9988-7711'
  },
  {
    id: 'GTH-2026-002',
    namaAcara: 'Halal Bihalal & Townhall Meeting Semester I',
    tema: 'Merajut Silaturahmi, Memperkuat Integritas & Disiplin Kerja',
    tanggalMulai: '2026-05-15',
    tanggalSelesai: '2026-05-15',
    lokasi: 'Clubhouse & Marketing Gallery Ashoka Park',
    meetingPoint: 'Clubhouse Ashoka Park Blok A-01',
    targetPeserta: '60 Orang (Karyawan HO & Proyek)',
    pic: 'Fresda Destifani (Head of Marketing)',
    status: 'Selesai',
    rundown: '09:00 - 10:00: Tausiyah & Sambutan Direksi;\n10:00 - 11:30: Townhall & Evaluasi Target;\n11:30 - 13:00: Ramah Tamah & Makan Siang Bersama.',
    catatan: 'Acara berlangsung tertib dan seluruh tim siap mengejar target penjualan kuartal II.',
    phonePic: '0813-1122-3344'
  },
  {
    id: 'GTH-2026-003',
    namaAcara: 'Outbound Leadership & Team Bonding Security & GA',
    tema: 'Disiplin Tangguh, Solidaritas Kuat, Pelayanan Prima Lapangan',
    tanggalMulai: '2026-08-10',
    tanggalSelesai: '2026-08-11',
    lokasi: 'Camp Bravo Outbound & Rafting, Cidahu, Sukabumi',
    meetingPoint: 'Pos Utama Ashoka View (Armada Minibus Operasional)',
    targetPeserta: '35 Orang (Satpam, Maintenance & Operasional)',
    pic: 'Hartono (Danru Security Ashoka Park)',
    status: 'Selesai',
    rundown: 'Hari 1: Latihan Fisik, Paintball Taktis & Api Unggun Komitmen;\nHari 2: Rafting Sungai Citarik & Pembagian Sertifikat Disiplin.',
    catatan: 'Seluruh personil keamanan menunjukkan peningkatan loyalitas dan kesiapsiagaan.',
    phonePic: '0857-1122-3399'
  }
];

// 2. DATA SEED GOALS, TUJUAN & MOM NOTULEN
const INITIAL_MOMS = [
  {
    id: 'MOM-2026-001',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering & Kick-Off Proyek 2026',
    tanggal: '2026-11-22',
    lokasi: 'Jambuluwuk Resort & Convention Hall, Puncak Bogor',
    goals: 'Tercapainya kekompakan 100% antar divisi, penurunan kendala komunikasi lintas proyek hingga 0%, dan pembentukan komite inovasi pelayanan konsumen tahun 2027.',
    tujuan: 'Meningkatkan rasa memiliki (sense of belonging) karyawan terhadap PT Persada Nusantara Indonesia, memberikan apresiasi atas tercapainya serah terima unit cluster tepat waktu, serta menyegarkan semangat kerja seluruh karyawan beserta keluarga.',
    momHasil: `1. PENGARAHAN DIREKSI UTAMA:
   - Target pemasaran properti tahun 2027 ditetapkan meningkat 25% dengan fokus utama pembukaan blok baru Ashoka View.
   - Manajemen mengapresiasi loyalitas seluruh divisi dengan kepastian pencairan bonus tahunan dan reward prestasi.

2. EVALUASI OPERASIONAL & MUTU LAPANGAN:
   - Divisi Teknik & Konstruksi berkomitmen menjaga zero-defect pada serah terima kunci rumah.
   - Divisi Legal & Keuangan menjamin ketepatan waktu penerbitan sertifikat SHM dan akad konsumen.

3. RENCANA TINDAK LANJUT (ACTION PLAN):
   - HR & GA segera menyusun jadwal pelatihan bersertifikat untuk staf pelaksana dan mandor.
   - Pengadaan fasilitas olahraga badminton / futsal bulanan bagi karyawan di Bizhub Commercial Estate.`,
    pesertaHadir: 'Dewan Direksi, Para Kepala Divisi, Seluruh Karyawan (85 Orang Terdaftar)',
    notulis: 'Siti Nurhaliza (Sekretaris HR & GA)',
    pimpinanRapat: 'Ahmad Rafail & Yazid Hizbullah (Dewan Direksi)',
    files: [{ name: 'MOM_Notulen_Family_Gathering_2026.pdf', size: '1.4 MB' }]
  },
  {
    id: 'MOM-2026-002',
    agendaId: 'GTH-2026-002',
    namaAcara: 'Halal Bihalal & Townhall Meeting Semester I',
    tanggal: '2026-05-15',
    lokasi: 'Clubhouse & Marketing Gallery Ashoka Park',
    goals: 'Penyelarasan SOP operasional purna jual, penguatan etika integritas tim penjualan, dan percepatan follow-up konsumen prospek.',
    tujuan: 'Menyambung tali silaturahmi Idul Fitri seluruh jajaran manajemen dan staf, menghapus sekat antar departemen, serta konsolidasi target kerja kuartal II.',
    momHasil: `1. HASIL EVALUASI KEHADIRAN:
   - Tingkat kehadiran pasca cuti bersama lebaran mencapai 98.5%.
   - Seluruh operasional kantor pemasaran dan pos satpam kembali normal tanpa kendala.

2. KESEPAKATAN STRATEGI PEMASARAN:
   - Tim marketing mengagendakan weekend expo di mall lokal dan promo subsidi biaya KPR.
   - Target booking fee bulan Juni ditetapkan minimal 15 unit rumah komersial.

3. TINDAK LANJUT GENERAL AFFAIR:
   - Perbaikan pendingin udara (AC) di marketing gallery diselesaikan sebelum minggu ke-3 Mei.
   - Inventarisasi alat tulis kantor dan peremajaan seragam lapangan baru.`,
    pesertaHadir: 'Direksi, Staf Marketing, Tim Finance, Staf HR & Operasional (58 Orang)',
    notulis: 'Dodi Syaiful Nugroho (Head HR & GA)',
    pimpinanRapat: 'Adhi Himawan (General Manager)',
    files: [{ name: 'Notulen_Halal_Bihalal_Mei_2026.pdf', size: '920 KB' }]
  },
  {
    id: 'MOM-2026-003',
    agendaId: 'GTH-2026-003',
    namaAcara: 'Outbound Leadership & Team Bonding Security & GA',
    tanggal: '2026-08-11',
    lokasi: 'Camp Bravo Outbound & Rafting, Cidahu, Sukabumi',
    goals: 'Peningkatan ketahanan fisik, responsivitas pengamanan pos gerbang utama 24 jam, dan zero tolerance terhadap pelanggaran ketertiban kawasan perumahan.',
    tujuan: 'Membina kepemimpinan (leadership), menumbuhkan soliditas regu satpam dan tim kebersihan lapangan, serta mengasah kerja sama tim dalam penanganan situasi darurat.',
    momHasil: `1. PENILAIAN PELATIHAN OUTBOUND:
   - Seluruh anggota regu security lulus simulasi evakuasi darurat kebakaran dan tanggap bencana.
   - Peningkatan skor kerja sama tim (team bonding) dari rata-rata 72 menjadi 94 poin.

2. SOP KEAMANAN TERBARU:
   - Pengetatan pemeriksaan truk pengangkut material yang keluar masuk gerbang utama Ashoka Park.
   - Patroli rutin diperbanyak pada jam rawan (pukul 01.00 - 04.30 WIB).

3. REWARD DAN APRESIASI:
   - Penghargaan "Satpam Teladan Kuartal III" diberikan kepada Petugas Joko Susanto.`,
    pesertaHadir: 'Komandan Regu, Seluruh Personil Security Satpam & Maintenance (34 Orang)',
    notulis: 'Hartono (Danru Security)',
    pimpinanRapat: 'Dodi Syaiful Nugroho (Head HR & GA)',
    files: [{ name: 'Evaluasi_Outbound_Security_2026.pdf', size: '1.1 MB' }]
  }
];

// 3. DATA SEED DOKUMENTASI & FOTO ACARA
const INITIAL_DOCS = [
  {
    id: 'DOC-001',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering & Kick-Off Proyek 2026',
    bulanTahun: '2026-11',
    tanggal: '2026-11-20',
    kategori: 'Fun Games',
    judul: 'Keseruan Fun Team Building & Ice Breaking di Lapangan Pinus',
    keterangan: 'Seluruh peserta karyawan dan keluarga berbaur dalam kompetisi balon estafet dan yel-yel kebersamaan divisi.',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    fotografer: 'Tim Media Kreatif AMS'
  },
  {
    id: 'DOC-002',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering & Kick-Off Proyek 2026',
    bulanTahun: '2026-11',
    tanggal: '2026-11-21',
    kategori: 'Gala Dinner',
    judul: 'Gala Dinner & Malam Keakraban Bersama Jajaran Dewan Direksi',
    keterangan: 'Suasana hangat makan malam BBQ kambing guling diiringi live acoustic music dan sesi pemutaran video kilas balik prestasi perusahaan.',
    imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    fotografer: 'Tim Media Kreatif AMS'
  },
  {
    id: 'DOC-003',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering & Kick-Off Proyek 2026',
    bulanTahun: '2026-11',
    tanggal: '2026-11-22',
    kategori: 'Doorprize',
    judul: 'Penyerahan Hadiah Utama Grand Doorprize Motor Listrik & Kulkas',
    keterangan: 'Direktur Utama menyerahkan simbolis kunci motor listrik kepada karyawan teladan operasional yang beruntung.',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    fotografer: 'Siti Nurhaliza'
  },
  {
    id: 'DOC-004',
    agendaId: 'GTH-2026-002',
    namaAcara: 'Halal Bihalal & Townhall Meeting Semester I',
    bulanTahun: '2026-05',
    tanggal: '2026-05-15',
    kategori: 'Seremonial',
    judul: 'Foto Bersama Keluarga Besar PT Persada Nusantara Indonesia',
    keterangan: 'Sesi foto bersama di pelataran Clubhouse Ashoka Park usai agenda townhall meeting dan salam-salaman Idul Fitri.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    fotografer: 'Dodi Syaiful Nugroho'
  },
  {
    id: 'DOC-005',
    agendaId: 'GTH-2026-003',
    namaAcara: 'Outbound Leadership & Team Bonding Security & GA',
    bulanTahun: '2026-08',
    tanggal: '2026-08-10',
    kategori: 'Outbound',
    judul: 'Simulasi Taktis Paintball & Latihan Formasi Regu Keamanan',
    keterangan: 'Latihan taktik kerja sama dan strategi pengamanan di arena hutan pinus Camp Bravo Cidahu Sukabumi.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    fotografer: 'Hartono'
  },
  {
    id: 'DOC-006',
    agendaId: 'GTH-2026-003',
    namaAcara: 'Outbound Leadership & Team Bonding Security & GA',
    bulanTahun: '2026-08',
    tanggal: '2026-08-11',
    kategori: 'Rafting',
    judul: 'Petualangan Rafting Arung Jeram Sungai Citarik Bersama Regu GA',
    keterangan: 'Menguji kekompakan dan nyali mendayung perahu karet menaklukkan jeram grade III sungai Citarik.',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
    fotografer: 'Vendor Outbound Sukabumi'
  }
];

// 4. DATA SEED RINCIAN ANGGARAN GATHERING (LENGKAP DENGAN DATA REKENING BANK)
const INITIAL_BUDGETS = [
  {
    id: 'BDG-001',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering 2026 Puncak',
    namaBank: 'BCA',
    noRekening: '002-988-1234',
    namaPenerima: 'PT Jambuluwuk Sejahtera',
    posPengeluaran: 'Sewa Venue & Akomodasi Resort',
    uraian: 'Sewa 25 unit kamar villa executive & ballroom convention hall selama 3 hari 2 malam',
    rencana: 45000000,
    realisasi: 42500000,
    status: 'Lunas', // Lunas, Diajukan ke Finance, Pending
    fundRequestId: 'REQ-2026-001',
    kwitansi: 'KW-JBL-09281.pdf',
    catatan: 'Diskon early booking grup korporat 5% dari pihak manajemen Jambuluwuk'
  },
  {
    id: 'BDG-002',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering 2026 Puncak',
    namaBank: 'Mandiri',
    noRekening: '137-00-998877-1',
    namaPenerima: 'PO Bintang Utama Pariwisata',
    posPengeluaran: 'Transportasi Bus Pariwisata',
    uraian: 'Sewa 2 unit bus pariwisata Big Bus 50 Seat full AC, tol, bensin, dan tip supir',
    rencana: 18000000,
    realisasi: 17000000,
    status: 'Lunas',
    fundRequestId: 'REQ-2026-002',
    kwitansi: 'KW-BUS-04192.pdf',
    catatan: 'Armada Bintang Utama Luxury Class kondisi prima'
  },
  {
    id: 'BDG-003',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering 2026 Puncak',
    namaBank: 'BCA',
    noRekening: '883-019-2819',
    namaPenerima: 'Catering Berkah Nusantara',
    posPengeluaran: 'Konsumsi & Catering Selama Acara',
    uraian: '6x makan berat prasmanan, 4x coffee break premium, & BBQ kambing guling 2 ekor',
    rencana: 22000000,
    realisasi: 21500000,
    status: 'Lunas',
    fundRequestId: 'REQ-2026-003',
    kwitansi: 'KW-CAT-88192.pdf',
    catatan: 'Menu disukai seluruh peserta termasuk menu ramah anak'
  },
  {
    id: 'BDG-004',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering 2026 Puncak',
    namaBank: 'BSI',
    noRekening: '712-4455-890',
    namaPenerima: 'Adventure Pro Outbound',
    posPengeluaran: 'Instruktur Outbound & Fun Games',
    uraian: 'Paket master game, 6 fasilitator lapangan, sound system portable outdoor, & properti lomba',
    rencana: 12000000,
    realisasi: 11500000,
    status: 'Lunas',
    fundRequestId: 'REQ-2026-004',
    kwitansi: 'KW-OUT-33921.pdf',
    catatan: 'Vendor Adventure Pro Puncak'
  },
  {
    id: 'BDG-005',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering 2026 Puncak',
    namaBank: 'BCA',
    noRekening: '527-1122-334',
    namaPenerima: 'Elektronik Maju Jaya',
    posPengeluaran: 'Hadiah Doorprize & Grand Prize',
    uraian: 'Motor listrik 1 unit, Smart TV 43 inch 2 unit, kulkas 1 unit, sepeda, & 20 voucher belanja',
    rencana: 16000000,
    realisasi: 15400000,
    status: 'Lunas',
    fundRequestId: null,
    kwitansi: 'KW-DPZ-99120.pdf',
    catatan: 'Pembelian langsung dari distributor elektronik resmi'
  },
  {
    id: 'BDG-006',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering 2026 Puncak',
    namaBank: 'BRI',
    noRekening: '0291-0182-9471',
    namaPenerima: 'Konveksi Kaos Prima',
    posPengeluaran: 'Merchandise Kaos, Topi & Goodie Bag',
    uraian: '90 pcs kaos polo bordir premium cotton combed 24s, topi rimba, tumbler & tas kain ramah lingkungan',
    rencana: 8500000,
    realisasi: 8000000,
    status: 'Lunas',
    fundRequestId: null,
    kwitansi: 'KW-MRC-11092.pdf',
    catatan: 'Kualitas bahan adem dan jahitan rapi'
  },
  {
    id: 'BDG-007',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering 2026 Puncak',
    namaBank: 'BCA',
    noRekening: '882-0194-819',
    namaPenerima: 'Creative Studio 4K',
    posPengeluaran: 'Dokumentasi Drone & Video Aftermovie',
    uraian: '2 fotografer profesional, 1 videografer drone FPV, & paket editing video aftermovie 4K',
    rencana: 6000000,
    realisasi: 5500000,
    status: 'Pending',
    fundRequestId: null,
    kwitansi: 'KW-DOC-77291.pdf',
    catatan: 'Hasil dokumentasi selesai dalam 5 hari kerja'
  },
  {
    id: 'BDG-008',
    agendaId: 'GTH-2026-001',
    namaAcara: 'Annual Family Gathering 2026 Puncak',
    namaBank: 'BCA',
    noRekening: '002-988-5511',
    namaPenerima: 'Klinik Medika Sehat',
    posPengeluaran: 'Dana Taktis & Keperluan Medis P3K',
    uraian: 'Obat-obatan umum, kotak P3K darurat, tabung oksigen portable, & biaya tak terduga',
    rencana: 4500000,
    realisasi: 2800000,
    status: 'Pending',
    fundRequestId: null,
    kwitansi: 'KW-MED-55102.pdf',
    catatan: 'Sisa dana dikembalikan ke kas operasional GA'
  }
];

export const GatheringModule = ({ currentUser, showNotification, onOpenFundRequest, onSwitchTab }) => {
  // Navigasi 4 Sub-Modul
  const [activeSubTab, setActiveSubTab] = useState('jadwal'); // 'jadwal' | 'mom' | 'dokumentasi' | 'anggaran'

  // Datasets State
  const [schedules, setSchedules] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_GATHERING_SCHEDULES);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_SCHEDULES;
  });

  const [moms, setMoms] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_GATHERING_MOMS);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_MOMS;
  });

  const [docs, setDocs] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_GATHERING_DOCS);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_DOCS;
  });

  const [budgets, setBudgets] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_GATHERING_BUDGETS);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_BUDGETS;
  });

  // LocalStorage Persistence
  useEffect(() => {
    try { localStorage.setItem(STORAGE_GATHERING_SCHEDULES, JSON.stringify(schedules)); } catch {}
  }, [schedules]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_GATHERING_MOMS, JSON.stringify(moms)); } catch {}
  }, [moms]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_GATHERING_DOCS, JSON.stringify(docs)); } catch {}
  }, [docs]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_GATHERING_BUDGETS, JSON.stringify(budgets)); } catch {}
  }, [budgets]);

  // REAL-TIME SYNC DENGAN FINANCE: Jika pengajuan dana gathering sudah cair di Finance, ubah status jadi 'Lunas'
  useEffect(() => {
    try {
      const financeRequests = getFundRequests();
      let hasChange = false;
      const updatedBudgets = budgets.map(b => {
        if (!b.fundRequestId) return b;
        const matchedFr = financeRequests.find(fr => fr.id === b.fundRequestId);
        if (matchedFr) {
          // Jika status di Finance sudah 'Dana Cair' atau 'Selesai' atau 'Disetujui'
          if ((matchedFr.status === 'Dana Cair' || matchedFr.status === 'Selesai') && b.status !== 'Lunas') {
            hasChange = true;
            return { ...b, status: 'Lunas' };
          } else if (matchedFr.status === 'Disetujui' && b.status === 'Pending') {
            hasChange = true;
            return { ...b, status: 'Diajukan ke Finance' };
          }
        }
        return b;
      });

      if (hasChange) {
        setBudgets(updatedBudgets);
      }
    } catch {}
  }, []);

  // Format Helper Rupiah & Tanggal
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

  // Helper Hitung Countdown Hari
  const calculateCountdown = (dateStr) => {
    if (!dateStr) return { days: 0, text: '-', status: 'past' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { days: diffDays, text: `Selesai (${Math.abs(diffDays)} hari lalu)`, status: 'past' };
    } else if (diffDays === 0) {
      return { days: 0, text: 'Hari Ini!', status: 'today' };
    } else {
      return { days: diffDays, text: `H-${diffDays} Hari Lagi`, status: 'upcoming' };
    }
  };

  // ===========================================================================
  // SUB-MODUL 1: JADWAL GATHERING STATE & HANDLERS
  // ===========================================================================
  const [searchSchedule, setSearchSchedule] = useState('');
  const [filterScheduleStatus, setFilterScheduleStatus] = useState('ALL'); // ALL, Mendatang, Berjalan, Selesai
  const [filterScheduleStartDate, setFilterScheduleStartDate] = useState('');
  const [filterScheduleEndDate, setFilterScheduleEndDate] = useState('');

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    namaAcara: '',
    tema: '',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    lokasi: 'Puncak Resort Bogor',
    meetingPoint: 'Head Office Bizhub Commercial Estate',
    targetPeserta: '80 Orang',
    pic: 'Dodi Syaiful Nugroho (HR & GA)',
    status: 'Mendatang',
    rundown: '',
    catatan: '',
    phonePic: '0812-9988-7711'
  });

  const filteredSchedules = useMemo(() => {
    return schedules.filter(item => {
      const q = searchSchedule.toLowerCase().trim();
      const matchSearch = !q ||
        item.namaAcara.toLowerCase().includes(q) ||
        item.tema.toLowerCase().includes(q) ||
        item.lokasi.toLowerCase().includes(q) ||
        item.pic.toLowerCase().includes(q);

      const matchStatus = filterScheduleStatus === 'ALL' || item.status === filterScheduleStatus;

      // Filter Rentang Tanggal
      const itemStart = item.tanggalMulai || '';
      const itemEnd = item.tanggalSelesai || item.tanggalMulai || '';
      const matchStart = !filterScheduleStartDate || itemEnd >= filterScheduleStartDate;
      const matchEnd = !filterScheduleEndDate || itemStart <= filterScheduleEndDate;

      return matchSearch && matchStatus && matchStart && matchEnd;
    });
  }, [schedules, searchSchedule, filterScheduleStatus, filterScheduleStartDate, filterScheduleEndDate]);

  const handleOpenAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({
      namaAcara: '',
      tema: '',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      lokasi: 'Puncak Resort Bogor',
      meetingPoint: 'Head Office Bizhub Commercial Estate',
      targetPeserta: '80 Orang',
      pic: 'Dodi Syaiful Nugroho (HR & GA)',
      status: 'Mendatang',
      rundown: 'Hari 1: Check-in, Ice Breaking;\nHari 2: Outbound & Gala Dinner;\nHari 3: Doorprize & Sayonara.',
      catatan: '',
      phonePic: '0812-9988-7711'
    });
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditSchedule = (sch) => {
    setEditingSchedule(sch);
    setScheduleForm({ ...sch });
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!scheduleForm.namaAcara.trim() || !scheduleForm.lokasi.trim()) {
      showNotification && showNotification('Nama Acara dan Lokasi wajib diisi!', 'danger');
      return;
    }

    if (editingSchedule) {
      setSchedules(schedules.map(s => s.id === editingSchedule.id ? { ...s, ...scheduleForm } : s));
      showNotification && showNotification(`Jadwal acara ${scheduleForm.namaAcara} berhasil diperbarui!`, 'success');
    } else {
      const newId = `GTH-${new Date().getFullYear()}-${String(schedules.length + 1).padStart(3, '0')}`;
      const newSch = { ...scheduleForm, id: newId };
      setSchedules([newSch, ...schedules]);
      showNotification && showNotification(`Jadwal gathering ${scheduleForm.namaAcara} berhasil ditambahkan!`, 'success');
    }
    setIsScheduleModalOpen(false);
  };

  const handleDeleteSchedule = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus jadwal acara ${name}?`)) {
      setSchedules(schedules.filter(s => s.id !== id));
      showNotification && showNotification(`Jadwal acara ${name} telah dihapus!`, 'info');
    }
  };

  const handleSendWASchedule = (sch) => {
    let cleanPhone = (sch.phonePic || '081299887711').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
    else if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

    const cd = calculateCountdown(sch.tanggalMulai);
    const text = `*INFORMASI ACARA GATHERING PERUSAHAAN*\n*PT PERSADA NUSANTARA INDONESIA*\n\n📌 *Acara:* ${sch.namaAcara}\n🎯 *Tema:* "${sch.tema}"\n📅 *Tanggal:* ${formatDisplayDate(sch.tanggalMulai)} s/d ${formatDisplayDate(sch.tanggalSelesai)} (${cd.text})\n📍 *Lokasi Venue:* ${sch.lokasi}\n🚌 *Titik Kumpul (Meeting Point):* ${sch.meetingPoint}\n👥 *Target Peserta:* ${sch.targetPeserta}\n👤 *PIC Panitia:* ${sch.pic}\n\n*Rundown Kegiatan:*\n${sch.rundown}\n\n*Catatan Panitia:* ${sch.catatan || 'Harap hadir tepat waktu & siapkan kelengkapan pribadi.'}\n\nSalam Hangat,\n*Divisi HR & GA PT Persada Nusantara Indonesia*`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ===========================================================================
  // SUB-MODUL 2: GOALS, TUJUAN & MOM NOTULEN STATE & HANDLERS
  // ===========================================================================
  const [searchMOM, setSearchMOM] = useState('');
  const [filterMOMStartDate, setFilterMOMStartDate] = useState('');
  const [filterMOMEndDate, setFilterMOMEndDate] = useState('');
  const [isMOMModalOpen, setIsMOMModalOpen] = useState(false);
  const [editingMOM, setEditingMOM] = useState(null);
  const [viewingMOMDoc, setViewingMOMDoc] = useState(null);

  const [momForm, setMomForm] = useState({
    agendaId: '',
    namaAcara: '',
    tanggal: new Date().toISOString().split('T')[0],
    lokasi: 'Jambuluwuk Resort Puncak',
    goals: '',
    tujuan: '',
    momHasil: '',
    pesertaHadir: 'Dewan Direksi & Seluruh Karyawan',
    notulis: 'Siti Nurhaliza (Sekretaris HR & GA)',
    pimpinanRapat: 'Ahmad Rafail & Yazid Hizbullah',
    files: []
  });

  const filteredMOMs = useMemo(() => {
    return moms.filter(item => {
      const q = searchMOM.toLowerCase().trim();
      const matchSearch = !q ||
        item.namaAcara.toLowerCase().includes(q) ||
        item.lokasi.toLowerCase().includes(q) ||
        item.goals.toLowerCase().includes(q) ||
        item.tujuan.toLowerCase().includes(q) ||
        item.momHasil.toLowerCase().includes(q);

      const itemDate = item.tanggal || '';
      const matchStart = !filterMOMStartDate || itemDate >= filterMOMStartDate;
      const matchEnd = !filterMOMEndDate || itemDate <= filterMOMEndDate;

      return matchSearch && matchStart && matchEnd;
    });
  }, [moms, searchMOM, filterMOMStartDate, filterMOMEndDate]);

  const handleOpenAddMOM = () => {
    setEditingMOM(null);
    const firstSch = schedules[0];
    setMomForm({
      agendaId: firstSch ? firstSch.id : '',
      namaAcara: firstSch ? firstSch.namaAcara : 'Annual Family Gathering 2026',
      tanggal: new Date().toISOString().split('T')[0],
      lokasi: firstSch ? firstSch.lokasi : 'Jambuluwuk Resort Puncak',
      goals: 'Penguatan kekompakan tim kerja 100%, evaluasi target proyek berjalan, dan pembentukan komite inovasi.',
      tujuan: 'Membangun sinergi lintas departemen dan apresiasi performa kerja karyawan.',
      momHasil: '1. Poin Arahan Direksi:\n2. Evaluasi Pelaksanaan Kegiatan:\n3. Rencana Tindak Lanjut (Action Plan):',
      pesertaHadir: 'Dewan Direksi & Seluruh Karyawan',
      notulis: 'Siti Nurhaliza (Sekretaris HR & GA)',
      pimpinanRapat: 'Ahmad Rafail & Yazid Hizbullah',
      files: []
    });
    setIsMOMModalOpen(true);
  };

  const handleOpenEditMOM = (m) => {
    setEditingMOM(m);
    setMomForm({ ...m });
    setIsMOMModalOpen(true);
  };

  const handleSaveMOM = (e) => {
    e.preventDefault();
    if (!momForm.namaAcara.trim() || !momForm.lokasi.trim() || !momForm.goals.trim()) {
      showNotification && showNotification('Nama Acara, Lokasi, dan Goals wajib diisi!', 'danger');
      return;
    }

    if (editingMOM) {
      setMoms(moms.map(m => m.id === editingMOM.id ? { ...m, ...momForm } : m));
      showNotification && showNotification(`Dokumen Notulen MOM ${momForm.namaAcara} berhasil diperbarui!`, 'success');
    } else {
      const newId = `MOM-${new Date().getFullYear()}-${String(moms.length + 1).padStart(3, '0')}`;
      const newM = {
        ...momForm,
        id: newId,
        files: [{ name: `MOM_Notulen_${momForm.namaAcara.replace(/\s+/g, '_')}.pdf`, size: '1.2 MB' }]
      };
      setMoms([newM, ...moms]);
      showNotification && showNotification(`Notulen MOM ${momForm.namaAcara} berhasil diterbitkan!`, 'success');
    }
    setIsMOMModalOpen(false);
  };

  const handleDeleteMOM = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus notulen MOM ${name}?`)) {
      setMoms(moms.filter(m => m.id !== id));
      showNotification && showNotification(`Notulen MOM ${name} dihapus!`, 'info');
    }
  };

  const handleSendWAMOM = (m) => {
    const text = `*NOTULEN & HASIL EVALUASI GATHERING (MOM)*\n*PT PERSADA NUSANTARA INDONESIA*\n\n📌 *Acara:* ${m.namaAcara}\n📅 *Tanggal:* ${formatDisplayDate(m.tanggal)}\n📍 *Lokasi:* ${m.lokasi}\n🎯 *Goals Capaian:* ${m.goals}\n💡 *Tujuan Acara:* ${m.tujuan}\n\n*HASIL / NOTULEN KEPUTUSAN:*\n${m.momHasil}\n\n👥 *Peserta Hadir:* ${m.pesertaHadir}\n✍️ *Notulis:* ${m.notulis}\n\nDokumen resmi tersimpan di sistem AMS HR & GA.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ===========================================================================
  // SUB-MODUL 3: DOKUMENTASI & FOTO ACARA (UPLOAD FILE & CUSTOM KATEGORI)
  // ===========================================================================
  const [searchDoc, setSearchDoc] = useState('');
  const [filterDocEvent, setFilterDocEvent] = useState('ALL');
  const [filterDocMonthYear, setFilterDocMonthYear] = useState('ALL');
  const [filterDocCategory, setFilterDocCategory] = useState('ALL');
  const [filterDocStartDate, setFilterDocStartDate] = useState('');
  const [filterDocEndDate, setFilterDocEndDate] = useState('');

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [viewingLightboxIndex, setViewingLightboxIndex] = useState(null);
  const fileInputRef = useRef(null);

  const [docForm, setDocForm] = useState({
    agendaId: '',
    namaAcara: '',
    bulanTahun: new Date().toISOString().slice(0, 7),
    tanggal: new Date().toISOString().split('T')[0],
    kategori: 'Fun Games',
    judul: '',
    keterangan: '',
    imageUrl: '',
    imageFileName: '',
    fotografer: 'Tim HR & GA'
  });

  // Ambil list unik bulan & tahun
  const availableMonths = useMemo(() => {
    const months = Array.from(new Set(docs.map(d => d.bulanTahun).filter(Boolean)));
    return months.sort().reverse();
  }, [docs]);

  // Ambil list unik nama acara
  const availableEvents = useMemo(() => {
    return Array.from(new Set(docs.map(d => d.namaAcara).filter(Boolean)));
  }, [docs]);

  // Ambil list unik kategori momen yang dinamis
  const availableCategories = useMemo(() => {
    return Array.from(new Set(docs.map(d => d.kategori).filter(Boolean)));
  }, [docs]);

  const filteredDocs = useMemo(() => {
    return docs.filter(item => {
      const q = searchDoc.toLowerCase().trim();
      const matchSearch = !q ||
        item.judul.toLowerCase().includes(q) ||
        item.keterangan.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q) ||
        item.namaAcara.toLowerCase().includes(q);

      const matchEvent = filterDocEvent === 'ALL' || item.namaAcara === filterDocEvent;
      const matchMonth = filterDocMonthYear === 'ALL' || item.bulanTahun === filterDocMonthYear;
      const matchCategory = filterDocCategory === 'ALL' || item.kategori === filterDocCategory;

      const itemDate = item.tanggal || '';
      const matchStartDate = !filterDocStartDate || (itemDate && itemDate >= filterDocStartDate);
      const matchEndDate = !filterDocEndDate || (itemDate && itemDate <= filterDocEndDate);

      return matchSearch && matchEvent && matchMonth && matchCategory && matchStartDate && matchEndDate;
    });
  }, [docs, searchDoc, filterDocEvent, filterDocMonthYear, filterDocCategory, filterDocStartDate, filterDocEndDate]);

  const handleOpenAddDoc = () => {
    const firstSch = schedules[0];
    setDocForm({
      agendaId: firstSch ? firstSch.id : '',
      namaAcara: firstSch ? firstSch.namaAcara : 'Annual Family Gathering 2026 Puncak',
      bulanTahun: new Date().toISOString().slice(0, 7),
      tanggal: new Date().toISOString().split('T')[0],
      kategori: 'Fun Games',
      judul: '',
      keterangan: '',
      imageUrl: '',
      imageFileName: '',
      fotografer: 'Tim Dokumentasi HR'
    });
    setIsDocModalOpen(true);
  };

  // Handler Upload File Gambar Langsung (Menggunakan FileReader Base64)
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      showNotification && showNotification('Ukuran file foto maksimal 12 MB!', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setDocForm(prev => ({
        ...prev,
        imageUrl: uploadEvent.target.result,
        imageFileName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDoc = (e) => {
    e.preventDefault();
    if (!docForm.judul.trim()) {
      showNotification && showNotification('Judul foto / momen kegiatan wajib diisi!', 'danger');
      return;
    }

    if (!docForm.imageUrl) {
      showNotification && showNotification('Silakan upload file foto dokumentasi terlebih dahulu!', 'warning');
      return;
    }

    const newId = `DOC-${String(docs.length + 1).padStart(3, '0')}`;
    const newD = {
      ...docForm,
      id: newId
    };

    setDocs([newD, ...docs]);
    showNotification && showNotification('Foto dokumentasi gathering berhasil diupload & disimpan!', 'success');
    setIsDocModalOpen(false);
  };

  // Handler Download Foto Langsung
  const handleDownloadDoc = (doc) => {
    if (!doc || !doc.imageUrl) return;
    const a = document.createElement('a');
    a.href = doc.imageUrl;
    const safeTitle = (doc.judul || 'Foto_Gathering').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `${safeTitle}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification && showNotification(`Foto "${doc.judul}" berhasil diunduh!`, 'success');
  };

  const handleDeleteDoc = (id, title) => {
    if (window.confirm(`Hapus foto dokumentasi "${title}"?`)) {
      setDocs(docs.filter(d => d.id !== id));
      showNotification && showNotification('Foto dokumentasi dihapus!', 'info');
      if (viewingLightboxIndex !== null) setViewingLightboxIndex(null);
    }
  };

  // ===========================================================================
  // SUB-MODUL 4: RINCIAN ANGGARAN, REKENING BANK & GRAFIK TREN BIAYA
  // ===========================================================================
  const [searchBudget, setSearchBudget] = useState('');
  const [filterBudgetStatus, setFilterBudgetStatus] = useState('ALL'); // ALL, Lunas, Diajukan ke Finance, Pending
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [selectedBudgetForPayment, setSelectedBudgetForPayment] = useState(null); // Modal Konfirmasi Bayar ke Finance
  const [selectedChartPoint, setSelectedChartPoint] = useState(null); // Titik grafik yang dipilih

  const [budgetForm, setBudgetForm] = useState({
    agendaId: '',
    namaAcara: 'Annual Family Gathering 2026 Puncak',
    namaBank: 'BCA',
    noRekening: '',
    namaPenerima: '',
    posPengeluaran: '',
    uraian: '',
    rencana: '',
    realisasi: '',
    status: 'Pending',
    fundRequestId: null,
    kwitansi: '',
    catatan: ''
  });

  const filteredBudgets = useMemo(() => {
    return budgets.filter(item => {
      const q = searchBudget.toLowerCase().trim();
      const matchSearch = !q ||
        item.posPengeluaran.toLowerCase().includes(q) ||
        item.uraian.toLowerCase().includes(q) ||
        item.namaAcara.toLowerCase().includes(q) ||
        (item.namaBank && item.namaBank.toLowerCase().includes(q)) ||
        (item.noRekening && item.noRekening.toLowerCase().includes(q)) ||
        (item.namaPenerima && item.namaPenerima.toLowerCase().includes(q)) ||
        (item.catatan && item.catatan.toLowerCase().includes(q));

      const matchStatus = filterBudgetStatus === 'ALL' || item.status === filterBudgetStatus;
      return matchSearch && matchStatus;
    });
  }, [budgets, searchBudget, filterBudgetStatus]);

  // Kalkulasi Total Finansial
  const totalRencana = useMemo(() => budgets.reduce((acc, b) => acc + (Number(b.rencana) || 0), 0), [budgets]);
  const totalRealisasi = useMemo(() => budgets.reduce((acc, b) => acc + (Number(b.realisasi) || 0), 0), [budgets]);
  const selisihSaldo = totalRencana - totalRealisasi;
  const persentaseSerapan = totalRencana > 0 ? ((totalRealisasi / totalRencana) * 100).toFixed(1) : 0;

  const handleOpenAddBudget = () => {
    setEditingBudget(null);
    const firstSch = schedules[0];
    setBudgetForm({
      agendaId: firstSch ? firstSch.id : '',
      namaAcara: firstSch ? firstSch.namaAcara : 'Annual Family Gathering 2026 Puncak',
      namaBank: 'BCA',
      noRekening: '',
      namaPenerima: '',
      posPengeluaran: '',
      uraian: '',
      rencana: '',
      realisasi: '',
      status: 'Pending',
      fundRequestId: null,
      kwitansi: `KW-${Math.floor(10000 + Math.random() * 90000)}.pdf`,
      catatan: ''
    });
    setIsBudgetModalOpen(true);
  };

  const handleOpenEditBudget = (bdg) => {
    setEditingBudget(bdg);
    setBudgetForm({
      ...bdg,
      rencana: bdg.rencana !== undefined && bdg.rencana !== null ? (bdg.rencana === 0 ? '' : String(bdg.rencana)) : '',
      realisasi: bdg.realisasi !== undefined && bdg.realisasi !== null ? (bdg.realisasi === 0 ? '' : String(bdg.realisasi)) : ''
    });
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    if (!budgetForm.namaBank.trim() || !budgetForm.noRekening.trim() || !budgetForm.namaPenerima.trim()) {
      showNotification && showNotification('Nama Bank, Nomor Rekening, dan Nama Penerima wajib diisi di bagian atas!', 'danger');
      return;
    }
    if (!budgetForm.posPengeluaran.trim() || !budgetForm.uraian.trim()) {
      showNotification && showNotification('Pos Pengeluaran dan Uraian Kebutuhan wajib diisi!', 'danger');
      return;
    }

    const payload = {
      ...budgetForm,
      rencana: Number(budgetForm.rencana) || 0,
      realisasi: Number(budgetForm.realisasi) || 0
    };

    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === editingBudget.id ? { ...b, ...payload } : b));
      showNotification && showNotification(`Pos anggaran ${budgetForm.posPengeluaran} berhasil diperbarui!`, 'success');
    } else {
      const newId = `BDG-${String(budgets.length + 1).padStart(3, '0')}`;
      const newB = { ...payload, id: newId };
      setBudgets([...budgets, newB]);
      showNotification && showNotification(`Pos anggaran ${budgetForm.posPengeluaran} berhasil ditambahkan!`, 'success');
    }
    setIsBudgetModalOpen(false);
  };

  const handleDeleteBudget = (id, pos) => {
    if (window.confirm(`Yakin ingin menghapus pos anggaran "${pos}"?`)) {
      setBudgets(budgets.filter(b => b.id !== id));
      showNotification && showNotification(`Pos anggaran ${pos} dihapus!`, 'info');
    }
  };

  // HANDLER KLIK STATUS: OTOMATIS KIRIM PENGAJUAN DANA KE FINANCE / TOGGLE STATUS LUNAS
  const handleStatusClick = (b) => {
    if (b.status === 'Lunas') {
      if (window.confirm(`Status saat ini sudah "Lunas". Ingin mereset status kembali ke "Pending"?`)) {
        setBudgets(budgets.map(item => item.id === b.id ? { ...item, status: 'Pending', fundRequestId: null } : item));
        showNotification && showNotification(`Status ${b.posPengeluaran} direset ke Pending`, 'info');
      }
      return;
    }

    // Jika belum lunas, buka modal konfirmasi pengiriman ke Finance
    setSelectedBudgetForPayment(b);
  };

  // Proses Kirim Otomatis ke Finance
  const handleConfirmSendToFinance = () => {
    if (!selectedBudgetForPayment) return;
    const b = selectedBudgetForPayment;

    try {
      const nominal = Number(b.realisasi) || Number(b.rencana) || 0;
      const createdRequest = submitFundRequest({
        originModule: 'hrga',
        originModuleName: 'HR & GA (Gathering)',
        title: `Biaya Gathering: ${b.posPengeluaran} - ${b.namaAcara}`,
        amount: nominal,
        category: 'Kegiatan Gathering',
        project: 'Head Office Bizhub',
        requester: 'Panitia Gathering HR & GA',
        targetBank: b.namaBank || 'BCA',
        targetAccountNumber: b.noRekening || '-',
        targetAccountHolder: b.namaPenerima || 'Vendor Acara',
        namaBank: b.namaBank || 'BCA',
        noRekening: b.noRekening || '-',
        namaPenerima: b.namaPenerima || 'Vendor Acara',
        notes: `Pembayaran pos anggaran gathering: ${b.uraian}.\nTransfer ke Bank: ${b.namaBank || 'BCA'} No. Rek: ${b.noRekening || '-'} a.n ${b.namaPenerima || 'Vendor'}.`,
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        accountCode: '5-301'
      });

      // Update status pos anggaran menjadi 'Diajukan ke Finance'
      setBudgets(budgets.map(item => {
        if (item.id === b.id) {
          return {
            ...item,
            status: 'Diajukan ke Finance',
            fundRequestId: createdRequest.id
          };
        }
        return item;
      }));

      showNotification && showNotification(
        `Pengajuan dana ${formatRupiah(nominal)} untuk "${b.posPengeluaran}" berhasil dikirim otomatis ke Finance & Accounting! (ID: ${createdRequest.id})`,
        'success'
      );
    } catch (err) {
      console.error(err);
      showNotification && showNotification(`Gagal mengirim ke Finance: ${err.message}`, 'danger');
    }

    setSelectedBudgetForPayment(null);
  };

  // Manual Tandai Lunas Langsung
  const handleMarkAsPaidManual = () => {
    if (!selectedBudgetForPayment) return;
    const b = selectedBudgetForPayment;
    setBudgets(budgets.map(item => item.id === b.id ? { ...item, status: 'Lunas' } : item));
    showNotification && showNotification(`Pos anggaran "${b.posPengeluaran}" telah ditandai Lunas!`, 'success');
    setSelectedBudgetForPayment(null);
  };

  // ===========================================================================
  // RENDER UTAMA MODUL GATHERING
  // ===========================================================================
  return (
    <div style={{ animation: 'fadeIn 0.25s ease-in-out' }}>
      
      {/* HEADER UTAMA MODUL GATHERING */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Calendar size={26} color="#10b981" />
            <span>Modul Gathering & Acara Kebersamaan</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Manajemen agenda kegiatan gathering, evaluasi goals & notulen resmi (MOM), galeri dokumentasi momen, serta rincian kurva anggaran PT Persada Nusantara Indonesia.
          </p>
        </div>

        {/* Action Button: Ajukan Dana ke Finance & Balik ke Database Karyawan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onOpenFundRequest && (
            <button
              onClick={onOpenFundRequest}
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                border: '1px solid #10b981',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)',
                cursor: 'pointer'
              }}
              title="Ajukan Permintaan Dana Kegiatan Gathering ke Finance & Accounting"
            >
              <DollarSign size={14} /> + Ajukan Dana Acara ke Finance
            </button>
          )}

          <button
            onClick={() => onSwitchTab && onSwitchTab('database-karyawan')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Users size={14} /> Data Karyawan
          </button>
        </div>
      </div>

      {/* NAVIGASI 4 SUB-MODUL PERSIS SESUAI INSTRUKSI USER */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          background: '#090d16',
          padding: '6px',
          borderRadius: '12px',
          border: '1.5px solid #1e293b',
          marginBottom: '1.4rem'
        }}
      >
        <button
          onClick={() => setActiveSubTab('jadwal')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.82rem',
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
          <Calendar size={15} />
          <span>1. Jadwal Gathering</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mom')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: activeSubTab === 'mom' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeSubTab === 'mom' ? '#ffffff' : '#94a3b8',
            border: activeSubTab === 'mom' ? '1px solid #34d399' : 'none',
            boxShadow: activeSubTab === 'mom' ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
          }}
        >
          <Target size={15} />
          <span>2. Goals, Tujuan & MOM</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dokumentasi')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: activeSubTab === 'dokumentasi' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeSubTab === 'dokumentasi' ? '#ffffff' : '#94a3b8',
            border: activeSubTab === 'dokumentasi' ? '1px solid #34d399' : 'none',
            boxShadow: activeSubTab === 'dokumentasi' ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
          }}
        >
          <Camera size={15} />
          <span>3. Dokumentasi & Foto</span>
        </button>

        <button
          onClick={() => setActiveSubTab('anggaran')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: activeSubTab === 'anggaran' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeSubTab === 'anggaran' ? '#ffffff' : '#94a3b8',
            border: activeSubTab === 'anggaran' ? '1px solid #34d399' : 'none',
            boxShadow: activeSubTab === 'anggaran' ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
          }}
        >
          <TrendingUp size={15} />
          <span>4. Rincian Anggaran & Grafik</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SUB-MODUL 1: JADWAL GATHERING                                         */}
      {/* ===================================================================== */}
      {activeSubTab === 'jadwal' && (
        <div>
          {/* 4 Kartu KPI Emerald */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.2rem' }}>
            <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Total Agenda Gathering</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
                {schedules.length} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Kegiatan</span>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #34d399' }}>
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>Agenda Mendatang</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                {schedules.filter(s => s.status === 'Mendatang').length} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Event</span>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Kegiatan Selesai</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
                {schedules.filter(s => s.status === 'Selesai').length} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Event</span>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Total Partisipasi Peserta</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
                180+ <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Orang Karyawan</span>
              </div>
            </div>
          </div>

          {/* Toolbar Pencarian & Filter & Tambah */}
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
                placeholder="Cari acara, lokasi, tema, atau PIC..."
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Filter Status Acara */}
              <select
                value={filterScheduleStatus}
                onChange={(e) => setFilterScheduleStatus(e.target.value)}
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
                <option value="ALL">Semua Status Acara</option>
                <option value="Mendatang">Mendatang (Upcoming)</option>
                <option value="Berjalan">Sedang Berjalan</option>
                <option value="Selesai">Selesai Dilaksanakan</option>
              </select>

              {/* Filter Rentang Tanggal Acara */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Calendar size={13} color="#10b981" /> Dari:
                </span>
                <input
                  type="date"
                  value={filterScheduleStartDate}
                  onChange={(e) => setFilterScheduleStartDate(e.target.value)}
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
                  title="Filter tanggal mulai dari"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Sampai:</span>
                <input
                  type="date"
                  value={filterScheduleEndDate}
                  onChange={(e) => setFilterScheduleEndDate(e.target.value)}
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
                  title="Filter tanggal selesai sampai"
                />
              </div>

              {/* Reset Filter Jika Aktif */}
              {(filterScheduleStartDate || filterScheduleEndDate || filterScheduleStatus !== 'ALL' || searchSchedule) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchSchedule('');
                    setFilterScheduleStatus('ALL');
                    setFilterScheduleStartDate('');
                    setFilterScheduleEndDate('');
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
                  title="Reset Semua Filter Jadwal"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              )}

              <button
                onClick={handleOpenAddSchedule}
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
                <Plus size={16} /> + Tambah Jadwal Gathering
              </button>
            </div>
          </div>

          {/* Tabel Jadwal Acara Gathering */}
          <div className="table-container" style={{ border: '1px solid #1e293b', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1050px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b' }}>
                  <th style={{ width: '130px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>No. Agenda</th>
                  <th style={{ minWidth: '220px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama Acara & Tema</th>
                  <th style={{ width: '170px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Tanggal & Countdown</th>
                  <th style={{ minWidth: '200px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Lokasi & Titik Kumpul</th>
                  <th style={{ width: '160px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Peserta & PIC Panitia</th>
                  <th style={{ width: '110px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ width: '140px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>WA & Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      <Calendar size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Tidak ada jadwal gathering ditemukan</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Coba ubah kata kunci pencarian atau klik "+ Tambah Jadwal Gathering".</p>
                    </td>
                  </tr>
                ) : (
                  filteredSchedules.map((sch, idx) => {
                    const cd = calculateCountdown(sch.tanggalMulai);
                    return (
                      <tr
                        key={sch.id || idx}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                          transition: 'background 0.15s'
                        }}
                      >
                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#34d399', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 8px', borderRadius: '5px', border: '1px solid rgba(16, 185, 129, 0.3)', fontFamily: 'monospace' }}>
                            {sch.id}
                          </span>
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>{sch.namaAcara}</div>
                          <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginTop: '3px', fontStyle: 'italic' }}>
                            "{sch.tema}"
                          </div>
                          {sch.rundown && (
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '5px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '6px', whiteSpace: 'pre-line' }}>
                              📋 {sch.rundown.slice(0, 75)}...
                            </div>
                          )}
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 700 }}>
                            {formatDisplayDate(sch.tanggalMulai)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            s/d {formatDisplayDate(sch.tanggalSelesai)}
                          </div>
                          <div style={{ marginTop: '5px' }}>
                            <span
                              style={{
                                background: cd.status === 'upcoming' ? 'rgba(16, 185, 129, 0.2)' :
                                  cd.status === 'today' ? 'rgba(52, 211, 153, 0.25)' : 'rgba(100, 116, 139, 0.2)',
                                color: cd.status === 'upcoming' ? '#34d399' :
                                  cd.status === 'today' ? '#10b981' : '#94a3b8',
                                border: `1px solid ${cd.status === 'past' ? '#475569' : '#10b981'}`,
                                padding: '2px 7px',
                                borderRadius: '10px',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                display: 'inline-block'
                              }}
                            >
                              {cd.text}
                            </span>
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                            📍 {sch.lokasi}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                            🚌 Kumpul: {sch.meetingPoint}
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399' }}>
                            {sch.targetPeserta}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            PIC: {sch.pic}
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                          <span
                            style={{
                              background: sch.status === 'Mendatang' ? 'rgba(16, 185, 129, 0.2)' :
                                sch.status === 'Berjalan' ? 'rgba(52, 211, 153, 0.25)' : 'rgba(100, 116, 139, 0.2)',
                              color: sch.status === 'Mendatang' ? '#34d399' :
                                sch.status === 'Berjalan' ? '#10b981' : '#94a3b8',
                              border: `1px solid ${sch.status === 'Selesai' ? '#475569' : '#10b981'}`,
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'inline-block',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {sch.status}
                          </span>
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleSendWASchedule(sch)}
                              style={{
                                background: '#25D366',
                                border: 'none',
                                color: '#ffffff',
                                padding: '4px 7px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                borderRadius: '5px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 5px rgba(37, 211, 102, 0.3)'
                              }}
                              title="Broadcast Informasi Jadwal via WhatsApp"
                            >
                              <MessageSquare size={12} /> WA
                            </button>

                            <button
                              onClick={() => handleOpenEditSchedule(sch)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 6px', fontSize: '0.72rem' }}
                              title="Edit Jadwal"
                            >
                              <Edit3 size={12} />
                            </button>

                            <button
                              onClick={() => handleDeleteSchedule(sch.id, sch.namaAcara)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                              title="Hapus Jadwal"
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
      )}

      {/* ===================================================================== */}
      {/* SUB-MODUL 2: GOALS, TUJUAN & MOM NOTULEN HASIL EVALUASI               */}
      {/* ===================================================================== */}
      {activeSubTab === 'mom' && (
        <div>
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
                placeholder="Cari tanggal, lokasi, goals, tujuan, atau MOM..."
                value={searchMOM}
                onChange={(e) => setSearchMOM(e.target.value)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Filter Rentang Tanggal Notulen */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Calendar size={13} color="#10b981" /> Dari:
                </span>
                <input
                  type="date"
                  value={filterMOMStartDate}
                  onChange={(e) => setFilterMOMStartDate(e.target.value)}
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
                  title="Filter tanggal notulen mulai dari"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Sampai:</span>
                <input
                  type="date"
                  value={filterMOMEndDate}
                  onChange={(e) => setFilterMOMEndDate(e.target.value)}
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
                  title="Filter tanggal notulen sampai"
                />
              </div>

              {/* Reset Filter Jika Aktif */}
              {(filterMOMStartDate || filterMOMEndDate || searchMOM) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchMOM('');
                    setFilterMOMStartDate('');
                    setFilterMOMEndDate('');
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
                  title="Reset Semua Filter MOM"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              )}

              <button
                onClick={handleOpenAddMOM}
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
                <Plus size={16} /> + Terbitkan Notulen / MOM Baru
              </button>
            </div>
          </div>

          <div className="table-container" style={{ border: '1px solid #1e293b', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1150px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b' }}>
                  <th style={{ width: '130px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Tanggal</th>
                  <th style={{ width: '180px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Lokasi Acara</th>
                  <th style={{ minWidth: '220px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Goals (Target Capaian)</th>
                  <th style={{ minWidth: '220px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Tujuan Gathering</th>
                  <th style={{ minWidth: '250px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>MOM / Hasil / Notulen</th>
                  <th style={{ width: '150px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Dokumen & Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMOMs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      <Target size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Belum ada catatan goals & notulen MOM</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Klik tombol "+ Terbitkan Notulen / MOM Baru" untuk menginput hasil gathering.</p>
                    </td>
                  </tr>
                ) : (
                  filteredMOMs.map((m, idx) => (
                    <tr
                      key={m.id || idx}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                        transition: 'background 0.15s'
                      }}
                    >
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {formatDisplayDate(m.tanggal)}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'inline-block', marginTop: '4px', fontFamily: 'monospace' }}>
                          {m.id}
                        </span>
                      </td>

                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.84rem' }}>
                          📍 {m.lokasi}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                          Event: {m.namaAcara}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, lineHeight: 1.5 }}>
                          🎯 {m.goals}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                          💡 {m.tujuan}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '6px', border: '1px solid #1e293b', whiteSpace: 'pre-line' }}>
                          {m.momHasil.length > 200 ? m.momHasil.slice(0, 200) + '...' : m.momHasil}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                          ✍️ Notulis: <strong>{m.notulis}</strong> • Pimpinan: {m.pimpinanRapat}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setViewingMOMDoc(m)}
                            className="btn btn-sm"
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid #10b981',
                              color: '#34d399',
                              padding: '4px 7px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              borderRadius: '5px'
                            }}
                            title="Pratinjau & Cetak Lembar Notulen Resmi A4"
                          >
                            <Eye size={12} /> View
                          </button>

                          <button
                            onClick={() => handleSendWAMOM(m)}
                            style={{
                              background: '#25D366',
                              border: 'none',
                              color: '#ffffff',
                              padding: '4px 6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                            title="Bagikan Ringkasan Notulen via WhatsApp"
                          >
                            <MessageSquare size={12} />
                          </button>

                          <button
                            onClick={() => handleOpenEditMOM(m)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', fontSize: '0.72rem' }}
                            title="Edit Notulen"
                          >
                            <Edit3 size={12} />
                          </button>

                          <button
                            onClick={() => handleDeleteMOM(m.id, m.namaAcara)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                            title="Hapus Notulen"
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
      {/* SUB-MODUL 3: DOKUMENTASI & FOTO ACARA (UPLOAD FILE & CUSTOM KATEGORI) */}
      {/* ===================================================================== */}
      {activeSubTab === 'dokumentasi' && (
        <div>
          {/* Toolbar Filter & Pencarian Sub-Modul 3 */}
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
              marginBottom: '1.2rem'
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '280px' }}>
              <Search size={15} color="#10b981" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari momen, caption, fotografer..."
                value={searchDoc}
                onChange={(e) => setSearchDoc(e.target.value)}
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

            {/* Filter Acara, Bulan, Kategori, & Rentang Tanggal Momen */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Filter Acara */}
              <select
                value={filterDocEvent}
                onChange={(e) => setFilterDocEvent(e.target.value)}
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
                <option value="ALL">Semua Acara</option>
                {availableEvents.map((ev, i) => (
                  <option key={i} value={ev}>{ev}</option>
                ))}
              </select>

              {/* Filter Kategori Momen */}
              <select
                value={filterDocCategory}
                onChange={(e) => setFilterDocCategory(e.target.value)}
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
                <option value="ALL">Semua Kategori</option>
                {availableCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Filter Bulan & Tahun */}
              <select
                value={filterDocMonthYear}
                onChange={(e) => setFilterDocMonthYear(e.target.value)}
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
                <option value="ALL">Semua Periode</option>
                {availableMonths.map((m, i) => {
                  const [y, mm] = m.split('-');
                  const monthName = new Date(y, Number(mm) - 1, 1).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
                  return <option key={i} value={m}>{monthName}</option>;
                })}
              </select>

              {/* Filter Rentang Tanggal Foto */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Calendar size={13} color="#10b981" /> Dari:
                </span>
                <input
                  type="date"
                  value={filterDocStartDate}
                  onChange={(e) => setFilterDocStartDate(e.target.value)}
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
                  title="Filter tanggal foto mulai dari"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Sampai:</span>
                <input
                  type="date"
                  value={filterDocEndDate}
                  onChange={(e) => setFilterDocEndDate(e.target.value)}
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
                  title="Filter tanggal foto sampai"
                />
              </div>

              {/* Reset Filter Jika Aktif */}
              {(filterDocStartDate || filterDocEndDate || filterDocEvent !== 'ALL' || filterDocCategory !== 'ALL' || filterDocMonthYear !== 'ALL' || searchDoc) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchDoc('');
                    setFilterDocEvent('ALL');
                    setFilterDocCategory('ALL');
                    setFilterDocMonthYear('ALL');
                    setFilterDocStartDate('');
                    setFilterDocEndDate('');
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
                  title="Reset Semua Filter Dokumentasi"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              )}

              <button
                onClick={handleOpenAddDoc}
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
                <UploadCloud size={16} /> + Upload Foto Acara
              </button>
            </div>
          </div>

          {/* Grid Galeri Foto Dokumentasi */}
          {filteredDocs.length === 0 ? (
            <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '14px', padding: '4rem 2rem', textAlign: 'center' }}>
              <Camera size={44} color="#10b981" style={{ opacity: 0.6, marginBottom: '10px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>Tidak Ada Dokumentasi yang Sesuai</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
                Coba sesuaikan pilihan filter di atas, atau klik "+ Upload Foto Acara" untuk mengunggah foto kegiatan dari komputer.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredDocs.map((doc, idx) => (
                <div
                  key={doc.id || idx}
                  style={{
                    background: '#090d16',
                    border: '1.5px solid #1e293b',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, border-color 0.2s',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Foto Thumbnail */}
                  <div style={{ position: 'relative', width: '100%', height: '210px', background: '#020617', cursor: 'pointer' }} onClick={() => setViewingLightboxIndex(idx)}>
                    <img
                      src={doc.imageUrl}
                      alt={doc.judul}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                      <span style={{ background: 'rgba(9, 13, 22, 0.88)', backdropFilter: 'blur(4px)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 9px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>
                        {doc.kategori}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                      <span style={{ background: 'rgba(0,0,0,0.8)', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={11} /> Klik Zoom
                      </span>
                    </div>
                  </div>

                  {/* Deskripsi & Detail Momen */}
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>
                          {formatDisplayDate(doc.tanggal)}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                          ID: {doc.id}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                        {doc.judul}
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                        {doc.keterangan}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '8px', marginTop: '6px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        📸 {doc.fotografer || 'Tim HR'}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {/* Tombol Unduh Foto */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadDoc(doc);
                          }}
                          className="btn btn-sm"
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid #10b981',
                            color: '#34d399',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            borderRadius: '5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Unduh File Foto Ini"
                        >
                          <Download size={12} /> Unduh
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDoc(doc.id, doc.judul);
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Hapus Foto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIGHTBOX MODAL PREVIEW FOTO RESOLUSI PENUH */}
          {viewingLightboxIndex !== null && filteredDocs[viewingLightboxIndex] && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.92)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
                padding: '1rem'
              }}
            >
              <div style={{ position: 'relative', maxWidth: '900px', width: '100%', maxHeight: '90vh', background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ color: '#34d399', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={16} />
                    <span>{filteredDocs[viewingLightboxIndex].namaAcara} — {filteredDocs[viewingLightboxIndex].kategori}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleDownloadDoc(filteredDocs[viewingLightboxIndex])}
                      className="btn btn-primary btn-sm"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Download size={13} /> Unduh File Foto
                    </button>
                    <button
                      onClick={() => setViewingLightboxIndex(null)}
                      style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div style={{ position: 'relative', width: '100%', height: '520px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={filteredDocs[viewingLightboxIndex].imageUrl}
                    alt={filteredDocs[viewingLightboxIndex].judul}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />

                  {viewingLightboxIndex > 0 && (
                    <button
                      onClick={() => setViewingLightboxIndex(viewingLightboxIndex - 1)}
                      style={{ position: 'absolute', left: '14px', background: 'rgba(0,0,0,0.6)', border: '1px solid #334155', color: '#ffffff', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <ChevronLeft size={22} />
                    </button>
                  )}

                  {viewingLightboxIndex < filteredDocs.length - 1 && (
                    <button
                      onClick={() => setViewingLightboxIndex(viewingLightboxIndex + 1)}
                      style={{ position: 'absolute', right: '14px', background: 'rgba(0,0,0,0.6)', border: '1px solid #334155', color: '#ffffff', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <ChevronRight size={22} />
                    </button>
                  )}
                </div>

                <div style={{ padding: '14px 18px', background: '#090d16', borderTop: '1px solid #1e293b' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#ffffff', fontWeight: 800 }}>
                    {filteredDocs[viewingLightboxIndex].judul}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                    {filteredDocs[viewingLightboxIndex].keterangan}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                    Tanggal: {formatDisplayDate(filteredDocs[viewingLightboxIndex].tanggal)} • Fotografer: {filteredDocs[viewingLightboxIndex].fotografer} • Foto {viewingLightboxIndex + 1} dari {filteredDocs.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-MODUL 4: RINCIAN ANGGARAN, REKENING BANK & GRAFIK TREN BIAYA      */}
      {/* ===================================================================== */}
      {activeSubTab === 'anggaran' && (
        <div>
          {/* 4 Kartu KPI Keuangan Anggaran Gathering */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.4rem' }}>
            <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL ANGGARAN RENCANA</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
                {formatRupiah(totalRencana)}
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1.5px solid #10b981', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL REALISASI PENGELUARAN</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                {formatRupiah(totalRealisasi)}
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>SISA ANGGARAN (EFISIENSI)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
                +{formatRupiah(selisihSaldo)}
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #34d399' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>PENYERAPAN ANGGARAN</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                {persentaseSerapan}% <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>(Efektif)</span>
              </div>
            </div>
          </div>

          {/* VISUALISASI GRAFIK GARIS KUALITAS TINGGI (TIDAK KEPOTONG, RESPONSIVE, BEZIER SMOOTH) */}
          <div style={{ background: '#020617', border: '1.5px solid #1e293b', borderRadius: '14px', padding: '1.6rem', marginBottom: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} color="#10b981" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    Grafik Garis Rincian Biaya per Pos Pengeluaran Gathering
                  </h3>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  Perbandingan nominal realisasi pengeluaran terhadap rencana anggaran per pos kegiatan
                </div>
              </div>

              {/* Legend */}
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '6px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '3px', background: '#10b981', borderRadius: '2px' }}></span>
                  <span style={{ fontWeight: 800, color: '#34d399' }}>Realisasi Biaya (Solid)</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '2px', background: '#059669', borderTop: '2px dashed #34d399' }}></span>
                  <span style={{ fontWeight: 700, color: '#94a3b8' }}>Rencana Anggaran (Putus-putus)</span>
                </span>
              </div>
            </div>

            {/* Render Kurva SVG Line Chart Modern Executive (Bersih, Rapi & Angka Bulat Juta) */}
            {(() => {
              if (budgets.length === 0) return null;

              const width = 1000;
              const height = 300;
              const paddingLeft = 85;
              const paddingRight = 45;
              const paddingTop = 35;
              const paddingBottom = 45; // Lapang untuk pill badge nomor pos tanpa teks miring yang terpotong

              const allValues = budgets.flatMap(b => [Number(b.rencana) || 0, Number(b.realisasi) || 0]);
              const rawMax = Math.max(...allValues, 10000000);

              // Algoritma Angka Bulat Rapi untuk Sumbu Y (Nice Round Millions)
              let step = 10000000;
              if (rawMax <= 12000000) step = 3000000;
              else if (rawMax <= 20000000) step = 5000000;
              else if (rawMax <= 35000000) step = 10000000;
              else if (rawMax <= 60000000) step = 15000000;
              else if (rawMax <= 100000000) step = 25000000;
              else step = Math.ceil(rawMax / 4 / 10000000) * 10000000;

              const numSteps = Math.max(3, Math.ceil(rawMax / step));
              const maxVal = step * numSteps;

              const yTicks = [];
              for (let i = 0; i <= numSteps; i++) {
                yTicks.push(i * step);
              }

              const chartW = width - paddingLeft - paddingRight;
              const chartH = height - paddingTop - paddingBottom;

              // Hitung titik koordinat
              const ptsRealisasi = budgets.map((b, i) => {
                const x = budgets.length === 1 ? paddingLeft + chartW / 2 : paddingLeft + (i / (budgets.length - 1)) * chartW;
                const y = paddingTop + chartH - ((Number(b.realisasi) || 0) / maxVal) * chartH;
                return { x, y, ...b, index: i + 1 };
              });

              const ptsRencana = budgets.map((b, i) => {
                const x = budgets.length === 1 ? paddingLeft + chartW / 2 : paddingLeft + (i / (budgets.length - 1)) * chartW;
                const y = paddingTop + chartH - ((Number(b.rencana) || 0) / maxVal) * chartH;
                return { x, y, ...b, index: i + 1 };
              });

              // Helper Generator Kurva Halus (Catmull-Rom to Cubic Bezier Spline)
              const createSmoothCurve = (pts) => {
                if (pts.length === 0) return '';
                if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
                let path = `M ${pts[0].x} ${pts[0].y}`;
                for (let i = 0; i < pts.length - 1; i++) {
                  const p0 = pts[i === 0 ? 0 : i - 1];
                  const p1 = pts[i];
                  const p2 = pts[i + 1];
                  const p3 = pts[i + 2] || p2;
                  const cp1x = p1.x + (p2.x - p0.x) / 6;
                  const cp1y = p1.y + (p2.y - p0.y) / 6;
                  const cp2x = p2.x - (p3.x - p1.x) / 6;
                  const cp2y = p2.y - (p3.y - p1.y) / 6;
                  path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
                }
                return path;
              };

              const pathRealisasi = createSmoothCurve(ptsRealisasi);
              const pathRencana = createSmoothCurve(ptsRencana);

              const areaRealisasi = ptsRealisasi.length > 0
                ? `${pathRealisasi} L ${ptsRealisasi[ptsRealisasi.length - 1].x} ${paddingTop + chartH} L ${ptsRealisasi[0].x} ${paddingTop + chartH} Z`
                : '';

              const formatYTickLabel = (val) => {
                if (val === 0) return 'Rp 0';
                return `Rp ${(val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
              };

              const formatPointCompact = (val) => {
                if (!val) return '0';
                return `${(val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
              };

              return (
                <div style={{ width: '100%' }}>
                  <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '6px' }}>
                    <svg
                      viewBox={`0 0 ${width} ${height}`}
                      style={{
                        width: '100%',
                        minWidth: '780px',
                        height: 'auto',
                        overflow: 'visible'
                      }}
                    >
                      <defs>
                        <linearGradient id="emeraldGradientArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.38" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Horizontal Grid lines dengan Angka Bulat Juta Rapi */}
                      {yTicks.map((tickVal, gIdx) => {
                        const y = paddingTop + chartH - (tickVal / maxVal) * chartH;
                        return (
                          <g key={gIdx}>
                            <line
                              x1={paddingLeft}
                              y1={y}
                              x2={width - paddingRight}
                              y2={y}
                              stroke="rgba(255,255,255,0.06)"
                              strokeDasharray="4 4"
                            />
                            <text
                              x={paddingLeft - 12}
                              y={y + 4}
                              fill="#94a3b8"
                              fontSize="11"
                              fontWeight="700"
                              textAnchor="end"
                              fontFamily="monospace"
                            >
                              {formatYTickLabel(tickVal)}
                            </text>
                          </g>
                        );
                      })}

                      {/* Gradient Area Fill Realisasi */}
                      {areaRealisasi && <path d={areaRealisasi} fill="url(#emeraldGradientArea)" />}

                      {/* Kurva Garis Putus-putus Rencana Anggaran */}
                      <path
                        d={pathRencana}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        opacity="0.65"
                      />

                      {/* Kurva Garis Solid Realisasi Biaya */}
                      <path
                        d={pathRealisasi}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#emeraldGlow)"
                      />

                      {/* Titik Interaktif dengan Badge Nomor Pos Rapi (Tanpa Teks Terpotong) */}
                      {ptsRealisasi.map((p, idx) => {
                        const isSelected = selectedChartPoint && selectedChartPoint.id === p.id;
                        return (
                          <g
                            key={idx}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedChartPoint(p)}
                          >
                            {/* Garis vertikal penunjuk */}
                            <line
                              x1={p.x}
                              y1={p.y}
                              x2={p.x}
                              y2={paddingTop + chartH}
                              stroke={isSelected ? '#34d399' : 'rgba(16, 185, 129, 0.2)'}
                              strokeWidth={isSelected ? '2' : '1'}
                              strokeDasharray="3 3"
                            />

                            {/* Lingkaran Luar */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={isSelected ? '8' : '5.5'}
                              fill="#090d16"
                              stroke={isSelected ? '#34d399' : '#10b981'}
                              strokeWidth={isSelected ? '3.5' : '2.5'}
                            />
                            {/* Lingkaran Titik Dalam */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={isSelected ? '4' : '2.5'}
                              fill="#34d399"
                            />

                            {/* Label Angka Nominal Ringkas di Atas Titik */}
                            <g>
                              <rect
                                x={p.x - 28}
                                y={Math.max(12, p.y - 25)}
                                width={56}
                                height={18}
                                rx={9}
                                fill={isSelected ? '#10b981' : '#0f172a'}
                                stroke={isSelected ? '#34d399' : '#334155'}
                                strokeWidth="1"
                              />
                              <text
                                x={p.x}
                                y={Math.max(12, p.y - 25) + 12}
                                fill={isSelected ? '#090d16' : '#34d399'}
                                fontSize="10"
                                fontWeight="800"
                                textAnchor="middle"
                                fontFamily="monospace"
                              >
                                {formatPointCompact(p.realisasi)}
                              </text>
                            </g>

                            {/* Badge Nomor Pos Pengeluaran di Sumbu X (Bersih, Rapi & Tidak Memotong) */}
                            <rect
                              x={p.x - 17}
                              y={paddingTop + chartH + 10}
                              width={34}
                              height={20}
                              rx={6}
                              fill={isSelected ? '#10b981' : '#0f172a'}
                              stroke={isSelected ? '#34d399' : '#334155'}
                              strokeWidth="1"
                            />
                            <text
                              x={p.x}
                              y={paddingTop + chartH + 24}
                              fill={isSelected ? '#090d16' : '#cbd5e1'}
                              fontSize="10"
                              fontWeight="800"
                              textAnchor="middle"
                            >
                              #{p.index}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Grid Legenda Pos Pengeluaran Interaktif di Bawah Grafik */}
                  <div
                    style={{
                      marginTop: '12px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                      gap: '8px'
                    }}
                  >
                    {budgets.map((b, idx) => {
                      const isSelected = selectedChartPoint && selectedChartPoint.id === b.id;
                      return (
                        <div
                          key={b.id || idx}
                          onClick={() => {
                            const pt = ptsRealisasi.find(p => p.id === b.id) || b;
                            setSelectedChartPoint(pt);
                          }}
                          style={{
                            background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                            border: `1.5px solid ${isSelected ? '#10b981' : '#1e293b'}`,
                            borderRadius: '8px',
                            padding: '8px 10px',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                            <span
                              style={{
                                background: isSelected ? '#10b981' : '#1e293b',
                                color: isSelected ? '#090d16' : '#94a3b8',
                                fontWeight: 900,
                                fontSize: '0.72rem',
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              #{idx + 1}
                            </span>
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  color: isSelected ? '#34d399' : '#f8fafc',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                title={b.posPengeluaran}
                              >
                                {b.posPengeluaran}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                Realisasi: <strong style={{ color: '#34d399' }}>{formatRupiah(b.realisasi)}</strong>
                              </div>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: '0.64rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 800,
                              background: b.status === 'Lunas' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                              color: b.status === 'Lunas' ? '#34d399' : '#facc15',
                              border: `1px solid ${b.status === 'Lunas' ? '#10b981' : '#eab308'}`,
                              flexShrink: 0
                            }}
                          >
                            {b.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Highlight Card Detail Pos Pengeluaran yang Diklik pada Grafik */}
            {selectedChartPoint && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1.5px solid #10b981',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800 }}>DETAIL POS ANGGARAN TERPILIH:</div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                    {selectedChartPoint.posPengeluaran}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>
                    {selectedChartPoint.uraian}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#34d399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={13} />
                    <span>Rekening: <strong>{selectedChartPoint.namaBank}</strong> - {selectedChartPoint.noRekening} (a.n {selectedChartPoint.namaPenerima})</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Rencana Anggaran:</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>{formatRupiah(selectedChartPoint.rencana)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#34d399' }}>Realisasi Biaya:</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#34d399' }}>{formatRupiah(selectedChartPoint.realisasi)}</div>
                  </div>
                  <button
                    onClick={() => handleStatusClick(selectedChartPoint)}
                    className="btn btn-primary btn-sm"
                    style={{
                      background: selectedChartPoint.status === 'Lunas' ? 'rgba(16, 185, 129, 0.25)' : 'linear-gradient(135deg, #10b981, #059669)',
                      border: '1px solid #10b981',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {selectedChartPoint.status === 'Lunas' ? '✓ Lunas' : '💸 Proses Bayar via Finance'}
                  </button>
                  <button
                    onClick={() => setSelectedChartPoint(null)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Toolbar Sub-Modul 4: Search & Tambah Pos Anggaran */}
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
                placeholder="Cari pos biaya, no rek, bank, uraian..."
                value={searchBudget}
                onChange={(e) => setSearchBudget(e.target.value)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={filterBudgetStatus}
                onChange={(e) => setFilterBudgetStatus(e.target.value)}
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
                <option value="ALL">Semua Status Bayar</option>
                <option value="Lunas">Lunas (Sudah Cair)</option>
                <option value="Diajukan ke Finance">Diajukan ke Finance</option>
                <option value="Pending">Pending (Belum Diajukan)</option>
              </select>

              {(filterBudgetStatus !== 'ALL' || searchBudget) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchBudget('');
                    setFilterBudgetStatus('ALL');
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
                  title="Reset Filter Anggaran"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              )}

              <button
                onClick={handleOpenAddBudget}
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
                <Plus size={16} /> + Tambah Pos Anggaran Baru
              </button>
            </div>
          </div>

          {/* TABEL RINCIAN ANGGARAN GATHERING LENGKAP DENGAN REKENING & KLIK BAYAR */}
          <div className="table-container" style={{ border: '1px solid #1e293b', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b' }}>
                  <th style={{ width: '45px', padding: '10px 8px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>No.</th>
                  <th style={{ minWidth: '220px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Pos Pengeluaran & Rekening Tujuan</th>
                  <th style={{ minWidth: '220px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Uraian Kebutuhan</th>
                  <th style={{ width: '140px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Rencana Anggaran</th>
                  <th style={{ width: '140px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Realisasi Biaya</th>
                  <th style={{ width: '130px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Selisih / Varian</th>
                  <th style={{ width: '140px', padding: '10px 10px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Status (Klik Bayar)</th>
                  <th style={{ width: '90px', padding: '10px 8px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      <TrendingUp size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Belum ada rincian pos anggaran</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Klik tombol "+ Tambah Pos Anggaran Baru" untuk menginput kebutuhan dana gathering.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBudgets.map((b, idx) => {
                    const selisih = Number(b.rencana) - Number(b.realisasi);
                    return (
                      <tr
                        key={b.id || idx}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                          transition: 'background 0.15s'
                        }}
                      >
                        <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
                          {idx + 1}
                        </td>

                        {/* Pos Pengeluaran & Rekening Tujuan Bank */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.86rem' }}>{b.posPengeluaran}</div>
                          <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CreditCard size={11} />
                            <span>{b.namaBank || 'BCA'}: <strong>{b.noRekening || '-'}</strong></span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1px' }}>
                            a.n {b.namaPenerima || 'Penerima Transfer'}
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                            {b.uraian}
                          </div>
                          {b.catatan && (
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px', fontStyle: 'italic' }}>
                              Catatan: {b.catatan}
                            </div>
                          )}
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 700 }}>
                            {formatRupiah(b.rencana)}
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.86rem', color: '#34d399', fontWeight: 900 }}>
                            {formatRupiah(b.realisasi)}
                          </div>
                          {b.kwitansi && (
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Paperclip size={10} /> {b.kwitansi}
                            </div>
                          )}
                        </td>

                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: selisih >= 0 ? '#10b981' : '#ef4444' }}>
                            {selisih >= 0 ? `+${formatRupiah(selisih)}` : formatRupiah(selisih)}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: selisih >= 0 ? '#34d399' : '#f87171' }}>
                            {selisih >= 0 ? 'Efisiensi' : 'Overbudget'}
                          </div>
                        </td>

                        {/* STATUS PEMBAYARAN INTERAKTIF: TINGGAL DIKLIK LANGSUNG PROSES KE FINANCE */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleStatusClick(b)}
                            style={{
                              background: b.status === 'Lunas' ? 'rgba(16, 185, 129, 0.22)' :
                                b.status === 'Diajukan ke Finance' ? 'rgba(52, 211, 153, 0.18)' :
                                b.status === 'DP' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: b.status === 'Lunas' ? '#34d399' :
                                b.status === 'Diajukan ke Finance' ? '#10b981' :
                                b.status === 'DP' ? '#34d399' : '#f87171',
                              border: `1.5px solid ${b.status === 'Lunas' ? '#10b981' : b.status === 'Diajukan ke Finance' ? '#34d399' : b.status === 'DP' ? '#10b981' : '#ef4444'}`,
                              padding: '5px 10px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                              transition: 'all 0.15s ease'
                            }}
                            title="Klik untuk bayar / teruskan pengajuan dana ke Finance"
                          >
                            {b.status === 'Lunas' ? <CheckCircle2 size={12} /> :
                             b.status === 'Diajukan ke Finance' ? <Clock size={12} /> :
                             <DollarSign size={12} />}
                            <span>{b.status || 'Pending'}</span>
                          </button>
                          <div style={{ fontSize: '0.64rem', color: '#64748b', marginTop: '3px' }}>
                            {b.status === 'Lunas' ? '✓ Lunas Terbayar' : '👉 Klik Bayar / Finance'}
                          </div>
                        </td>

                        {/* Aksi */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
                            <button
                              onClick={() => handleOpenEditBudget(b)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 6px', fontSize: '0.72rem' }}
                              title="Edit Pos Anggaran"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteBudget(b.id, b.posPengeluaran)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                              title="Hapus Pos Anggaran"
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
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: FORM TAMBAH / EDIT JADWAL GATHERING                          */}
      {/* ===================================================================== */}
      {isScheduleModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 25px 50px rgba(0,0,0,0.95)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#10b981" />
                <span>{editingSchedule ? 'Edit Jadwal Gathering' : 'Tambah Jadwal Gathering Baru'}</span>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Acara Gathering *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Annual Family Gathering 2026 Puncak"
                  value={scheduleForm.namaAcara}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, namaAcara: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tema Acara Gathering</label>
                <input
                  type="text"
                  placeholder="Misal: Sinergi Bersama, Meraih Puncak Prestasi"
                  value={scheduleForm.tema}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, tema: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tanggal Mulai *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.tanggalMulai}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, tanggalMulai: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tanggal Selesai</label>
                  <input
                    type="date"
                    value={scheduleForm.tanggalSelesai}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, tanggalSelesai: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Lokasi Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Jambuluwuk Resort, Puncak Bogor"
                    value={scheduleForm.lokasi}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, lokasi: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Titik Kumpul (Meeting Point)</label>
                  <input
                    type="text"
                    placeholder="Misal: Head Office Bizhub"
                    value={scheduleForm.meetingPoint}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, meetingPoint: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Target Peserta</label>
                  <input
                    type="text"
                    placeholder="85 Orang"
                    value={scheduleForm.targetPeserta}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, targetPeserta: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PIC Panitia</label>
                  <input
                    type="text"
                    placeholder="Dodi Syaiful (HR)"
                    value={scheduleForm.pic}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, pic: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Status Acara</label>
                  <select
                    value={scheduleForm.status}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 700 }}
                  >
                    <option value="Mendatang">Mendatang</option>
                    <option value="Berjalan">Berjalan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Rundown Acara Singkat</label>
                <textarea
                  rows="3"
                  placeholder="Hari 1: Check-in, Fun Games...&#10;Hari 2: Outbound & Gala Dinner..."
                  value={scheduleForm.rundown}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, rundown: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Catatan Panitia / Dress Code</label>
                  <input
                    type="text"
                    placeholder="Dress code hijau tosca..."
                    value={scheduleForm.catatan}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, catatan: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>No. WhatsApp PIC Panitia</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={scheduleForm.phonePic}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, phonePic: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.82rem' }}>
                  Simpan Jadwal Acara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: FORM TAMBAH / EDIT GOALS, TUJUAN & NOTULEN (MOM)              */}
      {/* ===================================================================== */}
      {isMOMModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 25px 50px rgba(0,0,0,0.95)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="#10b981" />
                <span>{editingMOM ? 'Edit Notulen / MOM Gathering' : 'Terbitkan Notulen / MOM Gathering Baru'}</span>
              </div>
              <button onClick={() => setIsMOMModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMOM}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Acara Gathering *</label>
                  <input
                    type="text"
                    required
                    value={momForm.namaAcara}
                    onChange={(e) => setMomForm({ ...momForm, namaAcara: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tanggal Pelaksanaan *</label>
                  <input
                    type="date"
                    required
                    value={momForm.tanggal}
                    onChange={(e) => setMomForm({ ...momForm, tanggal: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Lokasi Acara / Venue *</label>
                <input
                  type="text"
                  required
                  value={momForm.lokasi}
                  onChange={(e) => setMomForm({ ...momForm, lokasi: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Goals (Target Capaian Tim / Hasil yang Diharapkan) *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Contoh: Tercapainya sinergi 100% antar divisi, penurunan hambatan komunikasi, dan komitmen target serah terima unit cluster..."
                  value={momForm.goals}
                  onChange={(e) => setMomForm({ ...momForm, goals: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tujuan Gathering (Latar Belakang & Maksud Acara) *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Contoh: Memberikan apresiasi atas pencapaian tahun berjalan dan membangun keakraban seluruh karyawan..."
                  value={momForm.tujuan}
                  onChange={(e) => setMomForm({ ...momForm, tujuan: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>MOM / Hasil / Notulen Keputusan Rapat *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="1. Poin Arahan Direksi:&#10;2. Evaluasi Mutu Lapangan:&#10;3. Rencana Tindak Lanjut:"
                  value={momForm.momHasil}
                  onChange={(e) => setMomForm({ ...momForm, momHasil: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Notulis</label>
                  <input
                    type="text"
                    value={momForm.notulis}
                    onChange={(e) => setMomForm({ ...momForm, notulis: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Pimpinan Rapat / Pengarah</label>
                  <input
                    type="text"
                    value={momForm.pimpinanRapat}
                    onChange={(e) => setMomForm({ ...momForm, pimpinanRapat: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button type="button" onClick={() => setIsMOMModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.82rem' }}>
                  Simpan Notulen MOM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2B: PRATINJAU & CETAK LEMBAR NOTULEN RESMI A4 (MOM SHEET)       */}
      {/* ===================================================================== */}
      {viewingMOMDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '820px', maxHeight: '92vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 25px 50px rgba(0,0,0,0.95)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ color: '#34d399', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#10b981" />
                <span>Dokumen Resmi: Notulen MOM - {viewingMOMDoc.namaAcara}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Printer size={14} /> Cetak / Print PDF
                </button>
                <button onClick={() => setViewingMOMDoc(null)} className="btn btn-secondary btn-sm">
                  <X size={14} /> Tutup
                </button>
              </div>
            </div>

            {/* LEMBAR KERTAS A4 NOTULEN RESMI */}
            <div style={{ background: '#ffffff', color: '#0f172a', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', fontFamily: 'Arial, sans-serif', fontSize: '0.86rem', lineHeight: 1.6 }}>
              <div style={{ textAlign: 'center', borderBottom: '2.5px solid #047857', paddingBottom: '12px', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#047857' }}>
                  PT PERSADA NUSANTARA INDONESIA
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>
                  NOTULEN RAPAT & LAPORAN HASIL GATHERING (MINUTES OF MEETING)
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  Nomor: {viewingMOMDoc.id} | Bizhub Commercial Estate Blok B-12, Gunung Sindur, Bogor
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '0.82rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, width: '180px', color: '#475569' }}>Agenda Kegiatan</td>
                    <td style={{ padding: '6px 8px', fontWeight: 800, color: '#0f172a' }}>: {viewingMOMDoc.namaAcara}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#475569' }}>Hari & Tanggal</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a' }}>: {formatDisplayDate(viewingMOMDoc.tanggal)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#475569' }}>Lokasi / Venue</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a' }}>: {viewingMOMDoc.lokasi}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#475569' }}>Pimpinan Rapat</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a' }}>: {viewingMOMDoc.pimpinanRapat}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#475569' }}>Notulis</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a' }}>: {viewingMOMDoc.notulis}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 800, color: '#047857', marginBottom: '4px' }}>I. GOALS (TARGET CAPAIAN):</div>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#1e293b' }}>{viewingMOMDoc.goals}</p>
                <div style={{ fontWeight: 800, color: '#047857', marginBottom: '4px' }}>II. TUJUAN KEGIATAN:</div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#1e293b' }}>{viewingMOMDoc.tujuan}</p>
              </div>

              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#047857', borderBottom: '1.5px solid #047857', paddingBottom: '4px', marginBottom: '8px' }}>
                III. KEPUTUSAN & NOTULEN HASIL EVALUASI (MOM)
              </div>
              <div style={{ whiteSpace: 'pre-line', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '24px', paddingLeft: '8px' }}>
                {viewingMOMDoc.momHasil}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center', marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Notulis Rapat:</div>
                  <div style={{ height: '55px' }}></div>
                  <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{viewingMOMDoc.notulis}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Divisi HR & GA</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Mengetahui & Menyetujui:</div>
                  <div style={{ height: '55px' }}></div>
                  <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{viewingMOMDoc.pimpinanRapat}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Dewan Direksi / Manajemen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: FORM UPLOAD FILE FOTO DOKUMENTASI (BUKAN URL) & CUSTOM KATEGORI */}
      {/* ===================================================================== */}
      {isDocModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 25px 50px rgba(0,0,0,0.95)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="#10b981" />
                <span>Upload Foto Dokumentasi Gathering</span>
              </div>
              <button onClick={() => setIsDocModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDoc}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Acara Gathering *</label>
                <input
                  type="text"
                  required
                  value={docForm.namaAcara}
                  onChange={(e) => setDocForm({ ...docForm, namaAcara: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              {/* AREA UPLOAD FILE FOTO LANGSUNG (BUKAN INPUT URL TEKS) */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  Upload File Foto / Gambar Kegiatan *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  style={{ display: 'none' }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #10b981',
                    borderRadius: '12px',
                    padding: '20px 16px',
                    textAlign: 'center',
                    background: 'rgba(16, 185, 129, 0.05)',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'}
                >
                  {docForm.imageUrl ? (
                    <div>
                      <img
                        src={docForm.imageUrl}
                        alt="Preview"
                        style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '8px', marginBottom: '8px', objectFit: 'contain' }}
                      />
                      <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800 }}>
                        ✓ File Foto Terpilih: {docForm.imageFileName || 'Foto Kamera/Galeri'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                        Klik di sini jika ingin mengganti file foto
                      </div>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud size={40} color="#10b981" style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc' }}>
                        Klik untuk Pilih File Foto dari Komputer
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                        Mendukung format JPG, PNG, WEBP (Langsung tersimpan & dapat diunduh)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* INPUT KATEGORI MOMEN YANG BEBAS DIKETIK */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Kategori Momen (Bebas Diketik / Pilih Cepat) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ketik kategori, misal: Fun Games, Gala Dinner, Rafting, Lomba, Pembagian Hadiah..."
                  value={docForm.kategori}
                  onChange={(e) => setDocForm({ ...docForm, kategori: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem', fontWeight: 700 }}
                />

                {/* Quick Suggestion Chips */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {['Fun Games', 'Gala Dinner', 'Outbound', 'Doorprize', 'Seremonial', 'Rafting', 'Ice Breaking', 'Foto Bersama'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setDocForm({ ...docForm, kategori: cat })}
                      style={{
                        background: docForm.kategori === cat ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${docForm.kategori === cat ? '#10b981' : '#334155'}`,
                        color: docForm.kategori === cat ? '#34d399' : '#94a3b8',
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      + {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tanggal Momen *</label>
                  <input
                    type="date"
                    required
                    value={docForm.tanggal}
                    onChange={(e) => setDocForm({
                      ...docForm,
                      tanggal: e.target.value,
                      bulanTahun: e.target.value.slice(0, 7)
                    })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Fotografer</label>
                  <input
                    type="text"
                    value={docForm.fotografer}
                    onChange={(e) => setDocForm({ ...docForm, fotografer: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Judul Foto / Momen *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Foto Bersama Direksi di Lapangan Pinus"
                  value={docForm.judul}
                  onChange={(e) => setDocForm({ ...docForm, judul: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Keterangan / Caption Momen</label>
                <textarea
                  rows="2"
                  placeholder="Ceritakan momen seru di balik foto ini..."
                  value={docForm.keterangan}
                  onChange={(e) => setDocForm({ ...docForm, keterangan: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.82rem' }}>
                  Upload & Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: FORM TAMBAH / EDIT POS ANGGARAN (NO REK & BANK DI ATAS)      */}
      {/* ===================================================================== */}
      {isBudgetModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 25px 50px rgba(0,0,0,0.95)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="#10b981" />
                <span>{editingBudget ? 'Edit Pos Anggaran Gathering' : 'Tambah Pos Anggaran Gathering Baru'}</span>
              </div>
              <button onClick={() => setIsBudgetModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBudget}>
              
              {/* BAGIAN ATAS: INFORMASI REKENING BANK & NO REK TUJUAN TRANSFER (PERSIS PERMINTAAN USER) */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1.5px solid #10b981', borderRadius: '12px', padding: '12px 14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={15} />
                  <span>REKENING TUJUAN TRANSFER (PENCAIRAN DANA OLEH FINANCE)</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Nama Bank Tujuan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="BCA / Mandiri / BRI / BSI / BNI"
                      value={budgetForm.namaBank}
                      onChange={(e) => setBudgetForm({ ...budgetForm, namaBank: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.84rem', fontWeight: 800 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Nomor Rekening Tujuan (No. Rek) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: 002-988-1234"
                      value={budgetForm.noRekening}
                      onChange={(e) => setBudgetForm({ ...budgetForm, noRekening: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.84rem', fontFamily: 'monospace', fontWeight: 800 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nama Pemilik Rekening / Penerima Transfer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: PT Jambuluwuk Sejahtera / CV Berkah Nusantara"
                    value={budgetForm.namaPenerima}
                    onChange={(e) => setBudgetForm({ ...budgetForm, namaPenerima: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* RINCIAN POS ANGGARAN & NOMINAL */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Acara Gathering *</label>
                <input
                  type="text"
                  required
                  value={budgetForm.namaAcara}
                  onChange={(e) => setBudgetForm({ ...budgetForm, namaAcara: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Pos Pengeluaran / Kategori *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Sewa Venue & Villa, Transportasi Bus, Konsumsi/Catering..."
                  value={budgetForm.posPengeluaran}
                  onChange={(e) => setBudgetForm({ ...budgetForm, posPengeluaran: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Uraian Kebutuhan *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Rincian kuantitas, spesifikasi, dan kelengkapan..."
                  value={budgetForm.uraian}
                  onChange={(e) => setBudgetForm({ ...budgetForm, uraian: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Rencana Anggaran (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 15000000"
                    value={budgetForm.rencana === 0 || budgetForm.rencana === '0' ? '' : budgetForm.rencana}
                    onFocus={(e) => {
                      if (budgetForm.rencana === 0 || budgetForm.rencana === '0' || budgetForm.rencana === '') {
                        setBudgetForm(prev => ({ ...prev, rencana: '' }));
                      } else {
                        e.target.select();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBudgetForm(prev => ({ ...prev, rencana: val }));
                    }}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 800 }}
                  />
                  {budgetForm.rencana !== '' && Number(budgetForm.rencana) > 0 && (
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px' }}>
                      {formatRupiah(Number(budgetForm.rencana))}
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                    Realisasi Pengeluaran (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 14500000"
                    value={budgetForm.realisasi === 0 || budgetForm.realisasi === '0' ? '' : budgetForm.realisasi}
                    onFocus={(e) => {
                      if (budgetForm.realisasi === 0 || budgetForm.realisasi === '0' || budgetForm.realisasi === '') {
                        setBudgetForm(prev => ({ ...prev, realisasi: '' }));
                      } else {
                        e.target.select();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBudgetForm(prev => ({ ...prev, realisasi: val }));
                    }}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 800 }}
                  />
                  {budgetForm.realisasi !== '' && Number(budgetForm.realisasi) > 0 && (
                    <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '3px' }}>
                      {formatRupiah(Number(budgetForm.realisasi))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Status Pembayaran</label>
                  <select
                    value={budgetForm.status}
                    onChange={(e) => setBudgetForm({ ...budgetForm, status: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 700 }}
                  >
                    <option value="Pending">Pending (Belum Dibayar)</option>
                    <option value="Diajukan ke Finance">Diajukan ke Finance</option>
                    <option value="DP">DP (Uang Muka)</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>No. Kwitansi / Nota</label>
                  <input
                    type="text"
                    placeholder="KW-19281.pdf"
                    value={budgetForm.kwitansi}
                    onChange={(e) => setBudgetForm({ ...budgetForm, kwitansi: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Catatan Khusus</label>
                <input
                  type="text"
                  placeholder="Diskon grup korporat, garansi, dll."
                  value={budgetForm.catatan}
                  onChange={(e) => setBudgetForm({ ...budgetForm, catatan: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button type="button" onClick={() => setIsBudgetModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.82rem' }}>
                  Simpan Pos Anggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: KONFIRMASI BAYAR / KIRIM PENGAJUAN DANA KE FINANCE            */}
      {/* ===================================================================== */}
      {selectedBudgetForPayment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '1.6rem', boxShadow: '0 25px 50px rgba(0,0,0,0.95)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="#10b981" />
                <span>Proses Pembayaran Anggaran Gathering</span>
              </div>
              <button onClick={() => setSelectedBudgetForPayment(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>POS PENGELUARAN:</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                {selectedBudgetForPayment.posPengeluaran}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '3px' }}>
                {selectedBudgetForPayment.uraian}
              </div>

              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Nominal Dibutuhkan:</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#34d399' }}>
                    {formatRupiah(selectedBudgetForPayment.realisasi || selectedBudgetForPayment.rencana)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Rekening Tujuan:</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                    {selectedBudgetForPayment.namaBank || 'BCA'} - {selectedBudgetForPayment.noRekening || '-'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    a.n {selectedBudgetForPayment.namaPenerima || 'Vendor'}
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1.2rem 0' }}>
              Pilih tindakan di bawah ini. Anda dapat <strong>mengirimkan pengajuan dana otomatis ke modul Finance & Accounting</strong> agar diproses pencairan dananya, atau langsung <strong>menandai Lunas secara manual</strong> jika telah dibayar.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Opsi 1: Kirim Otomatis ke Finance */}
              <button
                type="button"
                onClick={handleConfirmSendToFinance}
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Send size={15} /> Kirim Pengajuan Otomatis ke Finance & Accounting
              </button>

              {/* Opsi 2: Tandai Lunas Manual */}
              <button
                type="button"
                onClick={handleMarkAsPaidManual}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.8rem',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={15} color="#34d399" /> Tandai Lunas Secara Manual
              </button>

              <button
                type="button"
                onClick={() => setSelectedBudgetForPayment(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  padding: '6px',
                  marginTop: '4px'
                }}
              >
                Batal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
