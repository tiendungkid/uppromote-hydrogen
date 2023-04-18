import React from 'react'
import {Cart} from '@shopify/hydrogen-react'
import {getCartIdByGraphqlId} from '../../utils/cart'

interface Props {
    cart?: Cart
}

export default function Uppromote(props: Props) {
	const {cart} = props
	if (cart) {
		console.log('Uppromote loaded card', getCartIdByGraphqlId(cart.id))
	} else {
		console.log('Cart is not created')
	}
	return <></>
}
