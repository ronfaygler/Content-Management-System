# Data Models - Mini CMS

## Article Model

### Core Fields
```javascript
{
  id: string,           // Unique identifier (UUID)
  title: string,         // Article title (required, max 200 chars)
  body: string,          // Article content (required, plain text)
  category: string,      // Category: 'Tech' | 'Sports' | 'Culture'
  status: string,        // Status: 'draft' | 'in_review' | 'published' | 'rejected'
  authorId: string,      // User ID of article creator
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

### Validation Rules
- **title**: Required, string, 1-200 characters
- **body**: Required, string, 1-5000 characters
- **category**: Required, must be one of: ['Tech', 'Sports', 'Culture']
- **status**: Required, must be one of: ['draft', 'in_review', 'published', 'rejected']
- **authorId**: Required, string (user identifier)

### Default Values
- **status**: 'draft' (for new articles)
- **createdAt**: Current timestamp
- **updatedAt**: Current timestamp (auto-updated on changes)

## Status Flow Rules

### Valid Transitions
```
draft → in_review (submit)
in_review → published (approve)
in_review → rejected (reject)
```

### Invalid Transitions
```
draft → published (must go through review)
draft → rejected (must go through review)
in_review → draft (cannot go back)
published → any (final state)
rejected → any (final state)
```

## User Model (Simple)

### Author User
```javascript
{
  id: 'author',
  role: 'author',
  name: 'Article Author'
}
```

### Editor User
```javascript
{
  id: 'editor', 
  role: 'editor',
  name: 'Content Editor'
}
```

## Data Storage (In-Memory)

### Initial Sample Data
```javascript
const articles = [
  {
    id: '1',
    title: 'Getting Started with React',
    body: 'React is a popular JavaScript library...',
    category: 'Tech',
    status: 'draft',
    authorId: 'author',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
```

## Error Validation Messages
- Title required: "Article title is required"
- Title too long: "Title must be less than 200 characters"
- Body required: "Article body is required"
- Invalid category: "Category must be Tech, Sports, or Culture"
- Invalid status transition: "Cannot transition from {current} to {new}"
- Unauthorized: "You don't have permission to perform this action"
