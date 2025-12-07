import { useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../utils/api'

function Movies({ apiKey }) {
  const [scrapeResults, setScrapeResults] = useState('')
  const [moviesJson, setMoviesJson] = useState('')
  const [addMoviesResult, setAddMoviesResult] = useState(null)
  const [skipQuality, setSkipQuality] = useState(false)
  const [imdbId, setImdbId] = useState('')
  const [scrapeUrl, setScrapeUrl] = useState('https://movies4u.exposed/')
  const [scrapeType, setScrapeType] = useState('movie')
  const [qualities, setQualities] = useState({ page: 1, limit: 10, usePixel: true, type: 'movie' })

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scrapeResults)
    toast.success('Copied to clipboard')
  }

  const scrapeMovies = async (e) => {
    e.preventDefault()
    try {
      const result = await apiRequest('/scrape', {
        method: 'POST',
        body: JSON.stringify({ url: scrapeUrl, type: scrapeType })
      }, apiKey)
      setScrapeResults(JSON.stringify(result, null, 2))
      toast.success('Scraping completed successfully')
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  const scrapeSingle = async () => {
    try {
      const result = await apiRequest('/scrape/single', {
        method: 'POST',
        body: JSON.stringify({ url: scrapeUrl, type: scrapeType })
      }, apiKey)
      setScrapeResults(JSON.stringify(result, null, 2))
      toast.success('Single scraping completed successfully')
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  const addMultipleMovies = async () => {
    try {
      let movies = JSON.parse(moviesJson)
      if (!Array.isArray(movies)) {
        movies = [movies]
      }
      const result = await apiRequest('/movies/add-movie-multiple', {
        method: 'POST',
        body: JSON.stringify({ movies, skipQuality })
      }, apiKey)
      setAddMoviesResult(result)
      toast.success(`Inserted: ${result.inserted}, Skipped: ${result.skipped}`)
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  const archiveDuplicates = async () => {
    try {
      await apiRequest('/movies/archive-duplicates', { method: 'POST' }, apiKey)
      toast.success('Duplicates archived successfully')
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  const deleteByImdb = async () => {
    if (!imdbId) return toast.error('Enter IMDB ID')
    try {
      await apiRequest(`/movies/imdb/${imdbId}`, { method: 'DELETE' }, apiKey)
      toast.success('Movie deleted successfully')
      setImdbId('')
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  const updateQualities = async (e) => {
    e.preventDefault()
    try {
      await apiRequest('/update-qualities', {
        method: 'POST',
        body: JSON.stringify(qualities)
      }, apiKey)
      toast.success('Qualities updated successfully')
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  return (
    <>
      <div className="section">
        <h2>Scrape Movies</h2>
        <form onSubmit={scrapeMovies}>
          <input
            type="url"
            placeholder="URL"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            required
          />
          <select value={scrapeType} onChange={(e) => setScrapeType(e.target.value)}>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
          <button type="submit">Start Scraping</button>
          <button type="button" onClick={scrapeSingle}>Scrape Single</button>
        </form>
        {scrapeResults && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={copyToClipboard}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '5px 10px',
                fontSize: '12px'
              }}
            >
              Copy
            </button>
            <pre>{scrapeResults}</pre>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Add Multiple Movies</h2>
        <textarea
          value={moviesJson}
          onChange={(e) => setMoviesJson(e.target.value)}
          placeholder='[{"movieName":"Movie 1","url":[{"480p":"url1"}],"imdbUrl":"https://imdb.com/title/tt1234567/"}]'
        />
        <label>
          <input
            type="checkbox"
            checked={skipQuality}
            onChange={(e) => setSkipQuality(e.target.checked)}
          />
          Skip Quality
        </label>
        <button onClick={addMultipleMovies}>Add Multiple</button>
        {addMoviesResult && (
          <div style={{ marginTop: '15px' }}>
            <h3>Results: Inserted: {addMoviesResult.inserted} | Skipped: {addMoviesResult.skipped}</h3>
            {addMoviesResult.results?.map((movie, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: movie.skipped ? '#ffe6e6' : '#e6ffe6',
                  border: `1px solid ${movie.skipped ? '#ff4444' : '#44ff44'}`,
                  borderRadius: '4px'
                }}
              >
                <strong>{movie.movieName}</strong>
                {movie.skipped && (
                  <div style={{ color: '#cc0000', marginTop: '5px' }}>
                    Reason: {movie.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h2>Movie Actions</h2>
        <button onClick={archiveDuplicates}>Archive Duplicates</button>
        <div>
          <input
            type="text"
            placeholder="IMDB ID (tt1234567)"
            value={imdbId}
            onChange={(e) => setImdbId(e.target.value)}
          />
          <button onClick={deleteByImdb}>Delete by IMDB</button>
        </div>
      </div>

      <div className="section">
        <h2>Update Qualities</h2>
        <form onSubmit={updateQualities}>
          <input
            type="number"
            placeholder="Page"
            value={qualities.page}
            onChange={(e) => setQualities(prev => ({ ...prev, page: parseInt(e.target.value) }))}
          />
          <input
            type="number"
            placeholder="Limit"
            value={qualities.limit}
            onChange={(e) => setQualities(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
          />
          <label>
            <input
              type="checkbox"
              checked={qualities.usePixel}
              onChange={(e) => setQualities(prev => ({ ...prev, usePixel: e.target.checked }))}
            />
            Use Pixel
          </label>
          <select
            value={qualities.type}
            onChange={(e) => setQualities(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
          <button type="submit">Update Qualities</button>
        </form>
      </div>
    </>
  )
}

export default Movies