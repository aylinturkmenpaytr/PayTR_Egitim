# SauceDemo E-Ticaret Satın Alma Akışı - Test Planı

## Amaç
Bu plan, `https://www.saucedemo.com` uygulamasında standart kullanıcıyla giriş yapıldıktan sonra ürünleri fiyatına göre sıralama, ilk iki ürünü sepete ekleme, sepete gidip doğrulama, checkout formunu doldurma ve sipariş onayının doğrulanması akışını kapsar.

## Uygulama Anlayışı
- Giriş ekranı: `Username` ve `Password` alanları
- Doğrulanmış kullanıcı: `standard_user` / `secret_sauce`
- Ürün listesi: ürün kartları, fiyat, isim, add to cart butonları
- Sıralama: `Price (low to high)`
- Sepet iş akışı: ürün ekleme, cart sayfası, checkout, form doldurma, overview, completion
- Son aşama: `Thank you for your order!` metni doğrulaması

## Kullanılacak Dayanıklı Locator Stratejileri
Öncelik sırası:
1. Kullanıcı odaklı locator'lar (`getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`)
2. Test ID veya veri alanları (`data-test`) eğer kullanılabiliyorsa
3. Kırılgan CSS/XPath kullanımından kaçınma

Önerilen locator örnekleri:
- `page.getByRole('textbox', { name: 'Username' })`
- `page.getByRole('textbox', { name: 'Password' })`
- `page.getByRole('button', { name: 'Login' })`
- `page.getByRole('combobox', { name: 'Product Sort Container' })`
- `page.getByRole('button', { name: 'Add to cart' }).first()`
- `page.getByRole('button', { name: 'Remove' })`
- `page.getByRole('link', { name: 'shopping cart' })`
- `page.getByRole('button', { name: 'Checkout' })`
- `page.getByRole('textbox', { name: 'First Name' })`
- `page.getByRole('textbox', { name: 'Last Name' })`
- `page.getByRole('textbox', { name: 'Zip/Postal Code' })`

## Senaryo Matrisi

| ID | Tür | Senaryo | Arrange | Act | Assert |
|---|---|---|---|---|---|
| SAU-01 | Pozitif | Başarılı giriş | Login ekranı açık | `standard_user` ve `secret_sauce` ile giriş yapılır | Ürün listesi görünür, kullanıcı ürün sayfasına yönlendirilir |
| SAU-02 | Pozitif | Fiyata göre sıralama | Ürün listesi yüklendi | Sıralama açılır menüsünden `Price (low to high)` seçilir | Ürünler fiyat artışına göre doğru sırada görünür |
| SAU-03 | Pozitif | İlk iki ürünü sepete ekleme | Ürün listesi üzerinde seçim yapılabilir durumdadır | İlk iki ürün için `Add to cart` tıklanır | Her ürün için badge/sepette ürün sayısı artar ve checkout mümkün hale gelir |
| SAU-04 | Pozitif | Sepete ürün doğrulama | Sepet bir veya daha fazla ürün içerir | Sepet simgesine tıklanır | Seçilen ürünler doğru isimler ve fiyatlarla listelenir |
| SAU-05 | Pozitif | Checkout formunu doldurma | Cart sayfası açık | `Checkout` butonuna tıklanıp form alanları doldurulur | Form kabul edilir ve overview sayfası açılır |
| SAU-06 | Pozitif | Sipariş onayı | Overview ekranı görünür | `Finish` butonuna tıklanır | `Thank you for your order!` metni görünür |
| SAU-07 | Negatif | Geçersiz giriş denemesi | Login ekranı açık | Yanlış kullanıcı adı/şifre ile login denemesi yapılır | Hata mesajı görünür ve kullanıcı giriş yapamaz |
| SAU-08 | Sınır | Sepet boşken checkout engelleme | Sepet boş | Checkout butonuna basmaya çalışılır | Checkout işlemi engellenir; ürün eklenmeden devam edilemez |

