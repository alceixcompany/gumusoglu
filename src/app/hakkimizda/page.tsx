import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheck, FiShield, FiTarget } from 'react-icons/fi';
import SitePageHero from '@/components/SitePageHero';

const services = [
  'Toptan ve perakende elektrik malzemeleri satışı',
  'Konut, ticarethane ve sanayi tesisleri için altyapı ve tesisat uygulamaları',
  'Mühendislik, plan, proje ve taahhüt hizmetleri',
];

export default function AboutPage() {
  return (
    <main>
      <SitePageHero
        eyebrow="Hakkımızda"
        title="Yarım asırlık güvenin hikâyesi."
        description="1974 yılından bu yana, yarım asra yaklaşan tecrübemiz ve ilk günkü çalışma azmimizle Ordu Akkuş ve çevresine güvenli, kesintisiz ve kaliteli enerji çözümleri sunuyoruz."
        image="/gumusoglu/electrical-store.webp"
      />

      <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-[480px] overflow-hidden rounded-[28px]">
            <Image src="/gumusoglu/project-planning.webp" alt="Elektrik proje planlama" fill className="object-cover" sizes="(max-width:1024px) 100vw,45vw" />
            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/92 p-5 shadow-xl backdrop-blur">
              <b className="text-3xl font-black text-[#e30613]">1974</b>
              <span className="ml-3 text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]">Kuruluş</span>
            </div>
          </div>

          <div>
            <p className="eyebrow">Köklerimiz</p>
            <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-.05em]">Gerçek Elektrik&apos;ten Gümüşoğlu Elektrik&apos;e.</h2>
            <div className="mt-7 space-y-5 text-base leading-8 text-[var(--muted)]">
              <p>Faaliyetlerimize 1974 yılında Gerçek Elektrik unvanıyla adım atarak bölgemizin altyapı ve elektrik ihtiyacına öncülük ettik. 1999 yılı itibarıyla kurumsallaşma yolunda önemli bir adım atarak yolumuza Gümüşoğlu Elektrik olarak devam etme kararı aldık.</p>
              <p>Kurulduğumuz günden bu yana geniş bir yelpazede hizmet vermekteyiz:</p>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service} className="flex items-start gap-3">
                    <FiCheck className="mt-2 shrink-0 text-[#ef1b18]" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
              <p>Bugüne kadar sayısız konuta, iş yerine ve kamu alanına enerjiyi ulaştırmanın, binlerce yaşam alanını aydınlatmanın haklı gururunu taşıyoruz.</p>
              <p>Sektörün getirdiği yenilikleri, gelişen teknolojileri ve güvenlik standartlarını yakından takip ederek projelerimizi en doğru malzeme, nitelikli işçilik ve zamanında teslim ilkeleriyle yürütüyoruz. Gümüşoğlu Elektrik olarak, geçmişimizden aldığımız bu köklü birikim ve müşteri memnuniyetini esas alan yaklaşımımızla, geleceğin projelerine güvenle ışık tutmaya devam ediyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff3f3] px-5 py-20 sm:px-8 lg:px-14">
        <div className="mx-auto grid max-w-[1500px] gap-6 md:grid-cols-2">
          <article className="rounded-[26px] bg-white p-8">
            <FiTarget className="h-7 w-7 text-[#e30613]" />
            <p className="mt-6 text-xs font-black uppercase tracking-[.18em] text-[#e30613]">Misyonumuz <span className="normal-case tracking-normal text-[var(--muted)]">(Özgörev)</span></p>
            <h2 className="mt-3 text-2xl font-black">Güvenle ışık taşımak.</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">1974 yılından günümüze uzanan köklü tecrübemizle, bölgemizdeki tüm konut, ticarethane ve sanayi tesislerine güvenli, kaliteli ve kesintisiz enerji çözümleri sunmaktır. Gümüşoğlu Elektrik olarak; toptan ve perakende malzeme tedariğinden plan, proje ve taahhüt hizmetlerine kadar her aşamada uluslararası standartlara, güncel güvenlik yönetmeliklerine ve yüksek işçilik kalitesine bağlı kalarak yaşam alanlarına güvenle ışık taşımak temel varlık sebebimizdir.</p>
          </article>

          <article className="rounded-[26px] bg-white p-8">
            <FiShield className="h-7 w-7 text-[#b90913]" />
            <p className="mt-6 text-xs font-black uppercase tracking-[.18em] text-[#b90913]">Vizyonumuz <span className="normal-case tracking-normal text-[var(--muted)]">(Uzakgörüş)</span></p>
            <h2 className="mt-3 text-2xl font-black">Bölgemizin güvenilir referansı.</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">Gelişen teknolojileri ve yenilikçi elektrik çözümlerini sektörümüzle buluşturarak, bölgemizde elektrik, tesisat ve projelendirme alanında akla gelen ilk ve en güvenilir kurum unvanını korumak; yarım asırlık kurumsal birikimimizi modern hizmet anlayışıyla geleceğe taşıyarak sektörde öncü ve referans gösterilen bir marka olmaya devam etmektir.</p>
          </article>
        </div>
      </section>

      <section className="px-5 py-16 text-center sm:px-8">
        <h2 className="text-3xl font-black">Projeniz için yanınızdayız.</h2>
        <Link href="/iletisim" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#e30613] px-6 py-4 text-sm font-black text-white">Bize ulaşın <FiArrowRight /></Link>
      </section>
    </main>
  );
}
