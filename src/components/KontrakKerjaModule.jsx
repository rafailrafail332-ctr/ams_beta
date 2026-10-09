import React, { useState, useEffect, useMemo } from 'react';
import { fetchCloudStore, saveCloudStore } from '../supabase';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit3,
  Trash2,
  Search,
  Calendar,
  DollarSign,
  Award,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  X,
  MessageSquare,
  Eye,
  Users,
  Briefcase,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

// =============================================================================
// STORAGE KEYS & SEED DATA
// =============================================================================
const STORAGE_CONTRACTS = 'ams_hr_kontrak_kerja_v1';
const STORAGE_SALARY_HISTORY = 'ams_hr_salary_history_v1';
const STORAGE_APPLICANTS = 'ams_hr_recruitment_applicants_v2';
const STORAGE_OFFERINGS = 'ams_hr_recruitment_offerings_v2';
const STORAGE_EMPLOYEES = 'ams_hr_database_karyawan_v5';

// 1. DATA SEED DOKUMEN KONTRAK KERJA
const INITIAL_CONTRACTS = [
  {
    id: 'CTR-2026-001',
    noDok: '001/PKWT/HR-AMS/I/2026',
    employeeId: 'EMP-001',
    nama: 'Ahmad Rafail',
    nik: '3201011508900001',
    jabatan: 'Super Admin & Direktur Utama',
    penempatan: 'Head Office Bizhub',
    jenisDokumen: 'PKWTT', // LOI, PKWT, PKWTT, Addendum
    tanggalMulai: '2024-01-01',
    tanggalBerakhir: '2099-12-31', // Karyawan Tetap
    gajiPokok: 25000000,
    tunjangan: 5000000,
    statusKontrak: 'Aktif',
    catatan: 'Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) Eksekutif Direksi Utama.',
    files: [{ name: 'SK_PKWTT_Ahmad_Rafail.pdf', size: '1.4 MB' }]
  },
  {
    id: 'CTR-2026-002',
    noDok: '002/PKWTT/HR-AMS/I/2026',
    employeeId: 'EMP-002',
    nama: 'Yazid Hizbullah, S.E.,S.T',
    nik: '3201021204880002',
    jabatan: 'Direktur Utama & Finance Director',
    penempatan: 'Head Office Bizhub',
    jenisDokumen: 'PKWTT',
    tanggalMulai: '2024-01-01',
    tanggalBerakhir: '2099-12-31',
    gajiPokok: 22000000,
    tunjangan: 4500000,
    statusKontrak: 'Aktif',
    catatan: 'Pengangkatan Karyawan Tetap Dewan Direksi PT Persada Nusantara Indonesia.',
    files: [{ name: 'SK_Direksi_Yazid.pdf', size: '1.2 MB' }]
  },
  {
    id: 'CTR-2026-003',
    noDok: '045/PKWT-1/HR-AMS/IV/2025',
    employeeId: 'EMP-006',
    nama: 'Fresda Destifani, S.I.Kom',
    nik: '3201066108960006',
    jabatan: 'Head of Marketing & Promosi',
    penempatan: 'Marketing Gallery Ashoka',
    jenisDokumen: 'PKWT',
    tanggalMulai: '2025-10-15',
    tanggalBerakhir: '2026-10-15', // Sisa durasi mendekati
    gajiPokok: 9000000,
    tunjangan: 2500000,
    statusKontrak: 'Aktif',
    catatan: 'PKWT Kontrak Periode 1 Tahun. Evaluasi target penjualan unit properti.',
    files: [{ name: 'PKWT_Fresda_Destifani.pdf', size: '980 KB' }]
  },
  {
    id: 'CTR-2026-004',
    noDok: '012/LOI/HR-AMS/X/2026',
    employeeId: 'EMP-004',
    nama: 'Dodi Syaiful Nugroho',
    nik: '3201042409920004',
    jabatan: 'Head of HR & GA (General Affair)',
    penempatan: 'Head Office Bizhub',
    jenisDokumen: 'PKWTT',
    tanggalMulai: '2024-02-15',
    tanggalBerakhir: '2099-12-31',
    gajiPokok: 12000000,
    tunjangan: 3000000,
    statusKontrak: 'Aktif',
    catatan: 'Karyawan Tetap PKWTT Head of Division HR & General Affair.',
    files: [{ name: 'PKWTT_Dodi_Syaiful.pdf', size: '1.1 MB' }]
  },
  {
    id: 'CTR-2026-005',
    noDok: '088/PKWT-2/HR-AMS/XI/2025',
    employeeId: 'EMP-008',
    nama: 'Syamsul Dahari',
    nik: '3201081512940008',
    jabatan: 'Accounting & Pajak Proyek',
    penempatan: 'Head Office Bizhub',
    jenisDokumen: 'Addendum',
    tanggalMulai: '2025-11-01',
    tanggalBerakhir: '2026-11-01',
    gajiPokok: 7500000,
    tunjangan: 1800000,
    statusKontrak: 'Aktif',
    catatan: 'Addendum Perpanjangan Kontrak Kerja PKWT Periode Kedua.',
    files: [{ name: 'Addendum_Kontrak_Syamsul.pdf', size: '820 KB' }]
  },
  {
    id: 'CTR-2026-006',
    noDok: '092/LOI/HR-AMS/X/2026',
    employeeId: 'APP-001',
    nama: 'Bambang Triatmojo, S.T.',
    nik: '3201011990020011',
    jabatan: 'Supervisor Sipil & Bangunan',
    penempatan: 'Ashoka Park (Lokasi 1)',
    jenisDokumen: 'LOI',
    tanggalMulai: '2026-10-15',
    tanggalBerakhir: '2027-10-15',
    gajiPokok: 6500000,
    tunjangan: 1500000,
    statusKontrak: 'Aktif',
    catatan: 'Letter of Intent (LOI) & Draft Kontrak Kerja hasil seleksi rekrutmen baru.',
    files: [{ name: 'LOI_Bambang_Triatmojo.pdf', size: '950 KB' }]
  }
];

