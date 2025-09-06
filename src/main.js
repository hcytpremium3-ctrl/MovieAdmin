import './style.css'

const API_BASE_URL = 'http://localhost:3000/api'
const DEFAULT_API_KEY = '1f4a002debf1b5b7311d62da492d6918c84039997b0702284e211d85c2b0dad6'
let apiKey = localStorage.getItem('apiKey') || DEFAULT_API_KEY

const app = document.querySelector('#app')

function renderLogin() {
  app.innerHTML = `
    <div class="login-container">
      <h1>Movie Admin Panel</h1>
      <form id="login-form">
        <input type="password" id="api-key" placeholder="Enter API Key" value="${DEFAULT_API_KEY}" required>
        <button type="submit">Login</button>
      </form>
    </div>
  `
  
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const key = document.getElementById('api-key').value
    localStorage.setItem('apiKey', key)
    apiKey = key
    renderAdmin()
  })
}

function renderAdmin() {
  app.innerHTML = `
    <div class="admin-container">
      <header>
        <h1>Movie Admin Panel</h1>
        <button id="logout">Logout</button>
      </header>
      
      <div class="tabs">
        <button class="tab active" data-tab="movies">Movies</button>
        <button class="tab" data-tab="admin">Admin View</button>
        <button class="tab" data-tab="posters">Posters</button>
        <button class="tab" data-tab="streams">Streams</button>
        <button class="tab" data-tab="config">Config</button>
      </div>
      
      <div id="movies" class="tab-content active">
        <div class="section">
          <h2>Scrape Movies</h2>
          <form id="scrape-form">
            <input type="url" id="scrape-url" placeholder="URL" value="https://movies4u.exposed/" required>
            <select id="scrape-type">
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>
            <button type="submit">Start Scraping</button>
            <button type="button" onclick="scrapeSingle()">Scrape Single</button>
          </form>
          <div id="scrape-results"></div>
        </div>
        
        <div class="section">
          <h2>Add Multiple Movies</h2>
          <textarea id="movies-json" placeholder='[{"movieName":"Movie 1","url":[{"480p":"url1"}],"imdbUrl":"https://imdb.com/title/tt1234567/"}]'></textarea>
          <button onclick="addMultipleMovies()">Add Multiple</button>
        </div>
        
        <div class="section">
          <h2>Movie Actions</h2>
          <button onclick="archiveDuplicates()">Archive Duplicates</button>
          <div>
            <input type="text" id="imdb-id" placeholder="IMDB ID (tt1234567)">
            <button onclick="deleteByImdb()">Delete by IMDB</button>
          </div>
        </div>
        
        <div class="section">
          <h2>Update Qualities</h2>
          <form id="update-qualities">
            <input type="number" id="page" placeholder="Page" value="1">
            <input type="number" id="limit" placeholder="Limit" value="10">
            <label><input type="checkbox" id="usePixel" checked> Use Pixel</label>
            <select id="type">
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>
            <button type="submit">Update Qualities</button>
          </form>
        </div>
      </div>
      
      <div id="admin" class="tab-content">
        <div class="section">
          <h2>Admin Movies View</h2>
          <form id="admin-filter">
            <input type="number" id="admin-page" placeholder="Page" value="1">
            <input type="number" id="admin-limit" placeholder="Limit" value="20">
            <select id="admin-type">
              <option value="">All Types</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>
            <input type="text" id="admin-genre" placeholder="Genre">
            <select id="admin-archived">
              <option value="">All Status</option>
              <option value="true">Archived</option>
              <option value="false">Active</option>
            </select>
            <button type="submit">Load Movies</button>
          </form>
          <div id="admin-results">
            <table id="movies-table" style="display:none">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            <div id="pagination"></div>
          </div>
        </div>
      </div>
      
      <div id="posters" class="tab-content">
        <div class="section">
          <h2>Set Poster Movies</h2>
          <textarea id="imdb-ids" placeholder="tt1234567,tt7654321,tt9876543"></textarea>
          <button onclick="setPosterMovies()">Set Posters</button>
        </div>
        
        <div class="section">
          <h2>Check Poster Images</h2>
          <input type="number" id="poster-limit" placeholder="Limit" value="100">
          <button onclick="checkPosters()">Check Posters</button>
          <div id="poster-results"></div>
        </div>
      </div>
      
      <div id="streams" class="tab-content">
        <div class="section">
          <h2>Add Network Stream</h2>
          <form id="add-stream">
            <input type="text" id="stream-title" placeholder="Stream Title" required>
            <input type="url" id="stream-url" placeholder="Stream URL" required>
            <label><input type="checkbox" id="vip"> VIP</label>
            <button type="submit">Add Stream</button>
          </form>
        </div>
      </div>
      
      <div id="config" class="tab-content">
        <div class="section">
          <h2>App Configuration</h2>
          <form id="app-config">
            <textarea id="app-urls" placeholder="https://app-url.com"></textarea>
            <label><input type="checkbox" id="live" checked> Live</label>
            <input type="text" id="min-version" placeholder="Min Version (1.2.0)">
            <input type="url" id="android-url" placeholder="Android Download URL">
            <button type="submit">Update Config</button>
          </form>
        </div>
      </div>
    </div>
  `
  
  setupEventListeners()
}

