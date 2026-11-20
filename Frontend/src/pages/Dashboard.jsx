import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h2>FactoryFlow — Dashboard</h2>
      <p>Welcome! Use the navigation to manage production orders, products, and raw materials.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
