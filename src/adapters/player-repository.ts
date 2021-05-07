import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import { inject, injectable } from 'inversify';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Player } from '../models';
import { IGameRepository, IPlayerRepository } from '../ports';
import symbols from '../symbols';

@injectable()
export class PlayerRepository implements IPlayerRepository {
  private readonly model = dynamoose.model<
    {
      entity: string;
      typeTarget: string;
      name: string;
    } & Document
  >(
    'drawchamp',
    {
      entity: { type: String, hashKey: true },
      typeTarget: { type: String, rangeKey: true },
      name: String,
    },
    { create: false }
  );

  constructor(@inject(symbols.ports.gameRepository) private gameRepository: IGameRepository) {}

  create(name: string, gameCode: string): Observable<Player> {
    return this.get(name, gameCode).pipe(
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
      switchMap(() => this.model.create({ entity: `game_${gameCode}_player_${name}`, typeTarget: 'player', name })),
      map(({ name }) => ({ name }))
    );
  }

  get(name: string, gameCode: string): Observable<Player | undefined> {
    return from(this.model.get({ entity: `game_${gameCode}_player_${name}`, typeTarget: 'player' }));
  }
}
