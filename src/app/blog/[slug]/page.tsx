import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiCheck, FiClock } from 'react-icons/fi';
import SitePageHero from '@/components/SitePageHero';
import { blogPosts } from '@/data/blogPosts';
import { getPublishedPost } from '@/lib/publicContent';

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return blogPosts.map(x=>({slug:x.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const post=await getPublishedPost((await params).slug);return post?{title:post.title,description:post.excerpt,alternates:{canonical:`/blog/${post.slug}`}}:{}}

export default async function BlogDetail({params}:Props){const post=await getPublishedPost((await params).slug);if(!post)notFound();return <main>
  <SitePageHero eyebrow={post.category} title={post.title} description={post.excerpt} image={post.image}/>
  <article className="bg-[#fafafa] px-5 py-16 sm:px-8 lg:px-14 lg:py-24"><div className="mx-auto max-w-[900px]"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-7"><Link href="/blog" className="inline-flex items-center gap-2 text-xs font-black text-[#e30613]"><FiArrowLeft/> Tüm yazılar</Link><div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[.15em] text-[var(--muted)]"><span>{post.publishedAt}</span><span>•</span><span className="flex items-center gap-2"><FiClock/>{post.readTime}</span></div></div><div className="mt-10 space-y-6 text-base leading-8 text-[#55555a]">{post.paragraphs.map(p=><p key={p}>{p}</p>)}</div><aside className="mt-12 rounded-[26px] border border-[#e7d7d9] bg-[#fff2f3] p-7 sm:p-9"><p className="text-xs font-black uppercase tracking-[.16em] text-[#e30613]">Kısa kontrol listesi</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{post.tips.map(t=><span key={t} className="flex items-start gap-3 text-sm font-bold"><FiCheck className="mt-1 shrink-0 text-[#ef1b18]"/>{t}</span>)}</div></aside></div></article>
</main>}
