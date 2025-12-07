import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  //secilen adet state i
  const [quantity, setQuantity] = useState(1); //varsayilan 1

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        if (response.data && response.data.status === 200) {
          setProduct(response.data.payload);
        } else {
          setError("Ürün bulunamadı.");
        }
      } catch (err) {
        console.error("Detay hatası:", err);
        setError("Ürün yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [productId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Lütfen önce giriş yapınız.");
      navigate('/login');
      return;
    }
    try {
      //secilen quantity yi gonder
      const response = await api.post('/cart/items', {
        productId: product.id,
        quantity: quantity 
      });
      
      if (response.data.status === 200) {
        alert(`${quantity} adet ürün sepete eklendi! 🛒`);
      }
    } catch (err) {
      console.error("Sepet hatası:", err);
      alert("Hata: " + (err.response?.data?.errorMessage || "Sepete eklenemedi."));
    }
  };

  //adet + - fonksiyonlari
  const increaseQty = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };


  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Yükleniyor...</div>;
  if (error) return <div style={{textAlign:'center', marginTop:'50px', color:'red'}}>{error}</div>;
  if (!product) return null;

  // Stiller
  const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '1rem' };
  const rowStyle = { borderBottom: '1px solid #eee' };
  const labelStyle = { padding: '12px 10px 12px 0', color: '#666', fontWeight: '600', width: '140px', verticalAlign: 'top', textAlign: 'left' };
  const valueStyle = { padding: '12px 0', color: '#333', lineHeight: '1.5', textAlign: 'left' };
  
  // Adet Butonu Stili
  const qtyBtnStyle = {
    width: '40px', height: '40px', 
    border: '1px solid #ddd', 
    backgroundColor: '#f8f9fa', 
    cursor: 'pointer', 
    fontSize: '1.2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#666', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
        &larr; <span style={{marginLeft: '5px'}}>Listeye Dön</span>
      </button>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/*sol taraf foto*/}
        <div style={{ flex: '1', minWidth: '350px', border: '1px solid #eee', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', display:'flex', justifyContent:'center', alignItems:'center' }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }} />
        </div>

        {/*sag detay tablo*/}
        <div style={{ flex: '1.2', minWidth: '350px' }}>
          
          <table style={tableStyle}>
            <tbody>
              <tr style={rowStyle}><td style={labelStyle}>Kategori</td><td style={valueStyle}>{product.categoryName || '-'}</td></tr>
              <tr style={rowStyle}><td style={labelStyle}>Marka</td><td style={valueStyle}>{product.brand || '-'}</td></tr>
              <tr style={rowStyle}><td style={labelStyle}>Ürün Adı</td><td style={{ ...valueStyle, fontWeight: 'bold' }}>{product.name}</td></tr>
              <tr style={rowStyle}><td style={labelStyle}>Açıklama</td><td style={valueStyle}>{product.description}</td></tr>
              <tr style={rowStyle}>
                <td style={labelStyle}>Fiyat</td>
                <td style={{ ...valueStyle, color: '#28a745', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                </td>
              </tr>
              <tr style={{ borderBottom: 'none' }}>
                <td style={labelStyle}>Durum</td>
                <td style={valueStyle}>
                  {product.stockQuantity > 0 ? (
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>Stokta Var ({product.stockQuantity} adet)</span>
                  ) : (
                    <span style={{ color: '#dc3545', fontWeight: 'bold' }}>Tükendi</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/*adet secimi*/}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            
            {product.stockQuantity > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ marginRight: '15px', fontWeight: '600', color: '#555' }}>Adet:</span>
                
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}>
                  <button onClick={decreaseQty} style={{ ...qtyBtnStyle, borderRight: '1px solid #ddd', border: 'none' }}>-</button>
                  
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    style={{ width: '50px', textAlign: 'center', border: 'none', fontSize: '1.1rem', fontWeight: 'bold' }} 
                  />
                  
                  <button onClick={increaseQty} style={{ ...qtyBtnStyle, borderLeft: '1px solid #ddd', border: 'none' }}>+</button>
                </div>
                
                <span style={{ marginLeft: '15px', fontSize: '0.9rem', color: '#888' }}>
                  (Maks. {product.stockQuantity})
                </span>
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              style={{ 
                width: '100%', 
                padding: '15px', 
                backgroundColor: product.stockQuantity > 0 ? '#333' : '#ccc', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '1rem',
                fontWeight: '600',
                cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseOver={(e) => { if(product.stockQuantity > 0) e.target.style.backgroundColor = '#555'; }}
              onMouseOut={(e) => { if(product.stockQuantity > 0) e.target.style.backgroundColor = '#333'; }}
            >
              {product.stockQuantity > 0 ? 'SEPETE EKLE' : 'STOKTA YOK'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;