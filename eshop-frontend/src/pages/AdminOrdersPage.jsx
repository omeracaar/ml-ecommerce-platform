import { useState, useEffect } from 'react';
import api from '../api'; 
import { useNavigate } from 'react-router-dom';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]); // Başlangıç her zaman boş dizi
  const [loading, setLoading] = useState(true);
  
  const statusOptions = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Backend: /rest/api/orders/admin (Senin controllera göre path bu olmalı)
      // Controllerda @RequestMapping("/rest/api/orders") ve metodda @GetMapping("/admin") var.
      const response = await api.get('/orders/admin');
      
      console.log("Admin API Yanıtı:", response.data); // Konsola basıp yapıyı görelim

      // GÜVENLİ VERİ ÇEKME (Defensive Programming)
      let incomingData = [];

      if (response.data && response.data.payload) {
        // Eğer Page yapısı varsa 'content' içindedir
        if (response.data.payload.content) {
            incomingData = response.data.payload.content;
        } 
        // Eğer direkt liste ise 'payload' kendisidir
        else if (Array.isArray(response.data.payload)) {
            incomingData = response.data.payload;
        }
      }

      setOrders(incomingData || []); // Asla null set etme, boş dizi olsun
      
    } catch (error) {
      console.error("Admin siparişleri çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/admin/${orderId}/status`, null, {
        params: { status: newStatus }
      });

      // State güncelleme
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      
      alert(`Sipariş #${orderId} güncellendi.`);
    } catch (error) {
      console.error("Hata:", error);
      alert("Durum güncellenemedi.");
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        🛠️ Admin Sipariş Yönetimi
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Kullanıcı</th>
              <th style={thStyle}>Tarih</th>
              <th style={thStyle}>Tutar</th>
              <th style={thStyle}>Adres</th>
              <th style={thStyle}>Durum</th>
              <th style={thStyle}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {/* orders dizisi boşsa bile map hata vermez, ama null ise verir. Yukarıda önlemini aldık. */}
            {orders && orders.length > 0 ? (
                orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={tdStyle}>#{order.id}</td>
                    {/* username yoksa userId gösterelim ki boş kalmasın */}
                    <td style={tdStyle}>{order.username || order.userId}</td>
                    
                    <td style={tdStyle}>
                        {/* Tarih null gelirse patlamasın diye kontrol */}
                        {order.createdDate || order.orderDate 
                            ? new Date(order.createdDate || order.orderDate).toLocaleDateString('tr-TR') 
                            : '-'}
                    </td>
                    
                    <td style={{ ...tdStyle, color: '#28a745', fontWeight: 'bold' }}>
                    {order.totalPrice?.toLocaleString('tr-TR')} TL
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.85rem', maxWidth: '200px' }}>
                    {order.shippingAddress}
                    </td>
                    
                    <td style={tdStyle}>
                    <span style={getStatusBadgeStyle(order.orderStatus)}>
                        {order.orderStatus}
                    </span>
                    </td>

                    <td style={tdStyle}>
                    <select 
                        value={order.orderStatus} 
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px', borderColor: '#ccc' }}
                    >
                        {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>Hiç sipariş bulunamadı.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Stiller aynı kalabilir
const thStyle = { padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' };
const tdStyle = { padding: '12px', verticalAlign: 'middle', color: '#212529' };
const getStatusBadgeStyle = (status) => {
  let backgroundColor = '#e2e3e5';
  let color = '#383d41';
  switch (status) {
    case 'PENDING': backgroundColor = '#fff3cd'; color = '#856404'; break;
    case 'PROCESSING': backgroundColor = '#cce5ff'; color = '#004085'; break;
    case 'SHIPPED': backgroundColor = '#d4edda'; color = '#155724'; break;
    case 'DELIVERED': backgroundColor = '#d1e7dd'; color = '#0f5132'; break;
    case 'CANCELLED': backgroundColor = '#f8d7da'; color = '#721c24'; break;
    default: break;
  }
  return { backgroundColor, color, padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block' };
};

export default AdminOrdersPage;