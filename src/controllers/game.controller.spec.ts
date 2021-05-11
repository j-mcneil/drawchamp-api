import Hapi from '@hapi/hapi';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { of } from 'rxjs';
import { fake, replace } from 'sinon';
import { StubbedInstance, stubInterface } from 'ts-sinon';

import { IGameService } from '../domain/game-service';
import { GameController } from './game.controller';

describe('GameController', () => {
  let gameService: StubbedInstance<IGameService>;
  let gameController: GameController;

  beforeEach(() => {
    gameService = stubInterface<IGameService>();

    gameController = new GameController(gameService);
  });

  describe('routes', () => {
    let routes: Hapi.ServerRoute[];
    let request: StubbedInstance<Hapi.Request>;
    let responseToolkit: StubbedInstance<Hapi.ResponseToolkit>;

    beforeEach(() => {
      responseToolkit = stubInterface<Hapi.ResponseToolkit>();
      request = stubInterface<Hapi.Request>();

      replace(
        gameController,
        'getPlugin',
        fake(function (this: GameController) {
          routes = this.routes;
        })
      );
      gameController.getPlugin();
    });

    describe('/game', () => {
      it('should return the game from gameService', async () => {
        const route = routes.find((route) => route.path === '/game')!;
        const handler = route.handler! as Hapi.Lifecycle.Method;
        const game = { code: 'yay' };
        gameService.createGame.returns(of(game));

        const response = await handler(request, responseToolkit);

        expect(response).to.equal(game);
      });
    });

    describe('/game/{code}/player/{name}', () => {
      it('should return the player from gameService', async () => {
        const route = routes.find((route) => route.path === '/game/{code}/player/{name}')!;
        const handler = route.handler! as Hapi.Lifecycle.Method;
        const player = { name: 'Charles' };
        gameService.createPlayer.returns(of(player));

        const response = await handler(request, responseToolkit);

        expect(response).to.equal(player);
      });
    });
  });
});
