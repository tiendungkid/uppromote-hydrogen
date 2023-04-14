import React from 'react'

interface Props {
    cart: any
}

export default function UpPromoteCoreTacking(props: Props) {
	const {cart} = props
	console.log('Uppromote loaded', cart)
	return (
		<div>Uppromote loaded</div>
	)
}
