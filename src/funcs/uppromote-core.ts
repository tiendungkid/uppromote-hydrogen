import UppromoteCookie from './uppromote-cookie'
import UppromoteLink from './uppromote-link'
import {Cart} from '@shopify/hydrogen-react'
import {LocalTrackingVariables, Received} from '../types/cookies'
import UppromoteHelpers from './uppromote-helpers'
import {COOKIE_CLICK_TIME} from '../constants/cookie'
import UppromoteApi from './uppromote-api'

export default class UppromoteCore {
	private readonly uppromoteCookie: UppromoteCookie
	protected readonly uppromoteLink: UppromoteLink
	protected readonly uppromoteHelper: UppromoteHelpers
	protected readonly uppromoteApi: UppromoteApi
	protected cart?: Cart

	constructor() {
		this.uppromoteLink = new UppromoteLink
		this.uppromoteCookie = new UppromoteCookie
		this.uppromoteHelper = new UppromoteHelpers
		this.uppromoteApi = new UppromoteApi
	}

	public run() {
		this.logger(this.uppromoteLink.isReferralLink())
		if (this.uppromoteLink.isReferralLink()) {
			const lastClick = this.uppromoteCookie.get(COOKIE_CLICK_TIME)
			const mustPostClickTracking = this.uppromoteHelper.mustPostClickTracking(lastClick)
			this.logger('Must post click tracking ' + mustPostClickTracking)
			if (mustPostClickTracking) {
				const trackingVars = this.storeLocalTrackingVariables()
				trackingVars && this.postClickTracking(trackingVars)
			}
		}
	}

	setCart(cart: Cart | undefined) {
		this.cart = cart
		this.resolveCartToken()
	}

	protected storeLocalTrackingVariables(): LocalTrackingVariables | null {
		const variables = this.uppromoteLink.getDecodedReferralLink()
		if (!variables) return null
		const clickTime = new Date().getTime()
		const localTrackingVars = {
			affiliateId: variables.aid,
			hashcode: variables.hc,
			source: variables.sca_source,
			clickTime,
			received: Received.NO
		}
		this.uppromoteCookie.setLocalTrackingReceivedVariables(localTrackingVars)
		return localTrackingVars
	}

	postClickTracking(trackingVars: LocalTrackingVariables) {
		this.uppromoteApi.postClickTracking(
			trackingVars,
			(response) => {
				this.logger(response)
			},
			(error) => {
				this.logger(error)
			}
		)
	}

	protected resolveCartToken() {
		console.log('Uppromote cart', this.cart)
	}

	public logger(content: any) {
		console.log(
			`%c ► UpPromote Affiliate Marketing [Application] - ${content}`,
			'background-color: #092C4C; color: #fff; padding: 5px;'
		)
	}
}
