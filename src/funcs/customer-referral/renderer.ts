import CustomerReferralSetting, {
	CustomerReferralDesignSetting,
	// CustomerReferralProgramSetting
} from '../../types/customer-referral-setting'
import CustomerReferralUi from '../../types/customer-referral-ui'

class CustomerReferralRenderer {
	// private readonly generalSetting: CustomerReferralProgramSetting
	private readonly designSetting: CustomerReferralDesignSetting

	constructor(setting: CustomerReferralSetting) {
		// this.generalSetting = setting.program
		this.designSetting = setting.design
	}

	renderCustomerReferral(): CustomerReferralUi {
		const container = this.container()
		const button = this.button()
		const closeButtonIcon = this.closeButtonIcon()
		const inviteContainer = this.inviteContainer()
		const closeButton = this.closeInviteButton()
		const inviteContentContainer = this.inviteContentContainer()
		const inviteHeader = this.inviteHeader()
		const inviteContent = this.inviteContent()
		const inputContainer = this.inviteInputContainer()
		const input = this.inviteInput()
		const inputAddon = this.inviteInputAddon()
		const errorText = this.errorContainer()
		button.append(closeButtonIcon)
		inputContainer.append(input, inputAddon)
		inviteContentContainer.append(inviteHeader, inviteContent, inputContainer, errorText)
		inviteContainer.append(closeButton, inviteContentContainer)
		container.append(inviteContainer, button)
		document.body.append(container)
		return {
			container,
			button,
			closeButton: closeButtonIcon,
			inviteContainer,
			closeInvitePopupButton: closeButton,
			inviteInput: input as HTMLInputElement,
			errorText,
			getInviteLinkButton: inputAddon as HTMLButtonElement
		}
	}


	protected renderElement(elmName = 'div', classes?: string[], attributes?: { [key: string]: string }): HTMLElement {
		const element = document.createElement(elmName)
		if (classes) {
			classes.forEach(className => element.classList.add(className))
		}
		if (attributes) Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))
		return element
	}

	protected container() {
		const design = this.designSetting.refer_customer_button
		return this.renderElement(
			'div',
			['sca_aff_customer_refer_container'],
			{
				'data-web-position': design.web_position,
				'data-mobile-position': design.mobile_position,
			}
		)
	}

	protected button() {
		const design = this.designSetting.refer_customer_button
		const button = this.renderElement('button', ['sca_aff_customer_refer_button'])
		const icon = this.renderElement('img', ['sca_aff_customer_refer_icon'], {
			src: 'https://cdn.uppromote.com/storage/feature-banner/gift.svg',
			alt: 'Customer Referral'
		})
		const text = this.renderElement('span')
		text.textContent = design.refer_button_text
		button.style.backgroundColor = design.refer_background_color
		button.style.color = design.refer_text_color
		button.prepend(icon, text)
		return button
	}

	protected closeButtonIcon() {
		const closeButton = this.renderElement('span', ['sca_aff_customer_refer_close_icon_button'])
		closeButton.innerHTML = '&times;'
		return closeButton
	}

	protected inviteContainer() {
		return this.renderElement('div', ['sca_aff_customer_refer_invite_container'])
	}

	protected closeInviteButton() {
		const button = this.renderElement(
			'button',
			['sca_aff_customer_refer_close_button'],
			{
				'type': 'button'
			}
		)
		button.innerHTML = '&times;'
		return button
	}

	protected inviteContentContainer() {
		return this.renderElement(
			'div',
			['sca_aff_customer_refer_invite_contents'],
		)
	}

	protected inviteHeader() {
		const header = this.renderElement(
			'h1',
			['sca_aff_customer_refer_invite_header']
		)
		header.textContent = this.designSetting.refer_customer_invite.popup_header
		return header
	}

	protected inviteContent() {
		const content = this.renderElement(
			'div',
			['sca_aff_customer_refer_invite_content']
		)
		content.textContent = this.designSetting.refer_customer_invite.popup_description
		return content
	}

	protected inviteInputContainer() {
		return this.renderElement('div', ['sca_aff_custom_invite_inputs'])
	}

	protected inviteInput() {
		return this.renderElement('input', ['sca_aff_custom_invite_input'], {
			type: 'email',
			name: 'sca_customer_refer_email',
			id: 'sca_customer_refer_email',
			placeholder: 'Your email address',
		})
	}

	protected inviteInputAddon() {
		const setting = this.designSetting.refer_customer_invite
		const getInviteLinkButton = this.renderElement('button', ['sca_aff_customer_refer_invite_button'])
		getInviteLinkButton.textContent = setting.button_text_get_invite
		getInviteLinkButton.style.backgroundColor = setting.popup_background_color
		getInviteLinkButton.style.color = setting.popup_text_color
		return getInviteLinkButton
	}

	protected errorContainer() {
		return this.renderElement(
			'p',
			['sca_aff_customer_invite_error']
		)
	}
}

export default CustomerReferralRenderer
