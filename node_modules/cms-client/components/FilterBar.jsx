import React from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({
      ...prev,
      [name]: value || undefined
    }));
  };

  return (
    <div className="filter-bar">
      <h3>Filter Articles</h3>
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            name="status"
            value={filters.status || ''}
            onChange={handleChange}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            name="category"
            value={filters.category || ''}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Culture">Culture</option>
          </select>
        </div>

        <button 
          onClick={() => onFilterChange({})}
          className="btn btn-secondary"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
