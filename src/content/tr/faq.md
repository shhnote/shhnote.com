---
title: "Sorular ve yanıtlar"
description: "shhnote hakkında sıkça sorulan sorular: hesaplar, bağlantılar, parolalar, geçerlilik süresi ve güvenliğe meraklılar için teknik ayrıntılar."
eyebrow: "SSS"
intro: "Önce kısa yanıtlar, ardından teknik olanlar. Sorunuz burada yoksa nasıl çalışır ve güvenlik sayfaları daha derine iniyor; ayrıca bize her zaman sorabilirsiniz."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Hesap açmam gerekiyor mu?</summary>
    <p>Hayır. Kaydolacak ya da kuracak hiçbir şey yok. shhnote'u açın, sırrınızı yazın, bağlantıyı paylaşın. Hepsi bu.</p>
  </details>
  <details>
    <summary>Bağlantıyı yanlış kişi görürse ne olur?</summary>
    <p>Tek seferlik bir sırrı yalnızca onu ilk açan kişi okuyabilir; ardından sır imha edilir. Asıl alıcı hiçbir şey bulamadığında, birinin onu okuduğunu anlarsınız. Ek güvenlik için bir parola ekleyip onu ayrı paylaşabilirsiniz; böylece bağlantı tek başına yetmez. Fikrinizi değiştirirseniz sırrı özel imha bağlantınızla kendiniz de imha edebilirsiniz.</p>
  </details>
  <details>
    <summary>shhnote sırrımı okuyabilir mi?</summary>
    <p>Hayır. Sırrı açan anahtar bize asla ulaşmaz; sizin tarafınızda, bağlantınızın içinde saklı kalır. Bizde yalnızca açmamızın hiçbir yolu olmayan karıştırılmış bir sürüm bulunur.</p>
  </details>
  <details>
    <summary>Kimse açmazsa ne olur?</summary>
    <p>15 dakika ile 14 gün arasında bir geçerlilik süresi seçersiniz. Süre dolduğunda sır, açılmış olsun ya da olmasın otomatik olarak silinir.</p>
  </details>
  <details>
    <summary>Tek seferlik sır ile süreli sır arasındaki fark nedir?</summary>
    <p>Tek seferlik bir sır açıldığı anda imha edilir. Süreli bir sır ise süresi dolana kadar yeniden açılabilir; ancak sayfa ne kadar süre kaldığını asla söylemez, bu yüzden her sırrı ilk okumada kaydedilmesi gereken bir şey olarak görün.</p>
  </details>
  <details>
    <summary>İmha bağlantısı nedir?</summary>
    <p>Bir sır oluşturduğunuzda aldığınız ikinci, özel bir bağlantı. Açıldığında bir onay ekranı gösterir; onayladığınızda sır, kimse okuyamadan hemen imha edilir. Bu bağlantıyı kendinize saklayın.</p>
  </details>
  <details>
    <summary>Dosya gönderebilir miyim?</summary>
    <p>Evet. Dosyalar tarayıcınızda tıpkı metin gibi şifrelenir ve aynı mühürlü veri bloğunun içinde taşınır. Her şey standart boyutlara dolgulanır; böylece biz bile kısa bir notu küçük bir dosyadan ayırt edemeyiz.</p>
  </details>
  <details>
    <summary>Tor Browser'da veya JavaScript kapalıyken çalışır mı?</summary>
    <p>Bir sır oluşturmak ve göstermek için JavaScript gerekir, çünkü şifreleme tarayıcınızda yapılır. Tor Browser'da “Daha Güvenli” seviyesinde çalışır; “En Güvenli” seviyesinde WebAssembly kapalıdır, bu yüzden parola korumalı sırlar açılamaz ve sayfa bunu belirtir. Diğer tüm sayfalar JavaScript olmadan çalışır.</p>
  </details>
  <details>
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
  <details>
    <summary>Bir API var mı?</summary>
    <p>Evet, bu sitenin kullandığı API'nin ta kendisi. <a href="/en/docs/">Belgeler</a> onu açıklıyor; açık kaynaklı istemci paketi de protokolü kendi araçlarınız için uyguluyor.</p>
  </details>
</div>

<p class="prose-note">Hâlâ merak ediyor musunuz? <a href="/tr/how-it-works/">Nasıl çalıştığını</a>, <a href="/tr/security/">güvenlik ayrıntılarını</a> okuyun ya da <a href="/tr/contact/">bize sorun</a>.</p>
</div>
</section>
