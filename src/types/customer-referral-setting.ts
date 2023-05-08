export default interface CustomerReferralSetting {
    program: CustomerReferralProgramSetting
    design: CustomerReferralDesignSetting
}

export interface CustomerReferralProgramSetting {
    active: boolean
    shop: string
    incentive: {
        type: 'percentage' | 'fixed'
        value: string
        price_rule_id: number
        coupon: string
    }
    program: string
}

export interface CustomerReferralDesignSetting {
    refer_customer_button: ButtonDesign
    refer_customer_invite: IncentiveDesign
    refer_customer_incentive_popup: IncentivePopupDesign
}

interface ButtonDesign {
    refer_button_text: string
    refer_background_color: string
    refer_text_color: string
    web_position: string
    mobile_position: string
}

interface IncentiveDesign {
    popup_header: string
    popup_description: string
    button_text_get_invite: string
    button_copy_invite: string
    popup_background_color: string
    popup_text_color: string
}

interface IncentivePopupDesign {
    shop_header: string
    shop_description: string
    shop_button_text: string
    shop_background_color: string
    shop_text_color: string
}
