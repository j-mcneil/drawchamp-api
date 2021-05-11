'use strict';

module.exports = {
  recursive: true,
  require: ['ts-node/register', 'source-map-support/register'],
  spec: ['test/**/*.spec.ts', 'src/**/*.spec.ts'],
};
