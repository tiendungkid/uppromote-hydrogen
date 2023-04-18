import React from 'react'
import {Cart} from '@shopify/hydrogen-react'

interface Props {
    cart?: Cart
}

export default function Uppromote(props: Props) {
	const { cart } = props
	if (cart) {
		console.log('Uppromote loaded card', cart.id)
	}

	return <></>
}
