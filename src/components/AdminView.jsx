import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../utils/api'

function AdminView({ apiKey, showModal }) {
  const [movies, setMovies] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 20,
    type: '',
    genre: '',
    archived: ''
  })

  const loadMovies = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const result = await apiRequest(`/movies/admin?${params}`, {}, apiKey)
      setMovies(result.movies || [])
      setPagination(result.pagination || { page: 1, pages: 1, total: 0 })
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  useEffect(() => {
    loadMovies()
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }))
  }

  const showQualities = (movieId) => {
    const movie = movies.find(m => m._id === movieId)
    if (movie?.qualities?.length > 0) {
      let qualitiesHtml = ''
      movie.qualities.forEach(qualityObj => {
        Object.entries(qualityObj).forEach(([quality, urls]) => {
          qualitiesHtml += `<h4>${quality}</h4><ul>`
          urls.forEach(url => {
            qualitiesHtml += `<li><a href="${url}" target="_blank">${url}</a></li>`
          })
          qualitiesHtml += '</ul>'
        })
      })
      showModal(`Qualities for ${movie.Title || movie.movieName}`, qualitiesHtml)
    } else {
      showModal('No Qualities', 'No qualities found for this movie')
    }
  }

  return (
    <div className="section">
      <h2>Movies View</h2>
      <form onSubmit={(e) => { e.preventDefault(); loadMovies() }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <input
          type="number"
          placeholder="Page"
          value={filters.page}
          onChange={(e) => handleFilterChange('page', e.target.value)}
        />
        <input
          type="number"
          placeholder="Limit"
          value={filters.limit}
          onChange={(e) => handleFilterChange('limit', e.target.value)}
        />
        <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
          <option value="">All Types</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>
        <input
          type="text"
          placeholder="Genre"
          value={filters.genre}
          onChange={(e) => handleFilterChange('genre', e.target.value)}
        />
        <select value={filters.archived} onChange={(e) => handleFilterChange('archived', e.target.value)}>
          <option value="">All Status</option>
          <option value="true">Archived</option>
          <option value="false">Active</option>
        </select>
        <button type="submit">Load Movies</button>
      </form>

      <table style={{ display: movies.length ? 'table' : 'none' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Year</th>
            <th>Status</th>
            <th>Added</th>
            <th>Qualities</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie._id}>
              <td>{movie.Title || movie.movieName || 'N/A'}</td>
              <td>{movie.Type || 'N/A'}</td>
              <td>{movie.Year || 'N/A'}</td>
              <td>{movie.archived ? 'Archived' : 'Active'}</td>
              <td>{new Date(movie.addedAt).toLocaleDateString()}</td>
              <td><button onClick={() => showQualities(movie._id)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div id="pagination">
        <button
          onClick={() => handleFilterChange('page', pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
        <button
          onClick={() => handleFilterChange('page', pagination.page + 1)}
          disabled={pagination.page >= pagination.pages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default AdminView