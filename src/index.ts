import 'dotenv/config';
import 'reflect-metadata';
import { container, bindIoc } from './inversify.config';
import { Server } from './server';
import symbols from './symbols';

async function main() {
  console.log('pre bind ioc');
  //bindIoc();
  //const server = container.get<Server>(symbols.server);
  console.log('no init');
  //await server.init();
  //await server.start();
}

main().then(
  () => {
    console.log('service started');
  },
  (err) => {
    console.log('there was an error');
    console.error(err);
    process.exit(1);
  }
);
