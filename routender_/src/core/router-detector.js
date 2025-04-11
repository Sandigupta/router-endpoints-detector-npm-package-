// src/core/router-detector.js
const { findFiles } = require('../utils/file-utils');
const { formatEndpoints } = require('../utils/formatter');
const detectors = require('../detectors');
const fs = require('fs');

class RouterEndpointsDetector {
  constructor(options = {}) {
    this.options = {
      projectRoot: process.cwd(),
      patterns: ['**/*.js', '**/*.ts', '**/*.mjs'],
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
      ...options
    };
    this.endpoints = [];
  }

  scan() {
    const files = findFiles(this.options);
    
    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        this._parseFile(content, file);
      } catch (err) {
        console.warn(`Error processing file ${file}:`, err.message);
      }
    });

    return this.endpoints;
  }

  printEndpoints() {
    if (this.endpoints.length === 0) {
      this.scan();
    }

    formatEndpoints(this.endpoints, this.options.projectRoot);
    return this.endpoints;
  }

  _parseFile(content, filePath) {
    try {
      // Process with each detector
      detectors.forEach(detector => {
        try {
          const foundEndpoints = detector(content, filePath, this.options);
          if (foundEndpoints && foundEndpoints.length > 0) {
            this.endpoints = [...this.endpoints, ...foundEndpoints];
          }
        } catch (err) {
          // Skip if a particular detector fails
        }
      });
    } catch (error) {
      // Skip files that can't be parsed
      return;
    }
  }
}

module.exports = RouterEndpointsDetector;