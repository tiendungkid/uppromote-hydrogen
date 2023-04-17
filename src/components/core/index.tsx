import React, {useEffect} from 'react'
import {useCart} from '@shopify/hydrogen-react'
import UppromoteProvider from './providers'

export default function Uppromote() {
	const {id} = useCart()
	useEffect(() => {
		console.log(id)
	}, [id])
	return (
		<UppromoteProvider>
			<div></div>
		</UppromoteProvider>
	)
}
