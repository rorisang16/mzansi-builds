import dotenv from 'dotenv';
dotenv.config();
import pool from './src/config/database.js';
import app from './src/app.js';




const port = process.env.PORT || 5000;



// starts the server

async function startServer() {
  try {
    // Test database connection before starting the server (fail -fast principle). test db connection before accepting HTTP Requests. 
    //if db is down , server exists immediately with a clear error instead of starting and failing on every request
    const connection = await pool.getConnection();
    console.log("Database connection successful");
    connection.release(); // releases the connection back to the pool : borrowed to verify connectivity

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });} catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}


//process level error handlers
//these catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {console.error('Unhandled Rejection:', reason);process.exit(1);
});

// for programming errors that slip through all try-catch blocks

process.on('uncaughtException', (error) => {console.error('Uncaught Exception:', error);process.exit(1);
});

// nb: super important for error handlers to be last as middleware executes top to bottom. error handler needs to be after all routes.see express docs
startServer();
