enum Received {
    YES = 'true',
    NO = 'false'
}

interface LocalTrackingVariables {
    received: Received
    hashcode: string
    clickTime: string | number
    affiliateId: string | number
    source?: string
}

interface ReceivedTrackingVariables {
    received: Received
    trackingId: string | number
    expire: number
    affiliateName?: string
    affiliateCompany?: string | null
    affiliateFirstName?: string | null
    affiliatePersonalDetail?: string | null
    enableAssignDownLine?: boolean
    cookieDays: number
}

export {
	Received,
	LocalTrackingVariables,
	ReceivedTrackingVariables,
}
