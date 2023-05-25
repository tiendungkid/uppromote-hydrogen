import {LocalTrackingVariables} from '../types/cookies'
import TrackingAffiliateResponse from '../types/tracking-affiliate-response'
import {AffiliateCouponResponse, RegisterCustomerReferralResponse} from '../types/response'
import {uppromoteAppConfig} from '../config/uppromote.app.config'
import {createStorefrontClient} from '@shopify/hydrogen-react'
import {CART_DISCOUNT_CODES_UPDATE} from '../queries/cart-discount-codes-update'
import {getGraphqlIdByCartId} from '../utils/cart'
import CustomerReferralSetting from '../types/customer-referral-setting'
import MessageBarSetting from '../types/message-bar-setting'
import UppromoteCredential from '../types/credential'

export default class UppromoteApi {

	private credential: UppromoteCredential

	constructor(credential: UppromoteCredential) {
		this.credential = credential
	}


	protected getFullLinkByPath(path: string): string {
		const slashed = path.charAt(0) === '/' ? '' : '/'
		return uppromoteAppConfig.appUrl + slashed + path
	}

	protected getFullCdnLinkPath(path: string): string {
		const slashed = path.charAt(0) === '/' ? '' : '/'
		return uppromoteAppConfig.cdnHost + slashed + path
	}

	protected async fetcher(
		url: string,
		method: 'GET' | 'HEAD' | 'PUT' | 'POST' | 'PATH' | 'DELETE',
		body: {
            [key: string]: string | null
        }
	) {
		body.token = this.credential.uppromoteAccessToken
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
			this.getFullLinkByPath('api/headless/click_tracking'),
			'POST',
			{
				aid: String(trackingVars.affiliateId),
				hc: trackingVars.hashcode,
				s: this.credential.storeDomain,
				tid: String(trackingVars.trackingId) || null,
				ug: trackingVars.useragent
			})
			.then(onSuccess)
			.catch(onError)
	}

	public async getCoupon(affiliateId: number | string): Promise<AffiliateCouponResponse> {
		const response = await this.fetcher(
			this.getFullLinkByPath('api/headless/get_coupon'),
			'GET',
			{
				aid: String(affiliateId),
				shopify_domain: this.credential.storeDomain
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
			this.getFullLinkByPath('api/headless/ctk'),
			'POST',
			{
				aid: affiliateId,
				tid: trackingId,
				ctk: cartId,
				s: this.credential.storeDomain.replace('.myshopify.com', ''),
				ug: userAgent,
				shopify_domain: this.credential.storeDomain
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
			publicStorefrontToken: this.credential.publicStorefrontToken,
			storeDomain: `https://${this.credential.storeDomain}`,
			storefrontApiVersion: this.credential.storefrontApiVersion
		})
		return {
			getStorefrontApiUrl: client.getStorefrontApiUrl,
			getPublicTokenHeaders: client.getPublicTokenHeaders
		}
	}

	public async getFbPixel(affiliateId: string | number) {
		const response = await this.fetcher(
			this.getFullLinkByPath('api/headless/get_fb_pixel'),
			'GET',
			{
				aff_id: String(affiliateId),
				shop: this.credential.storeDomain
			}
		)
		return await response
	}

	public async getCustomerReferralSetting(): Promise<CustomerReferralSetting> {
		const currentTime = new Date().getTime()
		const fileName = this.credential.storeDomain.replaceAll('.myshopify.com', '') + '.json?v=' + currentTime
		const response = await this.fetcher(
			this.getFullCdnLinkPath(`storage/uploads/customer_referral_settings/${fileName}`),
			'GET',
			{}
		)
		return await response
	}

	public async getMessageBarSetting(): Promise<MessageBarSetting> {
		const currentTime = new Date().getTime()
		const fileName = this.credential.storeDomain.replaceAll('.myshopify.com', '') + '.json?v=' + currentTime
		const response = await this.fetcher(
			this.getFullCdnLinkPath(`storage/uploads/message_bar_settings/${fileName}`),
			'GET',
			{}
		)
		return await response
	}

	public async postRegisterCustomerReferral(email: string): Promise<RegisterCustomerReferralResponse> {
		const response = await this.fetcher(
			this.getFullLinkByPath('api/headless/refer-customer/register'),
			'POST',
			{
				email,
				shop: this.credential.storeDomain,
				shopify_domain: this.credential.storeDomain
			}
		)
		return await response
	}
}
