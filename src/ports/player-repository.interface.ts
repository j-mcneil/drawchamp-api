import { Observable } from 'rxjs';

import { Player } from '../models';

export interface IPlayerRepository {
  create(name: string, gameCode: string): Observable<Player>;
}
