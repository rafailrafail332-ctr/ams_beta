import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { fetchCloudStore, saveCloudStore } from '../supabase';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Truck,
  Eye,
  Clock,
  Calendar,
  CalendarDays,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
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
  Sparkles,
  Lock,
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';

// =============================================================================
// STORAGE KEYS & HELPER SVG PHOTO GENERATOR
// =============================================================================
const STORAGE_SECURITY_SHIFTS_KEY = 'ams_hr_security_shifts_v3';
const STORAGE_SECURITY_VISITORS_KEY = 'ams_hr_security_visitors_v3';
const STORAGE_SECURITY_MATERIALS_KEY = 'ams_hr_security_materials_v3';
const STORAGE_SECURITY_PATROLS_KEY = 'ams_hr_security_patrols_v3';

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
    <rect x="260" y="360" width="280" height="36" rx="18" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1"/>
    <text x="400" y="383" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="${accent}" text-anchor="middle">AMS SECURITY CAMERA RECORD</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// =============================================================================
// SEED DATA 4 SUB-MODUL LENGKAP DENGAN MULTI-FOTO
// =============================================================================
// 1. SEED BUKU MUTASI SHIFT JAGA
const INITIAL_SHIFTS = [
  {
    id: 'SHF-2026-001',
    noDok: 'SEC/AMS-POS/2026/1006-01',
    tanggal: '2026-10-06',
    proyek: 'Ashoka Park',
    posJaga: 'Pos Gerbang Utama (Main Gate)',
    shift: 'Shift Siang (07:00 - 19:00)',
    danru: 'Hartono (Danru)',
    personil: 'Agus Suhendra, Bambang Irawan',
    kondisi: 'Aman & Kondusif',
    inventarisPos: 'HT 3 Unit (Baik), Senter 2 Unit, Rompi 4, Kunci Portal Lengkap',
    tamuCount: 14,
    trukCount: 6,
    catatan: 'Serah terima tugas berjalan lancar. Pintu portal utama ditutup separuh saat hujan sore hari.',
    status: 'Selesai Bertugas',
    photos: [
      {
        name: 'Foto_Apel_Serah_Terima.jpg',
        caption: 'Apel Serah Terima Tugas Shift Siang di Depan Pos Utama',
        url: makeSvgPhoto('Apel Serah Terima Shift', 'Danru Hartono & Personil Jaga', '#10b981')
      },
      {
        name: 'Pemeriksaan_HT_Inventaris.jpg',
        caption: 'Pemeriksaan Kondisi Radio HT & Senter Jaga',
        url: makeSvgPhoto('Pemeriksaan Inventaris Pos', 'Radio HT 3 Unit & Senter Charger', '#38bdf8')
      }
    ]
  },
  {
    id: 'SHF-2026-002',
    noDok: 'SEC/AMS-POS/2026/1006-02',
    tanggal: '2026-10-06',
    proyek: 'Ashoka Park',
    posJaga: 'Pos Gerbang Utama (Main Gate)',
    shift: 'Shift Malam (19:00 - 07:00)',
    danru: 'Hartono (Danru)',
    personil: 'Didik Prasetyo, Rahmat Hidayat',
    kondisi: 'Aman & Terkendali',
    inventarisPos: 'HT 3 Unit (Baik), Senter Charge Penuh, Tongkat T, Jas Hujan 3',
    tamuCount: 2,
    trukCount: 0,
    catatan: 'Patroli berkala setiap 2 jam keliling kavling blok A & B, gudang material aman terkunci.',
    status: 'Sedang Bertugas',
    photos: [
      {
        name: 'Situasi_Malam_Gerbang.jpg',
        caption: 'Situasi Penerangan Gerbang Utama Malam Hari',
        url: makeSvgPhoto('Situasi Gerbang Malam', 'Portal Tertutup Siaga Pemeriksaan', '#fbbf24')
      }
    ]
  },
  {
    id: 'SHF-2026-003',
    noDok: 'SEC/AMS-POS/2026/1005-03',
    tanggal: '2026-10-05',
    proyek: 'Ashoka View',
    posJaga: 'Pos Lapangan Kavling Ashoka View',
    shift: 'Shift 24 Jam (Bergantian)',
    danru: 'Supardi (Danru View)',
    personil: 'Rahmat Hidayat & Joko Susanto',
    kondisi: 'Aman & Kondusif',
    inventarisPos: 'HT 2 Unit, Senter 2 Unit, Kunci Portal Depan',
    tamuCount: 8,
    trukCount: 3,
    catatan: 'Kunjungan calon konsumen cluster sore hari 3 rombongan diantar tim marketing.',
    status: 'Selesai Bertugas',
    photos: [
      {
        name: 'Pos_Jaga_Ashoka_View.jpg',
        caption: 'Pos Jaga Depan Lahan Proyek Ashoka View Cidokom',
        url: makeSvgPhoto('Pos Lapangan Ashoka View', 'Supardi & Rahmat Hidayat Jaga Siang', '#10b981')
      }
    ]
  }
];

// 2. SEED BUKU TAMU & KUNJUNGAN KONSUMEN
const INITIAL_VISITORS = [
  {
    id: 'VIS-2026-001',
    noDok: 'VIS/AMS-SEC/2026/1006-01',
    tanggal: '2026-10-06',
    jamMasuk: '09:15 WIB',
    jamKeluar: '10:45 WIB',
    proyek: 'Ashoka Park',
    namaTamu: 'Bpk. Hendra Gunawan & Keluarga',
    noHp: '0812-8877-6655',
    noPlat: 'B 1928 KFA (Toyota Innova Zenix)',
    kategori: 'Konsumen / Calon Pembeli',
    tujuanBertemu: 'Marketing Gallery (Ibu Fresda / Amanda)',
    keperluan: 'Cek Rumah Contoh Tipe 36/72 Blok B-05 & Simulasi KPR Bank BTN',
    status: 'Selesai Keluar',
    petugasPenerima: 'Hartono (Danru)',
    catatan: 'Sudah diantar keliling rumah contoh dengan mobil golf/berjalan kaki.',
    photos: [
      {
        name: 'Foto_Tamu_Gerbang.jpg',
        caption: 'Kunjungan Bpk. Hendra Gunawan di Pos Gerbang Utama',
        url: makeSvgPhoto('Foto Tamu di Gerbang', 'Bpk. Hendra Gunawan & Keluarga', '#38bdf8')
      },
      {
        name: 'Foto_Plat_Innova_Zenix.jpg',
        caption: 'Dokumentasi Kendaraan Plat Nomor B 1928 KFA',
        url: makeSvgPhoto('Plat Nomor B 1928 KFA', 'Toyota Innova Zenix Putih', '#10b981')
      },
      {
        name: 'Foto_Survey_Rumah_Contoh.jpg',
        caption: 'Konsumen Menuju Rumah Contoh Tipe 36/72 Blok B-05',
        url: makeSvgPhoto('Survey Rumah Contoh', 'Didampingi Marketing Fresda', '#fbbf24')
      }
    ]
  },
  {
    id: 'VIS-2026-002',
    noDok: 'VIS/AMS-SEC/2026/1006-02',
    tanggal: '2026-10-06',
    jamMasuk: '11:00 WIB',
    jamKeluar: '12:30 WIB',
    proyek: 'Ashoka Park',
    namaTamu: 'Bpk. Adi Saputra (Surveyor Appraisal)',
    noHp: '0813-2233-4455',
    noPlat: 'B 2210 SJK (Honda HR-V Hitam)',
    kategori: 'Surveyor Bank (KPR Bank BTN)',
    tujuanBertemu: 'Legal & Marketing (Ibu Wahyu Salma / Yulieka)',
    keperluan: 'Penilaian Fisik Bangunan & Lingkungan Berkas Akad Konsumen Blok A-08',
    status: 'Selesai Keluar',
    petugasPenerima: 'Agus Suhendra',
    catatan: 'Pengambilan foto fasad depan, row jalan utama, dan saluran drainase.',
    photos: [
      {
        name: 'Foto_Surveyor_Bank_BTN.jpg',
        caption: 'Surveyor KPR Bank BTN Memeriksa Bangunan',
        url: makeSvgPhoto('Surveyor Bank BTN', 'Bpk. Adi Saputra - Appraisal Blok A-08', '#38bdf8')
      },
      {
        name: 'Foto_Kendaraan_Surveyor.jpg',
        caption: 'Kendaraan Honda HR-V Plat B 2210 SJK',
        url: makeSvgPhoto('Plat Nomor B 2210 SJK', 'Honda HR-V Hitam Surveyor', '#10b981')
      }
    ]
  },
  {
    id: 'VIS-2026-003',
    noDok: 'VIS/AMS-SEC/2026/1006-03',
    tanggal: '2026-10-06',
    jamMasuk: '13:45 WIB',
    jamKeluar: '-',
    proyek: 'Ashoka Park',
    namaTamu: 'Ibu Ratna Dewi, S.H (Staf Notaris PPAT)',
    noHp: '0811-9988-1122',
    noPlat: 'B 1044 NTS (Toyota Yaris Putih)',
    kategori: 'Notaris & PPAT / BPN',
    tujuanBertemu: 'Legal Corporate (Ibu Wahyu Salma, S.H)',
    keperluan: 'Penyerahan Salinan Akta Jual Beli (AJB) & Validasi Pajak BPHTB',
    status: 'Sedang di Lokasi',
    petugasPenerima: 'Hartono (Danru)',
    catatan: 'Tamu sedang berada di ruang rapat Legal lantai 1 Marketing Gallery.',
    photos: [
      {
        name: 'Foto_Staf_Notaris.jpg',
        caption: 'Penyerahan Dokumen AJB Notaris di Pos Gerbang',
        url: makeSvgPhoto('Tamu Notaris PPAT', 'Ibu Ratna Dewi, S.H Menyerahkan Berkas', '#a855f7')
      }
    ]
  },
  {
    id: 'VIS-2026-004',
    noDok: 'VIS/AMS-SEC/2026/1005-04',
    tanggal: '2026-10-05',
    jamMasuk: '14:20 WIB',
    jamKeluar: '15:50 WIB',
    proyek: 'Ashoka View',
    namaTamu: 'Bpk. Ir. Bambang Soediro (Konsultan Struktur)',
    noHp: '0818-4455-6677',
    noPlat: 'F 1890 BG (Mitsubishi Pajero Sport)',
    kategori: 'Vendor / Rekanan Teknik',
    tujuanBertemu: 'Teknik Sipil (Pak Hapip / Direktur Teknik Yazid)',
    keperluan: 'Inspeksi Kepadatan Tanah & Tes Sondir Lereng Blok Belakang View',
    status: 'Selesai Keluar',
    petugasPenerima: 'Supardi',
    catatan: 'Pengambilan sampel tanah di kavling 15-20 selesai aman.',
    photos: [
      {
        name: 'Foto_Konsultan_Tanah.jpg',
        caption: 'Konsultan Struktur Tiba di Pos Lapangan View',
        url: makeSvgPhoto('Konsultan Struktur', 'Bpk. Ir. Bambang Soediro', '#10b981')
      }
    ]
  }
];

