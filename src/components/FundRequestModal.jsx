import React, { useState } from 'react';
import { DollarSign, X, Send, CheckCircle2 } from 'lucide-react';
import { submitFundRequest } from '../services/financeService';

export const FundRequestModal = ({
  isOpen,
  onClose,
  defaultOrigin = 'operasional',
  defaultOriginName = 'Operasional',
  defaultProject = 'Ashoka View',
  defaultCategory = 'Operasional',
  defaultRequester = 'Staf Lapangan',
  defaultAccountCode = '5-301',
  onSuccess
}) => {
  const [form, setForm] = useState({
    title: '',
    category: defaultCategory,
    project: defaultProject,
    requester: defaultRequester,
    amount: '',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +5 hari
    priority: 'Normal',
    accountCode: defaultAccountCode,
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) {
      alert('Mohon isi judul dan nominal pengajuan!');
      return;
    }

    try {
      const created = submitFundRequest({
        title: form.title,
        originModule: defaultOrigin,
        originModuleName: defaultOriginName,
        requester: form.requester,
        project: form.project,
        category: form.category,
        amount: Number(form.amount),
        dueDate: form.dueDate,
        priority: form.priority,
        accountCode: form.accountCode,
        notes: form.notes
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        if (onSuccess) onSuccess(created);
        onClose();
      }, 1200);
    } catch (err) {
      alert(`Gagal mengirim pengajuan: ${err.message}`);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.82)',
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
          border: '2px solid #ef4444',
          borderRadius: '14px',
          maxWidth: '560px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 12px 48px rgba(0,0,0,0.85)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1.5px solid #1e293b',
            paddingBottom: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <DollarSign size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Ajukan Dana ke Finance & Acc
              </h3>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Dari Departemen: <strong style={{ color: '#38bdf8' }}>{defaultOriginName}</strong>
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

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>
              Pengajuan Dana Terkirim!
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '6px' }}>
              Tiket berhasil masuk ke antrean meja Finance & Acc untuk ditinjau dan dicairkan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Judul Keperluan Pengajuan Dana *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Sewa booth pameran / Servis AC / Termin BATP..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#ffffff',
                  fontSize: '0.84rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Nama Pemohon
                </label>
                <input
                  type="text"
                  required
                  value={form.requester}
                  onChange={(e) => setForm({ ...form, requester: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Proyek Terkait
                </label>
                <input
                  type="text"
                  required
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Nominal Dibutuhkan (Rp) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 10000000"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1.5px solid #ef4444',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 900
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Tingkat Urgensi
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="Normal">Normal</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Mendesak">Mendesak</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Tanggal Jatuh Tempo / Dibutuhkan
              </label>
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Keterangan / Rincian Kebutuhan
              </label>
              <textarea
                rows="3"
                placeholder="Jelaskan kebutuhan pengajuan dana ini secara ringkas..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#1e293b',
                  color: '#cbd5e1',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #7f0000 0%, #991b1b 100%)',
                  border: '1px solid #ef4444',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '9px 20px',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)'
                }}
              >
                <Send size={15} /> Kirim ke Finance Sekarang
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
