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
}
