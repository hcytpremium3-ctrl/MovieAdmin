import { useState } from 'react'
import { apiRequest } from '../utils/api'

function Streams({ apiKey }) {
  const [stream, setStream] = useState({ title: '', url: '', vip: false })

  const addNetworkStream = async (e) => {
    e.preventDefault()
    try {
      await apiRequest('/network-stream', {
        method: 'POST',
        body: JSON.stringify(stream)
      }, apiKey)
      alert('Stream added successfully')
      setStream({ title: '', url: '', vip: false })
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  return (
    <div className="section">
      <h2>Add Network Stream</h2>
      <form onSubmit={addNetworkStream}>
        <input
          type="text"
          placeholder="Stream Title"
          value={stream.title}
          onChange={(e) => setStream(prev => ({ ...prev, title: e.target.value }))}
          required
        />
        <input
          type="url"
          placeholder="Stream URL"
          value={stream.url}
          onChange={(e) => setStream(prev => ({ ...prev, url: e.target.value }))}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={stream.vip}
            onChange={(e) => setStream(prev => ({ ...prev, vip: e.target.checked }))}
          />
          VIP
        </label>
        <button type="submit">Add Stream</button>
      </form>
    </div>
  )
}

export default Streams