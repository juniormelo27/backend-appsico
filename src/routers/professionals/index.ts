import Http from '@/service/http';
import { findMany } from './findMany';

export const routerProfessionals = new Http({
  prefix: '/professionals',
}).use(findMany);
