# 1326 Bursa — Kahve Dükkânı Web Sitesi

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![No Framework](https://img.shields.io/badge/Framework-Yok%20(Vanilla)-4A1F2E?style=flat)
![Status](https://img.shields.io/badge/Durum-Geli%C5%9Ftiriliyor-B5793A?style=flat)

Bursa'nın 1326 yılına atıfla adlandırılmış, hayali bir üçüncü nesil kahve dükkânı için tasarlanmış tek sayfalık web sitesi. Kod tarafı sıfırdan, framework kullanılmadan yazıldı.

Proje bir frontend staj programı kapsamında adım adım inşa edildi; bu repo, projenin bağımsız gelişimini sürdürmek amacıyla ayrı bir yapı olarak açıldı.

---

## İçindekiler

- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Klasör Yapısı](#klasör-yapısı)
- [Nasıl Çalıştırılır](#nasıl-çalıştırılır)
- [Geliştirme Akışı](#geliştirme-akışı)
- [Yol Haritası](#yol-haritası)
- [Ekran Görüntüleri](#ekran-görüntüleri)

---

## Özellikler

- 🎨 Özel bir renk paleti ve tipografi sistemi (CSS custom properties üzerine kurulu)
- 🍔 CSS-only hamburger menü (JavaScript'e ihtiyaç duymadan, checkbox tekniğiyle)
- ✨ Scroll animasyonlu, zikzak düzenli süreç (process) bölümü
- 📋 Veri tabanlı, dinamik olarak oluşturulan sekmeli menü — kategoriye yeni ürün eklemek otomatik olarak sayfaya yansır, HTML'e dokunmaya gerek kalmaz
- 📱 Duyarlı (responsive) tasarım; mobilde kaydırılabilir sekme şeridi (scroll chaining koruması ve kenar gradyanlarıyla desteklenmiş)
- 🧾 3 katmanlı CSS Grid tabanlı rezervasyon formu *(canlı hesaplama geliştirme aşamasında)*

## Teknolojiler

| Katman | Teknoloji |
|---|---|
| Yapı | HTML5 (semantik etiketler) |
| Stil | CSS3 — custom properties, Grid, Flexbox |
| Davranış | Vanilla JavaScript — ES Modules (`import`/`export`) |
| Araçlar | Yok — build aracı, bundler veya framework kullanılmadı |

## Klasör Yapısı

```
bursa-1326-cafe/
├── index.html
├── style.css
├── js/
│   ├── main.js           → giriş noktası, modülleri başlatır ve sırayla çağırır
│   ├── tabs.js            → menü sekmelerinin geçiş, kaydırma ve durum yönetimi
│   └── menu-render.js     → menü verisinden DOM elementleri üreten render fonksiyonu
└── veri-js/
    └── menu-data.js       → menü verisi (kategori → ürün listesi)
```

## Nasıl Çalıştırılır

`index.html` dosyasını bir tarayıcıda açman yeterli.

> **Not:** JavaScript tarafı ES Modules (`type="module"`) kullanıyor. Bazı tarayıcılar, dosya doğrudan `file://` protokolüyle açıldığında modül importlarını güvenlik gereği engelleyebilir. Böyle bir durumda basit bir yerel sunucu üzerinden açman yeterli — örneğin VS Code'un **Live Server** eklentisiyle "Open with Live Server" demen yeterli.

## Geliştirme Akışı

Proje `main` branch'i üzerinde her zaman **çalışan, kararlı** halde tutulur. Yeni bir özellik doğrudan `main` üzerinde geliştirilmez; kendi branch'inde geliştirilip bir Pull Request ile birleştirilir:

```
feature/day-09-reservation-summary
feature/day-10-...
```

Bu akış şu döngüyü izler: branch aç → geliştir ve commit'le → GitHub'a push'la → Pull Request aç → gözden geçir → `main`'e birleştir (`--no-ff`, dal geçmişinin okunur kalması için).

## Yol Haritası

- [ ] Rezervasyon formunda canlı tutar hesaplaması (JS ile)
- [ ] Form doğrulama (gerekli alan kontrolü, geçersiz giriş uyarıları)
- [ ] Erişilebilirlik (accessibility) geliştirmeleri — ARIA nitelikleri, klavye navigasyonu
- [ ] Performans gözden geçirmesi (resim optimizasyonu, gereksiz reflow/repaint kontrolü)

## Ekran Görüntüleri

_Yakında eklenecek._

---

<sub>Bu proje bir frontend staj programının pratik çıktısı olarak başlamış, bağımsız bir proje olarak geliştirilmeye devam etmektedir.</sub>