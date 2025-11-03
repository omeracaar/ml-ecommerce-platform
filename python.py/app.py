import pandas as pd
import pickle
from flask import Flask, request, jsonify
from surprise import SVD, Reader, Dataset  # Pickle'ın modeli tanıması için GEREKLİ!

print("API sunucusu başlatılıyor...")

# --- AŞAMA 1: GEREKLİ DOSYALARI HAFIZAYA YÜKLEME ---
# (Bu işlemler sunucu başlarken SADECE BİR KERE yapılır)

try:
    # 1. Kaydedilmiş ML modelini (beyni) yükle
    with open('model.pkl', 'rb') as f:
        final_model = pickle.load(f)
    print("Model 'model.pkl' başarıyla yüklendi.")

    # 2. Modelin "evrenini" (tüm ürün ID'lerini) yükle
    df = pd.read_csv("C:/Users/omera/Desktop/python.py/ecommerce_sales_34500.csv")
    all_product_ids = df['product_id'].unique()
    print(f"Modelin 'ürün evreni' ({len(all_product_ids)} adet) başarıyla yüklendi.")

except FileNotFoundError as e:
    print(f"\n!!! KRİTİK HATA !!! Gerekli dosya bulunamadı: {e.fileName}")
    print("API başlatılamadı. 'odev.py' script'ini çalıştırdığından emin ol.")
    exit()


# 3. Flask API uygulamasını başlat
app = Flask(__name__)
print("\nFlask API sunucusu çalışmaya hazır.")


# --- AŞAMA 2: API ENDPOINT'İNİ (ROTASINI) OLUŞTURMA ---
# (Spring Boot'un çağıracağı adres burası)

@app.route('/recommend', methods=['GET'])
def recommend():
    # 1. Spring Boot'tan gelen 'user_id' parametresini al
    # Örn: http://localhost:5000/recommend?user_id=C17270
    user_id = request.args.get('user_id')

    # Eğer 'user_id' parametresi gönderilmezse hata ver
    if user_id is None:
        return jsonify({'error': 'Lütfen bir user_id parametresi gönderin.'}), 400

    print(f"\n'{user_id}' için yeni bir öneri isteği alındı...")

    # 2. Bu kullanıcı için tüm ürün evrenindeki her bir ürüne tahmini puan ver
    # (Senin test.py'de elle yaptığın işin aynısı, ama binlerce kez)
    tahminler = []
    for product_id in all_product_ids:
        # model.predict(), bu kullanıcının bu ürüne vereceği tahmini puanı söyler
        tahmini_puan = final_model.predict(uid=user_id, iid=product_id).est
        tahminler.append((product_id, tahmini_puan))

    # 3. Listeyi tahmini puana göre büyükten küçüğe doğru sırala
    tahminler.sort(key=lambda x: x[1], reverse=True)

    # 4. En yüksek puanlı ilk 10 ürünün SADECE ID'lerini al
    top_10_product_ids = [product_id for (product_id, puan) in tahminler[:10]]
    
    print(f"'{user_id}' için en iyi 10 öneri bulundu ve gönderildi.")

    # 5. Bu ID listesini Spring Boot'a JSON olarak geri dön
    return jsonify(top_10_product_ids)


# --- AŞAMA 3: SUNUCUYU BAŞLATMA ---
if __name__ == '__main__':
    # 'port=5000' -> Bu API'nin 5000. portta çalışacağını söyler
    app.run(port=5000, debug=True)