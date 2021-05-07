import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import { inject, injectable } from 'inversify';
import { from, Observable, of } from 'rxjs';
import { map, retry, switchMap } from 'rxjs/operators';

import { Game } from '../models';
import { IGameRepository } from '../ports';
import symbols from '../symbols';
import { ICodeGenerator } from '../utils';

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

  constructor(@inject(symbols.utilities.codeGenerator) private codeGenerator: ICodeGenerator) {}

  create(): Observable<Game> {
    // give it 10 tries to generate a unique code
    return of(1).pipe(
      map(() => this.codeGenerator.generateCode()),
      switchMap((code) =>
        this.get(code).pipe(
          map((game) => {
            if (game) throw { code: '409', message: 'Cannot find an available code to create a game' };
            return code;
          })
        )
      ),
      retry(10),
      switchMap((code) => this.model.create({ entity: `game_${code}`, typeTarget: 'game', code })),
      map(({ code }) => ({ code }))
    );
  }

  get(code: string): Observable<Game | undefined> {
    return from(this.model.get({ entity: `game_${code}`, typeTarget: 'game' }));
  }
}
