import Hapi from '@hapi/hapi';
import { inject, injectable } from 'inversify';
import { firstValueFrom } from 'rxjs';

import { IGameService } from '../domain/game-service';
import symbols from '../symbols';
import { handleErrorBoom } from '../utils/error';
import { Controller } from './controller.interface';

@injectable()
export class GameController extends Controller {
  protected readonly name = 'gameController';
  protected readonly routes: Hapi.ServerRoute[] = [
    {
      method: 'POST',
      path: '/game',
      options: {
        description: 'Create a new game',
      },
      handler: (request: Hapi.Request /*, h: Hapi.ResponseToolkit*/) => {
        return firstValueFrom(this.gameService.createGame().pipe(handleErrorBoom(request)));
      },
    },
    {
      method: 'POST',
      path: '/game/{code}/player/{name}',
      options: {
        description: 'Add a player to the game',
      },
      handler: (request: Hapi.Request /*, h: Hapi.ResponseToolkit*/) => {
        return firstValueFrom(
          this.gameService.createPlayer(request.params.name, request.params.code).pipe(handleErrorBoom(request))
        );
      },
    },
  ];

  constructor(@inject(symbols.domain.gameService) private gameService: IGameService) {
    super();
  }
}
