import { NavLink, useNavigate } from 'react-router-dom';

const NAV = [
  { to: '/admin/dashboard',          icon: '📊', label: 'Dashboard' },
  { to: '/admin/raw-materials',      icon: '🧱', label: 'Raw Materials' },
  { to: '/admin/products',           icon: '📦', label: 'Products' },
  { to: '/admin/production-orders',  icon: '🏭', label: 'Production Orders' },
  { to: '/admin/stock-movements',    icon: '🔄', label: 'Stock Movements' },
  { to: '/admin/users',              icon: '👥', label: 'Users' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={{ fontSize: 22 }}>⚙️</span>
          <span style={styles.brandText}>FactoryFlow</span>
        </div>
        <nav style={styles.nav}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}
            >
              <span style={styles.linkIcon}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} style={styles.logoutBtn}>
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* Main */}
      <div style={styles.main}>
        <header style={styles.topbar}>
          <span style={styles.topbarRole}>Admin Panel</span>
        </header>
        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
}

const styles = {
  shell: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f1f5f9' },
  sidebar: {
    width: 240,
    background: '#1e293b',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '0 24px 28px',
    borderBottom: '1px solid #334155',
  },
  brandText: { color: '#f8fafc', fontWeight: 700, fontSize: 18 },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, padding: '20px 12px', flex: 1 },
  link: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', borderRadius: 8,
    color: '#94a3b8', textDecoration: 'none',
    fontSize: 14, fontWeight: 500,
    transition: 'all 0.15s',
  },
  linkActive: { background: '#3b82f6', color: '#fff' },
  linkIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  logoutBtn: {
    margin: '0 12px',
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', borderRadius: 8,
    background: 'transparent', border: '1px solid #334155',
    color: '#94a3b8', cursor: 'pointer', fontSize: 14,
  },
  main: { marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: {
    height: 60, background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center',
    padding: '0 32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  topbarRole: { fontWeight: 600, color: '#1e293b', fontSize: 15 },
  content: { padding: 32, flex: 1 },
};
