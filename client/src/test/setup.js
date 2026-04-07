import '@testing-library/jest-dom'

// Mock API service for tests
const mockApiService = {
  getArticles: vi.fn(),
  getArticle: vi.fn(),
  createArticle: vi.fn(),
  updateArticle: vi.fn(),
  deleteArticle: vi.fn(),
  submitArticle: vi.fn(),
  publishArticle: vi.fn(),
  rejectArticle: vi.fn(),
  setRole: vi.fn(),
}

// Mock AuthContext
const mockAuthContext = {
  user: { id: 'test-user', role: 'author' },
  userRole: 'author',
  isAuthor: vi.fn(() => true),
  isEditor: vi.fn(() => false),
  login: vi.fn(),
  logout: vi.fn(),
  switchRole: vi.fn(),
}

global.vi = {
  fn: () => ({
    mockReturnValue: () => {},
    mockResolvedValue: () => Promise.resolve(),
  })
}

// Setup global mocks
global.mockApiService = mockApiService
global.mockAuthContext = mockAuthContext

// Mock fetch for API calls
global.fetch = vi.fn()

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
