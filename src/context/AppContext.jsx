import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ALL_MODULE_KEYS = [
  'dashboard',
  'todo-attendance',
  'executive',
  'manager',
  'teknik-rumah',
  'teknik-fasilitas',
  'teknik-batp',
  'marketing',
  'legal',
  'finance',
  'ga',
  'hr',
  'customer-relation',
  'procurement',
  'users'
];

export const AppProvider = ({ children }) => {
  // Sub-Tab Navigation Control (Shared across sidebar & modules)
  const [activeSubTab, setActiveSubTab] = useState('default');

  // OFFICIAL MANAGEMENT & STAFF ACCOUNTS (17 OFFICIAL COMPANY TEAM MEMBERS)
  const officialCompanyUsers = [
    { 
      id: 'USR-001', 
      name: 'Ahmad Rafail', 
      email: 'rafail@ams.co.id', 
      role: 'Super Admin & Direktur Utama', 
      status: 'Aktif', 
      avatar: '', 
      address: 'Pusat Operasional Ashoka Enterprise',
      allowedModules: [...ALL_MODULE_KEYS]
    },
    { 
      id: 'USR-002', 
      name: 'Yazid Hizbullah, S.E.,S.T', 
      email: 'yazid@ams.co.id', 
      role: 'Direktur Utama & Finance Director', 
      status: 'Aktif', 
      avatar: '', 
      address: 'Kantor Direksi Ashoka Enterprise',
      allowedModules: [...ALL_MODULE_KEYS]
    },
    { 
      id: 'USR-003', 
      name: 'Adhi Himawan, S.E.Sy', 
      email: 'adhi@ams.co.id', 
      role: 'General Manager (Ops, Marketing, HR & Legal)', 
      status: 'Aktif', 
      avatar: '', 
      address: 'Kantor Operasional Ashoka Enterprise',
      allowedModules: ['dashboard', 'todo-attendance', 'executive', 'manager', 'teknik-rumah', 'teknik-fasilitas', 'teknik-batp', 'marketing', 'legal', 'finance', 'ga', 'hr', 'customer-relation', 'procurement']
    },
    {
      id: 'USR-004',
      name: 'Dodi Syaiful Nugroho',
      email: 'dodi@ams.co.id',
      role: 'H.O. Operation Staf & Head HR & GA',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen HR, GA & Head Office Ops Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'hr', 'ga', 'manager']
    },
    {
      id: 'USR-005',
      name: 'Hapip Alamsyah',
      email: 'hapip@ams.co.id',
      role: 'Head Operation Site',
      status: 'Aktif',
      avatar: '',
      address: 'Site Office Lapangan & Kontraktor Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'teknik-rumah', 'teknik-fasilitas', 'teknik-batp', 'manager', 'procurement']
    },
    {
      id: 'USR-006',
      name: 'Wahyu Salma Septiani, S.H',
      email: 'salma@ams.co.id',
      role: 'Legal Division Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Legal & Perizinan Properti Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'legal', 'marketing']
    },
    {
      id: 'USR-007',
      name: 'Kholidin',
      email: 'kholidin@ams.co.id',
      role: 'Teknik Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Teknik & Konstruksi Lapangan',
      allowedModules: ['todo-attendance', 'teknik-rumah', 'teknik-fasilitas', 'teknik-batp']
    },
    {
      id: 'USR-008',
      name: 'M. Naufal',
      email: 'naufal@ams.co.id',
      role: 'Teknik Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Teknik & Konstruksi Lapangan',
      allowedModules: ['todo-attendance', 'teknik-rumah', 'teknik-fasilitas', 'teknik-batp']
    },
    {
      id: 'USR-009',
      name: 'M. Naseh',
      email: 'naseh@ams.co.id',
      role: 'Teknik Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Teknik & Konstruksi Lapangan',
      allowedModules: ['todo-attendance', 'teknik-rumah', 'teknik-fasilitas', 'teknik-batp']
    },
    {
      id: 'USR-010',
      name: 'Fajar Almizan',
      email: 'fajar@ams.co.id',
      role: 'Logistic Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Gudang Material & Logistik Proyek',
      allowedModules: ['todo-attendance', 'procurement', 'ga']
    },
    {
      id: 'USR-011',
      name: 'Yulieka Rachmawati, S.Si',
      email: 'yulieka@ams.co.id',
      role: 'Head Marketing',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Pemasaran & Sales Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'marketing', 'customer-relation']
    },
    {
      id: 'USR-012',
      name: 'Fresda Destifani',
      email: 'fresda@ams.co.id',
      role: 'Marketing Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Pemasaran & Sales Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'marketing']
    },
    {
      id: 'USR-013',
      name: 'Amanda Chesyarini',
      email: 'amanda@ams.co.id',
      role: 'Marketing Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Pemasaran & Sales Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'marketing']
    },
    {
      id: 'USR-014',
      name: 'Bambang Hermawan',
      email: 'bambang@ams.co.id',
      role: 'Marketing Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Pemasaran & Sales Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'marketing']
    },
    {
      id: 'USR-015',
      name: 'Syamsul Dahari',
      email: 'syamsul@ams.co.id',
      role: 'Finance Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Keuangan Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'finance']
    },
    {
      id: 'USR-016',
      name: 'Tarkum Aditya',
      email: 'tarkum@ams.co.id',
      role: 'Accounting Tax Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Akuntansi & Pajak Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'finance']
    },
    {
      id: 'USR-017',
      name: 'Jezen',
      email: 'jezen@ams.co.id',
      role: 'Collection Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Penagihan Collection Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'finance', 'customer-relation']
    }
  ];

  // 1. PERSISTENT USERS STORE FROM LOCALSTORAGE (KEEPS ALL OFFICIAL ACCOUNTS)
  const getSavedUsers = () => {
    try {
      const saved = localStorage.getItem('ams_users_clean_v21');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 17) return parsed;
      }
    } catch (e) {
      console.error('Error loading users:', e);
    }
    return officialCompanyUsers;
  };

  const [users, setUsers] = useState(getSavedUsers);

  // 2. PERSISTENT CURRENT LOGGED-IN USER
  const getSavedCurrentUser = (userList) => {
    try {
      const saved = localStorage.getItem('ams_current_user_clean_v21');
      if (saved) {
        const parsed = JSON.parse(saved);
        const matched = userList.find(u => u.email.toLowerCase() === parsed.email.toLowerCase() || u.id === parsed.id);
        if (matched) return matched;
      }
    } catch (e) {}
    const yazidDefault = userList.find(u => u.email.toLowerCase() === 'yazid@ams.co.id');
    return yazidDefault || userList[0] || officialCompanyUsers[0];
  };

  const [currentUser, setCurrentUser] = useState(() => getSavedCurrentUser(users));

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ams_users_clean_v21', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  // Sync currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ams_current_user_clean_v21', JSON.stringify(currentUser));
      }
    } catch (e) {}
  }, [currentUser]);
  // Helper avatar generator for fallback initials
  const getAvatarUrl = (user) => {
    if (user && user.avatar && user.avatar.trim() !== '') {
      return user.avatar;
    }
    const nameEnc = encodeURIComponent(user?.name || 'User');
    return `https://ui-avatars.com/api/?name=${nameEnc}&background=1e293b&color=f59e0b&bold=true&size=128`;
  };

  // FULL USER CRUD ACTIONS FOR SUPER ADMIN ONLY
  const addUser = (newUser) => {
    const userObj = {
      id: `USR-00${users.length + 1}`,
      avatar: newUser.avatar || '',
      status: 'Aktif',
      ...newUser
    };
    setUsers((prev) => [userObj, ...prev]);
    showNotification(`USER BARU DITAMBAHKAN! Profil ${newUser.name} (${newUser.role}) berhasil didaftarkan.`);
  };

  const updateUser = (id, updatedFields) => {
    setUsers((prevUsers) => {
      const nextUsers = prevUsers.map(u => u.id === id ? { ...u, ...updatedFields } : u);
      
      // REAL-TIME SYNC: Update currentUser immediately so top navbar & sidebar avatar update live!
      if (currentUser && (currentUser.id === id || currentUser.email.toLowerCase() === (updatedFields.email || currentUser.email).toLowerCase())) {
        const updatedActiveUser = nextUsers.find(u => u.id === id);
        if (updatedActiveUser) {
          setCurrentUser(updatedActiveUser);
        }
      }

      return nextUsers;
    });

    showNotification(`PROFIL USER DIPERBARUI! Data ${updatedFields.name || id} tersimpan secara permanen.`);
  };

  const deleteUser = (id) => {
    const targetUser = users.find(u => u.id === id);
    if (targetUser?.role?.toLowerCase().includes('super admin')) {
      showNotification('Akses Ditolak: Akun Super Admin Utama (Ahmad Rafail) tidak boleh dihapus!', 'danger');
      return;
    }
    setUsers((prev) => prev.filter(u => u.id !== id));
    showNotification(`USER DIHAPUS! Akun profil ${targetUser?.name || id} berhasil dihapus dari sistem.`, 'warning');
  };

  const resetToOfficialCompanyUsers = () => {
    setUsers(officialCompanyUsers);
    setCurrentUser(officialCompanyUsers[0]);
    try {
      localStorage.setItem('ams_users_clean_v15', JSON.stringify(officialCompanyUsers));
      localStorage.setItem('ams_current_user_clean_v15', JSON.stringify(officialCompanyUsers[0]));
    } catch (e) {}
    showNotification('AKUN DITERBITKAN KEMBALI! Seluruh 17 akun pimpinan & staf resmi aktif.', 'info');
  };

  // 3. HOUSING UNITS STORE
  const [units, setUnits] = useState([
    {
      id: 'UNT-001',
      unitNo: 'A-01',
      cluster: 'Grand Harmoni - Cluster Emerald',
      owner: 'Budi Santoso',
      phone: '0812-9988-7711',
      tipe: '45/90',
      progress: 100,
      status: 'Ready (Handover)',
      contractor: 'PT Bangun Jaya Perdana',
      startDate: '2025-01-10',
      targetDate: '2025-07-31',
      legal: { status: 'SHM Ready (No. 1024/SHM)', shgb: 'SHGB No 405 (Exp 2045)', splitStatus: 'SELESAI BALIK NAMA' },
      finance: { skema: 'KPR Bank Mandiri', dpStatus: 'Lunas 100%', harga: 650000000, pencairanKpr: 'Cair 100%', batpPayment: 'Lunas BATP 100%' },
      crm: { ticketStatus: 'No Complaints', bastStatus: 'BAST Selesai Diserahterimakan', iplStatus: 'Lunas Agt 2025' }
    }
  ]);

  // 4. CLEAN TO-DO LIST STORE (EMPTY LIST READY FOR MANUAL TESTING)
  const getInitialTodos = () => {
    try {
      const saved = localStorage.getItem('ams_todos_clean_v15');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return []; // Clean Empty List
  };

  const [todos, setTodos] = useState(getInitialTodos);

  useEffect(() => {
    try {
      localStorage.setItem('ams_todos_clean_v15', JSON.stringify(todos));
    } catch (e) {}
  }, [todos]);

  // 5. CLEAN ATTENDANCE LOGS STORE (EMPTY LIST READY FOR MANUAL TESTING)
  const getInitialAttendances = () => {
    try {
      const saved = localStorage.getItem('ams_attendances_clean_v15');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return []; // Clean Empty List
  };

  const [attendances, setAttendances] = useState(getInitialAttendances);

  useEffect(() => {
    try {
      localStorage.setItem('ams_attendances_clean_v15', JSON.stringify(attendances));
    } catch (e) {}
  }, [attendances]);

  // ACC Photo Selfie Approval Helper Actions
  const approveAttendancePhoto = (id) => {
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setAttendances(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          accStatus: 'APPROVED',
          accBy: `${currentUser?.name || 'Manager'} (${currentUser?.role || 'Management'})`,
          accTime: timeNow
        };
      }
      return a;
    }));
    showNotification(`FOTO PRESENSI DI-ACC! Foto selfie ID ${id} berhasil disetujui & diverifikasi oleh ${currentUser?.name}.`);
  };

  const rejectAttendancePhoto = (id) => {
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setAttendances(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          accStatus: 'REJECTED',
          accBy: `${currentUser?.name || 'Manager'} (${currentUser?.role || 'Management'})`,
          accTime: timeNow
        };
      }
      return a;
    }));
    showNotification(`FOTO PRESENSI DITOLAK! Presensi ID ${id} ditandai tidak valid oleh ${currentUser?.name}.`, 'warning');
  };

  // 6. EXECUTIVE APPROVALS & PROCUREMENTS
  const [executiveApprovals, setExecutiveApprovals] = useState([]);
  const [procurements, setProcurements] = useState([]);

  // 6b. COMMERCIALS, FACILITIES, UTILITIES FOR TEKNIK KOMERSIL
  const [commercials, setCommercials] = useState([
    { id: 'RUKO-01', nama: 'Ruko Boulevard Emerald Block A1', tipe: '3 Lantai (75/150)', progress: 85, status: 'Pekerjaan Cat & Fasad', kontraktor: 'PT Bangun Jaya Perdana', legalStatus: 'SHGB Induk' },
    { id: 'RUKO-02', nama: 'Ruko Boulevard Emerald Block A2', tipe: '3 Lantai (75/150)', progress: 100, status: 'Ready (Serah Terima)', kontraktor: 'PT Bangun Jaya Perdana', legalStatus: 'SHGB Induk' },
    { id: 'RUKO-03', nama: 'Ruko Plaza Sapphire Block B1', tipe: '2 Lantai (60/120)', progress: 45, status: 'Struktur Lantai 2', kontraktor: 'CV Karya Mandiri Teknik', legalStatus: 'SHGB Induk' }
  ]);

  const [facilities, setFacilities] = useState([
    { id: 'FAS-01', nama: 'Clubhouse & Swimming Pool', progress: 100, status: 'Selesai & Operasional', target: 'Mei 2025', pengawas: 'Hapip Alamsyah', photo: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80' },
    { id: 'FAS-02', nama: 'Masjid Utama Ashoka', progress: 90, status: 'Finishing Interior & Ornamen', target: 'Juni 2025', pengawas: 'Kholidin', photo: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=600&auto=format&fit=crop&q=80' },
    { id: 'FAS-03', nama: 'Taman Bermain Anak & Jogging Track', progress: 100, status: 'Selesai & Operasional', target: 'April 2025', pengawas: 'M. Naufal', photo: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80' }
  ]);

  const [utilities, setUtilities] = useState([
    { id: 'UTL-01', jenis: 'Jaringan PLN Sub-station 197 KVA', nama: 'Jaringan PLN Sub-station 197 KVA', progress: 100, status: 'Tersambung PLN', pihak: 'PT PLN (Persero)', penyedia: 'PT PLN (Persero)' },
    { id: 'UTL-02', jenis: 'Jaringan Air Bersih PDAM Master Pipe', nama: 'Jaringan Air Bersih PDAM Master Pipe', progress: 80, status: 'Pemasangan Pipa Utama', pihak: 'PDAM Tirta Kencana', penyedia: 'PDAM Tirta Kencana' },
    { id: 'UTL-03', jenis: 'Jaringan Fiber Optic Internet Underground', nama: 'Jaringan Fiber Optic Internet Underground', progress: 95, status: 'Pemasangan Kabel Utilitas', pihak: 'Telkom / Indihome', penyedia: 'Telkom / Indihome' }
  ]);

  // 7. NOTIFICATIONS STORE
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Staf Legal Baru Didaftarkan: Wahyu Salma Septiani, S.H (Legal Division Staf). Total 17 Tim Resmi Aktif.', type: 'info', date: 'Baru Saja' }
  ]);

  const showNotification = (text, type = 'success') => {
    const newNotif = { id: Date.now(), text, type, date: 'Baru Saja' };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateFacilityProgress = (id, newProgress, newStatus, photoUrl = '') => {
    setFacilities(prev => prev.map(f => {
      if (f.id === id) {
        const updated = {
          ...f,
          progress: newProgress,
          status: newStatus,
          photo: photoUrl || f.photo || ''
        };
        showNotification(`PROGRES FASILITAS DIPERBARUI! ${f.nama} progres ${newProgress}% & foto bukti berhasil disimpan.`);
        return updated;
      }
      return f;
    }));
  };

  // FULL CRUD FOR FACILITIES
  const addFacility = (newFac) => {
    const facObj = {
      id: `FAS-0${facilities.length + 1}`,
      ...newFac
    };
    setFacilities(prev => [facObj, ...prev]);
    showNotification(`FASILITAS BARU DITAMBAHKAN! ${newFac.nama} berhasil didaftarkan.`);
  };

  const updateFacility = (id, updatedFields) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...updatedFields } : f));
    showNotification(`DATA FASILITAS DIPERBARUI! ${updatedFields.nama || id} berhasil disimpan.`);
  };

  const deleteFacility = (id) => {
    const target = facilities.find(f => f.id === id);
    setFacilities(prev => prev.filter(f => f.id !== id));
    showNotification(`FASILITAS DIHAPUS! ${target?.nama || id} berhasil dihapus.`, 'warning');
  };

  // FULL CRUD FOR COMMERCIALS
  const addCommercial = (newKom) => {
    const komObj = {
      id: `RUKO-0${commercials.length + 1}`,
      ...newKom
    };
    setCommercials(prev => [komObj, ...prev]);
    showNotification(`RUKO KOMERSIL DITAMBAHKAN! ${newKom.nama} berhasil didaftarkan.`);
  };

  const deleteCommercial = (id) => {
    const target = commercials.find(k => k.id === id);
    setCommercials(prev => prev.filter(k => k.id !== id));
    showNotification(`UNIT KOMERSIL DIHAPUS! ${target?.nama || id} berhasil dihapus.`, 'warning');
  };

  // FULL CRUD FOR UTILITIES
  const addUtility = (newUtl) => {
    const utlObj = {
      id: `UTL-0${utilities.length + 1}`,
      ...newUtl
    };
    setUtilities(prev => [utlObj, ...prev]);
    showNotification(`INFRASTRUKTUR UTILITAS DITAMBAHKAN! ${newUtl.nama || newUtl.jenis} berhasil didaftarkan.`);
  };

  const deleteUtility = (id) => {
    const target = utilities.find(u => u.id === id);
    setUtilities(prev => prev.filter(u => u.id !== id));
    showNotification(`UTILITAS DIHAPUS! ${target?.nama || id} berhasil dihapus.`, 'warning');
  };

  const updateUnitProgress = (unitNo, newProgress, newStatus, photoUrl = '') => {
    setUnits(prev => prev.map(u => {
      if (u.unitNo === unitNo) {
        const isFinished = newProgress === 100;
        const updated = {
          ...u,
          progress: newProgress,
          status: newStatus,
          progressPhoto: photoUrl || u.progressPhoto || '',
          finance: {
            ...u.finance,
            batpPayment: isFinished ? 'Lunas BATP 100% (ACC Direktur)' : u.finance.batpPayment
          },
          crm: {
            ...u.crm,
            bastStatus: isFinished ? 'BAST Selesai Diserahterimakan' : u.crm.bastStatus
          }
        };

        showNotification(`INTERKONAKSI OTOMATIS: Unit ${unitNo} progress fisik ${newProgress}%. BATP Finance & BAST CRM ikut ter-update!`);
        return updated;
      }
      return u;
    }));
  };

  const addUnit = (newUnit) => {
    const unitObj = {
      id: `UNT-00${units.length + 1}`,
      ...newUnit,
      legal: { status: 'PBG Induk Valid', shgb: 'SHGB Valid', splitStatus: 'Proses BPN' },
      finance: { skema: 'KPR Bank', dpStatus: 'Proses DP', harga: 650000000, pencairanKpr: 'Pengajuan SP3K', batpPayment: 'Termin 1' },
      crm: { ticketStatus: 'Baru', bastStatus: 'Proses Pembangunan', iplStatus: 'Belum Terbit' }
    };
    setUnits([unitObj, ...units]);
    showNotification(`INTERKONAKSI OTOMATIS: Unit Kavling ${newUnit.unitNo} berhasil ditambahkan!`);
  };

  const updateUnit = (id, updatedFields) => {
    setUnits(units.map(u => u.id === id ? { ...u, ...updatedFields } : u));
    showNotification(`Data unit ${updatedFields.unitNo || id} berhasil diperbarui!`);
  };

  const deleteUnit = (id) => {
    const target = units.find(u => u.id === id);
    setUnits(prev => prev.filter(u => u.id !== id));
    showNotification(`UNIT DIHAPUS! Data Unit ${target?.unitNo || id} berhasil dihapus dari sistem.`, 'warning');
  };

  const canAccessModule = (moduleKey, userOverride = null) => {
    const user = userOverride || currentUser;
    if (!user) return false;
    
    const roleLower = (user.role || '').toLowerCase();
    const nameLower = (user.name || '').toLowerCase();
    const emailLower = (user.email || '').toLowerCase();

    // Direktur Utama (Pak Yazid) & Super Admin (Ahmad Rafail) have full access to ALL modules including users!
    if (
      roleLower.includes('super admin') || 
      roleLower.includes('direktur') || 
      nameLower.includes('yazid') || 
      emailLower.includes('yazid') ||
      nameLower.includes('rafail') ||
      emailLower.includes('rafail')
    ) {
      return true;
    }

    if (moduleKey === 'users') {
      return roleLower.includes('super admin') || roleLower.includes('direktur');
    }

    if (moduleKey === 'todo-attendance') return true;

    if (roleLower.includes('general manager')) {
      return true;
    }

    if (user.allowedModules && user.allowedModules.includes(moduleKey)) {
      return true;
    }

    return false;
  };

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        resetToOfficialCompanyUsers,
        getAvatarUrl,
        activeSubTab,
        setActiveSubTab,
        units,
        addUnit,
        updateUnit,
        deleteUnit,
        updateUnitProgress,
        todos,
        setTodos,
        executiveApprovals,
        setExecutiveApprovals,
        attendances,
        setAttendances,
        approveAttendancePhoto,
        rejectAttendancePhoto,
        procurements,
        setProcurements,
        commercials,
        setCommercials,
        addCommercial,
        deleteCommercial,
        facilities,
        setFacilities,
        addFacility,
        updateFacility,
        updateFacilityProgress,
        deleteFacility,
        utilities,
        setUtilities,
        addUtility,
        deleteUtility,
        notifications,
        showNotification,
        canAccessModule
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
