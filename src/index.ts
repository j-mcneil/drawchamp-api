import 'dotenv/config';
import 'reflect-metadata';
import { container, bindIoc } from './inversify.config';
import { Server } from './server';
import symbols from './symbols';

async function main() {
  bindIoc();
  const server = container.get<Server>(symbols.server);

  await server.init();
  await server.start();
}

main().then(
  () => {
    console.log('service started');
  },
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
