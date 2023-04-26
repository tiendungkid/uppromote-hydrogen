import UppromoteCookie from './uppromote-cookie'
import {
	COOKIE_AFFILIATE_ID,
	COOKIE_EXPIRES_TIME,
	COOKIE_TRACKING_ID,
	COOKIE_UPPROMOTE_CART_TOKEN
} from '../constants/cookie'

export default class UppromoteHelpers {
	private readonly cookieService: UppromoteCookie

	constructor() {
		this.cookieService = new UppromoteCookie()
	}

	/**
     * @description Only post [Cart Token] when posted [Click Tracking]
     * @param {string} shopifyCartToken
     */
	needPostCartToken(shopifyCartToken: string): boolean {
		const uppromoteCartToken = this.cookieService.get(COOKIE_UPPROMOTE_CART_TOKEN)
		if (!uppromoteCartToken) return true
		const trackingId = this.cookieService.get(COOKIE_TRACKING_ID)
		const affiliateId = this.cookieService.get(COOKIE_AFFILIATE_ID)
		if (trackingId && affiliateId) {
			const expired = this.cookieService.get(COOKIE_EXPIRES_TIME)
			if (expired && parseInt(expired) < new Date().getTime()) {
				return false
			}
			return shopifyCartToken !== uppromoteCartToken
		}
		return false
	}

	mustPostClickTracking(lastClick: string | null): boolean {
		if (!lastClick) return true
		const currentTime = new Date().getTime()
		return (currentTime - parseInt(lastClick)) > (60 * 10)
	}
}
