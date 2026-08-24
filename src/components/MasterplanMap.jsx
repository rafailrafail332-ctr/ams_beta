import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  X, 
  User, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';

export const MasterplanMap = ({ onSelectUnit }) => {
  const { units } = useApp();
  const [selectedKavling, setSelectedKavling] = useState(null);
  const [filterCluster, setFilterCluster] = useState('All');

  // Extended Siteplan Kavling Units Map Data
  const siteplanGrid = [
    // Cluster Emerald Row A
    { unitNo: 'A-01', cluster: 'Cluster Emerald', x: 40, y: 50, status: 'Sold', progress: 100, owner: 'Budi Santoso', price: 'Rp 650 Jt' },
    { unitNo: 'A-02', cluster: 'Cluster Emerald', x: 140, y: 50, status: 'Booking', progress: 75, owner: 'Siti Rahmawati', price: 'Rp 670 Jt' },
    { unitNo: 'A-03', cluster: 'Cluster Emerald', x: 240, y: 50, status: 'Construction', progress: 60, owner: 'Eko Prasetyo', price: 'Rp 650 Jt' },
    { unitNo: 'A-04', cluster: 'Cluster Emerald', x: 340, y: 50, status: 'Available', progress: 0, owner: '-', price: 'Rp 660 Jt' },
    { unitNo: 'A-05', cluster: 'Cluster Emerald', x: 440, y: 50, status: 'Available', progress: 0, owner: '-', price: 'Rp 660 Jt' },

    // Cluster Emerald Row A (South)
    { unitNo: 'A-06', cluster: 'Cluster Emerald', x: 40, y: 150, status: 'Sold', progress: 100, owner: 'Rian Perdana', price: 'Rp 650 Jt' },
    { unitNo: 'A-07', cluster: 'Cluster Emerald', x: 140, y: 150, status: 'Construction', progress: 45, owner: 'Agus Wijaya', price: 'Rp 650 Jt' },
    { unitNo: 'A-08', cluster: 'Cluster Emerald', x: 240, y: 150, status: 'Booking', progress: 30, owner: 'Maya Indah', price: 'Rp 670 Jt' },
    { unitNo: 'A-09', cluster: 'Cluster Emerald', x: 340, y: 150, status: 'Available', progress: 0, owner: '-', price: 'Rp 670 Jt' },
    { unitNo: 'A-10', cluster: 'Cluster Emerald', x: 440, y: 150, status: 'Available', progress: 0, owner: '-', price: 'Rp 680 Jt' },

    // Cluster Sapphire Row B
    { unitNo: 'B-01', cluster: 'Cluster Sapphire', x: 600, y: 50, status: 'Sold', progress: 100, owner: 'Dr. Tri Handoko', price: 'Rp 890 Jt' },
    { unitNo: 'B-02', cluster: 'Cluster Sapphire', x: 700, y: 50, status: 'Sold', progress: 95, owner: 'Indra Hermawan', price: 'Rp 890 Jt' },
    { unitNo: 'B-03', cluster: 'Cluster Sapphire', x: 800, y: 50, status: 'Construction', progress: 50, owner: 'Farhan Azis', price: 'Rp 900 Jt' },
    { unitNo: 'B-04', cluster: 'Cluster Sapphire', x: 900, y: 50, status: 'Available', progress: 0, owner: '-', price: 'Rp 900 Jt' },

    // Cluster Sapphire Row B (South)
    { unitNo: 'B-05', cluster: 'Cluster Sapphire', x: 600, y: 150, status: 'Booking', progress: 40, owner: 'Dr. Ahmad Fauzi', price: 'Rp 890 Jt' },
    { unitNo: 'B-06', cluster: 'Cluster Sapphire', x: 700, y: 150, status: 'Construction', progress: 15, owner: 'Hendra Wijaya', price: 'Rp 895 Jt' },
    { unitNo: 'B-07', cluster: 'Cluster Sapphire', x: 800, y: 150, status: 'Available', progress: 0, owner: '-', price: 'Rp 910 Jt' },
    { unitNo: 'B-08', cluster: 'Cluster Sapphire', x: 900, y: 150, status: 'Available', progress: 0, owner: '-', price: 'Rp 910 Jt' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return { bg: '#10B981', stroke: '#059669', text: 'Available (Ready Sale)' };
      case 'Booking': return { bg: '#F59E0B', stroke: '#D97706', text: 'Booking / SPR' };
      case 'Construction': return { bg: '#3B82F6', stroke: '#2563EB', text: 'Dalam Pembangunan' };
      case 'Sold': return { bg: '#EF4444', stroke: '#DC2626', text: 'Sold / Closed' };
      default: return { bg: '#6B7280', stroke: '#4B5563', text: 'Unknown' };
    }
  };

  const filteredGrid = siteplanGrid.filter((item) => filterCluster === 'All' || item.cluster === filterCluster);

  return (
    <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      {/* Title & Legend Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 color="#F59E0B" size={22} /> Peta Masterplan Kawasan & Status Unit Real-Time
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Klik pada kavling unit di peta interaktif untuk melihat status pembangunan 3D, legalitas SHM, & data pembeli.</p>
        </div>

        {/* Legend Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.78rem', fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10B981' }} /> Available (Bebas)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#F59E0B' }} /> Booking / SPR
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#3B82F6' }} /> Dalam Pembangunan
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#EF4444' }} /> Sold (Terjual & Lunas)
          </div>
        </div>
      </div>

      {/* SVG Interactive Siteplan Canvas */}
      <div style={{
        width: '100%',
        overflowX: 'auto',
        background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        padding: '1rem',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)'
      }}>
        <svg viewBox="0 0 1020 280" style={{ minWidth: '850px', width: '100%', height: 'auto' }}>
          {/* Background Site Roads & Boulevard */}
          <rect x="0" y="110" width="1020" height="30" fill="rgba(255,255,255,0.06)" rx="4" />
          <line x1="0" y1="125" x2="1020" y2="125" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" strokeDasharray="12 8" />
          <text x="500" y="129" fill="rgba(255,255,255,0.3)" fontSize="11" fontWeight="900" textAnchor="middle" letterSpacing="3">BOULEVARD GRAND HARMONI (MAIN ROAD 12m)</text>

          {/* Cluster Divider Line */}
          <line x1="550" y1="20" x2="550" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 4" />
          <text x="260" y="30" fill="#F59E0B" fontSize="13" fontWeight="900" letterSpacing="2">CLUSTER EMERALD (PHASE 1)</text>
          <text x="760" y="30" fill="#60A5FA" fontSize="13" fontWeight="900" letterSpacing="2">CLUSTER SAPPHIRE (PHASE 2)</text>

          {/* Render Unit Blocks */}
          {filteredGrid.map((kav) => {
            const colors = getStatusColor(kav.status);
            const isSelected = selectedKavling?.unitNo === kav.unitNo;

            return (
              <g
                key={kav.unitNo}
                transform={`translate(${kav.x}, ${kav.y})`}
                onClick={() => setSelectedKavling(kav)}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {/* House Block Rect */}
                <rect
                  x="0"
                  y="0"
                  width="72"
                  height="52"
                  rx="8"
                  fill={colors.bg}
                  fillOpacity={isSelected ? "0.95" : "0.75"}
                  stroke={isSelected ? "#FFFFFF" : colors.stroke}
                  strokeWidth={isSelected ? "3" : "1.5"}
                  filter={isSelected ? "drop-shadow(0px 0px 10px rgba(245, 158, 11, 0.8))" : "none"}
                />

                {/* Roof Triangle Accent */}
                <polygon
                  points="36,6 64,22 8,22"
                  fill="rgba(0,0,0,0.25)"
                />

                {/* Unit Label */}
                <text x="36" y="36" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">
                  {kav.unitNo}
                </text>

                {/* Progress Mini Badge */}
                {kav.progress > 0 && (
                  <text x="36" y="47" fill="rgba(255,255,255,0.85)" fontSize="9" fontWeight="700" textAnchor="middle">
                    {kav.progress}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Unit Inspection Detail Card */}
      {selectedKavling && (
        <div style={{
          marginTop: '1.25rem',
          padding: '1.25rem',
          borderRadius: '12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-highlight)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                Unit Kavling {selectedKavling.unitNo}
              </span>
              <span className={`badge ${selectedKavling.status === 'Sold' ? 'badge-danger' : selectedKavling.status === 'Booking' ? 'badge-warning' : selectedKavling.status === 'Construction' ? 'badge-info' : 'badge-success'}`}>
                {getStatusColor(selectedKavling.status).text}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div><strong>Cluster:</strong> {selectedKavling.cluster}</div>
              <div><strong>Konsumen/Owner:</strong> {selectedKavling.owner}</div>
              <div><strong>Estimasi Harga:</strong> {selectedKavling.price}</div>
              <div><strong>Progress Fisik:</strong> {selectedKavling.progress}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedKavling(null)}>
              Tutup Detail
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => { if (onSelectUnit) onSelectUnit(selectedKavling.unitNo); }}>
              <Eye size={14} /> Buka Detail Lengkap Unit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
