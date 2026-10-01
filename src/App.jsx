import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { UserProfileModal } from './components/UserProfileModal';
import { LandingLogin } from './pages/LandingLogin';
import { AmsCentralHub } from './components/AmsCentralHub';
import { Dashboard } from './pages/Dashboard';
import { TodoAttendanceModule } from './pages/TodoAttendanceModule';
import { ExecutiveModule } from './pages/ExecutiveModule';
import { ManagerModule } from './pages/ManagerModule';
import { TeknikModule } from './pages/TeknikModule';
import { MarketingModule } from './pages/MarketingModule';
import { LegalModule } from './pages/LegalModule';
import { FinanceModule } from './pages/FinanceModule';
import { HrGaModule } from './pages/HrGaModule';
import { CustomerRelationModule } from './pages/CustomerRelationModule';
import { ProcurementModule } from './pages/ProcurementModule';
import { UserManagement } from './pages/UserManagement';
import { PiutangKonsumenModule } from './pages/PiutangKonsumenModule';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Lock, ArrowLeft } from 'lucide-react';

function AppContent() {
  const { currentUser, setCurrentUser, users, canAccessModule } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('hub');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLoginSuccess = (targetTab = 'hub', selectedEmail = 'ams@gmail.com') => {
    let foundUser;
    if (selectedEmail) {
      foundUser = users.find((u) => u.email.toLowerCase() === selectedEmail.toLowerCase());
    }
    if (!foundUser) {
      foundUser = users.find((u) => u.email.toLowerCase() === 'ams@gmail.com' || u.email.toLowerCase() === 'yazid@ams.co.id') || users[0];
    }
    setCurrentUser(foundUser);

    if (targetTab === 'hub' || canAccessModule(targetTab, foundUser)) {
      setCurrentTab(targetTab);
    } else {
      setCurrentTab('hub');
    }

    setIsAuthenticated(true);
  };

  const handleBackToLanding = () => {
    setCurrentTab('hub');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentTab('hub');
    setIsProfileModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOpenUserControl = () => {
    setCurrentTab('users');
  };

  const getActiveTitle = () => {
    switch (currentTab) {
      case 'hub':
      case 'dashboard':
        return 'AMS Central Hub';
      case 'todo-attendance':
        return 'To-Do List Harian Karyawan';
      case 'executive':
        return 'Eksekutif & Direksi Utama (BOD Executive Suite)';
      case 'manager':
        return 'Manajer Operasional (Manager Suite)';
      case 'teknik':
      case 'teknik-rumah':
      case 'teknik-fasilitas':
      case 'teknik-batp':
        return 'Teknik & Konstruksi - Absen Tenaga Kerja';
      case 'marketing':
        return 'Marketing & Sales Penjualan Unit';
      case 'legal':
      case 'human-resource':
      case 'hr':
        return 'Legal Corporate';
      case 'finance':
        return 'Finance & Payment';
      case 'hr-ga':
      case 'ga':
        return 'HR & GA';
      case 'customer-relation':
        return 'Customer Relation & After-Sales Properti';
      case 'procurement':
        return 'Procurement & Pengadaan Vendor Material';
      case 'users':
      case 'admin':
        return 'Modul Super Admin - Manajemen Users';
      case 'piutang-konsumen':
        return 'Piutang Konsumen (DP & Angsuran)';
      default:
        return 'AMS Central Hub';
    }
  };

  if (!isAuthenticated) {
    return <LandingLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const isAllowed = currentTab === 'hub' || currentTab === 'dashboard' || canAccessModule(currentTab);

  const isHubView = currentTab === 'hub' || currentTab === 'dashboard';

  return (
    <div className="app-container" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isHubView && (
        <Header 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onBackToLanding={handleBackToLanding}
          activeTitle={getActiveTitle()} 
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
      )}

      {isHubView ? (
        <ErrorBoundary key="hub" moduleName="AMS Central Hub">
          <AmsCentralHub
            isLanding={false}
            currentUser={currentUser}
            onSelectModule={(tabKey) => setCurrentTab(tabKey)}
            onLogout={handleLogout}
          />
        </ErrorBoundary>
      ) : (
        <main className="main-content" style={{ 
          marginLeft: 0, 
          width: '100%', 
          maxWidth: '100%', 
          padding: '1.5rem', 
          boxSizing: 'border-box' 
        }}>
          {!isAllowed ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '2rem auto' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Lock size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Restriksi Hak Akses Role ({currentUser?.role})
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Maaf, akun Anda ({currentUser?.name} - {currentUser?.role}) hanya diizinkan membuka Modul Khusus milik Anda atau Modul To-Do List & Absen.
              </p>
              <button className="btn btn-primary" onClick={() => setCurrentTab('hub')}>
                <ArrowLeft size={16} /> Kembali ke Central Hub
              </button>
            </div>
          ) : (
            <ErrorBoundary key={currentTab} moduleName={getActiveTitle()}>
              <div className="module-animated-view">
                {currentTab === 'todo-attendance' && <TodoAttendanceModule />}
                {currentTab === 'executive' && <ExecutiveModule />}
                {currentTab === 'manager' && <ManagerModule />}
                {(currentTab === 'teknik' || currentTab === 'teknik-rumah' || currentTab === 'teknik-fasilitas' || currentTab === 'teknik-batp') && <TeknikModule />}
                {currentTab === 'marketing' && <MarketingModule />}
                {(currentTab === 'legal' || currentTab === 'human-resource' || currentTab === 'hr') && <LegalModule />}
                {currentTab === 'finance' && <FinanceModule />}
                {(currentTab === 'hr-ga' || currentTab === 'ga') && (
                  <HrGaModule onSwitchToLegalCorporate={() => setCurrentTab('legal')} />
                )}
                {currentTab === 'customer-relation' && <CustomerRelationModule />}
                {currentTab === 'procurement' && <ProcurementModule />}
                {(currentTab === 'users' || currentTab === 'admin') && <UserManagement />}
                {currentTab === 'piutang-konsumen' && <PiutangKonsumenModule />}
              </div>
            </ErrorBoundary>
          )}
        </main>
      )}

      {/* USER PROFILE MODAL */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenUserControl={handleOpenUserControl}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
