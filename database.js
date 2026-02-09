const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Determine database path
let dbPath = path.resolve(__dirname, 'database.sqlite');

// Check if we are in a read-only environment (like Vercel)
// Vercel sets 'VERCEL' environment variable to '1'
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    // Only /tmp is writable in Vercel functions
    dbPath = '/tmp/database.sqlite';
    console.log('Running on Vercel/Production, using database path: ' + dbPath);
} else {
    try {
      fs.accessSync(path.dirname(dbPath), fs.constants.W_OK);
    } catch (e) {
      console.log('Root directory is read-only, falling back to /tmp/database.sqlite');
      dbPath = '/tmp/database.sqlite';
    }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database at ' + dbPath, err);
  } else {
    console.log('Connected to SQLite database at ' + dbPath);
  }
});

db.serialize(() => {
  console.log('Initializing database tables...');
  // Create Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT UNIQUE,
    password_hash TEXT,
    balance REAL DEFAULT 0
  )`, (err) => {
      if (err) console.error("Error creating users table:", err);
  });

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
  )`, (err) => {
      if (err) console.error("Error creating investments table:", err);
      else console.log('Database tables initialized.');
  });
});

module.exports = db;
