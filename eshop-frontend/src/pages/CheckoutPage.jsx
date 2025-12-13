import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AddressSelector from '../components/AddressSelector';

function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  //form stateleri
  const [address, setAddress] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  //backendden sepeti cek
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get('/cart'); 
        if (response.data.status === 200) {
          // --- DÜZELTME BURADA ---
          // Backend'den gelen yapı: payload: { cartItems: [...], totalPrice: 100 }
          const cartData = response.data.payload; 
          
          // Eğer sepet boşsa veya items yoksa ana sayfaya at
          if (!cartData || !cartData.cartItems || cartData.cartItems.length === 0) {
             console.warn("Sepet boş, ana sayfaya yönlendiriliyor.");
             navigate('/');
             return;
          }

          setCartItems(cartData.cartItems); // items dizisini al
          setTotalPrice(cartData.totalPrice); // Hazır hesaplanmış fiyatı al (frontend'de hesaplamaya gerek yok)
        }
      } catch (err) {
        console.error("Checkout sepet hatası:", err);
        navigate('/'); // Hata olursa ana sayfaya at
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  //kart numarası girerken her 4 hanede bir - attım ve validasyonlar
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, '$1-');
    setCardNumber(val);
  };

  //tarih girerken yıl ve ay arasına / atma ve validasyonlar
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setExpiry(val);
  };

  //cvv validasyon
  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.slice(0, 3);
    setCvv(val);
  };

  //siparişi tamamla
  const handlePlaceOrder = async () => {
    if (!address || address.length < 10) {
      alert("Lütfen geçerli bir adres seçiniz.");
      return;
    }
    //validasyon kart numarası - ler dahil 19 tarih / dahil 4
    if (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3) {
      alert("Lütfen kart bilgilerinizi eksiksiz giriniz.");
      return;
    }

    try {
      //backende sadece address gidiyor ama query param olarak
      const response = await api.post('/orders', null, {
        params: {
          shippingAddress: address
        }
      });

      if (response.data.status === 200 || response.status === 201) {
        alert("Siparişiniz başarıyla alındı! 🎉");
        navigate('/'); 
      }
    } catch (err) {
      console.error("Sipariş hatası:", err);
      alert("Sipariş oluşturulurken bir hata oluştu: " + (err.response?.data?.errorMessage || err.message));
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      
      {/*sol taraf*/}
      <div style={{ flex: '2', minWidth: '350px' }}>
        
        {/*adres*/}
        <div style={sectionStyle}>
          <h2 style={headerStyle}>1. Teslimat Adresi</h2>
          <AddressSelector onAddressChange={(val) => setAddress(val)} />
        </div>

        {/*odeme*/}
        <div style={{ ...sectionStyle, marginTop: '30px' }}>
          <h2 style={headerStyle}>2. Ödeme Bilgileri</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Kart Üzerindeki İsim" 
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={inputStyle}
            />
            
            <input 
              type="text" 
              placeholder="Kart Numarası (____-____-____-____)" 
              value={cardNumber}
              onChange={handleCardNumberChange}
              style={{...inputStyle, letterSpacing: '2px', fontFamily: 'monospace'}}
            />

            <div style={{ display: 'flex', gap: '20px' }}>
              <input 
                type="text" 
                placeholder="Ay/Yıl (AA/YY)" 
                value={expiry}
                onChange={handleExpiryChange}
                style={{ ...inputStyle, flex: 1, textAlign: 'center' }}
              />
              <input 
                type="password" 
                placeholder="CVV" 
                value={cvv}
                onChange={handleCvvChange}
                style={{ ...inputStyle, flex: 1, textAlign: 'center' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/*sag taraf siparis ozeti*/}
      <div style={{ flex: '1', minWidth: '300px' }}>
        <div style={{ backgroundColor: '#f9f9f9', padding: '25px', borderRadius: '10px', border: '1px solid #e0e0e0', position: 'sticky', top: '100px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>Sipariş Özeti</h3>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            {cartItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span>{item.productName} (x{item.quantity})</span>
                <span style={{ fontWeight: 'bold' }}>{(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Toplam:</span>
            <span style={{ color: '#28a745' }}>{totalPrice.toLocaleString('tr-TR')} TL</span>
          </div>

          <button 
            onClick={handlePlaceOrder}
            style={{
              width: '100%',
              marginTop: '25px',
              padding: '15px',
              backgroundColor: '#28a745', 
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(40, 167, 69, 0.3)'
            }}
          >
            Ödemeyi Yap ve Bitir
          </button>
          <div style={{textAlign:'center', marginTop:'10px', fontSize:'0.8rem', color:'#888'}}>
             🔒 Güvenli Ödeme Altyapısı
          </div>
        </div>
      </div>

    </div>
  );
}

//style
const sectionStyle = {
    padding: '25px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    backgroundColor: '#fff'
};

const headerStyle = {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '1.3rem',
    color: '#333',
    borderBottom: '2px solid #FFD700',
    display: 'inline-block',
    paddingBottom: '5px'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
    boxSizing: 'border-box'
};

export default CheckoutPage;