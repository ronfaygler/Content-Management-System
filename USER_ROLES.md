# User Roles & Permissions - Mini CMS

## User Types

### Author
- **Role**: `author`
- **Can Create**: Articles (automatically assigned as author)
- **Can Edit**: Only their own articles (draft or rejected status only)
- **Can Delete**: Only their own articles
- **Can Submit**: Their own draft articles for review
- **Cannot**: Publish, reject, or edit others' articles
- **Cannot**: Edit own articles once in_review or published

### Editor
- **Role**: `editor`
- **Can View**: All articles
- **Can Publish**: Any article in `in_review` status
- **Can Reject**: Any article in `in_review` status
- **Cannot**: Create, edit, or delete articles
- **Cannot**: Publish articles that skip `in_review` status

## Permission Matrix

| Action | Author | Editor |
|--------|--------|--------|
| View All Articles | ✅ | ✅ |
| Create Article | ✅ | ❌ |
| Edit Own Article | ✅ | ❌ |
| Edit Others' Articles | ❌ | ❌ |
| Delete Own Article | ✅ | ❌ |
| Submit for Review | ✅ | ❌ |
| Publish Article | ❌ | ✅ |
| Reject Article | ❌ | ✅ |

## Workflow Permissions

### Draft → In Review
- **Who**: Author (article owner only)
- **Endpoint**: `POST /api/articles/:id/submit`

### In Review → Published
- **Who**: Editor (any article)
- **Endpoint**: `POST /api/articles/:id/publish`

### In Review → Rejected
- **Who**: Editor (any article)
- **Endpoint**: `POST /api/articles/:id/reject`

## Frontend UI Controls

### Author View
- "Create New Article" button
- "Edit" button on own articles
- "Submit for Review" button on draft articles
- No publish/reject buttons

### Editor View
- "Publish" button on in_review articles
- "Reject" button on in_review articles
- No create/edit/delete buttons

## Key Business Rules

### Author Restrictions
- Cannot edit articles once in `in_review` or `published` status
- Can re-edit rejected articles and resubmit them
- Only works with own articles

### Editor Restrictions  
- Cannot publish articles that skip `in_review` status
- Can only act on articles in `in_review` status
- Cannot create or edit any articles

### Workflow Direction
- Status flow is one-directional (no arbitrary backwards movement)
- Valid flows: draft → in_review → published/rejected
- Special case: rejected → draft → in_review (author resubmission)

## Authentication Implementation
```javascript
// Simple header-based auth
const authHeader = {
  'Authorization': `Bearer ${userRole}` // 'author' or 'editor'
}
```
