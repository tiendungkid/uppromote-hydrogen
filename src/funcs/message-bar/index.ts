import TrackingAffiliateResponse, {TrackingAffiliateResponseStatus} from '../../types/tracking-affiliate-response'
import UppromoteApi from '../uppromote-api'
import UppromoteCookie from '../uppromote-cookie'
import {COOKIE_IS_CUSTOMER_REFERRAL_PROGRAM} from '../../constants/cookie'
import UppromoteLink from '../uppromote-link'
import MessageBarRenderer from './renderer'
import MessageBarSetting from '../../types/message-bar-setting'

class UppromoteMessageBar {
	protected readonly uppromoteApi: UppromoteApi
	protected readonly uppromoteCookie: UppromoteCookie
	protected readonly uppromoteLink: UppromoteLink
	protected renderer: MessageBarRenderer | undefined
	protected setting: MessageBarSetting | undefined

	constructor() {
		this.uppromoteApi = new UppromoteApi()
		this.uppromoteCookie = new UppromoteCookie()
		this.uppromoteLink = new UppromoteLink()
	}

	run() {
		this.uppromoteApi
			.getMessageBarSetting()
			.then(response => {
				this.setting = response
				if (!response.referral_enable) return
				if (this.isCustomerReferralProgram()) return
				const renderer = new MessageBarRenderer(response)
				this.renderer = renderer
				renderer.getCurrentMessageBar().forEach(e => e.remove())
				const affiliateInfo = this.uppromoteCookie.getMessageBarAffiliateInfo()
				if (this.setting.referral_enable) {
					if (affiliateInfo.name) {
						this.renderer.renderMessageBarWithAffiliate(affiliateInfo)
						return
					}
					if (this.setting.not_referral_enable) renderer.renderMessageBarWithoutAffiliate()
				}
			})
	}

	isCustomerReferralProgram(): boolean {
		if (parseInt(this.uppromoteCookie.get(COOKIE_IS_CUSTOMER_REFERRAL_PROGRAM) || 0)) return true
		return !!this.uppromoteLink.getSearch().get('sca_crp')
	}

	onAffiliateTracked(trackingVars: TrackingAffiliateResponse) {
		if (trackingVars.status !== TrackingAffiliateResponseStatus.SUCCESS) return
		const affiliateInfo = this.uppromoteCookie.getMessageBarAffiliateInfo()
		this.renderer?.renderMessageBarWithAffiliate(affiliateInfo)
	}
}

export default UppromoteMessageBar
