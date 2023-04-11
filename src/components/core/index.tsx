import React, {useEffect, useState} from 'react'
import {Await, useMatches} from '@remix-run/react'

export default function UpPromoteCoreTacking() {
	const [root] = useMatches()
	const [cart, setCart] = useState()

	useEffect(() => {
		console.log(cart)
	}, [root, cart])

	return (
		<Await resolve={root.data?.cartPromise}>
			{
				(cart) => {
					setCart(cart)
					return <div>Uppromote loaded</div>
				}
			}
		</Await>
	)
}
