import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  //sepeti backendden cek
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

  //miktar guncelle
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; 

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

  //sepetten sil
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

  //sepeti bosalt
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

  //yukleniyor veya hata durumu
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

  //sepet doluysa
  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <h1>Sepetim ({cart.totalItems} Ürün)</h1>
      
      {/*urun listesi*/}
      <div style={{ borderTop: '1px solid #eee' }}>
        {cart.cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #eee' }}>
            
            {/*urun resmi*/}
            <img src={item.imageUrl} alt={item.productName} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', marginRight: '20px' }} />
            
            {/*urun bilgisi*/}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.productName}</h4>
              <span style={{ color: '#888' }}>Birim Fiyat: {item.price} TL</span>
            </div>

            {/*miktar kontrolu*/}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '30px' }}>
              <button 
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                style={btnStyle}
                disabled={item.quantity <= 1}
              >-</button>
              
              <span style={{ margin: '0 15px', fontWeight: 'bold', fontSize: '1.1rem' }}>{item.quantity}</span>
              
              <button 
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                style={btnStyle}
              >+</button>
            </div>

            {/*toplam fiyat*/}
            <div style={{ width: '120px', fontWeight: 'bold', textAlign: 'right', marginRight: '20px', fontSize: '1.1rem' }}>
              {item.lineTotal.toFixed(2)} TL
            </div>

            {/*sil*/}
            <button 
              onClick={() => handleRemoveItem(item.id)}
              style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}
              title="Sepetten Sil"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/*alt kisim ve butonlar*/}
      <div style={{ marginTop: '30px', textAlign: 'right', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
          Toplam: <span style={{ color: '#28a745' }}>{cart.totalPrice.toFixed(2)} TL</span>
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={handleClearCart}
            style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Sepeti Temizle
          </button>
          
          {/* checkouta git*/}
          <button 
            onClick={() => navigate('/checkout')} 
            style={{ 
              padding: '15px 40px', 
              backgroundColor: '#FFD700', // Gold Tema
              color: '#000', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            Siparişi Tamamla &rarr;
          </button>
        </div>
      </div>

    </div>
  );
}

//btn style
const btnStyle = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #ddd',
  backgroundColor: 'white',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '1.2rem',
  color: '#333'
};

export default CartPage;