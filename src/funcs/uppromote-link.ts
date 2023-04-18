import * as config from '../uppromote.shop.config.json'

export default class UppromoteLink {
	private readonly hashCodeParamName: string = 'sca_ref'
	protected url: URL

	constructor(url: URL) {
		this.url = url
	}

	getHashCode() {
		return this.url.searchParams.get(
			this.hashCodeParamName
		)
	}

	isReferralLink(): boolean {
		const hashCode = this.getHashCode()
		if (!hashCode) return false
		const match = hashCode.match(/^[0-9]+\.[0-9a-zA-Z]+$/g)
		if (Array.isArray(match)) return match.length > 0
		return false
	}

	getAffiliateId(): number | null {
		const hashCode = this.getHashCode()
		if (!hashCode) return null
		const match = hashCode.match(/^[0-9]+\./g)
		if (!Array.isArray(match) || match.length < 1) return null
		return parseInt(match[0].replaceAll('.', ''))
	}

	getHash(): string | null {
		const hashCode = this.getHashCode()
		if (!hashCode) return null
		const match = hashCode.match(/\.[a-zA-Z0-9]+$/g)
		if (!Array.isArray(match) || match.length < 1) return null
		return match[0].replaceAll('.', '')
	}

	isRegisterPage() {
		let registerPath = config.registerPath
		let currentPath = this.url.pathname
		registerPath = registerPath.replace(/^\/+/, '').replace(/\/+$/, '')
		currentPath = currentPath.replace(/^\/+/, '').replace(/\/+$/, '')
		return registerPath === currentPath
	}
}
