import React from 'react'
import {Cart} from '@shopify/hydrogen/dist/storefront-api-types'

interface Props {
    cart: Cart | null | undefined
}

export default function UpPromoteCoreTacking(props: Props) {
	const {cart} = props
	console.log('Uppromote loaded', cart)
	return (
		<div>Uppromote loaded</div>
	)
}
