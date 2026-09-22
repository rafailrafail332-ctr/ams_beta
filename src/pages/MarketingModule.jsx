import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fetchCloudStore, saveCloudStore } from '../supabase';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  UserPlus,
  Phone,
  MapPin,
  FileCheck,
  Target, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  X,
  Sparkles,
  ArrowUpRight,
  Printer,
  FileText,
  Building2,
  Check,
  Award,
  ShieldCheck,
  Upload,
  Eye,
  FileCheck2,
  Download,
  Lock,
  MessageSquare,
  PhoneCall,
  Tag,
  PieChart,
  Briefcase,
  ChevronRight,
  Send,
  Trash2
} from 'lucide-react';

const STORAGE_KEY_DB_KONSUMEN = 'ams_teknik_db_konsumen_v1';
const STORAGE_KEY_DB_CALON_KONSUMEN = 'ams_teknik_db_calon_konsumen_v1';

const initialDbKonsumen = [
  {
    id: 'KNS-001',
    nama: 'Budi Santoso',
    noHp: '0812-9988-7766',
    nik: '3374102908850003',
    npwp: '09.254.341.2-508.000',
    alamat: 'Jl. Pemuda No. 142, Semarang Tengah',
    referensi: 'Pameran Mall Ciputra',
    ktpFile: 'uploaded',
    ktpFileName: 'ktp_budi_santoso.pdf'
  },
  {
    id: 'KNS-002',
    nama: 'Siti Rahmawati',
    noHp: '0813-1122-3344',
    nik: '3374025501900001',
    npwp: '12.876.432.1-508.000',
    alamat: 'Jl. Gajahmada No. 88, Semarang',
    referensi: 'Brosur Marketing',
    ktpFile: null,
    ktpFileName: ''
  },
  {
    id: 'KNS-003',
    nama: 'Dr. Ahmad Fauzi',
    noHp: '0857-4455-6677',
    nik: '3374081203780004',
    npwp: '45.678.901.2-508.000',
    alamat: 'Jl. Pandanaran No. 25, Semarang',
    referensi: 'Referral Dokter Teman',
    ktpFile: 'uploaded',
    ktpFileName: 'ktp_dr_ahmad_fauzi.jpg'
  },
  {
    id: 'KNS-004',
    nama: 'Ibu Ratna Pertiwi',
    noHp: '0813-8877-6655',
    nik: '3374116209870002',
    npwp: '78.901.234.5-508.000',
    alamat: 'Jl. Majapahit No. 50, Semarang Timur',
    referensi: 'Walk-In Customer',
    ktpFile: null,
    ktpFileName: ''
  }
];

const initialDbCalonKonsumen = [
  {
    id: 'CLK-001',
    nama: 'Bpk. Hendra Kurniawan',
    noHp: '0812-3344-5566',
    domisili: 'Semarang Barat',
    referensi: 'Instagram Ads'
  },
  {
    id: 'CLK-002',
    nama: 'Ibu Dewi Sartika',
    noHp: '0858-7788-9900',
    domisili: 'Ungaran Barat, Kab. Semarang',
    referensi: 'Spanduk Gerbang Perumahan'
  },
  {
    id: 'CLK-003',
    nama: 'Bpk. Agus Setiawan',
    noHp: '0857-1122-3344',
    domisili: 'Pedurungan, Semarang',
    referensi: 'Facebook Ads'
  },
  {
    id: 'CLK-004',
    nama: 'Dr. Maya Indah',
    noHp: '0811-9988-7711',
    domisili: 'Banyumanik, Semarang',
    referensi: 'Referral Konsumen'
  }
];

