import React, {startTransition} from 'react'
import UppromoteCore from '../../funcs/uppromote-core'

export default function ParentAffiliateNote() {
	let uppromoteCore: UppromoteCore | undefined
	startTransition(() => {
		if (typeof window !== 'undefined') {
			uppromoteCore = new UppromoteCore
			uppromoteCore.run()
		}
	})
	if (uppromoteCore) {
		const parentAffiliate = uppromoteCore.generateParentAffiliate()
		if (parentAffiliate) return (
			<input type="hidden" name="customer[note][affiliate_id]" value={parentAffiliate}/>
		)
	}
	return <></>
}
