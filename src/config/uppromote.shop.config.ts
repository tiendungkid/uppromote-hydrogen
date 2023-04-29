import {IUppromoteShopConfig} from '../types/config'
import * as dotenv from 'dotenv'

dotenv.config()

function getShopConfig(): IUppromoteShopConfig {
	return {
		app: {
			access_token: process.env.UPPROMOTE_API_KEY || ''
		},
		shopify: {
			shopDomain: process.env.PUBLIC_STORE_DOMAIN || '',
			storefrontAccessToken: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
			storefrontApiVersion: process.env.PUBLIC_STOREFRONT_API_VERSION || '',
			registerPath: process.env.UPPROMOTE_SHOPIFY_REGISTER_PATH || ''
		}
	}
}

export const uppromoteShopConfig = getShopConfig()
