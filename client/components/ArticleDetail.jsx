import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../hooks/useArticles';

const ArticleDetail = ({ article, onClose, onEdit }) => {
  const { isAuthor, isEditor, user } = useAuth();
  const { deleteArticle, submitArticle, publishArticle, rejectArticle } = useArticles();
  const [actionLoading, setActionLoading] = useState({});

  if (!article) return null;

  const getStatusConfig = (status) => {
    const configs = {
      draft: {
        color: '#f59e0b',
        bgColor: '#fef3c7',
        icon: '📝',
        label: 'Draft',
        description: 'Article is being written and not yet submitted for review'
      },
      in_review: {
        color: '#3b82f6',
        bgColor: '#dbeafe',
        icon: '👀',
        label: 'In Review',
        description: 'Article is under editorial review'
      },
      published: {
        color: '#10b981',
        bgColor: '#d1fae5',
        icon: '✅',
        label: 'Published',
        description: 'Article has been published and is live'
      },
      rejected: {
        color: '#ef4444',
        bgColor: '#fee2e2',
        icon: '❌',
        label: 'Rejected',
        description: 'Article was rejected and needs revisions'
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
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = () => {
    return isAuthor() && 
           article.authorId === user?.id && 
           (article.status === 'draft' || article.status === 'rejected');
  };

  const canSubmit = () => {
    return isAuthor() && 
           article.authorId === user?.id && 
           article.status === 'draft';
  };

  const canPublish = () => {
    return isEditor() && article.status === 'in_review';
  };

  const canReject = () => {
    return isEditor() && article.status === 'in_review';
  };

  const canDelete = () => {
    return isAuthor() && article.authorId === user?.id;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      setActionLoading({ ...actionLoading, delete: true });
      try {
        await deleteArticle(article.id, article.authorId);
        onClose();
      } catch (err) {
        alert('Failed to delete article: ' + err.message);
      } finally {
        setActionLoading({ ...actionLoading, delete: false });
      }
    }
  };

  const handleSubmit = async () => {
    setActionLoading({ ...actionLoading, submit: true });
    try {
      await submitArticle(article.id, article.authorId);
      // In a real app, you'd update the article state or refresh
      window.location.reload();
    } catch (err) {
      alert('Failed to submit article: ' + err.message);
    } finally {
      setActionLoading({ ...actionLoading, submit: false });
    }
  };

  const handlePublish = async () => {
    setActionLoading({ ...actionLoading, publish: true });
    try {
      await publishArticle(article.id);
      window.location.reload();
    } catch (err) {
      alert('Failed to publish article: ' + err.message);
    } finally {
      setActionLoading({ ...actionLoading, publish: false });
    }
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to reject this article?')) {
      setActionLoading({ ...actionLoading, reject: true });
      try {
        await rejectArticle(article.id);
        window.location.reload();
      } catch (err) {
        alert('Failed to reject article: ' + err.message);
      } finally {
        setActionLoading({ ...actionLoading, reject: false });
      }
    }
  };

  const statusConfig = getStatusConfig(article.status);

  return (
    <div className="article-detail-overlay" onClick={onClose}>
      <div className="article-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="article-detail-header">
          <div className="header-content">
            <div className="article-title-section">
              <h1 className="article-title">{article.title}</h1>
              <div className="article-badges">
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
                <div className="category-badge">
                  <span className="category-icon">{getCategoryIcon(article.category)}</span>
                  <span className="category-label">{article.category}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="close-button"
              aria-label="Close article details"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="article-detail-content">
          <div className="article-meta-info">
            <div className="meta-item">
              <span className="meta-icon">👤</span>
              <div className="meta-content">
                <span className="meta-label">Author</span>
                <span className="meta-value">{article.authorId}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <div className="meta-content">
                <span className="meta-label">Created</span>
                <span className="meta-value">{formatDate(article.createdAt)}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <span className="meta-icon">🔄</span>
              <div className="meta-content">
                <span className="meta-label">Last Updated</span>
                <span className="meta-value">{formatDate(article.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="status-description">
            <div className="status-info">
              <span className="status-icon-large">{statusConfig.icon}</span>
              <div className="status-text">
                <h3>{statusConfig.label}</h3>
                <p>{statusConfig.description}</p>
              </div>
            </div>
          </div>
          
          <div className="article-body-content">
            <h2>Article Content</h2>
            <div className="article-text">
              {article.body.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className="article-actions">
            <div className="actions-header">
              <h3>Actions</h3>
              <p className="actions-description">
                {isAuthor() && article.authorId === user?.id 
                  ? 'Manage your article' 
                  : isEditor() 
                    ? 'Review and moderate this article'
                    : 'View article details'
                }
              </p>
            </div>
            
            <div className="action-buttons">
              {canEdit() && (
                <button 
                  onClick={() => onEdit(article)}
                  className="btn btn-primary"
                  disabled={actionLoading.edit}
                >
                  ✏️ Edit Article
                </button>
              )}
              
              {canSubmit() && (
                <button 
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={actionLoading.submit}
                >
                  {actionLoading.submit ? '⏳ Submitting...' : '📤 Submit for Review'}
                </button>
              )}
              
              {canPublish() && (
                <button 
                  onClick={handlePublish}
                  className="btn btn-success"
                  disabled={actionLoading.publish}
                >
                  {actionLoading.publish ? '⏳ Publishing...' : '✅ Publish Article'}
                </button>
              )}
              
              {canReject() && (
                <button 
                  onClick={handleReject}
                  className="btn btn-danger"
                  disabled={actionLoading.reject}
                >
                  {actionLoading.reject ? '⏳ Rejecting...' : '❌ Reject Article'}
                </button>
              )}
              
              {canDelete() && (
                <button 
                  onClick={handleDelete}
                  className="btn btn-danger"
                  disabled={actionLoading.delete}
                >
                  {actionLoading.delete ? '⏳ Deleting...' : '🗑️ Delete Article'}
                </button>
              )}
              
              <button 
                onClick={onClose}
                className="btn btn-outline"
                disabled={Object.values(actionLoading).some(loading => loading)}
              >
                🚪 Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
