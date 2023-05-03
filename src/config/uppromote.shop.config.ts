import {IUppromoteShopConfig} from '../types/config'
import * as dotenv from 'dotenv'

dotenv.config()

function getShopConfig(): IUppromoteShopConfig {
	const config: IUppromoteShopConfig = {
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
	if (!config.app.access_token)
		throw new Error('Uppromote config: Invalid access token.')
	if (!config.shopify.shopDomain)
		throw new Error('Uppromote config: PUBLIC_STORE_DOMAIN is required')
	if (!config.shopify.storefrontAccessToken)
		throw new Error('Uppromote config: PUBLIC_STOREFRONT_API_TOKEN is required')
	if (!config.shopify.storefrontApiVersion)
		throw new Error('Uppromote config: PUBLIC_STOREFRONT_API_VERSION is required')
	return config
}

export const uppromoteShopConfig = getShopConfig()
