import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  // tum form verilerini tek state te
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // input degistikce state i guncelle 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData, // onceki veriyi koru
      [name]: value // degisen alani update et
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // sayfanin refresh olmasini engelle
    setError(null);
    setSuccess(false);

    try {
      // backend e register istegi at
      // api.js kullandigim icin base URL otomatik gelir
      const response = await api.post('/auth/register', formData);

      if (response.data && response.data.status === 201) {
        console.log("Kayıt Başarılı:", response.data);
        setSuccess(true);
        
        // 2 saniye sonra login sayfasına yonlendir
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error("Kayıt Hatası:", err);
      // backendden gelen validation hatasi varsa onu goster, yoksa genel hata
      if (err.response && err.response.data && err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      } else {
        setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Kayıt Ol</h2>
      
      {success && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
          Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        {/* username */}
        <div style={formGroupStyle}>
          <label>Kullanıcı Adı *</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required style={inputStyle} />
        </div>

        {/* email */}
        <div style={formGroupStyle}>
          <label>E-posta *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
        </div>

        {/* sifre */}
        <div style={formGroupStyle}>
          <label>Şifre *</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} />
        </div>

        {/* ad - soyad */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ ...formGroupStyle, flex: 1 }}>
            <label>Ad</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ ...formGroupStyle, flex: 1 }}>
            <label>Soyad</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* telefon */}
        <div style={formGroupStyle}>
          <label>Telefon</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} />
        </div>

        {/* adres */}
        <div style={formGroupStyle}>
          <label>Adres</label>
          <textarea name="address" value={formData.address} onChange={handleChange} style={{ ...inputStyle, height: '80px' }} />
        </div>

        <button type="submit" style={buttonStyle}>Kayıt Ol</button>
      </form>
    </div>
  );
}

//css
const formGroupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' };

export default RegisterPage;