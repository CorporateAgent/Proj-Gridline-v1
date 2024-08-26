const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Using static import of fetch

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

app.post('/search', async (req, res) => {
    const { searchText, orderBy } = req.body;
    console.log("Received searchText:", searchText, "and orderBy:", orderBy); // Log incoming data

    const graphqlQuery = `
        query Request {
            productSearch(fullText: "${searchText}", orderBy: "${orderBy}") @context(provider: "vtex.search-graphql@0.62.0") {
                products {
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
        }
    `;

    console.log("Constructed GraphQL Query:", graphqlQuery); // Log the constructed query before sending

    try {
        // Log the exact body being sent to the API
        const requestBody = JSON.stringify({ query: graphqlQuery });
        console.log("Sending request to API with body:", requestBody);

        const response = await fetch('https://thefoschini.myvtex.com/_v/segment/graphql/v1/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("GraphQL Response:", data); // Log the response from the API

        if (!data || !data.data || !data.data.productSearch || data.data.productSearch.products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        data.data.productSearch.products.forEach((product, index) => {
            const filePath = path.join(tempDir, `product_${index + 1}.json`);
            fs.writeFileSync(filePath, JSON.stringify(product, null, 2));
        });

        res.json({ message: 'Data saved successfully', count: data.data.productSearch.products.length });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('An error occurred while fetching and saving the data');
    }
});

app.get('/temp/:filename', (req, res) => {
    const filePath = path.join(tempDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});