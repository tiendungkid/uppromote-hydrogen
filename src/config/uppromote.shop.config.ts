import {IUppromoteShopConfig} from '../types/config'
import * as shopConfig from '../uppromote.shop.config.json'


export const uppromoteShopConfig: IUppromoteShopConfig = {
	uuid: shopConfig.storefrontAccessToken,
	shopDomain: shopConfig.storeDomain,
	registerPath: shopConfig.registerPath
}
