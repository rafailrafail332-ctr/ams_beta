import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Briefcase,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Paperclip,
  UploadCloud,
  FileText,
  Award,
  Check,
  X,
  Printer,
  ChevronRight,
  ArrowRight,
  Building2,
  DollarSign,
  Send,
  UserCheck,
  MessageSquare
} from 'lucide-react';

// =============================================================================
// STORAGE KEYS & SEED DATA
// =============================================================================
const STORAGE_APPLICANTS = 'ams_recruitment_applicants_v2';
const STORAGE_INTERVIEWS = 'ams_recruitment_interviews_v2';
const STORAGE_ASSESSMENTS = 'ams_recruitment_assessments_v2';
const STORAGE_OFFERINGS = 'ams_recruitment_offerings_v2';

const INITIAL_APPLICANTS = [
  {
    id: 'APP-001',
    noDok: 'REC/CV/2026/001',
    nama: 'Bambang Triatmojo, S.T.',
    posisi: 'Supervisor Sipil & Bangunan',
    phone: '0812-3456-7890',
    email: 'bambang.triatmojo@gmail.com',
    tanggalMelamar: '2026-09-28',
    project: 'Ashoka Park',
    status: 'Lolos Screening',
    catatan: 'Pengalaman 5 tahun di konstruksi perumahan, menguasai pengawasan mutu beton dan K3.',
    files: [
      { name: 'CV_Bambang_Triatmojo.pdf', size: '1.8 MB', type: 'application/pdf' },
      { name: 'Portofolio_Pengawasan_Proyek.pdf', size: '3.4 MB', type: 'application/pdf' }
    ]
  },
  {
    id: 'APP-002',
    noDok: 'REC/CV/2026/002',
    nama: 'Rina Sugianti',
    posisi: 'Property Sales Executive',
    phone: '0813-8877-6655',
    email: 'rina.sugianti@yahoo.com',
    tanggalMelamar: '2026-09-30',
    project: 'Ashoka View',
    status: 'Interview',
    catatan: 'Track record penjualan unit cluster sangat baik, relasi konsumen kuat di Bogor.',
    files: [
      { name: 'CV_Rina_Sugianti.pdf', size: '1.2 MB', type: 'application/pdf' }
    ]
  },
  {
    id: 'APP-003',
    noDok: 'REC/CV/2026/003',
    nama: 'Derry Kurniawan, A.Md.',
    posisi: 'Staff Akuntansi & Perpajakan',
    phone: '0857-1122-3344',
    email: 'derry.kurniawan@gmail.com',
    tanggalMelamar: '2026-10-01',
    project: 'Kantor Pusat Bizhub',
    status: 'Offering',
    catatan: 'Sertifikasi Brevet AB, mahir e-Faktur dan rekonsiliasi bank perumahan.',
    files: [
      { name: 'CV_Derry_Kurniawan.pdf', size: '1.4 MB', type: 'application/pdf' }
    ]
  },
  {
    id: 'APP-004',
    noDok: 'REC/CV/2026/004',
    nama: 'Joko Susanto',
    posisi: 'Petugas Keamanan / Security',
    phone: '0878-9900-1122',
    email: 'joko.susanto99@gmail.com',
    tanggalMelamar: '2026-10-02',
    project: 'Ashoka Park',
    status: 'Lolos Screening',
    catatan: 'Ijazah Gada Pratama resmi Polda Jabar, siap penempatan shift malam.',
    files: [
      { name: 'CV_Joko_Susanto.pdf', size: '920 KB', type: 'application/pdf' },
      { name: 'Sertifikat_Gada_Pratama.pdf', size: '1.1 MB', type: 'application/pdf' }
    ]
  }
];

const INITIAL_INTERVIEWS = [
  {
    id: 'INT-001',
    applicantId: 'APP-001',
    applicantName: 'Bambang Triatmojo, S.T.',
    posisi: 'Supervisor Sipil & Bangunan',
    tanggalInterview: '2026-10-06',
    jamInterview: '10:00 - 11:30',
    metode: 'Offline di Kantor Pusat HO Bizhub',
    interviewer: 'Dodi Syaiful (HR) & M. Naufal (Head Teknik)',
    lokasiLink: 'Ruang Rapat Utama Lt. 2',
    catatan: 'Bawa salinan portofolio gambar kerja dan sertifikat K3 asli.',
    status: 'Selesai'
  },
  {
    id: 'INT-002',
    applicantId: 'APP-002',
    applicantName: 'Rina Sugianti',
    posisi: 'Property Sales Executive',
    tanggalInterview: '2026-10-07',
    jamInterview: '13:30 - 14:30',
    metode: 'Offline di Kantor Pemasaran Ashoka View',
    interviewer: 'Fresda Destifani (Head Marketing)',
    lokasiLink: 'Marketing Gallery Ashoka View',
    catatan: 'Simulasi presentasi produk dan penanganan konsumen prospek.',
    status: 'Terjadwal'
  },
  {
    id: 'INT-003',
    applicantId: 'APP-003',
    applicantName: 'Derry Kurniawan, A.Md.',
    posisi: 'Staff Akuntansi & Perpajakan',
    tanggalInterview: '2026-10-05',
    jamInterview: '09:00 - 10:00',
    metode: 'Online via Google Meet',
    interviewer: 'Syamsul Dahari (Finance & Accounting)',
    lokasiLink: 'meet.google.com/ams-rec-derry',
    catatan: 'Tes studi kasus jurnal konstruksi dan PPh 21/23.',
    status: 'Selesai'
  }
];

const INITIAL_ASSESSMENTS = [
  {
    id: 'ASM-001',
    applicantId: 'APP-001',
    applicantName: 'Bambang Triatmojo, S.T.',
    posisi: 'Supervisor Sipil & Bangunan',
    tanggalPenilaian: '2026-10-06',
    penilai1: {
      nama: 'Dodi Syaiful Nugroho (Head HR & GA)',
      sikap: 88,
      komunikasi: 85,
      motivasi: 90,
      skor: 88,
      catatan: 'Kepribadian matang, komunikasi santun dan tegas, siap memimpin mandor lapangan.',
      rekomendasi: 'Lolos'
    },
    penilai2: {
      nama: 'M. Naufal (Head Teknik & Konstruksi)',
      kompetensiTeknis: 92,
      pengalamanKerja: 90,
      problemSolving: 88,
      skor: 90,
      catatan: 'Pemahaman struktur beton dan percepatan progress rumah sangat baik.',
      rekomendasi: 'Lolos'
    },
    penilai3Enabled: true,
    penilai3: {
      nama: 'Yazid Hizbullah (Direktur Utama)',
      kulturKarakter: 90,
      komitmenGaji: 88,
      skor: 89,
      catatan: 'Disetujui. Cocok dengan ritme kerja target perumahan Ashoka.',
      rekomendasi: 'Lolos'
    },
    skorRataRata: 89,
    keputusanAkhir: 'Lolos',
    catatanAkhir: 'Sangat direkomendasikan untuk diterbitkan Offering Letter Supervisor Sipil Ashoka Park.'
  },
  {
    id: 'ASM-002',
    applicantId: 'APP-003',
    applicantName: 'Derry Kurniawan, A.Md.',
    posisi: 'Staff Akuntansi & Perpajakan',
    tanggalPenilaian: '2026-10-05',
    penilai1: {
      nama: 'Dodi Syaiful Nugroho (Head HR & GA)',
      sikap: 86,
      komunikasi: 84,
      motivasi: 85,
      skor: 85,
      catatan: 'Tertib administrasi, teliti dan rekam jejak bebas catatan hukum.',
      rekomendasi: 'Lolos'
    },
    penilai2: {
      nama: 'Syamsul Dahari (Head Finance & Accounting)',
      kompetensiTeknis: 88,
      pengalamanKerja: 85,
      problemSolving: 87,
      skor: 87,
      catatan: 'Menguasai software akuntansi dan integrasi bukti potong pajak properti.',
      rekomendasi: 'Lolos'
    },
    penilai3Enabled: false,
    penilai3: {
      nama: 'Adhi Himawan (General Manager)',
      kulturKarakter: 0,
      komitmenGaji: 0,
      skor: 0,
      catatan: '',
      rekomendasi: 'Lolos'
    },
    skorRataRata: 86,
    keputusanAkhir: 'Lolos',
    catatanAkhir: 'Diteruskan ke tahap penawaran kerja (Offering Letter).'
  }
];

const INITIAL_OFFERINGS = [
  {
    id: 'OFF-001',
    noSurat: '014/HR-OFF/AMS/X/2026',
    applicantId: 'APP-003',
    applicantName: 'Derry Kurniawan, A.Md.',
    posisi: 'Staff Akuntansi & Perpajakan',
    penempatan: 'Kantor Pusat Bizhub',
    jadwalOnDuty: '2026-10-15',
    gajiPokok: 5500000,
    tunjangan: 1200000,
    statusKerja: 'PKWT (Kontrak 1 Tahun)',
    tanggalOffering: '2026-10-05',
    batasKonfirmasi: '2026-10-10',
    statusOffering: 'Diterima',
    catatan: 'Kandidat telah menyetujui paket kompensasi dan siap on duty 15 Oktober 2026.'
  },
  {
    id: 'OFF-002',
    noSurat: '015/HR-OFF/AMS/X/2026',
    applicantId: 'APP-001',
    applicantName: 'Bambang Triatmojo, S.T.',
    posisi: 'Supervisor Sipil & Bangunan',
    penempatan: 'Ashoka Park (Lokasi 1)',
    jadwalOnDuty: '2026-10-20',
    gajiPokok: 7500000,
    tunjangan: 1800000,
    statusKerja: 'PKWT (Kontrak 1 Tahun)',
    tanggalOffering: '2026-10-06',
    batasKonfirmasi: '2026-10-12',
    statusOffering: 'Diterbitkan',
    catatan: 'Surat penawaran resmi telah dikirim ke email kandidat, menunggu tanda tangan konfirmasi.'
  }
];

