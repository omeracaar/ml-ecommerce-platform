import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const sliderRef = useRef(null);

  const currentPage = parseInt(searchParams.get('page') || '0');
  const selectedCategoryId = parseInt(searchParams.get('categoryId') || '0');

  // Kategori çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data.status === 200) {
          const allCategories = [{ id: 0, name: "Tüm Ürünler" }, ...response.data.payload];
          setCategories(allCategories);
        }
      } catch (err) {
        console.error("Kategoriler yüklenemedi:", err);
      }
    };
    fetchCategories();
  }, []);


  // Ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let endpoint;
        if (selectedCategoryId === 0) {
          endpoint = `/products/getAll?page=${currentPage}&size=10`;
        } else {
          endpoint = `/products/category/${selectedCategoryId}?page=${currentPage}&size=10`;
        }

        const response = await api.get(endpoint);
        
        if (response.data && response.data.status === 200) {
          setProducts(response.data.payload.content);
          setTotalPages(response.data.payload.totalPages);
        } else {
            setProducts([]);
            setTotalPages(0);
        }
      } catch (err) {
        console.error(err);
        setError("Hata: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, selectedCategoryId]);


  // -- ML Öneri Çekme --
  useEffect(() => {
    if (selectedCategoryId === 0) {
      const fetchRecommendations = async () => {
        try {
          const response = await api.get('/products/recommendations');
          if (response.data && response.data.status === 200) {
            setRecommendations(response.data.payload || []);
          }
        } catch (err) {
          console.error("Öneri getirme hatası:", err);
          setRecommendations([]);
        }
      };
      fetchRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [selectedCategoryId]); 

  const scrollSlider = (direction) => {
    if(sliderRef.current){
        const { current } = sliderRef;
        const scrollAmount = 250; 
        if(direction === 'left'){
            current.scrollLeft -= scrollAmount;
        } else {
            current.scrollLeft += scrollAmount;
        }
    }
  };

  // Sepete ekleme
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Lütfen önce giriş yapınız.");
      window.location.href = '/login';
      return;
    }
    try {
      const response = await api.post('/cart/items', { productId: productId, quantity: 1 });
      if (response.data.status === 200) {
        alert("Ürün sepete eklendi! 🛒");
      }
    } catch (err) {
      console.error("Sepet hatası:", err);
      alert("Hata: " + (err.response?.data?.errorMessage || "Sepete eklenemedi."));
    }
  };

  if (loading && products.length === 0) return <div style={{textAlign:'center', marginTop:'20px'}}>Yükleniyor...</div>;
  if (error) return <div style={{textAlign:'center', marginTop:'20px', color:'red'}}>Hata: {error}</div>;

  const ProductCard = ({ product, isRecommendation = false }) => {
    const currentCardStyle = isRecommendation ? smallRecCardStyle : cardStyle;
    const currentImgHeight = isRecommendation ? smallImgHeight : normalImgHeight;
    const currentTitleSize = isRecommendation ? smallTitleSize : normalTitleSize;
    const currentPriceSize = isRecommendation ? smallPriceSize : normalPriceSize;

    return (
    <div key={product.id} style={currentCardStyle}>
      {isRecommendation && <div style={recTagStyle}>Sana Özel ✨</div>}
      
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ width: '100%', height: currentImgHeight, objectFit: 'cover', borderRadius:'4px' }} 
        />
        <h3 
            style={{fontSize: currentTitleSize, margin:'8px 0', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',color: '#333'}} 
            title={product.name}
        >
            {product.name}
        </h3>
      </Link>

      <p style={{color:'#666', fontSize:'0.8rem', height:'32px', overflow:'hidden', marginBottom:'5px', lineHeight:'1.2'}}>
        {product.description}
      </p>
      
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'5px'}}>
        <span style={{fontWeight:'bold', fontSize: currentPriceSize, color:'#28a745'}}>{product.price} TL</span>
        {!isRecommendation && <span style={{fontSize:'0.8rem', color:'#888'}}>{product.categoryName}</span>}
      </div>
      
      <button 
        onClick={() => handleAddToCart(product.id)}
        style={{ 
            marginTop: '10px', 
            width: '100%', 
            padding: isRecommendation ? '6px' : '10px', 
            cursor: 'pointer', 
            backgroundColor: isRecommendation ? '#ffc107' : '#007bff', 
            color: isRecommendation ? 'black' : 'white', 
            border:'none', 
            borderRadius:'5px', 
            fontWeight:'bold',
            fontSize: isRecommendation ? '0.85rem' : '1rem'
        }}
      >
        Sepete Ekle
      </button>
    </div>
  )};


  return (
    <div className="HomePage" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {recommendations.length > 0 && selectedCategoryId === 0 && (
        <div style={recommendationSectionStyle}>
          <h2 style={recommendationTitleStyle}>
             Sizin İçin Seçtiklerimiz
          </h2>
          
          <div style={{ position: 'relative', padding: '0 10px' }}>
            
            {/* SOL BUTON */}
            <button 
                onClick={() => scrollSlider('left')} 
                style={{ ...sliderBtnStyle, left: '-20px' }}
            >
                &#10094;
            </button>

            {/* Scroll Container */}
            <div 
                ref={sliderRef}
                style={{ 
                    display: 'flex', 
                    gap: '30px',
                    padding: '20px 5px', 
                    overflowX: 'auto', 
                    scrollBehavior: 'smooth',
                    flexWrap: 'nowrap',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
                className="hide-scrollbar"
            >
                {recommendations.map(product => (
                <div key={product.id} style={{ minWidth: smallCardWidth }}>
                     <ProductCard product={product} isRecommendation={true} />
                </div>
                ))}
            </div>

            <button 
                onClick={() => scrollSlider('right')} 
                style={{ ...sliderBtnStyle, right: '-20px' }}
            >
                &#10095;
            </button>

          </div>
        </div>
      )}

      <h1 style={{textAlign:'center', marginBottom: '30px', marginTop:'30px', color: '#333', fontSize: '1.8rem'}}>
        {categories.find(c => c.id === selectedCategoryId)?.name || "Ürünler"}
      </h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center' }}>
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p style={{textAlign:'center', width:'100%', color:'#666'}}>Bu kategoride ürün bulunamadı.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ margin: '40px 0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button 
            onClick={() => setSearchParams({ page: Math.max(0, currentPage - 1), categoryId: selectedCategoryId })}
            disabled={currentPage === 0}
            style={{...pageBtnStyle, opacity: currentPage === 0 ? 0.5 : 1}}
          >
            &lt; Önceki
          </button>

          {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setSearchParams({ page: pageNum, categoryId: selectedCategoryId })}
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

          <button 
            onClick={() => setSearchParams({ page: Math.min(totalPages - 1, currentPage + 1), categoryId: selectedCategoryId })}
            disabled={currentPage === totalPages - 1}
            style={{...pageBtnStyle, opacity: currentPage === totalPages - 1 ? 0.5 : 1}}
          >
            Sonraki &gt;
          </button>
        </div>
      )}

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}


