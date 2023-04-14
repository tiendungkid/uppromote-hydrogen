
/**
 * Declare local additions to `AppLoadContext` to include the session utilities we injected in `server.ts`.
 */
declare module '@shopify/remix-oxygen' {
  import {Storefront} from '@shopify/hydrogen'

  export interface AppLoadContext {
    waitUntil: ExecutionContext['waitUntil'];
    storefront: Storefront;
    cache: Cache;
  }
}
