import Hapi from '@hapi/hapi';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fake, stub, replace, SinonSpy } from 'sinon';
import { StubbedInstance, stubConstructor, stubInterface } from 'ts-sinon';

import { GameController, MetaController } from './controllers';
import { IGameService } from './domain/game-service';
import { Server } from './server';

describe('Server', () => {
  let server: Server;
  let gameController: GameController;
  let metaController: MetaController;
  let internalServer: StubbedInstance<Hapi.Server>;

  beforeEach(() => {
    gameController = new GameController(stubInterface<IGameService>());
    metaController = new MetaController();
    server = new Server(gameController, metaController);
    internalServer = stubConstructor(Hapi.Server);
    stub(server as any, 'compose').returns(internalServer);
  });

  describe('init', () => {
    it('should compose and initialize the server', async () => {
      await server.init();
      expect(internalServer.initialize.called).to.be.true;
    });
  });

  describe('start', () => {
    it('should call server start', async () => {
      await server.init();
      await server.start();
      expect(internalServer.start.called).to.be.true;
    });

    it('should kill the process on error', async () => {
      const consoleErrorFake = fake();
      replace(console, 'error', consoleErrorFake);
      const processExitFake = fake() as SinonSpy<any[], never>;
      replace(process, 'exit', processExitFake);

      internalServer.start.throws('it blew up');

      await server.init();
      await server.start();

      expect(consoleErrorFake.called).to.be.true;
      expect(processExitFake.called).to.be.true;
    });
  });
});
