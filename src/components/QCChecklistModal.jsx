import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  X, 
  Building2, 
  Check, 
  ShieldCheck,
  Sparkles,
  Droplets,
  Zap,
  Home,
  HardHat
} from 'lucide-react';

export const QCChecklistModal = ({ isOpen, onClose, unitNo = 'A-01', onSaveQC }) => {
  const { showNotification } = useApp();

  const [qcItems, setQcItems] = useState([
    { id: 1, category: 'Struktur Atap & Plafon', name: 'Uji Kebocoran Atap & Talang Air', passed: true, note: 'Bebas bocor saat uji siram 2 jam' },
    { id: 2, category: 'Plumbing & Air', name: 'Uji Tekanan Air Pipa PDAM & Drainase', passed: true, note: 'Tekanan air lancar, saluran u-ditch bersih' },
    { id: 3, category: 'Kelistrikan PLN', name: 'Uji Saklar, Stopkontak & Grounding 1300W', passed: true, note: 'Arus listrik stabil, MCB berfungsi baik' },
    { id: 4, category: 'Kusen & Dinding', name: 'Inspeksi Engsel Pintu, Jendela & Dinding', passed: true, note: 'Bebas retak rambut, engsel presisi' },
    { id: 5, category: 'Finishing & Keramik', name: 'Inspeksi Kerataan Keramik & Pengecatan', passed: true, note: 'Keramik nat rapi, cat dinding 2 lapis' }
  ]);

  const toggleQC = (id) => {
    setQcItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, passed: !item.passed } : item))
    );
  };

  const updateNote = (id, note) => {
    setQcItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    );
  };

  if (!isOpen) return null;

  const passedCount = qcItems.filter((i) => i.passed).length;
  const qcScore = Math.round((passedCount / qcItems.length) * 100);

  const handleSave = () => {
    if (onSaveQC) onSaveQC(qcScore, qcItems);
    showNotification(`Hasil QC Kelayakan Unit ${unitNo} berhasil disimpan! Skor: ${qcScore}%`);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '750px', width: '95%' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ClipboardCheck size={22} color="#F59E0B" />
            <h3 className="modal-title">Form Quality Control (QC) & Inspeksi Bangunan Unit {unitNo}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem' }}>
          {/* Score Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: qcScore >= 80 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${qcScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            marginBottom: '1.25rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)' }}>SKOR KELAYAKAN TEKNIK (QC SCORE)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: qcScore >= 80 ? 'var(--success)' : '#ef4444' }}>
                {qcScore}% {qcScore >= 80 ? 'LOLOS (Siap BATP/Handover)' : 'PERLU PERBAIKAN (Defect List)'}
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              {passedCount} dari {qcItems.length} Item Lolos Uji Inspeksi
            </div>
          </div>

          {/* QC Checklist Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {qcItems.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{item.category}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, margin: '2px 0' }}>{item.name}</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Catatan inspeksi..."
                    value={item.note}
                    onChange={(e) => updateNote(item.id, e.target.value)}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginTop: '4px' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => toggleQC(item.id)}
                  className={`btn btn-sm ${item.passed ? 'btn-primary' : 'btn-outline-danger'}`}
                  style={{ minWidth: '130px', justifyContent: 'center' }}
                >
                  {item.passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {item.passed ? 'PASSED (Lolos)' : 'FAILED (Defect)'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={handleSave}>
            Simpan Hasil Inspeksi QC
          </button>
        </div>
      </div>
    </div>
  );
};
