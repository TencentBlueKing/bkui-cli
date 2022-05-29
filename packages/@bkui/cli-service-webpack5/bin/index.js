#!/usr/bin/env node

const fs = require('fs');
const path = require('path');


const entrypoint = () => {
  const resolvedJsDir = path.resolve(`${__dirname}/../dist/index.js`);
  const resolvedTsDir = path.resolve(`${__dirname}/../src/index.ts`);
  if (path.basename(process.cwd()) === 'webpack5-cli-service' || !fs.existsSync(resolvedJsDir)) {
    const tsProjectPath = path.resolve(__dirname, '../tsconfig.json');
    require('ts-node').register({
      project: tsProjectPath,
      transpileOnly: true,
    });
    return resolvedTsDir;
  }
  return resolvedJsDir;
};

require(entrypoint()).run();
