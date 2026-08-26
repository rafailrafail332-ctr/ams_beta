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
  const { showNotification, activeSubTab, setActiveSubTab, currentUser, users, units } = useApp();
  const [activeTab, setActiveTab] = useState(activeSubTab && activeSubTab !== 'default' ? activeSubTab : 'tickets');

  const safeUnits = Array.isArray(units) && units.length > 0 ? units : [
    { no: 'A-01', cluster: 'Cluster Emerald', customer: 'Budi Santoso', phone: '0812-9988-7766' },
    { no: 'A-02', cluster: 'Cluster Emerald', customer: 'Siti Rahmawati', phone: '0812-3344-5566' },
    { no: 'A-03', cluster: 'Cluster Emerald', customer: 'Hendra Gunawan', phone: '0811-2233-4455' },
    { no: 'A-04', cluster: 'Cluster Emerald', customer: 'Dewi Lestari', phone: '0819-8877-6655' },
    { no: 'A-05', cluster: 'Cluster Emerald', customer: 'Agus Setiawan', phone: '0857-1122-3344' },
    { no: 'A-06', cluster: 'Cluster Emerald', customer: 'Rian Perdana', phone: '0813-4455-6677' },
    { no: 'B-01', cluster: 'Cluster Sapphire', customer: 'Dr. Tri Handoko', phone: '0811-2233-4455' },
    { no: 'B-02', cluster: 'Cluster Sapphire', customer: 'Bambang Sudiro', phone: '0812-5566-7788' },
    { no: 'B-03', cluster: 'Cluster Sapphire', customer: 'Maya Indah', phone: '0813-9900-1122' },
    { no: 'B-04', cluster: 'Cluster Sapphire', customer: 'Siti Aminah', phone: '0813-4455-6677' }
  ];

  const safeUsers = Array.isArray(users) && users.length > 0 ? users : [
    { id: 'USR-001', name: 'Ahmad Rafail, S.E', role: 'Direktur Utama' },
    { id: 'USR-002', name: 'Yazid Hizbullah, S.E.,S.T', role: 'Direktur Utama' },
    { id: 'USR-004', name: 'Adhi Himawan, S.E.Sy', role: 'General Manager' },
    { id: 'USR-011', name: 'Yulieka Rachmawati, S.Si', role: 'Head Marketing' },
    { id: 'USR-012', name: 'Fresda Destifani', role: 'Staf Marketing' },
    { id: 'USR-013', name: 'Amanda Amelia', role: 'Staf Marketing' },
    { id: 'USR-014', name: 'Bambang Irawan', role: 'Staf Marketing' },
    { id: 'USR-015', name: 'Syamsul Dahari', role: 'Staf Finance & CRM' },
    { id: 'USR-016', name: 'Tarkum Aditya', role: 'Staf Pajak & Keuangan' },
    { id: 'USR-017', name: 'Jezen', role: 'Staf Penagihan & Kasir' },
    { id: 'USR-018', name: 'Dodi Syaiful Nugroho', role: 'Customer Service' }
  ];

  const VENDOR_LIST = [
    'PT Bangun Jaya Perdana',
    'CV Karya Mandiri Teknik',
    'CV Sinar Abadi Konstruksi',
    'PT Tata Griya Mandiri',
    'Vendor Sanitasi & Pipa Prima',
    'Vendor Elektrikal & Panel Nusantara'
  ];

  React.useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Search & Project/Date Filter States across Customer Relation Tabs
  const [searchTicket, setSearchTicket] = useState('');
  const [searchHandover, setSearchHandover] = useState('');
  const [stkProjectFilter, setStkProjectFilter] = useState('ALL');
  const [stkDateFilter, setStkDateFilter] = useState('');
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
      id: 'TCK-001',
      unitNo: 'A-01',
      cluster: 'Cluster Emerald',
      customerName: 'Budi Santoso',
      phone: '0812-9988-7766',
      category: 'Kebocoran Plafon',
      description: 'Ada rembesan air di plafon kamar utama saat hujan deras.',
      status: 'In Progress (Perbaikan)',
      warrantyDaysLeft: 45,
      vendor: 'PT Bangun Jaya Perdana',
      contractorAssigned: 'PT Bangun Jaya Perdana',
      tanggalKomplain: '2025-08-01',
      tanggalInput: '2025-08-01',
      inputBy: 'Syamsul Dahari',
      targetCompletion: '2025-08-15'
    },
    {
      id: 'TCK-002',
      unitNo: 'A-06',
      cluster: 'Cluster Emerald',
      customerName: 'Rian Perdana',
      phone: '0813-4455-6677',
      category: 'Kusen Pintu Agak Macet',
      description: 'Engsel pintu kamar mandi perlu distel kencang.',
      status: 'Completed (Selesai)',
      warrantyDaysLeft: 90,
      vendor: 'PT Bangun Jaya Perdana',
      contractorAssigned: 'PT Bangun Jaya Perdana',
      tanggalKomplain: '2025-07-25',
      tanggalInput: '2025-07-25',
      inputBy: 'Tarkum Aditya',
      targetCompletion: '2025-07-28'
    },
    {
      id: 'TCK-003',
      unitNo: 'B-01',
      cluster: 'Cluster Sapphire',
      customerName: 'Dr. Tri Handoko',
      phone: '0811-2233-4455',
      category: 'Cat Dinding Mengelupas',
      description: 'Dinding teras depan mengelupas karena lembab.',
      status: 'Pending (Disposisi)',
      warrantyDaysLeft: 120,
      vendor: 'CV Karya Mandiri Teknik',
      contractorAssigned: 'CV Karya Mandiri Teknik',
      tanggalKomplain: '2025-08-10',
      tanggalInput: '2025-08-10',
      inputBy: 'Fresda Destifani',
      targetCompletion: '2025-08-18'
    }
  ];

  const getSavedTickets = () => {
    try {
      const saved = localStorage.getItem('ams_cr_tickets_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const old = localStorage.getItem('ams_cr_tickets_v3');
      if (old) {
        const parsedOld = JSON.parse(old);
        if (Array.isArray(parsedOld) && parsedOld.length > 0) {
          return parsedOld.map((t, idx) => ({
            ...t,
            id: t.id ? t.id.replace('CR-TCK-', 'TCK-') : `TCK-${String(idx + 1).padStart(3, '0')}`,
            vendor: t.vendor || t.contractorAssigned || 'PT Bangun Jaya Perdana',
            contractorAssigned: t.vendor || t.contractorAssigned || 'PT Bangun Jaya Perdana',
            tanggalKomplain: t.tanggalKomplain || t.reportDate || '2025-08-01',
            tanggalInput: t.tanggalInput || t.reportDate || '2025-08-01',
            inputBy: t.inputBy || 'Customer Relation (Admin)'
          }));
        }
      }
    } catch (e) {}
    return initialTickets;
  };

  const [tickets, setTickets] = useState(getSavedTickets);

  React.useEffect(() => {
    try {
      localStorage.setItem('ams_cr_tickets_v4', JSON.stringify(tickets));
    } catch (e) {}
  }, [tickets]);

  // Helper Check Role: Khusus Pak Yazid (Direktur Utama / Super Admin) dan Manager (General Manager / Manager / Adhi Himawan)
  const isManagerOrYazidOrAdmin = () => {
    if (!currentUser) return false;
    const r = (currentUser.role || '').toLowerCase();
    const name = (currentUser.name || '').toLowerCase();
    const email = (currentUser.email || '').toLowerCase();

    // 1. Pak Yazid & Direktur / Super Admin
    const isYazidOrAdmin = r.includes('super admin') || r.includes('direktur') || name.includes('yazid') || name.includes('rafail') || email.includes('yazid');

    // 2. Manager (General Manager / Adhi Himawan / Manager / GM)
    const isManager = r.includes('general manager') || r.includes('manager') || r.includes('gm') || name.includes('adhi') || email.includes('adhi');

    return isYazidOrAdmin || isManager;
  };

  const canDeleteTicket = isManagerOrYazidOrAdmin();

  const handleDeleteTicket = (id, customerName) => {
    if (!canDeleteTicket) {
      showNotification('Akses Terbatas: Hanya Pak Yazid (Direktur Utama) dan General Manager yang berhak menghapus data tiket komplain!', 'danger');
      return;
    }
    if (window.confirm(`Hapus tiket komplain ${id} (${customerName})? Tindakan ini hanya dapat dilakukan oleh Pak Yazid dan Manager.`)) {
      setTickets(prev => prev.filter(t => t.id !== id));
      showNotification(`Tiket komplain ${id} untuk ${customerName} berhasil dihapus oleh pimpinan.`, 'warning');
    }
  };

  // Pillar 2: BAST Handover (STK - Serah Terima Kunci) Checklist & Data Store
  const initialHandovers = [
    {
      id: 'BAST-001',
      proyek: 'Ashoka Park',
      tglStk: '2025-08-01',
      bastDate: '01 Agustus 2025',
      customerName: 'Budi Santoso',
      blok: 'A',
      no: '01',
      unitNo: 'A-01',
      type: 'Type 45',
      lbLt: '45/90',
      phone: '0812-9988-7766',
      cluster: 'Grand Harmoni - Cluster Emerald',
      checkListrik: 'ok',
      checkAir: 'ok',
      checkPengecatan: 'ok',
      checkHandelPintu: 'ok',
      checkSanitari: 'ok',
      checkKebersihan: 'ok',
      statusBAST: 'Selesai BAST (Kunci Diserahkan)',
      notes: 'Serah terima 3 set kunci utama, kartu garansi retensi 100 hari, seluruh pengecekan fisik tuntas ok.'
    },
    {
      id: 'BAST-002',
      proyek: 'Ashoka Park',
      tglStk: '2025-08-25',
      bastDate: '25 Agustus 2025',
      customerName: 'Siti Rahmawati',
      blok: 'A',
      no: '02',
      unitNo: 'A-02',
      type: 'Type 45',
      lbLt: '45/90',
      phone: '0812-3344-5566',
      cluster: 'Grand Harmoni - Cluster Emerald',
      checkListrik: 'ok',
      checkAir: 'ok',
      checkPengecatan: 'ok',
      checkHandelPintu: 'ok',
      checkSanitari: 'ok',
      checkKebersihan: 'ok',
      statusBAST: 'Jadwal Undangan Serah Terima',
      notes: 'Undangan resmi serah terima kunci telah terkirim via WhatsApp Customer Care.'
    },
    {
      id: 'BAST-003',
      proyek: 'Ashoka View',
      tglStk: '2025-07-28',
      bastDate: '28 Juli 2025',
      customerName: 'Rian Perdana',
      blok: 'A',
      no: '06',
      unitNo: 'A-06',
      type: 'Type 60',
      lbLt: '60/120',
      phone: '0813-4455-6677',
      cluster: 'Grand Harmoni - Cluster Emerald',
      checkListrik: 'ok',
      checkAir: 'ok',
      checkPengecatan: 'ok',
      checkHandelPintu: 'ok',
      checkSanitari: 'ok',
      checkKebersihan: 'ok',
      statusBAST: 'Selesai BAST (Kunci Diserahkan)',
      notes: 'Serah terima kunci lengkap tuntas, rumah dihuni langsung oleh konsumen.'
    },
    {
      id: 'BAST-004',
      proyek: 'Ashoka View',
      tglStk: '2025-09-15',
      bastDate: '15 September 2025',
      customerName: 'Dr. Tri Handoko',
      blok: 'B',
      no: '01',
      unitNo: 'B-01',
      type: 'Type 75',
      lbLt: '75/150',
      phone: '0811-2233-4455',
      cluster: 'Grand Harmoni - Cluster Sapphire',
      checkListrik: 'pending',
      checkAir: 'ok',
      checkPengecatan: 'cek',
      checkHandelPintu: 'ok',
      checkSanitari: 'ok',
      checkKebersihan: 'pending',
      statusBAST: 'Dalam Persiapan Finishing Akhir',
      notes: 'Finishing cat teras dan instalasi carport sedang diselesaikan oleh kontraktor.'
    }
  ];

  const getSavedHandovers = () => {
    try {
      const saved = localStorage.getItem('ams_bast_handovers_table_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const old = localStorage.getItem('ams_bast_handovers_table_v3') || localStorage.getItem('ams_bast_handovers_clean_v2');
      if (old) {
        const parsedOld = JSON.parse(old);
        if (Array.isArray(parsedOld) && parsedOld.length > 0) {
          return parsedOld.map(h => {
            const parts = (h.unitNo || 'A-01').split('-');
            const blok = parts[0] || 'A';
            const no = parts[1] || '01';
            return {
              ...h,
              proyek: h.proyek || (blok === 'B' ? 'Ashoka View' : 'Ashoka Park'),
              tglStk: h.tglStk || h.bastDate || '2025-08-01',
              blok: h.blok || blok,
              no: h.no || no,
              type: h.type || h.tipe || 'Type 45',
              lbLt: h.lbLt || (h.tipe && h.tipe.includes('/') ? h.tipe.split(' ')[0] : '45/90'),
              checkListrik: h.checkListrik || 'ok',
              checkAir: h.checkAir || 'ok',
              checkPengecatan: h.checkPengecatan || 'ok',
              checkHandelPintu: h.checkHandelPintu || h.checkPintu || 'ok',
              checkSanitari: h.checkSanitari || 'ok',
              checkKebersihan: h.checkKebersihan || 'ok'
            };
          });
        }
      }
    } catch (e) {}
    return initialHandovers;
  };

  const [handovers, setHandovers] = useState(getSavedHandovers);

  React.useEffect(() => {
    try {
      localStorage.setItem('ams_bast_handovers_table_v4', JSON.stringify(handovers));
    } catch (e) {}
  }, [handovers]);

  // Modal State for BAST Handover Add/Edit
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [editingHandover, setEditingHandover] = useState(null);
  const [handoverForm, setHandoverForm] = useState({
    proyek: 'Ashoka Park',
    tglStk: new Date().toISOString().split('T')[0],
    customerName: '',
    blok: 'A',
    no: '01',
    unitNo: 'A-01',
    type: 'Type 45',
    lbLt: '45/90',
    phone: '',
    cluster: 'Grand Harmoni - Cluster Emerald',
    checkListrik: 'ok',
    checkAir: 'ok',
    checkPengecatan: 'ok',
    checkHandelPintu: 'ok',
    checkSanitari: 'ok',
    checkKebersihan: 'ok',
    statusBAST: 'Selesai BAST (Kunci Diserahkan)',
    notes: ''
  });

  const handleOpenAddHandover = () => {
    setEditingHandover(null);
    const firstUnit = safeUnits[0]?.no || 'A-01';
    const parts = firstUnit.split('-');
    const matchedCustomer = safeUnits[0]?.customer || 'Budi Santoso';
    const matchedPhone = safeUnits[0]?.phone || '0812-9988-7766';

    setHandoverForm({
      proyek: parts[0] === 'B' ? 'Ashoka View' : 'Ashoka Park',
      tglStk: new Date().toISOString().split('T')[0],
      customerName: matchedCustomer,
      blok: parts[0] || 'A',
      no: parts[1] || '01',
      unitNo: firstUnit,
      type: 'Type 45',
      lbLt: '45/90',
      phone: matchedPhone,
      cluster: 'Grand Harmoni - Cluster Emerald',
      checkListrik: 'ok',
      checkAir: 'ok',
      checkPengecatan: 'ok',
      checkHandelPintu: 'ok',
      checkSanitari: 'ok',
      checkKebersihan: 'ok',
      statusBAST: 'Selesai BAST (Kunci Diserahkan)',
      notes: 'Pemeriksaan fisik unit selesai, siap serah terima kunci.'
    });
    setIsHandoverModalOpen(true);
  };

  const handleOpenEditHandover = (h) => {
    setEditingHandover(h);
    const parts = (h.unitNo || 'A-01').split('-');
    setHandoverForm({
      proyek: h.proyek || (parts[0] === 'B' ? 'Ashoka View' : 'Ashoka Park'),
      tglStk: h.tglStk || h.bastDate || new Date().toISOString().split('T')[0],
      customerName: h.customerName || '',
      blok: h.blok || parts[0] || 'A',
      no: h.no || parts[1] || '01',
      unitNo: h.unitNo || `${parts[0] || 'A'}-${parts[1] || '01'}`,
      type: h.type || h.tipe || 'Type 45',
      lbLt: h.lbLt || '45/90',
      phone: h.phone || '',
      cluster: h.cluster || 'Grand Harmoni - Cluster Emerald',
      checkListrik: h.checkListrik || 'ok',
      checkAir: h.checkAir || 'ok',
      checkPengecatan: h.checkPengecatan || 'ok',
      checkHandelPintu: h.checkHandelPintu || h.checkPintu || 'ok',
      checkSanitari: h.checkSanitari || 'ok',
      checkKebersihan: h.checkKebersihan || 'ok',
      statusBAST: h.statusBAST || 'Selesai BAST (Kunci Diserahkan)',
      notes: h.notes || ''
    });
    setIsHandoverModalOpen(true);
  };

  const handleSaveHandover = (e) => {
    e.preventDefault();
    const computedUnitNo = `${handoverForm.blok}-${handoverForm.no}`;
    const payload = {
      ...handoverForm,
      unitNo: computedUnitNo,
      bastDate: handoverForm.tglStk
    };

    if (editingHandover) {
      setHandovers(handovers.map(h => h.id === editingHandover.id ? { ...h, ...payload } : h));
      showNotification(`BAST STK Unit ${computedUnitNo} (${handoverForm.customerName}) berhasil diperbarui!`, 'success');
    } else {
      const newHo = {
        id: `BAST-00${handovers.length + 1}`,
        ...payload
      };
      setHandovers([newHo, ...handovers]);
      showNotification(`Data BAST Serah Terima Kunci Unit ${computedUnitNo} berhasil dicatat!`, 'success');
    }
    setIsHandoverModalOpen(false);
  };

  const handleDeleteHandover = (id, unitNo) => {
    if (!canDeleteTicket) {
      showNotification('Akses Terbatas: Hanya Pak Yazid (Direktur Utama) dan General Manager yang berhak menghapus data BAST!', 'danger');
      return;
    }
    if (window.confirm(`Hapus catatan BAST Serah Terima Kunci Unit ${unitNo}? Tindakan ini hanya dapat dilakukan oleh Pak Yazid dan Manager.`)) {
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

  // Modal State for New/Edit Complaint Ticket (Pilar 1)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    ticketNo: 'TCK-001',
    unitNo: 'A-01',
    customerName: 'Budi Santoso',
    phone: '0812-9988-7766',
    category: 'Kebocoran Plafon',
    description: '',
    vendor: 'PT Bangun Jaya Perdana',
    tanggalKomplain: new Date().toISOString().split('T')[0],
    tanggalInput: new Date().toISOString().split('T')[0],
    inputBy: ''
  });

  const handleOpenAddTicket = () => {
    setEditingTicket(null);
    const nextSeq = tickets.length + 1;
    const nextTicketId = `TCK-${String(nextSeq).padStart(3, '0')}`;
    const firstUnit = safeUnits[0]?.no || 'A-01';
    const matchedCustomer = safeUnits[0]?.customer || 'Budi Santoso';
    const defaultInputName = currentUser?.name || safeUsers[0]?.name || 'Syamsul Dahari';

    setTicketForm({
      ticketNo: nextTicketId,
      unitNo: firstUnit,
      customerName: matchedCustomer,
      phone: matchedPhone,
      category: 'Kebocoran Plafon',
      description: '',
      vendor: 'PT Bangun Jaya Perdana',
      tanggalKomplain: new Date().toISOString().split('T')[0],
      tanggalInput: new Date().toISOString().split('T')[0],
      inputBy: defaultInputName
    });
    setIsTicketModalOpen(true);
  };

  const handleOpenEditTicket = (t) => {
    setEditingTicket(t);
    setTicketForm({
      ticketNo: t.id,
      unitNo: t.unitNo || 'A-01',
      customerName: t.customerName || '',
      phone: t.phone || '',
      category: t.category || 'Kebocoran Plafon',
      description: t.description || '',
      vendor: t.vendor || t.contractorAssigned || 'PT Bangun Jaya Perdana',
      tanggalKomplain: t.tanggalKomplain || t.reportDate || new Date().toISOString().split('T')[0],
      tanggalInput: t.tanggalInput || t.reportDate || new Date().toISOString().split('T')[0],
      inputBy: t.inputBy || currentUser?.name || 'Syamsul Dahari'
    });
    setIsTicketModalOpen(true);
  };

  const handleSaveTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.description.trim()) return;

    if (editingTicket) {
      setTickets(tickets.map(t => {
        if (t.id === editingTicket.id) {
          return {
            ...t,
            unitNo: ticketForm.unitNo,
            customerName: ticketForm.customerName,
            phone: ticketForm.phone,
            category: ticketForm.category,
            description: ticketForm.description,
            vendor: ticketForm.vendor,
            contractorAssigned: ticketForm.vendor,
            tanggalKomplain: ticketForm.tanggalKomplain,
            tanggalInput: ticketForm.tanggalInput,
            inputBy: ticketForm.inputBy
          };
        }
        return t;
      }));
      showNotification(`Tiket ${editingTicket.id} berhasil diperbarui!`, 'success');
    } else {
      const nextSeq = tickets.length + 1;
      const finalId = ticketForm.ticketNo || `TCK-${String(nextSeq).padStart(3, '0')}`;
      const newTck = {
        id: finalId,
        cluster: 'Cluster Emerald',
        status: 'Pending (Disposisi)',
        warrantyDaysLeft: 90,
        targetCompletion: '2025-09-15',
        unitNo: ticketForm.unitNo,
        customerName: ticketForm.customerName,
        phone: ticketForm.phone,
        category: ticketForm.category,
        description: ticketForm.description,
        vendor: ticketForm.vendor,
        contractorAssigned: ticketForm.vendor,
        tanggalKomplain: ticketForm.tanggalKomplain,
        tanggalInput: ticketForm.tanggalInput,
        inputBy: ticketForm.inputBy || (currentUser?.name ? `${currentUser.name} (${currentUser.role || 'Staf'})` : 'Customer Relation')
      };
      setTickets([newTck, ...tickets]);
      showNotification(`Tiket Keluhan ${newTck.id} berhasil dicatat oleh ${newTck.inputBy}!`, 'success');
    }
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

        <button className="btn btn-primary" onClick={handleOpenAddTicket}>
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
          <KeyRound size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. STK ({handovers.length})
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
        const filteredTickets = tickets.filter(t => !searchTicket || [t.id, t.unitNo, t.cluster, t.customerName, t.phone, t.category, t.description, t.vendor, t.contractorAssigned, t.inputBy, t.status].some(val => (val || '').toLowerCase().includes(searchTicket.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Daftar Tiket Keluhan & Pemeliharaan Garansi Retensi</h3>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddTicket}>
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
                  placeholder="Cari no tiket, kavling unit, nama konsumen, vendor, petugas input..."
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
                      <th style={{ width: '45px', textAlign: 'center' }}>No</th>
                      <th style={{ width: '130px' }}>No Tiket & Unit</th>
                      <th style={{ width: '155px' }}>Tanggal Komplain & Input</th>
                      <th style={{ width: '160px' }}>Konsumen & WA</th>
                      <th>Kategori & Deskripsi Keluhan</th>
                      <th style={{ width: '160px' }}>Vendor</th>
                      <th style={{ width: '150px' }}>Petugas Input</th>
                      <th style={{ width: '135px', textAlign: 'center' }}>Status & Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((t, idx) => (
                      <tr key={t.id || idx}>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--text-muted)' }}>
                          {idx + 1}
                        </td>
                        <td>
                          <div style={{ fontWeight: 900, color: 'var(--accent-primary)', fontSize: '0.85rem' }}>{t.id}</div>
                          <span className="badge badge-secondary" style={{ fontSize: '0.72rem', fontWeight: 800, marginTop: '3px', display: 'inline-block' }}>
                            Unit {t.unitNo}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#F59E0B', fontSize: '0.78rem' }}>
                            📅 Komplain: {t.tanggalKomplain || t.reportDate || '-'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            ⏱️ Input: {t.tanggalInput || t.reportDate || '-'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.customerName}</div>
                          <div 
                            style={{ fontSize: '0.72rem', color: '#10B981', cursor: 'pointer', marginTop: '2px', fontWeight: 600 }}
                            onClick={() => handleSendWaDirect(t.phone, t.customerName, t.category, t.unitNo)}
                            title="Klik untuk chat WhatsApp ke konsumen"
                          >
                            📱 {t.phone}
                          </div>
                        </td>
                        <td>
                          <div>
                            <span className="badge badge-warning" style={{ fontSize: '0.72rem', fontWeight: 800 }}>{t.category}</span>
                          </div>
                          <div style={{ fontSize: '0.825rem', marginTop: '4px', lineHeight: 1.4 }}>{t.description}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', display: 'inline-block' }}>
                            🔧 {t.vendor || t.contractorAssigned || 'PT Bangun Jaya Perdana'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', display: 'inline-block' }}>
                            👤 {t.inputBy || 'Customer Relation'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {(t.status || '').includes('Completed') ? (
                              <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem' }}>
                                <CheckCircle2 size={12} /> Selesai
                              </span>
                            ) : (
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => handleCompleteTicket(t.id)} 
                                style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem' }}
                                title="Tandai Selesai"
                              >
                                <CheckCircle2 size={12} /> Selesai
                              </button>
                            )}

                            {/* Tombol Edit (Tersedia untuk Seluruh Staf & Pimpinan) */}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditTicket(t)}
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                              title="Edit Data Tiket Komplain"
                            >
                              <Edit3 size={12} /> Edit
                            </button>

                            {/* Tombol Hapus (KHUSUS PAK YAZID & MANAGER) */}
                            {canDeleteTicket ? (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleDeleteTicket(t.id, t.customerName)}
                                style={{ color: 'var(--danger)', padding: '0.2rem 0.45rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                                title="Hapus Tiket Komplain (Akses Pak Yazid & Manager)"
                              >
                                <Trash2 size={12} /> Hapus
                              </button>
                            ) : (
                              <span 
                                style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '2px 4px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}
                                title="Akses Hapus hanya untuk Pak Yazid (Direktur) & Manager"
                              >
                                🔒 Kunci Hapus
                              </span>
                            )}
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

      {/* PILAR 2: STK (SERAH TERIMA KUNCI) & CHECKLIST FISIK */}
      {activeTab === 'handover' && (() => {
        const filteredHandovers = handovers.filter(h => {
          // 1. Search text filter
          const matchSearch = !searchHandover || [
            h.id, h.unitNo, h.customerName, h.cluster, h.proyek, h.tglStk, h.bastDate, h.blok, h.no, h.type, h.lbLt, h.phone,
            h.statusBAST, h.notes
          ].some(val => (val || '').toLowerCase().includes(searchHandover.toLowerCase().trim()));

          // 2. Project filter
          const pStr = (h.proyek || h.cluster || '').toLowerCase();
          const matchProject = stkProjectFilter === 'ALL' || (
            stkProjectFilter === 'Ashoka Park' ? pStr.includes('park') || pStr.includes('emerald') :
            stkProjectFilter === 'Ashoka View' ? pStr.includes('view') || pStr.includes('sapphire') :
            pStr.includes(stkProjectFilter.toLowerCase())
          );

          // 3. Date filter
          let matchDate = true;
          if (stkDateFilter) {
            const rawDate = h.tglStk || h.bastDate || '';
            matchDate = rawDate.includes(stkDateFilter) || (h.tglStk && h.tglStk === stkDateFilter);
          }

          return matchSearch && matchProject && matchDate;
        });

        return (
          <div className="glass-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <KeyRound color="#b8860b" size={24} /> Manajemen STK (Serah Terima Kunci) & Checklist Fisik
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Pusat pencatatan data serah terima kunci (STK), pemeriksaan fisik unit properti (Listrik, Air, Cat, Pintu, Sanitari, Kebersihan), & pencetakan dokumen.
                </p>
              </div>

              <button className="btn btn-primary" onClick={handleOpenAddHandover} style={{ background: 'linear-gradient(135deg, #b8860b, #d4af37)', border: 'none', fontWeight: 800, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(184, 134, 11, 0.3)' }}>
                <Plus size={18} /> Input Data STK
              </button>
            </div>

            {/* KPI Mini Cards for STK */}
            <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(184, 134, 11, 0.1)', border: '1px solid rgba(184, 134, 11, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#b8860b', fontWeight: 700 }}>Total Unit STK</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{handovers.length} Unit</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Portofolio Serah Kunci</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Kunci Diserahkan</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>
                  {handovers.filter(h => (h.statusBAST || '').includes('Selesai')).length} Unit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Rumah Siap & Dihuni Warga</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#3B82F6', fontWeight: 700 }}>Ashoka Park</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#3B82F6' }}>
                  {handovers.filter(h => (h.proyek || '').toLowerCase().includes('park') || (h.cluster || '').toLowerCase().includes('emerald')).length} Unit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Proyek Kawasan 1</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700 }}>Ashoka View</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F59E0B' }}>
                  {handovers.filter(h => (h.proyek || '').toLowerCase().includes('view') || (h.cluster || '').toLowerCase().includes('sapphire')).length} Unit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Proyek Kawasan 2</div>
              </div>
            </div>

            {/* Filter Toolbar: Project Chips + Date Filter + Search Bar (Just like Todo List) */}
            <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* Row 1: Proyek Chips Filter & Date Filter */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginRight: '4px' }}>
                    🏢 Filter Proyek:
                  </span>
                  
                  <button 
                    type="button"
                    onClick={() => setStkProjectFilter('ALL')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: stkProjectFilter === 'ALL' ? '2px solid #b8860b' : '1px solid var(--border-color)',
                      background: stkProjectFilter === 'ALL' ? '#b8860b' : 'rgba(255,255,255,0.05)',
                      color: stkProjectFilter === 'ALL' ? '#ffffff' : 'var(--text-main)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Semua Proyek ({handovers.length})
                  </button>

                  <button 
                    type="button"
                    onClick={() => setStkProjectFilter('Ashoka Park')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: stkProjectFilter === 'Ashoka Park' ? '2px solid #10B981' : '1px solid rgba(16, 185, 129, 0.3)',
                      background: stkProjectFilter === 'Ashoka Park' ? '#10B981' : 'rgba(16, 185, 129, 0.1)',
                      color: stkProjectFilter === 'Ashoka Park' ? '#ffffff' : '#10B981',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🌳 Ashoka Park ({handovers.filter(h => (h.proyek || '').toLowerCase().includes('park') || (h.cluster || '').toLowerCase().includes('emerald')).length})
                  </button>

                  <button 
                    type="button"
                    onClick={() => setStkProjectFilter('Ashoka View')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: stkProjectFilter === 'Ashoka View' ? '2px solid #F59E0B' : '1px solid rgba(245, 158, 11, 0.3)',
                      background: stkProjectFilter === 'Ashoka View' ? '#F59E0B' : 'rgba(245, 158, 11, 0.1)',
                      color: stkProjectFilter === 'Ashoka View' ? '#ffffff' : '#F59E0B',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🏔️ Ashoka View ({handovers.filter(h => (h.proyek || '').toLowerCase().includes('view') || (h.cluster || '').toLowerCase().includes('sapphire')).length})
                  </button>
                </div>

                {/* Right: Date Filter & Reset Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-card)', padding: '3px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>📅 Tgl STK:</span>
                    <input 
                      type="date"
                      value={stkDateFilter}
                      onChange={(e) => setStkDateFilter(e.target.value)}
                      style={{ fontSize: '0.78rem', padding: '2px 4px', border: 'none', background: 'transparent', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }}
                    />
                    {stkDateFilter && (
                      <button onClick={() => setStkDateFilter('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} title="Hapus filter tanggal">
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {(searchHandover || stkProjectFilter !== 'ALL' || stkDateFilter) && (
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => { setSearchHandover(''); setStkProjectFilter('ALL'); setStkDateFilter(''); }}
                      style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--danger)' }}
                      title="Reset semua filter"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                  <Search size={16} color="#b8860b" />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '34px', fontSize: '0.85rem' }}
                    placeholder="Cari nomor unit (A-01), nama konsumen, blok, type rumah, no HP/WA..."
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
                  Menampilkan <span style={{ color: '#b8860b', fontWeight: 800 }}>{filteredHandovers.length}</span> dari {handovers.length} Unit STK
                </div>
              </div>

            </div>

            {filteredHandovers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <KeyRound size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada data STK yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba ubah tanggal, proyek, atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => { setSearchHandover(''); setStkProjectFilter('ALL'); setStkDateFilter(''); }} style={{ marginTop: '0.75rem' }}>
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(184, 134, 11, 0.4)' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '950px' }}>
                  <thead>
                    <tr style={{ background: '#b8860b', color: '#ffffff', textAlign: 'center' }}>
                      <th rowSpan={2} style={{ background: '#b8860b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 8px', verticalAlign: 'middle', fontWeight: 800, minWidth: '95px', textAlign: 'center' }}>Tgl STK</th>
                      <th rowSpan={2} style={{ background: '#b8860b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 8px', verticalAlign: 'middle', fontWeight: 800, minWidth: '140px' }}>Nama Konsumen</th>
                      <th rowSpan={2} style={{ background: '#b8860b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 8px', verticalAlign: 'middle', fontWeight: 800, minWidth: '50px', textAlign: 'center' }}>Blok</th>
                      <th rowSpan={2} style={{ background: '#b8860b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 8px', verticalAlign: 'middle', fontWeight: 800, minWidth: '50px', textAlign: 'center' }}>No.</th>
                      <th rowSpan={2} style={{ background: '#b8860b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 8px', verticalAlign: 'middle', fontWeight: 800, minWidth: '80px', textAlign: 'center' }}>Type</th>
                      <th rowSpan={2} style={{ background: '#b8860b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 8px', verticalAlign: 'middle', fontWeight: 800, minWidth: '80px', textAlign: 'center' }}>LB/LT</th>
                      <th rowSpan={2} style={{ background: '#b8860b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 8px', verticalAlign: 'middle', fontWeight: 800, minWidth: '130px' }}>No. HP / WA</th>
                      <th colSpan={6} style={{ background: '#b8860b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '8px', textAlign: 'center', fontWeight: 800, letterSpacing: '1px' }}>pengecekan</th>
                      <th rowSpan={2} style={{ background: '#b8860b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 8px', verticalAlign: 'middle', fontWeight: 800, minWidth: '120px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                    <tr style={{ background: '#a0780a', color: '#ffffff', textAlign: 'center' }}>
                      <th style={{ background: '#a0780a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 4px', fontWeight: 700, fontSize: '0.78rem', width: '85px', minWidth: '85px', textAlign: 'center' }}>Listrik</th>
                      <th style={{ background: '#a0780a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 4px', fontWeight: 700, fontSize: '0.78rem', width: '85px', minWidth: '85px', textAlign: 'center' }}>Air</th>
                      <th style={{ background: '#a0780a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 4px', fontWeight: 700, fontSize: '0.78rem', width: '95px', minWidth: '95px', textAlign: 'center' }}>Pengecatan</th>
                      <th style={{ background: '#a0780a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 4px', fontWeight: 700, fontSize: '0.78rem', width: '100px', minWidth: '100px', textAlign: 'center' }}>Handel Pintu</th>
                      <th style={{ background: '#a0780a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 4px', fontWeight: 700, fontSize: '0.78rem', width: '85px', minWidth: '85px', textAlign: 'center' }}>Sanitari</th>
                      <th style={{ background: '#a0780a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 4px', fontWeight: 700, fontSize: '0.78rem', width: '95px', minWidth: '95px', textAlign: 'center' }}>Kebersihan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHandovers.map((h, idx) => {
                      const formatNumericDate = (val) => {
                        if (!val) return '-';
                        const clean = String(val).trim();
                        if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
                          const [y, m, d] = clean.split('-');
                          return `${d}/${m}/${y}`;
                        }
                        const months = {
                          'januari': '01', 'jan': '01',
                          'februari': '02', 'feb': '02',
                          'maret': '03', 'mar': '03',
                          'april': '04', 'apr': '04',
                          'mei': '05', 'may': '05',
                          'juni': '06', 'jun': '06',
                          'juli': '07', 'jul': '07',
                          'agustus': '08', 'aug': '08', 'ags': '08',
                          'september': '09', 'sep': '09',
                          'oktober': '10', 'okt': '10', 'oct': '10',
                          'november': '11', 'nov': '11',
                          'desember': '12', 'des': '12', 'dec': '12'
                        };
                        const parts = clean.toLowerCase().replace(/,/g, '').split(' ').filter(Boolean);
                        if (parts.length === 3) {
                          const d = parts[0].padStart(2, '0');
                          const m = months[parts[1]] || '01';
                          const y = parts[2];
                          return `${d}/${m}/${y}`;
                        }
                        return clean;
                      };

                      const renderCheckBadge = (val) => {
                        const v = (val || 'ok').toLowerCase().trim();
                        if (v === 'ok' || v === 'baik' || v === 'siap' || v === 'bersih' || v === 'nyala') {
                          return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                              <span style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                width: '42px', 
                                height: '24px', 
                                borderRadius: '4px', 
                                background: 'rgba(16, 185, 129, 0.12)', 
                                color: '#059669', 
                                fontWeight: 800, 
                                fontSize: '0.78rem',
                                textTransform: 'lowercase',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}>
                                ok
                              </span>
                            </div>
                          );
                        }
                        if (v.includes('pending') || v.includes('belum')) {
                          return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                              <span style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                minWidth: '54px', 
                                height: '24px', 
                                padding: '0 6px',
                                borderRadius: '4px', 
                                background: 'rgba(239, 68, 68, 0.12)', 
                                color: '#dc2626', 
                                fontWeight: 800, 
                                fontSize: '0.74rem',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}>
                                pending
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              minWidth: '42px', 
                              height: '24px', 
                              padding: '0 6px',
                              borderRadius: '4px', 
                              background: 'rgba(245, 158, 11, 0.12)', 
                              color: '#d97706', 
                              fontWeight: 800, 
                              fontSize: '0.74rem',
                              textAlign: 'center',
                              boxSizing: 'border-box'
                            }}>
                              {val}
                            </span>
                          </div>
                        );
                      };

                      return (
                        <tr key={h.id || idx}>
                          <td style={{ fontWeight: 800, fontSize: '0.82rem', whiteSpace: 'nowrap', textAlign: 'center', verticalAlign: 'middle', letterSpacing: '0.3px' }}>
                            {formatNumericDate(h.tglStk || h.bastDate)}
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{h.customerName}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{h.proyek || h.cluster || ''}</div>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--accent-primary)', verticalAlign: 'middle' }}>
                            {h.blok || (h.unitNo ? h.unitNo.split('-')[0] : 'A')}
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 800, verticalAlign: 'middle' }}>
                            {h.no || (h.unitNo ? h.unitNo.split('-')[1] : '01')}
                          </td>
                          <td style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, verticalAlign: 'middle' }}>
                            {h.type || h.tipe || 'Type 45'}
                          </td>
                          <td style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, verticalAlign: 'middle' }}>
                            {h.lbLt || '45/90'}
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div 
                              style={{ fontSize: '0.75rem', color: '#10B981', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
                              onClick={() => handleSendWaDirect(h.phone, h.customerName, 'Serah Terima Kunci (BAST)', h.unitNo)}
                              title="Klik untuk chat WhatsApp konsumen"
                            >
                              📱 {h.phone || '-'}
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '6px 2px' }}>{renderCheckBadge(h.checkListrik)}</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '6px 2px' }}>{renderCheckBadge(h.checkAir)}</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '6px 2px' }}>{renderCheckBadge(h.checkPengecatan)}</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '6px 2px' }}>{renderCheckBadge(h.checkHandelPintu || h.checkPintu)}</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '6px 2px' }}>{renderCheckBadge(h.checkSanitari)}</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '6px 2px' }}>{renderCheckBadge(h.checkKebersihan)}</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => handleOpenEditHandover(h)}
                                style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                                title="Edit Data BAST / Checklist"
                              >
                                <Edit3 size={12} /> Edit
                              </button>
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => handleOpenPrintBast(h)} 
                                style={{ background: 'linear-gradient(135deg, #b8860b, #d4af37)', color: '#fff', border: 'none', padding: '0.2rem 0.45rem', fontSize: '0.7rem' }}
                                title="Cetak Berita Acara Serah Terima Kunci"
                              >
                                <Printer size={12} /> Cetak
                              </button>
                              {canDeleteTicket ? (
                                <button 
                                  className="btn btn-secondary btn-sm" 
                                  onClick={() => handleDeleteHandover(h.id, h.unitNo || `${h.blok}-${h.no}`)}
                                  style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem', color: 'var(--danger)' }}
                                  title="Hapus Data BAST (Khusus Pimpinan)"
                                >
                                  <Trash2 size={12} />
                                </button>
                              ) : (
                                <span 
                                  style={{ fontSize: '0.62rem', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '2px 4px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}
                                  title="Hapus hanya dapat dilakukan oleh Pak Yazid & Manager"
                                >
                                  🔒 Kunci
                                </span>
                              )}
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

      {/* CREATE / EDIT COMPLAINT TICKET MODAL */}
      {isTicketModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wrench size={20} color="#F59E0B" /> {editingTicket ? `Edit Tiket Komplain (${editingTicket.id})` : 'Buat Tiket Komplain & Garansi Retensi Baru'}
              </h3>
              <button onClick={() => setIsTicketModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTicket}>
              <div className="modal-body">
                {/* Row 1: No Tiket (Otomatis) & Unit Kavling (Otomatis Pilih) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>🏷️ No. Tiket (Otomatis)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ticketForm.ticketNo}
                      readOnly
                      style={{ fontWeight: 800, color: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.1)', cursor: 'not-allowed' }}
                    />
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      ✓ Terbit berurutan otomatis
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>🏠 Unit Kavling (Pilih)</label>
                    <select
                      className="form-control"
                      value={ticketForm.unitNo}
                      onChange={(e) => {
                        const selectedNo = e.target.value;
                        const matched = safeUnits.find(u => u.no === selectedNo);
                        setTicketForm({
                          ...ticketForm,
                          unitNo: selectedNo,
                          customerName: matched ? matched.customer : ticketForm.customerName,
                          phone: matched ? matched.phone : ticketForm.phone
                        });
                      }}
                      required
                      style={{ fontWeight: 800, borderColor: '#38BDF8' }}
                    >
                      {safeUnits.map((u, i) => (
                        <option key={u.no || i} value={u.no}>
                          Unit {u.no} {u.cluster ? `(${u.cluster})` : ''} - {u.customer || 'Ready'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Nama Konsumen & No WhatsApp */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>👤 Nama Konsumen Pelapor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ticketForm.customerName}
                      onChange={(e) => setTicketForm({ ...ticketForm, customerName: e.target.value })}
                      placeholder="Nama pemilik / penghuni..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>📱 No. WhatsApp Konsumen</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ticketForm.phone}
                      onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                      placeholder="0812..."
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Tanggal Komplain & Tanggal Input Sistem */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>📅 Tanggal Komplain</label>
                    <input
                      type="date"
                      className="form-control"
                      value={ticketForm.tanggalKomplain}
                      onChange={(e) => setTicketForm({ ...ticketForm, tanggalKomplain: e.target.value })}
                      required
                      style={{ fontWeight: 700 }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>⏱️ Tanggal Input Data</label>
                    <input
                      type="date"
                      className="form-control"
                      value={ticketForm.tanggalInput}
                      onChange={(e) => setTicketForm({ ...ticketForm, tanggalInput: e.target.value })}
                      required
                      style={{ fontWeight: 700, color: '#10B981' }}
                    />
                  </div>
                </div>

                {/* Row 4: Petugas Yang Menginput Data & Vendor */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>✍️ Petugas Yang Input Data</label>
                    <select
                      className="form-control"
                      value={safeUsers.some(u => u.name === ticketForm.inputBy) ? ticketForm.inputBy : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setTicketForm({ ...ticketForm, inputBy: e.target.value });
                        }
                      }}
                      style={{ fontWeight: 700, color: '#38BDF8', borderColor: '#38BDF8', marginBottom: '4px' }}
                    >
                      <option value="">-- Pilih Nama Karyawan --</option>
                      {safeUsers.map(u => (
                        <option key={u.id} value={u.name}>👤 {u.name} ({u.role})</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-control"
                      value={ticketForm.inputBy}
                      onChange={(e) => setTicketForm({ ...ticketForm, inputBy: e.target.value })}
                      placeholder="Atau ketik nama petugas..."
                      required
                      style={{ fontWeight: 700, color: '#38BDF8', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>🔧 Vendor</label>
                    <select
                      className="form-control"
                      value={ticketForm.vendor}
                      onChange={(e) => setTicketForm({ ...ticketForm, vendor: e.target.value })}
                      style={{ fontWeight: 700 }}
                    >
                      {VENDOR_LIST.map((v, i) => (
                        <option key={i} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 5: Kategori Komplain Keluhan */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>🛠️ Kategori Komplain Keluhan</label>
                  <select
                    className="form-control"
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    style={{ fontWeight: 700 }}
                  >
                    <option value="Kebocoran Plafon">Kebocoran Plafon / Atap</option>
                    <option value="Kusen Pintu Agak Macet">Kusen Pintu / Engsel Jendela</option>
                    <option value="Cat Dinding Mengelupas">Cat Dinding Mengelupas</option>
                    <option value="Sanitari & Pipa Air">Sanitari & Pipa Air PDAM</option>
                    <option value="Listrik & Saklar">Instalasi Listrik PLN</option>
                    <option value="Keramik Retak / Popping">Keramik Lantai Retak / Popping</option>
                  </select>
                </div>

                {/* Row 6: Detail Deskripsi Komplain Keluhan */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📝 Detail Deskripsi Komplain Keluhan</label>
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
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                  {editingTicket ? '💾 Simpan Perubahan Tiket' : '🚀 Terbitkan Tiket Komplain'}
                </button>
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

      {/* MODAL: FORM INPUT / EDIT BAST SERAH TERIMA KUNCI (STK) */}
      {isHandoverModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '720px', width: '95%', background: '#ffffff', color: '#1e293b', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <div className="modal-header" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={22} color="#b8860b" />
                <h3 className="modal-title" style={{ fontWeight: 800, color: '#0f172a', margin: 0, fontSize: '1.2rem' }}>
                  {editingHandover ? `Edit Data STK - Unit ${handoverForm.blok}-${handoverForm.no}` : 'Form Input Data STK'}
                </h3>
              </div>
              <button onClick={() => setIsHandoverModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveHandover}>
              <div className="modal-body" style={{ maxHeight: '74vh', overflowY: 'auto', padding: '1.5rem', background: '#fafbfc' }}>
                {/* Form Sheet Container matching User's Paper Design */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  
                  {/* Pilihan Cepat Unit (Auto-fill Helper) */}
                  <div style={{ marginBottom: '1.25rem', padding: '0.75rem', background: 'rgba(184, 134, 11, 0.08)', borderRadius: '8px', border: '1px dashed #b8860b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#b8860b' }}>
                      ⚡ Pilih Cepat Unit Kavling (Otomatis Isi Form):
                    </span>
                    <select
                      className="form-control"
                      value={`${handoverForm.blok}-${handoverForm.no}`}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matched = safeUnits.find(u => u.no === val);
                        const parts = val.split('-');
                        setHandoverForm({
                          ...handoverForm,
                          proyek: parts[0] === 'B' ? 'Ashoka View' : 'Ashoka Park',
                          blok: parts[0] || 'A',
                          no: parts[1] || '01',
                          unitNo: val,
                          customerName: matched ? matched.customer : handoverForm.customerName,
                          phone: matched ? matched.phone : handoverForm.phone,
                          type: parts[0] === 'B' ? 'Type 60' : 'Type 45',
                          lbLt: parts[0] === 'B' ? '60/120' : '45/90'
                        });
                      }}
                      style={{ width: 'auto', minWidth: '220px', fontWeight: 700, borderColor: '#b8860b', color: '#0f172a', background: '#fff' }}
                    >
                      {safeUnits.map((u, i) => (
                        <option key={u.no || i} value={u.no}>
                          Unit {u.no} ({u.cluster || 'Cluster'}) - {u.customer || 'Ready'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Top Form Fields: Proyek, Tanggal STK, Nama Konsumen, Blok, No, Type, LB/LT, No HP/WA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    
                    {/* Proyek */}
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 15px 1fr', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Proyek</label>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>:</span>
                      <select
                        className="form-control"
                        value={handoverForm.proyek}
                        onChange={(e) => setHandoverForm({ ...handoverForm, proyek: e.target.value })}
                        style={{ fontWeight: 700, borderColor: '#cbd5e1', color: '#0f172a', background: '#fff' }}
                      >
                        <option value="Ashoka Park">Ashoka Park</option>
                        <option value="Ashoka View">Ashoka View</option>
                        <option value="Grand Harmoni">Grand Harmoni</option>
                        <option value="Harmoni Kedungwuni">Harmoni Kedungwuni</option>
                      </select>
                    </div>

                    {/* Tanggal STK */}
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 15px 1fr', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Tanggal STK</label>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>:</span>
                      <input
                        type="date"
                        className="form-control"
                        value={handoverForm.tglStk}
                        onChange={(e) => setHandoverForm({ ...handoverForm, tglStk: e.target.value })}
                        required
                        style={{ fontWeight: 700, borderColor: '#cbd5e1', color: '#0f172a', background: '#fff' }}
                      />
                    </div>

                    {/* Nama Konsumen */}
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 15px 1fr', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Nama Konsumen</label>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>:</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nama Lengkap Pemilik Rumah"
                        value={handoverForm.customerName}
                        onChange={(e) => setHandoverForm({ ...handoverForm, customerName: e.target.value })}
                        required
                        style={{ fontWeight: 700, borderColor: '#cbd5e1', color: '#0f172a', background: '#fff' }}
                      />
                    </div>

                    {/* Blok */}
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 15px 1fr', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Blok</label>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>:</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: A / B / C"
                        value={handoverForm.blok}
                        onChange={(e) => setHandoverForm({ ...handoverForm, blok: e.target.value.toUpperCase() })}
                        required
                        style={{ fontWeight: 800, borderColor: '#cbd5e1', color: '#0f172a', background: '#fff' }}
                      />
                    </div>

                    {/* No. */}
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 15px 1fr', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>No.</label>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>:</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: 01 / 02 / 06"
                        value={handoverForm.no}
                        onChange={(e) => setHandoverForm({ ...handoverForm, no: e.target.value })}
                        required
                        style={{ fontWeight: 800, borderColor: '#cbd5e1', color: '#0f172a', background: '#fff' }}
                      />
                    </div>

                    {/* Type */}
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 15px 1fr', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Type</label>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>:</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Type 36 / Type 45 / Type 60"
                        value={handoverForm.type}
                        onChange={(e) => setHandoverForm({ ...handoverForm, type: e.target.value })}
                        style={{ fontWeight: 700, borderColor: '#cbd5e1', color: '#0f172a', background: '#fff' }}
                      />
                    </div>

                    {/* LB/LT */}
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 15px 1fr', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>LB/LT</label>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>:</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: 36/60 / 45/90 / 60/120"
                        value={handoverForm.lbLt}
                        onChange={(e) => setHandoverForm({ ...handoverForm, lbLt: e.target.value })}
                        style={{ fontWeight: 700, borderColor: '#cbd5e1', color: '#0f172a', background: '#fff' }}
                      />
                    </div>

                    {/* No. HP / WA */}
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 15px 1fr', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>No. HP / WA</label>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>:</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="0812-xxxx-xxxx"
                        value={handoverForm.phone}
                        onChange={(e) => setHandoverForm({ ...handoverForm, phone: e.target.value })}
                        required
                        style={{ fontWeight: 700, borderColor: '#cbd5e1', color: '#0f172a', background: '#fff' }}
                      />
                    </div>
                  </div>

                  {/* Center Divider: Pengecekan with Double Line */}
                  <div style={{ margin: '1.75rem 0 1.25rem', textAlign: 'center', position: 'relative' }}>
                    <div style={{ borderTop: '3px double #0f172a', position: 'absolute', top: '50%', left: 0, right: 0 }}></div>
                    <span style={{ background: '#ffffff', padding: '0 1.25rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a', position: 'relative', letterSpacing: '0.5px' }}>
                      Pengecekan
                    </span>
                  </div>

                  {/* 6 Gold Header Boxes: Listrik, Air, Pengecatan, Handel Pintu, Sanitari, Kebersihan */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', overflowX: 'auto' }}>
                    
                    {/* 1. Listrik */}
                    <div style={{ border: '1px solid #b8860b', borderRadius: '4px', overflow: 'hidden', textAlign: 'center' }}>
                      <div style={{ background: '#b8860b', color: '#ffffff', padding: '6px 2px', fontWeight: 800, fontSize: '0.8rem' }}>
                        Listrik
                      </div>
                      <div style={{ padding: '6px 4px', background: '#ffffff' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={handoverForm.checkListrik}
                          onChange={(e) => setHandoverForm({ ...handoverForm, checkListrik: e.target.value })}
                          style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', height: '32px', padding: '2px', border: '1px solid #e2e8f0', color: '#10B981' }}
                        />
                      </div>
                    </div>

                    {/* 2. Air */}
                    <div style={{ border: '1px solid #b8860b', borderRadius: '4px', overflow: 'hidden', textAlign: 'center' }}>
                      <div style={{ background: '#b8860b', color: '#ffffff', padding: '6px 2px', fontWeight: 800, fontSize: '0.8rem' }}>
                        Air
                      </div>
                      <div style={{ padding: '6px 4px', background: '#ffffff' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={handoverForm.checkAir}
                          onChange={(e) => setHandoverForm({ ...handoverForm, checkAir: e.target.value })}
                          style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', height: '32px', padding: '2px', border: '1px solid #e2e8f0', color: '#10B981' }}
                        />
                      </div>
                    </div>

                    {/* 3. Pengecatan */}
                    <div style={{ border: '1px solid #b8860b', borderRadius: '4px', overflow: 'hidden', textAlign: 'center' }}>
                      <div style={{ background: '#b8860b', color: '#ffffff', padding: '6px 2px', fontWeight: 800, fontSize: '0.8rem' }}>
                        Pengecatan
                      </div>
                      <div style={{ padding: '6px 4px', background: '#ffffff' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={handoverForm.checkPengecatan}
                          onChange={(e) => setHandoverForm({ ...handoverForm, checkPengecatan: e.target.value })}
                          style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', height: '32px', padding: '2px', border: '1px solid #e2e8f0', color: '#10B981' }}
                        />
                      </div>
                    </div>

                    {/* 4. Handel Pintu */}
                    <div style={{ border: '1px solid #b8860b', borderRadius: '4px', overflow: 'hidden', textAlign: 'center' }}>
                      <div style={{ background: '#b8860b', color: '#ffffff', padding: '6px 2px', fontWeight: 800, fontSize: '0.8rem' }}>
                        Handel Pintu
                      </div>
                      <div style={{ padding: '6px 4px', background: '#ffffff' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={handoverForm.checkHandelPintu}
                          onChange={(e) => setHandoverForm({ ...handoverForm, checkHandelPintu: e.target.value })}
                          style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', height: '32px', padding: '2px', border: '1px solid #e2e8f0', color: '#10B981' }}
                        />
                      </div>
                    </div>

                    {/* 5. Sanitari */}
                    <div style={{ border: '1px solid #b8860b', borderRadius: '4px', overflow: 'hidden', textAlign: 'center' }}>
                      <div style={{ background: '#b8860b', color: '#ffffff', padding: '6px 2px', fontWeight: 800, fontSize: '0.8rem' }}>
                        Sanitari
                      </div>
                      <div style={{ padding: '6px 4px', background: '#ffffff' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={handoverForm.checkSanitari}
                          onChange={(e) => setHandoverForm({ ...handoverForm, checkSanitari: e.target.value })}
                          style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', height: '32px', padding: '2px', border: '1px solid #e2e8f0', color: '#10B981' }}
                        />
                      </div>
                    </div>

                    {/* 6. Kebersihan */}
                    <div style={{ border: '1px solid #b8860b', borderRadius: '4px', overflow: 'hidden', textAlign: 'center' }}>
                      <div style={{ background: '#b8860b', color: '#ffffff', padding: '6px 2px', fontWeight: 800, fontSize: '0.8rem' }}>
                        Kebersihan
                      </div>
                      <div style={{ padding: '6px 4px', background: '#ffffff' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={handoverForm.checkKebersihan}
                          onChange={(e) => setHandoverForm({ ...handoverForm, checkKebersihan: e.target.value })}
                          style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', height: '32px', padding: '2px', border: '1px solid #e2e8f0', color: '#10B981' }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', background: '#f8fafc' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsHandoverModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #b8860b, #d4af37)', border: 'none', fontWeight: 800, color: '#fff', padding: '0.5rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  {editingHandover ? '💾 Simpan Perubahan Data STK' : '🚀 Simpan Input Data STK'}
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
