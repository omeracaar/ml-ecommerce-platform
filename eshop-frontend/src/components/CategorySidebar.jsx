import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function CategorySidebar({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await api.get('/categories');
          if (response.data.status === 200) {
            setCategories([{ id: 0, name: "Tüm Ürünler" }, ...response.data.payload]);
          }
        } catch (err) {
          console.error("Kategoriler yüklenemedi", err);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/?page=0&categoryId=${categoryId}`);
    onClose();
  };

  // --- STİLLER (DARK THEME UYUMLU) ---
  
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2000,
    display: isOpen ? 'block' : 'none',
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : '-300px',
    width: '280px',
    height: '100%',
    // --- GÜNCELLEME 1: Navbar ile aynı arka plan rengi ---
    backgroundColor: '#1a1a1a', 
    boxShadow: '2px 0 10px rgba(0,0,0,0.5)', // Gölgeyi biraz koyulaştırdık
    zIndex: 2001,
    transition: 'left 0.3s ease-in-out',
    paddingTop: '60px',
    overflowY: 'auto'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    // --- GÜNCELLEME 2: Kapat butonu rengi (Beyaz/Gri) ---
    color: '#e0e0e0' 
  };

  const itemStyle = {
    padding: '15px 25px',
    // --- GÜNCELLEME 3: Çizgi rengi (Koyu griye uygun, daha silik bir çizgi) ---
    borderBottom: '1px solid #333', 
    cursor: 'pointer',
    // --- GÜNCELLEME 4: Yazı rengi (Açık gri/Beyaz) ---
    color: '#e0e0e0', 
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'block',
    textDecoration: 'none'
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />

      <div style={sidebarStyle}>
        <button style={closeButtonStyle} onClick={onClose}>✕</button>
        
        {/* Başlık Rengi: Altın (#FFD700) */}
        <h3 style={{ padding: '0 25px', margin: '0 0 20px 0', color: '#FFD700', borderBottom:'2px solid #FFD700', paddingBottom:'10px', display:'inline-block', marginLeft:'25px' }}>
          Kategoriler
        </h3>

        {categories.map(category => (
          <div 
            key={category.id} 
            style={itemStyle}
            onClick={() => handleCategoryClick(category.id)}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#333'; 
              e.target.style.color = '#FFD700'; // Hover olunca yazı altın olsun
              e.target.style.paddingLeft = '35px'; // Hafif sağa kayma efekti
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#1a1a1a'; // Eski haline dön
              e.target.style.color = '#e0e0e0';
              e.target.style.paddingLeft = '25px'; // Eski haline dön
            }}
          >
            {category.name}
          </div>
        ))}
      </div>
    </>
  );
}

export default CategorySidebar;