import React from 'react';
import { RefreshCw, AlertOctagon } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary intercepted crash:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', margin: '2rem auto', maxWidth: '650px', borderRadius: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <AlertOctagon size={36} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Modul Ini Mengalami Pemulihan Otomatis
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Terjadi kesalahan sementara pada tampilan modul ({this.props.moduleName || 'Komponen System'}). 
            Layar tidak akan menjadi kosong (blank screen), Anda dapat memuat ulang modul ini atau memilih modul lain di Sidebar.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={this.handleReset} style={{ gap: '0.5rem' }}>
              <RefreshCw size={16} /> Muat Ulang Modul Ini
            </button>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              Muat Ulang Seluruh Aplikasi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
