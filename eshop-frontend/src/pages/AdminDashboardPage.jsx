import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AdminDashboardPage() {
  const navigate = useNavigate();
  
  // İstatistik State'leri
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0 // stogu 5 in altindaki urunler
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        const orderRes = await api.get('/orders/admin');
        const orders = orderRes.data.payload?.content || orderRes.data.payload || [];

   
        const prodRes = await api.get('/products/getAll?page=0&size=1000'); 
        const products = prodRes.data.payload?.content || prodRes.data.payload || [];

        
        //toplam ciro:iptal edilmeyen siparislerin toplami
        const revenue = orders
          .filter(o => o.orderStatus !== 'CANCELLED')
          .reduce((acc, curr) => acc + curr.totalPrice, 0);

        //stok uyarısı
        const lowStock = products.filter(p => p.stockQuantity < 5).length;

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          lowStockCount: lowStock
        });

      } catch (error) {
        console.error("Dashboard verileri yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', color: '#333' }}>
        📊 Yönetim Paneli
      </h1>

      <div style={statsContainerStyle}>
        
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white' }}>
          <h3>💰 Toplam Gelir</h3>
          <p style={bigNumberStyle}>{stats.totalRevenue.toLocaleString('tr-TR')} TL</p>
        </div>

        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #6610f2 0%, #6f42c1 100%)', color: 'white' }}>
          <h3>📦 Toplam Sipariş</h3>
          <p style={bigNumberStyle}>{stats.totalOrders}</p>
        </div>

        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #fd7e14 0%, #f5af19 100%)', color: 'white' }}>
          <h3>🏷️ Toplam Ürün</h3>
          <p style={bigNumberStyle}>{stats.totalProducts}</p>
        </div>

        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', color: 'white' }}>
          <h3>⚠️ Kritik Stok</h3>
          <p style={bigNumberStyle}>{stats.lowStockCount}</p>
          <small>Stoğu 5'ten az olanlar</small>
        </div>

      </div>

      <h2 style={{ marginTop: '40px', color: '#555' }}>Hızlı İşlemler</h2>
      <div style={menuGridStyle}>
        
        <div style={menuCardStyle} onClick={() => navigate('/admin/orders')}>
            <span style={{ fontSize: '3rem' }}>📦</span>
            <h3>Sipariş Yönetimi</h3>
            <p>Sipariş durumlarını güncelle, detayları gör.</p>
        </div>

        <div style={menuCardStyle} onClick={() => navigate('/admin/products')}>
            <span style={{ fontSize: '3rem' }}>🏷️</span>
            <h3>Ürün Yönetimi</h3>
            <p>Yeni ürün ekle, fiyat güncelle, ürün sil.</p>
        </div>

        {/*gelistirme icin placeholder*/}
        <div style={{ ...menuCardStyle, opacity: 0.6, cursor: 'not-allowed' }}>
            <span style={{ fontSize: '3rem' }}>👥</span>
            <h3>Kullanıcılar</h3>
            <p>(Yakında) Kayıtlı kullanıcıları listele.</p>
        </div>

      </div>

    </div>
  );
}

const statsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const cardStyle = {
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const bigNumberStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  margin: '10px 0'
};

const menuGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px'
};

const menuCardStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s, boxShadow 0.2s',
  border: '1px solid #eee'
};

export default AdminDashboardPage;