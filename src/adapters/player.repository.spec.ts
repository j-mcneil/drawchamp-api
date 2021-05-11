import { expect } from 'chai';
import { describe, it } from 'mocha';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { stub } from 'sinon';

import { PlayerRepository } from './player-repository';

describe('PlayerRepository', () => {
  let playerRepository: PlayerRepository;
  let scheduler: TestScheduler;

  beforeEach(() => {
    playerRepository = new PlayerRepository();
    scheduler = new TestScheduler((a, b) => {
      expect(a).deep.equals(b);
    });
  });

  describe('create', () => {
    it('should return the player from the orm', () => {
      const name = 'Charles';
      const rawPlayer = { name };

      stub((playerRepository as any).model, 'create').returns(
        of({ ...rawPlayer, entity: 'game_test', typeTarget: 'game' })
      );
      scheduler.run(({ expectObservable }) => {
        const createPlayer$ = playerRepository.create(name, 'test');
        expectObservable(createPlayer$).toBe('(c|)', { c: rawPlayer });
      });
    });
  });

  describe('get', () => {
    it('should return the player from the orm', () => {
      const name = 'Charles';
      const rawPlayer = { name };

      stub((playerRepository as any).model, 'get').returns(
        of({ ...rawPlayer, entity: 'game_test', typeTarget: 'game' })
      );
      scheduler.run(({ expectObservable }) => {
        const getPlayer$ = playerRepository.get(name, 'test');
        expectObservable(getPlayer$).toBe('(c|)', { c: rawPlayer });
      });
    });

    it('should return undefined if the orm does', () => {
      stub((playerRepository as any).model, 'get').returns(of(undefined));
      scheduler.run(({ expectObservable }) => {
        const getPlayer$ = playerRepository.get('Charles', 'test');
        expectObservable(getPlayer$).toBe('(c|)', { c: undefined });
      });
    });
  });
});
