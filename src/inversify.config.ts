import { Container } from 'inversify';

import { GameRepository, PlayerRepository } from './adapters';
import { GameController, MetaController } from './controllers';
import { GameService, IGameService } from './domain/game-service';
import { IGameRepository, IPlayerRepository } from './ports';
import { Server } from './server';
import symbols from './symbols';
import { ICodeGenerator, ShortAlphaCodeGenerator } from './utils';

const container = new Container();

const bindControllers = () => {
  container.bind<MetaController>(symbols.controllers.metaController).to(MetaController);
  container.bind<GameController>(symbols.controllers.gameController).to(GameController);
};

const bindRepositories = () => {
  container.bind<IGameRepository>(symbols.ports.gameRepository).to(GameRepository);
  container.bind<IPlayerRepository>(symbols.ports.playerRepository).to(PlayerRepository);
};

const bindServices = () => {
  container.bind<IGameService>(symbols.domain.gameService).to(GameService);
};

const bindUtils = () => {
  container.bind<ICodeGenerator>(symbols.utilities.codeGenerator).to(ShortAlphaCodeGenerator);
};

const bindIoc = () => {
  container.bind<Server>(symbols.server).to(Server);
  bindControllers();
  bindRepositories();
  bindServices();
  bindUtils();
};

export { container, bindIoc };
