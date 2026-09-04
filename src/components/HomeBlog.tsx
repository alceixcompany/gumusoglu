import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiBookOpen, FiClock } from 'react-icons/fi';
import { blogPosts } from '@/data/blogPosts';

export default function HomeBlog() {
  return (
    <section className="bg-white px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="section-tag"><FiBookOpen /> Faydalı bilgiler</p><h2 className="mt-5 text-3xl font-black tracking-[-.055em] sm:text-5xl">Teknoloji rehberi.</h2></div>
          <div className="flex flex-col items-start gap-4"><p className="max-w-sm text-sm leading-7 text-black/45">Cihazınızı daha uzun ve daha sağlıklı kullanmanız için kısa, anlaşılır notlar.</p><Link href="/blog" className="inline-flex items-center gap-2 text-xs font-black">Tüm yazılar <FiArrowRight /></Link></div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <Link href={`/blog/${blogPosts[0].slug}`} className="group relative min-h-[520px] overflow-hidden rounded-[30px] bg-[var(--ink)] text-white">
            <Image src={blogPosts[0].image} alt={blogPosts[0].title} fill className="object-cover opacity-60 transition duration-700 group-hover:scale-[1.035]" sizes="(max-width:1024px) 100vw, 52vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
            <article className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--taxi-yellow)]"><FiClock /> {blogPosts[0].readTime}</div>
              <h3 className="mt-5 max-w-xl text-2xl font-black leading-tight tracking-[-.04em] sm:text-3xl">{blogPosts[0].title}</h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/55">{blogPosts[0].excerpt}</p>
              <span className="mt-7 inline-flex items-center gap-3 text-sm font-black">Yazıyı incele <FiArrowRight className="transition group-hover:translate-x-1" /></span>
            </article>
          </Link>

          <div className="grid gap-5">
            {blogPosts.slice(1).map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex min-h-[248px] flex-col justify-between rounded-[28px] border border-black/10 bg-[var(--paper)] p-7 transition hover:border-transparent hover:bg-[var(--taxi-yellow)] sm:p-9">
                <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[.18em] text-black/35">Rehber / 0{index + 2}</span><span className="flex items-center gap-2 text-[10px] font-bold text-black/40"><FiClock /> {post.readTime}</span></div>
                <div><h3 className="max-w-lg text-xl font-black leading-tight tracking-[-.04em] sm:text-2xl">{post.title}</h3><div className="mt-4 flex items-end justify-between gap-5"><p className="max-w-md text-sm leading-6 text-black/45">{post.excerpt}</p><FiArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" /></div></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
