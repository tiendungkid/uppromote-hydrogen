import {uppromoteAppConfig} from '../config/uppromote.app.config'

export default class UppromoteHelpers {
	/**
     * @description Only post [Cart Token] when posted [Click Tracking]
     * @param {string} shopifyCartToken
     * @param uppromoteCartToken
     * @param trackingId
     * @param affiliateId
     * @param expired
     */
	needPostCartToken(
		shopifyCartToken: string,
		uppromoteCartToken: string | null,
		trackingId: string | null,
		affiliateId: string | null,
		expired: string | null
	): boolean {
		if (!uppromoteCartToken) return true
		if (trackingId && affiliateId) {
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
		return (currentTime - parseInt(lastClick)) > (60 * 1000)
	}

	loadCustomerReferralStyle() {
		const stylesheetTag = document.createElement('link')
		stylesheetTag.setAttribute('rel', 'stylesheet')
		stylesheetTag.setAttribute('href', uppromoteAppConfig.styleUrl)
		document.head.append(stylesheetTag)
	}

	logger(content: any) {
		console.log(
			`%c ► UpPromote Affiliate Marketing [Application]\n ► ${content}`,
			'background-color: #1D85E8; color: #fff; padding: 5px;'
		)
	}

	errorLogger(content: any) {
		this.logger('[Tracking affiliate] Start log error.')
		console.log(content)
		this.logger('[Tracking affiliate] Finish log error.')
	}

	transformReferralLinkToHydrogenLink(referralLink: string) {
		const originURL = new URL(referralLink)
		originURL.host = window.location.host
		originURL.protocol = window.location.protocol
		return originURL.toString()
	}
}
