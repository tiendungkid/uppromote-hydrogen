import React from 'react'
import {useCart} from '@shopify/hydrogen-react'

export default function Uppromote() {
	const {id} = useCart()
	console.log('Uppromote hydrogen', id)
	return <></>
}
