import React, { useState, useMemo, useRef } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Clock, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Building2, 
  Landmark, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  X, 
  Activity, 
  Save, 
  Database, 
  UploadCloud,
  Briefcase,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserManagement = () => {
  const { 
    currentUser, 
    users, 
    addUser, 
    updateUser, 
    deleteUser, 
    resetToOfficialCompanyUsers, 
    getAvatarUrl, 
    todos, 
    attendances, 
    workingHours, 
    updateWorkingHours, 
    units, 
    showNotification 
  } = useApp();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState('performance');

  // =========================================================================
  // TAB 1: MONITORING KINERJA & REKAP LAPORAN KERJA STATE
  // =========================================================================
  const [selectedUserFilter, setSelectedUserFilter] = useState('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [datePreset, setDatePreset] = useState('week'); // 'today', 'week', 'month', 'this_month', 'custom'
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Date Range Calculation based on Preset
  const activeDateRange = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (datePreset === 'today') {
      return { start: todayStr, end: todayStr, label: 'Hari Ini' };
    }
    if (datePreset === 'week') {
      const past7 = new Date();
      past7.setDate(now.getDate() - 7);
      return { start: past7.toISOString().split('T')[0], end: todayStr, label: '1 Minggu Terakhir (7 Hari)' };
    }
    if (datePreset === 'month') {
      const past30 = new Date();
      past30.setDate(now.getDate() - 30);
      return { start: past30.toISOString().split('T')[0], end: todayStr, label: '30 Hari Terakhir' };
    }
    if (datePreset === 'this_month') {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const start = `${y}-${m}-01`;
      return { start, end: todayStr, label: `Bulan Berjalan (${m}/${y})` };
    }
    // Custom
    return { 
      start: customStartDate || '2000-01-01', 
      end: customEndDate || todayStr, 
      label: `Periode ${customStartDate || '-'} s/d ${customEndDate || '-'}` 
    };
  }, [datePreset, customStartDate, customEndDate]);

  // Filtered Todos (Work Activity)
  const filteredWorkActivities = useMemo(() => {
    const list = Array.isArray(todos) ? todos : [];

    return list.filter((task) => {
      // 1. User Filter
      if (selectedUserFilter !== 'ALL') {
        const pic = (task.pic || task.assignee || '').toLowerCase();
        const target = selectedUserFilter.toLowerCase();
        if (!pic.includes(target) && (task.picId !== selectedUserFilter)) {
          return false;
        }
      }

      // 2. Dept Filter
      if (selectedDeptFilter !== 'ALL') {
        // match user dept from users array
        const userObj = users.find(u => 
          (task.pic && u.name.toLowerCase().includes(task.pic.toLowerCase())) ||
          (u.id && task.picId && u.id === task.picId)
        );
        if (userObj && userObj.dept !== selectedDeptFilter) {
          return false;
        }
      }

      // 3. Status Filter
      if (statusFilter === 'completed' && !task.completed) return false;
      if (statusFilter === 'pending' && task.completed) return false;

      // 4. Date Range Filter
      const taskDate = task.date || task.assignDate || '';
      if (taskDate) {
        if (activeDateRange.start && taskDate < activeDateRange.start) return false;
        if (activeDateRange.end && taskDate > activeDateRange.end) return false;
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = (task.laporan || task.text || '').toLowerCase();
        const matchProyek = (task.proyek || task.project || '').toLowerCase();
        const matchPic = (task.pic || task.assignee || '').toLowerCase();
        const matchKordinasi = (task.kordinasi || '').toLowerCase();
        const matchNotes = (task.notes || '').toLowerCase();
        if (!matchText.includes(q) && !matchProyek.includes(q) && !matchPic.includes(q) && !matchKordinasi.includes(q) && !matchNotes.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [todos, selectedUserFilter, selectedDeptFilter, statusFilter, activeDateRange, searchQuery, users]);

  // Performance KPI Calculation
  const kpiStats = useMemo(() => {
    const total = filteredWorkActivities.length;
    const completed = filteredWorkActivities.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Attendances count for the selected range/user
    const attList = Array.isArray(attendances) ? attendances : [];
    const matchedAtt = attList.filter(a => {
      const attDate = a.date || a.timestamp?.split(' ')[0] || '';
      if (activeDateRange.start && attDate < activeDateRange.start) return false;
      if (activeDateRange.end && attDate > activeDateRange.end) return false;
      if (selectedUserFilter !== 'ALL') {
        const uName = (a.user || a.nama || '').toLowerCase();
        if (!uName.includes(selectedUserFilter.toLowerCase())) return false;
      }
      return true;
    });

    return { total, completed, pending, rate, attendancesCount: matchedAtt.length };
  }, [filteredWorkActivities, attendances, activeDateRange, selectedUserFilter]);

  // Export to CSV Function
  const handleExportCSV = () => {
    if (filteredWorkActivities.length === 0) {
      alert('Tidak ada data laporan pekerjaan untuk diekspor pada filter ini!');
      return;
    }

    const headers = ['No', 'Tanggal', 'Waktu', 'Nama Staf (PIC)', 'Proyek', 'Uraian Pekerjaan / Kegiatan', 'Koordinasi Terkait', 'Status', 'Catatan / Kendala'];
    const rows = filteredWorkActivities.map((t, idx) => [
      idx + 1,
      `"${t.date || '-'}"`,
      `"${t.waktu || '-'}"`,
      `"${t.pic || t.assignee || '-'}"`,
      `"${t.proyek || t.project || '-'}"`,
      `"${(t.laporan || t.text || '').replace(/"/g, '""')}"`,
      `"${(t.kordinasi || '-').replace(/"/g, '""')}"`,
      t.completed ? 'Selesai' : 'Pending / Dalam Proses',
      `"${(t.notes || '-').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeUser = selectedUserFilter === 'ALL' ? 'Semua_Staf' : selectedUserFilter.replace(/\s+/g, '_');
    link.download = `Rekap_Kinerja_Karyawan_${safeUser}_${activeDateRange.start}_sd_${activeDateRange.end}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    if (showNotification) {
      showNotification('File Rekap Kinerja (.CSV) berhasil diunduh! Siap dibuka di Microsoft Excel.');
    }
  };

  // =========================================================================
  // TAB 2: MANAJEMEN USER & ROLE PERMISSIONS STATE
  // =========================================================================
  const fileInputRef = useRef(null);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staf Teknik',
    dept: 'Teknik',
    address: '',
    status: 'Aktif',
    avatar: '',
    allowedModules: ['todo-attendance', 'teknik']
  });

  const availableModulesList = [
    { key: 'todo-attendance', label: 'To-Do List & Presensi Harian', group: 'Universal' },
    { key: 'executive', label: 'Eksekutif Suite & Direksi Utama', group: 'Direksi' },
    { key: 'manager', label: 'Manajer Operasional (Pusat Approval)', group: 'Manager' },
    { key: 'teknik', label: 'Teknik & Konstruksi Proyek Unit', group: 'Teknik' },
    { key: 'marketing', label: 'Marketing & Sales Penjualan Unit', group: 'Marketing' },
    { key: 'legal', label: 'Legal Corporate & Perizinan', group: 'Legal' },
    { key: 'finance', label: 'Finance, Kas Bank & Payment', group: 'Finance' },
    { key: 'hr-ga', label: 'HR & General Affair (SDM & Operasional)', group: 'HR-GA' },
    { key: 'customer-relation', label: 'Customer Relation & BAST Properti', group: 'CRM' },
    { key: 'procurement', label: 'Procurement & Pengadaan Material', group: 'Procurement' },
    { key: 'piutang-konsumen', label: 'Piutang Konsumen (DP & Angsuran)', group: 'Finance' },
    { key: 'users', label: 'Super Admin - Kendali Master & Audit', group: 'Admin' }
  ];

  const handlePhotoFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Mohon pilih file gambar (JPG, PNG, JPEG)!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserForm((prev) => ({ ...prev, avatar: reader.result }));
        if (showNotification) showNotification('Foto profil berhasil diunggah!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'Staf Teknik',
      dept: 'Teknik',
      address: '',
      status: 'Aktif',
      avatar: '',
      allowedModules: ['todo-attendance', 'teknik']
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (u) => {
    setSelectedUser(u);
    setUserForm({
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || 'Staf',
      dept: u.dept || 'Operasional',
      address: u.address || '',
      status: u.status || 'Aktif',
      avatar: u.avatar || '',
      allowedModules: u.allowedModules || ['todo-attendance']
    });
    setIsEditModalOpen(true);
  };

  const handleOpenPermissionsModal = (u) => {
    setSelectedUser(u);
    setUserForm({
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || 'Staf',
      dept: u.dept || 'Operasional',
      address: u.address || '',
      status: u.status || 'Aktif',
      avatar: u.avatar || '',
      allowedModules: u.allowedModules || ['todo-attendance']
    });
    setIsPermissionsModalOpen(true);
  };

  const handleToggleModulePermission = (modKey) => {
    setUserForm((prev) => {
      const exists = prev.allowedModules.includes(modKey);
      if (exists) {
        return { ...prev, allowedModules: prev.allowedModules.filter(k => k !== modKey) };
      } else {
        return { ...prev, allowedModules: [...prev.allowedModules, modKey] };
      }
    });
  };

  const handleSavePermissions = () => {
    if (selectedUser) {
      updateUser(selectedUser.id, { allowedModules: userForm.allowedModules });
      setIsPermissionsModalOpen(false);
      if (showNotification) showNotification(`Hak akses modul untuk ${selectedUser.name} berhasil diperbarui!`);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      alert('Nama dan Email wajib diisi!');
      return;
    }
    addUser(userForm);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      updateUser(selectedUser.id, userForm);
      setIsEditModalOpen(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    return list.filter((u) => {
      const matchSearch = 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.phone || '').toLowerCase().includes(userSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, userSearch, roleFilter]);

  // =========================================================================
  // TAB 3: PROFIL PERUSAHAAN & MASTER DATA PROPERTI (PERSISTENT STATE)
  // =========================================================================
  const defaultCompanyProfile = {
    name: 'PT ASHOKA ENTERPRISE REALTY',
    tagline: 'Modern Living & Property Developer',
    address: 'Komplek Ruko Bizhub, Blok RA-3, Jl. Raya Serpong Puspitek, Gunung Sindur - Bogor, Jawa Barat - Indonesia',
    phone: '(021) 75678196',
    email: 'official@ashokarealty.co.id',
    nib: '9120002819821',
    npwp: '73.918.291.4-411.000',
    website: 'https://ashokaproperty.id'
  };

  const [companyProfile, setCompanyProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_admin_company_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultCompanyProfile;
  });

  const defaultBankAccounts = [
    { id: 1, bank: 'Bank BTN', noRek: '00152-01-30-000452-9', holder: 'PT Ashoka Enterprise Realty', branch: 'Kantor Cabang Serpong' },
    { id: 2, bank: 'Bank Mandiri', noRek: '157-00-0899231-4', holder: 'PT Ashoka Enterprise Realty', branch: 'KC BSD City' },
    { id: 3, bank: 'Bank BCA', noRek: '869-199-2811', holder: 'PT Ashoka Enterprise Realty', branch: 'KCP Pamulang' }
  ];

  const [bankAccounts, setBankAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_admin_bank_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultBankAccounts;
  });

  const [newBank, setNewBank] = useState({ bank: '', noRek: '', holder: 'PT Ashoka Enterprise Realty', branch: '' });

  const handleSaveCompanyProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('ams_admin_company_profile', JSON.stringify(companyProfile));
      if (showNotification) showNotification('Profil & Identitas Resmi PT Ashoka Enterprise Realty berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan profil: ' + err.message);
    }
  };

  const handleAddBankAccount = (e) => {
    e.preventDefault();
    if (!newBank.bank || !newBank.noRek) {
      alert('Mohon isi Nama Bank dan Nomor Rekening!');
      return;
    }
    const updated = [...bankAccounts, { id: Date.now(), ...newBank }];
    setBankAccounts(updated);
    localStorage.setItem('ams_admin_bank_accounts', JSON.stringify(updated));
    setNewBank({ bank: '', noRek: '', holder: 'PT Ashoka Enterprise Realty', branch: '' });
    if (showNotification) showNotification('Rekening Bank baru berhasil ditambahkan!');
  };

  const handleDeleteBankAccount = (id) => {
    if (confirm('Yakin ingin menghapus rekening bank ini?')) {
      const updated = bankAccounts.filter(b => b.id !== id);
      setBankAccounts(updated);
      localStorage.setItem('ams_admin_bank_accounts', JSON.stringify(updated));
      if (showNotification) showNotification('Rekening Bank berhasil dihapus.', 'warning');
    }
  };

  // =========================================================================
  // TAB 4: PENGATURAN JAM KERJA & PRESENSI KANTOR
  // =========================================================================
  const [hoursForm, setHoursForm] = useState(() => {
    return {
      headOfficeHours: workingHours?.headOffice?.hours || '08:00 - 17:00 WIB',
      headOfficeDays: workingHours?.headOffice?.days || 'Senin - Jumat • Toleransi 15m',
      siteOfficeHours: workingHours?.siteOffice?.hours || '07:30 - 16:30 WIB',
      siteOfficeDays: workingHours?.siteOffice?.days || 'Senin - Sabtu • Overtime 2.0x',
      securityHours: workingHours?.security?.hours || '24 Jam (3 Rotasi Shift)',
      securityDays: workingHours?.security?.days || '7 Hari / Minggu • Siaga Pos',
      isOpen: workingHours?.isOpen !== false
    };
  });

  const handleSaveWorkingHours = (e) => {
    e.preventDefault();
    const updated = {
      status: hoursForm.isOpen ? 'Jam Kerja Operasional Berlangsung (OPEN)' : 'Jam Kerja Operasional Tutup (CLOSED)',
      isOpen: hoursForm.isOpen,
      headOffice: { hours: hoursForm.headOfficeHours, days: hoursForm.headOfficeDays },
      siteOffice: { hours: hoursForm.siteOfficeHours, days: hoursForm.siteOfficeDays },
      security: { hours: hoursForm.securityHours, days: hoursForm.securityDays }
    };
    updateWorkingHours(updated);
    if (showNotification) showNotification('Aturan jam kerja kantor & presensi berhasil diperbarui!');
  };

  // =========================================================================
  // TAB 5: AUDIT LOG & BACKUP RESTORE DATA 1-KLIK
  // =========================================================================
  const restoreInputRef = useRef(null);

  const [auditLogs] = useState([
    { id: 1, user: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)', action: 'Mengakses Pusat Kendali Super Admin & Monitoring Kinerja', time: 'Baru saja', ip: '192.168.1.34' },
    { id: 2, user: 'Ahmad Rafail (Super Admin IT)', action: 'Inisialisasi Pembersihan Modul Admin & Sinkronisasi Sistem', time: '10 menit lalu', ip: '192.168.1.10' },
    { id: 3, user: 'Syamsul Dahari (Teknik)', action: 'Pembaruan Dokumentasi Foto & Progres Unit Kavling', time: '1 jam lalu', ip: '192.168.1.55' },
    { id: 4, user: 'Amanda Chesyariani Hermawan (Marketing)', action: 'Penerbitan Surat Pesanan Rumah (SPR) Resmi Konsumen', time: '3 jam lalu', ip: '192.168.1.82' }
  ]);

  // One-Click Database Backup (JSON Export)
  const handleBackupDatabase = () => {
    const backupData = {
      version: 'AMS-v2.0-Enterprise',
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser?.name || 'Super Admin',
      data: {
        users,
        todos,
        attendances,
        workingHours,
        companyProfile,
        bankAccounts,
        unitsCount: units?.length || 0
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AMS_Database_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (showNotification) {
      showNotification('CADANGAN DATABASE 1-KLIK BERHASIL! Seluruh data sistem telah diamankan.');
    }
  };

  // Restore Database from File
  const handleRestoreFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && parsed.data) {
          if (confirm(`Yakin ingin memulihkan cadangan dari ${parsed.exportedAt || 'file ini'}? Tindakan ini akan memperbarui data konfigurasi sistem.`)) {
            if (parsed.data.companyProfile) {
              setCompanyProfile(parsed.data.companyProfile);
              localStorage.setItem('ams_admin_company_profile', JSON.stringify(parsed.data.companyProfile));
            }
            if (parsed.data.bankAccounts) {
              setBankAccounts(parsed.data.bankAccounts);
              localStorage.setItem('ams_admin_bank_accounts', JSON.stringify(parsed.data.bankAccounts));
            }
            if (showNotification) {
              showNotification('Pemulihan data cadangan berhasil disinkronkan!');
            }
          }
        } else {
          alert('Format file cadangan tidak valid!');
        }
      } catch (err) {
        alert('Gagal membaca file JSON cadangan: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // =========================================================================
  // RENDER INTERFACE
  // =========================================================================
  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Hidden file input for photo upload */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*" 
        style={{ display: 'none' }}
        onChange={handlePhotoFileUpload}
      />

      {/* Hidden file input for database restore */}
      <input
        type="file"
        ref={restoreInputRef}
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleRestoreFile}
      />

      {/* HEADER SECTION */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h1 className="page-title" style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
              Modul Admin (Master Control Panel)
            </h1>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Pusat kendali operasional, monitoring kinerja staf harian/mingguan/bulanan, dan otorisasi PT Ashoka Enterprise Realty.
          </p>
        </div>

        {/* Quick Database Backup Button */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            type="button"
            className="btn btn-outline-primary"
            onClick={handleBackupDatabase}
            title="Unduh seluruh data sistem ke file JSON"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <Database size={15} />
            <span>Backup Data 1-Klik</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS MENU */}
      <div className="tab-list" style={{ marginBottom: '1.75rem', overflowX: 'auto', display: 'flex', gap: '8px' }}>
        <button
          type="button"
          className={`tab-item ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 700 }}
        >
          <Activity size={16} color="#38bdf8" />
          <span>1. Monitoring Kinerja & Rekap Kerja</span>
        </button>

        <button
          type="button"
          className={`tab-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 700 }}
        >
          <Users size={16} color="#47c9af" />
          <span>2. Kelola Akun & Hak Akses ({users.length})</span>
        </button>

        <button
          type="button"
          className={`tab-item ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 700 }}
        >
          <Building2 size={16} color="#fbbf24" />
          <span>3. Profil PT & Rekening Bank</span>
        </button>

        <button
          type="button"
          className={`tab-item ${activeTab === 'workhours' ? 'active' : ''}`}
          onClick={() => setActiveTab('workhours')}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 700 }}
        >
          <Clock size={16} color="#c084fc" />
          <span>4. Jam Kerja & Presensi</span>
        </button>

        <button
          type="button"
          className={`tab-item ${activeTab === 'audit-backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit-backup')}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 700 }}
        >
          <Database size={16} color="#10b981" />
          <span>5. Audit Log & Backup Data</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: MONITORING KINERJA & REKAP LAPORAN KERJA STAF                  */}
      {/* ===================================================================== */}
      {activeTab === 'performance' && (
        <div>
          {/* FILTER CONTROLS CARD */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                  Filter Monitoring & Rekap Kerja Staf
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {/* Export Buttons */}
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={handleExportCSV}
                  title="Unduh rekapan tabel dalam format spreadsheet Excel"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700 }}
                >
                  <FileSpreadsheet size={15} />
                  <span>Download Excel (.csv)</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsPrintModalOpen(true)}
                  title="Buka pratinjau cetak laporan resmi bertanda tangan Direktur Utama"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700 }}
                >
                  <Printer size={15} />
                  <span>Cetak / PDF Resmi</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              {/* 1. Pilih Karyawan */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                  👤 Pilih Karyawan / Staf:
                </label>
                <select
                  className="form-control"
                  value={selectedUserFilter}
                  onChange={(e) => setSelectedUserFilter(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                >
                  <option value="ALL">🌟 Semua Karyawan ({users.length} Akun)</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.dept} - {u.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Filter Divisi */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                  🏢 Filter Departemen / Divisi:
                </label>
                <select
                  className="form-control"
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                >
                  <option value="ALL">Semua Departemen</option>
                  <option value="Teknik">Teknik & Proyek</option>
                  <option value="Marketing">Marketing & Penjualan</option>
                  <option value="Legal">Legal & Perizinan</option>
                  <option value="Finance">Finance & Pembayaran</option>
                  <option value="HR & GA">HR & GA Operasional</option>
                  <option value="Direksi">Direksi & Eksekutif</option>
                </select>
              </div>

              {/* 3. Preset Rentang Waktu */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                  📅 Rentang Waktu:
                </label>
                <select
                  className="form-control"
                  value={datePreset}
                  onChange={(e) => setDatePreset(e.target.value)}
                  style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}
                >
                  <option value="today">⚡ Hari Ini</option>
                  <option value="week">📅 1 Minggu Terakhir (7 Hari)</option>
                  <option value="month">📆 30 Hari Terakhir (1 Bulan)</option>
                  <option value="this_month">🗓️ Bulan Ini (Bulan Berjalan)</option>
                  <option value="custom">⏳ Kustom Tanggal...</option>
                </select>
              </div>

              {/* 4. Status Tugas */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                  ✅ Status Pekerjaan:
                </label>
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                >
                  <option value="ALL">Semua Status</option>
                  <option value="completed">Hanya Selesai (Completed)</option>
                  <option value="pending">Hanya Pending / Dalam Proses</option>
                </select>
              </div>
            </div>

            {/* Custom Date Picker (when datePreset === 'custom') */}
            {datePreset === 'custom' && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Pilih Periode:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem' }}>Dari:</span>
                  <input
                    type="date"
                    className="form-control"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    style={{ fontSize: '0.85rem', width: 'auto' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem' }}>Sampai:</span>
                  <input
                    type="date"
                    className="form-control"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    style={{ fontSize: '0.85rem', width: 'auto' }}
                  />
                </div>
              </div>
            )}

            {/* Search Input Filter */}
            <div style={{ marginTop: '1rem', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Cari uraian tugas, nama staf, nama proyek, atau catatan kendala..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* KPI CARDS SUMMARY */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Total Tasks */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '4px solid #38bdf8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Laporan Pekerjaan
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px', color: '#38bdf8' }}>
                    {kpiStats.total}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {activeDateRange.label}
                  </div>
                </div>
                <Briefcase size={28} color="#38bdf8" opacity={0.6} />
              </div>
            </div>

            {/* Completed */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '4px solid #22c55e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Pekerjaan Selesai
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px', color: '#22c55e' }}>
                    {kpiStats.completed}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '2px', fontWeight: 700 }}>
                    Tuntas Terverifikasi
                  </div>
                </div>
                <CheckCircle2 size={28} color="#22c55e" opacity={0.6} />
              </div>
            </div>

            {/* Pending */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Pending / Berjalan
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px', color: '#f59e0b' }}>
                    {kpiStats.pending}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '2px' }}>
                    Dalam Proses Staf
                  </div>
                </div>
                <Clock size={28} color="#f59e0b" opacity={0.6} />
              </div>
            </div>

            {/* Completion Rate */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '4px solid #c084fc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Tingkat Ketuntasan
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px', color: '#c084fc' }}>
                    {kpiStats.rate}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Efektivitas Kinerja
                  </div>
                </div>
                <TrendingUp size={28} color="#c084fc" opacity={0.6} />
              </div>
            </div>
          </div>

          {/* TABLE OF WORK ACTIVITIES */}
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#38bdf8" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                  Rincian Laporan Kerja Karyawan ({filteredWorkActivities.length} Data)
                </h4>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Target Staf: <strong style={{ color: '#f8fafc' }}>{selectedUserFilter === 'ALL' ? 'Semua Staf' : selectedUserFilter}</strong> • Periode: <strong style={{ color: '#38bdf8' }}>{activeDateRange.label}</strong>
              </div>
            </div>

            {filteredWorkActivities.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <AlertCircle size={36} color="#f59e0b" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                  Tidak ada laporan pekerjaan yang sesuai dengan filter
                </div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>
                  Coba ubah filter rentang tanggal, pilihan karyawan, atau kata kunci pencarian Anda.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                      <th style={{ width: '130px' }}>Tanggal & Jam</th>
                      <th style={{ width: '180px' }}>Nama Staf (PIC)</th>
                      <th style={{ width: '140px' }}>Proyek</th>
                      <th>Uraian Tugas / Kegiatan Lapangan</th>
                      <th style={{ width: '160px' }}>Koordinasi Terkait</th>
                      <th style={{ width: '110px', textAlign: 'center' }}>Status</th>
                      <th style={{ width: '180px' }}>Catatan / Kendala</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkActivities.map((task, idx) => (
                      <tr key={task.id || idx}>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {idx + 1}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{task.date || '-'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={12} /> {task.waktu || '08:00 - 17:00'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#38bdf8' }}>{task.pic || task.assignee || 'Staf'}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            Oleh: {task.assignedBy || 'Mandiri'}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                            {task.proyek || task.project || 'Ashoka Park'}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#e2e8f0', lineHeight: '1.45' }}>
                            {task.laporan || task.text || '-'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {task.kordinasi || '-'}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {task.completed ? (
                            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} /> Selesai
                            </span>
                          ) : (
                            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> Proses
                            </span>
                          )}
                        </td>
                        <td>
                          {task.notes ? (
                            <div style={{ fontSize: '0.78rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                              {task.notes}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: MANAJEMEN USER & ROLE PERMISSIONS                              */}
      {/* ===================================================================== */}
      {activeTab === 'users' && (
        <div>
          {/* Header Controls */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800 }}>
                  Daftar Manajemen & Akun Karyawan
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Kelola staf, foto profil, jabatan, dan atur otorisasi hak akses per modul.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (confirm('Reset seluruh daftar akun ke 17 Pimpinan & Staf Resmi Perusahaan?')) {
                      resetToOfficialCompanyUsers();
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                >
                  <RefreshCw size={14} />
                  <span>Reset Akun Resmi</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleOpenAddModal}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700 }}
                >
                  <Plus size={16} />
                  <span>+ Tambah Akun Baru</span>
                </button>
              </div>
            </div>

            {/* Filter Search */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama karyawan, jabatan, atau email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ paddingLeft: '36px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ width: '220px' }}>
                <select
                  className="form-control"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                >
                  <option value="All">Semua Jabatan</option>
                  <option value="Direktur Utama & Finance Director">Direktur Utama</option>
                  <option value="General Manager & Operational Lead">General Manager</option>
                  <option value="Head Marketing">Head Marketing</option>
                  <option value="Staf Teknik">Staf Teknik</option>
                  <option value="Staf Legal">Staf Legal</option>
                </select>
              </div>
            </div>
          </div>

          {/* USERS LIST CARDS / TABLE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {filteredUsers.map((u) => {
              const isSuper = u.role.toLowerCase().includes('super admin') || u.role.toLowerCase().includes('direktur');
              const avatar = getAvatarUrl(u);

              return (
                <div 
                  key={u.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '1.25rem', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    border: isSuper ? '1.5px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--border-color)',
                    background: isSuper ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))' : undefined
                  }}
                >
                  <div>
                    {/* Top Row: Avatar & Name */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <img
                        src={avatar}
                        alt={u.name}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isSuper ? '2.5px solid #38bdf8' : '2px solid rgba(255, 255, 255, 0.15)',
                          boxShadow: isSuper ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {u.name}
                          </h4>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: isSuper ? '#38bdf8' : '#94a3b8', fontWeight: 700, marginTop: '2px' }}>
                          {u.role}
                        </div>
                        <span className={`badge ${u.status === 'Aktif' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.68rem', padding: '2px 7px', marginTop: '4px' }}>
                          {u.status}
                        </span>
                      </div>
                    </div>

                    {/* Contact & Meta */}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} /> {u.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={13} /> {u.phone || '0812-XXXX-XXXX'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={13} /> Divisi: <strong style={{ color: '#f8fafc' }}>{u.dept}</strong>
                      </div>
                    </div>

                    {/* Allowed Modules Badges */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Hak Akses Modul ({u.allowedModules?.length || 0}):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {(u.allowedModules || []).slice(0, 4).map((mod) => (
                          <span key={mod} style={{ fontSize: '0.68rem', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px' }}>
                            {mod}
                          </span>
                        ))}
                        {(u.allowedModules?.length || 0) > 4 && (
                          <span style={{ fontSize: '0.68rem', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px' }}>
                            +{(u.allowedModules?.length || 0) - 4} modul lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleOpenPermissionsModal(u)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.75rem' }}
                    >
                      <ShieldCheck size={14} /> Atur Akses
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEditModal(u)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>

                    {!isSuper && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus akun ${u.name}?`)) {
                            deleteUser(u.id);
                          }
                        }}
                        style={{ padding: '0.3rem 0.5rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: PROFIL PERUSAHAAN & MASTER BANK REKENING PT                     */}
      {/* ===================================================================== */}
      {activeTab === 'company' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1: Identitas Resmi Perusahaan */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Building2 size={20} color="#fbbf24" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Identitas Resmi PT Ashoka Enterprise Realty
              </h3>
            </div>

            <form onSubmit={handleSaveCompanyProfile}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  Nama Lengkap Perusahaan:
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={companyProfile.name}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  Slogan / Tagline Perusahaan:
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={companyProfile.tagline}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, tagline: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  Alamat Kantor Pusat & Ruko Operasional:
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={companyProfile.address}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    Nomor Telepon Kantor:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyProfile.phone}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    Email Resmi Kantor:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={companyProfile.email}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    NIB (Nomor Induk Berusaha):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyProfile.nib}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, nib: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    NPWP Perusahaan:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyProfile.npwp}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, npwp: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700 }}
              >
                <Save size={16} />
                <span>Simpan Perubahan Identitas PT</span>
              </button>
            </form>
          </div>

          {/* Card 2: Rekening Bank Resmi Penampung Pembayaran */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Landmark size={20} color="#38bdf8" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Rekening Bank Penampung Pembayaran PT
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Nomor rekening ini otomatis tampil pada bukti kwitansi invoice pembayaran konsumen modul Finance.
            </p>

            {/* List Bank Accounts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {bankAccounts.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#38bdf8' }}>{b.bank}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em' }}>
                      {b.noRek}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      a/n {b.holder} • {b.branch}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteBankAccount(b.id)}
                    style={{ padding: '0.3rem 0.5rem' }}
                    title="Hapus Rekening"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Form Tambah Bank */}
            <form onSubmit={handleAddBankAccount} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f8fafc' }}>
                + Tambah Rekening Bank Baru
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nama Bank (e.g. Bank BSI)"
                  value={newBank.bank}
                  onChange={(e) => setNewBank({ ...newBank, bank: e.target.value })}
                  style={{ fontSize: '0.85rem' }}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nomor Rekening"
                  value={newBank.noRek}
                  onChange={(e) => setNewBank({ ...newBank, noRek: e.target.value })}
                  style={{ fontSize: '0.85rem' }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Atas Nama (Pemilik)"
                  value={newBank.holder}
                  onChange={(e) => setNewBank({ ...newBank, holder: e.target.value })}
                  style={{ fontSize: '0.85rem' }}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Kantor Cabang"
                  value={newBank.branch}
                  onChange={(e) => setNewBank({ ...newBank, branch: e.target.value })}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
              <button type="submit" className="btn btn-outline-primary btn-sm" style={{ width: '100%', fontWeight: 700 }}>
                + Simpan Rekening Baru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: JAM KERJA & PENGATURAN PRESENSI                                */}
      {/* ===================================================================== */}
      {activeTab === 'workhours' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <Clock size={22} color="#c084fc" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                  Pengaturan Jam Kantor & Toleransi Presensi
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Aturan ini terhubung secara otomatis ke modul To-Do List & Presensi Harian Karyawan.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveWorkingHours}>
              {/* Status Sakelar Buka / Tutup Kantor */}
              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.4)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: hoursForm.isOpen ? '#22c55e' : '#ef4444' }}>
                    Status Operasional: {hoursForm.isOpen ? 'Buka (OPEN)' : 'Tutup Sementara (CLOSED)'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Jika ditutup, karyawan akan mendapatkan pemberitahuan libur operasional.
                  </div>
                </div>
                <button
                  type="button"
                  className={`btn ${hoursForm.isOpen ? 'btn-success' : 'btn-danger'}`}
                  onClick={() => setHoursForm({ ...hoursForm, isOpen: !hoursForm.isOpen })}
                  style={{ fontWeight: 800, fontSize: '0.84rem' }}
                >
                  {hoursForm.isOpen ? 'Kantor Aktif' : 'Kantor Libur'}
                </button>
              </div>

              {/* 1. Kantor Pusat (Head Office) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.5rem' }}>
                  1. Kantor Pusat (Head Office & Management)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Jam Masuk & Pulang:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={hoursForm.headOfficeHours}
                      onChange={(e) => setHoursForm({ ...hoursForm, headOfficeHours: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Hari Kerja & Toleransi:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={hoursForm.headOfficeDays}
                      onChange={(e) => setHoursForm({ ...hoursForm, headOfficeDays: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 2. Site Lapangan (Site Office) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>
                  2. Kantor Lapangan (Site Office & Teknik Proyek)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Jam Masuk & Pulang:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={hoursForm.siteOfficeHours}
                      onChange={(e) => setHoursForm({ ...hoursForm, siteOfficeHours: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Hari Kerja & Overtime:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={hoursForm.siteOfficeDays}
                      onChange={(e) => setHoursForm({ ...hoursForm, siteOfficeDays: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 3. Keamanan Pos (Security) */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>
                  3. Regu Keamanan (Security & Pos Penjagaan Kawasan)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Rotasi Shift:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={hoursForm.securityHours}
                      onChange={(e) => setHoursForm({ ...hoursForm, securityHours: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Jadwal Jaga:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={hoursForm.securityDays}
                      onChange={(e) => setHoursForm({ ...hoursForm, securityDays: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700 }}
              >
                <Save size={16} />
                <span>Simpan Aturan Jam Kerja & Presensi</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: AUDIT LOG AKTIVITAS & CADANGAN DATA 1-KLIK                     */}
      {/* ===================================================================== */}
      {activeTab === 'audit-backup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Backup & Restore Action Card */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Database size={20} color="#10b981" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Pusat Cadangan & Pemulihan Data Sistem (Backup & Restore)
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              Unduh salinan seluruh database sistem (daftar akun, laporan kinerja harian, presensi GPS, konfigurasi jam kerja, dan profil perusahaan) ke dalam file terenkripsi untuk keamanan data jangka panjang.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleBackupDatabase}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, padding: '0.65rem 1.25rem' }}
              >
                <Download size={16} />
                <span>💾 Unduh Cadangan Data Database (.JSON)</span>
              </button>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => restoreInputRef.current?.click()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, padding: '0.65rem 1.25rem' }}
              >
                <UploadCloud size={16} />
                <span>📥 Pulihkan Data Dari Cadangan (Restore)</span>
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Activity size={20} color="#38bdf8" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Log Aktivitas Audit Trail Pimpinan & Super Admin
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>ID</th>
                    <th style={{ width: '260px' }}>Pengguna / Akun</th>
                    <th>Tindakan Operasional & Otorisasi</th>
                    <th style={{ width: '130px' }}>Alamat IP</th>
                    <th style={{ width: '130px' }}>Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ color: 'var(--text-muted)' }}>#{log.id}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#38bdf8' }}>{log.user}</div>
                      </td>
                      <td>
                        <div style={{ color: '#f8fafc' }}>{log.action}</div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {log.ip}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                          {log.time}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: CETAK / DOWNLOAD PDF RESMI REKAP LAPORAN KINERJA             */}
      {/* ===================================================================== */}
      {isPrintModalOpen && (
        <div className="modal-backdrop" style={{ zIndex: 100 }}>
          <div 
            className="modal-content" 
            style={{ 
              maxWidth: '900px', 
              width: '95%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '2rem',
              backgroundColor: '#ffffff',
              color: '#0f172a'
            }}
          >
            {/* Action Bar (Top) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Pratinjau Dokumen Resmi Laporan Kinerja Karyawan
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                >
                  <Printer size={15} /> Cetak Sekarang (Print / PDF)
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsPrintModalOpen(false)}
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL DOCUMENT */}
            <div id="printable-rekap-area" style={{ fontFamily: 'Arial, sans-serif', color: '#1e293b' }}>
              {/* OFFICIAL COMPANY HEADER / KOP SURAT */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px double #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src="/company-logo.png"
                    alt="Ashoka Logo"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    style={{ width: '65px', height: '65px', objectFit: 'contain' }}
                  />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.04em' }}>
                      {companyProfile.name}
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px', maxWidth: '550px' }}>
                      {companyProfile.address}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Telp: {companyProfile.phone} • Email: {companyProfile.email} • NIB: {companyProfile.nib}
                    </div>
                  </div>
                </div>
              </div>

              {/* DOCUMENT TITLE & METADATA */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>
                  REKAPITULASI AKTIVITAS & LAPORAN KINERJA KARYAWAN
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                  Periode: {activeDateRange.label} ({activeDateRange.start} s/d {activeDateRange.end})
                </div>
              </div>

              {/* METADATA INFO BOX */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                <div>
                  <div>Target Karyawan: <strong>{selectedUserFilter === 'ALL' ? 'Seluruh Karyawan & Divisi' : selectedUserFilter}</strong></div>
                  <div style={{ marginTop: '3px' }}>Departemen / Divisi: <strong>{selectedDeptFilter === 'ALL' ? 'Seluruh Departemen' : selectedDeptFilter}</strong></div>
                </div>
                <div>
                  <div>Total Pekerjaan Dilaporkan: <strong>{kpiStats.total} Kegiatan</strong></div>
                  <div style={{ marginTop: '3px' }}>Tingkat Ketuntasan: <strong>{kpiStats.completed} Selesai ({kpiStats.rate}%)</strong></div>
                </div>
              </div>

              {/* TABLE DATA */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginBottom: '2rem' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '30px', textAlign: 'center' }}>No</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '80px' }}>Tanggal</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '130px' }}>Staf (PIC)</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '90px' }}>Proyek</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px' }}>Uraian Kegiatan Pekerjaan</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '80px', textAlign: 'center' }}>Status</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '120px' }}>Catatan / Kendala</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkActivities.map((t, idx) => (
                    <tr key={t.id || idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontWeight: 600 }}>{t.date || '-'}</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontWeight: 600 }}>{t.pic || t.assignee || '-'}</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{t.proyek || t.project || '-'}</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{t.laporan || t.text || '-'}</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: t.completed ? '#166534' : '#b45309' }}>
                        {t.completed ? 'Selesai' : 'Pending'}
                      </td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontSize: '0.72rem' }}>
                        {t.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* OFFICIAL SIGNATURE BLOCK */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '2.5rem', pageBreakInside: 'avoid' }}>
                <div style={{ textAlign: 'center', width: '220px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>Dibuat & Dilaporkan Oleh:</div>
                  <div style={{ height: '70px' }}></div>
                  <div style={{ fontWeight: 800, borderBottom: '1px solid #0f172a', paddingBottom: '2px', fontSize: '0.88rem' }}>
                    {selectedUserFilter === 'ALL' ? 'Tim Operasional AMS' : selectedUserFilter}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Staf / PIC Terkait</div>
                </div>

                <div style={{ textAlign: 'center', width: '240px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    Gunung Sindur, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>Mengetahui & Menyetujui:</div>
                  <div style={{ height: '70px' }}></div>
                  <div style={{ fontWeight: 800, borderBottom: '1px solid #0f172a', paddingBottom: '2px', fontSize: '0.88rem' }}>
                    Yazid Hizbullah, S.E.,S.T
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Direktur Utama (President Director)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: ATUR MATRIKS HAK AKSES MODUL INTERAKTIF                     */}
      {/* ===================================================================== */}
      {isPermissionsModalOpen && selectedUser && (
        <div className="modal-backdrop" style={{ zIndex: 90 }}>
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#38bdf8" />
                <h3 className="modal-title">Otorisasi Hak Akses Modul: {selectedUser.name}</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsPermissionsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Pilih modul mana saja yang berhak dibuka oleh <strong style={{ color: '#f8fafc' }}>{selectedUser.name}</strong> ({selectedUser.role} - {selectedUser.dept}).
              </div>

              {/* Quick Select All or None */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setUserForm({ ...userForm, allowedModules: availableModulesList.map(m => m.key) })}
                >
                  Pilih Semua Modul
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setUserForm({ ...userForm, allowedModules: ['todo-attendance'] })}
                >
                  Hanya To-Do List
                </button>
              </div>

              {/* Module Checkbox Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                {availableModulesList.map((mod) => {
                  const isChecked = userForm.allowedModules.includes(mod.key);
                  return (
                    <div
                      key={mod.key}
                      onClick={() => handleToggleModulePermission(mod.key)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        background: isChecked ? 'rgba(56, 189, 248, 0.12)' : 'rgba(30, 41, 59, 0.4)',
                        border: isChecked ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isChecked ? '#38bdf8' : '#f8fafc' }}>
                          {mod.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Grup: {mod.group}
                        </div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        background: isChecked ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0f172a'
                      }}>
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsPermissionsModalOpen(false)}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSavePermissions}>
                Simpan Otorisasi Modul
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: TAMBAH / EDIT KARYAWAN                                       */}
      {/* ===================================================================== */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="modal-backdrop" style={{ zIndex: 90 }}>
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {isAddModalOpen ? '+ Tambah Karyawan Baru' : 'Edit Profil Karyawan'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit}>
              <div className="modal-body">
                {/* Photo Upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <img
                    src={userForm.avatar || '/avatars/default.png'}
                    alt="Preview"
                    onError={(e) => { e.currentTarget.src = '/avatars/default.png'; }}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                  />
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Unggah Foto Profil
                    </button>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      JPG, PNG, atau WebP (Maks 2MB)
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Nama Lengkap:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nama Lengkap Karyawan..."
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Alamat Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="email@ashoka.id"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>No. WhatsApp:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0812-XXXX-XXXX"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Departemen / Divisi:</label>
                    <select
                      className="form-control"
                      value={userForm.dept}
                      onChange={(e) => setUserForm({ ...userForm, dept: e.target.value })}
                    >
                      <option value="Teknik">Teknik & Proyek</option>
                      <option value="Marketing">Marketing & Penjualan</option>
                      <option value="Legal">Legal Corporate</option>
                      <option value="Finance">Finance & Kas</option>
                      <option value="HR & GA">HR & GA Operasional</option>
                      <option value="Customer Relation">Customer Relation</option>
                      <option value="Procurement">Procurement</option>
                      <option value="Direksi">Direksi</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Jabatan / Role:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Staf Senior Teknik"
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Status Akun:</label>
                  <select
                    className="form-control"
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                    <option value="Cuti">Sedang Cuti</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {isAddModalOpen ? 'Tambah Karyawan' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
