import 'reflect-metadata';
import * as Hapi from '@hapi/hapi';
import { expect } from 'chai';
import { before, beforeEach, describe, it } from 'mocha';
import { of } from 'rxjs';
import { StubbedInstance, stubInterface } from 'ts-sinon';

import { container, bindIoc } from '../../src/inversify.config';
import { IGameRepository, IPlayerRepository } from '../../src/ports';
import { Server } from '../../src/server';
import symbols from '../../src/symbols';

describe('integration: gameController routes', () => {
  let server: Hapi.Server;
  let gameRepositoryStub: StubbedInstance<IGameRepository>;
  let playerRepositoryStub: StubbedInstance<IPlayerRepository>;

  before(() => {
    bindIoc();
    gameRepositoryStub = stubInterface<IGameRepository>();
    container.rebind<IGameRepository>(symbols.ports.gameRepository).toConstantValue(gameRepositoryStub);
    playerRepositoryStub = stubInterface<IPlayerRepository>();
    container.rebind<IPlayerRepository>(symbols.ports.playerRepository).toConstantValue(playerRepositoryStub);
  });

  beforeEach(async () => {
    const serverWrapper = container.get<Server>(symbols.server);
    server = await serverWrapper.init(true);
  });

  afterEach(async () => {
    server.stop();
  });

  describe('POST /game', () => {
    it('should return a 409 if it cannot create a unique game', async () => {
      gameRepositoryStub.get.returns(of({ code: 'oops' }));

      const res = await server.inject({
        method: 'post',
        url: '/game',
      });

      expect(res.statusCode).to.equal(409);
    });

    it('should return a 200 if it created a game', async () => {
      gameRepositoryStub.get.returns(of(undefined));
      gameRepositoryStub.create.returns(of({ code: 'yay' }));

      const res = await server.inject({
        method: 'post',
        url: '/game',
      });

      expect(res.statusCode).to.equal(200);
    });
  });

  describe('POST /game/{code}/player/{name}', () => {
    it('should return a 409 if a player with the name already exists for the game', async () => {
      gameRepositoryStub.get.returns(of({ code: 'yay' }));
      playerRepositoryStub.get.returns(of({ name: 'charlie' }));

      const res = await server.inject({
        method: 'post',
        url: '/game/yay/player/charlie',
      });

      expect(res.statusCode).to.equal(409);
    });

    it('should return a 404 if the game does not exist', async () => {
      gameRepositoryStub.get.returns(of(undefined));
      playerRepositoryStub.get.returns(of(undefined));

      const res = await server.inject({
        method: 'post',
        url: '/game/yay/player/charlie',
      });

      expect(res.statusCode).to.equal(404);
    });

    it('should return a 200 if it created a player', async () => {
      gameRepositoryStub.get.returns(of({ code: 'yay' }));
      playerRepositoryStub.get.returns(of(undefined));
      playerRepositoryStub.create.returns(of({ name: 'charlie' }));

      const res = await server.inject({
        method: 'post',
        url: '/game/yay/player/charlie',
      });

      expect(res.statusCode).to.equal(200);
    });
  });
});
