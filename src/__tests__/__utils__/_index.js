import { productList, getCheckoutList } from '@/app/_products'
import { addNicePromotions } from '@/app/_niceToHavePromotions'

export function buildCheckoutCart (skuList) {
  let cartProductList = []
  skuList.forEach(sku => {
    const product = productList.find(product => product.sku === sku)
    cartProductList.push({
      ...product, 
      id: String(Date.now())
    })
  })
  const checkoutList = getCheckoutList(cartProductList)
  return checkoutList
}

export function buildNiceCheckoutCart (skuList) {
  let cartProductList = []
  skuList.forEach(sku => {
    const product = productList.find(product => product.sku === sku)
    cartProductList.push({
      ...product, 
      id: String(Date.now())
    })
  })
  const checkoutList = addNicePromotions(cartProductList)
  return checkoutList
}
