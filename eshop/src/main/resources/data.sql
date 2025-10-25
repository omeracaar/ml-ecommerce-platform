DELETE FROM order_items;
DELETE FROM cart_items;
DELETE FROM orders;
DELETE FROM carts;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM app_user;

ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE carts_id_seq RESTART WITH 1;
ALTER SEQUENCE cart_items_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

INSERT INTO app_user (id, username, email, password, role, first_name, last_name, phone_number, address) VALUES
('U-ADMIN', 'admin', 'admin@eshop.com', 'admin123', 'ADMIN', 'Admin', 'User', '5551112233', 'Merkez Ofis'),
('U-1', 'omer', 'omer@mail.com', 'omer123', 'USER', 'Ömer', 'Acar', '5554445566', 'Antalya'),
('U-2', 'testuser', 'test@mail.com', 'test123', 'USER', 'Test', 'Kullanici', '5557778899', 'İstanbul');

INSERT INTO categories (name, description) VALUES
('Electronics', 'Telefon, TV, Bilgisayar Aksesuarları'),
('Fashion', 'Giyim, Ayakkabı, Aksesuar'),
('Home', 'Mutfak, Banyo, Dekorasyon'),
('Beauty', 'Kişisel Bakım, Kozmetik'),
('Sports', 'Spor Ekipmanları, Spor Giyim'),
('Toys', 'Oyuncaklar, Hobi Ürünleri'),
('Grocery', 'Gıda, Temizlik Ürünleri');

