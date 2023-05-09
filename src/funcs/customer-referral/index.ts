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
	protected uiAction: CustomerReferralUIAction | null

	constructor() {
		this.uppromoteApi = new UppromoteApi()
		this.uppromoteHelper = new UppromoteHelpers()
		this.uppromoteCookie = new UppromoteCookie()
		this.uiAction = null
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
		this.uiAction = new CustomerReferralUIAction(
			this.setting,
			this.ui
		)
		const actions = [
			{
				element: this.ui.button,
				event: 'click',
				action: () => this.uiAction?.onButtonClicked()
			},
			{
				element: this.ui.closeButton,
				event: 'click',
				action: () => this.uiAction?.onCloseButton()
			},
			{
				element: this.ui.closeInvitePopupButton,
				event: 'click',
				action: () => this.uiAction?.onButtonClicked()
			},
			{
				element: this.ui.getInviteLinkButton,
				event: 'click',
				action: () => this.uiAction?.prepareRegister(
					this.uiAction?.copyInviteLink,
					() => this.uiAction?.renderErrorMessage('Please enter a valid email address'),
					this.registerCustomer
				)
			}
		]
		actions.forEach((action) => action.element.addEventListener(action.event, action.action))
	}

	private registerCustomer(email: string){
		if (!this.uiAction) return
		alert(email)
	}
}

export default UppromoteCustomerReferral
