import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import * as XLSX from 'xlsx';
import {
  Users,
  Briefcase,
  FileText,
  Building2,
  Clock,
  Award,
  Package,
  Wrench,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Paperclip,
  UploadCloud,
  FileSpreadsheet,
  ArrowRight,
  UserCheck,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { FundRequestModal } from '../components/FundRequestModal';
import { FundRequestTrackerModal } from '../components/FundRequestTrackerModal';
import { RecruitmentModule } from '../components/RecruitmentModule';
import { ContractApprovalModule } from '../components/ContractApprovalModule';
import { KontrakKerjaModule } from '../components/KontrakKerjaModule';

export const HrGaModule = ({ onSwitchToLegalCorporate }) => {
  const { currentUser, showNotification, activeSubTab, setActiveSubTab } = useApp();

  // -------------------------------------------------------------
  // 9 SUB-MODUL HR & GA PERSIS SESUAI LAMPIRAN USER:
  // 1. Data Base Karyawan
  // 2. Recruitment
  // 3. Kontrak Kerja
  // 4. Fasilitas
  // 5. Absensi
  // 6. KPI
  // 7. Management Asset
  // 8. Maintanance
  // 9. Keamanan & Kebersihan
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab) {
      if (activeSubTab === 'keamanan-kebersihan') return 'keamanan';
      if ([
        'database-karyawan', 'recruitment', 'kontrak-kerja', 'absensi',
        'kpi', 'gathering', 'management-asset', 'maintanance', 'fasilitas', 'keamanan', 'kebersihan', 'cctv'
      ].includes(activeSubTab)) {
        return activeSubTab;
      }
    }
    return 'database-karyawan';
  });

  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);

  useEffect(() => {
    if (activeSubTab) {
      if (activeSubTab === 'keamanan-kebersihan') {
        setActiveTab('keamanan');
      } else if ([
        'database-karyawan', 'recruitment', 'kontrak-kerja', 'absensi',
        'kpi', 'gathering', 'management-asset', 'maintanance', 'fasilitas', 'keamanan', 'kebersihan', 'cctv'
      ].includes(activeSubTab)) {
        setActiveTab(activeSubTab);
      }
    }
  }, [activeSubTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (setActiveSubTab) {
      setActiveSubTab(tabId);
    }
  };

  // Helper format rupiah & tanggal
  const formatRupiah = (val) => {
    if (!val || isNaN(val)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
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

  // =============================================================
  // 1. DATA BASE KARYAWAN STORE
  // =============================================================
  const initialEmployees = [
    {
      id: 'EMP-001',
      noDok: 'AMS-2024-001',
      nama: 'Ahmad Rafail',
      nik: '3201011508900001',
      npwp: '09.123.456.7-432.000',
      noRekening: 'BCA 8830192819 a.n Ahmad Rafail',
      alamat: 'Jl. Raya Pemda No. 12, Cibinong, Bogor',
      noHp: '0812-9988-7711',
      phone: '0812-9988-7711',
      jabatan: 'Super Admin & Direktur Utama',
      penempatan: 'Head Office Bizhub',
      status: 'Karyawan Tetap (PKWTT)',
      namaKeluarga: {
        istriSuami: 'Siti Nurhaliza',
        anak1: 'Muhammad Rayhan',
        anak2: 'Aisyah Zahra',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-01-01',
      tanggalDok: '2024-01-01',
      project: 'Head Office Bizhub',
      kategori: 'Karyawan Tetap (PKWTT)',
      judulDokumen: 'Super Admin & Direktur Utama',
      catatan: 'Karyawan Tetap (PKWTT) • Grade Executive',
      files: [
        { name: 'KTP_Ahmad_Rafail.pdf', size: '1.2 MB' },
        { name: 'SK_Direksi_Utama.pdf', size: '850 KB' },
        { name: 'Kartu_Keluarga_Ahmad.pdf', size: '1.1 MB' }
      ]
    },
    {
      id: 'EMP-002',
      noDok: 'AMS-2024-002',
      nama: 'Yazid Hizbullah, S.E.,S.T',
      nik: '3201021204880002',
      npwp: '08.234.567.8-431.000',
      noRekening: 'Mandiri 133001829102 a.n Yazid Hizbullah',
      alamat: 'Komplek Permata Indah Blok B3, Bogor',
      noHp: '0813-1122-3344',
      phone: '0813-1122-3344',
      jabatan: 'Direktur Utama & Finance Director',
      penempatan: 'Head Office Bizhub',
      status: 'Karyawan Tetap (PKWTT)',
      namaKeluarga: {
        istriSuami: 'Fatimah Az-Zahra',
        anak1: 'Khalid Al-Walid',
        anak2: 'Maryam Khairunnisa',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-01-01',
      tanggalDok: '2024-01-01',
      project: 'Head Office Bizhub',
      kategori: 'Karyawan Tetap (PKWTT)',
      judulDokumen: 'Direktur Utama & Finance Director',
      catatan: 'Karyawan Tetap (PKWTT) • Grade Executive',
      files: [
        { name: 'KTP_Yazid_Hizbullah.pdf', size: '1.4 MB' },
        { name: 'NPWP_Yazid.pdf', size: '600 KB' },
        { name: 'Ijazah_S1_Teknik.pdf', size: '2.3 MB' }
      ]
    },
    {
      id: 'EMP-003',
      noDok: 'AMS-2024-003',
      nama: 'Adhi Himawan, S.E.Sy',
      nik: '3201031907890003',
      npwp: '07.345.678.9-432.000',
      noRekening: 'BSI 7129384729 a.n Adhi Himawan',
      alamat: 'Perum Gria Indah 2 Blok D5, Depok',
      noHp: '0815-5566-7788',
      phone: '0815-5566-7788',
      jabatan: 'General Manager (Ops, Marketing & GA)',
      penempatan: 'Head Office Bizhub',
      status: 'Karyawan Tetap (PKWTT)',
      namaKeluarga: {
        istriSuami: 'Rina Rahmawati',
        anak1: 'Kenzo Himawan',
        anak2: '',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-02-01',
      tanggalDok: '2024-02-01',
      project: 'Head Office Bizhub',
      kategori: 'Karyawan Tetap (PKWTT)',
      judulDokumen: 'General Manager (Ops, Marketing & GA)',
      catatan: 'Karyawan Tetap (PKWTT) • Grade A1',
      files: [
        { name: 'KTP_Adhi_Himawan.pdf', size: '950 KB' },
        { name: 'BPJS_Ketenagakerjaan.pdf', size: '420 KB' }
      ]
    },
    {
      id: 'EMP-004',
      noDok: 'AMS-2024-004',
      nama: 'Dodi Syaiful Nugroho',
      nik: '3201042409920004',
      npwp: '06.456.789.0-433.000',
      noRekening: 'BCA 6040192837 a.n Dodi Syaiful Nugroho',
      alamat: 'Jl. Raya Sentul KM 5, Babakan Madang, Bogor',
      noHp: '0817-2233-4455',
      phone: '0817-2233-4455',
      jabatan: 'Head of HR & GA (General Affair)',
      penempatan: 'Head Office & Site Office',
      status: 'Karyawan Tetap (PKWTT)',
      namaKeluarga: {
        istriSuami: 'Dewi Lestari',
        anak1: 'Arka Syaiful',
        anak2: 'Bima Syaiful',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-02-15',
      tanggalDok: '2024-02-15',
      project: 'Head Office & Site Office',
      kategori: 'Karyawan Tetap (PKWTT)',
      judulDokumen: 'Head of HR & GA (General Affair)',
      catatan: 'Karyawan Tetap (PKWTT) • Grade A2',
      files: [
        { name: 'KTP_Dodi_Syaiful.pdf', size: '1.1 MB' },
        { name: 'Sertifikat_CHRP.pdf', size: '1.8 MB' }
      ]
    },
    {
      id: 'EMP-005',
      noDok: 'AMS-2024-005',
      nama: 'Wahyu Salma Septiani, S.H',
      nik: '3201055503950005',
      npwp: '05.567.890.1-434.000',
      noRekening: 'BCA 7710294821 a.n Wahyu Salma Septiani',
      alamat: 'Jl. Margonda Raya No. 102, Depok',
      noHp: '0812-7788-9900',
      phone: '0812-7788-9900',
      jabatan: 'Head of Legal & Perizinan Properti',
      penempatan: 'Ashoka Park',
      status: 'Karyawan Tetap (PKWTT)',
      namaKeluarga: {
        istriSuami: 'Dimas Prasetyo',
        anak1: 'Nadia Septiani',
        anak2: '',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-03-01',
      tanggalDok: '2024-03-01',
      project: 'Ashoka Park',
      kategori: 'Karyawan Tetap (PKWTT)',
      judulDokumen: 'Head of Legal & Perizinan Properti',
      catatan: 'Karyawan Tetap (PKWTT) • Grade A2',
      files: [
        { name: 'KTP_Wahyu_Salma.pdf', size: '890 KB' },
        { name: 'Ijazah_Hukum_S1.pdf', size: '2.1 MB' }
      ]
    },
    {
      id: 'EMP-006',
      noDok: 'AMS-2024-006',
      nama: 'Yulieka Rachmawati, S.Si',
      nik: '3201064807940006',
      npwp: '04.678.901.2-435.000',
      noRekening: 'Mandiri 133002918291 a.n Yulieka Rachmawati',
      alamat: 'Cluster Cendana Blok C No. 7, Cibinong, Bogor',
      noHp: '0813-8899-0011',
      phone: '0813-8899-0011',
      jabatan: 'Head of Marketing & Sales Division',
      penempatan: 'Ashoka Park',
      status: 'Karyawan Tetap (PKWTT)',
      namaKeluarga: {
        istriSuami: 'Andri Wicaksono',
        anak1: 'Ghaisan Wicaksono',
        anak2: 'Zhafira Wicaksono',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-03-10',
      tanggalDok: '2024-03-10',
      project: 'Ashoka Park',
      kategori: 'Karyawan Tetap (PKWTT)',
      judulDokumen: 'Head of Marketing & Sales Division',
      catatan: 'Karyawan Tetap (PKWTT) • Grade A2',
      files: [
        { name: 'KTP_Yulieka.pdf', size: '1.0 MB' }
      ]
    },
    {
      id: 'EMP-007',
      noDok: 'AMS-2024-007',
      nama: 'Amanda Chesyariani Hermawan',
      nik: '3201076211970007',
      npwp: '03.789.012.3-436.000',
      noRekening: 'BCA 8840192839 a.n Amanda Chesyariani',
      alamat: 'Jl. Padjajaran No. 44, Bogor',
      noHp: '0818-4455-6677',
      phone: '0818-4455-6677',
      jabatan: 'Admin Marketing & SPR Specialist',
      penempatan: 'Ashoka View',
      status: 'Karyawan Kontrak (PKWT)',
      namaKeluarga: {
        istriSuami: '-',
        anak1: '',
        anak2: '',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-05-01',
      tanggalDok: '2024-05-01',
      project: 'Ashoka View',
      kategori: 'Karyawan Kontrak (PKWT)',
      judulDokumen: 'Admin Marketing & SPR Specialist',
      catatan: 'Karyawan Kontrak (PKWT) • Grade B1',
      files: [
        { name: 'KTP_Amanda.pdf', size: '750 KB' },
        { name: 'CV_Amanda_Chesyariani.pdf', size: '1.5 MB' }
      ]
    },
    {
      id: 'EMP-008',
      noDok: 'AMS-2024-008',
      nama: 'Tarkum Aditya',
      nik: '3201081109960008',
      npwp: '02.890.123.4-437.000',
      noRekening: 'Mandiri 133009182736 a.n Tarkum Aditya',
      alamat: 'Jl. Pajajaran Indah No. 15, Bogor',
      noHp: '0819-3322-1100',
      phone: '0819-3322-1100',
      jabatan: 'Finance Officer & Accounting',
      penempatan: 'Head Office Bizhub',
      status: 'Karyawan Tetap (PKWTT)',
      namaKeluarga: {
        istriSuami: 'Ratna Sari',
        anak1: 'Danial Aditya',
        anak2: '',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-04-01',
      tanggalDok: '2024-04-01',
      project: 'Head Office Bizhub',
      kategori: 'Karyawan Tetap (PKWTT)',
      judulDokumen: 'Finance Officer & Accounting',
      catatan: 'Karyawan Tetap (PKWTT) • Grade B1',
      files: [
        { name: 'KTP_Tarkum_Aditya.pdf', size: '820 KB' }
      ]
    },
    {
      id: 'EMP-009',
      noDok: 'AMS-2024-009',
      nama: 'Hapip Alamsyah',
      nik: '3201091506910009',
      npwp: '01.901.234.5-438.000',
      noRekening: 'BCA 8820194819 a.n Hapip Alamsyah',
      alamat: 'Kp. Muara RT 02/05, Bojonggede, Bogor',
      noHp: '0813-7766-5544',
      phone: '0813-7766-5544',
      jabatan: 'Site Operations Manager',
      penempatan: 'Ashoka Park',
      status: 'Karyawan Tetap (PKWTT)',
      namaKeluarga: {
        istriSuami: 'Nurul Hidayah',
        anak1: 'Fathan Alamsyah',
        anak2: 'Farhan Alamsyah',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-02-20',
      tanggalDok: '2024-02-20',
      project: 'Ashoka Park',
      kategori: 'Karyawan Tetap (PKWTT)',
      judulDokumen: 'Site Operations Manager',
      catatan: 'Karyawan Tetap (PKWTT) • Grade A2',
      files: [
        { name: 'KTP_Hapip.pdf', size: '920 KB' },
        { name: 'SKK_Pelaksana_Lapangan.pdf', size: '1.6 MB' }
      ]
    },
    {
      id: 'EMP-010',
      noDok: 'AMS-2024-010',
      nama: 'Hartono (Danru)',
      nik: '3201100508890010',
      npwp: '00.912.345.6-439.000',
      noRekening: 'BRI 029101829471 a.n Hartono',
      alamat: 'Jl. Raya Cikaret No. 8, Cibinong, Bogor',
      noHp: '0857-1122-3399',
      phone: '0857-1122-3399',
      jabatan: 'Komandan Regu Security Satpam',
      penempatan: 'Ashoka Park',
      status: 'Karyawan Kontrak (PKWT)',
      namaKeluarga: {
        istriSuami: 'Sri Wahyuni',
        anak1: 'Rian Hartono',
        anak2: '',
        anak3: '',
        anak4: ''
      },
      tanggalMasuk: '2024-06-01',
      tanggalDok: '2024-06-01',
      project: 'Ashoka Park',
      kategori: 'Karyawan Kontrak (PKWT)',
      judulDokumen: 'Komandan Regu Security Satpam',
      catatan: 'Karyawan Kontrak (PKWT) • Grade C1',
      files: [
        { name: 'KTA_Satpam_Hartono.pdf', size: '680 KB' },
        { name: 'Sertifikat_Gada_Pratama.pdf', size: '1.4 MB' }
      ]
    }
  ];

  const [employees, setEmployees] = useState(() => {
    try {
      const savedV5 = localStorage.getItem('ams_hr_database_karyawan_v5');
      if (savedV5) return JSON.parse(savedV5);
      const savedV4 = localStorage.getItem('ams_hr_database_karyawan_v4') || localStorage.getItem('ams_hr_database_karyawan_v3');
      if (savedV4) {
        const parsed = JSON.parse(savedV4);
        return parsed.map((item, idx) => {
          const match = initialEmployees.find(ie => ie.id === item.id) || initialEmployees[idx] || {};
          return {
            ...match,
            ...item,
            nik: item.nik || match.nik || `320101${String(idx + 1).padStart(10, '0')}`,
            npwp: item.npwp || match.npwp || '00.000.000.0-000.000',
            noRekening: item.noRekening || match.noRekening || 'BCA 0000000000',
            alamat: item.alamat || match.alamat || 'Bogor, Jawa Barat',
            noHp: item.noHp || item.phone || match.noHp || '0812-0000-0000',
            phone: item.phone || item.noHp || match.phone || '0812-0000-0000',
            jabatan: item.jabatan || item.judulDokumen || match.jabatan || 'Staff',
            penempatan: item.penempatan || item.project || match.penempatan || 'Head Office Bizhub',
            status: item.status || item.catatan || match.status || 'Karyawan Tetap (PKWTT)',
            namaKeluarga: item.namaKeluarga || match.namaKeluarga || { istriSuami: '-', anak1: '', anak2: '', anak3: '', anak4: '' },
            tanggalMasuk: item.tanggalMasuk || item.tanggalDok || match.tanggalMasuk || '2024-01-01',
            files: item.files || match.files || []
          };
        });
      }
    } catch {}
    return initialEmployees;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_database_karyawan_v5', JSON.stringify(employees));
    } catch {}
  }, [employees]);

  // =============================================================
  // 2. RECRUITMENT STORE
  // =============================================================
  const initialCandidates = [
    {
      id: 'CND-001',
      noDok: 'REC/AMS-JOB/2026/01',
      tanggalDok: '2026-09-18',
      project: 'Ashoka Park',
      nama: 'Bambang Triatmojo, S.T',
      kategori: 'Site Supervisor Sipil',
      judulDokumen: 'Berkas Lamaran & Portofolio Supervisor Sipil',
      catatan: 'Tahap: Interview User • Skor 86/100 • Pengalaman 5 Th WIKA',
      files: [{ name: 'CV_Bambang_Triatmojo.pdf', size: '1.8 MB' }, { name: 'Portofolio_Proyek.pdf', size: '4.2 MB' }]
    },
    {
      id: 'CND-002',
      noDok: 'REC/AMS-JOB/2026/02',
      tanggalDok: '2026-09-20',
      project: 'Ashoka View',
      nama: 'Rina Sugianti',
      kategori: 'Property Sales Executive',
      judulDokumen: 'Berkas Lamaran & Surat Rekomendasi Sales',
      catatan: 'Tahap: Offering Letter • Skor 92/100 • Closing Record Kuat',
      files: [{ name: 'CV_Rina_Sugianti.pdf', size: '1.1 MB' }, { name: 'Offering_Letter_Rina.pdf', size: '650 KB' }]
    },
    {
      id: 'CND-003',
      noDok: 'REC/AMS-JOB/2026/03',
      tanggalDok: '2026-09-22',
      project: 'Head Office Bizhub',
      nama: 'Derry Kurniawan, A.Md',
      kategori: 'Staff Pajak & Akuntansi',
      judulDokumen: 'Berkas Lamaran & Sertifikat Brevet AB',
      catatan: 'Tahap: Interview HR • Skor 78/100 • Paham e-Faktur Properti',
      files: [{ name: 'CV_Derry_Kurniawan.pdf', size: '1.3 MB' }]
    },
    {
      id: 'CND-004',
      noDok: 'REC/AMS-JOB/2026/04',
      tanggalDok: '2026-09-24',
      project: 'Ashoka Park',
      nama: 'Joko Susanto',
      kategori: 'Petugas Keamanan Satpam',
      judulDokumen: 'Berkas Lamaran & Ijazah Gada Pratama',
      catatan: 'Tahap: Diterima (Hired) • Skor 90/100 • Siap Shift Malam',
      files: [{ name: 'CV_Joko_Susanto.pdf', size: '850 KB' }, { name: 'SKCK_Polres.pdf', size: '520 KB' }]
    }
  ];

  const [candidates, setCandidates] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_candidates_v2');
      if (s) return JSON.parse(s);
    } catch {}
    return initialCandidates;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_candidates_v2', JSON.stringify(candidates));
    } catch {}
  }, [candidates]);

  // =============================================================
  // 3. KONTRAK KERJA STORE
  // =============================================================
  const initialContracts = [
    {
      id: 'CTR-001',
      noDok: '014/PKWT-HR/AMS/IV/2026',
      tanggalDok: '2026-05-01',
      project: 'Ashoka View',
      nama: 'Amanda Chesyariani Hermawan',
      kategori: 'PKWT (Kontrak 1 Tahun)',
      judulDokumen: 'Perjanjian Kerja Waktu Tertentu Admin Marketing',
      catatan: 'Aktif s/d 2027-04-30 • Sisa 216 Hari • Insentif SPR',
      files: [{ name: 'Draf_PKWT_Amanda_TTD.pdf', size: '1.6 MB' }]
    },
    {
      id: 'CTR-002',
      noDok: '008/PKWT-HR/AMS/II/2026',
      tanggalDok: '2026-06-01',
      project: 'Ashoka Park',
      nama: 'Hartono (Danru)',
      kategori: 'PKWT (Kontrak 6 Bulan)',
      judulDokumen: 'Perjanjian Kerja Komandan Regu Keamanan Site',
      catatan: 'Aktif s/d 2026-11-30 • Peringatan 65 Hari Jatuh Tempo',
      files: [{ name: 'Draf_PKWT_Hartono_TTD.pdf', size: '1.2 MB' }]
    },
    {
      id: 'CTR-003',
      noDok: '002/PKWTT-HR/AMS/I/2024',
      tanggalDok: '2024-02-15',
      project: 'Head Office & Site',
      nama: 'Dodi Syaiful Nugroho',
      kategori: 'PKWTT (Karyawan Tetap)',
      judulDokumen: 'Surat Keputusan Pengangkatan Karyawan Tetap Head HR & GA',
      catatan: 'Status Permanen Seumur Hidup / Pensiun • Tunjangan Dept',
      files: [{ name: 'SK_Pengangkatan_PKWTT_Dodi.pdf', size: '1.9 MB' }]
    },
    {
      id: 'CTR-004',
      noDok: '021/SPK-MDR/AMS/VIII/2026',
      tanggalDok: '2026-08-01',
      project: 'Ashoka Park',
      nama: 'Mandor Subur (12 Pekerja)',
      kategori: 'SPK Borongan Sipil',
      judulDokumen: 'SPK Perjanjian Kerja Borongan Pasang Dinding & Atap',
      catatan: '⚠️ Kritis Sisa 35 Hari (Berakhir 2026-10-31) • Opname 2 Mingguan',
      files: [{ name: 'SPK_Mandor_Subur_BlokA.pdf', size: '2.4 MB' }]
    }
  ];

  const [contracts, setContracts] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_contracts_v2');
      if (s) return JSON.parse(s);
    } catch {}
    return initialContracts;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_contracts_v2', JSON.stringify(contracts));
    } catch {}
  }, [contracts]);

  // =============================================================
  // 4. FASILITAS STORE
  // =============================================================
  const initialFacilities = [
    {
      id: 'FAS-001',
      noDok: 'FAS/AMS-GAL/2026/01',
      tanggalDok: '2024-01-15',
      project: 'Ashoka Park',
      nama: 'Dodi Syaiful (PIC GA)',
      kategori: 'Kantor & Galeri Pemasaran',
      judulDokumen: 'Marketing Gallery & Showroom Maket Ashoka Park',
      catatan: 'Kondisi Sangat Baik • AC Daikin 4 Unit, WiFi, Sofa Tamu • Rp 4.500.000/bln',
      files: [{ name: 'Foto_Fasilitas_Gallery_Park.jpg', size: '2.1 MB' }, { name: 'BA_Serah_Terima_AC.pdf', size: '820 KB' }]
    },
    {
      id: 'FAS-002',
      noDok: 'FAS/AMS-GAL/2026/02',
      tanggalDok: '2024-03-20',
      project: 'Ashoka View',
      nama: 'Dodi Syaiful (PIC GA)',
      kategori: 'Kantor & Galeri Pemasaran',
      judulDokumen: 'Marketing Gallery & Ruang Akad Konsumen Ashoka View',
      catatan: 'Kondisi Sangat Baik • Smart TV, Meja Rapat Mini, Pantry • Rp 3.200.000/bln',
      files: [{ name: 'Foto_Gallery_Ashoka_View.jpg', size: '1.9 MB' }]
    },
    {
      id: 'FAS-003',
      noDok: 'FAS/AMS-MSS/2026/03',
      tanggalDok: '2024-02-10',
      project: 'Ashoka Park',
      nama: 'Mandor Subur',
      kategori: 'Akomodasi & Mess Pekerja',
      judulDokumen: 'Mess Pekerja Konstruksi & Mandor Kavling C Belakang',
      catatan: 'Kondisi Baik • Kapasitas 50 Pekerja, Dapur & MCK • Rp 2.000.000/bln',
      files: [{ name: 'Denah_Mess_Pekerja_Site.pdf', size: '1.4 MB' }]
    },
    {
      id: 'FAS-004',
      noDok: 'FAS/AMS-GEN/2026/04',
      tanggalDok: '2024-05-12',
      project: 'Ashoka Park',
      nama: 'Teknik GA Lapangan',
      kategori: 'Utilitas Listrik Cadangan',
      judulDokumen: 'Genset Silent Backup Denyo 30 kVA Gardu Utama',
      catatan: 'Kondisi Siap Operasi • Siaga Pemadaman PLN Parung • Rp 1.500.000/bln',
      files: [{ name: 'Manual_Book_Denyo_30kVA.pdf', size: '3.1 MB' }]
    }
  ];

  const [facilities, setFacilities] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_facilities_v2');
      if (s) return JSON.parse(s);
    } catch {}
    return initialFacilities;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_facilities_v2', JSON.stringify(facilities));
    } catch {}
  }, [facilities]);

  // =============================================================
  // 5. ABSENSI STORE
  // =============================================================
  const initialAttendance = [
    {
      id: 'ATT-001',
      noDok: 'ATT/AMS-PR/2026/0926-01',
      tanggalDok: '2026-09-26',
      project: 'Head Office Bizhub',
      nama: 'Ahmad Rafail',
      kategori: 'Hadir Tepat Waktu',
      judulDokumen: 'Presensi Pagi (In 07:45 - Out 17:30)',
      catatan: 'Rapat Direksi Utama & Tinjauan Lahan Site',
      files: [{ name: 'Log_Fingerprint_Rafail.pdf', size: '420 KB' }]
    },
    {
      id: 'ATT-002',
      noDok: 'ATT/AMS-PR/2026/0926-02',
      tanggalDok: '2026-09-26',
      project: 'Head Office Bizhub',
      nama: 'Yazid Hizbullah, S.E.,S.T',
      kategori: 'Hadir Tepat Waktu',
      judulDokumen: 'Presensi Pagi (In 07:50 - Out 17:15)',
      catatan: 'Kordinasi Cashflow Bank BTN & Notaris',
      files: [{ name: 'Log_Fingerprint_Yazid.pdf', size: '410 KB' }]
    },
    {
      id: 'ATT-003',
      noDok: 'ATT/AMS-PR/2026/0926-03',
      tanggalDok: '2026-09-26',
      project: 'Ashoka Park',
      nama: 'Wahyu Salma Septiani, S.H',
      kategori: 'Terlambat (Toleransi)',
      judulDokumen: 'Presensi Pagi (In 08:15 - Out 17:00)',
      catatan: 'Koordinasi Pengukuran Tanah Kantor Pertanahan BPN Pagi Hari',
      files: [{ name: 'Surat_Tugas_BPN_Salma.pdf', size: '890 KB' }]
    },
    {
      id: 'ATT-004',
      noDok: 'ATT/AMS-PR/2026/0926-04',
      tanggalDok: '2026-09-26',
      project: 'Ashoka View',
      nama: 'Amanda Chesyariani Hermawan',
      kategori: 'Hadir Tepat Waktu',
      judulDokumen: 'Presensi Pagi (In 07:52 - Out 17:05)',
      catatan: 'Cetak Berkas SPR Konsumen Akad Kredit',
      files: [{ name: 'Foto_Selfie_Absen_Amanda.jpg', size: '650 KB' }]
    },
    {
      id: 'ATT-005',
      noDok: 'ATT/AMS-PR/2026/0926-05',
      tanggalDok: '2026-09-26',
      project: 'Ashoka Park',
      nama: 'Kholidin',
      kategori: 'Izin Sakit',
      judulDokumen: 'Surat Izin Tidak Masuk Kerja (Sakit 1 Hari)',
      catatan: 'Surat Keterangan Dokter Klinik Terlampir & Terverifikasi',
      files: [{ name: 'Surat_Dokter_Kholidin.pdf', size: '1.1 MB' }]
    }
  ];

  const [attendances, setAttendances] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_attendance_v2');
      if (s) return JSON.parse(s);
    } catch {}
    return initialAttendance;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_attendance_v2', JSON.stringify(attendances));
    } catch {}
  }, [attendances]);

  // =============================================================
  // 6. KPI STORE
  // =============================================================
  const initialKpis = [
    {
      id: 'KPI-001',
      noDok: 'KPI/AMS-Q3/2026/01',
      tanggalDok: '2026-09-25',
      project: 'Ashoka View',
      nama: 'Amanda Chesyariani Hermawan',
      kategori: 'Grade A (Sangat Memuaskan)',
      judulDokumen: 'Evaluasi Kinerja Kuartal III 2026 (Skor: 90.8)',
      catatan: 'Disiplin SPR 92% • Target Closing 90% • Evaluator: Yulieka Rachmawati',
      files: [{ name: 'Lembar_Rapor_KPI_Amanda.pdf', size: '1.4 MB' }]
    },
    {
      id: 'KPI-002',
      noDok: 'KPI/AMS-Q3/2026/02',
      tanggalDok: '2026-09-25',
      project: 'Head Office Bizhub',
      nama: 'Tarkum Aditya',
      kategori: 'Grade A (Sangat Memuaskan)',
      judulDokumen: 'Evaluasi Kinerja Kuartal III 2026 (Skor: 93.0)',
      catatan: 'Rekon Piutang 95% • Buku Kas Akurat • Evaluator: Yazid Hizbullah',
      files: [{ name: 'Lembar_Rapor_KPI_Tarkum.pdf', size: '1.5 MB' }]
    },
    {
      id: 'KPI-003',
      noDok: 'KPI/AMS-Q3/2026/03',
      tanggalDok: '2026-09-25',
      project: 'Head Office & Site',
      nama: 'Dodi Syaiful Nugroho',
      kategori: 'Grade A (Sangat Memuaskan)',
      judulDokumen: 'Evaluasi Kinerja Kuartal III 2026 (Skor: 91.8)',
      catatan: 'Aset & Logistik Site Kondusif • Evaluator: Adhi Himawan (GM)',
      files: [{ name: 'Lembar_Rapor_KPI_Dodi.pdf', size: '1.3 MB' }]
    },
    {
      id: 'KPI-004',
      noDok: 'KPI/AMS-Q3/2026/04',
      tanggalDok: '2026-09-25',
      project: 'Ashoka Park',
      nama: 'Kholidin',
      kategori: 'Grade B (Baik & Produktif)',
      judulDokumen: 'Evaluasi Kinerja Kuartal III 2026 (Skor: 83.2)',
      catatan: 'Pengawasan Mutu Sipil Rapi • Perlu Ketepatan Waktu Absen',
      files: [{ name: 'Lembar_Rapor_KPI_Kholidin.pdf', size: '1.2 MB' }]
    }
  ];

  const [kpis, setKpis] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_kpis_v2');
      if (s) return JSON.parse(s);
    } catch {}
    return initialKpis;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_kpis_v2', JSON.stringify(kpis));
    } catch {}
  }, [kpis]);

  // =============================================================
  // 7. MANAGEMENT ASSET STORE
  // =============================================================
  const initialAssets = [
    {
      id: 'AST-001',
      noDok: 'AST-GA-2024-001',
      tanggalDok: '2024-03-15',
      project: 'Ashoka Park',
      nama: 'Budi (Driver Site)',
      kategori: 'Kendaraan Operasional',
      judulDokumen: 'Mobil Toyota Hilux Double Cabin 4x4 (B 9102 GA)',
      catatan: 'Aktif Digunakan • Kondisi Sangat Baik • Nilai Perolehan Rp 485.000.000',
      files: [{ name: 'BPKB_STNK_Hilux.pdf', size: '2.5 MB' }, { name: 'Foto_Fisik_Hilux.jpg', size: '1.8 MB' }]
    },
    {
      id: 'AST-002',
      noDok: 'AST-GA-2024-002',
      tanggalDok: '2024-04-10',
      project: 'Head Office Bizhub',
      nama: 'Staf Arsitek & Desain',
      kategori: 'Peralatan IT & Komputer',
      judulDokumen: 'Laptop ASUS ROG Staf Arsitek & Rendering 3D',
      catatan: 'Aktif Digunakan • Kondisi Sangat Baik • Nilai Perolehan Rp 24.500.000',
      files: [{ name: 'Faktur_Beli_Asus_ROG.pdf', size: '950 KB' }]
    },
    {
      id: 'AST-003',
      noDok: 'AST-GA-2024-003',
      tanggalDok: '2024-05-20',
      project: 'Ashoka Park',
      nama: 'Dedi (Teknik GA)',
      kategori: 'Mesin & Peralatan Proyek',
      judulDokumen: 'Genset Silent Denyo 30 kVA Gardu Utama Kawasan',
      catatan: 'Standby Cadangan • Siap Pakai • Nilai Perolehan Rp 85.000.000',
      files: [{ name: 'Faktur_Garansi_Denyo.pdf', size: '1.3 MB' }]
    },
    {
      id: 'AST-004',
      noDok: 'AST-GA-2024-004',
      tanggalDok: '2024-02-15',
      project: 'Ashoka Park',
      nama: 'Amanda (Admin Mkt)',
      kategori: 'Peralatan Kantor',
      judulDokumen: 'Printer Epson L3210 All-in-One InkTank Galeri Pemasaran',
      catatan: 'Aktif Digunakan • Kondisi Baik • Nilai Perolehan Rp 2.850.000',
      files: [{ name: 'Kuitansi_Epson_L3210.pdf', size: '520 KB' }]
    },
    {
      id: 'AST-005',
      noDok: 'AST-GA-2024-005',
      tanggalDok: '2024-06-12',
      project: 'Ashoka View',
      nama: 'Surveyor Proyek',
      kategori: 'Peralatan Pengukuran Site',
      judulDokumen: 'Total Station Topcon Alat Ukur Kontur & Kavling',
      catatan: 'Tersimpan di Brankas • Terkalibrasi Valid • Nilai Perolehan Rp 65.000.000',
      files: [{ name: 'Sertifikat_Kalibrasi_Topcon.pdf', size: '1.7 MB' }]
    }
  ];

  const [assets, setAssets] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_assets_v2');
      if (s) return JSON.parse(s);
    } catch {}
    return initialAssets;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_assets_v2', JSON.stringify(assets));
    } catch {}
  }, [assets]);

  // =============================================================
  // 8. MAINTANANCE STORE
  // =============================================================
  const initialMaintenanceTickets = [
    {
      id: 'MNT-001',
      noDok: 'MNT/AMS-TKT/2026/01',
      tanggalDok: '2026-09-20',
      project: 'Ashoka Park',
      nama: 'Bengkel Resmi Auto2000',
      kategori: 'Servis Mobil Dinas',
      judulDokumen: 'Servis Berkala Toyota Hilux Double Cabin 10.000 KM',
      catatan: 'Status Selesai • Ganti Oli & Kampas Rem • Biaya: Rp 1.850.000',
      files: [{ name: 'Faktur_Servis_Auto2000.pdf', size: '1.2 MB' }]
    },
    {
      id: 'MNT-002',
      noDok: 'MNT/AMS-TKT/2026/02',
      tanggalDok: '2026-09-24',
      project: 'Ashoka Park',
      nama: 'CV Sejuk Abadi Mandiri',
      kategori: 'Perbaikan AC',
      judulDokumen: 'Perbaikan & Tambah Freon AC Daikin 2 PK Galeri Park',
      catatan: 'Status Selesai • Hembusan Angin Dingin Normal • Biaya: Rp 450.000',
      files: [{ name: 'Kwitansi_Servis_AC.pdf', size: '650 KB' }]
    },
    {
      id: 'MNT-003',
      noDok: 'MNT/AMS-TKT/2026/03',
      tanggalDok: '2026-09-26',
      project: 'Ashoka Park',
      nama: 'Teknisi Diesel GA Pak Joko',
      kategori: 'Perawatan Genset',
      judulDokumen: 'Running Test Beban 30 Menit & Pembersihan Filter Solar',
      catatan: 'Sedang Dikerjakan (Target: 2026-09-28) • Biaya: Rp 650.000',
      files: [{ name: 'Foto_Running_Test_Genset.jpg', size: '2.4 MB' }]
    },
    {
      id: 'MNT-004',
      noDok: 'MNT/AMS-TKT/2026/04',
      tanggalDok: '2026-09-25',
      project: 'Ashoka Park',
      nama: 'Mandor Subur',
      kategori: 'Perbaikan Pompa Air',
      judulDokumen: 'Penggantian Otomatis Saklar Jetpump Mess Pekerja',
      catatan: 'Menunggu Sparepart (Target: 2026-09-27) • Biaya: Rp 350.000',
      files: [{ name: 'Foto_Kerusakan_Saklar.jpg', size: '1.5 MB' }]
    }
  ];

  const [maintenanceTickets, setMaintenanceTickets] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_maintenance_v2');
      if (s) return JSON.parse(s);
    } catch {}
    return initialMaintenanceTickets;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_maintenance_v2', JSON.stringify(maintenanceTickets));
    } catch {}
  }, [maintenanceTickets]);

  // =============================================================
  // 9. KEAMANAN POS SATPAM STORE
  // =============================================================
  const initialSecurities = [
    {
      id: 'SEC-001',
      noDok: 'SEC/AMS-POS/2026/0926-01',
      tanggalDok: '2026-09-26',
      project: 'Ashoka Park',
      nama: 'Hartono (Danru) & Agus Suhendra',
      kategori: 'Keamanan (Shift Siang)',
      judulDokumen: 'Laporan Jaga Gerbang Utama Shift Siang (07:00 - 19:00)',
      catatan: 'Aman Kondusif • Tamu: 14 Orang, Truk Material: 6 Armada',
      files: [{ name: 'Buku_Mutasi_Satpam_Siang.pdf', size: '1.6 MB' }]
    },
    {
      id: 'SEC-002',
      noDok: 'SEC/AMS-POS/2026/0926-02',
      tanggalDok: '2026-09-26',
      project: 'Ashoka Park',
      nama: 'Bambang Irawan & Didik Prasetyo',
      kategori: 'Keamanan (Shift Malam)',
      judulDokumen: 'Laporan Jaga Gerbang Utama Shift Malam (19:00 - 07:00)',
      catatan: 'Aman Terkendali • Patroli Keliling Kavling Setiap 2 Jam',
      files: [{ name: 'Buku_Mutasi_Satpam_Malam.pdf', size: '1.4 MB' }]
    },
    {
      id: 'SEC-003',
      noDok: 'SEC/AMS-POS/2026/0926-03',
      tanggalDok: '2026-09-26',
      project: 'Ashoka View',
      nama: 'Supardi & Rahmat Hidayat',
      kategori: 'Keamanan (Shift 24 Jam)',
      judulDokumen: 'Laporan Jaga Pos Lapangan Ashoka View Cidokom',
      catatan: 'Patroli Rutin Aktif • Tamu: 8 Orang, Truk Material: 3 Unit',
      files: [{ name: 'Logbook_Pos_Ashoka_View.pdf', size: '1.2 MB' }]
    }
  ];

  const [securities, setSecurities] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_security_v3');
      if (s) return JSON.parse(s);
      const old = localStorage.getItem('ams_hr_security_v2');
      if (old) {
        const parsed = JSON.parse(old);
        const filtered = parsed.filter(item => !item.id?.startsWith('CLN-'));
        if (filtered.length > 0) return filtered;
      }
    } catch {}
    return initialSecurities;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_security_v3', JSON.stringify(securities));
    } catch {}
  }, [securities]);

  // =============================================================
  // 10. KEBERSIHAN & SANITASI STORE
  // =============================================================
  const initialCleanings = [
    {
      id: 'CLN-001',
      noDok: 'CLN/AMS-OPS/2026/0926-01',
      tanggalDok: '2026-09-26',
      project: 'Ashoka Park',
      nama: 'Siti Aminah (Petugas CS)',
      kategori: 'Kebersihan & Sanitasi',
      judulDokumen: 'Checklist Kebersihan Marketing Gallery & Toilet Tamu',
      catatan: 'Selesai Wangi & Rapi • Jadwal Pagi 07:00 & Sore 16:30',
      files: [{ name: 'Checklist_Kebersihan_Gallery.pdf', size: '920 KB' }]
    },
    {
      id: 'CLN-002',
      noDok: 'CLN/AMS-OPS/2026/0926-02',
      tanggalDok: '2026-09-26',
      project: 'Head Office Bizhub',
      nama: 'Wawan K. (Petugas CS)',
      kategori: 'Kebersihan & Sanitasi',
      judulDokumen: 'Checklist Kebersihan Ruang Direksi & Kantor Head Office',
      catatan: 'Selesai Dibersihkan • Meja Rapat, Karpet & Sanitasi Rapi',
      files: [{ name: 'Checklist_HO_Bizhub.pdf', size: '850 KB' }]
    },
    {
      id: 'CLN-003',
      noDok: 'CLN/AMS-OPS/2026/0926-03',
      tanggalDok: '2026-09-26',
      project: 'Ashoka Park',
      nama: 'Siti Aminah & Tim CS Lapangan',
      kategori: 'Kebersihan Taman & Kawasan',
      judulDokumen: 'Laporan Pembersihan Jalur Boulevard & Taman Utama Proyek',
      catatan: 'Penyiraman Tanaman & Pembuangan Sampah Terjadwal • Kawasan Bersih & Rapi',
      files: [{ name: 'Logbook_Kebersihan_Taman.pdf', size: '1.1 MB' }]
    }
  ];

  const [cleanings, setCleanings] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_cleaning_v1');
      if (s) return JSON.parse(s);
      const old = localStorage.getItem('ams_hr_security_v2');
      if (old) {
        const parsed = JSON.parse(old);
        const filtered = parsed.filter(item => item.id?.startsWith('CLN-'));
        if (filtered.length > 0) return filtered;
      }
    } catch {}
    return initialCleanings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_cleaning_v1', JSON.stringify(cleanings));
    } catch {}
  }, [cleanings]);

  // =============================================================
  // 10. CCTV MONITORING & KEAMANAN STORE
  // =============================================================
  const initialCctvs = [
    {
      id: 'CCTV-001',
      noDok: 'CCTV/AMS-SEC/2026/01',
      tanggalDok: '2026-09-25',
      project: 'Ashoka Park',
      nama: 'Titik Pos Satpam & Gerbang Utama',
      kategori: 'Kamera Gerbang & Perimeter',
      judulDokumen: 'Kamera IP Hikvision 4MP DarkFighter - Gerbang Utama In/Out',
      catatan: 'Aktif 24 Jam • Cloud Storage NVR 30 Hari • Fitur Plat Nomor ANPR',
      files: [{ name: 'Log_Setup_CCTV_Gerbang_AshokaPark.pdf', size: '1.4 MB' }]
    },
    {
      id: 'CCTV-002',
      noDok: 'CCTV/AMS-SEC/2026/02',
      tanggalDok: '2026-09-26',
      project: 'Head Office Bizhub',
      nama: 'Titik Lobby & Marketing Gallery',
      kategori: 'Kamera Indoor & Kantor',
      judulDokumen: 'Kamera Dome Audio Dual-Way - Lobby Resepsionis & Ruang Rapat',
      catatan: 'Resolusi 2K QHD • Backup UPS 4 Jam • Live Streaming Aplikasi',
      files: [{ name: 'Manual_NVR_Bizhub_CCTV.pdf', size: '2.1 MB' }]
    },
    {
      id: 'CCTV-003',
      noDok: 'CCTV/AMS-SEC/2026/03',
      tanggalDok: '2026-09-27',
      project: 'Ashoka View',
      nama: 'Titik Gudang Material & Workshop',
      kategori: 'Kamera Proyek & Lahan',
      judulDokumen: 'Kamera PTZ 360 Outdoor Night Vision - Area Gudang & Batching Plant',
      catatan: 'Infra Red 100m • Motion Detection Alarm • Sensor Gerak Malam',
      files: [{ name: 'Denah_Titik_Kamera_AshokaView.pdf', size: '1.8 MB' }]
    }
  ];

  const [cctvs, setCctvs] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_cctv_v1');
      if (s) return JSON.parse(s);
    } catch {}
    return initialCctvs;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_cctv_v1', JSON.stringify(cctvs));
    } catch {}
  }, [cctvs]);

  // =============================================================
  // 11. GATHERING & OUTING STORE
  // =============================================================
  const initialGatherings = [
    {
      id: 'GTH-001',
      noDok: 'GTH/AMS-HR/2026/01',
      tanggalDok: '2026-08-15',
      project: 'Semua Proyek',
      nama: 'Panitia Gathering HR & GA (PIC: Dodi Syaiful)',
      kategori: 'Family Gathering',
      judulDokumen: 'Proposal & Anggaran Family Gathering Tahunan PT Yazfi - Puncak Bogor',
      catatan: 'Rencana 120 Peserta Karyawan & Keluarga • Rundown Acara, Doorprize & Transportasi Bus Pariwisata',
      files: [{ name: 'Proposal_Family_Gathering_2026.pdf', size: '2.4 MB' }]
    },
    {
      id: 'GTH-002',
      noDok: 'GTH/AMS-HR/2026/02',
      tanggalDok: '2026-04-10',
      project: 'Head Office Bizhub',
      nama: 'Panitia Halal Bihalal & Silaturahmi Direksi',
      kategori: 'Halal Bihalal',
      judulDokumen: 'Laporan & Dokumentasi Silaturahmi Halal Bihalal Idul Fitri 1447 H',
      catatan: 'Sukses Terlaksana di Marketing Gallery Bizhub • Tausiyah & Ramah Tamah Manajemen',
      files: [{ name: 'Dokumentasi_Halal_Bihalal_2026.pdf', size: '3.1 MB' }]
    },
    {
      id: 'GTH-003',
      noDok: 'GTH/AMS-HR/2026/03',
      tanggalDok: '2026-06-20',
      project: 'Ashoka Park',
      nama: 'Team Building Lapangan & Marketing',
      kategori: 'Team Building',
      judulDokumen: 'Kegiatan Outbound & Leadership Training Karyawan Proyek Ashoka Park',
      catatan: 'Peningkatan Sinergi Tim Lapangan, Teknik & Sales • Lokasi Camp Hulu Cai Ciawi',
      files: [{ name: 'LPJ_Team_Building_Outbound.pdf', size: '1.9 MB' }]
    }
  ];

  const [gatherings, setGatherings] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_gathering_v1');
      if (s) return JSON.parse(s);
    } catch {}
    return initialGatherings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_gathering_v1', JSON.stringify(gatherings));
    } catch {}
  }, [gatherings]);

  // =============================================================
  // COMMON SEARCH & FILTER STATES FOR EACH TAB
  // =============================================================
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('ALL');
  const [filterProject, setFilterProject] = useState('ALL');

  // Reset filter when switching tabs
  useEffect(() => {
    setSearchTerm('');
    setFilterKategori('ALL');
    setFilterProject('ALL');
  }, [activeTab]);

  // Modal Viewing & Form States
  const [viewingDoc, setViewingDoc] = useState(null);
  const [docPrintMode, setDocPrintMode] = useState('all');
  const [currentFileSlide, setCurrentFileSlide] = useState(0);
  const modalScrollRef = useRef(null);

  // Form Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formState, setFormState] = useState({
    noDok: '',
    tanggalDok: new Date().toISOString().split('T')[0],
    project: 'Head Office Bizhub',
    nama: '',
    kategori: '',
    judulDokumen: '',
    catatan: '',
    files: [],
    // Data Base Karyawan specific fields
    nik: '',
    npwp: '',
    noRekening: '',
    alamat: '',
    noHp: '',
    jabatan: '',
    penempatan: 'Head Office Bizhub',
    status: 'Karyawan Tetap (PKWTT)',
    istriSuami: '',
    anak1: '',
    anak2: '',
    anak3: '',
    anak4: '',
    tanggalMasuk: new Date().toISOString().split('T')[0]
  });

  // Getter data aktif berdasarkan activeTab
  const currentDataset = useMemo(() => {
    switch (activeTab) {
      case 'database-karyawan': return employees;
      default: return [];
    }
  }, [activeTab, employees]);

  // Filtered dataset
  const filteredDataset = useMemo(() => {
    return currentDataset.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.noDok && item.noDok.toLowerCase().includes(q)) ||
        (item.nama && item.nama.toLowerCase().includes(q)) ||
        (item.judulDokumen && item.judulDokumen.toLowerCase().includes(q)) ||
        (item.kategori && item.kategori.toLowerCase().includes(q)) ||
        (item.catatan && item.catatan.toLowerCase().includes(q)) ||
        (item.nik && item.nik.toLowerCase().includes(q)) ||
        (item.npwp && item.npwp.toLowerCase().includes(q)) ||
        (item.noRekening && item.noRekening.toLowerCase().includes(q)) ||
        (item.jabatan && item.jabatan.toLowerCase().includes(q)) ||
        (item.penempatan && item.penempatan.toLowerCase().includes(q)) ||
        (item.status && item.status.toLowerCase().includes(q)) ||
        (item.alamat && item.alamat.toLowerCase().includes(q)) ||
        (item.noHp && item.noHp.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q));

      const matchKategori = filterKategori === 'ALL' || 
        (item.kategori || '').toLowerCase() === filterKategori.toLowerCase() ||
        (item.status || '').toLowerCase() === filterKategori.toLowerCase();

      const matchProject = filterProject === 'ALL' || 
        (item.project || '').toLowerCase().includes(filterProject.toLowerCase()) ||
        (item.penempatan || '').toLowerCase().includes(filterProject.toLowerCase());

      return matchSearch && matchKategori && matchProject;
    });
  }, [currentDataset, searchTerm, filterKategori, filterProject]);

  // Categories list per tab
  const tabCategories = useMemo(() => {
    if (activeTab === 'database-karyawan') {
      const statuses = Array.from(new Set(currentDataset.map(d => d.status || d.kategori).filter(Boolean)));
      return ['ALL', ...statuses];
    }
    const cats = Array.from(new Set(currentDataset.map(d => d.kategori).filter(Boolean)));
    return ['ALL', ...cats];
  }, [currentDataset, activeTab]);

  // Configuration 12 Tabs (2 Baris Sejajar Rata 6 Kolom):
  // Bagian Atas (HR - 6 Tab Sejajar): Data Base Karyawan, Recruitment, Kontrak Kerja, Absensi, KPI, Gathering
  const HR_GA_SUBTABS_TOP = [
    { id: 'database-karyawan', label: 'Data Base Karyawan' },
    { id: 'recruitment', label: 'Recruitment' },
    { id: 'kontrak-kerja', label: 'Kontrak Kerja' },
    { id: 'absensi', label: 'Absensi' },
    { id: 'kpi', label: 'KPI' },
    { id: 'gathering', label: 'Gathering' }
  ];

  // Bagian Bawah (GA - 6 Tab Sejajar): Management Asset, Maintanance, Fasilitas, Keamanan, Kebersihan, CCTV
  const HR_GA_SUBTABS_BOTTOM = [
    { id: 'management-asset', label: 'Management Asset' },
    { id: 'maintanance', label: 'Maintanance' },
    { id: 'fasilitas', label: 'Fasilitas' },
    { id: 'keamanan', label: 'Keamanan' },
    { id: 'kebersihan', label: 'Kebersihan' },
    { id: 'cctv', label: 'CCTV' }
  ];

  const HR_GA_SUBTABS = [...HR_GA_SUBTABS_TOP, ...HR_GA_SUBTABS_BOTTOM];

  // Title info per tab
  const getTabTitle = () => {
    switch (activeTab) {
      case 'database-karyawan': return { title: 'Data Base Karyawan', sub: 'Pencatatan data induk karyawan, NIK, jabatan, status kerja & berkas identitas resmi.' };
      case 'recruitment': return { title: 'Recruitment', sub: 'Pipeline pendaftaran pelamar, seleksi berkas, jadwal wawancara & offering letter.' };
      case 'kontrak-kerja': return { title: 'Kontrak Kerja', sub: 'Monitoring masa berlaku perjanjian kerja (PKWT/PKWTT), draf kontrak & alert perpanjangan.' };
      case 'absensi': return { title: 'Absensi', sub: 'Rekapitulasi presensi harian masuk dan pulang, toleransi keterlambatan & surat izin sakit/tugas.' };
      case 'kpi': return { title: 'KPI', sub: 'Rapor evaluasi capaian kinerja berkala karyawan, penilaian disiplin, target output & etika kerja.' };
      case 'gathering': return { title: 'Gathering', sub: 'Dokumentasi agenda gathering perusahaan, family gathering tahunan, halal bihalal & outbound karyawan.' };
      case 'management-asset': return { title: 'Management Asset', sub: 'Pencatatan aset tetap perusahaan, kode inventaris, lokasi penempatan & nilai perolehan.' };
      case 'maintanance': return { title: 'Maintanance', sub: 'Jadwal dan tiket perbaikan berkala armada dinas, AC kantor, genset & utilitas operasional.' };
      case 'fasilitas': return { title: 'Fasilitas', sub: 'Inventarisasi sarana kantor pemasaran, galeri display, utilitas listrik & akomodasi pekerja.' };
      case 'keamanan': return { title: 'Keamanan', sub: 'Laporan shift harian satpam, pos gerbang utama, kontrol armada truk & buku mutasi penjagaan.' };
      case 'kebersihan': return { title: 'Kebersihan', sub: 'Checklist kebersihan kantor pemasaran, sanitasi toilet, pembersihan taman boulevard & pembuangan sampah.' };
      case 'keamanan-kebersihan': return { title: 'Keamanan', sub: 'Laporan shift harian satpam, pos gerbang utama, kontrol armada truk & buku mutasi penjagaan.' };
      case 'cctv': return { title: 'CCTV', sub: 'Monitoring titik kamera pengawas, instalasi NVR/DVR, rekaman keamanan gerbang & kawasan proyek.' };
      default: return { title: 'Hr & Ga', sub: 'Sistem Manajemen Human Resources & General Affair' };
    }
  };

  // Handlers CRUD
  const handleOpenAdd = () => {
    setEditingItemId(null);
    const prefixMap = {
      'database-karyawan': 'AMS-EMP-2026-',
      'recruitment': 'REC/AMS-JOB/2026/',
      'kontrak-kerja': 'PKWT/AMS-HR/2026/',
      'absensi': 'ATT/AMS-PR/2026/',
      'kpi': 'KPI/AMS-Q3/2026/',
      'gathering': 'GTH/AMS-HR/2026/',
      'management-asset': 'AST-GA-2026-',
      'maintanance': 'MNT/AMS-TKT/2026/',
      'fasilitas': 'FAS/AMS-FAS/2026/',
      'keamanan': 'SEC/AMS-POS/2026/',
      'kebersihan': 'CLN/AMS-OPS/2026/',
      'keamanan-kebersihan': 'SEC/AMS-POS/2026/',
      'cctv': 'CCTV/AMS-SEC/2026/'
    };
    const nextSeq = String(currentDataset.length + 1).padStart(2, '0');
    setFormState({
      noDok: `${prefixMap[activeTab] || 'DOC/AMS/'}${nextSeq}`,
      tanggalDok: new Date().toISOString().split('T')[0],
      project: 'Head Office Bizhub',
      nama: '',
      kategori: tabCategories.find(c => c !== 'ALL') || 'Umum',
      judulDokumen: '',
      catatan: '',
      files: [],
      // Employee specific defaults
      nik: '',
      npwp: '',
      noRekening: '',
      alamat: '',
      noHp: '',
      jabatan: '',
      penempatan: 'Head Office Bizhub',
      status: 'Karyawan Tetap (PKWTT)',
      istriSuami: '',
      anak1: '',
      anak2: '',
      anak3: '',
      anak4: '',
      tanggalMasuk: new Date().toISOString().split('T')[0]
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItemId(item.id);
    const fam = item.namaKeluarga || {};
    setFormState({
      noDok: item.noDok || '',
      tanggalDok: item.tanggalDok || item.tanggalMasuk || '',
      project: item.project || item.penempatan || 'Head Office Bizhub',
      nama: item.nama || item.name || '',
      kategori: item.kategori || item.status || '',
      judulDokumen: item.judulDokumen || item.jabatan || '',
      catatan: item.catatan || '',
      files: item.files || [],
      // Employee specific
      nik: item.nik || '',
      npwp: item.npwp || '',
      noRekening: item.noRekening || '',
      alamat: item.alamat || '',
      noHp: item.noHp || item.phone || '',
      jabatan: item.jabatan || item.judulDokumen || '',
      penempatan: item.penempatan || item.project || 'Head Office Bizhub',
      status: item.status || item.catatan || 'Karyawan Tetap (PKWTT)',
      istriSuami: fam.istriSuami || item.istriSuami || '',
      anak1: fam.anak1 || item.anak1 || '',
      anak2: fam.anak2 || item.anak2 || '',
      anak3: fam.anak3 || item.anak3 || '',
      anak4: fam.anak4 || item.anak4 || '',
      tanggalMasuk: item.tanggalMasuk || item.tanggalDok || new Date().toISOString().split('T')[0]
    });
    setIsFormModalOpen(true);
  };

  const handleDeleteItem = (id, title) => {
    if (confirm(`Yakin ingin menghapus dokumen "${title || id}"?`)) {
      const updater = (prev) => prev.filter(x => x.id !== id);
      switch (activeTab) {
        case 'database-karyawan': setEmployees(updater); break;
        case 'recruitment': setCandidates(updater); break;
        case 'kontrak-kerja': setContracts(updater); break;
        case 'absensi': setAttendances(updater); break;
        case 'kpi': setKpis(updater); break;
        case 'gathering': setGatherings(updater); break;
        case 'management-asset': setAssets(updater); break;
        case 'maintanance': setMaintenanceTickets(updater); break;
        case 'fasilitas': setFacilities(updater); break;
        case 'keamanan': setSecurities(updater); break;
        case 'kebersihan': setCleanings(updater); break;
        case 'keamanan-kebersihan': setSecurities(updater); break;
        case 'cctv': setCctvs(updater); break;
      }
      showNotification(`Dokumen "${title || id}" berhasil dihapus!`, 'info');
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (activeTab === 'database-karyawan') {
      if (!formState.nama) {
        showNotification('Mohon lengkapi Nama Karyawan!', 'warning');
        return;
      }
    } else {
      if (!formState.nama || !formState.judulDokumen) {
        showNotification('Mohon lengkapi Nama dan Judul Dokumen!', 'warning');
        return;
      }
    }

    const payload = {
      ...formState,
      nama: formState.nama.trim(),
      noRekening: formState.noRekening || '',
      // Ensure sync between specific employee fields and generic fields
      judulDokumen: formState.jabatan || formState.judulDokumen || 'Staff Karyawan',
      project: formState.penempatan || formState.project || 'Head Office Bizhub',
      penempatan: formState.penempatan || formState.project || 'Head Office Bizhub',
      kategori: formState.status || formState.kategori || 'Karyawan Tetap (PKWTT)',
      status: formState.status || formState.kategori || 'Karyawan Tetap (PKWTT)',
      tanggalDok: formState.tanggalMasuk || formState.tanggalDok || new Date().toISOString().split('T')[0],
      tanggalMasuk: formState.tanggalMasuk || formState.tanggalDok || new Date().toISOString().split('T')[0],
      phone: formState.noHp || formState.phone || '',
      noHp: formState.noHp || formState.phone || '',
      namaKeluarga: {
        istriSuami: formState.istriSuami || '',
        anak1: formState.anak1 || '',
        anak2: formState.anak2 || '',
        anak3: formState.anak3 || '',
        anak4: formState.anak4 || ''
      }
    };

    const updater = (prev) => {
      if (editingItemId) {
        return prev.map(item => item.id === editingItemId ? { ...item, ...payload } : item);
      } else {
        const newItem = {
          ...payload,
          id: `EMP-${Date.now()}`
        };
        return [newItem, ...prev];
      }
    };

    switch (activeTab) {
      case 'database-karyawan': setEmployees(updater); break;
      case 'recruitment': setCandidates(updater); break;
      case 'kontrak-kerja': setContracts(updater); break;
      case 'absensi': setAttendances(updater); break;
      case 'kpi': setKpis(updater); break;
      case 'gathering': setGatherings(updater); break;
      case 'management-asset': setAssets(updater); break;
      case 'maintanance': setMaintenanceTickets(updater); break;
      case 'fasilitas': setFacilities(updater); break;
      case 'keamanan': setSecurities(updater); break;
      case 'kebersihan': setCleanings(updater); break;
      case 'keamanan-kebersihan': setSecurities(updater); break;
      case 'cctv': setCctvs(updater); break;
    }

    setIsFormModalOpen(false);
    showNotification(`Data ${formState.nama} berhasil ${editingItemId ? 'diperbarui' : 'disimpan'}!`, 'success');
  };

  // Upload file handlers
  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    if (!uploaded || uploaded.length === 0) return;

    uploaded.forEach(file => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const fileObj = {
          name: file.name,
          size: (file.size / 1024 < 1000) ? `${Math.round(file.size / 1024)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          data: loadEvt.target.result,
          type: file.type
        };
        setFormState(prev => ({
          ...prev,
          files: [...(prev.files || []), fileObj]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (idx) => {
    setFormState(prev => ({
      ...prev,
      files: (prev.files || []).filter((_, i) => i !== idx)
    }));
  };

  // Export Excel
  const handleExportExcel = () => {
    let exportData;
    if (activeTab === 'database-karyawan') {
      exportData = filteredDataset.map((item, idx) => ({
        'No': idx + 1,
        'Nama Karyawan': item.nama || '-',
        'NIK': item.nik || '-',
        'NPWP': item.npwp || '-',
        'No. Rekening': item.noRekening || '-',
        'Jabatan': item.jabatan || item.judulDokumen || '-',
        'Penempatan': item.penempatan || item.project || '-',
        'Status': item.status || item.catatan || '-',
        'Tanggal Masuk': item.tanggalMasuk || item.tanggalDok || '-',
        'No. HP': item.noHp || item.phone || '-',
        'Alamat': item.alamat || '-',
        'Istri / Suami': (item.namaKeluarga && item.namaKeluarga.istriSuami) || item.istriSuami || '-',
        'Anak 1': (item.namaKeluarga && item.namaKeluarga.anak1) || item.anak1 || '-',
        'Anak 2': (item.namaKeluarga && item.namaKeluarga.anak2) || item.anak2 || '-',
        'Anak 3': (item.namaKeluarga && item.namaKeluarga.anak3) || item.anak3 || '-',
        'Anak 4': (item.namaKeluarga && item.namaKeluarga.anak4) || item.anak4 || '-',
        'Jumlah Berkas Dokumen': (item.files && item.files.length) || 0
      }));
    } else {
      exportData = filteredDataset.map((item, idx) => ({
        'No': idx + 1,
        'No. Dok': item.noDok || '-',
        'Tanggal Dokumen': item.tanggalDok || '-',
        'Proyek': item.project || '-',
        'Nama': item.nama || '-',
        'Kategori': item.kategori || '-',
        'Judul Dokumen': item.judulDokumen || '-',
        'Jumlah Berkas': (item.files && item.files.length) || 0,
        'Catatan': item.catatan || '-'
      }));
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab);
    XLSX.writeFile(wb, `AMS_HRGA_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification(`Data ${getTabTitle().title} berhasil diekspor ke Excel!`, 'success');
  };

  // Download Berkas
  const handleDownloadFile = (data, name) => {
    if (data) {
      const a = document.createElement('a');
      a.href = data;
      a.download = name || 'berkas_dokumen.pdf';
      a.click();
    } else {
      const content = `ARSIP DIGITAL RESMI AMS HR & GA\nNama Berkas: ${name}\nStatus: Terverifikasi Digital`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name ? (name.endsWith('.pdf') ? name.replace(/\.pdf$/, '.txt') : name) : 'berkas_arsip.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
    showNotification(`Berkas ${name} siap diunduh!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem', color: '#f1f5f9' }}>
      
      {/* ========================================================================= */}
      {/* HEADER UTAMA HR & GA                                                      */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '0.2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Users size={22} />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Hr & Ga
          </div>
        </div>

        {/* GRUP TOMBOL PENGAJUAN & STATUS DANA RAPAT */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {/* Tombol Status Pengajuan Dana */}
          <button
            type="button"
            style={{
              background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
              border: '1.5px solid #ef4444',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(185, 28, 28, 0.4)',
              cursor: 'pointer'
            }}
            onClick={() => setIsTrackerModalOpen(true)}
          >
            <FileText size={15} color="#ffffff" /> Status Pengajuan Dana
          </button>

          {/* Tombol Ajukan Dana Terintegrasi ke Finance & Acc */}
          <button
            type="button"
            style={{
              background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
              border: '1.5px solid #ef4444',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(185, 28, 28, 0.4)',
              cursor: 'pointer'
            }}
            onClick={() => setIsFundModalOpen(true)}
          >
            <DollarSign size={15} color="#ffffff" /> + Ajukan Dana ke Finance
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BILAH SUB-TAB HR & GA: DUA BAGIAN SEJAJAR RATA (ATAS: HR, BAWAH: GA)       */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          border: '1.5px solid #1e293b',
          borderRadius: '14px',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowX: 'auto'
        }}
      >
        {/* Bagian Atas (HR - 6 Tab Sejajar Rata): Data Base Karyawan, Recruitment, Kontrak Kerja, Absensi, KPI, Gathering */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(120px, 1fr))',
            gap: '8px',
            alignItems: 'stretch',
            minWidth: '760px'
          }}
        >
          {HR_GA_SUBTABS_TOP.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : '#0f172a',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: isActive ? '1.5px solid #34d399' : '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '10px 6px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 900 : 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: isActive ? '0 4px 14px rgba(16, 185, 129, 0.45)' : 'none',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  width: '100%'
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bagian Bawah (GA - 6 Tab Sejajar Rata): Management Asset, Maintanance, Fasilitas, Keamanan, Kebersihan, CCTV */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(120px, 1fr))',
            gap: '8px',
            alignItems: 'stretch',
            minWidth: '760px'
          }}
        >
          {HR_GA_SUBTABS_BOTTOM.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : '#0f172a',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: isActive ? '1.5px solid #34d399' : '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '10px 6px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 900 : 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: isActive ? '0 4px 14px rgba(16, 185, 129, 0.45)' : 'none',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  width: '100%'
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KONTEN UTAMA TAB: TABEL 10 KOLOM PERSIS SPK & LITIGASI                   */}
      {/* No. | No. Dok | Tanggal Dokumen | Proyek | Nama | Kategori | Judul | Berkas | Catatan | Aksi */}
      {/* ========================================================================= */}
      {activeTab === 'database-karyawan' ? (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
        
        {/* Header Title & Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1.5px solid #10b981',
                color: '#34d399',
                fontSize: '0.85rem',
                fontWeight: 900,
                padding: '5px 14px',
                borderRadius: '8px',
                letterSpacing: '0.3px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Users size={16} />
              <span>Data Base Karyawan</span>
            </span>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Pencatatan data induk karyawan, NIK, jabatan, status kerja & berkas identitas resmi.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportExcel}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                background: '#0f172a',
                border: '1px solid #334155',
                color: '#34d399'
              }}
            >
              <FileSpreadsheet size={14} />
              <span>Unduh Excel</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="btn btn-primary btn-sm"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
              }}
            >
              <Plus size={15} />
              <span>+ Tambah Karyawan</span>
            </button>
          </div>
        </div>

        {/* Toolbar Pencarian & Dropdown Filter */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '10px 14px',
            background: '#090d16',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            marginBottom: '1rem'
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder={`Cari no. dok, nama, judul, catatan di ${getTabTitle().title}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.76rem'
              }}
            />
          </div>

          {/* Dropdown Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Filter size={13} color="#94a3b8" />
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
              >
                {tabCategories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'ALL' ? 'Semua Status Karyawan' : cat}</option>
                ))}
              </select>
            </div>

            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
            >
              <option value="ALL">Semua Proyek / Lokasi</option>
              <option value="Ashoka Park">Ashoka Park</option>
              <option value="Ashoka View">Ashoka View</option>
              <option value="Head Office">Head Office Bizhub</option>
            </select>
          </div>
        </div>

        {/* TABEL UTAMA DATABASE KARYAWAN 13 KOLOM */}
        {filteredDataset.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users size={28} />
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Data Karyawan</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
              Daftar induk karyawan belum tersedia atau tidak cocok dengan filter pencarian.
            </div>
            <button
              onClick={handleOpenAdd}
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)' }}
            >
              <Plus size={15} />
              <span>+ Tambah Karyawan Baru</span>
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #065f46', boxShadow: '0 4px 20px rgba(5, 150, 105, 0.15)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b', whiteSpace: 'nowrap' }}>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>No.</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama Karyawan</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>NIK</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>NPWP</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>No. Rekening</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>Jabatan</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>Penempatan</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>Tanggal Masuk</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>No. HP</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>Alamat</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama Keluarga</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, whiteSpace: 'nowrap' }}>Dokumen</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', fontWeight: 900, whiteSpace: 'nowrap' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataset.map((item, idx) => {
                    const filesCount = (item.files || []).length;
                    const fam = item.namaKeluarga || {};
                    const childrenList = [fam.anak1, fam.anak2, fam.anak3, fam.anak4].filter(Boolean);

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                          whiteSpace: 'nowrap',
                          transition: 'background 0.15s'
                        }}
                      >
                        {/* 1. No */}
                        <td style={{ padding: '10px 10px', textAlign: 'center', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #1e293b', verticalAlign: 'middle' }}>
                          {idx + 1}
                        </td>

                        {/* 2. Nama Karyawan */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>
                              {(item.nama || 'K').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: '#ffffff' }}>{item.nama}</div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>{item.id || item.noDok}</div>
                            </div>
                          </div>
                        </td>

                        {/* 3. NIK */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#34d399', borderRight: '1px solid #1e293b', fontFamily: 'monospace', verticalAlign: 'middle' }}>
                          {item.nik || '-'}
                        </td>

                        {/* 4. NPWP */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#cbd5e1', borderRight: '1px solid #1e293b', fontFamily: 'monospace', verticalAlign: 'middle' }}>
                          {item.npwp || '-'}
                        </td>

                        {/* 5. No. Rekening */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#34d399', borderRight: '1px solid #1e293b', fontWeight: 700, verticalAlign: 'middle', fontSize: '0.74rem' }}>
                          <span style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            {item.noRekening || '-'}
                          </span>
                        </td>

                        {/* 6. Jabatan */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', verticalAlign: 'middle' }}>
                          <span style={{ color: '#f1f5f9', fontWeight: 700 }}>
                            {item.jabatan || item.judulDokumen || '-'}
                          </span>
                        </td>

                        {/* 6. Penempatan */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b', verticalAlign: 'middle' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              fontWeight: 800
                            }}
                          >
                            {item.penempatan || item.project || 'Head Office Bizhub'}
                          </span>
                        </td>

                        {/* 7. Status */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b', verticalAlign: 'middle' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: (item.status || item.catatan || '').includes('Tetap') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: (item.status || item.catatan || '').includes('Tetap') ? '#34d399' : '#fbbf24',
                              border: (item.status || item.catatan || '').includes('Tetap') ? '1px solid #10b981' : '1px solid #f59e0b',
                              fontWeight: 800
                            }}
                          >
                            {item.status || item.catatan || 'Karyawan Tetap'}
                          </span>
                        </td>

                        {/* 8. Tanggal Masuk */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0', fontWeight: 600, borderRight: '1px solid #1e293b', verticalAlign: 'middle' }}>
                          {formatDisplayDate(item.tanggalMasuk || item.tanggalDok)}
                        </td>

                        {/* 9. No. HP */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#38bdf8', fontWeight: 600, borderRight: '1px solid #1e293b', verticalAlign: 'middle', fontFamily: 'monospace' }}>
                          {item.noHp || item.phone || '-'}
                        </td>

                        {/* 10. Alamat */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', verticalAlign: 'middle', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ color: '#cbd5e1', fontSize: '0.74rem' }} title={item.alamat}>
                            {item.alamat || '-'}
                          </span>
                        </td>

                        {/* 11. Nama Keluarga */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', verticalAlign: 'middle', maxWidth: '220px' }}>
                          <div style={{ fontSize: '0.73rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {fam.istriSuami ? (
                              <div style={{ color: '#ffffff' }}>
                                <span style={{ color: '#94a3b8' }}>Pasangan: </span>{fam.istriSuami}
                              </div>
                            ) : (
                              <span style={{ color: '#64748b' }}>-</span>
                            )}
                            {childrenList.length > 0 && (
                              <div style={{ color: '#34d399', fontSize: '0.69rem' }}>
                                {childrenList.length} Anak: {childrenList.join(', ')}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 12. Dokumen Karyawan */}
                        <td style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #1e293b', verticalAlign: 'middle' }}>
                          {filesCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setViewingDoc(item);
                                setCurrentFileSlide(0);
                                setDocPrintMode('all');
                              }}
                              style={{
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                border: '1px solid #10b981',
                                padding: '3px 10px',
                                borderRadius: '5px',
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Lihat Berkas Dokumen Karyawan"
                            >
                              <Paperclip size={12} />
                              <span>{filesCount} Dokumen</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Belum ada</span>
                          )}
                        </td>

                        {/* 13. Aksi */}
                        <td style={{ padding: '10px 10px', textAlign: 'center', verticalAlign: 'middle' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setViewingDoc(item);
                                setCurrentFileSlide(0);
                                setDocPrintMode('all');
                              }}
                              style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: '5px',
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Pratinjau / Cetak Lembar Data Karyawan"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleTabChange('kontrak-kerja')}
                              style={{
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                border: '1px solid #10b981',
                                padding: '4px 8px',
                                borderRadius: '5px',
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                              title="Buka Dokumen Kontrak & Grafik Kenaikan Gaji"
                            >
                              <FileText size={12} />
                              <span>Kontrak</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              style={{
                                background: '#1e293b',
                                color: '#34d399',
                                border: '1px solid #334155',
                                padding: '4px 7px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                              }}
                              title="Edit Data Karyawan"
                            >
                              <Edit3 size={12} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id, item.nama)}
                              style={{
                                background: '#1e293b',
                                color: '#ef4444',
                                border: '1px solid #334155',
                                padding: '4px 7px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                              }}
                              title="Hapus Karyawan"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        )}
      </div>
      ) : activeTab === 'recruitment' ? (
        <RecruitmentModule currentUser={currentUser} showNotification={showNotification} onSwitchTab={handleTabChange} />
      ) : activeTab === 'kontrak-kerja' ? (
        <KontrakKerjaModule
          employees={employees}
          setEmployees={setEmployees}
          currentUser={currentUser}
          showNotification={showNotification}
          onSwitchTab={handleTabChange}
        />
      ) : (
        /* KONTEN KOSONG UNTUK SEMUA SUB-MODUL LAINNYA (NAVIGASI TETAP LENGKAP) */
        <div className="glass-card" style={{ padding: '4.5rem 2rem', textAlign: 'center', marginBottom: '1.5rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '16px',
            background: 'rgba(51, 65, 85, 0.35)',
            border: '1px solid #334155',
            color: '#94a3b8',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.2rem'
          }}>
            <Briefcase size={32} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Modul {getTabTitle().title}
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '400px', margin: '0 auto 1.2rem auto' }}>
            Modul sedang dalam pengerjaan
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontSize: '0.74rem', fontWeight: 700 }}>
            <Clock size={13} />
            <span>Sedang Dalam Pengerjaan</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: FORM TAMBAH / EDIT DOKUMEN HR & GA                               */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
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
              width: '100%',
              maxWidth: activeTab === 'database-karyawan' ? '720px' : '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#34d399" />
                <span>{editingItemId ? `Edit Dokumen ${getTabTitle().title}` : `Tambah Dokumen ${getTabTitle().title}`}</span>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* FORM KHUSUS SUBTAB: DATA BASE KARYAWAN (SESUAI GAMBAR REFERENSI USER) */}
            {activeTab === 'database-karyawan' ? (
              <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 1. Nama */}
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Nama Karyawan *</label>
                  <input
                    type="text"
                    value={formState.nama}
                    onChange={(e) => setFormState({ ...formState, nama: e.target.value })}
                    required
                    placeholder="Nama Lengkap Karyawan (e.g. Dodi Syaiful Nugroho)"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}
                  />
                </div>

                {/* 2, 3 & 4. NIK, NPWP & No. Rekening Bank */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>NIK (Nomor KTP)</label>
                    <input
                      type="text"
                      value={formState.nik}
                      onChange={(e) => setFormState({ ...formState, nik: e.target.value })}
                      placeholder="16 Digit NIK"
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#34d399', fontSize: '0.8rem', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>NPWP</label>
                    <input
                      type="text"
                      value={formState.npwp}
                      onChange={(e) => setFormState({ ...formState, npwp: e.target.value })}
                      placeholder="Nomor NPWP Karyawan"
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>No. Rekening Bank</label>
                    <input
                      type="text"
                      value={formState.noRekening}
                      onChange={(e) => setFormState({ ...formState, noRekening: e.target.value })}
                      placeholder="e.g. BCA 8830192819"
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                {/* 4. Alamat */}
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Alamat</label>
                  <textarea
                    rows={2}
                    value={formState.alamat}
                    onChange={(e) => setFormState({ ...formState, alamat: e.target.value })}
                    placeholder="Alamat lengkap domisili / tempat tinggal saat ini"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', resize: 'vertical' }}
                  />
                </div>

                {/* 5 & 6. No. HP & Jabatan */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>No. HP / WhatsApp</label>
                    <input
                      type="text"
                      value={formState.noHp}
                      onChange={(e) => setFormState({ ...formState, noHp: e.target.value })}
                      placeholder="e.g. 0812-3456-7890"
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#38bdf8', fontSize: '0.8rem', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Jabatan *</label>
                    <input
                      type="text"
                      value={formState.jabatan}
                      onChange={(e) => setFormState({ ...formState, jabatan: e.target.value, judulDokumen: e.target.value })}
                      required
                      placeholder="e.g. Project Manager, Arsitek, Legal, Site Supervisor..."
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                {/* 7 & 8. Penempatan & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Penempatan</label>
                    <select
                      value={formState.penempatan}
                      onChange={(e) => setFormState({ ...formState, penempatan: e.target.value, project: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    >
                      <option value="Head Office Bizhub">Head Office Bizhub</option>
                      <option value="Ashoka Park">Ashoka Park</option>
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Semua Proyek">Semua Proyek</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status</label>
                    <select
                      value={formState.status}
                      onChange={(e) => setFormState({ ...formState, status: e.target.value, kategori: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    >
                      <option value="Karyawan Tetap (PKWTT)">Karyawan Tetap (PKWTT)</option>
                      <option value="Karyawan Kontrak (PKWT)">Karyawan Kontrak (PKWT)</option>
                      <option value="Probation / Masa Percobaan">Probation / Masa Percobaan</option>
                      <option value="Freelance / Konsultan">Freelance / Konsultan</option>
                      <option value="Magang / Intern">Magang / Intern</option>
                    </select>
                  </div>
                </div>

                {/* 9. Nama Keluarga (Istri/Suami & Anak 1 - 4) */}
                <div style={{ background: '#0b1324', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} />
                    <span>Nama Keluarga</span>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>&bull; Istri / Suami</label>
                    <input
                      type="text"
                      value={formState.istriSuami}
                      onChange={(e) => setFormState({ ...formState, istriSuami: e.target.value })}
                      placeholder="Nama Istri atau Suami"
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.78rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>&bull; Anak 1</label>
                      <input
                        type="text"
                        value={formState.anak1}
                        onChange={(e) => setFormState({ ...formState, anak1: e.target.value })}
                        placeholder="Nama Anak ke-1"
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.78rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>&bull; Anak 2</label>
                      <input
                        type="text"
                        value={formState.anak2}
                        onChange={(e) => setFormState({ ...formState, anak2: e.target.value })}
                        placeholder="Nama Anak ke-2"
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.78rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>&bull; Anak 3</label>
                      <input
                        type="text"
                        value={formState.anak3}
                        onChange={(e) => setFormState({ ...formState, anak3: e.target.value })}
                        placeholder="Nama Anak ke-3"
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.78rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>&bull; Anak 4</label>
                      <input
                        type="text"
                        value={formState.anak4}
                        onChange={(e) => setFormState({ ...formState, anak4: e.target.value })}
                        placeholder="Nama Anak ke-4"
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 10. Tanggal Masuk */}
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Tanggal Masuk *</label>
                  <input
                    type="date"
                    value={formState.tanggalMasuk}
                    onChange={(e) => setFormState({ ...formState, tanggalMasuk: e.target.value, tanggalDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>

                {/* 11. Upload Dokumen Karyawan (Bisa upload beberapa berkas) */}
                <div style={{ background: '#0f172a', border: '1.5px dashed #059669', borderRadius: '10px', padding: '12px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <UploadCloud size={16} />
                    <span>Upload Dokumen Karyawan (KTP, NPWP, KK, Ijazah, CV, SK, Sertifikat, dll - Bisa Upload Beberapa Dokumen)</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                  />

                  {/* List Dokumen Terunggah */}
                  {formState.files && formState.files.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                        Daftar Dokumen Terpilih ({formState.files.length} berkas):
                      </div>
                      {formState.files.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#090d16',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #065f46',
                            fontSize: '0.72rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                            <CheckCircle2 size={12} color="#34d399" />
                            <span style={{ color: '#ffffff', fontWeight: 600 }}>{f.name}</span>
                            <span style={{ color: '#64748b' }}>({f.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(i)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px', fontWeight: 900 }}
                            title="Hapus berkas ini"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                  <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)', fontWeight: 800 }}>
                    {editingItemId ? 'Simpan Perubahan Karyawan' : 'Simpan Data Base Karyawan'}
                  </button>
                </div>
              </form>
            ) : (
              /* FORM GENERIK DOKUMEN HR & GA UNTUK 8 SUBTAB LAINNYA */
              <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor Dokumen *</label>
                    <input
                      type="text"
                      value={formState.noDok}
                      onChange={(e) => setFormState({ ...formState, noDok: e.target.value })}
                      required
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Dokumen *</label>
                    <input
                      type="date"
                      value={formState.tanggalDok}
                      onChange={(e) => setFormState({ ...formState, tanggalDok: e.target.value })}
                      required
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek / Penempatan</label>
                    <select
                      value={formState.project}
                      onChange={(e) => setFormState({ ...formState, project: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    >
                      <option value="Ashoka Park">Ashoka Park</option>
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Head Office Bizhub">Head Office Bizhub</option>
                      <option value="Semua Proyek">Semua Proyek</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kategori Dokumen *</label>
                    <input
                      type="text"
                      value={formState.kategori}
                      onChange={(e) => setFormState({ ...formState, kategori: e.target.value })}
                      required
                      placeholder="e.g. Direksi, Pelamar, PKWT, Tetap..."
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Orang / Barang / PIC *</label>
                  <input
                    type="text"
                    placeholder="e.g. Nama Karyawan / Nama Kandidat / PIC Aset / Personel Jaga..."
                    value={formState.nama}
                    onChange={(e) => setFormState({ ...formState, nama: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Judul Dokumen / Uraian *</label>
                  <input
                    type="text"
                    placeholder="e.g. Jabatan / Draf PKWT / Sarana / Presensi / Scorecard KPI..."
                    value={formState.judulDokumen}
                    onChange={(e) => setFormState({ ...formState, judulDokumen: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan / Keterangan Tambahan</label>
                  <input
                    type="text"
                    placeholder="e.g. Status kerja, masa berlaku, skor, kondisi barang, shift kerja..."
                    value={formState.catatan}
                    onChange={(e) => setFormState({ ...formState, catatan: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>

                {/* Upload Multi-File Lampiran Berkas */}
                <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '12px' }}>
                  <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <UploadCloud size={14} />
                    <span>Upload Berkas / Lampiran Fisik (Bisa Pilih Banyak Berkas)</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                  />

                  {/* List Berkas Terunggah */}
                  {formState.files && formState.files.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                        Daftar Berkas Terpilih ({formState.files.length} berkas):
                      </div>
                      {formState.files.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#090d16',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #1e293b',
                            fontSize: '0.72rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                            <CheckCircle2 size={12} color="#34d399" />
                            <span style={{ color: '#ffffff', fontWeight: 600 }}>{f.name}</span>
                            <span style={{ color: '#64748b' }}>({f.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(i)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px' }}
                            title="Hapus berkas ini"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                  <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)' }}>
                    {editingItemId ? 'Simpan Perubahan' : 'Simpan & Catat Dokumen'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRATINJAU DOKUMEN & CETAK RESMI KOP SURAT HR & GA               */}
      {/* ========================================================================= */}
      {viewingDoc && (
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
          {/* Print CSS styling scoped for HR & GA */}
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
                .hr-printable-container, .hr-printable-container * {
                  visibility: visible !important;
                }
                .hr-printable-container {
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
            ref={modalScrollRef}
            style={{
              background: '#090d16',
              border: '1.5px solid #10b981',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '840px',
              maxHeight: '92vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
              margin: 'auto 0'
            }}
          >
            {/* Top Header Controls (Hidden on Print) */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.4rem',
                borderBottom: '1px solid #1e293b',
                background: '#0f172a',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '7px', borderRadius: '8px' }}>
                  <Users size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                    Pratinjau Dokumen {getTabTitle().title} ({viewingDoc.kategori})
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    No. Dok: <strong style={{ color: '#34d399' }}>{viewingDoc.noDok || viewingDoc.id}</strong> &bull; {viewingDoc.judulDokumen}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Print Mode & Print & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Print Choice Selector */}
                {(() => {
                  const activeFiles = (viewingDoc.files && viewingDoc.files.length > 0) ? viewingDoc.files : [];
                  const hasFiles = activeFiles.length > 0;

                  return (
                    <div style={{ display: 'flex', background: '#090d16', border: '1px solid #334155', borderRadius: '6px', padding: '2px' }}>
                      <button
                        type="button"
                        onClick={() => setDocPrintMode('all')}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          borderRadius: '4px',
                          border: 'none',
                          background: docPrintMode === 'all' ? '#059669' : 'transparent',
                          color: docPrintMode === 'all' ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocPrintMode('surat')}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          borderRadius: '4px',
                          border: 'none',
                          background: docPrintMode === 'surat' ? '#059669' : 'transparent',
                          color: docPrintMode === 'surat' ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        Surat Saja
                      </button>
                      {hasFiles && (
                        <button
                          type="button"
                          onClick={() => setDocPrintMode('berkas')}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            borderRadius: '4px',
                            border: 'none',
                            background: docPrintMode === 'berkas' ? '#059669' : 'transparent',
                            color: docPrintMode === 'berkas' ? '#ffffff' : '#94a3b8',
                            cursor: 'pointer'
                          }}
                        >
                          Berkas Saja
                        </button>
                      )}
                    </div>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.76rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <Printer size={14} />
                  <span>Cetak</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingDoc(null)}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#cbd5e1',
                    borderRadius: '6px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* SECTION 1: LAMPIRAN BERKAS (If mode is 'all' or 'berkas') */}
              {(() => {
                const activeFiles = (viewingDoc.files && viewingDoc.files.length > 0) ? viewingDoc.files : [];
                if (activeFiles.length === 0 || docPrintMode === 'surat') return null;

                const currentFile = activeFiles[currentFileSlide] || activeFiles[0];

                return (
                  <div
                    className={docPrintMode === 'berkas' ? 'hr-printable-container' : ''}
                    style={{
                      background: '#0f172a',
                      border: '1.5px solid #1e293b',
                      borderRadius: '12px',
                      padding: '1.2rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'gap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Paperclip size={16} color="#34d399" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                          Lampiran Berkas Digital ({activeFiles.length} Berkas)
                        </span>
                      </div>

                      {/* Download Button for Current File */}
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(currentFile.data, currentFile.name)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 12px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
                        }}
                      >
                        <Download size={13} />
                        <span>Unduh Berkas Ini</span>
                      </button>
                    </div>

                    {/* File Carousel Slider (if multiple files) */}
                    {activeFiles.length > 1 && (
                      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090d16', padding: '6px 12px', borderRadius: '6px', marginBottom: '12px' }}>
                        <button
                          type="button"
                          onClick={() => setCurrentFileSlide(prev => (prev > 0 ? prev - 1 : activeFiles.length - 1))}
                          style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
                        >
                          <ChevronLeft size={14} /> Slide Sebelumnya
                        </button>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                          Berkas {currentFileSlide + 1} dari {activeFiles.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentFileSlide(prev => (prev < activeFiles.length - 1 ? prev + 1 : 0))}
                          style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
                        >
                          Slide Berikutnya <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    {/* File Visual Presentation */}
                    <div style={{ background: '#090d16', borderRadius: '8px', padding: '1.2rem', textAlign: 'center', border: '1px solid #1e293b' }}>
                      {currentFile.data && currentFile.data.startsWith('data:image') ? (
                        <img
                          src={currentFile.data}
                          alt={currentFile.name}
                          style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '6px' }}
                        />
                      ) : (
                        <div style={{ padding: '2rem 1rem' }}>
                          <FileText size={48} color="#34d399" style={{ margin: '0 auto 12px auto' }} />
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>{currentFile.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>Ukuran: {currentFile.size || '1.2 MB'}</div>
                          <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '8px', fontWeight: 600 }}>
                            ✓ Terverifikasi dalam sistem arsip digital HR & GA
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* SECTION 2: SURAT RESMI KOP SURAT HR & GA (If mode is 'all' or 'surat') */}
              {docPrintMode !== 'berkas' && (
                <div
                  className="hr-printable-container"
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    padding: '2.2rem 2.4rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    fontFamily: 'Times New Roman, serif',
                    lineHeight: '1.4'
                  }}
                >
                  {/* Kop Surat Resmi */}
                  <div style={{ borderBottom: '2.5px solid #000000', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src="/company-logo.png"
                      alt="Logo Ashoka"
                      style={{ width: '65px', height: '65px', objectFit: 'contain' }}
                    />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {(viewingDoc.project || '').includes('Park') ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMILANG PERSADA'}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                        DEPARTEMEN HUMAN RESOURCES & GENERAL AFFAIR (HR & GA)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>
                        Kantor Operasional: Ruko Ashoka Square, Jl. Raya Pemda No. 88, Cibinong - Bogor | Telp: (021) 8790-1234
                      </div>
                    </div>
                  </div>

                  {/* Judul Surat Resmi */}
                  <div style={{ textAlign: 'center', margin: '14px 0 18px 0' }}>
                    <div style={{ fontSize: '1.08rem', fontWeight: 900, textDecoration: 'underline', textTransform: 'uppercase' }}>
                      REGISTER & LEMBAR VERIFIKASI RESMI {getTabTitle().title.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '4px' }}>
                      Nomor Dokumen: {viewingDoc.noDok || viewingDoc.id}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                      Tanggal Registrasi: {formatDisplayDate(viewingDoc.tanggalDok || viewingDoc.date)}
                    </div>
                  </div>

                  {/* Isi Ringkasan Dokumen */}
                  <div style={{ fontSize: '0.84rem', margin: '14px 0', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 10px 0' }}>
                      Telah dicatatkan dan diverifikasi dalam sistem operasional HR & GA data administrasi perusahaan dengan rincian identitas sebagai berikut:
                    </p>

                    {/* Table Rincian: Format Khusus Data Base Karyawan VS Dokumen Standar */}
                    {(activeTab === 'database-karyawan' || viewingDoc.nik || viewingDoc.namaKeluarga) ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', margin: '10px 0' }}>
                        <tbody>
                          <tr>
                            <td style={{ width: '180px', padding: '4px 8px', fontWeight: 700 }}>Nama Lengkap</td>
                            <td style={{ padding: '4px 8px' }}>: <strong>{viewingDoc.nama || viewingDoc.name || '-'}</strong></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>NIK (Nomor KTP)</td>
                            <td style={{ padding: '4px 8px' }}>: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#047857' }}>{viewingDoc.nik || '-'}</span></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>NPWP</td>
                            <td style={{ padding: '4px 8px' }}>: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{viewingDoc.npwp || '-'}</span></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>No. Rekening Bank</td>
                            <td style={{ padding: '4px 8px' }}>: <span style={{ fontWeight: 700, color: '#047857' }}>{viewingDoc.noRekening || '-'}</span></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>Alamat Domisili</td>
                            <td style={{ padding: '4px 8px' }}>: {viewingDoc.alamat || '-'}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>No. HP / WhatsApp</td>
                            <td style={{ padding: '4px 8px' }}>: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{viewingDoc.noHp || viewingDoc.phone || '-'}</span></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>Jabatan</td>
                            <td style={{ padding: '4px 8px' }}>: <strong>{viewingDoc.jabatan || viewingDoc.judulDokumen || '-'}</strong></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>Penempatan</td>
                            <td style={{ padding: '4px 8px' }}>: <strong style={{ color: '#047857' }}>{viewingDoc.penempatan || viewingDoc.project || 'Head Office Bizhub'}</strong></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>Status Kepegawaian</td>
                            <td style={{ padding: '4px 8px' }}>: <span style={{ fontWeight: 800, color: '#0284c7' }}>{viewingDoc.status || viewingDoc.kategori || '-'}</span></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>Tanggal Masuk</td>
                            <td style={{ padding: '4px 8px' }}>: <strong>{formatDisplayDate(viewingDoc.tanggalMasuk || viewingDoc.tanggalDok)}</strong></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700, verticalAlign: 'top' }}>Nama Keluarga</td>
                            <td style={{ padding: '4px 8px' }}>
                              <div>: Istri / Suami: <strong>{(viewingDoc.namaKeluarga && viewingDoc.namaKeluarga.istriSuami) || viewingDoc.istriSuami || '-'}</strong></div>
                              <div style={{ paddingLeft: '10px', marginTop: '2px', color: '#475569', fontSize: '0.8rem' }}>
                                {(() => {
                                  const fam = viewingDoc.namaKeluarga || {};
                                  const kids = [
                                    fam.anak1 ? `Anak 1: ${fam.anak1}` : (viewingDoc.anak1 ? `Anak 1: ${viewingDoc.anak1}` : null),
                                    fam.anak2 ? `Anak 2: ${fam.anak2}` : (viewingDoc.anak2 ? `Anak 2: ${viewingDoc.anak2}` : null),
                                    fam.anak3 ? `Anak 3: ${fam.anak3}` : (viewingDoc.anak3 ? `Anak 3: ${viewingDoc.anak3}` : null),
                                    fam.anak4 ? `Anak 4: ${fam.anak4}` : (viewingDoc.anak4 ? `Anak 4: ${viewingDoc.anak4}` : null),
                                  ].filter(Boolean);

                                  return kids.length > 0 ? kids.map((k, idx) => (
                                    <div key={idx}>&bull; {k}</div>
                                  )) : <div>&bull; Belum dicatatkan data anak</div>;
                                })()}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 8px', fontWeight: 700 }}>Dokumen Terlampir</td>
                            <td style={{ padding: '4px 8px' }}>
                              : Terlampir <strong>{(viewingDoc.files || []).length} berkas digital</strong>
                              {(viewingDoc.files || []).length > 0 && (
                                <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '6px' }}>
                                  ({(viewingDoc.files || []).map(f => f.name).join(', ')})
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', margin: '10px 0' }}>
                        <tbody>
                          <tr>
                            <td style={{ width: '170px', padding: '5px 8px', fontWeight: 700 }}>Proyek / Penempatan</td>
                            <td style={{ padding: '5px 8px' }}>: <strong>{viewingDoc.project || viewingDoc.location || '-'}</strong></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '5px 8px', fontWeight: 700 }}>Nama Terkait / PIC</td>
                            <td style={{ padding: '5px 8px' }}>: <strong>{viewingDoc.nama || viewingDoc.name || viewingDoc.empName || '-'}</strong></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '5px 8px', fontWeight: 700 }}>Kategori Dokumen</td>
                            <td style={{ padding: '5px 8px' }}>: <span style={{ fontWeight: 800, color: '#0284c7' }}>{viewingDoc.kategori || viewingDoc.dept || viewingDoc.status || '-'}</span></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '5px 8px', fontWeight: 700 }}>Judul Dokumen / Jabatan</td>
                            <td style={{ padding: '5px 8px' }}>: <strong>{viewingDoc.judulDokumen || viewingDoc.role || viewingDoc.title || '-'}</strong></td>
                          </tr>
                          <tr>
                            <td style={{ padding: '5px 8px', fontWeight: 700 }}>Catatan & Keterangan</td>
                            <td style={{ padding: '5px 8px' }}>: <span style={{ fontWeight: 800 }}>{viewingDoc.catatan || viewingDoc.notes || viewingDoc.note || '-'}</span></td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    <p style={{ margin: '12px 0 0 0' }}>
                      Dokumen ini sah terdaftar sebagai arsip ketenagakerjaan dan fasilitas operasional dalam Ashoka Management System (AMS) serta memiliki kekuatan pembuktian internal yang dapat dipertanggungjawabkan.
                    </p>
                  </div>

                  {/* Tanda Tangan Resmi & Stempel */}
                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakInside: 'avoid' }}>
                    <div style={{ textAlign: 'center', width: '220px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>Dibuat Oleh:</div>
                      <div style={{ height: '70px' }} />
                      <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                        Dodi Syaiful Nugroho
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Head of HR & GA</div>
                    </div>

                    <div style={{ textAlign: 'center', width: '240px', position: 'relative' }}>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>Bogor, {formatDisplayDate(viewingDoc.tanggalDok || viewingDoc.date)}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Mengetahui & Menyetujui:</div>
                      <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Stempel Cap Resmi HR & GA */}
                        <div
                          style={{
                            border: '2px solid #0284c7',
                            color: '#0284c7',
                            borderRadius: '50%',
                            width: '68px',
                            height: '68px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(-10deg)',
                            fontWeight: 900,
                            fontSize: '0.58rem',
                            lineHeight: 1.1,
                            opacity: 0.85
                          }}
                        >
                          <div>AMS</div>
                          <div>HR & GA</div>
                          <div>RESMI</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                        Yazid Hizbullah, S.E.,S.T
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Direktur Utama</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PENGAJUAN DANA KE FINANCE */}
      <FundRequestModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        defaultOrigin="hr-ga"
        defaultOriginName="HR & General Affair"
        defaultProject="Head Office Bizhub"
        defaultCategory="Operasional & Pemeliharaan"
        defaultRequester={currentUser?.name || "Dodi Syaiful Nugroho"}
        defaultAccountCode="5-301"
        onSuccess={(req) => showNotification(`Pengajuan dana ${req.id} (${req.title}) berhasil dikirim ke Finance & Acc!`)}
      />

      {/* MODAL PELACAKAN & STATUS PENGAJUAN DANA */}
      <FundRequestTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        originModule="hr-ga"
        originModuleName="HR & General Affair"
        onOpenNewRequest={() => {
          setIsTrackerModalOpen(false);
          setIsFundModalOpen(true);
        }}
      />
    </div>
  );
};
