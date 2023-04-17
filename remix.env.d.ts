import type {Storefront} from '@shopify/hydrogen'
import {Session} from '@shopify/remix-oxygen'
declare module '@shopify/remix-oxygen' {
    export interface AppLoadContext {
        storefront: Storefront;
        session: Session
    }
}
export {}
