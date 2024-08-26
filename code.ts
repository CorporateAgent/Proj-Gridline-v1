// Show the plugin's UI with specified width and height
figma.showUI(__html__, { width: 320, height: 400 });

// Send the names of selected instances to the UI when the plugin opens
updateSelectedInstancesInUI();

// Listen for selection changes and update the UI
figma.on('selectionchange', () => {
  updateSelectedInstancesInUI();
});

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generateInstances') {
    const { productData: jsonData } = msg;

    // Parse the product data from the JSON received from the UI
    const productData = parseProductData(jsonData);

    // Ensure at least one instance is selected
    const selectedInstances = getSelectedInstances();
    if (selectedInstances.length === 0) {
      figma.notify('No instances selected! Please select one or more instances.');
      return;
    }

    // Process each instance
    const viewportCenter = figma.viewport.center;
    let currentX = viewportCenter.x;

    for (const template of selectedInstances) {
      await processInstance(template, productData, currentX, viewportCenter.y);
      currentX += template.width + 100; // Add spacing between instances
    }

    figma.notify('Instances created and updated successfully!');
  }
};

// Get all selected instances on the current page
function getSelectedInstances(): InstanceNode[] {
  return figma.currentPage.selection.filter(node => node.type === 'INSTANCE') as InstanceNode[];
}

// Send the names of selected instances to the UI
function updateSelectedInstancesInUI() {
  const selectedInstanceNames = getSelectedInstances().map(instance => instance.name);
  figma.ui.postMessage({ type: 'updateSelection', selectedInstanceNames });
}

// Function to parse product data from JSON
function parseProductData(json: any): ProductData {
  return {
    productName: json.productName,
    price: json.priceRange.sellingPrice.lowPrice,
    imageUrls: json.items[0].images.map((img: any) => img.imageUrl),
    brand: json.brand,
    description: json.description,
    categories: json.categoryTree.map((cat: any) => cat.href.split('/').pop() || '')
  };
}

// Main function to process each selected instance
async function processInstance(instance: InstanceNode, productData: ProductData, x: number, y: number) {
  const detachedInstance = cloneAndPositionInstance(instance, x, y);
  await loadFonts(detachedInstance);
  updateTextLayers(detachedInstance, productData);
  randomizeColors(detachedInstance);
  updateImageLayers(detachedInstance, productData.imageUrls);
}

// Clone the template, detach it, and set its position
function cloneAndPositionInstance(template: InstanceNode, x: number, y: number): FrameNode {
  const clonedInstance = template.clone();
  clonedInstance.x = x;
  clonedInstance.y = y;
  return clonedInstance.detachInstance() as FrameNode;
}

// Load necessary fonts for text layers
async function loadFonts(instance: FrameNode) {
  const textLayers = instance.findAll(node => node.type === 'TEXT') as TextNode[];
  const fontPromises = textLayers.map(textLayer => figma.loadFontAsync(textLayer.fontName as FontName));
  await Promise.all(fontPromises);
}

// Update text layers with product data
function updateTextLayers(instance: FrameNode, productData: ProductData) {
  const textLayers = instance.findAll(node => node.type === 'TEXT') as TextNode[];
  textLayers.forEach(textLayer => {
    switch (textLayer.name) {
      case 'productName':
        textLayer.characters = productData.productName;
        break;
      case 'price':
        textLayer.characters = `R${productData.price}`;
        break;
      case 'brand':
        textLayer.characters = productData.brand;
        break;
      case 'description':
        textLayer.characters = productData.description;
        break;
      case 'category1':
        textLayer.characters = productData.categories[0] || '';
        break;
      case 'category2':
        textLayer.characters = productData.categories[1] || '';
        break;
      case 'category3':
        textLayer.characters = productData.categories[2] || '';
        break;
    }
  });
}

// Randomize the colors for elements titled randomize1, randomize2, randomize3
function randomizeColors(instance: FrameNode) {
  const randomElements = ['randomize1', 'randomize2', 'randomize3'];
  randomElements.forEach(elementName => {
    const randomElement = instance.findOne(node => node.name === elementName) as GeometryMixin & SceneNode;
    if (randomElement) {
      const randomColor = getRandomColor();
      const fill: SolidPaint = {
        type: 'SOLID',
        color: hexToRgb(randomColor),
        opacity: 1,
        visible: true,
        blendMode: 'NORMAL',
        boundVariables: {},
      };
      randomElement.fills = [fill];
    }
  });
}

// Update the image layers with the product's image URLs
function updateImageLayers(instance: FrameNode, imageUrls: string[]) {
  imageUrls.forEach((url, index) => {
    const imageLayer = instance.findOne(node => node.name === `imageURL${index + 1}` && (node.type === 'RECTANGLE' || node.type === 'ELLIPSE')) as GeometryMixin & SceneNode;
    if (imageLayer) {
      figma.createImageAsync(url).then(image => {
        imageLayer.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
      }).catch(error => {
        console.error(`Error loading image ${index + 1}:`, error);
        figma.notify(`Failed to load image ${index + 1}.`);
      });
    }
  });
}

// Convert HEX color to RGB for Figma fills
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
}

// Get a random color from the randomColors array
function getRandomColor(): string {
  return randomColors[Math.floor(Math.random() * randomColors.length)];
}

// Define the structure of the product data
interface ProductData {
  productName: string;
  price: number;
  imageUrls: string[];
  brand: string;
  description: string;
  categories: string[];
}

// Suggested colors for randomization (you can add more)
const randomColors = [
  '#FF5733', // Red-Orange
  '#8B8BF1', // Purple
  '#3357FF', // Bright Blue
  '#FF33A1',  // Hot Pink
  '#AA5B21',
  '#66A4B8',
  '#285924',
  '#66A4B8'
];