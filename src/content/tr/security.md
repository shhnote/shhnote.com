---
title: "Uçtan uca kriptografik yaşam döngüsü"
description: "shhnote'ta verilerinize her adımda ne olduğu: temel yapı taşları, parametreler ve güven sınırları, dürüst çekinceleriyle birlikte."
eyebrow: "Güvenlik · Derinlemesine"
intro: "Verilerinize her adımda ne olduğunun, temel yapı taşları, parametreler ve güven sınırlarıyla birlikte ayrıntılı bir anlatımı. Her adım sade bir özetle başlar; böylece istediğiniz derinlikte okuyabilirsiniz."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Adım 01 · Şifreleme</p>
      <h3>Sırrınız cihazınızda mühürlenir</h3>
      <p class="plain"><b>Kısaca:</b> karıştırma işlemi, herhangi bir şey yüklenmeden önce tarayıcınızda yapılır. Bize ulaşan şey zaten okunamaz hâldedir.</p>
    </div>
    <div class="explainer__detail">
      <p><b>Şifrele</b> düğmesine bastığınızda tarayıcı, WebCrypto CSPRNG'den 256 bitlik yeni bir içerik anahtarı alır ve yükünüzü <b>AES-256-GCM</b> ile şifreler. GCM kimlik doğrulamalıdır: her parça 128 bitlik bir etiket taşır; böylece sonradan yapılan her türlü kurcalama, sessizce çözülmek yerine tespit edilir.</p>
      <p>Metin ve dosyalar aynı şekilde işlenir: ikisi de tek bir opak ikili veri bloğuna dönüşür ve standart bir boyuta dolgulanır; böylece kısa bir şifre ile küçük bir dosya birbirinden ayırt edilemez. Düz metin ağa hiç dokunmaz ve sekmenin belleğinden hiç çıkmaz.</p>
      <div class="spec-list">
        <div><span class="k">Şifre algoritması</span><span class="v">AES-256-GCM, 64 KiB parçalar</span></div>
        <div><span class="k">İçerik anahtarı</span><span class="v">256 bit, her sır için yeni</span></div>
        <div><span class="k">Nonce</span><span class="v">7 baytlık rastgele önek + sayaç</span></div>
        <div><span class="k">Doğrulama etiketi</span><span class="v">parça başına 128 bit</span></div>
        <div><span class="k">Dolgu</span><span class="v">Padmé, en az 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Adım 02 · Anahtarın saklanması</p>
      <h3>Anahtar sunucularımızda değil, bağlantıda saklıdır</h3>
      <p class="plain"><b>Kısaca:</b> bağlantının <span class="color-accent">#</span> işaretinden sonraki kısmı anahtarı taşır ve tarayıcılar bu kısmı hiçbir sunucuya göndermez.</p>
    </div>
    <div class="explainer__detail">
      <p>Bağlantınız, rastgele 256 bitlik bir <b>tohumu</b> URL <b>parçasında</b>, yani <span class="color-accent">#</span> işaretinden sonraki her şeyde taşır. URL belirtimine göre tarayıcı parçayı ayıklar ve sunucularımıza gönderilen <b>isteğe asla dâhil etmez</b>. Tarayıcı bu tohumdan HKDF ile hem sırrı bulmaya yarayan bir arama değeri hem de içerik anahtarının sarmalamasını açan anahtarı türetir. Sunucu yalnızca arama değerinin bir karmasını görür.</p>
      <p>Alıcının tarayıcısı tohumu parçadan okur ve aynı türetmeyi yerelde yapar. Buradaki “sıfır bilgi” ifadesinin anlamı budur: bağlantı olmadan yalnızca şifreli metne sahip olmak hiçbir işe yaramaz.</p>
      <div class="spec-list">
        <div><span class="k">Anahtarın yeri</span><span class="v">URL parçası #</span></div>
        <div><span class="k">Sunucuya gönderilir mi?</span><span class="v">asla</span></div>
        <div><span class="k">Tohum</span><span class="v">32 rastgele bayt, base64url</span></div>
        <div><span class="k">Türetme</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Sunucunun sakladığı</span><span class="v">yalnızca SHA-256(lookup)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Adım 03 · İsteğe bağlı parola</p>
      <h3>Yalnızca insanların bildiği ikinci bir kilit</h3>
      <p class="plain"><b>Kısaca:</b> bir parola eklerseniz, tam bağlantıya sahip olan biri bile parola olmadan sırrı açamaz.</p>
    </div>
    <div class="explainer__detail">
      <p>Bir parola belirlerseniz, parola bellek yoğun bir anahtar türetme fonksiyonu olan <b>Argon2id</b> ile güçlendirilir ve tohumla birleştirilerek içerik anahtarını sarmalayan anahtara dönüştürülür. Parolanın kendisi asla iletilmez veya saklanmaz; onu yalnızca siz ve alıcı bilirsiniz. Yanlış tahminler, alıcının tarayıcısında, zaten elinde olan verilere karşı yeniden denenir; bu yüzden sunucu bunları sayamaz.</p>
      <p>Bellek yoğunluğu, büyük ölçekli çevrimdışı tahmin denemelerini GPU'larda ve ASIC'lerde bile pahalı hâle getirir. Parolayı bağlantıdan <b>farklı bir kanaldan</b> paylaşın; böylece iki unsur hiçbir zaman tek bir yerde bir araya gelmez. Argon2 modülü her oluşturma ve göstermede indirilir; böylece ağ, hangi sırların parola kullandığını anlayamaz.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Tuz</span><span class="v">128 bit rastgele</span></div>
        <div><span class="k">Sarmalama</span><span class="v">AES-256-GCM, 96 bitlik IV</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Adım 04 · Aktarım &amp; depolama</p>
      <h3>Cihazınızdan yalnızca şifreli metin çıkar</h3>
      <p class="plain"><b>Kısaca:</b> kilitli bir kutu ve bir son geçerlilik zamanı saklarız. Başka hiçbir şey yok: ne düz metin, ne anahtar, ne de size dair bir kayıt.</p>
    </div>
    <div class="explainer__detail">
      <p>Veri bloğu <b>TLS</b> üzerinden yüklenir ve depolamada şifreli metin olarak, karma değeri alınmış kimlik bilgileri, kullanım ömrü ve yuvarlanmış bir son geçerlilik zamanıyla birlikte saklanır. Gönderen kimliği, alıcı, IP kaydı, oluşturma zamanı veya erişim geçmişini bilerek <b>hiç</b> tutmayız. Bir sırrı bir kişiye bağlayacak bir hesap sistemi yoktur. Hız sınırlaması, adresin düzenli olarak değişen bir tuz altında alınmış HMAC'i üzerinden çalışır; böylece bir değişimden öncesi, sonrasıyla ilişkilendirilemez.</p>
      <p>Saklanan nesne, parçadaki tohum olmadan anlamsız olduğu için, sunucunun ele geçirilmesi ya da bir mahkeme celbi yalnızca hiçbir şeye geri dönüştürülemeyen opak baytlar ve karmalar ortaya çıkarır.</p>
      <div class="spec-list">
        <div><span class="k">Aktarımda</span><span class="v">TLS</span></div>
        <div><span class="k">Depolamada</span><span class="v">şifreli metin + karma anahtarlar + geçerlilik süresi</span></div>
        <div><span class="k">Kayıtlar</span><span class="v">sır başına yok</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Adım 05 · Alma &amp; imha</p>
      <h3>İlk okuyan kazanır, ardından sır silinir</h3>
      <p class="plain"><b>Kısaca:</b> tek seferlik bir bağlantıyı açmak kutuyu bir kez teslim eder ve sunucudaki kopyayı siler. Ya da dilediğiniz an kendiniz imha edin.</p>
    </div>
    <div class="explainer__detail">
      <p>Gösterme sayfası yüklendiğinde hiçbir şey alınmaz: istek yalnızca gerçek bir tıklama veya tuşa basma ile gönderilir; böylece bağlantı tarama araçları ve sohbet önizlemeleri bir sırrı tüketemez. Tek seferlik bir sır için sunucu, satırı tek bir koşullu güncellemeyle <b>talep eder</b>; yalnızca tek bir istek kazanır ve sır o andan itibaren tüketilmiş sayılır. Bağlantı koparsa aynı tarayıcı 15 dakika boyunca yeniden indirebilir; başka hiç kimse indiremez ve onaylanmamış bir talep geri alınmaz, imha edilir. Süreli sırlar ise süreleri dolana kadar sıradan bir okuma işlemidir.</p>
      <p>Her sırrın ayrıca özel bir <b>imha bağlantısı</b> vardır. Bağlantıyı açmak tek başına hiçbir şeyi imha etmez; onayladığınızda şifreli metin, herhangi bir alıcı okuyamadan hemen silinir.</p>
      <div class="spec-list">
        <div><span class="k">Tek seferlik</span><span class="v">atomik talep, ardından imha</span></div>
        <div><span class="k">Yeniden indirme penceresi</span><span class="v">15 dk, yalnızca aynı istemci</span></div>
        <div><span class="k">Geçerlilik süresi</span><span class="v">15 dk – 14 gün</span></div>
        <div><span class="k">Sahibin kontrolü</span><span class="v">imha bağlantısı</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Tehdit modeli</p>
  <h2 class="section__heading">shhnote neyi görebilir, neyi göremez</h2>
  <p class="section__intro">Dürüst sürüm. Güven sınırı tam olarak burada.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Cihazınızdan asla çıkmaz</p>
    <h3>Göremediklerimiz</h3>
    <p>Düz metniniz · içerik anahtarı ve tohum · parolanız · parola belirlenip belirlenmediği · bir sırrı kimin oluşturduğu veya açtığı · ne zaman oluşturulduğu · IP düzeyinde erişim kayıtları. Bunların hiçbiri iletilmez veya saklanmaz.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Sunucularımızda saklanır</p>
    <h3>Elimizde olanlar</h3>
    <p>Açamadığımız şifreli bir veri bloğu · dolgulanmış boyut sınıfı · tarayıcınızın sırrı bulmak veya imha etmek için kullandığı değerlerin tek yönlü karmaları · tek seferlik mi yoksa süreli mi olduğu · yuvarlanmış bir son geçerlilik zamanı. Bağlantınızdaki tohum olmadan hepsi işe yaramaz.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Bilmeye değer</p>
    <h3>Dürüst çekinceler</h3>
    <p>Tam bağlantıya (ve belirlendiyse parolaya) sahip olan herkes tek seferlik bir sırrı okuyabilir; bağlantıyı sırrın kendisi gibi görün. Bir sır gösterildikten sonra sayfa, siz ayrılırken üzerine yazabildiğini yazar, ancak JavaScript bunu garanti edemez; işiniz bitince sekmeyi kapatın. Gerçek kullanıcı girdisi enjekte eden otomasyonla yönetilen bir tarayıcı, tek seferlik bir sırrı bir insanın açacağı gibi açabilir; bu durumda alıcı hiçbir şey bulamaz, ki bu da dürüst sonuçtur. Bir sırrı silmek kaydı kaldırır; şifreli kalıntılar üzerine yazılana kadar günlüklerde, boş disk alanında veya yedeklerde, anahtarı olmayan şifreli metin olarak kalabilir. Veritabanının dışında saklanan büyük sırlar, dosyanın yazıldığı zamanı taşır. Ve her web uygulamasında olduğu gibi, tarayıcınıza sunulan koda güvenirsiniz; shhnote'un açık kaynaklı ve kendi sunucunuzda barındırılabilir olmasının nedeni de budur.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Kriptografik belirtim</p>
  <h2 class="section__heading">Tüm yapı taşları tek bir yerde</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Şifreleme</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>64 KiB'lik parçalar hâlinde kimlik doğrulamalı simetrik şifreleme. 256 bitlik bir anahtar ve parça başına bir bütünlük etiketi; böylece kurcalama veya kırpma yalnızca okunamaz hâle gelmekle kalmaz, tespit de edilir.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Anahtar türetme</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Anahtarlar ve tanımlayıcılar tohumdan HKDF-SHA-256 ile türetilir. İsteğe bağlı parolalar bellek yoğun bir KDF ile güçlendirilir; bu da çevrimdışı kaba kuvvet saldırılarını özel donanımda bile yavaş ve pahalı kılar.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Rastgelelik</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Tohumlar, anahtarlar, tuzlar ve nonce değerleri tarayıcının kriptografik olarak güvenli üretecinden gelir. Asla <span class="color-faint">Math.random()</span> değil, asla tahmin edilebilir değil.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Anahtarın saklanması</p>
    <div class="spec__val">URL parçası&nbsp;#</div>
    <p>Tohum, bağlantınızdaki # işaretinden sonra yer alır. Tarayıcılar bu parçayı asla iletmez; bu yüzden sunucularımıza hiç ulaşmaz.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Aktarımda</p>
    <div class="spec__val">TLS</div>
    <p>Cihazınızdan yalnızca şifreli metin çıkar ve modern TLS üzerinden taşınır. Bize ulaşan, açamadığımız opak bir veri bloğudur.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Depolamada</p>
    <div class="spec__val">Şifreli metin + karmalar</div>
    <p>Şifreli bir veri bloğu, kimlik bilgilerinin tek yönlü karmaları ve yuvarlanmış bir son geçerlilik zamanı saklarız; düz metin yok, anahtar yok, gönderen veya alıcıya dair üst veri yok.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Teknik SSS</p>
  <h2 class="section__heading">Güvenliğe meraklılar için</h2>
