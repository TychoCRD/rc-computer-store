import { buildNiceCheckoutCart } from "./__utils__/_index"
import { getCheckoutTotal } from "../app/_products"

describe('buildNiceCheckoutCart Function', () => {
  test('SKUs Scanned: atv, atv, atv, vga Total expected: $249.00', () => {
    const skuList = ['atv', 'atv', 'atv', 'vga']
    const checkoutList = buildNiceCheckoutCart(skuList)
    const total = getCheckoutTotal(checkoutList)
    expect(total).toBe(249);
  })
  test('SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd Total expected: $2718.95', () => {
    const skuList = ['atv', 'ipd', 'ipd', 'atv', 'ipd', 'ipd', 'ipd']
    const checkoutList = buildNiceCheckoutCart(skuList)
    const total = Number(getCheckoutTotal(checkoutList).toFixed(2))
    expect(total).toBe(2718.95);
  })
  test('SKUs Scanned: mbp, vga, ipd Total expected: $1949.98', () => {
    const skuList = ['mbp', 'vga', 'ipd']
    const checkoutList = buildNiceCheckoutCart(skuList)
    const total = Number(getCheckoutTotal(checkoutList).toFixed(2))
    expect(total).toBe(1949.98);
  })
  test('SKUs Scanned: mbp, vga, mbp, ipd Total expected: 5 items, $3349.97', () => {
    const skuList = ['mbp', 'vga', 'mbp', 'ipd']
    const checkoutList = buildNiceCheckoutCart(skuList)
    expect(checkoutList.length).toBe(5);
    const total = Number(getCheckoutTotal(checkoutList).toFixed(2))
    expect(total).toBe(3349.97);
  })
})

