import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Check, 
  X, 
  FileText, 
  PieChart, 
  BarChart3, 
  Users, 
  Briefcase, 
  Sparkles, 
  Printer,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const ExecutiveModule = () => {
  const { currentUser, units, updateUnitProgress, executiveApprovals, setExecutiveApprovals, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals', 'kpi', 'roi', 'risks', 'expansion', 'bod-minutes'

  // Helper Check Role Can Approve (Only Manager, Director, Super Admin)
  const isManagerOrDirectorOrAdmin = () => {
    if (!currentUser) return false;
    const r = currentUser.role.toLowerCase();
    return r.includes('direktur') || r.includes('manager') || r.includes('admin') || r.includes('gm');
  };

  // Pilar 1: Corporate Target Performance KPIs
  const [corporateTargets] = useState({
    targetSalesYear: 15000000000, // Rp 15 Miliar
    actualSalesYear: 12800000000, // Rp 12.8 Miliar (85.3%)
    targetUnitsYear: 24,
    actualUnitsYear: units.filter(u => u.progress === 100).length || 20,
    grossProfitMargin: '34.2%',
    roiPercentage: '28.5% p.a'
  });

  // Pilar 6: BOD Meeting Minutes & Action Items
  const [bodMinutes] = useState([
    { id: 'BOD-M-01', date: '05 Agustus 2025', topic: 'Rapat Evaluasi S-Curve Proyek & Ekspansi Fase 3', decision: 'Direksi menyetujui percepatan pembebasan lahan 2 Ha untuk Cluster Ruby Fase 3.' },
    { id: 'BOD-M-02', date: '20 Juli 2025', topic: 'Penyertaan Modal KPR Bank Syariah BSI', decision: 'Penandatanganan PKS Mitra KPR BSI disetujui Direktur Utama.' }
  ]);

  const handleApproveDirector = (id) => {
    if (!isManagerOrDirectorOrAdmin()) {
      showNotification(`Akses Terbatas: Hanya Direktur Utama, Manager, atau Super Admin yang berhak memberikan ACC!`, 'danger');
      return;
    }
    
    setExecutiveApprovals(prev => prev.map(a => {
      if (a.id === id) {
        // Interconnection: If BATP for unit A-01 is approved, update unit progress to 100%
        if (a.unitNo && a.unitNo !== '-') {
          updateUnitProgress(a.unitNo, 100, 'Ready (Handover)');
        }
        return { ...a, status: 'APPROVED DIREKSI' };
      }
      return a;
    }));

    showNotification(`PERSETUJUAN DIREKSI SAH! Executive Approval ${id} disahkan oleh Direktur Utama. Terhubung ke Modul Teknik, Finance & CRM!`);
  };

  const handleRejectDirector = (id) => {
    if (!isManagerOrDirectorOrAdmin()) {
      showNotification(`Akses Terbatas: Hanya Direktur Utama, Manager, atau Super Admin yang berhak memberikan ACC/Penolakan!`, 'danger');
      return;
    }
    setExecutiveApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED DIREKSI' } : a));
    showNotification(`Permohonan ${id} ditolak oleh Direktur Utama untuk direvisi oleh Manager!`, 'warning');
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Manager & Board of Directors (BOD Executive Suite)</h1>
          <p className="page-subtitle">Pusat persetujuan keputusan Direksi (Executive Approval Hub terhubung 100%), performa KPI omzet, ROI finansial, & risalah rapat BOD.</p>
        </div>

        <button className="btn btn-primary" onClick={() => alert('Cetak Laporan Executive Summary Direksi')}>
          <Printer size={16} /> Cetak Laporan Summary BOD
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Realisasi Omzet Sales 2025</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{formatRupiah(corporateTargets.actualSalesYear)}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Return on Investment (ROI)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{corporateTargets.roiPercentage} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Profit</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Executive Approval</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>
              {executiveApprovals.filter(a => a.status.includes('Pending')).length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Berkas</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gross Profit Margin</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{corporateTargets.grossProfitMargin}</div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for 6 Executive Pillars */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'approvals' ? 'active' : ''}`} onClick={() => setActiveTab('approvals')}>
          <ShieldAlert size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Executive Approval Hub Direksi (Terhubung)
        </button>
        <button className={`tab-item ${activeTab === 'kpi' ? 'active' : ''}`} onClick={() => setActiveTab('kpi')}>
          <TrendingUp size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Target KPI & Performa Omzet
        </button>
        <button className={`tab-item ${activeTab === 'roi' ? 'active' : ''}`} onClick={() => setActiveTab('roi')}>
          <DollarSign size={16} style={{ display: 'inline', marginRight: '6px' }} /> 3. Financial Cashflow & ROI Profit
        </button>
        <button className={`tab-item ${activeTab === 'risks' ? 'active' : ''}`} onClick={() => setActiveTab('risks')}>
          <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 4. High-Level Risk & Audit Compliance
        </button>
        <button className={`tab-item ${activeTab === 'expansion' ? 'active' : ''}`} onClick={() => setActiveTab('expansion')}>
          <Building2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> 5. Rencana Ekspansi Proyek Masterplan
        </button>
        <button className={`tab-item ${activeTab === 'bod-minutes' ? 'active' : ''}`} onClick={() => setActiveTab('bod-minutes')}>
          <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} /> 6. Risalah Rapat BOD & Action Items
        </button>
      </div>

      {/* PILAR 2: EXECUTIVE APPROVAL HUB DIREKSI & MANAGER */}
      {activeTab === 'approvals' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Pusat Persetujuan Keputusan Direksi (Executive Approval Hub)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Validasi permohonan anggaran besar, tender lelang, & pencairan BATP oleh Direktur Utama. Terkoneksi ke Modul Teknik, Finance, & CRM.</p>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No ID & Pengajuan</th>
                  <th>Departemen Pemohon</th>
                  <th>Nominal Biaya (Rp)</th>
                  <th>Tingkat Urgensi</th>
                  <th>Status Approval Direksi</th>
                  <th>Aksi Decision Direktur</th>
                </tr>
              </thead>
              <tbody>
                {executiveApprovals.map((a) => {
                  const isApproved = a.status.includes('APPROVED');
                  const isRejected = a.status.includes('REJECTED');

                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{a.title}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{a.id} &bull; Pemohon: {a.requestedBy} &bull; {a.date}</div>
                      </td>
                      <td><span className="badge badge-info">{a.department}</span></td>
                      <td><div style={{ fontWeight: 800 }}>{formatRupiah(a.amount)}</div></td>
                      <td>
                        <span className={`badge ${a.urgency.includes('HIGH') ? 'badge-danger' : 'badge-warning'}`}>
                          {a.urgency}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isApproved ? 'badge-success' : isRejected ? 'badge-danger' : 'badge-warning'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {!isApproved && !isRejected ? (
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => handleApproveDirector(a.id)}>
                              <Check size={13} /> ACC Direktur
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleRejectDirector(a.id)}>
                              <X size={13} /> Tolak
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700 }}>✓ Decision Final (Saling Terhubung)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 1: TARGET KPI & PERFORMA OMZET */}
      {activeTab === 'kpi' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Pencapaian Target KPI Korporat 2025</h3>
          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 700 }}>TARGET OMZET SALES PERUSAHAAN (2025)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, margin: '4px 0' }}>
                {formatRupiah(corporateTargets.actualSalesYear)} / {formatRupiah(corporateTargets.targetSalesYear)}
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ width: '85.3%', height: '100%', background: '#F59E0B' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Tercapai 85.3% dari Target Tahunan</div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700 }}>TARGET PENJUALAN UNIT RUMAH (INTERCONNECTED)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, margin: '4px 0' }}>
                {corporateTargets.actualUnitsYear} / {corporateTargets.targetUnitsYear} Unit Rumah
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ width: '83.3%', height: '100%', background: '#10B981' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Tercapai 83.3% dari Target Penjualan</div>
            </div>
          </div>
        </div>
      )}

      {/* PILAR 3: FINANCIAL ROI PROFIT */}
      {activeTab === 'roi' && (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <DollarSign size={48} color="#10B981" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Proyeksi Cashflow & Gross Profit Margin (ROI {corporateTargets.roiPercentage})</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
            Analisis margin keuntungan bersih per cluster perumahan & proyeksi imbal hasil investasi (ROI).
          </p>
          <button className="btn btn-primary" onClick={() => alert('Laporan Financial ROI & Laba Rugi Valid!')}>
            <TrendingUp size={16} /> Buka Laporan Proyeksi Laba Rugi
          </button>
        </div>
      )}

      {/* PILAR 6: BOD MINUTES & ACTION ITEMS */}
      {activeTab === 'bod-minutes' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Risalah Rapat Direksi (Board of Directors Minutes) & Komitmen Action Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {bodMinutes.map((m) => (
              <div key={m.id} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{m.topic}</div>
                  <span className="badge badge-info">{m.date}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{m.decision}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
