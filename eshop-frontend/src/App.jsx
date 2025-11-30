import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 

import './App.css'; 

function App() {
  return (
    <>
      <Navbar /> {/* Navbar her sayfada en tepede sabit kalacak */}
      
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Kullanıcı ana sayfaya ('/') gelince HomePage'i göster */}
          <Route path="/" element={<HomePage />} />
          
          {/* Kullanıcı '/products'a gelince de HomePage'i göster (şimdilik) */}
          <Route path="/products" element={<HomePage />} />
          
          {/* Diğer sayfalar için yer tutucular */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<h2>Sepet Sayfası (Yapılacak)</h2>} />
        </Routes>
      </div>
    </>
  );
}

export default App;