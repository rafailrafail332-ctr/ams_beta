import React from 'react';
import { FileText, X, Printer, CheckCircle2, Building, Calendar, DollarSign, ShieldCheck } from 'lucide-react';

export const TransferProofModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          border: '2px solid #10b981',
          borderRadius: '16px',
          maxWidth: '580px',
          width: '100%',
          padding: '2rem',
          boxShadow: '0 12px 48px rgba(0,0,0,0.9)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Header Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #1e293b', paddingBottom: '12px', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Bukti Transfer & Pencairan Dana
              </h3>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Ref: <strong style={{ color: '#38bdf8' }}>{item.disbursedRef || 'BKK-OFFICIAL'}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Struk Stempel Digital Resmi */}
        <div
          id="printable-transfer-proof"
          style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #0b1120 100%)',
            border: '1.5px solid #334155',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Watermark Status Lunas */}
          <div
            style={{
              position: 'absolute',
              right: '-25px',
              top: '25px',
              transform: 'rotate(25deg)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px dashed #10b981',
              color: '#34d399',
              padding: '6px 40px',
              fontSize: '0.85rem',
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              pointerEvents: 'none'
            }}
          >
            ✓ LUNAS DICAIRKAN
          </div>

          {/* Kop Surat Perusahaan */}
          <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PT ASHOKA MULTI SINERGI • TREASURY & DISBURSEMENT
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
              SLIP BUKTI TRANSFER PEMBAYARAN
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Proyek: <strong style={{ color: '#ffffff' }}>{item.project}</strong> • Divisi: {item.originModuleName}
            </div>
          </div>

          {/* Nominal Utama */}
          <div style={{ background: '#090d16', border: '1.5px solid #10b981', borderRadius: '10px', padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>
              Jumlah Dana Yang Ditransfer
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
              Rp {Number(item.amount).toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
              Terbilang: #{item.amount ? `${(item.amount / 1000).toLocaleString('id-ID')} Ribu Rupiah` : 'Nol Rupiah'}#
            </div>
          </div>

          {/* Detail Transaksi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Rekening Sumber:</div>
              <div style={{ fontWeight: 800, color: '#ffffff' }}>{item.disbursedBankName || 'Kas/Bank Operasional'}</div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Tanggal Pencairan:</div>
              <div style={{ fontWeight: 800, color: '#ffffff' }}>{item.disbursedAt || new Date().toISOString().split('T')[0]}</div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Nomor Tiket:</div>
              <div style={{ fontWeight: 800, color: '#f87171' }}>{item.id}</div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Nama Pemohon:</div>
              <div style={{ fontWeight: 800, color: '#ffffff' }}>{item.requester}</div>
            </div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Keperluan Pengajuan:</div>
            <div style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.84rem' }}>{item.title}</div>
          </div>

          {/* Rekening Tujuan Transfer */}
          <div style={{ background: '#090d16', border: '1px solid #10b981', borderRadius: '8px', padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Rekening Tujuan Transfer:</div>
              <div style={{ fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
                {item.targetBank || item.namaBank || 'BCA'} - {item.targetAccountNumber || item.noRekening || '-'}
              </div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Nama Penerima Transfer:</div>
              <div style={{ fontWeight: 800, color: '#ffffff' }}>
                {item.targetAccountHolder || item.namaPenerima || item.requester}
              </div>
            </div>
          </div>

          {item.transferNotes && (
            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 12px', fontSize: '0.76rem', color: '#cbd5e1' }}>
              <strong style={{ color: '#38bdf8' }}>Catatan Transfer:</strong> {item.transferNotes}
            </div>
          )}

          {/* Pratinjau Foto Bukti TF (Jika ada yang diunggah) */}
          {item.transferProofUrl && (
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, marginBottom: '6px' }}>
                Lampiran Gambar Struk Bank:
              </div>
              {item.transferProofUrl.startsWith('data:image') || item.transferProofUrl.startsWith('http') ? (
                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155', maxHeight: '220px' }}>
                  <img
                    src={item.transferProofUrl}
                    alt="Bukti Transfer"
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div style={{ background: '#090d16', border: '1px solid #10b981', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.8rem' }}>
                  <ShieldCheck size={18} />
                  <span>Struk transfer digital terverifikasi: <strong>{item.transferProofName || 'Struk_Transfer_Bank.jpg'}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Tombol Aksi */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Printer size={15} /> Cetak Bukti TF
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
              border: '1px solid #ef4444',
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
