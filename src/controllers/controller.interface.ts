import Hapi from '@hapi/hapi';
import { injectable } from 'inversify';

@injectable()
export abstract class Controller {
  protected abstract readonly name: string;
  protected abstract readonly routes: Hapi.ServerRoute[];

  getPlugin(): Hapi.Plugin<undefined> {
    return {
      name: this.name,
      register: (server) => {
        server.route(this.routes);
      },
    };
  }
}
