import React, {useCallback} from 'react'
import {
	defer,
	type LoaderArgs,
} from '@remix-run/server-runtime'
import {uppromoteGetCart} from '../../utils/fetcher'
import {Await, useLoaderData} from '@remix-run/react'

export async function loader({context}: LoaderArgs) {
	const cartId = await context.session.get('cartId')

	return defer({
		cartPromise: cartId ? uppromoteGetCart(context, cartId) : undefined,
	})
}

export default function Uppromote() {
	const {cartPromise} = useLoaderData<typeof loader>()
	const resolveCart = useCallback((cart: any) => {
		console.log('Uppromote tracking', cart)
	}, [cartPromise])
	return (
		<Await resolve={cartPromise}>
			{(cart) => {
				resolveCart(cart)
				return <></>
			}}
		</Await>
	)
}
