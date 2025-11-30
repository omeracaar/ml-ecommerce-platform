import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  //username i LocalStorage den kontrol et
  const username = localStorage.getItem('username');

  //cikis yap
  const handleLogout = () => {
    // token ve username i sil
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Ana sayfaya yönlendir ve sayfayı yenile (state temizlensin diye)
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav style={{ padding: '15px', borderBottom: '1px solid #eee', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <div>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>E-Shop</Link>
        <Link to="/products" style={{ marginLeft: '20px', textDecoration: 'none', color: '#555' }}>Ürünler</Link>
      </div>
      
      <div>
        {/* 3. Kullanıcı varsa cikis butonu, yoksa giris linkleri*/}
        {username ? (
          <>
            <span style={{ marginRight: '15px', fontWeight: 'bold' }}>Hoşgeldin, {username}</span>
            <Link to="/cart" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>Sepetim</Link>
            <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>Giriş Yap</Link>
            <Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;