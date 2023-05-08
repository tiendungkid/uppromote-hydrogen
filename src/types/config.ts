export enum UPPROMOTE_ENV {
    DEV = 'dev',
    TEST = 'test',
    PRODUCTION = 'production'
}

export interface IUppromoteAppConfig {
    appUrl: string
    cdnHost: string
    styleUrl: string
}

export interface IUppromoteShopConfig {
    shopify: {
        shopDomain: string,
        storefrontAccessToken: string
        storefrontApiVersion: string
    }
    app: {
        access_token: string
    }
}
