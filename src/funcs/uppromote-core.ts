import UppromoteCookie from './uppromote-cookie'
import UppromoteLink from './uppromote-link'
import {Cart} from '@shopify/hydrogen-react'
import {LocalTrackingVariables, Received} from '../types/cookies'
import UppromoteHelpers from './uppromote-helpers'
import {
	COOKIE_AFFILIATE_ID, COOKIE_APPLIED_COUPON,
	COOKIE_CLICK_TIME, COOKIE_EXPIRES_TIME,
	COOKIE_TRACKING_ID,
	COOKIE_UPPROMOTE_CART_TOKEN
} from '../constants/cookie'
import UppromoteApi from './uppromote-api'
import TrackingAffiliateResponse, {TrackingAffiliateResponseStatus} from '../types/tracking-affiliate-response'
import {getCartIdByGraphqlId} from '../utils/cart'
import AppliedCoupon from '../types/applied-coupon'
import UppromoteCredential from '../types/credential'

export default class UppromoteCore {
	private readonly uppromoteCookie: UppromoteCookie
	protected readonly uppromoteLink: UppromoteLink
	protected readonly uppromoteHelper: UppromoteHelpers
	protected readonly uppromoteApi: UppromoteApi
	protected cart?: Cart
	private onAffiliateTracked: Array<(trackingVars: TrackingAffiliateResponse) => void>

	constructor(credentials: UppromoteCredential) {
		this.uppromoteLink = new UppromoteLink(credentials)
		this.uppromoteCookie = new UppromoteCookie
		this.uppromoteHelper = new UppromoteHelpers
		this.uppromoteApi = new UppromoteApi(credentials)
		this.onAffiliateTracked = []
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

	protected resolveCartToken(shopifyCartId: string) {
		this.uppromoteCookie.setUppromoteCartId(shopifyCartId)
		const affiliateId = this.uppromoteCookie.get(COOKIE_AFFILIATE_ID)
		const trackingId = this.uppromoteCookie.get(COOKIE_TRACKING_ID)
		const expire_at = this.uppromoteCookie.get(COOKIE_EXPIRES_TIME)
		const uppromoteCartToken = this.uppromoteCookie.get(COOKIE_UPPROMOTE_CART_TOKEN)
		const userAgent = this.uppromoteLink.getUserAgent()
		if (!trackingId || !affiliateId || !expire_at) return
		this.applyCouponCode(shopifyCartId)
		if (this.uppromoteHelper.needPostCartToken(
			shopifyCartId,
			uppromoteCartToken,
			trackingId,
			affiliateId,
			expire_at
		)) {
			this.uppromoteApi
				.postCartToken(affiliateId, trackingId, shopifyCartId, userAgent)
				.then()
		}
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
				this.uppromoteHelper.errorLogger(error)
			}
		)
	}

	protected dispatchTrackingAffiliate(
		affiliateId: number | string,
		affiliateAvailable: TrackingAffiliateResponseStatus,
		response: TrackingAffiliateResponse
	): void {
		this.uppromoteHelper.logger('Tracking affiliate ' + `(${affiliateId} - ${affiliateAvailable})`)
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
					this.applyCouponCode()
				})
				.catch(e => {
					this.uppromoteHelper.errorLogger(e)
					this.uppromoteCookie.setAppliedCoupon(null, false)
				})
			this.uppromoteApi
				.getFbPixel(affiliateId)
				.then(response => {
					if (response && response.status === 'ok') {
						const customEvent = new CustomEvent('uppromote:pull-fb-pixel', {
							detail: {
								affiliateId,
								pixel: response.pixel
							}
						})
						window.dispatchEvent(customEvent)
					}
				})
			window.dispatchEvent(new CustomEvent('uppromote:tracked-affiliate', {
				detail: response
			}))
			this.onAffiliateTracked?.forEach(callback => {
				callback(response)
			})
			return
		}
	}

	protected applyCouponCode(cartId?: string) {
		const couponCookie: AppliedCoupon | null = this.uppromoteCookie.get(COOKIE_APPLIED_COUPON)
		if (!couponCookie || !couponCookie.coupon || couponCookie.applied) return
		const uppromoteCartId = this.uppromoteCookie.get(COOKIE_UPPROMOTE_CART_TOKEN)
		cartId = cartId ?? uppromoteCartId
		if (!cartId) return
		this.uppromoteApi
			.applyDiscountCode(cartId, couponCookie.coupon)
			.then(() => {
				this.uppromoteCookie.setAppliedCoupon(couponCookie.coupon, true)
			})
	}

	public addTrackedAffiliateCallback(callback: (trackingVars: TrackingAffiliateResponse) => void) {
		this.onAffiliateTracked?.push(callback)
	}
}
