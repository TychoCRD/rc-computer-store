import { productList, getCheckoutList } from '@/app/_products'

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
