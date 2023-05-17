import React, {memo, startTransition} from 'react'
import {Cart} from '@shopify/hydrogen-react'
import UppromoteCore from '../../funcs/uppromote-core'
import UppromoteCustomerReferral from '../../funcs/customer-referral'
import UppromoteMessageBar from '../../funcs/message-bar'

interface Props {
    cart?: Cart
}

function Uppromote(props: Props) {
	const {cart} = props
	startTransition(() => {
		if (typeof window !== 'undefined') {
			const uppromoteCore= new UppromoteCore
			const uppromoteCustomerReferral = new UppromoteCustomerReferral
			const uppromoteMessageBar = new UppromoteMessageBar
			uppromoteCore.run()
			uppromoteCustomerReferral.run()
			uppromoteMessageBar.run()
			uppromoteCore.addTrackedAffiliateCallback(
				(trackingVars) => uppromoteCustomerReferral.onAffiliateTracked(trackingVars),
			)
			uppromoteCore.addTrackedAffiliateCallback(
				(trackingVars) => uppromoteMessageBar.onAffiliateTracked(trackingVars)
			)
			cart && uppromoteCore.setCart(cart)
		}
	})
	return (<></>)
}
export default memo(Uppromote)
