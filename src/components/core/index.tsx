import React, {useEffect} from 'react'
import {useCart} from '../../hooks/useCart'

export default function UpPromoteCoreTacking() {
	const cart = useCart()
	useEffect(() => {
		console.log('Uppromote loaded cart', cart)
	}, [cart])
	return <></>
}
