import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Plus,
  Building,
  Calendar,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Receipt,
  Paperclip
} from 'lucide-react';
import { getFundRequests, deleteFundRequest } from '../services/financeService';
import { TransferProofModal } from './TransferProofModal';

export const FundRequestTrackerModal = ({
  isOpen,
  onClose,
  originModule = 'marketing',
  originModuleName = 'Marketing & Sales',
  onOpenNewRequest
}) => {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedProofItem, setSelectedProofItem] = useState(null);

  // Load and subscribe to real-time finance updates
  useEffect(() => {
    if (!isOpen) return;

    const loadData = () => {
      const all = getFundRequests();
      const target = (originModule || '').toLowerCase();
      const filtered = all.filter((r) => {
        if (!r.originModule) return false;
        const o = r.originModule.toLowerCase();
        if (o === target) return true;
        if (target === 'hr-ga' && (o === 'hr' || o === 'ga' || o === 'hr-ga')) return true;
        if (target === 'teknik' && (o === 'teknik' || o === 'batp')) return true;
        return false;
      });
      setRequests(filtered);
    };

    loadData();

    const handleFinanceEvent = () => loadData();
    window.addEventListener('ams-finance-data-changed', handleFinanceEvent);
    return () => window.removeEventListener('ams-finance-data-changed', handleFinanceEvent);
  }, [isOpen, originModule]);

  if (!isOpen) return null;

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(num) || 0);
  };

  // Metrics
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'Menunggu Review').length;
  const approvedCount = requests.filter((r) => r.status === 'Disetujui').length;
  const disbursedCount = requests.filter((r) => r.status === 'Dicairkan').length;
  const rejectedCount = requests.filter((r) => r.status === 'Ditolak').length;

  const totalAmount = requests.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
  const disbursedAmount = requests
    .filter((r) => r.status === 'Dicairkan')
    .reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

  // Filtered list
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.id && r.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.project && r.project.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.requester && r.requester.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (item) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin membatalkan pengajuan ${item.id} (${item.title}) sebesar ${formatRupiah(item.amount)}?`
    );
    if (!confirmed) return;

    deleteFundRequest(item.id, `Pemohon ${originModuleName}`);
    setRequests((prev) => prev.filter((r) => r.id !== item.id));
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(5, 8, 15, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 99990,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}
      >
        <div
          className="glass-card"
          style={{
            background: 'linear-gradient(145deg, #0b1120 0%, #060a14 100%)',
            border: '1.5px solid #1e293b',
            borderRadius: '18px',
            maxWidth: '1000px',
            width: '100%',
            height: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 30px rgba(56, 189, 248, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.65)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Pelacakan & Status Pengajuan Dana
                  </h2>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    {originModuleName}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                  Pantau posisi persetujuan, catatan verifikasi, hingga struk bukti transfer resmi dari Finance.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {onOpenNewRequest && (
                <button
                  type="button"
                  onClick={onOpenNewRequest}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    border: '1.5px solid #38bdf8',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <Plus size={15} /> + Ajukan Dana Baru
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS STRIP */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '12px',
              padding: '1rem 1.75rem',
              background: 'rgba(11, 17, 32, 0.5)',
              borderBottom: '1px solid #1e293b'
            }}
          >
            {/* Total */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '10px',
                padding: '10px 14px'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Total Pengajuan</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                {totalCount}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>berkas</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '2px' }}>{formatRupiah(totalAmount)}</div>
            </div>

            {/* Menunggu Review */}
            <div
              style={{
                background: 'rgba(234, 179, 8, 0.07)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: '10px',
                padding: '10px 14px'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={13} /> Menunggu Review
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fef08a', marginTop: '2px' }}>
                {pendingCount}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#ca8a04' }}>antrean</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#facc15', marginTop: '2px' }}>Sedang Ditinjau Finance</div>
            </div>

            {/* Disetujui */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.07)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '10px',
                padding: '10px 14px'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={13} /> Disetujui
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#bae6fd', marginTop: '2px' }}>
                {approvedCount}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#0284c7' }}>berkas</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '2px' }}>Siap Dijadwalkan Cair</div>
            </div>

            {/* Telah Dicairkan */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.07)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '10px 14px'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={13} /> Telah Dicairkan
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a7f3d0', marginTop: '2px' }}>
                {disbursedCount}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#059669' }}>berkas</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '2px' }}>{formatRupiah(disbursedAmount)}</div>
            </div>

            {/* Ditolak */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.07)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '10px 14px'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <XCircle size={13} /> Ditolak / Revisi
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fecaca', marginTop: '2px' }}>
                {rejectedCount}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#dc2626' }}>berkas</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '2px' }}>Perlu Revisi / Ditolak</div>
            </div>
          </div>

          {/* FILTER & SEARCH BAR */}
          <div
            style={{
              padding: '0.85rem 1.75rem',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #1e293b'
            }}
          >
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <Search
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID, keperluan, proyek, nama pemohon..."
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px 8px 36px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {[
                { key: 'ALL', label: `Semua (${requests.length})` },
                { key: 'Menunggu Review', label: `Menunggu (${pendingCount})` },
                { key: 'Disetujui', label: `Disetujui (${approvedCount})` },
                { key: 'Dicairkan', label: `Dicairkan (${disbursedCount})` },
                { key: 'Ditolak', label: `Ditolak (${rejectedCount})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: statusFilter === tab.key ? '1px solid #38bdf8' : '1px solid #334155',
                    background: statusFilter === tab.key ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
                    color: statusFilter === tab.key ? '#38bdf8' : '#94a3b8'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* LIST / TABLE BODY */}
          <div style={{ flex: '1', overflowY: 'auto', padding: '1rem 1.75rem' }}>
            {filteredRequests.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: '#64748b',
                  background: 'rgba(15, 23, 42, 0.4)',
                  borderRadius: '12px',
                  border: '1px dashed #334155'
                }}
              >
                <FileText size={42} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
                <h4 style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0' }}>
                  Tidak ada pengajuan dana yang cocok
                </h4>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>
                  {searchQuery || statusFilter !== 'ALL'
                    ? 'Coba sesuaikan kata kunci pencarian atau ganti filter status.'
                    : `Belum ada riwayat permohonan dana dari tim ${originModuleName}. Klik tombol "+ Ajukan Dana Baru" di atas untuk mengirim permohonan ke Finance.`}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredRequests.map((item) => {
                  const isExpanded = expandedId === item.id;

                  // Render badge helpers
                  const getStatusBadge = (status) => {
                    switch (status) {
                      case 'Menunggu Review':
                        return (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: 'rgba(234, 179, 8, 0.15)',
                              color: '#facc15',
                              border: '1px solid rgba(234, 179, 8, 0.35)'
                            }}
                          >
                            <Clock size={12} /> Menunggu Review
                          </span>
                        );
                      case 'Disetujui':
                        return (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38bdf8',
                              border: '1px solid rgba(56, 189, 248, 0.35)'
                            }}
                          >
                            <ShieldCheck size={12} /> Disetujui (Siap Cair)
                          </span>
                        );
                      case 'Dicairkan':
                        return (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: 'rgba(16, 185, 129, 0.18)',
                              color: '#34d399',
                              border: '1px solid rgba(16, 185, 129, 0.4)'
                            }}
                          >
                            <CheckCircle2 size={12} /> Telah Dicairkan
                          </span>
                        );
                      case 'Ditolak':
                        return (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.35)'
                            }}
                          >
                            <XCircle size={12} /> Ditolak
                          </span>
                        );
                      default:
                        return <span>{status}</span>;
                    }
                  };

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.65)',
                        border: isExpanded ? '1.5px solid #38bdf8' : '1px solid #1e293b',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* CARD ROW HEADER */}
                      <div
                        style={{
                          padding: '1rem 1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          flexWrap: 'wrap',
                          cursor: 'pointer'
                        }}
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      >
                        {/* Left: Info */}
                        <div style={{ flex: '1', minWidth: '260px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                color: '#38bdf8',
                                background: 'rgba(56, 189, 248, 0.1)',
                                padding: '2px 7px',
                                borderRadius: '5px',
                                border: '1px solid rgba(56, 189, 248, 0.25)'
                              }}
                            >
                              {item.id}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} /> {item.requestDate}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: '#cbd5e1',
                                background: '#1e293b',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              {item.project || 'Umum'}
                            </span>
                            {item.priority === 'Mendesak' && (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  color: '#ef4444',
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(239, 68, 68, 0.3)'
                                }}
                              >
                                MENDESAK
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.4 }}>
                            {item.title}
                          </div>

                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={12} /> Diajukan oleh: <strong style={{ color: '#cbd5e1' }}>{item.requester}</strong>
                            <span style={{ color: '#475569' }}>|</span>
                            <span>Kategori: {item.category}</span>
                          </div>
                        </div>

                        {/* Middle: Amount */}
                        <div style={{ textAlign: 'right', minWidth: '150px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Nominal Permohonan</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
                            {formatRupiah(item.amount)}
                          </div>
                        </div>

                        {/* Right: Status & Actions */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {getStatusBadge(item.status)}

                          {item.status === 'Dicairkan' && (
                            <button
                              type="button"
                              onClick={() => setSelectedProofItem(item)}
                              style={{
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                border: '1px solid #10b981',
                                color: '#ffffff',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '6px 10px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                              }}
                              title="Lihat struk bukti transfer dan pencairan kas"
                            >
                              <Receipt size={13} /> Bukti Transfer
                            </button>
                          )}

                          {item.status === 'Menunggu Review' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#ef4444',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.72rem'
                              }}
                              title="Batalkan pengajuan ini jika ada kesalahan"
                            >
                              <Trash2 size={13} /> Batalkan
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* EXPANDABLE DETAIL & STEPPER TRACKER */}
                      {isExpanded && (
                        <div
                          style={{
                            padding: '1.25rem',
                            borderTop: '1px solid #1e293b',
                            background: '#090e1a'
                          }}
                        >
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ArrowRight size={14} color="#38bdf8" /> Alur & Verifikasi Pengajuan Dana:
                          </div>

                          {/* 3-STEP TIMELINE TRACKER */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                              gap: '12px',
                              marginBottom: '1rem'
                            }}
                          >
                            {/* Step 1: Pengajuan Dibuat */}
                            <div
                              style={{
                                background: 'rgba(30, 41, 59, 0.4)',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                padding: '10px 12px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                <div
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: '#10b981',
                                    color: '#ffffff',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  1
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>
                                  Pengajuan Terkirim
                                </span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                Tgl: <strong style={{ color: '#e2e8f0' }}>{item.requestDate}</strong>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                Pemohon: <span style={{ color: '#cbd5e1' }}>{item.requester}</span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                Akun COA: <span style={{ color: '#38bdf8' }}>{item.accountCode || '-'}</span>
                              </div>
                            </div>

                            {/* Step 2: Approval Finance */}
                            <div
                              style={{
                                background:
                                  item.status === 'Disetujui' || item.status === 'Dicairkan'
                                    ? 'rgba(56, 189, 248, 0.08)'
                                    : item.status === 'Ditolak'
                                    ? 'rgba(239, 68, 68, 0.08)'
                                    : 'rgba(30, 41, 59, 0.4)',
                                border:
                                  item.status === 'Disetujui' || item.status === 'Dicairkan'
                                    ? '1px solid rgba(56, 189, 248, 0.4)'
                                    : item.status === 'Ditolak'
                                    ? '1px solid rgba(239, 68, 68, 0.4)'
                                    : '1px solid #334155',
                                borderRadius: '8px',
                                padding: '10px 12px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                <div
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background:
                                      item.status === 'Disetujui' || item.status === 'Dicairkan'
                                        ? '#0284c7'
                                        : item.status === 'Ditolak'
                                        ? '#ef4444'
                                        : '#ca8a04',
                                    color: '#ffffff',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  2
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>
                                  Review Finance
                                </span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                Status:{' '}
                                <strong
                                  style={{
                                    color:
                                      item.status === 'Disetujui' || item.status === 'Dicairkan'
                                        ? '#38bdf8'
                                        : item.status === 'Ditolak'
                                        ? '#f87171'
                                        : '#facc15'
                                  }}
                                >
                                  {item.status === 'Menunggu Review' ? 'Dalam Proses Review' : item.status}
                                </strong>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                Pejabat:{' '}
                                <span style={{ color: '#cbd5e1' }}>
                                  {item.approvedBy || (item.status === 'Menunggu Review' ? 'Menunggu Penugasan' : '-')}
                                </span>
                              </div>
                              {item.approvedAt && (
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                  Disetujui:{' '}
                                  <span style={{ color: '#a7f3d0' }}>{item.approvedAt}</span>
                                </div>
                              )}
                            </div>

                            {/* Step 3: Pencairan Bank */}
                            <div
                              style={{
                                background:
                                  item.status === 'Dicairkan'
                                    ? 'rgba(16, 185, 129, 0.08)'
                                    : 'rgba(30, 41, 59, 0.4)',
                                border:
                                  item.status === 'Dicairkan'
                                    ? '1px solid rgba(16, 185, 129, 0.4)'
                                    : '1px solid #334155',
                                borderRadius: '8px',
                                padding: '10px 12px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                <div
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: item.status === 'Dicairkan' ? '#10b981' : '#475569',
                                    color: '#ffffff',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  3
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>
                                  Pencairan Kas / Bank
                                </span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                Sumber:{' '}
                                <strong style={{ color: item.disbursedBankName ? '#34d399' : '#64748b' }}>
                                  {item.disbursedBankName || (item.status === 'Dicairkan' ? 'Kas Operasional' : 'Belum Dicairkan')}
                                </strong>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                Ref BKK:{' '}
                                <span style={{ color: '#38bdf8' }}>{item.disbursedRef || '-'}</span>
                              </div>
                              {item.disbursedAt && (
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                  Tgl Transfer:{' '}
                                  <span style={{ color: '#34d399' }}>{item.disbursedAt}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Catatan / Keterangan Penolakan / Catatan Pemohon */}
                          {item.notes && (
                            <div
                              style={{
                                background: '#0f172a',
                                border: '1px solid #1e293b',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                fontSize: '0.76rem',
                                color: '#94a3b8',
                                marginBottom: '10px'
                              }}
                            >
                              <strong style={{ color: '#cbd5e1' }}>Catatan / Deskripsi Keperluan:</strong> {item.notes}
                            </div>
                          )}

                          {/* Berkas Lampiran Pendukung */}
                          {item.attachments && item.attachments.length > 0 && (
                            <div
                              style={{
                                background: '#0f172a',
                                border: '1px solid #1e293b',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                marginBottom: '10px'
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  color: '#38bdf8',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  marginBottom: '8px'
                                }}
                              >
                                <Paperclip size={14} /> Berkas Lampiran Pendukung ({item.attachments.length}):
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {item.attachments.map((att, idx) => (
                                  <a
                                    key={idx}
                                    href={att.dataUrl || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    download={att.name || `lampiran_${idx + 1}`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      background: '#090e1a',
                                      border: '1px solid #334155',
                                      borderRadius: '6px',
                                      padding: '6px 10px',
                                      fontSize: '0.74rem',
                                      color: '#e2e8f0',
                                      textDecoration: 'none',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <FileText size={13} color="#38bdf8" />
                                    <span>{att.name}</span>
                                    {att.size && <span style={{ color: '#64748b', fontSize: '0.68rem' }}>({att.size})</span>}
                                    <ExternalLink size={12} color="#94a3b8" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.status === 'Ditolak' && (
                            <div
                              style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                fontSize: '0.76rem',
                                color: '#fca5a5',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '10px'
                              }}
                            >
                              <AlertTriangle size={16} color="#ef4444" />
                              <div>
                                <strong>Catatan Penolakan dari Finance:</strong>{' '}
                                {item.rejectionReason ||
                                  'Anggaran belum disetujui atau dokumen lampiran pendukung belum memadai. Silakan koordinasi dengan Finance & Accounting.'}
                              </div>
                            </div>
                          )}

                          {/* Bottom Action inside detail */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                            {item.status === 'Dicairkan' && (
                              <button
                                type="button"
                                onClick={() => setSelectedProofItem(item)}
                                style={{
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  border: '1px solid #34d399',
                                  color: '#ffffff',
                                  padding: '7px 14px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  cursor: 'pointer'
                                }}
                              >
                                <Receipt size={14} /> Cetak / Lihat Struk Bukti Transfer Resmi
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div
            style={{
              padding: '1rem 1.75rem',
              borderTop: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.7)'
            }}
          >
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Sinkronisasi data otomatis dengan modul Finance & Accounting (AMS Central Hub).
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#e2e8f0',
                padding: '7px 16px',
                borderRadius: '7px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* POPUP BUKTI TRANSFER RESMI */}
      {selectedProofItem && (
        <TransferProofModal
          isOpen={!!selectedProofItem}
          onClose={() => setSelectedProofItem(null)}
          item={selectedProofItem}
        />
      )}
    </>
  );
};
