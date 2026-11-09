# Todo Listesi Yönetimi - Test Senaryoları

## Amaç
Bu plan, `https://demo.playwright.dev/todomvc` uygulamasındaki temel todo yönetimi iş akışlarını kapsar. Amaç, kullanıcıların görev ekleme, tamamlama, düzenleme, silme, filtreleme ve tamamlananları temizleme davranışlarını doğrulayan güvenilir, sürdürülebilir Playwright test senaryolarını tanımlamaktır.

## Uygulama Anlayışı
- Kullanıcı giriş alanı: `What needs to be done?`
- Görev listesi: her satır bir todo öğesi
- Durum alanları: aktif, tamamlanmış, filtreler (`All`, `Active`, `Completed`)
- Temel etkileşimler: görev ekleme, toggle, düzenleme, silme, filtreleme, "Clear completed"
- Veri kalıcılığı: uygulama tarayıcıda local storage üzerinden state tutar

## Kullanılacak Dayanıklı Locator Stratejileri
Öncelik sırası:
1. Kullanıcı odaklı locator'lar (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`)
2. Test ID'ler (`getByTestId`) eğer varsa
3. Kırılgan CSS/XPath kullanımından kaçınma

Önerilen locator örnekleri:
- `page.getByPlaceholder('What needs to be done?')`
- `page.getByRole('textbox', { name: 'What needs to be done?' })`
- `page.getByRole('link', { name: 'All' })`
- `page.getByRole('link', { name: 'Active' })`
- `page.getByRole('link', { name: 'Completed' })`
- `page.getByRole('button', { name: 'Clear completed' })`
- `page.locator('.todo-list li')` (yalnızca list item'ları hedeflemek için son çare olarak)

## Senaryo Matrisi

| ID | Tür | Senaryo | Arrange | Act | Assert |
|---|---|---|---|---|---|
| TD-01 | Pozitif | Yeni görev ekleme | Boş todo list açılır | Kullanıcı "What needs to be done?" alanına "Alışveriş yap" yazar ve Enter tuşuna basar | Yeni görev listede görünür; görev sayısı 1 artar; input temizlenir |
| TD-02 | Pozitif | Birden fazla görev ekleme | Boş todo list açılır | Ardışık olarak "Ödev yap", "Aynaları sil", "Mektup yaz" eklenir | 3 görev görünür ve liste sırası korunur |
| TD-03 | Negatif | Boş değer ekleme | Input alanı görünür | Kullanıcı boşluk/boş giriş yapıp Enter basar | Yeni görev oluşturulmaz; liste öğesi sayısı değişmez |
| TD-04 | Pozitif | Görevi tamamla | En az bir aktif görev vardır | Kullanıcı görev satırındaki toggle checkbox'ına tıklar | Görev tamamlandı olarak işaretlenir; görünüm 'completed' sınıfına sahip olur; aktif görev sayısı azalır |
| TD-05 | Pozitif | Tamamlanan görevi tekrar aktif et | En az bir tamamlanan görev vardır | Kullanıcı aynı toggle'a tekrar tıklar | Görev tekrar aktif hale gelir; completed işareti kalkar |
| TD-06 | Pozitif | Görevi düzenle | En az bir görev vardır | Kullanıcı görev üzerinde çift tıklayıp yeni başlık yazıp Enter veya blur ile onaylar | Görev başlığı güncellenir; eski başlık kaybolur; liste görünümü güncel kalır |
| TD-07 | Negatif | Görevi boş metinle düzenleme | Mevcut görev vardır | Düzenleme moduna girilir, metin temizlenir ve kaydedilir | Görev boş olarak kaydedilmez; önceki değer korunur veya görev silinmez |
| TD-08 | Pozitif | Görevi silme | En az bir görev vardır | Kullanıcı `Delete`/`x` düğmesine tıklar | Görev listeden kaldırılır; toplam görev sayısı azalır |
| TD-09 | Pozitif | Tüm görevleri filtreleme | Birden fazla görev ve bazı tamamlanmışlar vardır | `All`, `Active`, `Completed` filtreleri sırayla seçilir | Her filtre doğru seti gösterir; sadece ilgili görevler görünür |
| TD-10 | Pozitif | Tamamlananları temizleme | En az 2 görev var, bunlardan bazıları tamamlanmış | `Clear completed` butonuna basılır | Sadece tamamlanmış görevler silinir; aktif görevler listede kalır |
| TD-11 | Pozitif | Tümünü tamamla / tümünü yeniden açma | Birden fazla görev vardır | Toggle all alanı kullanılır | Tüm görevler tek hamlede tamamlanır veya geri açılır |
| TD-12 | Sınır | Uzun metinli görev başlığı | Todo input görünür | Kullanıcı çok uzun metin girer ve ekler | Görev listede tam olarak görünür; sayfa kırılmaz; tasarım bozulmaz |
| TD-13 | Sınır | Aynı görevi tekrar ekleme | Boş liste | Aynı metni iki kez eklenir | Liste iki ayrı görev olarak görünür; duplicate kontrolü yoksa kabul edilir |
| TD-14 | Pozitif | Sayfa yenileme sonrası state korunması | En az bir görev eklenmiş | Sayfa yenilenir | Görevler kaybolmaz; state local storage'dan geri yüklenir |
| TD-15 | Negatif | Filtreleme sonrası yeni görev ekleme | `Active` veya `Completed` filtresi aktif | Kullanıcı yeni bir görev ekler | Yeni görev, aktif filtre mode'u içinde görünürse doğru davranış sergilenir; beklenen filtre kuralı korunur |

## Detaylı Senaryo Açıklamaları

### 1) Yeni görev ekleme
- Arrange: Sayfa yüklenir ve input alanı görünür.
- Act: Kullanıcı `What needs to be done?` alanına görev başlığı girer ve Enter tuşuna basar.
- Assert: Görev listesinde yeni öğe görünür; toplam görev sayısı artar; input alanı temizlenir.
- Kullanılacak locator: `page.getByPlaceholder('What needs to be done?')`

### 2) Boş görev ekleme engelleme
- Arrange: Sayfa açıktır.
- Act: Kullanıcı input alanına sadece boşluk karakteri yazar; Enter basar.
- Assert: Yeni kayıt oluşmaz. Gerçek bir todo item listesine eklenmez.
- Önemli not: Uygulama boş değerlerde “submit” işlemini reject etmelidir.

### 3) Tamamlama / yeniden açma
- Arrange: En az bir görev mevcuttur.
- Act: `toggle` işaretine tıklanır.
- Assert: Görev `completed` olarak işaretlenir; tekrar tıklandığında aktif duruma döner.
- Kullanılacak locator: `page.getByRole('checkbox')` veya `locator('.toggle')`

### 4) Düzenleme durumu
- Arrange: En az bir görev listelenmektedir.
- Act: Kullanıcı görev satırına çift tıklayıp mevcut başlığı değiştirir.
- Assert: Yeni başlık kaydedilir. Önceki değer silinmiş ve listede yeni değer görünür.
- Pozitif/negatif detay: Boş başlık ataması yapılmamalıdır.

### 5) Filtreleme ve `Clear completed`
- Arrange: Belli sayıda görev, bazıları tamamlanmış durumdadır.
- Act: `All`, `Active`, `Completed` linkleri sırasıyla seçilir ve ardından `Clear completed` butonuna basılır.
- Assert: `All` tüm listeyi doğrular; `Active` sadece aktif görevleri gösterir; `Completed` sadece tamamlananları gösterir; `Clear completed` tamamlananları siler.

### 6) State kalıcılığı
- Arrange: Kullanıcı toplamda birkaç görev eklemiştir.
- Act: Sayfa yenilenir.
- Assert: Kullanıcı ekledikleri görevler korunur.
- Bu davranış, todo app'in local storage veya benzeri persistence mekanizmasının doğrulanması için önemlidir.

## Pozitif Senaryolar
- Yeni görev ekleme
- Çoklu görev ekleme
- Görev tamamlama
- Görev tekrar açma
- Görev silme
- Görev düzenleme
- Filtreleme
- Tümünü tamamla
- Tamamlananları temizleme
- Sayfa yenileme sonrası persistence

## Negatif Senaryolar
- Boş görev ekleme
- Boş metin düzenleme
- Geçersiz karakterler veya boşlukla giriş yapılması
- `Clear completed` butonunun etkisiz olduğu durumlar
- Filtreleme sırasında görevlerin yanlış görünmesi

## Sınır Durumları
- Çok uzun metin
- Aynı görevi birden fazla kez eklemek
- Çift tıklama sonrası hızlı Enter/blur kombinasyonu
- Sayfa yükleme öncesi state mevcutsa yeniden oluşturma davranışı

## Önerilen Test Priyortesi
1. P0 - Görev ekleme, silme, tamamlama, filtreleme
2. P1 - Düzenleme ve localStorage persistence
3. P2 - Sınır durumları ve edge-case davranışlar

## Sonuç
Bu senaryo seti, TodoMVC demo uygulamasında kullanıcı merkezli ve yüksek güvenilirlikte otomasyon doğrulaması için yeterli kapsam sunar. Testler yazılırken kullanıcı görünen metin ve roller kullanılarak stabil locator'lar tercih edilmeli, CSS/XPath kırılgan yapılarından mümkün olduğunca kaçınılmalıdır.
