export type MossType = {
  name: string;
  description: string;
};

export type Application = {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  intro: string;
  sections: { heading: string; body: string }[];
  features: string[];
  mossTypes?: MossType[];
  projectSlug?: string;
};

export const applications: Application[] = [
  {
    slug: "yapay-dikey-bahce",
    title: "Yapay Dikey Bahçe",
    subtitle: "Göz alıcı tasarım, lüks ve ultra gerçekçi görünüm",
    heroImage: "/vg-optimized/vg-app-01.webp",
    intro:
      "Dikey Yapay Bahçe gerçekçi renkleri, gölgeleri, boyutları ve estetiği yakalayan bir görsel dekorasyon tasarımı sunar. Yaşam alanları ve ticari alanlar için iç ya da dış mekan fark etmeksizin tüm alanlara tamamen özelleştirilebilir bir düzen getirir. UV ışınlarına dayanıklı, yangın geciktirici özelliğe sahip ve kaliteli malzeme kullanımı ile doğayı mekanlarla buluşturur.",
    sections: [
      {
        heading: "Neden bizi seçmelisiniz?",
        body: "Standart modüller yapmıyoruz. Müşterinin ihtiyaçlarını dinliyor ve boyuttan şekle, bitki seçimine ve yerleşimine kadar tamamen özelleştirilmiş yapay dikey bahçe tasarımları yaratıyoruz. Bahçelerimizin yapısı benzersizdir; iç ve dış mekanların yanı sıra kurumsal ve konut alanlarında doğal ve gerçekçi bir görünüm ile ferahlık ve dekoratif bir görünüm yaratır.",
      },
      {
        heading: "Faydaları",
        body: "Yapay dikey bahçe dekorasyonu; iç veya dış mekan kullanımı için idealdir. Sıfır bakım maliyeti sağlar (sulama ve budama yok). Böcek veya haşere barındırmaz. Uzun ömürlü ve 1. kalite malzeme kullanılır. Gürültü sönümleyici özelliğe sahiptir. Gerçek bitkileri birebir yansıtan tasarımı ile tüm iklim koşullarına dayanıklıdır.",
      },
    ],
    features: [
      "İç veya dış mekan kullanımı için ideal",
      "Sıfır bakım maliyeti (sulama ve budama yok)",
      "Böcek veya diğer haşereler olmaz",
      "Uzun ömürlü ve 1. kalite malzeme kullanımı",
      "Gürültü sönümleyici özellik",
      "Yüksek kaliteli, ikna edici dekoratif tasarım",
      "Gerçek bitkileri birebir yansıtan tasarım",
      "Tüm iklim koşullarına dayanıklı",
    ],
    projectSlug: "agaoglu-terrace",
  },
  {
    slug: "yosun-duvar",
    title: "Yosun Duvar",
    subtitle: "Alanlarınıza hayat verin",
    heroImage: "/vg-optimized/vg-app-02.webp",
    intro:
      "Zaman, maliyet ve bakım zorluklarının bir kısmı için, alanınızda benzersiz bir yosun duvar dekorasyonu yapabilir, kurumsal ya da yaşamsal alanınıza ve tasarım tercihlerinize tamamen size özel bir yosun duvar dekorasyonu oluşturabiliriz. İç mekanlardaki yosun duvarların hava kalitesini iyileştirdiği, gürültüyü, stresi, karbondioksit seviyelerini ve havadaki tozu azalttığı kanıtlanmıştır.",
    sections: [
      {
        heading: "Neden yosun duvar?",
        body: "Kullandığımız yosunlar Avrupa ormanlarından özenle seçilen, sürdürülebilir ve doğaya tam saygıyla yetiştirilen yosunlardır. Yosun duvar seçtiğinizde sadece güzel bir dekorasyon yapmakla kalmaz, hem nem hem de akustik sönümleyici bir alan yaratırsınız. Yosun duvarlarımız herhangi bir bakım, su veya güneş ışığı gerektirmez. Toz ve bakteri bünyesinde tutar. Hipoalerjenik özelliklere sahiptir.",
      },
    ],
    features: [
      "Akustik yalıtım (5000 Hz'de 91 Sabin dereceli absorbsiyon)",
      "Havayı filtreler ve kokuları giderir",
      "%100 Organik",
      "Sürdürülebilir şekilde hasat edilir",
      "Asla çürümez, ölmez, küflenmez veya solmaz",
      "Sıfır bakım maliyeti (sulama ve budama yok)",
      "Böcek veya diğer haşereler olmaz",
      "Yüksek kaliteli, ikna edici dekoratif tasarım",
    ],
    projectSlug: "colombia-coffee",
    mossTypes: [
      {
        name: "Kara Yosunu (Sheet Moss)",
        description:
          "Kaya veya taş yosunu olarak da bilinen kara yosunu, nemli ağaçlık alanlarda gelişir ve kayalar ile toprak üzerinde koruyucu, halı benzeri kaplamalar oluşturur. Genellikle duvar veya tavan kaplaması olarak uygulanır ve yosun duvar tasarımları için mükemmel bir temel oluşturur. %100 sürdürülebilir kaynaklıdır ve uzun yıllar canlılığını ve dokusunu doğal olarak korur.",
      },
      {
        name: "Top Yosun (Ball Moss)",
        description:
          "Top yosun genellikle alanlara doku eklemek için kullanılır. 3D duvar efektiyle her alana parlak renk ve doku kazandırır. Ormanlardan özenle seçilmiş en kaliteli ürünler, alanınıza doğal ve canlı bir yaşam tarzı getirir. %100 doğal olan top yosunu, müşteri isteğine uygun olarak tasarlanır ve el yapımı işçiliğiyle montajı sağlanır.",
      },
      {
        name: "Rengeyiği Yosunu (Reindeer Moss)",
        description:
          "Ren geyiği yosunu, ağırlıklı olarak arktik ve tundra biyomlarında bulunan, dünyanın en eski ve dayanıklı bitki formlarından biri olan bir liken türüdür. Dokusal ve ses azaltıcı özelliklerini korumak için sürdürülebilir şekilde hasat edilir ve korunur. Zengin dokusu ve renk derinliği ile dekorasyondaki en büyük trendlerden biridir. Menşei Norveç'tir.",
      },
      {
        name: "Tavşan Tüyü Yosunu (Pole Moss)",
        description:
          "Tavşan tüyü yosunu, küçük höyüklerde yetişerek yastık benzeri bir ormanlık zemin dokusu oluşturur. Diğer yosun türleri ile kombine edildiğinde herhangi bir alana boyut kazandırır. Özel bir tasarıma ve verimli gürültü azaltma özelliklerine sahip olması, onu ticari binalarda ses sönümleyici yosun duvar tasarımları veya tavan panelleri için mükemmel bir seçim haline getirir.",
      },
    ],
  },
  {
    slug: "buyuk-yapay-agac",
    title: "Büyük Yapay Ağaç",
    subtitle: "Yeşillik her alana muhteşem bir dokunuş sağlar",
    heroImage: "/vg-optimized/vg-app-03.webp",
    intro:
      "Büyük yapay ağaçlar, alan dekorunuza zarif ve rahatlatıcı bir katkı sağlar. Doğal bir iç mekan ağacı harika bir biyofilik iç tasarım sağlar. Doğal bitkilerin bakımı çok fazla zaman ve çaba gerektirir. Dikey Yapay Bahçe, büyük yapay ağaçlar konusunda geniş bir ürün yelpazesine sahiptir.",
    sections: [
      {
        heading: "Büyük yapay ağaç",
        body: "Büyük yapay ağaçlar hem iç hem de dış mekanlar için dekoratif bir unsur olarak giderek popüler hale geliyor. Yüksek kişiselleştirilebilir yapısı ve bakım gerektirmemesi ile kurumsal ve yaşamsal alanlarda yeşil bir ferahlık tercih eden herkes için uygundur. Çeşitli şekil, boyut ve modellerde bulunur. Palmiye ağacı, huş ağacı, çeşitli meyve ağaçları, çamlar ve daha fazlasıyla alanınız için mükemmel ağacı sağlayabiliriz.",
      },
      {
        heading: "Kurumsal Alanlar",
        body: "Büyük yapay ağaçlar ofisler için harika bir doğal alan oluşumunun yanı sıra daha verimli bir çalışma ortamı için ideal bir seçimdir. Boyut skalası geniştir; küçükten devasa boyutlara kadar dilediğiniz modeli bulabilirsiniz.",
      },
    ],
    features: [
      "İç veya dış mekan kullanımı için ideal",
      "Sıfır bakım maliyeti (sulama ve budama yok)",
      "Böcek veya diğer haşereler olmaz",
      "Uzun ömürlü ve 1. kalite malzeme kullanımı",
      "Yüksek kaliteli, ikna edici dekoratif tasarım",
      "Gerçek ağaçları birebir yansıtan tasarım",
      "Tüm iklim koşullarına dayanıklı",
      "Yangın geciktirici özelliğe sahip kaliteli malzeme",
    ],
    projectSlug: "best-hotel",
  },
  {
    slug: "yapay-gul-duvar-kaplama",
    title: "Yapay Gül Duvar Kaplama",
    subtitle: "Mekanlarınızı renkli ve göz alıcı bir tasarıma dönüştürün",
    heroImage: "/vg-optimized/vg-app-04.webp",
    intro:
      "Müşterileriniz deneyimlerini paylaşmak için doğrudan sosyal medyaya yöneldikleri için ilk izlenimler işletmeler ve markalar için her şey demek. Mekanınızda 'fotoğraflanabilir' bir yapay gül duvar kaplama dekorasyonuna sahip olmak, işletmenizin ihtiyaç duyduğu sosyal medya etkileşimini almasını sağlar.",
    sections: [
      {
        heading: "Mekanlarınızı renklendirin",
        body: "Düğününüz, özel gününüz, etkinlik alanınız ya da mekanınız — hiç fark etmez. Birinci sınıf yapay gül duvar kaplama dekorasyonları tasarlıyoruz. Tamamen kişiselleştirilebilen hizmetimiz ile ihtiyaçlarınıza göre tasarlanan dekorasyonlar sunuyoruz. Cafe, restoran, otel, kurumsal bina, güzellik merkezi ve daha birçok alanda uygulanır.",
      },
      {
        heading: "Kişiselleştirilebilir",
        body: "Uzman ekibimiz, istediğiniz ölçü ve tasarımlarda istediğiniz gibi bir yapay gül duvarı kaplama dekorasyonu oluşturur. Markanızın renkli ve ışıl ışıl bir logosu ile harikulade bir ofis girişi mi istediniz? En güzel dekorasyonları sizin için oluştururuz.",
      },
    ],
    features: [
      "İç veya dış mekan kullanımı için ideal",
      "Sıfır bakım maliyeti (sulama ve budama yok)",
      "Böcek veya diğer haşereler olmaz",
      "Uzun ömürlü ve 1. kalite malzeme kullanımı",
      "Gürültü sönümleyici özellik",
      "Yüksek kaliteli, ikna edici dekoratif tasarım",
      "Gerçek bitkileri birebir yansıtan tasarım",
      "Tüm iklim koşullarına dayanıklı",
    ],
  },
  {
    slug: "yosun-tablolar",
    title: "Yosun Tablolar",
    subtitle: "Doğadan gelen sanat",
    heroImage: "/vg-optimized/vg-app-05.webp",
    intro:
      "Mekanınızı doğa ile özdeşleştirin. Bu eşsiz, özel ve doğal sanat eseri, temiz ve modern olduğu kadar sıcak ve mükemmel bir dekorasyon ögesidir. %100 doğal yosun sanatımızla evinizde ya da iş yerinizde canlılığın tadını çıkarın.",
    sections: [
      {
        heading: "Neden yosun tabloları?",
        body: "Yosun tablolar her alanı zenginleştirecek ve canlandıracak görselliğe ve ihtişama sahiptir. Konut veya ticari her türlü alan için tasarımlar yaparız. Korunmuş yosun kreasyonlarımız dilediğiniz çerçeve seçeneği veya tasarım ile tamamen kişiselleştirilmiş şekilde projelendirilir. Tasarımcılarımız yosunlar, eğrelti otları, doğal dallar, kayalar, ahşap ve diğer botanik unsurları bir araya getirerek harika dekoratif alanlar oluşturur.",
      },
      {
        heading: "Bakım Gerektirmez",
        body: "%100 doğal olan bu ürünler, özel bir yöntemle şoklanarak canlılığını ve dokusunu yitirmeden yıllar boyu alanlarınızın yıldızı olacak. Her bir parçası alanınızın dekorasyonuna uyumlu ve tamamen size özel olarak hazırlanır.",
      },
    ],
    features: [
      "%100 doğal yosun",
      "Bakım gerektirmez (sulama, budama, güneş yok)",
      "Özel yöntemle şoklanmış, yıllarca canlılığını korur",
      "Kişiselleştirilebilir çerçeve ve tasarım",
      "Farklı yosun türleri ve botanik unsurlar",
      "Konut ve ticari alanlar için uygun",
      "Yüksek kaliteli el işçiliği",
      "Doğal ve modern dekoratif görünüm",
    ],
  },
  {
    slug: "yapay-bambu-dekorasyonu",
    title: "Yapay Bambu Dekorasyonu",
    subtitle: "Otantik ve estetik görünüm bir arada",
    heroImage: "/vg-optimized/vg-app-06.webp",
    intro:
      "Çok çeşitli yapay bambu dekorasyonu ürünleri sunuyoruz. Yapay bambu hem iç hem de dış mekanlarda harika bir görsel zenginlik oluşturur. Hem dekoratif hem de mimari olması nedeniyle her ortama uyum sağlar.",
    sections: [
      {
        heading: "Etkileyici bir ortam",
        body: "Birinci kalite malzemelerden üretilmiş bu bitkiler, su, gübre, budama veya bakım gerektirmeden mükemmel ve gerçekçi bir atmosfer sağlar. UV ışınlarına dayanıklı malzemelerle üretildiği için dış mekanlarda solma gerçekleşmez. Yıl boyunca her durumda gür ve dolu görünen bir dekorasyon sağlar.",
      },
      {
        heading: "Geniş ürün skalası",
        body: "60 cm'den 300 cm'ye kadar birçok yapay bambu modeli arasından dekorasyonunuz için en uygun modelleri seçebilirsiniz. Sulama, budama, güneş gibi bakım ihtiyaçlarına gerek duymaz. Kaliteli malzemelerden üretilir, küçük bir bezle temizleme bakımı yeterlidir.",
      },
    ],
    features: [
      "İç veya dış mekan kullanımı için ideal",
      "Sıfır bakım maliyeti (sulama ve budama yok)",
      "Böcek veya diğer haşereler olmaz",
      "Uzun ömürlü ve 1. kalite malzeme kullanımı",
      "Gürültü sönümleyici özellik",
      "Yüksek kaliteli, ikna edici dekoratif tasarım",
      "Gerçek bitkileri birebir yansıtan tasarım",
      "Tüm iklim koşullarına dayanıklı",
    ],
  },
  {
    slug: "yapay-yesil-duvar-panelleri",
    title: "Yapay Yeşil Duvar Panelleri",
    subtitle: "Modüler, kesintisiz ve ultra gerçekçi yeşil duvar çözümü",
    heroImage: "/vg-optimized/vg-app-07.webp",
    intro:
      "Modüler yapay yeşil duvar panelleri, mekanlarınıza kesintisiz ve doğal bir yeşillik getirir. 3 panelli sistem sayesinde tekrarsız desen elde edilir — bir panelin bittiği, diğerinin başladığı belli olmaz. UV, yangın ve dona dayanıklı malzemelerle üretilen paneller, iç ve dış mekanlarda yıllarca ilk günkü canlılığını korur.",
    sections: [
      {
        heading: "3-Panel Sistemi",
        body: "A, B ve C olarak işaretlenen üç farklı panelin birleşimi, tekrarsız ve organik bir görünüm yaratır. Her panelde 16 farklı bitki türü ve 72 bitki bulunur — yoğun ve zengin bir dokusal denge sağlar. Paneller birbirine sorunsuz bağlanır; ek yeri veya kare deseni asla görünmez.",
      },
      {
        heading: "Kolay Montaj",
        body: "Özel sabitleme sistemi, panelleri standart aletlerle her yüzeye hızlıca takmanı sağlar. Panelleri istediğin zaman söküp yeniden takabilirsin. İstenirse boyutlarına göre kesilebilir, köşelere ve özel alanlara uyum sağlar. Montaj sonrası bakım gerektirmez — sulama, budama veya gübreleme yoktur.",
      },
      {
        heading: "Renk ve Doku Kutuları",
        body: "Panelin yeşil dokusuna renk katmak için lavanta, ortanca, sarmaşık, buksus ve daha pek çok bitki kutusu seçeneği mevcut. Zip-tie ile panellere kolayca eklenir; mekanının ruhuna göre özelleştirilebilir. Marka renklerinize uygun özel bitki seçimleri de yapılabilir.",
      },
    ],
    features: [
      "3-panel sistemi ile tekrarsız, organik görünüm",
      "Her panelde 16 bitki türü, 72 bitki",
      "UV, yangın ve dona dayanıklı sertifikalı malzeme",
      "Kesilebilir ve özelleştirilebilir",
      "Sıfır bakım — sulama, budama, gübre yok",
      "İç ve dış mekan için uygun",
      "Hızlı ve kolay montaj",
      "Ses sönümleme özelliği",
    ],
  },
  {
    slug: "yapay-cit-sistemleri",
    title: "Yapay Çit Sistemleri",
    subtitle: "Mahremiyet ve estetik bir arada, bakımsız yeşil çit",
    heroImage: "/vg-optimized/vg-app-08.webp",
    intro:
      "Yapay çit sistemleri, bahçeniz, terasınız veya ticari alanınız için hem mahremiyet hem de yeşil bir görünüm sağlar. Buksus ve çiçekli çit seçenekleri, doğal görünümleriyle gerçek çitlerden ayırt edilemez. UV dayanımlı malzemelerle üretildikleri için dış mekanlarda yıllarca solmazlar.",
    sections: [
      {
        heading: "Buksus Çit",
        body: "Sık yapraklı buksus çit, klasik ve zarif bir yeşil duvar oluşturur. Hem iç hem dış mekanlarda, balkon, teras, bahçe veya ticari alanlarda kullanılabilir. Modüler paneller halinde gelir; istediğiniz ölçüde kesilip montajı yapılabilir. Gerçek buksus çitlerin aksine budama, sulama veya hastalık riski yoktur.",
      },
      {
        heading: "Çiçekli Çit",
        body: "Çiçekli çit sistemleri, yeşil dokunun yanında renkli çiçek açıkları sunar. Bahar ve yaz hissini yıl boyu koruyan bu sistem, etkinlik alanları, kafe ve restoranlar, otel bahçeleri ve özel gün mekanları için idealdir. Renk seçenekleri mekanın ruhuna göre özelleştirilebilir.",
      },
    ],
    features: [
      "UV dayanımlı, dış mekanlarda solmaz",
      "Modüler paneller, kesilebilir",
      "Buksus ve çiçekli seçenekler",
      "Mahremiyet + estetik bir arada",
      "Sıfır bakım",
      "Hızlı montaj",
      "İç ve dış mekan uyumlu",
      "Yangın geciktirici malzeme",
    ],
  },
  {
    slug: "yapay-bolucu-paneller",
    title: "Yapay Bölücü Paneller",
    subtitle: "Döner yeşil panellerle esnek mekan bölümleri",
    heroImage: "/vg-optimized/vg-app-09.webp",
    intro:
      "Döner yapay yeşil bölücü paneller, büyük mekanları esnek şekilde bölmek için tasarlanmıştır. Ofislerde, restoranlarda, otel lobilerinde veya etkinlik alanlarında hem görsel mahremiyet hem yeşil bir vurgu sağlar. Paneller döner eksen üzerinde hareket eder; istediğin anında açıp kapayabilir veya yeniden konumlandırabilirsin.",
    sections: [
      {
        heading: "Esnek Mekan Bölümü",
        body: "Döner panel sistemi, büyük açık alanları sosyal kırılım bölgelerine ayırmak veya küçük özel alanlar yaratmak için idealdir. Toplantı köşeleri, sessiz çalışma alanları, kafe bölümleri veya özel yemek alanları için kullanılabilir. Paneller tek hareketle döner; mekanın düzeni dakikalar içinde değiştirilebilir.",
      },
      {
        heading: "Ses Sönümleme",
        body: "Yoğun yaprak dokusu, arka plan gürültüsünü azaltır. Açık ofislerde, restoranlarda ve kalabalık mekanlarda ses yalıtımı sağlar. Paneller hem görsel hem işitsel mahremiyet sunar — mekan hem sakin hem yeşil kalır.",
      },
    ],
    features: [
      "Döner eksen, esnek konumlandırma",
      "Görsel + işitsel mahremiyet",
      "Modüler, genişletilebilir",
      "Ses sönümleme özelliği",
      "Sıfır bakım",
      "İç mekan için ideal",
      "Hızlı montaj",
      "Özelleştirilebilir bitki seçimi",
    ],
  },
  {
    slug: "akustik-yosun-paneller",
    title: "Akustik Yosun Paneller",
    subtitle: "Doğal yosunla ses sönümleme ve dekorasyon bir arada",
    heroImage: "/vg-optimized/vg-app-10.webp",
    intro:
      "Akustik yosun paneller, %100 doğal korunmuş yosunla kaplı, ses sönümleme özelliğine sahip dekoratif panellerdir. Ofisler, toplantı odaları, restoranlar ve kayıt stüdyoları için idealdir. Yosun, özel bir yöntemle şoklanarak canlılığını yitirmeden yıllarca korunur — sulama, budama veya güneş ışığı gerektirmez.",
    sections: [
      {
        heading: "Ses Sönümleme Performansı",
        body: "Yosun paneller, 5000 Hz frekansta 91 Sabin dereceli ses absorbsiyonu sağlar. Yankılanmayı azaltır, konuşma anlaşılırlığını artırır ve genel akustik konforu yükseltir. Açık ofislerde, restoranlarda ve konferans salonlarında belirgin bir sessizlik hissi yaratır.",
      },
      {
        heading: "Doğal ve Sürdürülebilir",
        body: "Kullandığımız yosunlar Avrupa ormanlarından sürdürülebilir şekilde hasat edilir. Hipoalerjenik özelliktedir, toz ve bakteri tutmaz. Özel koruma işlemi sayesinde çürümez, küflenmez veya solmaz. Yıllarca ilk günkü dokusunu ve rengini korur — tek bakım, ara sıra hafif toz almadır.",
      },
      {
        heading: "Tasarım Esnekliği",
        body: "Paneller farklı boyut, şekil ve çerçeve seçenekleriyle gelir. Marka renklerinize veya mekanın ruhuna göre özelleştirilebilir. Duvar veya tavan uygulaması yapılabilir; logo veya desen gömülebilir. Tasarımcılarımız yosun, eğrelti otu, doğal dallar ve kayaları bir araya getirerek benzersiz sanat eserleri yaratır.",
      },
    ],
    features: [
      "5000 Hz'de 91 Sabin ses absorbsiyonu",
      "%100 doğal, hipoalerjenik yosun",
      "Sulama, budama, güneş yok",
      "Küflenmez, çürüzmez, solmaz",
      "Duvar veya tavan uygulaması",
      "Özel çerçeve ve logo seçenekleri",
      "Sürdürülebilir hasat",
      "Yıllarca canlılığını korur",
    ],
  },
];

export function getApplicationBySlug(slug: string) {
  return applications.find((a) => a.slug === slug);
}