</header>

<div class="faq">
  <details open>
    <summary>Tek seferlik garanti, eşzamanlı isteklere karşı nasıl sağlanıyor?</summary>
    <p>Gösterme işlemi, satırı “active” durumundan “claimed” durumuna taşıyan tek bir koşullu güncelleme çalıştırır. Eşzamanlı iki istek birden başarılı olamaz; ikincisi zaten talep edilmiş bir kayıtla karşılaşır ve herkesle aynı “sır bulunamadı” yanıtını alır. Talep asla geri alınmaz: indirme yarıda kalırsa talep belirtecine sahip olan, süre penceresi içinde yeniden indirir; aksi hâlde sır okunmadan imha edilir.</p>
  </details>
  <details>
    <summary>Neden sorgu parametresi yerine URL parçası?</summary>
    <p>Sorgu parametreleri sunucuya gönderilir ve erişim kayıtlarına, vekil sunuculara ve analiz araçlarına düşer. Parça (<span class="color-accent">#</span> işaretinden sonrası) ise URL belirtimine göre istemci tarafında kalır; tarayıcı onu HTTP isteğine asla koymaz. Sıfır bilgi tasarımının tüm temeli bu özelliktir. Sır gösterildikten sonra sayfa parçayı adres çubuğundan ve geçmişten de kaldırır.</p>
  </details>
  <details>
    <summary>Bağlantı tarama araçlarının tek seferlik sırları vaktinden önce yakmasını ne engelliyor?</summary>
    <p>Görüntüleme sayfası her sır için aynı statik belgedir ve yüklenirken hiçbir şey almaz. İstek yalnızca güvenilir bir tıklama veya tuşa basma ile gönderilir; betikle yapılan bir <code>click()</code> ya da form gönderimi sayılmaz. Otomatik tarama araçları (e-posta güvenliği, sohbet önizlemeleri, antivirüs) yalnızca bu statik kabuğu yükler.</p>
  </details>
  <details>
    <summary>Bunu doğrulayabilir veya kendi sunucumda barındırabilir miyim?</summary>
    <p>Evet. Kaynak kodunun tamamı AGPLv3 lisansıyla herkese açık; protokol, her uygulamanın kendini sınayabileceği uygunluk test vektörleri içeren bir belirtimde yazılı; ayrıca bir kendi sunucunda barındırma rehberi de var. İstemci tarafındaki kriptografiyi denetleyebilir ve kendi kurulumunuzu çalıştırarak güven sınırını tamamen kendi elinizde tutabilirsiniz.</p>
  </details>
  <details>
    <summary>Kötüye kullanımı önlemek için bir şey kaydediliyor mu?</summary>
    <p>Sır başına erişim kaydı veya IP geçmişi tutmayız. Hız sınırlaması, adresin anahtarlı bir karmasını kullanır; tuz değeri düzenli olarak değişir ve değiştiğinde tüm sayaçları da sıfırlar. Kötüye kullanım bildirimleri günlük olarak sayılır; hangi sırrın bildirildiğine dair kayıt yoktur.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Güvenli paylaşım için ipuçları

- Parolayı bağlantıdan farklı bir yoldan gönderin; örneğin bağlantıyı e-postayla, parolayı telefonla.
- İşinizi görecek en kısa geçerlilik süresini seçin.
- Şifreler ve tam olarak bir kez okunması gereken diğer bilgiler için tek seferlik bir sır kullanın.

<h2 id="reporting-a-vulnerability">Güvenlik açığı bildirme</h2>

Bu sitede bir güvenlik sorunu bulduğunuzu düşünüyorsanız, lütfen başka birine söylemeden önce [security@shhnote.com](mailto:security@shhnote.com) adresine e-posta göndererek bize gizlice bildirin. Ne bulduğunuzu ve nasıl yeniden oluşturulabileceğini ekleyin.

Bizim yapacaklarımız:

- [number] iş günü içinde yanıt vermek;
- düzeltme sürecinde sizi bilgilendirmek;
- isterseniz, düzeltmeyi yayımladığımızda adınızı anmak.

Test yaparken lütfen başkalarının verilerine erişmeyin, hizmeti aksatmayın ve hizmete ağır yük bindiren otomatik taramalar çalıştırmayın.

shhnote yazılımının kendisindeki güvenlik açıkları için [projenin güvenlik politikasına](https://github.com/shhnote/shhnote/security) bakın.

<p class="btn-row btn-row--center"><a href="/tr/#create" class="btn btn--primary"><span>Bir sır oluştur</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Kaynak kodunu GitHub'da görün</span></a></p>

</div>
</div>
</section>
