import { useState, useEffect } from 'react';
import cityData from '../data/turkey_data';


function AddressSelector({ onAddressChange }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [detail, setDetail] = useState('');

  //sehir degisince ilceleri guncelle
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    
    if (cityName) {
      const city = cityData.find(c => c.text === cityName);
      setDistricts(city ? city.districts : []);
    } else {
      setDistricts([]);
    }
    setSelectedDistrict(''); //sehir degisince ilce sifirla
  };

      


useEffect(() => {
    if (selectedCity && selectedDistrict && detail) {
      // format: "Antalya / Muratpaşa / Mahalle sokak no:5"
      const fullAddress = `${selectedCity} / ${selectedDistrict} / ${detail}`;
      onAddressChange(fullAddress);
    } else {
      onAddressChange('');
    }
  }, [selectedCity, selectedDistrict, detail]);

  const inputStyle = { width: '100%', padding: '8px', marginTop: '5px', marginBottom: '15px', boxSizing: 'border-box' };

  return (
    <div>
      <label style={{fontWeight:'bold'}}>İl</label>
      <select value={selectedCity} onChange={handleCityChange} style={inputStyle}>
        <option value="">Seçiniz...</option>
        {cityData.map(city => (
          <option key={city.value} value={city.text}>{city.text}</option>
        ))}
      </select>

      <label style={{fontWeight:'bold'}}>İlçe</label>
      <select 
        value={selectedDistrict} 
        onChange={(e) => setSelectedDistrict(e.target.value)} 
        style={inputStyle}
        disabled={!selectedCity}
      >
        <option value="">Seçiniz...</option>
        {districts.map((district) => (
          <option key={district.value} value={district.text}>{district.text}</option>
        ))}
      </select>

      <label style={{fontWeight:'bold'}}>Açık Adres (Mahalle, Sokak, No)</label>
      <textarea 
        value={detail} 
        onChange={(e) => setDetail(e.target.value)} 
        placeholder="Mahalle, Cadde, Bina No, Daire No..."
        style={{ ...inputStyle, height: '80px', fontFamily: 'inherit' }}
      />
    </div>
  );
}

export default AddressSelector;