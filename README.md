# v1 Gridline - Figma Plugin

An attempt at streamlining the integration of product data into Figma designs by generating designs based on product information.
 The plugin allows designers to dynamically generate design components that reflect real-world product data—such as product images, names, prices, categories, and more directly within Figma. By reducing manual input and improving accuracy, Gridline accelerates the designers workflow, making it a potentially advantagious tool for any design team working with bash product data. <br><br>![AltText](/images/preview.gif) <br>

## Key Features

<table>
  <tr>
    <td><strong>Component Cloning</strong></td>
    <td>The plugin automates the creation of design instances within Figma by cloning design components. This feature enables designers to quickly generate multiple instances of a component with the included product information.</td>
  </tr>
  <tr>
    <td><strong>Real-Time Data Integration:</strong></td>
    <td>The plugin integrates real-time product data directly into Figma, allowing designers to fetch and apply the latest information to the cloned instances, ensuring that all design elements are synchronized with the most current data.</td>
  </tr>
</table>


##  Overview

<table>
  <tr>
    <td><span style="color:#8B8BF1;">SKU Input:</span></td>
    <td>Users start by entering a SKU number in the plugin’s input field. The plugin recognizes when a valid SKU has been entered (6 or 7 digits) and automatically initiates a data fetch.</td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Data Fetching:</span></td>
    <td>Upon detecting a valid SKU, the plugin sends a request to an external server. The server processes this request by querying a GraphQL endpoint to retrieve product data, which it then saves as a JSON file.</td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Visual Feedback:</span></td>
    <td>Throughout the process, the plugin updates the user on its current status through status text and color-coded indicators.</td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Image Preview:</span></td>
    <td>After successfully retrieving product data, the plugin displays up to three product images in the UI, providing a preview of the product that will be inserted into the Figma design.</td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Instance Generation:</span></td>
    <td>When ready, the user clicks the “Generate Design” button. The plugin then applies the fetched product data to the selected Figma components, generating design instances that are fully populated with the product details.</td>
  </tr>
</table>

## __Set Up__
### 1. Install Node.js and npm

- **Node.js**: This is the JavaScript runtime that allows you to run JavaScript code on the server side.
- **npm (Node Package Manager)**: This comes bundled with Node.js and is used to install and manage the packages (dependencies) your project needs.