function setupEventListeners() {
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('apiKey')
    apiKey = null
    renderLogin()
  })
  
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'))
      e.target.classList.add('active')
      document.getElementById(tabName).classList.add('active')
    })
  })
  

  document.getElementById('scrape-form').addEventListener('submit', scrapeMovies)
  document.getElementById('admin-filter').addEventListener('submit', loadAdminMovies)
  document.getElementById('update-qualities').addEventListener('submit', updateQualities)
  
  // Load first page on admin tab click
  document.querySelector('[data-tab="admin"]').addEventListener('click', () => {
    setTimeout(() => loadAdminMovies({ preventDefault: () => {} }), 100)
  })
  document.getElementById('add-stream').addEventListener('submit', addNetworkStream)
  document.getElementById('app-config').addEventListener('submit', updateAppConfig)
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...options.headers
    }
  })
  
  if (response.status === 401) {
    localStorage.removeItem('apiKey')
    apiKey = null
    renderLogin()
    throw new Error('Unauthorized')
  }
  
  return response.json()
}

async function scrapeMovies(e) {
  e.preventDefault()
  try {
    const result = await apiRequest('/scrape', {
      method: 'POST',
      body: JSON.stringify({
        url: document.getElementById('scrape-url').value,
        type: document.getElementById('scrape-type').value
      })
    })
    document.getElementById('scrape-results').innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`
    alert('Scraping completed successfully')
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

window.scrapeSingle = async function() {
  try {
    const result = await apiRequest('/scrape/single', {
      method: 'POST',
      body: JSON.stringify({
        url: document.getElementById('scrape-url').value,
        type: document.getElementById('scrape-type').value
      })
    })
    document.getElementById('scrape-results').innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`
    alert('Single scraping completed successfully')
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

async function loadAdminMovies(e) {
  e.preventDefault()
  try {
    const params = new URLSearchParams({
      page: document.getElementById('admin-page').value,
      limit: document.getElementById('admin-limit').value
    })
    
    const type = document.getElementById('admin-type').value
    const genre = document.getElementById('admin-genre').value
    const archived = document.getElementById('admin-archived').value
    
    if (type) params.append('type', type)
    if (genre) params.append('genre', genre)
    if (archived) params.append('archived', archived)
    
    const result = await apiRequest(`/movies/admin?${params}`)
    displayMoviesTable(result)
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

function displayMoviesTable(data) {
  const table = document.getElementById('movies-table')
  const tbody = table.querySelector('tbody')
  const pagination = document.getElementById('pagination')
  
  tbody.innerHTML = data.movies?.map(movie => `
    <tr>
      <td>${movie.title || movie.movieName || 'N/A'}</td>
      <td>${movie.type || 'N/A'}</td>
      <td>${movie.genre || 'N/A'}</td>
      <td>${movie.year || 'N/A'}</td>
      <td>${movie.archived ? 'Archived' : 'Active'}</td>
      <td>${new Date(movie.addedAt).toLocaleDateString()}</td>
    </tr>
  `).join('') || '<tr><td colspan="6">No movies found</td></tr>'
  
  const prevDisabled = data.page <= 1 ? 'disabled' : ''
  const nextDisabled = data.page >= data.pages ? 'disabled' : ''
  
  pagination.innerHTML = `
    <button onclick="goToPage(${data.page - 1})" ${prevDisabled}>Previous</button>
    <span>Page ${data.page} of ${data.pages} (${data.total} total)</span>
    <button onclick="goToPage(${data.page + 1})" ${nextDisabled}>Next</button>
  `
  table.style.display = 'table'
}

window.goToPage = function(page) {
  document.getElementById('admin-page').value = page
  loadAdminMovies({ preventDefault: () => {} })
}

window.addMultipleMovies = async function() {
  try {
    const movies = JSON.parse(document.getElementById('movies-json').value)
    await apiRequest('/movies/add-movie-multiple', {
      method: 'POST',
      body: JSON.stringify({ movies })
    })
    alert('Movies added successfully')
    document.getElementById('movies-json').value = ''
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

window.archiveDuplicates = async function() {
  try {
    await apiRequest('/movies/archive-duplicates', { method: 'POST' })
    alert('Duplicates archived successfully')
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

window.deleteByImdb = async function() {
  const imdbId = document.getElementById('imdb-id').value
  if (!imdbId) return alert('Enter IMDB ID')
  
  try {
    await apiRequest(`/movies/imdb/${imdbId}`, { method: 'DELETE' })
    alert('Movie deleted successfully')
    document.getElementById('imdb-id').value = ''
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

async function updateQualities(e) {
  e.preventDefault()
  try {
    await apiRequest('/update-qualities', {
      method: 'POST',
      body: JSON.stringify({
        page: parseInt(document.getElementById('page').value),
        limit: parseInt(document.getElementById('limit').value),
        usePixel: document.getElementById('usePixel').checked,
        type: document.getElementById('type').value
      })
    })
    alert('Qualities updated successfully')
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

window.setPosterMovies = async function() {
  const imdbIds = document.getElementById('imdb-ids').value.split(',').map(id => id.trim())
  try {
    await apiRequest('/movies/set-poster-movies', {
      method: 'POST',
      body: JSON.stringify({ imdbIds })
    })
    alert('Poster movies set successfully')
    document.getElementById('imdb-ids').value = ''
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

window.checkPosters = async function() {
  const limit = document.getElementById('poster-limit').value
  try {
    const result = await apiRequest(`/image/check-posters?limit=${limit}`)
    document.getElementById('poster-results').innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

async function addNetworkStream(e) {
  e.preventDefault()
  try {
    await apiRequest('/network-stream', {
      method: 'POST',
      body: JSON.stringify({
        title: document.getElementById('stream-title').value,
        url: document.getElementById('stream-url').value,
        vip: document.getElementById('vip').checked
      })
    })
    alert('Stream added successfully')
    document.getElementById('add-stream').reset()
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

async function updateAppConfig(e) {
  e.preventDefault()
  try {
    const appUrls = document.getElementById('app-urls').value.split('\n').filter(url => url.trim())
    await apiRequest('/config/app-url', {
      method: 'POST',
      body: JSON.stringify({
        appUrls,
        live: document.getElementById('live').checked,
        minRequiredVersion: document.getElementById('min-version').value,
        androidDownloadUrl: document.getElementById('android-url').value
      })
    })
    alert('Config updated successfully')
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

// Initialize app
if (apiKey) {
  renderAdmin()
} else {
  renderLogin()
}