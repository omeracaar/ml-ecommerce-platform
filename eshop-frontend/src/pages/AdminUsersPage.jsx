import { useState, useEffect } from 'react';
import api from '../api';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (pageNo) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${pageNo}&size=${pageSize}`);
      
      const pageData = res.data.payload || res.data;
      
      if (pageData.content) {
          setUsers(pageData.content);
          setTotalPages(pageData.totalPages);
      } else {
          setUsers(pageData);
      }

    } catch (err) {
      console.error("Kullanıcılar çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Bu kullanıcıyı silmek istediğine emin misin?")) return;
      
      try {
          await api.delete(`/admin/users/${id}`);
          fetchUsers(page);
          alert("Kullanıcı silindi.");
      } catch (err) {
          console.error(err);
          alert("Silme işlemi başarısız.");
      }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  if (loading && users.length === 0) return <div style={{ textAlign: 'center', padding: '50px' }}>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '20px' }}>
      
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        <h2>👥 Kullanıcı Yönetimi</h2>
        <span style={{ fontSize:'0.9rem', color:'#666' }}>Sayfa: {page + 1} / {totalPages}</span>
      </div>
      
      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Avatar</th>
                    <th style={thStyle}>Kullanıcı Adı</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Rol</th>
                    <th style={thStyle}>İşlem</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                        
                        <td style={{...tdStyle, fontSize:'0.8rem', color:'#888'}}>{user.id}</td>
                        
                        <td style={tdStyle}>
                            <div style={avatarStyle}>
                                {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                            </div>
                        </td>

                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{user.username}</td>
                        <td style={tdStyle}>{user.email || '-'}</td>
                        
                        <td style={tdStyle}>
                             <span style={{ 
                                 padding:'4px 8px', 
                                 borderRadius:'4px', 
                                 backgroundColor: user.role === 'ADMIN' ? '#d4edda' : '#e2e3e5',
                                 color: user.role === 'ADMIN' ? '#155724' : '#383d41',
                                 fontSize:'0.8rem',
                                 fontWeight:'bold'
                             }}>
                                {user.role || 'USER'}
                             </span>
                        </td>

                        <td style={tdStyle}>
                            <button onClick={() => handleDelete(user.id)} style={deleteBtnStyle}>🗑️ Sil</button>
                        </td>

                    </tr>
                ))}
                
                {users.length === 0 && (
                    <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Kullanıcı bulunamadı.</td></tr>
                )}
            </tbody>
        </table>
      </div>

      {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 0}
                style={{ ...pageBtnStyle, opacity: page === 0 ? 0.5 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
              >
                ◀ Önceki
              </button>
              
              <span style={{ padding: '8px 12px', fontWeight: 'bold', backgroundColor:'white', borderRadius:'5px' }}>
                  {page + 1}
              </span>

              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page >= totalPages - 1}
                style={{ ...pageBtnStyle, opacity: page >= totalPages - 1 ? 0.5 : 1, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
              >
                Sonraki ▶
              </button>
          </div>
      )}

    </div>
  );
}

// --- Styles ---
const thStyle = { padding: '15px', color: '#495057', fontSize: '0.9rem', fontWeight:'bold' };
const tdStyle = { padding: '15px', verticalAlign: 'middle', fontSize: '0.9rem', color: '#333' };

const avatarStyle = { 
    width: '35px', 
    height: '35px', 
    backgroundColor: '#6f42c1', 
    color: 'white', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: 'bold',
    fontSize: '1rem'
};

const deleteBtnStyle = { 
    padding: '6px 12px', 
    backgroundColor: '#dc3545', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    transition: 'background 0.3s'
};

const pageBtnStyle = {
    padding: '8px 16px', 
    backgroundColor: '#333', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px'
};

export default AdminUsersPage;