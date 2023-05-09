import UppromoteApi from '../uppromote-api'
import UppromoteHelpers from '../uppromote-helpers'
import CustomerReferralSetting from '../../types/customer-referral-setting'
import UppromoteCookie from '../uppromote-cookie'
import CustomerReferralRenderer from './renderer'
import CustomerReferralUi from '../../types/customer-referral-ui'
import CustomerReferralUIAction from './action'

class UppromoteCustomerReferral {
	protected readonly uppromoteApi: UppromoteApi
	protected readonly uppromoteHelper: UppromoteHelpers
	protected readonly uppromoteCookie: UppromoteCookie
	protected renderer: CustomerReferralRenderer | undefined
	protected setting: CustomerReferralSetting | null
	protected ui: CustomerReferralUi | null

	constructor() {
		this.uppromoteApi = new UppromoteApi()
		this.uppromoteHelper = new UppromoteHelpers()
		this.uppromoteCookie = new UppromoteCookie()
		this.setting = null
		this.ui = null
	}

	run() {
		this.uppromoteApi
			.getCustomerReferralSetting()
			.then(setting => this.render(setting))
	}

	render(setting: CustomerReferralSetting): void {
		if (!setting || !setting.program.active || this.uppromoteCookie.isClosedCustomerReferral()) return
		this.setting = setting
		this.renderer = new CustomerReferralRenderer(setting)
		this.uppromoteHelper.loadCustomerReferralStyle()
		this.ui = this.renderer.renderCustomerReferral()
		this.addEventListener()
	}

	private addEventListener() {
		if (!this.ui || !this.setting) return
		const customerReferralAction = new CustomerReferralUIAction(
			this.setting,
			this.ui
		)
		const actions = [
			{
				element: this.ui.button,
				event: 'click',
				action: () => customerReferralAction.onButtonClicked()
			},
			{
				element: this.ui.closeButton,
				event: 'click',
				action: () => customerReferralAction.onCloseButton()
			},
			{
				element: this.ui.closeInvitePopupButton,
				event: 'click',
				action: () => customerReferralAction.onButtonClicked()
			},
			{
				element: this.ui.getInviteLinkButton,
				event: 'click',
				action: () => customerReferralAction.prepareRegister(
					customerReferralAction.copyInviteLink,
					() => customerReferralAction.renderErrorMessage('Please enter a valid email address'),
					this.registerCustomer
				)
			}
		]
		actions.forEach((action) => action.element.addEventListener(action.event, action.action))
	}

	private registerCustomer(email: string) {
		alert(email)
	}
}

export default UppromoteCustomerReferral
