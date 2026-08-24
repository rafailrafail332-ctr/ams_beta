import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CostOverrunInspector } from '../components/CostOverrunInspector';
import { 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  FileText, 
  DollarSign, 
  Building2, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';

export const TeknikBatp = () => {
  const { showNotification } = useApp();
  const [searchBatp, setSearchBatp] = useState('');

  const [batpList, setBatpList] = useState([
    {
      id: 'BATP-2025-01',
      unitNo: 'A-01',
      cluster: 'Cluster Emerald',
      contractor: 'PT Bangun Jaya Perdana',
      progress: 100,
      terminAmount: 185000000,
      qcScore: '98% Lolos QC',
      status: 'Approved Finance',
      submitDate: '2025-07-28',
      approvalDate: '2025-08-01'
    },
    {
      id: 'BATP-2025-02',
      unitNo: 'A-02',
      cluster: 'Cluster Emerald',
      contractor: 'PT Bangun Jaya Perdana',
      progress: 75,
      terminAmount: 125000000,
      qcScore: '92% Perlu Touch Up',
      status: 'Pending Verification Teknik',
      submitDate: '2025-08-05',
      approvalDate: '-'
    },
    {
      id: 'BATP-2025-03',
      unitNo: 'B-05',
      cluster: 'Cluster Sapphire',
      contractor: 'CV Karya Mandiri Teknik',
      progress: 40,
      terminAmount: 95000000,
      qcScore: '88% Standar QC',
      status: 'In Review Finance',
      submitDate: '2025-08-02',
      approvalDate: '-'
    }
  ]);

  const filteredBatpList = batpList.filter((b) => {
    if (!searchBatp) return true;
    const q = searchBatp.toLowerCase().trim();
    return (
      (b.id || '').toLowerCase().includes(q) ||
      (b.unitNo || '').toLowerCase().includes(q) ||
      (b.cluster || '').toLowerCase().includes(q) ||
      (b.contractor || '').toLowerCase().includes(q) ||
      (b.status || '').toLowerCase().includes(q) ||
      (b.qcScore || '').toLowerCase().includes(q) ||
      b.terminAmount?.toString().includes(q)
    );
  });

  const handleApproveTeknik = (id) => {
    setBatpList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'In Review Finance', approvalDate: new Date().toISOString().split('T')[0] } : b))
    );
    showNotification(`Verifikasi Teknik BATP ${id} disetujui! Berkas diteruskan ke Finance.`);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Teknik - Berita Acara Serah Terima Pekerjaan (BATP)</h1>
          <p className="page-subtitle">Verifikasi hasil pengerjaan kontraktor 100% fisik, checklist QC, & pencairan termin BATP.</p>
        </div>
      </div>

      {/* FEATURE 3: COST OVERRUN INSPECTOR */}
      <CostOverrunInspector />

      {/* BATP Verification Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daftar Pengajuan Termin BATP Kontraktor</h3>
        </div>

        {/* Search Bar BATP */}
        <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={16} color="var(--accent-primary)" />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
              placeholder="Cari no BATP, unit kavling (A-01), cluster, nama kontraktor, status..."
              value={searchBatp}
              onChange={(e) => setSearchBatp(e.target.value)}
            />
            {searchBatp && (
              <button onClick={() => setSearchBatp('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredBatpList.length}</span> dari {batpList.length} Pengajuan BATP
          </div>
        </div>

        {filteredBatpList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <FileCheck size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada pengajuan BATP yang sesuai</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
            <button className="btn btn-secondary btn-sm" onClick={() => setSearchBatp('')} style={{ marginTop: '0.75rem' }}>
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No BATP & Unit</th>
                  <th>Kontraktor Pelaksana</th>
                  <th>Progress Fisik Realita</th>
                  <th>Nilai Termin BATP (Rp)</th>
                  <th>Status QC Kelayakan</th>
                  <th>Status Verifikasi Teknik</th>
                  <th>Aksi Teknik</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatpList.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{b.id}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Unit {b.unitNo} &bull; {b.cluster}</div>
                    </td>
                    <td>{b.contractor}</td>
                    <td>
                      <div style={{ fontWeight: 800, color: b.progress === 100 ? 'var(--success)' : 'var(--accent-primary)' }}>{b.progress}%</div>
                    </td>
                    <td><div style={{ fontWeight: 800 }}>{formatRupiah(b.terminAmount)}</div></td>
                    <td><span className="badge badge-success">{b.qcScore}</span></td>
                    <td>
                      <span className={`badge ${b.status.includes('Approved') ? 'badge-success' : 'badge-warning'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status.includes('Pending') ? (
                        <button className="btn btn-primary btn-sm" onClick={() => handleApproveTeknik(b.id)}>
                          <CheckCircle2 size={13} /> Verifikasi ACC Teknik
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Selesai Verifikasi</span>
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
  );
};
