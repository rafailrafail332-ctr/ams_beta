import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Camera, 
  Clock, 
  MapPin, 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  Sparkles, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  UserCheck, 
  Lock, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle, 
  Clock3, 
  XCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Filter, 
  Shield, 
  Upload, 
  Image as ImageIcon, 
  Compass, 
  AlertTriangle, 
  Settings, 
  Navigation, 
  Building2, 
  FileText, 
  Send, 
  CalendarDays, 
  Timer,
  Edit2,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  MessageSquare,
  Share2,
  ExternalLink,
  PhoneCall
} from 'lucide-react';

export const COMPANY_DIVISIONS = [
  { id: 'DIV-FIN', name: 'Finance & Accounting', short: 'Finance', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
  { id: 'DIV-DIR', name: 'Direksi (Direktur Utama / GM)', short: 'Direksi', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'DIV-MKT', name: 'Marketing & Promosi', short: 'Marketing', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'DIV-HR', name: 'HR & GA (General Affairs)', short: 'HR & GA', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
  { id: 'DIV-LEG', name: 'Legal & Perizinan Properti', short: 'Legal', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)' },
  { id: 'DIV-TEK', name: 'Teknik & Lapangan (Sipil/Mandor)', short: 'Teknik', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.15)' },
  { id: 'DIV-PRO', name: 'Procurement & Vendor Logistik', short: 'Procurement', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)' },
  { id: 'DIV-CRM', name: 'Customer Relation & Konsumen', short: 'Customer Relation', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' },
  { id: 'DIV-BNK', name: 'Perbankan (KPR / SP3K Bank BTN/Mandiri)', short: 'Perbankan', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  { id: 'DIV-NOT', name: 'Notaris & PPAT / BPN', short: 'Notaris', color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.15)' },
  { id: 'DIV-EKS', name: 'Pihak Eksternal / Konsumen', short: 'Eksternal', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)' }
];

export const TodoAttendanceModule = () => {
  const { 
    currentUser, 
    users, 
    attendances, 
    setAttendances, 
    approveAttendancePhoto, 
    rejectAttendancePhoto, 
    getAvatarUrl, 
    showNotification,
    todos,
    setTodos,
    instructions,
    setInstructions
  } = useApp();

  // Helper to render Division Badge
  const getDivisionBadge = (kordinasiText) => {
    if (!kordinasiText) return <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>-</span>;
    const lower = kordinasiText.toLowerCase();
    const matched = COMPANY_DIVISIONS.find(d => 
      lower.includes(d.short.toLowerCase()) || 
      lower.includes(d.name.toLowerCase()) ||
      (d.id === 'DIV-FIN' && (lower.includes('pajak') || lower.includes('kasir') || lower.includes('finance') || lower.includes('keuangan'))) ||
      (d.id === 'DIV-DIR' && (lower.includes('bod') || lower.includes('direktur') || lower.includes('yazid') || lower.includes('gm') || lower.includes('adhi'))) ||
      (d.id === 'DIV-MKT' && (lower.includes('sales') || lower.includes('marketing') || lower.includes('iklan') || lower.includes('promo') || lower.includes('brosur'))) ||
      (d.id === 'DIV-TEK' && (lower.includes('sipil') || lower.includes('mandor') || lower.includes('teknik') || lower.includes('proyek') || lower.includes('qc') || lower.includes('cor'))) ||
      (d.id === 'DIV-BNK' && (lower.includes('btn') || lower.includes('mandiri') || lower.includes('bca') || lower.includes('bank') || lower.includes('kpr') || lower.includes('sp3k'))) ||
      (d.id === 'DIV-NOT' && (lower.includes('notaris') || lower.includes('ppat') || lower.includes('bpn') || lower.includes('sertifikat')))
    );

    const color = matched ? matched.color : '#38BDF8';
    const bg = matched ? matched.bg : 'rgba(56, 189, 248, 0.15)';

    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', background: bg, border: `1px solid ${color}40`, color: color, fontWeight: 700, fontSize: '0.78rem' }}>
        🏢 {kordinasiText}
      </div>
    );
  };

  // 3 Primary Tabs: 'laporan' (Laporan Pekerjaan) | 'instruksi' (Instruksi Pekerjaan) | 'absen' (Presensi GPS)
  const [activeTab, setActiveTab] = useState('laporan');

  // Helper Check Role Can Assign / Reset / ACC:
  // KHUSUS PIMPINAN: Direktur Utama (Ahmad Rafail & Yazid Hizbullah), General Manager (Adhi Himawan), dan Head Marketing (Bu Yulieka Rachmawati)
  const isManagerOrDirectorOrAdmin = () => {
    if (!currentUser) return false;
    const r = (currentUser.role || '').toLowerCase();
    const name = (currentUser.name || '').toLowerCase();
    const email = (currentUser.email || '').toLowerCase();

    // 1. Direktur Utama & Super Admin (Ahmad Rafail, Yazid Hizbullah)
    const isDirectorOrAdmin = r.includes('super admin') || r.includes('direktur');

    // 2. General Manager (Adhi Himawan)
    const isGeneralManager = r.includes('general manager') || r === 'manager' || r.includes('gm');

    // 3. Head Marketing (Bu Yulieka Rachmawati) - Pastikan bukan staf marketing lain (Fresda, Amanda, Bambang)
    const isHeadMarketing = (r.includes('head marketing') || name.includes('yulie') || name.includes('yuli') || email.includes('yulie')) && !r.includes('staf');

    return isDirectorOrAdmin || isGeneralManager || isHeadMarketing;
  };

  const isBoss = isManagerOrDirectorOrAdmin();

  // Safety Guards for array states
  const safeUsers = Array.isArray(users) ? users : [];
  const safeTodos = Array.isArray(todos) ? todos : [];
  const safeInstructions = Array.isArray(instructions) ? instructions : [];
  const safeAttendances = Array.isArray(attendances) ? attendances : [];

  // Active Date Selector (Format: YYYY-MM-DD)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const [selectedDateFilter, setSelectedDateFilter] = useState(todayDateStr);
  const [showAllDates, setShowAllDates] = useState(false);

  // -----------------------------------------------------------------
  // 1. STATE & HANDLERS UNTUK TAB 1: LAPORAN PEKERJAAN HARIAN
  // -----------------------------------------------------------------
  const [newDate, setNewDate] = useState(todayDateStr);
  const [newWaktu, setNewWaktu] = useState('08:00 - 10:00');
  const [newLaporan, setNewLaporan] = useState('');
  const [newKordinasi, setNewKordinasi] = useState('');
  const [newPic, setNewPic] = useState(() => (safeUsers[0]?.name || 'Syamsul Dahari'));
  const [newPriority, setNewPriority] = useState('Sedang');
  const [reportPhoto, setReportPhoto] = useState(null);
  const reportFileInputRef = useRef(null);

  // Modal State for Viewing Full Report Photo Proof
  const [selectedReportForPhotoModal, setSelectedReportForPhotoModal] = useState(null);
  const [isReportPhotoModalOpen, setIsReportPhotoModalOpen] = useState(false);

  // Sub-filter for reports: 'all' | 'for_me'
  const [reportPicFilter, setReportPicFilter] = useState(() => isBoss ? 'all' : 'for_me');

  // Modal State for Adding/Editing Daily Work Report Item
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingReportItem, setEditingReportItem] = useState(null);

  const handleReportPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const now = new Date();
        const timeStr = now.toLocaleDateString('id-ID', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) + ' • ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

        const fontSize = Math.max(16, Math.floor(canvas.width / 32));
        ctx.font = `bold ${fontSize}px sans-serif`;
        const bannerHeight = fontSize * 3.2;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

        ctx.fillStyle = '#F59E0B';
        ctx.fillText(`📸 BUKTI LAPORAN PEKERJAAN HARIAN • AMS`, fontSize, canvas.height - bannerHeight + fontSize * 1.2);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`PIC: ${isBoss ? newPic : currentUser?.name} • ${timeStr}`, fontSize, canvas.height - bannerHeight + fontSize * 2.4);

        const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setReportPhoto(watermarkedDataUrl);
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Helper to match if task is assigned to a user
  const isTaskAssignedToUser = (task, user) => {
    if (!task || !user) return false;

    if (task.picId && user.id && task.picId === user.id) return true;
    if (task.assigneeId && user.id && task.assigneeId === user.id) return true;

    const normalize = (str) => (str || '')
      .toLowerCase()
      .replace(/[\(\)\[\],.\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const taskPic = normalize(task.pic || task.assignee || '');
    const userName = normalize(user.name || '');

    if (!taskPic || !userName) return false;
    if (taskPic.includes(userName) || userName.includes(taskPic)) return true;

    const ignoredWords = ['staf', 'staff', 'head', 'manager', 'direktur', 'utama', 'general', 'super', 'admin', 'se', 'st', 'sh', 'ssi', 'mba', 'mm', 'pt', 'cv'];
    const userTokens = userName.split(' ').filter(w => w.length >= 3 && !ignoredWords.includes(w));
    const picTokens = taskPic.split(' ').filter(w => w.length >= 3 && !ignoredWords.includes(w));

    if (userTokens.length > 0 && picTokens.length > 0) {
      if (userTokens.some(ut => picTokens.includes(ut))) return true;
    }

    return false;
  };

  // FILTERED REPORTS: By Date and By PIC
  const visibleReports = safeTodos.filter((t) => {
    if (!showAllDates && selectedDateFilter) {
      const taskDate = t.date || t.assignDate;
      if (taskDate && taskDate !== selectedDateFilter) {
        return false;
      }
    }

    if (reportPicFilter === 'for_me') {
      return isTaskAssignedToUser(t, currentUser);
    }

    return isBoss ? true : isTaskAssignedToUser(t, currentUser);
  });

  const handleToggleReport = (id) => {
    setTodos(safeTodos.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        showNotification(nextState ? `Laporan "${t.laporan || t.text}" ditandai selesai!` : `Laporan diubah menjadi pending.`);
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleOpenAddReportModal = () => {
    setEditingReportItem(null);
    setNewDate(selectedDateFilter || todayDateStr);
    setNewWaktu('08:00 - 10:00');
    setNewLaporan('');
    setNewKordinasi('');
    setNewPic(isBoss ? (safeUsers[0]?.name || 'Syamsul Dahari') : (currentUser?.name || ''));
    setNewPriority('Sedang');
    setReportPhoto(null);
    setIsReportModalOpen(true);
  };

  const handleOpenEditReportModal = (item) => {
    setEditingReportItem(item);
    setNewDate(item.date || item.assignDate || todayDateStr);
    setNewWaktu(item.waktu || '08:00 - 10:00');
    setNewLaporan(item.laporan || item.text || '');
    setNewKordinasi(item.kordinasi || '');
    setNewPic(item.pic || item.assignee || (currentUser?.name || ''));
    setNewPriority(item.priority || 'Sedang');
    setReportPhoto(item.photo || null);
    setIsReportModalOpen(true);
  };

  const handleSaveReport = (e) => {
    e.preventDefault();
    if (!newLaporan.trim()) return;

    let targetUser;
    let finalPic;
    let finalPicId;
    let finalAssignedBy;

    if (isBoss) {
      targetUser = safeUsers.find(u => u.name === newPic || u.id === newPic) || safeUsers[0];
      finalPic = targetUser ? targetUser.name : newPic;
      finalPicId = targetUser ? targetUser.id : '';
      finalAssignedBy = `${currentUser?.name} (${currentUser?.role})`;
    } else {
      finalPic = currentUser?.name || 'Staf';
      finalPicId = currentUser?.id || '';
      finalAssignedBy = `${currentUser?.name} (Laporan Mandiri)`;
    }

    if (editingReportItem) {
      setTodos(safeTodos.map(t => {
        if (t.id === editingReportItem.id) {
          return {
            ...t,
            date: newDate,
            waktu: newWaktu,
            laporan: newLaporan.trim(),
            text: newLaporan.trim(),
            kordinasi: newKordinasi.trim(),
            pic: isBoss ? finalPic : t.pic,
            assignee: isBoss ? finalPic : t.assignee,
            picId: isBoss ? finalPicId : t.picId,
            priority: newPriority,
            photo: reportPhoto || t.photo || null
          };
        }
        return t;
      }));
      showNotification('Baris Laporan Pekerjaan Harian berhasil diperbarui!', 'success');
    } else {
      const newItem = {
        id: Date.now(),
        date: newDate,
        waktu: newWaktu,
        laporan: newLaporan.trim(),
        text: newLaporan.trim(),
        kordinasi: newKordinasi.trim(),
        pic: finalPic,
        assignee: finalPic,
        picId: finalPicId,
        priority: newPriority,
        completed: false,
        notes: '',
        photo: reportPhoto || null,
        assignedBy: finalAssignedBy
      };
      setTodos([newItem, ...safeTodos]);
      showNotification(`Laporan pekerjaan harian berhasil ditambahkan atas nama ${newItem.pic}!`, 'success');
    }

    setIsReportModalOpen(false);
  };

  const handleDeleteReport = (id) => {
    const itemToDelete = safeTodos.find(t => t.id === id);
    if (!itemToDelete) return;

    const canDelete = isBoss || isTaskAssignedToUser(itemToDelete, currentUser);
    if (!canDelete) {
      showNotification(`Akses Terbatas: Anda hanya berhak menghapus baris laporan pekerjaan milik Anda sendiri!`, 'danger');
      return;
    }

    if (window.confirm('Hapus baris laporan pekerjaan ini?')) {
      setTodos(safeTodos.filter(t => t.id !== id));
      showNotification('Baris laporan pekerjaan berhasil dihapus.', 'warning');
    }
  };

  // -----------------------------------------------------------------
  // 2. STATE & HANDLERS UNTUK TAB 2: INSTRUKSI PEKERJAAN PIMPINAN
  // -----------------------------------------------------------------
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [editingInstructionItem, setEditingInstructionItem] = useState(null);
  const [insDate, setInsDate] = useState(todayDateStr);
  const [insDueDate, setInsDueDate] = useState(todayDateStr);
  const [insDueTime, setInsDueTime] = useState('17:00');
  const [insText, setInsText] = useState('');
  const [insKordinasi, setInsKordinasi] = useState('');
  const [insAssignee, setInsAssignee] = useState(() => (safeUsers[0]?.name || 'Syamsul Dahari'));
  const [insPriority, setInsPriority] = useState('Tinggi');
  const [autoSendWa, setAutoSendWa] = useState(true);

  // Pak Yazid Official WhatsApp Phone Number (Configurable & Persistent)
  const [yazidWaNumber, setYazidWaNumber] = useState(() => {
    try {
      return localStorage.getItem('ams_yazid_wa_phone') || '6281288889999';
    } catch (e) {
      return '6281288889999';
    }
  });
  const [isWaConfigOpen, setIsWaConfigOpen] = useState(false);
  const [tempWaNumber, setTempWaNumber] = useState(yazidWaNumber);

  const handleSaveWaNumber = (e) => {
    e.preventDefault();
    let clean = tempWaNumber.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    if (!clean.startsWith('62')) clean = '62' + clean;
    setYazidWaNumber(clean);
    try {
      localStorage.setItem('ams_yazid_wa_phone', clean);
    } catch (e) {}
    showNotification(`Nomor WhatsApp Pak Yazid (+${clean}) berhasil disimpan!`, 'success');
    setIsWaConfigOpen(false);
  };

  // Direct WhatsApp Sender Helper to Pak Yazid
  const handleSendToYazidWhatsApp = (ins, customNote = null) => {
    let cleanPhone = (yazidWaNumber || '6281288889999').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
    if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

    const isSelesai = ins.status === 'Selesai';
    const statusHeader = isSelesai ? '✅ LAPORAN PENYELESAIAN TUGAS' : '📢 NOTIFIKASI INSTRUKSI PEKERJAAN';

    const msg = `*${statusHeader}*
*ASHOKA PROPERTY MANAGEMENT SYSTEM*
--------------------------------------------------
📌 *No. Instruksi:* ${ins.id}
📅 *Tanggal Diterbitkan:* ${ins.date}
⏰ *Batas Waktu (Deadline):* ${ins.dueDate} pk ${ins.dueTime || '17:00'} WIB
📜 *Uraian Instruksi:* 
"${ins.instruction}"

🤝 *Koordinasi:* ${ins.kordinasi || '-'}
👤 *Ditugaskan Kepada (PIC):* ${ins.assignee}
🏢 *Pemberi Instruksi:* ${ins.assignedBy || 'Direktur Utama'}
🚩 *Prioritas:* ${ins.priority || 'Tinggi'}
📊 *Status Saat Ini:* ${isSelesai ? '✅ SELESAI (DONE)' : '⏳ DALAM PROSES / PENDING'}
${ins.reportNotes || customNote ? `\n📝 *Bukti Hasil Tindak Lanjut:*\n"${customNote || ins.reportNotes}"\n⏱️ Waktu Selesai: ${ins.completionDate || 'Hari ini'}\n` : ''}--------------------------------------------------
_Laporan otomatis terverifikasi sistem AMS Ashoka Enterprise_`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    showNotification(`Membuka WhatsApp ke Pak Yazid (+${cleanPhone})...`, 'info');
  };

  // Modal Input Tindak Lanjut / Laporan Penyelesaian Staf
  const [isActionReportModalOpen, setIsActionReportModalOpen] = useState(false);
  const [selectedInstructionForAction, setSelectedInstructionForAction] = useState(null);
  const [actionReportText, setActionReportText] = useState('');

  // Sub-filter for instructions: 'all' | 'for_me' | 'by_me' | 'overdue'
  const [insFilter, setInsFilter] = useState(() => isBoss ? 'all' : 'for_me');

  const isInstructionOverdue = (ins) => {
    if (ins.status === 'Selesai') return false;
    if (!ins.dueDate) return false;
    const dueDateTimeStr = `${ins.dueDate}T${ins.dueTime || '23:59'}:00`;
    const dueDateObj = new Date(dueDateTimeStr);
    return !isNaN(dueDateObj.getTime()) && new Date() > dueDateObj;
  };

  const visibleInstructions = safeInstructions.filter((ins) => {
    if (insFilter === 'for_me') {
      return isTaskAssignedToUser(ins, currentUser);
    }
    if (insFilter === 'by_me') {
      return (ins.assignedById && ins.assignedById === currentUser?.id) || (ins.assignedBy || '').includes(currentUser?.name?.split(',')[0]);
    }
    if (insFilter === 'overdue') {
      return isInstructionOverdue(ins);
    }
    return isBoss ? true : isTaskAssignedToUser(ins, currentUser);
  });

  const handleOpenAddInstructionModal = () => {
    if (!isBoss) {
      showNotification('Akses Terbatas: Hanya Direktur Utama, General Manager, atau Bu Yulieka (Head Marketing) yang berhak menerbitkan Instruksi Pekerjaan!', 'danger');
      return;
    }
    setEditingInstructionItem(null);
    setInsDate(todayDateStr);
    setInsDueDate(todayDateStr);
    setInsDueTime('17:00');
    setInsText('');
    setInsKordinasi('');
    setInsAssignee(safeUsers[0]?.name || 'Syamsul Dahari');
    setInsPriority('Tinggi');
    setAutoSendWa(true);
    setIsInstructionModalOpen(true);
  };

  const handleOpenEditInstructionModal = (ins) => {
    if (!isBoss) {
      showNotification('Akses Terbatas: Hanya Pimpinan yang berhak mengedit Instruksi Pekerjaan!', 'danger');
      return;
    }
    setEditingInstructionItem(ins);
    setInsDate(ins.date || todayDateStr);
    setInsDueDate(ins.dueDate || todayDateStr);
    setInsDueTime(ins.dueTime || '17:00');
    setInsText(ins.instruction || '');
    setInsKordinasi(ins.kordinasi || '');
    setInsAssignee(ins.assignee || '');
    setInsPriority(ins.priority || 'Tinggi');
    setIsInstructionModalOpen(true);
  };

  const handleSaveInstruction = (e) => {
    e.preventDefault();
    if (!isBoss) return;
    if (!insText.trim()) return;

    const targetUser = safeUsers.find(u => u.name === insAssignee || u.id === insAssignee) || safeUsers[0];

    if (editingInstructionItem) {
      setInstructions(safeInstructions.map(ins => {
        if (ins.id === editingInstructionItem.id) {
          return {
            ...ins,
            date: insDate,
            dueDate: insDueDate,
            dueTime: insDueTime,
            instruction: insText.trim(),
            kordinasi: insKordinasi.trim(),
            assignee: targetUser ? targetUser.name : insAssignee,
            assigneeId: targetUser ? targetUser.id : '',
            priority: insPriority
          };
        }
        return ins;
      }));
      showNotification('Instruksi Pekerjaan berhasil diperbarui!', 'success');
    } else {
      const newIns = {
        id: `INS-${Date.now().toString().slice(-4)}`,
        date: insDate,
        dueDate: insDueDate,
        dueTime: insDueTime,
        instruction: insText.trim(),
        kordinasi: insKordinasi.trim(),
        assignee: targetUser ? targetUser.name : insAssignee,
        assigneeId: targetUser ? targetUser.id : '',
        assignedBy: `${currentUser?.name} (${currentUser?.role})`,
        assignedById: currentUser?.id || '',
        priority: insPriority,
        status: 'Pending',
        reportNotes: '',
        completionDate: ''
      };
      setInstructions([newIns, ...safeInstructions]);
      showNotification(`INSTRUKSI PEKERJAAN DITERBITKAN! Ditugaskan resmi kepada ${newIns.assignee}.`, 'success');

      if (autoSendWa) {
        handleSendToYazidWhatsApp(newIns);
      }
    }

    setIsInstructionModalOpen(false);
  };

  const handleDeleteInstruction = (id) => {
    if (!isBoss) {
      showNotification('Akses Terbatas: Hanya Pimpinan yang berhak menghapus Instruksi Pekerjaan!', 'danger');
      return;
    }
    if (window.confirm('Hapus Instruksi Pekerjaan ini?')) {
      setInstructions(safeInstructions.filter(ins => ins.id !== id));
      showNotification('Instruksi Pekerjaan berhasil dihapus.', 'warning');
    }
  };

  const handleOpenActionReportModal = (ins) => {
    setSelectedInstructionForAction(ins);
    setActionReportText(ins.reportNotes || '');
    setIsActionReportModalOpen(true);
  };

  const handleSaveActionReport = (e) => {
    e.preventDefault();
    if (!selectedInstructionForAction) return;

    const nowStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const updatedIns = {
      ...selectedInstructionForAction,
      status: 'Selesai',
      reportNotes: actionReportText.trim(),
      completionDate: nowStr
    };

    setInstructions(safeInstructions.map(ins => {
      if (ins.id === selectedInstructionForAction.id) {
        return updatedIns;
      }
      return ins;
    }));

    showNotification(`Laporan bukti tindak lanjut berhasil disimpan & langsung diarahkan ke WhatsApp Pak Yazid!`, 'success');
    setIsActionReportModalOpen(false);

    // Otomatis buka WhatsApp Pak Yazid
    handleSendToYazidWhatsApp(updatedIns, actionReportText.trim());
  };

  // -----------------------------------------------------------------
  // 3. MULTI-SITE GEOFENCING CONFIGURATION & LOGS PRESENSI
  // -----------------------------------------------------------------
  const defaultLocations = [
    {
      id: 'LOC-1',
      siteName: 'Ashoka Park (Lokasi 1)',
      targetLat: -6.395740296674746,
      targetLng: 106.65544347158237,
      maxRadiusMeters: 100
    },
    {
      id: 'LOC-2',
      siteName: 'Ashoka View (Lokasi 2)',
      targetLat: -6.408847458657833,
      targetLng: 106.70832258393312,
      maxRadiusMeters: 100
    }
  ];

  const [locations, setLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_geofence_locations_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultLocations;
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ams_geofence_locations_v4', JSON.stringify(locations));
    } catch (e) {}
  }, [locations]);

  const [isAbsenModalOpen, setIsAbsenModalOpen] = useState(false);
  const [uploadedAbsenPhoto, setUploadedAbsenPhoto] = useState(null);
  const absenFileInputRef = useRef(null);

  const [userGps, setUserGps] = useState({
    lat: null,
    lng: null,
    accuracy: null,
    matchedLocation: null,
    distanceMeters: null,
    isWithinRadius: false,
    loading: false,
    error: null
  });

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const evaluateMultiSiteLocation = (userLat, userLng) => {
    let bestMatch = null;
    let shortestDistance = Infinity;

    locations.forEach((loc) => {
      const dist = calculateDistance(userLat, userLng, loc.targetLat, loc.targetLng);
      if (dist < shortestDistance) {
        shortestDistance = dist;
        bestMatch = {
          ...loc,
          distanceMeters: Math.round(dist),
          isWithinRadius: dist <= loc.maxRadiusMeters
        };
      }
    });

    return bestMatch;
  };

  const requestGpsCoordinates = () => {
    if (!navigator.geolocation) {
      setUserGps(prev => ({ ...prev, loading: false, error: 'Perangkat Anda tidak mendukung fitur GPS Geolocation.' }));
      return;
    }

    setUserGps(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const evaluated = evaluateMultiSiteLocation(latitude, longitude);

        setUserGps({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          matchedLocation: evaluated ? evaluated.siteName : 'Diluar Jangkauan Proyek',
          distanceMeters: evaluated ? evaluated.distanceMeters : null,
          isWithinRadius: evaluated ? evaluated.isWithinRadius : false,
          loading: false,
          error: null
        });
      },
      (err) => {
        let errMsg = 'Gagal mengakses GPS perangkat.';
        if (err.code === 1) errMsg = 'Izin akses lokasi ditolak oleh browser. Mohon izinkan akses GPS di browser Anda.';
        if (err.code === 2) errMsg = 'Sinyal GPS tidak terdeteksi.';
        if (err.code === 3) errMsg = 'Waktu permintaan GPS habis (Timeout).';

        setUserGps(prev => ({ ...prev, loading: false, error: errMsg }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleOpenAbsenModal = () => {
    setUploadedAbsenPhoto(null);
    setIsAbsenModalOpen(true);
    requestGpsCoordinates();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const now = new Date();
        const timeStr = now.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) + ' • ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';

        const gpsStr = userGps.lat && userGps.lng 
          ? `GPS: ${userGps.lat.toFixed(6)}, ${userGps.lng.toFixed(6)} (${userGps.matchedLocation || 'Site'})`
          : 'GPS: Mengambil Koordinat Satelit...';

        const nameStr = `Karyawan: ${currentUser?.name} (${currentUser?.role})`;
        const statusStr = userGps.isWithinRadius 
          ? 'STATUS: VALID DALAM RADIUS PROYEK (VERIFIED)' 
          : 'STATUS: DILUAR RADIUS RESMI';

        const fontSize = Math.max(16, Math.floor(canvas.width / 32));
        ctx.font = `bold ${fontSize}px sans-serif`;

        const pad = fontSize;
        const bannerHeight = fontSize * 4.8;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

        ctx.fillStyle = '#10B981';
        ctx.fillText(`📍 ASHOKA AMS • PRESENSI TERVERIFIKASI GEOFENCING`, pad, canvas.height - bannerHeight + fontSize * 1.1);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(nameStr, pad, canvas.height - bannerHeight + fontSize * 2.2);
        ctx.fillText(`🕒 ${timeStr}`, pad, canvas.height - bannerHeight + fontSize * 3.3);

        ctx.fillStyle = userGps.isWithinRadius ? '#38BDF8' : '#EF4444';
        ctx.fillText(`${gpsStr} • ${statusStr}`, pad, canvas.height - bannerHeight + fontSize * 4.4);

        const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setUploadedAbsenPhoto(watermarkedDataUrl);
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAddLocation = () => {
    const newLoc = {
      id: `LOC-${locations.length + 1}`,
      siteName: `Titik Lokasi Proyek Baru #${locations.length + 1}`,
      targetLat: -6.395740,
      targetLng: 106.655443,
      maxRadiusMeters: 100
    };
    setLocations([...locations, newLoc]);
    showNotification('Titik lokasi presensi baru ditambahkan!', 'success');
  };

  const handleUpdateLocation = (index, field, value) => {
    const updated = [...locations];
    updated[index][field] = value;
    setLocations(updated);
  };

  const handleDeleteLocation = (index) => {
    if (locations.length <= 1) {
      showNotification('Sistem wajib memiliki minimal 1 titik lokasi geofencing presensi!', 'danger');
      return;
    }
    const updated = locations.filter((_, i) => i !== index);
    setLocations(updated);
    showNotification('Titik lokasi presensi berhasil dihapus.', 'info');
  };

  const [selectedPhotoAtt, setSelectedPhotoAtt] = useState(null);
  const [isDetailPhotoModalOpen, setIsDetailPhotoModalOpen] = useState(false);

  const handleSubmitAbsensi = (e) => {
    e.preventDefault();

    if (!userGps.lat || !userGps.lng) {
      showNotification('Presensi Ditolak: Mohon tunggu hingga koordinat GPS satelit berhasil didapatkan!', 'danger');
      return;
    }

    if (!uploadedAbsenPhoto) {
      showNotification('Presensi Ditolak: Wajib mengambil/mengunggah foto bukti fisik kehadiran dengan stempel watermark!', 'danger');
      return;
    }

    if (!userGps.isWithinRadius) {
      showNotification(`Presensi Ditolak: Anda terdeteksi berjarak ${userGps.distanceMeters}m dari lokasi resmi. Wajib berada dalam radius maksimal titik proyek!`, 'danger');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const newAtt = {
      id: Date.now(),
      name: currentUser?.name || 'Staf Lapangan',
      role: currentUser?.role || 'Karyawan',
      time: timeStr,
      date: dateStr,
      locationName: userGps.matchedLocation,
      lat: userGps.lat,
      lng: userGps.lng,
      distanceMeters: userGps.distanceMeters,
      photo: uploadedAbsenPhoto,
      status: 'Hadir Tepat Waktu (Verified GPS)',
      accStatus: 'APPROVED'
    };

    setAttendances([newAtt, ...attendances]);
    setIsAbsenModalOpen(false);
    showNotification(`PRESENSI BERHASIL! Kehadiran ${currentUser?.name} di ${userGps.matchedLocation} berhasil tercatat dan diverifikasi.`, 'success');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Laporan & Instruksi Pekerjaan Harian</h1>
          <p className="page-subtitle">Sistem pelaporan kerja harian staf, penerbitan instruksi pimpinan dengan batas waktu, dan presensi geofencing GPS.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isBoss && (
            <button className="btn btn-secondary" onClick={() => setIsConfigOpen(!isConfigOpen)}>
              <Settings size={16} /> Konfigurasi Titik Proyek ({locations.length})
            </button>
          )}
          <button className="btn btn-primary" onClick={handleOpenAbsenModal} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
            <Camera size={16} /> + Ambil Foto Presensi Geofencing
          </button>
        </div>
      </div>

      {/* Multi-Site Geofencing Config Panel (BOD/Manager Access) */}
      {isConfigOpen && isBoss && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.4)', background: 'rgba(15, 23, 42, 0.9)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} /> Pengaturan Multi-Site Geofencing Proyek Perumahan
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tambahkan titik koordinat baru untuk site office cluster lain, gudang logistik, atau pos pemasaran.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAddLocation} style={{ background: '#38BDF8', color: '#0F172A', fontWeight: 800 }}>
              <Plus size={14} /> + Tambah Titik Lokasi
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {locations.map((loc, idx) => (
              <div key={loc.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Nama Titik Proyek</label>
                  <input
                    type="text"
                    className="form-control"
                    value={loc.siteName}
                    onChange={(e) => handleUpdateLocation(idx, 'siteName', e.target.value)}
                    style={{ fontSize: '0.825rem', height: '36px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Latitude (Lintang)</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="form-control"
                    value={loc.targetLat}
                    onChange={(e) => handleUpdateLocation(idx, 'targetLat', parseFloat(e.target.value))}
                    style={{ fontSize: '0.825rem', height: '36px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Longitude (Bujur)</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="form-control"
                    value={loc.targetLng}
                    onChange={(e) => handleUpdateLocation(idx, 'targetLng', parseFloat(e.target.value))}
                    style={{ fontSize: '0.825rem', height: '36px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Radius Toleransi (Meter)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={loc.maxRadiusMeters}
                    onChange={(e) => handleUpdateLocation(idx, 'maxRadiusMeters', parseInt(e.target.value, 10))}
                    style={{ fontSize: '0.825rem', height: '36px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '1.1rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteLocation(idx)} style={{ color: '#ef4444', height: '36px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Laporan Pekerjaan</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900 }}>
              {safeTodos.filter(t => t.completed).length} / {safeTodos.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Selesai</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Instruksi Pimpinan</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38BDF8' }}>
              {safeInstructions.filter(i => i.status === 'Selesai').length} / {safeInstructions.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 700 }}>Task</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Titik Multi-Site GPS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--success)' }}>
              {locations.length} Lokasi <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 700 }}>Aktif</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.15)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hak Akses</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isBoss ? '#F59E0B' : 'var(--success)' }}>
              {isBoss ? 'Pimpinan (BOD/GM)' : 'Staf Karyawan'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'laporan' ? 'active' : ''}`} onClick={() => setActiveTab('laporan')}>
          <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Laporan Pekerjaan Harian ({visibleReports.length})
        </button>
        <button className={`tab-item ${activeTab === 'instruksi' ? 'active' : ''}`} onClick={() => setActiveTab('instruksi')}>
          <Briefcase size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Instruksi Pekerjaan Pimpinan ({visibleInstructions.length})
        </button>
        <button className={`tab-item ${activeTab === 'absen' ? 'active' : ''}`} onClick={() => setActiveTab('absen')}>
          <Compass size={16} style={{ display: 'inline', marginRight: '6px' }} /> 3. Log Presensi Geofencing GPS ({safeAttendances.length})
        </button>
      </div>

      {/* ================================================================= */}
      {/* TAB 1: LAPORAN PEKERJAAN HARIAN (STAFF & TIM INPUT FORM)         */}
      {/* ================================================================= */}
      {activeTab === 'laporan' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          {/* CENTERED TITLE PERSIS SEPERTI GAMBAR SPREADSHEET */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.4rem', 
              fontWeight: 900, 
              color: 'var(--text-main)', 
              textDecoration: 'underline',
              textUnderlineOffset: '6px',
              letterSpacing: '0.5px',
              margin: '0 0 4px 0'
            }}>
              Laporan Pekerjaan Harian
            </h2>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              To Do List
            </div>
          </div>

          {/* TOP CONTROLS & DATE SELECTOR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Box Header Tanggal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                background: '#FDE047',
                color: '#1E293B',
                fontWeight: 900,
                fontSize: '0.95rem',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1.5px solid #EAB308',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Calendar size={16} /> Tanggal :
              </div>

              <input
                type="date"
                className="form-control"
                value={selectedDateFilter}
                onChange={(e) => {
                  setSelectedDateFilter(e.target.value);
                  setShowAllDates(false);
                }}
                style={{ width: '160px', height: '38px', fontWeight: 700, fontSize: '0.9rem', background: 'var(--bg-card)', borderColor: '#EAB308' }}
              />

              <button 
                className={`btn btn-sm ${!showAllDates && selectedDateFilter === todayDateStr ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setSelectedDateFilter(todayDateStr); setShowAllDates(false); }}
                style={{ height: '38px' }}
              >
                Hari Ini
              </button>

              <button 
                className={`btn btn-sm ${showAllDates ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setShowAllDates(!showAllDates)}
                style={{ height: '38px' }}
              >
                {showAllDates ? '✓ Tampilkan Semua Tanggal' : 'Tampilkan Semua Tanggal'}
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {isBoss && (
                <>
                  <button 
                    className={`btn btn-sm ${reportPicFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setReportPicFilter('all')}
                  >
                    Semua PIC ({safeTodos.length})
                  </button>
                  <button 
                    className={`btn btn-sm ${reportPicFilter === 'for_me' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setReportPicFilter('for_me')}
                  >
                    PIC Saya
                  </button>
                </>
              )}

              <button 
                className="btn btn-primary"
                onClick={handleOpenAddReportModal}
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}
              >
                <Plus size={16} /> + Tambah Baris Laporan
              </button>
            </div>
          </div>

          {/* EXACT SPREADSHEET TABLE: TANGGAL | WAKTU | LAPORAN HARIAN | KORDINASI | PIC */}
          <div className="table-container" style={{ border: '1.5px solid #EAB308', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FDE047', color: '#0F172A', borderBottom: '2px solid #CA8A04' }}>
                  <th style={{ width: '130px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Tanggal
                  </th>
                  <th style={{ width: '140px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Waktu
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Laporan harian
                  </th>
                  <th style={{ width: '220px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Kordinasi
                  </th>
                  <th style={{ width: '180px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    PIC
                  </th>
                  <th style={{ width: '140px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', textAlign: 'center' }}>
                    Status & Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleReports.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
                      <CheckCircle2 size={36} color="#EAB308" style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                        Tidak Ada Baris Laporan Pekerjaan Harian
                      </div>
                      <p style={{ fontSize: '0.825rem', marginTop: '4px' }}>
                        {showAllDates ? 'Belum ada data laporan.' : `Tidak ada pekerjaan tercatat pada tanggal ${selectedDateFilter}.`}
                        {' '}Klik tombol "+ Tambah Baris Laporan" di atas untuk mengisi.
                      </p>
                    </td>
                  </tr>
                ) : (
                  visibleReports.map((item, index) => (
                    <tr 
                      key={item.id || index}
                      style={{ 
                        background: item.completed ? 'rgba(16, 185, 129, 0.06)' : index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {/* 1. Kolom Tanggal */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {item.date || item.assignDate || todayDateStr}
                        </div>
                      </td>

                      {/* 2. Kolom Waktu */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#F59E0B', fontSize: '0.875rem' }}>
                          {item.waktu || '08:00 - 17:00'}
                        </div>
                      </td>

                      {/* 3. Kolom Laporan harian */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ 
                          fontWeight: 700, 
                          fontSize: '0.9rem', 
                          color: item.completed ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: item.completed ? 'line-through' : 'none',
                          lineHeight: 1.45
                        }}>
                          {item.laporan || item.text}
                        </div>
                        {item.notes && (
                          <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 6px', borderRadius: '4px' }}>
                            Catatan: {item.notes}
                          </div>
                        )}
                      </td>

                      {/* 4. Kolom Kordinasi Divisi */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        {getDivisionBadge(item.kordinasi)}
                      </td>

                      {/* 5. Kolom PIC */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {item.pic || item.assignee || '-'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                          {item.assignedBy ? `Oleh: ${item.assignedBy.split(' ')[0]}` : ''}
                        </div>
                      </td>

                      {/* 6. Kolom Status & Aksi */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {/* 1. Status Checklist Button */}
                          <button
                            onClick={() => handleToggleReport(item.id)}
                            className={`btn btn-sm ${item.completed ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ 
                              padding: '0.25rem 0.5rem', 
                              fontSize: '0.72rem', 
                              fontWeight: 800,
                              background: item.completed ? '#10B981' : undefined,
                              borderColor: item.completed ? '#059669' : undefined
                            }}
                            title="Klik untuk menyelesaikan"
                          >
                            {item.completed ? <Check size={12} /> : null} {item.completed ? 'Selesai' : 'Pending'}
                          </button>

                          {/* 2. Photo Proof Button */}
                          {item.photo ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => { setSelectedReportForPhotoModal(item); setIsReportPhotoModalOpen(true); }}
                              style={{ 
                                padding: '0.25rem 0.45rem', 
                                fontSize: '0.72rem', 
                                fontWeight: 800, 
                                background: 'rgba(56, 189, 248, 0.15)', 
                                color: '#38BDF8', 
                                borderColor: 'rgba(56, 189, 248, 0.4)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                              title="Lihat Foto Bukti Pekerjaan"
                            >
                              <Eye size={12} /> Foto Bukti
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditReportModal(item)}
                              style={{ 
                                padding: '0.25rem 0.45rem', 
                                fontSize: '0.72rem', 
                                color: 'var(--text-muted)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                              title="Upload Foto Bukti Pekerjaan"
                            >
                              <Camera size={12} /> + Foto
                            </button>
                          )}

                          {/* 3. Action Buttons */}
                          {(isBoss || isTaskAssignedToUser(item, currentUser)) && (
                            <>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleOpenEditReportModal(item)}
                                style={{ padding: '0.25rem 0.4rem' }}
                                title="Edit Baris"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleDeleteReport(item.id)}
                                style={{ padding: '0.25rem 0.4rem', color: '#ef4444' }}
                                title="Hapus Baris"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
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

      {/* ================================================================= */}
      {/* TAB 2: INSTRUKSI PEKERJAAN PIMPINAN (DIRECTIVES & DEADLINES)     */}
      {/* ================================================================= */}
      {activeTab === 'instruksi' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={22} color="#38BDF8" /> Instruksi & Penugasan Resmi Pimpinan
                </h3>
                {isBoss ? (
                  <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                    <ShieldCheck size={12} /> Mode Pimpinan (BOD / GM / Head)
                  </span>
                ) : (
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                    <UserCheck size={12} /> Menampilkan Tugas Untuk: {currentUser?.name}
                  </span>
                )}
                <span className="badge badge-success" style={{ fontSize: '0.72rem', background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', border: '1px solid #25D366' }}>
                  📲 WA Pak Yazid Terhubung (+{yazidWaNumber})
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                {isBoss
                  ? 'Direktur Utama, General Manager, dan Head Marketing menerbitkan instruksi resmi dengan batas waktu deadline kepada staf.'
                  : 'Daftar instruksi kerja dan mandat tugas dari Pimpinan. Mohon laporkan bukti hasil penyelesaian sebelum batas waktu.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => { setTempWaNumber(yazidWaNumber); setIsWaConfigOpen(true); }}
                style={{ fontSize: '0.75rem', height: '38px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                title="Ubah nomor WhatsApp tujuan Pak Yazid"
              >
                <PhoneCall size={14} color="#25D366" /> No. WA Pak Yazid (+{yazidWaNumber})
              </button>

              {isBoss && (
                <button 
                  className="btn btn-primary"
                  onClick={handleOpenAddInstructionModal}
                  style={{ background: 'linear-gradient(135deg, #0284C7, #0369A1)', border: 'none', fontWeight: 800, height: '38px' }}
                >
                  <Plus size={16} /> + Terbitkan Instruksi Baru
                </button>
              )}
            </div>
          </div>

          {/* Sub-Filter Tab Selector untuk Instruksi */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${insFilter === 'for_me' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setInsFilter('for_me')}
              style={{ fontSize: '0.78rem', fontWeight: insFilter === 'for_me' ? 800 : 500 }}
            >
              🎯 Ditujukan Untuk Saya ({safeInstructions.filter(i => isTaskAssignedToUser(i, currentUser)).length})
            </button>
            {isBoss && (
              <button
                className={`btn btn-sm ${insFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setInsFilter('all')}
                style={{ fontSize: '0.78rem', fontWeight: insFilter === 'all' ? 800 : 500 }}
              >
                📋 Seluruh Instruksi Proyek ({safeInstructions.length})
              </button>
            )}
            <button
              className={`btn btn-sm ${insFilter === 'by_me' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setInsFilter('by_me')}
              style={{ fontSize: '0.78rem', fontWeight: insFilter === 'by_me' ? 800 : 500 }}
            >
              📤 Yang Saya Terbitkan
            </button>
            <button
              className={`btn btn-sm ${insFilter === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setInsFilter('overdue')}
              style={{ fontSize: '0.78rem', fontWeight: insFilter === 'overdue' ? 800 : 500 }}
            >
              ⚠️ Melewati Batas Waktu ({safeInstructions.filter(i => isInstructionOverdue(i)).length})
            </button>
          </div>

          {/* Table Instruksi Pekerjaan */}
          <div className="table-container" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.85)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ width: '110px', padding: '0.85rem 1rem', fontWeight: 800 }}>No. & Tanggal</th>
                  <th style={{ width: '150px', padding: '0.85rem 1rem', fontWeight: 800, color: '#EF4444' }}>Batas Waktu (Deadline)</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Uraian Instruksi Pekerjaan</th>
                  <th style={{ width: '160px', padding: '0.85rem 1rem', fontWeight: 800 }}>Ditugaskan Kepada</th>
                  <th style={{ width: '160px', padding: '0.85rem 1rem', fontWeight: 800 }}>Pemberi Instruksi</th>
                  <th style={{ width: '140px', padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'center' }}>Status & Laporan</th>
                  <th style={{ width: '130px', padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'center', color: '#25D366' }}>Lapor WA Pak Yazid</th>
                  {isBoss && <th style={{ width: '80px', padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'center' }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {visibleInstructions.length === 0 ? (
                  <tr>
                    <td colSpan={isBoss ? 8 : 7} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={36} color="var(--success)" style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                        Tidak Ada Instruksi Pekerjaan
                      </div>
                      <p style={{ fontSize: '0.825rem', marginTop: '4px' }}>
                        {isBoss ? 'Klik "+ Terbitkan Instruksi Baru" untuk memberikan tugas kepada staf.' : 'Belum ada instruksi baru dari Pimpinan.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  visibleInstructions.map((ins, idx) => {
                    const isOver = isInstructionOverdue(ins);

                    return (
                      <tr key={ins.id || idx} style={{ background: ins.status === 'Selesai' ? 'rgba(16, 185, 129, 0.05)' : isOver ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                        {/* 1. No & Tanggal */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem' }}>
                          <span className="badge badge-secondary" style={{ fontSize: '0.72rem', fontWeight: 800 }}>{ins.id}</span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{ins.date}</div>
                        </td>

                        {/* 2. Batas Waktu */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 800, color: isOver ? '#EF4444' : '#F59E0B', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} /> {ins.dueDate}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Pukul {ins.dueTime || '17:00'} WIB</div>
                          {isOver && (
                            <span className="badge badge-danger" style={{ fontSize: '0.68rem', marginTop: '4px' }}>
                              Terlambat
                            </span>
                          )}
                        </td>

                        {/* 3. Uraian Instruksi */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                            {ins.instruction}
                          </div>
                          {ins.kordinasi && (
                            <div style={{ marginTop: '6px' }}>
                              {getDivisionBadge(ins.kordinasi)}
                            </div>
                          )}

                          {/* Laporan Bukti Tindak Lanjut */}
                          {ins.reportNotes && (
                            <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', borderLeft: '3px solid #10B981', fontSize: '0.78rem' }}>
                              <div style={{ fontWeight: 800, color: '#10B981', marginBottom: '2px' }}>
                                📝 Bukti Hasil Pekerjaan Staf ({ins.completionDate || 'Selesai'}):
                              </div>
                              <div style={{ color: 'var(--text-main)' }}>{ins.reportNotes}</div>
                            </div>
                          )}
                        </td>

                        {/* 4. Ditugaskan Kepada */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.85rem' }}>{ins.assignee}</div>
                          <span className={`badge ${ins.priority === 'Tinggi' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.68rem', marginTop: '4px' }}>
                            {ins.priority}
                          </span>
                        </td>

                        {/* 5. Pemberi Instruksi */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.825rem', color: '#F59E0B' }}>{ins.assignedBy}</div>
                        </td>

                        {/* 6. Status & Laporan */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem', textAlign: 'center' }}>
                          {ins.status === 'Selesai' ? (
                            <span className="badge badge-success" style={{ fontWeight: 800 }}>
                              <Check size={12} /> Selesai
                            </span>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleOpenActionReportModal(ins)}
                              style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', fontWeight: 800, background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none' }}
                            >
                              <Send size={12} /> Kirim Laporan Selesai
                            </button>
                          )}
                        </td>

                        {/* 7. Direct WhatsApp Button to Pak Yazid */}
                        <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem', textAlign: 'center' }}>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleSendToYazidWhatsApp(ins)}
                            style={{ 
                              background: '#25D366', 
                              color: '#FFFFFF', 
                              fontWeight: 800, 
                              fontSize: '0.72rem',
                              padding: '0.35rem 0.6rem',
                              border: 'none',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 4px rgba(37, 211, 102, 0.3)'
                            }}
                            title={`Kirim laporan instruksi ini langsung ke WhatsApp Pak Yazid (+${yazidWaNumber})`}
                          >
                            <MessageSquare size={13} /> Kirim ke WA
                          </button>
                        </td>

                        {/* 8. Aksi (Pimpinan) */}
                        {isBoss && (
                          <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditInstructionModal(ins)} style={{ padding: '0.25rem 0.4rem' }}>
                                <Edit2 size={12} />
                              </button>
                              <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteInstruction(ins.id)} style={{ padding: '0.25rem 0.4rem', color: '#ef4444' }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 3: GEOFENCING MULTI-SITE LOG & WATERMARK STAMP INSPECTION    */}
      {/* ================================================================= */}
      {activeTab === 'absen' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Log Presensi Geofencing Multi-Koordinat GPS</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Presensi valid jika karyawan berada di dalam radius salah satu dari <strong>{locations.length} titik koordinat resmi</strong> perusahaan.</p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenAbsenModal} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
              <Camera size={16} /> + Ambil Foto Presensi Geofencing
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Karyawan & Jabatan</th>
                  <th>Jam & Tanggal Presensi</th>
                  <th>Titik Lokasi Proyek (Radius)</th>
                  <th>Status Geofencing</th>
                  <th>Foto Bukti Watermark GPS</th>
                  <th>Status ACC Pimpinan</th>
                </tr>
              </thead>
              <tbody>
                {safeAttendances.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Belum ada log presensi GPS yang tercatat hari ini.
                    </td>
                  </tr>
                ) : (
                  safeAttendances.map((att) => (
                    <tr key={att.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{att.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{att.role}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{att.time}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{att.date}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{att.locationName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                          Jarak: {att.distanceMeters} meter ({att.lat.toFixed(4)}, {att.lng.toFixed(4)})
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Verified Geofence
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => { setSelectedPhotoAtt(att); setIsDetailPhotoModalOpen(true); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                        >
                          <Eye size={13} /> Lihat Foto ({att.photo ? 'Ada' : 'No Photo'})
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                          {att.accStatus === 'APPROVED' ? (
                            <span className="badge badge-success"><Check size={12} /> Approved</span>
                          ) : att.accStatus === 'REJECTED' ? (
                            <span className="badge badge-danger"><X size={12} /> Rejected</span>
                          ) : isBoss ? (
                            <>
                              <button className="btn btn-primary btn-sm" onClick={() => approveAttendancePhoto(att.id)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem' }}>
                                ACC
                              </button>
                              <button className="btn btn-secondary btn-sm" onClick={() => rejectAttendancePhoto(att.id)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem', color: '#ef4444' }}>
                                Tolak
                              </button>
                            </>
                          ) : (
                            <span className="badge badge-warning">Pending ACC</span>
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

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TAMBAH / EDIT BARIS LAPORAN PEKERJAAN HARIAN           */}
      {/* ------------------------------------------------------------- */}
      {isReportModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#F59E0B" /> {editingReportItem ? 'Edit Baris Laporan Pekerjaan' : 'Tambah Baris Laporan Pekerjaan Harian'}
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveReport}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>📅 Tanggal</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>⏰ Waktu (Rentang Jam)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 08:00 - 10:00"
                      value={newWaktu}
                      onChange={(e) => setNewWaktu(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📝 Laporan Pekerjaan Harian</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Uraian pekerjaan harian yang dilakukan / ditugaskan..."
                    value={newLaporan}
                    onChange={(e) => setNewLaporan(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>🤝 Koordinasi Divisi Terkait</label>
                  
                  {/* Select Dropdown Divisi */}
                  <select
                    className="form-control"
                    value={COMPANY_DIVISIONS.some(d => d.name === newKordinasi) ? newKordinasi : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setNewKordinasi(e.target.value);
                      }
                    }}
                    style={{ marginBottom: '0.4rem', fontWeight: 700, borderColor: '#38BDF8' }}
                  >
                    <option value="">-- Pilih Divisi Perusahaan --</option>
                    {COMPANY_DIVISIONS.map(d => (
                      <option key={d.id} value={d.name}>🏢 {d.name}</option>
                    ))}
                  </select>

                  {/* Input Teks Divisi / Catatan Pihak Terkait */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Atau ketik divisi / pihak terkait (misal: Finance, Direktur Utama, Marketing, Notaris)..."
                    value={newKordinasi}
                    onChange={(e) => setNewKordinasi(e.target.value)}
                  />

                  {/* Quick Pill Buttons */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {COMPANY_DIVISIONS.slice(0, 6).map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setNewKordinasi(d.name)}
                        style={{
                          background: newKordinasi === d.name ? d.color : 'rgba(255,255,255,0.05)',
                          color: newKordinasi === d.name ? '#0F172A' : d.color,
                          border: `1px solid ${d.color}60`,
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        + {d.short}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>👤 PIC (Person In Charge)</label>
                    {isBoss ? (
                      <select
                        className="form-control"
                        value={newPic}
                        onChange={(e) => setNewPic(e.target.value)}
                        required
                      >
                        {safeUsers.map(u => (
                          <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={`${currentUser?.name || ''} (${currentUser?.role || ''})`}
                        readOnly
                        style={{ background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed', color: '#38BDF8', fontWeight: 700 }}
                      />
                    )}
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>🚩 Prioritas</label>
                    <select
                      className="form-control"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                    >
                      <option value="Tinggi">🔴 Tinggi</option>
                      <option value="Sedang">🟡 Sedang</option>
                      <option value="Rendah">🟢 Rendah</option>
                    </select>
                  </div>
                </div>

                {/* Upload Foto Bukti Pekerjaan */}
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Camera size={16} color="#38BDF8" /> 📷 Foto Bukti Pekerjaan (Dokumentasi Lapangan / Berkas / Nota)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={reportFileInputRef}
                    onChange={handleReportPhotoUpload}
                    style={{ display: 'none' }}
                  />

                  {!reportPhoto ? (
                    <div 
                      onClick={() => reportFileInputRef.current && reportFileInputRef.current.click()}
                      style={{ 
                        border: '2px dashed var(--border-color)', 
                        borderRadius: '8px', 
                        padding: '1.25rem', 
                        textAlign: 'center', 
                        cursor: 'pointer', 
                        background: 'rgba(15, 23, 42, 0.4)',
                        transition: 'border-color 0.2s ease'
                      }}
                    >
                      <Upload size={24} color="#38BDF8" style={{ marginBottom: '4px' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Klik untuk Upload / Ambil Foto Bukti</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sistem akan mencantumkan stempel watermark waktu & nama PIC secara otomatis.</div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={reportPhoto} alt="Bukti Laporan" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
                      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.85)', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>✓ Foto Bukti Terlampir</span>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm"
                            onClick={() => reportFileInputRef.current && reportFileInputRef.current.click()}
                            style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                          >
                            Ganti Foto
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm"
                            onClick={() => setReportPhoto(null)}
                            style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', color: '#ef4444' }}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsReportModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                  <Check size={16} /> {editingReportItem ? 'Simpan Perubahan' : 'Terbitkan Baris Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TAMBAH / EDIT INSTRUKSI PEKERJAAN PIMPINAN             */}
      {/* ------------------------------------------------------------- */}
      {isInstructionModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={20} color="#38BDF8" /> {editingInstructionItem ? 'Edit Instruksi Pekerjaan' : 'Terbitkan Instruksi Pekerjaan Baru'}
              </h3>
              <button onClick={() => setIsInstructionModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveInstruction}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>📅 Tanggal Diberikan</label>
                    <input
                      type="date"
                      className="form-control"
                      value={insDate}
                      onChange={(e) => setInsDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800, color: '#EF4444' }}>⏰ Deadline (Tanggal)</label>
                    <input
                      type="date"
                      className="form-control"
                      value={insDueDate}
                      onChange={(e) => setInsDueDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800, color: '#EF4444' }}>🕒 Jam Deadline</label>
                    <input
                      type="time"
                      className="form-control"
                      value={insDueTime}
                      onChange={(e) => setInsDueTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📜 Uraian Instruksi Pekerjaan</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Tuliskan arahan, target, atau rincian instruksi pekerjaan yang wajib dikerjakan..."
                    value={insText}
                    onChange={(e) => setInsText(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>🤝 Koordinasi Divisi Terkait</label>
                  
                  {/* Select Dropdown Divisi */}
                  <select
                    className="form-control"
                    value={COMPANY_DIVISIONS.some(d => d.name === insKordinasi) ? insKordinasi : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setInsKordinasi(e.target.value);
                      }
                    }}
                    style={{ marginBottom: '0.4rem', fontWeight: 700, borderColor: '#38BDF8' }}
                  >
                    <option value="">-- Pilih Divisi Perusahaan --</option>
                    {COMPANY_DIVISIONS.map(d => (
                      <option key={d.id} value={d.name}>🏢 {d.name}</option>
                    ))}
                  </select>

                  {/* Input Teks Divisi / Catatan Pihak Terkait */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Atau ketik divisi / pihak terkait (misal: Finance, Direktur Utama, Marketing, Notaris)..."
                    value={insKordinasi}
                    onChange={(e) => setInsKordinasi(e.target.value)}
                  />

                  {/* Quick Pill Buttons */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {COMPANY_DIVISIONS.slice(0, 6).map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setInsKordinasi(d.name)}
                        style={{
                          background: insKordinasi === d.name ? d.color : 'rgba(255,255,255,0.05)',
                          color: insKordinasi === d.name ? '#0F172A' : d.color,
                          border: `1px solid ${d.color}60`,
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        + {d.short}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>👤 Ditugaskan Kepada (Staf PIC)</label>
                    <select
                      className="form-control"
                      value={insAssignee}
                      onChange={(e) => setInsAssignee(e.target.value)}
                      required
                    >
                      {safeUsers.map(u => (
                        <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>🚩 Tingkat Prioritas</label>
                    <select
                      className="form-control"
                      value={insPriority}
                      onChange={(e) => setInsPriority(e.target.value)}
                    >
                      <option value="Tinggi">🔴 Tinggi (Urgent)</option>
                      <option value="Sedang">🟡 Sedang</option>
                      <option value="Rendah">🟢 Rendah</option>
                    </select>
                  </div>
                </div>

                {/* WhatsApp Auto-Send Option */}
                <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '8px', border: '1px solid rgba(37, 211, 102, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    <input
                      type="checkbox"
                      checked={autoSendWa}
                      onChange={(e) => setAutoSendWa(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#25D366' }}
                    />
                    📲 Buka WhatsApp Pak Yazid (+{yazidWaNumber}) Langsung
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#25D366', fontWeight: 800 }}>Otomatis</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsInstructionModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #0284C7, #0369A1)', border: 'none', fontWeight: 800 }}>
                  <Send size={15} /> {editingInstructionItem ? 'Simpan Perubahan' : 'Terbitkan & Kirim ke WA Pak Yazid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: INPUT BUKTI / LAPORAN TINDAK LANJUT INSTRUKSI STAF     */}
      {/* ------------------------------------------------------------- */}
      {isActionReportModalOpen && selectedInstructionForAction && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={20} color="#10B981" /> Laporan Penyelesaian Instruksi Pekerjaan
              </h3>
              <button onClick={() => setIsActionReportModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveActionReport}>
              <div className="modal-body">
                <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>INSTRUKSI PIMPINAN:</div>
                  <div style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--text-main)', marginTop: '2px' }}>
                    {selectedInstructionForAction.instruction}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '4px' }}>
                    ⏰ Deadline: {selectedInstructionForAction.dueDate} pk {selectedInstructionForAction.dueTime} WIB &bull; Diberikan Oleh: {selectedInstructionForAction.assignedBy}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>Uraian Bukti Hasil Tindak Lanjut & Keterangan Selesai</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Tuliskan laporan hasil tindak lanjut yang telah Anda selesaikan..."
                    value={actionReportText}
                    onChange={(e) => setActionReportText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(37, 211, 102, 0.12)', borderRadius: '8px', border: '1px solid rgba(37, 211, 102, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                  <MessageSquare size={16} color="#25D366" />
                  <div>
                    Laporan ini akan <strong>otomatis langsung diteruskan ke WhatsApp Pak Yazid</strong> (+{yazidWaNumber}) saat Anda menekan tombol di bawah.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsActionReportModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  <Check size={16} /> Simpan & Kirim ke WA Pak Yazid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PENGATURAN NOMOR WHATSAPP PAK YAZID                     */}
      {/* ------------------------------------------------------------- */}
      {isWaConfigOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={20} color="#25D366" /> Atur Nomor WhatsApp Pak Yazid
              </h3>
              <button onClick={() => setIsWaConfigOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveWaNumber}>
              <div className="modal-body">
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Masukkan nomor WhatsApp resmi Pak Yazid (Direktur Utama) yang akan menerima laporan hasil kerja dan notifikasi instruksi pekerjaan staf secara otomatis.
                </p>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Nomor WhatsApp (Awali 62 atau 08)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: 081288889999 atau 6281288889999"
                    value={tempWaNumber}
                    onChange={(e) => setTempWaNumber(e.target.value)}
                    required
                    style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.5px' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsWaConfigOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', border: 'none', fontWeight: 800 }}>
                  <Check size={16} /> Simpan Nomor WA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: AMBIL FOTO PRESENSI GEOFENCING GPS                     */}
      {/* ------------------------------------------------------------- */}
      {isAbsenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={20} color="#10B981" /> Form Presensi Geofencing GPS Multi-Site
              </h3>
              <button onClick={() => setIsAbsenModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitAbsensi}>
              <div className="modal-body">
                <div style={{ padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', background: userGps.isWithinRadius ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: userGps.isWithinRadius ? '1px solid #10B981' : '1px solid #EF4444' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: userGps.isWithinRadius ? '#10B981' : '#EF4444', fontSize: '0.9rem' }}>
                    {userGps.isWithinRadius ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    {userGps.loading ? 'Mendeteksi Posisi Satelit GPS...' : userGps.isWithinRadius ? `Lokasi Valid: ${userGps.matchedLocation}` : 'Diluar Radius Proyek'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px' }}>
                    {userGps.lat && userGps.lng ? (
                      <>Koordinat: {userGps.lat.toFixed(6)}, {userGps.lng.toFixed(6)} &bull; Jarak: {userGps.distanceMeters}m dari titik pusat (Akurasi: ±{userGps.accuracy}m)</>
                    ) : (
                      userGps.error || 'Mengaktifkan sensor GPS...'
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Foto Bukti Fisik / Selfie di Lokasi Proyek</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    ref={absenFileInputRef}
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  
                  {!uploadedAbsenPhoto ? (
                    <div 
                      onClick={() => absenFileInputRef.current && absenFileInputRef.current.click()}
                      style={{ border: '2px dashed var(--border-color)', borderRadius: '10px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.4)' }}
                    >
                      <Camera size={36} color="#38BDF8" style={{ marginBottom: '0.5rem' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Klik untuk Ambil Foto Kamera Wajah</div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Sistem akan mencantumkan watermark stempel waktu & koordinat secara otomatis.</p>
                    </div>
                  ) : (
                    <div>
                      <img src={uploadedAbsenPhoto} alt="Watermark Preview" style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border-color)' }} />
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => absenFileInputRef.current && absenFileInputRef.current.click()}
                        style={{ marginTop: '0.5rem', width: '100%' }}
                      >
                        <Camera size={14} /> Ambil Ulang Foto
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAbsenModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  <CheckCircle2 size={16} /> Kirim Presensi Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DETAIL FOTO BUKTI LAPORAN PEKERJAAN HARIAN              */}
      {/* ------------------------------------------------------------- */}
      {isReportPhotoModalOpen && selectedReportForPhotoModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={20} color="#F59E0B" /> Foto Bukti Pekerjaan Harian
              </h3>
              <button onClick={() => setIsReportPhotoModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#000' }}>
                <img src={selectedReportForPhotoModal.photo} alt="Bukti Laporan" style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', display: 'block' }} />
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', fontSize: '0.825rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                  {selectedReportForPhotoModal.laporan || selectedReportForPhotoModal.text}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '6px', color: 'var(--text-muted)' }}>
                  <div><strong>👤 PIC:</strong> {selectedReportForPhotoModal.pic || selectedReportForPhotoModal.assignee}</div>
                  <div><strong>📅 Tanggal:</strong> {selectedReportForPhotoModal.date || selectedReportForPhotoModal.assignDate}</div>
                  <div><strong>⏰ Waktu:</strong> {selectedReportForPhotoModal.waktu || '08:00 - 17:00'}</div>
                  <div><strong>🤝 Kordinasi:</strong> {selectedReportForPhotoModal.kordinasi || '-'}</div>
                </div>
                {selectedReportForPhotoModal.notes && (
                  <div style={{ marginTop: '6px', color: '#10B981', fontWeight: 600 }}>
                    Catatan: {selectedReportForPhotoModal.notes}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsReportPhotoModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DETAIL INSPEKSI FOTO WATERMARK                          */}
      {/* ------------------------------------------------------------- */}
      {isDetailPhotoModalOpen && selectedPhotoAtt && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={20} color="#38BDF8" /> Detail Foto Watermark Forensik Presensi
              </h3>
              <button onClick={() => setIsDetailPhotoModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <img src={selectedPhotoAtt.photo} alt="Foto Presensi" style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem', border: '1px solid var(--border-color)' }} />
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <div><strong>Karyawan:</strong> {selectedPhotoAtt.name} ({selectedPhotoAtt.role})</div>
                <div><strong>Waktu & Tanggal:</strong> {selectedPhotoAtt.date} pk {selectedPhotoAtt.time}</div>
                <div><strong>Titik Proyek:</strong> {selectedPhotoAtt.locationName} (Jarak: {selectedPhotoAtt.distanceMeters} meter)</div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsDetailPhotoModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
