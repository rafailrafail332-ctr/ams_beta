import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentGeneratorModal } from '../components/DocumentGeneratorModal';
import { 
  Headphones, 
  HeartHandshake, 
  Wrench, 
  KeyRound, 
  Star, 
  Users, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  MessageSquare, 
  Send, 
  PhoneCall, 
  Award, 
  Sparkles,
  Calendar,
  X,
  UserCheck,
  Building2,
  DollarSign,
  Printer,
  Edit3,
  Trash2,
  FileText,
  Check,
  Eye,
  Download,
  FolderCheck,
  BadgeCheck
} from 'lucide-react';

export const CustomerRelationModule = () => {
  const { showNotification, activeSubTab, setActiveSubTab } = useApp();
  const [activeTab, setActiveTab] = useState(activeSubTab && activeSubTab !== 'default' ? activeSubTab : 'tickets');

  React.useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Search Filter States across all Customer Relation Tabs
  const [searchTicket, setSearchTicket] = useState('');
  const [searchHandover, setSearchHandover] = useState('');
  const [searchCsat, setSearchCsat] = useState('');
  const [searchIpl, setSearchIpl] = useState('');
  const [searchDoc, setSearchDoc] = useState('');
  const [searchHelpdesk, setSearchHelpdesk] = useState('');

  // Initial Helpdesk Inquiries Data
  const initialHelpdeskList = [
    {
      id: 'HD-2025-001',
      unitNo: 'A-01',
      cluster: 'Cluster Emerald',
      customerName: 'Budi Santoso',
      phone: '081299887766',
      topic: 'Jadwal Serah Terima BAST & Sertifikat SHM',
      channel: 'WhatsApp Care',
      priority: 'Tinggi',
      status: 'Dijawab CS',
      pic: 'Dodi Syaiful Nugroho',
      date: '2025-08-20',
      lastMessage: 'Mohon info perkiraan jadwal serah terima kunci dan sertifikat SHM unit kami.'
    },
    {
      id: 'HD-2025-002',
      unitNo: 'B-04',
      cluster: 'Cluster Sapphire',
      customerName: 'Siti Aminah',
      phone: '081344556677',
      topic: 'Konsultasi Pencairan KPR Bank BTN',
      channel: 'Hotline Telepon',
      priority: 'Tinggi',
      status: 'Eskalasi Finance',
      pic: 'Tarkum Aditya / Syamsul',
      date: '2025-08-22',
      lastMessage: 'Apakah surat persetujuan SP3K Bank BTN sudah diterima pihak developer?'
    },
    {
      id: 'HD-2025-003',
      unitNo: 'A-12',
      cluster: 'Cluster Emerald',
      customerName: 'Hendra Gunawan',
      phone: '081122334455',
      topic: 'Konfirmasi Pembayaran IPL Estate & Stiker Akses Portal',
      channel: 'WhatsApp Care',
      priority: 'Sedang',
      status: 'Selesai',
      pic: 'Dodi Syaiful Nugroho',
      date: '2025-08-23',
      lastMessage: 'Kuitansi IPL bulan Agustus sudah kami terima dan stiker RFID gerbang sudah aktif.'
    },
    {
      id: 'HD-2025-004',
      unitNo: 'B-01',
      cluster: 'Cluster Sapphire',
      customerName: 'Dr. Tri Handoko',
      phone: '085711223344',
      topic: 'Lampu PJU Jalan Utama Agak Redup',
      channel: 'Portal Helpdesk',
      priority: 'Sedang',
      status: 'Diteruskan ke GA Lapangan',
      pic: 'Irwan (GA Site Manager)',
      date: '2025-08-24',
      lastMessage: 'Lampu penerangan depan kavling B-01 mohon dicek instalasi kabelnya.'
    }
  ];

  const [helpdeskList, setHelpdeskList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_cr_helpdesk_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialHelpdeskList;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('ams_cr_helpdesk_v1', JSON.stringify(helpdeskList));
    } catch (e) {}
  }, [helpdeskList]);

  // Modal Helpdesk
  const [isHelpdeskModalOpen, setIsHelpdeskModalOpen] = useState(false);
  const [editingHelpdesk, setEditingHelpdesk] = useState(null);
  const [helpdeskForm, setHelpdeskForm] = useState({
    unitNo: 'A-01',
    cluster: 'Cluster Emerald',
    customerName: '',
    phone: '',
    topic: '',
    channel: 'WhatsApp Care',
    priority: 'Sedang',
    status: 'Dalam Antrean',
    pic: 'Dodi Syaiful Nugroho',
    lastMessage: ''
  });

  const handleOpenAddHelpdesk = () => {
    setEditingHelpdesk(null);
    setHelpdeskForm({
      unitNo: 'A-01',
      cluster: 'Cluster Emerald',
      customerName: '',
      phone: '',
      topic: '',
      channel: 'WhatsApp Care',
      priority: 'Sedang',
      status: 'Dalam Antrean',
      pic: 'Dodi Syaiful Nugroho',
      lastMessage: ''
    });
    setIsHelpdeskModalOpen(true);
  };

  const handleOpenEditHelpdesk = (item) => {
    setEditingHelpdesk(item);
    setHelpdeskForm({ ...item });
    setIsHelpdeskModalOpen(true);
  };

  const handleSaveHelpdesk = (e) => {
    e.preventDefault();
    if (editingHelpdesk) {
      setHelpdeskList(prev => prev.map(h => h.id === editingHelpdesk.id ? { ...h, ...helpdeskForm } : h));
      showNotification(`Tiket Helpdesk ${helpdeskForm.customerName} berhasil diperbarui!`, 'success');
    } else {
      const newItem = {
        id: `HD-2025-${String(helpdeskList.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        ...helpdeskForm
      };
      setHelpdeskList(prev => [newItem, ...prev]);
      showNotification(`Tiket Helpdesk baru untuk ${helpdeskForm.customerName} berhasil ditambahkan!`, 'success');
    }
    setIsHelpdeskModalOpen(false);
  };

  const handleDeleteHelpdesk = (id, name) => {
    if (window.confirm(`Hapus catatan tiket helpdesk ${name}?`)) {
      setHelpdeskList(prev => prev.filter(h => h.id !== id));
      showNotification(`Tiket helpdesk ${name} dihapus.`, 'warning');
    }
  };

  const handleToggleHelpdeskStatus = (item) => {
    const nextStatus = item.status === 'Selesai' ? 'Dalam Antrean' : 'Selesai';
    setHelpdeskList(prev => prev.map(h => h.id === item.id ? { ...h, status: nextStatus } : h));
    showNotification(`Status tiket helpdesk ${item.customerName} diubah menjadi: ${nextStatus}`, 'info');
  };

  // Direct WA Message Sender Helper
  const handleSendWaDirect = (phone, name, topic, unitNo) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const message = encodeURIComponent(
      `Halo Bapak/Ibu ${name} (Unit ${unitNo} Ashoka Enterprise).\n\nMenindaklanjuti perihal: "${topic}", kami dari Tim Customer Relation Ashoka Care siap membantu Anda.\n\nAda yang bisa kami bantu lebih lanjut?\n\nSalam hangat,\nCustomer Relation PT Ashoka Enterprise Development`
    );
    window.open(`https://wa.me/${intlPhone}?text=${message}`, '_blank');
  };

  // BAST Printable Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedBastUnitData, setSelectedBastUnitData] = useState(null);

  const handleOpenPrintBast = (h) => {
    setSelectedBastUnitData({
      unitNo: h.unitNo,
      cluster: 'Cluster Emerald',
      owner: h.customerName,
      tipe: '45/90 (Standard Emerald)',
      harga: 650000000,
      contractor: 'PT Bangun Jaya Perdana',
      legalStatus: 'SHM Ready (No. 1024/SHM)',
      date: h.bastDate || new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    setIsDocModalOpen(true);
  };

  // Pillar 1: Complaints & Warranty Tickets Data (Persistent Store with Full CRUD)
  const initialTickets = [
    {
      id: 'CR-TCK-001',
      unitNo: 'A-01',
      cluster: 'Cluster Emerald',
      customerName: 'Budi Santoso',
      phone: '0812-9988-7766',
      category: 'Kebocoran Plafon',
      description: 'Ada rembesan air di plafon kamar utama saat hujan deras.',
      status: 'In Progress (Perbaikan)',
      warrantyDaysLeft: 45,
      contractorAssigned: 'PT Bangun Jaya Perdana',
      reportDate: '2025-08-01',
      targetCompletion: '2025-08-15'
    },
    {
      id: 'CR-TCK-002',
      unitNo: 'A-06',
      cluster: 'Cluster Emerald',
      customerName: 'Rian Perdana',
      phone: '0813-4455-6677',
      category: 'Kusen Pintu Agak Macet',
      description: 'Engsel pintu kamar mandi perlu distel kencang.',
      status: 'Completed (Selesai)',
      warrantyDaysLeft: 90,
      contractorAssigned: 'PT Bangun Jaya Perdana',
      reportDate: '2025-07-25',
      targetCompletion: '2025-07-28'
    },
    {
      id: 'CR-TCK-003',
      unitNo: 'B-01',
      cluster: 'Cluster Sapphire',
      customerName: 'Dr. Tri Handoko',
      phone: '0811-2233-4455',
      category: 'Cat Dinding Mengelupas',
      description: 'Dinding teras depan mengelupas karena lembab.',
      status: 'Pending (Disposisi)',
      warrantyDaysLeft: 120,
      contractorAssigned: 'CV Karya Mandiri Teknik',
      reportDate: '2025-08-10',
      targetCompletion: '2025-08-18'
    }
  ];

  const getSavedTickets = () => {
    try {
      const saved = localStorage.getItem('ams_cr_tickets_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialTickets;
  };

  const [tickets, setTickets] = useState(getSavedTickets);

  React.useEffect(() => {
    try {
      localStorage.setItem('ams_cr_tickets_v3', JSON.stringify(tickets));
    } catch (e) {}
  }, [tickets]);

  const handleDeleteTicket = (id, customerName) => {
    if (window.confirm(`Hapus tiket komplain ${id} (${customerName})?`)) {
      setTickets(prev => prev.filter(t => t.id !== id));
      showNotification(`Tiket komplain ${id} untuk ${customerName} berhasil dihapus.`, 'warning');
    }
  };

  // Pillar 2: BAST Handover & Utilities Data (Persistent Store with Full CRUD)
  const initialHandovers = [
    {
      id: 'HO-001',
      unitNo: 'A-01',
      customerName: 'Budi Santoso',
      phone: '0812-9988-7766',
      cluster: 'Grand Harmoni - Cluster Emerald',
      tipe: '45/90 (Standard Emerald)',
      bastDate: '01 Agustus 2025',
      statusPLN: 'Aktif 1300W',
      meteranPLNNo: '5412-9900-1123',
      dayaPLN: '1300 VA',
      statusPDAM: 'Aktif PDAM Tirta',
      meteranPDAMNo: 'PDAM-TIRTA-8871',
      statusBAST: 'Selesai BAST (Kunci Diserahkan)',
      notes: 'Serah terima 3 set kunci utama, kartu garansi retensi 100 hari, & meteran PLN/PDAM aktif.'
    },
    {
      id: 'HO-002',
      unitNo: 'A-02',
      customerName: 'Siti Rahmawati',
      phone: '0812-3344-5566',
      cluster: 'Grand Harmoni - Cluster Emerald',
      tipe: '45/90 (Standard Emerald)',
      bastDate: '25 Agustus 2025 (Undangan)',
      statusPLN: 'Proses Pemasangan Meteran PLN',
      meteranPLNNo: 'Menunggu Token Pemasangan',
      dayaPLN: '1300 VA',
      statusPDAM: 'Proses Sambungan Pipa PDAM',
      meteranPDAMNo: 'Proses Sambung',
      statusBAST: 'Jadwal Undangan Serah Terima',
      notes: 'Undangan resmi serah terima kunci telah terkirim via WhatsApp Customer Care.'
    },
    {
      id: 'HO-003',
      unitNo: 'A-06',
      customerName: 'Rian Perdana',
      phone: '0813-4455-6677',
      cluster: 'Grand Harmoni - Cluster Emerald',
      tipe: '60/120 (Corner Emerald)',
      bastDate: '28 Juli 2025',
      statusPLN: 'Aktif 2200W',
      meteranPLNNo: '5412-9921-8840',
      dayaPLN: '2200 VA',
      statusPDAM: 'Aktif PDAM Tirta',
      meteranPDAMNo: 'PDAM-TIRTA-8902',
      statusBAST: 'Selesai BAST (Kunci Diserahkan)',
      notes: 'Serah terima kunci lengkap tuntas, rumah dihuni langsung oleh konsumen.'
    },
    {
      id: 'HO-004',
      unitNo: 'B-01',
      customerName: 'Dr. Tri Handoko',
      phone: '0811-2233-4455',
      cluster: 'Grand Harmoni - Cluster Sapphire',
      tipe: '75/150 (Sapphire Luxury)',
      bastDate: '15 September 2025 (Jadwal)',
      statusPLN: 'Pengajuan PLN Sub-station',
      meteranPLNNo: 'Proses Antrian PLN',
      dayaPLN: '2200 VA',
      statusPDAM: 'Pipa Sambungan Induk Ready',
      meteranPDAMNo: 'Proses Registrasi',
      statusBAST: 'Dalam Persiapan Finishing Akhir',
      notes: 'Finishing cat dan instalasi carport sedang diselesaikan oleh kontraktor pelaksana.'
    }
  ];

  const getSavedHandovers = () => {
    try {
      const saved = localStorage.getItem('ams_bast_handovers_clean_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialHandovers;
  };

  const [handovers, setHandovers] = useState(getSavedHandovers);

  React.useEffect(() => {
    try {
      localStorage.setItem('ams_bast_handovers_clean_v2', JSON.stringify(handovers));
    } catch (e) {}
  }, [handovers]);

  // Modal State for BAST Handover Add/Edit
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [editingHandover, setEditingHandover] = useState(null);
  const [handoverForm, setHandoverForm] = useState({
    unitNo: 'A-01',
    customerName: '',
    phone: '',
    cluster: 'Grand Harmoni - Cluster Emerald',
    tipe: '45/90',
    bastDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
    statusPLN: 'Aktif 1300W',
    meteranPLNNo: '',
    dayaPLN: '1300 VA',
    statusPDAM: 'Aktif PDAM Tirta',
    meteranPDAMNo: '',
    statusBAST: 'Selesai BAST (Kunci Diserahkan)',
    notes: ''
  });

  const handleOpenAddHandover = () => {
    setEditingHandover(null);
    setHandoverForm({
      unitNo: 'A-01',
      customerName: '',
      phone: '',
      cluster: 'Grand Harmoni - Cluster Emerald',
      tipe: '45/90',
      bastDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      statusPLN: 'Aktif 1300W',
      meteranPLNNo: '',
      dayaPLN: '1300 VA',
      statusPDAM: 'Aktif PDAM Tirta',
      meteranPDAMNo: '',
      statusBAST: 'Selesai BAST (Kunci Diserahkan)',
      notes: ''
    });
    setIsHandoverModalOpen(true);
  };

  const handleOpenEditHandover = (h) => {
    setEditingHandover(h);
    setHandoverForm({
      unitNo: h.unitNo || '',
      customerName: h.customerName || '',
      phone: h.phone || '',
      cluster: h.cluster || 'Grand Harmoni - Cluster Emerald',
      tipe: h.tipe || '45/90',
      bastDate: h.bastDate || '',
      statusPLN: h.statusPLN || 'Aktif 1300W',
      meteranPLNNo: h.meteranPLNNo || '',
      dayaPLN: h.dayaPLN || '1300 VA',
      statusPDAM: h.statusPDAM || 'Aktif PDAM Tirta',
      meteranPDAMNo: h.meteranPDAMNo || '',
      statusBAST: h.statusBAST || 'Selesai BAST (Kunci Diserahkan)',
      notes: h.notes || ''
    });
    setIsHandoverModalOpen(true);
  };

  const handleSaveHandover = (e) => {
    e.preventDefault();
    if (editingHandover) {
      setHandovers(handovers.map(h => h.id === editingHandover.id ? { ...h, ...handoverForm } : h));
      showNotification(`BAST Unit ${handoverForm.unitNo} (${handoverForm.customerName}) berhasil diperbarui!`, 'success');
    } else {
      const newHo = {
        id: `HO-00${handovers.length + 1}`,
        ...handoverForm
      };
      setHandovers([newHo, ...handovers]);
      showNotification(`BAST Serah Terima Kunci Unit ${handoverForm.unitNo} berhasil dicatat!`, 'success');
    }
    setIsHandoverModalOpen(false);
  };

  const handleDeleteHandover = (id, unitNo) => {
    if (window.confirm(`Hapus catatan BAST Serah Terima Kunci Unit ${unitNo}?`)) {
      setHandovers(handovers.filter(h => h.id !== id));
      showNotification(`Catatan BAST Unit ${unitNo} berhasil dihapus.`, 'warning');
    }
  };

  // Pillar 3: CSAT & Loyalty Referral Data (Persistent Store with Full CRUD)
  const initialReviews = [
    { id: 1, customer: 'Budi Santoso (A-01)', rating: 5, comment: 'Sangat puas dengan respon cepat tim CRM Ashoka dalam perbaikan atap. Pelayanan sangat ramah!', date: '05 Ags 2025' },
    { id: 2, customer: 'Rian Perdana (A-06)', rating: 5, comment: 'Proses BAST serah terima kunci lancar dan penataan fasilitas cluster sangat bersih.', date: '30 Jul 2025' }
  ];

  const getSavedReviews = () => {
    try {
      const saved = localStorage.getItem('ams_cr_csat_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialReviews;
  };

  const [reviews, setReviews] = useState(getSavedReviews);

  React.useEffect(() => {
    try {
      localStorage.setItem('ams_cr_csat_v3', JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews]);

  const [isCsatModalOpen, setIsCsatModalOpen] = useState(false);
  const [csatForm, setCsatForm] = useState({
    customer: '',
    rating: 5,
    comment: ''
  });

  const handleOpenAddReview = () => {
    setCsatForm({ customer: '', rating: 5, comment: '' });
    setIsCsatModalOpen(true);
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    const newRev = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...csatForm
    };
    setReviews(prev => [newRev, ...prev]);
    showNotification(`Ulasan kepuasan dari ${csatForm.customer} berhasil ditambahkan!`, 'success');
    setIsCsatModalOpen(false);
  };

  const handleDeleteReview = (id, customer) => {
    if (window.confirm(`Hapus ulasan kepuasan dari ${customer}?`)) {
      setReviews(prev => prev.filter(r => r.id !== id));
      showNotification(`Ulasan dari ${customer} berhasil dihapus.`, 'warning');
    }
  };

  // Pillar 4: IPL Estate Management Billing Data (Persistent Store with Full CRUD)
  const initialIplList = [
    { id: 'IPL-08-A01', unitNo: 'A-01', customerName: 'Budi Santoso', month: 'Agustus 2025', amount: 250000, status: 'LUNAS (Verified)' },
    { id: 'IPL-08-A06', unitNo: 'A-06', customerName: 'Rian Perdana', month: 'Agustus 2025', amount: 250000, status: 'Belum Bayar' },
    { id: 'IPL-08-B01', unitNo: 'B-01', customerName: 'Dr. Tri Handoko', month: 'Agustus 2025', amount: 350000, status: 'LUNAS (Verified)' }
  ];

  const getSavedIplList = () => {
    try {
      const saved = localStorage.getItem('ams_cr_ipl_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialIplList;
  };

  const [iplList, setIplList] = useState(getSavedIplList);

  React.useEffect(() => {
    try {
      localStorage.setItem('ams_cr_ipl_v3', JSON.stringify(iplList));
    } catch (e) {}
  }, [iplList]);

  const [isIplModalOpen, setIsIplModalOpen] = useState(false);
  const [iplForm, setIplForm] = useState({
    unitNo: 'A-01',
    customerName: '',
    month: 'Agustus 2025',
    amount: 250000,
    status: 'Belum Bayar'
  });

  const handleOpenAddIpl = () => {
    setIplForm({
      unitNo: 'A-01',
      customerName: '',
      month: 'Agustus 2025',
      amount: 250000,
      status: 'Belum Bayar'
    });
    setIsIplModalOpen(true);
  };

  const handleSaveIpl = (e) => {
    e.preventDefault();
    const newIpl = {
      id: `IPL-08-${iplForm.unitNo.replace(/[^a-zA-Z0-9]/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      ...iplForm
    };
    setIplList(prev => [newIpl, ...prev]);
    showNotification(`Tagihan IPL Unit ${iplForm.unitNo} berhasil diterbitkan!`, 'success');
    setIsIplModalOpen(false);
  };

  const handleDeleteIpl = (id, unitNo) => {
    if (window.confirm(`Hapus data tagihan ${id} untuk Unit ${unitNo}?`)) {
      setIplList(prev => prev.filter(i => i.id !== id));
      showNotification(`Tagihan IPL ${id} berhasil dihapus.`, 'warning');
    }
  };

  // Modal State for New Complaint Ticket
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    unitNo: 'A-01',
    customerName: 'Budi Santoso',
    phone: '0812-9988-7766',
    category: 'Kebocoran Plafon',
    description: '',
    contractorAssigned: 'PT Bangun Jaya Perdana'
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const newTck = {
      id: `CR-TCK-00${tickets.length + 1}`,
      cluster: 'Cluster Emerald',
      status: 'Pending (Disposisi)',
      warrantyDaysLeft: 90,
      reportDate: new Date().toISOString().split('T')[0],
      targetCompletion: '2025-08-20',
      ...ticketForm
    };
    setTickets([newTck, ...tickets]);
    showNotification(`Tiket Komplain Baru ${newTck.id} berhasil diterbitkan & didisposisi!`, 'success');
    setIsTicketModalOpen(false);
  };

  const handleCompleteTicket = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Completed (Selesai)' } : t));
    showNotification(`Tiket Komplain ${id} dinyatakan SELESAI & Lolos Inspeksi!`, 'success');
  };

  // Pillar 5: Penyerahan Berkas Asli Konsumen (SHM, PBG, Polis) Data
  const initialDocumentHandovers = [
    {
      id: 'DOC-HO-001',
      unitNo: 'A-01',
      customerName: 'Budi Santoso',
      cluster: 'Cluster Emerald',
      phone: '0812-9988-7766',
      shmNo: 'SHM No. 1024/Kedungwuni',
      shmStatus: 'Sudah Diserahkan (Lengkap)',
      pbgNo: 'PBG-3326/2025/001',
      pbgStatus: 'Sudah Diserahkan',
      polisNo: 'POL-MND-992182 (Bank Mandiri)',
      polisStatus: 'Sudah Diserahkan',
      handoverDate: '2025-08-01',
      receiverName: 'Budi Santoso (Pemilik Langsung)',
      receiverNik: '3326101902880001',
      picLegal: 'Fitria Handayani (Legal Specialist)',
      status: 'Lengkap & Tuntas Diserahkan',
      notes: 'BAST Dokumen Asli ditandatangani di hadapan Notaris & CRM.'
    },
    {
      id: 'DOC-HO-002',
      unitNo: 'A-02',
      customerName: 'Siti Rahmawati',
      cluster: 'Cluster Emerald',
      phone: '0812-3344-5566',
      shmNo: 'SHM No. 1025/Kedungwuni',
      shmStatus: 'Siap Diambil di Kantor',
      pbgNo: 'PBG-3326/2025/002',
      pbgStatus: 'Siap Diambil',
      polisNo: 'POL-BCA-881290 (Bank BCA)',
      polisStatus: 'Tersimpan di Vault Legal',
      handoverDate: 'Menunggu Pengambilan',
      receiverName: '-',
      receiverNik: '-',
      picLegal: 'Fitria Handayani (Legal Specialist)',
      status: 'Siap Diambil di Kantor Legal',
      notes: 'Undangan pengambilan dokumen asli telah dikirim via WhatsApp.'
    },
    {
      id: 'DOC-HO-003',
      unitNo: 'A-06',
      customerName: 'Rian Perdana',
      cluster: 'Cluster Emerald',
      phone: '0813-4455-6677',
      shmNo: 'SHM No. 1029/Kedungwuni',
      shmStatus: 'Sudah Diserahkan (Lengkap)',
      pbgNo: 'PBG-3326/2025/006',
      pbgStatus: 'Sudah Diserahkan',
      polisNo: 'POL-BTN-771239 (Bank BTN)',
      polisStatus: 'Sudah Diserahkan',
      handoverDate: '2025-07-30',
      receiverName: 'Rian Perdana (Pemilik Langsung)',
      receiverNik: '3326101506890003',
      picLegal: 'Fitria Handayani (Legal Specialist)',
      status: 'Lengkap & Tuntas Diserahkan',
      notes: 'Dokumen diserahkan bersamaan dengan serah terima kunci unit.'
    },
    {
      id: 'DOC-HO-004',
      unitNo: 'B-01',
      customerName: 'Dr. Tri Handoko',
      cluster: 'Cluster Sapphire',
      phone: '0811-2233-4455',
      shmNo: 'Proses Splitzing BPN (No. Agenda: 8912/2025)',
      shmStatus: 'Dalam Proses Splitzing BPN',
      pbgNo: 'PBG-3326/2025/012',
      pbgStatus: 'Tersedia di Legal',
      polisNo: 'POL-BSI-990012 (Bank BSI)',
      polisStatus: 'Tersimpan di Bank Syariah',
      handoverDate: 'Estimasi September 2025',
      receiverName: '-',
      receiverNik: '-',
      picLegal: 'Fitria Handayani (Legal Specialist)',
      status: 'Dalam Proses Pemecahan BPN',
      notes: 'Menunggu penerbitan buku tanah pecahan dari Kantor BPN.'
    }
  ];

  const getSavedDocHandovers = () => {
    try {
      const saved = localStorage.getItem('ams_doc_handover_records_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialDocumentHandovers;
  };

  const [documentHandovers, setDocumentHandovers] = useState(getSavedDocHandovers);

  React.useEffect(() => {
    try {
      localStorage.setItem('ams_doc_handover_records_v1', JSON.stringify(documentHandovers));
    } catch (e) {}
  }, [documentHandovers]);

  // Modal State for Document Handover CRUD
  const [isDocHandoverModalOpen, setIsDocHandoverModalOpen] = useState(false);
  const [editingDocHandover, setEditingDocHandover] = useState(null);
  const [docHandoverForm, setDocHandoverForm] = useState({
    unitNo: 'A-01',
    customerName: '',
    cluster: 'Cluster Emerald',
    phone: '',
    shmNo: '',
    shmStatus: 'Sudah Diserahkan (Lengkap)',
    pbgNo: '',
    pbgStatus: 'Sudah Diserahkan',
    polisNo: '',
    polisStatus: 'Sudah Diserahkan',
    handoverDate: new Date().toISOString().split('T')[0],
    receiverName: '',
    receiverNik: '',
    picLegal: 'Fitria Handayani (Legal Specialist)',
    status: 'Lengkap & Tuntas Diserahkan',
    notes: ''
  });

  // Modal BAST Dokumen Asli Printable
  const [isPrintDocBastModalOpen, setIsPrintDocBastModalOpen] = useState(false);
  const [selectedDocForPrint, setSelectedDocForPrint] = useState(null);

  const handleOpenAddDocHandover = () => {
    setEditingDocHandover(null);
    setDocHandoverForm({
      unitNo: 'A-01',
      customerName: '',
      cluster: 'Cluster Emerald',
      phone: '',
      shmNo: '',
      shmStatus: 'Sudah Diserahkan (Lengkap)',
      pbgNo: '',
      pbgStatus: 'Sudah Diserahkan',
      polisNo: '',
      polisStatus: 'Sudah Diserahkan',
      handoverDate: new Date().toISOString().split('T')[0],
      receiverName: '',
      receiverNik: '',
      picLegal: 'Fitria Handayani (Legal Specialist)',
      status: 'Lengkap & Tuntas Diserahkan',
      notes: ''
    });
    setIsDocHandoverModalOpen(true);
  };

  const handleOpenEditDocHandover = (item) => {
    setEditingDocHandover(item);
    setDocHandoverForm({ ...item });
    setIsDocHandoverModalOpen(true);
  };

  const handleSaveDocHandover = (e) => {
    e.preventDefault();
    if (editingDocHandover) {
      setDocumentHandovers(prev => prev.map(d => d.id === editingDocHandover.id ? { ...d, ...docHandoverForm } : d));
      showNotification(`DATA SERAH TERIMA BERKAS DIPERBARUI! Unit ${docHandoverForm.unitNo} berhasil disimpan.`);
    } else {
      const newItem = {
        id: `DOC-HO-00${documentHandovers.length + 1}`,
        ...docHandoverForm
      };
      setDocumentHandovers(prev => [newItem, ...prev]);
      showNotification(`DATA SERAH TERIMA BERKAS DITAMBAHKAN! ID ${newItem.id} untuk Unit ${docHandoverForm.unitNo}.`);
    }
    setIsDocHandoverModalOpen(false);
  };

  const handleDeleteDocHandover = (id, unitNo) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus catatan penyerahan berkas Unit ${unitNo}?`)) {
      setDocumentHandovers(prev => prev.filter(d => d.id !== id));
      showNotification(`CATATAN DIHAPUS! Data penyerahan Unit ${unitNo} telah dihapus.`, 'warning');
    }
  };

  const handleOpenPrintDocBast = (item) => {
    setSelectedDocForPrint(item);
    setIsPrintDocBastModalOpen(true);
  };

  const handlePayIPL = (id) => {
    setIplList(iplList.map(i => i.id === id ? { ...i, status: 'LUNAS (Verified)' } : i));
    showNotification(`Pembayaran IPL ${id} berhasil diproses & Kwitansi terbit!`);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Customer Relation (CRM & After-Sales Properti)</h1>
          <p className="page-subtitle">Pusat penanganan keluhan garansi retensi, serah terima BAST, survei CSAT, IPL lingkungan, & helpdesk konsumen.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsTicketModalOpen(true)}>
          <Plus size={16} /> Buat Tiket Komplain Konsumen Baru
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tiket Garansi Aktif</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{tickets.filter(t => t.status !== 'Completed (Selesai)').length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tiket</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyRound size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>BAST Serah Terima Kunci</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>100% <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>On Schedule</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Skor Kepuasan CSAT</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>4.95 / 5.0 <span style={{ fontSize: '0.8rem', color: '#F59E0B' }}>★</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kolektibilitas IPL Warga</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>92% <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Lunas</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for 6 Pillars */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
          <Wrench size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Keluhan & Garansi Retensi ({tickets.length})
        </button>
        <button className={`tab-item ${activeTab === 'handover' ? 'active' : ''}`} onClick={() => setActiveTab('handover')}>
          <KeyRound size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. BAST & PLN/PDAM ({handovers.length})
        </button>
        <button className={`tab-item ${activeTab === 'csat' ? 'active' : ''}`} onClick={() => setActiveTab('csat')}>
          <Star size={16} style={{ display: 'inline', marginRight: '6px' }} /> 3. Survei CSAT & Referal ({reviews.length})
        </button>
        <button className={`tab-item ${activeTab === 'ipl' ? 'active' : ''}`} onClick={() => setActiveTab('ipl')}>
          <Building2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> 4. Iuran Lingkungan (IPL) ({iplList.length})
        </button>
        <button className={`tab-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
          <FileCheck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 5. Penyerahan SHM/PBG ({documentHandovers.length})
        </button>
        <button className={`tab-item ${activeTab === 'helpdesk' ? 'active' : ''}`} onClick={() => setActiveTab('helpdesk')}>
          <Headphones size={16} style={{ display: 'inline', marginRight: '6px' }} /> 6. Helpdesk & Consultation
        </button>
      </div>

      {/* PILAR 1: KELUHAN & GARANSI RETENSI */}
      {activeTab === 'tickets' && (() => {
        const filteredTickets = tickets.filter(t => !searchTicket || [t.id, t.unitNo, t.cluster, t.customerName, t.phone, t.category, t.description, t.contractorAssigned, t.status].some(val => (val || '').toLowerCase().includes(searchTicket.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Daftar Tiket Keluhan & Pemeliharaan Garansi Retensi</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setIsTicketModalOpen(true)}>
                <Plus size={14} /> Buat Tiket Keluhan Baru
              </button>
            </div>

            {/* Search Bar Tiket */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari no tiket, kavling unit, nama konsumen, kontraktor, kategori keluhan..."
                  value={searchTicket}
                  onChange={(e) => setSearchTicket(e.target.value)}
                />
                {searchTicket && (
                  <button onClick={() => setSearchTicket('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredTickets.length}</span> dari {tickets.length} Tiket
              </div>
            </div>

            {filteredTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Wrench size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada tiket keluhan yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchTicket('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>No Tiket & Unit</th>
                      <th>Nama Konsumen & WA</th>
                      <th>Kategori Keluhan</th>
                      <th>Deskripsi Perbaikan</th>
                      <th>Sisa Garansi</th>
                      <th>Kontraktor Penanggung Jawab</th>
                      <th>Status & Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{t.id}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Unit {t.unitNo} &bull; {t.cluster}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{t.customerName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.phone}</div>
                        </td>
                        <td><span className="badge badge-warning">{t.category}</span></td>
                        <td><div style={{ fontSize: '0.825rem' }}>{t.description}</div></td>
                        <td><span className="badge badge-info">{t.warrantyDaysLeft} Hari</span></td>
                        <td>{t.contractorAssigned}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            {(t.status || '').includes('Completed') ? (
                              <span className="badge badge-success"><CheckCircle2 size={12} /> Selesai</span>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => handleCompleteTicket(t.id)} style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}>
                                <CheckCircle2 size={13} /> Selesaikan
                              </button>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteTicket(t.id, t.customerName)}
                              style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Hapus Tiket Komplain"
                            >
                              <Trash2 size={13} /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}

      {/* PILAR 2: BAST SERAH TERIMA & UTILITIES (FULL CRUD) */}
      {activeTab === 'handover' && (() => {
        const filteredHandovers = handovers.filter(h => !searchHandover || [h.id, h.unitNo, h.customerName, h.cluster, h.bastDate, h.statusPLN, h.statusPDAM, h.statusBAST, h.meteranPLNNo, h.meteranPDAMNo].some(val => (val || '').toLowerCase().includes(searchHandover.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <KeyRound color="#F59E0B" size={24} /> Manajemen BAST Serah Terima Kunci & Balik Nama Meteran
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Pusat pencatatan resmi serah terima kunci fisik rumah, garansi retensi, & status aktivasi meteran PLN / PDAM warga.
                </p>
              </div>

              <button className="btn btn-primary" onClick={handleOpenAddHandover} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none' }}>
                <Plus size={16} /> Catat BAST Serah Terima Kunci Baru
              </button>
            </div>

            {/* KPI Mini Cards for BAST */}
            <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700 }}>Total BAST Terdaftar</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{handovers.length} Unit</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kavling Siap / Selesai Handover</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Kunci Diserahkan</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>
                  {handovers.filter(h => (h.statusBAST || '').includes('Selesai')).length} Unit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Rumah Aktif Dihuni Warga</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#3B82F6', fontWeight: 700 }}>PLN & PDAM Aktif</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#3B82F6' }}>
                  {handovers.filter(h => (h.statusPLN || '').includes('Aktif')).length} Unit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Meteran Mandiri Terpasang</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#A855F7', fontWeight: 700 }}>Jadwal Undangan</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#A855F7' }}>
                  {handovers.filter(h => !(h.statusBAST || '').includes('Selesai')).length} Unit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Menunggu Serah Terima Kunci</div>
              </div>
            </div>

            {/* Search Bar BAST */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari nomor unit (A-01), nama konsumen, tanggal BAST, status meteran PLN/PDAM..."
                  value={searchHandover}
                  onChange={(e) => setSearchHandover(e.target.value)}
                />
                {searchHandover && (
                  <button onClick={() => setSearchHandover('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredHandovers.length}</span> dari {handovers.length} Handover
              </div>
            </div>

            {filteredHandovers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <KeyRound size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada data serah terima yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchHandover('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Kavling Unit & Konsumen</th>
                      <th>Tanggal BAST</th>
                      <th>Sambungan Listrik (PLN)</th>
                      <th>Sambungan Air (PDAM)</th>
                      <th>Status BAST Kunci</th>
                      <th>Aksi Serah Terima</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHandovers.map((h) => {
                      const isHandoverDone = (h.statusBAST || '').includes('Selesai');
                      return (
                        <tr key={h.id}>
                          <td>
                            <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {h.unitNo}</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>{h.customerName}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{h.cluster} &bull; {h.phone || '-'}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{h.bastDate}</div>
                            {h.notes && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {h.notes}
                              </div>
                            )}
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{h.statusPLN}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>No: {h.meteranPLNNo || '-'} ({h.dayaPLN || '1300 VA'})</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{h.statusPDAM}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>No: {h.meteranPDAMNo || '-'}</div>
                          </td>
                          <td>
                            <span className={`badge ${isHandoverDone ? 'badge-success' : 'badge-info'}`}>
                              {isHandoverDone ? <CheckCircle2 size={12} /> : <Clock size={12} />} {h.statusBAST}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => handleOpenPrintBast(h)} 
                                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 800, border: 'none', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                title="Cetak Dokumen BAST Serah Terima Kunci"
                              >
                                <Printer size={13} /> Cetak BAST
                              </button>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => handleOpenEditHandover(h)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                title="Edit Data BAST"
                              >
                                <Edit3 size={13} /> Edit
                              </button>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => handleDeleteHandover(h.id, h.unitNo)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}
                                title="Hapus"
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
            )}
          </div>
        );
      })()}

      {/* PILAR 3: SURVEI CSAT & REFERRAL */}
      {activeTab === 'csat' && (() => {
        const filteredReviews = reviews.filter(r => !searchCsat || [r.customer, r.comment, r.date].some(val => (val || '').toLowerCase().includes(searchCsat.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Ulasan Kepuasan Pelanggan (CSAT & NPS Ratings)</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Monitoring kepuasan konsumen perumahan, ulasan pelayanan, & testimoni.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddReview} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                <Plus size={14} /> + Tambah Ulasan Konsumen (CSAT)
              </button>
            </div>

            {/* Search Bar CSAT */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari nama konsumen, kata ulasan testimoni, tanggal rating..."
                  value={searchCsat}
                  onChange={(e) => setSearchCsat(e.target.value)}
                />
                {searchCsat && (
                  <button onClick={() => setSearchCsat('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredReviews.length}</span> dari {reviews.length} Ulasan
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Star size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada ulasan yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchCsat('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredReviews.map((r) => (
                  <div key={r.id} style={{ padding: '1.25rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{r.customer}</div>
                        <div style={{ color: '#F59E0B', fontWeight: 900, fontSize: '1.1rem' }}>{'★'.repeat(r.rating || 5)}</div>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.5 }}>"{r.comment}"</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '8px' }}>Tgl: {r.date}</div>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDeleteReview(r.id, r.customer)}
                      style={{ color: 'var(--danger)', padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      title="Hapus Testimoni"
                    >
                      <Trash2 size={13} /> Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* PILAR 4: IURAN PENGELOLAAN LINGKUNGAN (IPL) */}
      {activeTab === 'ipl' && (() => {
        const filteredIplList = iplList.filter(i => !searchIpl || [i.id, i.unitNo, i.customerName, i.month, i.status, i.amount?.toString()].some(val => (val || '').toLowerCase().includes(searchIpl.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Tagihan & Kolektibilitas IPL Lingkungan Cluster</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Manajemen iuran kebersihan, keamanan satpam 24 jam, & penerangan jalan cluster.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddIpl} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                <Plus size={14} /> + Terbitkan Tagihan IPL Baru
              </button>
            </div>

            {/* Search Bar IPL */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari no tagihan (IPL-08), nomor unit (A-01), nama penghuni, bulan, status..."
                  value={searchIpl}
                  onChange={(e) => setSearchIpl(e.target.value)}
                />
                {searchIpl && (
                  <button onClick={() => setSearchIpl('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredIplList.length}</span> dari {iplList.length} Tagihan
              </div>
            </div>

            {filteredIplList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Building2 size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada tagihan IPL yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchIpl('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>No Tagihan & Unit</th>
                      <th>Nama Penghuni</th>
                      <th>Bulan Tagihan</th>
                      <th>Nominal IPL (Rp)</th>
                      <th>Status Pembayaran</th>
                      <th>Aksi Verifikasi & Hapus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIplList.map((i) => (
                      <tr key={i.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{i.id}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Unit {i.unitNo}</div>
                        </td>
                        <td>{i.customerName}</td>
                        <td>{i.month}</td>
                        <td><div style={{ fontWeight: 800 }}>{formatRupiah(i.amount)}</div></td>
                        <td>
                          <span className={`badge ${(i.status || '').includes('LUNAS') ? 'badge-success' : 'badge-danger'}`}>
                            {i.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            {!(i.status || '').includes('LUNAS') ? (
                              <button className="btn btn-primary btn-sm" onClick={() => handlePayIPL(i.id)} style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', background: '#10B981', border: 'none' }}>
                                <CheckCircle2 size={13} /> Bayar IPL
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700 }}>Kwitansi Lunas</span>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteIpl(i.id, i.unitNo)}
                              style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              title="Hapus Tagihan IPL"
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
            )}
          </div>
        );
      })()}

      {/* PILAR 5: DOKUMEN SHM & PBG ASLI */}
      {activeTab === 'documents' && (() => {
        const filteredDocumentHandovers = documentHandovers.filter(d => !searchDoc || [d.id, d.unitNo, d.customerName, d.cluster, d.shmNo, d.pbgNo, d.polisNo, d.receiverName, d.status, d.picLegal].some(val => (val || '').toLowerCase().includes(searchDoc.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FolderCheck color="#F59E0B" size={24} /> Log & Tracking Penyerahan Berkas Asli Konsumen
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Monitoring serah terima fisik Sertifikat SHM BPN, IMB/PBG Pecahan, & Polis Asuransi KPR ke tangan pemilik rumah sah.
                </p>
              </div>

              <button className="btn btn-primary" onClick={handleOpenAddDocHandover} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none' }}>
                <Plus size={16} /> Catat Serah Terima Berkas Baru
              </button>
            </div>

            {/* KPI Mini Cards for Documents */}
            <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700 }}>Total Berkas Unit</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{documentHandovers.length} Unit</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Terdata di Buku Tanah Legal</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Lengkap & Diserahkan</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>
                  {documentHandovers.filter(d => (d.status || '').includes('Lengkap')).length} Unit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tuntas BAST Konsumen</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#3B82F6', fontWeight: 700 }}>Siap Diambil di Kantor</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#3B82F6' }}>
                  {documentHandovers.filter(d => (d.status || '').includes('Siap Diambil')).length} Unit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Undangan Pengambilan Terkirim</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#A855F7', fontWeight: 700 }}>Proses Splitzing / Vault</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#A855F7' }}>
                  {documentHandovers.filter(d => !(d.status || '').includes('Lengkap') && !(d.status || '').includes('Siap Diambil')).length} Unit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BPN & Bank KPR Mitra</div>
              </div>
            </div>

            {/* Search Bar Dokumen */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari nomor unit (A-01), nama pemilik, No SHM, PBG, Polis Asuransi, PIC..."
                  value={searchDoc}
                  onChange={(e) => setSearchDoc(e.target.value)}
                />
                {searchDoc && (
                  <button onClick={() => setSearchDoc('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredDocumentHandovers.length}</span> dari {documentHandovers.length} Berkas
              </div>
            </div>

            {filteredDocumentHandovers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <FolderCheck size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada berkas yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchDoc('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Unit & Pemilik</th>
                      <th>Sertifikat SHM Asli</th>
                      <th>PBG / IMB Pecahan</th>
                      <th>Polis Asuransi KPR</th>
                      <th>Tanggal & Penerima Berkas</th>
                      <th>Status Serah Terima</th>
                      <th>Aksi CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocumentHandovers.map((doc) => {
                      const isDone = (doc.status || '').includes('Lengkap');
                      const isReady = (doc.status || '').includes('Siap Diambil');
                      return (
                        <tr key={doc.id}>
                          <td>
                            <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {doc.unitNo}</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>{doc.customerName}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{doc.cluster} &bull; {doc.phone || '-'}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{doc.shmNo}</div>
                            <div style={{ fontSize: '0.72rem', color: isDone ? 'var(--success)' : '#F59E0B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <BadgeCheck size={12} /> {doc.shmStatus}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{doc.pbgNo}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{doc.pbgStatus}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{doc.polisNo}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{doc.polisStatus}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{doc.receiverName}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tgl: {doc.handoverDate}</div>
                            {doc.receiverNik && doc.receiverNik !== '-' && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>NIK: {doc.receiverNik}</div>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${isDone ? 'badge-success' : isReady ? 'badge-info' : 'badge-warning'}`}>
                              {isDone ? <CheckCircle2 size={12} /> : isReady ? <FolderCheck size={12} /> : <Clock size={12} />} {doc.status}
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>PIC: {doc.picLegal}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => handleOpenPrintDocBast(doc)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', background: '#10B981', border: 'none' }}
                                title="Cetak BAST Dokumen Asli"
                              >
                                <Printer size={13} /> BAST
                              </button>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => handleOpenEditDocHandover(doc)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                title="Edit Data Penyerahan"
                              >
                                <Edit3 size={13} /> Edit
                              </button>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => handleDeleteDocHandover(doc.id, doc.unitNo)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}
                                title="Hapus"
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
            )}
          </div>
        );
      })()}

      {/* PILAR 6: HELPDESK & CONSULTATION (INTERACTIVE CALL CENTER & WA DIRECT) */}
      {activeTab === 'helpdesk' && (() => {
        const filteredHelpdesk = helpdeskList.filter(h => !searchHelpdesk || [h.id, h.unitNo, h.cluster, h.customerName, h.phone, h.topic, h.channel, h.status, h.pic, h.lastMessage].some(val => (val || '').toLowerCase().includes(searchHelpdesk.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Headphones color="#38BDF8" size={24} /> 6. Pusat Layanan Helpdesk, Konsultasi KPR & WhatsApp Care
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Pusat penanganan pertanyaan konsumen cepat, konsultasi bank mitra, & pengiriman pesan langsung via WhatsApp resmi.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={handleOpenAddHelpdesk} style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800 }}>
                  <Plus size={16} /> Buat Tiket Helpdesk Baru
                </button>
              </div>
            </div>

            {/* Quick Contact & Emergency Hotline Cards */}
            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#38BDF8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhoneCall size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hotline WhatsApp Konsumen</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38BDF8' }}>0812-9988-7700</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Senin - Minggu (08:00 - 20:00)</div>
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#10B981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PIC Bantuan KPR & Legal</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981' }}>Dodi / Salma (Legal & HR)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Respon Cepat SLA &lt; 30 Menit</div>
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#F59E0B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Posko Satpam & Darurat 24 Jam</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F59E0B' }}>Pos Gerbang Utama Site</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Penjagaan & Mitigasi Lapangan</div>
                </div>
              </div>
            </div>

            {/* Search Bar Helpdesk */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari nama konsumen, unit, topik pengaduan, status, nomor WA, PIC..."
                  value={searchHelpdesk}
                  onChange={(e) => setSearchHelpdesk(e.target.value)}
                />
                {searchHelpdesk && (
                  <button onClick={() => setSearchHelpdesk('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredHelpdesk.length}</span> dari {helpdeskList.length} Antrean Helpdesk
              </div>
            </div>

            {filteredHelpdesk.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Headphones size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada tiket helpdesk yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchHelpdesk('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Konsumen & Unit</th>
                      <th>Topik Pengaduan / Pertanyaan</th>
                      <th>Saluran & Prioritas</th>
                      <th>PIC Penanggung Jawab</th>
                      <th>Status Helpdesk</th>
                      <th>Aksi & Hubungi Konsumen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHelpdesk.map((h) => {
                      const isCompleted = h.status === 'Selesai';
                      return (
                        <tr key={h.id}>
                          <td>
                            <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{h.customerName}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                              Unit {h.unitNo} &bull; {h.cluster}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{h.phone}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{h.topic}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '280px', marginTop: '2px' }}>
                              "{h.lastMessage}"
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-info" style={{ marginBottom: '4px', display: 'inline-block' }}>{h.channel}</span>
                            <div>
                              <span className={`badge ${h.priority === 'Tinggi' ? 'badge-danger' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                                Prioritas {h.priority}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{h.pic}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tgl: {h.date}</div>
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggleHelpdeskStatus(h)}
                              className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}
                              style={{ cursor: 'pointer', border: 'none', padding: '0.35rem 0.6rem' }}
                              title="Klik untuk ubah status"
                            >
                              {isCompleted ? <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '3px' }} /> : <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />}
                              {h.status}
                            </button>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSendWaDirect(h.phone, h.customerName, h.topic, h.unitNo)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', background: '#22c55e', border: 'none' }}
                                title="Kirim Pesan WhatsApp Langsung"
                              >
                                <MessageSquare size={13} /> Kirim WA
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleOpenEditHelpdesk(h)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                              >
                                <Edit3 size={13} /> Edit
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleDeleteHelpdesk(h.id, h.customerName)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}
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
            )}
          </div>
        );
      })()}

      {/* CREATE COMPLAINT TICKET MODAL */}
      {isTicketModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Buat Tiket Komplain & Garansi Retensi Baru</h3>
              <button onClick={() => setIsTicketModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTicket}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Unit Kavling (mis: A-01)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ticketForm.unitNo}
                      onChange={(e) => setTicketForm({ ...ticketForm, unitNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Konsumen Pelapor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ticketForm.customerName}
                      onChange={(e) => setTicketForm({ ...ticketForm, customerName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Kategori Komplain Keluhan</label>
                    <select
                      className="form-control"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    >
                      <option value="Kebocoran Plafon">Kebocoran Plafon / Atap</option>
                      <option value="Kusen Pintu Agak Macet">Kusen Pintu / Engsel Jendela</option>
                      <option value="Cat Dinding Mengelupas">Cat Dinding Mengelupas</option>
                      <option value="Sanitari & Pipa Air">Sanitari & Pipa Air PDAM</option>
                      <option value="Listrik & Saklar">Instalasi Listrik PLN</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kontraktor Penanggung Jawab</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ticketForm.contractorAssigned}
                      onChange={(e) => setTicketForm({ ...ticketForm, contractorAssigned: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detail Deskripsi Komplain Keluhan</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Jelaskan titik kerusakan & keluhan konsumen..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsTicketModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Terbitkan Tiket Komplain</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INPUT / EDIT SERAH TERIMA BERKAS ASLI (SHM, PBG, POLIS) */}
      {isDocHandoverModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderCheck size={20} color="#F59E0B" /> 
                {editingDocHandover ? `Update Serah Terima Berkas - Unit ${editingDocHandover.unitNo}` : 'Catat Penyerahan Berkas Asli Baru'}
              </h3>
              <button onClick={() => setIsDocHandoverModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveDocHandover}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor Unit Kavling</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: A-01"
                      value={docHandoverForm.unitNo}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, unitNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Pemilik Rumah</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Budi Santoso"
                      value={docHandoverForm.customerName}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, customerName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Kawasan / Cluster</label>
                    <select
                      className="form-control"
                      value={docHandoverForm.cluster}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, cluster: e.target.value })}
                    >
                      <option value="Cluster Emerald">Grand Harmoni - Cluster Emerald</option>
                      <option value="Cluster Sapphire">Grand Harmoni - Cluster Sapphire</option>
                      <option value="Cluster Diamond">Grand Harmoni - Cluster Diamond</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">No. WhatsApp / HP</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0812-xxxx-xxxx"
                      value={docHandoverForm.phone}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#F59E0B', fontWeight: 700 }}>Nomor SHM BPN Asli</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: SHM No. 1024/Kedungwuni"
                      value={docHandoverForm.shmNo}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, shmNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Penyerahan SHM</label>
                    <select
                      className="form-control"
                      value={docHandoverForm.shmStatus}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, shmStatus: e.target.value })}
                    >
                      <option value="Sudah Diserahkan (Lengkap)">Sudah Diserahkan ke Konsumen</option>
                      <option value="Siap Diambil di Kantor">Siap Diambil di Kantor Legal</option>
                      <option value="Dalam Proses Splitzing BPN">Dalam Proses Splitzing BPN</option>
                      <option value="Tersimpan di Bank Mitra (KPR)">Tersimpan di Bank Mitra (KPR)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ marginTop: '0.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nomor PBG / IMB Pecahan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: PBG-3326/2025/001"
                      value={docHandoverForm.pbgNo}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, pbgNo: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Dokumen PBG</label>
                    <select
                      className="form-control"
                      value={docHandoverForm.pbgStatus}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, pbgStatus: e.target.value })}
                    >
                      <option value="Sudah Diserahkan">Sudah Diserahkan</option>
                      <option value="Siap Diambil">Siap Diambil</option>
                      <option value="Tersedia di Legal">Tersedia di Legal</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor Polis Asuransi KPR</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: POL-MND-992182"
                      value={docHandoverForm.polisNo}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, polisNo: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Polis Asuransi</label>
                    <select
                      className="form-control"
                      value={docHandoverForm.polisStatus}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, polisStatus: e.target.value })}
                    >
                      <option value="Sudah Diserahkan">Sudah Diserahkan</option>
                      <option value="Tersimpan di Vault Legal">Tersimpan di Vault Legal</option>
                      <option value="Tersimpan di Bank Mitra">Tersimpan di Bank Mitra</option>
                    </select>
                  </div>
                </div>

                <div className="grid-3" style={{ marginTop: '0.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tanggal Serah Terima</label>
                    <input
                      type="date"
                      className="form-control"
                      value={docHandoverForm.handoverDate}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, handoverDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Penerima Berkas</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Konsumen / Ahli Waris"
                      value={docHandoverForm.receiverName}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, receiverName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">NIK KTP Penerima</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="3326xxxxxxxxxxxx"
                      value={docHandoverForm.receiverNik}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, receiverNik: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">PIC Penyerah (Legal/CRM)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={docHandoverForm.picLegal}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, picLegal: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Keseluruhan</label>
                    <select
                      className="form-control"
                      value={docHandoverForm.status}
                      onChange={(e) => setDocHandoverForm({ ...docHandoverForm, status: e.target.value })}
                    >
                      <option value="Lengkap & Tuntas Diserahkan">Lengkap & Tuntas Diserahkan</option>
                      <option value="Siap Diambil di Kantor Legal">Siap Diambil di Kantor Legal</option>
                      <option value="Dalam Proses Pemecahan BPN">Dalam Proses Pemecahan BPN</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan Tambahan BAST Dokumen</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Ditandatangani langsung oleh pemilik rumah di hadapan CRM"
                    value={docHandoverForm.notes}
                    onChange={(e) => setDocHandoverForm({ ...docHandoverForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDocHandoverModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                  Simpan Catatan Serah Terima
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE MODAL: BERITA ACARA SERAH TERIMA (BAST) DOKUMEN ASLI */}
      {isPrintDocBastModalOpen && selectedDocForPrint && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '850px', width: '95%', color: '#0f172a' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderCheck size={20} color="#F59E0B" />
                <h3 className="modal-title" style={{ color: '#0f172a' }}>
                  Berita Acara Serah Terima (BAST) Dokumen Asli Konsumen - Unit {selectedDocForPrint.unitNo}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => window.print()} 
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff', fontWeight: 800, border: 'none' }}
                >
                  <Printer size={16} /> Cetak / Export PDF Dokumen
                </button>
                <button onClick={() => setIsPrintDocBastModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Paper */}
            <div 
              id="printable-doc-bast-paper"
              style={{
                backgroundColor: '#ffffff',
                padding: '2.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: 1.5,
                color: '#1e293b'
              }}
            >
              {/* Kop Surat */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src="/company-logo.png" alt="Ashoka Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      PT ASHOKA ENTERPRISE DEVELOPMENT
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Divisi Customer Relation Management (CRM) & Legal Titling Perumahan
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>BAST DOKUMEN ASLI</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    NO: BAST-DOK/AMS/{selectedDocForPrint.unitNo}/2025
                  </div>
                </div>
              </div>

              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline', color: '#0f172a', margin: 0 }}>
                  BERITA ACARA SERAH TERIMA DOKUMEN & SERTIFIKAT ASLI
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
                  Bukti Penyerahan Fisik Sertifikat Hak Milik (SHM), IMB/PBG, & Polis Asuransi KPR
                </p>
              </div>

              {/* Paragraf Pembuka */}
              <p style={{ fontSize: '0.82rem', textAlign: 'justify', marginBottom: '1rem' }}>
                Pada hari ini, bertempat di Kantor Pemasaran <strong>PT Ashoka Enterprise Development</strong>, telah dilakukan serah terima berkas asli kepemilikan unit properti antara pihak developer dan pihak pemilik rumah dengan rincian sebagai berikut:
              </p>

              {/* Identitas Unit & Pemilik */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Nomor Kavling Unit</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>Unit {selectedDocForPrint.unitNo} ({selectedDocForPrint.cluster})</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Nama Pemilik Rumah</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedDocForPrint.customerName}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Nama Penerima Berkas</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedDocForPrint.receiverName || selectedDocForPrint.customerName}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.35rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>NIK KTP Penerima</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedDocForPrint.receiverNik || '-'}</span>
                </div>
              </div>

              {/* Tabel Berkas Asli */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  📋 DAFTAR FISIK DOKUMEN ASLI YANG DISERAHKAN:
                </div>
                <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px', borderRight: '1px solid #cbd5e1', width: '40px' }}>No</th>
                      <th style={{ padding: '8px', borderRight: '1px solid #cbd5e1' }}>Jenis Dokumen Properti</th>
                      <th style={{ padding: '8px', borderRight: '1px solid #cbd5e1' }}>Nomor Dokumen / Sertifikat</th>
                      <th style={{ padding: '8px', width: '120px' }}>Status Fisik</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0', textAlign: 'center' }}>1</td>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0', fontWeight: 700 }}>Sertifikat Hak Milik (SHM) Asli BPN</td>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0', fontWeight: 700 }}>{selectedDocForPrint.shmNo}</td>
                      <td style={{ padding: '8px', color: '#16a34a', fontWeight: 700 }}>✓ {selectedDocForPrint.shmStatus}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0', textAlign: 'center' }}>2</td>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0', fontWeight: 700 }}>Persetujuan Bangunan Gedung (PBG / IMB)</td>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0', fontWeight: 700 }}>{selectedDocForPrint.pbgNo}</td>
                      <td style={{ padding: '8px', color: '#16a34a', fontWeight: 700 }}>✓ {selectedDocForPrint.pbgStatus}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0', textAlign: 'center' }}>3</td>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0', fontWeight: 700 }}>Buku Polis Asuransi Jiwa & Kebakaran KPR</td>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0', fontWeight: 700 }}>{selectedDocForPrint.polisNo}</td>
                      <td style={{ padding: '8px', color: '#16a34a', fontWeight: 700 }}>✓ {selectedDocForPrint.polisStatus}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Klausul */}
              <div style={{ padding: '0.75rem', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '1.5rem', fontSize: '0.74rem', color: '#475569' }}>
                Dengan ditandatanganinya Berita Acara ini, Pihak Kedua menyatakan telah menerima dokumen asli dalam keadaan baik, lengkap, dan sah. Tanggung jawab penyimpanan dokumen fisik sepenuhnya beralih kepada Pihak Kedua.
              </div>

              {/* Tanda Tangan */}
              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '1.5rem', pageBreakInside: 'avoid' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '3.5rem' }}>
                    Yang Menyerahkan:<br />
                    <strong>PT ASHOKA ENTERPRISE DEVELOPMENT</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', textDecoration: 'underline' }}>
                    {selectedDocForPrint.picLegal}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Legal & Customer Relation Staff</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '3.5rem' }}>
                    Yang Menerima Dokumen Asli:<br />
                    <strong>Pemilik Rumah / Penerima Kuasa Sah</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', textDecoration: 'underline' }}>
                    {selectedDocForPrint.receiverName || selectedDocForPrint.customerName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Konsumen Pemilik Unit {selectedDocForPrint.unitNo}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CATAT / EDIT BAST SERAH TERIMA KUNCI & METERAN */}
      {isHandoverModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '650px', width: '95%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={20} color="#F59E0B" />
                <h3 className="modal-title">
                  {editingHandover ? `Edit BAST Serah Terima - Unit ${editingHandover.unitNo}` : 'Catat BAST Serah Terima Kunci Baru'}
                </h3>
              </div>
              <button onClick={() => setIsHandoverModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveHandover}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor Kavling Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: A-01, B-03"
                      value={handoverForm.unitNo}
                      onChange={(e) => setHandoverForm({ ...handoverForm, unitNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cluster Perumahan</label>
                    <select
                      className="form-control"
                      value={handoverForm.cluster}
                      onChange={(e) => setHandoverForm({ ...handoverForm, cluster: e.target.value })}
                    >
                      <option value="Grand Harmoni - Cluster Emerald">Grand Harmoni - Cluster Emerald</option>
                      <option value="Grand Harmoni - Cluster Sapphire">Grand Harmoni - Cluster Sapphire</option>
                      <option value="Grand Harmoni - Cluster Diamond">Grand Harmoni - Cluster Diamond</option>
                      <option value="Cluster Ruby">Cluster Ruby</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nama Pemilik Konsumen</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Lengkap Pemilik"
                      value={handoverForm.customerName}
                      onChange={(e) => setHandoverForm({ ...handoverForm, customerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">No. Telepon / WhatsApp Konsumen</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0812-xxxx-xxxx"
                      value={handoverForm.phone}
                      onChange={(e) => setHandoverForm({ ...handoverForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tipe Rumah Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 45/90 Standard"
                      value={handoverForm.tipe}
                      onChange={(e) => setHandoverForm({ ...handoverForm, tipe: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal BAST Serah Kunci</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 01 Agustus 2025"
                      value={handoverForm.bastDate}
                      onChange={(e) => setHandoverForm({ ...handoverForm, bastDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status Serah Terima Kunci (BAST)</label>
                  <select
                    className="form-control"
                    value={handoverForm.statusBAST}
                    onChange={(e) => setHandoverForm({ ...handoverForm, statusBAST: e.target.value })}
                  >
                    <option value="Selesai BAST (Kunci Diserahkan)">Selesai BAST (Kunci Diserahkan)</option>
                    <option value="Jadwal Undangan Serah Terima">Jadwal Undangan Serah Terima</option>
                    <option value="Dalam Persiapan Finishing Akhir">Dalam Persiapan Finishing Akhir</option>
                  </select>
                </div>

                <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#38BDF8', marginBottom: '0.5rem' }}>
                    ⚡ Utilitas Listrik PLN & Air PDAM
                  </div>
                  
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Status Listrik PLN</label>
                      <select
                        className="form-control"
                        value={handoverForm.statusPLN}
                        onChange={(e) => setHandoverForm({ ...handoverForm, statusPLN: e.target.value })}
                      >
                        <option value="Aktif 1300W">Aktif 1300W</option>
                        <option value="Aktif 2200W">Aktif 2200W</option>
                        <option value="Proses Pemasangan Meteran PLN">Proses Pemasangan Meteran PLN</option>
                        <option value="Pengajuan PLN Sub-station">Pengajuan PLN Sub-station</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">No. ID Pelanggan / Seri Meteran PLN</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: 5412-9900-1123"
                        value={handoverForm.meteranPLNNo}
                        onChange={(e) => setHandoverForm({ ...handoverForm, meteranPLNNo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Status Air Bersih (PDAM / WTP)</label>
                      <select
                        className="form-control"
                        value={handoverForm.statusPDAM}
                        onChange={(e) => setHandoverForm({ ...handoverForm, statusPDAM: e.target.value })}
                      >
                        <option value="Aktif PDAM Tirta">Aktif PDAM Tirta</option>
                        <option value="Proses Sambungan Pipa PDAM">Proses Sambungan Pipa PDAM</option>
                        <option value="Pipa Sambungan Induk Ready">Pipa Sambungan Induk Ready</option>
                        <option value="Sumur Bor Terpadu">Sumur Bor Terpadu</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">No. Seri Pelanggan PDAM</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: PDAM-TIRTA-8871"
                        value={handoverForm.meteranPDAMNo}
                        onChange={(e) => setHandoverForm({ ...handoverForm, meteranPDAMNo: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan Kelengkapan Serah Terima (Kunci / Remote / Garansi)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Serah terima 3 set kunci utama, kartu garansi 100 hari, & kartu IPL."
                    value={handoverForm.notes}
                    onChange={(e) => setHandoverForm({ ...handoverForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsHandoverModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                  Simpan Catatan BAST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT HELPDESK TICKET MODAL */}
      {isHelpdeskModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Headphones size={20} color="#38BDF8" />
                {editingHelpdesk ? `Edit Tiket Helpdesk: ${editingHelpdesk.id}` : 'Buat Tiket Helpdesk & Pengaduan Konsumen Baru'}
              </h3>
              <button onClick={() => setIsHelpdeskModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveHelpdesk}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nama Konsumen Pelapor</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Budi Santoso"
                      value={helpdeskForm.customerName}
                      onChange={(e) => setHelpdeskForm({ ...helpdeskForm, customerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor WhatsApp / HP</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 081299887766"
                      value={helpdeskForm.phone}
                      onChange={(e) => setHelpdeskForm({ ...helpdeskForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Unit Kavling</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: A-01"
                      value={helpdeskForm.unitNo}
                      onChange={(e) => setHelpdeskForm({ ...helpdeskForm, unitNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cluster Perumahan</label>
                    <select
                      className="form-control"
                      value={helpdeskForm.cluster}
                      onChange={(e) => setHelpdeskForm({ ...helpdeskForm, cluster: e.target.value })}
                    >
                      <option value="Cluster Emerald">Cluster Emerald</option>
                      <option value="Cluster Sapphire">Cluster Sapphire</option>
                      <option value="Cluster Diamond">Cluster Diamond</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Topik Pertanyaan / Pengaduan</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Informasi Jadwal BAST Kunci / Tagihan IPL"
                    value={helpdeskForm.topic}
                    onChange={(e) => setHelpdeskForm({ ...helpdeskForm, topic: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Saluran Kontak</label>
                    <select
                      className="form-control"
                      value={helpdeskForm.channel}
                      onChange={(e) => setHelpdeskForm({ ...helpdeskForm, channel: e.target.value })}
                    >
                      <option value="WhatsApp Care">WhatsApp Care</option>
                      <option value="Hotline Telepon">Hotline Telepon</option>
                      <option value="Portal Helpdesk">Portal Helpdesk</option>
                      <option value="Walk-in Site">Walk-in Site Gallery</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tingkat Prioritas</label>
                    <select
                      className="form-control"
                      value={helpdeskForm.priority}
                      onChange={(e) => setHelpdeskForm({ ...helpdeskForm, priority: e.target.value })}
                    >
                      <option value="Tinggi">Tinggi</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Rendah">Rendah</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Helpdesk</label>
                    <select
                      className="form-control"
                      value={helpdeskForm.status}
                      onChange={(e) => setHelpdeskForm({ ...helpdeskForm, status: e.target.value })}
                    >
                      <option value="Dalam Antrean">Dalam Antrean</option>
                      <option value="Dijawab CS">Dijawab CS</option>
                      <option value="Eskalasi Finance">Eskalasi Finance</option>
                      <option value="Diteruskan ke GA">Diteruskan ke GA</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">PIC Petugas CS</label>
                  <input
                    type="text"
                    className="form-control"
                    value={helpdeskForm.pic}
                    onChange={(e) => setHelpdeskForm({ ...helpdeskForm, pic: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rincian Pertanyaan / Pesan Konsumen</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Tuliskan isi pesan atau detail konsultasi konsumen..."
                    value={helpdeskForm.lastMessage}
                    onChange={(e) => setHelpdeskForm({ ...helpdeskForm, lastMessage: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsHelpdeskModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800 }}>
                  Simpan Tiket Helpdesk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CSAT REVIEW MODAL */}
      {isCsatModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={20} color="#F59E0B" /> Tambah Ulasan Kepuasan Konsumen (CSAT)
              </h3>
              <button onClick={() => setIsCsatModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveReview}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Konsumen & Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Budi Santoso (Unit A-01)"
                    value={csatForm.customer}
                    onChange={(e) => setCsatForm({ ...csatForm, customer: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating Kepuasan Bintang (1 - 5 Bintang)</label>
                  <select
                    className="form-control"
                    value={csatForm.rating}
                    onChange={(e) => setCsatForm({ ...csatForm, rating: Number(e.target.value) })}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang - Sangat Puas)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang - Puas)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang - Cukup)</option>
                    <option value={2}>⭐⭐ (2 Bintang - Kurang Puas)</option>
                    <option value={1}>⭐ (1 Bintang - Tidak Puas)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Testimoni & Komentar Konsumen</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Tuliskan testimoni atau ulasan konsumen..."
                    value={csatForm.comment}
                    onChange={(e) => setCsatForm({ ...csatForm, comment: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsCsatModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                  Simpan Ulasan CSAT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE IPL BILLING MODAL */}
      {isIplModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="#10B981" /> Terbitkan Tagihan IPL Warga Baru
              </h3>
              <button onClick={() => setIsIplModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveIpl}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor Kavling Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: A-01"
                      value={iplForm.unitNo}
                      onChange={(e) => setIplForm({ ...iplForm, unitNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Penghuni</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Budi Santoso"
                      value={iplForm.customerName}
                      onChange={(e) => setIplForm({ ...iplForm, customerName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Bulan Tagihan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Agustus 2025"
                      value={iplForm.month}
                      onChange={(e) => setIplForm({ ...iplForm, month: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nominal IPL (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="250000"
                      value={iplForm.amount}
                      onChange={(e) => setIplForm({ ...iplForm, amount: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status Pembayaran Awal</label>
                  <select
                    className="form-control"
                    value={iplForm.status}
                    onChange={(e) => setIplForm({ ...iplForm, status: e.target.value })}
                  >
                    <option value="Belum Bayar">Belum Bayar (Menunggu Pembayaran)</option>
                    <option value="LUNAS (Verified)">LUNAS (Verified)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsIplModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  Terbitkan Tagihan IPL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT GENERATOR BAST PRINT MODAL */}
      <DocumentGeneratorModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        docType="BAST"
        unitData={selectedBastUnitData}
      />
    </div>
  );
};
