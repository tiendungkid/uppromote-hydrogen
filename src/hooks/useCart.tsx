import {useMatches} from '@remix-run/react'
import {useEffect, useRef, useState} from 'react'
import {Cart} from '@shopify/hydrogen/dist/storefront-api-types'

export function useCart() {
	const [root] = useMatches()
	const [cart, setCart] = useState<undefined | boolean | null| Cart>()
	const resolved = useRef(false)

	useEffect(() => {
		if (resolved.current) return
		root.data?.cartPromise
			.then(setCart)
			.catch(() => setCart(null))
		resolved.current = true
	}, [root.data?.cartPromise, setCart])

	return cart
}
