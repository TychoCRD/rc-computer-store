import { Product, CheckoutProduct, SkuId, productList } from "./_products"

type NicePromotionType = 'SINGLE_PRODUCT' | 'ALL_SKU_PRODUCTS' | 'BUNDLE_PRODUCT'

type Bundle = {
  sku: SkuId
  bundleQuantity: number
  bundlePrice: number
}
type NicePromotion = {
  id: number
  relevantSku: SkuId // unique; 1 promotion limit per sku
  qualifyingAmount: number
  promotionType: NicePromotionType
  promotionPrice?: number
  cardPromotionText: string
  checkoutPromotionText: string
  bundle?: Bundle
}

// Back-end data (edit/create via staff access form, no deployment necessary)
const nicePromotions: NicePromotion[] = [
  {
    id: 1,
    relevantSku: 'atv',
    qualifyingAmount: 3,
    promotionType: 'SINGLE_PRODUCT',
    promotionPrice: 0,
    cardPromotionText: 'Purchase 3 Apple TVs, get 1 free!',
    checkoutPromotionText: 'With the purchase of 3 Apple TVs, you get 1 free!',
    bundle: undefined
  },
  {
    id: 2,
    relevantSku: 'ipd',
    qualifyingAmount: 5,
    promotionType: 'ALL_SKU_PRODUCTS',
    promotionPrice: 499.99,
    cardPromotionText: '$499.99 each when 5 or more purchased!',
    checkoutPromotionText: 'All iPads are $499.99 each when 5 or more are purchased',
    bundle: undefined
  },
  {
    id: 3,
    relevantSku: 'mbp',
    qualifyingAmount: 1,
    promotionType: 'BUNDLE_PRODUCT',
    promotionPrice: undefined,
    cardPromotionText: 'Get a free VGA with each purchase!',
    checkoutPromotionText: 'A free VGA adapter is included with every Macbook Pro purchase',
    bundle: {
      sku: 'vga',
      bundleQuantity: 1,
      bundlePrice: 0
    }
  },
]

export function addNicePromotions (cartList: CheckoutProduct[]): CheckoutProduct[] {
  const clearPromotionList = cartList.map(product => {
    return {
      ...product,
      finalPrice: undefined,
      promotionDescription: undefined
    }
  })
  let checkoutList: CheckoutProduct[] = clearPromotionList
  const checkoutSkuList = checkoutList.map(product => product.sku)
  nicePromotions.forEach(promotion => {
    if (checkoutSkuList.includes(promotion.relevantSku)) {
      checkoutList = addPromotionFnMap[promotion.promotionType](checkoutList, promotion)
    }
  })
  return checkoutList
}

const addPromotionFnMap: {[key in NicePromotionType]: (list: CheckoutProduct[], promo: NicePromotion) => CheckoutProduct[]} = {
  'ALL_SKU_PRODUCTS': handleAllSkuProductPromotion,
  'SINGLE_PRODUCT': handleSingleProductPromotion,
  'BUNDLE_PRODUCT': handleBundlePromotion
}

function handleSingleProductPromotion (cartList: CheckoutProduct[], promotion: NicePromotion): CheckoutProduct[] {
  const {
    qualifyingAmount,
    relevantSku,
    promotionPrice,
    checkoutPromotionText
  } = promotion
  const relevantProducts = cartList.filter(product => product.sku === relevantSku)
  if (relevantProducts.length >= qualifyingAmount) {
    let promoProductCounter = 0
    return cartList.map(product => {
      const isProductMatch = product.sku === relevantSku
      if (isProductMatch && promoProductCounter === promotion.qualifyingAmount - 1) {
        return {
          ...product,
          promotionDescription: checkoutPromotionText,
          finalPrice: promotionPrice !== undefined ? promotionPrice : product.price
        }
      } else if (isProductMatch) {
        promoProductCounter++
      }
      return product
    })
  }
  return cartList
} 

function handleAllSkuProductPromotion (cartList: CheckoutProduct[], promotion: NicePromotion): CheckoutProduct[] {
  const {
    qualifyingAmount,
    relevantSku,
    promotionPrice,
    checkoutPromotionText
  } = promotion
  const relevantProducts = cartList.filter(product => product.sku === relevantSku)
  if (relevantProducts.length >= qualifyingAmount) {
    return cartList.map(product => {
      const isProductMatch = product.sku === relevantSku
      if (isProductMatch) {
        return {
          ...product,
          promotionDescription: checkoutPromotionText,
          finalPrice: promotionPrice !== undefined ? promotionPrice : product.price
        }
      }
      return product
    })
  }
  return cartList
} 

function handleBundlePromotion (cartList: CheckoutProduct[], promotion: NicePromotion): CheckoutProduct[] {
  const {
    qualifyingAmount,
    relevantSku,
    checkoutPromotionText
  } = promotion
  const bundle = promotion.bundle as Bundle
  const relevantProducts = cartList.filter(product => product.sku === relevantSku)
  if (relevantProducts.length >= qualifyingAmount) {
    const qualifyingCount = relevantProducts.length
    let bundleProductTarget = qualifyingCount * bundle.bundleQuantity
    let newCartList: CheckoutProduct[] = []
    cartList.forEach(product => {
      const isProductMatch = product.sku === bundle.sku
      if (isProductMatch) {
        newCartList.push({
          ...product,
          promotionDescription: checkoutPromotionText,
          finalPrice: bundle.bundlePrice
        })
        bundleProductTarget--
      } else {
        newCartList.push(product)
      }
    })
    const targetProduct = productList.find(product => product.sku === bundle.sku) as Product
    for (let count = 1; count <= bundleProductTarget; count++) {
      newCartList.push({
        ...targetProduct,
        id: String(Date.now()),
        promotionDescription: checkoutPromotionText,
        finalPrice: bundle.bundlePrice
      })
    }
    return newCartList
  }
  return cartList
} 