// 2. DATA SEED RIWAYAT PENINGKATAN SALARY KARYAWAN
const INITIAL_SALARY_HISTORY = [
  {
    employeeId: 'EMP-001',
    nama: 'Ahmad Rafail',
    jabatan: 'Super Admin & Direktur Utama',
    penempatan: 'Head Office Bizhub',
    gajiAwal: 18000000,
    gajiSaatIni: 25000000,
    history: [
      { bulan: 'Jan 2024', tanggal: '2024-01-01', nominal: 18000000, kategori: 'Gaji Awal', catatan: 'Penetapan awal struktur direksi pendirian PT Persada Nusantara' },
      { bulan: 'Jul 2024', tanggal: '2024-07-01', nominal: 20000000, kategori: 'Penyesuaian Kinerja', catatan: 'Pencapaian milestone ground breaking Ashoka Park' },
      { bulan: 'Jan 2025', tanggal: '2025-01-01', nominal: 22500000, kategori: 'Evaluasi Tahunan', catatan: 'Kenaikan reguler tahunan & dividen operasional' },
      { bulan: 'Jan 2026', tanggal: '2026-01-01', nominal: 25000000, kategori: 'Penyesuaian Skala', catatan: 'Ekspansi proyek Ashoka View Residence' }
    ]
  },
  {
    employeeId: 'EMP-002',
    nama: 'Yazid Hizbullah, S.E.,S.T',
    jabatan: 'Direktur Utama & Finance Director',
    penempatan: 'Head Office Bizhub',
    gajiAwal: 16000000,
    gajiSaatIni: 22000000,
    history: [
      { bulan: 'Jan 2024', tanggal: '2024-01-01', nominal: 16000000, kategori: 'Gaji Awal', catatan: 'Starting salary Direktur Keuangan' },
      { bulan: 'Agt 2024', tanggal: '2024-08-01', nominal: 18500000, kategori: 'Penyesuaian Kinerja', catatan: 'Efisiensi cash flow dan restrukturisasi pendanaan bank' },
      { bulan: 'Jan 2025', tanggal: '2025-01-01', nominal: 20000000, kategori: 'Evaluasi Tahunan', catatan: 'Kenaikan tahunan performa keuangan proyek' },
      { bulan: 'Feb 2026', tanggal: '2026-02-01', nominal: 22000000, kategori: 'Promosi / Skala', catatan: 'Penambahan portofolio divisi investasi properti' }
    ]
  },
  {
    employeeId: 'EMP-004',
    nama: 'Dodi Syaiful Nugroho',
    jabatan: 'Head of HR & GA (General Affair)',
    penempatan: 'Head Office Bizhub',
    gajiAwal: 8500000,
    gajiSaatIni: 12000000,
    history: [
      { bulan: 'Feb 2024', tanggal: '2024-02-15', nominal: 8500000, kategori: 'Gaji Awal', catatan: 'Gaji masuk masa percobaan Head HR' },
      { bulan: 'Jun 2024', tanggal: '2024-06-01', nominal: 9500000, kategori: 'Pengangkatan Tetap', catatan: 'Lolos probation & pengangkatan PKWTT Tetap' },
      { bulan: 'Jan 2025', tanggal: '2025-01-01', nominal: 10800000, kategori: 'Evaluasi Tahunan', catatan: 'Kinerja KPI 92% dan digitalisasi HRD AMS' },
      { bulan: 'Mar 2026', tanggal: '2026-03-01', nominal: 12000000, kategori: 'Promosi / Penyesuaian', catatan: 'Perluasan wewenang manajemen aset & rekrutmen' }
    ]
  },
  {
    employeeId: 'EMP-006',
    nama: 'Fresda Destifani, S.I.Kom',
    jabatan: 'Head of Marketing & Promosi',
    penempatan: 'Marketing Gallery Ashoka',
    gajiAwal: 7000000,
    gajiSaatIni: 9000000,
    history: [
      { bulan: 'Okt 2024', tanggal: '2024-10-15', nominal: 7000000, kategori: 'Gaji Awal', catatan: 'Gaji pokok awal Head Marketing' },
      { bulan: 'Mei 2025', tanggal: '2025-05-01', nominal: 8000000, kategori: 'Penyesuaian Kinerja', catatan: 'Pencapaian target penjualan 30 unit cluster Ashoka Park' },
      { bulan: 'Jan 2026', tanggal: '2026-01-01', nominal: 9000000, kategori: 'Evaluasi Tahunan', catatan: 'Peluncuran kampanye promo Ashoka View' }
    ]
  },
  {
    employeeId: 'EMP-008',
    nama: 'Syamsul Dahari',
    jabatan: 'Accounting & Pajak Proyek',
    penempatan: 'Head Office Bizhub',
    gajiAwal: 5500000,
    gajiSaatIni: 7500000,
    history: [
      { bulan: 'Nov 2024', tanggal: '2024-11-01', nominal: 5500000, kategori: 'Gaji Awal', catatan: 'Gaji masuk Staff Accounting PKWT 1' },
      { bulan: 'Jul 2025', tanggal: '2025-07-01', nominal: 6500000, kategori: 'Penyesuaian Kinerja', catatan: 'Penyelesaian audit pajak dan laporan keuangan tepat waktu' },
      { bulan: 'Nov 2025', tanggal: '2025-11-01', nominal: 7500000, kategori: 'Addendum Kontrak', catatan: 'Kenaikan gaji berkala saat perpanjangan kontrak tahun ke-2' }
    ]
  },
  {
    employeeId: 'APP-001',
    nama: 'Bambang Triatmojo, S.T.',
    jabatan: 'Supervisor Sipil & Bangunan',
    penempatan: 'Ashoka Park (Lokasi 1)',
    gajiAwal: 6500000,
    gajiSaatIni: 6500000,
    history: [
      { bulan: 'Okt 2026', tanggal: '2026-10-15', nominal: 6500000, kategori: 'Gaji Awal (On Duty)', catatan: 'Starting salary penawaran rekrutmen LOI resmi' }
    ]
  }
];

