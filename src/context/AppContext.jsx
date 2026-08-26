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
      allowedModules: ['todo-attendance', 'hr', 'ga', 'procurement', 'customer-relation']
    },
    {
      id: 'USR-005',
      name: 'Hapip Alamsyah',
      email: 'hapip@ams.co.id',
      role: 'Head Operation Site',
      status: 'Aktif',
      avatar: '',
      address: 'Site Office Lapangan & Kontraktor Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'teknik-rumah', 'teknik-fasilitas', 'teknik-batp', 'manager', 'procurement', 'customer-relation']
    },
    {
      id: 'USR-006',
      name: 'Wahyu Salma Septiani, S.H',
      email: 'salma@ams.co.id',
      role: 'Legal Division Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Legal & Perizinan Properti Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'legal', 'marketing', 'customer-relation']
    },
    {
      id: 'USR-007',
      name: 'Kholidin',
      email: 'kholidin@ams.co.id',
      role: 'Teknik Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Teknik & Konstruksi Lapangan',
      allowedModules: ['todo-attendance', 'teknik-rumah', 'teknik-fasilitas', 'teknik-batp', 'customer-relation']
    },
    {
      id: 'USR-008',
      name: 'M. Naufal',
      email: 'naufal@ams.co.id',
      role: 'Teknik Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Teknik & Konstruksi Lapangan',
      allowedModules: ['todo-attendance', 'teknik-rumah', 'teknik-fasilitas', 'teknik-batp', 'customer-relation']
    },
    {
      id: 'USR-009',
      name: 'M. Naseh',
      email: 'naseh@ams.co.id',
      role: 'Teknik Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Teknik & Konstruksi Lapangan',
      allowedModules: ['todo-attendance', 'teknik-rumah', 'teknik-fasilitas', 'teknik-batp', 'customer-relation']
    },
    {
      id: 'USR-010',
      name: 'Fajar Almizan',
      email: 'fajar@ams.co.id',
      role: 'Logistic Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Gudang Material & Logistik Proyek',
      allowedModules: ['todo-attendance', 'procurement', 'ga', 'customer-relation']
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
      allowedModules: ['todo-attendance', 'marketing', 'customer-relation']
    },
    {
      id: 'USR-013',
      name: 'Amanda Chesyarini',
      email: 'amanda@ams.co.id',
      role: 'Marketing Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Pemasaran & Sales Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'marketing', 'customer-relation']
    },
    {
      id: 'USR-014',
      name: 'Bambang Hermawan',
      email: 'bambang@ams.co.id',
      role: 'Marketing Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Pemasaran & Sales Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'marketing', 'customer-relation']
    },
    {
      id: 'USR-015',
      name: 'Syamsul Dahari',
      email: 'syamsul@ams.co.id',
      role: 'Finance Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Keuangan Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'finance', 'customer-relation']
    },
    {
      id: 'USR-016',
      name: 'Tarkum Aditya',
      email: 'tarkum@ams.co.id',
      role: 'Accounting Tax Staf',
      status: 'Aktif',
      avatar: '',
      address: 'Departemen Akuntansi & Pajak Ashoka Enterprise',
      allowedModules: ['todo-attendance', 'finance', 'customer-relation']
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
      const saved = localStorage.getItem('ams_users_clean_v22');
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
      const saved = localStorage.getItem('ams_current_user_clean_v22');
      if (saved) {
        const parsed = JSON.parse(saved);
        const matched = userList.find(u => u.email.toLowerCase() === parsed.email.toLowerCase() || u.id === parsed.id);
        if (matched) return { ...matched, ...parsed, allowedModules: matched.allowedModules, role: matched.role };
      }
    } catch (e) {}
    const yazidDefault = userList.find(u => u.email.toLowerCase() === 'yazid@ams.co.id');
    return yazidDefault || userList[0] || officialCompanyUsers[0];
  };

  const [currentUser, setCurrentUser] = useState(() => getSavedCurrentUser(users));

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ams_users_clean_v22', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  // Sync currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ams_current_user_clean_v22', JSON.stringify(currentUser));
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

  // 3. HOUSING UNITS STORE (CLEAN EMPTY INITIAL STATE - 0% S-CURVE BASELINE)
  const getInitialUnits = () => {
    try {
      const saved = localStorage.getItem('ams_units_clean_v22');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return []; // Clean Empty List: Progress, Cashflow & S-Curve start at 0%
  };

  const [units, setUnits] = useState(getInitialUnits);

  useEffect(() => {
    try {
      localStorage.setItem('ams_units_clean_v22', JSON.stringify(units));
    } catch (e) {}
  }, [units]);

  // 4. CLEAN TO-DO LIST STORE (FORMAT LAPORAN PEKERJAAN HARIAN: TANGGAL, WAKTU, PROYEK, LAPORAN, KORDINASI, PIC)
  const defaultInitialTodos = [
    { 
      id: 1, 
      date: '2025-08-26',
      waktu: '08:00 - 10:00',
      proyek: 'Ashoka Park',
      project: 'Ashoka Park',
      laporan: 'Penyusunan Rekapitulasi Tagihan KPR Bank BTN & Laporan Cash-In Proyek Ashoka Park',
      text: 'Penyusunan Rekapitulasi Tagihan KPR Bank BTN & Laporan Cash-In Proyek Ashoka Park',
      kordinasi: 'Bank BTN Cabang & Pimpinan Finance',
      pic: 'Syamsul Dahari',
      assignee: 'Syamsul Dahari',
      picId: 'USR-015',
      priority: 'Tinggi',
      completed: true,
      notes: 'Selesai direkap, 8 berkas konsumen disetujui.',
      assignedBy: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)'
    },
    { 
      id: 2, 
      date: '2025-08-26',
      waktu: '10:00 - 12:00',
      proyek: 'Ashoka View',
      project: 'Ashoka View',
      laporan: 'Audit Faktur Pajak PPN & PPh Final Properti Kavling Ashoka View Tahap 2',
      text: 'Audit Faktur Pajak PPN & PPh Final Properti Kavling Ashoka View Tahap 2',
      kordinasi: 'Konsultan Pajak & Kantor Pajak Pratama',
      pic: 'Tarkum Aditya',
      assignee: 'Tarkum Aditya',
      picId: 'USR-016',
      priority: 'Tinggi',
      completed: false,
      notes: '',
      assignedBy: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)'
    },
    { 
      id: 3, 
      date: '2025-08-26',
      waktu: '13:00 - 15:00',
      proyek: 'Ashoka View',
      project: 'Ashoka View',
      laporan: 'Follow-up Penagihan Tunggakan DP Konsumen Cluster Emerald Unit A-02 Ashoka View',
      text: 'Follow-up Penagihan Tunggakan DP Konsumen Cluster Emerald Unit A-02 Ashoka View',
      kordinasi: 'Konsumen Bapak Hendra & Notaris',
      pic: 'Jezen',
      assignee: 'Jezen',
      picId: 'USR-017',
      priority: 'Sedang',
      completed: false,
      notes: '',
      assignedBy: 'Adhi Himawan, S.E.Sy (General Manager)'
    },
    { 
      id: 4, 
      date: '2025-08-26',
      waktu: '15:00 - 17:00',
      proyek: 'Ashoka Park',
      project: 'Ashoka Park',
      laporan: 'Inspeksi & Pengawasan Pengecoran Beton Atap Kavling Unit A-02 Ashoka Park',
      text: 'Inspeksi & Pengawasan Pengecoran Beton Atap Kavling Unit A-02 Ashoka Park',
      kordinasi: 'Mandor Sipil & Tim Pengawas Teknik',
      pic: 'Adhi Himawan, S.E.Sy',
      assignee: 'Adhi Himawan, S.E.Sy',
      picId: 'USR-004',
      priority: 'Tinggi',
      completed: true,
      notes: 'Slump test K-250 lolos uji standar QC.',
      assignedBy: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)'
    }
  ];

  const getInitialTodos = () => {
    try {
      const saved = localStorage.getItem('ams_todos_master_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const old4 = localStorage.getItem('ams_todos_master_v4');
      if (old4) {
        const parsedOld = JSON.parse(old4);
        if (Array.isArray(parsedOld) && parsedOld.length > 0) {
          return parsedOld.map((item, idx) => ({
            ...item,
            proyek: item.proyek || item.project || (idx % 2 === 0 ? 'Ashoka Park' : 'Ashoka View'),
            project: item.proyek || item.project || (idx % 2 === 0 ? 'Ashoka Park' : 'Ashoka View')
          }));
        }
      }
    } catch (e) {}
    return defaultInitialTodos;
  };

  const [todos, setTodos] = useState(getInitialTodos);

  useEffect(() => {
    try {
      localStorage.setItem('ams_todos_master_v5', JSON.stringify(todos));
    } catch (e) {}
  }, [todos]);

  // 4B. WORK INSTRUCTIONS STORE (INSTRUKSI PEKERJAAN PIMPINAN KEPADA STAF)
  const defaultInitialInstructions = [
    {
      id: 'INS-001',
      date: '2025-08-26',
      dueDate: '2025-08-27',
      dueTime: '17:00',
      proyek: 'Ashoka Park',
      project: 'Ashoka Park',
      instruction: 'Koordinasikan dengan Bank Mandiri & BTN untuk percepatan SP3K 12 unit konsumen Cluster Emerald Ashoka Park',
      kordinasi: 'Bank BTN, Bank Mandiri, Konsumen',
      assignee: 'Syamsul Dahari',
      assigneeId: 'USR-015',
      assignedBy: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)',
      assignedById: 'USR-002',
      priority: 'Tinggi',
      status: 'Pending',
      reportNotes: '',
      completionDate: ''
    },
    {
      id: 'INS-002',
      date: '2025-08-26',
      dueDate: '2025-08-28',
      dueTime: '15:00',
      proyek: 'Ashoka View',
      project: 'Ashoka View',
      instruction: 'Lakukan survei harga material semen & besi beton ke 3 vendor baru untuk tender Cluster Sapphire Ashoka View',
      kordinasi: 'Vendor Material, Procurement',
      assignee: 'Tarkum Aditya',
      assigneeId: 'USR-016',
      assignedBy: 'Adhi Himawan, S.E.Sy (General Manager)',
      assignedById: 'USR-004',
      priority: 'Tinggi',
      status: 'Pending',
      reportNotes: '',
      completionDate: ''
    },
    {
      id: 'INS-003',
      date: '2025-08-25',
      dueDate: '2025-08-26',
      dueTime: '16:00',
      proyek: 'Ashoka Park',
      project: 'Ashoka Park',
      instruction: 'Siapkan draf brosur dan price list promo DP 0% untuk pameran properti mall weekend ini',
      kordinasi: 'Percetakan & Event Organizer',
      assignee: 'Fresda Destifani',
      assigneeId: 'USR-012',
      assignedBy: 'Yulieka Rachmawati, S.Si (Head Marketing)',
      assignedById: 'USR-011',
      priority: 'Tinggi',
      status: 'Selesai',
      reportNotes: 'Brosur telah dicetak 500 eksemplar & materi digital siap tayang.',
      completionDate: '2025-08-26 14:30'
    }
  ];

  const getInitialInstructions = () => {
    try {
      const saved = localStorage.getItem('ams_work_instructions_v2');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('ams_work_instructions_v1');
      if (old) {
        const parsed = JSON.parse(old);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => ({
            ...item,
            proyek: item.proyek || item.project || (idx % 2 === 0 ? 'Ashoka Park' : 'Ashoka View'),
            project: item.proyek || item.project || (idx % 2 === 0 ? 'Ashoka Park' : 'Ashoka View')
          }));
        }
      }
    } catch (e) {}
    return defaultInitialInstructions;
  };

  const [instructions, setInstructions] = useState(getInitialInstructions);

  useEffect(() => {
    try {
      localStorage.setItem('ams_work_instructions_v2', JSON.stringify(instructions));
    } catch (e) {}
  }, [instructions]);

  // 6. MEDIA INFORMASI & PENGUMUMAN PERUSAHAAN (BISA DIBACA & DIISI OLEH SEMUA KARYAWAN)
  const defaultInitialMediaInfo = [
    {
      id: 'INFO-001',
      title: '📢 Sosialisasi SOP Prosedur Serah Terima Kunci & KPR Bank BTN Periode Q3',
      category: 'Pengumuman Kantor',
      categoryColor: '#38BDF8',
      content: 'Diberitahukan kepada seluruh staf Marketing, Legal, dan Finance bahwa proses akad massal KPR Bank BTN untuk Cluster Sapphire dan Emerald akan dilaksanakan pada hari Jumat pk 09:00 WIB di Kantor Pusat. Harap seluruh berkas konsumen dipersiapkan secara lengkap.',
      author: 'Yazid Hizbullah, S.E.,S.T',
      authorRole: 'Direktur Utama',
      targetDivision: 'Seluruh Karyawan & Divisi',
      date: '2026-08-26',
      time: '08:30 WIB',
      isPinned: true,
      likesCount: 5,
      likedBy: ['USR-001', 'USR-002', 'USR-004'],
      readBy: ['Ahmad Rafail', 'Adhi Himawan', 'Yulieka Rachmawati', 'Syamsul Dahari', 'Fresda Destifani'],
      photo: null
    },
    {
      id: 'INFO-002',
      title: '🏗️ Update Progres Pengecoran Jalan Utama & Drainase Site Emerald Hill',
      category: 'Update Lapangan',
      categoryColor: '#EAB308',
      content: 'Pekerjaan perataan tanah dan pengecoran drainase blok C telah mencapai 85%. Kendaraan logistik berat mohon diarahkan melalui gerbang timur selama proses pengeringan beton berlangsung.',
      author: 'Hapip Alamsyah',
      authorRole: 'Head Operation Site',
      targetDivision: 'Teknik, Logistik & Pengawas',
      date: '2026-08-26',
      time: '11:15 WIB',
      isPinned: false,
      likesCount: 3,
      likedBy: ['USR-004', 'USR-005'],
      readBy: ['Hapip Alamsyah', 'Bagas', 'Rangga'],
      photo: null
    },
    {
      id: 'INFO-003',
      title: '💡 Promo Marketing Akhir Bulan: Free Biaya BPHTB & Notaris Akad Merdeka',
      category: 'Marketing & Promo',
      categoryColor: '#10B981',
      content: 'Materi flyer dan banner promo diskon DP serta cashback akad sudah tersedia di link drive internal. Tim promosi dan sales agent lapangan dapat segera membagikan ke prospek konsumen.',
      author: 'Yulieka Rachmawati, S.Si',
      authorRole: 'Head Marketing',
      targetDivision: 'Marketing & Promosi',
      date: '2026-08-25',
      time: '14:00 WIB',
      isPinned: false,
      likesCount: 6,
      likedBy: ['USR-001', 'USR-011', 'USR-012'],
      readBy: ['Fresda Destifani', 'Amanda', 'Bambang'],
      photo: null
    }
  ];

  const getInitialMediaInfo = () => {
    try {
      const saved = localStorage.getItem('ams_media_info_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultInitialMediaInfo;
  };

  const [mediaInfoList, setMediaInfoList] = useState(getInitialMediaInfo);

  useEffect(() => {
    try {
      localStorage.setItem('ams_media_info_v1', JSON.stringify(mediaInfoList));
    } catch (e) {}
  }, [mediaInfoList]);

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

  // -------------------------------------------------------------
  // OPERATIONAL WORKING HOURS (GLOBAL PERSISTENT STORE)
  // -------------------------------------------------------------
  const initialWorkingHours = {
    status: 'Jam Kerja Operasional Berlangsung (OPEN)',
    isOpen: true,
    headOffice: { hours: '08:00 - 17:00 WIB', days: 'Senin - Jumat • Toleransi 15m' },
    siteOffice: { hours: '07:30 - 16:30 WIB', days: 'Senin - Sabtu • Overtime 2.0x' },
    security: { hours: '24 Jam (3 Rotasi Shift)', days: '7 Hari / Minggu • Siaga Pos' }
  };

  const [workingHours, setWorkingHours] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_working_hours_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.headOffice && parsed.siteOffice && parsed.security) {
          return parsed;
        }
      }
    } catch (e) {}
    return initialWorkingHours;
  });

  const updateWorkingHours = (newHours) => {
    setWorkingHours(newHours);
    try {
      localStorage.setItem('ams_working_hours_v2', JSON.stringify(newHours));
    } catch (e) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem('ams_working_hours_v2', JSON.stringify(workingHours));
    } catch (e) {}
  }, [workingHours]);

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

    if (moduleKey === 'customer-relation') return true;

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
        instructions,
        setInstructions,
        mediaInfoList,
        setMediaInfoList,
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
        canAccessModule,
        workingHours,
        setWorkingHours,
        updateWorkingHours
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
