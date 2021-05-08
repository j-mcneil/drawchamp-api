import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import { injectable } from 'inversify';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Player } from '../models';
import { IPlayerRepository } from '../ports';

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

  create(name: string, gameCode: string): Observable<Player> {
    return from(this.model.create({ entity: `game_${gameCode}_player_${name}`, typeTarget: 'player', name })).pipe(
      map(({ name }) => ({ name }))
    );
  }

  get(name: string, gameCode: string): Observable<Player | undefined> {
    return from(this.model.get({ entity: `game_${gameCode}_player_${name}`, typeTarget: 'player' })).pipe(
      map((player) => (player ? { name: player.name } : undefined))
    );
  }
}
