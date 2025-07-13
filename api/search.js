import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors()); 

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  const type = req.query.type || 'movie';

  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=${type}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch from OMDb' });
  }
});

app.get('/api/details', async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: 'Missing IMDb ID' });
  }

  try {
    const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${encodeURIComponent(id)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy Error (details):', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

app.get('/api/episode', async (req, res) => {
  const { t, season, episode } = req.query;

  if (!t || !season || !episode) {
    return res.status(400).json({ error: 'Missing title, season or episode' });
  }

  try {
    const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(t)}&Season=${season}&Episode=${episode}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy Error (episode):', error);
    res.status(500).json({ error: 'Failed to fetch episode details' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});



export default app;