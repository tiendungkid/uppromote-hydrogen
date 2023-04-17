import React from 'react'
import {Cart} from '@shopify/hydrogen-react'

interface Props {
    cart?: Cart
}

export default function Uppromote(props: Props) {
	console.log(props.cart)
	return <></>
}
