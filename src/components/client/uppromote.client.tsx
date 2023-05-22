import React, {memo, startTransition} from 'react'
import {Cart} from '@shopify/hydrogen-react'
import UppromoteCore from '../../funcs/uppromote-core'
import UppromoteCustomerReferral from '../../funcs/customer-referral'
import UppromoteMessageBar from '../../funcs/message-bar'
import UppromoteCredential from '../../types/credential'

interface Props {
    cart?: Cart,
	publicStoreDomain: string,
    publicStorefrontApiToken: string,
    publicStorefrontApiVersion: string,
    uppromoteAccessToken: string
}

function Uppromote(props: Props) {
	const {
		cart,
		publicStoreDomain,
		publicStorefrontApiToken,
		publicStorefrontApiVersion,
		uppromoteAccessToken
	} = props
	startTransition(() => {
		if (typeof window !== 'undefined') {
			const credential: UppromoteCredential = {
				storeDomain: publicStoreDomain,
				publicStorefrontToken: publicStorefrontApiToken,
				storefrontApiVersion: publicStorefrontApiVersion,
				uppromoteAccessToken: uppromoteAccessToken
			}
			const uppromoteCore = new UppromoteCore(credential)
			const uppromoteCustomerReferral = new UppromoteCustomerReferral(credential)
			const uppromoteMessageBar = new UppromoteMessageBar(credential)
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
