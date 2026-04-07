import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ArticleList from '../../components/ArticleList.jsx'
import { AuthProvider } from '../../context/AuthContext.jsx'

// Mock the useArticles hook
const mockUseArticles = vi.fn()
vi.mock('../../hooks/useArticles.js', () => ({
  useArticles: mockUseArticles
}))

// Mock the useAuth hook
const mockUseAuth = vi.fn()
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: mockUseAuth,
  AuthProvider: ({ children }) => children
}))

describe('ArticleList Component', () => {
  const mockOnArticleSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: { id: 'author1', role: 'author' },
      isAuthor: () => true,
      isEditor: () => false
    })
  })

  it('shows loading state initially', () => {
    mockUseArticles.mockReturnValue({
      articles: [],
      loading: true,
      error: null,
      deleteArticle: vi.fn(),
      submitArticle: vi.fn(),
      publishArticle: vi.fn(),
      rejectArticle: vi.fn()
    })

    render(
      <ArticleList 
        filters={{}} 
        onArticleSelect={mockOnArticleSelect}
      />
    )

    expect(screen.getByText('Loading articles...')).toBeInTheDocument()
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument() // loading spinner
  })

  it('displays articles when loaded', () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article 1',
        body: 'This is a test article body',
        category: 'Tech',
        status: 'draft',
        authorId: 'author1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        title: 'Test Article 2',
        body: 'This is another test article',
        category: 'Sports',
        status: 'published',
        authorId: 'author2',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      }
    ]

    mockUseArticles.mockReturnValue({
      articles: mockArticles,
      loading: false,
      error: null,
      deleteArticle: vi.fn(),
      submitArticle: vi.fn(),
      publishArticle: vi.fn(),
      rejectArticle: vi.fn()
    })

    render(
      <ArticleList 
        filters={{}} 
        onArticleSelect={mockOnArticleSelect}
      />
    )

    expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    expect(screen.getByText('Test Article 2')).toBeInTheDocument()
    expect(screen.getByText('Tech')).toBeInTheDocument()
    expect(screen.getByText('Sports')).toBeInTheDocument()
    expect(screen.getByText('draft')).toBeInTheDocument()
    expect(screen.getByText('published')).toBeInTheDocument()
  })

  it('shows error state when there is an error', () => {
    mockUseArticles.mockReturnValue({
      articles: [],
      loading: false,
      error: 'Failed to fetch articles',
      deleteArticle: vi.fn(),
      submitArticle: vi.fn(),
      publishArticle: vi.fn(),
      rejectArticle: vi.fn()
    })

    render(
      <ArticleList 
        filters={{}} 
        onArticleSelect={mockOnArticleSelect}
      />
    )

    expect(screen.getByText('Failed to fetch articles')).toBeInTheDocument()
    expect(screen.getByText('Please try again later')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('shows empty state when no articles', () => {
    mockUseArticles.mockReturnValue({
      articles: [],
      loading: false,
      error: null,
      deleteArticle: vi.fn(),
      submitArticle: vi.fn(),
      publishArticle: vi.fn(),
      rejectArticle: vi.fn()
    })

    render(
      <ArticleList 
        filters={{}} 
        onArticleSelect={mockOnArticleSelect}
      />
    )

    expect(screen.getByText('No articles found')).toBeInTheDocument()
    expect(screen.getByText('There are no articles matching your current filters.')).toBeInTheDocument()
  })

  it('calls onArticleSelect when article is clicked', () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article',
        body: 'Test body',
        category: 'Tech',
        status: 'draft',
        authorId: 'author1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    mockUseArticles.mockReturnValue({
      articles: mockArticles,
      loading: false,
      error: null,
      deleteArticle: vi.fn(),
      submitArticle: vi.fn(),
      publishArticle: vi.fn(),
      rejectArticle: vi.fn()
    })

    render(
      <ArticleList 
        filters={{}} 
        onArticleSelect={mockOnArticleSelect}
      />
    )

    fireEvent.click(screen.getByText('Test Article'))
    expect(mockOnArticleSelect).toHaveBeenCalledWith(mockArticles[0])
  })

  it('shows appropriate actions for authors on their own draft articles', () => {
    const mockArticles = [
      {
        id: '1',
        title: 'My Draft Article',
        body: 'Test body',
        category: 'Tech',
        status: 'draft',
        authorId: 'author1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    mockUseAuth.mockReturnValue({
      user: { id: 'author1', role: 'author' },
      isAuthor: () => true,
      isEditor: () => false
    })

    const mockDeleteArticle = vi.fn()
    const mockSubmitArticle = vi.fn()

    mockUseArticles.mockReturnValue({
      articles: mockArticles,
      loading: false,
      error: null,
      deleteArticle: mockDeleteArticle,
      submitArticle: mockSubmitArticle,
      publishArticle: vi.fn(),
      rejectArticle: vi.fn()
    })

    render(
      <ArticleList 
        filters={{}} 
        onArticleSelect={mockOnArticleSelect}
      />
    )

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('shows appropriate actions for editors on in-review articles', () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Article in Review',
        body: 'Test body',
        category: 'Tech',
        status: 'in_review',
        authorId: 'author2',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    mockUseAuth.mockReturnValue({
      user: { id: 'editor1', role: 'editor' },
      isAuthor: () => false,
      isEditor: () => true
    })

    const mockPublishArticle = vi.fn()
    const mockRejectArticle = vi.fn()

    mockUseArticles.mockReturnValue({
      articles: mockArticles,
      loading: false,
      error: null,
      deleteArticle: vi.fn(),
      submitArticle: vi.fn(),
      publishArticle: mockPublishArticle,
      rejectArticle: mockRejectArticle
    })

    render(
      <ArticleList 
        filters={{}} 
        onArticleSelect={mockOnArticleSelect}
      />
    )

    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument()
  })

  it('displays article count in header', () => {
    const mockArticles = [
      { id: '1', title: 'Article 1', category: 'Tech', status: 'draft', authorId: 'author1' },
      { id: '2', title: 'Article 2', category: 'Sports', status: 'published', authorId: 'author2' }
    ]

    mockUseArticles.mockReturnValue({
      articles: mockArticles,
      loading: false,
      error: null,
      deleteArticle: vi.fn(),
      submitArticle: vi.fn(),
      publishArticle: vi.fn(),
      rejectArticle: vi.fn()
    })

    render(
      <ArticleList 
        filters={{}} 
        onArticleSelect={mockOnArticleSelect}
      />
    )

    expect(screen.getByText('2 articles')).toBeInTheDocument()
  })
})