// 3. SEED KONTROL ARMADA TRUK MATERIAL & LOGISTIK
const INITIAL_MATERIALS = [
  {
    id: 'MAT-2026-001',
    noDok: 'MAT/AMS-GT/2026/1006-01',
    tanggal: '2026-10-06',
    jamMasuk: '08:30 WIB',
    jamKeluar: '09:25 WIB',
    proyek: 'Ashoka Park',
    namaVendor: 'PT Adhimix Precast Indonesia',
    noSuratJalan: 'SJ-ADH-2026-8819',
    jenisMaterial: 'Beton Ready Mix K-250 (Truk Molen 7 m³)',
    namaSupir: 'Yanto Sumardi',
    noPlat: 'B 9104 TYX (Truk Hino Dutro Molen)',
    lokasiBongkar: 'Kavling Blok A-12 (Pengecoran Dak Lantai 2)',
    penerima: 'Mandor Subur & QC Fajar Logistik',
    petugasSatpam: 'Hartono (Danru)',
    status: 'Selesai Bongkar & Keluar',
    catatan: 'Slump test 12±2 cm sesuai spek teknik. Bongkar lancar tidak ada tumpahan di jalan.',
    photos: [
      {
        name: 'Foto_Truk_Molen_Gerbang.jpg',
        caption: 'Truk Molen Hino Dutro B 9104 TYX di Portal Masuk',
        url: makeSvgPhoto('Truk Molen Ready Mix', 'PT Adhimix Precast B 9104 TYX', '#fbbf24')
      },
      {
        name: 'Surat_Jalan_Adhimix.jpg',
        caption: 'Surat Jalan Resmi No. SJ-ADH-2026-8819 Volume 7 m³',
        url: makeSvgPhoto('Surat Jalan Ready Mix', 'Volume 7 m3 - Cor Dak Blok A-12', '#10b981')
      },
      {
        name: 'Foto_Bongkar_Cor_Kavling.jpg',
        caption: 'Proses Pengecoran Dak Lantai 2 Didampingi Mandor Subur',
        url: makeSvgPhoto('Proses Bongkar Beton', 'Mandor Subur & Tim Lapangan', '#38bdf8')
      }
    ]
  },
  {
    id: 'MAT-2026-002',
    noDok: 'MAT/AMS-GT/2026/1006-02',
    tanggal: '2026-10-06',
    jamMasuk: '10:15 WIB',
    jamKeluar: '11:10 WIB',
    proyek: 'Ashoka Park',
    namaVendor: 'TB Sinar Terang Abadi Parung',
    noSuratJalan: 'STA/DO/X/2026-102',
    jenisMaterial: 'Pasir Pasang Extra Cuci Bangka (1 Dump Truk / 8 m³)',
    namaSupir: 'Roni Suhendar',
    noPlat: 'F 8820 FG (Colt Diesel Canter Kuning)',
    lokasiBongkar: 'Gudang Terbuka Lapangan Blok B Samping',
    penerima: 'Mandor Subur',
    petugasSatpam: 'Agus Suhendra',
    status: 'Selesai Bongkar & Keluar',
    catatan: 'Pasir bersih tidak berlumpur, sudah di-cek mandor dan diarahkan ke stok cadangan.',
    photos: [
      {
        name: 'Foto_Dumptruk_Pasir.jpg',
        caption: 'Dumptruk Pasir Bangka F 8820 FG Tiba di Gerbang',
        url: makeSvgPhoto('Truk Pasir Bangka 8 m3', 'TB Sinar Terang F 8820 FG', '#fbbf24')
      },
      {
        name: 'Foto_Surat_Jalan_Pasir.jpg',
        caption: 'Surat Jalan DO Pasir Bangka Terstempel Satpam',
        url: makeSvgPhoto('Surat Jalan Pasir', 'Penerima: Mandor Subur', '#10b981')
      }
    ]
  },
  {
    id: 'MAT-2026-003',
    noDok: 'MAT/AMS-GT/2026/1006-03',
    tanggal: '2026-10-06',
    jamMasuk: '13:00 WIB',
    jamKeluar: '-',
    proyek: 'Ashoka Park',
    namaVendor: 'PT Powerblock Indonesia',
    noSuratJalan: 'PBI-SJ-2026-0941',
    jenisMaterial: 'Bata Ringan Hebel AAC Tebal 10 cm (1 Dooring / 12 Pallet)',
    namaSupir: 'Ujang Kurniawan',
    noPlat: 'B 9482 KDA (Fuso Engkel Bak Kayu)',
    lokasiBongkar: 'Depan Kavling Blok B-03 & B-04',
    penerima: 'Fajar (Logistik GA)',
    petugasSatpam: 'Hartono (Danru)',
    status: 'Sedang Bongkar',
    catatan: 'Kondisi bata utuh, tingkat patahan < 1%. Sedang proses bongkar pallet di kavling.',
    photos: [
      {
        name: 'Foto_Truk_Hebel.jpg',
        caption: 'Truk Engkel Fuso B 9482 KDA Muatan 12 Pallet Hebel',
        url: makeSvgPhoto('Truk Bata Ringan Hebel', 'PT Powerblock B 9482 KDA', '#fbbf24')
      }
    ]
  },
  {
    id: 'MAT-2026-004',
    noDok: 'MAT/AMS-GT/2026/1005-04',
    tanggal: '2026-10-05',
    jamMasuk: '15:10 WIB',
    jamKeluar: '16:00 WIB',
    proyek: 'Ashoka View',
    namaVendor: 'PT Master Steel MFG',
    noSuratJalan: 'MS-2026-BSI-771',
    jenisMaterial: 'Besi Beton Ulir D10 & D13 SNI (Total 350 Batang)',
    namaSupir: 'Dedi Mulyadi',
    noPlat: 'B 9031 TY (Isuzu Giga Long)',
    lokasiBongkar: 'Gudang Tertutup Besi Site Ashoka View',
    penerima: 'Mandor Kholidin',
    petugasSatpam: 'Supardi',
    status: 'Selesai Bongkar & Keluar',
    catatan: 'Penghitungan fisik bersama mandor lengkap 350 batang, disimpan di rak besi bertutup terpal.',
    photos: [
      {
        name: 'Foto_Truk_Besi.jpg',
        caption: 'Truk Tronton Isuzu Giga Muatan Besi Beton SNI',
        url: makeSvgPhoto('Truk Besi Beton SNI', 'PT Master Steel B 9031 TY', '#fbbf24')
      }
    ]
  }
];

