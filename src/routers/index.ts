import Http from '@/service/http';

import { routerAuth } from './auth';
import { routerConversations } from './conversations';
import { routerProfessionals } from './professionals';

export const routers = new Http({
  name: 'routers',
})
  .use(routerAuth)
  .use(routerConversations)
  .use(routerProfessionals);
