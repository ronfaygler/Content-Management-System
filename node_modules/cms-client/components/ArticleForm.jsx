import React, { useState } from 'react';
import { useArticles } from '../hooks/useArticles';

const ArticleForm = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    body: article?.body || '',
    category: article?.category || 'Tech',
    authorId: article?.authorId || 'author1'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { createArticle, updateArticle } = useArticles();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (article) {
        await updateArticle(article.id, formData);
      } else {
        await createArticle(formData);
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="article-form">
      <h2>{article ? 'Edit Article' : 'Create New Article'}</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Culture">Culture</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="body">Content:</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows="10"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="authorId">Author ID:</label>
          <input
            type="text"
            id="authorId"
            name="authorId"
            value={formData.authorId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : (article ? 'Update' : 'Create')}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
