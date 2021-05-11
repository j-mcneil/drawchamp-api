import { expect } from 'chai';
import { describe, it } from 'mocha';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { StubbedInstance, stubInterface } from 'ts-sinon';

import { IGameRepository, IPlayerRepository } from '../ports';
import { ICodeGenerator } from '../utils';
import { GameService } from './game-service';

describe('GameService', () => {
  let gameService: GameService;
  let gameRepositoryStub: StubbedInstance<IGameRepository>;
  let playerRepositoryStub: StubbedInstance<IPlayerRepository>;
  let codeGeneratorStub: StubbedInstance<ICodeGenerator>;
  let scheduler: TestScheduler;

  beforeEach(() => {
    gameRepositoryStub = stubInterface<IGameRepository>();
    playerRepositoryStub = stubInterface<IPlayerRepository>();
    codeGeneratorStub = stubInterface<ICodeGenerator>();

    gameService = new GameService(gameRepositoryStub, playerRepositoryStub, codeGeneratorStub);

    scheduler = new TestScheduler((a, b) => {
      expect(a).deep.equals(b);
    });
  });

  describe('createGame', () => {
    it('should return a game if the generated code does not exist', () => {
      const code = 'test';
      const game = { code };
      codeGeneratorStub.generateCode.returns(code);
      gameRepositoryStub.get.withArgs(code).returns(of(undefined));
      gameRepositoryStub.create.withArgs(code).returns(of(game));

      scheduler.run(({ expectObservable }) => {
        const createGame$ = gameService.createGame();

        expectObservable(createGame$).toBe('(c|)', { c: game });
      });

      expect(codeGeneratorStub.generateCode.callCount).to.equal(1);
    });

    it('should throw an error if it cannot generate a unique code', () => {
      const code = 'oops';
      const game = { code };
      codeGeneratorStub.generateCode.returns(code);
      gameRepositoryStub.get.withArgs(code).returns(of(game));

      scheduler.run(({ expectObservable }) => {
        const createGame$ = gameService.createGame();

        expectObservable(createGame$).toBe('#', undefined, {
          code: 409,
          message: 'Cannot find an available code to create a game',
        });
      });

      expect(codeGeneratorStub.generateCode.callCount).to.equal(10);
    });

    it('should fail creating the game 3 times and then succeed on the third retry', () => {
      const oldCode = 'oops';
      const newCode = 'test';
      const oldGame = { code: oldCode };
      const newGame = { code: newCode };
      codeGeneratorStub.generateCode.onCall(0).returns(oldCode);
      codeGeneratorStub.generateCode.onCall(1).returns(oldCode);
      codeGeneratorStub.generateCode.onCall(2).returns(oldCode);
      codeGeneratorStub.generateCode.onCall(3).returns(newCode);
      gameRepositoryStub.get.withArgs(oldCode).returns(of(oldGame));
      gameRepositoryStub.get.withArgs(newCode).returns(of(undefined));
      gameRepositoryStub.create.withArgs(newCode).returns(of(newGame));

      scheduler.run(({ expectObservable }) => {
        const createGame$ = gameService.createGame();

        expectObservable(createGame$).toBe('(c|)', { c: newGame });
      });

      expect(codeGeneratorStub.generateCode.callCount).to.equal(4);
    });
  });
});
