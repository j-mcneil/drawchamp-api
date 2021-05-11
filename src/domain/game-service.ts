import { inject, injectable } from 'inversify';
import { Observable, of } from 'rxjs';
import { map, retry, switchMap } from 'rxjs/operators';

import { Game, Player } from '../models';
import { IGameRepository, IPlayerRepository } from '../ports';
import symbols from '../symbols';
import { ICodeGenerator } from '../utils';

export interface IGameService {
  createGame(): Observable<Game>;
  createPlayer(name: string, gameCode: string): Observable<Player>;
}

@injectable()
export class GameService implements IGameService {
  constructor(
    @inject(symbols.ports.gameRepository) private gameRepository: IGameRepository,
    @inject(symbols.ports.playerRepository) private playerRepository: IPlayerRepository,
    @inject(symbols.utilities.codeGenerator) private codeGenerator: ICodeGenerator
  ) {}

  createGame(): Observable<Game> {
    // give it 10 tries to generate a unique code
    return of(1).pipe(
      map(() => this.codeGenerator.generateCode()),
      switchMap((code) =>
        this.gameRepository.get(code).pipe(
          map((game) => {
            if (game) throw { code: 409, message: 'Cannot find an available code to create a game' };
            return code;
          })
        )
      ),
      retry(9),
      switchMap((code) => this.gameRepository.create(code))
    );
  }

  createPlayer(name: string, gameCode: string): Observable<Player> {
    return this.playerRepository.get(name, gameCode).pipe(
      map((player) => {
        if (player) throw { code: 409, message: `A player named ${name} already exists for this game` };
        return player;
      }),
      switchMap(() =>
        this.gameRepository.get(gameCode).pipe(
          map((game) => {
            if (!game) throw { code: 404, message: `A game with code ${gameCode} could not be found` };
            return game;
          })
        )
      ),
      switchMap(() => this.playerRepository.create(name, gameCode))
    );
  }
}
