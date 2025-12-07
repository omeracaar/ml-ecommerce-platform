import { useState, useEffect } from 'react'
import { Link ,useSearchParams} from 'react-router-dom'
import api from '../api'; 

function HomePage() {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [totalPages, setTotalPages] = useState(0);

  // --- YENİ YAPI ---
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL'de 'page' varsa onu al (String gelir, sayıya çevir), yoksa 0 yap.
  const currentPage = parseInt(searchParams.get('page') || '0');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/getAll?page=${currentPage}&size=10`); 
        
        if (response.data && response.data.status === 200) {
          setProducts(response.data.payload.content); 
          setTotalPages(response.data.payload.totalPages); 
        }
      } catch (err) {
        console.error(err);
        setError("Hata: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]);

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
      
      {/*urun listesi */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent:'center', padding:'20px' }}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} style={{ border: '1px solid #e0e0e0', borderRadius:'8px', padding: '15px', width: '220px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)' }}>
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius:'4px' }} />
            <h3 style={{fontSize:'1.1rem', margin:'10px 0'}}>{product.name}</h3>
          </Link>

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

      {totalPages > 1 && (
        <div style={{ margin: '40px 0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          
          {/*onceki sayfa*/}
          <button 
            onClick={() => setSearchParams({ page: Math.max(0, currentPage - 1) })} // <-- URL GÜNCELLİYORUZ
            disabled={currentPage === 0}
            style={{...pageBtnStyle, opacity: currentPage === 0 ? 0.5 : 1}}
          >
            &lt; Önceki
          </button>

          {/* sayfa numarasi */}
          {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setSearchParams({ page: pageNum })} // <-- URL GÜNCELLİYORUZ
              style={{
                ...pageBtnStyle,
                backgroundColor: currentPage === pageNum ? '#007bff' : '#f8f9fa',
                color: currentPage === pageNum ? 'white' : 'black',
                borderColor: currentPage === pageNum ? '#007bff' : '#ccc'
              }}
            >
              {pageNum + 1}
            </button>
          ))}

          {/* sonraki sayfa */}
          <button 
            onClick={() => setSearchParams({ page: Math.min(totalPages - 1, currentPage + 1) })} // <-- URL GÜNCELLİYORUZ
            disabled={currentPage === totalPages - 1}
            style={{...pageBtnStyle, opacity: currentPage === totalPages - 1 ? 0.5 : 1}}
          >
            Sonraki &gt;
          </button>
        </div>
      )}
    </div>
  );
}

const pageBtnStyle = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};
export default HomePage;
