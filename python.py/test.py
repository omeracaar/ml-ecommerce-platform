import pickle
from surprise import SVD  # Bu import, pickle'ın 'model.pkl' dosyasını anlaması için GEREKLİ!
from surprise import Reader, Dataset # Bunlar da SVD için gerekebilir

print("Kaydedilmiş 'model.pkl' dosyası yükleniyor...")

try:
    with open('model.pkl', 'rb') as f:
        final_model = pickle.load(f)
except FileNotFoundError:
    print("\n!!! HATA !!!")
    print("'model.pkl' dosyası bulunamadı. Önce 'odev.py' script'ini çalıştırdığından emin ol.")
    exit()

print("Model başarıyla yüklendi.\n")
print("--- Manuel Test Başlıyor ---")


# --- ŞİMDİ TEST ZAMANI ---
# CSV dosyasını (Excel'de) aç ve gözüne birkaç 'customer_id' ve 'product_id' kestir.

# TEST DURUMU 1: Gerçek bir satın alma
# CSV'den bir satır bul. Mesela ilk satırdaki:
# Kullanıcı: 'C17270'
# Ürün: 'P234890'
# Gerçek Puan (quantity): 1
# Bakalım model bu 'ezberindeki' bilgi için ne diyecek?

test_user_1 = 'C17270'
test_product_1 = 'P234890'

tahmin_1 = final_model.predict(uid=test_user_1, iid=test_product_1)

print(f"Test 1: Kullanıcı '{test_user_1}' -> Ürün '{test_product_1}'")
print(f"   -> Bu kullanıcı bu ürünü ZATEN ALMIŞTI (Puanı: 1).")
print(f"   => Modelin Tahmini Puanı: {tahmin_1.est:.4f}")


print("\n" + "-"*30 + "\n")


# TEST DURUMU 2: Asıl Öneri Testi
# Şimdi, 'C17270' kullanıcısının HİÇ ALMADIĞI bir ürünü soralım.
# Mesela CSV'deki ikinci satırdaki ürün (başka bir müşteri almış)
# Ürün: 'P228204'
# Bakalım model, bu kullanıcı bu ürünü alır mıydı diyecek?

test_user_2 = 'C17270'  # Aynı kullanıcı
test_product_2 = 'P228204' # Farklı ürün

tahmin_2 = final_model.predict(uid=test_user_2, iid=test_product_2)

print(f"Test 2: Kullanıcı '{test_user_2}' -> Ürün '{test_product_2}'")
print(f"   -> Bu kullanıcı bu ürünü DAHA ÖNCE HİÇ ALMAMIŞTI.")
print(f"   => Modelin Tahmini Puanı: {tahmin_2.est:.4f}")

if tahmin_2.est > 1.5:
    print("Model bu ürünü önermeyi mantıklı buluyor.")
else:
    print("Model bu ürünü önermekten kaçınırdı.")

print("\n--- Test Yorumu ---")
print(f"Model, bu kullanıcının bu 'yeni' ürüne {tahmin_2.est:.4f} puan vereceğini tahmin ediyor.")
print("Eğer bu puan, almadığı diğer ürünlerin tahmininden yüksekse, bu ürünü ona öneririz.")