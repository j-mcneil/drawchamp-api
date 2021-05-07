import { Container } from 'inversify';

import { GameRepository, PlayerRepository } from './adapters';
import { GameController } from './controllers';
import { IGameRepository, IPlayerRepository } from './ports';
import { Server } from './server';
import symbols from './symbols';
import { ICodeGenerator, ShortAlphaCodeGenerator } from './utils';

const container = new Container();

const bindIoc = () => {
  container.bind<Server>(symbols.server).to(Server);
  container.bind<GameController>(symbols.controllers.gameController).to(GameController);
  container.bind<IGameRepository>(symbols.ports.gameRepository).to(GameRepository);
  container.bind<IPlayerRepository>(symbols.ports.playerRepository).to(PlayerRepository);
  container.bind<ICodeGenerator>(symbols.utilities.codeGenerator).to(ShortAlphaCodeGenerator);
};

export { container, bindIoc };
