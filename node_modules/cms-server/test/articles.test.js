import { test, describe, before, after, beforeEach } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import { app } from '../server.js'
import { articleData } from '../data/articles.js'

describe('Articles API', () => {
  let request

  before(() => {
    request = supertest(app)
  })

  beforeEach(() => {
    // Reset data before each test to ensure test isolation
    articleData.reset()
  })

  describe('GET /api/articles', () => {
    test('should return all articles without filters', async () => {
      const response = await request
        .get('/api/articles')
        .set('Authorization', 'Bearer author')

      assert.strictEqual(response.status, 200)
      assert.ok(Array.isArray(response.body))
      assert.ok(response.body.length > 0)
    })

    test('should require authorization header', async () => {
      const response = await request.get('/api/articles')

      assert.strictEqual(response.status, 401)
      assert.strictEqual(response.body.error, 'Authorization header required')
    })

    test('should filter articles by status', async () => {
      const response = await request
        .get('/api/articles?status=published')
        .set('Authorization', 'Bearer author')

      assert.strictEqual(response.status, 200)
      assert.ok(Array.isArray(response.body))
      
      // All returned articles should have status 'published'
      response.body.forEach(article => {
        assert.strictEqual(article.status, 'published')
      })
    })

    test('should filter articles by category', async () => {
      const response = await request
        .get('/api/articles?category=Tech')
        .set('Authorization', 'Bearer author')

      assert.strictEqual(response.status, 200)
      assert.ok(Array.isArray(response.body))
      
      // All returned articles should have category 'Tech'
      response.body.forEach(article => {
        assert.strictEqual(article.category, 'Tech')
      })
    })

    test('should filter articles by search term', async () => {
      const response = await request
        .get('/api/articles?search=Performance')
        .set('Authorization', 'Bearer author')

      assert.strictEqual(response.status, 200)
      assert.ok(Array.isArray(response.body))
      
      // Should return exactly 1 article with 'Performance' in the title
      assert.strictEqual(response.body.length, 1, 'Should return exactly 1 article')
      
      const returnedArticle = response.body[0]
      const hasSearchTerm = 
        returnedArticle.title.toLowerCase().includes('performance') ||
        returnedArticle.body.toLowerCase().includes('performance')
      assert.ok(hasSearchTerm, `Article should contain search term: ${JSON.stringify(returnedArticle)}`)
      assert.strictEqual(returnedArticle.title, 'JavaScript Performance Tips')
    })

    test('should apply multiple filters', async () => {
      const response = await request
        .get('/api/articles?status=published&category=Tech')
        .set('Authorization', 'Bearer author')

      assert.strictEqual(response.status, 200)
      assert.ok(Array.isArray(response.body))
      
      // All returned articles should match both filters
      response.body.forEach(article => {
        assert.strictEqual(article.status, 'published')
        assert.strictEqual(article.category, 'Tech')
      })
    })

    test('should return empty array for no matching filters', async () => {
      const response = await request
        .get('/api/articles?status=invalid_status')
        .set('Authorization', 'Bearer author')

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.length, 0)
    })
  })

  describe('GET /api/articles/:id', () => {
    test('should return a specific article', async () => {
      // First get all articles to find a valid ID
      const listResponse = await request
        .get('/api/articles')
        .set('Authorization', 'Bearer author')

      const articleId = listResponse.body[0].id

      const response = await request
        .get(`/api/articles/${articleId}`)
        .set('Authorization', 'Bearer author')

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.id, articleId)
      assert.ok(response.body.title)
      assert.ok(response.body.body)
      assert.ok(response.body.category)
      assert.ok(response.body.status)
      assert.ok(response.body.authorId)
    })

    test('should return 404 for non-existent article', async () => {
      const response = await request
        .get('/api/articles/999999')
        .set('Authorization', 'Bearer author')

      assert.strictEqual(response.status, 404)
      assert.strictEqual(response.body.error, 'Article not found')
    })

    test('should require authorization header', async () => {
      const response = await request.get('/api/articles/1')

      assert.strictEqual(response.status, 401)
      assert.strictEqual(response.body.error, 'Authorization header required')
    })
  })

  describe('POST /api/articles', () => {
    test('should create a new article as author', async () => {
      const newArticle = {
        title: 'Test Article',
        body: 'This is a test article body',
        category: 'Tech',
        authorId: 'test-author'
      }

      const response = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send(newArticle)

      assert.strictEqual(response.status, 201)
      assert.ok(response.body.id)
      assert.strictEqual(response.body.title, newArticle.title)
      assert.strictEqual(response.body.body, newArticle.body)
      assert.strictEqual(response.body.category, newArticle.category)
      assert.strictEqual(response.body.authorId, newArticle.authorId)
      assert.strictEqual(response.body.status, 'draft')
      assert.ok(response.body.createdAt)
      assert.ok(response.body.updatedAt)
    })

    test('should require author role to create article', async () => {
      const newArticle = {
        title: 'Test Article',
        body: 'This is a test article body',
        category: 'Tech',
        authorId: 'test-author'
      }

      const response = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer editor')
        .send(newArticle)

      assert.strictEqual(response.status, 403)
    })

    test('should validate required fields', async () => {
      const response = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send({})

      assert.strictEqual(response.status, 400)
      assert.strictEqual(response.body.error, 'Missing required fields')
    })

    test('should validate category', async () => {
      const newArticle = {
        title: 'Test Article',
        body: 'This is a test article body',
        category: 'InvalidCategory',
        authorId: 'test-author'
      }

      const response = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send(newArticle)

      assert.strictEqual(response.status, 400)
      assert.strictEqual(response.body.error, 'Invalid category')
    })
  })

  describe('PUT /api/articles/:id', () => {
    test('should update an article as author', async () => {
      // First create an article
      const createResponse = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send({
          title: 'Original Title',
          body: 'Original body',
          category: 'Tech',
          authorId: 'test-author'
        })

      const articleId = createResponse.body.id

      // Update the article
      const updateData = {
        title: 'Updated Title',
        body: 'Updated body',
        authorId: 'test-author'
      }

      const response = await request
        .put(`/api/articles/${articleId}`)
        .set('Authorization', 'Bearer author')
        .send(updateData)

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.title, updateData.title)
      assert.strictEqual(response.body.body, updateData.body)
      assert.ok(response.body.updatedAt)
    })

    test('should require author role to update article', async () => {
      const response = await request
        .put('/api/articles/1')
        .set('Authorization', 'Bearer editor')
        .send({ title: 'Updated Title' })

      assert.strictEqual(response.status, 403)
    })

    test('should only allow updating own articles', async () => {
      // Create article with author1
      const createResponse = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send({
          title: 'Test Article',
          body: 'Test body',
          category: 'Tech',
          authorId: 'author1'
        })

      const articleId = createResponse.body.id

      // Try to update as author2
      const response = await request
        .put(`/api/articles/${articleId}`)
        .set('Authorization', 'Bearer author')
        .send({
          title: 'Updated Title',
          authorId: 'author2' // Different author
        })

      assert.strictEqual(response.status, 403)
      assert.strictEqual(response.body.error, 'Can only edit own articles')
    })

    test('should only allow editing draft articles', async () => {
      // Create and publish an article
      const createResponse = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send({
          title: 'Test Article',
          body: 'Test body',
          category: 'Tech',
          authorId: 'test-author'
        })

      const articleId = createResponse.body.id

      // Submit for review (as editor)
      await request
        .post(`/api/articles/${articleId}/submit`)
        .set('Authorization', 'Bearer author')
        .send({ authorId: 'test-author' })

      // Try to edit as author
      const response = await request
        .put(`/api/articles/${articleId}`)
        .set('Authorization', 'Bearer author')
        .send({ title: 'Updated Title', authorId: 'test-author' })

      assert.strictEqual(response.status, 409)
      assert.strictEqual(response.body.error, 'Can only edit draft articles')
    })
  })

  describe('DELETE /api/articles/:id', () => {
    test('should delete an article as author', async () => {
      // Create an article
      const createResponse = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send({
          title: 'Test Article',
          body: 'Test body',
          category: 'Tech',
          authorId: 'test-author'
        })

      const articleId = createResponse.body.id

      // Delete the article
      const response = await request
        .delete(`/api/articles/${articleId}`)
        .set('Authorization', 'Bearer author')
        .send({ authorId: 'test-author' })

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.message, 'Article deleted successfully')

      // Verify it's deleted
      const getResponse = await request
        .get(`/api/articles/${articleId}`)
        .set('Authorization', 'Bearer author')

      assert.strictEqual(getResponse.status, 404)
    })

    test('should require author role to delete article', async () => {
      const response = await request
        .delete('/api/articles/1')
        .set('Authorization', 'Bearer editor')
        .send({ authorId: 'test-author' })

      assert.strictEqual(response.status, 403)
    })

    test('should only allow deleting own articles', async () => {
      // Create article with author1
      const createResponse = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send({
          title: 'Test Article',
          body: 'Test body',
          category: 'Tech',
          authorId: 'author1'
        })

      const articleId = createResponse.body.id

      // Try to delete as author2 (using same author role but different ID)
      const response = await request
        .delete(`/api/articles/${articleId}`)
        .set('Authorization', 'Bearer author')
        .send({ authorId: 'author2' })

      assert.strictEqual(response.status, 403)
      assert.strictEqual(response.body.error, 'Can only delete own articles')
    })
  })

  describe('Workflow Actions', () => {
    test('POST /api/articles/:id/submit - submit for review', async () => {
      // Create a draft article
      const createResponse = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send({
          title: 'Test Article',
          body: 'Test body',
          category: 'Tech',
          authorId: 'test-author'
        })

      const articleId = createResponse.body.id

      // Submit for review
      const response = await request
        .post(`/api/articles/${articleId}/submit`)
        .set('Authorization', 'Bearer author')
        .send({ authorId: 'test-author' })

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.status, 'in_review')
    })

    test('POST /api/articles/:id/publish - publish article', async () => {
      // Create and submit article for review
      const createResponse = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send({
          title: 'Test Article',
          body: 'Test body',
          category: 'Tech',
          authorId: 'test-author'
        })

      const articleId = createResponse.body.id

      // Submit for review
      await request
        .post(`/api/articles/${articleId}/submit`)
        .set('Authorization', 'Bearer author')
        .send({ authorId: 'test-author' })

      // Publish as editor
      const response = await request
        .post(`/api/articles/${articleId}/publish`)
        .set('Authorization', 'Bearer editor')

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.status, 'published')
    })

    test('POST /api/articles/:id/reject - reject article', async () => {
      // Create and submit article for review
      const createResponse = await request
        .post('/api/articles')
        .set('Authorization', 'Bearer author')
        .send({
          title: 'Test Article',
          body: 'Test body',
          category: 'Tech',
          authorId: 'test-author'
        })

      const articleId = createResponse.body.id

      // Submit for review
      await request
        .post(`/api/articles/${articleId}/submit`)
        .set('Authorization', 'Bearer author')
        .send({ authorId: 'test-author' })

      // Reject as editor
      const response = await request
        .post(`/api/articles/${articleId}/reject`)
        .set('Authorization', 'Bearer editor')

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.status, 'rejected')
    })
  })
})
