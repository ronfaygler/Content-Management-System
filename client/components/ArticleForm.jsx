import React, { useState, useEffect } from 'react';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../context/AuthContext';

const ArticleForm = ({ article, onSave, onCancel }) => {
  const { user } = useAuth();
  const { createArticle, updateArticle } = useArticles();
  
  const [formData, setFormData] = useState({
    title: article?.title || '',
    body: article?.body || '',
    category: article?.category || 'Tech',
    authorId: article?.authorId || user?.id || 'author'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Character limits from DATA_MODELS.md
  const LIMITS = {
    title: 200,
    body: 5000
  };

  // Validation rules
  const validateField = (name, value) => {
    const fieldErrors = {};
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          fieldErrors.required = 'Article title is required';
        } else if (value.length > LIMITS.title) {
          fieldErrors.maxLength = `Title must be less than ${LIMITS.title} characters`;
        } else if (value.length < 1) {
          fieldErrors.minLength = 'Title must be at least 1 character';
        }
        break;
        
      case 'body':
        if (!value.trim()) {
          fieldErrors.required = 'Article body is required';
        } else if (value.length > LIMITS.body) {
          fieldErrors.maxLength = `Body must be less than ${LIMITS.body} characters`;
        } else if (value.length < 1) {
          fieldErrors.minLength = 'Body must be at least 1 character';
        }
        break;
        
      case 'category':
        if (!value) {
          fieldErrors.required = 'Category is required';
        } else if (!['Tech', 'Sports', 'Culture'].includes(value)) {
          fieldErrors.invalid = 'Category must be Tech, Sports, or Culture';
        }
        break;
        
      case 'authorId':
        if (!value.trim()) {
          fieldErrors.required = 'Author ID is required';
        }
        break;
        
      default:
        break;
    }
    
    return fieldErrors;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      if (Object.keys(fieldErrors).length > 0) {
        newErrors[field] = fieldErrors;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field on change if it's been touched
    if (touched[name]) {
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors
      }));
    }
    
    setIsDirty(true);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field on blur
    const fieldErrors = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Validate all fields
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      // Focus on first error field
      const firstErrorField = Object.keys(validationErrors)[0];
      const field = document.getElementById(firstErrorField);
      if (field) {
        field.focus();
      }
      return;
    }
    
    setLoading(true);
    
    try {
      if (article) {
        await updateArticle(article.id, formData);
      } else {
        await createArticle(formData);
      }
      onSave();
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save article' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const getFieldError = (field) => {
    return errors[field] && Object.values(errors[field])[0];
  };

  const hasFieldError = (field) => {
    return errors[field] && Object.keys(errors[field]).length > 0;
  };

  const getCharacterCount = (field) => {
    const value = formData[field] || '';
    return `${value.length}/${LIMITS[field]}`;
  };

  const getCharacterCountClass = (field) => {
    const value = formData[field] || '';
    const percentage = (value.length / LIMITS[field]) * 100;
    
    if (percentage >= 100) return 'character-count error';
    if (percentage >= 90) return 'character-count warning';
    return 'character-count';
  };

  const categories = [
    { value: 'Tech', label: '💻 Technology', description: 'Tech articles and tutorials' },
    { value: 'Sports', label: '⚽ Sports', description: 'Sports news and analysis' },
    { value: 'Culture', label: '🎭 Culture', description: 'Arts, entertainment and culture' }
  ];

  return (
    <div className="article-form">
      <div className="form-header">
        <h2>{article ? '✏️ Edit Article' : '📝 Create New Article'}</h2>
        <p className="form-description">
          {article 
            ? 'Update your article details and content below.'
            : 'Fill in the details below to create a new article.'
          }
        </p>
      </div>
      
      {errors.submit && (
        <div className="error-banner">
          <div className="error-icon">⚠️</div>
          <div className="error-message">{errors.submit}</div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="article-form-content">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Article Title <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${hasFieldError('title') ? 'error' : ''}`}
              placeholder="Enter a compelling title for your article..."
              maxLength={LIMITS.title}
              disabled={loading}
              aria-describedby="title-error title-help"
            />
            <div className="input-footer">
              <span id="title-help" className="help-text">
                Give your article a clear, engaging title
              </span>
              <span className={getCharacterCountClass('title')}>
                {getCharacterCount('title')}
              </span>
            </div>
          </div>
          {hasFieldError('title') && (
            <div id="title-error" className="error-message">
              {getFieldError('title')}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-select ${hasFieldError('category') ? 'error' : ''}`}
              disabled={loading}
              aria-describedby="category-error category-help"
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <span id="category-help" className="help-text">
              Choose the most appropriate category for your article
            </span>
          </div>
          {hasFieldError('category') && (
            <div id="category-error" className="error-message">
              {getFieldError('category')}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="body" className="form-label">
            Article Content <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-textarea ${hasFieldError('body') ? 'error' : ''}`}
              placeholder="Write your article content here..."
              rows="12"
              maxLength={LIMITS.body}
              disabled={loading}
              aria-describedby="body-error body-help"
            />
            <div className="input-footer">
              <span id="body-help" className="help-text">
                Write engaging content with clear structure and proper formatting
              </span>
              <span className={getCharacterCountClass('body')}>
                {getCharacterCount('body')}
              </span>
            </div>
          </div>
          {hasFieldError('body') && (
            <div id="body-error" className="error-message">
              {getFieldError('body')}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="authorId" className="form-label">
            Author ID <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="authorId"
              name="authorId"
              value={formData.authorId}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${hasFieldError('authorId') ? 'error' : ''}`}
              placeholder="Author identifier..."
              disabled={loading || !!article} // Don't allow changing author on edit
              aria-describedby="authorId-error authorId-help"
            />
            <span id="authorId-help" className="help-text">
              Unique identifier for the article author
            </span>
          </div>
          {hasFieldError('authorId') && (
            <div id="authorId-error" className="error-message">
              {getFieldError('authorId')}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading || Object.keys(errors).some(field => hasFieldError(field))}
            className="btn btn-primary btn-large"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {article ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {article ? '💾 Update Article' : '🚀 Create Article'}
              </>
            )}
          </button>
          
          <button 
            type="button" 
            onClick={handleCancel}
            disabled={loading}
            className="btn btn-outline btn-large"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
