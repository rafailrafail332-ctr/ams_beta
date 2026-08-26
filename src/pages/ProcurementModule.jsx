import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Truck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Star, 
  DollarSign, 
  Building2, 
  PackageCheck, 
  Award, 
  Printer, 
  X,
  FileCheck2,
  Boxes,
  Briefcase,
  Trash2
} from 'lucide-react';

export const ProcurementModule = () => {
  const { showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('vendors'); // 'vendors', 'po', 'tender', 'gr', 'contracts', 'matching'

  // Pilar 1: Vendor & Contractor Directory Data (Persistent Store)
  const initialVendors = [
    {
      id: 'VND-001',
      name: 'PT Bangun Jaya Perdana',
      category: 'Kontraktor Utama (General Contractor)',
      contactPerson: 'Herman Wijaya',
      phone: '0811-3344-5566',
      rating: 4.9,
      status: 'Terverifikasi (Vendor Utama)',
      completedProjects: 12
    },
    {
      id: 'VND-002',
      name: 'CV Karya Mandiri Teknik',
      category: 'Sub-Kontraktor Struktur & Pondasi',
      contactPerson: 'Suryo Utomo',
      phone: '0812-7788-9900',
      rating: 4.6,
      status: 'Terverifikasi',
      completedProjects: 7
    },
    {
      id: 'VND-003',
      name: 'PT Semen Gresik Distributor',
      category: 'Supplier Material (Semen & Beton)',
      contactPerson: 'Budi Hartono',
      phone: '0813-1122-3344',
      rating: 4.8,
      status: 'Terverifikasi (Kontrak Payung)',
      completedProjects: 25
    }
  ];

  const [vendors, setVendors] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_vendors_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialVendors;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_vendors_v1', JSON.stringify(vendors));
    } catch (e) {}
  }, [vendors]);

  // Pilar 2: PR & PO Purchase Order Data (Persistent Store)
  const initialOrders = [
    {
      id: 'PO-2025-081',
      prNo: 'PR-TECH-102',
      itemDesc: '500 Sak Semen Portland 50kg & Besi Beton 12mm (100 Batang)',
      vendorName: 'PT Semen Gresik Distributor',
      amount: 68500000,
      requestDate: '2025-08-01',
      status: 'Approved PO (Siap Kirim)',
      approvedBy: 'Kevin Anderson, MBA'
    },
    {
      id: 'PO-2025-082',
      prNo: 'PR-TECH-105',
      itemDesc: '200 Dus Keramik Homogeneous Tile 60x60 Cluster Emerald',
      vendorName: 'PT Keramik Asia Utama',
      amount: 42000000,
      requestDate: '2025-08-05',
      status: 'In Review Procurement',
      approvedBy: '-'
    }
  ];

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_orders_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialOrders;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_orders_v1', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // Pilar 3: E-Tendering & Bidding Data (Persistent Store)
  const initialTenders = [
    {
      id: 'TND-2025-03',
      title: 'Tender Pembangunan Main Road Boulevard & Drainase U-Ditch 12m',
      budgetRAB: 850000000,
      bidders: [
        { name: 'PT Bangun Jaya Perdana', bid: 820000000, score: '95/100 (Rekomendasi Utama)' },
        { name: 'CV Karya Mandiri Teknik', bid: 840000000, score: '88/100' },
        { name: 'PT Nusantara Konstruksi', bid: 875000000, score: '82/100' }
      ],
      winner: 'PT Bangun Jaya Perdana',
      status: 'Penetapan Pemenang'
    }
  ];

  const [tenders, setTenders] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_tenders_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialTenders;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_tenders_v1', JSON.stringify(tenders));
    } catch (e) {}
  }, [tenders]);

  // Pilar 4: Goods Receipt (GR) & Gudang Material (Persistent Store)
  const initialGoodsReceipts = [
    {
      id: 'GR-2025-44',
      poNo: 'PO-2025-081',
      item: 'Semen Portland 50kg (500 Sak)',
      receivedDate: '08 Agustus 2025',
      inspector: 'Agus Subekti (Gudang Site Office)',
      qcStatus: 'Lolos QC 100% (Bebas Rusak)'
    }
  ];

  const [goodsReceipts, setGoodsReceipts] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_gr_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialGoodsReceipts;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_gr_v1', JSON.stringify(goodsReceipts));
    } catch (e) {}
  }, [goodsReceipts]);

  // Pilar 6: 3-Way Matching Invoice Payment Data (Persistent Store)
  const initialInvoices = [
    {
      id: 'INV-VND-88',
      vendorName: 'PT Semen Gresik Distributor',
      poNo: 'PO-2025-081',
      grNo: 'GR-2025-44',
      amount: 68500000,
      matchingStatus: '3-Way Match Verified (Valid)',
      paymentStatus: 'Approved Payment Release'
    }
  ];

  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_proc_invoices_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialInvoices;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_proc_invoices_v1', JSON.stringify(invoices));
    } catch (e) {}
  }, [invoices]);

  // Delete Handlers
  const handleDeleteVendor = (id, name) => {
    if (window.confirm(`Hapus data vendor ${name}?`)) {
      setVendors(prev => prev.filter(v => v.id !== id));
      showNotification(`Vendor ${name} berhasil dihapus.`, 'warning');
    }
  };

  const handleDeleteOrder = (id, prNo) => {
    if (window.confirm(`Hapus Purchase Order ${id} (${prNo})?`)) {
      setOrders(prev => prev.filter(o => o.id !== id));
      showNotification(`Purchase Order ${id} berhasil dihapus.`, 'warning');
    }
  };

  const handleDeleteTender = (id, title) => {
    if (window.confirm(`Hapus data lelang tender ${title}?`)) {
      setTenders(prev => prev.filter(t => t.id !== id));
      showNotification(`Tender ${id} berhasil dihapus.`, 'warning');
    }
  };

  const handleDeleteGR = (id, item) => {
    if (window.confirm(`Hapus catatan Goods Receipt ${id} (${item})?`)) {
      setGoodsReceipts(prev => prev.filter(g => g.id !== id));
      showNotification(`Goods Receipt ${id} berhasil dihapus.`, 'warning');
    }
  };

  const handleDeleteInvoice = (id, vendorName) => {
    if (window.confirm(`Hapus invoice ${id} dari ${vendorName}?`)) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      showNotification(`Invoice ${id} berhasil dihapus.`, 'warning');
    }
  };

  // Modal State Add Vendor
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    name: '',
    category: 'Supplier Material',
    contactPerson: '',
    phone: ''
  });

  const handleAddVendor = (e) => {
    e.preventDefault();
    const newV = {
      id: `VND-00${vendors.length + 1}`,
      rating: 5.0,
      status: 'Terverifikasi',
      completedProjects: 0,
      ...vendorForm
    };
    setVendors([newV, ...vendors]);
    showNotification(`Vendor Baru ${newV.name} berhasil didaftarkan!`, 'success');
    setIsVendorModalOpen(false);
  };

  const handleApprovePO = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Approved PO (Siap Kirim)', approvedBy: 'Rudy Hermawan, ST' } : o));
    showNotification(`Surat Pesanan PO ${id} berhasil disetujui!`);
  };

  const handleReleasePayment = (id) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, paymentStatus: 'Paid / Transfered (Finance)' } : i));
    showNotification(`Persetujuan Pencairan Dana Tagihan Vendor ${id} disetujui!`);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Procurement (Pengadaan Material & Vendor Properti)</h1>
          <p className="page-subtitle">Pusat pengadaan bahan bangunan, lelang tender kontraktor, PO material, & 3-way invoice matching.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsVendorModalOpen(true)}>
          <Plus size={16} /> Registrasi Vendor / Supplier Baru
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vendor Terverifikasi</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{vendors.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Perusahaan</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total PO Terbit</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>Rp 110.5 Jt</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Efisiensi Tender Proyek</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>3.5% <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Under Budget</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PackageCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>3-Way Invoice Matching</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>100% <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Verified</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for 6 Pillars */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'vendors' ? 'active' : ''}`} onClick={() => setActiveTab('vendors')}>
          <Briefcase size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Vendor & Kontraktor
        </button>
        <button className={`tab-item ${activeTab === 'po' ? 'active' : ''}`} onClick={() => setActiveTab('po')}>
          <ShoppingBag size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. PR & Purchase Order (PO)
        </button>
        <button className={`tab-item ${activeTab === 'tender' ? 'active' : ''}`} onClick={() => setActiveTab('tender')}>
          <Award size={16} style={{ display: 'inline', marginRight: '6px' }} /> 3. E-Tendering & Bidding
        </button>
        <button className={`tab-item ${activeTab === 'gr' ? 'active' : ''}`} onClick={() => setActiveTab('gr')}>
          <Truck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 4. Goods Receipt (Gudang)
        </button>
        <button className={`tab-item ${activeTab === 'contracts' ? 'active' : ''}`} onClick={() => setActiveTab('contracts')}>
          <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} /> 5. Kontrak SPK & Diskon
        </button>
        <button className={`tab-item ${activeTab === 'matching' ? 'active' : ''}`} onClick={() => setActiveTab('matching')}>
          <FileCheck2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> 6. 3-Way Matching Invoice
        </button>
      </div>

      {/* PILAR 1: VENDOR & CONTRACTOR DIRECTORY */}
      {activeTab === 'vendors' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Direktori Mitra Vendor & Rating Performa</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID & Nama Vendor</th>
                  <th>Kategori Penyedia</th>
                  <th>Contact Person & HP</th>
                  <th>Rating KPI Performa</th>
                  <th>Proyek Selesai</th>
                  <th>Status Kualifikasi</th>
                  <th>Aksi Kontrak & Hapus</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{v.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{v.id}</div>
                    </td>
                    <td><span className="badge badge-info">{v.category}</span></td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{v.contactPerson}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.phone}</div>
                    </td>
                    <td>
                      <div style={{ color: '#F59E0B', fontWeight: 900 }}>
                        {v.rating} ★★★★★
                      </div>
                    </td>
                    <td><div style={{ fontWeight: 700 }}>{v.completedProjects} Proyek</div></td>
                    <td><span className="badge badge-success">{v.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => alert(`Detail Kontrak Kerjasama Vendor ${v.name}`)}>
                          <FileText size={13} /> SPK
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDeleteVendor(v.id, v.name)}
                          style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem' }}
                          title="Hapus Vendor"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 2: PURCHASE REQUISITION & PURCHASE ORDER */}
      {activeTab === 'po' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Purchase Order (PO Material) & Approval Berjenjang</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No PO & PR Ref</th>
                  <th>Deskripsi Kebutuhan Material</th>
                  <th>Vendor Supplier</th>
                  <th>Total Biaya (Rp)</th>
                  <th>Tanggal Usulan</th>
                  <th>Status Approval</th>
                  <th>Aksi Approval & Hapus</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{o.id}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Ref: {o.prNo}</div>
                    </td>
                    <td><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{o.itemDesc}</div></td>
                    <td>{o.vendorName}</td>
                    <td><div style={{ fontWeight: 800 }}>{formatRupiah(o.amount)}</div></td>
                    <td>{o.requestDate}</td>
                    <td>
                      <span className={`badge ${o.status.includes('Approved') ? 'badge-success' : 'badge-warning'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        {o.status.includes('Approved') ? (
                          <button className="btn btn-secondary btn-sm" onClick={() => alert(`Cetak Dokumen PO ${o.id}`)}>
                            <Printer size={13} /> Cetak
                          </button>
                        ) : (
                          <button className="btn btn-primary btn-sm" onClick={() => handleApprovePO(o.id)}>
                            <CheckCircle2 size={13} /> Setujui
                          </button>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDeleteOrder(o.id, o.prNo)}
                          style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem' }}
                          title="Hapus PO"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 3: E-TENDERING & BIDDING MATRIX */}
      {activeTab === 'tender' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Matriks Bidding Tender Proyek Konstruksi</h3>
          {tenders.map((t) => (
            <div key={t.id} style={{ marginBottom: '1.5rem', padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700 }}>LELANG TENDER PROYEK: {t.id}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>{t.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: 700, marginTop: '2px' }}>Pagu RAB: {formatRupiah(t.budgetRAB)}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>Pemenang: {t.winner}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDeleteTender(t.id, t.title)}
                    style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem' }}
                    title="Hapus Tender"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Peserta Kontraktor</th>
                      <th>Penawaran Harga (Bid)</th>
                      <th>Selisih vs RAB</th>
                      <th>Skor Evaluasi & Track Record</th>
                      <th>Status Seleksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.bidders.map((b, idx) => {
                      const diff = b.bid - t.budgetRAB;
                      return (
                        <tr key={idx}>
                          <td><div style={{ fontWeight: 800 }}>{b.name}</div></td>
                          <td><div style={{ fontWeight: 800 }}>{formatRupiah(b.bid)}</div></td>
                          <td>
                            <div style={{ fontWeight: 700, color: diff < 0 ? 'var(--success)' : '#ef4444' }}>
                              {diff < 0 ? formatRupiah(diff) : `+${formatRupiah(diff)}`}
                            </div>
                          </td>
                          <td><span className="badge badge-info">{b.score}</span></td>
                          <td>
                            {b.name === t.winner ? (
                              <span className="badge badge-success"><Award size={12} /> PEMENANG TENDER</span>
                            ) : (
                              <span className="badge badge-neutral">Peserta Bidding</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PILAR 4: GOODS RECEIPT (GR) GUDANG */}
      {activeTab === 'gr' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Verifikasi Penerimaan Material (Goods Receipt Gudang Lapangan)</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No Surat Jalan (GR) & PO Ref</th>
                  <th>Material Bahan Terima</th>
                  <th>Tanggal Tiba di Site</th>
                  <th>Petugas Inspeksi Gudang</th>
                  <th>Status QC & Volume Check</th>
                  <th>Aksi Hapus</th>
                </tr>
              </thead>
              <tbody>
                {goodsReceipts.map((g) => (
                  <tr key={g.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{g.id}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Ref: {g.poNo}</div>
                    </td>
                    <td><div style={{ fontWeight: 700 }}>{g.item}</div></td>
                    <td>{g.receivedDate}</td>
                    <td>{g.inspector}</td>
                    <td><span className="badge badge-success">{g.qcStatus}</span></td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDeleteGR(g.id, g.item)}
                        style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem' }}
                        title="Hapus Catatan GR"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PILAR 5: SPK KONTRAK & VOLUME DISCOUNT */}
      {activeTab === 'contracts' && (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <FileText size={48} color="#F59E0B" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Manajemen SPK & Kontrak Diskon Grosir Volume</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
            Pengelolaan dokumen perjanjian SPK borongan & diskon pembelian material dalam jumlah besar (Volume Discount Contract).
          </p>
          <button className="btn btn-primary" onClick={() => alert('Fitur Pengelolaan Kontrak SPK Siap Digunakan!')}>
            <ShieldCheck size={16} /> Buka Arsip Kontrak SPK Supplier
          </button>
        </div>
      )}

      {/* PILAR 6: 3-WAY MATCHING INVOICE PAYMENT */}
      {activeTab === 'matching' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Pencocokan 3 Arah (3-Way Matching: PO vs GR vs Invoice)</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No Tagihan Invoice</th>
                  <th>Vendor Tagihan</th>
                  <th>PO & Goods Receipt Ref</th>
                  <th>Nominal Tagihan (Rp)</th>
                  <th>Status 3-Way Matching</th>
                  <th>Status Pencairan Finance</th>
                  <th>Aksi Release & Hapus</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td><div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{inv.id}</div></td>
                    <td>{inv.vendorName}</td>
                    <td>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{inv.poNo}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{inv.grNo}</div>
                    </td>
                    <td><div style={{ fontWeight: 800 }}>{formatRupiah(inv.amount)}</div></td>
                    <td><span className="badge badge-success">{inv.matchingStatus}</span></td>
                    <td><span className="badge badge-info">{inv.paymentStatus}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        {inv.paymentStatus.includes('Approved') ? (
                          <button className="btn btn-primary btn-sm" onClick={() => handleReleasePayment(inv.id)}>
                            <CheckCircle2 size={13} /> Cairkan
                          </button>
                        ) : (
                          <span className="badge badge-success"><CheckCircle2 size={12} /> Lunas</span>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDeleteInvoice(inv.id, inv.vendorName)}
                          style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem' }}
                          title="Hapus Invoice"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REGISTRATION VENDOR MODAL */}
      {isVendorModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Registrasi Mitra Vendor / Supplier Baru</h3>
              <button onClick={() => setIsVendorModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddVendor}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Perusahaan Vendor / Supplier</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="misal: PT Semen Indonesia Tbk"
                    value={vendorForm.name}
                    onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Kategori Spesialisasi</label>
                    <select
                      className="form-control"
                      value={vendorForm.category}
                      onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
                    >
                      <option value="Kontraktor Utama">Kontraktor Utama (General Contractor)</option>
                      <option value="Sub-Kontraktor Struktur">Sub-Kontraktor Struktur & Pondasi</option>
                      <option value="Supplier Material (Semen/Besi)">Supplier Material (Semen & Besi)</option>
                      <option value="Supplier Keramik & Tile">Supplier Keramik & Finishing</option>
                      <option value="Vendor Utilitas PLN/PDAM">Vendor Utilitas & MEP</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Person (Penanggung Jawab)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={vendorForm.contactPerson}
                      onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor Telepon / WhatsApp Aktif</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="0812-xxxx-xxxx"
                    value={vendorForm.phone}
                    onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsVendorModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Daftarkan Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
