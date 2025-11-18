import 'fastify';
import { ICache } from '../application/ports/ICache';

declare module 'fastify' {
  interface FastifyInstance {
    cache?: ICache;
  }
}
