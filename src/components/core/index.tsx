import React from 'react'
import {Cart} from '@shopify/hydrogen-react'

interface Props {
    cart?: Cart | null | any
}

export default function Uppromote(props: Props) {
	if (props.cart)
		console.log('UpPromote loaded cart', props.cart)
	return <></>
}
