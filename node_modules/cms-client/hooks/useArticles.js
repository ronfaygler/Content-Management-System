import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useArticles = (filters = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole } = useAuth();

  useEffect(() => {
    apiService.setRole(userRole);
  }, [userRole]);

  const fetchArticles = async (articleFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getArticles(articleFilters);
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const createArticle = async (articleData) => {
    try {
      const newArticle = await apiService.createArticle(articleData);
      setArticles(prev => [...prev, newArticle]);
      return newArticle;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateArticle = async (id, articleData) => {
    try {
      const updatedArticle = await apiService.updateArticle(id, articleData);
      setArticles(prev => prev.map(article => 
        article.id === id ? updatedArticle : article
      ));
      return updatedArticle;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteArticle = async (id, authorId) => {
    try {
      await apiService.deleteArticle(id, authorId);
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const submitArticle = async (id, authorId) => {
    try {
      const updatedArticle = await apiService.submitArticle(id, authorId);
      setArticles(prev => prev.map(article => 
        article.id === id ? updatedArticle : article
      ));
      return updatedArticle;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const publishArticle = async (id) => {
    try {
      const updatedArticle = await apiService.publishArticle(id);
      setArticles(prev => prev.map(article => 
        article.id === id ? updatedArticle : article
      ));
      return updatedArticle;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const rejectArticle = async (id) => {
    try {
      const updatedArticle = await apiService.rejectArticle(id);
      setArticles(prev => prev.map(article => 
        article.id === id ? updatedArticle : article
      ));
      return updatedArticle;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    articles,
    loading,
    error,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    submitArticle,
    publishArticle,
    rejectArticle
  };
};
