
import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    window.location.href = '/admin/home'
  }

  return (
    <main style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>
        <div style={styles.logo}>N</div>
        <h1>NextShow Admin</h1>
        <p style={styles.subtitle}>Sign in to manage your content</p>

        <label style={styles.label}>Email address</label>
        <input
          type="email"
          placeholder="Enter your admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button disabled={loading} type="submit" style={styles.button}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={styles.footer}>NextShow — Your Daily Destination for Everything Movies!</p>
      </form>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0b0b0f',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    padding: '36px',
    background: '#17171f',
    border: '1px solid #30303a',
    borderRadius: '18px',
    boxShadow: '0 20px 60px #0008',
  },
  logo: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: '#e50914',
    display: 'grid',
    placeItems: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  subtitle: { color: '#aaa', marginBottom: '28px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px' },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #41414d',
    background: '#101016',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    background: '#e50914',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: { color: '#ff7373', fontSize: '14px' },
  footer: {
    color: '#888',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '24px',
    lineHeight: 1.5,
  },
}