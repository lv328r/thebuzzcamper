import { supabase } from '../lib/supabase';

// --- Shape mappers ---
function mapArticle(row) {
  return {
    id: row.id,
    type: row.type,
    category: row.type,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    content: row.content || '',
    tags: row.tags || [],
    featured: row.featured || false,
    vendorProvided: row.vendor_provided || false,
    author: row.author_name || '',
    authorId: row.author_id || null,
    date: row.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    coverImage: row.cover_image || null,
    rating: row.rating || 0,
    product: row.product || null,
    pros: row.pros || [],
    cons: row.cons || [],
    buildCategory: row.build_category || 'permanent',
    installDetails: row.install_details || {},
    status: row.status || 'published',
    scheduledFor: row.scheduled_for || null,
    comments: [],
  };
}

function mapComment(row) {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    content: row.content,
    date: row.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
  };
}

function articleToRow(article) {
  const row = {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt || '',
    content: article.content || '',
    type: article.type || article.category || 'journal',
    tags: article.tags || [],
    featured: article.featured || false,
    vendor_provided: article.vendorProvided || false,
    cover_image: article.coverImage || null,
    author_id: article.authorId || null,
    author_name: article.author || '',
    rating: article.rating || null,
    product: article.product || null,
    pros: article.pros || [],
    cons: article.cons || [],
    updated_at: new Date().toISOString(),
  };
  if (article.id) row.id = article.id;
  if (article.buildCategory) row.build_category = article.buildCategory;
  if (article.installDetails) row.install_details = article.installDetails;
  if (article.status) row.status = article.status;
  if (article.scheduledFor) row.scheduled_for = article.scheduledFor;
  return row;
}

// --- Articles ---
export async function getArticles({ adminMode = false } = {}) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw error;
  const now = new Date();
  return (data || [])
    .filter((row) => {
      if (adminMode) return true;
      const s = row.status || 'published';
      if (s === 'published') return true;
      if (s === 'scheduled' && row.scheduled_for && new Date(row.scheduled_for) <= now) return true;
      return false;
    })
    .map(mapArticle);
}

export async function getScheduledArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, type, scheduled_for, status')
    .eq('status', 'scheduled')
    .order('scheduled_for', { ascending: true });
  if (error) return [];
  return (data || []).map((row) => ({
    id: row.id, title: row.title, slug: row.slug,
    type: row.type, scheduledFor: row.scheduled_for, status: row.status,
  }));
}

export async function getArticleBySlug(slug) {
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', article.id)
    .order('created_at', { ascending: true });

  return { ...mapArticle(article), comments: (comments || []).map(mapComment) };
}

export async function saveArticle(article) {
  const row = articleToRow(article);
  const { data, error } = await supabase
    .from('articles')
    .upsert(row, { onConflict: 'slug' })
    .select()
    .single();
  if (error) throw error;
  return mapArticle(data);
}

export async function deleteArticle(id) {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleFeatured(id) {
  const { data: current } = await supabase.from('articles').select('featured').eq('id', id).single();
  const { data, error } = await supabase
    .from('articles')
    .update({ featured: !current?.featured })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapArticle(data);
}

// --- Comments ---
export async function addComment(articleId, comment) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      article_id: articleId,
      user_id: comment.userId,
      user_name: comment.userName,
      content: comment.content,
    })
    .select()
    .single();
  if (error) throw error;
  return mapComment(data);
}

export async function deleteComment(articleId, commentId) {
  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) throw error;
}

export async function getAllComments() {
  const { data, error } = await supabase
    .from('comments')
    .select('*, articles(id, title, slug, type)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    ...mapComment(row),
    articleId: row.article_id,
    articleTitle: row.articles?.title || '',
    articleSlug: row.articles?.slug || '',
    articleType: row.articles?.type || 'journal',
  }));
}

// --- Users / Profiles ---
export async function getUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    username: row.username,
    email: '',
    role: row.role,
    bio: row.bio || '',
    joinDate: row.created_at?.split('T')[0],
  }));
}

export async function updateUserRole(userId, role) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteUser(userId) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  if (error) throw error;
}

// --- Stats ---
export async function getSiteStats() {
  const [articlesRes, commentsRes, usersRes] = await Promise.all([
    supabase.from('articles').select('id, type, title, slug, published_at, status, scheduled_for'),
    supabase.from('comments').select('id, user_name, content, created_at, article_id, articles(title)'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ]);

  const articles = articlesRes.data || [];
  const comments = commentsRes.data || [];

  const byType = articles.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, 5)
    .map(mapArticle);

  const recentComments = [...comments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map((row) => ({
      id: row.id,
      userName: row.user_name,
      content: row.content,
      date: row.created_at?.split('T')[0],
      articleTitle: row.articles?.title || '',
      articleId: row.article_id,
    }));

  const scheduled = articles.filter((a) => a.status === 'scheduled');
  const drafts = articles.filter((a) => a.status === 'draft');

  return {
    totalArticles: articles.length,
    totalComments: comments.length,
    totalUsers: usersRes.count || 0,
    totalScheduled: scheduled.length,
    totalDrafts: drafts.length,
    byType,
    recentArticles,
    recentComments,
    scheduledArticles: scheduled.map((a) => ({ id: a.id, title: a.title, slug: a.slug, type: a.type, scheduledFor: a.scheduled_for })),
  };
}

// --- Image upload ---
export async function uploadImage(file) {
  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}

// --- Compat stubs ---
export function initStorage() {}
export function generateId() { return crypto.randomUUID(); }
