enum Received {
    YES = 'true',
    NO = 'false'
}

interface LocalTrackingVariables {
    received: Received
    affiliateId: string | number
    hashcode: string
    clickTime: string | number
    trackingId: string | number | null
    useragent: string | null
    source: string | null
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
