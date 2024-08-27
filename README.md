# Gridline System v0.2

An attempt at streamlining the integration of product data into Figma designs, the plugin enables designers to generate design instances using predefined components from the team library. It automatically populates these instances with Bash product data. By cloning existing design components, the plugin simplifies the application of product details in design prototypes, ensuring designers have access to the most up-to-date and relevant product information in their designs. <br><br>![AltText](/images/preview_small.gif) <br>


## Key Features

<table>
  <tr>
    <td><strong>Component Cloning</strong></td>
    <td> This feature enables designers to quickly generate multiple instances of a component with the included product information.</td>
  </tr>
  <tr>
    <td><strong>Data Integration</strong></td>
    <td>Integrates real-time product data to the cloned instances, ensuring that all design elements are synchronized with the most current data.</td>
  </tr>
</table>

## Schema 
Templates must be prepared with the below naming conventions to ensure that the plugin can correctly identify and populate data into the Figma designs<br>
<table>
  <tr>
    <td><span style="color:#8B8BF1;">Layer Naming</span></td>
    <td>Layers should be named according to their content to ensure the plugin correctly applies data:
      <ul>
        <li><strong>productName:</strong> Layer for the product's name.</li>
        <li><strong>price:</strong> Layer for displaying the product's price, including currency.</li>
        <li><strong>brand:</strong> Layer for the brand name.</li>
        <li><strong>description:</strong> Layer for a brief description of the product.</li>
        <li><strong>category1, category2, category3:</strong> Layers for product categories.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Image Layers</span></td>
    <td>Image layers must be named systematically to correlate with image data:
      <ul>
        <li><strong>imageURL1, imageURL2, imageURL3:</strong> Naming pattern for image layers where images will be dynamically inserted.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Color Customization</span></td>
    <td>Layers intended for dynamic coloring should follow a naming convention that includes a prefix:
      <ul>
        <li><strong>randomize1, randomize2, randomize3:</strong> Layers that will receive random colors from the specified palette.</li>
      </ul>
    </td>
  </tr>
  <tr>
</table>
<br>

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
#  Overview

<table>
  <tr>
<td><span style="color:#8B8BF1;">User Input</span></td>
<td>Users can enter any search term in the input field. The app processes the input to by sending the information to the <span style="color: grey;">server.js</span> </td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Data Handling</span></td>
    <td>The <span style="color: grey;">server.js</span>  processes this request by querying a GraphQL endpoint to retrieve product data, which it then saves as a set of JSON files</td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Visual Feedback</span></td>
    <td>Throughout the process, the plugin updates the user on its current status through color-coded indicators.</td>
  </tr>
  <tr>
  <td><span style="color:#8B8BF1;">Navigation</span></td>
<td>The app displays product images in the UI, allowing users to preview the product that will be inserted into the Figma design. Users can cycle through different products using navigation buttons</td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Design Generation</span></td>
    <td>When ready, the user is able to Generate Designs by selecting templates & clicking Generate button, the app then applies the fetched product data to the selected Figma components, generating design instances that are fully populated with the product details.</td>
  </tr>
</table>

## Schema For Design
Templates must be prepared with the above naming conventions to ensure that the plugin can correctly identify and populate data into the Figma designs<br>
<table>
  <tr>
    <td><span style="color:#8B8BF1;">Layer Naming</span></td>
    <td>Layers should be named according to their content to ensure the plugin correctly applies data:
      <ul>
        <li><strong>productName:</strong> Layer for the product's name.</li>
        <li><strong>price:</strong> Layer for displaying the product's price, including currency.</li>
        <li><strong>brand:</strong> Layer for the brand name.</li>
        <li><strong>description:</strong> Layer for a brief description of the product.</li>
        <li><strong>category1, category2, category3:</strong> Layers for product categories.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Image Layers</span></td>
    <td>Image layers must be named systematically to correlate with image data:
      <ul>
        <li><strong>imageURL1, imageURL2, imageURL3:</strong> Naming pattern for image layers where images will be dynamically inserted.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><span style="color:#8B8BF1;">Color Customization</span></td>
    <td>Layers intended for dynamic coloring should follow a naming convention that includes a prefix:
      <ul>
        <li><strong>randomize1, randomize2, randomize3:</strong> Layers that will receive random colors from the specified palette.</li>
      </ul>
    </td>
  </tr>
  <tr>
</table>
<br>
## Frontend (Figma Plugin UI)
The user interface is built using HTML, CSS, and Typescript(JavaScript.) It enables users to interact with the plugin, enter SKUs, view product images, and trigger the generation of design instances. The <span style="color:#8B8BF1;">ui.html </span> file serves as the user interface for the Gridline plugin. It is divided into several sections, each serving a specific purpose: <br><br>
![AltText](/images/structure.png)


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



## Functionality
<table>

 <tr>
  <td><strong> VTEX</strong></td>
  <td>
 The VTEX Database is the external data source that stores product information. The server queries this database using GraphQL to retrieve product details like images, prices, descriptions, and categories based on the SKU provided by the Figma Plugin. 

The data fetched from the VTEX Database is critical for accurately populating the design instances in Figma.
  </td>
</tr>
<tr>
  <td><strong>Figma Templates</strong></td>
  <td>
    Design Templates in Figma are pre-defined design elements that serve as the foundation for the generated instances. 

When a valid SKU is processed and product data is retrieved from the VTEX Database, the Figma Plugin uses this data to populate the templates with relevant information.

The updated templates are then used to create new design instances within Figma, streamlining the design process and ensuring consistency across assets.
  </td>
</tr>
<tr>
  <td><strong>Figma Plugin</strong></td>
  <td>
 The Figma Plugin is the user interface through which designers interact with the Gridline system. 

It allows users to input SKU numbers and automatically sends these SKUs to the server once a valid number is detected. 

The plugin doesn’t handle the fetching of product data directly; instead, it relies on the server to perform this task. The server returns a JSON file with the product data, which the plugin then uses to dynamically generate design instances in Figma.

The plugin also provides real-time feedback on the status of the data retrieval process and integrates with the Figma API to manage selected design templates and generate new instances based on the fetched data.
  </td>
</tr>
</table>

---
