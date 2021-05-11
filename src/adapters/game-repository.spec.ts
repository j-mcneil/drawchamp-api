import { expect } from 'chai';
import { describe, it } from 'mocha';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { stub } from 'sinon';

import { GameRepository } from './game-repository';

describe('GameRepository', () => {
  let gameRepository: GameRepository;
  let scheduler: TestScheduler;

  beforeEach(() => {
    gameRepository = new GameRepository();
    scheduler = new TestScheduler((a, b) => {
      expect(a).deep.equals(b);
    });
  });

  describe('create', () => {
    it('should return the game from the orm', () => {
      const code = 'test';
      const rawGame = { code };

      stub((gameRepository as any).model, 'create').returns(
        of({ ...rawGame, entity: 'game_test', typeTarget: 'game' })
      );
      scheduler.run(({ expectObservable }) => {
        const createGame$ = gameRepository.create(code);
        expectObservable(createGame$).toBe('(c|)', { c: rawGame });
      });
    });
  });

  describe('get', () => {
    it('should return the game from the orm', () => {
      const code = 'test';
      const rawGame = { code };

      stub((gameRepository as any).model, 'get').returns(of({ ...rawGame, entity: 'game_test', typeTarget: 'game' }));
      scheduler.run(({ expectObservable }) => {
        const getGame$ = gameRepository.get(code);
        expectObservable(getGame$).toBe('(c|)', { c: rawGame });
      });
    });

    it('should return undefined if the orm does', () => {
      const code = 'test';

      stub((gameRepository as any).model, 'get').returns(of(undefined));
      scheduler.run(({ expectObservable }) => {
        const getGame$ = gameRepository.get(code);
        expectObservable(getGame$).toBe('(c|)', { c: undefined });
      });
    });
  });
});
