import React, {useCallback} from 'react'
import {Await, useMatches} from '@remix-run/react'
import {Cart, Maybe} from '@shopify/hydrogen/dist/storefront-api-types'

export default function UpPromoteCoreTacking() {
	const [root]  = useMatches()
	const handleOnCardLoaded = useCallback((cart: Maybe<Cart>) => {
		console.log('Uppromote loaded cart', cart?.id)
	}, [root])
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
