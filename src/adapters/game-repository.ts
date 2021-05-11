import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import { injectable } from 'inversify';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Game } from '../models';
import { IGameRepository } from '../ports';

@injectable()
export class GameRepository implements IGameRepository {
  private readonly model = dynamoose.model<
    {
      entity: string;
      typeTarget: string;
      code: string;
    } & Document
  >(
    'drawchamp',
    {
      entity: { type: String, hashKey: true },
      typeTarget: { type: String, rangeKey: true },
      code: String,
    },
    { create: false }
  );

  create(code: string): Observable<Game> {
    return from(this.model.create({ entity: `game_${code}`, typeTarget: 'game', code })).pipe(
      map(({ code }) => ({ code }))
    );
  }

  get(code: string): Observable<Game | undefined> {
    return from(this.model.get({ entity: `game_${code}`, typeTarget: 'game' })).pipe(
      map((game) => (game ? { code: game.code } : undefined))
    );
  }
}
