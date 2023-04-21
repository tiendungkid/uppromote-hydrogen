// import UppromoteCookie from './uppromote-cookie'
import UppromoteLink from './uppromote-link'
import {Cart} from '@shopify/hydrogen-react'
// import UppromoteApi from './uppromote-api'

export default class UppromoteCore {
	// private readonly uppromoteCookie: UppromoteCookie
	protected readonly uppromoteLink: UppromoteLink

	// private readonly uppromoteApi: UppromoteApi

	constructor(protected cart?: Cart) {
		this.uppromoteLink = new UppromoteLink
		// this.uppromoteCookie = new UppromoteCookie
		// this.uppromoteApi = new UppromoteApi
	}

	public run() {
		if (this.uppromoteLink.isReferralLink()) {
			this.storeTrackingVariables()
		}
	}

	protected storeTrackingVariables(): void {

	}

	protected postCartToken() {
		console.log(1)
	}
}
