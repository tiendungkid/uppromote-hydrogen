import type {Storefront} from '~/lib/type'
import type {HydrogenSession} from '~/lib/session.server'

declare global {
    const process: { env: { NODE_ENV: 'production' | 'development' } }

    interface Env {
        SESSION_SECRET: string;
        PUBLIC_STOREFRONT_API_TOKEN: string;
        PRIVATE_STOREFRONT_API_TOKEN: string;
        PUBLIC_STOREFRONT_API_VERSION: string;
        PUBLIC_STORE_DOMAIN: string;
        PUBLIC_STOREFRONT_ID: string;
    }
}

declare module '@shopify/remix-oxygen' {
    export interface AppLoadContext {
        waitUntil: ExecutionContext['waitUntil'];
        session: HydrogenSession;
        storefront: Storefront;
        cache: Cache;
        env: Env;
    }
}

export {}
