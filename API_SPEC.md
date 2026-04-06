# API Specification - Mini CMS

## Base URL
`http://localhost:3001/api`

## Authentication
- Simple header-based auth: `Authorization: Bearer <user_role>`
- Two hardcoded users:
  - Author: `author` (can only create/edit their own articles)
  - Editor: `editor` (can publish/reject any article)

## Articles Endpoints

### GET /api/articles
Get all articles with optional filtering
- Query Parameters:
  - `status` (optional): draft | in_review | published | rejected
  - `category` (optional): Tech | Sports | Culture
- Response: Array of Article objects

### GET /api/articles/:id
Get single article by ID
- Response: Article object

### POST /api/articles
Create new article (Author only)
- Body: `{ title, body, category, authorId }`
- Response: Created Article object

### PUT /api/articles/:id
Update article (Author only, own articles only)
- Body: `{ title, body, category }`
- Response: Updated Article object

### DELETE /api/articles/:id
Delete article (Author only, own articles only)
- Response: Success message

## Workflow Endpoints

### POST /api/articles/:id/submit
Move article from draft → in_review (Author only)
- Response: Updated Article object

### POST /api/articles/:id/publish
Move article from in_review → published (Editor only)
- Response: Updated Article object

### POST /api/articles/:id/reject
Move article from in_review → rejected (Editor only)
- Response: Updated Article object

## Article Object Structure
```json
{
  "id": "string",
  "title": "string",
  "body": "string",
  "category": "Tech|Sports|Culture",
  "status": "draft|in_review|published|rejected",
  "authorId": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Error Responses
- 400: Bad Request (validation errors)
- 401: Unauthorized (wrong role)
- 403: Forbidden (wrong permissions)
- 404: Not Found
- 409: Conflict (invalid status transition)
