import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AdminDashboardPage() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Backend'den verileri çek
        const orderRes = await api.get('/orders/admin');
        const orders = orderRes.data.payload?.content || orderRes.data.payload || [];

        const prodRes = await api.get('/products/getAll?page=0&size=1000');
        const products = prodRes.data.payload?.content || prodRes.data.payload || [];

        const revenue = orders
          .filter(o => o.orderStatus !== 'CANCELLED')
          .reduce((acc, curr) => acc + curr.totalPrice, 0);

        const lowStock = products.filter(p => p.stockQuantity < 5).length;

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          lowStockCount: lowStock
        });
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: '50px' }}>Veriler Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      <h1 style={{ color: '#333', marginBottom: '20px', fontSize: '1.8rem' }}>
        📊 Yönetim Paneli
      </h1>

      <div style={statsContainerStyle}>
        
        <div style={{ ...statsCardStyle, background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
          <h3>💰 Toplam Ciro</h3>
          <p style={bigNumberStyle}>{stats.totalRevenue.toLocaleString('tr-TR')} ₺</p>
        </div>

        <div style={{ ...statsCardStyle, background: 'linear-gradient(135deg, #6610f2 0%, #6f42c1 100%)' }}>
          <h3>📦 Toplam Sipariş</h3>
          <p style={bigNumberStyle}>{stats.totalOrders}</p>
        </div>

        <div style={{ ...statsCardStyle, background: 'linear-gradient(135deg, #fd7e14 0%, #f5af19 100%)' }}>
          <h3>🏷️ Toplam Ürün</h3>
          <p style={bigNumberStyle}>{stats.totalProducts}</p>
        </div>

        <div style={{ ...statsCardStyle, background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' }}>
          <h3>⚠️ Kritik Stok</h3>
          <p style={bigNumberStyle}>{stats.lowStockCount}</p>
          <small style={{ opacity: 0.9 }}>Azalan ürünler</small>
        </div>

      </div>

      <h3 style={{ margin: '30px 0 15px 0', color: '#555', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        Hızlı İşlemler
      </h3>

      <div style={menuGridStyle}>
        
        <div style={menuCardStyle} onClick={() => navigate('/admin/orders')}>
            <div style={{...iconBox, background: '#e3f2fd', color: '#1976d2'}}>📦</div>
            <div>
                <h4 style={cardTitle}>Sipariş Yönetimi</h4>
                <p style={cardDesc}>Siparişleri onayla, kargola veya iptal et.</p>
            </div>
        </div>

        <div style={menuCardStyle} onClick={() => navigate('/admin/products')}>
            <div style={{...iconBox, background: '#fff3e0', color: '#f57c00'}}>🏷️</div>
            <div>
                <h4 style={cardTitle}>Ürün Yönetimi</h4>
                <p style={cardDesc}>Ürün ekle, fiyatları ve stokları güncelle.</p>
            </div>
        </div>

        <div style={menuCardStyle} onClick={() => navigate('/admin/categories')}>
            <div style={{...iconBox, background: '#e8f5e9', color: '#388e3c'}}>📂</div>
            <div>
                <h4 style={cardTitle}>Kategori Yönetimi</h4>
                <p style={cardDesc}>Yeni kategoriler ve açıklamalar ekle.</p>
            </div>
        </div>

        <div style={menuCardStyle} onClick={() => navigate('/admin/users')}>
            <div style={{...iconBox, background: '#f3e5f5', color: '#7b1fa2'}}>👥</div>
            <div>
                <h4 style={cardTitle}>Kullanıcılar</h4>
                <p style={cardDesc}>Kayıtlı müşterileri listele ve incele.</p>
            </div>
        </div>

      </div>

    </div>
  );
}

const statsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
  gap: '20px',
};

const statsCardStyle = {
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  textAlign: 'center',
  color: 'white',
  cursor: 'default'
};

const bigNumberStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  margin: '10px 0'
};


const menuGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const menuCardStyle = {
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #eee',
  display: 'flex',
  alignItems: 'center',
  padding: '15px 20px',
  cursor: 'pointer',
  transition: 'transform 0.2s, boxShadow 0.2s',
};

const iconBox = {
  width: '50px',
  height: '50px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  marginRight: '15px',
  flexShrink: 0
};

const cardTitle = { margin: '0 0 5px 0', fontSize: '1.1rem', color: '#333' };
const cardDesc = { margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: '1.3' };

export default AdminDashboardPage;