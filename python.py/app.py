import pandas as pd
import pickle
from flask import Flask, request, jsonify
from surprise import SVD, Reader, Dataset  

print("API sunucusu başlatılıyor...")


try:
    with open('model.pkl', 'rb') as f:
        final_model = pickle.load(f)
    print("Model 'model.pkl' başarıyla yüklendi.")

    df = pd.read_csv("C:/Users/omera/Desktop/bt1/python.py/ecommerce_sales_34500.csv")
    all_product_ids = df['product_id'].unique()
    print(f"Modelin 'ürün evreni' ({len(all_product_ids)} adet) başarıyla yüklendi.")

except FileNotFoundError as e:
    print(f"\n!!! KRİTİK HATA !!! Gerekli dosya bulunamadı: {e.fileName}")
    print("API başlatılamadı. 'odev.py' script'ini çalıştırdığından emin ol.")
    exit()


app = Flask(__name__)
print("\nFlask API sunucusu çalışmaya hazır.")


@app.route('/recommend', methods=['GET'])
def recommend():
   
    user_id = request.args.get('user_id')

    if user_id is None:
        return jsonify({'error': 'Lütfen bir user_id parametresi gönderin.'}), 400

    print(f"\n'{user_id}' için yeni bir öneri isteği alındı...")

    tahminler = []
    for product_id in all_product_ids:
        tahmini_puan = final_model.predict(uid=user_id, iid=product_id).est
        tahminler.append((product_id, tahmini_puan))

    tahminler.sort(key=lambda x: x[1], reverse=True)

    top_10_product_ids = [product_id for (product_id, puan) in tahminler[:10]]
    
    print(f"'{user_id}' için en iyi 10 öneri bulundu ve gönderildi.")

    return jsonify(top_10_product_ids)


if __name__ == '__main__':
    app.run(port=5000, debug=True)