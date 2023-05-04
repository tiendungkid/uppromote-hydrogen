import React, {memo, startTransition} from 'react'
import {Cart} from '@shopify/hydrogen-react'
import UppromoteCore from '../../funcs/uppromote-core'

interface Props {
    cart?: Cart
}

function Uppromote(props: Props) {
	const {cart} = props
	startTransition(() => {
		if (typeof window !== 'undefined') {
			const uppromoteCore= new UppromoteCore
			uppromoteCore.run()
			cart && uppromoteCore.setCart(cart)
		}
	})
	return (<></>)
}
export default memo(Uppromote)
