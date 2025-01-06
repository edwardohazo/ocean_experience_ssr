import express from 'express';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();

// Define paths for the templates and data
const templatesDir = path.join(process.cwd(), 'templates');
const dataFile = path.join(process.cwd(), 'data.json');
const jsonData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// Define path to the assets directory (sibling of index.js)
const assetsDir = path.join(process.cwd(), 'assets');

// Cors policy handled
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', templatesDir);

// Middleware to serve static files from the 'assets' directory
app.use('/assets', express.static(assetsDir));  // Access files via /assets/*

// Middleware to serve static assets like CSS, JS, images, etc.
app.use(express.static(path.join(process.cwd(), 'assets')));

// Function to generate the page on the fly based on lang and page
const generatePage = (lang, page, data, res) => {
  // Define a map to associate pages with their corresponding template files
  const templateMap = {
    index: 'index.ejs',
    diving: 'diving.ejs',
    boat: 'boat.ejs',
    snorkel: 'snorkel.ejs',
    contact: 'contact.ejs',
    book: 'book.ejs',
    day: 'day.ejs',
    payment: 'payment.ejs',
    placeorder: 'placeorder.ejs',
    order: 'order.ejs'
  };

  // Get the template for the current page
  const templateFile = path.join(templatesDir, templateMap[page]);

  // Render the EJS template with the page data
  ejs.renderFile(templateFile, data, (err, html) => {
    if (err) {
      console.error(`Error rendering EJS for ${lang} - ${page}:`, err);
      res.status(500).send('Error rendering page');
    } else {
      // Send the rendered HTML to the client
      res.send(html);
      console.log(`Sent generated HTML for ${lang} - ${page}`);
    }
  });
};

// Route to handle requests for pages
app.get('/:lang/:page', (req, res) => {
  const { lang, page } = req.params;

  // Check if the requested language and page exist in the data
  if (jsonData[lang] && jsonData[lang][page]) {
    const dataForPage = jsonData[lang][page];
    generatePage(lang, page, dataForPage, res);
  } else {
    res.status(404).send('Page not found');
  }
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
