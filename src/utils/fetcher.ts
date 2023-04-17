import invariant from 'tiny-invariant'
import {Cart} from '@shopify/hydrogen/dist/storefront-api-types'
import {CART_QUERY} from '../queries/cart'
import {AppLoadContext} from '../../remix.env'

export async function uppromoteGetCart({storefront}: AppLoadContext, cartId: string) {

	invariant(storefront, 'missing storefront client in cart query')

	const {cart} = await storefront.query<{ cart?: Cart }>(CART_QUERY, {
		variables: {
			cartId,
		},
		cache: storefront.CacheNone(),
	})

	return cart
}
