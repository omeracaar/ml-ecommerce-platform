import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ username: '', email: '' }); 
  const navigate = useNavigate();

  useEffect(() => {
    //kullanici bilgisi localden ya da endpointten
    const storedUser = localStorage.getItem('username');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser({ username: storedUser });

    //siparisleri cek
    const fetchOrders = async () => {
      try {
        //userin kendi siparisleri
        const response = await api.get('/orders/my'); 
        
        const incomingData = response.data.payload || response.data;

        if (Array.isArray(incomingData)) {
          // siparisleri tarihe gore siraladim 
          const sortedOrders = incomingData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
          setOrders(sortedOrders);
        }
      } catch (err) {
        console.error("Siparişler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      
      {/*profil basligi*/}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#333', borderRadius: '50%', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div style={{ marginLeft: '20px' }}>
          <h1 style={{ margin: 0 }}>Merhaba, {user.username} 👋</h1>
          <p style={{ color: '#666', margin: '5px 0' }}>Siparişlerini buradan takip edebilirsin.</p>
        </div>
      </div>

      {/*siparis listesi*/}
      <h2 style={{ color: '#333', borderLeft: '5px solid #FFD700', paddingLeft: '15px' }}>Geçmiş Siparişlerim</h2>

      {orders.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center', marginTop: '20px' }}>
          <p>Henüz hiç sipariş vermediniz.</p>
          <button onClick={() => navigate('/')} style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Alışverişe Başla</button>
        </div>
      ) : (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order.id} style={orderCardStyle}>
              
              {/*ust bilgi satiri*/}
              <div style={orderHeaderStyle}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#888' }}>Sipariş Tarihi</span>
                  <div style={{ fontWeight: 'bold' }}>
                    {new Date(order.orderDate).toLocaleDateString('tr-TR')} - {new Date(order.orderDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#888' }}>Sipariş No</span>
                  <div style={{ fontWeight: 'bold' }}>#{order.id}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#888' }}>Toplam Tutar</span>
                  <div style={{ fontWeight: 'bold', color: '#28a745' }}>{order.totalPrice.toLocaleString('tr-TR')} TL</div>
                </div>
                <div>
                   {/* siparis durumu backendden geliyor*/}
                   <span style={{ padding: '5px 10px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                     {order.orderStatus === 'PROCESSING' ? 'Hazırlanıyor 📦' : order.orderStatus}
                   </span>
                </div>
              </div>

              {/*siparis icerigi*/}
              <div style={{ padding: '20px' }}>
                 <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#555' }}>
                   Teslimat Adresi: <span style={{fontWeight:'normal'}}>{order.shippingAddress}</span>
                 </p>
                 
                 <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                   {order.orderItems && order.orderItems.map((item, index) => (
                     <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        
                        {/*resim varsa goster yoksa kutu goster*/}
                        <div style={{ width: '60px', height: '60px', marginRight: '15px', flexShrink: 0 }}>
                            {item.imageUrl ? (
                                // urun resmine tiklaninca urune git
                                <Link to={`/product/${item.productId}`}>
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.productName} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px', border: '1px solid #eee' }} 
                                    />
                                </Link>
                            ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', borderRadius: '5px', display:'flex', alignItems:'center', justifyContent:'center' }}>🛍️</div>
                            )}
                        </div>
                          
                        <div style={{ flex: 1 }}>
                          {/*urun ismine tiklayinca da urune gitsin*/}
                        <div style={{ fontWeight: '600' }}>
                            <Link to={`/product/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.productName}
                            </Link>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#888' }}>{item.quantity} adet x {item.priceAtPurchase} TL</div>
                        </div>
                        {/* lineTotal backendden geliyor mu diye kontrol et yoksa hesapla */}
                        <div style={{ fontWeight: 'bold' }}>
                            {item.lineTotal 
                                ? item.lineTotal.toLocaleString('tr-TR') 
                                : (item.priceAtPurchase * item.quantity).toLocaleString('tr-TR')} TL
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

//style
const orderCardStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
};

const orderHeaderStyle = {
  backgroundColor: '#f8f9fa',
  padding: '15px 20px',
  borderBottom: '1px solid #e0e0e0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px'
};

export default ProfilePage;