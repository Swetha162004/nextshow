
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function AdminHome() {
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        window.location.replace('/admin/login')
        return
      }

      setEmail(data.user.email || '')
      setChecking(false)
    }

    checkUser()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    window.location.replace('/admin/login')
  }

  if (checking) return <p style={{ padding: 30 }}>Checking login...</p>

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2><span style={{ color: '#e50914' }}>NEXT</span>SHOW</h2>
        <p style={styles.muted}>ADMIN PANEL</p>
        <hr />
        <p style={styles.active}>▦ Dashboard</p>
        <p>🎬 Movies</p>
        <p>📰 News</p>
        <p>▶ Videos & Trailers</p>
        <p>⚙ Settings</p>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1>Dashboard</h1>
            <p style={styles.muted}>Manage your NextShow content</p>
          </div>
          <span>{email}</span>
        </header>

        <section style={styles.welcome}>
          <h2>Welcome to NextShow Admin 👋</h2>
          <p>Manage movies, entertainment news and YouTube trailers from one place.</p>
        </section>

        <section style={styles.cards}>
          {[
            ['🎬', 'Movies', 'Manage movie information'],
            ['📰', 'News', 'Publish movie news'],
            ['▶', 'Videos', 'Manage trailers and teasers'],
          ].map(([icon, title, description]) => (
            <article style={styles.card} key={title}>
              <h2>{icon} {title}</h2>
              <p>{description}</p>
              <span style={styles.badge}>Connected dashboard</span>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: '#0c0c12',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: 230,
    padding: 24,
    background: '#171720',
    borderRight: '1px solid #30303a',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  main: { flex: 1, minWidth: 0, padding: 32 },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    borderBottom: '1px solid #30303a',
    paddingBottom: 20,
  },
  muted: { color: '#999' },
  active: {
    background: '#35171d',
    color: '#ff656d',
    padding: 12,
    borderRadius: 8,
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
    border: '1px solid #343443',
    borderRadius: 12,
    padding: 22,
  },
  badge: { color: '#9ca3af', fontSize: 12 },
  logout: {
    marginTop: 'auto',
    padding: 12,
    color: '#fff',
    background: '#b91c1c',
    border: 0,
    borderRadius: 8,
    cursor: 'pointer',
  },
}