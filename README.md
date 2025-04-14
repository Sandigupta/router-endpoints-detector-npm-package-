<p align="center">
  <img src="https://github.com/user-attachments/assets/7d5bb153-a0e5-40e1-ae0f-fd11d7e0ac2a" width="500" />
</p>


# routender

[![build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Sandigupta/router-endpoints-detector-npm-package-)
[![npm](https://img.shields.io/badge/npm-router--endpoints--detector-red.svg)](https://www.npmjs.com/package/routender)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)


A powerful, zero-config tool to detect and visualize all API endpoints in your Node.js applications. `routender` scans your project files and identifies all API routes across multiple frameworks (Express, Koa, Fastify, etc.) with a single command.

Stop manually tracking your endpoints – let the code tell you what's there. Perfect for large codebases, team onboarding, documentation, and security audits.

## Installation

```bash
npm install routender --save-dev
# or
yarn add routender --dev
```

## Usage

Simply run the command in your project directory:

```bash
npx routender
```

## Features

- **Zero-config detection** - Just run it and see all endpoints
- **Framework agnostic** - Works with Express, Fastify, Koa, and more
- **AST-based analysis** - Uses code parsing rather than regex for better accuracy
- **No runtime dependency** - Works without running your server
- **Customizable** - Filter by file patterns, paths, and more
- **Structured output** - Get endpoints as structured data for further processing

## Quick Start

### Option 1: Create a dedicated script

Create a script file (e.g., `detect-routes.js`):

```javascript
const RouterEndpointsDetector = require('routender');

// Create detector with default options
const detector = new RouterEndpointsDetector();

// Print all detected endpoints
detector.printEndpoints();
```

Run it:

```bash
node detect-routes.js
```

### Option 2: Integrate into your project

Or you can write the above code lines in your project's `index.js` file and run your project as usual:

```javascript
const express = require('express');
const app = express();

const RouterEndpointsDetector = require('routender');
const detector = new RouterEndpointsDetector();
// Print all detected endpoints
detector.printEndpoints();

```

This allows you to see all your endpoints during application startup without creating a separate script.


## API Documentation

### `new RouterEndpointsDetector(options)`

Create a new detector instance.

**Options:**

```javascript
{
  projectRoot: String,  // Root directory to scan (default: process.cwd())
  patterns: Array,      // Glob patterns for files to include (default: ['**/*.js', '**/*.ts', '**/*.mjs'])
  ignore: Array         // Glob patterns to ignore (default: ['**/node_modules/**', '**/dist/**', '**/build/**'])
}
```

### `detector.scan()`

Scans files and returns an array of detected endpoints.

**Returns:** Array of endpoint objects with the structure:

```javascript
{
  file: String,     // Absolute path to the file
  method: String,   // HTTP method (GET, POST, PUT, etc.)
  path: String,     // Route path
  line: Number      // Line number in the file
}
```

### `detector.printEndpoints()`

Scans files and prints a formatted list of endpoints to the console.

## Advanced Usage Examples

### Add to Your npm Scripts

```json
{
  "scripts": {
    "routes": "node detect-routes.js"
  }
}
```

Then run:

```bash
npm run routes
```

### Custom Configuration

```javascript
const RouterEndpointsDetector = require('routender');

const detector = new RouterEndpointsDetector({
  // Analyze a specific subdirectory
  projectRoot: './src',
  
  // Custom file patterns
  patterns: ['**/*.js', '**/*.ts', '**/*.jsx'],
  
  // Ignore test files
  ignore: ['**/node_modules/**', '**/*.test.js', '**/tests/**']
});

detector.printEndpoints();
```

## Design principles
Under the hood, `routernder` uses:

1. **AST parsing** with Acorn to analyze your JavaScript code structure
2. **Pattern recognition** to detect common router patterns
3. **Static analysis** to identify route registrations without executing code

## Supported Frameworks & Patterns

Currently detects:

- Express.js routes (`app.get()`, `router.post()`, etc.)
- Express router chains (`router.route('/path').get().post()`)

## License

MIT © Sandeep Gupta

---

**Keywords**: express-routes, api-endpoints, route-discovery, endpoint-detection, api-docs, nodejs-router, express-router, fastify-routes, koa-router, api-documentation, rest-api-tools, nodejs-tools, express-tools, route-visualization, router-analysis
