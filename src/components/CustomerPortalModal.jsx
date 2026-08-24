import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  X, 
  ShieldCheck, 
  Sparkles,
  PhoneCall,
  Share2,
  Calendar
} from 'lucide-react';

export const CustomerPortalModal = ({ isOpen, onClose, customerData }) => {
  if (!isOpen) return null;

  const data = customerData || {
    customerName: 'Budi Santoso',
    unitNo: 'A-01',
    cluster: 'Grand Harmoni - Cluster Emerald',
    progress: 100,
    status: 'Ready / Handover (Siap Kunci)',
    skema: 'KPR Bank Mandiri',
    legalStatus: 'SHM Ready (No. 1024/SHM A-01)',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    contractor: 'PT Bangun Jaya Perdana',
    handoverDate: '01 Agustus 2025'
  };

  const steps = [
    { title: '1. Pembersihan & Penggalian Pondasi Batu Kali', done: true, date: '10 Jan 2025' },
    { title: '2. Pengecoran Sloof & Struktur Dinding Layer 1', done: true, date: '15 Feb 2025' },
    { title: '3. Pasangan Dinding Bata Merah & Atap Bajaringan', done: true, date: '20 Apr 2025' },
    { title: '4. Pemasangan Keramik, Sanitari & Cat Finishing', done: true, date: '15 Jun 2025' },
    { title: '5. Verifikasi QC Teknik & Terbit SHM BPN', done: true, date: '25 Jul 2025' },
    { title: '6. Serah Terima Kunci & BATP Resmi', done: true, date: '01 Ags 2025' }
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '720px', width: '95%' }}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="#F59E0B" />
            <h3 className="modal-title">Live Progress Tracker Konsumen &bull; Unit {data.unitNo}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem' }}>
          {/* Customer Welcome Header */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary)',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-highlight)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700 }}>PORTAL PELANGGAN ASHOKA</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>Selamat Datang, Bpk/Ibu {data.customerName}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Unit {data.unitNo} ({data.cluster}) &bull; {data.skema}
              </div>
            </div>

            <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
              <CheckCircle2 size={14} /> Progress: {data.progress}% Selesai
            </span>
          </div>

          {/* Photo & Main Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', height: '180px', border: '1px solid var(--border-color)' }}>
              <img src={data.image} alt="Prospek Rumah" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status Bangunan Fisik:</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{data.status}</div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Sertifikat & Legalitas:</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--success)' }}>
                <ShieldCheck size={16} style={{ display: 'inline', marginRight: '4px' }} /> {data.legalStatus}
              </div>
            </div>
          </div>

          {/* Step-by-Step Construction Milestone Checklist */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>Tahapan Pembangunan Fisik Unit:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {steps.map((st, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.825rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span style={{ fontWeight: 600 }}>{st.title}</span>
                </div>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{st.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Tutup</button>
          <button className="btn btn-primary" onClick={() => alert('Link portal konsumen berhasil disalin untuk dikirim ke WhatsApp Pembeli!')}>
            <Share2 size={16} /> Bagikan Link Live Tracker ke WA Pembeli
          </button>
        </div>
      </div>
    </div>
  );
};