// 4. SEED PATROLI KAWASAN & INSIDEN
const INITIAL_PATROLS = [
  {
    id: 'PTR-2026-001',
    noDok: 'PTR/AMS-SEC/2026/1006-01',
    tanggal: '2026-10-06',
    jamPatroli: '01:00 WIB',
    proyek: 'Ashoka Park',
    petugas: 'Bambang Irawan & Didik Prasetyo',
    rutePatroli: 'Gerbang Utama -> Blok A -> Blok B -> Gudang Semen -> Mess Pekerja',
    kondisiLampu: 'PJU Menyala Normal 18 Titik',
    kondisiPagar: 'Pagar Keliling Aman, Gembok Gudang Semen Terkunci',
    statusKawasan: 'Aman Kondusif',
    status: 'Verified Patrol',
    catatan: 'Genset dan panel PLN terkunci rapat. Tidak ditemukan aktivitas orang asing mencurigakan.',
    photos: [
      {
        name: 'Patroli_PJU_BlokA.jpg',
        caption: 'Pemeriksaan Lampu PJU Blok A Menyala Terang',
        url: makeSvgPhoto('PJU Menyala Normal', 'Pemeriksaan PJU Jalan Boulevard', '#10b981')
      },
      {
        name: 'Pemeriksaan_Gudang_Semen.jpg',
        caption: 'Gembok Gudang Semen & Material Terkunci Rapat',
        url: makeSvgPhoto('Gudang Semen Terkunci', 'Gembok Master Gudang Utuh', '#38bdf8')
      },
      {
        name: 'Pagar_Perimeter_Belakang.jpg',
        caption: 'Batas Perimeter Lahan Belakang Aman Terkendali',
        url: makeSvgPhoto('Pagar Perimeter Belakang', 'Kondisi Aman Tanpa Aktivitas Asing', '#a855f7')
      }
    ]
  },
  {
    id: 'PTR-2026-002',
    noDok: 'PTR/AMS-SEC/2026/1006-02',
    tanggal: '2026-10-06',
    jamPatroli: '03:00 WIB',
    proyek: 'Ashoka Park',
    petugas: 'Bambang Irawan & Didik Prasetyo',
    rutePatroli: 'Gerbang Utama -> Marketing Gallery -> Rumah Contoh -> Pagar Belakang Kavling',
    kondisiLampu: 'Lampu Gallery & Taman Menyala Terang',
    kondisiPagar: 'Pagar Seng Batas Lahan Belakang Utuh & Terkunci',
    statusKawasan: 'Aman Kondusif',
    status: 'Verified Patrol',
    catatan: 'Cuaca gerimis ringan, air saluran mengalir lancar tidak ada sumbatan.',
    photos: [
      {
        name: 'Gallery_Malam_Hari.jpg',
        caption: 'Marketing Gallery & Showroom Maket Terkunci Rapat',
        url: makeSvgPhoto('Marketing Gallery Aman', 'Pintu Kaca Utama Terkunci Rapat', '#10b981')
      }
    ]
  },
  {
    id: 'PTR-2026-003',
    noDok: 'PTR/AMS-SEC/2026/1006-03',
    tanggal: '2026-10-06',
    jamPatroli: '05:00 WIB',
    proyek: 'Ashoka Park',
    petugas: 'Hartono (Danru) & Agus Suhendra',
    rutePatroli: 'Pintu Gerbang Utama -> Pos Satpam -> Parkir VIP -> Mess Pekerja',
    kondisiLampu: 'Lampu PJU Dipadamkan Otomatis Jam 05:30',
    kondisiPagar: 'Pintu Portal Utama Dibuka Bertahap',
    statusKawasan: 'Aman Kondusif',
    status: 'Verified Patrol',
    catatan: 'Pekerja proyek mulai bangun beraktivitas normal. Situasi terkendali siap serah terima.',
    photos: [
      {
        name: 'Pagi_Gerbang_Utama.jpg',
        caption: 'Pintu Portal Dibuka Siap Menyambut Pekerja & Konsumen',
        url: makeSvgPhoto('Gerbang Siap Buka Pagi', 'Danru Hartono & Agus Suhendra', '#10b981')
      }
    ]
  },
  {
    id: 'PTR-2026-004',
    noDok: 'PTR/AMS-SEC/2026/1005-04',
    tanggal: '2026-10-05',
    jamPatroli: '23:30 WIB',
    proyek: 'Ashoka View',
    petugas: 'Supardi & Rahmat Hidayat',
    rutePatroli: 'Gerbang Depan Cidokom -> Lahan Kavling Atas -> Gardu PLN',
    kondisiLampu: 'Sorot LED 100W Pos Jaga Menyala Normal',
    kondisiPagar: 'Portal Besi Dirantai Gembok Master',
    statusKawasan: 'Aman Kondusif',
    status: 'Verified Patrol',
    catatan: 'Pengecekan armada pick-up operasional terparkir rapi di dekat pos jaga.',
    photos: [
      {
        name: 'Patroli_Lahan_View.jpg',
        caption: 'Pengecekan Armada Operasional & Portal Depan View',
        url: makeSvgPhoto('Portal Depan Ashoka View', 'Supardi & Rahmat Hidayat Kontrol 23:30', '#10b981')
      }
    ]
  }
];

