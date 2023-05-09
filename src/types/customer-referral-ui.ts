export default interface CustomerReferralUi {
    container: HTMLElement | HTMLDivElement
    button: HTMLElement | HTMLButtonElement
    closeButton: HTMLElement | HTMLSpanElement
    inviteContainer: HTMLElement | HTMLDivElement
    closeInvitePopupButton: HTMLElement | HTMLButtonElement
    inviteInput: HTMLInputElement
    getInviteLinkButton: HTMLElement | HTMLButtonElement,
    errorText: HTMLElement | HTMLParagraphElement
}