INSERT INTO products (id, name, description, price, stock_quantity, image_url, category_id) VALUES
('P213892', 'Akıllı LED TV 55"', 'Harika görüntü kalitesi', 19999.90, 30, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9CU73BPahl1JFWhfuMdXC2zUd4zVELryvbrfHISYvrx90myIzidyQbAOUBjeR8-HRm0Y&usqp=CAU', 1),
('P208689', 'Gaming Mouse RGB', 'Hızlı tepkime süresi', 850.00, 150, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy38izFlu54V-4qeUq9FA8UILot6BtQsLbVg&s', 1),
('P201363', 'Bluetooth Kulaklık', 'Gürültü engelleme özellikli', 2500.00, 80, 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/philips/thumb/146011-1_large.jpg', 1),
('P218405', 'Gaming Klavye', 'Düşük tepki süresi', 2900.00, 80, 'https://m.media-amazon.com/images/I/71zZXB9Dh+L.jpg', 1),
('P203302', 'Iphone 17', 'Harika kamera performansı', 90000.00, 80, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAUtcZPKer3o45dk7ITXjidm0dIYhhwKyM7w&s', 1),
('P243790', 'Gaming Laptop', 'Yüksek performans', 65000.00, 80, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQKxY7WU1zpfQZ7F-2cyMKNRxLeiqC4ixwxg&s', 1),
('P229316', 'Rtx 4060 Ekran Kartı', 'Mükemmel oyun performansı', 12000.00, 80, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDApg29tF9F7Is7R6zRz8qoxjkMjTIZkUx3w&s', 1),
('P223089', 'Samsung Z Flip', 'Katlanabilir', 110000.00, 80, 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/samsung/thumb/146268-4_large.jpg', 1),
('P207676', 'Play Station 5', '2. kol dahil', 25000.00, 80, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzxE1fMe-7OxFCAbLO27acSqWE7WF6-f7WNA&s', 1),
('P212663', 'Xbox Series X', 'Yanında oyun hediyeli', 19000.00, 80, 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/microsoft/thumb/108453-gorsel-1_large.jpg', 1);

INSERT INTO products (id, name, description, price, stock_quantity, image_url, category_id) VALUES
('P202751', 'Mavi Slim Fit Gömlek', 'Pamuklu kumaş', 799.90, 200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK4Iyey4Uc2iTYFudPi2P-nwYqLNfGrA4_Fw&s', 2),
('P216877', 'Siyah Deri Ceket', 'Klasik model', 3500.00, 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEIASlTjx0Uo1dUzAqf-BzCTx7ciyeQSZ6-Q&s', 2),
('P248629', 'Beyaz Ayakkabı', 'Hakiki deri', 4500.00, 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoE3MuTXzUbX3AfHhHQzUO7sW-79TSWQuIgQ&s', 2),
('P221471', 'Kırmızı Şort', 'Esnek Kumaş', 450.00, 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIUqGY0osn9QJMLZp_DCmSZ3ON0x0Ra1YPMw&s', 2),
('P214437', 'Tişört', 'Polo yaka', 750.00, 50, 'https://ktnimg2.mncdn.com/products/2024/01/12/2866350/997f280a-f493-425e-882b-7e565f1d9224_size870x1142.jpg', 2),
('P223511', 'Pantolon', 'Bol kesim', 1200.00, 50, 'https://static.ticimax.cloud/52816/uploads/urunresimleri/buyuk/boyfriend-zincirli-kumas-pantolon-acik-f0-4f0.jpg', 2),
('P235284', 'Mavi Sweat', 'Kapüşonlu', 1000.00, 50, 'https://witcdn.sarar.com/interview-kapusonlu-mavi-sweatshirt-13969-kapusonlu-sweatshirt-interview-35522-13-K.jpg', 2),
('P248640', 'Deri Kemer', 'Hakiki Deri', 200.00, 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROBsc2KGqBtLVL2QFX-TAcXf2YRaAkCSB7Sw&s', 2),
('P245502', 'Mavi Bluz', 'Pamuklu kumaş', 300.00, 50, 'https://www.sennadesign.com/cristalle-acik-mavi-bluz-tesettr-bluz-modelleri-tesettr-bluz-fiyatlar-22577-71-B.jpg', 2),
('P211323', 'Siyah El Çantası', 'Geniş iç hacim', 900.00, 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrcn0kN-J6u3dy1Zz7EK9c-TIN3P2jUw9C4g&s', 2);

INSERT INTO products (id, name, description, price, stock_quantity, image_url, category_id) VALUES
('P228063', '6lı Kahve Fincan Takımı', 'Porselen, modern tasarım', 450.00, 100, 'https://m.media-amazon.com/images/I/717Bo7zNrfL._AC_UF1000,1000_QL80_.jpg', 3),
('P227020', 'Robot Süpürge ', 'Haritalama özellikli', 8000.00, 25, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyI_nGy3Su7e7Lol0sjZEgdX5mVFcMG8AZ0A&s', 3),
('P227609', 'Halı', 'Kaydırma yapmaz', 4000.00, 25, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4vtcpUAvk-WXY13nKdo2aB_7pyZ_UB9wNBg&s', 3),
('P243239', 'Metal Ayaklı Masa', 'Ahşap', 3000.00, 25, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMqcSB2kEKTh8Uvqf7bOX7mLvEe4emx6Iszw&s', 3),
('P206155', 'Yatak', 'Rahatlık sağlar', 5000.00, 25, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JC3i-TsmZzpbyG8DefxYks81h5l6FmzFsg&s', 3);

INSERT INTO products (id, name, description, price, stock_quantity, image_url, category_id) VALUES
('P216691', 'Terleme Karşıtı Deodorant', 'Hassas ciltler için', 150.00, 300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZZHdqZmulMIxNcR4wxnnX7bUioHO26DqRMw&s', 4),
('P217648', 'Nemlendirici Yüz Kremi', 'Tüm cilt tipleri için', 65.00, 300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDO_pfkeYQMZj4uQcRYzhIvpM079nVEJOJOQ&s', 4);

INSERT INTO products (id, name, description, price, stock_quantity, image_url, category_id) VALUES
('P205848', 'Profesyonel Futbol Topu', 'FIFA onaylı', 600.00, 75, 'https://www.sporforma.net/modeller/urunlerimiz/futbol-ekipman/futbol-topu/ordem-4-football-big.jpg', 5),
('P247930', 'Direnç Lastiği', '50 kg dayanımlı ', 250.00, 75, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU2I4eUtZ21Gj7p7KEC2A54e38YL4-UGaAXQ&s', 5);

INSERT INTO products (id, name, description, price, stock_quantity, image_url, category_id) VALUES
('P205339', 'Lego Uzay Mekiği Seti', '1000 parça', 1500.00, 40, 'https://productimages.hepsiburada.net/s/28/375-375/10225316692018.jpg', 6),
('P246233', 'McQueen Uzaktan Kumandalı Araba', '500 metre menzilli', 3600.00, 40, 'https://productimages.hepsiburada.net/s/38/375-375/10576593420338.jpg', 6);


INSERT INTO products (id, name, description, price, stock_quantity, image_url, category_id) VALUES
('P207782', 'Organik Zeytinyağı 1L', 'Soğuk sıkım', 800.00, 500, 'https://productimages.hepsiburada.net/s/140/375-375/110000093002315.jpg', 7),
('P245991', 'Çeri Domates', 'Taze', 50.00, 500, 'https://www.eskitadinda.com/img/ceri-domates_1043_1836_2.png', 7);

INSERT INTO carts (user_id) VALUES
('U-ADMIN'),
('U-1'),
('U-2');