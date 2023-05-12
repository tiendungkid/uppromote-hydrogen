interface ShareIcons {
    icon: string
    alt: string
    link: string
}

const getShareIcons = (shareLink: string): ShareIcons[] => {
	return [
		{
			icon: 'https://cdn.uppromote.com/storage/uploads/icons/facebook.svg',
			alt: 'facebook',
			link: 'https://facebook.com/sharer/sharer.php?u=' + shareLink
		},
		{
			icon: 'https://cdn.uppromote.com/storage/uploads/icons/twitter.svg',
			alt: 'twitter',
			link: 'https://twitter.com/intent/tweet/?text=&url=' + shareLink
		},
		{
			icon: 'https://cdn.uppromote.com/storage/uploads/icons/pinterest.svg',
			alt: 'pinterest',
			link: 'https://pinterest.com/pin/create/button/?url=' + shareLink
		},
		{
			icon: 'https://cdn.uppromote.com/storage/uploads/icons/linkedin.svg',
			alt: 'linkedin',
			link: `https://www.linkedin.com/shareArticle?mini=true&url=${shareLink}&title=&summary=&source=${shareLink}`
		},
		{
			icon: 'https://cdn.uppromote.com/storage/uploads/icons/reddit.svg',
			alt: 'reddit',
			link: `https://reddit.com/submit/?url=${shareLink}`
		},
		{
			icon: 'https://cdn.uppromote.com/storage/uploads/icons/mail.svg',
			alt: 'mail',
			link: `mailto:?subject=&body=${shareLink}`
		}
	]
}

export const CustomerReferralShareIcons = (shareLink: string) => getShareIcons(shareLink)
