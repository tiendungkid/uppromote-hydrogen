export const CART_QUERY = `
    query ($cartId: ID!, $country: CountryCode, $language: LanguageCode)
        @inContext(country: $country, language: $language) {
        cart(id: $cartId) {
            id
            checkoutUrl
        }
    }
`
