import { useState } from 'react'
import { apiRequest } from '../utils/api'

function Movies({ apiKey }) {
  const [scrapeResults, setScrapeResults] = useState('')
  const [moviesJson, setMoviesJson] = useState('')
  const [imdbId, setImdbId] = useState('')
  const [scrapeUrl, setScrapeUrl] = useState('https://movies4u.exposed/')
  const [scrapeType, setScrapeType] = useState('movie')
  const [qualities, setQualities] = useState({ page: 1, limit: 10, usePixel: true, type: 'movie' })

  const scrapeMovies = async (e) => {
    e.preventDefault()
    try {
      const result = await apiRequest('/scrape', {
        method: 'POST',
        body: JSON.stringify({ url: scrapeUrl, type: scrapeType })
      }, apiKey)
      setScrapeResults(JSON.stringify(result, null, 2))
      alert('Scraping completed successfully')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const scrapeSingle = async () => {
    try {
      const result = await apiRequest('/scrape/single', {
        method: 'POST',
        body: JSON.stringify({ url: scrapeUrl, type: scrapeType })
      }, apiKey)
      setScrapeResults(JSON.stringify(result, null, 2))
      alert('Single scraping completed successfully')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const addMultipleMovies = async () => {
    try {
      const movies = JSON.parse(moviesJson)
      await apiRequest('/movies/add-movie-multiple', {
        method: 'POST',
        body: JSON.stringify({ movies })
      }, apiKey)
      alert('Movies added successfully')
      setMoviesJson('')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const archiveDuplicates = async () => {
    try {
      await apiRequest('/movies/archive-duplicates', { method: 'POST' }, apiKey)
      alert('Duplicates archived successfully')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const deleteByImdb = async () => {
    if (!imdbId) return alert('Enter IMDB ID')
    try {
      await apiRequest(`/movies/imdb/${imdbId}`, { method: 'DELETE' }, apiKey)
      alert('Movie deleted successfully')
      setImdbId('')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const updateQualities = async (e) => {
    e.preventDefault()
    try {
      await apiRequest('/update-qualities', {
        method: 'POST',
        body: JSON.stringify(qualities)
      }, apiKey)
      alert('Qualities updated successfully')
    } catch (error) {
      alert('Error: ' + error.message)
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
        {scrapeResults && <pre>{scrapeResults}</pre>}
      </div>

      <div className="section">
        <h2>Add Multiple Movies</h2>
        <textarea
          value={moviesJson}
          onChange={(e) => setMoviesJson(e.target.value)}
          placeholder='[{"movieName":"Movie 1","url":[{"480p":"url1"}],"imdbUrl":"https://imdb.com/title/tt1234567/"}]'
        />
        <button onClick={addMultipleMovies}>Add Multiple</button>
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