import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { UserProfileModal } from './components/UserProfileModal';
import { LandingLogin } from './pages/LandingLogin';
import { Dashboard } from './pages/Dashboard';
import { TodoAttendanceModule } from './pages/TodoAttendanceModule';
import { ExecutiveModule } from './pages/ExecutiveModule';
import { ManagerModule } from './pages/ManagerModule';
import { TeknikUnitRumah } from './pages/TeknikUnitRumah';
import { TeknikKomersilFasilitas } from './pages/TeknikKomersilFasilitas';
import { TeknikBatp } from './pages/TeknikBatp';
import { MarketingModule } from './pages/MarketingModule';
import { LegalModule } from './pages/LegalModule';
import { FinanceModule } from './pages/FinanceModule';
import { GeneralAffairModule } from './pages/GeneralAffairModule';
import { HumanResourcesModule } from './pages/HumanResourcesModule';
import { CustomerRelationModule } from './pages/CustomerRelationModule';
import { ProcurementModule } from './pages/ProcurementModule';
import { UserManagement } from './pages/UserManagement';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Lock, ArrowLeft } from 'lucide-react';

function AppContent() {
  const { currentUser, setCurrentUser, users, canAccessModule } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLoginSuccess = (targetTab = 'dashboard', selectedEmail = 'yazid@ams.co.id') => {
    let foundUser;
    if (selectedEmail) {
      foundUser = users.find((u) => u.email.toLowerCase() === selectedEmail.toLowerCase());
    }
    if (!foundUser) {
      foundUser = users.find((u) => u.email.toLowerCase() === 'yazid@ams.co.id') || users[0];
    }
    setCurrentUser(foundUser);

    if (canAccessModule(targetTab, foundUser)) {
      setCurrentTab(targetTab);
    } else {
      setCurrentTab('todo-attendance');
    }

    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsProfileModalOpen(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOpenUserControl = () => {
    setCurrentTab('users');
  };

  const getActiveTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'todo-attendance':
        return 'To-Do List Harian Karyawan';
      case 'executive':
        return 'Eksekutif & Direksi Utama (BOD Executive Suite)';
      case 'manager':
        return 'Manajer Operasional (Manager Suite)';
      case 'teknik-rumah':
        return 'Teknik - Update Unit Rumah';
      case 'teknik-fasilitas':
        return 'Teknik - Komersil & Utilitas';
      case 'teknik-batp':
        return 'Teknik - BATP Kontraktor';
      case 'marketing':
        return 'Marketing & Sales Penjualan Unit';
      case 'legal':
        return 'Legal & Perizinan';
      case 'finance':
        return 'Finance & Payment';
      case 'ga':
        return 'General Affair & Operasional';
      case 'hr':
        return 'Human Resources & SDM Properti';
      case 'customer-relation':
        return 'Customer Relation & After-Sales Properti';
      case 'procurement':
        return 'Procurement & Pengadaan Vendor Material';
      case 'users':
        return 'Manajemen Users';
      default:
        return 'Dashboard Overview';
    }
  };

  if (!isAuthenticated) {
    return <LandingLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const isAllowed = canAccessModule(currentTab);

  return (
    <div className="app-container">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={true}
        setIsOpen={() => {}}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />
      <Header 
        onToggleSidebar={() => {}} 
        activeTitle={getActiveTitle()} 
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <main
        className="main-content"
        style={{
          marginLeft: 'var(--sidebar-width)',
          minHeight: 'calc(100vh - var(--header-height))',
          padding: '2rem'
        }}
      >
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
            <button className="btn btn-primary" onClick={() => setCurrentTab('todo-attendance')}>
              <ArrowLeft size={16} /> Buka Modul To-Do List & Absen Universal
            </button>
          </div>
        ) : (
          <ErrorBoundary key={currentTab} moduleName={getActiveTitle()}>
            <div className="module-animated-view">
              {currentTab === 'dashboard' && <Dashboard setCurrentTab={setCurrentTab} />}
              {currentTab === 'todo-attendance' && <TodoAttendanceModule />}
              {currentTab === 'executive' && <ExecutiveModule />}
              {currentTab === 'manager' && <ManagerModule />}
              {currentTab === 'teknik-rumah' && <TeknikUnitRumah />}
              {currentTab === 'teknik-fasilitas' && <TeknikKomersilFasilitas />}
              {currentTab === 'teknik-batp' && <TeknikBatp />}
              {currentTab === 'marketing' && <MarketingModule />}
              {currentTab === 'legal' && <LegalModule />}
              {currentTab === 'finance' && <FinanceModule />}
              {currentTab === 'ga' && <GeneralAffairModule />}
              {currentTab === 'hr' && <HumanResourcesModule />}
              {currentTab === 'customer-relation' && <CustomerRelationModule />}
              {currentTab === 'procurement' && <ProcurementModule />}
              {currentTab === 'users' && <UserManagement />}
            </div>
          </ErrorBoundary>
        )}
      </main>

      {/* USER PROFILE MODAL */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenUserControl={handleOpenUserControl}
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
