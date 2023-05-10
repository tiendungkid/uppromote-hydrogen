import CustomerReferralUi from '../../types/customer-referral-ui'
import CustomerReferralSetting from '../../types/customer-referral-setting'

class CustomerReferralUIAction {
	private readonly ui: CustomerReferralUi
	private readonly setting: CustomerReferralSetting

	constructor(setting: CustomerReferralSetting, ui: CustomerReferralUi) {
		this.setting = setting
		this.ui = ui
	}

	onButtonClicked() {
		if (!this.ui) return
		let showAnimateName = 'fadeInUp'
		let hideAnimateName = 'fadeOutDown'
		const inviteContainer = this.ui.inviteContainer
		const webPosition = this.ui.inviteContainer.dataset.webPosition || 'right-bottom'
		if (getComputedStyle(inviteContainer).display === 'none') {
			if (webPosition.includes('-bottom')) showAnimateName = 'fadeInUp'
			if (webPosition.includes('-center') || webPosition.includes('-top')) showAnimateName = 'fadeInDown'
			inviteContainer.style.animationName = showAnimateName
			setTimeout(() => inviteContainer.style.display = 'block', 100)
			return
		}
		if (webPosition.includes('-bottom')) hideAnimateName = 'fadeOutDown'
		if (webPosition.includes('-center') || webPosition.includes('-top')) hideAnimateName = 'fadeOutUp'
		inviteContainer.style.animationName = hideAnimateName
		setTimeout(() => inviteContainer.style.display = 'none', 500)
	}

	onCloseButton() {
		this.ui?.container.remove()
		sessionStorage.setItem('closed_refer_customer', '1')
	}

	prepareRegister(
		onCreatedCustomer: () => void,
		onInvalidEmail: () => void,
		onValidEmail: (email: string) => void
	) {
		if (!this.ui) return
		if (this.ui.getInviteLinkButton.hasAttribute('data-created-affiliate')) {
			onCreatedCustomer()
			return
		}
		const email = this.ui.inviteInput.value
		if (!email || !this.isValidEmail(email)) {
			onInvalidEmail()
			return
		}
		onValidEmail(email)
	}

	copyInviteLink() {
		if (!this.ui) return
		if (!this.setting) return
		const originButtonText = this.setting.design.refer_customer_invite.button_copy_invite
		const {inviteInput, getInviteLinkButton} = this.ui
		inviteInput.select()
		inviteInput.select()
		navigator.clipboard.writeText(inviteInput.value).then(() => {
			getInviteLinkButton.textContent = 'Copied!'
			setTimeout(() => {
				getInviteLinkButton.textContent = originButtonText
			}, 1e3)
		})
	}

	isValidEmail(email: string): boolean {
		return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,7})+$/.test(email)
	}

	renderErrorMessage(message: string | null) {
		this.ui.errorText.textContent = message
		this.ui.errorText.style.display = message ? 'block' : 'none'
	}

	getEmail(): string {
		return this.ui.inviteInput.value
	}
}

export default CustomerReferralUIAction