export const MarketingModule = () => {
  const { currentUser, activeSubTab, setActiveSubTab, showNotification } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSales, setEditingSales] = useState(null);

  // Hidden File Input Ref for Device SPR Upload (.pdf, .jpg, .png)
  const sprFileInputRef = useRef(null);
  const [activeUploadTargetId, setActiveUploadTargetId] = useState(null);

  // Active Tab Control (leads, spr, konsumen, calon_konsumen)
  const currentSubView = 
    activeSubTab === 'spr' ? 'spr' :
    activeSubTab === 'konsumen' ? 'konsumen' :
    activeSubTab === 'calon_konsumen' ? 'calon_konsumen' :
    'leads';

  // -------------------------------------------------------------
  // DATA BASE KONSUMEN & CALON KONSUMEN STORE
  // -------------------------------------------------------------
  const [databaseKonsumenRows, setDatabaseKonsumenRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_KONSUMEN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialDbKonsumen;
  });

  const [databaseCalonKonsumenRows, setDatabaseCalonKonsumenRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_CALON_KONSUMEN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialDbCalonKonsumen;
  });

  // Cloud Sync for Konsumen & Calon Konsumen
  useEffect(() => {
    fetchCloudStore(STORAGE_KEY_DB_KONSUMEN, null).then(val => {
      if (val !== null && val !== undefined && Array.isArray(val)) setDatabaseKonsumenRows(val);
    });
    fetchCloudStore(STORAGE_KEY_DB_CALON_KONSUMEN, null).then(val => {
      if (val !== null && val !== undefined && Array.isArray(val)) setDatabaseCalonKonsumenRows(val);
    });

    const interval = setInterval(() => {
      fetchCloudStore(STORAGE_KEY_DB_KONSUMEN, null).then(val => {
        if (val !== null && val !== undefined && Array.isArray(val)) setDatabaseKonsumenRows(val);
      });
      fetchCloudStore(STORAGE_KEY_DB_CALON_KONSUMEN, null).then(val => {
        if (val !== null && val !== undefined && Array.isArray(val)) setDatabaseCalonKonsumenRows(val);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateAndSaveKonsumen = (nextList, notifText = '', notifType = 'success') => {
    setDatabaseKonsumenRows(nextList);
    try {
      localStorage.setItem(STORAGE_KEY_DB_KONSUMEN, JSON.stringify(nextList));
    } catch (e) {}
    saveCloudStore(STORAGE_KEY_DB_KONSUMEN, nextList).catch(() => {});
    if (notifText) showNotification(notifText, notifType);
  };

  const updateAndSaveCalonKonsumen = (nextList, notifText = '', notifType = 'success') => {
    setDatabaseCalonKonsumenRows(nextList);
    try {
      localStorage.setItem(STORAGE_KEY_DB_CALON_KONSUMEN, JSON.stringify(nextList));
    } catch (e) {}
    saveCloudStore(STORAGE_KEY_DB_CALON_KONSUMEN, nextList).catch(() => {});
    if (notifText) showNotification(notifText, notifType);
  };

  // State: Modal & Form Data Konsumen
  const [searchDbKonsumen, setSearchDbKonsumen] = useState('');
  const [isKonsumenModalOpen, setIsKonsumenModalOpen] = useState(false);
  const [editingKonsumenId, setEditingKonsumenId] = useState(null);
  const [konsumenFormData, setKonsumenFormData] = useState({
    nama: '',
    noHp: '',
    nik: '',
    npwp: '',
    alamat: '',
    referensi: '',
    ktpFile: null,
    ktpFileName: ''
  });

  // State: Modal & Form Data Calon Konsumen
  const [searchDbCalonKonsumen, setSearchDbCalonKonsumen] = useState('');
  const [isCalonKonsumenModalOpen, setIsCalonKonsumenModalOpen] = useState(false);
  const [editingCalonKonsumenId, setEditingCalonKonsumenId] = useState(null);
  const [calonKonsumenFormData, setCalonKonsumenFormData] = useState({
    nama: '',
    noHp: '',
    domisili: '',
    referensi: ''
  });

  // Handlers for Konsumen
  const handleOpenAddKonsumen = () => {
    setEditingKonsumenId(null);
    setKonsumenFormData({
      nama: '',
      noHp: '',
      nik: '',
      npwp: '',
      alamat: '',
      referensi: '',
      ktpFile: null,
      ktpFileName: ''
    });
    setIsKonsumenModalOpen(true);
  };

  const handleOpenEditKonsumen = (row) => {
    setEditingKonsumenId(row.id);
    setKonsumenFormData({
      nama: row.nama || '',
      noHp: row.noHp || '',
      nik: row.nik || '',
      npwp: row.npwp || '',
      alamat: row.alamat || '',
      referensi: row.referensi || '',
      ktpFile: row.ktpFile || null,
      ktpFileName: row.ktpFileName || ''
    });
    setIsKonsumenModalOpen(true);
  };

  const handleSaveKonsumen = (e) => {
    e.preventDefault();
    if (!konsumenFormData.nama.trim()) {
      showNotification('Nama konsumen wajib diisi!', 'warning');
      return;
    }
    if (editingKonsumenId) {
      const nextList = databaseKonsumenRows.map(k => k.id === editingKonsumenId ? { ...k, ...konsumenFormData } : k);
      updateAndSaveKonsumen(nextList, `Data Konsumen "${konsumenFormData.nama}" berhasil diperbarui!`, 'success');
    } else {
      const newK = {
        id: `KNS-${Date.now().toString().slice(-4)}`,
        ...konsumenFormData
      };
      updateAndSaveKonsumen([newK, ...databaseKonsumenRows], `Konsumen "${konsumenFormData.nama}" berhasil didaftarkan!`, 'success');
    }
    setIsKonsumenModalOpen(false);
  };

  const handleDeleteKonsumen = (id, name) => {
    if (window.confirm(`Hapus Konsumen "${name}"?`)) {
      const nextList = databaseKonsumenRows.filter(k => k.id !== id);
      updateAndSaveKonsumen(nextList, `Konsumen "${name}" berhasil dihapus.`, 'warning');
    }
  };

  // Handlers for Calon Konsumen
  const handleOpenAddCalonKonsumen = () => {
    setEditingCalonKonsumenId(null);
    setCalonKonsumenFormData({
      nama: '',
      noHp: '',
      domisili: '',
      referensi: ''
    });
    setIsCalonKonsumenModalOpen(true);
  };

  const handleOpenEditCalonKonsumen = (row) => {
    setEditingCalonKonsumenId(row.id);
    setCalonKonsumenFormData({
      nama: row.nama || '',
      noHp: row.noHp || '',
      domisili: row.domisili || '',
      referensi: row.referensi || ''
    });
    setIsCalonKonsumenModalOpen(true);
  };

  const handleSaveCalonKonsumen = (e) => {
    e.preventDefault();
    if (!calonKonsumenFormData.nama.trim()) {
      showNotification('Nama calon konsumen wajib diisi!', 'warning');
      return;
    }
    if (editingCalonKonsumenId) {
      const nextList = databaseCalonKonsumenRows.map(c => c.id === editingCalonKonsumenId ? { ...c, ...calonKonsumenFormData } : c);
      updateAndSaveCalonKonsumen(nextList, `Data Calon Konsumen "${calonKonsumenFormData.nama}" berhasil diperbarui!`, 'success');
    } else {
      const newC = {
        id: `CLK-${Date.now().toString().slice(-4)}`,
        ...calonKonsumenFormData
      };
      updateAndSaveCalonKonsumen([newC, ...databaseCalonKonsumenRows], `Calon Konsumen "${calonKonsumenFormData.nama}" berhasil didaftarkan!`, 'success');
    }
    setIsCalonKonsumenModalOpen(false);
  };

  const handleDeleteCalonKonsumen = (id, name) => {
    if (window.confirm(`Hapus Calon Konsumen "${name}"?`)) {
      const nextList = databaseCalonKonsumenRows.filter(c => c.id !== id);
      updateAndSaveCalonKonsumen(nextList, `Calon Konsumen "${name}" berhasil dihapus.`, 'warning');
    }
  };

  const handleOpenWACustomer = (phone, name) => {
    const phoneNum = phone ? phone.replace(/[^0-9]/g, '') : '';
    if (!phoneNum) {
      showNotification('Nomor telepon belum diisi!', 'warning');
      return;
    }
    const cleanNum = phoneNum.startsWith('0') ? '62' + phoneNum.slice(1) : phoneNum;
    const msg = `Halo Bapak/Ibu ${name},\n\nTerima kasih telah mempercayakan hunian Anda kepada Ashoka. Apakah ada yang bisa kami bantu hari ini? 😊`;
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // -------------------------------------------------------------
  // CRM LEADS & KOMISI SALES TRACKER STORE
  // -------------------------------------------------------------
  const initialLeads = [
    {
      id: 'LEAD-001',
      customerName: 'Drs. Hendra Wijaya',
      phone: '0812-3456-7890',
      unitInterest: 'Cluster Emerald - Unit A-01 (Tipe 45/90)',
      budget: 650000000,
      source: 'Instagram Ads',
      salesPerson: 'Yulieka Rachmawati, S.Si (Head Marketing)',
      commissionPct: 2.5,
      stage: 'Prospect Hot (SP3K)',
      notes: 'SP3K KPR Mandiri sudah disetujui, janji akad akhir bulan.',
      createdDate: '2025-08-05',
      commissionStatus: 'Pending ACC Finance'
    },
    {
      id: 'LEAD-002',
      customerName: 'Ibu Ratna Pertiwi',
      phone: '0813-8877-6655',
      unitInterest: 'Cluster Sapphire - Unit B-02 (Tipe 60/120)',
      budget: 850000000,
      source: 'Walk-In Customer',
      salesPerson: 'Fresda Destifani (Marketing Staf)',
      commissionPct: 2.5,
      stage: 'Closed Sold',
      notes: 'Pencairan KPR Selesai. Unit diserahterimakan.',
      createdDate: '2025-07-15',
      commissionStatus: 'Cair Rekening Sales'
    },
    {
      id: 'LEAD-003',
      customerName: 'Bpk. Agus Setiawan',
      phone: '0857-1122-3344',
      unitInterest: 'Cluster Emerald - Unit A-08 (Tipe 45/90)',
      budget: 670000000,
      source: 'Facebook Ads',
      salesPerson: 'Bambang Hermawan (Marketing Staf)',
      commissionPct: 2.5,
      stage: 'Survey Site',
      notes: 'Janji ketemu di rumah contoh hari Sabtu jam 10 pagi.',
      createdDate: '2025-08-18',
      commissionStatus: 'Estimasi Prospek'
    },
    {
      id: 'LEAD-004',
      customerName: 'Dr. Maya Indah',
      phone: '0811-9988-7711',
      unitInterest: 'Cluster Emerald - Unit A-03 (Tipe 45/90)',
      budget: 650000000,
      source: 'Referral Konsumen',
      salesPerson: 'Amanda Chesyarini (Marketing Staf)',
      commissionPct: 2.5,
      stage: 'Booking Fee SPR',
      notes: 'Booking fee Rp 10 Juta lunas via transfer BCA.',
      createdDate: '2025-08-12',
      commissionStatus: 'Proses Verifikasi Finance'
    }
  ];

  const getSavedLeads = () => {
    try {
      const saved = localStorage.getItem('ams_crm_leads_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialLeads;
  };

  const [leadsList, setLeadsList] = useState(getSavedLeads);

  useEffect(() => {
    try {
      localStorage.setItem('ams_crm_leads_v2', JSON.stringify(leadsList));
    } catch (e) {}
  }, [leadsList]);

  // Modal State for Adding Lead
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leadFormData, setLeadFormData] = useState({
    customerName: '',
    phone: '',
    unitInterest: 'Cluster Emerald - Unit A-01 (Tipe 45/90)',
    budget: 650000000,
    source: 'Instagram Ads',
    salesPerson: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Yulieka Rachmawati, S.Si (Head Marketing)',
    commissionPct: 2.5,
    stage: 'Lead Baru (Cold)',
    notes: ''
  });

  // SPR Print & Edit Modal State
  const [isSprModalOpen, setIsSprModalOpen] = useState(false);
  const [sprFormData, setSprFormData] = useState({
    sprNumber: 'SPR/ASHOKA/2025/08/001',
    bookingDate: new Date().toISOString().split('T')[0],
    customerName: 'Budi Santoso',
    customerNik: '3374102908850003',
    customerPhone: '0812-9988-7766',
    customerAddress: 'Jl. Pemuda No. 142, Semarang Tengah, Kota Semarang',
    customerJob: 'Wiraswasta / Pengusaha',
    unitNo: 'A-01',
    cluster: 'Cluster Emerald',
    unitType: 'Tipe 45/90 (Standard Emerald)',
    hargaJual: 650000000,
    diskonPromo: 10000000,
    bookingFee: 10000000,
    uangMukaDp: 65000000,
    sisaPlafondKpr: 575000000,
    skemaBayar: 'KPR Bank Mandiri (Plafond Rp 575 Juta)',
    salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
    directorName: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)'
  });

  // Modal State for Viewing Uploaded SPR Document
  const [isViewUploadedSprModalOpen, setIsViewUploadedSprModalOpen] = useState(false);
  const [selectedSprViewItem, setSelectedSprViewItem] = useState(null);

  // Initial Sales & Marketing Data with Uploaded SPR Files Store
  const initialSalesData = [
    {
      id: 'SLS-001',
      unitNo: 'A-01',
      cluster: 'Cluster Emerald',
      customerName: 'Budi Santoso',
      customerPhone: '0812-9988-7766',
      salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
      hargaUnit: 650000000,
      bookingFee: 10000000,
      status: 'Closed / Sold',
      bookingDate: '2025-01-05',
      notes: 'Lunas Booking Fee & DP 10%',
      sprFileUrl: null,
      sprFileType: null,
      sprFileName: null,
      sprUploadDate: null,
      sprUploadedBy: null
    },
    {
      id: 'SLS-002',
      unitNo: 'A-02',
      cluster: 'Cluster Emerald',
      customerName: 'Siti Rahmawati',
      customerPhone: '0813-1122-3344',
      salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
      hargaUnit: 670000000,
      bookingFee: 10000000,
      status: 'Booking / SPR',
      bookingDate: '2025-01-20',
      notes: 'Pengajuan SP3K KPR BCA',
      sprFileUrl: null,
      sprFileType: null,
      sprFileName: null,
      sprUploadDate: null,
      sprUploadedBy: null
    },
    {
      id: 'SLS-003',
      unitNo: 'B-05',
      cluster: 'Cluster Sapphire',
      customerName: 'Dr. Ahmad Fauzi',
      customerPhone: '0857-4455-6677',
      salesPerson: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)',
      hargaUnit: 890000000,
      bookingFee: 15000000,
      status: 'Booking / SPR',
      bookingDate: '2025-03-10',
      notes: 'Skema Cash Bertahap 12x',
      sprFileUrl: null,
      sprFileType: null,
      sprFileName: null,
      sprUploadDate: null,
      sprUploadedBy: null
    }
  ];

  const getSavedSalesList = () => {
    try {
      const saved = localStorage.getItem('ams_sales_list_clean_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialSalesData;
  };

  const [salesList, setSalesList] = useState(getSavedSalesList);

  useEffect(() => {
    try {
      localStorage.setItem('ams_sales_list_clean_v1', JSON.stringify(salesList));
    } catch (e) {}
  }, [salesList]);

  // Form State for Sales Item
  const [formData, setFormData] = useState({
    unitNo: '',
    cluster: 'Cluster Emerald',
    customerName: '',
    customerPhone: '',
    salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
    hargaUnit: 650000000,
    bookingFee: 10000000,
    status: 'Prospek Hot',
    bookingDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Handle Direct Local SPR File Upload (.pdf, .jpg, .png)
  const handleSprFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeUploadTargetId) {
      const reader = new FileReader();
      const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

      reader.onloadend = () => {
        setSalesList((prev) =>
          prev.map((item) => {
            if (item.id === activeUploadTargetId) {
              return {
                ...item,
                sprFileUrl: reader.result,
                sprFileType: file.type,
                sprFileName: file.name,
                sprUploadDate: `${new Date().toISOString().split('T')[0]} ${timeNow}`,
                sprUploadedBy: `${currentUser?.name || 'Staf Marketing'} (${currentUser?.role || 'Staf'})`
              };
            }
            return item;
          })
        );
        showNotification(`DOKUMEN SPR TER-UPLOAD! Berkas "${file.name}" berhasil diunggah oleh Staf & tersimpan untuk seluruh pihak berkepentingan (Legal, Finance, Direksi).`);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const triggerUploadForSales = (id) => {
    setActiveUploadTargetId(id);
    if (sprFileInputRef.current) {
      sprFileInputRef.current.click();
    }
  };

  // -------------------------------------------------------------
  // CRM LEADS HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddLead = () => {
    setEditingLead(null);
    setLeadFormData({
      customerName: '',
      phone: '',
      unitInterest: 'Cluster Emerald - Unit A-01 (Tipe 45/90)',
      budget: 650000000,
      source: 'Instagram Ads',
      salesPerson: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Yulieka Rachmawati, S.Si (Head Marketing)',
      commissionPct: 2.5,
      stage: 'Lead Baru (Cold)',
      notes: ''
    });
    setIsLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead) => {
    setEditingLead(lead);
    setLeadFormData({
      customerName: lead.customerName,
      phone: lead.phone,
      unitInterest: lead.unitInterest,
      budget: lead.budget,
      source: lead.source,
      salesPerson: lead.salesPerson,
      commissionPct: lead.commissionPct || 2.5,
      stage: lead.stage,
      notes: lead.notes || ''
    });
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (e) => {
    e.preventDefault();
    if (editingLead) {
      setLeadsList((prev) =>
        prev.map((l) => (l.id === editingLead.id ? { ...l, ...leadFormData } : l))
      );
      showNotification(`PROSPEK LEAD DIPERBARUI! Data ${leadFormData.customerName} tersimpan.`);
    } else {
      const newLead = {
        id: `LEAD-00${leadsList.length + 1}`,
        ...leadFormData,
        createdDate: new Date().toISOString().split('T')[0],
        commissionStatus: leadFormData.stage === 'Closed Sold' ? 'Pending ACC Finance' : 'Estimasi Prospek'
      };
      setLeadsList([newLead, ...leadsList]);
      showNotification(`LEAD PROSPEK BARU DITAMBAHKAN! Prospek ${leadFormData.customerName} masuk ke pipeline CRM Sales.`);
    }
    setIsLeadModalOpen(false);
  };

  const handleClaimCommission = (lead) => {
    const nominal = Math.round(lead.budget * ((lead.commissionPct || 2.5) / 100));
    setLeadsList((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, commissionStatus: 'Cair Rekening Sales (ACC Finance)' } : l))
    );
    showNotification(`KLAIM KOMISI DIKIRIM! Komisi Rp ${new Intl.NumberFormat('id-ID').format(nominal)} (Unit ${lead.unitInterest}) diteruskan ke Direksi & Finance untuk dicairkan ke ${lead.salesPerson}.`);
  };

  const handleDeleteLead = (id, name) => {
    if (window.confirm(`Hapus data prospek lead ${name}?`)) {
      setLeadsList(prev => prev.filter(l => l.id !== id));
      showNotification(`Prospek ${name} berhasil dihapus.`, 'warning');
    }
  };

  const handleDeleteSale = (id, unitNo) => {
    if (window.confirm(`Hapus data transaksi penjualan unit ${unitNo}?`)) {
      setSalesList(prev => prev.filter(s => s.id !== id));
      showNotification(`Data transaksi unit ${unitNo} berhasil dihapus.`, 'warning');
    }
  };

  const handleOpenWALeadTracker = (lead) => {
    const phoneNum = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '6281234567890';
    let msgText = `Halo Kak ${lead.customerName},\n\nTerima kasih telah menanyakan informasi hunian idaman di Ashoka (${lead.unitInterest}).\n\nApakah Kakak ada waktu luang minggu ini untuk cek lokasi (survey site) dan konsultasi simulasi angsuran KPR dengan kami? Hubungi kami kapan saja ya Kak! 😊`;
    
    if (lead.stage.includes('Closed')) {
      msgText = `Selamat Kak ${lead.customerName}! Unit hunian ${lead.unitInterest} di Ashoka telah resmi Akad & Terjadwal Serah Terima. Terima kasih telah mempercayakan hunian impian Anda kepada kami! 🎉`;
    } else if (lead.stage.includes('Booking')) {
      msgText = `Halo Kak ${lead.customerName},\n\nTerima kasih! Pembayaran Booking Fee & Surat Pesanan Rumah (SPR) untuk unit ${lead.unitInterest} telah kami terima & diverifikasi oleh manajemen Ashoka.`;
    }

    const encoded = encodeURIComponent(msgText);
    window.open(`https://wa.me/${phoneNum}?text=${encoded}`, '_blank');
  };

  // -------------------------------------------------------------
  // SALES ITEM HANDLERS (SPR)
  // -------------------------------------------------------------
  const handleOpenAdd = () => {
    setEditingSales(null);
    setFormData({
      unitNo: '',
      cluster: 'Cluster Emerald',
      customerName: '',
      customerPhone: '',
      salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
      hargaUnit: 650000000,
      bookingFee: 10000000,
      status: 'Prospek Hot',
      bookingDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingSales(item);
    setFormData({
      unitNo: item.unitNo,
      cluster: item.cluster,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      salesPerson: item.salesPerson,
      hargaUnit: item.hargaUnit,
      bookingFee: item.bookingFee,
      status: item.status,
      bookingDate: item.bookingDate,
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveSales = (e) => {
    e.preventDefault();
    if (!formData.unitNo || !formData.customerName) {
      showNotification('Nomor unit dan nama konsumen wajib diisi!', 'warning');
      return;
    }

    if (editingSales) {
      setSalesList((prev) =>
        prev.map((s) => (s.id === editingSales.id ? { ...s, ...formData } : s))
      );
      showNotification(`Data Penjualan Unit ${formData.unitNo} berhasil diperbarui!`);
    } else {
      const newItem = {
        ...formData,
        id: `SLS-00${salesList.length + 1}`,
        sprFileUrl: null,
        sprFileName: null,
        sprUploadDate: null,
        sprUploadedBy: null
      };
      setSalesList([newItem, ...salesList]);
      showNotification(`Transaksi/Prospek Penjualan Unit ${formData.unitNo} berhasil dibuat!`);
    }
    setIsModalOpen(false);
  };

  const handleOpenSprModal = (item) => {
    const netPrice = item.hargaUnit || 650000000;
    const dpVal = Math.round(netPrice * 0.1);
    const kprVal = netPrice - dpVal;

    setSprFormData({
      sprNumber: `SPR/ASHOKA/2025/${item.unitNo.replace('-', '')}/${Math.floor(100 + Math.random() * 900)}`,
      bookingDate: item.bookingDate || new Date().toISOString().split('T')[0],
      customerName: item.customerName || 'Budi Santoso',
      customerNik: '3374102908850003',
      customerPhone: item.customerPhone || '0812-9988-7766',
      customerAddress: 'Jl. Pemuda No. 142, Semarang Tengah, Kota Semarang',
      customerJob: 'Wiraswasta / Swasta',
      unitNo: item.unitNo,
      cluster: item.cluster || 'Cluster Emerald',
      unitType: `Tipe 45/90 (${item.cluster})`,
      hargaJual: netPrice,
      diskonPromo: 10000000,
      bookingFee: item.bookingFee || 10000000,
      uangMukaDp: dpVal,
      sisaPlafondKpr: kprVal,
      skemaBayar: `KPR Bank Mitra (Plafond Rp ${new Intl.NumberFormat('id-ID').format(kprVal)})`,
      salesPerson: item.salesPerson || 'Yulieka Rachmawati, S.Si (Head Marketing)',
      directorName: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)'
    });
    setIsSprModalOpen(true);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Calculations for Commission Tracker
  const totalLeadsValue = leadsList.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const totalCommissionPotential = leadsList.reduce((acc, curr) => acc + Math.round((curr.budget || 0) * ((curr.commissionPct || 2.5) / 100)), 0);
  const totalCommissionCair = leadsList
    .filter(l => l.commissionStatus.includes('Cair'))
    .reduce((acc, curr) => acc + Math.round((curr.budget || 0) * ((curr.commissionPct || 2.5) / 100)), 0);

  const filteredLeads = leadsList.filter((l) => {
    const matchesSearch =
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.unitInterest.toLowerCase().includes(search.toLowerCase()) ||
      l.salesPerson.toLowerCase().includes(search.toLowerCase());
    const matchesStage = statusFilter === 'All' || l.stage === statusFilter;
    return matchesSearch && matchesStage;
  });

  const filteredSales = salesList.filter((s) => {
    const matchesSearch =
      s.unitNo.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.salesPerson.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOmzet = salesList.reduce((acc, curr) => acc + (curr.status === 'Closed / Sold' ? curr.hargaUnit : 0), 0);

  return (
    <div>
      {/* Hidden File Input for Device SPR File Upload */}
      <input
        type="file"
        ref={sprFileInputRef}
        accept=".pdf,image/*"
        style={{ display: 'none' }}
        onChange={handleSprFileUpload}
      />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Marketing & Sales</h1>
          <p className="page-subtitle">Pipeline CRM Prospek Leads, Tracker Komisi Sales (2.5%), Dokumen SPR, & Data Base Konsumen.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {currentSubView === 'leads' && (
            <button className="btn btn-primary" onClick={handleOpenAddLead}>
              <Plus size={16} /> Tambah Lead Prospek Baru
            </button>
          )}
          {currentSubView === 'spr' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} /> Input Transaksi Penjualan
            </button>
          )}
          {currentSubView === 'konsumen' && (
            <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#000000', fontWeight: 900 }} onClick={handleOpenAddKonsumen}>
              <Plus size={16} /> + Tambah Konsumen Baru
            </button>
          )}
          {currentSubView === 'calon_konsumen' && (
            <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', border: 'none', color: '#ffffff', fontWeight: 900 }} onClick={handleOpenAddCalonKonsumen}>
              <Plus size={16} /> + Tambah Calon Konsumen
            </button>
          )}
        </div>
      </div>

      {/* SUB-MODULE TABS NAVIGATION */}
      <div className="tab-list" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          className={`tab-item ${currentSubView === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('leads')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
        >
          <Users size={16} /> 1. Pipeline CRM Leads & Komisi Sales Tracker
        </button>
        <button
          className={`tab-item ${currentSubView === 'spr' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('spr')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
        >
          <FileText size={16} /> 2. Transaksi Penjualan & Upload Dokumen SPR
        </button>
        <button
          className={`tab-item ${currentSubView === 'konsumen' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('konsumen')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            borderColor: currentSubView === 'konsumen' ? '#f59e0b' : undefined,
            color: currentSubView === 'konsumen' ? '#fbbf24' : undefined
          }}
        >
          <Users size={16} color="#fbbf24" /> 3. Data Base Konsumen ({databaseKonsumenRows.length})
        </button>
        <button
          className={`tab-item ${currentSubView === 'calon_konsumen' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('calon_konsumen')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            borderColor: currentSubView === 'calon_konsumen' ? '#ec4899' : undefined,
            color: currentSubView === 'calon_konsumen' ? '#f472b6' : undefined
          }}
        >
          <UserPlus size={16} color="#f472b6" /> 4. Data Base Calon Konsumen ({databaseCalonKonsumenRows.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PIPELINE CRM LEADS & KOMISI SALES TRACKER                          */}
      {/* ========================================================================= */}
      {currentSubView === 'leads' && (
        <div>
          {/* COMMISSION & LEADS KPI SUMMARY BANNER */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #F59E0B' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Potensi Komisi Sales (2.5%)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>{formatRupiah(totalCommissionPotential)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10B981' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Komisi Sudah Cair (Rekening)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>{formatRupiah(totalCommissionCair)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #38BDF8' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Lead Prospek</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{leadsList.length} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Konsumen</span></div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #EC4899' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nilai Pipeline Prospek</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatRupiah(totalLeadsValue)}</div>
              </div>
            </div>
          </div>

          {/* PIPELINE FILTER & SEARCH TOOLBAR */}
          <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama konsumen, unit minat, atau sales agent..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ minWidth: '200px' }}
                >
                  <option value="All">Semua Tahap Pipeline</option>
                  <option value="Lead Baru (Cold)">Lead Baru (Cold)</option>
                  <option value="Survey Site">Survey Site (Visit Lokasi)</option>
                  <option value="Prospect Hot (SP3K)">Prospect Hot (SP3K)</option>
                  <option value="Booking Fee SPR">Booking Fee SPR</option>
                  <option value="Closed Sold">Closed Sold (Akad)</option>
                </select>
              </div>
            </div>
          </div>

          {/* LEADS & COMMISSION TABLE */}
          <div className="glass-card" style={{ padding: '0.5rem' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID & Tanggal</th>
                    <th>Nama Konsumen & No WA</th>
                    <th>Target Unit & Budget</th>
                    <th>Sumber Lead</th>
                    <th>Sales Agent</th>
                    <th>Potensi Komisi (2.5%)</th>
                    <th>Tahap Pipeline</th>
                    <th>Status Pencairan Komisi</th>
                    <th>Aksi Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((l) => {
                    const commissionAmount = Math.round((l.budget || 0) * ((l.commissionPct || 2.5) / 100));

                    return (
                      <tr key={l.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{l.id}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{l.createdDate}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{l.customerName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{l.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{l.unitInterest}</div>
                          <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>{formatRupiah(l.budget)}</div>
                        </td>
                        <td><span className="badge badge-neutral">{l.source}</span></td>
                        <td><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{l.salesPerson}</div></td>
                        <td>
                          <div style={{ fontWeight: 900, color: '#10B981', fontSize: '0.9rem' }}>
                            {formatRupiah(commissionAmount)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>({l.commissionPct || 2.5}% dari harga)</div>
                        </td>
                        <td>
                          <span className={`badge ${
                            l.stage.includes('Closed') ? 'badge-success' :
                            l.stage.includes('Booking') ? 'badge-warning' :
                            l.stage.includes('Hot') ? 'badge-info' : 'badge-neutral'
                          }`}>
                            {l.stage}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${l.commissionStatus.includes('Cair') ? 'badge-success' : 'badge-warning'}`}>
                            {l.commissionStatus}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenWALeadTracker(l)}
                              style={{ color: '#25D366', fontWeight: 700 }}
                              title="Kirim Pesan Follow-Up WA"
                            >
                              <MessageSquare size={13} /> Chat WA
                            </button>
                            {l.stage.includes('Closed') && !l.commissionStatus.includes('Cair') && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleClaimCommission(l)}
                                style={{ fontSize: '0.72rem' }}
                              >
                                <DollarSign size={13} /> Klaim Komisi
                              </button>
                            )}
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditLead(l)}>
                              <Edit3 size={13} /> Edit
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteLead(l.id, l.customerName)}
                              style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem' }}
                              title="Hapus Lead"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRANSAKSI PENJUALAN & UPLOAD DOKUMEN SPR                           */}
      {/* ========================================================================= */}
      {currentSubView === 'spr' && (
        <div>
          {/* KPI Cards Grid */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Omzet Closed</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatRupiah(totalOmzet)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dokumen SPR Ter-Upload</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{salesList.filter(s => s.sprFileUrl).length} / {salesList.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Tersimpan</span></div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Unit Booking (SPR)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{salesList.filter(s => s.status.includes('Booking')).length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unit</span></div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lead Prospek Hot</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{salesList.filter(s => s.status.includes('Prospek')).length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lead</span></div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari No Unit, Konsumen, atau Sales Agent..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ minWidth: '200px' }}
                >
                  <option value="All">Semua Status Marketing</option>
                  <option value="Closed / Sold">Closed / Sold</option>
                  <option value="Booking / SPR">Booking / SPR</option>
                  <option value="Prospek Hot">Prospek Hot</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Sales Table */}
          <div className="glass-card" style={{ padding: '0.5rem' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID & Unit</th>
                    <th>Nama Konsumen</th>
                    <th>Harga Jual (Rp)</th>
                    <th>Status Berkas SPR (Staf Upload)</th>
                    <th>Sales Agent</th>
                    <th>Status Penjualan</th>
                    <th>Aksi Dokumen SPR</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{item.id}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Unit {item.unitNo}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{item.cluster}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.customerName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.customerPhone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{formatRupiah(item.hargaUnit)}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>BF: {formatRupiah(item.bookingFee)}</div>
                      </td>
                      <td>
                        {item.sprFileUrl ? (
                          <div>
                            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '4px' }}>
                              <ShieldCheck size={13} /> Dokumen TER-UPLOAD
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{item.sprFileName}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 600 }}>Oleh: {item.sprUploadedBy}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '4px' }}>
                              <Clock size={13} /> Belum Ada Berkas
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Staf Belum Unggah SPR</div>
                          </div>
                        )}
                      </td>
                      <td><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.salesPerson}</div></td>
                      <td>
                        <span className={`badge ${
                          item.status === 'Closed / Sold' ? 'badge-success' :
                          item.status === 'Booking / SPR' ? 'badge-warning' : 'badge-neutral'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => triggerUploadForSales(item.id)}
                            style={{ fontSize: '0.72rem', gap: '0.25rem' }}
                            title="Unggah / Perbarui File Dokumen SPR Resmi"
                          >
                            <Upload size={13} /> Upload SPR
                          </button>

                          {item.sprFileUrl ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => { setSelectedSprViewItem(item); setIsViewUploadedSprModalOpen(true); }}
                              style={{ fontSize: '0.72rem', gap: '0.25rem', color: '#10B981' }}
                            >
                              <Eye size={13} /> Lihat Berkas
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenSprModal(item)}
                              style={{ fontSize: '0.72rem', gap: '0.25rem' }}
                            >
                              <Printer size={13} /> Cetak Form
                            </button>
                          )}

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDeleteSale(item.id, item.unitNo)}
                            style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                            title="Hapus Transaksi"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DATA BASE KONSUMEN                                                 */}
      {/* ========================================================================= */}
      {currentSubView === 'konsumen' && (
        <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #f59e0b', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.65rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={22} color="#fbbf24" /> Data Base Konsumen ({databaseKonsumenRows.length} Pembeli)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                Master data konsumen pembeli unit perumahan, kelengkapan berkas KTP/NIK, NPWP, alamat dan saluran referensi
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                <Search size={14} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Cari Konsumen / NIK / No HP..."
                  value={searchDbKonsumen}
                  onChange={(e) => setSearchDbKonsumen(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '190px', outline: 'none' }}
                />
                {searchDbKonsumen && (
                  <button onClick={() => setSearchDbKonsumen('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <X size={13} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleOpenAddKonsumen}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000000', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)' }}
              >
                <Plus size={16} /> Tambah Konsumen
              </button>
            </div>
          </div>

          {/* Table Konsumen */}
          <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #d97706' }}>
            <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1050px' }}>
              <thead>
                <tr style={{ background: '#f59e0b', color: '#000000' }}>
                  <th style={{ width: '50px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                  <th style={{ minWidth: '200px', border: '1px solid #b45309', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Konsumen</th>
                  <th style={{ width: '150px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP / WhatsApp</th>
                  <th style={{ width: '160px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>NIK</th>
                  <th style={{ width: '160px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>NPWP</th>
                  <th style={{ minWidth: '200px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Alamat</th>
                  <th style={{ width: '150px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Referensi</th>
                  <th style={{ width: '120px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Upload KTP</th>
                  <th style={{ width: '120px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {databaseKonsumenRows
                  .filter(r => !searchDbKonsumen || [r.nama, r.noHp, r.nik, r.npwp, r.alamat, r.referensi].some(v => (v || '').toLowerCase().includes(searchDbKonsumen.toLowerCase().trim())))
                  .map((row, idx) => (
                    <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                            {row.nama ? row.nama.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <span>{row.nama}</span>
                        </div>
                      </td>
                      <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#38bdf8' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenWACustomer(row.noHp, row.nama)}
                          title="Chat via WhatsApp"
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 800, textDecoration: 'underline' }}
                        >
                          <Phone size={13} color="#22c55e" /> {row.noHp || '-'}
                        </button>
                      </td>
                      <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>{row.nik || '-'}</td>
                      <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>{row.npwp || '-'}</td>
                      <td style={{ border: '1px solid #334155', padding: '8px 10px', fontSize: '0.82rem', color: '#94a3b8' }}>{row.alamat || '-'}</td>
                      <td style={{ border: '1px solid #334155', padding: '8px 10px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          {row.referensi || '-'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px' }}>
                        {row.ktpFile || row.ktpFileName ? (
                          <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <FileCheck size={14} color="#10b981" /> Ada KTP
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Belum ada</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditKonsumen(row)}
                            title="Edit Konsumen"
                            style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteKonsumen(row.id, row.nama)}
                            title="Hapus Konsumen"
                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '4px 6px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DATA BASE CALON KONSUMEN                                           */}
      {/* ========================================================================= */}
      {currentSubView === 'calon_konsumen' && (
        <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #ec4899', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.65rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={22} color="#f472b6" /> Data Base Calon Konsumen ({databaseCalonKonsumenRows.length} Prospek)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                Daftar calon pembeli prospektif, domisili asal, nomor kontak WhatsApp dan saluran promosi
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                <Search size={14} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Cari Prospek / Domisili..."
                  value={searchDbCalonKonsumen}
                  onChange={(e) => setSearchDbCalonKonsumen(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '190px', outline: 'none' }}
                />
                {searchDbCalonKonsumen && (
                  <button onClick={() => setSearchDbCalonKonsumen('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <X size={13} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleOpenAddCalonKonsumen}
                style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(236, 72, 153, 0.4)' }}
              >
                <Plus size={16} /> Tambah Calon Konsumen
              </button>
            </div>
          </div>

          {/* Table Calon Konsumen */}
          <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #db2777' }}>
            <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '750px' }}>
              <thead>
                <tr style={{ background: '#ec4899', color: '#ffffff' }}>
                  <th style={{ width: '50px', textAlign: 'center', border: '1px solid #db2777', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                  <th style={{ minWidth: '220px', border: '1px solid #db2777', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Calon Konsumen</th>
                  <th style={{ width: '170px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP / WhatsApp</th>
                  <th style={{ width: '180px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Domisili</th>
                  <th style={{ width: '180px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Referensi</th>
                  <th style={{ width: '120px', textAlign: 'center', border: '1px solid #db2777', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {databaseCalonKonsumenRows
                  .filter(r => !searchDbCalonKonsumen || [r.nama, r.noHp, r.domisili, r.referensi].some(v => (v || '').toLowerCase().includes(searchDbCalonKonsumen.toLowerCase().trim())))
                  .map((row, idx) => (
                    <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ec4899', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                            {row.nama ? row.nama.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <span>{row.nama}</span>
                        </div>
                      </td>
                      <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#38bdf8' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenWACustomer(row.noHp, row.nama)}
                          title="Chat via WhatsApp"
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 800, textDecoration: 'underline' }}
                        >
                          <Phone size={13} color="#22c55e" /> {row.noHp || '-'}
                        </button>
                      </td>
                      <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="#f472b6" /> {row.domisili || '-'}
                        </span>
                      </td>
                      <td style={{ border: '1px solid #334155', padding: '8px 10px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                          {row.referensi || '-'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCalonKonsumen(row)}
                            title="Edit Calon Konsumen"
                            style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCalonKonsumen(row.id, row.nama)}
                            title="Hapus Calon Konsumen"
                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '4px 6px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT LEAD PROSPEK                                          */}
      {/* ========================================================================= */}
      {isLeadModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingLead ? 'Edit Data Lead Prospek' : 'Tambah Lead Prospek CRM Baru'}</h3>
              <button onClick={() => setIsLeadModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveLead}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Calon Konsumen / Lead</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Drs. Hendra Wijaya"
                    value={leadFormData.customerName}
                    onChange={(e) => setLeadFormData({ ...leadFormData, customerName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor WA Konsumen</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0812-xxxx-xxxx"
                      value={leadFormData.phone}
                      onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sumber Prospek (Source)</label>
                    <select
                      className="form-control"
                      value={leadFormData.source}
                      onChange={(e) => setLeadFormData({ ...leadFormData, source: e.target.value })}
                    >
                      <option value="Instagram Ads">Instagram Ads</option>
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Walk-In Customer">Walk-In Customer</option>
                      <option value="Referral Konsumen">Referral Konsumen</option>
                      <option value="Pameran Properti">Pameran Properti</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Unit Minat / Kavling Target</label>
                    <input
                      type="text"
                      className="form-control"
                      value={leadFormData.unitInterest}
                      onChange={(e) => setLeadFormData({ ...leadFormData, unitInterest: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Budget Konsumen (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={leadFormData.budget}
                      onChange={(e) => setLeadFormData({ ...leadFormData, budget: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tahap Pipeline CRM</label>
                    <select
                      className="form-control"
                      value={leadFormData.stage}
                      onChange={(e) => setLeadFormData({ ...leadFormData, stage: e.target.value })}
                    >
                      <option value="Lead Baru (Cold)">Lead Baru (Cold)</option>
                      <option value="Survey Site">Survey Site (Visit Lokasi)</option>
                      <option value="Prospect Hot (SP3K)">Prospect Hot (SP3K)</option>
                      <option value="Booking Fee SPR">Booking Fee SPR</option>
                      <option value="Closed Sold">Closed Sold (Akad & Komisi Cair)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Persentase Komisi Sales (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={leadFormData.commissionPct}
                      onChange={(e) => setLeadFormData({ ...leadFormData, commissionPct: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan Follow-Up Sales</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Hasil pembicaraan / jadwal survey..."
                    value={leadFormData.notes}
                    onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLeadModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Lead Prospek</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT & PRINT SPR FORM DOCUMENT MODAL */}
      {isSprModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSprModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '850px', background: '#0f172a' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header no-print">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Printer size={20} color="#F59E0B" /> Form Surat Pesanan Rumah (SPR) Resmi
              </h3>
              <button onClick={() => setIsSprModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
              {/* PRINTABLE DRAFT CONTENT */}
              <div id="spr-printable-area" style={{ background: '#ffffff', color: '#000000', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                {/* SPR HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/company-logo.png" alt="Ashoka" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#000000', letterSpacing: '-0.02em' }}>ASHOKA</div>
                      <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>Housing & Property Development</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#000000' }}>SURAT PESANAN RUMAH (SPR)</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#d97706' }}>No: {sprFormData.sprNumber}</div>
                  </div>
                </div>

                {/* SECTION 1: CUSTOMER DATA */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderRadius: '4px', marginBottom: '0.6rem' }}>
                    I. DATA PEMESAN / KONSUMEN
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', fontSize: '0.83rem' }}>
                    <div>Nama Lengkap Pemesan: <strong>{sprFormData.customerName}</strong></div>
                    <div>NIK KTP: <strong>{sprFormData.customerNik}</strong></div>
                    <div>No. Telepon / WA: <strong>{sprFormData.customerPhone}</strong></div>
                    <div>Pekerjaan: <strong>{sprFormData.customerJob}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}>Alamat KTP: <strong>{sprFormData.customerAddress}</strong></div>
                  </div>
                </div>

                {/* SECTION 2: UNIT & PRICE DETAIL */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderRadius: '4px', marginBottom: '0.6rem' }}>
                    II. SPESIFIKASI UNIT & RINCIAN HARGA
                  </div>
                  <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', marginBottom: '0.5rem' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Nomor Kavling & Cluster:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>Unit {sprFormData.unitNo} &bull; {sprFormData.cluster}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Tipe Bangunan / Tanah:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>{sprFormData.unitType}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Harga Jual Kesepakatan:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '800' }}>{formatRupiah(sprFormData.hargaJual)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Booking Fee (Tanda Jadi):</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', color: '#16a34a', fontWeight: '800' }}>{formatRupiah(sprFormData.bookingFee)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Uang Muka / DP (10%):</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>{formatRupiah(sprFormData.uangMukaDp)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Skema Pembayaran Pelunasan:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '700' }}>{sprFormData.skemaBayar}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SIGNATURE SECTION */}
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center', fontSize: '0.78rem' }}>
                  <div>
                    <div>Pemesan / Konsumen</div>
                    <div style={{ height: '55px' }}></div>
                    <div style={{ fontWeight: '800', borderTop: '1px solid #000', paddingTop: '4px' }}>({sprFormData.customerName})</div>
                  </div>
                  <div>
                    <div>Sales Executive</div>
                    <div style={{ height: '55px' }}></div>
                    <div style={{ fontWeight: '800', borderTop: '1px solid #000', paddingTop: '4px' }}>({sprFormData.salesPerson})</div>
                  </div>
                  <div>
                    <div>Direktur Utama / Manajemen</div>
                    <div style={{ height: '55px' }}></div>
                    <div style={{ fontWeight: '800', borderTop: '1px solid #000', paddingTop: '4px' }}>({sprFormData.directorName})</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER WITH PRINT BUTTON */}
            <div className="modal-footer no-print" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setIsSprModalOpen(false)}>Tutup</button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={() => window.print()}>
                  <Printer size={16} /> Cetak / Download PDF (SPR)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW UPLOADED SPR DOCUMENT MODAL */}
      {isViewUploadedSprModalOpen && selectedSprViewItem && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Dokumen SPR Resmi - Unit {selectedSprViewItem.unitNo}</h3>
              <button onClick={() => setIsViewUploadedSprModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {selectedSprViewItem.sprFileUrl?.startsWith('data:image') ? (
                <img src={selectedSprViewItem.sprFileUrl} alt="SPR" style={{ width: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '8px' }} />
              ) : (
                <iframe src={selectedSprViewItem.sprFileUrl} title="SPR PDF" style={{ width: '100%', height: '450px', border: 'none', borderRadius: '8px' }} />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsViewUploadedSprModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL MASTER: DATA BASE KONSUMEN                                         */}
      {/* ========================================================================= */}
      {isKonsumenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px', background: '#0f172a', border: '2px solid #f59e0b', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Users size={20} color="#fbbf24" />
                {editingKonsumenId ? 'Edit Data Base Konsumen' : 'Data Base Konsumen (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsKonsumenModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveKonsumen}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 15px 1fr', rowGap: '0.8rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama Konsumen</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap konsumen..."
                      value={konsumenFormData.nama}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #f59e0b', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. HP / WA</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={konsumenFormData.noHp}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* NIK */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>NIK (KTP)</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="16 digit NIK KTP..."
                      value={konsumenFormData.nik}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, nik: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* NPWP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>NPWP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Nomor NPWP..."
                      value={konsumenFormData.npwp}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, npwp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Alamat */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Alamat Domisili</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Alamat domisili lengkap..."
                      value={konsumenFormData.alamat}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, alamat: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Referensi */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Referensi</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Pameran / Brosur / Teman / Instagram..."
                      value={konsumenFormData.referensi}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, referensi: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Upload NIK / KTP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Upload KTP / NIK</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="marketing-konsumen-ktp-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setKonsumenFormData(prev => ({
                                ...prev,
                                ktpFileName: file.name,
                                ktpFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="marketing-konsumen-ktp-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          border: '1px dashed #f59e0b',
                          color: '#fbbf24',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {konsumenFormData.ktpFileName ? `Berkas: ${konsumenFormData.ktpFileName}` : 'Pilih Foto / Dokumen KTP'}
                      </label>
                      {konsumenFormData.ktpFileName && (
                        <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '4px', fontWeight: 700 }}>
                          ✓ Siap disimpan bersama data konsumen
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsKonsumenModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', fontWeight: 900, color: '#000000' }}>
                  💾 Simpan Data Base Konsumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL MASTER: DATA BASE CALON KONSUMEN                                    */}
      {/* ========================================================================= */}
      {isCalonKonsumenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px', background: '#0f172a', border: '2px solid #ec4899', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <UserPlus size={20} color="#f472b6" />
                {editingCalonKonsumenId ? 'Edit Data Base Calon Konsumen' : 'Data Base Calon Konsumen (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsCalonKonsumenModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCalonKonsumen}>
              <div className="modal-body">
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 15px 1fr', rowGap: '0.8rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama prospek / calon pembeli..."
                      value={calonKonsumenFormData.nama}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #ec4899', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. HP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={calonKonsumenFormData.noHp}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Domisili */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Domisili</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Kota / Wilayah tempat tinggal..."
                      value={calonKonsumenFormData.domisili}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, domisili: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Referensi */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Referensi</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Brosur / Spanduk / Web / Sales..."
                      value={calonKonsumenFormData.referensi}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, referensi: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#f472b6', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCalonKonsumenModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', border: 'none', fontWeight: 900 }}>
                  💾 Simpan Calon Konsumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
