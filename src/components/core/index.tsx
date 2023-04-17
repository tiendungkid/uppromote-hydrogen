import React from 'react'
import {Cart} from '@shopify/hydrogen/dist/storefront-api-types'

interface Props {
    cart?: Cart
}

export default function Uppromote(props: Props) {
	console.log(props.cart)
	return <></>
}
