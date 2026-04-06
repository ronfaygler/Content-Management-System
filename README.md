# Content Management System

A full-stack CMS for editorial teams with role-based article management and approval workflow.

## Features

- **Role-based Access**: Author and Editor roles with specific permissions
- **Article Workflow**: Draft → Review → Published/Rejected
- **Real-time Filtering**: Filter by status and category
- **RESTful API**: Complete CRUD operations with authentication
- **Modern UI**: React-based responsive interface

## Tech Stack

### Frontend
- React 18 with hooks
- Vite for development
- Modern CSS with responsive design

### Backend
- Node.js with Express
- In-memory data storage
- Role-based authentication
- RESTful API design

## User Roles

### Author
- Create and edit own articles
- Submit articles for review
- View all articles

### Editor
- Publish or reject articles
- View all articles
- Cannot create/edit articles

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development servers:
```bash
# Backend (port 3001)
npm run server

# Frontend (port 5173) - in separate terminal
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) to view the application

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run git:init` - Initialize Git repository
- `npm run git:branch <name>` - Create new branch
- `npm run git:commit "message"` - Commit changes

## API Endpoints

### Articles
- `GET /api/articles` - List all articles (with filtering)
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article (Author only)
- `PUT /api/articles/:id` - Update article (Author only)
- `DELETE /api/articles/:id` - Delete article (Author only)

### Workflow
- `POST /api/articles/:id/submit` - Submit for review (Author only)
- `POST /api/articles/:id/publish` - Publish article (Editor only)
- `POST /api/articles/:id/reject` - Reject article (Editor only)

## Project Structure

```
Content-Management-System/
├── server/                 # Backend API
│   ├── server.js          # Express server
│   ├── routes/            # API routes
│   ├── models/            # Data models
│   ├── middleware/        # Auth middleware
│   └── data/              # In-memory storage
├── src/                   # Frontend React
│   ├── components/        # React components
│   ├── services/          # API calls
│   ├── hooks/             # Custom hooks
│   ├── context/           # React context
│   └── utils/             # Utilities
├── docs/                  # Documentation
│   ├── API_SPEC.md        # API specification
│   ├── USER_ROLES.md      # Role permissions
│   ├── DATA_MODELS.md     # Data structure
│   └── WORKFLOW_RULES.md  # Business logic
└── package.json           # Dependencies
```

## Development Workflow

1. Create feature branch: `npm run git:branch feature/backend-setup`
2. Make changes and commit: `npm run git:commit "feat: Add article CRUD"`
3. Push and merge when ready

## Authentication

Simple header-based authentication:
```
Authorization: Bearer author    // For author role
Authorization: Bearer editor     // For editor role
```

## Data Models

### Article
```javascript
{
  id: string,
  title: string,
  body: string,
  category: "Tech" | "Sports" | "Culture",
  status: "draft" | "in_review" | "published" | "rejected",
  authorId: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use semantic commit messages

## License

MIT License - feel free to use this project for learning and development.
