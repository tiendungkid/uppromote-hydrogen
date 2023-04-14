export const CART_QUERY = `
query ($cartId: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
            edges {
                node {
                    id
                    quantity
                    cost {
                        totalAmount {
                            amount
                            currencyCode
                        }
                        amountPerQuantity {
                            amount
                            currencyCode
                        }
                        compareAtAmountPerQuantity {
                            amount
                            currencyCode
                        }
                    }
                    merchandise {
                        ... on ProductVariant {
                            id
                            availableForSale
                            compareAtPrice {
                                ...MoneyFragment
                            }
                            price {
                                ...MoneyFragment
                            }
                            requiresShipping
                            title
                            image {
                                ...ImageFragment
                            }
                            product {
                                handle
                                title
                                id
                            }
                            selectedOptions {
                                name
                                value
                            }
                        }
                    }
                }
            }
        }
        cost {
            subtotalAmount {
                ...MoneyFragment
            }
            totalAmount {
                ...MoneyFragment
            }
            totalDutyAmount {
                ...MoneyFragment
            }
            totalTaxAmount {
                ...MoneyFragment
            }
        }
        note
        attributes {
            key
            value
        }
        discountCodes {
            code
        }
    }
}

fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
}

fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
}
`
