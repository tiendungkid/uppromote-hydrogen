import Cookies from 'universal-cookie'
import {LocalTrackingVariables, ReceivedTrackingVariables} from '../types/cookies'
import {
	COOKIE_AFFILIATE_COMPANY, COOKIE_AFFILIATE_FIRST_NAME,
	COOKIE_AFFILIATE_HASHCODE,
	COOKIE_AFFILIATE_ID, COOKIE_AFFILIATE_NAME, COOKIE_AFFILIATE_PERSONAL_DETAIL, COOKIE_APPLIED_COUPON,
	COOKIE_CLICK_SOURCE,
	COOKIE_CLICK_TIME, COOKIE_ENABLE_ASSIGN_DOWN_LINE, COOKIE_EXPIRES_TIME,
	COOKIE_RECEIVED, COOKIE_TRACKING_ID
} from '../constants/cookie'

export default class UppromoteCookie {
	private cookieService: Cookies

	constructor() {
		this.cookieService = new Cookies()
	}

	get(cName: string): string | null {
		return this.cookieService.get(cName)
	}

	set(cName: string, cValue: string, expire = 365): void {
		const now = new Date()
		const time = now.getTime()
		const expireTime = time + expire * 24 * 60 * 60 * 1000
		now.setTime(expireTime)
		this.cookieService.set(cName, cValue, {
			expires: now,
			path: '/',
			secure: true
		})
	}

	delete(cName: string) {
		this.cookieService.remove(cName)
	}

	setLocalTrackingVariables(vars: LocalTrackingVariables): void {
		this.set(COOKIE_RECEIVED, vars.received)
		this.set(COOKIE_AFFILIATE_ID, vars.affiliateId.toString())
		this.set(COOKIE_AFFILIATE_HASHCODE, vars.hashcode)
		this.set(COOKIE_CLICK_TIME, vars.clickTime.toString())
		if (vars.source) {
			this.set(COOKIE_CLICK_SOURCE, vars.source)
		}
	}

	setReceivedTrackingVariables(vars: ReceivedTrackingVariables): void {
		this.set(COOKIE_RECEIVED, vars.received)
		this.set(COOKIE_TRACKING_ID, vars.trackingId.toString())
		this.set(COOKIE_EXPIRES_TIME, (vars.expire * 1000).toString())
		this.set(COOKIE_AFFILIATE_NAME, vars.affiliateName || '', vars.cookieDays)
		this.set(COOKIE_AFFILIATE_COMPANY, vars.affiliateCompany || '', vars.cookieDays)
		this.set(COOKIE_AFFILIATE_FIRST_NAME, vars.affiliateFirstName || '', vars.cookieDays)
		this.set(COOKIE_AFFILIATE_PERSONAL_DETAIL, vars.affiliatePersonalDetail || '', vars.cookieDays)
		if (vars.enableAssignDownLine) {
			this.set(COOKIE_ENABLE_ASSIGN_DOWN_LINE, '1', vars.cookieDays)
		}
	}

	setAppliedCoupon(coupon: string | null, applied: boolean){
		this.set(
			COOKIE_APPLIED_COUPON,
			JSON.stringify({
				coupon,
				applied
			})
		)
	}
}
