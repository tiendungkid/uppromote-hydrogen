export default interface MessageBarSetting {
    referral_enable: 0 | 1 | boolean,
    referral_content: string,
    referral_font: string,
    referral_font_size: number,
    referral_text_color: string,
    referral_background_color: string,
    not_referral_enable: 0 | 1 | boolean,
    not_referral_content: string,
    not_referral_font: string,
    not_referral_font_size: number,
    not_referral_text_color: string,
    not_referral_background_color: string
}

export interface MessageBarAffiliateInfo {
    name: string
    first_name: string
    company: string
    personal_detail: string
}
