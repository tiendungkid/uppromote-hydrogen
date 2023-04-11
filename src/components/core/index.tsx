import React, {useCallback} from 'react'
import {Await, useMatches} from '@remix-run/react'
import type {
	Cart as CartType,
} from '@shopify/hydrogen/storefront-api-types'

export default function UpPromoteCoreTacking() {
	const [root]  = useMatches()
	const handleOnCardLoaded = useCallback((cart: CartType) => {
		console.log('Uppromote loaded cart', cart?.id)
	}, [root.data.cartPromise])
	return (
		<Await resolve={root.data?.cartPromise}>
			{
				(cart) => {
					handleOnCardLoaded(cart)
					return  <p>{cart?.totalQuantity || 0}</p>
				}
			}
		</Await>
	)
}
