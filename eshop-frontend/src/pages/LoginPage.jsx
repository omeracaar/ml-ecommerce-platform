import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8080/rest/api";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: username,
        password: password
      });
      if (response.data && response.data.status === 200) {
        const token = response.data.payload.accessToken;
        const user = response.data.payload.username;

        console.log("Giriş Başarılı! Token:", token);

        //LocalStorage'e aldim
        localStorage.setItem('token', token);
        localStorage.setItem('username', user);

        navigate('/');
        
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Login Hatası:", err);
      if (err.response && err.response.data && err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      } else {
        setError("Giriş başarısız. Kullanıcı adı veya şifre yanlış olabilir.");
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Kullanıcı Adı:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px, ', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Şifre:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px',boxSizing: 'border-box' }}
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default LoginPage;