import { useState, useEffect } from 'react';
import api from '../api';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(0);      
  const [totalPages, setTotalPages] = useState(0); 
  const pageSize = 10;                       

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: ''
  });

  //sayfa degisince veriyi çek
  useEffect(() => {
    fetchData(page);
    fetchCategories();
  }, [page]);

  //kategorileri cek bir defa yeterli
  const fetchCategories = async () => {
      try {
          const res = await api.get('/categories');
          setCategories(res.data.payload || res.data || []);
      } catch (err) {
          console.error("Kategori hatası:", err);
      }
  };

  //page yapisinda urunleri cek
  const fetchData = async (pageNumber) => {
    setLoading(true);
    try {
      // Backend: /products/getAll?page=0&size=10
      const response = await api.get(`/products/getAll?page=${pageNumber}&size=${pageSize}`);
      
      const payload = response.data.payload || response.data;
      
      // page yapısı kontrolü 
      if (payload.content) {
          setProducts(payload.content);
          setTotalPages(payload.totalPages);
      } else if (Array.isArray(payload)) {
          setProducts(payload);
      }

    } catch (error) {
      console.error("Ürünler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryId) {
      alert("Lütfen bir kategori seçiniz!");
      return;
    }

    const payload = {
        id: formData.id,
        name: formData.name,
        description: formData.description ? formData.description : "Açıklama girilmedi", 
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: parseInt(formData.categoryId), 
        imageUrl: formData.imageUrl
    };

    try {
      if (isEditing) {
        await api.put(`/products/admin/${formData.id}`, payload);
        alert("Ürün güncellendi! ✅");
      } else {
        await api.post('/products/admin', payload);
        alert("Ürün eklendi! ✅");
      }

      resetForm();
      fetchData(page);

    } catch (error) {
      console.error("İşlem hatası:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.validationErrors || "Bilinmeyen hata";
      alert(`HATA: ${JSON.stringify(errorMsg)}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/products/admin/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert("Silinemedi.");
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId || product.category?.id || '',
      imageUrl: product.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormData({ id: '', name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '' });
  };

  const handlePageChange = (newPage) => {
      if (newPage >= 0 && newPage < totalPages) {
          setPage(newPage);
      }
  };

  if (loading && products.length === 0) return <div style={{textAlign:'center', marginTop:'50px'}}>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      
      <div style={formContainerStyle}>
        <h3 style={{ marginTop: 0, color: isEditing ? '#007bff' : '#28a745' }}>
            {isEditing ? `✏️ Düzenle: ${formData.id}` : '➕ Yeni Ürün Ekle'}
        </h3>
        <form onSubmit={handleSubmit} style={gridFormStyle}>
           <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Ürün ID:</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} disabled={isEditing} style={inputStyle} required placeholder="P202751" />
           </div>
           <div><label style={labelStyle}>Ad:</label><input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required /></div>
           <div>
               <label style={labelStyle}>Kategori:</label>
               <select name="categoryId" value={formData.categoryId} onChange={handleChange} style={inputStyle} required>
                   <option value="">Seçiniz</option>
                   {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
           </div>
           <div><label style={labelStyle}>Fiyat:</label><input type="number" name="price" value={formData.price} onChange={handleChange} style={inputStyle} required /></div>
           <div><label style={labelStyle}>Stok:</label><input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} style={inputStyle} required /></div>
           <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Açıklama:</label><textarea name="description" value={formData.description} onChange={handleChange} style={inputStyle} /></div>
           <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Resim URL:</label><input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={inputStyle} /></div>
           
           <button type="submit" style={{ ...buttonStyle, backgroundColor: isEditing ? '#007bff' : '#28a745' }}>{isEditing ? 'Güncelle' : 'Kaydet'}</button>
           {isEditing && <button type="button" onClick={resetForm} style={{...buttonStyle, backgroundColor:'#6c757d', marginTop:'5px'}}>İptal</button>}
        </form>
      </div>

      <h3 style={{ marginTop: '30px' }}>Ürün Listesi (Sayfa: {page + 1} / {totalPages})</h3>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor:'white', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Resim</th>
                <th style={thStyle}>Ad</th>
                <th style={thStyle}>Fiyat</th>
                <th style={thStyle}>Stok</th>
                <th style={thStyle}>İşlem</th>
            </tr>
        </thead>
        <tbody>
            {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>{p.id}</td>
                    <td style={tdStyle}><img src={p.imageUrl} style={{width:'40px', height:'40px', objectFit:'cover'}} alt=""/></td>
                    <td style={tdStyle}>{p.name}</td>
                    <td style={{...tdStyle, color:'green', fontWeight:'bold'}}>{p.price} TL</td>
                    <td style={tdStyle}>{p.stockQuantity}</td>
                    <td style={tdStyle}>
                        <button onClick={() => handleEditClick(p)} style={editBtnStyle}>✏️</button>
                        <button onClick={() => handleDelete(p.id)} style={deleteBtnStyle}>🗑️</button>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>

      {/*page btn*/}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 0}
            style={{ padding: '8px 15px', cursor: page === 0 ? 'not-allowed' : 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', opacity: page === 0 ? 0.5 : 1 }}
          >
            ◀ Önceki
          </button>
          
          <span style={{ padding: '8px', fontWeight: 'bold' }}>{page + 1}</span>

          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page >= totalPages - 1}
            style={{ padding: '8px 15px', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', opacity: page >= totalPages - 1 ? 0.5 : 1 }}
          >
            Sonraki ▶
          </button>
      </div>

    </div>
  );
}

//style
const formContainerStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const gridFormStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { gridColumn: '1 / -1', padding: '10px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px', verticalAlign:'middle' };
const editBtnStyle = { marginRight:'5px', padding:'5px 10px', backgroundColor:'#ffc107', border:'none', borderRadius:'3px', cursor:'pointer' };
const deleteBtnStyle = { padding:'5px 10px', backgroundColor:'#dc3545', color:'white', border:'none', borderRadius:'3px', cursor:'pointer' };

export default AdminProductsPage;