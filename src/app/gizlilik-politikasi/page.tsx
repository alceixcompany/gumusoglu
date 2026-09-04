'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiDatabase, FiLock, FiInfo, FiUserCheck, FiMail } from 'react-icons/fi';
import PageHero from '@/components/PageHero';

const sections = [
  {
    icon: FiInfo,
    title: '1. Giriş ve Veri Sorumlusu',
    content: 'Sunny Life Solarium & Beauty olarak, web sitemizi ziyaret eden ve hizmetlerimizden faydalanan misafirlerimizin kişisel verilerinin korunmasına büyük önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla hareket etmekteyiz. Bu politika, kişisel verilerinizin nasıl toplandığı, işlendiği, korunduğu ve haklarınız hakkında sizi bilgilendirmeyi amaçlar.'
  },
  {
    icon: FiDatabase,
    title: '2. Toplanan Kişisel Veriler',
    content: 'Hizmetlerimizden yararlanmak amacıyla bizimle paylaştığınız veya otomatik olarak toplanan şu kişisel verileriniz işlenmektedir: Ad, soyad, telefon numarası, e-posta adresi, randevu detayları, tercih ettiğiniz hizmet türleri, sitemizde yaptığınız gezintilere dair kullanım verileri ile yasal zorunluluklar gereği toplanması gereken diğer bilgiler.'
  },
  {
    icon: FiUserCheck,
    title: '3. Veri İşleme Amaçları',
    content: 'Kişisel verileriniz; randevularınızın planlanması ve yönetimi, talep ettiğiniz güzellik ve bakım hizmetlerinin en iyi şekilde sunulması, yeni hizmetlerimiz, kampanyalarımız ve özel tekliflerimiz hakkında sizi bilgilendirmek, müşteri memnuniyetini ölçmek ve yasal mevzuattan kaynaklanan yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.'
  },
  {
    icon: FiLock,
    title: '4. Veri Güvenliği ve Saklama Süresi',
    content: 'Verilerinizin güvenliğini sağlamak amacıyla gerekli teknik ve idari tedbirler alınmaktadır. Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve ilgili yasal mevzuatta öngörülen saklama süreleri sınırları dahilinde güvenli veritabanlarımızda SSL şifrelemesi ve modern siber güvenlik önlemleriyle korunarak saklanır.'
  },
  {
    icon: FiShield,
    title: '5. KVKK Kapsamındaki Haklarınız',
    content: 'KVKK\'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme ve verilerinizin silinmesini talep etme haklarına sahipsiniz.'
  },
  {
    icon: FiMail,
    title: '6. İletişim ve Bilgi Talebi',
    content: 'Gizlilik Politikamız veya KVKK kapsamındaki haklarınızla ilgili tüm soru, öneri ve taleplerinizi mağazamıza yazılı olarak veya 0531 289 99 69 numaralı telefon hattımız üzerinden bizimle paylaşabilirsiniz. Talepleriniz en kısa sürede ve en geç 30 gün içinde yanıtlanacaktır.'
  }
];

const PrivacyPolicyPage = () => {
  return (
    <div className="page-flow min-h-screen bg-[var(--lale-cream)] text-[var(--dream-dark)]">
      <PageHero
        eyebrow="Gizlilik & Güvenlik"
        title={<>Kişisel Verilerin<br />Korunması</>}
        description="Sunny Life Solarium & Beauty olarak kişisel verilerinizin gizliliğini ve güvenliğini en üst seviyede tutuyoruz."
        image="/banner/sunnylife-solarium-studio.webp"
        imageAlt="Sunny Life Solarium & Beauty Gizlilik Politikası"
        heightClassName="min-h-[380px] py-20 sm:min-h-[440px] sm:py-24"
      />

      <section className="py-24 sm:py-32 relative overflow-hidden bg-white/[0.6]">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(223,167,69,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(223,167,69,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl px-5 sm:px-7 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block h-px w-20 bg-[var(--lale-gold)] mb-6" />
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--lale-gold)] mb-4">Gizlilik Politikası</h2>
            <p className="text-sm tracking-wider text-[var(--dream-text)] uppercase font-semibold">
              Son Güncelleme: Temmuz 2026
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {sections.map((sec, idx) => {
              const IconComponent = sec.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="p-8 sm:p-10 rounded-[32px] border border-[rgba(223,167,69,0.18)] bg-white/[0.85] shadow-[0_15px_40px_rgba(95,89,108,0.05)] hover:border-[var(--lale-gold)]/60 hover:shadow-[0_20px_50px_rgba(223,167,69,0.1)] transition-all duration-300 overflow-hidden group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[rgba(223,167,69,0.08)] rounded-xl flex items-center justify-center text-[var(--lale-gold)] border border-[rgba(223,167,69,0.18)] shadow-sm group-hover:scale-110 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-[var(--dream-dark)] font-normal">
                        {sec.title}
                      </h3>
                    </div>

                    <div className="h-px w-16 bg-[linear-gradient(90deg,var(--lale-gold),transparent)] mb-5" />

                    <p className="text-[var(--dream-text)] leading-relaxed text-sm sm:text-base">
                      {sec.content}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center p-8 rounded-[24px] border border-[rgba(223,167,69,0.12)] bg-[rgba(248,241,238,0.4)] text-[var(--dream-text)] text-sm leading-relaxed"
          >
            <p>
              Web sitemizi kullanarak, bu Gizlilik Politikası kapsamında yer alan tüm hükümleri kabul etmiş sayılırsınız. 
              Sunny Life Solarium & Beauty, gerekli durumlarda bu politikayı güncelleme hakkını saklı tutar.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
