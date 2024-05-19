const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'my_database',
  password: 'sasa',
  port: 5432,
});

app.get('/items', async (req, res) => {
  const result = await pool.query('SELECT * FROM in_trade.items');
  res.json(result.rows);
});

// Get item by id
app.get('/items/:id', async (req, res) => {
  const { id } = req.params;  
    const result = await pool.query('SELECT * FROM in_trade.items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.status(200).json(result.rows[0]);  
});

app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  const result = await pool.query(
    'INSERT INTO in_trade.items (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  res.json(result.rows[0]);
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const result = await pool.query(
    'UPDATE in_trade.items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  res.json(result.rows[0]);
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM in_trade.items WHERE id = $1', [id]);
  res.sendStatus(204);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
