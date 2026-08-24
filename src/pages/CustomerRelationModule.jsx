import React, { useState } from 'react';
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
  const { showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets', 'handover', 'csat', 'ipl', 'documents', 'helpdesk'

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

  // Pillar 1: Complaints & Warranty Tickets Data
  const [tickets, setTickets] = useState([
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
  ]);

  // Pillar 2: BAST Handover & Utilities Data
  const [handovers, setHandovers] = useState([
    {
      id: 'HO-001',
      unitNo: 'A-01',
      customerName: 'Budi Santoso',
      cluster: 'Cluster Emerald',
      bastDate: '01 Agustus 2025',
      statusPLN: 'Aktif 1300W (No: 5412-9900)',
      statusPDAM: 'Aktif PDAM Tirta (No: 8871)',
      statusBAST: 'Selesai BAST (Kunci Diserahkan)'
    },
    {
      id: 'HO-002',
      unitNo: 'A-02',
      customerName: 'Siti Rahmawati',
      cluster: 'Cluster Emerald',
      bastDate: '25 Agustus 2025 (Undangan)',
      statusPLN: 'Proses Pemasangan Meteran',
      statusPDAM: 'Proses Sambungan Pipa',
      statusBAST: 'Jadwal Undangan Serah Terima'
    }
  ]);

  // Pillar 3: CSAT & Loyalty Referral Data
  const [reviews] = useState([
    { id: 1, customer: 'Budi Santoso (A-01)', rating: 5, comment: 'Sangat puas dengan respon cepat tim CRM Ashoka dalam perbaikan atap. Pelayanan sangat ramah!', date: '05 Ags 2025' },
    { id: 2, customer: 'Rian Perdana (A-06)', rating: 5, comment: 'Proses BAST serah terima kunci lancar dan penataan fasilitas cluster sangat bersih.', date: '30 Jul 2025' }
  ]);

  // Pillar 4: IPL Estate Management Billing Data
  const [iplList, setIplList] = useState([
    { id: 'IPL-08-A01', unitNo: 'A-01', customerName: 'Budi Santoso', month: 'Agustus 2025', amount: 250000, status: 'LUNAS (Verified)' },
    { id: 'IPL-08-A06', unitNo: 'A-06', customerName: 'Rian Perdana', month: 'Agustus 2025', amount: 250000, status: 'Belum Bayar' },
    { id: 'IPL-08-B01', unitNo: 'B-01', customerName: 'Dr. Tri Handoko', month: 'Agustus 2025', amount: 350000, status: 'LUNAS (Verified)' }
  ]);

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
    showNotification(`Tiket Komplain Baru ${newTck.id} berhasil diterbitkan & didisposisi!`);
    setIsTicketModalOpen(false);
  };

  const handleCompleteTicket = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Completed (Selesai)' } : t));
    showNotification(`Tiket Komplain ${id} dinyatakan SELESAI & Lolos Inspeksi!`);
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

  useEffect(() => {
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
          <Wrench size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Keluhan & Garansi Retensi
        </button>
        <button className={`tab-item ${activeTab === 'handover' ? 'active' : ''}`} onClick={() => setActiveTab('handover')}>
          <KeyRound size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. BAST & PLN/PDAM
        </button>
        <button className={`tab-item ${activeTab === 'csat' ? 'active' : ''}`} onClick={() => setActiveTab('csat')}>
          <Star size={16} style={{ display: 'inline', marginRight: '6px' }} /> 3. Survei CSAT & Referal
        </button>
        <button className={`tab-item ${activeTab === 'ipl' ? 'active' : ''}`} onClick={() => setActiveTab('ipl')}>
          <Building2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> 4. Iuran Lingkungan (IPL)
        </button>
        <button className={`tab-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
          <FileCheck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 5. Penyerahan SHM/PBG
        </button>
        <button className={`tab-item ${activeTab === 'helpdesk' ? 'active' : ''}`} onClick={() => setActiveTab('helpdesk')}>
          <Headphones size={16} style={{ display: 'inline', marginRight: '6px' }} /> 6. Helpdesk & Consultation
        </button>
      </div>

      {/* PILAR 1: KELUHAN & GARANSI RETENSI */}
      {activeTab === 'tickets' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Daftar Tiket Keluhan & Pemeliharaan Garansi Retensi</h3>
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
                {tickets.map((t) => (
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
                      {t.status.includes('Completed') ? (
                        <span className="badge badge-success"><CheckCircle2 size={12} /> Selesai</span>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => handleCompleteTicket(t.id)}>
                          <CheckCircle2 size={13} /> Selesaikan Tiket
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 2: BAST SERAH TERIMA & UTILITIES */}
      {activeTab === 'handover' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Manajemen BAST Serah Terima Kunci & Balik Nama Meteran</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Kavling Unit & Konsumen</th>
                  <th>Tanggal BAST</th>
                  <th>Sambungan PLN (Listrik)</th>
                  <th>Sambungan Air (PDAM)</th>
                  <th>Status BAST Kunci</th>
                  <th>Aksi Serah Terima</th>
                </tr>
              </thead>
              <tbody>
                {handovers.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {h.unitNo}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{h.customerName}</div>
                    </td>
                    <td><div style={{ fontWeight: 700 }}>{h.bastDate}</div></td>
                    <td><span className="badge badge-success">{h.statusPLN}</span></td>
                    <td><span className="badge badge-success">{h.statusPDAM}</span></td>
                    <td><span className="badge badge-info">{h.statusBAST}</span></td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleOpenPrintBast(h)} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 800, border: 'none' }}>
                        <Printer size={13} /> Cetak Dokumen BAST
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 3: SURVEI CSAT & REFERRAL */}
      {activeTab === 'csat' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Ulasan Kepuasan Pelanggan (CSAT & NPS Ratings)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{r.customer}</div>
                  <div style={{ color: '#F59E0B', fontWeight: 900 }}>{'★'.repeat(r.rating)}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic' }}>"{r.comment}"</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '6px' }}>{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PILAR 4: IURAN PENGELOLAAN LINGKUNGAN (IPL) */}
      {activeTab === 'ipl' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Tagihan & Kolektibilitas IPL Lingkungan Cluster</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No Tagihan & Unit</th>
                  <th>Nama Penghuni</th>
                  <th>Bulan Tagihan</th>
                  <th>Nominal IPL (Rp)</th>
                  <th>Status Pembayaran</th>
                  <th>Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {iplList.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{i.id}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Unit {i.unitNo}</div>
                    </td>
                    <td>{i.customerName}</td>
                    <td>{i.month}</td>
                    <td><div style={{ fontWeight: 800 }}>{formatRupiah(i.amount)}</div></td>
                    <td>
                      <span className={`badge ${i.status.includes('LUNAS') ? 'badge-success' : 'badge-danger'}`}>
                        {i.status}
                      </span>
                    </td>
                    <td>
                      {!i.status.includes('LUNAS') && (
                        <button className="btn btn-primary btn-sm" onClick={() => handlePayIPL(i.id)}>
                          <CheckCircle2 size={13} /> Bayar IPL
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 5: DOKUMEN SHM & PBG ASLI */}
      {activeTab === 'documents' && (
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

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Lengkap & Diserahkan</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>
                {documentHandovers.filter(d => d.status.includes('Lengkap')).length} Unit
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tuntas BAST Konsumen</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', color: '#3B82F6', fontWeight: 700 }}>Siap Diambil di Kantor</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#3B82F6' }}>
                {documentHandovers.filter(d => d.status.includes('Siap Diambil')).length} Unit
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Undangan Pengambilan Terkirim</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', color: '#A855F7', fontWeight: 700 }}>Proses Splitzing / Vault</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#A855F7' }}>
                {documentHandovers.filter(d => !d.status.includes('Lengkap') && !d.status.includes('Siap Diambil')).length} Unit
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BPN & Bank KPR Mitra</div>
            </div>
          </div>

          {/* Table Document Handovers */}
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
                {documentHandovers.map((doc) => {
                  const isDone = doc.status.includes('Lengkap');
                  const isReady = doc.status.includes('Siap Diambil');
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
        </div>
      )}

      {/* PILAR 6: HELPDESK & CONSULTATION */}
      {activeTab === 'helpdesk' && (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <Headphones size={48} color="#38BDF8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Pusat Layanan Helpdesk & Consultation KPR</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
            Layanan pengaduan cepat & konsultasi perbankan KPR via WhatsApp Resmi Ashoka Care.
          </p>
          <button className="btn btn-primary" onClick={() => alert('Menghubungkan ke WhatsApp Helpdesk Ashoka CRM Care...')}>
            <MessageSquare size={16} /> Hubungkan ke WA Customer Care
          </button>
        </div>
      )}

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
