import { useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../utils/api'

function Config({ apiKey }) {
  const [config, setConfig] = useState({
    appUrls: '',
    live: true,
    minRequiredVersion: '',
    androidDownloadUrl: ''
  })

  const updateAppConfig = async (e) => {
    e.preventDefault()
    try {
      const appUrls = config.appUrls.split('\n').filter(url => url.trim())
      await apiRequest('/config/app-url', {
        method: 'POST',
        body: JSON.stringify({
          ...config,
          appUrls
        })
      }, apiKey)
      toast.success('Config updated successfully')
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  return (
    <div className="section">
      <h2>App Configuration</h2>
      <form onSubmit={updateAppConfig}>
        <textarea
          placeholder="https://app-url.com"
          value={config.appUrls}
          onChange={(e) => setConfig(prev => ({ ...prev, appUrls: e.target.value }))}
        />
        <label>
          <input
            type="checkbox"
            checked={config.live}
            onChange={(e) => setConfig(prev => ({ ...prev, live: e.target.checked }))}
          />
          Live
        </label>
        <input
          type="text"
          placeholder="Min Version (1.2.0)"
          value={config.minRequiredVersion}
          onChange={(e) => setConfig(prev => ({ ...prev, minRequiredVersion: e.target.value }))}
        />
        <input
          type="url"
          placeholder="Android Download URL"
          value={config.androidDownloadUrl}
          onChange={(e) => setConfig(prev => ({ ...prev, androidDownloadUrl: e.target.value }))}
        />
        <button type="submit">Update Config</button>
      </form>
    </div>
  )
}

export default Config