import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('sedco.db');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add a test user
const hashedPassword = bcrypt.hashSync('admin123', 10);
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (email, password, name)
  VALUES (?, ?, ?)
`);

insertUser.run('admin@sedco.gov.my', hashedPassword, 'Admin User');

console.log('Database setup completed!');