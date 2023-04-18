export enum UPPROMOTE_ENV {
    DEV = 'dev',
    TEST = 'test',
    PRODUCTION = 'production'
}

export interface IUppromoteAppConfig {
    env: UPPROMOTE_ENV,
    vars: {
        appUrl: string
    }
}

export interface IUppromoteShopConfig {
    uuid: string,
    shopDomain: string,
    registerPath: string
}
