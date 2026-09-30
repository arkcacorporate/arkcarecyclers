import { getDb } from '@/lib/mongodb';

/**
 * Blog Article Data Model & Schema Specification
 * 
 * Collection: 'blog_posts'
 * 
 * Target Schema for Future Blog CMS:
 * {
 *   title: string,
 *   slug: string,
 *   content: string | object[],
 *   featuredImage: string,
 *   author: {
 *     name: string,
 *     role?: string,
 *     avatar?: string,
 *     bio?: string
 *   },
 *   seoTitle: string,
 *   metaDescription: string,
 *   status: 'draft' | 'published' | 'archived',
 *   publishedAt: Date | null,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

export const BLOG_COLLECTION = 'blog_posts';

export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

/**
 * Helper to build and normalize a Blog document
 * @param {Object} rawInput
 * @returns {Object} Cleaned blog document
 */
export function buildBlogDocument(rawInput = {}) {
  const now = new Date();

  return {
    title: (rawInput.title || '').trim(),
    slug: (rawInput.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''),
    content: rawInput.content || '',
    featuredImage: rawInput.featuredImage || '',
    author: {
      name: rawInput.author?.name || 'ARKCA Editorial Team',
      role: rawInput.author?.role || 'Environmental Specialist',
      avatar: rawInput.author?.avatar || '/images/recycling/team.webp',
      bio: rawInput.author?.bio || '',
    },
    seoTitle: rawInput.seoTitle || rawInput.title || '',
    metaDescription: rawInput.metaDescription || '',
    status: rawInput.status || BLOG_STATUS.DRAFT,
    publishedAt: rawInput.status === BLOG_STATUS.PUBLISHED ? (rawInput.publishedAt ? new Date(rawInput.publishedAt) : now) : null,
    createdAt: rawInput.createdAt ? new Date(rawInput.createdAt) : now,
    updatedAt: now,
  };
}

/**
 * Helper to get blog collection (prepared for future CMS queries)
 */
export async function getBlogCollection() {
  const db = await getDb();
  return db.collection(BLOG_COLLECTION);
}
