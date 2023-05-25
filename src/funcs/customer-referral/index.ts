import UppromoteApi from '../uppromote-api'
import UppromoteHelpers from '../uppromote-helpers'
import CustomerReferralSetting from '../../types/customer-referral-setting'
import UppromoteCookie from '../uppromote-cookie'
import CustomerReferralRenderer from './renderer'
import CustomerReferralUi from '../../types/customer-referral-ui'
import CustomerReferralUIAction from './action'
import {COOKIE_CUSTOMER_REFERRAL_LINK, COOKIE_IS_CUSTOMER_REFERRAL_PROGRAM} from '../../constants/cookie'
import TrackingAffiliateResponse, {TrackingAffiliateResponseStatus} from '../../types/tracking-affiliate-response'
import UppromoteCredential from '../../types/credential'

class UppromoteCustomerReferral {
	protected readonly uppromoteApi: UppromoteApi
	protected readonly uppromoteHelper: UppromoteHelpers
	protected readonly uppromoteCookie: UppromoteCookie
	protected renderer: CustomerReferralRenderer | undefined
	protected setting: CustomerReferralSetting | null
	protected ui: CustomerReferralUi | null
	protected uiAction: CustomerReferralUIAction | null
	protected finishedLoadSetting = false

	constructor(credentials: UppromoteCredential) {
		this.uppromoteApi = new UppromoteApi(credentials)
		this.uppromoteHelper = new UppromoteHelpers()
		this.uppromoteCookie = new UppromoteCookie()
		this.uiAction = null
		this.setting = null
		this.ui = null
	}

	run() {
		this.uppromoteApi
			.getCustomerReferralSetting()
			.then(setting => {
				this.render(setting)
				this.applyRegisterStatus()
				this.finishedLoadSetting = true
			})
	}

	render(setting: CustomerReferralSetting): void {
		if (!setting || !setting.program.active || this.uppromoteCookie.isClosedCustomerReferral()) return
		this.setting = setting
		this.renderer = new CustomerReferralRenderer(setting)
		if (this.renderer.rendered().length === 0) {
			this.uppromoteHelper.loadCustomerReferralStyle()
			this.ui = this.renderer.renderCustomerReferral()
			this.addEventListener()
		}
	}

	private addEventListener() {
		if (!this.ui || !this.setting) return
		const ui = this.ui
		const uiAction = new CustomerReferralUIAction(
			this.setting,
			this.ui
		)
		this.uiAction = uiAction
		const actions = [
			{
				element: ui.button,
				event: 'click',
				action: () => uiAction.onButtonClicked()
			},
			{
				element: ui.closeButton,
				event: 'click',
				action: () => uiAction.onCloseButton()
			},
			{
				element: ui.closeInvitePopupButton,
				event: 'click',
				action: () => uiAction.onButtonClicked()
			},
			{
				element: ui.getInviteLinkButton,
				event: 'click',
				action: () => this.prepareRegister()
			}
		]
		actions.forEach((action) => action.element.addEventListener(action.event, action.action))
	}

	private prepareRegister() {
		if (!this.uiAction) return
		this.uiAction.renderErrorMessage(null)
		if (this.uiAction.createdCustomer()) {
			this.uiAction.copyInviteLink()
			return
		}
		if (!this.uiAction.isValidEmail()) {
			this.uiAction.renderErrorMessage('Please enter a valid email address')
			return
		}
		this.uiAction.disableRegisterButton()
		const email = this.uiAction.getEmail()
		this.uppromoteApi
			.postRegisterCustomerReferral(email)
			.then(response => {
				const uiAction = this.uiAction
				const renderer = this.renderer
				if (!uiAction || !renderer) return
				if (response.error || !response.data) {
					uiAction.renderErrorMessage(response.error)
					return
				}
				const shareLink = this.uppromoteHelper.transformReferralLinkToHydrogenLink(response.data)
				uiAction.setReferralLink(shareLink)
				const shareContainer = renderer.shareContainer(shareLink)
				shareContainer && uiAction.appendShareContainer(shareContainer)
				this.setRegisterStatus(shareLink)
			})
			.finally(() => {
				this.uiAction?.disableRegisterButton(false)
			})
	}

	private setRegisterStatus(shareLink: string) {
		this.uppromoteCookie.set(COOKIE_CUSTOMER_REFERRAL_LINK, shareLink, 365)
	}

	private applyRegisterStatus() {
		if (!this.ui || this.uppromoteCookie.isClosedCustomerReferral()) return
		const inviteLink = this.uppromoteCookie.get(COOKIE_CUSTOMER_REFERRAL_LINK)
		if (!inviteLink) return
		this.uiAction?.setReferralLink(inviteLink)
		const shareContainer = this.renderer?.shareContainer(inviteLink)
		shareContainer && this.uiAction?.appendShareContainer(shareContainer)
	}

	public onAffiliateTracked(trackingVars: TrackingAffiliateResponse) {
		if (trackingVars.status !== TrackingAffiliateResponseStatus.SUCCESS) return
		const interval = setInterval(() => {
			if (this.setting) {
				clearInterval(interval)
				if (this.uppromoteHelper.isCustomerReferralProgram(trackingVars.program_id, this.setting.program.program)) {
					this.uppromoteCookie.set(COOKIE_IS_CUSTOMER_REFERRAL_PROGRAM, '1')
					const ui = this.renderer?.renderShopNow()
					if (ui) this.uiAction?.onCloseShopNow(ui)
				}
			}
		}, 100)
		setTimeout(() => clearInterval(interval), 5e3)
	}

}

export default UppromoteCustomerReferral