You can download and install Node.js from the official website: [Node.js](https://nodejs.org/).

### 2. Navigate to Your Project Directory


Install depenencies:
```bash
npm install express node-fetch cors
```
Start the server:
```bash
npm start
```
or alternatively:
```bash
node server/server.js
```
### 3. Import to Figma 

Reference this directory in Figma via by navigating through <br> 
*Plugins > Developement > Manage Plugins In Development > Import Plugin From Manifest*
<br>
<br>

# System Architecture
```
Proj-Gridline/
├── images/                    # Images related to the project
├── node_modules/              
├── server/                    # Directory for backend-related files 
│   ├── node_modules/          
│   ├── temp/                  # Temporary storage for fetched product data
│   │   └── productData.json   # JSON file containing product data fetched from the VTEX API
│   ├── package-lock.json      
│   ├── package.json           
│   └── server.js              # Node.js script, handles SKU queries and data processing
├── .gitignore                 
├── code.js                    # Compiled JavaScript from the code.ts file
├── code.ts                    # Main TypeScript file for Figma plugin logic
├── manifest.json              # Figma plugin manifest file
├── package-lock.json          
├── package.json               
├── README.md                  # Project documentation file
├── tsconfig.json              # TypeScript configuration file for the project
└── ui.html                    # HTML file defining the plugin's user interface 
```


## Backend (Local Node.js Server)
The server component of Gridline plays a crucial role in the overall architecture by acting as a bridge between the Figma plugin and the external data source (a GraphQL API). 
The server is built using Node.js, The server’s primary functions are to handle HTTP requests, query a GraphQL endpoint, and manage the storage and retrieval of JSON files.



The server uses several key dependencies to function effectively: [Express](https://expressjs.com/), a minimal and flexible Node.js web application framework, provides a robust set of features for developing web and mobile applications; [node-fetch](https://www.npmjs.com/package/node-fetch), a lightweight module, enables the server to make HTTP requests, such as those needed to query a GraphQL endpoint; and [cors](https://www.npmjs.com/package/cors), an Express middleware package, facilitates Cross-Origin Resource Sharing (CORS) with various configuration options.

This command installs the above key dependencies:
```bash
npm install express node-fetch cors
```

---
## Frontend (Figma Plugin UI)
The user interface is built using HTML, CSS, and Typescript(JavaScript.) It enables users to interact with the plugin, enter SKUs, view product images, and trigger the generation of design instances. The <span style="color:#8B8BF1;">ui.html </span> file serves as the user interface for the Gridline plugin. It is divided into 3 key sections, each serving a specific purpose:

### **JavaScript Functionality**
<table>

 <tr>
  <td><strong> Image Preview Section</strong></td>
  <td>
    The <span style="color: grey;"> id="json-loaded" </span> Displays the current status of the plugin, such as "PENDING," "READING," "GETTING PRODUCT," and "JSON LOADED." The color of the text, icon, and border changes according to the status.<br>
    <span style="color:grey;">id="image-previews"</span> Holds up to three image previews fetched from the product data.
  </td>
</tr>
<tr>
  <td><strong>SKU Input Section</strong></td>
  <td>
    <span style="color:grey;">(< input type="text" id="sku-input" ></span> is used as the text input field where users enter the SKU number. It triggers the process of fetching product data when a valid SKU is detected.
    <span style="color:grey;">id="selected-instances" </span>: Displays the names of the selected instances in Figma. This updates dynamically based on user selection.
  </td>
</tr>
<tr>
  <td><strong>Generate Button</strong></td>
  <td>
    The generate instance button <span style="color:grey;">id="generate" class="generate-button"</span> when clicked, this button initiates the process of applying the fetched product data to the selected instances in Figma.
  </td>
  
</tr>
<tr>
  <td><strong>CSS Styling</strong></td>
  <td>
    The<span style="color:grey;"> `.json-loaded` class </span>is used to style the status indicator. It includes a text element (`.json-loaded-text`) and an icon (`.json-loaded-icon`), both of which change color based on the plugin's current state.
  </td>
  
</tr>
</table>



### **JavaScript Functionality**

The JavaScript file is responsible for the interactive functionality of the Gridline plugin, including responding to user input, fetching data, and updating the UI.

- **SKU Input Event Listener**:
  - The SKU input field listens for changes (`input` event). It checks if the SKU length is either 6 or 7 digits, and if so, it triggers the `fetchProductData` function.
  - The status text is updated to "READING" when the user is typing and "PENDING" when the input is cleared.

```javascript
document.getElementById('sku-input').addEventListener('input', () => {
  const sku = document.getElementById('sku-input').value.trim();
  updateStatusText(sku ? 'READING' : 'PENDING');
  if (sku.length === 6 || sku.length === 7) {
    fetchProductData(sku);
  }
});
```

- **Generate Button Event Listener**:
  - The "Generate Instance" button listens for click events (`onclick`). If product data has been successfully fetched, it sends this data to the TypeScript part of the plugin via `parent.postMessage`.

```javascript
document.getElementById('generate').onclick = () => {
  if (!productData) {
    alert('Please enter a valid SKU number and wait for it to load.');
    return;
  }
  parent.postMessage({ pluginMessage: { type: 'generateInstances', productData } }, '*');
};
```

##### **2.2 Fetching Product Data**

The `fetchProductData` function is the core of the plugin's functionality. It sends the SKU to the backend server, retrieves the product data, and updates the UI with the relevant information.

- **Fetch Request**:
  - The function sends a POST request to the local Node.js server with the SKU as the payload. The server processes this request by querying an external GraphQL endpoint, saving the result as a JSON file.

```javascript
const response = await fetch('http://localhost:3000/sku', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ sku }),
});
```

- **Updating the UI**:
  - Upon successfully retrieving the product data, the function updates the status text to "JSON LOADED" and displays the image previews.
  - If the fetch fails, an error message is logged, and the user is alerted.

```javascript
const jsonResponse = await fetch('http://localhost:3000/temp/productData.json');
productData = await jsonResponse.json();

updateStatusText('JSON LOADED');
displayImagePreviews(productData);
```

##### **2.3 Updating UI Elements**

The UI is dynamically updated based on the current state of the plugin:

- **Status Text and Border Colors**:
  - The `updateStatusText` function updates the status text, border color, and icon color based on the plugin's current state. This provides clear feedback to the user at every step of the process.

```javascript
function updateStatusText(text) {
  const statusText = document.getElementById('json-loaded-text');
  const statusBorder = document.getElementById('json-loaded');
  const statusIcon = document.getElementById('json-loaded-icon');

  statusText.textContent = text;

  // Define the color for each status
  let color;
  switch (text) {
    case 'PENDING':
      color = '#FFA500'; // Orange
      break;
    case 'READING':
      color = '#FFD700'; // Gold
      break;
    case 'GETTING PRODUCT':
      color = '#1E90FF'; // Dodger Blue
      break;
    case 'JSON LOADED':
      color = '#8AFF61'; // Green
      break;
  }

  // Apply the color to the border, icon, and text
  statusBorder.style.borderColor = color;
  statusIcon.style.backgroundColor = color;
  statusText.style.color = color;
}
```

- **Image Previews**:
  - The `displayImagePreviews` function extracts up to three images from the product data and displays them in the designated area of the UI.

```javascript
function displayImagePreviews(productData) {
  const images = productData.data.productsByIdentifier[0].items[0].images.slice(0, 3);
  images.forEach((image, index) => {
    const imgDiv = document.getElementById(`image${index + 1}`);
    imgDiv.style.backgroundImage = `url(${image.imageUrl})`;
    imgDiv.style.backgroundSize = 'cover';
    imgDiv.style.backgroundPosition = 'center';
  });
}
```

##### **2.4 Handling Messages from Figma**

The plugin listens for messages from the Figma environment, particularly updates about the selected instances. The `updateSelectedInstances` function updates the UI to reflect the selected instances in Figma.

```javascript
window.onmessage = (event) => {
  const message = event.data.pluginMessage;
  if (message.type === 'updateSelection') {
    updateSelectedInstances(message.selectedInstanceNames);
  }
};
```

---



# Proj-Gridline
# Proj-Gridline
