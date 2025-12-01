import { useState, useEffect } from 'react'
import api from '../api'; 

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("API'ye istek atılıyor...");
        // baseURL oldugu icin sadece endpoint i yaz
        const response = await api.get('/products/getAll?page=0&size=10'); 
        
        if (response.data && response.data.status === 200 && response.data.payload) {
          setProducts(response.data.payload.content);
        } else {
          setError("Beklenmedik cevap formatı.");
        }
      } catch (err) {
        console.error(err);
        setError("Hata oluştu: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    //once kullanıcı login mi kontrolu
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Lütfen önce giriş yapınız.");
      window.location.href = '/login';
      return;
    }
    try {

      const response = await api.post('/cart/items', {
        productId: productId,
        quantity: 1
      });

      if (response.data.status === 200) {
        alert("Ürün sepete eklendi! 🛒");
      }
    } catch (err) {
      console.error("Sepete ekleme hatası:", err);
      const errorMessage = err.response?.data?.errorMessage || "Sepete eklenirken bir hata oluştu.";
      alert("Hata: " + errorMessage);
    }
  };

 if (loading) return <div style={{textAlign:'center', marginTop:'20px'}}>Yükleniyor...</div>;
  if (error) return <div style={{textAlign:'center', marginTop:'20px', color:'red'}}>Hata: {error}</div>;

  return (
    <div className="HomePage">
      <h1 style={{textAlign:'center'}}>Ürün Listesi</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent:'center', padding:'20px' }}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} style={{ border: '1px solid #e0e0e0', borderRadius:'8px', padding: '15px', width: '220px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius:'4px' }} />
              <h3 style={{fontSize:'1.1rem', margin:'10px 0'}}>{product.name}</h3>
              <p style={{color:'#555', fontSize:'0.9rem', height:'40px', overflow:'hidden'}}>{product.description}</p>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px'}}>
                <span style={{fontWeight:'bold', fontSize:'1.2rem', color:'#28a745'}}>{product.price} TL</span>
                <span style={{fontSize:'0.8rem', color:'#888'}}>{product.categoryName}</span>
              </div>
              <button 
                onClick={() => handleAddToCart(product.id)}
                style={{ marginTop: '15px', width: '100%', padding: '10px', cursor: 'pointer', backgroundColor:'#007bff', color:'white', border:'none', borderRadius:'5px', fontWeight:'bold' }}
              >
                Sepete Ekle
              </button>
            </div>
          ))
        ) : (
          <p>Ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;