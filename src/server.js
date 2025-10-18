import express from 'express';
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import dotenv from "dotenv";
import authMiddleware from './middleware/authmiddleware.js';
dotenv.config();


const app = express();
const PORT =process.env.PORT || 5000


// Get the File path From the URL of The currennt  module

const __filename = fileURLToPath(import.meta.url);

// Get the Directory name from the file path

const __dirname = dirname(__filename);


// Serves the HTML file From th /public Directory
// Tells express to serve all the files from the public folder as static assets /file. Any reqquests for the css files will  be resolved to the public directory.

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json());

// Serving up the HTML File for the public directory
app.get('/', (req, res) => {
    res.sendStatus(200)
    res.sendFile(path.join( __dirname, 'public', 'index.html'))
})

app.use('/auth', authRoutes)
app.use('/todos',authMiddleware, todoRoutes)
 
app.listen(PORT, () => {
    console.log(`Hi from the server ${PORT}`);
    
})