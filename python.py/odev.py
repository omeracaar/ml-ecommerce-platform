import pandas as pd

# --- AŞAMA 1: VERİYİ HAZIRLAMA (Senin Kodun) ---

df = pd.read_csv("C:/Users/omera/Desktop/bt1/python.py/ecommerce_sales_34500.csv")
# print(df.head()) # Bu satırı yoruma aldım, artık tabloyu görmemize gerek yok

print("\nVeri başarıyla okundu. Şimdi ML modeli için hazırlanıyor...")

# 1. Sadece bize lazım olan sütunları alalım
df_ml = df[['customer_id', 'product_id', 'quantity']]

# 2. 'quantity' sütununun adını 'rating' olarak değiştirelim
df_ml = df_ml.rename(columns={'quantity': 'rating'})

# 3. Gerekli 'surprise' kütüphanelerini import edelim
try:
    from surprise import Reader, Dataset
    from surprise import SVD  # SVD: Bizim kullanacağımız ML algoritması
    from surprise.model_selection import train_test_split # Veriyi bölmek için
    from surprise import accuracy # Hata payını ölçmek için
except ImportError:
    print("\n'surprise' kütüphanesi bulunamadı.")
    exit()

# 4. Reader'ı tanımlayalım
reader = Reader(rating_scale=(df_ml['rating'].min(), df_ml['rating'].max()))

# 5. Veriyi 'surprise' formatına yükleyelim
data = Dataset.load_from_df(df_ml[['customer_id', 'product_id', 'rating']], reader)
print("\nVeri, 'Surprise' kütüphanesi için başarıyla hazırlandı!")

# --- AŞAMA 2: EĞİTİM & TEST---

# 1. Veriyi %80 eğitim, %20 test olarak ayıralım (test_size=0.20)
# random_state=42 : her çalıştırmada aynı "rastgele" sonucu alalım ki karşılaştırabilelim
print("\nVeri %80 eğitim, %20 test olarak bölünüyor...")
trainset, testset = train_test_split(data, test_size=0.20, random_state=42)

# 2. Modeli tanımlayalım (SVD algoritmasını kullanıyoruz)
model = SVD()

# 3. Modeli SADECE eğitim verisi (%80) ile eğitelim
print("Model, %80'lik eğitim verisi ile eğitiliyor... (Bu işlem biraz sürebilir)")
model.fit(trainset)
print("Eğitim tamamlandı.")

# 4. Eğitilmiş modeli, daha önce HİÇ GÖRMEDİĞİ test verisi (%20) ile test edelim
print("\nModel, %20'lik test verisi ile sınava sokuluyor...")
predictions = model.test(testset)

# 5. Modelin "öğrenme" başarısını (hata payını) ölçelim
# RMSE (Root Mean Squared Error): Tahmin ile gerçek arasındaki ortalama hatadır.
# 0'a ne kadar yakınsa o kadar iyidir.
# Bizim skalamız (1-5 adet arası) için 1.0'in altındaki bir değer genelde BAŞARILI sayılır.
print("\n--- Model Başarı Raporu ---")
rmse = accuracy.rmse(predictions)
print(f"Modelin Hata Payı (RMSE): {rmse}")
print("----------------------------")

print("\nEğer RMSE değeri düşükse (örn: 1'in altındaysa), modelimiz 'ezberlememiş', 'öğrenmiş' demektir.")
print("Bu, sitemize gelecek YENİ kullanıcılara da başarılı öneriler yapabileceğini gösterir.")

# --- AŞAMA 3: FİNAL MODELİNİ EĞİTME VE KAYDETME ---

print("\nTest işlemi başarılı. Şimdi model, tüm veri (%100) ile son kez eğitiliyor...")

# 1. Artık tüm veriyi (%100) kullanarak "tam eğitim" (full trainset) oluşturuyoruz
# Madem öğrendiğini kanıtladık, artık tüm bilgeliği alsın.
full_trainset = data.build_full_trainset()

# 2. Final modelini (yine SVD) tanımla
final_model = SVD()

# 3. Final modelini TÜM VERİ ile eğit
final_model.fit(full_trainset)
print("Final modeli eğitildi.")

# 4. Modeli diske kaydet (Spring Boot'un kullanması için)
import pickle  # Python objelerini diske kaydetme kütüphanesi

model_dosyasi = 'model.pkl'
print(f"\nModel '{model_dosyasi}' dosyasına kaydediliyor...")
with open(model_dosyasi, 'wb') as f:
    pickle.dump(final_model, f)

    import os
print("Model dosyasının tam yolu:", os.path.abspath(model_dosyasi))


print(f"Model başarıyla kaydedildi! Artık '{model_dosyasi}' dosyasını Flask API'mizde kullanabiliriz.")
