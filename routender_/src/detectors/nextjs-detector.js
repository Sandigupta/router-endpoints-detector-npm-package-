// src/detectors/nextjs-detector.js
const acorn = require('acorn');
const walk = require('acorn-walk');

function detectNextJsEndpoints(content, filePath) {
  const endpoints = [];
  
  // Next.js API routes have a specific file structure, detect based on filename
  if (filePath.includes('/pages/api/') && (filePath.endsWith('.js') || filePath.endsWith('.ts'))) {
    try {
      const ast = acorn.parse(content, {
        ecmaVersion: 2020,
        sourceType: 'module',
        locations: true
      });
      
      // Extract route path from file path
      const apiDir = '/pages/api/';
      const apiDirIndex = filePath.indexOf(apiDir);
      if (apiDirIndex !== -1) {
        let routePath = filePath.slice(apiDirIndex + apiDir.length);
        
        // Remove extension
        routePath = routePath.replace(/\.(js|ts)$/, '');
        
        // Handle dynamic routes [param]
        routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1');
        
        // Handle index routes
        if (routePath.endsWith('/index')) {
          routePath = routePath.slice(0, -6);
        }
        
        // Add leading slash
        if (!routePath.startsWith('/')) {
          routePath = '/' + routePath;
        }
        
        // Check for handler methods
        const methods = [];
        walk.simple(ast, {
          ExportNamedDeclaration: (node) => {
            if (node.declaration && node.declaration.type === 'FunctionDeclaration') {
              const funcName = node.declaration.id?.name?.toLowerCase();
              if (['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(funcName)) {
                methods.push(funcName.toUpperCase());
              }
            }
          }
        });
        
        if (methods.length === 0) {
          // Default to handling all methods if no specific handlers
          endpoints.push({
            method: 'ALL',
            path: routePath,
            line: 1,
            file: filePath
          });
        } else {
          methods.forEach(method => {
            endpoints.push({
              method,
              path: routePath,
              line: 1,
              file: filePath
            });
          });
        }
      }
    } catch (error) {
      // Return empty array if parsing fails
      return [];
    }
  }
  
  return endpoints;
}

module.exports = detectNextJsEndpoints;