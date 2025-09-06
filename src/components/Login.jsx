import { useState } from 'react'

function Login({ onLogin, defaultApiKey }) {
  const [apiKey, setApiKey] = useState(defaultApiKey)

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(apiKey)
  }

  return (
    <div className="login-container">
      <h1>Movie Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API Key"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login