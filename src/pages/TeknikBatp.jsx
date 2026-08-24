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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Daftar Pengajuan Termin BATP Kontraktor</h3>
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
              {batpList.map((b) => (
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
      </div>
    </div>
  );
};
