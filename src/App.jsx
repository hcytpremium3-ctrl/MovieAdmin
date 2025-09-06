import { useState, useEffect } from 'react'
import Login from './components/Login'
import AdminPanel from './components/AdminPanel'

const DEFAULT_API_KEY = '1f4a002debf1b5b7311d62da492d6918c84039997b0702284e211d85c2b0dad6'

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || DEFAULT_API_KEY)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('apiKey'))

  const handleLogin = (key) => {
    localStorage.setItem('apiKey', key)
    setApiKey(key)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('apiKey')
    setApiKey(null)
    setIsLoggedIn(false)
  }

  return (
    <>
      {isLoggedIn ? (
        <AdminPanel apiKey={apiKey} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} defaultApiKey={DEFAULT_API_KEY} />
      )}
    </>
  )
}

export default App