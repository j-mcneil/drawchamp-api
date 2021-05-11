import { expect } from 'chai';
import { describe, it } from 'mocha';

import { ShortAlphaCodeGenerator } from './code-generator';

describe('ShortAlphaCodeGenerator', () => {
  describe('generateCode', () => {
    it('should return a 4 letter code', () => {
      const codeGenerator = new ShortAlphaCodeGenerator();
      const code = codeGenerator.generateCode();

      expect(code.length).to.be.equal(4);
    });
  });
});
