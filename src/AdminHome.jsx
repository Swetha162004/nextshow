

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function AdminHome() {
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(true)
  const [activePage, setActivePage] = useState('Dashboard')

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

  async function logout() {
    await supabase.auth.signOut()
    window.location.replace('/admin/login')
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
      icon: '▶',
      description: 'Manage trailers and teasers',
    },
    {
      title: 'Settings',
      icon: '⚙',
      description: 'Admin settings',
    },
  ]

  if (checking) {
    return <p style={{ padding: 30, color: '#fff' }}>Checking login...</p>
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2>
          <span style={{ color: '#e50914' }}>NEXT</span>SHOW
        </h2>

        <p style={styles.muted}>ADMIN PANEL</p>

        <button
          style={activePage === 'Dashboard' ? styles.active : styles.nav}
          onClick={() => setActivePage('Dashboard')}
        >
          ▦ Dashboard
        </button>

        {sections.map((section) => (
          <button
            key={section.title}
            style={
              activePage === section.title ? styles.active : styles.nav
            }
            onClick={() => setActivePage(section.title)}
          >
            {section.icon} {section.title}
          </button>
        ))}

        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1>{activePage}</h1>
            <p style={styles.muted}>Manage your NextShow content</p>
          </div>
          <span>{email}</span>
        </header>

        {activePage === 'Dashboard' ? (
          <>
            <section style={styles.welcome}>
              <h2>Welcome to NextShow Admin 👋</h2>
              <p>
                Manage movies, entertainment news and YouTube trailers
                from one place.
              </p>
            </section>

            <section style={styles.cards}>
              {sections.slice(0, 3).map((section) => (
                <button
                  key={section.title}
                  style={styles.cardButton}
                  onClick={() => setActivePage(section.title)}
                >
                  <h2>
                    {section.icon} {section.title}
                  </h2>
                  <p>{section.description}</p>
                  <span style={styles.badge}>
                    Open {section.title} →
                  </span>
                </button>
              ))}
            </section>
          </>
        ) : (
          <section style={styles.welcome}>
            <h2>
              {sections.find((item) => item.title === activePage)?.icon}{' '}
              {activePage} Management
            </h2>

            <p>
              {sections.find((item) => item.title === activePage)?.description}
            </p>

            {activePage === 'Movies' && (
              <p style={styles.info}>
                Next: connect the movies table to list, add, edit and
                delete movie records.
              </p>
            )}

            {activePage === 'News' && (
              <p style={styles.info}>
                Next: connect the news table to publish and manage news.
              </p>
            )}

            {activePage === 'Videos' && (
              <p style={styles.info}>
                Next: connect the videos table to manage trailers and teasers.
              </p>
            )}

            {activePage === 'Settings' && (
              <p style={styles.info}>
                You are logged in as {email}.
              </p>
            )}

            <button
              style={styles.backButton}
              onClick={() => setActivePage('Dashboard')}
            >
              ← Back to Dashboard
            </button>
          </section>
        )}
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
  muted: { color: '#999' },
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
  cardButton: {
    background: '#191922',
    color: '#fff',
    border: '1px solid #343443',
    borderRadius: 12,
    padding: 22,
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 15,
  },
  badge: { color: '#ff656d', fontSize: 13 },
  info: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    background: '#111119',
    color: '#ccc',
    lineHeight: 1.7,
  },
  backButton: {
    marginTop: 20,
    padding: '12px 18px',
    background: '#b91c1c',
    color: '#fff',
    border: 0,
    borderRadius: 8,
    cursor: 'pointer',
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
}
