const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
// More info: https://expressjs.com/en/api.html#express.json 
app.use(express.json());

// Ensure the temp directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Proxy route for GraphQL requests
app.post('/sku', async (req, res) => {
  const { sku } = req.body;

  // Dynamically import node-fetch Real time data from VTEX
  const fetch = (await import('node-fetch')).default;

  if (!sku) {
    return res.status(400).json({ message: 'SKU is required' });
  }
// GraphQL query to fetch the product data based on the schema from VTEX GraphQL IDE
  const graphqlQuery = `
    query Request {
      productsByIdentifier(field: sku, values: "${sku}") @context(provider: "vtex.search-graphql@0.62.0") { 
        productName
        brand
        priceRange {
          sellingPrice {
            lowPrice
          }
        }
        description
        items(filter: FIRST_AVAILABLE) {
          images {
            imageUrl
          }
        }
        categoryTree {
          href
        }
      }
    }
  `;

  try {
    const response = await fetch('https://thefoschini.myvtex.com/_v/segment/graphql/v1/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: graphqlQuery }),
    });

    const data = await response.json();

    if (!data || !data.data || !data.data.productsByIdentifier || data.data.productsByIdentifier.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Save the JSON response to a consistent file path
    const filePath = path.join(tempDir, 'productData.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ message: 'Data saved successfully', filePath: '/temp/productData.json' });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('An error occurred while fetching and saving the data');
  }
});

// Route to serve the saved JSON file ( may have to move this outside of the server when implementing outside of development environment)
app.get('/temp/productData.json', (req, res) => {
  const filePath = path.join(tempDir, 'productData.json');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});