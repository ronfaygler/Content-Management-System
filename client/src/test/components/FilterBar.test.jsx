import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FilterBar from '../../components/FilterBar.jsx'

describe('FilterBar Component', () => {
  const mockOnFilterChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnFilterChange.mockClear()
  })

  it('renders filter header with correct title', () => {
    render(
      <FilterBar 
        filters={{}} 
        onFilterChange={mockOnFilterChange}
      />
    )

    expect(screen.getByText('🔍 Filter Articles')).toBeInTheDocument()
  })

  it('shows active filters count when filters are applied', () => {
    render(
      <FilterBar 
        filters={{ status: 'draft', category: 'Tech' }} 
        onFilterChange={mockOnFilterChange}
      />
    )

    expect(screen.getByText('2 filters active')).toBeInTheDocument()
  })

  it('does not show active filters count when no filters', () => {
    render(
      <FilterBar 
        filters={{}} 
        onFilterChange={mockOnFilterChange}
      />
    )

    expect(screen.queryByText(/filters active/)).not.toBeInTheDocument()
  })

  it('toggles filter content when expand button is clicked', () => {
    render(
      <FilterBar 
        filters={{}} 
        onFilterChange={mockOnFilterChange}
      />
    )

    const expandButton = screen.getByRole('button', { name: /toggle filter options/i })
    expect(expandButton).toHaveTextContent('▶')

    fireEvent.click(expandButton)
    expect(expandButton).toHaveTextContent('▼')
  })

  it('calls onFilterChange when status filter is changed', async () => {
    render(
      <FilterBar 
        filters={{}} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    const statusSelect = screen.getByLabelText(/status/i)
    fireEvent.change(statusSelect, { target: { value: 'draft' } })

    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      status: 'draft'
    }))
  })

  it('calls onFilterChange when category filter is changed', async () => {
    render(
      <FilterBar 
        filters={{}} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    const categorySelect = screen.getByLabelText(/category/i)
    fireEvent.change(categorySelect, { target: { value: 'Tech' } })

    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      category: 'Tech'
    }))
  })

  it('calls onFilterChange with debounced search input', async () => {
    render(
      <FilterBar 
        filters={{}} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    const searchInput = screen.getByPlaceholderText(/search by title or content/i)
    
    // Type in search input
    fireEvent.change(searchInput, { target: { value: 'React' } })

    // Should not call immediately due to debounce
    expect(mockOnFilterChange).not.toHaveBeenCalled()

    // Wait for debounce (300ms)
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
        search: 'React'
      }))
    }, { timeout: 400 })
  })

  it('shows clear search button when search has value', () => {
    render(
      <FilterBar 
        filters={{ search: 'React' }} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    const searchInput = screen.getByPlaceholderText(/search by title or content/i)
    expect(searchInput).toHaveValue('React')

    const clearButton = screen.getByLabelText(/clear search/i)
    expect(clearButton).toBeInTheDocument()
  })

  it('clears search when clear button is clicked', () => {
    render(
      <FilterBar 
        filters={{ search: 'React' }} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    const clearButton = screen.getByLabelText(/clear search/i)
    fireEvent.click(clearButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      search: undefined
    }))
  })

  it('displays active filter tags', () => {
    render(
      <FilterBar 
        filters={{ 
          search: 'React',
          status: 'draft',
          category: 'Tech'
        }} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    expect(screen.getByText('"React"')).toBeInTheDocument()
    expect(screen.getByText('draft')).toBeInTheDocument()
    expect(screen.getByText('Tech')).toBeInTheDocument()
  })

  it('removes individual filter when tag remove button is clicked', () => {
    render(
      <FilterBar 
        filters={{ 
          search: 'React',
          status: 'draft'
        }} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    const removeSearchButton = screen.getAllByLabelText(/remove/i)[0]
    fireEvent.click(removeSearchButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      search: undefined,
      status: 'draft'
    }))
  })

  it('clears all filters when clear button is clicked', () => {
    render(
      <FilterBar 
        filters={{ 
          search: 'React',
          status: 'draft',
          category: 'Tech'
        }} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    const clearAllButton = screen.getByRole('button', { name: /clear all filters/i })
    fireEvent.click(clearAllButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith({})
  })

  it('shows correct summary text', () => {
    const { rerender } = render(
      <FilterBar 
        filters={{}} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    expect(screen.getByText('Showing all articles')).toBeInTheDocument()

    rerender(
      <FilterBar 
        filters={{ status: 'draft' }} 
        onFilterChange={mockOnFilterChange}
      />
    )

    expect(screen.getByText('Showing filtered results')).toBeInTheDocument()
  })

  it('disables clear all button when no active filters', () => {
    render(
      <FilterBar 
        filters={{}} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    const clearAllButton = screen.getByRole('button', { name: /clear all filters/i })
    expect(clearAllButton).toBeDisabled()
  })

  it('enables clear all button when there are active filters', () => {
    render(
      <FilterBar 
        filters={{ status: 'draft' }} 
        onFilterChange={mockOnFilterChange}
      />
    )

    // Expand the filter bar first
    fireEvent.click(screen.getByRole('button', { name: /toggle filter options/i }))

    const clearAllButton = screen.getByRole('button', { name: /clear all filters/i })
    expect(clearAllButton).not.toBeDisabled()
  })
})
