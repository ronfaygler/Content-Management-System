# Git Workflow - Mini CMS Project

## Initial Setup

### Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Project setup with API specs"
```

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/backend-setup` - Backend API development
- `feature/frontend-components` - Frontend React components
- `feature/auth-system` - Authentication implementation
- `hotfix/bug-fixes` - Critical fixes

## Common Git Commands

### Branch Management
```bash
# Create new branch
git checkout -b feature/branch-name

# Switch between branches
git checkout main
git checkout develop
git checkout feature/branch-name

# List all branches
git branch -a

# Delete branch (local)
git branch -d feature/branch-name

# Delete branch (remote)
git push origin --delete feature/branch-name
```

### Commit Workflow
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: Add article CRUD endpoints"

# Push to remote
git push origin feature/branch-name
```

### Merge Workflow
```bash
# Switch to target branch
git checkout main

# Merge feature branch
git merge feature/backend-setup

# Push merged changes
git push origin main
```

## Commit Message Convention

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code formatting
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Examples
```bash
git commit -m "feat(backend): Add article CRUD API endpoints"
git commit -m "fix(auth): Resolve role-based permission bug"
git commit -m "docs: Update API specification"
```

## Project-Specific Workflow

### Phase 1: Backend Setup
```bash
git checkout -b feature/backend-setup
# Add server files, routes, models
git add server/
git commit -m "feat(backend): Implement Express server with article CRUD"
git push origin feature/backend-setup
```

### Phase 2: Frontend Components
```bash
git checkout -b feature/frontend-components
# Add React components
git add src/components/
git commit -m "feat(frontend): Add ArticleList and ArticleForm components"
git push origin feature/frontend-components
```

### Phase 3: Integration
```bash
git checkout develop
git merge feature/backend-setup
git merge feature/frontend-components
git commit -m "feat: Integrate backend API with frontend components"
git push origin develop
```

## Quick Reference Commands

### Daily Development
```bash
# Check current status
git status

# See changes
git diff

# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Stash changes temporarily
git stash
git stash pop
```

### Emergency Commands
```bash
# Discard all local changes
git reset --hard HEAD

# Pull latest changes
git pull origin main

# Force push (use carefully!)
git push --force-with-lease origin feature-branch
```
