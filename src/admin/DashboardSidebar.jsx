import logoImage from '../assets/logooo.png';

const menuItems = [
  { key: 'home', label: 'Edit Home Page', icon: '🏠' },
  { key: 'destinations', label: 'Manage Destination Page', icon: '🌍' },
  { key: 'treks', label: 'Manage Trek Page', icon: '⛰️' },
  { key: 'stories', label: 'Manage Stories Page', icon: '📖' },
  { key: 'gallery', label: 'Manage Gallery Page', icon: '🖼️' },
  { key: 'comments', label: 'Manage Comments Page', icon: '💬' },
  { key: 'contact', label: 'Edit Contact / Help Page', icon: '📞' },
  { key: 'about', label: 'Edit About Us Page', icon: 'ℹ️' },
  { key: 'filters', label: 'Manage Filters', icon: '🔍' },
];

export default function DashboardSidebar({ activeSection, onNavigate, onLogout }) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <img src={logoImage} alt="" />
        <span>Admin Panel</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`sidebar-link ${activeSection === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
