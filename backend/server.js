//imports neccessary packages that have been previously installed
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

//importing of modules
import pool from './src/config/database.js';
import projectRoutes from './src/routes/projectRoutes.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';



const app = express();

//Middleware function to serve static files, handles client side assets like css + javascript 

app.use(cors()) //manages  controls web security by allowing cross-origin requests from specified origins
app.use(express.json()) //parses incoming JSON requests and makes the data available in req.body

// Test route
app.get('/', (req, res) => {
  res.send('MzansiBuilds API is running');
});

//project routes that are mounted at /api/projects
app.use('/api/projects', projectRoutes);

app.use(notFoundHandler); // handles 404 errors for undefined routes
app.use(errorHandler); // global error handling middleware, should be last middleware to ensure it catches errors from all routes

// starts the server
const port = process.env.PORT || 5000;

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
export default app; // exports the app for testing purposes