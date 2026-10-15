
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

const emptyNews = {
  title: '',
  slug: '',
  short_description: '',
  content: '',
  image_url: '',
  category: 'MOVIE',
  tagsText: '',
  is_published: false,
}

const emptyMovie = {
  title: '',
  slug: '',
  description: '',
  poster_url: '',
  banner_url: '',
  director: '',
  cast_members: '',
  release_date: '',
  ott_release_date: '',
  status: 'UPCOMING',
  is_published: false,
}

export default function AdminHome() {
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(true)
  const [activePage, setActivePage] = useState('Dashboard')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [movie, setMovie] = useState(emptyMovie)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [newsItems, setNewsItems] = useState([])
  const [newsItem, setNewsItem] = useState(emptyNews)
  const [editingNewsId, setEditingNewsId] = useState(null)

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        window.location.replace('/admin/login')
        return
      }

      setEmail(data.user.email || '')
      setChecking(false)
    }

    checkUser()
  }, [])

  useEffect(() => {
    if (activePage === 'Movies' && !checking) loadMovies()
    if (activePage === 'News' && !checking) loadNews()
  }, [activePage, checking])

  async function logout() {
    await supabase.auth.signOut()
    window.location.replace('/admin/login')
  }

  async function loadMovies() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setMovies(data || [])
    }

    setLoading(false)
  }

  function changeField(e) {
    const { name, value, checked, type } = e.target

    setMovie((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !editingId
        ? {
            slug: value
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, ''),
          }
        : {}),
    }))
  }

  function editMovie(item) {
    setMovie({
      ...emptyMovie,
      ...item,
      release_date: item.release_date || '',
      ott_release_date: item.ott_release_date || '',
    })
    setEditingId(item.id)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setMovie(emptyMovie)
    setEditingId(null)
  }

  async function saveMovie(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const payload = {
      title: movie.title.trim(),
      slug:
        movie.slug.trim() ||
        movie.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      description: movie.description.trim() || null,
      poster_url: movie.poster_url.trim() || null,
      banner_url: movie.banner_url.trim() || null,
      director: movie.director.trim() || null,
      cast_members: movie.cast_members.trim() || null,
      release_date: movie.release_date || null,
      ott_release_date: movie.ott_release_date || null,
      status: movie.status,
      is_published: movie.is_published,
    }

    const result = editingId
      ? await supabase
          .from('movies')
          .update(payload)
          .eq('id', editingId)
      : await supabase.from('movies').insert(payload)

    if (result.error) {
      setError(result.error.message)
    } else {
      setMessage(editingId ? 'Movie updated successfully!' : 'Movie added successfully!')
      resetForm()
      await loadMovies()
    }

    setSaving(false)
  }

  async function deleteMovie(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return

    setError('')
    setMessage('')

    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', item.id)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Movie deleted successfully!')
      await loadMovies()
    }
  }


  async function loadNews() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setNewsItems(data || [])
    setLoading(false)
  }

  function changeNewsField(e) {
    const { name, value, checked, type } = e.target
    setNewsItem((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !editingNewsId
        ? { slug: value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
        : {}),
    }))
  }

  function editNews(item) {
    setNewsItem({
      ...emptyNews,
      ...item,
      tagsText: Array.isArray(item.tags) ? item.tags.join(', ') : '',
    })
    setEditingNewsId(item.id)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetNewsForm() {
    setNewsItem(emptyNews)
    setEditingNewsId(null)
  }

  async function saveNews(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const payload = {
      title: newsItem.title.trim(),
      slug: newsItem.slug.trim() || newsItem.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      short_description: newsItem.short_description.trim() || null,
      content: newsItem.content.trim() || null,
      image_url: newsItem.image_url.trim() || null,
      category: newsItem.category.trim() || 'MOVIE',
      tags: newsItem.tagsText.split(',').map((tag) => tag.trim()).filter(Boolean),
      is_published: newsItem.is_published,
    }

    const result = editingNewsId
      ? await supabase.from('news').update(payload).eq('id', editingNewsId)
      : await supabase.from('news').insert(payload)

    if (result.error) {
      setError(result.error.message)
    } else {
      setMessage(editingNewsId ? 'News updated successfully!' : 'News added successfully!')
      resetNewsForm()
      await loadNews()
    }
    setSaving(false)
  }

  async function deleteNews(item) {
    if (!window.confirm(`Delete news "${item.title}"?`)) return
    setError('')
    setMessage('')
    const { error } = await supabase.from('news').delete().eq('id', item.id)
    if (error) setError(error.message)
    else {
      setMessage('News deleted successfully!')
      if (editingNewsId === item.id) resetNewsForm()
      await loadNews()
    }
  }

  const sections = [
    { title: 'Movies', icon: '🎬', description: 'Manage movie information' },
    { title: 'News', icon: '📰', description: 'Publish movie news' },
    { title: 'Videos', icon: '▶', description: 'Manage trailers and teasers' },
    { title: 'Settings', icon: '⚙', description: 'Admin settings' },
  ]

  if (checking) {
    return <p style={{ padding: 30, color: '#fff' }}>Checking login...</p>
  }

  return (
    <div style={s.page}>
      <aside style={s.sidebar}>
        <h2><span style={{ color: '#e50914' }}>NEXT</span>SHOW</h2>
        <p style={s.muted}>ADMIN PANEL</p>

        <button style={activePage === 'Dashboard' ? s.active : s.nav}
          onClick={() => setActivePage('Dashboard')}>▦ Dashboard</button>

        {sections.map((item) => (
          <button key={item.title}
            style={activePage === item.title ? s.active : s.nav}
            onClick={() => setActivePage(item.title)}>
            {item.icon} {item.title}
          </button>
        ))}

        <button style={s.logout} onClick={logout}>Logout</button>
      </aside>

      <main style={s.main}>
        <header style={s.header}>
          <div>
            <h1>{activePage}</h1>
            <p style={s.muted}>Manage your NextShow content</p>
          </div>
          <span>{email}</span>
        </header>

        {activePage === 'Dashboard' ? (
          <>
            <section style={s.welcome}>
              <h2>Welcome to NextShow Admin 👋</h2>
              <p>Manage movies, entertainment news and YouTube trailers from one place.</p>
            </section>
            <section style={s.cards}>
              {sections.slice(0, 3).map((item) => (
                <button key={item.title} style={s.card}
                  onClick={() => setActivePage(item.title)}>
                  <h2>{item.icon} {item.title}</h2>
                  <p>{item.description}</p>
                  <span style={s.badge}>Open {item.title} →</span>
                </button>
              ))}
            </section>
          </>
        ) : activePage === 'Movies' ? (
          <>
            <section style={s.welcome}>
              <h2>{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>

              <form onSubmit={saveMovie} style={s.form}>
                <label style={s.label}>Movie title *
                  <input style={s.input} name="title" value={movie.title}
                    onChange={changeField} required />
                </label>

                <label style={s.label}>Slug
                  <input style={s.input} name="slug" value={movie.slug}
                    onChange={changeField} />
                </label>

                <label style={s.label}>Description
                  <textarea style={s.input} name="description"
                    value={movie.description || ''} onChange={changeField} rows={3} />
                </label>

                <label style={s.label}>Poster URL
                  <input style={s.input} type="url" name="poster_url"
                    value={movie.poster_url || ''} onChange={changeField} />
                </label>

                <label style={s.label}>Banner URL
                  <input style={s.input} type="url" name="banner_url"
                    value={movie.banner_url || ''} onChange={changeField} />
                </label>

                <label style={s.label}>Director
                  <input style={s.input} name="director"
                    value={movie.director || ''} onChange={changeField} />
                </label>

                <label style={s.label}>Cast members
                  <input style={s.input} name="cast_members"
                    value={movie.cast_members || ''} onChange={changeField}
                    placeholder="Actor 1, Actor 2" />
                </label>

                <div style={s.grid}>
                  <label style={s.label}>Theatre release date
                    <input style={s.input} type="date" name="release_date"
                      value={movie.release_date || ''} onChange={changeField} />
                  </label>

                  <label style={s.label}>OTT release date
                    <input style={s.input} type="date" name="ott_release_date"
                      value={movie.ott_release_date || ''} onChange={changeField} />
                  </label>
                </div>

                <label style={s.label}>Status
                  <select style={s.input} name="status" value={movie.status || 'UPCOMING'}
                    onChange={changeField}>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="RELEASED">RELEASED</option>
                    <option value="STREAMING">STREAMING</option>
                  </select>
                </label>

                <label style={s.check}>
                  <input type="checkbox" name="is_published"
                    checked={Boolean(movie.is_published)} onChange={changeField} />
                  Publish on website
                </label>

                <div style={s.actions}>
                  <button style={s.primary} disabled={saving} type="submit">
                    {saving ? 'Saving...' : editingId ? 'Update Movie' : 'Save Movie'}
                  </button>
                  {editingId && (
                    <button style={s.secondary} type="button" onClick={resetForm}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {message && <p style={s.success}>{message}</p>}
              {error && <p style={s.error}>{error}</p>}
            </section>

            <section style={s.welcome}>
              <div style={s.listHeader}>
                <h2>Movies ({movies.length})</h2>
                <button style={s.secondary} onClick={loadMovies}>Refresh</button>
              </div>

              {loading ? <p>Loading movies...</p> :
                movies.length === 0 ? <p style={s.muted}>No movies yet. Add your first movie above.</p> :
                <div style={s.list}>
                  {movies.map((item) => (
                    <article key={item.id} style={s.movieRow}>
                      {item.poster_url
                        ? <img src={item.poster_url} alt="" style={s.poster} />
                        : <div style={s.posterPlaceholder}>🎬</div>}
                      <div style={s.movieInfo}>
                        <strong>{item.title}</strong>
                        <p style={s.muted}>{item.director || 'Director not added'} · {item.status}</p>
                        <small>{item.is_published ? 'Published' : 'Draft'}</small>
                      </div>
                      <button style={s.secondary} onClick={() => editMovie(item)}>Edit</button>
                      <button style={s.delete} onClick={() => deleteMovie(item)}>Delete</button>
                    </article>
                  ))}
                </div>
              }
            </section>
          </>
        ) : activePage === 'News' ? (
          <>
            <section style={s.welcome}>
              <h2>{editingNewsId ? 'Edit News' : 'Add News'}</h2>
              <form onSubmit={saveNews} style={s.form}>
                <label style={s.label}>News title *
                  <input style={s.input} name="title" value={newsItem.title} onChange={changeNewsField} required />
                </label>
                <label style={s.label}>Slug
                  <input style={s.input} name="slug" value={newsItem.slug} onChange={changeNewsField} placeholder="news-title-slug" />
                </label>
                <label style={s.label}>Short description
                  <textarea style={s.input} name="short_description" value={newsItem.short_description || ''} onChange={changeNewsField} rows={2} />
                </label>
                <label style={s.label}>News content
                  <textarea style={s.input} name="content" value={newsItem.content || ''} onChange={changeNewsField} rows={6} />
                </label>
                <label style={s.label}>Image URL
                  <input style={s.input} type="url" name="image_url" value={newsItem.image_url || ''} onChange={changeNewsField} placeholder="https://..." />
                </label>
                <label style={s.label}>Category
                  <input style={s.input} name="category" value={newsItem.category || ''} onChange={changeNewsField} placeholder="MOVIE" />
                </label>
                <label style={s.label}>Tags (comma-separated)
                  <input style={s.input} name="tagsText" value={newsItem.tagsText || ''} onChange={changeNewsField} placeholder="Tamil cinema, release update" />
                </label>
                <label style={s.check}>
                  <input type="checkbox" name="is_published" checked={Boolean(newsItem.is_published)} onChange={changeNewsField} />
                  Publish on website
                </label>
                <div style={s.actions}>
                  <button style={s.primary} disabled={saving} type="submit">
                    {saving ? 'Saving...' : editingNewsId ? 'Update News' : 'Save News'}
                  </button>
                  {editingNewsId && <button style={s.secondary} type="button" onClick={resetNewsForm}>Cancel Edit</button>}
                </div>
              </form>
              {message && <p style={s.success}>{message}</p>}
              {error && <p style={s.error}>{error}</p>}
            </section>
            <section style={s.welcome}>
              <div style={s.listHeader}>
                <h2>News ({newsItems.length})</h2>
                <button style={s.secondary} onClick={loadNews}>Refresh</button>
              </div>
              {loading ? <p>Loading news...</p> : newsItems.length === 0 ? <p style={s.muted}>No news yet. Add your first news item above.</p> :
                <div style={s.list}>
                  {newsItems.map((item) => (
                    <article key={item.id} style={s.movieRow}>
                      {item.image_url ? <img src={item.image_url} alt="" style={s.poster} /> : <div style={s.posterPlaceholder}>📰</div>}
                      <div style={s.movieInfo}>
                        <strong>{item.title}</strong>
                        <p style={s.muted}>{item.category || 'Uncategorized'}</p>
                        <small>{item.is_published ? 'Published' : 'Draft'}</small>
                      </div>
                      <button style={s.secondary} onClick={() => editNews(item)}>Edit</button>
                      <button style={s.delete} onClick={() => deleteNews(item)}>Delete</button>
                    </article>
                  ))}
                </div>
              }
              {error && <p style={s.error}>{error}</p>}
            </section>
          </>
        ) : (
          <section style={s.welcome}>
            <h2>{sections.find((item) => item.title === activePage)?.icon} {activePage} Management</h2>
            <p>{sections.find((item) => item.title === activePage)?.description}</p>
            {activePage === 'Videos' && <p style={s.info}>Videos management will be connected next.</p>}
            {activePage === 'Settings' && <p style={s.info}>Logged in as {email}</p>}
            <button style={s.back} onClick={() => setActivePage('Dashboard')}>← Back to Dashboard</button>
          </section>
        )}
      </main>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', background: '#0c0c12', color: '#fff', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: 230, flexShrink: 0, padding: 24, background: '#171720', borderRight: '1px solid #30303a', display: 'flex', flexDirection: 'column', gap: 14 },
  main: { flex: 1, minWidth: 0, padding: 32 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', borderBottom: '1px solid #30303a', paddingBottom: 20 },
  muted: { color: '#999' },
  nav: { background: 'transparent', color: '#ddd', padding: 12, border: 0, borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 15 },
  active: { background: '#35171d', color: '#ff656d', padding: 12, border: 0, borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 15 },
  welcome: { marginTop: 28, padding: 24, borderRadius: 14, background: '#1b1b27', border: '1px solid #343443' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginTop: 24 },
  card: { background: '#191922', color: '#fff', border: '1px solid #343443', borderRadius: 12, padding: 22, textAlign: 'left', cursor: 'pointer', fontSize: 15 },
  badge: { color: '#ff656d', fontSize: 13 },
  info: { marginTop: 24, padding: 16, borderRadius: 8, background: '#111119', color: '#ccc', lineHeight: 1.7 },
  back: { marginTop: 20, padding: '12px 18px', background: '#b91c1c', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' },
  logout: { marginTop: 'auto', padding: 12, color: '#fff', background: '#b91c1c', border: 0, borderRadius: 8, cursor: 'pointer' },
  form: { display: 'grid', gap: 16, marginTop: 20 },
  label: { display: 'grid', gap: 7, color: '#ddd', fontSize: 14 },
  input: { width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: 8, border: '1px solid #444455', background: '#101018', color: '#fff', fontSize: 15 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  check: { display: 'flex', alignItems: 'center', gap: 10, color: '#ddd' },
  actions: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  primary: { padding: '12px 18px', background: '#e50914', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' },
  secondary: { padding: '10px 14px', background: '#30303c', color: '#fff', border: '1px solid #484858', borderRadius: 8, cursor: 'pointer' },
  delete: { padding: '10px 14px', background: '#7f1d1d', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' },
  success: { color: '#86efac', marginTop: 16 },
  error: { color: '#fca5a5', marginTop: 16, overflowWrap: 'anywhere' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  list: { display: 'grid', gap: 12, marginTop: 16 },
  movieRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, padding: 14, border: '1px solid #343443', borderRadius: 10, background: '#14141d' },
  poster: { width: 58, height: 76, objectFit: 'cover', borderRadius: 6, background: '#252532' },
  posterPlaceholder: { width: 58, height: 76, display: 'grid', placeItems: 'center', borderRadius: 6, background: '#252532', fontSize: 24 },
  movieInfo: { flex: 1, minWidth: 150 },
}
