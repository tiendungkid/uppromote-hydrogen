import {LocalTrackingVariables} from '../types/cookies'
import TrackingAffiliateResponse from '../types/tracking-affiliate-response'
import {uppromoteAppConfig} from '../config/uppromote.app.config'
import {uppromoteShopConfig} from '../config/uppromote.shop.config'

export default class UppromoteApi {

	protected getFullLinkByPath(path: string): string {
		const config = uppromoteAppConfig()
		const slashed = path.charAt(0) === '/' ? '' : '/'
		return config.vars.appUrl + slashed + path
	}

	protected async fetcher(
		url: string,
		method: 'GET' | 'HEAD' | 'PUT' | 'POST' | 'PATH' | 'DELETE',
		body: {
            [key: string]: string | null
        }
	) {
		const uri = new URL(url)
		if (['GET', 'HEAD'].includes(method)) {
			Object.keys(body).forEach(k => body[k] && uri.searchParams.set(k, body[k] || ''))
			const response = await fetch(url.toString())
			return (await response.json()) || null
		}
		const formData = new FormData()
		Object.keys(body).forEach(k => body[k] && formData.append(k, body[k] || ''))
		const response = await fetch(url.toString(), {
			method,
			headers: {},
			body: formData
		})
		return (await response.json()) || null
	}

	public postClickTracking(
		trackingVars: LocalTrackingVariables,
		onSuccess: (response: TrackingAffiliateResponse) => void,
		onError: (error: any) => void
	) {
		this.fetcher(
			this.getFullLinkByPath('api/click_tracking'),
			'POST',
			{
				aid: String(trackingVars.affiliateId),
				hc: trackingVars.hashcode,
				s: uppromoteShopConfig.shopDomain,
				tid: String(trackingVars.trackingId) || null,
				ug: trackingVars.useragent
			})
			.then(onSuccess)
			.catch(onError)
	}
}