## Detaylı Senaryo Açıklamaları

### 1) Başarılı giriş
- Arrange: SauceDemo ana sayfası açılır.
- Act: Kullanıcı `Username` alanına `standard_user`, `Password` alanına `secret_sauce` girer ve Login butonuna basar.
- Assert: `Products` başlığı görünür. Kullanıcı ana ürün listesine yönlendirilir.

### 2) Fiyata göre sıralama
- Arrange: Kullanıcı giriş yaptıktan sonra ürün listesi görünür.
- Act: Sıralama menüsünden `Price (low to high)` seçilir.
- Assert: Ürünlerin fiyatları artan sırada görünür; en düşük fiyat ilk sıradadır.
- Not: Fiyatların sıralanması için her ürün kartındaki fiyat etiketi karşılaştırılır.

### 3) İlk iki ürünü sepete ekleme
- Arrange: Ürün listesi mevcut ve add-to-cart butonları erişilebilirdir.
- Act: İlk iki ürünün `Add to cart` butonlarına tıklanır.
- Assert: Her ürün için `Remove` görünür; sepet simgesindeki sayaç 2 olur.

### 4) Sepete gidip ürünleri doğrulama
- Arrange: En az iki ürün sepete eklenmiştir.
- Act: Sepet simgesi tıklanır.
- Assert: Sepet sayfasında seçilen iki ürün bulunur; ürün isimleri ve fiyatları beklenene uygun görünür.

### 5) Checkout formunu doldurma
- Arrange: Sepet sayfası açık, ürünler listelenmiş durumda.
- Act: `Checkout` butonuna basılır; `First Name`, `Last Name`, `Zip/Postal Code` alanları doldurulur ve Continue tıklanır.
- Assert: Overview ekranı görünür; toplam fiyat bilgisi ve ürünler listelenir.

### 6) Sipariş onayı
- Arrange: Overview sayfası görünür.
- Act: `Finish` butonuna basılır.
- Assert: `Thank you for your order!` başlığı görünür; işlemin tamamlandığı doğrulanır.

### 7) Negatif senaryo: Geçersiz giriş
- Arrange: Login ekranı açık.
- Act: Yanlış kullanıcı adı/şifre girilir.
- Assert: Hata mesajı görünür; giriş reddedilir ve kullanıcı ürün ekranına erişemez.

### 8) Sınır senaryo: Sepet boş iken checkout
- Arrange: Sepet boş.
- Act: `Checkout` erişim denemesi yapılır.
- Assert: Kullanıcı checkout akışına geçemez; uygun uyarı veya erişim reddi yaşanır.

## Pozitif Senaryolar
- Başarılı kullanıcı girişi
- Ürünleri fiyat sırasına göre sıralama
- Ürün ekleme
- Sepet doğrulama
- Checkout formu doldurma
- Sipariş onayı

## Negatif Senaryolar
- Geçersiz kullanıcı girişi
- Kayıtlı olmayan ürün için sepete ekleme davranışı
- Checkout ekranında eksik form doldurma

## Sınır Durumları
- Sepet boşken checkout işlemi
- Çok düşük veya çok yüksek fiyatlı ürünler sıralama sırasında doğru sırada görünür mü
- Sayfa yenileme sonrası kullanıcı oturumunun korunması

## Önerilen Test Önceliği
1. P0 - Giriş, ürün ekleme, checkout, sipariş onayı
2. P1 - Sıralama kontrolü, sepet doğrulama, form validasyonu
3. P2 - Negatif ve sınır senaryoları

## Sonuç
Bu plan, SauceDemo e-ticaret satın alma akışını uçtan uca kapsayan güvenilir bir temel senaryo seti sunar. Testler yazılırken kullanıcı görünen metinler ve erişilebilir etiketler kullanılarak stabil locator'lara odaklanılmalı, kırılgan CSS/XPath yapılarından kaçınılmalıdır.
