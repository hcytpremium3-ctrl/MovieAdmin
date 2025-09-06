import { useState } from 'react'
import { apiRequest } from '../utils/api'

function Posters({ apiKey }) {
  const [imdbIds, setImdbIds] = useState('')
  const [posterLimit, setPosterLimit] = useState(100)
  const [posterResults, setPosterResults] = useState('')

  const setPosterMovies = async () => {
    const ids = imdbIds.split(',').map(id => id.trim())
    try {
      await apiRequest('/movies/set-poster-movies', {
        method: 'POST',
        body: JSON.stringify({ imdbIds: ids })
      }, apiKey)
      alert('Poster movies set successfully')
      setImdbIds('')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const checkPosters = async () => {
    try {
      const result = await apiRequest(`/image/check-posters?limit=${posterLimit}`, {}, apiKey)
      setPosterResults(JSON.stringify(result, null, 2))
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  return (
    <>
      <div className="section">
        <h2>Set Poster Movies</h2>
        <textarea
          value={imdbIds}
          onChange={(e) => setImdbIds(e.target.value)}
          placeholder="tt1234567,tt7654321,tt9876543"
        />
        <button onClick={setPosterMovies}>Set Posters</button>
      </div>

      <div className="section">
        <h2>Check Poster Images</h2>
        <input
          type="number"
          placeholder="Limit"
          value={posterLimit}
          onChange={(e) => setPosterLimit(e.target.value)}
        />
        <button onClick={checkPosters}>Check Posters</button>
        {posterResults && <pre>{posterResults}</pre>}
      </div>
    </>
  )
}

export default Posters