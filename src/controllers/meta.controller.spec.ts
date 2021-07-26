import Hapi from '@hapi/hapi';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fake, replace } from 'sinon';
import { StubbedInstance, stubInterface } from 'ts-sinon';

import { MetaController } from './meta.controller';

describe('MetaController', () => {
  let metaController: MetaController;

  beforeEach(() => {
    metaController = new MetaController();
  });

  describe('routes', () => {
    let routes: Hapi.ServerRoute[];
    let request: StubbedInstance<Hapi.Request>;
    let responseToolkit: StubbedInstance<Hapi.ResponseToolkit>;

    beforeEach(() => {
      responseToolkit = stubInterface<Hapi.ResponseToolkit>();
      request = stubInterface<Hapi.Request>();

      replace(
        metaController,
        'getPlugin',
        fake(function (this: MetaController) {
          routes = this.routes;
        })
      );
      metaController.getPlugin();
    });

    describe('/meta/health-check', () => {
      it('should return the game from gameService', async () => {
        const route = routes.find((route) => route.path === '/meta/health-check')!;
        const handler = route.handler! as Hapi.Lifecycle.Method;

        const response = await handler(request, responseToolkit);

        expect(response).to.deep.equal({ healthy: true });
      });
    });
  });
});
