// src/detectors/fastify-detector.js
const acorn = require('acorn');
const walk = require('acorn-walk');

function detectFastifyEndpoints(content, filePath) {
  const endpoints = [];
  
  try {
    const ast = acorn.parse(content, {
      ecmaVersion: 2020,
      sourceType: 'module',
      locations: true
    });

    walk.simple(ast, {
      CallExpression: (node) => {
        if (node.callee.type === 'MemberExpression') {
          const obj = node.callee.object;
          const prop = node.callee.property;
          
          // Check for fastify.route() or app.route() patterns
          if (prop && prop.name === 'route' && 
              (obj.name === 'fastify' || obj.name === 'app')) {
            
            if (node.arguments.length === 1 && 
                node.arguments[0].type === 'ObjectExpression') {
              
              // Extract route config from object
              let method = null;
              let path = null;
              
              node.arguments[0].properties.forEach(prop => {
                if (prop.key.name === 'method' && prop.value.type === 'Literal') {
                  method = prop.value.value;
                } else if (prop.key.name === 'url' && prop.value.type === 'Literal') {
                  path = prop.value.value;
                }
              });
              
              if (method && path) {
                endpoints.push({
                  method: method.toUpperCase(),
                  path,
                  line: node.loc.start.line,
                  file: filePath
                });
              }
            }
          }
          
          // Check for fastify.METHOD patterns
          if (['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(prop?.name) && 
              (obj.name === 'fastify' || obj.name === 'app') && 
              node.arguments.length >= 1) {
            
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
    });
  } catch (error) {
    // Return empty array if parsing fails
    return [];
  }
  
  return endpoints;
}

module.exports = detectFastifyEndpoints;