'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main style={styles.main}>
      <h1>Next.js App Template 🚀</h1>
      <p>Welcome to your Next.js Starter!</p>

      <div style={styles.card}>
        <button onClick={() => setCount(count + 1)} style={styles.button}>
          Count: {count}
        </button>
        <p style={styles.text}>Click the button to increment counter</p>
      </div>

      <div style={styles.features}>
        <h2>Features</h2>
        <ul>
          <li>Server-side Rendering (SSR)</li>
          <li>API Routes</li>
          <li>File-based Routing</li>
          <li>Built-in CSS Support</li>
        </ul>
      </div>
    </main>
  );
}

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '2rem',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  text: {
    marginTop: '1rem',
    color: '#666',
  },
  features: {
    marginTop: '3rem',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
};
