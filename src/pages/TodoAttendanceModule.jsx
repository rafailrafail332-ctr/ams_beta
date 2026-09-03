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
  PhoneCall,
  Megaphone,
  Pin,
  Search,
  Heart,
  Bookmark
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

export const MEDIA_CATEGORIES = [
  { id: 'CAT-ALL', label: 'Semua Informasi', icon: '📢', color: '#38BDF8' },
  { id: 'CAT-OFFICE', label: 'Pengumuman Kantor', icon: '🏢', color: '#38BDF8' },
  { id: 'CAT-SITE', label: 'Update Lapangan', icon: '🏗️', color: '#EAB308' },
  { id: 'CAT-MKT', label: 'Marketing & Promo', icon: '💡', color: '#10B981' },
  { id: 'CAT-URGENT', label: 'Peringatan Penting', icon: '⚠️', color: '#EF4444' },
  { id: 'CAT-VENDOR', label: 'Vendor & Logistik', icon: '📦', color: '#A855F7' },
  { id: 'CAT-EVENT', label: 'Acara & Agenda', icon: '🎉', color: '#EC4899' }
];

export const COMPANY_PROJECTS = [
  { id: 'PROJ-ALL', name: 'Semua Proyek', short: 'Semua Proyek', icon: '🏗️', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
  { id: 'PROJ-PARK', name: 'Ashoka Park (Lokasi 1)', short: 'Ashoka Park', icon: '🌳', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'PROJ-VIEW', name: 'Ashoka View (Lokasi 2)', short: 'Ashoka View', icon: '🏔️', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'PROJ-HO', name: 'Kantor Pusat / Head Office', short: 'Kantor Pusat', icon: '🏢', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)' }
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
    setInstructions,
    mediaInfoList,
    setMediaInfoList
  } = useApp();

  // Helper to render Project Badge
  const getProjectBadge = (proyekName) => {
    const pStr = (proyekName || '').toLowerCase();
    if (pStr.includes('view')) {
      return (
        <span 
          onClick={(e) => { e.stopPropagation(); setReportProjectFilter('Ashoka View'); }}
          style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
          title="Klik untuk menyaring laporan proyek Ashoka View"
        >
          🏔️ Ashoka View
        </span>
      );
    }
    if (pStr.includes('park')) {
      return (
        <span 
          onClick={(e) => { e.stopPropagation(); setReportProjectFilter('Ashoka Park'); }}
          style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
          title="Klik untuk menyaring laporan proyek Ashoka Park"
        >
          🌳 Ashoka Park
        </span>
      );
    }
    return (
      <span 
        onClick={(e) => { e.stopPropagation(); setReportProjectFilter('Kantor Pusat'); }}
        style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
        title="Klik untuk menyaring Kantor Pusat / Umum"
      >
        🏢 {proyekName || 'Kantor Pusat'}
      </span>
    );
  };

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
  // Active Date Selector (Format: YYYY-MM-DD using local timezone)
  const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDateStr = formatLocalDate(new Date());
  const nowForMonth = new Date();
  const firstDayOfMonthStr = formatLocalDate(new Date(nowForMonth.getFullYear(), nowForMonth.getMonth(), 1));
  const lastDayOfMonthStr = formatLocalDate(new Date(nowForMonth.getFullYear(), nowForMonth.getMonth() + 1, 0));
  const past7DaysDateStr = formatLocalDate(new Date(Date.now() - 7 * 86400000));

  const [startDateFilter, setStartDateFilter] = useState(todayDateStr);
  const [endDateFilter, setEndDateFilter] = useState(todayDateStr);
  const [showAllDates, setShowAllDates] = useState(false);

  // Quick Preset Handlers for Date Range
  const handleSetDateToday = () => {
    setStartDateFilter(todayDateStr);
    setEndDateFilter(todayDateStr);
    setShowAllDates(false);
  };

  const handleSetDate7Days = () => {
    setStartDateFilter(past7DaysDateStr);
    setEndDateFilter(todayDateStr);
    setShowAllDates(false);
  };

  const handleSetDateThisMonth = () => {
    setStartDateFilter(firstDayOfMonthStr);
    setEndDateFilter(lastDayOfMonthStr);
    setShowAllDates(false);
  };

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

  // Sub-filter for reports: 'all' | 'for_me' (Default 'all' agar seluruh staf & pimpinan bisa melihat rekapitulasi)
  const [reportPicFilter, setReportPicFilter] = useState('all');
  const [reportProjectFilter, setReportProjectFilter] = useState('all');
  const [reportDivisionFilter, setReportDivisionFilter] = useState('all');
  const [reportStatusFilter, setReportStatusFilter] = useState('all');
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState('all');

  // Modal State for Adding/Editing Daily Work Report Item
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingReportItem, setEditingReportItem] = useState(null);
  const [newProject, setNewProject] = useState('Ashoka Park');

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

  // Helper to check if a report is related to an employee name (PIC, Pemberi, Kordinasi, atau Disebutkan di Laporan)
  const isReportRelatedToEmployee = (report, targetName) => {
    if (!report || !targetName || targetName === 'all') return true;
    const normalize = (str) => (str || '')
      .toLowerCase()
      .replace(/[\(\)\[\],.\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const targetNorm = normalize(targetName);
    const picNorm = normalize(report.pic || report.assignee || '');
    const assignedByNorm = normalize(report.assignedBy || '');
    const kordinasiNorm = normalize(report.kordinasi || '');
    const laporanNorm = normalize(report.laporan || report.text || '');

    if (picNorm.includes(targetNorm) || targetNorm.includes(picNorm)) return true;
    if (assignedByNorm.includes(targetNorm)) return true;
    if (kordinasiNorm.includes(targetNorm)) return true;
    if (laporanNorm.includes(targetNorm)) return true;

    // Token matching
    const ignoredWords = ['staf', 'staff', 'head', 'manager', 'direktur', 'utama', 'general', 'super', 'admin', 'se', 'st', 'sh', 'ssi', 'mba', 'mm', 'pt', 'cv'];
    const targetTokens = targetNorm.split(' ').filter(w => w.length >= 3 && !ignoredWords.includes(w));
    
    if (targetTokens.length > 0) {
      if (targetTokens.some(tok => picNorm.includes(tok) || assignedByNorm.includes(tok) || kordinasiNorm.includes(tok))) {
        return true;
      }
    }

    return false;
  };

  // FILTERED REPORTS: By Date Range, By Project (Park/View), By PIC, By Division, By Status, and By Related Employee Name
  const visibleReports = safeTodos.filter((t) => {
    if (!showAllDates) {
      const taskDate = t.date || t.assignDate || '';
      if (taskDate) {
        if (startDateFilter && taskDate < startDateFilter) return false;
        if (endDateFilter && taskDate > endDateFilter) return false;
      }
    }

    if (reportProjectFilter !== 'all') {
      const proj = (t.proyek || t.project || '').toLowerCase();
      const filter = reportProjectFilter.toLowerCase();
      if (!proj.includes(filter)) {
        const lap = (t.laporan || t.text || '').toLowerCase();
        const kor = (t.kordinasi || '').toLowerCase();
        if (!lap.includes(filter) && !kor.includes(filter)) return false;
      }
    }

    if (reportPicFilter === 'for_me') {
      if (!isTaskAssignedToUser(t, currentUser)) return false;
    }

    if (selectedEmployeeFilter !== 'all') {
      if (!isReportRelatedToEmployee(t, selectedEmployeeFilter)) return false;
    }

    if (reportStatusFilter === 'completed' && !t.completed) return false;
    if (reportStatusFilter === 'pending' && t.completed) return false;

    if (reportDivisionFilter !== 'all') {
      const kordinasi = (t.kordinasi || '').toLowerCase();
      if (!kordinasi.includes(reportDivisionFilter.toLowerCase())) {
        return false;
      }
    }

    // Rekapitulasi penuh dapat dilihat oleh seluruh karyawan
    return true;
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

  // Calculate 2-Day Allowed Window (Hari Ini & Kemarin)
  const yesterdayDateStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();

  const handleOpenAddReportModal = () => {
    setEditingReportItem(null);
    setNewDate(todayDateStr);
    setNewWaktu('08:00 - 10:00');
    setNewProject('Ashoka Park');
    setNewLaporan('');
    setNewKordinasi('');
    setNewPic(isBoss ? (safeUsers[0]?.name || 'Syamsul Dahari') : (currentUser?.name || ''));
    setNewPriority('Sedang');
    setReportPhoto(null);
    setIsReportModalOpen(true);
  };

  const handleOpenEditReportModal = (item) => {
    // Jika bukan pimpinan dan tanggal laporan lebih lampau dari 2 hari (sebelum kemarin), kunci pengeditan
    if (!isBoss && item.date && item.date < yesterdayDateStr) {
      showNotification(`Laporan tanggal lampau (${item.date}) telah melewati batas toleransi 2 hari dan tidak dapat diubah lagi oleh staf.`, 'danger');
      return;
    }

    setEditingReportItem(item);
    setNewDate(item.date || item.assignDate || todayDateStr);
    setNewWaktu(item.waktu || '08:00 - 10:00');
    setNewProject(item.proyek || item.project || 'Ashoka Park');
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

    // Strict Rule: Toleransi 2 hari (H & H-1). Tanggal sebelum kemarin (H-2) dikunci
    if (!isBoss && newDate < yesterdayDateStr) {
      showNotification(`Pengisian laporan sebelum tanggal ${yesterdayDateStr} sudah ditutup. Batas maksimal pengisian adalah 2 hari (Hari Ini & Kemarin).`, 'danger');
      return;
    }

    if (!isBoss && newDate > todayDateStr) {
      showNotification(`Tidak dapat mengisi laporan untuk tanggal masa depan (${newDate}).`, 'danger');
      return;
    }

    let targetUser = safeUsers.find(u => u.name === newPic || u.id === newPic) || safeUsers.find(u => u.name === currentUser?.name) || safeUsers[0];
    let finalPic = targetUser ? targetUser.name : newPic;
    let finalPicId = targetUser ? targetUser.id : '';
    let finalAssignedBy = isBoss ? `${currentUser?.name} (${currentUser?.role})` : `${currentUser?.name} (Staf)`;

    if (editingReportItem) {
      setTodos(safeTodos.map(t => {
        if (t.id === editingReportItem.id) {
          return {
            ...t,
            date: newDate,
            waktu: newWaktu,
            proyek: newProject,
            project: newProject,
            laporan: newLaporan.trim(),
            text: newLaporan.trim(),
            kordinasi: newKordinasi.trim(),
            pic: finalPic,
            assignee: finalPic,
            picId: finalPicId,
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
        proyek: newProject,
        project: newProject,
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
      showNotification(`Laporan pekerjaan harian (${newItem.proyek}) berhasil ditambahkan atas nama ${newItem.pic}!`, 'success');
    }

    setIsReportModalOpen(false);
  };

  const handleDeleteReport = (id) => {
    const itemToDelete = safeTodos.find(t => t.id === id);
    if (!itemToDelete) return;

    if (!isBoss && itemToDelete.date && itemToDelete.date < yesterdayDateStr) {
      showNotification(`Laporan tanggal lampau (${itemToDelete.date}) telah melewati batas toleransi 2 hari dan tidak dapat dihapus oleh staf.`, 'danger');
      return;
    }

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
    const [insProject, setInsProject] = useState('Ashoka Park');
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
🏗️ *Lokasi Proyek:* ${ins.proyek || 'Ashoka Park'}
📅 *Tanggal Diterbitkan:* ${ins.date}
⏰ *Batas Waktu (Deadline):* ${ins.dueDate} pk ${ins.dueTime || '17:00'} WIB
📜 *Uraian Instruksi:* 
"${ins.instruction}"

🤝 *Koordinasi:* ${ins.kordinasi || '-'}
👤 *Ditugaskan Kepada:* ${ins.assignee}
👑 *Pemberi Instruksi:* ${ins.assignedBy}
${isSelesai ? `\n📝 *Laporan Hasil:* \n"${customNote || ins.reportNotes || 'Telah diselesaikan'}"\n🕒 *Selesai Pada:* ${ins.completionDate || 'Hari ini'}` : ''}
--------------------------------------------------
_Notifikasi otomatis Sistem AMS Ashoka Enterprise_`;

    const encodedMsg = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
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
      showNotification('Akses Terbatas: Hanya Pimpinan yang berhak menerbitkan Instruksi Pekerjaan!', 'danger');
      return;
    }
    setEditingInstructionItem(null);
    setInsDate(todayDateStr);
    setInsDueDate(todayDateStr);
    setInsDueTime('17:00');
    setInsProject('Ashoka Park');
    setInsText('');
    setInsKordinasi('');
    setInsAssignee(safeUsers[0]?.name || 'Syamsul Dahari');
    setInsPriority('Tinggi');
    setIsInstructionModalOpen(true);
  };

  const handleOpenEditInstructionModal = (ins) => {
    if (!isBoss) {
      showNotification('Akses Terbatas: Hanya Pimpinan yang berhak mengubah Instruksi Pekerjaan!', 'danger');
      return;
    }
    setEditingInstructionItem(ins);
    setInsDate(ins.date || todayDateStr);
    setInsDueDate(ins.dueDate || todayDateStr);
    setInsDueTime(ins.dueTime || '17:00');
    setInsProject(ins.proyek || ins.project || 'Ashoka Park');
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
            proyek: insProject,
            project: insProject,
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
        proyek: insProject,
        project: insProject,
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
      showNotification(`INSTRUKSI PEKERJAAN (${newIns.proyek}) DITERBITKAN! Ditugaskan resmi kepada ${newIns.assignee}.`, 'success');

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
  // 4. STATE & HANDLERS UNTUK TAB 4: MEDIA INFORMASI & PENGUMUMAN
  // (DAPAT DIBACA OLEH SEMUA KARYAWAN & SEMUA ORANG DAPAT MENGISI/POSTING)
  // -----------------------------------------------------------------
  const safeMediaInfo = Array.isArray(mediaInfoList) ? mediaInfoList : [];
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  
  // Modal State for Adding/Editing Media Info
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMediaItem, setEditingMediaItem] = useState(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState('Pengumuman Kantor');
  const [mediaTargetDivision, setMediaTargetDivision] = useState('Seluruh Karyawan & Divisi');
  const [mediaContent, setMediaContent] = useState('');
  const [mediaIsPinned, setMediaIsPinned] = useState(false);
  const [mediaPhoto, setMediaPhoto] = useState(null);
  const mediaFileInputRef = useRef(null);

  // Detail Modal State
  const [selectedMediaDetail, setSelectedMediaDetail] = useState(null);
  const [isMediaDetailModalOpen, setIsMediaDetailModalOpen] = useState(false);

  const handleMediaPhotoUpload = (e) => {
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setMediaPhoto(dataUrl);
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddMediaModal = () => {
    setEditingMediaItem(null);
    setMediaTitle('');
    setMediaCategory('Pengumuman Kantor');
    setMediaTargetDivision('Seluruh Karyawan & Divisi');
    setMediaContent('');
    setMediaIsPinned(false);
    setMediaPhoto(null);
    setIsMediaModalOpen(true);
  };

  const handleOpenEditMediaModal = (item) => {
    setEditingMediaItem(item);
    setMediaTitle(item.title || '');
    setMediaCategory(item.category || 'Pengumuman Kantor');
    setMediaTargetDivision(item.targetDivision || 'Seluruh Karyawan & Divisi');
    setMediaContent(item.content || '');
    setMediaIsPinned(!!item.isPinned);
    setMediaPhoto(item.photo || null);
    setIsMediaModalOpen(true);
  };

  const handleSaveMedia = (e) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaContent.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const dateStr = now.toISOString().split('T')[0];

    const matchedCat = MEDIA_CATEGORIES.find(c => c.label === mediaCategory);
    const catColor = matchedCat ? matchedCat.color : '#38BDF8';

    if (editingMediaItem) {
      setMediaInfoList(safeMediaInfo.map(m => {
        if (m.id === editingMediaItem.id) {
          return {
            ...m,
            title: mediaTitle.trim(),
            category: mediaCategory,
            categoryColor: catColor,
            targetDivision: mediaTargetDivision,
            content: mediaContent.trim(),
            isPinned: mediaIsPinned,
            photo: mediaPhoto || m.photo || null
          };
        }
        return m;
      }));
      showNotification('Informasi / Pengumuman berhasil diperbarui!', 'success');
    } else {
      const newNotice = {
        id: `INFO-${Date.now().toString().slice(-4)}`,
        title: mediaTitle.trim(),
        category: mediaCategory,
        categoryColor: catColor,
        targetDivision: mediaTargetDivision,
        content: mediaContent.trim(),
        author: currentUser?.name || 'Staf AMS',
        authorRole: currentUser?.role || 'Karyawan',
        date: dateStr,
        time: timeStr,
        isPinned: mediaIsPinned,
        likesCount: 1,
        likedBy: [currentUser?.id || 'USR-001'],
        readBy: [currentUser?.name || 'Staf'],
        photo: mediaPhoto || null
      };
      setMediaInfoList([newNotice, ...safeMediaInfo]);
      showNotification('Pengumuman / Informasi baru berhasil diterbitkan untuk seluruh tim!', 'success');
    }
    setIsMediaModalOpen(false);
  };

  const handleDeleteMedia = (id) => {
    if (window.confirm('Hapus postingan informasi ini?')) {
      setMediaInfoList(safeMediaInfo.filter(m => m.id !== id));
      showNotification('Informasi berhasil dihapus.', 'warning');
    }
  };

  const handleToggleLikeMedia = (id) => {
    const myId = currentUser?.id || 'USR-001';
    setMediaInfoList(safeMediaInfo.map(m => {
      if (m.id === id) {
        const liked = Array.isArray(m.likedBy) && m.likedBy.includes(myId);
        const nextLikedBy = liked ? m.likedBy.filter(x => x !== myId) : [...(m.likedBy || []), myId];
        return {
          ...m,
          likedBy: nextLikedBy,
          likesCount: nextLikedBy.length
        };
      }
      return m;
    }));
  };

  const handleMarkAsReadMedia = (id) => {
    const myName = currentUser?.name || 'Staf';
    setMediaInfoList(safeMediaInfo.map(m => {
      if (m.id === id) {
        const reads = Array.isArray(m.readBy) ? m.readBy : [];
        if (!reads.includes(myName)) {
          return { ...m, readBy: [...reads, myName] };
        }
      }
      return m;
    }));
  };

  // Filtered Media Information List
  const visibleMediaList = safeMediaInfo.filter(m => {
    if (mediaCategoryFilter !== 'all' && m.category !== mediaCategoryFilter) return false;
    if (mediaSearchQuery.trim()) {
      const q = mediaSearchQuery.toLowerCase();
      const titleMatch = (m.title || '').toLowerCase().includes(q);
      const contentMatch = (m.content || '').toLowerCase().includes(q);
      const authorMatch = (m.author || '').toLowerCase().includes(q);
      const catMatch = (m.category || '').toLowerCase().includes(q);
      if (!titleMatch && !contentMatch && !authorMatch && !catMatch) return false;
    }
    return true;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (b.id > a.id ? 1 : -1);
  });

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
        <button className={`tab-item ${activeTab === 'media-info' ? 'active' : ''}`} onClick={() => setActiveTab('media-info')} style={{ borderColor: activeTab === 'media-info' ? '#38BDF8' : undefined }}>
          <Megaphone size={16} style={{ display: 'inline', marginRight: '6px', color: '#38BDF8' }} /> 4. 📢 Media Informasi & Mading Tim ({safeMediaInfo.length})
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

          {/* REKAPITULASI SUMMARY CARDS (BISA DILIHAT OLEH SEMUA KARYAWAN) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.3)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FDE047', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                📋
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Rekap Laporan</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{visibleReports.length} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pekerjaan</span></div>
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#10B981', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                ✓
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase' }}>Pekerjaan Selesai</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10B981' }}>{visibleReports.filter(r => r.completed).length} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Selesai</span></div>
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F59E0B', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                ⏳
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase' }}>Dalam Proses / Pending</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F59E0B' }}>{visibleReports.filter(r => !r.completed).length} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending</span></div>
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#38BDF8', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                👥
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>PIC Terlibat</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38BDF8' }}>{new Set(visibleReports.map(r => r.pic || r.assignee)).size} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Karyawan</span></div>
              </div>
            </div>
          </div>

          {/* TOP CONTROLS & DATE SELECTOR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Box Header Rentang Tanggal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', background: 'rgba(234, 179, 8, 0.08)', padding: '0.4rem 0.65rem', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.25)' }}>
              <div style={{
                background: '#FDE047',
                color: '#1E293B',
                fontWeight: 900,
                fontSize: '0.85rem',
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                border: '1.5px solid #EAB308',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Calendar size={15} /> Rentang Tanggal:
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>Dari:</span>
                <input
                  type="date"
                  className="form-control"
                  value={startDateFilter}
                  onChange={(e) => {
                    setStartDateFilter(e.target.value);
                    setShowAllDates(false);
                  }}
                  style={{ width: '135px', height: '34px', fontWeight: 700, fontSize: '0.8rem', background: 'var(--bg-card)', borderColor: '#EAB308' }}
                />
              </div>

              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EAB308' }}>s/d</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>Sampai:</span>
                <input
                  type="date"
                  className="form-control"
                  value={endDateFilter}
                  onChange={(e) => {
                    setEndDateFilter(e.target.value);
                    setShowAllDates(false);
                  }}
                  style={{ width: '135px', height: '34px', fontWeight: 700, fontSize: '0.8rem', background: 'var(--bg-card)', borderColor: '#EAB308' }}
                />
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: '3px' }}>
                <button 
                  className={`btn btn-sm ${!showAllDates && startDateFilter === todayDateStr && endDateFilter === todayDateStr ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={handleSetDateToday}
                  style={{ height: '34px', fontSize: '0.75rem', padding: '0 0.45rem', fontWeight: !showAllDates && startDateFilter === todayDateStr && endDateFilter === todayDateStr ? 800 : 500 }}
                >
                  Hari Ini
                </button>
                <button 
                  className={`btn btn-sm ${!showAllDates && startDateFilter === past7DaysDateStr && endDateFilter === todayDateStr ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={handleSetDate7Days}
                  style={{ height: '34px', fontSize: '0.75rem', padding: '0 0.45rem', fontWeight: !showAllDates && startDateFilter === past7DaysDateStr && endDateFilter === todayDateStr ? 800 : 500 }}
                >
                  7 Hari
                </button>
                <button 
                  className={`btn btn-sm ${!showAllDates && startDateFilter === firstDayOfMonthStr && endDateFilter === lastDayOfMonthStr ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={handleSetDateThisMonth}
                  style={{ height: '34px', fontSize: '0.75rem', padding: '0 0.45rem', fontWeight: !showAllDates && startDateFilter === firstDayOfMonthStr && endDateFilter === lastDayOfMonthStr ? 800 : 500 }}
                >
                  Bulan Ini
                </button>
                <button 
                  className={`btn btn-sm ${showAllDates ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setShowAllDates(!showAllDates)}
                  style={{ height: '34px', fontSize: '0.75rem', padding: '0 0.45rem', fontWeight: showAllDates ? 800 : 500 }}
                >
                  {showAllDates ? '✓ Semua' : 'Semua'}
                </button>
              </div>
            </div>

            {/* Filter PIC, Divisi & Tambah Baris */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Filter Semua Rekap vs PIC Saya untuk SEMUA ORANG */}
              <button 
                className={`btn btn-sm ${reportPicFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setReportPicFilter('all')}
                style={{ fontSize: '0.8rem', fontWeight: reportPicFilter === 'all' ? 800 : 500 }}
              >
                📋 Semua Rekap ({safeTodos.length})
              </button>
              <button 
                className={`btn btn-sm ${reportPicFilter === 'for_me' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setReportPicFilter('for_me')}
                style={{ fontSize: '0.8rem', fontWeight: reportPicFilter === 'for_me' ? 800 : 500 }}
              >
                👤 PIC Saya ({safeTodos.filter(t => isTaskAssignedToUser(t, currentUser)).length})
              </button>

              {/* Filter Lokasi Proyek (Ashoka Park vs Ashoka View) */}
              <select
                className="form-control"
                value={reportProjectFilter}
                onChange={(e) => setReportProjectFilter(e.target.value)}
                style={{ 
                  width: '170px', 
                  height: '36px', 
                  fontSize: '0.8rem', 
                  fontWeight: 800,
                  borderColor: reportProjectFilter !== 'all' ? (reportProjectFilter.includes('View') ? '#F59E0B' : '#10B981') : '#EAB308', 
                  background: reportProjectFilter !== 'all' ? (reportProjectFilter.includes('View') ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)') : 'rgba(234, 179, 8, 0.08)',
                  color: reportProjectFilter !== 'all' ? (reportProjectFilter.includes('View') ? '#F59E0B' : '#10B981') : 'var(--text-main)' 
                }}
              >
                <option value="all">🏗️ Semua Proyek</option>
                <option value="Ashoka Park">🌳 Ashoka Park (Lokasi 1)</option>
                <option value="Ashoka View">🏔️ Ashoka View (Lokasi 2)</option>
                <option value="Kantor Pusat">🏢 Kantor Pusat / HO</option>
              </select>

              {/* Filter Nama Karyawan Terkait / PIC */}
              <select
                className="form-control"
                value={selectedEmployeeFilter}
                onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
                style={{ 
                  width: '185px', 
                  height: '36px', 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  borderColor: selectedEmployeeFilter !== 'all' ? '#38BDF8' : undefined, 
                  background: selectedEmployeeFilter !== 'all' ? 'rgba(56, 189, 248, 0.15)' : undefined,
                  color: selectedEmployeeFilter !== 'all' ? '#38BDF8' : undefined 
                }}
              >
                <option value="all">👤 Semua Nama Karyawan</option>
                {safeUsers.map(u => (
                  <option key={u.id} value={u.name}>👤 {u.name} ({u.role.split(' ')[0]})</option>
                ))}
              </select>

              {/* Filter Status */}
              <select
                className="form-control"
                value={reportStatusFilter}
                onChange={(e) => setReportStatusFilter(e.target.value)}
                style={{ width: '130px', height: '36px', fontSize: '0.8rem', fontWeight: 700 }}
              >
                <option value="all">Semua Status</option>
                <option value="completed">✓ Selesai</option>
                <option value="pending">⏳ Pending</option>
              </select>

              {/* Filter Divisi */}
              <select
                className="form-control"
                value={reportDivisionFilter}
                onChange={(e) => setReportDivisionFilter(e.target.value)}
                style={{ width: '150px', height: '36px', fontSize: '0.8rem', fontWeight: 700 }}
              >
                <option value="all">🏢 Semua Divisi</option>
                {COMPANY_DIVISIONS.map(d => (
                  <option key={d.id} value={d.short}>{d.short}</option>
                ))}
              </select>

              <button 
                className="btn btn-primary"
                onClick={handleOpenAddReportModal}
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800, height: '36px', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> + Tambah Baris
              </button>
            </div>
          </div>

          {/* ACTIVE PROJECT FILTER NOTIFICATION BADGE */}
          {reportProjectFilter !== 'all' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 0.85rem', marginBottom: '0.75rem', background: reportProjectFilter.includes('View') ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)', border: `1px solid ${reportProjectFilter.includes('View') ? '#F59E0B' : '#10B981'}`, borderRadius: '6px', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: reportProjectFilter.includes('View') ? '#F59E0B' : '#10B981' }}>
                <span>🏗️ Menyaring Laporan Proyek:</span>
                <span style={{ color: 'var(--text-main)', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  {reportProjectFilter.includes('View') ? '🏔️ Ashoka View (Lokasi 2)' : reportProjectFilter.includes('Park') ? '🌳 Ashoka Park (Lokasi 1)' : '🏢 ' + reportProjectFilter}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({visibleReports.length} baris pekerjaan ditemukan)</span>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setReportProjectFilter('all')}
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
              >
                ✕ Reset Filter Proyek
              </button>
            </div>
          )}

          {/* ACTIVE EMPLOYEE FILTER NOTIFICATION BADGE */}
          {selectedEmployeeFilter !== 'all' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.85rem', marginBottom: '1rem', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid #38BDF8', borderRadius: '6px', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#38BDF8' }}>
                <span>🎯 Menyaring Laporan & Rekap Terkait:</span>
                <span style={{ color: 'var(--text-main)', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  {selectedEmployeeFilter}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({visibleReports.length} pekerjaan ditemukan)</span>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setSelectedEmployeeFilter('all')}
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
              >
                ✕ Reset Filter Nama
              </button>
            </div>
          )}

          {/* EXACT SPREADSHEET TABLE: TANGGAL | WAKTU | LAPORAN HARIAN | KORDINASI | PIC */}
          <div className="table-container" style={{ border: '1.5px solid #EAB308', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FDE047', color: '#0F172A', borderBottom: '2px solid #CA8A04' }}>
                  <th style={{ width: '125px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Tanggal
                  </th>
                  <th style={{ width: '135px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Waktu
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Laporan harian & Proyek
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
                        {showAllDates ? 'Belum ada data laporan.' : `Tidak ada pekerjaan tercatat pada tanggal ${startDateFilter} s/d ${endDateFilter}.`}
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

                      {/* 3. Kolom Laporan harian & Proyek */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ marginBottom: '5px' }}>
                          {getProjectBadge(item.proyek || item.project)}
                        </div>
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

                      {/* 5. Kolom PIC & Pihak Terkait */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div 
                          onClick={() => setSelectedEmployeeFilter(selectedEmployeeFilter === (item.pic || item.assignee) ? 'all' : (item.pic || item.assignee))}
                          style={{ 
                            fontWeight: 800, 
                            fontSize: '0.85rem', 
                            color: '#38BDF8',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Klik untuk menyaring laporan karyawan ini"
                        >
                          👤 {item.pic || item.assignee || '-'}
                        </div>
                        {item.assignedBy && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                            <span style={{ color: 'var(--text-subtle)' }}>Ditugaskan:</span> {item.assignedBy.split(' ')[0]}
                          </div>
                        )}
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

      {/* ================================================================= */}
      {/* TAB 4: MEDIA INFORMASI & PENGUMUMAN (DAPAT DIBACA & DIISI SEMUA)  */}
      {/* ================================================================= */}
      {activeTab === 'media-info' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          {/* Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #38BDF8, #0284C7)', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(56, 189, 248, 0.3)' }}>
                  <Megaphone size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                    Media Informasi & Mading Tim Perusahaan
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    🌐 Portal informasi, memo resmi, update proyek lapangan, dan berita tim &bull; <strong>Dapat dibaca dan diisi oleh seluruh staf & manajemen</strong>
                  </p>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleOpenAddMediaModal}
              style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800, padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }}
            >
              <Plus size={18} /> + Terbitkan Informasi Baru
            </button>
          </div>

          {/* Search & Category Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {MEDIA_CATEGORIES.map(cat => {
                const isActive = (cat.id === 'CAT-ALL' && mediaCategoryFilter === 'all') || (mediaCategoryFilter === cat.label);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setMediaCategoryFilter(cat.id === 'CAT-ALL' ? 'all' : cat.label)}
                    style={{
                      background: isActive ? cat.color : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#0F172A' : 'var(--text-main)',
                      border: isActive ? `1.5px solid ${cat.color}` : '1px solid var(--border-color)',
                      borderRadius: '20px',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 900 : 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{cat.icon}</span> {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Cari pengumuman..."
                value={mediaSearchQuery}
                onChange={(e) => setMediaSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', height: '36px', fontSize: '0.825rem' }}
              />
              {mediaSearchQuery && (
                <button
                  onClick={() => setMediaSearchQuery('')}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Media Info Cards Grid */}
          {visibleMediaList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
              <Megaphone size={40} color="#38BDF8" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>Belum Ada Informasi / Pengumuman</div>
              <p style={{ fontSize: '0.85rem', marginTop: '4px', maxWidth: '400px', margin: '4px auto 1rem' }}>
                Jadilah yang pertama menerbitkan memo resmi, berita proyek, atau pengumuman tim!
              </p>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={handleOpenAddMediaModal}
                style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800 }}
              >
                <Plus size={15} /> + Terbitkan Informasi Sekarang
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {visibleMediaList.map((item) => {
                const isAuthor = currentUser?.name && item.author && item.author.toLowerCase().includes(currentUser.name.toLowerCase());
                const canManage = isBoss || isAuthor;
                const isLiked = Array.isArray(item.likedBy) && item.likedBy.includes(currentUser?.id || 'USR-001');
                const isRead = Array.isArray(item.readBy) && item.readBy.includes(currentUser?.name || '');

                return (
                  <div
                    key={item.id}
                    className="glass-card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      border: item.isPinned ? '2px solid #F59E0B' : '1px solid var(--border-color)',
                      boxShadow: item.isPinned ? '0 0 15px rgba(245, 158, 11, 0.2)' : undefined,
                      background: item.isPinned ? 'rgba(245, 158, 11, 0.04)' : undefined
                    }}
                  >
                    <div>
                      {/* Top Header Row: Category Badge + Pinned + Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span 
                            style={{ 
                              background: `${item.categoryColor || '#38BDF8'}20`, 
                              color: item.categoryColor || '#38BDF8', 
                              border: `1px solid ${item.categoryColor || '#38BDF8'}50`, 
                              padding: '2px 8px', 
                              borderRadius: '6px', 
                              fontSize: '0.72rem', 
                              fontWeight: 800 
                            }}
                          >
                            {item.category}
                          </span>
                          {item.isPinned && (
                            <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', border: '1px solid #F59E0B', padding: '2px 7px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Pin size={11} /> PINNED
                            </span>
                          )}
                        </div>

                        {canManage && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditMediaModal(item)}
                              style={{ padding: '0.2rem 0.4rem' }}
                              title="Edit Pengumuman"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteMedia(item.id)}
                              style={{ padding: '0.2rem 0.4rem', color: '#ef4444' }}
                              title="Hapus Pengumuman"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                        {item.title}
                      </h3>

                      {/* Author & Timestamp */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #38BDF8, #0284C7)', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem' }}>
                          {item.author?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{item.author}</span> &bull; <span style={{ color: 'var(--text-subtle)' }}>{item.authorRole}</span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>📅 {item.date} &bull; ⏰ {item.time}</div>
                        </div>
                      </div>

                      {/* Target Division */}
                      {item.targetDivision && item.targetDivision !== 'Seluruh Karyawan & Divisi' && (
                        <div style={{ fontSize: '0.72rem', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.08)', padding: '3px 8px', borderRadius: '4px', marginBottom: '0.75rem', display: 'inline-block' }}>
                          🎯 Target: {item.targetDivision}
                        </div>
                      )}

                      {/* Content Text */}
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55, whiteSpace: 'pre-line', marginBottom: '0.85rem' }}>
                        {item.content}
                      </div>

                      {/* Photo Attachment */}
                      {item.photo && (
                        <div 
                          onClick={() => { setSelectedMediaDetail(item); setIsMediaDetailModalOpen(true); }}
                          style={{ marginBottom: '0.85rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', cursor: 'pointer', maxHeight: '180px' }}
                        >
                          <img src={item.photo} alt="Lampiran Informasi" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      )}
                    </div>

                    {/* Bottom Interactions: Like & Read Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => handleToggleLikeMedia(item.id)}
                        style={{
                          background: isLiked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                          color: isLiked ? '#EF4444' : 'var(--text-muted)',
                          border: isLiked ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Heart size={13} fill={isLiked ? '#EF4444' : 'none'} /> {item.likesCount || 0} Suka
                      </button>

                      <button
                        onClick={() => handleMarkAsReadMedia(item.id)}
                        style={{
                          background: isRead ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.05)',
                          color: isRead ? '#10B981' : 'var(--text-muted)',
                          border: isRead ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title={item.readBy ? `Dibaca oleh: ${item.readBy.join(', ')}` : 'Tandai sudah membaca'}
                      >
                        <Eye size={12} /> {isRead ? `✓ Dibaca (${item.readBy?.length || 1})` : `Tandai Dibaca (${item.readBy?.length || 0})`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                    <label className="form-label" style={{ fontWeight: 800 }}>📅 Tanggal Laporan (Maks. 2 Hari)</label>
                    {isBoss ? (
                      <input
                        type="date"
                        className="form-control"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        required
                        style={{ fontWeight: 700 }}
                      />
                    ) : (
                      <div>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                          <button
                            type="button"
                            onClick={() => setNewDate(todayDateStr)}
                            className={`btn btn-sm ${newDate === todayDateStr ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '0.25rem', fontSize: '0.72rem', fontWeight: 800 }}
                          >
                            📅 Hari Ini ({todayDateStr.split('-')[2]}/{todayDateStr.split('-')[1]})
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewDate(yesterdayDateStr)}
                            className={`btn btn-sm ${newDate === yesterdayDateStr ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '0.25rem', fontSize: '0.72rem', fontWeight: 800 }}
                          >
                            ⏳ Kemarin ({yesterdayDateStr.split('-')[2]}/{yesterdayDateStr.split('-')[1]})
                          </button>
                        </div>
                        <input
                          type="date"
                          className="form-control"
                          value={newDate}
                          min={yesterdayDateStr}
                          max={todayDateStr}
                          onChange={(e) => setNewDate(e.target.value)}
                          required
                          style={{ fontWeight: 800, color: '#38BDF8', height: '34px' }}
                        />
                        <div style={{ fontSize: '0.68rem', color: '#10B981', marginTop: '3px', fontWeight: 700 }}>
                          ✓ Toleransi 2 Hari Aktif (Hari Ini & Kemarin). Laporan sebelum H-2 ditutup otomatis.
                        </div>
                      </div>
                    )}
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

                {/* 1-Click Interactive Project Selector */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🏗️ Lokasi Proyek</span>
                    <span style={{ fontSize: '0.72rem', color: newProject.includes('View') ? '#F59E0B' : newProject.includes('Park') ? '#10B981' : '#C084FC', fontWeight: 800 }}>
                      🎯 Terpilih: {newProject}
                    </span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setNewProject('Ashoka Park')}
                      className={`btn btn-sm ${newProject === 'Ashoka Park' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ 
                        padding: '0.45rem', 
                        fontSize: '0.78rem', 
                        fontWeight: 800, 
                        background: newProject === 'Ashoka Park' ? 'linear-gradient(135deg, #10B981, #059669)' : undefined, 
                        border: newProject === 'Ashoka Park' ? '1.5px solid #10B981' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      🌳 Ashoka Park
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProject('Ashoka View')}
                      className={`btn btn-sm ${newProject === 'Ashoka View' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ 
                        padding: '0.45rem', 
                        fontSize: '0.78rem', 
                        fontWeight: 800, 
                        background: newProject === 'Ashoka View' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : undefined, 
                        border: newProject === 'Ashoka View' ? '1.5px solid #F59E0B' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      🏔️ Ashoka View
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProject('Kantor Pusat')}
                      className={`btn btn-sm ${newProject === 'Kantor Pusat' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ 
                        padding: '0.45rem', 
                        fontSize: '0.78rem', 
                        fontWeight: 800, 
                        background: newProject === 'Kantor Pusat' ? 'linear-gradient(135deg, #A855F7, #9333EA)' : undefined, 
                        border: newProject === 'Kantor Pusat' ? '1.5px solid #A855F7' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      🏢 Kantor Pusat
                    </button>
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

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontWeight: 800, margin: 0 }}>
                      👤 PIC Pelaksana & Tujuan Laporan (Klik Nama Karyawan)
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>
                      🎯 Terpilih: {newPic}
                    </span>
                  </div>

                  {/* Select Dropdown */}
                  <select
                    className="form-control"
                    value={newPic}
                    onChange={(e) => setNewPic(e.target.value)}
                    required
                    style={{ marginBottom: '0.4rem', fontWeight: 700, borderColor: '#38BDF8' }}
                  >
                    {safeUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name} — {u.role}</option>
                    ))}
                  </select>

                  {/* Clickable Quick Employee Pills Grid */}
                  <div style={{ maxHeight: '115px', overflowY: 'auto', padding: '6px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {safeUsers.map(u => {
                      const isSelected = newPic === u.name;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setNewPic(u.name)}
                          style={{
                            background: isSelected ? 'linear-gradient(135deg, #38BDF8, #0284C7)' : 'rgba(255,255,255,0.06)',
                            color: isSelected ? '#0F172A' : 'var(--text-main)',
                            border: isSelected ? '1.5px solid #38BDF8' : '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: isSelected ? 900 : 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>👤</span> {u.name.split(',')[0]} <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>({u.role.split(' ')[0]})</span>
                          {isSelected && <Check size={11} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
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

                {/* 1-Click Interactive Project Selector for Instruction */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🏗️ Lokasi Proyek</span>
                    <span style={{ fontSize: '0.72rem', color: insProject.includes('View') ? '#F59E0B' : insProject.includes('Park') ? '#10B981' : '#C084FC', fontWeight: 800 }}>
                      🎯 Terpilih: {insProject}
                    </span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setInsProject('Ashoka Park')}
                      className={`btn btn-sm ${insProject === 'Ashoka Park' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ 
                        padding: '0.45rem', 
                        fontSize: '0.78rem', 
                        fontWeight: 800, 
                        background: insProject === 'Ashoka Park' ? 'linear-gradient(135deg, #10B981, #059669)' : undefined, 
                        border: insProject === 'Ashoka Park' ? '1.5px solid #10B981' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      🌳 Ashoka Park
                    </button>
                    <button
                      type="button"
                      onClick={() => setInsProject('Ashoka View')}
                      className={`btn btn-sm ${insProject === 'Ashoka View' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ 
                        padding: '0.45rem', 
                        fontSize: '0.78rem', 
                        fontWeight: 800, 
                        background: insProject === 'Ashoka View' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : undefined, 
                        border: insProject === 'Ashoka View' ? '1.5px solid #F59E0B' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      🏔️ Ashoka View
                    </button>
                    <button
                      type="button"
                      onClick={() => setInsProject('Kantor Pusat')}
                      className={`btn btn-sm ${insProject === 'Kantor Pusat' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ 
                        padding: '0.45rem', 
                        fontSize: '0.78rem', 
                        fontWeight: 800, 
                        background: insProject === 'Kantor Pusat' ? 'linear-gradient(135deg, #A855F7, #9333EA)' : undefined, 
                        border: insProject === 'Kantor Pusat' ? '1.5px solid #A855F7' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      🏢 Kantor Pusat
                    </button>
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

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontWeight: 800, margin: 0 }}>
                      👤 Ditugaskan Kepada / Tujuan Instruksi (Klik Nama Karyawan)
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>
                      🎯 Terpilih: {insAssignee}
                    </span>
                  </div>

                  {/* Select Dropdown */}
                  <select
                    className="form-control"
                    value={insAssignee}
                    onChange={(e) => setInsAssignee(e.target.value)}
                    required
                    style={{ marginBottom: '0.4rem', fontWeight: 700, borderColor: '#38BDF8' }}
                  >
                    {safeUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name} — {u.role}</option>
                    ))}
                  </select>

                  {/* Clickable Quick Employee Pills Grid */}
                  <div style={{ maxHeight: '115px', overflowY: 'auto', padding: '6px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {safeUsers.map(u => {
                      const isSelected = insAssignee === u.name;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setInsAssignee(u.name)}
                          style={{
                            background: isSelected ? 'linear-gradient(135deg, #38BDF8, #0284C7)' : 'rgba(255,255,255,0.06)',
                            color: isSelected ? '#0F172A' : 'var(--text-main)',
                            border: isSelected ? '1.5px solid #38BDF8' : '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: isSelected ? 900 : 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>👤</span> {u.name.split(',')[0]} <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>({u.role.split(' ')[0]})</span>
                          {isSelected && <Check size={11} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
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

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TERBITKAN / EDIT INFORMASI (SEMUA KARYAWAN BISA ISI)   */}
      {/* ------------------------------------------------------------- */}
      {isMediaModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Megaphone size={20} color="#38BDF8" /> {editingMediaItem ? 'Edit Informasi / Pengumuman' : 'Terbitkan Informasi / Pengumuman Baru'}
              </h3>
              <button onClick={() => setIsMediaModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMedia}>
              <div className="modal-body">
                {/* Author Info Pill */}
                <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <UserCheck size={16} color="#38BDF8" />
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Penerbit:</span> <strong>{currentUser?.name || 'Staf AMS'}</strong> ({currentUser?.role || 'Karyawan'}) &bull; <span style={{ color: '#10B981', fontWeight: 700 }}>Terbuka untuk Semua Tim</span>
                  </div>
                </div>

                {/* Judul Pengumuman */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📢 Judul Informasi / Pengumuman</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Update Jadwal Pengecoran Blok A / Memo Libur Nasional..."
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    required
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  {/* Kategori Informasi */}
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>🏷️ Kategori Informasi</label>
                    <select
                      className="form-control"
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value)}
                      style={{ fontWeight: 700 }}
                    >
                      {MEDIA_CATEGORIES.filter(c => c.id !== 'CAT-ALL').map(c => (
                        <option key={c.id} value={c.label}>{c.icon} {c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Divisi */}
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>🎯 Target Pembaca</label>
                    <select
                      className="form-control"
                      value={mediaTargetDivision}
                      onChange={(e) => setMediaTargetDivision(e.target.value)}
                      style={{ fontWeight: 700 }}
                    >
                      <option value="Seluruh Karyawan & Divisi">🌐 Seluruh Karyawan & Divisi</option>
                      {COMPANY_DIVISIONS.map(d => (
                        <option key={d.id} value={d.name}>🏢 {d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Isi Informasi Lengkap */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📝 Isi Pesan / Uraian Lengkap</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Tuliskan isi pengumuman, detail teknis, instruksi koordinasi, atau informasi penting di sini..."
                    value={mediaContent}
                    onChange={(e) => setMediaContent(e.target.value)}
                    required
                  />
                </div>

                {/* Upload Foto / Brosur Lampiran */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📸 Lampiran Foto / Gambar / Brosur (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={mediaFileInputRef}
                    onChange={handleMediaPhotoUpload}
                    style={{ display: 'none' }}
                  />

                  {mediaPhoto ? (
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '160px' }}>
                      <img src={mediaPhoto} alt="Lampiran" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                      <button
                        type="button"
                        onClick={() => setMediaPhoto(null)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => mediaFileInputRef.current && mediaFileInputRef.current.click()}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
                    >
                      <Upload size={14} /> Pilih Foto / Gambar dari Galeri
                    </button>
                  )}
                </div>

                {/* Pin Notice Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="pinNoticeCheckbox"
                    checked={mediaIsPinned}
                    onChange={(e) => setMediaIsPinned(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="pinNoticeCheckbox" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Pin size={13} color="#F59E0B" /> Sematkan Pengumuman di Paling Atas (Pinned Notice)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsMediaModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: 'none', fontWeight: 800 }}>
                  <Send size={15} /> {editingMediaItem ? 'Simpan Perubahan' : '🚀 Terbitkan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DETAIL & ZOOM FOTO PENGUMUMAN                          */}
      {/* ------------------------------------------------------------- */}
      {isMediaDetailModalOpen && selectedMediaDetail && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                <Megaphone size={18} color="#38BDF8" /> {selectedMediaDetail.title}
              </h3>
              <button onClick={() => setIsMediaDetailModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {selectedMediaDetail.photo && (
                <div style={{ marginBottom: '1rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#000' }}>
                  <img src={selectedMediaDetail.photo} alt="Lampiran" style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', display: 'block' }} />
                </div>
              )}

              <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: `${selectedMediaDetail.categoryColor || '#38BDF8'}20`, color: selectedMediaDetail.categoryColor || '#38BDF8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                    {selectedMediaDetail.category}
                  </span>
                  {selectedMediaDetail.targetDivision && (
                    <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      🎯 {selectedMediaDetail.targetDivision}
                    </span>
                  )}
                </div>

                <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
                  {selectedMediaDetail.content}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem' }}>
                  <div><strong>👤 Diterbitkan Oleh:</strong> {selectedMediaDetail.author} ({selectedMediaDetail.authorRole})</div>
                  <div><strong>📅 Waktu Terbit:</strong> {selectedMediaDetail.date} &bull; {selectedMediaDetail.time}</div>
                  {selectedMediaDetail.readBy && (
                    <div style={{ marginTop: '4px', color: '#10B981' }}>
                      <strong>👁️ Telah Dibaca ({selectedMediaDetail.readBy.length} Orang):</strong> {selectedMediaDetail.readBy.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsMediaDetailModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
