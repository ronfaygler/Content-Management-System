import React from 'react';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../context/AuthContext';

const ArticleList = ({ filters = {}, onArticleSelect }) => {
  const { articles, loading, error, deleteArticle, submitArticle, publishArticle, rejectArticle } = useArticles(filters);
  const { isAuthor, isEditor } = useAuth();

  if (loading) {
    return <div className="loading">Loading articles...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const handleDelete = async (id, authorId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id, authorId);
      } catch (err) {
        alert('Failed to delete article: ' + err.message);
      }
    }
  };

  const handleSubmit = async (id, authorId) => {
    try {
      await submitArticle(id, authorId);
      alert('Article submitted for review');
    } catch (err) {
      alert('Failed to submit article: ' + err.message);
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishArticle(id);
      alert('Article published');
    } catch (err) {
      alert('Failed to publish article: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectArticle(id);
      alert('Article rejected');
    } catch (err) {
      alert('Failed to reject article: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: '#ffc107',
      in_review: '#17a2b8',
      published: '#28a745',
      rejected: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="article-list">
      <h2>Articles</h2>
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="articles-grid">
          {articles.map(article => (
            <div key={article.id} className="article-card">
              <h3>{article.title}</h3>
              <p className="article-category">Category: {article.category}</p>
              <p className="article-body">{article.body.substring(0, 150)}...</p>
              <div className="article-meta">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(article.status) }}
                >
                  {article.status.replace('_', ' ')}
                </span>
                <small>Created: {new Date(article.createdAt).toLocaleDateString()}</small>
              </div>
              
              <div className="article-actions">
                <button 
                  onClick={() => onArticleSelect(article)}
                  className="btn btn-secondary"
                >
                  View Details
                </button>
                
                {isAuthor() && article.status === 'draft' && (
                  <>
                    <button 
                      onClick={() => handleSubmit(article.id, article.authorId)}
                      className="btn btn-primary"
                    >
                      Submit for Review
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id, article.authorId)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </>
                )}
                
                {isEditor() && article.status === 'in_review' && (
                  <>
                    <button 
                      onClick={() => handlePublish(article.id)}
                      className="btn btn-success"
                    >
                      Publish
                    </button>
                    <button 
                      onClick={() => handleReject(article.id)}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;
