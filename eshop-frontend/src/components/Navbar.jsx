import { useState, useEffect } from 'react'; // useEffect eklendi
import { Link, useNavigate } from 'react-router-dom';
import CategorySidebar from './CategorySidebar';
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();

  // --- STATE TANIMLAMALARI (Tek seferde ve doğru şekilde) ---
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- LOGOUT İŞLEMİ ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role'); // Role tutuyorsan onu da sil
    navigate('/login');
    window.location.reload(); // Sayfayı yenileyerek state'leri sıfırlar
  };

  // --- ADMİN VE TOKEN KONTROLÜ ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Kullanıcı adı değiştiğinde (giriş/çıkış) localStorage'dan username'i güncelle
    // Bu sayede giriş yapınca isim hemen gelir.
    setUsername(localStorage.getItem('username'));

    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Token içindeki rol kontrolü
        if (decoded.roles && decoded.roles.includes('ROLE_ADMIN')) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Token hatası:", error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [username]); // username state'i tetikleyici olarak kalabilir

  // --- STYLES ---
  const navContainerStyle = {
    backgroundColor: '#1a1a1a',
    padding: '0 20px', 
    height: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const menuBtnStyle = {
    background: 'none',
    border: '1px solid #444',
    color: '#FFD700',
    fontSize: '1.5rem',
    cursor: 'pointer',
    marginRight: '15px',
    padding: '5px 10px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center'
  };

  const brandStyle = { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' };
  const logoStyle = { height: '40px', width: 'auto' };
  const brandNameStyle = { fontSize: '1.5rem', fontWeight: 'bold', color: '#FFD700', letterSpacing: '1px', fontFamily: "Poppins, sans-serif" };
  const linkStyle = { color: '#e0e0e0', textDecoration: 'none', fontSize: '1rem', marginLeft: '25px', transition: 'color 0.3s', fontWeight: '500' };
  const buttonStyle = { marginLeft: '20px', padding: '8px 20px', backgroundColor: 'transparent', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' };

  return (
    <>
      <nav style={navContainerStyle}>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          
          <button style={menuBtnStyle} onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
          
          <Link to="/" style={brandStyle}>
            <img src="/logo.png" alt="Golden Cart" style={logoStyle} /> 
            <span style={brandNameStyle}>Golden Cart</span>
          </Link>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          
          <Link to="/products" style={linkStyle}>Ürünler</Link>

          {/* SADECE ADMIN GÖRÜR */}
          {isAdmin && (
             <Link 
               to="/admin/orders" 
               style={{ 
                 ...linkStyle, 
                 color: '#ff4444',
                 fontWeight: 'bold',
                 border: '1px solid #ff4444',
                 borderRadius: '5px',
                 padding: '5px 10px',
                 marginLeft: '10px'
               }}
             >
               🛠️ Yönetim
             </Link>
          )}
          
          {username ? (
            <>
              <Link to="/cart" style={linkStyle}>Sepetim 🛒</Link>
              <div style={{ marginLeft: '25px', borderLeft:'1px solid #444', paddingLeft:'25px' }}>
              <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <div style={{ width: '30px', height: '30px', backgroundColor: '#FFD700', borderRadius: '50%', display:'flex', justifyContent:'center', alignItems:'center', color:'black', fontWeight:'bold', fontSize:'0.8rem' }}>
                {username.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{username}</span>
                </Link>
                </div>
              <button onClick={handleLogout} style={buttonStyle}>Çıkış</button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Giriş Yap</Link>
              <Link to="/register" style={{ ...linkStyle, color: '#FFD700' }}>Kayıt Ol</Link>
            </>
          )}
        </div>
      </nav>

      <CategorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
    </>
  );
}

export default Navbar;