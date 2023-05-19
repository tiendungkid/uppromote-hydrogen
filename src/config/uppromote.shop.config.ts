import {IUppromoteShopConfig} from '../types/config'

function getShopConfig(): IUppromoteShopConfig {
	if (typeof window === 'undefined') {
		return {
			app: {
				access_token: ''
			},
			shopify: {
				storefrontApiVersion: '',
				storefrontAccessToken: '',
				shopDomain: ''
			}
		}
	}
	const config: IUppromoteShopConfig = {
		app: {
			access_token: 'askdnsajd1221nekjnwkjenkj2e'
		},
		shopify: {
			shopDomain: 'tiendungkid.myshopify.com',
			storefrontAccessToken: '2323a8b30a5298a09191327eaa0c9512',
			storefrontApiVersion: '2023-04',
		}
	}
	// const config: IUppromoteShopConfig = {
	// 	app: {
	// 		access_token: 'askdnsajd1221nekjnwkjenkj2e'
	// 	},
	// 	shopify: {
	// 		shopDomain: process.env.PUBLIC_STORE_DOMAIN || '',
	// 		storefrontAccessToken: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
	// 		storefrontApiVersion: process.env.PUBLIC_STOREFRONT_API_VERSION || '',
	// 	}
	// }
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
