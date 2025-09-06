import { useState } from 'react'
import AdminView from './AdminView'
import Movies from './Movies'
import Posters from './Posters'
import Streams from './Streams'
import Config from './Config'
import Modal from './Modal'

function AdminPanel({ apiKey, onLogout }) {
  const [activeTab, setActiveTab] = useState('admin')
  const [modal, setModal] = useState({ show: false, title: '', content: '' })

  const showModal = (title, content) => {
    setModal({ show: true, title, content })
  }

  const closeModal = () => {
    setModal({ show: false, title: '', content: '' })
  }

  return (
    <div className="admin-container">
      <header>
        <h1>Movie Admin Panel</h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      <div className="tabs">
        {[
          { id: 'admin', label: 'Admin View' },
          { id: 'movies', label: 'Movies' },
          { id: 'posters', label: 'Posters' },
          { id: 'streams', label: 'Streams' },
          { id: 'config', label: 'Config' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'admin' && <AdminView apiKey={apiKey} showModal={showModal} />}
      {activeTab === 'movies' && <Movies apiKey={apiKey} />}
      {activeTab === 'posters' && <Posters apiKey={apiKey} />}
      {activeTab === 'streams' && <Streams apiKey={apiKey} />}
      {activeTab === 'config' && <Config apiKey={apiKey} />}

      <Modal modal={modal} onClose={closeModal} />
    </div>
  )
}

export default AdminPanel