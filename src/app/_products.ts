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
    name: 'VGA adapter',
    price: 30.00,
  },
]

export interface ProductCardT extends Product {
  cardPromotionText?: string
}
export interface CartProduct extends Product {
  id: string
  finalPrice: number | undefined
}
export function getProductCardList (checkoutList: Product[]): ProductCardT[] {
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
      return cartList.filter(product => product.sku === 'atv').length > 2
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
              finalPrice: 0,
              promotionDescription: this.checkoutDescription
            }
          }
          return product
        })
      }
      return cartList
    }
  },
  'ipd': {
    cardDescription: '$499.99 each when 5 or more purchased!',
    checkoutDescription: 'All iPads are $499.99 each when 5 or more are purchased',
    checkQualification (cartList: CheckoutProduct[]): boolean {
      return cartList.filter(product => product.sku === 'ipd').length > 4
    },
    addPromotion (cartList: CheckoutProduct[]): CheckoutProduct[] {
      if (this.checkQualification(cartList)) {
        return cartList.map(product => {
          if (product.sku === 'ipd') {
            return {
              ...product,
              finalPrice: 499.99,
              promotionDescription: this.checkoutDescription
            }
          }
          return product
        })
      }
      return cartList
    }
  },
  'mbp': {
    cardDescription: 'Get a free VGA with each purchase!',
    checkoutDescription: 'Each purchased MacBook Pro includes a free VGA adapter',
    checkQualification (cartList: CheckoutProduct[]): boolean {
      return cartList.filter(product => product.sku === 'mbp').length > 0
    },
    addPromotion (cartList: CheckoutProduct[]): CheckoutProduct[] {
      if (this.checkQualification(cartList)) {
        const mbpNumber = cartList.filter(product => product.sku === 'mbp').length
        let freeVgaCount = 0
        const promotionList = cartList.map(product => {
          if (product.sku === 'vga' && freeVgaCount < mbpNumber) {
            freeVgaCount++
            return {
              ...product,
              finalPrice: 0,
              promotionDescription: this.checkoutDescription
            }
          }
          return product
        })
        if (freeVgaCount < mbpNumber) {
          const vgaProduct = productList.find(product => product.sku === 'vga') as Product
          let addVgaCount = mbpNumber - freeVgaCount
          for (let count = 1; count <= addVgaCount; count++) {
            promotionList.push({
              ...vgaProduct,
              id: String(Date.now()),
              finalPrice: 0,
              promotionDescription: this.checkoutDescription
            })
          }
        }
        return promotionList
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

export function getCheckoutTotal (checkoutList: CheckoutProduct[]) {
  return checkoutList.reduce((acc, cur) => {
    const addPrice = cur.finalPrice !== undefined ? cur.finalPrice : cur.price
    return acc + addPrice
  }, 0)
}

export function getCheckoutPrePromotionTotal (checkoutList: CheckoutProduct[]) {
  return checkoutList.reduce((acc, cur) => {
    return acc + cur.price
  }, 0)
}

