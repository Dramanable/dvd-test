import 'fastify';
import { ICache } from '../../../core/application/ports/ICache';

declare module 'fastify' {
  interface FastifyInstance {
    cache?: ICache;
  }
}
