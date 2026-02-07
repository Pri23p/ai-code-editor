import { Hono } from 'hono';

const app = new Hono();

// Home Page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hono App</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          h1 { color: #333; }
          .count { font-size: 2rem; color: #0070f3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hono App Template 🚀</h1>
          <p>Welcome to your Hono Starter!</p>
          <p class="count">Ultra-fast web framework for the Edge</p>
          <p>Visit <a href="/api/data">/api/data</a> for JSON response</p>
        </div>
      </body>
    </html>
  `);
});

// API Endpoint
app.get('/api/data', (c) => {
  return c.json({
    message: 'Hono API Response',
    framework: 'Hono',
    version: '3.10.0',
    features: ['EdgeX Runtime', 'Lightweight', 'High-Performance', 'Type-Safe'],
  });
});

// Dynamic Route
app.get('/api/hello/:name', (c) => {
  const name = c.req.param('name');
  return c.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  });
});

export default app;
