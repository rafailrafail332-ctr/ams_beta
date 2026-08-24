import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert, 
  Filter,
  Building2,
  PieChart,
  Plus,
  Edit3,
  Trash2,
  X
} from 'lucide-react';

export const CostOverrunInspector = () => {
  const { showNotification } = useApp();
  const [filterCluster, setFilterCluster] = useState('All');

  // Initial RAB vs Realized Data
  const initialBudgetItems = [
    { id: 'RAB-A01', unitNo: 'A-01', cluster: 'Cluster Emerald', contractor: 'PT Bangun Jaya Perdana', rabBudget: 420000000, actualSpent: 415000000, status: 'Efisien (Under Budget)' },
    { id: 'RAB-A02', unitNo: 'A-02', cluster: 'Cluster Emerald', contractor: 'PT Bangun Jaya Perdana', rabBudget: 420000000, actualSpent: 438000000, status: 'Cost Overrun Alert (+Rp 18 Jt Exceeded)' },
    { id: 'RAB-B05', unitNo: 'B-05', cluster: 'Cluster Sapphire', contractor: 'CV Karya Mandiri Teknik', rabBudget: 580000000, actualSpent: 570000000, status: 'Efisien (Under Budget)' },
    { id: 'RAB-B06', unitNo: 'B-06', cluster: 'Cluster Sapphire', contractor: 'CV Karya Mandiri Teknik', rabBudget: 580000000, actualSpent: 580000000, status: 'On Budget (Sesuai RAB)' }
  ];

  const getSavedItems = () => {
    try {
      const saved = localStorage.getItem('ams_cost_overrun_items_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialBudgetItems;
  };

  const [budgetItems, setBudgetItems] = useState(getSavedItems);

  useEffect(() => {
    try {
      localStorage.setItem('ams_cost_overrun_items_v1', JSON.stringify(budgetItems));
    } catch (e) {}
  }, [budgetItems]);

  // Modal State for Add / Edit RAB Item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    unitNo: 'A-03',
    cluster: 'Cluster Emerald',
    contractor: 'PT Bangun Jaya Perdana',
    rabBudget: 420000000,
    actualSpent: 420000000
  });

  const filteredItems = budgetItems.filter((b) => filterCluster === 'All' || b.cluster === filterCluster);

  const totalRab = budgetItems.reduce((acc, c) => acc + (c.rabBudget || 0), 0);
  const totalSpent = budgetItems.reduce((acc, c) => acc + (c.actualSpent || 0), 0);
  const variance = totalSpent - totalRab;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // CRUD Handlers
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      unitNo: '',
      cluster: 'Cluster Emerald',
      contractor: 'PT Bangun Jaya Perdana',
      rabBudget: 420000000,
      actualSpent: 420000000
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      unitNo: item.unitNo,
      cluster: item.cluster,
      contractor: item.contractor,
      rabBudget: item.rabBudget,
      actualSpent: item.actualSpent
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const rab = Number(formData.rabBudget);
    const spent = Number(formData.actualSpent);
    const diff = spent - rab;

    let statusText = 'On Budget (Sesuai RAB)';
    if (diff > 0) statusText = `Cost Overrun Alert (+Rp ${new Intl.NumberFormat('id-ID').format(diff)} Exceeded)`;
    else if (diff < 0) statusText = `Efisien (Under Budget Rp ${new Intl.NumberFormat('id-ID').format(Math.abs(diff))})`;

    const payload = {
      ...formData,
      rabBudget: rab,
      actualSpent: spent,
      status: statusText
    };

    if (editingItem) {
      setBudgetItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...payload } : i));
      if (showNotification) showNotification(`ITEM RAB & OVERRUN DIPERBARUI! Data RAB Unit ${formData.unitNo} berhasil disimpan.`);
    } else {
      const newItem = {
        id: `RAB-${Date.now().toString().slice(-4)}`,
        ...payload
      };
      setBudgetItems(prev => [newItem, ...prev]);
      if (showNotification) showNotification(`ITEM RAB BARU DITAMBAHKAN! Data RAB Unit ${formData.unitNo} masuk ke Overrun Inspector.`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, unitNo) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data RAB Unit ${unitNo}?`)) {
      setBudgetItems(prev => prev.filter(i => i.id !== id));
      if (showNotification) showNotification(`ITEM RAB DIHAPUS! Data Unit ${unitNo} berhasil dihapus dari Overrun Inspector.`, 'warning');
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign color="#F59E0B" size={22} /> Monitoring RAB vs Realisasi Cost Overrun Kontraktor
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Deteksi pembengkakan biaya (Cost Overrun) kontraktor dibanding Rencana Anggaran Biaya (RAB) awal. (Akses CRUD Lengkap Management)</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select 
            className="form-control" 
            value={filterCluster}
            onChange={(e) => setFilterCluster(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="All">Semua Cluster Perumahan</option>
            <option value="Cluster Emerald">Cluster Emerald</option>
            <option value="Cluster Sapphire">Cluster Sapphire</option>
          </select>

          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            <Plus size={14} /> Input Item RAB Baru
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 700 }}>Total Rencana Anggaran (RAB Awal)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{formatRupiah(totalRab)}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Baseline Standar Konstruksi</div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Realisasi Pencairan BATP Kontraktor</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{formatRupiah(totalSpent)}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Biaya Fisik Terbayar</div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: variance > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${variance > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` }}>
          <div style={{ fontSize: '0.78rem', color: variance > 0 ? '#ef4444' : '#10B981', fontWeight: 700 }}>
            {variance > 0 ? 'Cost Overrun (Pembengkakan Biaya)' : 'Efisiensi Anggaran (Surplus)'}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: variance > 0 ? '#ef4444' : '#10B981' }}>
            {variance > 0 ? `+${formatRupiah(variance)}` : formatRupiah(variance)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {variance > 0 ? '⚠️ Memerlukan Audit Ulang Kontraktor' : '✓ Penggunaan Anggaran Efisien'}
          </div>
        </div>
      </div>

      {/* Main Budget Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Kavling Unit & Cluster</th>
              <th>Kontraktor Pelaksana</th>
              <th>Target RAB Awal (Rp)</th>
              <th>Realisasi BATP (Rp)</th>
              <th>Selisih (Variance)</th>
              <th>Status Overrun Inspector</th>
              <th>Aksi CRUD</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const itemDiff = item.actualSpent - item.rabBudget;
              const isOver = itemDiff > 0;

              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {item.unitNo}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{item.cluster}</div>
                  </td>
                  <td>{item.contractor}</td>
                  <td><div style={{ fontWeight: 700 }}>{formatRupiah(item.rabBudget)}</div></td>
                  <td><div style={{ fontWeight: 700 }}>{formatRupiah(item.actualSpent)}</div></td>
                  <td>
                    <div style={{ fontWeight: 800, color: isOver ? '#ef4444' : '#10B981' }}>
                      {isOver ? `+${formatRupiah(itemDiff)}` : formatRupiah(itemDiff)}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${isOver ? 'badge-danger' : 'badge-success'}`}>
                      {isOver ? <ShieldAlert size={12} /> : <CheckCircle2 size={12} />} {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(item)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>
                        <Edit3 size={13} /> Edit
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(item.id, item.unitNo)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}>
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

      {/* MODAL: TAMBAH / EDIT ITEM RAB OVERRUN */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? `Edit Data RAB - Unit ${editingItem.unitNo}` : 'Input Item RAB Kontraktor Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor Kavling Unit</label>
                    <input type="text" className="form-control" placeholder="Contoh: A-03" value={formData.unitNo} onChange={(e) => setFormData({ ...formData, unitNo: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cluster Perumahan</label>
                    <select className="form-control" value={formData.cluster} onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}>
                      <option value="Cluster Emerald">Cluster Emerald</option>
                      <option value="Cluster Sapphire">Cluster Sapphire</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Kontraktor Pelaksana</label>
                  <select className="form-control" value={formData.contractor} onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}>
                    <option value="PT Bangun Jaya Perdana">PT Bangun Jaya Perdana</option>
                    <option value="CV Karya Mandiri Teknik">CV Karya Mandiri Teknik</option>
                    <option value="PT Cipta Karya Utama">PT Cipta Karya Utama</option>
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Target RAB Awal (Rp)</label>
                    <input type="number" className="form-control" value={formData.rabBudget} onChange={(e) => setFormData({ ...formData, rabBudget: Number(e.target.value) })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Realisasi BATP Terbayar (Rp)</label>
                    <input type="number" className="form-control" value={formData.actualSpent} onChange={(e) => setFormData({ ...formData, actualSpent: Number(e.target.value) })} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Item RAB</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
