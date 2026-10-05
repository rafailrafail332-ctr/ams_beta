import React, { useState, useRef } from 'react';
import {
  DollarSign,
  X,
  Send,
  CheckCircle2,
  Paperclip,
  Upload,
  FileText,
  Trash2,
  Image as ImageIcon,
  FileCheck,
  CreditCard
} from 'lucide-react';
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
    notes: '',
    targetBank: 'BCA',
    targetAccountNumber: '',
    targetAccountHolder: ''
  });

  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);

    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          // Format size
          let sizeStr = '';
          if (file.size < 1024) sizeStr = `${file.size} B`;
          else if (file.size < 1024 * 1024) sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
          else sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

          resolve({
            id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            size: sizeStr,
            type: file.type,
            dataUrl: uploadEvent.target.result,
            uploadedAt: new Date().toISOString().split('T')[0]
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((results) => {
      setAttachments((prev) => [...prev, ...results]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

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
        notes: form.notes,
        targetBank: form.targetBank || 'BCA',
        targetAccountNumber: form.targetAccountNumber || '-',
        targetAccountHolder: form.targetAccountHolder || form.requester || '-',
        namaBank: form.targetBank || 'BCA',
        noRekening: form.targetAccountNumber || '-',
        namaPenerima: form.targetAccountHolder || form.requester || '-',
        attachments: attachments
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setAttachments([]);
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
        backgroundColor: 'rgba(5, 8, 15, 0.88)',
        backdropFilter: 'blur(8px)',
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
          background: 'linear-gradient(145deg, #0b1120 0%, #060a14 100%)',
          border: '1.5px solid #1e293b',
          borderRadius: '16px',
          maxWidth: '620px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 25px rgba(56, 189, 248, 0.08)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* HEADER MODAL */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid #1e293b',
            paddingBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
              }}
            >
              <DollarSign size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                Pengajuan Dana ke Finance & Acc
              </h3>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Departemen Pemohon:{' '}
                <span
                  style={{
                    color: '#38bdf8',
                    fontWeight: 700,
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: '1px 6px',
                    borderRadius: '4px'
                  }}
                >
                  {defaultOriginName}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 900, margin: 0 }}>
              Pengajuan Dana Berhasil Terkirim!
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '6px' }}>
              Tiket dan berkas lampiran telah masuk ke meja antrean Finance & Acc untuk ditinjau.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* KARTU REKENING TUJUAN TRANSFER (PENCAIRAN DANA OLEH FINANCE) */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                padding: '12px 14px'
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={15} />
                <span>REKENING TUJUAN TRANSFER (PENCAIRAN DANA OLEH FINANCE) *</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nama Bank Tujuan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="BCA / Mandiri / BRI / BSI / BNI"
                    value={form.targetBank}
                    onChange={(e) => setForm({ ...form, targetBank: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nomor Rekening Tujuan (No. Rek) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 002-988-1234"
                    value={form.targetAccountNumber}
                    onChange={(e) => setForm({ ...form, targetAccountNumber: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#34d399',
                      fontSize: '0.84rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Nama Pemilik Rekening / Penerima Transfer *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Vendor Sukses / Mandor Supardi"
                  value={form.targetAccountHolder}
                  onChange={(e) => setForm({ ...form, targetAccountHolder: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Judul Keperluan Pengajuan Dana *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Termin 2 BATP Unit A-02 / Sewa Booth Pameran / Pengadaan Pasir..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none'
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
                    fontSize: '0.82rem',
                    outline: 'none'
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
                    fontSize: '0.82rem',
                    outline: 'none'
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
                  placeholder="Contoh: 15000000"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1.5px solid #38bdf8',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#38bdf8',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    outline: 'none'
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
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="Normal">Normal</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Mendesak">Mendesak</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Kategori Biaya
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
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
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Keterangan / Rincian Kebutuhan
              </label>
              <textarea
                rows="2"
                placeholder="Rincian justifikasi atau keterangan pelengkap permohonan dana..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* AREA UNGGAH DOKUMEN LAMPIRAN */}
            <div
              style={{
                border: '1.5px dashed #334155',
                borderRadius: '10px',
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.45)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Paperclip size={15} color="#38bdf8" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                    Dokumen Lampiran Pendukung
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    (Proposal, Nota, Kuitansi, Invoice, RAB, Foto)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38bdf8',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Upload size={13} /> + Pilih File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                />
              </div>

              {isUploading && (
                <div style={{ fontSize: '0.74rem', color: '#38bdf8', textAlign: 'center', padding: '6px' }}>
                  Sedang memproses dokumen...
                </div>
              )}

              {attachments.length === 0 ? (
                <div style={{ fontSize: '0.73rem', color: '#64748b', textAlign: 'center', padding: '8px 0' }}>
                  Belum ada dokumen yang dilampirkan. Klik <strong>+ Pilih File</strong> untuk melampirkan berkas (PDF / Foto / Word / Excel).
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#090e1a',
                        border: '1px solid #1e293b',
                        padding: '6px 10px',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        {file.type && file.type.includes('image') ? (
                          <ImageIcon size={15} color="#34d399" />
                        ) : (
                          <FileText size={15} color="#38bdf8" />
                        )}
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#e2e8f0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '320px'
                          }}
                        >
                          {file.name}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>({file.size})</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(file.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: '2px 5px'
                        }}
                        title="Hapus lampiran ini"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BUTTONS FOOTER */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#1e293b',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid #38bdf8',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '9px 20px',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                }}
              >
                <Send size={15} /> Kirim Pengajuan ke Finance
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
