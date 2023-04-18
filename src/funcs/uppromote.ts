export default class Uppromote {
	protected uuid: string
	protected storeDomain: string

	constructor(uuid: string, storeDomain: string) {
		this.uuid = uuid
		this.storeDomain = storeDomain
	}

	storeTrackingVariables(): void {

	}
}