const normalCardWidth = '240px'; 
const normalImgHeight = '180px';
const normalTitleSize = '1.1rem';
const normalPriceSize = '1.2rem';

const cardStyle = { border:'1px solid #e0e0e0', borderRadius:'8px', padding: '15px', width: normalCardWidth, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', backgroundColor: 'white', position: 'relative', transition: 'transform 0.2s' };

const smallCardWidth = '170px'; 
const smallImgHeight = '120px';
const smallTitleSize = '0.9rem';
const smallPriceSize = '1rem';

const smallRecCardStyle = { 
    ...cardStyle, 
    width: smallCardWidth,
    padding: '10px', 
    border: '2px solid #ffc107', 
    boxShadow: '0 4px 12px rgba(255, 193, 7, 0.25)', 
    backgroundColor: '#fffdf5' 
};

const pageBtnStyle = { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' };
const recommendationSectionStyle = { marginTop: '20px', marginBottom: '30px', padding: '0 10px', backgroundColor: '#fff', borderRadius: '15px', border: '1px solid #ffc107', boxShadow: '0 0 15px rgba(255, 193, 7, 0.1)' };
const recommendationTitleStyle = { textAlign: 'center', color: '#333', marginBottom: '5px', marginTop:'20px', fontSize:'1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const recTagStyle = { position: 'absolute', top: '-10px', right: '-5px', backgroundColor: '#ffc107', color: '#000', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.65rem', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', zIndex:2 };

const sliderBtnStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    zIndex: 10,
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    transition: 'opacity 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
};

export default HomePage;