import {createStorefrontClient} from '@shopify/hydrogen-react'

const client = createStorefrontClient({
	privateStorefrontToken: '{private_access_token}',
	storeDomain: 'https://{shop}.myshopify.com',
	storefrontApiVersion: '{api_version}',
})
export const getStorefrontApiUrl = client.getStorefrontApiUrl
export const getPrivateTokenHeaders = client.getPrivateTokenHeaders
