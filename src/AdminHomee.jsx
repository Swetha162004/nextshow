
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

const emptyMovie = {
  title: '', slug: '', description: '', poster_url: '',
  banner_url: '', director: '', cast_members: '',
  release_date: '', ott_release_date: '',
  status: 'UPCOMING', is_published: false,
}

const emptyNews = {
  title: '', slug: '', short_description: '', content: '',
  image_url: '', category: 'MOVIE', tagsText: '',
  is_published: false,
}

const emptyVideo = {
  title: '', slug: '', description: '', video_url: '',
  thumbnail_url: '', movie_title: '',
  video_type: 'TRAILER', is_published: false,
}

const emptySettings = {
  site_name: 'NextShow',
  logo_url: '',
  website_url: '',
  instagram_url: '',
  youtube_url: '',
  facebook_url: '',
}

const slugify = (value) =>
  value.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export default function AdminHome() {
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(true)
  const [activePage, setActivePage] = useState('Dashboard')

  const [movies, setMovies] = useState([])
  const [movie, setMovie] = useState(emptyMovie)
  const [editingId, setEditingId] = useState(null)

  const [newsItems, setNewsItems] = useState([])
  const [newsItem, setNewsItem] = useState(emptyNews)
  const [editingNewsId, setEditingNewsId] = useState(null)

  const [videos, setVideos] = useState([])
  const [video, setVideo] = useState(emptyVideo)
  const [editingVideoId, setEditingVideoId] = useState(null)

  const [siteSettings, setSiteSettings] = useState(emptySettings)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState('')

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error || !data.user) {
          window.location.replace('/admin/login')
          return
        }

        setEmail(data.user.email || '')
        setChecking(false)
      } catch {
        window.location.replace('/admin/login')
      }
    }

    checkUser()
  }, [])

  useEffect(() => {
    if (checking) return

    if (activePage === 'Movies') loadMovies()
    if (activePage === 'News') loadNews()
    if (activePage === 'Videos') loadVideos()
    if (activePage === 'Settings') loadSettings()
  }, [activePage, checking])

  function notifyError(err) {
    setError(err?.message || 'Something went wrong.')
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.replace('/admin/login')
  }

  // MOVIES

  async function loadMovies() {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMovies(data || [])
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  function changeMovie(e) {
    const { name, value, checked, type } = e.target

    setMovie((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !editingId
        ? { slug: slugify(value) }
        : {}),
    }))
  }

  function editMovie(item) {
    setMovie({ ...emptyMovie, ...item })
    setEditingId(item.id)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetMovie() {
    setMovie({ ...emptyMovie })
    setEditingId(null)
  }

  async function saveMovie(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const payload = {
        title: movie.title.trim(),
        slug: movie.slug.trim() || slugify(movie.title),
        description: movie.description || null,
        poster_url: movie.poster_url || null,
        banner_url: movie.banner_url || null,
        director: movie.director || null,
        cast_members: movie.cast_members || null,
        release_date: movie.release_date || null,
        ott_release_date: movie.ott_release_date || null,
        status: movie.status,
        is_published: movie.is_published,
      }

      const result = editingId
        ? await supabase.from('movies').update(payload).eq('id', editingId)
        : await supabase.from('movies').insert(payload)

      if (result.error) throw result.error

      setMessage(editingId ? 'Movie updated!' : 'Movie added!')
      resetMovie()
      await loadMovies()
    } catch (err) {
      notifyError(err)
    } finally {
      setSaving(false)
    }
  }

  async function deleteMovie(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return

    setError('')
    setMessage('')

    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', item.id)

    if (error) notifyError(error)
    else {
      setMessage('Movie deleted!')
      if (editingId === item.id) resetMovie()
      await loadMovies()
    }
  }

  // NEWS

  async function loadNews() {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNewsItems(data || [])
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  function changeNews(e) {
    const { name, value, checked, type } = e.target

    setNewsItem((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !editingNewsId
        ? { slug: slugify(value) }
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

  function resetNews() {
    setNewsItem({ ...emptyNews })
    setEditingNewsId(null)
  }

  async function saveNews(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const payload = {
        title: newsItem.title.trim(),
        slug: newsItem.slug.trim() || slugify(newsItem.title),
        short_description: newsItem.short_description || null,
        content: newsItem.content || null,
        image_url: newsItem.image_url || null,
        category: newsItem.category || 'MOVIE',
        tags: newsItem.tagsText
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
        is_published: newsItem.is_published,
      }

      const result = editingNewsId
        ? await supabase.from('news').update(payload).eq('id', editingNewsId)
        : await supabase.from('news').insert(payload)

      if (result.error) throw result.error

      setMessage(editingNewsId ? 'News updated!' : 'News added!')
      resetNews()
      await loadNews()
    } catch (err) {
      notifyError(err)
    } finally {
      setSaving(false)
    }
  }

  async function deleteNews(item) {
    if (!window.confirm(`Delete news "${item.title}"?`)) return

    setError('')
    setMessage('')

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', item.id)

    if (error) notifyError(error)
    else {
      setMessage('News deleted!')
      if (editingNewsId === item.id) resetNews()
      await loadNews()
    }
  }

  // VIDEOS

  async function loadVideos() {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setVideos(data || [])
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  function changeVideo(e) {
    const { name, value, checked, type } = e.target

    setVideo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !editingVideoId
        ? { slug: slugify(value) }
        : {}),
    }))
  }

  function editVideo(item) {
    setVideo({ ...emptyVideo, ...item })
    setEditingVideoId(item.id)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetVideo() {
    setVideo({ ...emptyVideo })
    setEditingVideoId(null)
  }

  async function saveVideo(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const payload = {
        title: video.title.trim(),
        slug: video.slug.trim() || slugify(video.title),
        description: video.description.trim() || null,
        video_url: video.video_url.trim(),
        thumbnail_url: video.thumbnail_url.trim() || null,
        movie_title: video.movie_title.trim() || null,
        video_type: video.video_type,
        is_published: video.is_published,
      }

      const result = editingVideoId
        ? await supabase.from('videos').update(payload).eq('id', editingVideoId)
        : await supabase.from('videos').insert(payload)

      if (result.error) throw result.error

      setMessage(
        editingVideoId
          ? 'Video updated successfully!'
          : 'Video added successfully!'
      )
      resetVideo()
      await loadVideos()
    } catch (err) {
      notifyError(err)
    } finally {
      setSaving(false)
    }
  }

  async function deleteVideo(item) {
    if (!window.confirm(`Delete video "${item.title}"?`)) return

    setError('')
    setMessage('')

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', item.id)

    if (error) notifyError(error)
    else {
      setMessage('Video deleted successfully!')
      if (editingVideoId === item.id) resetVideo()
      await loadVideos()
    }
  }

  // SETTINGS

  async function loadSettings() {
    setSettingsLoading(true)
    setSettingsMessage('')

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setSiteSettings({
          site_name: data.site_name || 'NextShow',
          logo_url: data.logo_url || '',
          website_url: data.website_url || '',
          instagram_url: data.instagram_url || '',
          youtube_url: data.youtube_url || '',
          facebook_url: data.facebook_url || '',
        })
      } else {
        setSiteSettings({ ...emptySettings })
      }
    } catch (err) {
      setSettingsMessage('Could not load settings: ' + err.message)
    } finally {
      setSettingsLoading(false)
    }
  }

  function changeSetting(e) {
    const { name, value } = e.target

    setSiteSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function saveSettings(e) {
    e.preventDefault()
    setSettingsSaving(true)
    setSettingsMessage('')

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            id: 1,
            site_name: siteSettings.site_name.trim() || 'NextShow',
            logo_url: siteSettings.logo_url.trim() || null,
            website_url: siteSettings.website_url.trim() || null,
            instagram_url: siteSettings.instagram_url.trim() || null,
            youtube_url: siteSettings.youtube_url.trim() || null,
            facebook_url: siteSettings.facebook_url.trim() || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )

      if (error) throw error

      setSettingsMessage('Settings saved successfully!')
    } catch (err) {
      setSettingsMessage('Save failed: ' + err.message)
    } finally {
      setSettingsSaving(false)
    }
  }

  const sections = [
    {
      title: 'Movies',
      icon: '🎬',
      description: 'Manage movie information',
    },
    {
      title: 'News',
      icon: '📰',
      description: 'Publish movie news',
    },
    {
      title: 'Videos',
      icon: '▶️',
      description: 'Manage trailers and teasers',
    },
    {
      title: 'Settings',
      icon: '⚙️',
      description: 'Website and social media settings',
    },
  ]

  if (checking) {
    return <p style={{ padding: 30, color: '#fff' }}>Checking login...</p>
  }

  return (
    <div style={s.page}>
      <aside style={s.sidebar}>
        <h2>
          <span style={{ color: '#e50914' }}>NEXT</span>SHOW
        </h2>
        <p style={s.muted}>ADMIN PANEL</p>

        <button
          style={activePage === 'Dashboard' ? s.active : s.nav}
          onClick={() => setActivePage('Dashboard')}
        >
          ▦ Dashboard
        </button>

        {sections.map((item) => (
          <button
            key={item.title}
            style={activePage === item.title ? s.active : s.nav}
            onClick={() => setActivePage(item.title)}
          >
            {item.icon} {item.title}
          </button>
        ))}

        <button style={s.logout} onClick={logout}>
          Logout
        </button>
      </aside>

      <main style={s.main}>
        <header style={s.header}>
          <div>
            <h1>{activePage}</h1>
            <p style={s.muted}>Manage your NextShow content</p>
          </div>
          <span>{email}</span>
        </header>

        {/* DASHBOARD */}
        {activePage === 'Dashboard' ? (
          <>
            <section style={s.welcome}>
              <h2>Welcome to NextShow Admin 👋</h2>
              <p>Manage movies, entertainment news and video trailers.</p>
            </section>

            <section style={s.cards}>
              {sections.slice(0, 3).map((item) => (
                <button
                  key={item.title}
                  style={s.card}
                  onClick={() => setActivePage(item.title)}
                >
                  <h2>{item.icon} {item.title}</h2>
                  <p>{item.description}</p>
                  <span style={s.badge}>Open {item.title} →</span>
                </button>
              ))}

              <button
                style={s.card}
                onClick={() => setActivePage('Settings')}
              >
                <h2>⚙️ Settings</h2>
                <p>Manage website and social media details</p>
                <span style={s.badge}>Open Settings →</span>
              </button>
            </section>
          </>

        /* MOVIES */
        ) : activePage === 'Movies' ? (
          <>
            <section style={s.welcome}>
              <h2>{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>

              <form onSubmit={saveMovie} style={s.form}>
                <label style={s.label}>Movie title *
                  <input
                    style={s.input}
                    name="title"
                    value={movie.title}
                    onChange={changeMovie}
                    required
                  />
                </label>

                <label style={s.label}>Slug
                  <input
                    style={s.input}
                    name="slug"
                    value={movie.slug}
                    onChange={changeMovie}
                  />
                </label>

                <label style={s.label}>Description
                  <textarea
                    style={s.input}
                    name="description"
                    value={movie.description || ''}
                    onChange={changeMovie}
                    rows={3}
                  />
                </label>

                <label style={s.label}>Poster URL
                  <input
                    style={s.input}
                    type="url"
                    name="poster_url"
                    value={movie.poster_url || ''}
                    onChange={changeMovie}
                  />
                </label>

                <label style={s.label}>Banner URL
                  <input
                    style={s.input}
                    type="url"
                    name="banner_url"
                    value={movie.banner_url || ''}
                    onChange={changeMovie}
                  />
                </label>

                <label style={s.label}>Director
                  <input
                    style={s.input}
                    name="director"
                    value={movie.director || ''}
                    onChange={changeMovie}
                  />
                </label>

                <label style={s.label}>Cast members
                  <input
                    style={s.input}
                    name="cast_members"
                    value={movie.cast_members || ''}
                    onChange={changeMovie}
                    placeholder="Actor 1, Actor 2"
                  />
                </label>

                <div style={s.grid}>
                  <label style={s.label}>Theatre release date
                    <input
                      style={s.input}
                      type="date"
                      name="release_date"
                      value={movie.release_date || ''}
                      onChange={changeMovie}
                    />
                  </label>

                  <label style={s.label}>OTT release date
                    <input
                      style={s.input}
                      type="date"
                      name="ott_release_date"
                      value={movie.ott_release_date || ''}
                      onChange={changeMovie}
                    />
                  </label>
                </div>

                <label style={s.label}>Status
                  <select
                    style={s.input}
                    name="status"
                    value={movie.status}
                    onChange={changeMovie}
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="RELEASED">RELEASED</option>
                    <option value="STREAMING">STREAMING</option>
                  </select>
                </label>

                <label style={s.check}>
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={Boolean(movie.is_published)}
                    onChange={changeMovie}
                  />
                  Publish on website
                </label>

                <div style={s.actions}>
                  <button style={s.primary} disabled={saving}>
                    {saving ? 'Saving...' : editingId ? 'Update Movie' : 'Save Movie'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      style={s.secondary}
                      onClick={resetMovie}
                    >
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

              {loading ? <p>Loading movies...</p> : movies.length === 0 ? (
                <p style={s.muted}>No movies found.</p>
              ) : (
                <div style={s.list}>
                  {movies.map((item) => (
                    <article key={item.id} style={s.movieRow}>
                      {item.poster_url ? (
                        <img src={item.poster_url} alt="" style={s.poster} />
                      ) : (
                        <div style={s.posterPlaceholder}>🎬</div>
                      )}

                      <div style={s.movieInfo}>
                        <strong>{item.title}</strong>
                        <p style={s.muted}>
                          {item.director || 'Director not added'} · {item.status}
                        </p>
                        <small>{item.is_published ? 'Published' : 'Draft'}</small>
                      </div>

                      <button style={s.secondary} onClick={() => editMovie(item)}>Edit</button>
                      <button style={s.delete} onClick={() => deleteMovie(item)}>Delete</button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>

        /* NEWS */
        ) : activePage === 'News' ? (
          <>
            <section style={s.welcome}>
              <h2>{editingNewsId ? 'Edit News' : 'Add News'}</h2>

              <form onSubmit={saveNews} style={s.form}>
                <label style={s.label}>News title *
                  <input
                    style={s.input}
                    name="title"
                    value={newsItem.title}
                    onChange={changeNews}
                    required
                  />
                </label>

                <label style={s.label}>Slug
                  <input
                    style={s.input}
                    name="slug"
                    value={newsItem.slug}
                    onChange={changeNews}
                  />
                </label>

                <label style={s.label}>Short description
                  <textarea
                    style={s.input}
                    name="short_description"
                    value={newsItem.short_description || ''}
                    onChange={changeNews}
                    rows={2}
                  />
                </label>

                <label style={s.label}>News content
                  <textarea
                    style={s.input}
                    name="content"
                    value={newsItem.content || ''}
                    onChange={changeNews}
                    rows={5}
                  />
                </label>

                <label style={s.label}>Image URL
                  <input
                    style={s.input}
                    type="url"
                    name="image_url"
                    value={newsItem.image_url || ''}
                    onChange={changeNews}
                  />
                </label>

                <label style={s.label}>Category
                  <input
                    style={s.input}
                    name="category"
                    value={newsItem.category}
                    onChange={changeNews}
                  />
                </label>

                <label style={s.label}>Tags (comma-separated)
                  <input
                    style={s.input}
                    name="tagsText"
                    value={newsItem.tagsText}
                    onChange={changeNews}
                    placeholder="Tamil cinema, release update"
                  />
                </label>

                <label style={s.check}>
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={Boolean(newsItem.is_published)}
                    onChange={changeNews}
                  />
                  Publish on website
                </label>

                <div style={s.actions}>
                  <button style={s.primary} disabled={saving}>
                    {saving ? 'Saving...' : editingNewsId ? 'Update News' : 'Save News'}
                  </button>
                  {editingNewsId && (
                    <button
                      type="button"
                      style={s.secondary}
                      onClick={resetNews}
                    >
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
                <h2>News ({newsItems.length})</h2>
                <button style={s.secondary} onClick={loadNews}>Refresh</button>
              </div>

              {loading ? <p>Loading news...</p> : newsItems.length === 0 ? (
                <p style={s.muted}>No news found.</p>
              ) : (
                <div style={s.list}>
                  {newsItems.map((item) => (
                    <article key={item.id} style={s.movieRow}>
                      {item.image_url ? (
                        <img src={item.image_url} alt="" style={s.poster} />
                      ) : (
                        <div style={s.posterPlaceholder}>📰</div>
                      )}

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
              )}
            </section>
          </>

        /* VIDEOS */
        ) : activePage === 'Videos' ? (
          <>
            <section style={s.welcome}>
              <h2>{editingVideoId ? 'Edit Video' : 'Add New Video'}</h2>

              <form onSubmit={saveVideo} style={s.form}>
                <label style={s.label}>Video title *
                  <input
                    style={s.input}
                    name="title"
                    value={video.title}
                    onChange={changeVideo}
                    required
                  />
                </label>

                <label style={s.label}>Slug
                  <input
                    style={s.input}
                    name="slug"
                    value={video.slug}
                    onChange={changeVideo}
                  />
                </label>

                <label style={s.label}>Movie name
                  <input
                    style={s.input}
                    name="movie_title"
                    value={video.movie_title || ''}
                    onChange={changeVideo}
                    placeholder="Movie name"
                  />
                </label>

                <label style={s.label}>Video type
                  <select
                    style={s.input}
                    name="video_type"
                    value={video.video_type}
                    onChange={changeVideo}
                  >
                    <option value="TRAILER">Trailer</option>
                    <option value="TEASER">Teaser</option>
                    <option value="SONG">Song</option>
                    <option value="PROMO">Promo</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>

                <label style={s.label}>Video URL *
                  <input
                    style={s.input}
                    type="url"
                    name="video_url"
                    value={video.video_url || ''}
                    onChange={changeVideo}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </label>

                <label style={s.label}>Thumbnail URL
                  <input
                    style={s.input}
                    type="url"
                    name="thumbnail_url"
                    value={video.thumbnail_url || ''}
                    onChange={changeVideo}
                    placeholder="https://..."
                  />
                </label>

                {video.thumbnail_url && (
                  <img
                    src={video.thumbnail_url}
                    alt="Video thumbnail preview"
                    style={s.preview}
                  />
                )}

                <label style={s.label}>Description
                  <textarea
                    style={s.input}
                    name="description"
                    value={video.description || ''}
                    onChange={changeVideo}
                    rows={4}
                  />
                </label>

                <label style={s.check}>
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={Boolean(video.is_published)}
                    onChange={changeVideo}
                  />
                  Publish on website
                </label>

                <div style={s.actions}>
                  <button style={s.primary} disabled={saving}>
                    {saving ? 'Saving...' : editingVideoId ? 'Update Video' : 'Save Video'}
                  </button>
                  {editingVideoId && (
                    <button
                      type="button"
                      style={s.secondary}
                      onClick={resetVideo}
                    >
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
                <h2>Videos ({videos.length})</h2>
                <button style={s.secondary} onClick={loadVideos}>Refresh</button>
              </div>

              {loading ? <p>Loading videos...</p> : videos.length === 0 ? (
                <p style={s.muted}>No videos found. Add your first video above.</p>
              ) : (
                <div style={s.list}>
                  {videos.map((item) => (
                    <article key={item.id} style={s.movieRow}>
                      {item.thumbnail_url ? (
                        <img src={item.thumbnail_url} alt="" style={s.poster} />
                      ) : (
                        <div style={s.posterPlaceholder}>▶️</div>
                      )}

                      <div style={s.movieInfo}>
                        <strong>{item.title}</strong>
                        <p style={s.muted}>
                          {item.movie_title || 'Movie not specified'} · {item.video_type}
                        </p>
                        <small>{item.is_published ? 'Published' : 'Draft'}</small>
                        {item.video_url && (
                          <p>
                            <a
                              href={item.video_url}
                              target="_blank"
                              rel="noreferrer"
                              style={s.link}
                            >
                              Open video ↗
                            </a>
                          </p>
                        )}
                      </div>

                      <button style={s.secondary} onClick={() => editVideo(item)}>Edit</button>
                      <button style={s.delete} onClick={() => deleteVideo(item)}>Delete</button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>

        /* SETTINGS */
        ) : activePage === 'Settings' ? (
          <section style={s.welcome}>
            <h2>⚙️ Website Settings</h2>
            <p style={s.muted}>Logged in as {email}</p>
            <p style={s.muted}>
              Update your NextShow website details and social media links.
            </p>

            <button
              type="button"
              style={s.back}
              onClick={() => setActivePage('Dashboard')}
            >
              ← Back to Dashboard
            </button>

            {settingsLoading ? (
              <p style={{ marginTop: 24 }}>Loading settings...</p>
            ) : (
              <form onSubmit={saveSettings} style={s.form}>
                <h3 style={s.settingsHeading}>🌐 General Information</h3>

                <label style={s.label}>Website Name
                  <input
                    style={s.input}
                    name="site_name"
                    value={siteSettings.site_name}
                    onChange={changeSetting}
                    placeholder="NextShow"
                  />
                </label>

                <label style={s.label}>Logo Image URL
                  <input
                    style={s.input}
                    type="url"
                    name="logo_url"
                    value={siteSettings.logo_url}
                    onChange={changeSetting}
                    placeholder="https://example.com/logo.png"
                  />
                </label>

                {siteSettings.logo_url && (
                  <div>
                    <p style={s.muted}>Logo preview</p>
                    <img
                      src={siteSettings.logo_url}
                      alt="Website logo preview"
                      style={s.logoPreview}
                    />
                  </div>
                )}

                <label style={s.label}>Website URL
                  <input
                    style={s.input}
                    type="url"
                    name="website_url"
                    value={siteSettings.website_url}
                    onChange={changeSetting}
                    placeholder="https://nextshow.in"
                  />
                </label>

                <h3 style={s.settingsHeading}>📱 Social Media Links</h3>

                <label style={s.label}>Instagram URL
                  <input
                    style={s.input}
                    type="url"
                    name="instagram_url"
                    value={siteSettings.instagram_url}
                    onChange={changeSetting}
                    placeholder="https://www.instagram.com/yourpage"
                  />
                </label>

                <label style={s.label}>YouTube URL
                  <input
                    style={s.input}
                    type="url"
                    name="youtube_url"
                    value={siteSettings.youtube_url}
                    onChange={changeSetting}
                    placeholder="https://www.youtube.com/@yourchannel"
                  />
                </label>

                <label style={s.label}>Facebook URL
                  <input
                    style={s.input}
                    type="url"
                    name="facebook_url"
                    value={siteSettings.facebook_url}
                    onChange={changeSetting}
                    placeholder="https://www.facebook.com/yourpage"
                  />
                </label>

                <div style={s.actions}>
                  <button
                    type="submit"
                    style={s.primary}
                    disabled={settingsSaving}
                  >
                    {settingsSaving ? 'Saving...' : '💾 Save Settings'}
                  </button>

                  <button
                    type="button"
                    style={s.secondary}
                    onClick={loadSettings}
                    disabled={settingsSaving}
                  >
                    Reload Settings
                  </button>
                </div>
              </form>
            )}

            {settingsMessage && (
              <p
                style={
                  settingsMessage.toLowerCase().includes('failed') ||
                  settingsMessage.toLowerCase().includes('could not')
                    ? s.error
                    : s.success
                }
              >
                {settingsMessage}
              </p>
            )}
          </section>
        ) : null}
      </main>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: '#0c0c12',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: 230,
    flexShrink: 0,
    padding: 24,
    background: '#171720',
    borderRight: '1px solid #30303a',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: 32,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    borderBottom: '1px solid #30303a',
    paddingBottom: 20,
  },
  muted: {
    color: '#999',
  },
  nav: {
    background: 'transparent',
    color: '#ddd',
    padding: 12,
    border: 0,
    borderRadius: 8,
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 15,
  },
  active: {
    background: '#35171d',
    color: '#ff656d',
    padding: 12,
    border: 0,
    borderRadius: 8,
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 15,
  },
  welcome: {
    marginTop: 28,
    padding: 24,
    borderRadius: 14,
    background: '#1b1b27',
    border: '1px solid #343443',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 18,
    marginTop: 24,
  },
  card: {
    background: '#191922',
    color: '#fff',
    border: '1px solid #343443',
    borderRadius: 12,
    padding: 22,
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 15,
  },
  badge: {
    color: '#ff656d',
    fontSize: 13,
  },
  logout: {
    marginTop: 'auto',
    padding: 12,
    color: '#fff',
    background: '#b91c1c',
    border: 0,
    borderRadius: 8,
    cursor: 'pointer',
  },
  form: {
    display: 'grid',
    gap: 16,
    marginTop: 20,
  },
  label: {
    display: 'grid',
    gap: 7,
    color: '#ddd',
    fontSize: 14,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #444455',
    background: '#101018',
    color: '#fff',
    fontSize: 15,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  check: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#ddd',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  primary: {
    padding: '12px 18px',
    background: '#e50914',
    color: '#fff',
    border: 0,
    borderRadius: 8,
    cursor: 'pointer',
  },
  secondary: {
    padding: '10px 14px',
    background: '#30303c',
    color: '#fff',
    border: '1px solid #484858',
    borderRadius: 8,
    cursor: 'pointer',
  },
  delete: {
    padding: '10px 14px',
    background: '#7f1d1d',
    color: '#fff',
    border: 0,
    borderRadius: 8,
    cursor: 'pointer',
  },
  success: {
    color: '#86efac',
    marginTop: 16,
    overflowWrap: 'anywhere',
  },
  error: {
    color: '#fca5a5',
    marginTop: 16,
    overflowWrap: 'anywhere',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  list: {
    display: 'grid',
    gap: 12,
    marginTop: 16,
  },
  movieRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
    padding: 14,
    border: '1px solid #343443',
    borderRadius: 10,
    background: '#14141d',
  },
  poster: {
    width: 90,
    height: 76,
    objectFit: 'cover',
    borderRadius: 6,
    background: '#252532',
  },
  posterPlaceholder: {
    width: 58,
    height: 76,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 6,
    background: '#252532',
    fontSize: 24,
  },
  movieInfo: {
    flex: 1,
    minWidth: 150,
    overflowWrap: 'anywhere',
  },
  preview: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    borderRadius: 10,
  },
  link: {
    color: '#ff656d',
  },
  back: {
    marginTop: 12,
    padding: '12px 18px',
    background: '#30303c',
    color: '#fff',
    border: '1px solid #484858',
    borderRadius: 8,
    cursor: 'pointer',
  },
  settingsHeading: {
    marginTop: 10,
    marginBottom: 0,
    paddingBottom: 10,
    borderBottom: '1px solid #343443',
    color: '#ff656d',
  },
  logoPreview: {
    width: '100%',
    maxWidth: 180,
    maxHeight: 100,
    objectFit: 'contain',
    background: '#101018',
    border: '1px solid #343443',
    borderRadius: 8,
    padding: 10,
  },
}


