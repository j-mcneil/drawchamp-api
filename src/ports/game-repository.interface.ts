import { Observable } from 'rxjs';

import { Game } from '../models';

export interface IGameRepository {
  create(code: string): Observable<Game>;
  get(code: string): Observable<Game | undefined>;
}
