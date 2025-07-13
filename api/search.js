// import express from 'express';
// import fetch from 'node-fetch';
// import dotenv from 'dotenv';
// import cors from 'cors';

// dotenv.config();

// const app = express();
// const PORT = 5000;

// app.use(cors()); 

// app.get('/api/search', async (req, res) => {
//   const query = req.query.q;
//   const type = req.query.type || 'movie';

//   if (!query) {
//     return res.status(400).json({ error: 'Missing query' });
//   }

//   try {
//     const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=${type}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error('Proxy Error:', error);
//     res.status(500).json({ error: 'Failed to fetch from OMDb' });
//   }
// });

// app.get('/api/details', async (req, res) => {
//   const id = req.query.id;
//   if (!id) {
//     return res.status(400).json({ error: 'Missing IMDb ID' });
//   }

//   try {
//     const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${encodeURIComponent(id)}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error('Proxy Error (details):', error);
//     res.status(500).json({ error: 'Failed to fetch movie details' });
//   }
// });

// app.get('/api/episode', async (req, res) => {
//   const { t, season, episode } = req.query;

//   if (!t || !season || !episode) {
//     return res.status(400).json({ error: 'Missing title, season or episode' });
//   }

//   try {
//     const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(t)}&Season=${season}&Episode=${episode}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error('Proxy Error (episode):', error);
//     res.status(500).json({ error: 'Failed to fetch episode details' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Proxy server running at http://localhost:${PORT}`);
// });


import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url, method } = req;
  const { query } = req;

  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (url.startsWith('/api/search')) {
    const q = query.q;
    const type = query.type || 'movie';

    if (!q) {
      return res.status(400).json({ error: 'Missing query' });
    }

    try {
      const apiUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(q)}&type=${type}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Proxy Error (search):', error);
      return res.status(500).json({ error: 'Failed to fetch from OMDb' });
    }
  }

  if (url.startsWith('/api/details')) {
    const id = query.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing IMDb ID' });
    }

    try {
      const apiUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(id)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Proxy Error (details):', error);
      return res.status(500).json({ error: 'Failed to fetch movie details' });
    }
  }

  if (url.startsWith('/api/episode')) {
    const { t, season, episode } = query;

    if (!t || !season || !episode) {
      return res.status(400).json({ error: 'Missing title, season or episode' });
    }

    try {
      const apiUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(t)}&Season=${season}&Episode=${episode}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Proxy Error (episode):', error);
      return res.status(500).json({ error: 'Failed to fetch episode details' });
    }
  }

  return res.status(404).json({ error: 'Route not found' });
}

