import {CartProvider} from '@shopify/hydrogen-react'
import React from 'react'

interface Props {
	children: React.ReactNode
}
export default function UppromoteProvider(props: Props) {
	const {children} = props
	return (
		<CartProvider>
			{children}
		</CartProvider>
	)
}
