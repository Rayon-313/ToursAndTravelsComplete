import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from './AdminLogin';
import DashboardSidebar from './DashboardSidebar';
import EditHome from './EditHome';
import ManageDestinations from './ManageDestinations';
import ManageStories from './ManageStories';
import ManageGallery from './ManageGallery';
import EditAbout from './EditAbout';
import EditContact from './EditContact';
import ManageFilters from './ManageFilters';
import './admin.css';

export default function AdminPanel() {
  const { admin, loading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');

  if (loading) {
    return <div className="admin-loading"><div className="spinner" /></div>;
  }

  if (!admin) {
    return <AdminLogin />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <EditHome />;
      case 'destinations': return <ManageDestinations />;
      case 'stories': return <ManageStories />;
      case 'gallery': return <ManageGallery />;
      case 'about': return <EditAbout />;
      case 'contact': return <EditContact />;
      case 'filters': return <ManageFilters />;
      default: return <EditHome />;
    }
  };

  return (
    <div className="admin-layout">
      <DashboardSidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={logout}
      />
      <main className="admin-main">
        <div className="admin-header-bar">
          <h1>Welcome, {admin.username}</h1>
        </div>
        <div className="admin-content">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
