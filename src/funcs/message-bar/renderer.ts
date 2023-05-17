import MessageBarSetting, {MessageBarAffiliateInfo} from '../../types/message-bar-setting'

class MessageBarRenderer {

	private readonly setting: MessageBarSetting

	constructor(setting: MessageBarSetting) {
		this.setting = setting
	}

	renderElement(elmName = 'div', classes?: string[], attributes?: { [key: string]: string }): HTMLElement {
		const element = document.createElement(elmName)
		if (classes) {
			classes.forEach(className => element.classList.add(className))
		}
		if (attributes) Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))
		return element
	}

	getCurrentMessageBar() {
		return document.querySelectorAll('.scaaf-message-bar')
	}

	injectGoogleFont(fontName: string) {
		const styleSheetTag = this.renderElement('link', [], {
			href: `https://fonts.googleapis.com/css?family=${fontName}`,
			rel: 'stylesheet',
			type: 'text/css'
		})
		document.head.append(styleSheetTag)
	}

	renderMessageBarWithAffiliate(affiliateInfo: MessageBarAffiliateInfo) {
		if (!this.setting.referral_content) return
		const font = this.setting.referral_font.replace(/\+/g, ' ').split(':')
		this.injectGoogleFont(this.setting.referral_font)
		const messageBarContainer = this.renderElement('div', ['scaaf-message-bar'])
		const messageBarContent = this.renderElement('p', ['scaaf-message-bar-content'])
		messageBarContainer.style.backgroundColor = this.setting.referral_background_color
		messageBarContent.style.color = this.setting.referral_text_color
		messageBarContent.style.fontSize = this.setting.referral_font_size + 'px'
		messageBarContent.style.fontFamily = `"${font[0]}", sans-serif`
		messageBarContent.innerHTML = this.setting.referral_content
			.replace('{affiliate_name}', affiliateInfo.name)
			.replace('{company}', affiliateInfo.company)
			.replace('{affiliate_firstname}', affiliateInfo.first_name)
			.replace('{personal_detail}', affiliateInfo.personal_detail)
		messageBarContainer.append(messageBarContent)
		document.body.prepend(messageBarContainer)
	}

	renderMessageBarWithoutAffiliate() {
		if (!this.setting.not_referral_content) return
		const systemFonts = 'Arial|Helvetica+Neue|Courier+New|Times+New+Roman|Comic+Sans+MS|Impact'.split('|')
		const font = this.setting.not_referral_font.replace(/\+/g, ' ').split(':')
		if (systemFonts.indexOf(this.setting.not_referral_font) === -1) {
			this.injectGoogleFont(this.setting.not_referral_font)
		}
		const messageBarContainer = this.renderElement('div', ['scaaf-message-bar'])
		const messageBarContent = this.renderElement('p', ['scaaf-message-bar-content'])
		messageBarContainer.style.backgroundColor = this.setting.not_referral_background_color
		messageBarContent.style.color = this.setting.not_referral_text_color
		messageBarContent.style.fontSize = this.setting.not_referral_font_size + 'px'
		messageBarContent.style.fontFamily = `"${font[0]}", sans-serif`
		messageBarContent.innerHTML = this.setting.not_referral_content
		messageBarContainer.append(messageBarContent)
		document.body.prepend(messageBarContainer)
	}
}

export default MessageBarRenderer
