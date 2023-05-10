export interface AffiliateCouponResponse {
	coupon?: string | null,
	status: 'ok' | 'error'
	message?: string
}

export interface RegisterCustomerReferralResponse {
	data: string
	error: string
}