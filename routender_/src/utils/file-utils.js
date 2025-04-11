// src/utils/file-utils.js
const glob = require('glob');
const path = require('path');

function findFiles(options) {
  const { patterns, ignore, projectRoot } = options;
  
  let files = [];
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern, {
      cwd: projectRoot,
      ignore,
      absolute: true
    });
    files = [...files, ...matches];
  });
  
  return files;
}

module.exports = {
  findFiles
};