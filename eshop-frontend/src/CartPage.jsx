import { useState, useEffect } from 'react';
import api from '../api'; // Senin api.js'in
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
    if (newQuantity < 1) return; // 1 den az olamaz

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
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h2>Sepetim ({cart.totalItems} Ürün)</h2>
      
      <div style={{ borderTop: '1px solid #eee' }}>
        {cart.cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
            {/* Ürün Resmi */}
            <img src={item.imageUrl} alt={item.productName} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', marginRight: '20px' }} />
            
            {/* Ürün Bilgisi */}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0' }}>{item.productName}</h4>
              <span style={{ color: '#888' }}>Birim Fiyat: {item.price} TL</span>
            </div>

            {/* Miktar Kontrolü */}
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

            {/* Toplam Fiyat */}
            <div style={{ width: '100px', fontWeight: 'bold', textAlign: 'right', marginRight: '20px' }}>
              {item.lineTotal.toFixed(2)} TL
            </div>

            {/* Sil Butonu */}
            <button 
              onClick={() => handleRemoveItem(item.id)}
              style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/*alt kisim ve butonlar*/ }
      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <h3>Toplam Tutar: {cart.totalPrice.toFixed(2)} TL</h3>
        
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
          <button 
            onClick={handleClearCart}
            style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Sepeti Temizle
          </button>
          
          <button 
            onClick={() => alert("Sipariş oluşturma (Checkout) sayfasına gidilecek...")}
            style={{ padding: '10px 30px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
          >
            Siparişi Tamamla
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  width: '30px', height: '30px', border: '1px solid #ccc', backgroundColor: '#f8f9fa', cursor: 'pointer', borderRadius: '4px'
};

export default CartPage;