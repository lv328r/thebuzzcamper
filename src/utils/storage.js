import { SEED_ARTICLES, SEED_USERS } from '../data/seedData';

const KEYS = {
  ARTICLES: 'buzz_articles',
  USERS: 'buzz_users',
  CURRENT_USER: 'buzz_current_user',
  VERSION: 'buzz_data_version',
};

const DATA_VERSION = '2';

function init() {
  const storedVersion = localStorage.getItem(KEYS.VERSION);
  if (storedVersion !== DATA_VERSION) {
    // Seed data changed — re-initialise articles and users, preserve any content added after V1
    const existingUsers = storedVersion ? JSON.parse(localStorage.getItem(KEYS.USERS) || '[]') : [];
    const mergedUsers = [...SEED_USERS];
    for (const u of existingUsers) {
      if (!mergedUsers.find((su) => su.id === u.id)) {
        mergedUsers.push(u);
      }
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(mergedUsers));
    if (!storedVersion) {
      localStorage.setItem(KEYS.ARTICLES, JSON.stringify(SEED_ARTICLES));
    }
    localStorage.setItem(KEYS.VERSION, DATA_VERSION);
    return;
  }
  if (!localStorage.getItem(KEYS.ARTICLES)) {
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(SEED_ARTICLES));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
  }
}

export function initStorage() {
  init();
}

export function getArticles() {
  init();
  return JSON.parse(localStorage.getItem(KEYS.ARTICLES) || '[]');
}

export function getArticleBySlug(slug) {
  return getArticles().find((a) => a.slug === slug);
}

export function saveArticle(article) {
  const articles = getArticles();
  const idx = articles.findIndex((a) => a.id === article.id);
  if (idx >= 0) {
    articles[idx] = article;
  } else {
    articles.unshift(article);
  }
  localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
  return article;
}

export function deleteArticle(id) {
  const articles = getArticles().filter((a) => a.id !== id);
  localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
}

export function addComment(articleId, comment) {
  const articles = getArticles();
  const article = articles.find((a) => a.id === articleId);
  if (!article) return;
  article.comments = article.comments || [];
  article.comments.push(comment);
  localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
  return article;
}

export function getUsers() {
  init();
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
}

export function getUserById(id) {
  return getUsers().find((u) => u.id === id);
}

export function createUser(user) {
  const users = getUsers();
  if (users.find((u) => u.email === user.email)) {
    throw new Error('Email already registered');
  }
  if (users.find((u) => u.username === user.username)) {
    throw new Error('Username already taken');
  }
  users.push(user);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return user;
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.passwordHash === password);
  if (!user) throw new Error('Invalid email or password');
  const session = { ...user };
  delete session.passwordHash;
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(session));
  return session;
}

export function logoutUser() {
  localStorage.removeItem(KEYS.CURRENT_USER);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(KEYS.CURRENT_USER);
  return raw ? JSON.parse(raw) : null;
}

export function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function deleteComment(articleId, commentId) {
  const articles = getArticles();
  const article = articles.find((a) => a.id === articleId);
  if (!article) return;
  article.comments = (article.comments || []).filter((c) => c.id !== commentId);
  localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
  return article;
}

export function updateUserRole(userId, role) {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');
  user.role = role;
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));

  const current = getCurrentUser();
  if (current && current.id === userId) {
    const updated = { ...current, role };
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updated));
  }
  return user;
}

export function deleteUser(userId) {
  const users = getUsers().filter((u) => u.id !== userId);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getSiteStats() {
  const articles = getArticles();
  const users = getUsers();
  const allComments = articles.flatMap((a) => a.comments || []);

  const byType = articles.reduce((acc, a) => {
    const t = a.type || a.category || 'journal';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const recentComments = allComments
    .map((c) => ({
      ...c,
      articleTitle: articles.find((a) => (a.comments || []).some((ac) => ac.id === c.id))?.title || '',
      articleId: articles.find((a) => (a.comments || []).some((ac) => ac.id === c.id))?.id || '',
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return {
    totalArticles: articles.length,
    totalComments: allComments.length,
    totalUsers: users.length,
    byType,
    recentArticles,
    recentComments,
  };
}

export function toggleFeatured(articleId) {
  const articles = getArticles();
  const article = articles.find((a) => a.id === articleId);
  if (!article) return;
  article.featured = !article.featured;
  localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
  return article;
}

export function getAllComments() {
  const articles = getArticles();
  return articles.flatMap((a) =>
    (a.comments || []).map((c) => ({
      ...c,
      articleId: a.id,
      articleTitle: a.title,
      articleSlug: a.slug,
      articleType: a.type || a.category,
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
}
