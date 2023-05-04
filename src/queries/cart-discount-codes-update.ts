export const CART_DISCOUNT_CODES_UPDATE = `
mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!], $country: CountryCode = ZZ)
    @inContext(country: $country) {
        cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
            cart {
                id
                discountCodes {
                    code
                }
            }
            errors: userErrors {
                field
                message
            }
        }
    }
`