export const SecurityModule = ({
  currentUser,
  showNotification,
  onSwitchTab,
  employees
}) => {
  // ---------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Sub-tabs: 'mutasi-shift' | 'buku-tamu' | 'truk-material' | 'patroli-insiden'
  const [activeSubTab, setActiveSubTab] = useState('mutasi-shift');

  // Stores (100% MySQL Database Terpusat, Zero LocalStorage)
  const [shifts, setShifts] = useState(INITIAL_SHIFTS);
  const [visitors, setVisitors] = useState(INITIAL_VISITORS);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [patrols, setPatrols] = useState(INITIAL_PATROLS);
  const isSecurityLoadedRef = useRef(false);

  // Initial fetch from MySQL Database on Sengked Hosting
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchCloudStore(STORAGE_SECURITY_SHIFTS_KEY, INITIAL_SHIFTS),
      fetchCloudStore(STORAGE_SECURITY_VISITORS_KEY, INITIAL_VISITORS),
      fetchCloudStore(STORAGE_SECURITY_MATERIALS_KEY, INITIAL_MATERIALS),
      fetchCloudStore(STORAGE_SECURITY_PATROLS_KEY, INITIAL_PATROLS)
    ]).then(([sVal, vVal, mVal, pVal]) => {
      if (isMounted) {
        if (sVal && Array.isArray(sVal) && sVal.length > 0) setShifts(sVal);
        if (vVal && Array.isArray(vVal) && vVal.length > 0) setVisitors(vVal);
        if (mVal && Array.isArray(mVal) && mVal.length > 0) setMaterials(mVal);
        if (pVal && Array.isArray(pVal) && pVal.length > 0) setPatrols(pVal);
        isSecurityLoadedRef.current = true;
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Save changes to MySQL Database Terpusat
  useEffect(() => {
    if (isSecurityLoadedRef.current) {
      saveCloudStore(STORAGE_SECURITY_SHIFTS_KEY, shifts);
    }
  }, [shifts]);

  useEffect(() => {
    if (isSecurityLoadedRef.current) {
      saveCloudStore(STORAGE_SECURITY_VISITORS_KEY, visitors);
    }
  }, [visitors]);

  useEffect(() => {
    if (isSecurityLoadedRef.current) {
      saveCloudStore(STORAGE_SECURITY_MATERIALS_KEY, materials);
    }
  }, [materials]);

  useEffect(() => {
    if (isSecurityLoadedRef.current) {
      saveCloudStore(STORAGE_SECURITY_PATROLS_KEY, patrols);
    }
  }, [patrols]);

  // Filter States
  const todayStr = new Date().toISOString().split('T')[0];
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [projectFilter, setProjectFilter] = useState('ALL');

  // Modals Form
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isPatrolModalOpen, setIsPatrolModalOpen] = useState(false);
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
  const [detailType, setDetailType] = useState('shift'); // 'shift', 'visitor', 'material', 'patrol'

  // Ref Input File Upload untuk masing-masing form
  const shiftFileRef = useRef(null);
  const visitorFileRef = useRef(null);
  const materialFileRef = useRef(null);
  const patrolFileRef = useRef(null);

  // Form States
  const [shiftForm, setShiftForm] = useState({
    tanggal: todayStr,
    proyek: 'Ashoka Park',
    posJaga: 'Pos Gerbang Utama (Main Gate)',
    shift: 'Shift Siang (07:00 - 19:00)',
    danru: 'Hartono (Danru)',
    personil: '',
    kondisi: 'Aman & Kondusif',
    inventarisPos: 'HT 3 Unit, Senter 2 Unit, Rompi 4, Kunci Portal',
    catatan: '',
    status: 'Sedang Bertugas',
    photos: []
  });

  const [visitorForm, setVisitorForm] = useState({
    tanggal: todayStr,
    jamMasuk: '09:00 WIB',
    jamKeluar: '-',
    proyek: 'Ashoka Park',
    namaTamu: '',
    noHp: '',
    noPlat: '',
    kategori: 'Konsumen / Calon Pembeli',
    tujuanBertemu: 'Marketing Gallery (Ibu Fresda / Amanda)',
    keperluan: '',
    status: 'Sedang di Lokasi',
    petugasPenerima: 'Hartono (Danru)',
    catatan: '',
    photos: []
  });

  const [materialForm, setMaterialForm] = useState({
    tanggal: todayStr,
    jamMasuk: '08:30 WIB',
    jamKeluar: '-',
    proyek: 'Ashoka Park',
    namaVendor: '',
    noSuratJalan: '',
    jenisMaterial: '',
    namaSupir: '',
    noPlat: '',
    lokasiBongkar: 'Kavling Blok A',
    penerima: 'Mandor Subur & Logistik',
    petugasSatpam: 'Hartono (Danru)',
    status: 'Sedang Bongkar',
    catatan: '',
    photos: []
  });

  const [patrolForm, setPatrolForm] = useState({
    tanggal: todayStr,
    jamPatroli: '01:00 WIB',
    proyek: 'Ashoka Park',
    petugas: 'Bambang Irawan & Didik Prasetyo',
    rutePatroli: 'Gerbang Utama -> Blok A -> Blok B -> Gudang Semen',
    kondisiLampu: 'PJU Menyala Terang',
    kondisiPagar: 'Pagar Keliling Aman Terkunci',
    statusKawasan: 'Aman Kondusif',
    status: 'Verified Patrol',
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
  const filteredShifts = useMemo(() => {
    return shifts.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.noDok && item.noDok.toLowerCase().includes(q)) ||
        (item.danru && item.danru.toLowerCase().includes(q)) ||
        (item.personil && item.personil.toLowerCase().includes(q)) ||
        (item.posJaga && item.posJaga.toLowerCase().includes(q));

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
  }, [shifts, searchTerm, startDate, endDate, projectFilter]);

  const filteredVisitors = useMemo(() => {
    return visitors.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.namaTamu && item.namaTamu.toLowerCase().includes(q)) ||
        (item.noPlat && item.noPlat.toLowerCase().includes(q)) ||
        (item.noHp && item.noHp.toLowerCase().includes(q)) ||
        (item.kategori && item.kategori.toLowerCase().includes(q)) ||
        (item.keperluan && item.keperluan.toLowerCase().includes(q));

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
  }, [visitors, searchTerm, startDate, endDate, projectFilter]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.noSuratJalan && item.noSuratJalan.toLowerCase().includes(q)) ||
        (item.namaVendor && item.namaVendor.toLowerCase().includes(q)) ||
        (item.jenisMaterial && item.jenisMaterial.toLowerCase().includes(q)) ||
        (item.noPlat && item.noPlat.toLowerCase().includes(q)) ||
        (item.namaSupir && item.namaSupir.toLowerCase().includes(q));

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
  }, [materials, searchTerm, startDate, endDate, projectFilter]);

  const filteredPatrols = useMemo(() => {
    return patrols.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.petugas && item.petugas.toLowerCase().includes(q)) ||
        (item.rutePatroli && item.rutePatroli.toLowerCase().includes(q)) ||
        (item.catatan && item.catatan.toLowerCase().includes(q));

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
  }, [patrols, searchTerm, startDate, endDate, projectFilter]);

  // Top KPI Stats
  const metrics = useMemo(() => {
    const totalShifts = shifts.length;
    const totalVisitors = visitors.length;
    const activeVisitors = visitors.filter(v => v.status === 'Sedang di Lokasi').length;
    const totalMaterials = materials.length;
    const totalPatrols = patrols.length;

    return {
      totalShifts,
      totalVisitors,
      activeVisitors,
      totalMaterials,
      totalPatrols
    };
  }, [shifts, visitors, materials, patrols]);

  // ---------------------------------------------------------------------------
  // 3. ACTION HANDLERS & STATUS TOGGLES
  // ---------------------------------------------------------------------------
  const handleResetFilter = () => {
    setSearchTerm('');
    setStartDate('2026-10-01');
    setEndDate('2026-10-31');
    setProjectFilter('ALL');
    showNotification && showNotification('Filter tanggal dan kriteria pos keamanan telah di-reset.', 'info');
  };

  // Buka Galeri Slider
  const openGallery = (photos, title) => {
    if (!photos || photos.length === 0) {
      showNotification && showNotification('Belum ada foto dokumentasi yang diunggah untuk data ini.', 'info');
      return;
    }
    setGalleryPhotos(photos);
    setGalleryTitle(title || 'Dokumentasi Pos Keamanan');
    setActivePhotoIdx(0);
    setIsGalleryOpen(true);
  };

  // Buka Detail Lengkap
  const openDetail = (item, type) => {
    setDetailItem(item);
    setDetailType(type);
    setIsDetailModalOpen(true);
  };

  // Toggle Status Cepat (Buku Mutasi)
  const toggleShiftStatus = (id) => {
    setShifts(prev =>
      prev.map(s => {
        if (s.id === id) {
          const nextStatus = s.status === 'Sedang Bertugas' ? 'Selesai Bertugas' : 'Sedang Bertugas';
          showNotification && showNotification(`Status shift diubah menjadi: ${nextStatus}`, 'success');
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  // Toggle Status Cepat (Buku Tamu)
  const toggleVisitorStatus = (id) => {
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setVisitors(prev =>
      prev.map(v => {
        if (v.id === id) {
          const nextStatus = v.status === 'Sedang di Lokasi' ? 'Selesai Keluar' : 'Sedang di Lokasi';
          const nextJamKeluar = nextStatus === 'Selesai Keluar' ? timeNow : '-';
          showNotification && showNotification(`Status tamu diubah menjadi: ${nextStatus}`, 'success');
          return { ...v, status: nextStatus, jamKeluar: nextJamKeluar };
        }
        return v;
      })
    );
  };

  // Toggle Status Cepat (Truk Material)
  const toggleMaterialStatus = (id) => {
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setMaterials(prev =>
      prev.map(m => {
        if (m.id === id) {
          let nextStatus = 'Selesai Bongkar & Keluar';
          if (m.status === 'Selesai Bongkar & Keluar') nextStatus = 'Sedang Bongkar';
          const nextJamKeluar = nextStatus === 'Selesai Bongkar & Keluar' ? timeNow : '-';
          showNotification && showNotification(`Status truk material diubah menjadi: ${nextStatus}`, 'success');
          return { ...m, status: nextStatus, jamKeluar: nextJamKeluar };
        }
        return m;
      })
    );
  };

  // Toggle Status Cepat (Patroli)
  const togglePatrolStatus = (id) => {
    setPatrols(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'Verified Patrol' ? 'Perlu Tindak Lanjut' : 'Verified Patrol';
          showNotification && showNotification(`Status patroli diubah menjadi: ${nextStatus}`, 'info');
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Delete Handlers
  const handleDeleteItem = (id, type) => {
    if (!window.confirm('Yakin ingin menghapus catatan pos keamanan ini?')) return;
    if (type === 'shift') setShifts(prev => prev.filter(x => x.id !== id));
    if (type === 'visitor') setVisitors(prev => prev.filter(x => x.id !== id));
    if (type === 'material') setMaterials(prev => prev.filter(x => x.id !== id));
    if (type === 'patrol') setPatrols(prev => prev.filter(x => x.id !== id));
    showNotification && showNotification('Catatan keamanan berhasil dihapus.', 'info');
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

  // Submit Shift
  const handleSubmitShift = (e) => {
    e.preventDefault();
    if (editingItem) {
      setShifts(prev =>
        prev.map(x => (x.id === editingItem.id ? { ...x, ...shiftForm } : x))
      );
      showNotification && showNotification('Buku mutasi shift jaga berhasil diperbarui!', 'success');
    } else {
      const newShift = {
        id: `SHF-${Date.now()}`,
        noDok: `SEC/AMS-POS/2026/${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 90)}`,
        ...shiftForm,
        tamuCount: 0,
        trukCount: 0
      };
      setShifts([newShift, ...shifts]);
      showNotification && showNotification('Buku mutasi shift jaga berhasil dicatat!', 'success');
    }
    setIsShiftModalOpen(false);
    setEditingItem(null);
  };

  // Submit Visitor
  const handleSubmitVisitor = (e) => {
    e.preventDefault();
    if (!visitorForm.namaTamu) {
      showNotification && showNotification('Nama tamu wajib diisi.', 'warning');
      return;
    }
    if (editingItem) {
      setVisitors(prev =>
        prev.map(x => (x.id === editingItem.id ? { ...x, ...visitorForm } : x))
      );
      showNotification && showNotification('Data kunjungan tamu berhasil diperbarui!', 'success');
    } else {
      const newVis = {
        id: `VIS-${Date.now()}`,
        noDok: `VIS/AMS-SEC/2026/${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 90)}`,
        ...visitorForm
      };
      setVisitors([newVis, ...visitors]);
      showNotification && showNotification(`Tamu "${newVis.namaTamu}" berhasil dicatat di gerbang!`, 'success');
    }
    setIsVisitorModalOpen(false);
    setEditingItem(null);
  };

  // Submit Material
  const handleSubmitMaterial = (e) => {
    e.preventDefault();
    if (!materialForm.namaVendor || !materialForm.jenisMaterial) {
      showNotification && showNotification('Vendor dan jenis material wajib diisi.', 'warning');
      return;
    }
    if (editingItem) {
      setMaterials(prev =>
        prev.map(x => (x.id === editingItem.id ? { ...x, ...materialForm } : x))
      );
      showNotification && showNotification('Data armada truk material berhasil diperbarui!', 'success');
    } else {
      const newMat = {
        id: `MAT-${Date.now()}`,
        noDok: `MAT/AMS-GT/2026/${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 90)}`,
        ...materialForm
      };
      setMaterials([newMat, ...materials]);
      showNotification && showNotification(`Truk material dari "${newMat.namaVendor}" berhasil dicatat!`, 'success');
    }
    setIsMaterialModalOpen(false);
    setEditingItem(null);
  };

  // Submit Patrol
  const handleSubmitPatrol = (e) => {
    e.preventDefault();
    if (editingItem) {
      setPatrols(prev =>
        prev.map(x => (x.id === editingItem.id ? { ...x, ...patrolForm } : x))
      );
      showNotification && showNotification('Log patroli berhasil diperbarui!', 'success');
    } else {
      const newPtr = {
        id: `PTR-${Date.now()}`,
        noDok: `PTR/AMS-SEC/2026/${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 90)}`,
        ...patrolForm
      };
      setPatrols([newPtr, ...patrols]);
      showNotification && showNotification('Checklist patroli keliling berhasil disimpan!', 'success');
    }
    setIsPatrolModalOpen(false);
    setEditingItem(null);
  };

  // Export Excel
  const handleExportExcel = () => {
    try {
      let dataToExport = [];
      let filename = 'AMS_Keamanan_Rekap.xlsx';

      if (activeSubTab === 'mutasi-shift') {
        dataToExport = filteredShifts.map((s, idx) => ({
          'No': idx + 1,
          'No Dokumen': s.noDok,
          'Tanggal': s.tanggal,
          'Proyek': s.proyek,
          'Pos Jaga': s.posJaga,
          'Shift': s.shift,
          'Danru': s.danru,
          'Personil Regu': s.personil,
          'Kondisi Keamanan': s.kondisi,
          'Inventaris Pos': s.inventarisPos,
          'Catatan Kejadian': s.catatan,
          'Jumlah Foto': (s.photos || []).length,
          'Status': s.status
        }));
        filename = 'AMS_Buku_Mutasi_Satpam.xlsx';
      } else if (activeSubTab === 'buku-tamu') {
        dataToExport = filteredVisitors.map((v, idx) => ({
          'No': idx + 1,
          'No Dokumen': v.noDok,
          'Tanggal': v.tanggal,
          'Jam Masuk': v.jamMasuk,
          'Jam Keluar': v.jamKeluar,
          'Proyek': v.proyek,
          'Nama Tamu': v.namaTamu,
          'No HP': v.noHp,
          'No Plat Polisi': v.noPlat,
          'Kategori Tamu': v.kategori,
          'Tujuan Bertemu': v.tujuanBertemu,
          'Keperluan': v.keperluan,
          'Status Kunjungan': v.status,
          'Jumlah Foto': (v.photos || []).length,
          'Petugas Penerima': v.petugasPenerima
        }));
        filename = 'AMS_Buku_Tamu_Konsumen.xlsx';
      } else if (activeSubTab === 'truk-material') {
        dataToExport = filteredMaterials.map((m, idx) => ({
          'No': idx + 1,
          'No Dokumen': m.noDok,
          'Tanggal': m.tanggal,
          'Jam Masuk': m.jamMasuk,
          'Jam Keluar': m.jamKeluar,
          'Proyek': m.proyek,
          'Nama Vendor': m.namaVendor,
          'No Surat Jalan': m.noSuratJalan,
          'Jenis Material': m.jenisMaterial,
          'Nama Supir': m.namaSupir,
          'No Plat Truk': m.noPlat,
          'Lokasi Bongkar': m.lokasiBongkar,
          'Penerima Lapangan': m.penerima,
          'Status': m.status,
          'Jumlah Foto': (m.photos || []).length
        }));
        filename = 'AMS_Kontrol_Truk_Material.xlsx';
      } else {
        dataToExport = filteredPatrols.map((p, idx) => ({
          'No': idx + 1,
          'No Dokumen': p.noDok,
          'Tanggal': p.tanggal,
          'Jam Patroli': p.jamPatroli,
          'Proyek': p.proyek,
          'Petugas Patroli': p.petugas,
          'Rute Kontrol': p.rutePatroli,
          'Kondisi PJU': p.kondisiLampu,
          'Pagar Perimeter': p.kondisiPagar,
          'Status Kawasan': p.statusKawasan,
          'Status': p.status,
          'Jumlah Foto': (p.photos || []).length,
          'Catatan': p.catatan
        }));
        filename = 'AMS_Patroli_Keamanan.xlsx';
      }

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Keamanan');
      XLSX.writeFile(workbook, filename);
      showNotification && showNotification('Laporan keamanan berhasil diunduh dalam format Excel!', 'success');
    } catch (err) {
      console.error(err);
      showNotification && showNotification('Gagal mengunduh file Excel.', 'danger');
    }
  };

  // ---------------------------------------------------------------------------
  // 4. RENDER UTAMA
  // ---------------------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ------------------------------------------------------------------- */}
      {/* HEADER SECTION                                                      */}
      {/* ------------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '1.4rem 1.6rem',
          borderRadius: '14px',
          border: '1px solid #1e293b',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 22, 0.98))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Modul Keamanan & Pos Satpam Kawasan
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                Manajemen buku mutasi shift satpam, buku tamu, kontrol truk material, dan patroli malam (lengkap dengan upload & geser foto).
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {activeSubTab === 'mutasi-shift' && (
            <button
              onClick={() => {
                setEditingItem(null);
                setShiftForm({
                  tanggal: todayStr,
                  proyek: 'Ashoka Park',
                  posJaga: 'Pos Gerbang Utama (Main Gate)',
                  shift: 'Shift Siang (07:00 - 19:00)',
                  danru: 'Hartono (Danru)',
                  personil: '',
                  kondisi: 'Aman & Kondusif',
                  inventarisPos: 'HT 3 Unit, Senter 2 Unit, Rompi 4, Kunci Portal',
                  catatan: '',
                  status: 'Sedang Bertugas',
                  photos: []
                });
                setIsShiftModalOpen(true);
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
              <Plus size={15} /> Catat Mutasi Shift
            </button>
          )}

          {activeSubTab === 'buku-tamu' && (
            <button
              onClick={() => {
                setEditingItem(null);
                setVisitorForm({
                  tanggal: todayStr,
                  jamMasuk: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                  jamKeluar: '-',
                  proyek: 'Ashoka Park',
                  namaTamu: '',
                  noHp: '',
                  noPlat: '',
                  kategori: 'Konsumen / Calon Pembeli',
                  tujuanBertemu: 'Marketing Gallery (Ibu Fresda / Amanda)',
                  keperluan: '',
                  status: 'Sedang di Lokasi',
                  petugasPenerima: 'Hartono (Danru)',
                  catatan: '',
                  photos: []
                });
                setIsVisitorModalOpen(true);
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
              <Plus size={15} /> Catat Tamu & Konsumen
            </button>
          )}

          {activeSubTab === 'truk-material' && (
            <button
              onClick={() => {
                setEditingItem(null);
                setMaterialForm({
                  tanggal: todayStr,
                  jamMasuk: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                  jamKeluar: '-',
                  proyek: 'Ashoka Park',
                  namaVendor: '',
                  noSuratJalan: '',
                  jenisMaterial: '',
                  namaSupir: '',
                  noPlat: '',
                  lokasiBongkar: 'Kavling Blok A',
                  penerima: 'Mandor Subur & Logistik',
                  petugasSatpam: 'Hartono (Danru)',
                  status: 'Sedang Bongkar',
                  catatan: '',
                  photos: []
                });
                setIsMaterialModalOpen(true);
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
              <Plus size={15} /> Catat Truk Material
            </button>
          )}

          {activeSubTab === 'patroli-insiden' && (
            <button
              onClick={() => {
                setEditingItem(null);
                setPatrolForm({
                  tanggal: todayStr,
                  jamPatroli: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                  proyek: 'Ashoka Park',
                  petugas: 'Bambang Irawan & Didik Prasetyo',
                  rutePatroli: 'Gerbang Utama -> Blok A -> Blok B -> Gudang Semen',
                  kondisiLampu: 'PJU Menyala Terang',
                  kondisiPagar: 'Pagar Keliling Aman Terkunci',
                  statusKawasan: 'Aman Kondusif',
                  status: 'Verified Patrol',
                  catatan: '',
                  photos: []
                });
                setIsPatrolModalOpen(true);
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
              <Plus size={15} /> Catat Patroli Kavling
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
            title="Download Laporan Excel (.xlsx)"
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
            title="Cetak Lembar Mutasi Resmi Kop Surat"
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
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Log Mutasi Shift Satpam
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              {metrics.totalShifts} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Shift</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <ShieldCheck size={12} /> Serah Terima Terdata
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Buku Tamu Konsumen
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
              {metrics.totalVisitors} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Kunjungan</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <Users size={12} /> {metrics.activeVisitors} Sedang di Lokasi
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Armada Truk Material
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#fbbf24', marginTop: '2px' }}>
              {metrics.totalMaterials} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Armada</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <Truck size={12} /> Surat Jalan Diverifikasi
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.25)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={20} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Patroli Keliling Kavling
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
              {metrics.totalPatrols} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Ronde</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <Radio size={12} /> 100% Kondusif & Terkendali
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.25)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={20} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* KONTAK DARURAT PROYEK & KAWASAN WIDGET                              */}
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
          <PhoneCall size={16} color="#fbbf24" />
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#cbd5e1' }}>
            Kontak Cepat Keamanan & Tanggap Darurat:
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '0.74rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#64748b' }}>Danru Hartono:</span>
            <strong style={{ color: '#10b981' }}>0857-1122-3399</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#64748b' }}>Bhabinkamtibmas:</span>
            <strong style={{ color: '#38bdf8' }}>0813-8821-9901</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#64748b' }}>Polsek Parung:</span>
            <strong style={{ color: '#f8fafc' }}>(0251) 861-5110</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#64748b' }}>Damkar:</span>
            <strong style={{ color: '#f87171' }}>113 / (021) 875-3113</strong>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4 SUB-TAB NAVIGASI                                                  */}
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
          onClick={() => setActiveSubTab('mutasi-shift')}
          style={{
            background: activeSubTab === 'mutasi-shift' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'mutasi-shift' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'mutasi-shift' ? '#10b981' : '#94a3b8',
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
          <ShieldCheck size={16} />
          <span>1. Buku Mutasi & Shift Jaga</span>
          <span style={{ background: activeSubTab === 'mutasi-shift' ? '#10b981' : '#334155', color: activeSubTab === 'mutasi-shift' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            {filteredShifts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('buku-tamu')}
          style={{
            background: activeSubTab === 'buku-tamu' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'buku-tamu' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'buku-tamu' ? '#10b981' : '#94a3b8',
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
          <Users size={16} />
          <span>2. Buku Tamu & Konsumen</span>
          <span style={{ background: activeSubTab === 'buku-tamu' ? '#10b981' : '#334155', color: activeSubTab === 'buku-tamu' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            {filteredVisitors.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('truk-material')}
          style={{
            background: activeSubTab === 'truk-material' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'truk-material' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'truk-material' ? '#10b981' : '#94a3b8',
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
          <span>3. Kontrol Truk Material</span>
          <span style={{ background: activeSubTab === 'truk-material' ? '#10b981' : '#334155', color: activeSubTab === 'truk-material' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            {filteredMaterials.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('patroli-insiden')}
          style={{
            background: activeSubTab === 'patroli-insiden' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'patroli-insiden' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'patroli-insiden' ? '#10b981' : '#94a3b8',
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
          <Radio size={16} />
          <span>4. Patroli Kavling & Insiden</span>
          <span style={{ background: activeSubTab === 'patroli-insiden' ? '#10b981' : '#334155', color: activeSubTab === 'patroli-insiden' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            {filteredPatrols.length}
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
            <span>Filter Tanggal & Pos Keamanan</span>
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
                placeholder="Cari petugas, tamu, plat, surat jalan..."
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
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Titik Proyek</label>
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
              <option value="ALL">Semua Titik Proyek</option>
              <option value="PARK">Ashoka Park</option>
              <option value="VIEW">Ashoka View</option>
              <option value="HO">Head Office Bizhub</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* KONTEN TAB 1: BUKU MUTASI & SHIFT JAGA                              */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'mutasi-shift' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Buku Mutasi & Serah Terima Tugas Jaga Satpam
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Laporan pergantian shift, personil regu, checklist inventaris pos, dan foto serah terima tugas.
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Total: <strong style={{ color: '#10b981' }}>{filteredShifts.length}</strong> shift tercatat
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Tanggal & Shift</th>
                  <th style={{ padding: '10px 14px' }}>Pos & Proyek</th>
                  <th style={{ padding: '10px 14px' }}>Danru & Personil</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Dokumentasi Foto</th>
                  <th style={{ padding: '10px 14px' }}>Situasi & Catatan</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status Shift</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredShifts.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada catatan mutasi shift yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredShifts.map((shift, idx) => {
                    const photosCount = (shift.photos || []).length;
                    return (
                      <tr key={shift.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>{shift.shift}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {formatDisplayDate(shift.tanggal)} &bull; {shift.noDok}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#cbd5e1' }}>{shift.posJaga}</div>
                          <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            <MapPin size={11} /> {shift.proyek}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#34d399' }}>{shift.danru}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{shift.personil}</div>
                        </td>
                        {/* Tombol Lihat Foto Slider */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => openGallery(shift.photos, `Foto Mutasi Shift: ${shift.noDok} - ${shift.shift}`)}
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
                            {shift.kondisi}
                          </div>
                          <div style={{ fontSize: '0.73rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {shift.catatan}
                          </div>
                        </td>
                        {/* Status Shift dengan Toggle Cepat */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleShiftStatus(shift.id)}
                            style={{
                              background: shift.status === 'Sedang Bertugas' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              border: shift.status === 'Sedang Bertugas' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                              color: shift.status === 'Sedang Bertugas' ? '#38bdf8' : '#10b981',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Klik untuk mengubah status shift (Sedang Bertugas / Selesai)"
                          >
                            <Check size={11} /> {shift.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(shift, 'shift')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}
                              title="Lihat Detail Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(shift);
                                setShiftForm({ ...shift });
                                setIsShiftModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}
                              title="Edit Catatan Shift"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(shift.id, 'shift')}
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
      {/* KONTEN TAB 2: BUKU TAMU & KUNJUNGAN KONSUMEN                        */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'buku-tamu' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Buku Tamu & Kunjungan Konsumen / Calon Pembeli
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Pencatatan konsumen survey rumah contoh, surveyor bank BTN, notaris PPAT, dan dokumentasi foto tamu.
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Total: <strong style={{ color: '#38bdf8' }}>{filteredVisitors.length}</strong> tamu tercatat
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Tanggal & Jam</th>
                  <th style={{ padding: '10px 14px' }}>Nama Tamu & Kontak</th>
                  <th style={{ padding: '10px 14px' }}>Kendaraan</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Dokumentasi Foto</th>
                  <th style={{ padding: '10px 14px' }}>Tujuan & Keperluan</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status Kunjungan</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada catatan tamu yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredVisitors.map((vis, idx) => {
                    const photosCount = (vis.photos || []).length;
                    return (
                      <tr key={vis.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>In: {vis.jamMasuk}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            Out: {vis.jamKeluar || '-'} &bull; {formatDisplayDate(vis.tanggal)}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>{vis.namaTamu}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Phone size={10} /> {vis.noHp || '-'}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#cbd5e1' }}>{vis.noPlat || 'Pejalan Kaki'}</div>
                          <div style={{ fontSize: '0.7rem', color: '#10b981' }}>{vis.proyek}</div>
                        </td>
                        {/* Tombol Lihat Foto Slider */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => openGallery(vis.photos, `Foto Kunjungan Tamu: ${vis.namaTamu} (${vis.noPlat || 'Pejalan Kaki'})`)}
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
                          <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.76rem' }}>{vis.tujuanBertemu}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {vis.keperluan}
                          </div>
                        </td>
                        {/* Status Kunjungan dengan Toggle Cepat */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleVisitorStatus(vis.id)}
                            style={{
                              background: vis.status === 'Sedang di Lokasi' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              border: vis.status === 'Sedang di Lokasi' ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                              color: vis.status === 'Sedang di Lokasi' ? '#fbbf24' : '#10b981',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Klik untuk toggle status kunjungan (Sedang di Lokasi / Selesai Keluar)"
                          >
                            <Check size={11} /> {vis.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(vis, 'visitor')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}
                              title="Lihat Detail Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(vis);
                                setVisitorForm({ ...vis });
                                setIsVisitorModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}
                              title="Edit"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(vis.id, 'visitor')}
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
      {/* KONTEN TAB 3: KONTROL ARMADA TRUK MATERIAL                          */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'truk-material' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Kontrol Gerbang Keluar-Masuk Armada Truk Material Proyek
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Pemeriksaan surat jalan resmi, foto fisik armada truk di gerbang, dan mandor penerima lapangan.
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Total: <strong style={{ color: '#fbbf24' }}>{filteredMaterials.length}</strong> armada tercatat
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Waktu & Surat Jalan</th>
                  <th style={{ padding: '10px 14px' }}>Vendor & Material</th>
                  <th style={{ padding: '10px 14px' }}>Armada & Supir</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Dokumentasi Foto</th>
                  <th style={{ padding: '10px 14px' }}>Lokasi & Penerima</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status Gerbang</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada catatan truk material yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((mat, idx) => {
                    const photosCount = (mat.photos || []).length;
                    return (
                      <tr key={mat.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>In: {mat.jamMasuk}</div>
                          <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'monospace', marginTop: '2px' }}>
                            SJ: {mat.noSuratJalan || mat.noDok}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            Out: {mat.jamKeluar || '-'} &bull; {formatDisplayDate(mat.tanggal)}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#cbd5e1' }}>{mat.namaVendor}</div>
                          <div style={{ marginTop: '2px' }}>
                            <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24', fontSize: '0.72rem', fontWeight: 800 }}>
                              {mat.jenisMaterial}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{mat.noPlat}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Supir: {mat.namaSupir}</div>
                        </td>
                        {/* Tombol Lihat Foto Slider */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => openGallery(mat.photos, `Foto Armada Truk: ${mat.namaVendor} (${mat.noPlat})`)}
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
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600, color: '#cbd5e1' }}>{mat.lokasiBongkar}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Penerima: {mat.penerima}</div>
                        </td>
                        {/* Status Gerbang dengan Toggle Cepat */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleMaterialStatus(mat.id)}
                            style={{
                              background: mat.status === 'Sedang Bongkar' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              border: mat.status === 'Sedang Bongkar' ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                              color: mat.status === 'Sedang Bongkar' ? '#fbbf24' : '#10b981',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Klik untuk toggle status truk (Sedang Bongkar / Selesai Keluar)"
                          >
                            <Check size={11} /> {mat.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(mat, 'material')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}
                              title="Lihat Detail Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(mat);
                                setMaterialForm({ ...mat });
                                setIsMaterialModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}
                              title="Edit"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(mat.id, 'material')}
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
      {/* KONTEN TAB 4: PATROLI KAVLING & INSIDEN                             */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'patroli-insiden' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Patroli Keliling Kavling & Pengawasan Perimeter
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Checklist kontrol malam, cek lampu PJU, gembok gudang material, dan bukti foto titik kontrol.
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Total: <strong style={{ color: '#34d399' }}>{filteredPatrols.length}</strong> ronde patroli
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Tanggal & Jam</th>
                  <th style={{ padding: '10px 14px' }}>Proyek & Petugas</th>
                  <th style={{ padding: '10px 14px' }}>Rute Patroli</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Dokumentasi Foto</th>
                  <th style={{ padding: '10px 14px' }}>Pagar & Gudang</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status Patroli</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatrols.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada data patroli yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredPatrols.map((ptr, idx) => {
                    const photosCount = (ptr.photos || []).length;
                    return (
                      <tr key={ptr.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={13} color="#10b981" /> {ptr.jamPatroli}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {formatDisplayDate(ptr.tanggal)}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#cbd5e1' }}>{ptr.petugas}</div>
                          <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <MapPin size={10} /> {ptr.proyek}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#f8fafc', fontWeight: 600 }}>{ptr.rutePatroli}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{ptr.catatan}</div>
                        </td>
                        {/* Tombol Lihat Foto Slider */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => openGallery(ptr.photos, `Foto Patroli Malam: ${ptr.proyek} (${ptr.jamPatroli})`)}
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
                          <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 600 }}>{ptr.kondisiPagar}</div>
                          <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginTop: '2px' }}>{ptr.kondisiLampu}</div>
                        </td>
                        {/* Status Patroli dengan Toggle Cepat */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => togglePatrolStatus(ptr.id)}
                            style={{
                              background: ptr.status === 'Verified Patrol' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              border: ptr.status === 'Verified Patrol' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                              color: ptr.status === 'Verified Patrol' ? '#10b981' : '#f87171',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Klik untuk mengubah status checklist patroli"
                          >
                            <ShieldCheck size={11} /> {ptr.status || 'Verified Patrol'}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(ptr, 'patrol')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}
                              title="Lihat Detail Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(ptr);
                                setPatrolForm({ ...ptr });
                                setIsPatrolModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}
                              title="Edit"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(ptr.id, 'patrol')}
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

            {/* Strip Thumbnail di Bawah (Bisa Diklik Langsung untuk Berpindah) */}
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
                  Detail Catatan Pos Keamanan ({detailItem.noDok})
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
                    {detailItem.status || 'Verified'}
                  </span>
                </div>
              </div>

              {/* Konten Berdasarkan Tipe */}
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px 16px', fontSize: '0.78rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {detailType === 'shift' && (
                  <>
                    <div><span style={{ color: '#64748b' }}>Shift Jaga:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.shift}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Lokasi Pos:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.posJaga}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Danru:</span> <strong style={{ color: '#34d399', display: 'block' }}>{detailItem.danru}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Personil:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.personil}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Inventaris Pos:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.inventarisPos}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Catatan Situasi:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.catatan}</div></div>
                  </>
                )}

                {detailType === 'visitor' && (
                  <>
                    <div><span style={{ color: '#64748b' }}>Nama Tamu:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.namaTamu}</strong></div>
                    <div><span style={{ color: '#64748b' }}>No. Handphone:</span> <strong style={{ color: '#38bdf8', display: 'block' }}>{detailItem.noHp || '-'}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Kendaraan / Plat:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.noPlat || 'Pejalan Kaki'}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Kategori Tamu:</span> <strong style={{ color: '#fbbf24', display: 'block' }}>{detailItem.kategori}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Tujuan Bertemu:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.tujuanBertemu}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Keperluan:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.keperluan}</div></div>
                  </>
                )}

                {detailType === 'material' && (
                  <>
                    <div><span style={{ color: '#64748b' }}>Vendor Pengirim:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.namaVendor}</strong></div>
                    <div><span style={{ color: '#64748b' }}>No. Surat Jalan:</span> <strong style={{ color: '#38bdf8', display: 'block' }}>{detailItem.noSuratJalan}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Muatan Material:</span> <strong style={{ color: '#fbbf24', display: 'block' }}>{detailItem.jenisMaterial}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Armada & Supir:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.noPlat} ({detailItem.namaSupir})</strong></div>
                    <div><span style={{ color: '#64748b' }}>Lokasi Bongkar:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.lokasiBongkar}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Penerima:</span> <strong style={{ color: '#10b981', display: 'block' }}>{detailItem.penerima}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Catatan Pemeriksaan:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.catatan}</div></div>
                  </>
                )}

                {detailType === 'patrol' && (
                  <>
                    <div><span style={{ color: '#64748b' }}>Jam Patroli:</span> <strong style={{ color: '#10b981', display: 'block' }}>{detailItem.jamPatroli}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Petugas Patroli:</span> <strong style={{ color: '#cbd5e1', display: 'block' }}>{detailItem.petugas}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Rute Patroli:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.rutePatroli}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Penerangan PJU:</span> <strong style={{ color: '#fbbf24', display: 'block' }}>{detailItem.kondisiLampu}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Pagar & Gudang:</span> <strong style={{ color: '#34d399', display: 'block' }}>{detailItem.kondisiPagar}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Temuan Khusus:</span> <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{detailItem.catatan}</div></div>
                  </>
                )}
              </div>

              {/* Dokumentasi Foto di dalam Detail View */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Dokumentasi Foto Lapangan ({(detailItem.photos || []).length} Foto):</span>
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
      {/* MODAL 1: FORM BUKU MUTASI SHIFT JAGA (DENGAN UPLOAD FOTO & STATUS)  */}
      {/* ------------------------------------------------------------------- */}
      {isShiftModalOpen && (
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
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '580px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {editingItem ? 'Edit Buku Mutasi Shift Jaga' : 'Catat Buku Mutasi Shift Jaga Satpam'}
                </h3>
              </div>
              <button onClick={() => setIsShiftModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitShift} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '78vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Tanggal Jaga</label>
                  <input
                    type="date"
                    value={shiftForm.tanggal}
                    onChange={(e) => setShiftForm({ ...shiftForm, tanggal: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Pilihan Shift</label>
                  <select
                    value={shiftForm.shift}
                    onChange={(e) => setShiftForm({ ...shiftForm, shift: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Shift Siang (07:00 - 19:00)">Shift Siang (07:00 - 19:00)</option>
                    <option value="Shift Malam (19:00 - 07:00)">Shift Malam (19:00 - 07:00)</option>
                    <option value="Shift 24 Jam (Bergantian)">Shift 24 Jam (Bergantian)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Titik Proyek</label>
                  <select
                    value={shiftForm.proyek}
                    onChange={(e) => setShiftForm({ ...shiftForm, proyek: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                    <option value="Head Office Bizhub">Head Office Bizhub</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Status Shift Jaga</label>
                  <select
                    value={shiftForm.status}
                    onChange={(e) => setShiftForm({ ...shiftForm, status: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Sedang Bertugas">Sedang Bertugas</option>
                    <option value="Selesai Bertugas">Selesai Bertugas</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Danru / Komandan Regu</label>
                  <input
                    type="text"
                    value={shiftForm.danru}
                    onChange={(e) => setShiftForm({ ...shiftForm, danru: e.target.value })}
                    placeholder="Nama Danru (cth: Hartono)"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Personil Regu Jaga</label>
                  <input
                    type="text"
                    value={shiftForm.personil}
                    onChange={(e) => setShiftForm({ ...shiftForm, personil: e.target.value })}
                    placeholder="Nama personil (cth: Agus, Bambang)"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Checklist Inventaris Pos</label>
                <input
                  type="text"
                  value={shiftForm.inventarisPos}
                  onChange={(e) => setShiftForm({ ...shiftForm, inventarisPos: e.target.value })}
                  placeholder="Contoh: HT 3 Unit, Senter 2, Rompi, Kunci Portal"
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Catatan Khusus / Situasi Lapangan</label>
                <textarea
                  rows="2"
                  value={shiftForm.catatan}
                  onChange={(e) => setShiftForm({ ...shiftForm, catatan: e.target.value })}
                  placeholder="Catatan serah terima tugas, cuaca, atau kejadian tertentu..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              {/* Upload Foto Dokumentasi Shift (Multi-Photo) */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#34d399', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Upload Foto Dokumentasi Serah Terima & Pos Jaga (Bisa Pilih Banyak Foto)
                </label>
                <input
                  ref={shiftFileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handlePhotosUpload(e, setShiftForm)}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => shiftFileRef.current && shiftFileRef.current.click()}
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
                  <span>Klik untuk Upload Foto (Bisa pilih beberapa foto sekaligus)</span>
                </div>

                {/* Grid Preview Foto yang Diunggah */}
                {(shiftForm.photos || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {shiftForm.photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #10b981' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhotoFromForm(idx, setShiftForm)}
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
                <button type="button" onClick={() => setIsShiftModalOpen(false)} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '7px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Simpan Laporan Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 2: FORM BUKU TAMU MASUK (DENGAN UPLOAD FOTO & STATUS)         */}
      {/* ------------------------------------------------------------------- */}
      {isVisitorModalOpen && (
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
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '580px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {editingItem ? 'Edit Buku Tamu' : 'Catat Tamu & Konsumen Masuk Gerbang'}
                </h3>
              </div>
              <button onClick={() => setIsVisitorModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitVisitor} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '78vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nama Lengkap Tamu *</label>
                  <input
                    type="text"
                    required
                    value={visitorForm.namaTamu}
                    onChange={(e) => setVisitorForm({ ...visitorForm, namaTamu: e.target.value })}
                    placeholder="Contoh: Bpk. Hendra Gunawan"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nomor Handphone (WhatsApp)</label>
                  <input
                    type="text"
                    value={visitorForm.noHp}
                    onChange={(e) => setVisitorForm({ ...visitorForm, noHp: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>No. Polisi & Kendaraan</label>
                  <input
                    type="text"
                    value={visitorForm.noPlat}
                    onChange={(e) => setVisitorForm({ ...visitorForm, noPlat: e.target.value })}
                    placeholder="Contoh: B 1928 KFA (Avanza)"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Status Kunjungan</label>
                  <select
                    value={visitorForm.status}
                    onChange={(e) => setVisitorForm({ ...visitorForm, status: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Sedang di Lokasi">Sedang di Lokasi</option>
                    <option value="Selesai Keluar">Selesai Keluar</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Kategori Tamu</label>
                  <select
                    value={visitorForm.kategori}
                    onChange={(e) => setVisitorForm({ ...visitorForm, kategori: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Konsumen / Calon Pembeli">Konsumen / Calon Pembeli</option>
                    <option value="Surveyor Bank (KPR Bank BTN)">Surveyor Bank (KPR Bank BTN)</option>
                    <option value="Surveyor Bank Mandiri">Surveyor Bank Mandiri</option>
                    <option value="Notaris & PPAT / BPN">Notaris & PPAT / BPN</option>
                    <option value="Vendor / Rekanan Teknik">Vendor / Rekanan Teknik</option>
                    <option value="Tamu Manajemen / Direksi">Tamu Manajemen / Direksi</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Bertemu dengan Siapa</label>
                  <input
                    type="text"
                    value={visitorForm.tujuanBertemu}
                    onChange={(e) => setVisitorForm({ ...visitorForm, tujuanBertemu: e.target.value })}
                    placeholder="Contoh: Marketing Gallery (Fresda)"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Keperluan Kunjungan</label>
                <textarea
                  rows="2"
                  value={visitorForm.keperluan}
                  onChange={(e) => setVisitorForm({ ...visitorForm, keperluan: e.target.value })}
                  placeholder="Contoh: Survey rumah contoh tipe 36, simulasi cicilan KPR, atau tanda tangan dokumen."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              {/* Upload Foto Tamu & Kendaraan (Multi-Photo) */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#38bdf8', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Upload Foto Tamu & Kendaraan (Bisa Pilih Banyak Foto: Foto Tamu, Plat, dll)
                </label>
                <input
                  ref={visitorFileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handlePhotosUpload(e, setVisitorForm)}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => visitorFileRef.current && visitorFileRef.current.click()}
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
                  <span>Klik untuk Upload Foto Tamu & Kendaraan (Bisa pilih beberapa foto)</span>
                </div>

                {/* Grid Preview Foto */}
                {(visitorForm.photos || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {visitorForm.photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #38bdf8' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhotoFromForm(idx, setVisitorForm)}
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
                <button type="button" onClick={() => setIsVisitorModalOpen(false)} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '7px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Simpan Catatan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 3: FORM KONTROL TRUK MATERIAL (DENGAN UPLOAD FOTO & STATUS)   */}
      {/* ------------------------------------------------------------------- */}
      {isMaterialModalOpen && (
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
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '580px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {editingItem ? 'Edit Kontrol Truk Material' : 'Catat Truk Material Masuk Gerbang Proyek'}
                </h3>
              </div>
              <button onClick={() => setIsMaterialModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitMaterial} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '78vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nama Vendor / Pengirim *</label>
                  <input
                    type="text"
                    required
                    value={materialForm.namaVendor}
                    onChange={(e) => setMaterialForm({ ...materialForm, namaVendor: e.target.value })}
                    placeholder="Contoh: PT Adhimix Precast / TB Sinar Terang"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nomor Surat Jalan</label>
                  <input
                    type="text"
                    value={materialForm.noSuratJalan}
                    onChange={(e) => setMaterialForm({ ...materialForm, noSuratJalan: e.target.value })}
                    placeholder="Contoh: SJ-ADH-2026-8819"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Jenis Material & Volume *</label>
                  <input
                    type="text"
                    required
                    value={materialForm.jenisMaterial}
                    onChange={(e) => setMaterialForm({ ...materialForm, jenisMaterial: e.target.value })}
                    placeholder="Contoh: Pasir Bangka 8 m³ / Beton Ready Mix"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Status Gerbang Truk</label>
                  <select
                    value={materialForm.status}
                    onChange={(e) => setMaterialForm({ ...materialForm, status: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Sedang Bongkar">Sedang Bongkar</option>
                    <option value="Selesai Bongkar & Keluar">Selesai Bongkar & Keluar</option>
                    <option value="Menunggu Cek Gerbang">Menunggu Cek Gerbang</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>No. Plat Truk & Supir</label>
                  <input
                    type="text"
                    value={materialForm.noPlat}
                    onChange={(e) => setMaterialForm({ ...materialForm, noPlat: e.target.value })}
                    placeholder="Contoh: B 9104 TYX (Supir: Yanto)"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Mandor / Staf Penerima</label>
                  <input
                    type="text"
                    value={materialForm.penerima}
                    onChange={(e) => setMaterialForm({ ...materialForm, penerima: e.target.value })}
                    placeholder="Contoh: Mandor Subur / Fajar Gudang"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Catatan Pemeriksaan Satpam</label>
                <textarea
                  rows="2"
                  value={materialForm.catatan}
                  onChange={(e) => setMaterialForm({ ...materialForm, catatan: e.target.value })}
                  placeholder="Kondisi material, slump beton, ada/tidaknya tumpahan di jalan..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              {/* Upload Foto Truk & Surat Jalan (Multi-Photo) */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#fbbf24', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Upload Foto Truk & Surat Jalan (Bisa Pilih Banyak Foto: Fisik Truk, DO, Muatan)
                </label>
                <input
                  ref={materialFileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handlePhotosUpload(e, setMaterialForm)}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => materialFileRef.current && materialFileRef.current.click()}
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
                  <span>Klik untuk Upload Foto Truk & Surat Jalan (Bisa pilih beberapa foto)</span>
                </div>

                {/* Grid Preview Foto */}
                {(materialForm.photos || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {materialForm.photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #fbbf24' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhotoFromForm(idx, setMaterialForm)}
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
                <button type="button" onClick={() => setIsMaterialModalOpen(false)} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '7px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Simpan Truk Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 4: FORM PATROLI KAVLING (DENGAN UPLOAD FOTO & STATUS)         */}
      {/* ------------------------------------------------------------------- */}
      {isPatrolModalOpen && (
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
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '580px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={18} color="#34d399" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {editingItem ? 'Edit Patroli Keliling Kavling' : 'Catat Patroli Malam Keliling Kawasan'}
                </h3>
              </div>
              <button onClick={() => setIsPatrolModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitPatrol} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '78vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Tanggal Patroli</label>
                  <input
                    type="date"
                    value={patrolForm.tanggal}
                    onChange={(e) => setPatrolForm({ ...patrolForm, tanggal: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Jam Kontrol (WIB)</label>
                  <input
                    type="text"
                    value={patrolForm.jamPatroli}
                    onChange={(e) => setPatrolForm({ ...patrolForm, jamPatroli: e.target.value })}
                    placeholder="Contoh: 01:00 WIB"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Petugas Patroli</label>
                  <input
                    type="text"
                    value={patrolForm.petugas}
                    onChange={(e) => setPatrolForm({ ...patrolForm, petugas: e.target.value })}
                    placeholder="Nama personil patroli"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Status Patroli</label>
                  <select
                    value={patrolForm.status}
                    onChange={(e) => setPatrolForm({ ...patrolForm, status: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Verified Patrol">Verified Patrol (Sesuai SOP)</option>
                    <option value="Perlu Tindak Lanjut">Perlu Tindak Lanjut</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Rute Patroli yang Diperiksa</label>
                <input
                  type="text"
                  value={patrolForm.rutePatroli}
                  onChange={(e) => setPatrolForm({ ...patrolForm, rutePatroli: e.target.value })}
                  placeholder="Contoh: Gerbang -> Blok A -> Blok B -> Gudang Semen -> Mess"
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Kondisi Lampu PJU</label>
                  <input
                    type="text"
                    value={patrolForm.kondisiLampu}
                    onChange={(e) => setPatrolForm({ ...patrolForm, kondisiLampu: e.target.value })}
                    placeholder="PJU Menyala 18 Titik"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Pagar Keliling & Gudang</label>
                  <input
                    type="text"
                    value={patrolForm.kondisiPagar}
                    onChange={(e) => setPatrolForm({ ...patrolForm, kondisiPagar: e.target.value })}
                    placeholder="Pagar Aman, Gudang Terkunci"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Temuan Khusus / Catatan Lapangan</label>
                <textarea
                  rows="2"
                  value={patrolForm.catatan}
                  onChange={(e) => setPatrolForm({ ...patrolForm, catatan: e.target.value })}
                  placeholder="Situasi sepi aman, tidak ada orang asing berkeliaran..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              {/* Upload Foto Patroli (Multi-Photo) */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#34d399', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Upload Foto Dokumentasi Patroli (Bisa Pilih Banyak Foto: Titik Checkpoint, PJU, dll)
                </label>
                <input
                  ref={patrolFileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handlePhotosUpload(e, setPatrolForm)}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => patrolFileRef.current && patrolFileRef.current.click()}
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
                  <span>Klik untuk Upload Foto Patroli (Bisa pilih beberapa foto)</span>
                </div>

                {/* Grid Preview Foto */}
                {(patrolForm.photos || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {patrolForm.photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #10b981' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhotoFromForm(idx, setPatrolForm)}
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
                <button type="button" onClick={() => setIsPatrolModalOpen(false)} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '7px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Simpan Laporan Patroli
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 5: CETAK LEMBAR MUTASI RESMI KOP SURAT HR & GA               */}
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
                .sec-print-container, .sec-print-container * {
                  visibility: visible !important;
                }
                .sec-print-container {
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
            className="sec-print-container"
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
                Pratinjau Cetak Lembar Mutasi Resmi Pos Keamanan Satpam
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
                  Divisi Keamanan & Pengawasan Aset Proyek &bull; Ashoka Management System
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  Pos Keamanan Gerbang Utama Ashoka Park & Ashoka View &bull; Emergency Hotline: (021) 892-0192
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '14px 0 20px 0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
                BUKU MUTASI & LAPORAN PENJAGAAN POS SATPAM
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '3px' }}>
                Tanggal Laporan: <strong>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> &bull; Proyek: <strong>Ashoka Park & Ashoka View</strong>
              </div>
            </div>

            <div style={{ marginBottom: '16px', fontWeight: 800, fontSize: '0.85rem' }}>1. Catatan Mutasi & Serah Terima Shift Jaga</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #0f172a', borderTop: '2px solid #0f172a' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>No</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Shift</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Pos Jaga</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Danru & Personil</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Status Shift</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Situasi Keamanan</th>
                </tr>
              </thead>
              <tbody>
                {filteredShifts.map((s, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{s.shift}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{s.posJaga}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{s.danru} ({s.personil})</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: s.status === 'Sedang Bertugas' ? '#0284c7' : '#059669' }}>{s.status}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{s.kondisi} - {s.catatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginBottom: '10px', fontWeight: 800, fontSize: '0.85rem' }}>2. Ringkasan Keluar-Masuk Armada Truk Material Proyek</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #0f172a', borderTop: '2px solid #0f172a' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>No</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Jam Masuk/Keluar</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Vendor & Surat Jalan</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Jenis Material</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>No Plat & Supir</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Status Gerbang</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((m, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{m.jamMasuk} / {m.jamKeluar}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{m.namaVendor} ({m.noSuratJalan})</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{m.jenisMaterial}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{m.noPlat} ({m.namaSupir})</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakInside: 'avoid', marginTop: '30px' }}>
              <div style={{ textAlign: 'center', width: '220px' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>Dibuat Oleh:</div>
                <div style={{ height: '65px' }} />
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                  Hartono
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Komandan Regu (Danru) Satpam</div>
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
                    <div>SECURITY</div>
                    <div>VERIFIED</div>
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