export const RecruitmentModule = ({ currentUser, showNotification }) => {
  // Sub-Tab Navigation (4 Sub-Modul Permintaan User - Tanpa Angka Badge)
  const [activeSubTab, setActiveSubTab] = useState('cv-pelamar');

  // Datasets
  const [applicants, setApplicants] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_APPLICANTS);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_APPLICANTS;
  });

  const [interviews, setInterviews] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_INTERVIEWS);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_INTERVIEWS;
  });

  const [assessments, setAssessments] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_ASSESSMENTS);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_ASSESSMENTS;
  });

  const [offerings, setOfferings] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_OFFERINGS);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_OFFERINGS;
  });

  // LocalStorage Sync
  useEffect(() => {
    try { localStorage.setItem(STORAGE_APPLICANTS, JSON.stringify(applicants)); } catch {}
  }, [applicants]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_INTERVIEWS, JSON.stringify(interviews)); } catch {}
  }, [interviews]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_ASSESSMENTS, JSON.stringify(assessments)); } catch {}
  }, [assessments]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_OFFERINGS, JSON.stringify(offerings)); } catch {}
  }, [offerings]);

  // Search & Filter State per Sub-Modul
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('ALL');

  const [searchInterview, setSearchInterview] = useState('');
  const [filterInterviewStatus, setFilterInterviewStatus] = useState('ALL');

  const [searchAssessment, setSearchAssessment] = useState('');
  const [filterKeputusan, setFilterKeputusan] = useState('ALL');

  const [searchOffering, setSearchOffering] = useState('');
  const [filterOfferingStatus, setFilterOfferingStatus] = useState('ALL');

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

  // Helper untuk Membuka WhatsApp Otomatis ke Nomor Pelamar
  const openWhatsApp = (phone, text) => {
    if (!phone) {
      showNotification && showNotification('Nomor telepon / WhatsApp pelamar tidak tersedia!', 'danger');
      return;
    }
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Handler Kirim WA dari Sub-Modul 1 (CV Pelamar)
  const handleSendWhatsAppApplicant = (app) => {
    const text = `Halo Bapak/Ibu ${app.nama},\n\nKami dari Tim HRD PT Persada Nusantara Indonesia (AMS Properti) mengonfirmasi bahwa berkas lamaran Anda untuk posisi *${app.posisi}* di proyek *${app.project || 'Ashoka Park'}* telah kami terima dan masuk dalam tahap peninjauan berkas.\n\nTim HRD kami akan mengabari informasi kelanjutan proses seleksi. Terima kasih atas ketertarikan Anda untuk bergabung bersama kami.`;
    openWhatsApp(app.phone, text);
  };

  // Handler Kirim WA dari Sub-Modul 2 (Jadwal Interview)
  const handleSendWhatsAppInterview = (intw) => {
    const app = applicants.find(a => a.id === intw.applicantId || a.nama === intw.applicantName);
    const phone = app?.phone || '';
    const text = `Halo Bapak/Ibu ${intw.applicantName},\n\nKami dari Tim HRD PT Persada Nusantara Indonesia mengundang Anda untuk mengikuti sesi wawancara (interview) posisi *${intw.posisi}* yang dijadwalkan pada:\n- Hari/Tanggal: ${formatDisplayDate(intw.tanggalInterview)}\n- Jam: ${intw.jamInterview} WIB\n- Metode/Lokasi: ${intw.metode} (${intw.lokasiLink || '-'})\n- Pewawancara: ${intw.interviewer}\n\nCatatan: ${intw.catatan || 'Mohon hadir 10 menit sebelum jadwal dimulai'}.\n\nMohon memberikan konfirmasi kehadiran Anda. Terima kasih.`;
    openWhatsApp(phone, text);
  };

  // Handler Kirim WA dari Sub-Modul 4 (Jadwal On Duty & Offering Letter)
  const handleSendWhatsAppOffering = (off) => {
    const app = applicants.find(a => a.id === off.applicantId || a.nama === off.applicantName);
    const phone = app?.phone || '';
    const text = `Halo Bapak/Ibu ${off.applicantName},\n\nSelamat! Anda dinyatakan diterima bergabung di PT Persada Nusantara Indonesia untuk posisi *${off.posisi}*.\n\nBerikut ringkasan Surat Penawaran Kerja (Offering Letter):\n- Nomor Surat: ${off.noSurat}\n- Penempatan: ${off.penempatan}\n- *Jadwal On Duty (Mulai Kerja): ${formatDisplayDate(off.jadwalOnDuty)}*\n- Status Kontrak: ${off.statusKerja}\n- Batas Konfirmasi: ${formatDisplayDate(off.batasKonfirmasi)}\n\nMohon memeriksa dokumen offering letter dan memberikan tanda tangan konfirmasi. Terima kasih.`;
    openWhatsApp(phone, text);
  };

  // ===========================================================================
  // MODAL STATES
  // ===========================================================================
  // 1. Modal Upload CV / Tambah Pelamar
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [appForm, setAppForm] = useState({
    nama: '',
    posisi: '',
    phone: '',
    email: '',
    tanggalMelamar: new Date().toISOString().split('T')[0],
    project: 'Ashoka Park',
    status: 'Lolos Screening',
    catatan: '',
    files: []
  });

  // 2. Modal Atur Jadwal Interview
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [intForm, setIntForm] = useState({
    applicantId: '',
    applicantName: '',
    posisi: '',
    tanggalInterview: new Date().toISOString().split('T')[0],
    jamInterview: '10:00 - 11:30',
    metode: 'Offline di Kantor Pusat HO Bizhub',
    interviewer: 'Dodi Syaiful (HR)',
    lokasiLink: 'Ruang Rapat Utama',
    catatan: '',
    status: 'Terjadwal'
  });

  // 3. Modal Form Penilaian (Multi-Penilai)
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedApplicantForAssessment, setSelectedApplicantForAssessment] = useState(null);
  const [asmForm, setAsmForm] = useState({
    applicantId: '',
    applicantName: '',
    posisi: '',
    tanggalPenilaian: new Date().toISOString().split('T')[0],
    penilai1: {
      nama: 'Dodi Syaiful Nugroho (Head HR & GA)',
      sikap: 85,
      komunikasi: 85,
      motivasi: 85,
      skor: 85,
      catatan: '',
      rekomendasi: 'Lolos'
    },
    penilai2: {
      nama: 'M. Naufal (Head Teknik)',
      kompetensiTeknis: 85,
      pengalamanKerja: 85,
      problemSolving: 85,
      skor: 85,
      catatan: '',
      rekomendasi: 'Lolos'
    },
    penilai3Enabled: false,
    penilai3: {
      nama: 'Yazid Hizbullah (Direktur Utama)',
      kulturKarakter: 85,
      komitmenGaji: 85,
      skor: 85,
      catatan: '',
      rekomendasi: 'Lolos'
    },
    skorRataRata: 85,
    keputusanAkhir: 'Lolos',
    catatanAkhir: ''
  });

  // Modal Khusus: Tombol "Pilih Pelamar Untuk Dinilai" dengan Search
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  // 4. Modal Offering Letter & On Duty
  const [isOfferingModalOpen, setIsOfferingModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState(null);
  const [offForm, setOffForm] = useState({
    noSurat: `01${offerings.length + 5}/HR-OFF/AMS/X/2026`,
    applicantId: '',
    applicantName: '',
    posisi: '',
    penempatan: 'Ashoka Park',
    jadwalOnDuty: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    gajiPokok: 6000000,
    tunjangan: 1500000,
    statusKerja: 'PKWT (Kontrak 1 Tahun)',
    tanggalOffering: new Date().toISOString().split('T')[0],
    batasKonfirmasi: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    statusOffering: 'Diterbitkan',
    catatan: ''
  });

  // 5. Modal Preview / Cetak Dokumen
  const [viewingDoc, setViewingDoc] = useState(null);
  const [viewingOfferingDoc, setViewingOfferingDoc] = useState(null);

  // ===========================================================================
  // HANDLERS: APPLICANTS / CV PELAMAR
  // ===========================================================================
  const handleOpenAddApplicant = () => {
    setEditingApplicant(null);
    setAppForm({
      nama: '',
      posisi: '',
      phone: '',
      email: '',
      tanggalMelamar: new Date().toISOString().split('T')[0],
      project: 'Ashoka Park',
      status: 'Lolos Screening',
      catatan: '',
      files: []
    });
    setIsApplicantModalOpen(true);
  };

  const handleOpenEditApplicant = (app) => {
    setEditingApplicant(app);
    setAppForm({ ...app });
    setIsApplicantModalOpen(true);
  };

  const handleSaveApplicant = (e) => {
    e.preventDefault();
    if (!appForm.nama.trim() || !appForm.posisi.trim()) {
      showNotification && showNotification('Nama pelamar dan posisi wajib diisi!', 'danger');
      return;
    }

    if (editingApplicant) {
      setApplicants(applicants.map(a => a.id === editingApplicant.id ? { ...a, ...appForm } : a));
      showNotification && showNotification(`Data pelamar ${appForm.nama} berhasil diperbarui!`, 'success');
    } else {
      const newId = `APP-00${applicants.length + 1}`;
      const newNoDok = `REC/CV/2026/${String(applicants.length + 1).padStart(3, '0')}`;
      const newApp = {
        ...appForm,
        id: newId,
        noDok: newNoDok,
        files: appForm.files.length > 0 ? appForm.files : [{ name: `CV_${appForm.nama.replace(/\s+/g, '_')}.pdf`, size: '1.2 MB', type: 'application/pdf' }]
      };
      setApplicants([newApp, ...applicants]);
      showNotification && showNotification(`Berkas CV pelamar ${appForm.nama} berhasil diunggah!`, 'success');
    }
    setIsApplicantModalOpen(false);
  };

  const handleDeleteApplicant = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus data pelamar ${name}?`)) {
      setApplicants(applicants.filter(a => a.id !== id));
      showNotification && showNotification(`Data pelamar ${name} telah dihapus!`, 'info');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newFiles = files.map(f => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.type
    }));
    setAppForm(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  };

  // ===========================================================================
  // HANDLERS: JADWAL INTERVIEW
  // ===========================================================================
  const handleOpenAddInterview = (prefilledApp = null) => {
    setEditingInterview(null);
    if (prefilledApp) {
      setIntForm({
        applicantId: prefilledApp.id,
        applicantName: prefilledApp.nama,
        posisi: prefilledApp.posisi,
        tanggalInterview: new Date().toISOString().split('T')[0],
        jamInterview: '10:00 - 11:30',
        metode: 'Offline di Kantor Pusat HO Bizhub',
        interviewer: 'Dodi Syaiful (HR)',
        lokasiLink: 'Ruang Rapat Utama',
        catatan: '',
        status: 'Terjadwal'
      });
    } else {
      const firstApp = applicants[0];
      setIntForm({
        applicantId: firstApp ? firstApp.id : '',
        applicantName: firstApp ? firstApp.nama : '',
        posisi: firstApp ? firstApp.posisi : '',
        tanggalInterview: new Date().toISOString().split('T')[0],
        jamInterview: '10:00 - 11:30',
        metode: 'Offline di Kantor Pusat HO Bizhub',
        interviewer: 'Dodi Syaiful (HR)',
        lokasiLink: 'Ruang Rapat Utama',
        catatan: '',
        status: 'Terjadwal'
      });
    }
    setIsInterviewModalOpen(true);
  };

  const handleOpenEditInterview = (intw) => {
    setEditingInterview(intw);
    setIntForm({ ...intw });
    setIsInterviewModalOpen(true);
  };

  const handleSaveInterview = (e) => {
    e.preventDefault();
    if (!intForm.applicantName.trim()) {
      showNotification && showNotification('Pilih nama pelamar untuk jadwal interview!', 'danger');
      return;
    }

    if (editingInterview) {
      setInterviews(interviews.map(i => i.id === editingInterview.id ? { ...i, ...intForm } : i));
      showNotification && showNotification(`Jadwal interview untuk ${intForm.applicantName} diperbarui!`, 'success');
    } else {
      const newIntw = {
        ...intForm,
        id: `INT-00${interviews.length + 1}`
      };
      setInterviews([newIntw, ...interviews]);
      // Update applicant status to Interview
      if (intForm.applicantId) {
        setApplicants(applicants.map(a => a.id === intForm.applicantId ? { ...a, status: 'Interview' } : a));
      }
      showNotification && showNotification(`Jadwal interview untuk ${intForm.applicantName} berhasil dibuat!`, 'success');
    }
    setIsInterviewModalOpen(false);
  };

  const handleDeleteInterview = (id, name) => {
    if (window.confirm(`Hapus jadwal interview untuk ${name}?`)) {
      setInterviews(interviews.filter(i => i.id !== id));
      showNotification && showNotification(`Jadwal interview untuk ${name} dihapus!`, 'info');
    }
  };

  const handleToggleInterviewStatus = (intw) => {
    const nextStatus = intw.status === 'Selesai' ? 'Terjadwal' : 'Selesai';
    setInterviews(interviews.map(i => i.id === intw.id ? { ...i, status: nextStatus } : i));
    showNotification && showNotification(`Status interview ${intw.applicantName} diubah ke ${nextStatus}!`, 'info');
  };

  // ===========================================================================
  // HANDLERS: HASIL PENILAIAN (MULTI-PENILAI)
  // ===========================================================================
  const handleOpenAssessmentModal = (applicantOrAssessment) => {
    // Check if an assessment already exists for this applicant
    const existingAsm = assessments.find(a => 
      a.applicantId === applicantOrAssessment.id || 
      a.id === applicantOrAssessment.id ||
      a.applicantName === applicantOrAssessment.nama ||
      a.applicantName === applicantOrAssessment.applicantName
    );

    if (existingAsm) {
      setSelectedApplicantForAssessment(existingAsm);
      setAsmForm({ ...existingAsm });
    } else {
      // Create new assessment form
      const appName = applicantOrAssessment.nama || applicantOrAssessment.applicantName || '';
      const appId = applicantOrAssessment.id || applicantOrAssessment.applicantId || '';
      const pos = applicantOrAssessment.posisi || '';

      setSelectedApplicantForAssessment(applicantOrAssessment);
      setAsmForm({
        id: `ASM-00${assessments.length + 1}`,
        applicantId: appId,
        applicantName: appName,
        posisi: pos,
        tanggalPenilaian: new Date().toISOString().split('T')[0],
        penilai1: {
          nama: 'Dodi Syaiful Nugroho (Head HR & GA)',
          sikap: 85,
          komunikasi: 85,
          motivasi: 85,
          skor: 85,
          catatan: '',
          rekomendasi: 'Lolos'
        },
        penilai2: {
          nama: 'M. Naufal (Head Teknik)',
          kompetensiTeknis: 85,
          pengalamanKerja: 85,
          problemSolving: 85,
          skor: 85,
          catatan: '',
          rekomendasi: 'Lolos'
        },
        penilai3Enabled: false,
        penilai3: {
          nama: 'Yazid Hizbullah (Direktur Utama)',
          kulturKarakter: 85,
          komitmenGaji: 85,
          skor: 85,
          catatan: '',
          rekomendasi: 'Lolos'
        },
        skorRataRata: 85,
        keputusanAkhir: 'Lolos',
        catatanAkhir: ''
      });
    }
    setIsAssessmentModalOpen(true);
  };

  // Hitung otomatis skor rata-rata dengan aman (tidak macet jika ada input kosong)
  const calculateAverageScore = (form) => {
    const s1 = form.penilai1?.skor === '' ? 0 : Number(form.penilai1?.skor || 0);
    const s2 = form.penilai2?.skor === '' ? 0 : Number(form.penilai2?.skor || 0);
    if (form.penilai3Enabled) {
      const s3 = form.penilai3?.skor === '' ? 0 : Number(form.penilai3?.skor || 0);
      return Math.round((s1 + s2 + s3) / 3);
    }
    return Math.round((s1 + s2) / 2);
  };

  const handleSaveAssessment = (e) => {
    e.preventDefault();
    const avgScore = calculateAverageScore(asmForm);
    const updatedForm = { ...asmForm, skorRataRata: avgScore };

    const exists = assessments.some(a => a.id === updatedForm.id || a.applicantId === updatedForm.applicantId);
    if (exists) {
      setAssessments(assessments.map(a => (a.id === updatedForm.id || a.applicantId === updatedForm.applicantId) ? updatedForm : a));
      showNotification && showNotification(`Hasil penilaian untuk ${updatedForm.applicantName} berhasil diperbarui!`, 'success');
    } else {
      setAssessments([updatedForm, ...assessments]);
      showNotification && showNotification(`Hasil penilaian untuk ${updatedForm.applicantName} berhasil disimpan!`, 'success');
    }

    // Update applicant status if Lolos
    if (updatedForm.keputusanAkhir === 'Lolos' && updatedForm.applicantId) {
      setApplicants(applicants.map(a => a.id === updatedForm.applicantId ? { ...a, status: 'Offering' } : a));
    }

    setIsAssessmentModalOpen(false);
  };

  // ===========================================================================
  // HANDLERS: OFFERING LETTER & ON DUTY
  // ===========================================================================
  const handleOpenAddOffering = (prefilled = null) => {
    setEditingOffering(null);
    if (prefilled) {
      setOffForm({
        noSurat: `01${offerings.length + 5}/HR-OFF/AMS/X/2026`,
        applicantId: prefilled.applicantId || prefilled.id || '',
        applicantName: prefilled.applicantName || prefilled.nama || '',
        posisi: prefilled.posisi || '',
        penempatan: 'Ashoka Park (Lokasi 1)',
        jadwalOnDuty: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        gajiPokok: 6500000,
        tunjangan: 1500000,
        statusKerja: 'PKWT (Kontrak 1 Tahun)',
        tanggalOffering: new Date().toISOString().split('T')[0],
        batasKonfirmasi: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        statusOffering: 'Diterbitkan',
        catatan: ''
      });
    } else {
      const cand = applicants.find(a => a.status === 'Offering' || a.status === 'Interview') || applicants[0];
      setOffForm({
        noSurat: `01${offerings.length + 5}/HR-OFF/AMS/X/2026`,
        applicantId: cand ? cand.id : '',
        applicantName: cand ? cand.nama : '',
        posisi: cand ? cand.posisi : '',
        penempatan: 'Ashoka Park (Lokasi 1)',
        jadwalOnDuty: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        gajiPokok: 6500000,
        tunjangan: 1500000,
        statusKerja: 'PKWT (Kontrak 1 Tahun)',
        tanggalOffering: new Date().toISOString().split('T')[0],
        batasKonfirmasi: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        statusOffering: 'Diterbitkan',
        catatan: ''
      });
    }
    setIsOfferingModalOpen(true);
  };

  const handleOpenEditOffering = (off) => {
    setEditingOffering(off);
    setOffForm({ ...off });
    setIsOfferingModalOpen(true);
  };

  const handleSaveOffering = (e) => {
    e.preventDefault();
    if (!offForm.applicantName.trim()) {
      showNotification && showNotification('Pilih nama pelamar untuk surat penawaran!', 'danger');
      return;
    }

    if (editingOffering) {
      setOfferings(offerings.map(o => o.id === editingOffering.id ? { ...o, ...offForm } : o));
      showNotification && showNotification(`Offering letter untuk ${offForm.applicantName} diperbarui!`, 'success');
    } else {
      const newOff = {
        ...offForm,
        id: `OFF-00${offerings.length + 1}`
      };
      setOfferings([newOff, ...offerings]);
      if (offForm.applicantId) {
        setApplicants(applicants.map(a => a.id === offForm.applicantId ? { ...a, status: 'Diterima' } : a));
      }
      showNotification && showNotification(`Offering letter untuk ${offForm.applicantName} berhasil diterbitkan!`, 'success');
    }
    setIsOfferingModalOpen(false);
  };

  const handleDeleteOffering = (id, name) => {
    if (window.confirm(`Hapus offering letter untuk ${name}?`)) {
      setOfferings(offerings.filter(o => o.id !== id));
      showNotification && showNotification(`Offering letter untuk ${name} dihapus!`, 'info');
    }
  };

  // 1. Filtered applicants (Sub-Modul 1)
  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const q = searchQuery.toLowerCase();
      const matchSearch = (
        app.nama.toLowerCase().includes(q) ||
        app.posisi.toLowerCase().includes(q) ||
        (app.phone && app.phone.toLowerCase().includes(q)) ||
        (app.email && app.email.toLowerCase().includes(q)) ||
        (app.noDok && app.noDok.toLowerCase().includes(q)) ||
        (app.catatan && app.catatan.toLowerCase().includes(q))
      );
      const matchProject = filterProject === 'ALL' || app.project === filterProject;
      return matchSearch && matchProject;
    });
  }, [applicants, searchQuery, filterProject]);

  // 2. Filtered interviews (Sub-Modul 2)
  const filteredInterviews = useMemo(() => {
    return interviews.filter(intw => {
      const q = searchInterview.toLowerCase();
      const matchSearch = (
        intw.applicantName.toLowerCase().includes(q) ||
        intw.posisi.toLowerCase().includes(q) ||
        (intw.interviewer && intw.interviewer.toLowerCase().includes(q)) ||
        (intw.metode && intw.metode.toLowerCase().includes(q)) ||
        (intw.lokasiLink && intw.lokasiLink.toLowerCase().includes(q)) ||
        (intw.catatan && intw.catatan.toLowerCase().includes(q))
      );
      const matchStatus = filterInterviewStatus === 'ALL' || intw.status === filterInterviewStatus;
      return matchSearch && matchStatus;
    });
  }, [interviews, searchInterview, filterInterviewStatus]);

  // 3. Filtered assessments (Sub-Modul 3 dengan Filter Keputusan & Search)
  const filteredAssessments = useMemo(() => {
    return assessments.filter(asm => {
      const q = searchAssessment.toLowerCase();
      const matchSearch = (
        asm.applicantName.toLowerCase().includes(q) ||
        asm.posisi.toLowerCase().includes(q) ||
        (asm.catatanAkhir && asm.catatanAkhir.toLowerCase().includes(q)) ||
        (asm.penilai1?.nama && asm.penilai1.nama.toLowerCase().includes(q)) ||
        (asm.penilai2?.nama && asm.penilai2.nama.toLowerCase().includes(q)) ||
        (asm.penilai3?.nama && asm.penilai3.nama.toLowerCase().includes(q))
      );
      const matchKeputusan = filterKeputusan === 'ALL' || asm.keputusanAkhir === filterKeputusan;
      return matchSearch && matchKeputusan;
    });
  }, [assessments, searchAssessment, filterKeputusan]);

  // 4. Filtered offerings (Sub-Modul 4)
  const filteredOfferings = useMemo(() => {
    return offerings.filter(off => {
      const q = searchOffering.toLowerCase();
      const matchSearch = (
        off.applicantName.toLowerCase().includes(q) ||
        off.posisi.toLowerCase().includes(q) ||
        (off.noSurat && off.noSurat.toLowerCase().includes(q)) ||
        (off.penempatan && off.penempatan.toLowerCase().includes(q)) ||
        (off.statusKerja && off.statusKerja.toLowerCase().includes(q)) ||
        (off.catatan && off.catatan.toLowerCase().includes(q))
      );
      const matchStatus = filterOfferingStatus === 'ALL' || off.statusOffering === filterOfferingStatus;
      return matchSearch && matchStatus;
    });
  }, [offerings, searchOffering, filterOfferingStatus]);

  // Filtered applicants for Picker Modal
  const filteredPickerApplicants = useMemo(() => {
    return applicants.filter(app => {
      return (
        app.nama.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        app.posisi.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        (app.project && app.project.toLowerCase().includes(pickerSearch.toLowerCase()))
      );
    });
  }, [applicants, pickerSearch]);

  // Tab Menu Items (Permintaan User: Hilangkan Angka/Count Badge)
  const SUBTABS = [
    { id: 'cv-pelamar', label: '1. Lowongan Terbuka & CV Pelamar' },
    { id: 'jadwal-interview', label: '2. Jadwal Interview' },
    { id: 'hasil-penilaian', label: '3. Hasil Penilaian' },
    { id: 'on-duty', label: '4. Jadwal On Duty & Offering Letter' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ===================================================================== */}
      {/* 4 SUB-MODUL RECRUITMENT TABS (TANPA ANGKA-ANGKA / COUNT BADGE)        */}
      {/* ===================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))',
          gap: '10px',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '10px',
          borderRadius: '14px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          overflowX: 'auto'
        }}
      >
        {SUBTABS.map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : '#0f172a',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: isActive ? '1.5px solid #34d399' : '1px solid #1e293b',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '0.84rem',
                fontWeight: isActive ? 900 : 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive ? '0 4px 14px rgba(16, 185, 129, 0.45)' : 'none',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* SUB-MODUL 1: LOWONGAN TERBUKA & CV PELAMAR                            */}
      {/* ===================================================================== */}
      {activeSubTab === 'cv-pelamar' && (
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          {/* Top Bar: Title & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
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
                  Sub-Modul 1: CV Pelamar & Lowongan
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  ({filteredApplicants.length} berkas kandidat terdaftar)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Unggah CV pelamar, kirim pesan konfirmasi ke WhatsApp, dan pratinjau berkas dokumen PDF/Word.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#10b981' }} />
                <input
                  type="text"
                  placeholder="Cari nama / posisi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '32px', height: '38px', fontSize: '0.82rem', width: '200px', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                />
              </div>

              <select
                className="form-control"
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                style={{
                  height: '38px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  width: '220px',
                  minWidth: '220px',
                  background: '#0f172a',
                  color: '#ffffff',
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  borderRadius: '8px',
                  padding: '0 12px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <option value="ALL">Semua Proyek</option>
                <option value="Ashoka Park">Ashoka Park</option>
                <option value="Ashoka View">Ashoka View</option>
                <option value="Kantor Pusat Bizhub">Kantor Pusat Bizhub</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={handleOpenAddApplicant}
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
                <UploadCloud size={16} /> + Upload CV / Tambah Pelamar
              </button>
            </div>
          </div>

          {/* Table Daftar CV Pelamar (Posisi dan Proyek Dipisah, Tanpa Ikon 📍) */}
          <div className="table-container" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1050px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                  <th style={{ width: '100px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>No. & Tgl</th>
                  <th style={{ minWidth: '180px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Nama Pelamar</th>
                  <th style={{ width: '170px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Posisi Dilamar</th>
                  <th style={{ width: '150px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Proyek</th>
                  <th style={{ width: '190px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Kontak & WhatsApp</th>
                  <th style={{ width: '140px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Dokumen CV</th>
                  <th style={{ width: '130px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ width: '130px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      <FileText size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                        {searchQuery || filterProject !== 'ALL' ? 'Tidak ada berkas pelamar yang sesuai' : 'Belum ada berkas pelamar'}
                      </div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                        {searchQuery || filterProject !== 'ALL' ? 'Coba ubah kata kunci pencarian atau sesuaikan filter proyek.' : 'Klik tombol "+ Upload CV / Tambah Pelamar" untuk memasukkan data kandidat baru.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((app, idx) => (
                    <tr key={app.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      {/* No & Tgl */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                          {app.noDok || `REC-${idx+1}`}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', whiteSpace: 'nowrap' }}>
                          {formatDisplayDate(app.tanggalMelamar)}
                        </div>
                      </td>

                      {/* Nama Pelamar */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>{app.nama}</div>
                        {app.catatan && (
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.35 }}>
                            {app.catatan}
                          </div>
                        )}
                      </td>

                      {/* Posisi Dilamar (Terpisah) */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.82rem' }}>
                          {app.posisi}
                        </div>
                      </td>

                      {/* Proyek (Terpisah, Tanpa Ikon 📍) */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 700 }}>
                          {app.project || 'Ashoka Park'}
                        </div>
                      </td>

                      {/* Kontak & WhatsApp */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>{app.phone}</span>
                          <button
                            onClick={() => handleSendWhatsAppApplicant(app)}
                            style={{
                              background: '#25D366',
                              border: 'none',
                              color: '#ffffff',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              boxShadow: '0 2px 5px rgba(37, 211, 102, 0.3)'
                            }}
                            title="Kirim Pesan WhatsApp Konfirmasi ke Pelamar"
                          >
                            <MessageSquare size={11} /> WA
                          </button>
                        </div>
                        {app.email && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={11} color="#10b981" /> {app.email}
                          </div>
                        )}
                      </td>

                      {/* Berkas CV */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        {app.files && app.files.length > 0 ? (
                          <button
                            onClick={() => setViewingDoc({ app, file: app.files[0] })}
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              color: '#34d399',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                            title="Pratinjau Dokumen CV"
                          >
                            <Eye size={12} /> {app.files[0].name.length > 15 ? app.files[0].name.substring(0, 13) + '...' : app.files[0].name}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Tidak ada file</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        <span
                          style={{
                            background: app.status === 'Diterima' ? 'rgba(34, 197, 94, 0.15)' :
                              app.status === 'Offering' ? 'rgba(16, 185, 129, 0.15)' :
                              app.status === 'Interview' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.15)',
                            color: app.status === 'Diterima' ? '#22c55e' :
                              app.status === 'Offering' ? '#10b981' :
                              app.status === 'Interview' ? '#34d399' : '#34d399',
                            border: `1px solid ${
                              app.status === 'Diterima' ? '#22c55e' :
                              app.status === 'Offering' ? '#10b981' :
                              app.status === 'Interview' ? '#10b981' : '#10b981'
                            }`,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
                          <button
                            onClick={() => handleOpenAddInterview(app)}
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
                            title="Atur Jadwal Interview Pelamar Ini"
                          >
                            <Calendar size={12} />
                          </button>
                          <button
                            onClick={() => handleOpenEditApplicant(app)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 6px', fontSize: '0.72rem' }}
                            title="Edit Data Pelamar"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteApplicant(app.id, app.nama)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                            title="Hapus Pelamar"
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
      {/* SUB-MODUL 2: JADWAL INTERVIEW                                         */}
      {/* ===================================================================== */}
      {activeSubTab === 'jadwal-interview' && (
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          {/* Top Bar: Title & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
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
                  Sub-Modul 2: Jadwal Interview
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  ({filteredInterviews.length} agenda wawancara)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Pantau jadwal wawancara masing-masing pelamar, kirim undangan interview via WhatsApp, dan evaluasi hasil wawancara.
              </p>
            </div>

            {/* Filter Search, Status Filter & Tombol Atur Jadwal */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#10b981' }} />
                <input
                  type="text"
                  placeholder="Cari nama / posisi / pewawancara..."
                  value={searchInterview}
                  onChange={(e) => setSearchInterview(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '32px', height: '38px', fontSize: '0.82rem', width: '220px', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                />
              </div>

              <select
                className="form-control"
                value={filterInterviewStatus}
                onChange={(e) => setFilterInterviewStatus(e.target.value)}
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
                <option value="ALL">Semua Status</option>
                <option value="Terjadwal">Terjadwal</option>
                <option value="Selesai">Selesai</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={() => handleOpenAddInterview()}
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
                <Calendar size={16} /> + Atur Jadwal Interview
              </button>
            </div>
          </div>

          {/* Table Jadwal Interview */}
          <div className="table-container" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1020px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                  <th style={{ width: '150px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Tanggal & Jam</th>
                  <th style={{ minWidth: '180px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Nama Pelamar & Posisi</th>
                  <th style={{ width: '210px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Metode & Lokasi / Link</th>
                  <th style={{ width: '180px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Pewawancara</th>
                  <th style={{ width: '110px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ width: '180px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi, Nilai & WA</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      <Calendar size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                        {searchInterview || filterInterviewStatus !== 'ALL' ? 'Tidak ada agenda wawancara yang sesuai' : 'Belum ada jadwal interview'}
                      </div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                        {searchInterview || filterInterviewStatus !== 'ALL' ? 'Coba ubah kata kunci pencarian atau reset filter status.' : 'Klik tombol "+ Atur Jadwal Interview" untuk menentukan waktu wawancara pelamar.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredInterviews.map((intw, idx) => (
                    <tr key={intw.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      {/* Tanggal & Jam */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.84rem', whiteSpace: 'nowrap' }}>
                          {formatDisplayDate(intw.tanggalInterview)}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
                          <Clock size={12} /> {intw.jamInterview}
                        </div>
                      </td>

                      {/* Nama Pelamar & Posisi */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>{intw.applicantName}</div>
                        <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>
                          {intw.posisi}
                        </div>
                        {intw.catatan && (
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
                            Catatan: {intw.catatan}
                          </div>
                        )}
                      </td>

                      {/* Metode & Lokasi */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>{intw.metode}</div>
                        {intw.lokasiLink && (
                          <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: '2px', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>
                            📍 {intw.lokasiLink}
                          </div>
                        )}
                      </td>

                      {/* Pewawancara */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                          {intw.interviewer}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        <span
                          style={{
                            background: intw.status === 'Selesai' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)',
                            color: '#34d399',
                            border: '1px solid #10b981',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {intw.status}
                        </span>
                      </td>

                      {/* Aksi & Nilai & WhatsApp */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* Tombol Kirim Undangan WhatsApp */}
                          <button
                            onClick={() => handleSendWhatsAppInterview(intw)}
                            style={{
                              background: '#25D366',
                              border: 'none',
                              color: '#ffffff',
                              padding: '3px 7px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              boxShadow: '0 2px 5px rgba(37, 211, 102, 0.3)'
                            }}
                            title="Kirim Undangan Jadwal Interview via WhatsApp ke Pelamar"
                          >
                            <MessageSquare size={11} /> Undangan WA
                          </button>

                          <button
                            onClick={() => handleOpenAssessmentModal(intw)}
                            className="btn btn-sm"
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid #10b981',
                              color: '#34d399',
                              padding: '3px 7px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              borderRadius: '5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                            title="Input Hasil Penilaian Wawancara"
                          >
                            <Award size={12} /> Nilai
                          </button>

                          <button
                            onClick={() => handleToggleInterviewStatus(intw)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              padding: '3px 6px',
                              fontSize: '0.72rem',
                              color: intw.status === 'Selesai' ? '#10b981' : '#94a3b8'
                            }}
                            title={intw.status === 'Selesai' ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                          >
                            <Check size={12} />
                          </button>

                          <button
                            onClick={() => handleOpenEditInterview(intw)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 6px', fontSize: '0.72rem' }}
                            title="Edit Jadwal"
                          >
                            <Edit3 size={12} />
                          </button>

                          <button
                            onClick={() => handleDeleteInterview(intw.id, intw.applicantName)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                            title="Hapus Jadwal"
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
      {/* SUB-MODUL 3: HASIL PENILAIAN (MULTI-PENILAI: 1, 2, 3 OPSIONAL)       */}
      {/* ===================================================================== */}
      {activeSubTab === 'hasil-penilaian' && (
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          {/* Top Bar: Title & Tombol Pilih Pelamar Dengan Modal Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
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
                  Sub-Modul 3: Hasil Penilaian Wawancara
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  ({filteredAssessments.length} kandidat dinilai)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Klik tombol "Pilih Pelamar Untuk Dinilai" untuk mencari pelamar dan membuka formulir evaluasi: Penilai 1 (HRD), Penilai 2 (User), dan Penilai 3 (Opsional Direksi).
              </p>
            </div>

            {/* Filter Search, Filter Keputusan & Tombol Pilih Pelamar Untuk Dinilai */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#10b981' }} />
                <input
                  type="text"
                  placeholder="Cari nama / posisi..."
                  value={searchAssessment}
                  onChange={(e) => setSearchAssessment(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '32px', height: '38px', fontSize: '0.82rem', width: '200px', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                />
              </div>

              {/* FITUR FILTER KEPUTUSAN (Lebar Diperbesar Sehingga Tidak Terpotong) */}
              <select
                className="form-control"
                value={filterKeputusan}
                onChange={(e) => setFilterKeputusan(e.target.value)}
                style={{
                  height: '38px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  width: '230px',
                  minWidth: '230px',
                  background: '#0f172a',
                  color: '#ffffff',
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  borderRadius: '8px',
                  padding: '0 12px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <option value="ALL">Semua Keputusan</option>
                <option value="Lolos">Lolos (Siap Offering)</option>
                <option value="Dipertimbangkan">Dipertimbangkan</option>
                <option value="Tidak Lolos">Tidak Lolos</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={() => { setPickerSearch(''); setIsPickerModalOpen(true); }}
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
                <Users size={16} /> Pilih Pelamar Untuk Dinilai
              </button>
            </div>
          </div>

          {/* Table Hasil Penilaian (Konsisten Warna Hijau / Emerald) */}
          <div className="table-container" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1060px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                  <th style={{ width: '110px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Tgl Nilai</th>
                  <th style={{ minWidth: '180px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Nama Pelamar & Posisi</th>
                  <th style={{ width: '190px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Penilai 1 (HRD)</th>
                  <th style={{ width: '190px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Penilai 2 (User Divisi)</th>
                  <th style={{ width: '190px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Penilai 3 (Opsional BOD)</th>
                  <th style={{ width: '110px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Rata-Rata</th>
                  <th style={{ width: '170px', minWidth: '170px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Keputusan</th>
                  <th style={{ width: '120px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      <Award size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                        {searchAssessment || filterKeputusan !== 'ALL' ? 'Tidak ada hasil penilaian yang sesuai' : 'Belum ada hasil penilaian'}
                      </div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                        {searchAssessment || filterKeputusan !== 'ALL' ? 'Coba ubah kata kunci pencarian atau sesuaikan filter keputusan.' : 'Klik tombol "Pilih Pelamar Untuk Dinilai" di atas untuk mencari pelamar dan memulai penginputan evaluasi.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((asm, idx) => (
                    <tr key={asm.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      {/* Tgl Nilai */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {formatDisplayDate(asm.tanggalPenilaian)}
                        </div>
                      </td>

                      {/* Nama Pelamar & Posisi */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>{asm.applicantName}</div>
                        <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>
                          {asm.posisi}
                        </div>
                        {asm.catatanAkhir && (
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.35 }}>
                            "{asm.catatanAkhir}"
                          </div>
                        )}
                      </td>

                      {/* Penilai 1 */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 700 }}>
                          {asm.penilai1?.nama || 'Dodi Syaiful (HR)'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 800, marginTop: '2px' }}>
                          Skor: {asm.penilai1?.skor || 0}/100 • ({asm.penilai1?.rekomendasi || '-'})
                        </div>
                      </td>

                      {/* Penilai 2 */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 700 }}>
                          {asm.penilai2?.nama || 'Head User'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, marginTop: '2px' }}>
                          Skor: {asm.penilai2?.skor || 0}/100 • ({asm.penilai2?.rekomendasi || '-'})
                        </div>
                      </td>

                      {/* Penilai 3 */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        {asm.penilai3Enabled ? (
                          <>
                            <div style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 700 }}>
                              {asm.penilai3?.nama || 'Direksi'}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, marginTop: '2px' }}>
                              Skor: {asm.penilai3?.skor || 0}/100 • ({asm.penilai3?.rekomendasi || '-'})
                            </div>
                          </>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
                            (Tidak diaktifkan)
                          </span>
                        )}
                      </td>

                      {/* Skor Rata-Rata */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        <span
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid #10b981',
                            color: '#34d399',
                            fontWeight: 900,
                            fontSize: '0.88rem',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            display: 'inline-block'
                          }}
                        >
                          {asm.skorRataRata || calculateAverageScore(asm)}
                        </span>
                      </td>

                      {/* Keputusan (Tidak Terpotong) */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center', width: '170px', minWidth: '170px' }}>
                        <span
                          style={{
                            background: asm.keputusanAkhir === 'Lolos' ? 'rgba(16, 185, 129, 0.15)' :
                              asm.keputusanAkhir === 'Dipertimbangkan' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
                            color: asm.keputusanAkhir === 'Lolos' ? '#10b981' :
                              asm.keputusanAkhir === 'Dipertimbangkan' ? '#34d399' : '#ef4444',
                            border: `1px solid ${
                              asm.keputusanAkhir === 'Lolos' ? '#10b981' :
                              asm.keputusanAkhir === 'Dipertimbangkan' ? '#10b981' : '#ef4444'
                            }`,
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {asm.keputusanAkhir === 'Lolos' ? 'Lolos (Siap Offering)' : asm.keputusanAkhir}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
                          <button
                            onClick={() => handleOpenAssessmentModal(asm)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 7px', fontSize: '0.72rem', fontWeight: 700 }}
                            title="Edit / Lihat Form Penilaian"
                          >
                            <Edit3 size={12} /> Edit
                          </button>
                          {asm.keputusanAkhir === 'Lolos' && (
                            <button
                              onClick={() => {
                                handleOpenAddOffering(asm);
                                setActiveSubTab('on-duty');
                              }}
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
                              title="Buat Offering Letter"
                            >
                              <FileText size={12} />
                            </button>
                          )}
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
      {/* SUB-MODUL 4: JADWAL ON DUTY & OFFERING LETTER                         */}
      {/* ===================================================================== */}
      {activeSubTab === 'on-duty' && (
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          {/* Top Bar: Title & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
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
                  Sub-Modul 4: Jadwal On Duty & Offering Letter
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  ({filteredOfferings.length} surat penawaran diterbitkan)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Penerbitan Surat Penawaran Kerja (Offering Letter), penetapan tanggal mulai masuk kerja (Jadwal On Duty), dan kirim konfirmasi ke WhatsApp pelamar.
              </p>
            </div>

            {/* Filter Search, Status Filter & Tombol Buat Offering */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#34d399' }} />
                <input
                  type="text"
                  placeholder="Cari no surat / nama / posisi..."
                  value={searchOffering}
                  onChange={(e) => setSearchOffering(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '32px', height: '38px', fontSize: '0.82rem', width: '220px', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                />
              </div>

              <select
                className="form-control"
                value={filterOfferingStatus}
                onChange={(e) => setFilterOfferingStatus(e.target.value)}
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
                <option value="ALL">Semua Status</option>
                <option value="Diterbitkan">Diterbitkan</option>
                <option value="Diterima">Diterima</option>
                <option value="Draf">Draf</option>
                <option value="Ditolak">Ditolak</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={() => handleOpenAddOffering()}
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
                <FileText size={16} /> + Buat Offering Letter Baru
              </button>
            </div>
          </div>

          {/* Table Offering & On Duty */}
          <div className="table-container" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', minWidth: '1050px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                  <th style={{ width: '130px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>No. Surat & Tgl</th>
                  <th style={{ minWidth: '180px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Nama Pelamar & Jabatan</th>
                  <th style={{ width: '160px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Jadwal On Duty</th>
                  <th style={{ width: '180px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>Gaji & Tunjangan</th>
                  <th style={{ width: '130px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>Status Surat</th>
                  <th style={{ width: '150px', padding: '0.9rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>WA & Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfferings.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      <FileText size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                        {searchOffering || filterOfferingStatus !== 'ALL' ? 'Tidak ada offering letter yang sesuai' : 'Belum ada offering letter'}
                      </div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                        {searchOffering || filterOfferingStatus !== 'ALL' ? 'Coba ubah kata kunci pencarian atau sesuaikan filter status.' : 'Klik tombol "+ Buat Offering Letter Baru" untuk menerbitkan penawaran kerja.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOfferings.map((off, idx) => (
                    <tr key={off.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      {/* No Surat & Tgl */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                          {off.noSurat}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', whiteSpace: 'nowrap' }}>
                          Terbit: {formatDisplayDate(off.tanggalOffering)}
                        </div>
                      </td>

                      {/* Nama Pelamar & Jabatan */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>{off.applicantName}</div>
                        <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>
                          {off.posisi}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                          Penempatan: {off.penempatan} • {off.statusKerja}
                        </div>
                      </td>

                      {/* Jadwal On Duty */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1.5px solid #10b981',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Calendar size={14} color="#10b981" />
                          <div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Mulai Bekerja:</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#34d399' }}>
                              {formatDisplayDate(off.jadwalOnDuty)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Gaji & Tunjangan */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap' }}>
                          {formatRupiah(off.gajiPokok)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap' }}>
                          + Tunjangan: {formatRupiah(off.tunjangan)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '1px', whiteSpace: 'nowrap' }}>
                          Total: {formatRupiah(Number(off.gajiPokok) + Number(off.tunjangan))}
                        </div>
                      </td>

                      {/* Status Surat */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        <span
                          style={{
                            background: off.statusOffering === 'Diterima' ? 'rgba(34, 197, 94, 0.15)' :
                              off.statusOffering === 'Diterbitkan' ? 'rgba(16, 185, 129, 0.15)' :
                              off.statusOffering === 'Draf' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: off.statusOffering === 'Diterima' ? '#22c55e' :
                              off.statusOffering === 'Diterbitkan' ? '#34d399' :
                              off.statusOffering === 'Draf' ? '#94a3b8' : '#ef4444',
                            border: `1px solid ${
                              off.statusOffering === 'Diterima' ? '#22c55e' :
                              off.statusOffering === 'Diterbitkan' ? '#10b981' :
                              off.statusOffering === 'Draf' ? '#94a3b8' : '#ef4444'
                            }`,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {off.statusOffering}
                        </span>
                        {off.batasKonfirmasi && (
                          <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', whiteSpace: 'nowrap' }}>
                            Batas: {formatDisplayDate(off.batasKonfirmasi)}
                          </div>
                        )}
                      </td>

                      {/* WA & Aksi (Tombol Cetak Dihapus Sesuai Permintaan User) */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* Tombol Kirim WhatsApp Offering */}
                          <button
                            onClick={() => handleSendWhatsAppOffering(off)}
                            style={{
                              background: '#25D366',
                              border: 'none',
                              color: '#ffffff',
                              padding: '4px 7px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 5px rgba(37, 211, 102, 0.3)'
                            }}
                            title="Kirim Konfirmasi Offering Letter & On Duty via WhatsApp ke Pelamar"
                          >
                            <MessageSquare size={12} /> WA
                          </button>

                          <button
                            onClick={() => handleOpenEditOffering(off)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', fontSize: '0.72rem' }}
                            title="Edit Offering"
                          >
                            <Edit3 size={12} />
                          </button>

                          <button
                            onClick={() => handleDeleteOffering(off.id, off.applicantName)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                            title="Hapus"
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
      {/* MODAL KHUSUS: PILIH PELAMAR UNTUK DINILAI DENGAN PENCARIAN (SEARCH)   */}
      {/* ===================================================================== */}
      {isPickerModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '620px', maxHeight: '85vh', overflowY: 'auto', padding: '1.6rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#10b981" />
                <span>Pilih Pelamar Untuk Dinilai</span>
              </div>
              <button onClick={() => setIsPickerModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Input Search Box Pelamar */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#10b981' }} />
              <input
                type="text"
                autoFocus
                placeholder="Cari nama pelamar, posisi, atau proyek..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '38px', height: '40px', fontSize: '0.85rem', borderColor: '#10b981' }}
              />
            </div>

            {/* Daftar Nama Pelamar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '50vh', overflowY: 'auto' }}>
              {filteredPickerApplicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.85rem' }}>
                  Tidak ada pelamar yang cocok dengan pencarian "{pickerSearch}".
                </div>
              ) : (
                filteredPickerApplicants.map((app) => {
                  const alreadyAssessed = assessments.some(a => a.applicantId === app.id || a.applicantName === app.nama);
                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        setIsPickerModalOpen(false);
                        handleOpenAssessmentModal(app);
                      }}
                      style={{
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem' }}>{app.nama}</div>
                        <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '2px' }}>
                          {app.posisi} • <span style={{ color: '#94a3b8' }}>{app.project}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {alreadyAssessed ? (
                          <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                            ✓ Sudah Dinilai
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.06)', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                            Belum Dinilai
                          </span>
                        )}
                        <button
                          className="btn btn-primary btn-sm"
                          style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            padding: '4px 10px'
                          }}
                        >
                          Pilih & Nilai →
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
              <button onClick={() => setIsPickerModalOpen(false)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: FORM UPLOAD CV / TAMBAH PELAMAR                              */}
      {/* ===================================================================== */}
      {isApplicantModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.6rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={18} color="#10b981" />
                <span>{editingApplicant ? 'Edit Data Pelamar' : 'Upload CV / Tambah Pelamar Baru'}</span>
              </div>
              <button onClick={() => setIsApplicantModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveApplicant}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Lengkap Pelamar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bambang Triatmojo, S.T."
                    value={appForm.nama}
                    onChange={(e) => setAppForm({ ...appForm, nama: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Posisi / Lowongan Dilamar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Supervisor Sipil"
                    value={appForm.posisi}
                    onChange={(e) => setAppForm({ ...appForm, posisi: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>No. WhatsApp / HP *</label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={appForm.phone}
                    onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Pelamar</label>
                  <input
                    type="email"
                    placeholder="email@gmail.com"
                    value={appForm.email}
                    onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tanggal Melamar</label>
                  <input
                    type="date"
                    value={appForm.tanggalMelamar}
                    onChange={(e) => setAppForm({ ...appForm, tanggalMelamar: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Proyek / Penempatan</label>
                  <select
                    value={appForm.project}
                    onChange={(e) => setAppForm({ ...appForm, project: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park (Lokasi 1)</option>
                    <option value="Ashoka View">Ashoka View (Lokasi 2)</option>
                    <option value="Kantor Pusat Bizhub">Kantor Pusat Bizhub</option>
                  </select>
                </div>
              </div>

              {/* Upload CV / Dokumen */}
              <div style={{ marginBottom: '14px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px dashed #334155' }}>
                <label style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  📎 Upload Berkas CV / Portofolio (PDF, Doc, Gambar)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  style={{ fontSize: '0.8rem', color: '#94a3b8' }}
                />
                {appForm.files && appForm.files.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {appForm.files.map((f, i) => (
                      <div key={i} style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>📄 {f.name} ({f.size})</span>
                        <span style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => setAppForm({ ...appForm, files: appForm.files.filter((_, idx) => idx !== i) })}>✕</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Catatan Pengalaman / Ringkasan</label>
                <textarea
                  rows="3"
                  placeholder="Ringkasan pengalaman kerja, latar belakang pendidikan, dll..."
                  value={appForm.catatan}
                  onChange={(e) => setAppForm({ ...appForm, catatan: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button type="button" onClick={() => setIsApplicantModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.82rem' }}>
                  Simpan Berkas Pelamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: FORM ATUR JADWAL INTERVIEW                                   */}
      {/* ===================================================================== */}
      {isInterviewModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.6rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#10b981" />
                <span>{editingInterview ? 'Edit Jadwal Interview' : 'Atur Jadwal Wawancara Interview'}</span>
              </div>
              <button onClick={() => setIsInterviewModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveInterview}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Pilih Pelamar Terdaftar *</label>
                <select
                  value={intForm.applicantId}
                  onChange={(e) => {
                    const sel = applicants.find(a => a.id === e.target.value);
                    if (sel) {
                      setIntForm({
                        ...intForm,
                        applicantId: sel.id,
                        applicantName: sel.nama,
                        posisi: sel.posisi
                      });
                    }
                  }}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                >
                  <option value="">-- Pilih dari database pelamar --</option>
                  {applicants.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.nama} — {a.posisi} ({a.project})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Pelamar *</label>
                  <input
                    type="text"
                    required
                    value={intForm.applicantName}
                    onChange={(e) => setIntForm({ ...intForm, applicantName: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Posisi Lowongan *</label>
                  <input
                    type="text"
                    required
                    value={intForm.posisi}
                    onChange={(e) => setIntForm({ ...intForm, posisi: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tanggal Interview *</label>
                  <input
                    type="date"
                    required
                    value={intForm.tanggalInterview}
                    onChange={(e) => setIntForm({ ...intForm, tanggalInterview: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Jam Interview *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 10:00 - 11:30 WIB"
                    value={intForm.jamInterview}
                    onChange={(e) => setIntForm({ ...intForm, jamInterview: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Metode Wawancara</label>
                  <select
                    value={intForm.metode}
                    onChange={(e) => setIntForm({ ...intForm, metode: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="Offline di Kantor Pusat HO Bizhub">Offline di Kantor Pusat HO Bizhub</option>
                    <option value="Offline di Kantor Proyek Ashoka Park">Offline di Kantor Proyek Ashoka Park</option>
                    <option value="Offline di Kantor Pemasaran Ashoka View">Offline di Kantor Pemasaran Ashoka View</option>
                    <option value="Online via Google Meet / Zoom">Online via Google Meet / Zoom</option>
                    <option value="Wawancara Telepon">Wawancara Telepon</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Pewawancara (Interviewer)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Dodi Syaiful (HR) & Kholidin (Teknik)"
                    value={intForm.interviewer}
                    onChange={(e) => setIntForm({ ...intForm, interviewer: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Lokasi Ruangan / Tautan Link Meeting</label>
                <input
                  type="text"
                  placeholder="Contoh: Ruang Rapat Lt. 2 atau meet.google.com/xyz"
                  value={intForm.lokasiLink}
                  onChange={(e) => setIntForm({ ...intForm, lokasiLink: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Catatan / Instruksi Untuk Pelamar</label>
                <textarea
                  rows="2"
                  placeholder="Contoh: Bawa salinan portofolio asli, berpakaian formal..."
                  value={intForm.catatan}
                  onChange={(e) => setIntForm({ ...intForm, catatan: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button type="button" onClick={() => setIsInterviewModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.82rem' }}>
                  Simpan Jadwal Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: FORM PENILAIAN (PENILAI 1, 2, DAN 3 OPSIONAL)                */}
      {/* ===================================================================== */}
      {isAssessmentModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto', padding: '1.6rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#10b981" />
                <span>Formulir Hasil Penilaian: {asmForm.applicantName}</span>
              </div>
              <button onClick={() => setIsAssessmentModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAssessment}>
              {/* Header Box Info Pelamar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Kandidat Yang Dinilai:</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{asmForm.applicantName}</div>
                  <div style={{ fontSize: '0.76rem', color: '#34d399' }}>Posisi: {asmForm.posisi}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tanggal Evaluasi:</div>
                  <input
                    type="date"
                    value={asmForm.tanggalPenilaian}
                    onChange={(e) => setAsmForm({ ...asmForm, tanggalPenilaian: e.target.value })}
                    style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontWeight: 700, fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              {/* 1. PENILAI 1: HRD */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                  <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={16} /> 1. Penilai 1 (HRD / Tim Seleksi Utama)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Nama Penilai:</span>
                    <input
                      type="text"
                      value={asmForm.penilai1?.nama || ''}
                      onChange={(e) => setAsmForm({ ...asmForm, penilai1: { ...asmForm.penilai1, nama: e.target.value } })}
                      className="form-control"
                      style={{ height: '28px', fontSize: '0.74rem', width: '220px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', gap: '10px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Sikap & Etika (1-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={asmForm.penilai1?.sikap ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setAsmForm(prev => ({ ...prev, penilai1: { ...prev.penilai1, sikap: val } }));
                      }}
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Komunikasi (1-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={asmForm.penilai1?.komunikasi ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setAsmForm(prev => ({ ...prev, penilai1: { ...prev.penilai1, komunikasi: val } }));
                      }}
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Motivasi Kerja (1-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={asmForm.penilai1?.motivasi ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setAsmForm(prev => ({ ...prev, penilai1: { ...prev.penilai1, motivasi: val } }));
                      }}
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>Skor HRD (1-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={asmForm.penilai1?.skor ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setAsmForm(prev => ({ ...prev, penilai1: { ...prev.penilai1, skor: val } }));
                      }}
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.85rem', fontWeight: 800, borderColor: '#10b981' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Catatan & ulasan HRD mengenai kandidat..."
                    value={asmForm.penilai1?.catatan || ''}
                    onChange={(e) => setAsmForm({ ...asmForm, penilai1: { ...asmForm.penilai1, catatan: e.target.value } })}
                    className="form-control"
                    style={{ height: '32px', fontSize: '0.76rem' }}
                  />
                  <select
                    value={asmForm.penilai1?.rekomendasi}
                    onChange={(e) => setAsmForm({ ...asmForm, penilai1: { ...asmForm.penilai1, rekomendasi: e.target.value } })}
                    className="form-control"
                    style={{ height: '32px', fontSize: '0.76rem', fontWeight: 800 }}
                  >
                    <option value="Lolos">Lolos</option>
                    <option value="Pertimbangkan">Pertimbangkan</option>
                    <option value="Tidak Lolos">Tidak Lolos</option>
                  </select>
                </div>
              </div>

              {/* 2. PENILAI 2: USER / KEPALA DIVISI */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                  <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={16} /> 2. Penilai 2 (User / Kepala Divisi Terkait)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Nama Penilai:</span>
                    <input
                      type="text"
                      value={asmForm.penilai2?.nama || ''}
                      onChange={(e) => setAsmForm({ ...asmForm, penilai2: { ...asmForm.penilai2, nama: e.target.value } })}
                      className="form-control"
                      style={{ height: '28px', fontSize: '0.74rem', width: '220px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', gap: '10px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Keahlian Teknis (1-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={asmForm.penilai2?.kompetensiTeknis ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setAsmForm(prev => ({ ...prev, penilai2: { ...prev.penilai2, competencyTeknis: val } }));
                      }}
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Pengalaman Kerja (1-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={asmForm.penilai2?.pengalamanKerja ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setAsmForm(prev => ({ ...prev, penilai2: { ...prev.penilai2, pengalamanKerja: val } }));
                      }}
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Problem Solving (1-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={asmForm.penilai2?.problemSolving ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setAsmForm(prev => ({ ...prev, penilai2: { ...prev.penilai2, problemSolving: val } }));
                      }}
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>Skor User (1-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={asmForm.penilai2?.skor ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setAsmForm(prev => ({ ...prev, penilai2: { ...prev.penilai2, skor: val } }));
                      }}
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.85rem', fontWeight: 800, borderColor: '#10b981' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Catatan teknis dari kepala divisi terkait..."
                    value={asmForm.penilai2?.catatan || ''}
                    onChange={(e) => setAsmForm({ ...asmForm, penilai2: { ...asmForm.penilai2, catatan: e.target.value } })}
                    className="form-control"
                    style={{ height: '32px', fontSize: '0.76rem' }}
                  />
                  <select
                    value={asmForm.penilai2?.rekomendasi}
                    onChange={(e) => setAsmForm({ ...asmForm, penilai2: { ...asmForm.penilai2, rekomendasi: e.target.value } })}
                    className="form-control"
                    style={{ height: '32px', fontSize: '0.76rem', fontWeight: 800 }}
                  >
                    <option value="Lolos">Lolos</option>
                    <option value="Pertimbangkan">Pertimbangkan</option>
                    <option value="Tidak Lolos">Tidak Lolos</option>
                  </select>
                </div>
              </div>

              {/* 3. PENILAI 3: OPSIONAL DIREKSI / BOD */}
              <div style={{ background: asmForm.penilai3Enabled ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.01)', border: `1px solid ${asmForm.penilai3Enabled ? '#10b981' : '#1e293b'}`, borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: asmForm.penilai3Enabled ? '10px' : 0 }}>
                  <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={16} /> 3. Penilai 3 (Direksi / BOD / GM — Opsional)
                  </div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.76rem', color: '#f8fafc', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={asmForm.penilai3Enabled}
                      onChange={(e) => setAsmForm({ ...asmForm, penilai3Enabled: e.target.checked })}
                    />
                    <span>Aktifkan Penilai 3</span>
                  </label>
                </div>

                {asmForm.penilai3Enabled && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px', gap: '10px', marginBottom: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Nama Direksi / BOD</label>
                        <input
                          type="text"
                          value={asmForm.penilai3?.nama || ''}
                          onChange={(e) => setAsmForm({ ...asmForm, penilai3: { ...asmForm.penilai3, nama: e.target.value } })}
                          className="form-control"
                          style={{ height: '32px', fontSize: '0.76rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Kultur & Visi (1-100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={asmForm.penilai3?.kulturKarakter ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setAsmForm(prev => ({ ...prev, penilai3: { ...prev.penilai3, kulturKarakter: val } }));
                          }}
                          className="form-control"
                          style={{ height: '32px', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>Skor Direksi (1-100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={asmForm.penilai3?.skor ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setAsmForm(prev => ({ ...prev, penilai3: { ...prev.penilai3, skor: val } }));
                          }}
                          className="form-control"
                          style={{ height: '32px', fontSize: '0.85rem', fontWeight: 800, borderColor: '#10b981' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Arahan / catatan dari direksi..."
                        value={asmForm.penilai3?.catatan || ''}
                        onChange={(e) => setAsmForm({ ...asmForm, penilai3: { ...asmForm.penilai3, catatan: e.target.value } })}
                        className="form-control"
                        style={{ height: '32px', fontSize: '0.76rem' }}
                      />
                      <select
                        value={asmForm.penilai3?.rekomendasi}
                        onChange={(e) => setAsmForm({ ...asmForm, penilai3: { ...asmForm.penilai3, rekomendasi: e.target.value } })}
                        className="form-control"
                        style={{ height: '32px', fontSize: '0.76rem', fontWeight: 800 }}
                      >
                        <option value="Lolos">Lolos</option>
                        <option value="Pertimbangkan">Pertimbangkan</option>
                        <option value="Tidak Lolos">Tidak Lolos</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* RANGKUMAN & KEPUTUSAN AKHIR (LEBAR SELECT DIPERBESAR SEHINGGA TIDAK KEPOTONG) */}
              <div style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))', border: '1.5px solid #10b981', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 900, color: '#34d399', fontSize: '0.9rem' }}>
                    Keputusan & Rangkuman Hasil Evaluasi
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Rata-Rata Gabungan:</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#34d399', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 10px', borderRadius: '6px' }}>
                      {calculateAverageScore(asmForm)} / 100
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Keputusan Akhir:</label>
                    <select
                      value={asmForm.keputusanAkhir}
                      onChange={(e) => setAsmForm({ ...asmForm, keputusanAkhir: e.target.value })}
                      className="form-control"
                      style={{
                        height: '36px',
                        fontSize: '0.84rem',
                        fontWeight: 900,
                        padding: '0 0.65rem',
                        color: asmForm.keputusanAkhir === 'Lolos' ? '#10b981' : asmForm.keputusanAkhir === 'Dipertimbangkan' ? '#34d399' : '#ef4444'
                      }}
                    >
                      <option value="Lolos">Lolos (Siap Offering)</option>
                      <option value="Dipertimbangkan">Dipertimbangkan (Cadangan)</option>
                      <option value="Tidak Lolos">Tidak Lolos</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Catatan Rekomendasi HR/User:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Diteruskan untuk penerbitan offering letter..."
                      value={asmForm.catatanAkhir || ''}
                      onChange={(e) => setAsmForm({ ...asmForm, catatanAkhir: e.target.value })}
                      className="form-control"
                      style={{ height: '36px', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button type="button" onClick={() => setIsAssessmentModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  Tutup
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.82rem' }}>
                  Simpan Hasil Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: FORM BUAT / EDIT OFFERING LETTER & ON DUTY                   */}
      {/* ===================================================================== */}
      {isOfferingModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '1.6rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderTop: 'none', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#10b981" />
                <span>{editingOffering ? 'Edit Surat Penawaran Kerja' : 'Penerbitan Offering Letter & Jadwal On Duty'}</span>
              </div>
              <button onClick={() => setIsOfferingModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveOffering}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nomor Surat Resmi *</label>
                  <input
                    type="text"
                    required
                    value={offForm.noSurat}
                    onChange={(e) => setOffForm({ ...offForm, noSurat: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Pilih Pelamar Terdaftar</label>
                  <select
                    value={offForm.applicantId}
                    onChange={(e) => {
                      const sel = applicants.find(a => a.id === e.target.value);
                      if (sel) {
                        setOffForm({
                          ...offForm,
                          applicantId: sel.id,
                          applicantName: sel.nama,
                          posisi: sel.posisi,
                          penempatan: sel.project || 'Ashoka Park'
                        });
                      }
                    }}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="">-- Pilih dari database pelamar --</option>
                    {applicants.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nama} ({a.posisi})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nama Pelamar *</label>
                  <input
                    type="text"
                    required
                    value={offForm.applicantName}
                    onChange={(e) => setOffForm({ ...offForm, applicantName: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Posisi Jabatan Diterima *</label>
                  <input
                    type="text"
                    required
                    value={offForm.posisi}
                    onChange={(e) => setOffForm({ ...offForm, posisi: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* HIGHLIGHT: JADWAL ON DUTY */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1.5px solid #10b981', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Calendar size={14} /> Jadwal On Duty (Tanggal Mulai Kerja) *
                    </label>
                    <input
                      type="date"
                      required
                      value={offForm.jadwalOnDuty}
                      onChange={(e) => setOffForm({ ...offForm, jadwalOnDuty: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.86rem', fontWeight: 800, borderColor: '#10b981', background: '#090d16' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Lokasi Penempatan Proyek</label>
                    <select
                      value={offForm.penempatan}
                      onChange={(e) => setOffForm({ ...offForm, penempatan: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.84rem' }}
                    >
                      <option value="Ashoka Park (Lokasi 1)">Ashoka Park (Lokasi 1)</option>
                      <option value="Ashoka View (Lokasi 2)">Ashoka View (Lokasi 2)</option>
                      <option value="Kantor Pusat Bizhub">Kantor Pusat Bizhub</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Gaji Pokok (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={offForm.gajiPokok}
                    onChange={(e) => setOffForm({ ...offForm, gajiPokok: Number(e.target.value) })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tunjangan Tetap / Operasional (Rp)</label>
                  <input
                    type="number"
                    value={offForm.tunjangan}
                    onChange={(e) => setOffForm({ ...offForm, tunjangan: Number(e.target.value) })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Status Hubungan Kerja</label>
                  <select
                    value={offForm.statusKerja}
                    onChange={(e) => setOffForm({ ...offForm, statusKerja: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="PKWT (Kontrak 1 Tahun)">PKWT (Kontrak 1 Tahun)</option>
                    <option value="PKWT (Kontrak 6 Bulan)">PKWT (Kontrak 6 Bulan)</option>
                    <option value="Masa Percobaan (3 Bulan)">Masa Percobaan (3 Bulan)</option>
                    <option value="Karyawan Tetap (PKWTT)">Karyawan Tetap (PKWTT)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Status Surat Offering</label>
                  <select
                    value={offForm.statusOffering}
                    onChange={(e) => setOffForm({ ...offForm, statusOffering: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="Diterbitkan">Diterbitkan (Menunggu Konfirmasi)</option>
                    <option value="Diterima">Diterima (Accepted - Siap On Duty)</option>
                    <option value="Ditolak">Ditolak Pelamar</option>
                    <option value="Draf">Draf Internal</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Catatan / Keterangan Khusus</label>
                <textarea
                  rows="2"
                  placeholder="Catatan dokumen pendukung yang harus dibawa saat on duty..."
                  value={offForm.catatan}
                  onChange={(e) => setOffForm({ ...offForm, catatan: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <button type="button" onClick={() => setIsOfferingModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, fontSize: '0.82rem' }}>
                  Simpan & Terbitkan Offering Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: PRATINJAU DOKUMEN CV PELAMAR                                 */}
      {/* ===================================================================== */}
      {viewingDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '600px', padding: '1.6rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#10b981" />
                <span>Dokumen CV: {viewingDoc.app?.nama}</span>
              </div>
              <button onClick={() => setViewingDoc(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #1e293b', textAlign: 'center', marginBottom: '1.2rem' }}>
              <FileText size={48} color="#10b981" style={{ marginBottom: '8px', opacity: 0.8 }} />
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{viewingDoc.file?.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Ukuran Berkas: {viewingDoc.file?.size}</div>
              <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '6px', display: 'inline-block' }}>
                ✓ Berkas CV telah terverifikasi dalam sistem rekruitmen AMS Properti
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setViewingDoc(null)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 6: PRATINJAU & CETAK RESMI OFFERING LETTER                     */}
      {/* ===================================================================== */}
      {viewingOfferingDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '16px', width: '100%', maxWidth: '750px', maxHeight: '92vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            
            {/* Action Bar (Print & Close) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 800, fontSize: '0.9rem' }}>
                <Printer size={16} /> Pratinjau Surat Penawaran Kerja (Offering Letter)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Printer size={14} /> Cetak / Print PDF
                </button>
                <button onClick={() => setViewingOfferingDoc(null)} className="btn btn-secondary btn-sm">
                  <X size={14} /> Tutup
                </button>
              </div>
            </div>

            {/* KERTAS SURAT RESMI (OFFERING LETTER TEMPLATE) */}
            <div style={{ background: '#ffffff', color: '#0f172a', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', fontFamily: 'Arial, sans-serif', fontSize: '0.86rem', lineHeight: 1.6 }}>
              {/* Kop Surat Resmi */}
              <div style={{ textAlign: 'center', borderBottom: '2.5px solid #0f172a', paddingBottom: '12px', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#047857' }}>
                  PT PERSADA NUSANTARA INDONESIA
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>
                  ASHOKA PARK & ASHOKA VIEW RESIDENCE
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  Kantor Pusat: Bizhub Commercial Estate Blok B-12, Gunung Sindur, Bogor | Telp: (021) 8990-2134
                </div>
              </div>

              {/* Header Info Surat */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.82rem' }}>
                <div>
                  <div><strong>Nomor:</strong> {viewingOfferingDoc.noSurat}</div>
                  <div><strong>Perihal:</strong> Surat Penawaran Kerja (Job Offer Letter)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>Bogor, {formatDisplayDate(viewingOfferingDoc.tanggalOffering)}</div>
                </div>
              </div>

              {/* Penerima */}
              <div style={{ marginBottom: '1.2rem' }}>
                <div>Kepada Yth.</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{viewingOfferingDoc.applicantName}</div>
                <div>Di Tempat</div>
              </div>

              {/* Pembuka */}
              <p style={{ margin: '0 0 10px 0' }}>
                Dengan hormat,
              </p>
              <p style={{ margin: '0 0 12px 0' }}>
                Sehubungan dengan rangkaian proses evaluasi dan wawancara yang telah Anda ikuti, Manajemen <strong>PT Persada Nusantara Indonesia</strong> dengan ini bermaksud menawarkan posisi kerja kepada Anda dengan rincian kesepakatan sebagai berikut:
              </p>

              {/* Tabel Rincian Penawaran */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.2rem', fontSize: '0.82rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, width: '220px', color: '#475569' }}>Posisi / Jabatan</td>
                    <td style={{ padding: '6px 8px', fontWeight: 800, color: '#0f172a' }}>: {viewingOfferingDoc.posisi}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#475569' }}>Lokasi Penempatan</td>
                    <td style={{ padding: '6px 8px', fontWeight: 800, color: '#0f172a' }}>: {viewingOfferingDoc.penempatan}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#ecfdf5' }}>
                    <td style={{ padding: '8px', fontWeight: 900, color: '#047857' }}>Jadwal On Duty (Mulai Kerja)</td>
                    <td style={{ padding: '8px', fontWeight: 900, color: '#047857' }}>: {formatDisplayDate(viewingOfferingDoc.jadwalOnDuty)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#475569' }}>Status Hubungan Kerja</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a' }}>: {viewingOfferingDoc.statusKerja}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#475569' }}>Gaji Pokok</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a' }}>: {formatRupiah(viewingOfferingDoc.gajiPokok)} / bulan</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#475569' }}>Tunjangan Tetap / Operasional</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a' }}>: {formatRupiah(viewingOfferingDoc.tunjangan)} / bulan</td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid #0f172a', background: '#f8fafc' }}>
                    <td style={{ padding: '8px', fontWeight: 900, color: '#0f172a' }}>Total Kompensasi Bulanan</td>
                    <td style={{ padding: '8px', fontWeight: 900, color: '#047857' }}>: {formatRupiah(Number(viewingOfferingDoc.gajiPokok) + Number(viewingOfferingDoc.tunjangan))} / bulan</td>
                  </tr>
                </tbody>
              </table>

              <p style={{ margin: '0 0 10px 0' }}>
                Mohon untuk memberikan konfirmasi penerimaan surat penawaran ini selambat-lambatnya pada tanggal <strong>{formatDisplayDate(viewingOfferingDoc.batasKonfirmasi)}</strong> dengan menandatangani dokumen ini.
              </p>

              {/* Tanda Tangan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2.5rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Pemberi Penawaran:</div>
                  <div style={{ fontWeight: 800, marginTop: '2px' }}>PT PERSADA NUSANTARA INDONESIA</div>
                  <div style={{ height: '55px' }}></div>
                  <div style={{ fontWeight: 800, textDecoration: 'underline' }}>Dodi Syaiful Nugroho</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Head of HR & General Affair</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Kandidat yang Menyetujui:</div>
                  <div style={{ fontWeight: 800, marginTop: '2px' }}>Calon Karyawan</div>
                  <div style={{ height: '55px' }}></div>
                  <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{viewingOfferingDoc.applicantName}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Tanda Tangan & Tanggal</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
