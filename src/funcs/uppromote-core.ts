import UppromoteCookie from './uppromote-cookie'
import UppromoteLink from './uppromote-link'
import {Cart} from '@shopify/hydrogen-react'
import {LocalTrackingVariables, Received} from '../types/cookies'
import UppromoteHelpers from './uppromote-helpers'
import {COOKIE_CLICK_TIME, COOKIE_UPPROMOTE_CART_TOKEN} from '../constants/cookie'
import UppromoteApi from './uppromote-api'
import TrackingAffiliateResponse, {TrackingAffiliateResponseStatus} from '../types/tracking-affiliate-response'
import {getCartIdByGraphqlId} from '../utils/cart'

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
			if (mustPostClickTracking) {
				const trackingVars = this.storeLocalTrackingVariables()
				trackingVars && this.postClickTracking(trackingVars)
			}
		}
	}

	public setCart(cart: Cart | undefined) {
		this.cart = cart
		const cartId = getCartIdByGraphqlId(cart?.id)
		if (!cartId) return
		this.resolveCartToken(cartId)
	}

	protected resolveCartToken(cartToken: string) {
		console.log('Uppromote cart', this.cart, cartToken)
		const uppromoteCartToken = this.uppromoteCookie.get(COOKIE_UPPROMOTE_CART_TOKEN)
		if (!uppromoteCartToken) return
	}

	protected postCartToken(shopifyCartToken: string | null) {
		if (!shopifyCartToken) return
		if (!this.uppromoteHelper.needPostCartToken(shopifyCartToken)) return
		console.log(shopifyCartToken)
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

	protected postClickTracking(trackingVars: LocalTrackingVariables) {
		this.uppromoteApi.postClickTracking(
			trackingVars,
			(response) => {
				const trackingStatus = response.status === TrackingAffiliateResponseStatus.SUCCESS
					? TrackingAffiliateResponseStatus.SUCCESS
					: TrackingAffiliateResponseStatus.FAILED
				this.dispatchTrackingAffiliate(
					trackingVars.affiliateId,
					trackingStatus,
					response
				)
			},
			(error) => {
				this.dispatchTrackingAffiliate(
					trackingVars.affiliateId,
					TrackingAffiliateResponseStatus.FAILED,
					error
				)
				this.errorLogger(error)
			}
		)
	}

	protected dispatchTrackingAffiliate(
		affiliateId: number | string,
		affiliateAvailable: TrackingAffiliateResponseStatus,
		response: TrackingAffiliateResponse
	): void {
		this.logger('Tracking affiliate ' + `(${affiliateId} - ${affiliateAvailable})`)
		if (affiliateAvailable === TrackingAffiliateResponseStatus.SUCCESS) {
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
			this.uppromoteApi
				.getCoupon(affiliateId)
				.then(r => {
					this.uppromoteCookie.setAppliedCoupon(
						r.coupon || null,
						false
					)
				})
				.catch(e => {
					this.errorLogger(e)
					this.uppromoteCookie.setAppliedCoupon(null, false)
				})
			return
		}
	}

	public logger(content: any) {
		console.log(
			`%c ► UpPromote Affiliate Marketing [Application]\n ► ${content}`,
			'background-color: #1D85E8; color: #fff; padding: 5px;'
		)
	}

	public errorLogger(content: any) {
		this.logger('[Tracking affiliate] Start log error.')
		console.log(content)
		this.logger('[Tracking affiliate] Finish log error.')
	}
}
