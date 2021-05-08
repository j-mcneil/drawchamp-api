import Glue from '@hapi/glue';
import Hapi from '@hapi/hapi';
import { inject, injectable } from 'inversify';

import { GameController } from './controllers';
import symbols from './symbols';
@injectable()
export class Server {
  private readonly manifest: Glue.Manifest = {
    server: {
      port: 3000,
      host: 'localhost',
      debug: (process.env.NODE_ENV || 'development') === 'development' ? { request: ['error'] } : undefined,
    },
    register: {
      plugins: [
        {
          plugin: this.gameController.getPlugin(),
        },
      ],
    },
  };

  private readonly options = {
    relativeTo: __dirname,
  };

  private server!: Hapi.Server;

  constructor(@inject(symbols.controllers.gameController) private gameController: GameController) {}

  async init() {
    this.server = await Glue.compose(this.manifest, this.options);
    await this.server.initialize();
    return this.server;
  }

  async start() {
    try {
      await this.server.start();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
