import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAll as getRawMaterials, getAlerts } from '../../api/rawMaterials';
import { getAll as getProducts } from '../../api/products';
import { getAll as getOrders } from '../../api/productionOrders';
import { listUsers } from '../../api/auth';

const STATUS_COLORS = {
  PLANIFIE:  { bg: '#eff6ff', color: '#3b82f6' },
  EN_COURS:  { bg: '#fefce8', color: '#ca8a04' },
  TERMINE:   { bg: '#f0fdf4', color: '#16a34a' },
  ANNULE:    { bg: '#fef2f2', color: '#dc2626' },
};

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${accent}` }}>
      <div style={styles.cardIcon}>{icon}</div>
      <div>
        <div style={styles.cardValue}>{value ?? '—'}</div>
        <div style={styles.cardLabel}>{label}</div>
        {sub && <div style={styles.cardSub}>{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getRawMaterials(),
      getAlerts(),
      getProducts(),
      getOrders(),
      listUsers(),
    ]).then(([mats, alrt, prods, orders, users]) => {
      setStats({
        materials: mats.data.length,
        products:  prods.data.length,
        orders:    orders.data.length,
        users:     users.data.length,
        alerts:    alrt.data.length,
        planifie:  orders.data.filter(o => o.status === 'PLANIFIE').length,
        enCours:   orders.data.filter(o => o.status === 'EN_COURS').length,
        termine:   orders.data.filter(o => o.status === 'TERMINE').length,
      });
      setRecentOrders(orders.data.slice(-5).reverse());
      setAlerts(alrt.data.slice(0, 5));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div style={styles.loading}>Loading…</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 style={styles.pageTitle}>Dashboard</h1>

      {/* Stat cards */}
      <div style={styles.grid}>
        <StatCard icon="🧱" label="Raw Materials"      value={stats.materials} accent="#3b82f6" />
        <StatCard icon="📦" label="Products"           value={stats.products}  accent="#8b5cf6" />
        <StatCard icon="🏭" label="Production Orders"  value={stats.orders}    accent="#f59e0b"
          sub={`${stats.planifie} planned · ${stats.enCours} in progress`} />
        <StatCard icon="👥" label="Users"              value={stats.users}     accent="#10b981" />
        <StatCard icon="⚠️" label="Stock Alerts"       value={stats.alerts}    accent="#ef4444"
          sub="Materials below threshold" />
        <StatCard icon="✅" label="Completed Orders"   value={stats.termine}   accent="#06b6d4" />
      </div>

      <div style={styles.row}>
        {/* Recent orders */}
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Recent Production Orders</h3>
          {recentOrders.length === 0
            ? <p style={styles.empty}>No orders yet.</p>
            : <table style={styles.table}>
                <thead>
                  <tr>
                    {['Product', 'Qty', 'Operator', 'Status'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o._id}>
                      <td style={styles.td}>{o.product?.name ?? '—'}</td>
                      <td style={styles.td}>{o.quantity}</td>
                      <td style={styles.td}>{o.operator?.name ?? '—'}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...STATUS_COLORS[o.status] }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>

        {/* Stock alerts */}
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>⚠️ Stock Alerts</h3>
          {alerts.length === 0
            ? <p style={styles.empty}>All stock levels are healthy.</p>
            : alerts.map(m => (
                <div key={m._id} style={styles.alertRow}>
                  <div>
                    <div style={styles.alertName}>{m.name}</div>
                    <div style={styles.alertRef}>{m.reference}</div>
                  </div>
                  <div style={styles.alertQty}>
                    <span style={styles.alertQtyVal}>{m.quantity} {m.unit}</span>
                    <span style={styles.alertThreshold}>threshold: {m.alertThreshold}</span>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </AdminLayout>
  );
}

const styles = {
  pageTitle: { fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 24 },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', fontSize: 16, color: '#64748b' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 32 },
  card: {
    background: '#fff', borderRadius: 12, padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  cardIcon: { fontSize: 32 },
  cardValue: { fontSize: 28, fontWeight: 700, color: '#1e293b' },
  cardLabel: { fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 2 },
  cardSub: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  panel: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
  panelTitle: { fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 },
  empty: { color: '#94a3b8', fontSize: 13 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: 12, color: '#94a3b8', fontWeight: 600, paddingBottom: 10, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase' },
  td: { padding: '10px 0', fontSize: 13, color: '#334155', borderBottom: '1px solid #f8fafc' },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  alertRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
  alertName: { fontSize: 14, fontWeight: 600, color: '#1e293b' },
  alertRef: { fontSize: 12, color: '#94a3b8' },
  alertQty: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  alertQtyVal: { fontSize: 14, fontWeight: 700, color: '#ef4444' },
  alertThreshold: { fontSize: 11, color: '#94a3b8' },
};
