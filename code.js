"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Show the plugin's UI with specified width and height.
figma.showUI(__html__, { width: 320, height: 400 });
// Send the names of selected instances to the UI when the plugin opens
updateSelectedInstancesInUI();
// Listen for selection changes and update the UI
figma.on('selectionchange', () => {
    updateSelectedInstancesInUI();
});
// Handle messages from the UI
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
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
            yield processInstance(template, productData, currentX, viewportCenter.y);
            currentX += template.width + 100; // Add spacing between instances
        }
        figma.notify('Instances created and updated successfully!');
    }
});
// Get all selected instances on the current page
function getSelectedInstances() {
    return figma.currentPage.selection.filter(node => node.type === 'INSTANCE');
}
// Send the names of selected instances to the UI
function updateSelectedInstancesInUI() {
    const selectedInstanceNames = getSelectedInstances().map(instance => instance.name);
    figma.ui.postMessage({ type: 'updateSelection', selectedInstanceNames });
}
// Function to parse product data from JSON
function parseProductData(json) {
    return {
        productName: json.productName,
        price: json.priceRange.sellingPrice.lowPrice,
        imageUrls: json.items[0].images.map((img) => img.imageUrl),
        brand: json.brand,
        description: json.description,
        categories: json.categoryTree.map((cat) => cat.href.split('/').pop() || '')
    };
}
// Main function to process each selected instance
function processInstance(instance, productData, x, y) {
    return __awaiter(this, void 0, void 0, function* () {
        const detachedInstance = cloneAndPositionInstance(instance, x, y);
        yield loadFonts(detachedInstance);
        updateTextLayers(detachedInstance, productData);
        randomizeColors(detachedInstance);
        updateImageLayers(detachedInstance, productData.imageUrls);
    });
}
// Clone the template, detach it, and set its position
function cloneAndPositionInstance(template, x, y) {
    const clonedInstance = template.clone();
    clonedInstance.x = x;
    clonedInstance.y = y;
    return clonedInstance.detachInstance();
}
// Load necessary fonts for text layers
function loadFonts(instance) {
    return __awaiter(this, void 0, void 0, function* () {
        const textLayers = instance.findAll(node => node.type === 'TEXT');
        const fontPromises = textLayers.map(textLayer => figma.loadFontAsync(textLayer.fontName));
        yield Promise.all(fontPromises);
    });
}
// Update text layers with product data
function updateTextLayers(instance, productData) {
    const textLayers = instance.findAll(node => node.type === 'TEXT');
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
function randomizeColors(instance) {
    const randomElements = ['randomize1', 'randomize2', 'randomize3'];
    randomElements.forEach(elementName => {
        const randomElement = instance.findOne(node => node.name === elementName);
        if (randomElement) {
            const randomColor = getRandomColor();
            const fill = {
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
function updateImageLayers(instance, imageUrls) {
    imageUrls.forEach((url, index) => {
        const imageLayer = instance.findOne(node => node.name === `imageURL${index + 1}` && (node.type === 'RECTANGLE' || node.type === 'ELLIPSE'));
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
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: ((bigint >> 16) & 255) / 255,
        g: ((bigint >> 8) & 255) / 255,
        b: (bigint & 255) / 255,
    };
}
// Get a random color from the randomColors array
function getRandomColor() {
    return randomColors[Math.floor(Math.random() * randomColors.length)];
}
// Suggested colors for randomization (you can add more)
const randomColors = [
    '#FF5733', // Red-Orange
    '#8B8BF1', // Purple
    '#3357FF', // Bright Blue
    '#FF33A1', // Hot Pink
    '#AA5B21',
    '#66A4B8',
    '#285924',
    '#66A4B8'
];
