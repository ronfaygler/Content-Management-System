import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import ArticleDetail from './components/ArticleDetail';
import FilterBar from './components/FilterBar';
import { useAuth } from './context/AuthContext';
import './App.css';

function AppContent() {
  const [view, setView] = useState('list');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filters, setFilters] = useState({});
  const { isAuthor } = useAuth();

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
    setView('detail');
  };

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setView('create');
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setView('edit');
  };

  const handleSaveArticle = () => {
    setSelectedArticle(null);
    setView('list');
  };

  const handleCancelForm = () => {
    setSelectedArticle(null);
    setView('list');
  };

  return (
    <div className="App">
      <Header />
      
      <main className="App-main">
        <div className="container">
          <div className="toolbar">
            {isAuthor() && (
              <button 
                onClick={handleCreateArticle}
                className="btn btn-primary"
              >
                Create New Article
              </button>
            )}
          </div>

          <FilterBar 
            filters={filters} 
            onFilterChange={setFilters} 
          />

          {view === 'list' && (
            <ArticleList 
              filters={filters}
              onArticleSelect={handleArticleSelect}
              onEditArticle={handleEditArticle}
            />
          )}

          {(view === 'create' || view === 'edit') && (
            <ArticleForm 
              article={selectedArticle}
              onSave={handleSaveArticle}
              onCancel={handleCancelForm}
            />
          )}

          {view === 'detail' && (
            <ArticleDetail 
              article={selectedArticle}
              onClose={handleCancelForm}
              onEdit={handleEditArticle}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
