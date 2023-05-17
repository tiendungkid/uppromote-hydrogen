import {IUppromoteShopConfig} from '../types/config'
import * as data from '../../uppromote.config.json'

function getShopConfig(): IUppromoteShopConfig {
	const config: IUppromoteShopConfig = {
		app: {
			access_token: data.uppromote.access_token || ''
		},
		shopify: {
			shopDomain: data.shopify.shop_domain || '',
			storefrontAccessToken: data.shopify.storefront_access_token || '',
			storefrontApiVersion: data.shopify.storefront_api_version || '',
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
