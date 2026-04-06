import React from 'react';

const ArticleDetail = ({ article, onClose, onEdit }) => {
  if (!article) return null;

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
    <div className="article-detail-overlay">
      <div className="article-detail">
        <div className="article-detail-header">
          <h2>{article.title}</h2>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
        
        <div className="article-detail-content">
          <div className="article-meta">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(article.status) }}
            >
              {article.status.replace('_', ' ')}
            </span>
            <span className="category-badge">Category: {article.category}</span>
            <span className="author-id">Author: {article.authorId}</span>
          </div>
          
          <div className="article-dates">
            <p>Created: {new Date(article.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(article.updatedAt).toLocaleString()}</p>
          </div>
          
          <div className="article-body">
            <h3>Content</h3>
            <p>{article.body}</p>
          </div>
          
          {article.status === 'draft' && (
            <button onClick={() => onEdit(article)} className="btn btn-primary">
              Edit Article
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
