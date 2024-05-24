import Http from './service/http';

import { routers } from './routers';
import { websocket } from './routers/websocket';

import environment from './libraries/environment';

const server = new Http()
  .use(routers)
  .use(websocket)
  .listen(environment.port, ({ url, port, development }) => {
    console.log('Servidor iniciado....');
    console.log('URL:', url.host);
    console.log('PORTA:', port);

    console.log('Modo produção:', !development);
  });
