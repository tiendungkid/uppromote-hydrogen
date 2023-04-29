export enum UPPROMOTE_ENV {
    DEV = 'dev',
    TEST = 'test',
    PRODUCTION = 'production'
}

export interface IUppromoteAppConfig {
    appUrl: string
}

export interface IUppromoteShopConfig {
    shopify: {
        shopDomain: string,
        registerPath: string,
        storefrontAccessToken: string
        storefrontApiVersion: string
    }
    app: {
        access_token: string
    }
}
