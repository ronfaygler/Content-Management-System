# Workflow Rules - Mini CMS

## Article Lifecycle

### 1. Creation (Author)
- **Status**: `draft`
- **Who**: Author creates article
- **Validation**: Title, body, category required
- **Auto-assign**: Author ID, creation date

### 2. Submit for Review (Author)
- **Transition**: `draft` → `in_review`
- **Who**: Article author only
- **Preconditions**: Article must be in `draft` status
- **Action**: Author clicks "Submit for Review"
- **Post-condition**: Article becomes read-only for author

### 3. Editorial Review (Editor)
- **Status**: `in_review`
- **Who**: Editor reviews article
- **Options**: Publish or Reject
- **Deadline**: Not applicable (no time limit)

### 4. Publication (Editor)
- **Transition**: `in_review` → `published`
- **Who**: Editor only
- **Preconditions**: Article must be in `in_review` status
- **Action**: Editor clicks "Publish"
- **Post-condition**: Article becomes public, read-only

### 5. Rejection (Editor)
- **Transition**: `in_review` → `rejected`
- **Who**: Editor only
- **Preconditions**: Article must be in `in_review` status
- **Action**: Editor clicks "Reject"
- **Post-condition**: Article is rejected, read-only

## Business Logic Rules

### Author Permissions
- Can only edit articles in `draft` status
- Can only submit their own articles
- Cannot edit articles after submission (`in_review` or later)
- Can delete only their own `draft` articles

### Editor Permissions
- Can view all articles regardless of status
- Can only act on articles in `in_review` status
- Cannot create or edit articles
- Cannot delete articles

### Status Validation
```javascript
const validTransitions = {
  draft: ['in_review'],
  in_review: ['published', 'rejected'],
  published: [], // Final state
  rejected: []   // Final state
}
```

## Frontend State Management

### UI State Based on Article Status
- **Draft**: Show Edit, Delete, Submit buttons (Author)
- **In Review**: Show Publish, Reject buttons (Editor)
- **Published**: Show "Published" badge, no actions
- **Rejected**: Show "Rejected" badge, no actions

### User Role UI
- **Author**: Create button, filter by own articles
- **Editor**: No create button, view all articles

## Error Scenarios & Handling

### Invalid Status Transitions
- Trying to publish a `draft` article
- Trying to edit a `published` article
- Trying to submit an `in_review` article

### Permission Errors
- Author trying to edit another's article
- Editor trying to create an article
- Author trying to publish an article

### Edge Cases
- Article not found
- Missing required fields
- Invalid category selection
- Network errors during status changes

## Implementation Notes

### Backend Validation
- Always validate status transitions server-side
- Check user permissions before each action
- Return descriptive error messages

### Frontend Optimization
- Disable buttons based on user role and article status
- Show loading states during API calls
- Provide immediate feedback for user actions
