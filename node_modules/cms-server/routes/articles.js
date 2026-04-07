import express from 'express';
import { authenticate, requireAuthor, requireEditor } from '../middleware/auth.js';
import { articleData } from '../data/articles.js';

const router = express.Router();

// GET /api/articles - List all articles with filtering
router.get('/', authenticate, (req, res) => {
  const { status, category, search } = req.query;
  const filters = {};
  
  if (status) filters.status = status;
  if (category) filters.category = category;
  if (search) filters.search = search;
  
  const articles = articleData.findAll(filters);
  res.json(articles);
});

// GET /api/articles/:id - Get single article
router.get('/:id', authenticate, (req, res) => {
  const article = articleData.findById(req.params.id);
  
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  res.json(article);
});

// POST /api/articles - Create article (Author only)
router.post('/', authenticate, requireAuthor, (req, res) => {
  const { title, body, category, authorId } = req.body;
  
  if (!title || !body || !category || !authorId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const validCategories = ['Tech', 'Sports', 'Culture'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  
  const article = articleData.create({ title, body, category, authorId });
  res.status(201).json(article);
});

// PUT /api/articles/:id - Update article (Author only, own articles only)
router.put('/:id', authenticate, requireAuthor, (req, res) => {
  const { title, body, category } = req.body;
  const article = articleData.findById(req.params.id);
  
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  if (article.authorId !== req.body.authorId) {
    return res.status(403).json({ error: 'Can only edit own articles' });
  }
  
  if (article.status !== 'draft') {
    return res.status(409).json({ error: 'Can only edit draft articles' });
  }
  
  const updates = {};
  if (title) updates.title = title;
  if (body) updates.body = body;
  if (category) updates.category = category;
  
  const updatedArticle = articleData.update(req.params.id, updates);
  res.json(updatedArticle);
});

// DELETE /api/articles/:id - Delete article (Author only, own articles only)
router.delete('/:id', authenticate, requireAuthor, (req, res) => {
  const article = articleData.findById(req.params.id);
  
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  if (article.authorId !== req.body.authorId) {
    return res.status(403).json({ error: 'Can only delete own articles' });
  }
  
  const deleted = articleData.delete(req.params.id);
  if (deleted) {
    res.json({ message: 'Article deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// POST /api/articles/:id/submit - Submit for review (Author only)
router.post('/:id/submit', authenticate, requireAuthor, (req, res) => {
  const article = articleData.findById(req.params.id);
  
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  if (article.authorId !== req.body.authorId) {
    return res.status(403).json({ error: 'Can only submit own articles' });
  }
  
  if (!article.canTransitionTo('in_review')) {
    return res.status(409).json({ error: 'Cannot submit article for review' });
  }
  
  const updatedArticle = articleData.update(req.params.id, { status: 'in_review' });
  res.json(updatedArticle);
});

// POST /api/articles/:id/publish - Publish article (Editor only)
router.post('/:id/publish', authenticate, requireEditor, (req, res) => {
  const article = articleData.findById(req.params.id);
  
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  if (!article.canTransitionTo('published')) {
    return res.status(409).json({ error: 'Cannot publish article' });
  }
  
  const updatedArticle = articleData.update(req.params.id, { status: 'published' });
  res.json(updatedArticle);
});

// POST /api/articles/:id/reject - Reject article (Editor only)
router.post('/:id/reject', authenticate, requireEditor, (req, res) => {
  const article = articleData.findById(req.params.id);
  
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  if (!article.canTransitionTo('rejected')) {
    return res.status(409).json({ error: 'Cannot reject article' });
  }
  
  const updatedArticle = articleData.update(req.params.id, { status: 'rejected' });
  res.json(updatedArticle);
});

export default router;