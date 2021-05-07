import Hapi from '@hapi/hapi';
import { inject, injectable } from 'inversify';
import { firstValueFrom } from 'rxjs';

import { IGameRepository, IPlayerRepository } from '../ports';
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
        return firstValueFrom(this.gameRepository.create().pipe(handleErrorBoom(request)));
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
          this.playerRepository.create(request.params.name, request.params.code).pipe(handleErrorBoom(request))
        );
      },
    },
  ];

  constructor(
    @inject(symbols.ports.gameRepository) private gameRepository: IGameRepository,
    @inject(symbols.ports.playerRepository) private playerRepository: IPlayerRepository
  ) {
    super();
  }
}
