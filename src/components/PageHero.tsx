import Image from 'next/image';
import React from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image: string;
  imageAlt: string;
  align?: 'left' | 'center';
  heightClassName?: string;
}

const PageHero = ({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  align = 'left',
  heightClassName = 'min-h-[430px] py-24 sm:min-h-[500px] sm:py-28',
}: PageHeroProps) => {
  const isCenter = align === 'center';

  return (
    <section className={`lale-page-hero flex items-center ${heightClassName}`}>
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className={`object-cover ${isCenter ? 'object-center' : 'object-[72%_center]'}`}
          sizes="100vw"
          quality={92}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,241,238,0.96)_0%,rgba(248,241,238,0.88)_36%,rgba(248,241,238,0.60)_58%,rgba(248,241,238,0.20)_76%,rgba(248,241,238,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_36%,rgba(223,167,69,0.18),transparent_30%),radial-gradient(circle_at_86%_20%,rgba(255,255,255,0.52),transparent_24%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className={isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
          <div className={`mb-6 flex items-center gap-3 ${isCenter ? 'justify-center' : ''}`}>
            <span className="h-px w-12 bg-[var(--lale-gold)]" />
            <span className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--lale-gold)]">
              {eyebrow}
            </span>
          </div>

          <h1 className={`font-serif text-[46px] font-normal leading-[0.96] text-[var(--dream-dark)] sm:text-[62px] lg:text-[78px] ${isCenter ? 'mx-auto max-w-[12ch]' : 'max-w-[12ch]'}`}>
            {title}
          </h1>

          <p className={`mt-6 text-sm leading-8 text-[var(--dream-text)] sm:text-lg ${isCenter ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
