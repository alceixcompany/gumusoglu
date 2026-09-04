import Image from 'next/image';

export default function BrandMark({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center ${dark ? '' : 'rounded-xl bg-white px-3 py-2 shadow-sm'}`}
      aria-label="Gümüşoğlu Elektrik"
    >
      <Image
        src="/gumusoglu/gumusoglu-logo.png"
        alt="Gümüşoğlu Elektrik"
        width={2164}
        height={510}
        priority
        className={compact ? 'h-10 w-auto' : 'h-11 w-auto sm:h-12'}
        sizes={compact ? '170px' : '(max-width: 640px) 190px, 210px'}
      />
    </span>
  );
}