export const KontrakKerjaModule = ({ employees, setEmployees, currentUser, showNotification, onSwitchTab }) => {
  // Sub-Tab Navigasi (Sesuai Permintaan User: 2 Sub-Modul)
  const [activeSubTab, setActiveSubTab] = useState('jenis-dokumen'); // 'jenis-dokumen' | 'peningkatan-salary'

  // Datasets State Terpusat MySQL Database
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [salaryRecords, setSalaryRecords] = useState(INITIAL_SALARY_HISTORY);
  const [applicantsList, setApplicantsList] = useState([]);
  const [offeringsList, setOfferingsList] = useState([]);

  // Sinkronisasi Real-Time MySQL Database Sengked Hosting
  useEffect(() => {
    fetchCloudStore(STORAGE_CONTRACTS, INITIAL_CONTRACTS).then(val => {
      if (val && Array.isArray(val) && val.length > 0) setContracts(val);
      else saveCloudStore(STORAGE_CONTRACTS, INITIAL_CONTRACTS);
    });
    fetchCloudStore(STORAGE_SALARY_HISTORY, INITIAL_SALARY_HISTORY).then(val => {
      if (val && Array.isArray(val) && val.length > 0) setSalaryRecords(val);
      else saveCloudStore(STORAGE_SALARY_HISTORY, INITIAL_SALARY_HISTORY);
    });
    fetchCloudStore(STORAGE_APPLICANTS, []).then(val => {
      if (val && Array.isArray(val)) setApplicantsList(val);
    });
    fetchCloudStore(STORAGE_OFFERINGS, []).then(val => {
      if (val && Array.isArray(val)) setOfferingsList(val);
    });
  }, []);

  // Save changes ke MySQL Database Terpusat (Tanpa LocalStorage)
  useEffect(() => {
    saveCloudStore(STORAGE_CONTRACTS, contracts);
  }, [contracts]);

  useEffect(() => {
    saveCloudStore(STORAGE_SALARY_HISTORY, salaryRecords);
  }, [salaryRecords]);

  // Format Helpers
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

  // Helper Hitung Sisa Hari Kontrak
  const calculateDaysRemaining = (endDateStr, jenisDokumen) => {
    if (jenisDokumen === 'PKWTT') {
      return { days: 99999, text: 'Aktif Selamanya', status: 'permanent' };
    }
    if (!endDateStr) return { days: 0, text: '-', status: 'expired' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDateStr);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: diffDays, text: `Berakhir (${Math.abs(diffDays)} hari lalu)`, status: 'expired' };
    } else if (diffDays <= 30) {
      return { days: diffDays, text: `Segera Berakhir (${diffDays} Hari)`, status: 'warning' };
    } else {
      return { days: diffDays, text: `Sisa ${diffDays} Hari`, status: 'active' };
    }
  };

  // Helper Kirim WhatsApp Pengingat Kontrak
  const handleSendWhatsAppContract = (ctr) => {
    // Cari no HP dari database karyawan atau data pelamar
    let phone = '';
    const emp = employees?.find(e => e.id === ctr.employeeId || e.nama === ctr.nama);
    if (emp) phone = emp.noHp || emp.phone;
    if (!phone) {
      const matchedApp = applicantsList.find(a => a.id === ctr.employeeId || a.nama === ctr.nama);
      if (matchedApp) phone = matchedApp.phone;
    }

    if (!phone) {
      showNotification && showNotification('Nomor telepon / WhatsApp karyawan tidak ditemukan!', 'danger');
      return;
    }

    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
    else if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

    const remaining = calculateDaysRemaining(ctr.tanggalBerakhir, ctr.jenisDokumen);
    const text = `Halo Bapak/Ibu ${ctr.nama},\n\nKami dari Divisi HR & GA PT Persada Nusantara Indonesia (AMS Properti) menginformasikan status dokumen perjanjian kerja Anda:\n- Nomor Dokumen: ${ctr.noDok}\n- Jenis Perjanjian: ${ctr.jenisDokumen}\n- Posisi / Jabatan: ${ctr.jabatan}\n- Masa Berlaku: ${formatDisplayDate(ctr.tanggalMulai)} s/d ${ctr.jenisDokumen === 'PKWTT' ? 'Tetap (PKWTT)' : formatDisplayDate(ctr.tanggalBerakhir)}\n- Status Durasi: *${remaining.text}*\n\nJika ada pertanyaan mengenai administrasi kontrak atau evaluasi perpanjangan, silakan berkoordinasi dengan Tim HR & GA. Terima kasih.`;
    
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ===========================================================================
  // SUB-MODUL 1: STATE FILTER & MODAL DOKUMEN KONTRAK
  // ===========================================================================
  const [searchContract, setSearchContract] = useState('');
  const [filterDocType, setFilterDocType] = useState('ALL'); // ALL, LOI, PKWT, PKWTT, Addendum
  const [filterContractStatus, setFilterContractStatus] = useState('ALL'); // ALL, Aktif, Warning, Expired

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [ctrForm, setCtrForm] = useState({
    noDok: '',
    employeeId: '',
    nama: '',
    nik: '',
    jabatan: '',
    penempatan: 'Ashoka Park (Lokasi 1)',
    jenisDokumen: 'PKWT',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalBerakhir: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    gajiPokok: 6500000,
    tunjangan: 1500000,
    statusKontrak: 'Aktif',
    catatan: '',
    syncToDatabaseKaryawan: true,
    syncToSalaryHistory: true
  });

  const [viewingContractDoc, setViewingContractDoc] = useState(null);

  // Kandidat Pelamar dari Rekrutmen (Offering & Lolos Seleksi) Terpusat
  const recruitmentCandidates = useMemo(() => {
    const candidates = [];
    (offeringsList || []).forEach(o => {
      candidates.push({
        id: o.applicantId || o.id,
        nama: o.applicantName,
        jabatan: o.posisi,
        penempatan: o.penempatan,
        gajiPokok: o.gajiPokok,
        tunjangan: o.tunjangan,
        tanggalMulai: o.jadwalOnDuty,
        statusKerja: o.statusKerja,
        source: 'Offering'
      });
    });

    (applicantsList || []).forEach(a => {
      if (!candidates.some(c => c.nama && a.nama && c.nama.toLowerCase() === a.nama.toLowerCase())) {
        if (a.status === 'Offering' || a.status === 'Diterima' || a.status === 'Lolos Screening') {
          candidates.push({
            id: a.id,
            nama: a.nama,
            jabatan: a.posisi,
            penempatan: a.project,
            gajiPokok: 6500000,
            tunjangan: 1500000,
            tanggalMulai: new Date().toISOString().split('T')[0],
            statusKerja: 'PKWT',
            source: 'Pelamar'
          });
        }
      }
    });

    return candidates;
  }, [offeringsList, applicantsList, isContractModalOpen]);

  // Filter Dokumen Kontrak
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      const q = searchContract.toLowerCase().trim();
      const matchSearch = !q ||
        c.nama.toLowerCase().includes(q) ||
        c.noDok.toLowerCase().includes(q) ||
        c.jabatan.toLowerCase().includes(q) ||
        c.penempatan.toLowerCase().includes(q);

      const matchDocType = filterDocType === 'ALL' || c.jenisDokumen === filterDocType;

      const rem = calculateDaysRemaining(c.tanggalBerakhir, c.jenisDokumen);
      let matchStatus = true;
      if (filterContractStatus === 'Aktif') matchStatus = rem.status === 'active' || rem.status === 'permanent';
      else if (filterContractStatus === 'Warning') matchStatus = rem.status === 'warning';
      else if (filterContractStatus === 'Expired') matchStatus = rem.status === 'expired';

      return matchSearch && matchDocType && matchStatus;
    });
  }, [contracts, searchContract, filterDocType, filterContractStatus]);

  // Handler Buka Tambah Kontrak
  const handleOpenAddContract = () => {
    setEditingContract(null);
    const nextSeq = String(contracts.length + 1).padStart(3, '0');
    setCtrForm({
      noDok: `${nextSeq}/PKWT/HR-AMS/${new Date().getFullYear()}`,
      employeeId: '',
      nama: '',
      nik: '',
      jabatan: '',
      penempatan: 'Ashoka Park (Lokasi 1)',
      jenisDokumen: 'PKWT',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalBerakhir: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      gajiPokok: 6500000,
      tunjangan: 1500000,
      statusKontrak: 'Aktif',
      catatan: '',
      syncToDatabaseKaryawan: true,
      syncToSalaryHistory: true
    });
    setIsContractModalOpen(true);
  };

  const handleOpenEditContract = (ctr) => {
    setEditingContract(ctr);
    setCtrForm({
      ...ctr,
      syncToDatabaseKaryawan: true,
      syncToSalaryHistory: true
    });
    setIsContractModalOpen(true);
  };

  // Handler Simpan Kontrak (Dengan Integrasi Rekrutmen -> Database Karyawan -> Salary)
  const handleSaveContract = (e) => {
    e.preventDefault();
    if (!ctrForm.nama.trim() || !ctrForm.jabatan.trim() || !ctrForm.noDok.trim()) {
      showNotification && showNotification('Nomor Dokumen, Nama, dan Jabatan wajib diisi!', 'danger');
      return;
    }

    if (editingContract) {
      // 1. Update Kontrak
      setContracts(contracts.map(c => c.id === editingContract.id ? { ...c, ...ctrForm } : c));

      // 2. Sinkron ke Database Karyawan jika diaktifkan
      if (ctrForm.syncToDatabaseKaryawan && setEmployees) {
        setEmployees(prevEmployees => prevEmployees.map(emp => {
          if (emp.id === ctrForm.employeeId || emp.nama === editingContract.nama) {
            return {
              ...emp,
              nama: ctrForm.nama,
              jabatan: ctrForm.jabatan,
              penempatan: ctrForm.penempatan,
              status: ctrForm.jenisDokumen === 'PKWTT' ? 'Karyawan Tetap (PKWTT)' : `PKWT (s/d ${formatDisplayDate(ctrForm.tanggalBerakhir)})`
            };
          }
          return emp;
        }));
      }

      // 3. Sinkron Nama di Riwayat Salary
      setSalaryRecords(prev => prev.map(sal => {
        if (sal.employeeId === ctrForm.employeeId || sal.nama === editingContract.nama) {
          return { ...sal, nama: ctrForm.nama, jabatan: ctrForm.jabatan, penempatan: ctrForm.penempatan };
        }
        return sal;
      }));

      showNotification && showNotification(`Dokumen kontrak ${ctrForm.nama} berhasil diperbarui & disinkronkan!`, 'success');
    } else {
      // Buat Kontrak Baru
      const newId = `CTR-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`;
      const newContract = {
        ...ctrForm,
        id: newId,
        files: [{ name: `${ctrForm.jenisDokumen}_${ctrForm.nama.replace(/\s+/g, '_')}.pdf`, size: '1.2 MB' }]
      };
      setContracts([newContract, ...contracts]);

      // 2. OTOMATIS DAFTARKAN KE DATABASE KARYAWAN (Jika karyawan baru dari rekrutmen / belum ada)
      if (ctrForm.syncToDatabaseKaryawan && setEmployees) {
        const exists = employees?.some(e => e.id === ctrForm.employeeId || e.nama.toLowerCase() === ctrForm.nama.toLowerCase());
        if (!exists) {
          const newEmpId = `EMP-${String((employees?.length || 0) + 1).padStart(3, '0')}`;
          const newEmp = {
            id: newEmpId,
            noDok: `AMS-${new Date().getFullYear()}-${String((employees?.length || 0) + 1).padStart(3, '0')}`,
            nama: ctrForm.nama,
            nik: ctrForm.nik || `32010${Math.floor(10000000000 + Math.random() * 90000000000)}`,
            npwp: '00.000.000.0-000.000',
            noRekening: 'BCA (Dalam Proses Payroll)',
            alamat: 'Bogor, Jawa Barat',
            noHp: '0812-0000-0000',
            phone: '0812-0000-0000',
            jabatan: ctrForm.jabatan,
            penempatan: ctrForm.penempatan,
            status: ctrForm.jenisDokumen === 'PKWTT' ? 'Karyawan Tetap (PKWTT)' : `PKWT (s/d ${formatDisplayDate(ctrForm.tanggalBerakhir)})`,
            tanggalMasuk: ctrForm.tanggalMulai,
            tanggalDok: ctrForm.tanggalMulai,
            project: ctrForm.penempatan,
            kategori: ctrForm.jenisDokumen,
            catatan: `Karyawan Resmi Masuk via Dokumen ${ctrForm.jenisDokumen} (${ctrForm.noDok})`,
            files: []
          };
          setEmployees(prev => [newEmp, ...prev]);
        }
      }

      // 3. OTOMATIS CATAT SEBAGAI GAJI AWAL DI SUB-MODUL 2 (Peningkatan Salary)
      if (ctrForm.syncToSalaryHistory) {
        const salExists = salaryRecords.some(s => s.employeeId === ctrForm.employeeId || s.nama.toLowerCase() === ctrForm.nama.toLowerCase());
        if (!salExists) {
          const newSalRecord = {
            employeeId: ctrForm.employeeId || newId,
            nama: ctrForm.nama,
            jabatan: ctrForm.jabatan,
            penempatan: ctrForm.penempatan,
            gajiAwal: Number(ctrForm.gajiPokok),
            gajiSaatIni: Number(ctrForm.gajiPokok),
            history: [
              {
                bulan: formatDisplayDate(ctrForm.tanggalMulai).slice(3), // Misal 'Okt 2026'
                tanggal: ctrForm.tanggalMulai,
                nominal: Number(ctrForm.gajiPokok),
                kategori: `Gaji Awal (${ctrForm.jenisDokumen})`,
                catatan: `Penetapan gaji pokok awal berdasarkan surat ${ctrForm.noDok}`
              }
            ]
          };
          setSalaryRecords([newSalRecord, ...salaryRecords]);
        }
      }

      showNotification && showNotification(`Dokumen kontrak ${ctrForm.nama} berhasil diterbitkan dan terintegrasi!`, 'success');
    }

    setIsContractModalOpen(false);
  };

  const handleDeleteContract = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus dokumen kontrak ${name}?`)) {
      setContracts(contracts.filter(c => c.id !== id));
      showNotification && showNotification(`Dokumen kontrak ${name} berhasil dihapus!`, 'info');
    }
  };

  // ===========================================================================
  // SUB-MODUL 2: STATE FILTER & MODAL PENINGKATAN SALARY & GRAFIK GARIS
  // ===========================================================================
  const [searchSalary, setSearchSalary] = useState('');
  const [selectedSalaryEmployee, setSelectedSalaryEmployee] = useState(null); // Untuk Modal Grafik Garis
  const [isSalaryChartModalOpen, setIsSalaryChartModalOpen] = useState(false);

  // Form Input Kenaikan Gaji Baru di Dalam Modal Grafik
  const [newSalaryEntry, setNewSalaryEntry] = useState({
    bulan: '',
    tanggal: new Date().toISOString().split('T')[0],
    nominal: 7000000,
    kategori: 'Evaluasi Tahunan',
    catatan: ''
  });

  const filteredSalaryRecords = useMemo(() => {
    return salaryRecords.filter(s => {
      const q = searchSalary.toLowerCase().trim();
      return !q ||
        s.nama.toLowerCase().includes(q) ||
        s.jabatan.toLowerCase().includes(q) ||
        s.penempatan.toLowerCase().includes(q);
    });
  }, [salaryRecords, searchSalary]);

  // Handler Buka Modal Grafik Garis
  const handleOpenSalaryChart = (record) => {
    setSelectedSalaryEmployee(record);
    const curYear = new Date().getFullYear();
    const curMonthName = new Date().toLocaleDateString('id-ID', { month: 'short' });
    setNewSalaryEntry({
      bulan: `${curMonthName} ${curYear}`,
      tanggal: new Date().toISOString().split('T')[0],
      nominal: record.gajiSaatIni + 500000,
      kategori: 'Evaluasi Tahunan',
      catatan: 'Penyesuaian performa kerja dan pencapaian target proyek'
    });
    setIsSalaryChartModalOpen(true);
  };

  // Handler Tambah Titik Kenaikan Gaji Baru
  const handleAddSalaryStep = (e) => {
    e.preventDefault();
    if (!selectedSalaryEmployee) return;

    const nominalNum = Number(newSalaryEntry.nominal);
    if (!nominalNum || nominalNum <= 0) {
      showNotification && showNotification('Nominal gaji baru harus valid!', 'danger');
      return;
    }

    const newHistoryItem = {
      bulan: newSalaryEntry.bulan || formatDisplayDate(newSalaryEntry.tanggal).slice(3),
      tanggal: newSalaryEntry.tanggal,
      nominal: nominalNum,
      kategori: newSalaryEntry.kategori,
      catatan: newSalaryEntry.catatan || 'Kenaikan gaji berkala'
    };

    const updatedEmployee = {
      ...selectedSalaryEmployee,
      gajiSaatIni: nominalNum,
      history: [...selectedSalaryEmployee.history, newHistoryItem]
    };

    setSalaryRecords(salaryRecords.map(s => 
      s.employeeId === selectedSalaryEmployee.employeeId ? updatedEmployee : s
    ));
    setSelectedSalaryEmployee(updatedEmployee);

    // Sinkronkan Gaji Pokok di Dokumen Kontrak jika ada
    setContracts(prev => prev.map(c => {
      if (c.employeeId === selectedSalaryEmployee.employeeId || c.nama === selectedSalaryEmployee.nama) {
        return { ...c, gajiPokok: nominalNum };
      }
      return c;
    }));

    showNotification && showNotification(`Kenaikan gaji ${selectedSalaryEmployee.nama} berhasil dicatat & grafik terbarui!`, 'success');
  };

  // Handler Hapus Titik Riwayat Gaji
  const handleDeleteSalaryStep = (idx) => {
    if (!selectedSalaryEmployee || selectedSalaryEmployee.history.length <= 1) {
      showNotification && showNotification('Tidak dapat menghapus titik gaji awal!', 'warning');
      return;
    }

    if (window.confirm('Yakin ingin menghapus titik riwayat gaji ini?')) {
      const newHist = selectedSalaryEmployee.history.filter((_, i) => i !== idx);
      const latestNominal = newHist[newHist.length - 1].nominal;
      const updated = {
        ...selectedSalaryEmployee,
        gajiSaatIni: latestNominal,
        history: newHist
      };
      setSalaryRecords(salaryRecords.map(s => s.employeeId === selectedSalaryEmployee.employeeId ? updated : s));
      setSelectedSalaryEmployee(updated);
      showNotification && showNotification('Titik riwayat gaji berhasil dihapus!', 'info');
    }
  };

  // ===========================================================================
  // RENDER DOKUMEN KONTRAK & GRAFIK GARIS
  // ===========================================================================
  return (
    <div style={{ animation: 'fadeIn 0.25s ease-in-out' }}>
      
      {/* HEADER UTAMA MODAL KONTRAK KERJA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <FileText size={26} color="#10b981" />
            <span>Modul Kontrak Kerja & Manajemen Gaji</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Pengelolaan dokumen perjanjian kerja resmi (LOI, PKWT, PKWTT, Addendum) dan analisis tren grafik peningkatan salary karyawan PT Persada Nusantara Indonesia.
          </p>
        </div>

        {/* Link Cepat ke Database Karyawan */}
        <button
          onClick={() => onSwitchTab && onSwitchTab('database-karyawan')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 14px' }}
        >
          <Users size={14} color="#34d399" /> Buka Database Karyawan <ArrowRight size={13} />
        </button>
      </div>

      {/* NAVIGASI 2 SUB-MODUL UTAMA */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1.5px solid rgba(16, 185, 129, 0.3)', paddingBottom: '10px', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveSubTab('jenis-dokumen')}
          style={{
            background: activeSubTab === 'jenis-dokumen' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.04)',
            color: activeSubTab === 'jenis-dokumen' ? '#ffffff' : '#94a3b8',
            border: activeSubTab === 'jenis-dokumen' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeSubTab === 'jenis-dokumen' ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <FileText size={16} /> Sub-Modul 1: Jenis Dokumen Kontrak (LOI / PKWT / PKWTT / Addendum)
        </button>

        <button
          onClick={() => setActiveSubTab('peningkatan-salary')}
          style={{
            background: activeSubTab === 'peningkatan-salary' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.04)',
            color: activeSubTab === 'peningkatan-salary' ? '#ffffff' : '#94a3b8',
            border: activeSubTab === 'peningkatan-salary' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeSubTab === 'peningkatan-salary' ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <TrendingUp size={16} /> Sub-Modul 2: Peningkatan Salary (Riwayat & Grafik Tren Garis)
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SUB-MODUL 1: JENIS DOKUMEN KONTRAK KERJA                              */}
      {/* ===================================================================== */}
      {activeSubTab === 'jenis-dokumen' && (
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          
          {/* Ringkasan Statistik Kartu Hijau */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1.4rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '12px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Total Dokumen Kontrak</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>{contracts.length} Berkas</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>LOI, PKWT, PKWTT & Addendum</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '12px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>PKWT (Kontrak Berjalan)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                {contracts.filter(c => c.jenisDokumen === 'PKWT' || c.jenisDokumen === 'LOI').length} Karyawan
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Masa evaluasi berkala</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '12px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Karyawan Tetap (PKWTT)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                {contracts.filter(c => c.jenisDokumen === 'PKWTT').length} Orang
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Status permanen aktif</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '12px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Perlu Perpanjangan (&le; 30 Hari)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
                {contracts.filter(c => calculateDaysRemaining(c.tanggalBerakhir, c.jenisDokumen).status === 'warning').length} Kontrak
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Siap penerbitan Addendum</div>
            </div>
          </div>

          {/* Top Bar: Search, Filter Jenis Dokumen, Filter Status & Tombol Tambah */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: '#10b981' }} />
                <input
                  type="text"
                  placeholder="Cari nama / no dokumen / jabatan..."
                  value={searchContract}
                  onChange={(e) => setSearchContract(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '32px', height: '38px', fontSize: '0.82rem', width: '230px', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                />
              </div>

              {/* Filter Jenis Dokumen */}
              <select
                value={filterDocType}
                onChange={(e) => setFilterDocType(e.target.value)}
                className="form-control"
                style={{
                  height: '38px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  width: '200px',
                  minWidth: '200px',
                  background: '#0f172a',
                  color: '#ffffff',
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  borderRadius: '8px',
                  padding: '0 12px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <option value="ALL">Semua Jenis Dokumen</option>
                <option value="LOI">LOI (Letter of Intent)</option>
                <option value="PKWT">PKWT (Kontrak Waktu Tertentu)</option>
                <option value="PKWTT">PKWTT (Karyawan Tetap)</option>
                <option value="Addendum">Addendum (Perpanjangan)</option>
              </select>

              {/* Filter Status Masa Berlaku */}
              <select
                value={filterContractStatus}
                onChange={(e) => setFilterContractStatus(e.target.value)}
                className="form-control"
                style={{
                  height: '38px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  width: '190px',
                  minWidth: '190px',
                  background: '#0f172a',
                  color: '#ffffff',
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  borderRadius: '8px',
                  padding: '0 12px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <option value="ALL">Semua Status Durasi</option>
                <option value="Aktif">Aktif Berjalan</option>
                <option value="Warning">Segera Berakhir (&le; 30 Hari)</option>
                <option value="Expired">Telah Berakhir</option>
              </select>
            </div>

            {/* Tombol Terbitkan Dokumen Kontrak Baru */}
            <button
              onClick={handleOpenAddContract}
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
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                flexShrink: 0
              }}
            >
              <Plus size={16} /> + Terbitkan Dokumen Kontrak
            </button>
          </div>

          {/* Tabel Dokumen Kontrak Kerja */}
          <div className="table-container" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                  <th style={{ width: '140px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>No. Dokumen & Tgl</th>
                  <th style={{ minWidth: '190px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Nama Karyawan & Posisi</th>
                  <th style={{ width: '130px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Jenis Dokumen</th>
                  <th style={{ width: '170px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Periode Berlaku</th>
                  <th style={{ width: '140px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Sisa Masa Kerja</th>
                  <th style={{ width: '150px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Gaji Pokok & Tunjangan</th>
                  <th style={{ width: '160px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi, Cetak & WA</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      <FileText size={38} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                        {searchContract || filterDocType !== 'ALL' || filterContractStatus !== 'ALL' ? 'Tidak ada dokumen kontrak yang sesuai filter' : 'Belum ada dokumen kontrak terdaftar'}
                      </div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                        Klik tombol "+ Terbitkan Dokumen Kontrak" untuk membuat surat perjanjian LOI, PKWT, atau PKWTT baru.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((ctr, idx) => {
                    const rem = calculateDaysRemaining(ctr.tanggalBerakhir, ctr.jenisDokumen);
                    return (
                      <tr key={ctr.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        {/* No Dokumen & Tgl */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                            {ctr.noDok}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', whiteSpace: 'nowrap' }}>
                            Mulai: {formatDisplayDate(ctr.tanggalMulai)}
                          </div>
                        </td>

                        {/* Nama Karyawan & Jabatan */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>{ctr.nama}</div>
                          <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>
                            {ctr.jabatan}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {ctr.penempatan}
                          </div>
                        </td>

                        {/* Jenis Dokumen */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                          <span
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              border: '1px solid #10b981',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              display: 'inline-block',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {ctr.jenisDokumen}
                          </span>
                        </td>

                        {/* Periode Masa Berlaku */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 700 }}>
                            {formatDisplayDate(ctr.tanggalMulai)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            s/d {ctr.jenisDokumen === 'PKWTT' ? 'Karyawan Tetap' : formatDisplayDate(ctr.tanggalBerakhir)}
                          </div>
                        </td>

                        {/* Sisa Masa Kerja (Countdown Badge) */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                          <span
                            style={{
                              background: rem.status === 'permanent' ? 'rgba(16, 185, 129, 0.2)' :
                                rem.status === 'active' ? 'rgba(16, 185, 129, 0.15)' :
                                rem.status === 'warning' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: rem.status === 'permanent' ? '#34d399' :
                                rem.status === 'active' ? '#10b981' :
                                rem.status === 'warning' ? '#facc15' : '#ef4444',
                              border: `1px solid ${
                                rem.status === 'permanent' ? '#10b981' :
                                rem.status === 'active' ? '#10b981' :
                                rem.status === 'warning' ? '#eab308' : '#ef4444'
                              }`,
                              padding: '3px 8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'inline-block',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {rem.text}
                          </span>
                        </td>

                        {/* Gaji Pokok & Tunjangan */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap' }}>
                            {formatRupiah(ctr.gajiPokok)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap' }}>
                            + Tunjangan: {formatRupiah(ctr.tunjangan)}
                          </div>
                        </td>

                        {/* Aksi: Pratinjau Kertas Kontrak, WA, Edit, Hapus */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                            {/* Tombol Lihat & Pratinjau Dokumen Kontrak Resmi */}
                            <button
                              onClick={() => setViewingContractDoc(ctr)}
                              className="btn btn-sm"
                              style={{
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid #10b981',
                                color: '#34d399',
                                padding: '3px 6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                borderRadius: '5px'
                              }}
                              title="Pratinjau & Cetak Surat Kontrak Resmi"
                            >
                              <Eye size={12} />
                            </button>

                            {/* Tombol Kirim WhatsApp Pengingat */}
                            <button
                              onClick={() => handleSendWhatsAppContract(ctr)}
                              style={{
                                background: '#25D366',
                                border: 'none',
                                color: '#ffffff',
                                padding: '3px 6px',
                                borderRadius: '5px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                              title="Kirim Notifikasi Kontrak via WhatsApp"
                            >
                              <MessageSquare size={11} /> WA
                            </button>

                            {/* Tombol Edit */}
                            <button
                              onClick={() => handleOpenEditContract(ctr)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 6px', fontSize: '0.72rem' }}
                              title="Edit Dokumen Kontrak"
                            >
                              <Edit3 size={12} />
                            </button>

                            {/* Tombol Hapus */}
                            <button
                              onClick={() => handleDeleteContract(ctr.id, ctr.nama)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                              title="Hapus Dokumen Kontrak"
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
      {/* SUB-MODUL 2: PENINGKATAN SALARY & GRAFIK TREN GARIS                   */}
      {/* ===================================================================== */}
      {activeSubTab === 'peningkatan-salary' && (
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          
          {/* Top Bar: Title, Search & Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1.5px solid #10b981',
                    color: '#34d399',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    padding: '4px 12px',
                    borderRadius: '8px'
                  }}
                >
                  Sub-Modul 2: Peningkatan Salary Karyawan
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  ({filteredSalaryRecords.length} karyawan terdaftar riwayat gaji)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Pantau pergerakan gaji awal vs gaji terkini. Klik tombol <strong>"Lihat Grafik"</strong> untuk melihat visualisasi kurva garis peningkatan gaji masing-masing karyawan.
              </p>
            </div>

            {/* Search Karyawan Salary */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: '#10b981' }} />
              <input
                type="text"
                placeholder="Cari nama karyawan / jabatan..."
                value={searchSalary}
                onChange={(e) => setSearchSalary(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '32px', height: '38px', fontSize: '0.82rem', width: '250px', borderColor: 'rgba(16, 185, 129, 0.4)' }}
              />
            </div>
          </div>

          {/* Tabel Ringkasan Peningkatan Salary Karyawan */}
          <div className="table-container" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1050px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                  <th style={{ width: '80px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>No.</th>
                  <th style={{ minWidth: '200px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>Nama Karyawan & Jabatan</th>
                  <th style={{ width: '170px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>Penempatan Proyek</th>
                  <th style={{ width: '150px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>Gaji Awal (Mulai)</th>
                  <th style={{ width: '150px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>Gaji Saat Ini</th>
                  <th style={{ width: '150px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center' }}>Total Kenaikan</th>
                  <th style={{ width: '180px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center' }}>Grafik & Analisis</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaryRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      <TrendingUp size={38} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                        Tidak ada data salary karyawan yang sesuai pencarian
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSalaryRecords.map((sal, idx) => {
                    const selisih = sal.gajiSaatIni - sal.gajiAwal;
                    const persen = sal.gajiAwal > 0 ? ((selisih / sal.gajiAwal) * 100).toFixed(1) : 0;
                    return (
                      <tr key={sal.employeeId || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <td style={{ verticalAlign: 'middle', padding: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>
                          #{idx + 1}
                        </td>

                        <td style={{ verticalAlign: 'middle', padding: '0.85rem' }}>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem' }}>{sal.nama}</div>
                          <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>
                            {sal.jabatan}
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'middle', padding: '0.85rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                          {sal.penempatan}
                        </td>

                        <td style={{ verticalAlign: 'middle', padding: '0.85rem', fontWeight: 700, color: '#94a3b8', fontSize: '0.85rem' }}>
                          {formatRupiah(sal.gajiAwal)}
                        </td>

                        <td style={{ verticalAlign: 'middle', padding: '0.85rem', fontWeight: 900, color: '#34d399', fontSize: '0.92rem' }}>
                          {formatRupiah(sal.gajiSaatIni)}
                        </td>

                        <td style={{ verticalAlign: 'middle', padding: '0.85rem', textAlign: 'center' }}>
                          {selisih > 0 ? (
                            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.78rem', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <TrendingUp size={12} /> +{formatRupiah(selisih)} ({persen}%)
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                              Tetap (0%)
                            </span>
                          )}
                        </td>

                        {/* Tombol Lihat Grafik Tren Garis */}
                        <td style={{ verticalAlign: 'middle', padding: '0.85rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleOpenSalaryChart(sal)}
                            className="btn btn-primary btn-sm"
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              border: 'none',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              padding: '5px 12px',
                              borderRadius: '7px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <TrendingUp size={14} /> Lihat Grafik Garis
                          </button>
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
      {/* MODAL 1: FORM TERBITKAN / EDIT DOKUMEN KONTRAK KERJA                  */}
      {/* ===================================================================== */}
      {isContractModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '1.6rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#10b981" />
                <span>{editingContract ? 'Edit Dokumen Kontrak Kerja' : 'Terbitkan Dokumen Kontrak Kerja Baru'}</span>
              </div>
              <button onClick={() => setIsContractModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveContract}>
              {/* Opsi Shortcut: Tarik Data dari Pelamar Rekrutmen atau Database Karyawan */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px' }}>
                <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  ⚡ Opsi Cepat: Pilih dari Pelamar Rekrutmen / Database Karyawan
                </label>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    
                    // Cek jika dari pelamar rekrutmen
                    if (val.startsWith('REC:')) {
                      const candId = val.replace('REC:', '');
                      const cand = recruitmentCandidates.find(c => c.id === candId);
                      if (cand) {
                        const docType = (cand.statusKerja || '').includes('PKWTT') ? 'PKWTT' : ((cand.statusKerja || '').includes('LOI') ? 'LOI' : 'PKWT');
                        setCtrForm(prev => ({
                          ...prev,
                          employeeId: cand.id,
                          nama: cand.nama,
                          jabatan: cand.jabatan,
                          penempatan: cand.penempatan || prev.penempatan,
                          jenisDokumen: docType,
                          gajiPokok: Number(cand.gajiPokok) || prev.gajiPokok,
                          tunjangan: Number(cand.tunjangan) || prev.tunjangan,
                          tanggalMulai: cand.tanggalMulai || prev.tanggalMulai
                        }));
                        return;
                      }
                    }

                    // Cek jika dari database karyawan
                    const empId = val.replace('EMP:', '');
                    const matchedEmp = employees?.find(em => em.id === empId || em.id === val);
                    if (matchedEmp) {
                      setCtrForm(prev => ({
                        ...prev,
                        employeeId: matchedEmp.id,
                        nama: matchedEmp.nama,
                        nik: matchedEmp.nik || prev.nik,
                        jabatan: matchedEmp.jabatan,
                        penempatan: matchedEmp.penempatan || prev.penempatan
                      }));
                    }
                  }}
                  className="form-control"
                  style={{ fontSize: '0.82rem', height: '36px' }}
                >
                  <option value="">-- Pilih Karyawan Terdaftar atau Pelamar Rekrutmen --</option>
                  <optgroup label="📋 Database Karyawan Aktif:">
                    {employees?.map(emp => (
                      <option key={emp.id} value={`EMP:${emp.id}`}>
                        {emp.nama} — {emp.jabatan} ({emp.penempatan})
                      </option>
                    ))}
                  </optgroup>
                  {recruitmentCandidates.length > 0 && (
                    <optgroup label="🎯 Pelamar Rekrutmen (Offering / On Duty):">
                      {recruitmentCandidates.map(cand => (
                        <option key={cand.id} value={`REC:${cand.id}`}>
                          {cand.nama} — {cand.jabatan} ({cand.penempatan}) [{cand.source}]
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nomor Dokumen Kontrak *</label>
                  <input
                    type="text"
                    required
                    value={ctrForm.noDok}
                    onChange={(e) => setCtrForm({ ...ctrForm, noDok: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Jenis Dokumen Perjanjian *</label>
                  <select
                    value={ctrForm.jenisDokumen}
                    onChange={(e) => setCtrForm({ ...ctrForm, jenisDokumen: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 700 }}
                  >
                    <option value="PKWT">PKWT (Perjanjian Kerja Waktu Tertentu)</option>
                    <option value="PKWTT">PKWTT (Karyawan Tetap)</option>
                    <option value="LOI">LOI (Letter of Intent)</option>
                    <option value="Addendum">Addendum (Perpanjangan Kontrak)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Lengkap Karyawan *</label>
                  <input
                    type="text"
                    required
                    value={ctrForm.nama}
                    onChange={(e) => setCtrForm({ ...ctrForm, nama: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>NIK KTP Karyawan</label>
                  <input
                    type="text"
                    value={ctrForm.nik}
                    onChange={(e) => setCtrForm({ ...ctrForm, nik: e.target.value })}
                    placeholder="3201xxxxxxxxxxxx"
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Jabatan / Posisi Kerja *</label>
                  <input
                    type="text"
                    required
                    value={ctrForm.jabatan}
                    onChange={(e) => setCtrForm({ ...ctrForm, jabatan: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Lokasi Penempatan Proyek</label>
                  <select
                    value={ctrForm.penempatan}
                    onChange={(e) => setCtrForm({ ...ctrForm, penempatan: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="Ashoka Park (Lokasi 1)">Ashoka Park (Lokasi 1)</option>
                    <option value="Ashoka View (Lokasi 2)">Ashoka View (Lokasi 2)</option>
                    <option value="Head Office Bizhub">Head Office Bizhub</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tanggal Mulai Kontrak *</label>
                  <input
                    type="date"
                    required
                    value={ctrForm.tanggalMulai}
                    onChange={(e) => setCtrForm({ ...ctrForm, tanggalMulai: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tanggal Berakhir {ctrForm.jenisDokumen === 'PKWTT' && '(Permanen/Tetap)'}
                  </label>
                  <input
                    type="date"
                    disabled={ctrForm.jenisDokumen === 'PKWTT'}
                    value={ctrForm.jenisDokumen === 'PKWTT' ? '2099-12-31' : ctrForm.tanggalBerakhir}
                    onChange={(e) => setCtrForm({ ...ctrForm, tanggalBerakhir: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Gaji Pokok Disepakati (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={ctrForm.gajiPokok}
                    onChange={(e) => setCtrForm({ ...ctrForm, gajiPokok: Number(e.target.value) })}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tunjangan Tetap / Operasional (Rp)</label>
                  <input
                    type="number"
                    value={ctrForm.tunjangan}
                    onChange={(e) => setCtrForm({ ...ctrForm, tunjangan: Number(e.target.value) })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Checkbox Integrasi Otomatis */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem', color: '#f8fafc', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={ctrForm.syncToDatabaseKaryawan}
                    onChange={(e) => setCtrForm({ ...ctrForm, syncToDatabaseKaryawan: e.target.checked })}
                  />
                  <span>✓ Sinkronkan status & data ke <strong>Database Karyawan</strong></span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem', color: '#f8fafc', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={ctrForm.syncToSalaryHistory}
                    onChange={(e) => setCtrForm({ ...ctrForm, syncToSalaryHistory: e.target.checked })}
                  />
                  <span>✓ Catat nominal gaji pokok ke <strong>Sub-Modul Peningkatan Salary</strong></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button type="button" onClick={() => setIsContractModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.82rem' }}>
                  Simpan & Terbitkan Kontrak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: PRATINJAU & CETAK DOKUMEN KONTRAK KERJA RESMI (A4 SHEET)     */}
      {/* ===================================================================== */}
      {viewingContractDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '820px', maxHeight: '92vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            
            {/* Action Bar Print & Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 800, fontSize: '0.95rem' }}>
                <FileText size={18} color="#10b981" />
                <span>Dokumen Resmi: {viewingContractDoc.jenisDokumen} - {viewingContractDoc.nama}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Printer size={14} /> Cetak / Print PDF
                </button>
                <button onClick={() => setViewingContractDoc(null)} className="btn btn-secondary btn-sm">
                  <X size={14} /> Tutup
                </button>
              </div>
            </div>

            {/* LEMBAR KERTAS A4 PERJANJIAN KERJA RESMI */}
            <div style={{ background: '#ffffff', color: '#0f172a', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', fontFamily: 'Arial, sans-serif', fontSize: '0.86rem', lineHeight: 1.6 }}>
              {/* Kop Surat Resmi PT Persada Nusantara Indonesia */}
              <div style={{ textAlign: 'center', borderBottom: '2.5px solid #047857', paddingBottom: '12px', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#047857' }}>
                  PT PERSADA NUSANTARA INDONESIA
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>
                  SURAT PERJANJIAN KERJA ({viewingContractDoc.jenisDokumen.toUpperCase()})
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  Nomor: {viewingContractDoc.noDok} | Bizhub Commercial Estate Blok B-12, Gunung Sindur, Bogor
                </div>
              </div>

              <p style={{ margin: '0 0 12px 0' }}>
                Pada hari ini, tanggal <strong>{formatDisplayDate(viewingContractDoc.tanggalMulai)}</strong>, telah dibuat dan disepakati perjanjian kerja antara:
              </p>

              {/* Pihak Pertama */}
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.82rem' }}>
                <div><strong>I. PIHAK PERTAMA (PEMBERI KERJA):</strong></div>
                <div>Nama Perusahaan: PT PERSADA NUSANTARA INDONESIA (AMS Properti)</div>
                <div>Perwakilan: Dodi Syaiful Nugroho (Head of HR & General Affair)</div>
                <div>Alamat: Bizhub Commercial Estate Blok B-12, Gunung Sindur, Kab. Bogor</div>
              </div>

              {/* Pihak Kedua */}
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.82rem' }}>
                <div><strong>II. PIHAK KEDUA (PEKERJA):</strong></div>
                <div>Nama Lengkap: <strong>{viewingContractDoc.nama}</strong></div>
                <div>NIK KTP: {viewingContractDoc.nik || '-'}</div>
                <div>Jabatan / Posisi: {viewingContractDoc.jabatan}</div>
                <div>Lokasi Penempatan: {viewingContractDoc.penempatan}</div>
              </div>

              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#047857', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
                PASAL 1: KETENTUAN HUBUNGAN KERJA & MASA BERLAKU
              </div>
              <p style={{ margin: '0 0 10px 0' }}>
                Pihak Pertama menerima Pihak Kedua bekerja dengan status <strong>{viewingContractDoc.jenisDokumen}</strong> mulai tanggal <strong>{formatDisplayDate(viewingContractDoc.tanggalMulai)}</strong> sampai dengan tanggal <strong>{viewingContractDoc.jenisDokumen === 'PKWTT' ? 'Karyawan Tetap (PKWTT)' : formatDisplayDate(viewingContractDoc.tanggalBerakhir)}</strong>.
              </p>

              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#047857', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
                PASAL 2: HAK & REMUNERASI GAJI
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '0.82rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, width: '220px', color: '#475569' }}>Gaji Pokok Bulanan</td>
                    <td style={{ padding: '6px 8px', fontWeight: 800, color: '#0f172a' }}>: {formatRupiah(viewingContractDoc.gajiPokok)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#475569' }}>Tunjangan Tetap / Operasional</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a' }}>: {formatRupiah(viewingContractDoc.tunjangan)}</td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid #047857', background: '#ecfdf5' }}>
                    <td style={{ padding: '8px', fontWeight: 900, color: '#047857' }}>Total Kompensasi Bulanan</td>
                    <td style={{ padding: '8px', fontWeight: 900, color: '#047857' }}>: {formatRupiah(Number(viewingContractDoc.gajiPokok) + Number(viewingContractDoc.tunjangan))} / bulan</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#047857', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
                PASAL 3: KEWAJIBAN & TATA TERTIB
              </div>
              <p style={{ margin: '0 0 14px 0' }}>
                Pihak Kedua berkewajiban mematuhi seluruh peraturan perusahaan, standar operasional prosedur (SOP), menjaga kerahasiaan data proyek properti, serta mengutamakan keselamatan kerja (K3) di lingkungan PT Persada Nusantara Indonesia.
              </p>

              {/* Tanda Tangan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2.5rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Pihak Pertama (Pemberi Kerja):</div>
                  <div style={{ fontWeight: 800, marginTop: '2px' }}>PT PERSADA NUSANTARA INDONESIA</div>
                  <div style={{ height: '55px' }}></div>
                  <div style={{ fontWeight: 800, textDecoration: 'underline' }}>Dodi Syaiful Nugroho</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Head of HR & General Affair</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Pihak Kedua (Pekerja):</div>
                  <div style={{ fontWeight: 800, marginTop: '2px' }}>Karyawan Bersangkutan</div>
                  <div style={{ height: '55px' }}></div>
                  <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{viewingContractDoc.nama}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Pekerja</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: GRAFIK GARIS INTERAKTIF TREN PENINGKATAN SALARY KARYAWAN     */}
      {/* ===================================================================== */}
      {isSalaryChartModalOpen && selectedSalaryEmployee && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '820px', maxHeight: '92vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} color="#10b981" />
                  <span>Grafik Tren Kenaikan Gaji: {selectedSalaryEmployee.nama}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                  {selectedSalaryEmployee.jabatan} • {selectedSalaryEmployee.penempatan}
                </div>
              </div>
              <button onClick={() => setIsSalaryChartModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* 3 Kartu KPI Gaji */}
            {(() => {
              const startSal = selectedSalaryEmployee.gajiAwal;
              const curSal = selectedSalaryEmployee.gajiSaatIni;
              const diffSal = curSal - startSal;
              const pct = startSal > 0 ? ((diffSal / startSal) * 100).toFixed(1) : 0;
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.4rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', padding: '12px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>GAJI AWAL MASUK</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
                      {formatRupiah(startSal)}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1.5px solid #10b981', padding: '12px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800 }}>GAJI SAAT INI (TERKINI)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                      {formatRupiah(curSal)}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', padding: '12px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>TOTAL PENINGKATAN</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
                      +{formatRupiah(diffSal)} <span style={{ fontSize: '0.85rem' }}>({pct}%)</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* VISUALISASI GRAFIK GARIS (INTERACTIVE SVG LINE CHART DENGAN TEMA EMERALD GREEN) */}
            <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={16} /> Kurva Pergerakan Gaji dari Waktu ke Waktu
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  {selectedSalaryEmployee.history.length} kali penyesuaian gaji tercatat
                </div>
              </div>

              {/* SVG Line Chart */}
              {(() => {
                const history = selectedSalaryEmployee.history;
                if (!history || history.length === 0) return null;

                const width = 720;
                const height = 240;
                const paddingLeft = 60;
                const paddingRight = 40;
                const paddingTop = 30;
                const paddingBottom = 40;

                const values = history.map(h => h.nominal);
                const minVal = Math.min(...values) * 0.85;
                const maxVal = Math.max(...values) * 1.15;
                const valRange = maxVal - minVal || 1;

                const chartW = width - paddingLeft - paddingRight;
                const chartH = height - paddingTop - paddingBottom;

                // Points calculation
                const points = history.map((h, i) => {
                  const x = history.length === 1 
                    ? paddingLeft + chartW / 2 
                    : paddingLeft + (i / (history.length - 1)) * chartW;
                  const y = paddingTop + chartH - ((h.nominal - minVal) / valRange) * chartH;
                  return { x, y, ...h };
                });

                const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
                const areaStr = points.length > 0 
                  ? `${points[0].x},${paddingTop + chartH} ` + points.map(p => `${p.x},${p.y}`).join(' ') + ` ${points[points.length - 1].x},${paddingTop + chartH}` 
                  : '';

                return (
                  <div style={{ width: '100%', overflowX: 'auto' }}>
                    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: '600px', height: 'auto', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      {[0, 0.33, 0.66, 1].map((pct, gIdx) => {
                        const y = paddingTop + chartH * (1 - pct);
                        const labelVal = minVal + valRange * pct;
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
                              x={paddingLeft - 8}
                              y={y + 4}
                              fill="#64748b"
                              fontSize="10"
                              textAnchor="end"
                              fontWeight="600"
                            >
                              {(labelVal / 1000000).toFixed(1)} jt
                            </text>
                          </g>
                        );
                      })}

                      {/* Gradient Area under line */}
                      {points.length > 1 && (
                        <polygon points={areaStr} fill="url(#emeraldGradient)" />
                      )}

                      {/* The Main Emerald Line */}
                      {points.length > 1 ? (
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={polylineStr}
                        />
                      ) : (
                        <line
                          x1={paddingLeft}
                          y1={points[0].y}
                          x2={width - paddingRight}
                          y2={points[0].y}
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeDasharray="4 4"
                        />
                      )}

                      {/* Data Points (Dots & Value Tooltips) */}
                      {points.map((p, idx) => (
                        <g key={idx}>
                          {/* Sumbu X Label Bulan */}
                          <text
                            x={p.x}
                            y={height - 12}
                            fill="#94a3b8"
                            fontSize="11"
                            textAnchor="middle"
                            fontWeight="700"
                          >
                            {p.bulan}
                          </text>

                          {/* Outer pulse circle */}
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="7"
                            fill="#047857"
                            stroke="#34d399"
                            strokeWidth="2.5"
                          />
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="3"
                            fill="#ffffff"
                          />

                          {/* Nominal Tooltip di Atas Titik */}
                          <rect
                            x={p.x - 38}
                            y={p.y - 28}
                            width="76"
                            height="18"
                            rx="4"
                            fill="#0f172a"
                            stroke="#10b981"
                            strokeWidth="1"
                          />
                          <text
                            x={p.x}
                            y={p.y - 15}
                            fill="#34d399"
                            fontSize="10"
                            fontWeight="800"
                            textAnchor="middle"
                          >
                            {formatRupiah(p.nominal).replace(',00', '')}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                );
              })()}
            </div>

            {/* FORM INPUT PENYESUAIAN / KENAIKAN GAJI BARU */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', marginBottom: '1.4rem' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#34d399', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Input Penyesuaian / Kenaikan Gaji Baru
              </div>

              <form onSubmit={handleAddSalaryStep} style={{ display: 'grid', gridTemplateColumns: '140px 180px 180px 1fr auto', gap: '8px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Bulan Efektif</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Okt 2026"
                    value={newSalaryEntry.bulan}
                    onChange={(e) => setNewSalaryEntry({ ...newSalaryEntry, bulan: e.target.value })}
                    className="form-control"
                    style={{ height: '34px', fontSize: '0.8rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Gaji Baru (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={newSalaryEntry.nominal}
                    onChange={(e) => setNewSalaryEntry({ ...newSalaryEntry, nominal: Number(e.target.value) })}
                    className="form-control"
                    style={{ height: '34px', fontSize: '0.82rem', fontWeight: 800, borderColor: '#10b981' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Kategori Kenaikan</label>
                  <select
                    value={newSalaryEntry.kategori}
                    onChange={(e) => setNewSalaryEntry({ ...newSalaryEntry, kategori: e.target.value })}
                    className="form-control"
                    style={{ height: '34px', fontSize: '0.78rem' }}
                  >
                    <option value="Evaluasi Tahunan">Evaluasi Tahunan</option>
                    <option value="Promosi Jabatan">Promosi Jabatan</option>
                    <option value="Penyesuaian Kinerja">Penyesuaian Kinerja</option>
                    <option value="Regulasi UMR">Regulasi UMR</option>
                    <option value="Addendum Kontrak">Addendum Kontrak</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Keterangan / Alasan</label>
                  <input
                    type="text"
                    placeholder="Alasan kenaikan..."
                    value={newSalaryEntry.catatan}
                    onChange={(e) => setNewSalaryEntry({ ...newSalaryEntry, catatan: e.target.value })}
                    className="form-control"
                    style={{ height: '34px', fontSize: '0.78rem' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    height: '34px',
                    padding: '0 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={14} /> Simpan Kenaikan
                </button>
              </form>
            </div>

            {/* TABEL KRONOLOGIS RIWAYAT GAJI */}
            <div style={{ border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflowX: 'auto' }}>
              <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', fontWeight: 800, fontSize: '0.8rem', color: '#34d399', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                Rincian Kronologis Kenaikan Gaji
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Bulan & Tgl</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Nominal Gaji</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Perubahan</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Kategori</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Keterangan</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', width: '60px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSalaryEmployee.history.map((h, i) => {
                    const prevNominal = i > 0 ? selectedSalaryEmployee.history[i - 1].nominal : h.nominal;
                    const diff = h.nominal - prevNominal;
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 800, color: '#f8fafc' }}>
                          {h.bulan}
                        </td>
                        <td style={{ padding: '8px 12px', fontWeight: 800, color: '#34d399' }}>
                          {formatRupiah(h.nominal)}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          {diff > 0 ? (
                            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.74rem' }}>
                              +{formatRupiah(diff)}
                            </span>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
                              Titik Awal
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#94a3b8' }}>
                          {h.kategori}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#64748b', fontSize: '0.76rem' }}>
                          {h.catatan}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          {i > 0 && (
                            <button
                              onClick={() => handleDeleteSalaryStep(i)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                              title="Hapus Titik Kenaikan"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
              <button onClick={() => setIsSalaryChartModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                Tutup Grafik
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
