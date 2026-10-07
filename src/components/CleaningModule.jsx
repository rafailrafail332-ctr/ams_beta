import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { fetchCloudStore, saveCloudStore } from '../supabase';
import {
  Sparkles,
  Droplets,
  Trees,
  Truck,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Clock,
  Calendar,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  RotateCcw,
  Printer,
  Download,
  Phone,
  PhoneCall,
  FileText,
  UploadCloud,
  Check,
  Briefcase,
  User,
  Radio,
  ArrowRight,
  Lock,
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Image as ImageIcon,
  CheckSquare,
  Scissors,
  Shovel,
  Wind
} from 'lucide-react';

// =============================================================================
// STORAGE KEYS & HELPER SVG PHOTO GENERATOR
// =============================================================================
const STORAGE_CLEANING_CHECKLISTS_KEY = 'ams_hr_cleaning_checklists_v3';
const STORAGE_CLEANING_GARDENS_KEY = 'ams_hr_cleaning_gardens_v3';
const STORAGE_CLEANING_WASTES_KEY = 'ams_hr_cleaning_wastes_v3';
const STORAGE_CLEANING_PESTS_KEY = 'ams_hr_cleaning_pests_v3';

// Helper membuat foto SVG beresolusi tinggi untuk demo dan pratinjau instan
const makeSvgPhoto = (title, subtitle, accent = '#10b981') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#bg)"/>
    <rect x="24" y="24" width="752" height="452" rx="16" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>
    <circle cx="400" cy="180" r="54" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-width="2"/>
    <path d="M375 180h50M400 155v50" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    <text x="400" y="280" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="#f8fafc" text-anchor="middle">${title}</text>
    <text x="400" y="318" font-family="system-ui, sans-serif" font-size="15" fill="#94a3b8" text-anchor="middle">${subtitle}</text>
    <rect x="240" y="360" width="320" height="36" rx="18" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1"/>
    <text x="400" y="383" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="${accent}" text-anchor="middle">AMS ESTATE SANITATION VERIFIED</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// =============================================================================
// SEED DATA 4 SUB-MODUL LENGKAP DENGAN MULTI-FOTO
// =============================================================================
// 1. SEED CHECKLIST KEBERSIHAN KANTOR & FASILITAS
const INITIAL_CHECKLISTS = [
  {
    id: 'CLN-2026-001',
    noDok: 'CLN/AMS-OPS/2026/1006-01',
    tanggal: '2026-10-06',
    sesi: 'Sesi Pagi (07:30 WIB)',
    proyek: 'Ashoka Park',
    area: 'Marketing Gallery & Toilet Tamu',
    petugas: 'Suparman (OB)',
    pengawas: 'Fajar (Koordinator GA)',
    itemPemeriksaan: 'Lantai sapu & pel wangi, Meja display bebas debu, Kaca pintu steril, Tisu & sabun refill',
    kondisi: 'Sangat Bersih & Harum',
    catatan: 'Area lobby dan ruang deal konsumen siap digunakan. Pengharum otomatis lemon menyala normal.',
    status: 'Terverifikasi QC',
    photos: [
      {
        name: 'Lobby_Marketing_Gallery.jpg',
        caption: 'Kondisi Ruang Tamu & Meja Negosiasi Bersih Siap Sambut Tamu',
        url: makeSvgPhoto('Lobby Marketing Gallery', 'Selesai Sapu & Pel Wangi Aromaterapi', '#10b981')
      },
      {
        name: 'Toilet_Tamu_Konsumen.jpg',
        caption: 'Toilet Tamu Bersih, Kering, Tisu & Sabun Cuci Tangan Lengkap',
        url: makeSvgPhoto('Toilet Tamu & Washtafel', 'Kloset Steril, Bebas Bau & Tisu Refill', '#38bdf8')
      }
    ]
  },
  {
    id: 'CLN-2026-002',
    noDok: 'CLN/AMS-OPS/2026/1006-02',
    tanggal: '2026-10-06',
    sesi: 'Sesi Pagi (07:45 WIB)',
    proyek: 'Head Office Bizhub',
    area: 'Ruang Kerja Direksi & Lantai 2',
    petugas: 'Dedi Gunawan',
    pengawas: 'Dodi Syaiful Nugroho',
    itemPemeriksaan: 'Meja kerja bersih, Tong sampah dikosongkan, Karpet divakum, Kaca jendela bening',
    kondisi: 'Bersih & Rapi',
    catatan: 'Pantry lantai 2 telah dilengkapi air mineral galon baru dan kopi/teh tersusun rapi.',
    status: 'Terverifikasi QC',
    photos: [
      {
        name: 'Ruang_Rapat_Direksi.jpg',
        caption: 'Ruang Kerja & Meja Rapat Direksi Bersih dan Rapi',
        url: makeSvgPhoto('Ruang Kerja Direksi', 'Head Office Bizhub Lantai 2', '#10b981')
      }
    ]
  },
  {
    id: 'CLN-2026-003',
    noDok: 'CLN/AMS-OPS/2026/1006-03',
    tanggal: '2026-10-06',
    sesi: 'Sesi Sore (16:30 WIB)',
    proyek: 'Ashoka View',
    area: 'Pos Jaga & Kantor Lapangan View',
    petugas: 'Siti Khadijah',
    pengawas: 'Supardi (Danru)',
    itemPemeriksaan: 'Pel lantai teras depan, Pembuangan kantong sampah harian, Cek wastafel luar',
    kondisi: 'Selesai Dibersihkan',
    catatan: 'Selesai pembersihan sore setelah aktivitas mandor proyek. Pintu kantor lapangan dikunci.',
    status: 'Selesai Bersih',
    photos: [
      {
        name: 'Kantor_Lapangan_View.jpg',
        caption: 'Pembersihan Sore Kantor Lapangan & Pos View',
        url: makeSvgPhoto('Kantor Lapangan View', 'Selesai Pel Sore & Pembuangan Sampah', '#fbbf24')
      }
    ]
  }
];

// 2. SEED PERAWATAN TAMAN & BOULEVARD KAWASAN
const INITIAL_GARDENS = [
  {
    id: 'GRD-2026-001',
    noDok: 'GRD/AMS-LND/2026/1006-01',
    tanggal: '2026-10-06',
    jamPengerjaan: '08:00 - 11:30 WIB',
    proyek: 'Ashoka Park',
    lokasiTaman: 'Boulevard Gerbang Utama & Bundaran Depan',
    jenisPekerjaan: 'Potong Rumput Gajah Mini, Babat Semak & Siram Tanaman',
    gardener: 'Maman (Landscape Lead) & Joko',
    peralatan: 'Mesin Babat Rumput 2 Unit, Selang Siram 50m, Gunting Ranting',
    kondisiSaluran: 'Saluran Drainase Boulevard Bersih & Lancar',
    catatan: 'Rumput dirapikan rata setinggi 3 cm. Bunga bougenville & palem siram pupuk NPK cair.',
    status: 'Selesai Rapi',
    photos: [
      {
        name: 'Potong_Rumput_Boulevard.jpg',
        caption: 'Pekerjaan Pemotongan Rumput Boulevard Depan Gerbang Ashoka Park',
        url: makeSvgPhoto('Pemotongan Rumput Boulevard', 'Maman Landscape & Tim Kebersihan', '#10b981')
      },
      {
        name: 'Penyiraman_Taman_Bundaran.jpg',
        caption: 'Penyiraman Tanaman Hias & Pohon Palem Bundaran Utama',
        url: makeSvgPhoto('Penyiraman Bundaran Utama', 'Penyiraman Air & Pupuk Bunga', '#38bdf8')
      }
    ]
  },
  {
    id: 'GRD-2026-002',
    noDok: 'GRD/AMS-LND/2026/1005-02',
    tanggal: '2026-10-05',
    jamPengerjaan: '13:30 - 16:00 WIB',
    proyek: 'Ashoka Park',
    lokasiTaman: 'Taman Depan Rumah Contoh Tipe 36 & 45',
    jenisPekerjaan: 'Pembersihan Daun Gugur, Cabut Gulma & Penataan Pot Bunga',
    gardener: 'Joko & Slamet',
    peralatan: 'Sapu Lidi, Pengki, Gunting Rumput Manual',
    kondisiSaluran: 'Got Depan Rumah Contoh Bebas Lumut',
    catatan: 'Paving blok disikat dari noda tanah merah agar unit contoh tampak estetis bagi calon pembeli.',
    status: 'Selesai Rapi',
    photos: [
      {
        name: 'Taman_Rumah_Contoh.jpg',
        caption: 'Taman Depan Rumah Contoh Bersih dan Rapi',
        url: makeSvgPhoto('Taman Mockup Rumah Contoh', 'Paving Blok Bersih & Bebas Gulma', '#10b981')
      }
    ]
  },
  {
    id: 'GRD-2026-003',
    noDok: 'GRD/AMS-LND/2026/1006-03',
    tanggal: '2026-10-06',
    jamPengerjaan: '10:00 - 12:00 WIB',
    proyek: 'Ashoka View',
    lokasiTaman: 'Lereng Tebing Hijau Blok Atas & Pagar Pembatas',
    jenisPekerjaan: 'Babat Ilalang Liar & Perapihan Tanaman Vertiver Pencegah Erosi',
    gardener: 'Maman & Regu Kebersihan',
    peralatan: 'Mesin Potong Rumput Gendong, Sabit',
    kondisiSaluran: 'Talang Air Aliran Lereng Bersih',
    catatan: 'Area semak belakang blok 15-20 dibersihkan agar tidak menjadi sarang ular atau hewan liar.',
    status: 'Sedang Pengerjaan',
    photos: [
      {
        name: 'Babat_Semak_Lereng.jpg',
        caption: 'Pembersihan Semak Ilalang di Lereng Kawasan Ashoka View',
        url: makeSvgPhoto('Babat Semak Lereng View', 'Pengendalian Gulma & Saluran Lereng', '#fbbf24')
      }
    ]
  }
];

