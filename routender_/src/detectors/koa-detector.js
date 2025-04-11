// src/detectors/koa-detector.js
const acorn = require('acorn');
const walk = require('acorn-walk');

function detectKoaEndpoints(content, filePath) {
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
          
          // Check for router.METHOD patterns
          if (['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(prop?.name) && 
              (obj.name === 'router') && 
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

module.exports = detectKoaEndpoints;