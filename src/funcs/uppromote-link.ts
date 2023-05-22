import ReferralLinkParams from '../types/referral-link-params'
import UppromoteCredential from '../types/credential'

export default class UppromoteLink {
	private credential: UppromoteCredential
	private readonly hashCodeParamName: string = 'sca_ref'
	protected url: URL

	constructor(credentials: UppromoteCredential) {
		this.credential = credentials
		if (typeof window === 'undefined')
			throw new Error('Not found window property.')
		this.url = new URL(
			window.location.href
		)
	}

	getSearch(): URLSearchParams {
		return this.url.searchParams
	}

	getHashCode() {
		return this.url.searchParams.get(
			this.hashCodeParamName
		)
	}

	getSource() {
		return this.url.searchParams.get('sca_source')
	}

	getDecodedReferralLink(): ReferralLinkParams | null {
		const [
			aid,
			hc,
			s,
			ug,
			tid,
			sca_source
		] = [
			this.getAffiliateId(),
			this.getHash(),
			this.credential.storeDomain,
			this.getUserAgent(),
			null,
			this.getSource()
		]
		if (aid && hc && s) return {
			aid,
			hc,
			s,
			ug,
			tid,
			sca_source
		}
		return null
	}

	getUserAgent(): string {
		return navigator.userAgent
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
}
