import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Award,
  Sparkles,
  KeyRound
} from 'lucide-react';

export const DocumentGeneratorModal = ({ isOpen, onClose, docType = 'SPR', unitData }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const defaultUnit = unitData || {
    unitNo: 'A-01',
    cluster: 'Grand Harmoni - Cluster Emerald',
    owner: 'Budi Santoso',
    tipe: '45/90',
    harga: 650000000,
    contractor: 'PT Bangun Jaya Perdana',
    legalStatus: 'SHM Ready (No. 1024/SHM)',
    date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '850px', width: '95%', color: '#0f172a' }}>
        {/* Modal Controls Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#F59E0B" />
            <h3 className="modal-title" style={{ color: '#0f172a' }}>
              Dokumen Resmi PDF - {
                docType === 'SPR' 
                  ? 'Surat Pesanan Rumah (SPR)' 
                  : docType === 'BATP' 
                  ? 'Berita Acara Serah Terima Pekerjaan Kontraktor (BATP)' 
                  : docType === 'BAST' || docType === 'BAST_KUNCI'
                  ? 'Berita Acara Serah Terima Kunci & Unit Konsumen (BAST)' 
                  : 'Kwitansi Pembayaran & SP3K'
              }
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 800, border: 'none' }}>
              <Printer size={16} /> Cetak / Export PDF Dokumen
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Document Paper View */}
        <div 
          id="printable-paper"
          style={{
            backgroundColor: '#ffffff',
            padding: '2.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: 1.6,
            color: '#1e293b'
          }}
        >
          {/* Document Letterhead Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/company-logo.png" alt="Ashoka Logo" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  PT ASHOKA ENTERPRISE DEVELOPMENT
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Kawasan Grand Harmoni Residence Block A-01, Jakarta &bull; Telp: (021) 8899-7766 &bull; www.ams.co.id
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>RESI DOKUMEN SAH</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>NO: DOC-AMS/2025/08-889</div>
            </div>
          </div>

          {/* Document Title */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline', color: '#0f172a', margin: 0 }}>
              {docType === 'SPR' && 'SURAT PESANAN RUMAH (SPR) MARKETING'}
              {docType === 'BATP' && 'BERITA ACARA SERAH TERIMA PEKERJAAN (BATP KONTRAKTOR)'}
              {(docType === 'BAST' || docType === 'BAST_KUNCI') && 'BERITA ACARA SERAH TERIMA KUNCI & UNIT RUMAH (BAST KONSUMEN)'}
              {docType === 'KWITANSI' && 'KWITANSI PEMBAYARAN DP & SP3K ACC'}
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Tanggal Penerbitan: {defaultUnit.date}</div>
          </div>

          {/* Document Content Details Body */}
          {docType === 'SPR' && (
            <div style={{ fontSize: '0.9rem' }}>
              <p>Yang bertanda tangan di bawah ini menerangkan bahwa Pembeli telah sepakat memilih dan memesan unit perumahan dengan rincian berikut:</p>
              
              <table style={{ width: '100%', marginBottom: '1.5rem', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr><td style={{ padding: '6px 0', width: '220px', fontWeight: 700 }}>Nama Pembeli (Konsumen)</td><td>: {defaultUnit.owner}</td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Cluster & Nomor Unit</td><td>: {defaultUnit.cluster} - Kavling {defaultUnit.unitNo}</td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Tipe Bangunan / Tanah</td><td>: Tipe {defaultUnit.tipe}</td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Harga Kesepakatan Jual</td><td>: <strong>{formatRupiah(defaultUnit.harga)}</strong></td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Status Pembayaran DP</td><td>: Lunas 100% (Verifikasi Finance)</td></tr>
                </tbody>
              </table>

              <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                Demikian Surat Pesanan Rumah ini dibuat sebagai bukti pengikatan awal sebelum dilanjutkan ke tahap Akad KPR / Penandatanganan AJB di hadapan Notaris.
              </p>
            </div>
          )}

          {docType === 'BATP' && (
            <div style={{ fontSize: '0.9rem' }}>
              <p>Pada hari ini <strong>{defaultUnit.date}</strong>, pihak Kontraktor Pelaksana dan Tim Perencanaan Teknik Ashoka AMS telah menyelesaikan dan memverifikasi serah terima pekerjaan konstruksi fisik unit berikut:</p>

              <table style={{ width: '100%', marginBottom: '1.5rem', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr><td style={{ padding: '6px 0', width: '220px', fontWeight: 700 }}>Pihak Kontraktor Pelaksana</td><td>: {defaultUnit.contractor}</td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Unit & Cluster Pembangunan</td><td>: Unit {defaultUnit.unitNo} ({defaultUnit.cluster})</td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Capaian Progress Pengerjaan</td><td>: <strong>100% (Selesai & Lolos QC Inspeksi)</strong></td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Status Dokumen Legalitas</td><td>: {defaultUnit.legalStatus}</td></tr>
                </tbody>
              </table>

              <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                Fisik bangunan telah diperiksa dan dinyatakan memenuhi standar mutu sertifikasi K3 dan kelayakan huni Ashoka Enterprise. Pihak Kontraktor berhak menerima pencairan termin BATP 100%.
              </p>
            </div>
          )}

          {(docType === 'BAST' || docType === 'BAST_KUNCI') && (
            <div style={{ fontSize: '0.9rem' }}>
              <p>Pada hari ini <strong>{defaultUnit.date}</strong>, telah dilaksanakan Serah Terima Kunci & Unit Rumah Perumahan secara resmi antara Pihak Developer (*PT. Ashoka Enterprise Realty*) dan Konsumen Pembeli:</p>

              <table style={{ width: '100%', marginBottom: '1.5rem', borderCollapse: 'collapse', marginTop: '0.75rem' }}>
                <tbody>
                  <tr><td style={{ padding: '6px 0', width: '220px', fontWeight: 700 }}>Nama Pembeli / Pemilik Unit</td><td>: <strong>{defaultUnit.owner}</strong></td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Nomor Kavling & Cluster</td><td>: Unit {defaultUnit.unitNo} ({defaultUnit.cluster})</td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Tipe Bangunan Rumah</td><td>: Tipe {defaultUnit.tipe}</td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Status Mutu Bangunan (QC)</td><td>: <strong style={{ color: '#10B981' }}>100% Siap Huni (Lolos Audit Quality Control)</strong></td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Penyerahan Kunci & Meteran</td><td>: 2 Set Kunci Utama + Listrik PLN 1300W Active + PDAM Active</td></tr>
                  <tr><td style={{ padding: '6px 0', fontWeight: 700 }}>Status Dokumen Sertifikat</td><td>: {defaultUnit.legalStatus}</td></tr>
                </tbody>
              </table>

              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem' }}>
                Dengan ditandatanganinya Berita Acara Serah Terima (BAST) ini, maka hak penggunaan unit perumahan resmi diserahkan kepada Pembeli dan masa garansi retensi pemeliharaan 100 hari kerja mulai berlaku secara sah.
              </p>
            </div>
          )}

          {/* Signatures Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', textTransform: 'uppercase', fontSize: '0.8rem', textAlign: 'center' }}>
            <div>
              <div>Pihak Pemohon / Pembeli</div>
              <div style={{ height: '60px' }} />
              <div style={{ fontWeight: 800, textDecoration: 'underline' }}>({defaultUnit.owner})</div>
            </div>

            <div>
              <div>Tim Customer Relation & Site Manager</div>
              <div style={{ height: '60px' }} />
              <div style={{ fontWeight: 800, textDecoration: 'underline' }}>(Adhi Himawan, S.E.Sy)</div>
            </div>

            <div>
              <div>Direktur Utama & BOD</div>
              <div style={{ height: '60px' }} />
              <div style={{ fontWeight: 800, textDecoration: 'underline' }}>(Yazid Hizbullah, S.E.,S.T)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
