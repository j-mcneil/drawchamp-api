import Hapi from '@hapi/hapi';
import { injectable } from 'inversify';

import { Controller } from './controller.interface';

@injectable()
export class MetaController extends Controller {
  protected readonly name = 'metaController';
  protected readonly routes: Hapi.ServerRoute[] = [
    {
      method: 'GET',
      path: '/meta/health-check',
      options: {
        description: 'Health check endpoint for ECS',
      },
      handler: (/*request: Hapi.Request, h: Hapi.ResponseToolkit */) => {
        return { healthy: true };
      },
    },
  ];

  constructor() {
    super();
  }
}
