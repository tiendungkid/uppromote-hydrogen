export default interface CustomerReferralUi {
    container: HTMLElement | HTMLDivElement
    button: HTMLElement | HTMLButtonElement
    closeButton: HTMLElement | HTMLSpanElement
    inviteContainer: HTMLElement | HTMLDivElement
    closeInvitePopupButton: HTMLElement | HTMLButtonElement
    inviteContentContainer: HTMLDivElement
    inviteInput: HTMLInputElement
    getInviteLinkButton: HTMLButtonElement
    errorText: HTMLElement | HTMLParagraphElement
}

export interface CustomerReferralShopNowUi {
    overlay: HTMLDivElement | HTMLElement
    container: HTMLDivElement| HTMLElement
    closeButton: HTMLElement | HTMLButtonElement
    shopNowButton: HTMLElement | HTMLButtonElement
}
