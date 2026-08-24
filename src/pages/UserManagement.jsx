import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  CheckCircle, 
  X, 
  KeyRound, 
  Edit3, 
  Search, 
  Shield, 
  Activity, 
  UserX,
  CheckSquare,
  Square,
  Sparkles,
  Trash2,
  Eye,
  UserCheck,
  Mail,
  Home,
  MapPin,
  Camera,
  Upload,
  RefreshCw
} from 'lucide-react';

export const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser, resetToOfficialCompanyUsers, getAvatarUrl, showNotification } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('user-list');

  // File Input Ref for Local File Upload
  const fileInputRef = useRef(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    address: '',
    role: 'Teknik Specialist',
    dept: 'Teknik',
    phone: '0812-3456-7890',
    status: 'Aktif',
    avatar: '',
    allowedModules: ['todo-attendance', 'teknik-rumah']
  });

  const availableModulesList = [
    { key: 'todo-attendance', label: 'To-Do List Harian Karyawan', group: 'Universal' },
    { key: 'executive', label: 'Eksekutif Suite & Direksi Utama (BOD Overview)', group: 'Direksi' },
    { key: 'manager', label: 'Manajer Operasional (Pusat Approval Manager)', group: 'Manager' },
    { key: 'teknik-rumah', label: 'Teknik - Update Unit Rumah', group: 'Teknik' },
    { key: 'teknik-fasilitas', label: 'Teknik - Komersil & Utilitas Kawasan', group: 'Teknik' },
    { key: 'teknik-batp', label: 'Teknik - BATP & Handover Kontraktor', group: 'Teknik' },
    { key: 'marketing', label: 'Marketing & Sales (Penjualan Unit & Lead Prospek)', group: 'Marketing' },
    { key: 'legal', label: 'Legal & Perizinan (Sertifikat SHGB/SHM & PBG)', group: 'Legal' },
    { key: 'finance', label: 'Finance & Payment (Pembayaran, DP & KPR)', group: 'Finance' },
    { key: 'ga', label: 'General Affair (Site Office, Fleet & Aset)', group: 'GA' },
    { key: 'hr', label: 'Human Resources (SDM, Payroll, K3 & Shift)', group: 'HR' },
    { key: 'customer-relation', label: 'Customer Relation (Komplain & BAST Kunci)', group: 'CRM' },
    { key: 'procurement', label: 'Procurement (PO & E-Tendering Vendor)', group: 'Procurement' },
    { key: 'users', label: 'Super Admin - Manajemen Users & Audit Logs', group: 'Admin' }
  ];

  // Audit Logs
  const [auditLogs] = useState([
    { id: 1, user: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)', action: 'Pengaturan Daftar Pimpinan Resmi (Foto Profil Kosong Siap Upload)', time: 'Baru saja', ip: '192.168.1.34' }
  ]);

  // Handle Direct Local File Upload (JPG, PNG, WebP)
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
        showNotification('Foto profil baru berhasil diunggah!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setUserForm({
      name: '',
      email: '',
      address: '',
      role: 'Teknik Specialist',
      dept: 'Teknik',
      phone: '0812-9988-7700',
      status: 'Aktif',
      avatar: '',
      allowedModules: ['todo-attendance', 'teknik-rumah']
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (u) => {
    setSelectedUser(u);
    setUserForm({
      name: u.name,
      email: u.email,
      address: u.address || 'Kantor Operasional Ashoka Enterprise',
      role: u.role,
      dept: u.dept || 'Manajemen',
      phone: u.phone || '0812-3456-7890',
      status: u.status,
      avatar: u.avatar || '',
      allowedModules: u.allowedModules || ['todo-attendance']
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (u) => {
    setSelectedUser(u);
    setIsDetailModalOpen(true);
  };

  const handleDeleteConfirm = (u) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus profil user ${u.name} (${u.role}) dari sistem secara permanen?`)) {
      deleteUser(u.id);
    }
  };

  const handleResetToOfficialConfirm = () => {
    if (window.confirm('Reset daftar pengguna ke 6 Manajemen Resmi (Yazid Hizbullah & Adhi Himawan) dengan foto profil kosong?')) {
      resetToOfficialCompanyUsers();
    }
  };

  const toggleModuleSelection = (modKey) => {
    setUserForm((prev) => {
      const exists = prev.allowedModules.includes(modKey);
      if (exists) {
        return { ...prev, allowedModules: prev.allowedModules.filter((m) => m !== modKey) };
      } else {
        return { ...prev, allowedModules: [...prev.allowedModules, modKey] };
      }
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      alert('Mohon isi Nama dan Alamat Email!');
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

  const handleToggleStatus = (u) => {
    const nextStatus = u.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    updateUser(u.id, { status: nextStatus });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Hidden File Input for Device Upload */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*" 
        style={{ display: 'none' }}
        onChange={handlePhotoFileUpload}
      />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Super Admin - Manajemen User & Hak Akses Fitur</h1>
          <p className="page-subtitle">Daftar Manajemen & Direksi Resmi Ashoka. Upload foto profil manual & atur otorisasi modul.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline-danger" onClick={handleResetToOfficialConfirm} title="Reset ke Daftar 6 Manajemen Resmi (Foto Kosong)">
            <RefreshCw size={16} /> 🔄 Reset Daftar Resmi
          </button>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <UserPlus size={16} /> + Tambah Pengguna Baru
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="tab-list">
        <button
          className={`tab-item ${activeTab === 'user-list' ? 'active' : ''}`}
          onClick={() => setActiveTab('user-list')}
        >
          <Users size={16} style={{ display: 'inline', marginRight: '6px' }} /> Daftar Pimpinan & Manajer ({users.length})
        </button>
        <button
          className={`tab-item ${activeTab === 'audit-logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit-logs')}
        >
          <Activity size={16} style={{ display: 'inline', marginRight: '6px' }} /> Log Aktivitas Audit Trail
        </button>
      </div>

      {/* TAB 1: USER LIST WITH EMPTY PHOTOS READY FOR MANUAL UPLOAD */}
      {activeTab === 'user-list' && (
        <>
          {/* Filter Bar */}
          <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama, email, atau jabatan role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} color="var(--text-muted)" />
                <select
                  className="form-control"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ minWidth: '220px' }}
                >
                  <option value="All">Semua Role Jabatan</option>
                  <option value="Super Admin & Direktur Utama">Direktur Utama</option>
                  <option value="General Manager Operasional">General Manager</option>
                  <option value="Finance & Accounting Manager">Finance & Accounting Manager</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Operation Manager">Operation Manager</option>
                  <option value="Manager HR & Legal">Manager HR & Legal</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="glass-card" style={{ padding: '0.5rem' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Foto & Nama Pengguna</th>
                    <th>Email Login</th>
                    <th>Jabatan Role</th>
                    <th>Cakupan Fitur & Hak Akses</th>
                    <th>Status</th>
                    <th>Aksi Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const mods = u.allowedModules || ['todo-attendance'];
                    const avatarSrc = getAvatarUrl(u);
                    const isSuperAdmin = u.role.toLowerCase().includes('super admin');

                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div 
                              onClick={() => handleOpenEditModal(u)}
                              style={{ position: 'relative', cursor: 'pointer' }}
                              title="Klik untuk Upload Foto dari Komputer / HP"
                            >
                              <img src={avatarSrc} alt={u.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F59E0B', boxShadow: '0 0 10px rgba(245,158,11,0.3)' }} />
                              <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#F59E0B', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                                <Upload size={11} />
                              </div>
                            </div>
                            <div>
                              <div style={{ fontWeight: 800 }}>{u.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>ID: USER-00{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Mail size={13} color="#F59E0B" /> {u.email}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${isSuperAdmin ? 'badge-warning' : u.role.includes('General Manager') ? 'badge-info' : 'badge-success'}`}>
                            <ShieldCheck size={12} /> {u.role}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {isSuperAdmin ? (
                              <span className="badge badge-warning">⭐ Full All Features + User Control</span>
                            ) : u.role.includes('General Manager') ? (
                              <span className="badge badge-info">🌐 Full Semua Modul (Kecuali User Control)</span>
                            ) : (
                              <span className="badge badge-neutral">{mods.length} Modul Terakses</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${u.status === 'Aktif' ? 'badge-success' : 'badge-danger'}`}>
                            {u.status === 'Aktif' ? <CheckCircle size={12} /> : <UserX size={12} />} {u.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenDetailModal(u)} title="Detail Profil & Hak Akses">
                              <Eye size={14} /> Detail
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleOpenEditModal(u)} title="Upload Foto Manual & Edit Hak Akses">
                              <Upload size={14} /> Upload Foto & Edit
                            </button>
                            {!isSuperAdmin && (
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteConfirm(u)} title="Hapus User Profil Permanen">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'audit-logs' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Log Aktivitas Audit Trail Super Admin</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Akun Pengguna</th>
                  <th>Tindakan Perubahan Akses & Profil</th>
                  <th>Waktu Kejadian</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td><div style={{ fontWeight: 700 }}>{log.user}</div></td>
                    <td><div style={{ fontSize: '0.85rem' }}>{log.action}</div></td>
                    <td><span className="badge badge-info">{log.time}</span></td>
                    <td><code style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{log.ip}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / ADD USER & UPLOAD PHOTO MODAL */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Tambah Pengguna Baru & Upload Foto</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                {/* DIRECT LOCAL FILE UPLOAD BOX */}
                <div style={{ padding: '1.25rem', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <img src={getAvatarUrl(userForm)} alt="Preview" style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F59E0B', boxShadow: '0 0 20px rgba(245,158,11,0.4)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                      Foto Profil (Kosong - Siap Upload)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Klik tombol di bawah ini untuk memilih file foto langsung dari Galeri HP / Laptop Anda (Format JPG, PNG).
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 800 }}
                    >
                      <Upload size={16} /> 📁 Pilih Foto dari Laptop / HP
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap & Gelar</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      placeholder="Contoh: Yazid Hizbullah, S.E.,S.T"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Jabatan Utama</label>
                    <select
                      className="form-control"
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    >
                      <option value="Super Admin & Direktur Utama">Super Admin & Direktur Utama</option>
                      <option value="General Manager Operasional">General Manager Operasional</option>
                      <option value="Finance & Accounting Manager">Finance & Accounting Manager</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="Operation Manager">Operation Manager (Teknik & GA)</option>
                      <option value="Manager HR & Legal">Manager HR & Legal</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#F59E0B' }}>Alamat Email (Untuk Login)</label>
                    <input
                      type="email"
                      className="form-control"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="nama.user@ams.co.id"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor WhatsApp / HP</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      placeholder="0812-xxxx-xxxx"
                    />
                  </div>
                </div>

                {/* ALAMAT RUMAH DOMISILI FIELD */}
                <div className="form-group">
                  <label className="form-label" style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Home size={16} /> Alamat Rumah / Kantor Divisi
                  </label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={userForm.address}
                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    placeholder="Masukkan alamat rumah / kantor divisi..."
                  />
                </div>

                {/* MULTI-MODULE CHECKBOXES */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)' }}>
                    <Sparkles size={16} /> Centang Kombinasi Akses Modul yang Diizinkan:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'rgba(15,23,42,0.5)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', maxHeight: '140px', overflowY: 'auto' }}>
                    {availableModulesList.map((m) => {
                      const isChecked = userForm.allowedModules.includes(m.key);
                      return (
                        <div 
                          key={m.key}
                          onClick={() => toggleModuleSelection(m.key)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '6px',
                            background: isChecked ? 'rgba(99,102,241,0.15)' : 'transparent',
                            transition: 'background 0.2s'
                          }}
                        >
                          {isChecked ? <CheckSquare size={18} color="var(--accent-primary)" /> : <Square size={18} color="var(--text-muted)" />}
                          <span style={{ fontSize: '0.85rem', fontWeight: isChecked ? 700 : 500 }}>{m.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Pengguna Baru</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE / EDIT USER & UPLOAD PHOTO MODAL */}
      {isEditModalOpen && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Foto & Fitur Hak Akses ({selectedUser.name})</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                {/* DIRECT LOCAL FILE UPLOAD BOX */}
                <div style={{ padding: '1.25rem', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <img src={getAvatarUrl(userForm)} alt="Preview" style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F59E0B', boxShadow: '0 0 20px rgba(245,158,11,0.4)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                      Foto Profil User
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Klik tombol di bawah ini untuk memilih file foto langsung dari Galeri HP / Laptop Anda (Format JPG, PNG).
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 800 }}
                    >
                      <Upload size={16} /> 📁 Pilih Foto Baru dari Perangkat
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap & Gelar</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Jabatan Utama</label>
                    <select
                      className="form-control"
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    >
                      <option value="Super Admin & Direktur Utama">Super Admin & Direktur Utama</option>
                      <option value="General Manager Operasional">General Manager Operasional</option>
                      <option value="Finance & Accounting Manager">Finance & Accounting Manager</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="Operation Manager">Operation Manager (Teknik & GA)</option>
                      <option value="Manager HR & Legal">Manager HR & Legal</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#F59E0B' }}>Alamat Email (Login)</label>
                    <input
                      type="email"
                      className="form-control"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor WhatsApp / HP</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* EDIT ALAMAT RUMAH */}
                <div className="form-group">
                  <label className="form-label" style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Home size={16} /> Alamat Rumah / Kantor Divisi
                  </label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={userForm.address}
                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    placeholder="Masukkan alamat rumah / kantor..."
                  />
                </div>

                {/* MULTI-MODULE CHECKBOXES */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)' }}>
                    <Sparkles size={16} /> Centang Kombinasi Akses Modul yang Diizinkan:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'rgba(15,23,42,0.5)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', maxHeight: '140px', overflowY: 'auto' }}>
                    {availableModulesList.map((m) => {
                      const isChecked = userForm.allowedModules.includes(m.key);
                      return (
                        <div 
                          key={m.key}
                          onClick={() => toggleModuleSelection(m.key)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '6px',
                            background: isChecked ? 'rgba(99,102,241,0.15)' : 'transparent',
                            transition: 'background 0.2s'
                          }}
                        >
                          {isChecked ? <CheckSquare size={18} color="var(--accent-primary)" /> : <Square size={18} color="var(--text-muted)" />}
                          <span style={{ fontSize: '0.85rem', fontWeight: isChecked ? 700 : 500 }}>{m.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Perubahan Data & Foto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL USER PROFIL & FOTO MODAL */}
      {isDetailModalOpen && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Detail Profil & Otorisasi - {selectedUser.name}</h3>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img src={getAvatarUrl(selectedUser)} alt={selectedUser.name} style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #F59E0B', boxShadow: '0 0 25px rgba(245,158,11,0.4)', marginBottom: '0.75rem' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{selectedUser.name}</h2>
              <div style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: 800, marginBottom: '0.5rem' }}>{selectedUser.role}</div>
              
              <div style={{ textAlign: 'left', padding: '1rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#F59E0B', marginBottom: '4px' }}>Alamat Email Login:</div>
                <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.75rem' }}>{selectedUser.email}</div>
                
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#38BDF8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Home size={14} /> Lokasi Domisili:
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {selectedUser.address || 'Kantor Operasional Ashoka Enterprise'}
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-primary)', marginBottom: '4px' }}>Fitur & Modul Yang Diizinkan:</div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {selectedUser.allowedModules?.map(m => (
                    <span key={m} className="badge badge-info">{m}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => { setIsDetailModalOpen(false); handleOpenEditModal(selectedUser); }}>
                <Upload size={14} /> Upload Foto Baru User Ini
              </button>
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
