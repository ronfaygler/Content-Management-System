import React, { useState, useEffect, useRef } from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debounceTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({
      ...prev,
      [name]: value || undefined
    }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      onFilterChange(prev => ({
        ...prev,
        search: value || undefined
      }));
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleClearFilters = () => {
    setSearchTerm('');
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  const activeFilterCount = Object.keys(filters).length;

  const statusOptions = [
    { value: 'draft', label: '📝 Draft', color: '#f59e0b' },
    { value: 'in_review', label: '👀 In Review', color: '#3b82f6' },
    { value: 'published', label: '✅ Published', color: '#10b981' },
    { value: 'rejected', label: '❌ Rejected', color: '#ef4444' }
  ];

  const categoryOptions = [
    { value: 'Tech', label: '💻 Technology' },
    { value: 'Sports', label: '⚽ Sports' },
    { value: 'Culture', label: '🎭 Culture' }
  ];

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : '#6b7280';
  };

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <div className="filter-title-section">
          <h3>🔍 Filter Articles</h3>
          {hasActiveFilters && (
            <span className="active-filters-count">
              {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
            </span>
          )}
        </div>
        <button 
          className="expand-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label="Toggle filter options"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      <div className={`filter-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Search Bar */}
        <div className="filter-group search-group">
          <label htmlFor="search-filter" className="filter-label">
            🔎 Search Articles
          </label>
          <div className="search-input-wrapper">
            <input
              type="text"
              id="search-filter"
              name="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title or content..."
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => {
                  setSearchTerm('');
                  onFilterChange(prev => ({ ...prev, search: undefined }));
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filter-controls">
          {/* Status Filter */}
          <div className="filter-group">
            <label htmlFor="status-filter" className="filter-label">
              📊 Status
            </label>
            <select
              id="status-filter"
              name="status"
              value={filters.status || ''}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label htmlFor="category-filter" className="filter-label">
              📁 Category
            </label>
            <select
              id="category-filter"
              name="category"
              value={filters.category || ''}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="active-filters">
            <h4>Active Filters:</h4>
            <div className="filter-tags">
              {filters.search && (
                <div className="filter-tag search-tag">
                  <span className="tag-icon">🔍</span>
                  <span className="tag-text">"{filters.search}"</span>
                  <button 
                    className="remove-tag"
                    onClick={() => {
                      setSearchTerm('');
                      onFilterChange(prev => {
                        const newFilters = { ...prev };
                        delete newFilters.search;
                        return newFilters;
                      });
                    }}
                    aria-label="Remove search filter"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {filters.status && (
                <div className="filter-tag status-tag" style={{ borderColor: getStatusColor(filters.status) }}>
                  <span className="tag-icon" style={{ color: getStatusColor(filters.status) }}>
                    {statusOptions.find(opt => opt.value === filters.status)?.label.split(' ')[0]}
                  </span>
                  <span className="tag-text">{filters.status.replace('_', ' ')}</span>
                  <button 
                    className="remove-tag"
                    onClick={() => onFilterChange(prev => {
                      const newFilters = { ...prev };
                      delete newFilters.status;
                      return newFilters;
                    })}
                    aria-label="Remove status filter"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {filters.category && (
                <div className="filter-tag category-tag">
                  <span className="tag-icon">
                    {categoryOptions.find(opt => opt.value === filters.category)?.label.split(' ')[0]}
                  </span>
                  <span className="tag-text">{filters.category}</span>
                  <button 
                    className="remove-tag"
                    onClick={() => onFilterChange(prev => {
                      const newFilters = { ...prev };
                      delete newFilters.category;
                      return newFilters;
                    })}
                    aria-label="Remove category filter"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Actions */}
        <div className="filter-actions">
          <button 
            onClick={handleClearFilters}
            className="btn btn-outline"
            disabled={!hasActiveFilters}
          >
            🔄 Clear All Filters
          </button>
          
          <div className="filter-summary">
            {hasActiveFilters ? (
              <span className="summary-text">
                Showing filtered results
              </span>
            ) : (
              <span className="summary-text">
                Showing all articles
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
