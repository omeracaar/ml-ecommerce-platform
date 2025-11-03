import { useState, useEffect } from 'react' // React'in temel "hook"larını import et
import axios from 'axios' // Az önce kurduğumuz axios'u import et
import './App.css' // CSS dosyası (daha sonra düzenleriz)

// Spring Boot API'mizin ana adresi
const API_URL = "http://localhost:8080/rest/api";

function App() {
  // Değişkenleri tanımlayalım:
  // 1. 'products': Ürün listesini tutacağımız state (değişken)
  // 2. 'loading': Veri gelirken "Yükleniyor..." yazısı göstermek için
  // 3. 'error': Bir hata olursa göstermek için
  const [products, setProducts] = useState([]); // Başlangıçta boş bir liste
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect: Bu component (App) ekrana ilk yüklendiğinde
  // sadece 1 kez çalışacak olan kod bloğu.
  useEffect(() => {
    // Ürünleri çeken fonksiyonu tanımla
    const fetchProducts = async () => {
      try {
        console.log("API'ye istek atılıyor: " + `${API_URL}/products`);

        // Axios ile Spring Boot'a GET isteği at
        // Sayfalama için ?page=0&size=10 ekleyelim
        const response = await axios.get(`${API_URL}/products/getAll?page=0&size=10`);        // Gelen cevabı kontrol et (Bizim RootEntity yapımız)
        if (response.data && response.data.status === 200 && response.data.payload) {
          console.log("API'den cevap alındı:", response.data);
          // Payload'ın içindeki "content" (ürün listesi) bizim aradığımız şey
          setProducts(response.data.payload.content);
        } else {
          setError("API'den beklenen formatta cevap gelmedi.");
        }
      } catch (err) {
        // Hata olursa (CORS hatası, 404, 500 veya API'ye ulaşılamazsa)
        console.error("API isteği hatası:", err);
        setError("Ürünler yüklenirken bir hata oluştu: " + err.message);
      } finally {
        // Hata da olsa, başarılı da olsa yükleme bitti
        setLoading(false);
      }
    };

    fetchProducts(); // Fonksiyonu çalıştır
  }, []); // [] -> Bu "useEffect" sadece 1 kez çalışsın demek


  // --- Ekrana Çizilecek Kısım (Render) ---

  // 1. Yükleniyorsa...
  if (loading) {
    return <div>Yükleniyor... Lütfen Spring Boot'un çalıştığından emin olun.</div>;
  }

  // 2. Hata varsa...
  if (error) {
    return <div>HATA: {error} (CORS hatası mı? Spring Boot SecurityConfig'i kontrol et)</div>;
  }

  // 3. Başarılıysa, ürünleri listele...
  return (
    <div className="App">
      <h1>E-Ticaret Sitemiz</h1>
      <h2>Ürünler</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100px', height: '100px' }} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><b>Fiyat: {product.price} TL</b></p>
              <p>Stok: {product.stockQuantity}</p>
              <p><small>Kategori: {product.categoryName}</small></p>
            </div>
          ))
        ) : (
          <p>Ürün bulunamadı (veya `data.sql`'de ürün yok).</p>
        )}
      </div>
    </div>
  );
}

export default App