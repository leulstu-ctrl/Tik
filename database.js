const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {
  // Create Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT UNIQUE,
    password_hash TEXT,
    balance REAL DEFAULT 0
  )`);

  // Create Investments table
  db.run(`CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    plan_name TEXT,
    amount REAL,
    potential_return REAL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
