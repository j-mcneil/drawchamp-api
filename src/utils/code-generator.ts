import { injectable } from 'inversify';

export interface ICodeGenerator {
  generateCode(): string;
}

@injectable()
export class ShortAlphaCodeGenerator implements ICodeGenerator {
  generateCode() {
    return Array.from(Array(4), () => Math.floor(Math.random() * 26 + 10).toString(36)).join('');
  }
}
