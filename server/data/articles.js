import { Article } from '../models/Article.js';

let articles = [];
let nextId = 1;

// Initialize with sample data for testing
const initializeSampleData = () => {
  if (articles.length === 0) {
    articles = [
      new Article({
        id: (nextId++).toString(),
        title: 'Getting Started with React Hooks',
        body: 'React Hooks revolutionized the way we write React components. In this comprehensive guide, we will explore useState, useEffect, and custom hooks. Learn how to manage state and side effects in functional components.',
        category: 'Tech',
        status: 'published',
        authorId: 'author1'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'JavaScript Performance Tips',
        body: 'Optimize your JavaScript code with these performance techniques. Learn about debouncing, throttling, memoization, and other strategies to make your applications faster.',
        category: 'Tech',
        status: 'published',
        authorId: 'author2'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'World Cup Finals Analysis',
        body: 'An in-depth analysis of the World Cup finals match. We examine the key plays, strategies, and turning points that led to the championship victory.',
        category: 'Sports',
        status: 'in_review',
        authorId: 'author1'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'Modern Art Exhibition Review',
        body: 'A review of the latest modern art exhibition featuring contemporary artists from around the world. Explore the themes and techniques used in these groundbreaking works.',
        category: 'Culture',
        status: 'draft',
        authorId: 'author2'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'CSS Grid Layout Tutorial',
        body: 'Master CSS Grid Layout with this step-by-step tutorial. Learn how to create complex layouts with ease using grid-template-areas, grid-gap, and other grid properties.',
        category: 'Tech',
        status: 'published',
        authorId: 'author1'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'Basketball Championship Preview',
        body: 'Get ready for the basketball championship with our comprehensive preview. Team analysis, player matchups, and predictions for the big game.',
        category: 'Sports',
        status: 'draft',
        authorId: 'author2'
      })
    ];
  }
};

// Initialize sample data
initializeSampleData();

export const articleData = {
  findAll: (filters = {}) => {
    let filtered = [...articles];
    
    if (filters.status) {
      filtered = filtered.filter(article => article.status === filters.status);
    }
    
    if (filters.category) {
      filtered = filtered.filter(article => article.category === filters.category);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.body.toLowerCase().includes(searchTerm)
      );
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
  },

  reset: () => {
    articles = [];
    nextId = 1;
    // Reinitialize sample data
    articles = [
      new Article({
        id: (nextId++).toString(),
        title: 'Getting Started with React Hooks',
        body: 'React Hooks revolutionized the way we write React components. In this comprehensive guide, we will explore useState, useEffect, and custom hooks. Learn how to manage state and side effects in functional components.',
        category: 'Tech',
        status: 'published',
        authorId: 'author1'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'JavaScript Performance Tips',
        body: 'Optimize your JavaScript code with these performance techniques. Learn about debouncing, throttling, memoization, and other strategies to make your applications faster.',
        category: 'Tech',
        status: 'published',
        authorId: 'author2'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'World Cup Finals Analysis',
        body: 'An in-depth analysis of the World Cup finals match. We examine the key plays, strategies, and turning points that led to the championship victory.',
        category: 'Sports',
        status: 'in_review',
        authorId: 'author1'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'Modern Art Exhibition Review',
        body: 'A review of the latest modern art exhibition featuring contemporary artists from around the world. Explore the themes and techniques used in these groundbreaking works.',
        category: 'Culture',
        status: 'draft',
        authorId: 'author2'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'CSS Grid Layout Tutorial',
        body: 'Master CSS Grid Layout with this step-by-step tutorial. Learn how to create complex layouts with ease using grid-template-areas, grid-gap, and other grid properties.',
        category: 'Tech',
        status: 'published',
        authorId: 'author1'
      }),
      new Article({
        id: (nextId++).toString(),
        title: 'Basketball Championship Preview',
        body: 'Get ready for the basketball championship with our comprehensive preview. Team analysis, player matchups, and predictions for the big game.',
        category: 'Sports',
        status: 'draft',
        authorId: 'author2'
      })
    ];
  }
};
