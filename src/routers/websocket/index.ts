import Http from '@/service/http';
import { connectById } from './chat';

export const websocket = new Http().use(connectById);
