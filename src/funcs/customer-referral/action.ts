import CustomerReferralUi, {CustomerReferralShopNowUi} from '../../types/customer-referral-ui'
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

	createdCustomer() {
		return this.ui.getInviteLinkButton.hasAttribute('data-created-affiliate')
	}

	isValidEmail(): boolean {
		const email = this.ui.inviteInput.value
		return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,7})+$/.test(email)
	}

	renderErrorMessage(message: string | null) {
		this.ui.errorText.textContent = message
		this.ui.errorText.style.display = message ? 'block' : 'none'
	}

	getEmail(): string {
		return this.ui.inviteInput.value
	}

	setReferralLink(value: string) {
		this.ui.inviteInput.value = value
		this.ui.inviteInput.type = 'text'
		this.ui.inviteInput.setAttribute('readonly', '')
		this.ui.getInviteLinkButton.setAttribute('data-created-affiliate', 'true')
		this.ui.getInviteLinkButton.textContent = this.setting.design.refer_customer_invite.button_copy_invite
	}

	appendShareContainer(shareContainer: HTMLDivElement) {
		this.ui.inviteContentContainer.append(shareContainer)
	}

	disableRegisterButton(disable = true) {
		this.ui.getInviteLinkButton.disabled = disable
		this.ui.getInviteLinkButton.style.cursor = disable ? 'wait' : 'pointer'
	}

	onCloseShopNow(ui: CustomerReferralShopNowUi) {
		const onClose = (e: any) => {
			const classList = e.target.classList
			if (
				classList.contains('sca_aff_customer_refer_shop_now_overlay') ||
                classList.contains('sca_aff_customer_refer_close_shop_now_button') ||
                classList.contains('sca_aff_customer_refer_shop_now_button')
			) {
				ui.container.style.animationName = 'fadeOutUp'
				ui.overlay.style.animationName = 'fadeOut'
				setTimeout(() => {
					ui.overlay.style.display = 'none'
				}, 500)
			}
		}
		ui.overlay.addEventListener('click', onClose)
	}
}

export default CustomerReferralUIAction
