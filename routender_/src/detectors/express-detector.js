// src/detectors/express-detector.js
const acorn = require('acorn');
const walk = require('acorn-walk');

function detectExpressEndpoints(content, filePath) {
  const endpoints = [];
  
  try {
    const ast = acorn.parse(content, {
      ecmaVersion: 2020,
      sourceType: 'module',
      locations: true
    });

    // Find Express app.METHOD endpoints
    walk.simple(ast, {
      CallExpression: (node) => {
        if (node.callee.type === 'MemberExpression') {
          const obj = node.callee.object;
          const prop = node.callee.property;
          
          // Check for app.METHOD or router.METHOD patterns
          if (prop && ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(prop.name)) {
            if ((obj.name === 'app' || obj.name === 'router' || 
                (obj.type === 'MemberExpression' && obj.property && obj.property.name === 'app')) && 
                node.arguments.length >= 1) {
              
              // Extract path from first argument
              const pathArg = node.arguments[0];
              if (pathArg.type === 'Literal') {
                endpoints.push({
                  method: prop.name.toUpperCase(),
                  path: pathArg.value,
                  line: node.loc.start.line,
                  file: filePath
                });
              }
            }
          }
        }
      }
    });

    // Find Express Router instances
    walk.simple(ast, {
      VariableDeclarator: (node) => {
        if (node.init && node.init.type === 'CallExpression' && 
            node.init.callee.type === 'MemberExpression' && 
            node.init.callee.property && node.init.callee.property.name === 'Router') {
          // Found a router declaration, now find methods on it
          const routerName = node.id.name;
          
          // Find methods on this router
          walk.simple(ast, {
            CallExpression: (methodNode) => {
              if (methodNode.callee.type === 'MemberExpression' && 
                  methodNode.callee.object.type === 'Identifier' && 
                  methodNode.callee.object.name === routerName) {
                
                const methodName = methodNode.callee.property.name;
                if (['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(methodName)) {
                  if (methodNode.arguments.length >= 1 && methodNode.arguments[0].type === 'Literal') {
                    endpoints.push({
                      method: methodName.toUpperCase(),
                      path: methodNode.arguments[0].value,
                      line: methodNode.loc.start.line,
                      file: filePath
                    });
                  }
                }
              }
            }
          });
        }
      }
    });
  } catch (error) {
    // Return empty array if parsing fails
    return [];
  }

  return endpoints;
}

module.exports = detectExpressEndpoints;