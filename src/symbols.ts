const symbols = {
  controllers: {
    gameController: Symbol.for('GameController'),
  },
  ports: {
    gameRepository: Symbol.for('GameRepository'),
    playerRepository: Symbol.for('PlayerRepository'),
  },
  utilities: {
    codeGenerator: Symbol.for('CodeGenerator'),
  },
  server: Symbol.for('Server'),
};

export default symbols;
