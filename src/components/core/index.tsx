import React from 'react'
import {Cart} from '@shopify/hydrogen-react'
import UppromoteCore from '../../funcs/uppromote-core'

interface Props {
    cart?: Cart
}

export default function Uppromote(props: Props) {
	const {cart} = props
	if (typeof window !== 'undefined') {
		const core = new UppromoteCore(cart)
		core.run()
	}
	return <></>
}
