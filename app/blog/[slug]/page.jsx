import { notFound } from 'next/navigation';
import BlogPostClient from '@/components/pages/BlogPostClient';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blogData';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  const siteUrl = 'https://arkcarecyclers.com';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const ogImageUrl = `${siteUrl}${post.featuredImage}`;

  return {
    title: `${post.title} | ARKCA Recyclers`,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.metaDescription || post.excerpt,
      url: canonicalUrl,
      siteName: 'ARKCA Recyclers',
      publishedTime: post.publishDate,
      modifiedTime: post.modifiedDate || post.publishDate,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);
  const siteUrl = 'https://arkcarecyclers.com';
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = `${siteUrl}${post.featuredImage}`;

  // Structured Data Schema for BlogPosting / Article
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: imageUrl,
    datePublished: post.publishDate,
    dateModified: post.modifiedDate || post.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ARKCA Recyclers',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo/arkcarecyclerslogo.webp`,
      },
    },
    keywords: post.tags ? post.tags.join(', ') : undefined,
  };

  // Structured Data Schema for Breadcrumbs
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
