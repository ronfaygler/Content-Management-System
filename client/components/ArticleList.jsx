import React, { useState } from 'react';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../context/AuthContext';

const ArticleList = ({ filters = {}, onArticleSelect }) => {
  const { articles, loading, error, deleteArticle, submitArticle, publishArticle, rejectArticle } = useArticles(filters);
  const { isAuthor, isEditor } = useAuth();
  const [actionLoading, setActionLoading] = useState({});

  if (loading) {
    return (
      <div className="article-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-list">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Articles</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async (id, authorId) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      setActionLoading({ ...actionLoading, [id]: 'delete' });
      try {
        await deleteArticle(id, authorId);
      } catch (err) {
        alert('Failed to delete article: ' + err.message);
      } finally {
        setActionLoading({ ...actionLoading, [id]: null });
      }
    }
  };

  const handleSubmit = async (id, authorId) => {
    setActionLoading({ ...actionLoading, [id]: 'submit' });
    try {
      await submitArticle(id, authorId);
      // Success feedback could be improved with a toast notification
    } catch (err) {
      alert('Failed to submit article: ' + err.message);
    } finally {
      setActionLoading({ ...actionLoading, [id]: null });
    }
  };

  const handlePublish = async (id) => {
    setActionLoading({ ...actionLoading, [id]: 'publish' });
    try {
      await publishArticle(id);
    } catch (err) {
      alert('Failed to publish article: ' + err.message);
    } finally {
      setActionLoading({ ...actionLoading, [id]: null });
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this article?')) {
      setActionLoading({ ...actionLoading, [id]: 'reject' });
      try {
        await rejectArticle(id);
      } catch (err) {
        alert('Failed to reject article: ' + err.message);
      } finally {
        setActionLoading({ ...actionLoading, [id]: null });
      }
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      draft: {
        color: '#f59e0b',
        bgColor: '#fef3c7',
        icon: '📝',
        label: 'Draft'
      },
      in_review: {
        color: '#3b82f6',
        bgColor: '#dbeafe',
        icon: '👀',
        label: 'In Review'
      },
      published: {
        color: '#10b981',
        bgColor: '#d1fae5',
        icon: '✅',
        label: 'Published'
      },
      rejected: {
        color: '#ef4444',
        bgColor: '#fee2e2',
        icon: '❌',
        label: 'Rejected'
      }
    };
    return configs[status] || configs.draft;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Tech: '💻',
      Sports: '⚽',
      Culture: '🎭'
    };
    return icons[category] || '📄';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  return (
    <div className="article-list">
      <div className="article-list-header">
        <h2>Articles</h2>
        <span className="article-count">{articles.length} {articles.length === 1 ? 'article' : 'articles'}</span>
      </div>
      
      {articles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No articles found</h3>
          <p>
            {Object.keys(filters).length > 0 
              ? 'Try adjusting your filters to see more articles.'
              : 'Get started by creating your first article.'
            }
          </p>
          {isAuthor() && Object.keys(filters).length === 0 && (
            <button 
              onClick={() => onArticleSelect(null)}
              className="btn btn-primary"
            >
              Create First Article
            </button>
          )}
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map(article => {
            const statusConfig = getStatusConfig(article.status);
            const isLoading = actionLoading[article.id];
            
            return (
              <div key={article.id} className="article-card">
                <div className="article-header">
                  <div className="article-category">
                    <span className="category-icon">{getCategoryIcon(article.category)}</span>
                    <span className="category-name">{article.category}</span>
                  </div>
                  <div 
                    className="status-badge"
                    style={{ 
                      backgroundColor: statusConfig.bgColor,
                      color: statusConfig.color
                    }}
                  >
                    <span className="status-icon">{statusConfig.icon}</span>
                    <span className="status-label">{statusConfig.label}</span>
                  </div>
                </div>
                
                <div className="article-content">
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">
                    {article.body.length > 150 
                      ? `${article.body.substring(0, 150)}...` 
                      : article.body
                    }
                  </p>
                </div>
                
                <div className="article-footer">
                  <div className="article-meta">
                    <span className="article-date">
                      📅 {formatDate(article.createdAt)}
                    </span>
                    <span className="article-author">
                      👤 {article.authorId === 'author' ? 'Author' : 'Editor'}
                    </span>
                  </div>
                </div>
                
                <div className="article-actions">
                  <button 
                    onClick={() => onArticleSelect(article)}
                    className="btn btn-outline"
                    disabled={isLoading}
                  >
                    👁️ View Details
                  </button>
                  
                  {isAuthor() && article.status === 'draft' && (
                    <>
                      <button 
                        onClick={() => handleSubmit(article.id, article.authorId)}
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading === 'submit' ? '⏳' : '📤'} Submit for Review
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id, article.authorId)}
                        className="btn btn-danger"
                        disabled={isLoading}
                      >
                        {isLoading === 'delete' ? '⏳' : '🗑️'} Delete
                      </button>
                    </>
                  )}
                  
                  {isEditor() && article.status === 'in_review' && (
                    <>
                      <button 
                        onClick={() => handlePublish(article.id)}
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading === 'publish' ? '⏳' : '✅'} Publish
                      </button>
                      <button 
                        onClick={() => handleReject(article.id)}
                        className="btn btn-danger"
                        disabled={isLoading}
                      >
                        {isLoading === 'reject' ? '⏳' : '❌'} Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ArticleList;
