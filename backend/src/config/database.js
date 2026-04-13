import mysql from "mysql2/promise"; // use of mysql 2 promise in order to ensure secure async queries
import dotenv from "dotenv";

dotenv.config(); // Loads environment variables from .env file

let pool;
// conection pool to manage multiple connections to the database
try
{  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // database host from .env
    user: process.env.DB_USER  || 'root', // database user from .env
    password: process.env.DB_PASSWORD || '', // database password from .env
    database: process.env.DB_NAME || 'mzansi_builds', // database name from .env
    waitForConnections: true, // waits for connections if the pool is full
    connectionLimit: 10, // maximum number of connections in the pool
    queueLimit: 0 // unlimited queueing for connection requests
  });
  
  console.log("Database pool created successfully");// creates pool and returns promise
} catch (error) {
  console.error("Error creating database pool:", error);
  process.exit(1); // Exits the process with an error code
}

//event listeners for connection errors
//  code for handling pool errors gracefully
pool.on('error', (err) => {
  console.error(' Unexpected error on idle connection:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    console.error('Database had a fatal error.');
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_INVOKING_ERROR') {
    console.error('Database connection error.');
  }
});


export default pool; // exports the pool for use in other parts of the application