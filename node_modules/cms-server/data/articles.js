import { Article } from '../models/Article.js';

let articles = [];
let nextId = 1;

export const articleData = {
  findAll: (filters = {}) => {
    let filtered = [...articles];
    
    if (filters.status) {
      filtered = filtered.filter(article => article.status === filters.status);
    }
    
    if (filters.category) {
      filtered = filtered.filter(article => article.category === filters.category);
    }
    
    return filtered;
  },

  findById: (id) => {
    return articles.find(article => article.id === id);
  },

  create: (data) => {
    const article = new Article({
      id: nextId.toString(),
      ...data
    });
    articles.push(article);
    nextId++;
    return article;
  },

  update: (id, updates) => {
    const article = articles.find(a => a.id === id);
    if (!article) return null;
    
    return article.update(updates);
  },

  delete: (id) => {
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    articles.splice(index, 1);
    return true;
  }
};
