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
				console.log(response)
			})
			.finally(() => {
				this.uiAction?.disableRegisterButton(false)
			})
	}
}

export default UppromoteCustomerReferral
