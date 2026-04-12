//imports neccessary packages that have been previously installed
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config({ path: './.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//Middleware function to serve static files, handles client side assets like css + javascript 
app.use(express.static(path.join(__dirname, "public")))
app.use(cors()) //manages  controls web security by allowing cross-origin requests from specified origins
app.use(express.json()) //parses incoming JSON requests and makes the data available in req.body



// starts the server
const port = process.env.PORT || 5000;

// Test route
app.get('/', (req, res) => {
  res.send('MzansiBuilds API is running');
});



//ensures readiness to receive incoming requests
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});