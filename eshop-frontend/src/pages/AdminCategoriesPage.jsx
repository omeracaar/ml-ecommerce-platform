import { useState, useEffect } from 'react';
import api from '../api';

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState(''); 
  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.payload || res.data || []);
    } catch (err) {
      console.error("Kategoriler çekilemedi", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if(!newCatName) {
        alert("Lütfen kategori adı giriniz.");
        return;
    }

    try {
        const payload = { 
            name: newCatName, 
            description: newCatDesc 
        };

        await api.post('/categories/admin', payload); 
        
        setNewCatName('');
        setNewCatDesc('');
        fetchCats();
        alert('Kategori başarıyla eklendi! ✅');

    } catch (err) {
        console.error(err);
        alert('Kategori eklenirken hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Bu kategoriyi silmek istediğine emin misin?")) return;
      try {
          await api.delete(`/categories/admin/${id}`);
          fetchCats();
      } catch (err) {
          alert("Silinemedi.");
      }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>📂 Kategori Yönetimi</h2>
      
      <div style={formContainerStyle}>
        <h3>Yeni Kategori Ekle</h3>
        <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:'1px' }}>
            
            <div>
                <label style={labelStyle}>Kategori Adı:</label>
                <input 
                    type="text" 
                    placeholder="Örn: Elektronik" 
                    value={newCatName} 
                    onChange={e => setNewCatName(e.target.value)}
                    style={inputStyle}
                    required
                />
            </div>

            <div>
                <label style={labelStyle}>Açıklama (Opsiyonel):</label>
                <textarea 
                    placeholder="Kategori hakkında kısa bilgi..." 
                    value={newCatDesc} 
                    onChange={e => setNewCatDesc(e.target.value)}
                    style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                />
            </div>

            <button type="submit" style={buttonStyle}>➕ Kaydet</button>
        </form>
      </div>

      <h3 style={{ marginTop:'40px' }}>Mevcut Kategoriler</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Kategori Adı</th>
                    <th style={thStyle}>Açıklama</th>
                    <th style={thStyle}>İşlem</th>
                </tr>
            </thead>
            <tbody>
                {categories.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={tdStyle}>{c.id}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{c.name}</td>
                        <td style={{ ...tdStyle, color: '#666', fontSize:'0.9rem' }}>{c.description || '-'}</td>
                        <td style={tdStyle}>
                            <button onClick={() => handleDelete(c.id)} style={deleteBtnStyle}>🗑️ Sil</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

const formContainerStyle = { backgroundColor: '#fff', padding: '5px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize:'1rem', boxSizing: 'border-box' }; // box-sizing önemli
const buttonStyle = { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-start' };
const thStyle = { padding: '12px', borderBottom: '2px solid #ddd', color: '#444' };
const tdStyle = { padding: '12px', verticalAlign: 'top' };
const deleteBtnStyle = { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default AdminCategoriesPage;