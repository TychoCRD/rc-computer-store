import { productList, getCheckoutList, sum } from '../app/_products'

function buildCart (skuList, productList) {
  let cartProductList = []
  skuList.forEach(sku => {
    const product = productList.find(product => product.sku === sku)
    cartProductList.push({
      ...product, 
      id: String(Date.now())
    })
  })
  return cartProductList
}

describe('getCheckoutList Function', () => {
  test('SKUs Scanned: atv, atv, atv, vga Total expected: $249.00', () => {
    const skuList = ['atv', 'atv', 'atv', 'vga']
    const cartProductList = buildCart(skuList, productList)
    const checkoutList = getCheckoutList(cartProductList)
    const total = checkoutList.reduce((acc, cur) => (acc + cur.price), 0)
    expect(total).toBe(249);
  })
  test('SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd Total expected: $2718.95', () => {
    const skuList = ['atv', 'ipd', 'ipd', 'atv', 'ipd', 'ipd', 'ipd']
    const cartProductList = buildCart(skuList, productList)
    const checkoutList = getCheckoutList(cartProductList)
    const total = checkoutList.reduce((acc, cur) => (acc + cur.price), 0)
    expect(total).toBe(2718.95);
  })
  test('SKUs Scanned: mbp, vga, ipd Total expected: $1949.98', () => {
    const skuList = ['mbp', 'vga', 'ipd']
    const cartProductList = buildCart(skuList, productList)
    const checkoutList = getCheckoutList(cartProductList)
    const total = checkoutList.reduce((acc, cur) => (acc + cur.price), 0)
    expect(total).toBe(2718.95);
  })
})

