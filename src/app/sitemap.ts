import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogPosts';
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||'https://gumusogluelektrik.com';
export default function sitemap():MetadataRoute.Sitemap{
  const pages=['','/hizmetlerimiz','/hakkimizda','/galeri','/blog','/iletisim'].map((path,i)=>({url:`${siteUrl}${path}`,lastModified:new Date(),changeFrequency:'monthly' as const,priority:i===0?1:.8}));
  return [...pages,...blogPosts.map(post=>({url:`${siteUrl}/blog/${post.slug}`,lastModified:new Date(post.publishedDate),changeFrequency:'monthly' as const,priority:.65}))];
}
