export type SkuId = 'ipd' | 'mbp' | 'atv' | 'vga'
type Product = {
  sku: SkuId
  name: string
  price: number
}
export const productList: Product[] = [
  {
    sku: 'ipd',
    name: 'Super iPad',
    price: 549.99,
  },
  {
    sku: 'mbp',
    name: 'MacBook Pro',
    price: 1399.99,
  },
  {
    sku: 'atv',
    name: 'Apple TV',
    price: 109.50,
  },
  {
    sku: 'vga',
    name: 'VGA adappter',
    price: 30.00,
  },
]

export interface ProductCard extends Product {
  cardPromotionText?: string
}
export interface CartProduct extends Product {
  id: string
}
export function getProductCardList (checkoutList: Product[]): ProductCard[] {
  return checkoutList.map(product => {
    const promotion = promotionMap[product.sku]
    if (promotion) {
      return {
        ...product,
        cardPromotionText: promotion.cardDescription
      }
    }
    return product
  })
}
export interface CheckoutProduct extends CartProduct {
  promotionDescription?: string
  bundle?: CheckoutProduct
}

type Promotion = {
  cardDescription: string
  checkoutDescription: string
  checkQualification (cartList: CheckoutProduct[]): boolean
  addPromotion (cartList: CheckoutProduct[]): CheckoutProduct[]
}
type PromotionMap = {
  [key in SkuId]?: Promotion
}
const promotionMap: PromotionMap = {
  'atv': {
    cardDescription: 'Purchase 3 Apple TVs, get 1 free!',
    checkoutDescription: 'With the purchase of 3 Apple TVs, get 1 free!',
    checkQualification (cartList: CheckoutProduct[]): boolean {
      return cartList.filter(product => product.sku === 'atv').length >= 3
    },
    addPromotion (cartList: CheckoutProduct[]): CheckoutProduct[] {
      if (this.checkQualification(cartList)) {
        let atvCounter = 0
        return cartList.map(product => {
          if (product.sku === 'atv') {
            atvCounter++
          }
          if (product.sku === 'atv' && atvCounter === 3) {
            return {
              ...product,
              price: 0,
              promotionDescription: this.checkoutDescription
            }
          }
          return product
        })
      }
      return cartList
    }
  },
}

export function getCheckoutList (cardList: CartProduct[]): CheckoutProduct[] {
  const promotionList = Object.values(promotionMap)
  let checkoutList: CheckoutProduct[] = cardList
  promotionList.forEach(promotion => {
    checkoutList = promotion.addPromotion(checkoutList)
  })
  return checkoutList
}