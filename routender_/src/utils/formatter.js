// src/utils/formatter.js
const path = require('path');

// Color codes for terminal output
const colors = {
  GET: '\x1b[32m',     // Green
  POST: '\x1b[33m',    // Yellow
  PUT: '\x1b[34m',     // Blue
  DELETE: '\x1b[31m',  // Red
  PATCH: '\x1b[35m',   // Magenta
  HEAD: '\x1b[36m',    // Cyan
  OPTIONS: '\x1b[90m', // Gray
  RESET: '\x1b[0m'     // Reset
};

function getMethodColor(method) {
  return colors[method.toUpperCase()] || '\x1b[37m'; // Default to white
}

function resetColor() {
  return colors.RESET;
}

function formatEndpoints(endpoints, projectRoot) {
  console.log('\n=== Detected Router Endpoints ===\n');
  
  // Group by file
  const endpointsByFile = endpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.file]) {
      acc[endpoint.file] = [];
    }
    acc[endpoint.file].push(endpoint);
    return acc;
  }, {});

  // Print grouped endpoints
  Object.keys(endpointsByFile).forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    console.log(`\n📄 ${relativePath}`);
    
    endpointsByFile[file].forEach(endpoint => {
      const methodColor = getMethodColor(endpoint.method);
      console.log(`  ${methodColor}${endpoint.method.padEnd(7)}${resetColor()} ${endpoint.path}`);
    });
  });
  
  console.log(`\nTotal: ${endpoints.length} endpoints detected\n`);
}

module.exports = {
  formatEndpoints,
  getMethodColor,
  resetColor
};