import UppromoteCookie from './uppromote-cookie'
import UppromoteLink from './uppromote-link'
import {Cart} from '@shopify/hydrogen-react'
import {LocalTrackingVariables, Received} from '../types/cookies'
import UppromoteHelpers from './uppromote-helpers'
import {COOKIE_CLICK_TIME} from '../constants/cookie'
import UppromoteApi from './uppromote-api'
import TrackingAffiliateResponse, {TrackingAffiliateResponseStatus} from '../types/tracking-affiliate-response'

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
		const localTrackingVars: LocalTrackingVariables = {
			received: Received.NO,
			affiliateId: variables.aid,
			hashcode: variables.hc,
			clickTime,
			source: variables.sca_source,
			trackingId: null,
			useragent: this.uppromoteLink.getUserAgent()
		}
		this.uppromoteCookie.setLocalTrackingVariables(localTrackingVars)
		return localTrackingVars
	}

	postClickTracking(trackingVars: LocalTrackingVariables) {
		this.uppromoteApi.postClickTracking(
			trackingVars,
			(response) => {
				this.uppromoteCookie.setReceivedTrackingVariables({
					received: Received.YES,
					cookieDays: response.affcookie,
					trackingId: response.tid,
					affiliateName: response.afd.affiliate_name,
					affiliateFirstName: response.afd.affiliate_firstname,
					affiliateCompany: response.afd.company,
					enableAssignDownLine: response.enable_assign_down_line,
					affiliatePersonalDetail: response.afd.personal_detail,
					expire: response.ep
				})
				this.dispatchTrackingAffiliate(
					response.status === TrackingAffiliateResponseStatus.SUCCESS,
					response
				)
			},
			(error) => {
				this.logger('[Tracking affiliate] Start log error.')
				console.log(error)
				this.logger('[Tracking affiliate] Finish log error.')
			}
		)
	}

	protected resolveCartToken() {
		console.log('Uppromote cart', this.cart)
	}

	dispatchTrackingAffiliate(
		affiliateAvailable: boolean,
		response: TrackingAffiliateResponse
	) {
		console.log(affiliateAvailable, response)
	}

	public logger(content: any) {
		console.log(
			`%c ► UpPromote Affiliate Marketing [Application] - ${content}`,
			'background-color: #1D85E8; color: #fff; padding: 5px;'
		)
	}
}
