import {LocalTrackingVariables} from '../types/cookies'
import TrackingAffiliateResponse from '../types/tracking-affiliate-response'
import {AffiliateCouponResponse} from '../types/response'
import {uppromoteAppConfig} from '../config/uppromote.app.config'
import {uppromoteShopConfig} from '../config/uppromote.shop.config'
import {createStorefrontClient} from '@shopify/hydrogen-react'
import {CART_DISCOUNT_CODES_UPDATE} from '../queries/cart-discount-codes-update'
import {getGraphqlIdByCartId} from '../utils/cart'

export default class UppromoteApi {

	protected getFullLinkByPath(path: string): string {
		const slashed = path.charAt(0) === '/' ? '' : '/'
		return uppromoteAppConfig.appUrl + slashed + path
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
			Object.keys(body).forEach(k => {
				if (body[k]) uri.searchParams.set(k, body[k] || '')
			})
			const requestUrl = uri.toString()
			const response = await fetch(requestUrl)
			return (await response.json()) || null
		}
		const formData = new FormData()
		Object.keys(body).forEach(k => body[k] && formData.append(k, body[k] || ''))
		const requestUrl = uri.toString()
		const response = await fetch(requestUrl, {
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
				s: uppromoteShopConfig.shopify.shopDomain,
				tid: String(trackingVars.trackingId) || null,
				ug: trackingVars.useragent
			})
			.then(onSuccess)
			.catch(onError)
	}

	public async getCoupon(affiliateId: number | string): Promise<AffiliateCouponResponse> {
		const response = await this.fetcher(
			this.getFullLinkByPath('api/get_coupon'),
			'GET',
			{
				aid: String(affiliateId),
				shopify_domain: uppromoteShopConfig.shopify.shopDomain
			}
		)
		return await response
	}

	public async postCartToken(
		affiliateId: string,
		trackingId: string,
		cartId: string,
		userAgent: string
	) {
		const response = await this.fetcher(
			this.getFullLinkByPath('api/ctk'),
			'POST',
			{
				aid: affiliateId,
				tid: trackingId,
				ctk: cartId,
				s: uppromoteShopConfig.shopify.shopDomain.replace('.myshopify.com', ''),
				ug: userAgent,
				shopify_domain: uppromoteShopConfig.shopify.shopDomain
			}
		)
		return await response
	}

	public async applyDiscountCode(cartId: string, discountCode: string) {
		const storefront = this.getStorefrontClient()
		const response = await fetch(storefront.getStorefrontApiUrl(), {
			body: JSON.stringify({
				query: CART_DISCOUNT_CODES_UPDATE,
				variables: {
					cartId: getGraphqlIdByCartId(cartId),
					discountCodes: [discountCode]
				}
			}),
			headers: storefront.getPublicTokenHeaders(),
			method: 'POST'
		})
		const jsonResponse = await response.json()
		return await jsonResponse
	}

	private getStorefrontClient(): {
        getStorefrontApiUrl: () => string,
		getPublicTokenHeaders: () => Record<string, string>
		} {
		const client = createStorefrontClient({
			publicStorefrontToken: uppromoteShopConfig.shopify.storefrontAccessToken,
			storeDomain: `https://${uppromoteShopConfig.shopify.shopDomain}`,
			storefrontApiVersion: uppromoteShopConfig.shopify.storefrontApiVersion
		})
		return {
			getStorefrontApiUrl: client.getStorefrontApiUrl,
			getPublicTokenHeaders: client.getPublicTokenHeaders
		}
	}
}