// 3. SEED RITASE PENGANGKUTAN SAMPAH & TPS KAWASAN
const INITIAL_WASTES = [
  {
    id: 'WST-2026-001',
    noDok: 'WST/AMS-TPS/2026/1006-01',
    tanggal: '2026-10-06',
    jamAngkut: '09:45 WIB',
    proyek: 'Ashoka Park',
    lokasiTPS: 'TPS Kawasan Belakang Samping Blok B',
    vendorTruk: 'DLH UPT Kebersihan Parung / Truk Kuning',
    noPlat: 'F 8391 FB (Dump Truk DLH)',
    namaSupir: 'Pak Endang (DLH)',
    estimasiVolume: '6 m³ (1 Bak Dump Truk Penuh)',
    kondisiTpsAkhir: 'TPS Bersih, Disapu & Disemprot Disinfektan EM4',
    tandaTerima: 'TT-DLH-PARUNG/2026/X-102',
    petugasPendamping: 'Suparman & Fajar GA',
    catatan: 'Seluruh sampah domestik kantor dan residu dedaunan taman terangkut tuntas. Area disemprot anti bau.',
    status: 'Selesai Diangkut & Bersih',
    photos: [
      {
        name: 'Truk_Sampah_DLH_Tiba.jpg',
        caption: 'Armada Dump Truk DLH F 8391 FB Melakukan Pemuatan Sampah di TPS',
        url: makeSvgPhoto('Pengangkutan Sampah DLH', 'Dump Truk Kuning F 8391 FB', '#fbbf24')
      },
      {
        name: 'TPS_Bersih_Setelah_Angkut.jpg',
        caption: 'Kondisi Lantai TPS Bersih & Kering Selesai Pengangkutan',
        url: makeSvgPhoto('Kondisi TPS Pasca Angkut', 'Lantai Bersih Disemprot Disinfektan', '#10b981')
      }
    ]
  },
  {
    id: 'WST-2026-002',
    noDok: 'WST/AMS-TPS/2026/1004-02',
    tanggal: '2026-10-04',
    jamAngkut: '10:15 WIB',
    proyek: 'Ashoka Park',
    lokasiTPS: 'TPS Kawasan Belakang Samping Blok B',
    vendorTruk: 'DLH UPT Kebersihan Parung',
    noPlat: 'F 8102 FB',
    namaSupir: 'Pak Nana',
    estimasiVolume: '5.5 m³',
    kondisiTpsAkhir: 'Bersih & Rapi Terkunci',
    tandaTerima: 'TT-DLH-PARUNG/2026/X-088',
    petugasPendamping: 'Suparman',
    catatan: 'Pengangkutan rutin dua hari sekali berjalan lancar tepat waktu.',
    status: 'Selesai Diangkut & Bersih',
    photos: [
      {
        name: 'Bukti_Tanda_Terima_DLH.jpg',
        caption: 'Lembar Tanda Terima Ritase Angkut Sampah DLH Kabupaten Bogor',
        url: makeSvgPhoto('Tanda Terima DLH', 'Retribusi Sampah Kawasan Ashoka Park', '#10b981')
      }
    ]
  },
  {
    id: 'WST-2026-003',
    noDok: 'WST/AMS-TPS/2026/1006-03',
    tanggal: '2026-10-06',
    jamAngkut: '14:00 WIB',
    proyek: 'Ashoka View',
    lokasiTPS: 'Bak Kontainer Sampah Gerbang Bawah View',
    vendorTruk: 'Mitra Pengangkut Swasta Ciseeng',
    noPlat: 'B 9201 PDA (Colt Diesel Bak Terpal)',
    namaSupir: 'Rahmat Sutisna',
    estimasiVolume: '4 m³',
    kondisiTpsAkhir: 'Dalam Proses Pemuatan',
    tandaTerima: 'SWT-CSG-2026/410',
    petugasPendamping: 'Dedi Gunawan',
    catatan: 'Pengambilan sampah potongan bambu & sisa pembungkus semen proyek.',
    status: 'Sedang Dimuat',
    photos: [
      {
        name: 'Pemuatan_Sampah_View.jpg',
        caption: 'Proses Pemuatan Sampah Proyek ke Armada Pengangkut',
        url: makeSvgPhoto('Pemuatan Sampah Kawasan View', 'Armada Colt Diesel B 9201 PDA', '#fbbf24')
      }
    ]
  }
];

// 4. SEED PENGENDALIAN HAMA, FOGGING DBD & SANITASI KHUSUS
const INITIAL_PESTS = [
  {
    id: 'PST-2026-001',
    noDok: 'PST/AMS-SAN/2026/1005-01',
    tanggal: '2026-10-05',
    jamPelaksanaan: '16:00 - 18:00 WIB',
    proyek: 'Ashoka Park',
    jenisTreatment: 'Fogging Pengasapan Nyamuk DBD (Thermal Fogging)',
    areaCakupan: 'Seluruh Saluran Drainase Blok A & B, Taman Depan, dan Void Rumah Contoh',
    bahanKimia: 'Insektisida Cynoff 50 EC + Solar Murni (Dosis Standar Kemenkes)',
    pelaksana: 'Tim GA Internal AMS & Mandor Subur',
    petugasSafety: 'Hartono (Danru Satpam - Evakuasi & Notifikasi Kawasan)',
    kondisiCuaca: 'Cerah Berawan, Angin Tenang (Kondisi Ideal Fogging)',
    catatan: 'Seluruh pekerja dan staf dievakuasi 45 menit sebelum pengasapan. Jentik nyamuk got terbasmi tuntas.',
    status: 'Selesai Tuntas',
    photos: [
      {
        name: 'Foto_Pelaksanaan_Fogging_Got.jpg',
        caption: 'Pengasapan Thermal Fogging di Saluran Drainase Tertutup Blok A',
        url: makeSvgPhoto('Thermal Fogging Nyamuk DBD', 'Cynoff 50 EC - Saluran Drainase Kavling', '#38bdf8')
      },
      {
        name: 'Foto_Petugas_APD_Fogging.jpg',
        caption: 'Petugas Menggunakan Masker Respirator Gas & Kacamata Pelindung',
        url: makeSvgPhoto('Petugas Fogging Ber-APD Lengkap', 'Standar Keselamatan Kerja GA & Security', '#10b981')
      }
    ]
  },
  {
    id: 'PST-2026-002',
    noDok: 'PST/AMS-SAN/2026/0928-02',
    tanggal: '2026-09-28',
    jamPelaksanaan: '09:00 - 12:00 WIB',
    proyek: 'Ashoka Park',
    jenisTreatment: 'Injeksi Anti Rayap (Termite Barrier Protection)',
    areaCakupan: 'Pondasi Keliling Marketing Gallery & Rangka Atap Kayu Gudang',
    bahanKimia: 'Bahan Aktif Imidakloprid 200 SL (Ramah Lingkungan)',
    pelaksana: 'PT Rentokil Initial Indonesia (Vendor Spesialis)',
    petugasSafety: 'Fajar (Logistik GA)',
    kondisiCuaca: 'Cerah',
    catatan: 'Garansi proteksi rayap 3 tahun diterbitkan vendor resmi dengan sertifikat tertaut.',
    status: 'Selesai Tuntas',
    photos: [
      {
        name: 'Injeksi_Anti_Rayap.jpg',
        caption: 'Pengeboran Injeksi Barrier Anti Rayap di Sekeliling Lantai Kantor',
        url: makeSvgPhoto('Injeksi Anti Rayap Bangunan', 'Perlindungan Struktur Marketing Gallery', '#10b981')
      }
    ]
  },
  {
    id: 'PST-2026-003',
    noDok: 'PST/AMS-SAN/2026/1006-03',
    tanggal: '2026-10-06',
    jamPelaksanaan: '16:30 - 18:00 WIB',
    proyek: 'Ashoka View',
    jenisTreatment: 'Penyemprotan Disinfektan & Fogging DBD Berkala',
    areaCakupan: 'Kavling Blok C, Mess Pekerja Lapangan & Kantor View',
    bahanKimia: 'Malathion 96% + Solar',
    pelaksana: 'Tim GA Internal Lapangan',
    petugasSafety: 'Supardi (Danru Satpam)',
    kondisiCuaca: 'Cerah Menjelang Senja',
    catatan: 'Persiapan alat fogger pulse-jet dan solar siap di pos jaga, dijadwalkan sore ini.',
    status: 'Terjadwal',
    photos: [
      {
        name: 'Persiapan_Alat_Fogging.jpg',
        caption: 'Persiapan Tabung Mesin Fogger & Bahan Baku di Pos Jaga View',
        url: makeSvgPhoto('Alat Fogger Siap Pakai', 'Persiapan Treatment Sore Kawasan View', '#fbbf24')
      }
    ]
  }
];

