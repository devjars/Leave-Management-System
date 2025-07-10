// config/db.js
const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql2.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Optional: test connection once
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error(' Database connection failed:', error.message);
  }
};

testConnection();

// Export query runner function
module.exports =  async (query, params) => {
  try {
    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error(" Query Error:", error.message);
    throw error;
  }
};


