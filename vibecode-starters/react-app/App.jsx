import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <h1>React App Template 🚀</h1>
      <p>Welcome to your React Starter!</p>
      
      <div style={styles.card}>
        <button onClick={() => setCount(count + 1)} style={styles.button}>
          Count: {count}
        </button>
        <p style={styles.text}>Click the button to increment</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
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
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  text: {
    marginTop: '1rem',
    color: '#666',
  },
};
