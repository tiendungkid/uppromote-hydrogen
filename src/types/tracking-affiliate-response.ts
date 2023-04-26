export enum TrackingAffiliateResponseStatus {
    SUCCESS = 'ok',
    FAILED = 'error'
}

export default interface TrackingAffiliateResponse {
    status: TrackingAffiliateResponseStatus,
    affcookie: number,
    afd: TrackingAffiliateDetailResponse,
    enable_assign_down_line: boolean,
    ep: number,
    message: string,
    program_id: number,
    tid: number
}

export interface TrackingAffiliateDetailResponse {
    affiliate_firstname: string,
    affiliate_name: string,
    company: string | null,
    personal_detail: string | null
}
