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

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="HomePage">
      <h1>Ürün Listesi</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <h3>{product.name}</h3>
              <p><b>{product.price} TL</b></p>
              {/* Buraya Sepete Ekle Butonu Gelecek */}
              <button style={{ marginTop: '10px', width: '100%', padding: '5px', cursor: 'pointer' }}>Sepete Ekle</button>
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