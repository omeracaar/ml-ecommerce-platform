import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import AddressSelector from '../components/AddressSelector';

function CartPage() {
  const [cart, setCart] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');


  const navigate = useNavigate();

  // backend den cektim
  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      if (response.data && response.data.status === 200) {
        setCart(response.data.payload);
      }
    } catch (err) {
      console.error("Sepet yüklenirken hata:", err);
      setError("Sepet yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  //miktar guncelleme
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // 1'in altına düşmesin

    try {
      const response = await api.put(`/cart/items/${itemId}`, null, {
        params: { quantity: newQuantity }
      });

      if (response.data.status === 200) {
        setCart(response.data.payload);
      }
    } catch (err) {
      alert("Miktar güncellenemedi: " + (err.response?.data?.errorMessage || err.message));
    }
  };

  //sepetten silme
  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Bu ürünü sepetten silmek istiyor musunuz?")) return;

    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      if (response.data.status === 200) {
        setCart(response.data.payload);
      }
    } catch (err) {
      alert("Silme başarısız.");
    }
  };

  //sepeti bosaltma
  const handleClearCart = async () => {
    if (!window.confirm("Tüm sepeti boşaltmak istediğinize emin misiniz?")) return;

    try {
      const response = await api.delete('/cart');
      if (response.data.status === 200) {
        setCart(response.data.payload);
      }
    } catch (err) {
      alert("Sepet temizlenemedi.");
    }
  };

  const handleCheckoutClick = () => {
    // Direkt sipariş oluşturmak yerine Modal'ı aç
    setShowAddressModal(true);
  };

  //modaldaki onayla buttonu
  const confirmOrder = async () => {
    if (!newAddress || newAddress.length < 10) {
      alert("Lütfen geçerli bir adres seçiniz.");
      return;
    }

    try {
      // Backend'e seçilen adresi gönderiyoruz
      const response = await api.post('/orders', null, {
        params: { shippingAddress: newAddress } 
      });

      if (response.data.status === 201) {
        alert(`Siparişiniz alındı! 🎉\nTeslimat Adresi: ${response.data.payload.shippingAddress}`);
        setCart(null);
        setShowAddressModal(false); // Modalı kapat
        navigate('/');
      }
    } catch (err) {
      console.error("Sipariş hatası:", err);
      alert("Hata: " + (err.response?.data?.errorMessage || "İşlem başarısız."));
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Sepet yükleniyor...</div>;
  if (error) return <div style={{textAlign:'center', marginTop:'50px', color:'red'}}>{error}</div>;


  
  //sepet bossa
  if (!cart || cart.cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Sepetiniz Boş 😔</h2>
        <button 
          onClick={() => navigate('/products')}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
        >
          Alışverişe Başla
        </button>
      </div>
    );
  }

  //doluysa
  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', position: 'relative' }}>
      <h2>Sepetim ({cart.totalItems} Ürün)</h2>
      
      <div style={{ borderTop: '1px solid #eee' }}>
        {cart.cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
            {/*ürün resmi*/}
            <img src={item.imageUrl} alt={item.productName} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', marginRight: '20px' }} />
            
            {/*ürün bilgisi*/}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0' }}>{item.productName}</h4>
              <span style={{ color: '#888' }}>Birim Fiyat: {item.price} TL</span>
            </div>

            {/* miktar kontrolü*/}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '30px' }}>
              <button 
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                style={btnStyle}
                disabled={item.quantity <= 1}
              >-</button>
              
              <span style={{ margin: '0 10px', fontWeight: 'bold' }}>{item.quantity}</span>
              
              <button 
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                style={btnStyle}
              >+</button>
            </div>

            {/*toplam fiyat */}
            <div style={{ width: '100px', fontWeight: 'bold', textAlign: 'right', marginRight: '20px' }}>
              {item.lineTotal.toFixed(2)} TL
            </div>

            {/*sil*/}
            <button 
              onClick={() => handleRemoveItem(item.id)}
              style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <h3>Toplam Tutar: {cart.totalPrice.toFixed(2)} TL</h3>
        
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
          <button 
            onClick={handleClearCart}
            style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Sepeti Temizle
          </button>
          
          {/*siparisi tamamla*/}
          <button 
            onClick={handleCheckoutClick} 
            style={{ padding: '10px 30px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
          >
            Siparişi Tamamla
          </button>
        </div>
      </div>

      {/*address modal i*/}
      {showAddressModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
            <h3 style={{marginTop: 0}}>Teslimat Adresi Seçimi</h3>
            <p style={{fontSize:'0.9rem', color:'#666', marginBottom: '20px'}}>Lütfen siparişin gönderileceği adresi belirleyin.</p>
            
            {/* Reusable Component*/}
            <AddressSelector onAddressChange={(addr) => setNewAddress(addr)} />

            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowAddressModal(false)}
                style={{ padding: '8px 15px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor:'pointer' }}
              >
                İptal
              </button>
              <button 
                onClick={confirmOrder}
                disabled={!newAddress} // adres yoksa butonu pasif yap
                style={{ 
                  padding: '8px 15px', 
                  backgroundColor: newAddress ? '#28a745' : '#99daa6', 
                  color: 'white', border: 'none', borderRadius: '4px', cursor: newAddress ? 'pointer' : 'not-allowed' 
                }}
              >
                Siparişi Onayla
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ---------------------------------------------- */}

    </div>
  );
}

const btnStyle = {
  width: '30px',
  height: '30px',
  display: 'flex',
  lineHeight: "5px",
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #ccc',
  backgroundColor: '#f8f9fa',
  cursor: 'pointer',
  borderRadius: '4px',
  padding: 0,       
  margin: 0,
};

export default CartPage;