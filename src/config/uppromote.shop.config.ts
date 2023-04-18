import {IUppromoteShopConfig} from '../types/config'
import * as shopConfig from '../uppromote.shop.config.json'


export const uppromoteShopConfig: IUppromoteShopConfig = {
	uuid: shopConfig.UUID,
	shopDomain: shopConfig.storeDomain,
	registerPath: shopConfig.registerPath
}
