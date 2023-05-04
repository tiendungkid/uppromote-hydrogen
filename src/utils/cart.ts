import invariant from 'tiny-invariant'
import {Cart} from '@shopify/hydrogen/dist/storefront-api-types'
import {CART_QUERY} from '../queries/cart'
import {Storefront} from '@shopify/hydrogen'

export async function getCart(storefront: Storefront, cartId: string) {

	invariant(storefront, 'missing storefront client in cart query')

	const {cart} = await storefront.query<{ cart?: Cart }>(CART_QUERY, {
		variables: {
			cartId,
		},
		cache: storefront.CacheNone(),
	})

	return cart
}

export function getCartIdByGraphqlId(id?: string): string | null {
	if (!id) return null
	return id.replace('gid://shopify/Cart/', '')
}

export function getGraphqlIdByCartId(id: string): string {
	return 'gid://shopify/Cart/' + id
}