export const CleaningModule = ({
  currentUser,
  showNotification,
  onSwitchTab,
  employees
}) => {
  // ---------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Sub-tabs: 'checklist-kantor' | 'kebersihan-taman' | 'angkut-sampah' | 'fogging-pest'
  const [activeSubTab, setActiveSubTab] = useState('checklist-kantor');

  // Stores
  const [checklists, setChecklists] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_CLEANING_CHECKLISTS_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_CHECKLISTS;
  });

  const [gardens, setGardens] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_CLEANING_GARDENS_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_GARDENS;
  });

  const [wasteLogs, setWasteLogs] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_CLEANING_WASTES_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_WASTES;
  });

  const [pestControls, setPestControls] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_CLEANING_PESTS_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_PESTS;
  });

  // Initial fetch from MySQL Database on Sengked Hosting
  useEffect(() => {
    fetchCloudStore(STORAGE_CLEANING_CHECKLISTS_KEY, null).then(val => {
      if (val && Array.isArray(val) && val.length > 0) setChecklists(val);
    });
    fetchCloudStore(STORAGE_CLEANING_GARDENS_KEY, null).then(val => {
      if (val && Array.isArray(val) && val.length > 0) setGardens(val);
    });
    fetchCloudStore(STORAGE_CLEANING_WASTES_KEY, null).then(val => {
      if (val && Array.isArray(val) && val.length > 0) setWasteLogs(val);
    });
    fetchCloudStore(STORAGE_CLEANING_PESTS_KEY, null).then(val => {
      if (val && Array.isArray(val) && val.length > 0) setPestControls(val);
    });
  }, []);

  // Save changes to localStorage & MySQL Database
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLEANING_CHECKLISTS_KEY, JSON.stringify(checklists));
    } catch {}
    saveCloudStore(STORAGE_CLEANING_CHECKLISTS_KEY, checklists);
  }, [checklists]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLEANING_GARDENS_KEY, JSON.stringify(gardens));
    } catch {}
    saveCloudStore(STORAGE_CLEANING_GARDENS_KEY, gardens);
  }, [gardens]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLEANING_WASTES_KEY, JSON.stringify(wasteLogs));
    } catch {}
    saveCloudStore(STORAGE_CLEANING_WASTES_KEY, wasteLogs);
  }, [wasteLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLEANING_PESTS_KEY, JSON.stringify(pestControls));
    } catch {}
    saveCloudStore(STORAGE_CLEANING_PESTS_KEY, pestControls);
  }, [pestControls]);

  // Filter States
  const todayStr = new Date().toISOString().split('T')[0];
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [projectFilter, setProjectFilter] = useState('ALL');

  // Modals Form
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isGardenModalOpen, setIsGardenModalOpen] = useState(false);
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [isPestModalOpen, setIsPestModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Modal Gallery Photo Slider (Carousel)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Modal Detail View
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [detailType, setDetailType] = useState('checklist'); // 'checklist', 'garden', 'waste', 'pest'

  // Ref Input File Upload untuk masing-masing form
  const checklistFileRef = useRef(null);
  const gardenFileRef = useRef(null);
  const wasteFileRef = useRef(null);
  const pestFileRef = useRef(null);

  // Form States
  const [checklistForm, setChecklistForm] = useState({
    tanggal: todayStr,
    sesi: 'Sesi Pagi (07:30 WIB)',
    proyek: 'Ashoka Park',
    area: 'Marketing Gallery & Toilet Tamu',
    petugas: 'Suparman (OB)',
    pengawas: 'Fajar (Koordinator GA)',
    itemPemeriksaan: 'Lantai sapu & pel wangi, Meja display bersih, Tong sampah kosong, Sabun & tisu lengkap',
    kondisi: 'Sangat Bersih & Harum',
    catatan: '',
    status: 'Terverifikasi QC',
    photos: []
  });

  const [gardenForm, setGardenForm] = useState({
    tanggal: todayStr,
    jamPengerjaan: '08:00 - 11:30 WIB',
    proyek: 'Ashoka Park',
    lokasiTaman: 'Boulevard Gerbang Utama & Bundaran',
    jenisPekerjaan: 'Potong Rumput Gajah Mini & Siram Tanaman',
    gardener: 'Maman (Landscape Lead) & Joko',
    peralatan: 'Mesin Babat Rumput 2 Unit, Selang Siram 50m, Gunting Ranting',
    kondisiSaluran: 'Saluran Drainase Boulevard Bersih & Lancar',
    catatan: '',
    status: 'Selesai Rapi',
    photos: []
  });

  const [wasteForm, setWasteForm] = useState({
    tanggal: todayStr,
    jamAngkut: '09:30 WIB',
    proyek: 'Ashoka Park',
    lokasiTPS: 'TPS Kawasan Belakang Samping Blok B',
    vendorTruk: 'DLH UPT Kebersihan Parung / Truk Kuning',
    noPlat: '',
    namaSupir: 'Pak Endang (DLH)',
    estimasiVolume: '6 m³ (1 Bak Dump Truk)',
    kondisiTpsAkhir: 'TPS Bersih, Disapu & Disemprot Disinfektan EM4',
    tandaTerima: '',
    petugasPendamping: 'Suparman & Fajar GA',
    status: 'Selesai Diangkut & Bersih',
    catatan: '',
    photos: []
  });

  const [pestForm, setPestForm] = useState({
    tanggal: todayStr,
    jamPelaksanaan: '16:00 - 18:00 WIB',
    proyek: 'Ashoka Park',
    jenisTreatment: 'Fogging Pengasapan Nyamuk DBD (Thermal Fogging)',
    areaCakupan: 'Seluruh Saluran Drainase Blok A & B, Void Rumah Contoh',
    bahanKimia: 'Insektisida Cynoff 50 EC + Solar Murni',
    pelaksana: 'Tim GA Internal AMS & Mandor Subur',
    petugasSafety: 'Hartono (Danru Satpam)',
    kondisiCuaca: 'Cerah Berawan, Angin Tenang',
    status: 'Selesai Tuntas',
    catatan: '',
    photos: []
  });

  // Helper Format Tanggal
  const formatDisplayDate = (dStr) => {
    if (!dStr) return '-';
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return dStr;
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dStr;
    }
  };

  const normalizeDate = (dVal) => {
    if (!dVal) return '';
    if (typeof dVal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dVal)) return dVal;
    try {
      const d = new Date(dVal);
      if (isNaN(d.getTime())) return String(dVal);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch {
      return String(dVal);
    }
  };

  // Keyboard Navigation untuk Photo Gallery Slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGalleryOpen || galleryPhotos.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : galleryPhotos.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIdx(prev => (prev < galleryPhotos.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setIsGalleryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, galleryPhotos]);

  // ---------------------------------------------------------------------------
  // 2. FILTERED DATASETS
  // ---------------------------------------------------------------------------
  const filteredChecklists = useMemo(() => {
    return checklists.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.noDok && item.noDok.toLowerCase().includes(q)) ||
        (item.area && item.area.toLowerCase().includes(q)) ||
        (item.petugas && item.petugas.toLowerCase().includes(q)) ||
        (item.pengawas && item.pengawas.toLowerCase().includes(q));

      const itemDate = normalizeDate(item.tanggal);
      let matchDate = true;
      if (startDate && itemDate < startDate) matchDate = false;
      if (endDate && itemDate > endDate) matchDate = false;

      let matchProject = true;
      if (projectFilter !== 'ALL') {
        const p = (item.proyek || '').toLowerCase();
        if (projectFilter === 'PARK' && !p.includes('park')) matchProject = false;
        if (projectFilter === 'VIEW' && !p.includes('view')) matchProject = false;
        if (projectFilter === 'HO' && !p.includes('bizhub') && !p.includes('head office')) matchProject = false;
      }

      return matchSearch && matchDate && matchProject;
    });
  }, [checklists, searchTerm, startDate, endDate, projectFilter]);

  const filteredGardens = useMemo(() => {
    return gardens.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.noDok && item.noDok.toLowerCase().includes(q)) ||
        (item.lokasiTaman && item.lokasiTaman.toLowerCase().includes(q)) ||
        (item.gardener && item.gardener.toLowerCase().includes(q)) ||
        (item.jenisPekerjaan && item.jenisPekerjaan.toLowerCase().includes(q));

      const itemDate = normalizeDate(item.tanggal);
      let matchDate = true;
      if (startDate && itemDate < startDate) matchDate = false;
      if (endDate && itemDate > endDate) matchDate = false;

      let matchProject = true;
      if (projectFilter !== 'ALL') {
        const p = (item.proyek || '').toLowerCase();
        if (projectFilter === 'PARK' && !p.includes('park')) matchProject = false;
        if (projectFilter === 'VIEW' && !p.includes('view')) matchProject = false;
        if (projectFilter === 'HO' && !p.includes('bizhub') && !p.includes('head office')) matchProject = false;
      }

      return matchSearch && matchDate && matchProject;
    });
  }, [gardens, searchTerm, startDate, endDate, projectFilter]);

  const filteredWastes = useMemo(() => {
    return wasteLogs.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.noDok && item.noDok.toLowerCase().includes(q)) ||
        (item.vendorTruk && item.vendorTruk.toLowerCase().includes(q)) ||
        (item.noPlat && item.noPlat.toLowerCase().includes(q)) ||
        (item.lokasiTPS && item.lokasiTPS.toLowerCase().includes(q)) ||
        (item.tandaTerima && item.tandaTerima.toLowerCase().includes(q));

      const itemDate = normalizeDate(item.tanggal);
      let matchDate = true;
      if (startDate && itemDate < startDate) matchDate = false;
      if (endDate && itemDate > endDate) matchDate = false;

      let matchProject = true;
      if (projectFilter !== 'ALL') {
        const p = (item.proyek || '').toLowerCase();
        if (projectFilter === 'PARK' && !p.includes('park')) matchProject = false;
        if (projectFilter === 'VIEW' && !p.includes('view')) matchProject = false;
        if (projectFilter === 'HO' && !p.includes('bizhub') && !p.includes('head office')) matchProject = false;
      }

      return matchSearch && matchDate && matchProject;
    });
  }, [wasteLogs, searchTerm, startDate, endDate, projectFilter]);

  const filteredPests = useMemo(() => {
    return pestControls.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.noDok && item.noDok.toLowerCase().includes(q)) ||
        (item.jenisTreatment && item.jenisTreatment.toLowerCase().includes(q)) ||
        (item.areaCakupan && item.areaCakupan.toLowerCase().includes(q)) ||
        (item.pelaksana && item.pelaksana.toLowerCase().includes(q)) ||
        (item.bahanKimia && item.bahanKimia.toLowerCase().includes(q));

      const itemDate = normalizeDate(item.tanggal);
      let matchDate = true;
      if (startDate && itemDate < startDate) matchDate = false;
      if (endDate && itemDate > endDate) matchDate = false;

      let matchProject = true;
      if (projectFilter !== 'ALL') {
        const p = (item.proyek || '').toLowerCase();
        if (projectFilter === 'PARK' && !p.includes('park')) matchProject = false;
        if (projectFilter === 'VIEW' && !p.includes('view')) matchProject = false;
        if (projectFilter === 'HO' && !p.includes('bizhub') && !p.includes('head office')) matchProject = false;
      }

      return matchSearch && matchDate && matchProject;
    });
  }, [pestControls, searchTerm, startDate, endDate, projectFilter]);

  // Top KPI Stats
  const metrics = useMemo(() => {
    const totalChecklists = checklists.length;
    const verifiedChecklists = checklists.filter(c => c.status === 'Terverifikasi QC').length;
    const totalGardens = gardens.length;
    const totalWastes = wasteLogs.length;
    const totalPests = pestControls.length;

    return {
      totalChecklists,
      verifiedChecklists,
      totalGardens,
      totalWastes,
      totalPests
    };
  }, [checklists, gardens, wasteLogs, pestControls]);

  // ---------------------------------------------------------------------------
  // 3. ACTION HANDLERS & STATUS TOGGLES
  // ---------------------------------------------------------------------------
  const handleResetFilter = () => {
    setSearchTerm('');
    setStartDate('2026-10-01');
    setEndDate('2026-10-31');
    setProjectFilter('ALL');
    showNotification && showNotification('Filter tanggal dan kriteria kebersihan telah di-reset.', 'info');
  };

  // Buka Galeri Slider
  const openGallery = (photos, title) => {
    if (!photos || photos.length === 0) {
      showNotification && showNotification('Belum ada foto dokumentasi yang diunggah untuk data ini.', 'info');
      return;
    }
    setGalleryPhotos(photos);
    setGalleryTitle(title || 'Dokumentasi Kebersihan Kawasan');
    setActivePhotoIdx(0);
    setIsGalleryOpen(true);
  };

  // Buka Detail Lengkap
  const openDetail = (item, type) => {
    setDetailItem(item);
    setDetailType(type);
    setIsDetailModalOpen(true);
  };

  // Toggle Status Cepat (Checklist Kantor)
  const toggleChecklistStatus = (id) => {
    setChecklists(prev =>
      prev.map(c => {
        if (c.id === id) {
          let nextStatus = 'Terverifikasi QC';
          if (c.status === 'Terverifikasi QC') nextStatus = 'Sedang Dibersihkan';
          else if (c.status === 'Sedang Dibersihkan') nextStatus = 'Selesai Bersih';
          showNotification && showNotification(`Status checklist kebersihan diubah menjadi: ${nextStatus}`, 'success');
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  // Toggle Status Cepat (Taman & Boulevard)
  const toggleGardenStatus = (id) => {
    setGardens(prev =>
      prev.map(g => {
        if (g.id === id) {
          const nextStatus = g.status === 'Selesai Rapi' ? 'Sedang Pengerjaan' : 'Selesai Rapi';
          showNotification && showNotification(`Status perawatan taman diubah menjadi: ${nextStatus}`, 'success');
          return { ...g, status: nextStatus };
        }
        return g;
      })
    );
  };

  // Toggle Status Cepat (Pengangkutan Sampah)
  const toggleWasteStatus = (id) => {
    setWasteLogs(prev =>
      prev.map(w => {
        if (w.id === id) {
          const nextStatus = w.status === 'Selesai Diangkut & Bersih' ? 'Sedang Dimuat' : 'Selesai Diangkut & Bersih';
          showNotification && showNotification(`Status TPS pengangkutan sampah diubah menjadi: ${nextStatus}`, 'success');
          return { ...w, status: nextStatus };
        }
        return w;
      })
    );
  };

  // Toggle Status Cepat (Fogging & Pest Control)
  const togglePestStatus = (id) => {
    setPestControls(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'Selesai Tuntas' ? 'Sedang Fogging' : 'Selesai Tuntas';
          showNotification && showNotification(`Status treatment fogging diubah menjadi: ${nextStatus}`, 'info');
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Delete Handlers
  const handleDeleteItem = (id, type) => {
    if (!window.confirm('Yakin ingin menghapus catatan operasional kebersihan ini?')) return;
    if (type === 'checklist') setChecklists(prev => prev.filter(x => x.id !== id));
    if (type === 'garden') setGardens(prev => prev.filter(x => x.id !== id));
    if (type === 'waste') setWasteLogs(prev => prev.filter(x => x.id !== id));
    if (type === 'pest') setPestControls(prev => prev.filter(x => x.id !== id));
    showNotification && showNotification('Catatan kebersihan berhasil dihapus.', 'info');
  };

  // Handle Upload Foto ke Form (Multiple)
  const handlePhotosUpload = (e, setFormCallback) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const photoObj = {
          name: file.name,
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          url: loadEvt.target.result,
          size: file.size / 1024 < 1000 ? `${Math.round(file.size / 1024)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        };
        setFormCallback(prev => ({
          ...prev,
          photos: [...(prev.photos || []), photoObj]
        }));
      };
      reader.readAsDataURL(file);
    });
    showNotification && showNotification(`${files.length} foto berhasil ditambahkan ke formulir!`, 'success');
  };

  const removePhotoFromForm = (idx, setFormCallback) => {
    setFormCallback(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== idx)
    }));
  };

  // Submit Checklist Kantor
  const handleSubmitChecklist = (e) => {
    e.preventDefault();
    if (!checklistForm.area || !checklistForm.petugas) {
      showNotification && showNotification('Area dan nama petugas wajib diisi.', 'warning');
      return;
    }
    if (editingItem) {
      setChecklists(prev =>
        prev.map(x => (x.id === editingItem.id ? { ...x, ...checklistForm } : x))
      );
      showNotification && showNotification('Checklist kebersihan kantor berhasil diperbarui!', 'success');
    } else {
      const newCheck = {
        id: `CLN-${Date.now()}`,
        noDok: `CLN/AMS-OPS/2026/${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 90)}`,
        ...checklistForm
      };
      setChecklists([newCheck, ...checklists]);
      showNotification && showNotification(`Checklist "${newCheck.area}" berhasil disimpan!`, 'success');
    }
    setIsChecklistModalOpen(false);
    setEditingItem(null);
  };

  // Submit Taman
  const handleSubmitGarden = (e) => {
    e.preventDefault();
    if (!gardenForm.lokasiTaman) {
      showNotification && showNotification('Lokasi taman wajib diisi.', 'warning');
      return;
    }
    if (editingItem) {
      setGardens(prev =>
        prev.map(x => (x.id === editingItem.id ? { ...x, ...gardenForm } : x))
      );
      showNotification && showNotification('Catatan perawatan taman berhasil diperbarui!', 'success');
    } else {
      const newGrd = {
        id: `GRD-${Date.now()}`,
        noDok: `GRD/AMS-LND/2026/${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 90)}`,
        ...gardenForm
      };
      setGardens([newGrd, ...gardens]);
      showNotification && showNotification(`Perawatan taman di "${newGrd.lokasiTaman}" berhasil disimpan!`, 'success');
    }
    setIsGardenModalOpen(false);
    setEditingItem(null);
  };

  // Submit Waste
  const handleSubmitWaste = (e) => {
    e.preventDefault();
    if (!wasteForm.vendorTruk) {
      showNotification && showNotification('Nama vendor/armada pengangkut wajib diisi.', 'warning');
      return;
    }
    if (editingItem) {
      setWasteLogs(prev =>
        prev.map(x => (x.id === editingItem.id ? { ...x, ...wasteForm } : x))
      );
      showNotification && showNotification('Log pengangkutan sampah berhasil diperbarui!', 'success');
    } else {
      const newWst = {
        id: `WST-${Date.now()}`,
        noDok: `WST/AMS-TPS/2026/${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 90)}`,
        ...wasteForm
      };
      setWasteLogs([newWst, ...wasteLogs]);
      showNotification && showNotification(`Ritase angkut sampah "${newWst.vendorTruk}" berhasil dicatat!`, 'success');
    }
    setIsWasteModalOpen(false);
    setEditingItem(null);
  };

  // Submit Pest
  const handleSubmitPest = (e) => {
    e.preventDefault();
    if (!pestForm.jenisTreatment || !pestForm.areaCakupan) {
      showNotification && showNotification('Jenis treatment dan area cakupan wajib diisi.', 'warning');
      return;
    }
    if (editingItem) {
      setPestControls(prev =>
        prev.map(x => (x.id === editingItem.id ? { ...x, ...pestForm } : x))
      );
      showNotification && showNotification('Log treatment fogging/sanitasi berhasil diperbarui!', 'success');
    } else {
      const newPst = {
        id: `PST-${Date.now()}`,
        noDok: `PST/AMS-SAN/2026/${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 90)}`,
        ...pestForm
      };
      setPestControls([newPst, ...pestControls]);
      showNotification && showNotification(`Log treatment "${newPst.jenisTreatment}" berhasil disimpan!`, 'success');
    }
    setIsPestModalOpen(false);
    setEditingItem(null);
  };

  // Export Excel
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Checklist Kantor
      const wsChecklistsData = filteredChecklists.map((c, idx) => ({
        No: idx + 1,
        'No Dokumen': c.noDok,
        Tanggal: c.tanggal,
        Sesi: c.sesi,
        Proyek: c.proyek,
        'Area Fasilitas': c.area,
        'Petugas OB': c.petugas,
        'Pengawas GA': c.pengawas,
        'Item Pemeriksaan': c.itemPemeriksaan,
        Kondisi: c.kondisi,
        Status: c.status,
        'Jumlah Foto': (c.photos || []).length,
        Catatan: c.catatan
      }));
      const wsChecklists = XLSX.utils.json_to_sheet(wsChecklistsData);
      XLSX.utils.book_append_sheet(wb, wsChecklists, 'Checklist_Kantor');

      // Sheet 2: Taman & Boulevard
      const wsGardensData = filteredGardens.map((g, idx) => ({
        No: idx + 1,
        'No Dokumen': g.noDok,
        Tanggal: g.tanggal,
        'Jam Pengerjaan': g.jamPengerjaan,
        Proyek: g.proyek,
        'Lokasi Taman': g.lokasiTaman,
        'Jenis Pekerjaan': g.jenisPekerjaan,
        'Tim Gardener': g.gardener,
        Peralatan: g.peralatan,
        'Kondisi Saluran': g.kondisiSaluran,
        Status: g.status,
        'Jumlah Foto': (g.photos || []).length,
        Catatan: g.catatan
      }));
      const wsGardens = XLSX.utils.json_to_sheet(wsGardensData);
      XLSX.utils.book_append_sheet(wb, wsGardens, 'Perawatan_Taman');

      // Sheet 3: Pengangkutan Sampah
      const wsWastesData = filteredWastes.map((w, idx) => ({
        No: idx + 1,
        'No Dokumen': w.noDok,
        Tanggal: w.tanggal,
        'Jam Angkut': w.jamAngkut,
        Proyek: w.proyek,
        'Lokasi TPS': w.lokasiTPS,
        'Vendor / Truk': w.vendorTruk,
        'No Plat': w.noPlat,
        Supir: w.namaSupir,
        'Estimasi Volume': w.estimasiVolume,
        'Tanda Terima': w.tandaTerima,
        Status: w.status,
        'Jumlah Foto': (w.photos || []).length,
        Catatan: w.catatan
      }));
      const wsWastes = XLSX.utils.json_to_sheet(wsWastesData);
      XLSX.utils.book_append_sheet(wb, wsWastes, 'Pengangkutan_Sampah');

      // Sheet 4: Fogging & Pest Control
      const wsPestsData = filteredPests.map((p, idx) => ({
        No: idx + 1,
        'No Dokumen': p.noDok,
        Tanggal: p.tanggal,
        'Jam Pelaksanaan': p.jamPelaksanaan,
        Proyek: p.proyek,
        'Jenis Treatment': p.jenisTreatment,
        'Area Cakupan': p.areaCakupan,
        'Bahan Kimia / Dosis': p.bahanKimia,
        Pelaksana: p.pelaksana,
        'Petugas Safety': p.petugasSafety,
        Status: p.status,
        'Jumlah Foto': (p.photos || []).length,
        Catatan: p.catatan
      }));
      const wsPests = XLSX.utils.json_to_sheet(wsPestsData);
      XLSX.utils.book_append_sheet(wb, wsPests, 'Fogging_Pest_Control');

      XLSX.writeFile(wb, `Laporan_Kebersihan_Sanitasi_AMS_${todayStr}.xlsx`);
      showNotification && showNotification('Laporan Kebersihan & Sanitasi berhasil diekspor ke Excel (.xlsx)!', 'success');
    } catch (err) {
      console.error(err);
      showNotification && showNotification('Gagal mengekspor laporan Excel.', 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // 4. RENDER UI UTAMA
  // ---------------------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
      {/* ------------------------------------------------------------------- */}
      {/* HEADER BANNER MODUL KEBERSIHAN & SANITASI KAWASAN                    */}
      {/* ------------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '14px',
          border: '1px solid #1e293b',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Sparkles size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Kebersihan & Sanitasi Lingkungan Kawasan
              </h2>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}
              >
                ESTATE CLEAN & HYGIENE
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Checklist kebersihan kantor pemasaran & unit contoh, perawatan taman boulevard, ritase sampah TPS, dan sanitasi fogging.
            </p>
          </div>
        </div>

        {/* Action Buttons Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {activeSubTab === 'checklist-kantor' && (
            <button
              onClick={() => {
                setEditingItem(null);
                setChecklistForm({
                  tanggal: todayStr,
                  sesi: 'Sesi Pagi (07:30 WIB)',
                  proyek: 'Ashoka Park',
                  area: 'Marketing Gallery & Toilet Tamu',
                  petugas: 'Suparman (OB)',
                  pengawas: 'Fajar (Koordinator GA)',
                  itemPemeriksaan: 'Lantai sapu & pel wangi, Meja display bersih, Tong sampah kosong, Sabun & tisu lengkap',
                  kondisi: 'Sangat Bersih & Harum',
                  catatan: '',
                  status: 'Terverifikasi QC',
                  photos: []
                });
                setIsChecklistModalOpen(true);
              }}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Plus size={15} /> Catat Checklist Kantor
            </button>
          )}

          {activeSubTab === 'kebersihan-taman' && (
            <button
              onClick={() => {
                setEditingItem(null);
                setGardenForm({
                  tanggal: todayStr,
                  jamPengerjaan: '08:00 - 11:30 WIB',
                  proyek: 'Ashoka Park',
                  lokasiTaman: 'Boulevard Gerbang Utama & Bundaran',
                  jenisPekerjaan: 'Potong Rumput Gajah Mini & Siram Tanaman',
                  gardener: 'Maman (Landscape Lead) & Joko',
                  peralatan: 'Mesin Babat Rumput 2 Unit, Selang Siram 50m, Gunting Ranting',
                  kondisiSaluran: 'Saluran Drainase Boulevard Bersih & Lancar',
                  catatan: '',
                  status: 'Selesai Rapi',
                  photos: []
                });
                setIsGardenModalOpen(true);
              }}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Plus size={15} /> Catat Perawatan Taman
            </button>
          )}

          {activeSubTab === 'angkut-sampah' && (
            <button
              onClick={() => {
                setEditingItem(null);
                setWasteForm({
                  tanggal: todayStr,
                  jamAngkut: '09:30 WIB',
                  proyek: 'Ashoka Park',
                  lokasiTPS: 'TPS Kawasan Belakang Samping Blok B',
                  vendorTruk: 'DLH UPT Kebersihan Parung / Truk Kuning',
                  noPlat: '',
                  namaSupir: 'Pak Endang (DLH)',
                  estimasiVolume: '6 m³ (1 Bak Dump Truk)',
                  kondisiTpsAkhir: 'TPS Bersih, Disapu & Disemprot Disinfektan EM4',
                  tandaTerima: '',
                  petugasPendamping: 'Suparman & Fajar GA',
                  status: 'Selesai Diangkut & Bersih',
                  catatan: '',
                  photos: []
                });
                setIsWasteModalOpen(true);
              }}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Plus size={15} /> Catat Ritase Sampah TPS
            </button>
          )}

          {activeSubTab === 'fogging-pest' && (
            <button
              onClick={() => {
                setEditingItem(null);
                setPestForm({
                  tanggal: todayStr,
                  jamPelaksanaan: '16:00 - 18:00 WIB',
                  proyek: 'Ashoka Park',
                  jenisTreatment: 'Fogging Pengasapan Nyamuk DBD (Thermal Fogging)',
                  areaCakupan: 'Seluruh Saluran Drainase Blok A & B, Void Rumah Contoh',
                  bahanKimia: 'Insektisida Cynoff 50 EC + Solar Murni',
                  pelaksana: 'Tim GA Internal AMS & Mandor Subur',
                  petugasSafety: 'Hartono (Danru Satpam)',
                  kondisiCuaca: 'Cerah Berawan, Angin Tenang',
                  status: 'Selesai Tuntas',
                  catatan: '',
                  photos: []
                });
                setIsPestModalOpen(true);
              }}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Plus size={15} /> Catat Fogging & Sanitasi
            </button>
          )}

          <button
            onClick={handleExportExcel}
            className="btn btn-secondary"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid #334155',
              color: '#34d399',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              fontSize: '0.8rem',
              borderRadius: '8px'
            }}
            title="Download Rekap Kebersihan (.xlsx)"
          >
            <Download size={15} /> Export Excel
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="btn btn-secondary"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid #334155',
              color: '#94a3b8',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              fontSize: '0.8rem',
              borderRadius: '8px'
            }}
            title="Cetak Lembar Checklist Resmi Kop Surat"
          >
            <Printer size={15} /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4 KPI METRIC CARDS                                                  */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px'
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Checklist Kantor & Galeri</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              {metrics.totalChecklists} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Log</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <CheckCircle2 size={12} /> {metrics.verifiedChecklists} Terverifikasi QC
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Perawatan Taman & Boulevard</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              {metrics.totalGardens} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Zona</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <Trees size={12} /> Boulevard Asri & Rapi
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trees size={20} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Ritase Sampah TPS Kawasan</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              {metrics.totalWastes} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Rit</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <Truck size={12} /> TPS Bersih & Higienis
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.25)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={20} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Treatment Fogging & Pest</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              {metrics.totalPests} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Siklus</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <Bug size={12} /> 100% Bebas Jentik DBD
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.25)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bug size={20} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* KONTAK DARURAT & PIC KEBERSIHAN KAWASAN WIDGET                      */}
      {/* ------------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '10px 16px',
          borderRadius: '10px',
          border: '1px solid #1e293b',
          background: 'rgba(15, 23, 42, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PhoneCall size={16} color="#10b981" />
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#cbd5e1' }}>
            Kontak PIC Kebersihan & Vendor Sanitasi Lingkungan:
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '0.74rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#64748b' }}>Koordinator GA (Fajar):</span>
            <strong style={{ color: '#10b981' }}>0858-9900-1122</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#64748b' }}>Lead Landscape (Maman):</span>
            <strong style={{ color: '#38bdf8' }}>0812-4455-8899</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#64748b' }}>UPT DLH Parung:</span>
            <strong style={{ color: '#fbbf24' }}>(0251) 854-2190</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#64748b' }}>Puskesmas / Tim DBD:</span>
            <strong style={{ color: '#f87171' }}>(0251) 861-1200</strong>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4 SUB-TAB NAVIGASI KEBERSIHAN                                       */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '8px',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveSubTab('checklist-kantor')}
          style={{
            background: activeSubTab === 'checklist-kantor' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'checklist-kantor' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'checklist-kantor' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={16} />
          <span>1. Checklist Kantor & Fasilitas</span>
          <span style={{ background: activeSubTab === 'checklist-kantor' ? '#10b981' : '#334155', color: activeSubTab === 'checklist-kantor' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            {filteredChecklists.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('kebersihan-taman')}
          style={{
            background: activeSubTab === 'kebersihan-taman' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'kebersihan-taman' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'kebersihan-taman' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Trees size={16} />
          <span>2. Perawatan Taman & Boulevard</span>
          <span style={{ background: activeSubTab === 'kebersihan-taman' ? '#10b981' : '#334155', color: activeSubTab === 'kebersihan-taman' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            {filteredGardens.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('angkut-sampah')}
          style={{
            background: activeSubTab === 'angkut-sampah' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'angkut-sampah' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'angkut-sampah' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Truck size={16} />
          <span>3. Ritase Sampah TPS Kawasan</span>
          <span style={{ background: activeSubTab === 'angkut-sampah' ? '#10b981' : '#334155', color: activeSubTab === 'angkut-sampah' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            {filteredWastes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('fogging-pest')}
          style={{
            background: activeSubTab === 'fogging-pest' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'fogging-pest' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'fogging-pest' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Bug size={16} />
          <span>4. Fogging DBD & Sanitasi Khusus</span>
          <span style={{ background: activeSubTab === 'fogging-pest' ? '#10b981' : '#334155', color: activeSubTab === 'fogging-pest' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            {filteredPests.length}
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* FILTER BAR TERPADU                                                  */}
      {/* ------------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#10b981" />
            <span>Filter Tanggal & Lokasi Sanitasi</span>
          </div>
          {(searchTerm || startDate !== '2026-10-01' || endDate !== '2026-10-31' || projectFilter !== 'ALL') && (
            <button
              onClick={handleResetFilter}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} /> Reset Filter
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Pencarian Cepat</label>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari area, petugas, vendor, treatment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: '#090d16',
                  border: '1px solid #334155',
                  borderRadius: '7px',
                  padding: '7px 10px 7px 30px',
                  color: '#f8fafc',
                  fontSize: '0.78rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: '7px',
                padding: '7px 10px',
                color: '#f8fafc',
                fontSize: '0.78rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: '7px',
                padding: '7px 10px',
                color: '#f8fafc',
                fontSize: '0.78rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Proyek Kawasan</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: '7px',
                padding: '7px 10px',
                color: '#f8fafc',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">Semua Proyek & Lokasi</option>
              <option value="PARK">Ashoka Park (Parung)</option>
              <option value="VIEW">Ashoka View (Cidokom)</option>
              <option value="HO">Head Office Bizhub Serpong</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* KONTEN TAB 1: CHECKLIST KEBERSIHAN KANTOR & FASILITAS               */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'checklist-kantor' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Checklist Kebersihan Harian Kantor, Galeri Pemasaran & Fasilitas
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Pemeriksaan rutin kebersihan lantai, toilet tamu, ruang kerja direksi, restock tisu & sabun cuci tangan.
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Total: <strong style={{ color: '#10b981' }}>{filteredChecklists.length}</strong> log tercatat
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Tanggal & Sesi</th>
                  <th style={{ padding: '10px 14px' }}>Area & Proyek</th>
                  <th style={{ padding: '10px 14px' }}>Petugas & Pengawas</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Dokumentasi Foto</th>
                  <th style={{ padding: '10px 14px' }}>Hasil & Kondisi</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status QC</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredChecklists.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada catatan checklist kantor yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredChecklists.map((item, idx) => {
                    const photosCount = (item.photos || []).length;
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>{item.sesi}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {formatDisplayDate(item.tanggal)} &bull; {item.noDok}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#cbd5e1' }}>{item.area}</div>
                          <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            <MapPin size={11} /> {item.proyek}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#34d399' }}>{item.petugas}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Pengawas: {item.pengawas}</div>
                        </td>
                        {/* Tombol Lihat Foto Slider */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => openGallery(item.photos, `Foto Kebersihan: ${item.area} (${item.sesi})`)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: photosCount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                              border: photosCount > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #334155',
                              color: photosCount > 0 ? '#34d399' : '#94a3b8',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Camera size={12} />
                            <span>Lihat Foto ({photosCount})</span>
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                          <div style={{ display: 'inline-block', padding: '2px 7px', borderRadius: '5px', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', fontSize: '0.7rem', fontWeight: 700, marginBottom: '3px' }}>
                            {item.kondisi}
                          </div>
                          <div style={{ fontSize: '0.73rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.itemPemeriksaan || item.catatan}
                          </div>
                        </td>
                        {/* Status QC dengan Toggle Cepat */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleChecklistStatus(item.id)}
                            style={{
                              background: item.status === 'Terverifikasi QC' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                              border: item.status === 'Terverifikasi QC' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                              color: item.status === 'Terverifikasi QC' ? '#10b981' : '#fbbf24',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Klik untuk toggle status verifikasi kebersihan"
                          >
                            <Check size={11} /> {item.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(item, 'checklist')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}
                              title="Lihat Detail Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setChecklistForm({ ...item });
                                setIsChecklistModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}
                              title="Edit Catatan"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, 'checklist')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#f87171' }}
                              title="Hapus"
                            >
                              <Trash2 size={13} />
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

      {/* ------------------------------------------------------------------- */}
      {/* KONTEN TAB 2: PERAWATAN TAMAN & BOULEVARD KAWASAN                   */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'kebersihan-taman' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Perawatan Taman, Boulevard & Area Terbuka Hijau
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Pemotongan rumput berkala, penyiraman tanaman, pembersihan saluran got drainase & perapihan semak.
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Total: <strong style={{ color: '#38bdf8' }}>{filteredGardens.length}</strong> zona tercatat
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Waktu & Tanggal</th>
                  <th style={{ padding: '10px 14px' }}>Lokasi Taman & Proyek</th>
                  <th style={{ padding: '10px 14px' }}>Jenis Pekerjaan</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Dokumentasi Foto</th>
                  <th style={{ padding: '10px 14px' }}>Gardener & Peralatan</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status Taman</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredGardens.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada catatan taman yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredGardens.map((grd, idx) => {
                    const photosCount = (grd.photos || []).length;
                    return (
                      <tr key={grd.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} color="#10b981" /> {grd.jamPengerjaan}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {formatDisplayDate(grd.tanggal)} &bull; {grd.noDok}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#cbd5e1' }}>{grd.lokasiTaman}</div>
                          <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            <MapPin size={10} /> {grd.proyek}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#38bdf8' }}>{grd.jenisPekerjaan}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{grd.kondisiSaluran}</div>
                        </td>
                        {/* Tombol Lihat Foto Slider */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => openGallery(grd.photos, `Foto Taman: ${grd.lokasiTaman}`)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: photosCount > 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                              border: photosCount > 0 ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #334155',
                              color: photosCount > 0 ? '#38bdf8' : '#94a3b8',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Camera size={12} />
                            <span>Lihat Foto ({photosCount})</span>
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                          <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.76rem' }}>{grd.gardener}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {grd.peralatan}
                          </div>
                        </td>
                        {/* Status Taman dengan Toggle Cepat */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleGardenStatus(grd.id)}
                            style={{
                              background: grd.status === 'Selesai Rapi' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                              border: grd.status === 'Selesai Rapi' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                              color: grd.status === 'Selesai Rapi' ? '#10b981' : '#fbbf24',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Klik untuk mengubah status perawatan taman"
                          >
                            <Check size={11} /> {grd.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(grd, 'garden')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}
                              title="Lihat Detail Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(grd);
                                setGardenForm({ ...grd });
                                setIsGardenModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}
                              title="Edit"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(grd.id, 'garden')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#f87171' }}
                              title="Hapus"
                            >
                              <Trash2 size={13} />
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

      {/* ------------------------------------------------------------------- */}
      {/* KONTEN TAB 3: KONTROL RITASE SAMPAH & TPS KAWASAN                    */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'angkut-sampah' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Kontrol Ritase Pengangkutan Sampah & Pengelolaan TPS Kawasan
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Jadwal armada truk DLH / vendor swasta, verifikasi tanda terima angkut, dan sanitasi area TPS bebas bau.
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Total: <strong style={{ color: '#fbbf24' }}>{filteredWastes.length}</strong> rit tercatat
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Waktu & Tanggal</th>
                  <th style={{ padding: '10px 14px' }}>Vendor & Armada Truk</th>
                  <th style={{ padding: '10px 14px' }}>Volume & TPS</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Dokumentasi Foto</th>
                  <th style={{ padding: '10px 14px' }}>Tanda Terima & Supir</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status TPS</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredWastes.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada catatan pengangkutan sampah yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredWastes.map((w, idx) => {
                    const photosCount = (w.photos || []).length;
                    return (
                      <tr key={w.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} color="#10b981" /> {w.jamAngkut}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {formatDisplayDate(w.tanggal)} &bull; {w.noDok}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#cbd5e1' }}>{w.vendorTruk}</div>
                          <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '2px' }}>
                            {w.noPlat ? `Plat: ${w.noPlat}` : 'Armada Dump Truk'}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>{w.estimasiVolume}</div>
                          <div style={{ fontSize: '0.7rem', color: '#10b981' }}>{w.lokasiTPS} ({w.proyek})</div>
                        </td>
                        {/* Tombol Lihat Foto Slider */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => openGallery(w.photos, `Foto Angkut Sampah: ${w.vendorTruk}`)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: photosCount > 0 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                              border: photosCount > 0 ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid #334155',
                              color: photosCount > 0 ? '#fbbf24' : '#94a3b8',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Camera size={12} />
                            <span>Lihat Foto ({photosCount})</span>
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                          <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.76rem' }}>
                            {w.tandaTerima || 'No. Resi DLH'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            Supir: {w.namaSupir}
                          </div>
                        </td>
                        {/* Status TPS dengan Toggle Cepat */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleWasteStatus(w.id)}
                            style={{
                              background: w.status === 'Selesai Diangkut & Bersih' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                              border: w.status === 'Selesai Diangkut & Bersih' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                              color: w.status === 'Selesai Diangkut & Bersih' ? '#10b981' : '#fbbf24',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Klik untuk mengubah status pengangkutan TPS"
                          >
                            <Check size={11} /> {w.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(w, 'waste')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}
                              title="Lihat Detail Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(w);
                                setWasteForm({ ...w });
                                setIsWasteModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}
                              title="Edit"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(w.id, 'waste')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#f87171' }}
                              title="Hapus"
                            >
                              <Trash2 size={13} />
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

      {/* ------------------------------------------------------------------- */}
      {/* KONTEN TAB 4: FOGGING DBD & PEST CONTROL KHUSUS                     */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'fogging-pest' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Pengendalian Hama, Fogging Nyamuk DBD & Sanitasi Khusus Kawasan
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Treatment pengasapan saluran kavling, injeksi barrier anti-rayap, dan sterilisasi lingkungan proyek.
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Total: <strong style={{ color: '#34d399' }}>{filteredPests.length}</strong> treatment tercatat
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Tanggal & Jam</th>
                  <th style={{ padding: '10px 14px' }}>Jenis Treatment & Proyek</th>
                  <th style={{ padding: '10px 14px' }}>Area Cakupan</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Dokumentasi Foto</th>
                  <th style={{ padding: '10px 14px' }}>Bahan Kimia & Pelaksana</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status Treatment</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPests.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada data fogging / pest control yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredPests.map((pst, idx) => {
                    const photosCount = (pst.photos || []).length;
                    return (
                      <tr key={pst.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} color="#10b981" /> {pst.jamPelaksanaan}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {formatDisplayDate(pst.tanggal)} &bull; {pst.noDok}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#cbd5e1' }}>{pst.jenisTreatment}</div>
                          <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            <MapPin size={10} /> {pst.proyek}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                          <div style={{ fontSize: '0.76rem', color: '#f8fafc', fontWeight: 600 }}>{pst.areaCakupan}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{pst.kondisiCuaca}</div>
                        </td>
                        {/* Tombol Lihat Foto Slider */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => openGallery(pst.photos, `Foto Fogging: ${pst.jenisTreatment}`)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: photosCount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                              border: photosCount > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #334155',
                              color: photosCount > 0 ? '#34d399' : '#94a3b8',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Camera size={12} />
                            <span>Lihat Foto ({photosCount})</span>
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600 }}>{pst.bahanKimia}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>Oleh: {pst.pelaksana}</div>
                        </td>
                        {/* Status Treatment dengan Toggle Cepat */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => togglePestStatus(pst.id)}
                            style={{
                              background: pst.status === 'Selesai Tuntas' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                              border: pst.status === 'Selesai Tuntas' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                              color: pst.status === 'Selesai Tuntas' ? '#10b981' : '#fbbf24',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Klik untuk mengubah status treatment fogging"
                          >
                            <Check size={11} /> {pst.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(pst, 'pest')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}
                              title="Lihat Detail Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(pst);
                                setPestForm({ ...pst });
                                setIsPestModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}
                              title="Edit"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(pst.id, 'pest')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#f87171' }}
                              title="Hapus"
                            >
                              <Trash2 size={13} />
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

      {/* ------------------------------------------------------------------- */}
      {/* MODAL GALLERY: PHOTO SLIDER / CAROUSEL DENGAN TOMBOL GESER          */}
      {/* ------------------------------------------------------------------- */}
      {isGalleryOpen && galleryPhotos.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.5rem'
          }}
          onClick={() => setIsGalleryOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '820px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#090d16',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Slider */}
            <div
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid #1e293b',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Camera size={18} color="#10b981" />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {galleryTitle}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Gunakan tombol geser kiri/kanan atau klik thumbnail di bawah
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '12px'
                  }}
                >
                  Foto {activePhotoIdx + 1} dari {galleryPhotos.length}
                </span>
                <button
                  onClick={() => setIsGalleryOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Area Tampilan Gambar Utama dengan Tombol Geser */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '420px',
                background: '#030712',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Gambar Aktif */}
              <img
                src={galleryPhotos[activePhotoIdx]?.url}
                alt={galleryPhotos[activePhotoIdx]?.name || 'Dokumentasi'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
              />

              {/* Tombol Geser Kiri */}
              {galleryPhotos.length > 1 && (
                <button
                  onClick={() => setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : galleryPhotos.length - 1))}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Foto Sebelumnya (Panah Kiri)"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Tombol Geser Kanan */}
              {galleryPhotos.length > 1 && (
                <button
                  onClick={() => setActivePhotoIdx(prev => (prev < galleryPhotos.length - 1 ? prev + 1 : 0))}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Foto Selanjutnya (Panah Kanan)"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Caption Overlay di Bawah Foto */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(3, 7, 18, 0.95), rgba(3, 7, 18, 0.4), transparent)',
                  padding: '12px 18px',
                  color: '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#34d399' }}>
                    {galleryPhotos[activePhotoIdx]?.caption || galleryPhotos[activePhotoIdx]?.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {galleryPhotos[activePhotoIdx]?.name} {galleryPhotos[activePhotoIdx]?.size && `\u2022 ${galleryPhotos[activePhotoIdx]?.size}`}
                  </div>
                </div>

                {galleryPhotos[activePhotoIdx]?.url && (
                  <button
                    onClick={() => {
                      const w = window.open('');
                      if (w) w.document.write(`<img src="${galleryPhotos[activePhotoIdx].url}" style="max-width:100%; height:auto;" />`);
                    }}
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid #334155',
                      color: '#38bdf8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Maximize2 size={12} /> Buka Tab Penuh
                  </button>
                )}
              </div>
            </div>

            {/* Strip Thumbnail di Bawah */}
            {galleryPhotos.length > 1 && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#0f172a',
                  borderTop: '1px solid #1e293b',
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  alignItems: 'center'
                }}
              >
                {galleryPhotos.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    style={{
                      width: '64px',
                      height: '48px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: idx === activePhotoIdx ? '2px solid #10b981' : '1px solid #334155',
                      opacity: idx === activePhotoIdx ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      background: '#030712'
                    }}
                  >
                    <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL DETAIL VIEW LENGKAP                                           */}
      {/* ------------------------------------------------------------------- */}
      {isDetailModalOpen && detailItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Detail Catatan Kebersihan & Sanitasi ({detailItem.noDok})
                </h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '78vh', overflowY: 'auto' }}>
              {/* Header Box */}
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Nomor Dokumen & Tanggal:</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>{detailItem.noDok}</div>
                  <div style={{ fontSize: '0.74rem', color: '#10b981' }}>{formatDisplayDate(detailItem.tanggal)} &bull; {detailItem.proyek}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'right' }}>Status Saat Ini:</div>
                  <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800, fontSize: '0.76rem' }}>
                    {detailItem.status}
                  </span>
                </div>
              </div>

              {/* Konten Berdasarkan Tipe */}
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px 16px', fontSize: '0.78rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {detailType === 'checklist' && (
                  <>
                    <div><span style={{ color: '#64748b' }}>Sesi Pemeriksaan:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.sesi}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Area Fasilitas:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.area}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Petugas OB:</span> <strong style={{ color: '#34d399', display: 'block' }}>{detailItem.petugas}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Pengawas GA:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.pengawas}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Kondisi Kebersihan:</span> <strong style={{ color: '#10b981', display: 'block' }}>{detailItem.kondisi}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Item Checklist:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.itemPemeriksaan}</div></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Catatan Lapangan:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.catatan || '-'}</div></div>
                  </>
                )}

                {detailType === 'garden' && (
                  <>
                    <div><span style={{ color: '#64748b' }}>Waktu Kerja:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.jamPengerjaan}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Lokasi Taman:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.lokasiTaman}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Jenis Pekerjaan:</span> <strong style={{ color: '#38bdf8', display: 'block' }}>{detailItem.jenisPekerjaan}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Tim Gardener:</span> <strong style={{ color: '#34d399', display: 'block' }}>{detailItem.gardener}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Kondisi Saluran:</span> <strong style={{ color: '#10b981', display: 'block' }}>{detailItem.kondisiSaluran}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Peralatan yang Digunakan:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.peralatan}</div></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Catatan Perawatan:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.catatan || '-'}</div></div>
                  </>
                )}

                {detailType === 'waste' && (
                  <>
                    <div><span style={{ color: '#64748b' }}>Jam Angkut:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.jamAngkut}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Lokasi TPS:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.lokasiTPS}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Vendor / Truk:</span> <strong style={{ color: '#fbbf24', display: 'block' }}>{detailItem.vendorTruk}</strong></div>
                    <div><span style={{ color: '#64748b' }}>No. Polisi / Plat:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.noPlat || 'Dump Truk DLH'}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Volume Sampah:</span> <strong style={{ color: '#10b981', display: 'block' }}>{detailItem.estimasiVolume}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Tanda Terima:</span> <strong style={{ color: '#38bdf8', display: 'block' }}>{detailItem.tandaTerima || '-'}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Kondisi Akhir TPS:</span> <strong style={{ color: '#10b981', display: 'block' }}>{detailItem.kondisiTpsAkhir}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Catatan Petugas:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.catatan || '-'}</div></div>
                  </>
                )}

                {detailType === 'pest' && (
                  <>
                    <div><span style={{ color: '#64748b' }}>Waktu Pelaksanaan:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.jamPelaksanaan}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Kondisi Cuaca:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.kondisiCuaca}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Jenis Treatment:</span> <strong style={{ color: '#38bdf8', display: 'block' }}>{detailItem.jenisTreatment}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Area Cakupan:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.areaCakupan}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Bahan Kimia / Insektisida:</span> <strong style={{ color: '#fbbf24', display: 'block' }}>{detailItem.bahanKimia}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Pelaksana:</span> <strong style={{ color: '#10b981', display: 'block' }}>{detailItem.pelaksana}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Petugas Safety:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.petugasSafety}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Catatan Pelaksanaan:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.catatan || '-'}</div></div>
                  </>
                )}
              </div>

              {/* Dokumentasi Foto di dalam Detail View */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Dokumentasi Foto Kebersihan ({(detailItem.photos || []).length} Foto):</span>
                  {(detailItem.photos || []).length > 0 && (
                    <button
                      onClick={() => openGallery(detailItem.photos, `Galeri: ${detailItem.noDok}`)}
                      style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Buka di Galeri Geser &rarr;
                    </button>
                  )}
                </div>

                {(detailItem.photos || []).length === 0 ? (
                  <div style={{ padding: '1.2rem', textAlign: 'center', background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', color: '#64748b', fontSize: '0.75rem' }}>
                    Belum ada foto yang diunggah untuk data ini.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                    {detailItem.photos.map((p, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => openGallery(detailItem.photos, `Galeri: ${detailItem.noDok}`)}
                        style={{
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #334155',
                          background: '#090d16',
                          cursor: 'pointer',
                          position: 'relative',
                          height: '90px'
                        }}
                      >
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '2px 4px', fontSize: '0.62rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ background: '#090d16', border: '1px solid #334155', color: '#94a3b8', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem' }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 1: FORM CHECKLIST KANTOR & FASILITAS                          */}
      {/* ------------------------------------------------------------------- */}
      {isChecklistModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setIsChecklistModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '620px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {editingItem ? 'Edit Checklist Kebersihan Kantor' : 'Catat Checklist Kebersihan Harian Kantor & Fasilitas'}
                </h3>
              </div>
              <button onClick={() => setIsChecklistModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitChecklist} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '78vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Tanggal Pemeriksaan</label>
                  <input
                    type="date"
                    required
                    value={checklistForm.tanggal}
                    onChange={(e) => setChecklistForm({ ...checklistForm, tanggal: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Sesi Kerja</label>
                  <select
                    value={checklistForm.sesi}
                    onChange={(e) => setChecklistForm({ ...checklistForm, sesi: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Sesi Pagi (07:30 WIB)">Sesi Pagi (07:30 WIB - Buka Kantor)</option>
                    <option value="Sesi Siang (12:30 WIB)">Sesi Siang (12:30 WIB - Cek Rutin)</option>
                    <option value="Sesi Sore (16:30 WIB)">Sesi Sore (16:30 WIB - Tutup Kantor)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Proyek / Kawasan</label>
                  <select
                    value={checklistForm.proyek}
                    onChange={(e) => setChecklistForm({ ...checklistForm, proyek: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                    <option value="Head Office Bizhub">Head Office Bizhub</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Status Kebersihan QC</label>
                  <select
                    value={checklistForm.status}
                    onChange={(e) => setChecklistForm({ ...checklistForm, status: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Terverifikasi QC">Terverifikasi QC (Lolos Standar)</option>
                    <option value="Selesai Bersih">Selesai Bersih</option>
                    <option value="Sedang Dibersihkan">Sedang Dibersihkan</option>
                    <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Area Fasilitas yang Diperiksa *</label>
                <input
                  type="text"
                  required
                  value={checklistForm.area}
                  onChange={(e) => setChecklistForm({ ...checklistForm, area: e.target.value })}
                  placeholder="Contoh: Marketing Gallery, Toilet Tamu, Musholla, Pantry..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Petugas Cleaning / OB *</label>
                  <input
                    type="text"
                    required
                    value={checklistForm.petugas}
                    onChange={(e) => setChecklistForm({ ...checklistForm, petugas: e.target.value })}
                    placeholder="Nama OB (cth: Suparman / Dedi)"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Pengawas / Koordinator GA</label>
                  <input
                    type="text"
                    value={checklistForm.pengawas}
                    onChange={(e) => setChecklistForm({ ...checklistForm, pengawas: e.target.value })}
                    placeholder="Cth: Fajar (Koordinator GA)"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Item Checklist yang Diperiksa</label>
                <input
                  type="text"
                  value={checklistForm.itemPemeriksaan}
                  onChange={(e) => setChecklistForm({ ...checklistForm, itemPemeriksaan: e.target.value })}
                  placeholder="Lantai dipel wangi, kaca pintu bening, tempat sampah kosong, sabun & tisu refill"
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Catatan Khusus Lapangan</label>
                <textarea
                  rows="2"
                  value={checklistForm.catatan}
                  onChange={(e) => setChecklistForm({ ...checklistForm, catatan: e.target.value })}
                  placeholder="Catatan tambahan aroma wangi, stok karbol habis, kran wastafel..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              {/* Upload Foto Checklist (Multi-Photo) */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#10b981', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Upload Foto Dokumentasi Kebersihan (Bisa Pilih Banyak Foto: Before / After / Toilet / Meja)
                </label>
                <input
                  ref={checklistFileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handlePhotosUpload(e, setChecklistForm)}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => checklistFileRef.current && checklistFileRef.current.click()}
                  style={{
                    border: '2px dashed #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    background: 'rgba(9, 13, 22, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#94a3b8',
                    fontSize: '0.78rem'
                  }}
                >
                  <UploadCloud size={16} color="#10b981" />
                  <span>Klik untuk Upload Foto Kebersihan (Bisa pilih beberapa foto)</span>
                </div>

                {/* Grid Preview Foto */}
                {(checklistForm.photos || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {checklistForm.photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #10b981' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhotoFromForm(idx, setChecklistForm)}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.85)', border: 'none', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsChecklistModalOpen(false)} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '7px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Simpan Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 2: FORM PERAWATAN TAMAN & BOULEVARD                           */}
      {/* ------------------------------------------------------------------- */}
      {isGardenModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setIsGardenModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '620px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trees size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {editingItem ? 'Edit Perawatan Taman' : 'Catat Perawatan Taman, Boulevard & Area Hijau'}
                </h3>
              </div>
              <button onClick={() => setIsGardenModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitGarden} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '78vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Tanggal Pengerjaan</label>
                  <input
                    type="date"
                    required
                    value={gardenForm.tanggal}
                    onChange={(e) => setGardenForm({ ...gardenForm, tanggal: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Jam Kerja</label>
                  <input
                    type="text"
                    value={gardenForm.jamPengerjaan}
                    onChange={(e) => setGardenForm({ ...gardenForm, jamPengerjaan: e.target.value })}
                    placeholder="Contoh: 08:00 - 11:30 WIB"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Proyek / Kawasan</label>
                  <select
                    value={gardenForm.proyek}
                    onChange={(e) => setGardenForm({ ...gardenForm, proyek: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                    <option value="Head Office Bizhub">Head Office Bizhub</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Status Perawatan</label>
                  <select
                    value={gardenForm.status}
                    onChange={(e) => setGardenForm({ ...gardenForm, status: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Selesai Rapi">Selesai Rapi</option>
                    <option value="Sedang Pengerjaan">Sedang Pengerjaan</option>
                    <option value="Jadwal Rutin">Jadwal Rutin</option>
                    <option value="Perlu Perapihan Ulang">Perlu Perapihan Ulang</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Lokasi Taman & Area *</label>
                <input
                  type="text"
                  required
                  value={gardenForm.lokasiTaman}
                  onChange={(e) => setGardenForm({ ...gardenForm, lokasiTaman: e.target.value })}
                  placeholder="Contoh: Boulevard Gerbang Utama, Bundaran, Depan Mockup Rumah..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Jenis Pekerjaan yang Dilakukan</label>
                <input
                  type="text"
                  value={gardenForm.jenisPekerjaan}
                  onChange={(e) => setGardenForm({ ...gardenForm, jenisPekerjaan: e.target.value })}
                  placeholder="Potong rumput gajah mini, siram tanaman, pembersihan got saluran..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Tim Gardener / Petugas</label>
                  <input
                    type="text"
                    value={gardenForm.gardener}
                    onChange={(e) => setGardenForm({ ...gardenForm, gardener: e.target.value })}
                    placeholder="Maman Landscape & Joko"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Kondisi Saluran Got / Air</label>
                  <input
                    type="text"
                    value={gardenForm.kondisiSaluran}
                    onChange={(e) => setGardenForm({ ...gardenForm, kondisiSaluran: e.target.value })}
                    placeholder="Lancar bebas daun / Mengalir baik"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Peralatan & Catatan Perawatan</label>
                <textarea
                  rows="2"
                  value={gardenForm.catatan}
                  onChange={(e) => setGardenForm({ ...gardenForm, catatan: e.target.value })}
                  placeholder="Mesin babat 2 unit, pupuk cair, pemangkasan dahan pohon..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              {/* Upload Foto Taman (Multi-Photo) */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#38bdf8', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Upload Foto Dokumentasi Taman (Bisa Pilih Banyak Foto: Rumput, Bunga, Drainase)
                </label>
                <input
                  ref={gardenFileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handlePhotosUpload(e, setGardenForm)}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => gardenFileRef.current && gardenFileRef.current.click()}
                  style={{
                    border: '2px dashed #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    background: 'rgba(9, 13, 22, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#94a3b8',
                    fontSize: '0.78rem'
                  }}
                >
                  <UploadCloud size={16} color="#38bdf8" />
                  <span>Klik untuk Upload Foto Taman (Bisa pilih beberapa foto)</span>
                </div>

                {/* Grid Preview Foto */}
                {(gardenForm.photos || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {gardenForm.photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #38bdf8' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhotoFromForm(idx, setGardenForm)}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.85)', border: 'none', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsGardenModalOpen(false)} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '7px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Simpan Laporan Taman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 3: FORM RITASE PENGANGKUTAN SAMPAH & TPS                      */}
      {/* ------------------------------------------------------------------- */}
      {isWasteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setIsWasteModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '620px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {editingItem ? 'Edit Ritase Sampah' : 'Catat Ritase Pengangkutan Sampah & Kontrol TPS'}
                </h3>
              </div>
              <button onClick={() => setIsWasteModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitWaste} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '78vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Tanggal Pengangkutan</label>
                  <input
                    type="date"
                    required
                    value={wasteForm.tanggal}
                    onChange={(e) => setWasteForm({ ...wasteForm, tanggal: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Jam Pengambilan</label>
                  <input
                    type="text"
                    value={wasteForm.jamAngkut}
                    onChange={(e) => setWasteForm({ ...wasteForm, jamAngkut: e.target.value })}
                    placeholder="Contoh: 09:30 WIB"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Vendor / Dinas Pengangkut *</label>
                  <input
                    type="text"
                    required
                    value={wasteForm.vendorTruk}
                    onChange={(e) => setWasteForm({ ...wasteForm, vendorTruk: e.target.value })}
                    placeholder="DLH UPT Kebersihan Parung / Vendor"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Status TPS</label>
                  <select
                    value={wasteForm.status}
                    onChange={(e) => setWasteForm({ ...wasteForm, status: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Selesai Diangkut & Bersih">Selesai Diangkut & Bersih</option>
                    <option value="Sedang Dimuat">Sedang Dimuat</option>
                    <option value="Menunggu Penjemputan">Menunggu Penjemputan</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>No. Polisi / Plat Truk</label>
                  <input
                    type="text"
                    value={wasteForm.noPlat}
                    onChange={(e) => setWasteForm({ ...wasteForm, noPlat: e.target.value })}
                    placeholder="Contoh: F 8391 FB"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nama Supir</label>
                  <input
                    type="text"
                    value={wasteForm.namaSupir}
                    onChange={(e) => setWasteForm({ ...wasteForm, namaSupir: e.target.value })}
                    placeholder="Pak Endang"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Estimasi Volume</label>
                  <input
                    type="text"
                    value={wasteForm.estimasiVolume}
                    onChange={(e) => setWasteForm({ ...wasteForm, estimasiVolume: e.target.value })}
                    placeholder="Contoh: 6 m³ (1 Bak Dump Truk)"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nomor Tanda Terima / Surat Jalan</label>
                  <input
                    type="text"
                    value={wasteForm.tandaTerima}
                    onChange={(e) => setWasteForm({ ...wasteForm, tandaTerima: e.target.value })}
                    placeholder="Contoh: TT-DLH-PARUNG/2026/X-102"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Kondisi TPS Pasca Pengangkutan</label>
                <textarea
                  rows="2"
                  value={wasteForm.catatan}
                  onChange={(e) => setWasteForm({ ...wasteForm, catatan: e.target.value })}
                  placeholder="Lantai TPS disapu, sampah habis terangkut, disemprot EM4 anti bau..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              {/* Upload Foto Sampah (Multi-Photo) */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#fbbf24', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Upload Foto Bukti Pengangkutan (Bisa Pilih Banyak Foto: Truk di TPS, Tanda Terima, Area Bersih)
                </label>
                <input
                  ref={wasteFileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handlePhotosUpload(e, setWasteForm)}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => wasteFileRef.current && wasteFileRef.current.click()}
                  style={{
                    border: '2px dashed #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    background: 'rgba(9, 13, 22, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#94a3b8',
                    fontSize: '0.78rem'
                  }}
                >
                  <UploadCloud size={16} color="#fbbf24" />
                  <span>Klik untuk Upload Foto Pengangkutan (Bisa pilih beberapa foto)</span>
                </div>

                {/* Grid Preview Foto */}
                {(wasteForm.photos || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {wasteForm.photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #fbbf24' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhotoFromForm(idx, setWasteForm)}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.85)', border: 'none', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsWasteModalOpen(false)} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '7px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Simpan Ritase Sampah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 4: FORM FOGGING & PEST CONTROL KHUSUS                         */}
      {/* ------------------------------------------------------------------- */}
      {isPestModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setIsPestModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '620px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bug size={18} color="#34d399" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {editingItem ? 'Edit Treatment Fogging' : 'Catat Pengendalian Hama, Fogging DBD & Sanitasi'}
                </h3>
              </div>
              <button onClick={() => setIsPestModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitPest} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '78vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Tanggal Treatment</label>
                  <input
                    type="date"
                    required
                    value={pestForm.tanggal}
                    onChange={(e) => setPestForm({ ...pestForm, tanggal: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Waktu Pelaksanaan</label>
                  <input
                    type="text"
                    value={pestForm.jamPelaksanaan}
                    onChange={(e) => setPestForm({ ...pestForm, jamPelaksanaan: e.target.value })}
                    placeholder="Contoh: 16:00 - 18:00 WIB"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Proyek / Kawasan</label>
                  <select
                    value={pestForm.proyek}
                    onChange={(e) => setPestForm({ ...pestForm, proyek: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                    <option value="Head Office Bizhub">Head Office Bizhub</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Status Pelaksanaan</label>
                  <select
                    value={pestForm.status}
                    onChange={(e) => setPestForm({ ...pestForm, status: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Selesai Tuntas">Selesai Tuntas</option>
                    <option value="Sedang Fogging">Sedang Fogging</option>
                    <option value="Terjadwal">Terjadwal</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Jenis Treatment Sanitasi *</label>
                <input
                  type="text"
                  required
                  value={pestForm.jenisTreatment}
                  onChange={(e) => setPestForm({ ...pestForm, jenisTreatment: e.target.value })}
                  placeholder="Contoh: Fogging Pengasapan Nyamuk DBD (Thermal Fogging) / Injeksi Anti Rayap"
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Area Cakupan Treatment *</label>
                <input
                  type="text"
                  required
                  value={pestForm.areaCakupan}
                  onChange={(e) => setPestForm({ ...pestForm, areaCakupan: e.target.value })}
                  placeholder="Contoh: Saluran got drainase Blok A & B, taman depan, void rumah contoh"
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Bahan Kimia / Insektisida</label>
                  <input
                    type="text"
                    value={pestForm.bahanKimia}
                    onChange={(e) => setPestForm({ ...pestForm, bahanKimia: e.target.value })}
                    placeholder="Insektisida Cynoff 50 EC + Solar"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Pelaksana & Petugas Safety</label>
                  <input
                    type="text"
                    value={pestForm.pelaksana}
                    onChange={(e) => setPestForm({ ...pestForm, pelaksana: e.target.value })}
                    placeholder="Tim GA & Danru Hartono"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Catatan & Kondisi Cuaca</label>
                <textarea
                  rows="2"
                  value={pestForm.catatan}
                  onChange={(e) => setPestForm({ ...pestForm, catatan: e.target.value })}
                  placeholder="Cuaca cerah angin tenang, evakuasi warga/pekerja 45 menit sebelum treatment..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              {/* Upload Foto Fogging (Multi-Photo) */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#34d399', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Upload Foto Pelaksanaan Treatment (Bisa Pilih Banyak Foto: APD, Asap Saluran, Alat)
                </label>
                <input
                  ref={pestFileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handlePhotosUpload(e, setPestForm)}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => pestFileRef.current && pestFileRef.current.click()}
                  style={{
                    border: '2px dashed #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    background: 'rgba(9, 13, 22, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#94a3b8',
                    fontSize: '0.78rem'
                  }}
                >
                  <UploadCloud size={16} color="#34d399" />
                  <span>Klik untuk Upload Foto Treatment (Bisa pilih beberapa foto)</span>
                </div>

                {/* Grid Preview Foto */}
                {(pestForm.photos || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {pestForm.photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #10b981' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhotoFromForm(idx, setPestForm)}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.85)', border: 'none', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsPestModalOpen(false)} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '7px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Simpan Laporan Fogging
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 5: CETAK LEMBAR CHECKLIST RESMI KOP SURAT HR & GA            */}
      {/* ------------------------------------------------------------------- */}
      {isPrintModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}
        >
          <style>
            {`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 10mm 12mm 10mm 12mm;
                }
                html, body {
                  background: #ffffff !important;
                  color: #000000 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                body * {
                  visibility: hidden !important;
                }
                .cln-print-container, .cln-print-container * {
                  visibility: visible !important;
                }
                .cln-print-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: #ffffff !important;
                  color: #000000 !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}
          </style>

          <div
            className="cln-print-container"
            style={{
              width: '100%',
              maxWidth: '820px',
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '8px',
              padding: '30px 36px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '14px',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                Pratinjau Cetak Lembar Checklist Kebersihan & Sanitasi Lingkungan
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: '#10b981',
                    border: 'none',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Printer size={14} /> Cetak (PDF / Printer)
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Kop Surat Resmi */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderBottom: '3px double #0f172a',
                paddingBottom: '14px',
                marginBottom: '16px'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1.4rem'
                }}
              >
                A
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.5px' }}>
                  PT ASHOKA MAHAKARYA SINERGI
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                  Divisi General Affair (GA) &bull; Pemeliharaan Fasilitas & Sanitasi Kawasan
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  Ashoka Park & Ashoka View &bull; Layanan Pengaduan Fasilitas: (021) 892-0192 &bull; Email: ga@ashokaproperti.com
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '14px 0 20px 0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
                LAPORAN CHECKLIST KEBERSIHAN & PENGELOLAAN SANITASI KAWASAN
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '3px' }}>
                Tanggal Laporan: <strong>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> &bull; Proyek: <strong>Ashoka Park & Ashoka View</strong>
              </div>
            </div>

            <div style={{ marginBottom: '16px', fontWeight: 800, fontSize: '0.85rem' }}>1. Rekapitulasi Checklist Kebersihan Kantor & Fasilitas</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #0f172a', borderTop: '2px solid #0f172a' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>No</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Sesi & Tanggal</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Area Fasilitas</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Petugas OB</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Pengawas GA</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Status QC</th>
                </tr>
              </thead>
              <tbody>
                {filteredChecklists.map((c, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{c.sesi} ({formatDisplayDate(c.tanggal)})</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{c.area} ({c.proyek})</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{c.petugas}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{c.pengawas}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: c.status === 'Terverifikasi QC' ? '#059669' : '#0284c7' }}>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginBottom: '10px', fontWeight: 800, fontSize: '0.85rem' }}>2. Kontrol Pengangkutan Sampah & Sanitasi TPS Kawasan</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #0f172a', borderTop: '2px solid #0f172a' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>No</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Jam & Tanggal</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Vendor / Dinas</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Lokasi TPS</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Estimasi Volume</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Status TPS</th>
                </tr>
              </thead>
              <tbody>
                {filteredWastes.map((w, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{w.jamAngkut} ({formatDisplayDate(w.tanggal)})</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{w.vendorTruk} ({w.noPlat || '-'})</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{w.lokasiTPS}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{w.estimasiVolume}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Area Tanda Tangan */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakInside: 'avoid', marginTop: '30px' }}>
              <div style={{ textAlign: 'center', width: '220px' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>Dibuat Oleh:</div>
                <div style={{ height: '65px' }} />
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                  Fajar
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Koordinator Kebersihan & GA Lapangan</div>
              </div>

              <div style={{ textAlign: 'center', width: '240px', position: 'relative' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>Bogor, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Mengetahui & Menyetujui:</div>
                <div style={{ height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      border: '2px solid #059669',
                      color: '#059669',
                      borderRadius: '50%',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'rotate(-10deg)',
                      fontWeight: 900,
                      fontSize: '0.55rem',
                      lineHeight: 1.1,
                      opacity: 0.85
                    }}
                  >
                    <div>AMS</div>
                    <div>ESTATE</div>
                    <div>HYGIENE</div>
                  </div>
                </div>
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                  Dodi Syaiful Nugroho
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Head of HR & GA</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
