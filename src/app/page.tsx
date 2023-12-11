
'use client'
import { useEffect, useState } from "react"
import { ProductCardT, CheckoutProduct, SkuId, getProductCardList, productList, CartProduct, getCheckoutList } from "./_products"
import ProductCard from "./components/ProductCard"
import CheckoutCard from "./components/CheckoutCard"

export default function Home() {
  const cardList = getProductCardList(productList)
  const [preCartList, setPreCartList] = useState<CartProduct[]>([])
  const [finalCheckoutList, setFinalCheckoutList] = useState<CheckoutProduct[]>([])
  const uniqueCheckoutSku = finalCheckoutList.reduce((acc: SkuId[], cur) => {
    return acc.includes(cur.sku) ? acc : acc.concat([cur.sku])
  }, [])
  function addProductToCart (product: ProductCardT | CheckoutProduct): void {
    const payload = {
      ...product,
      id: String(Date.now()),
      finalPrice: undefined
    }
    const newCartList = [...preCartList, payload]
    setPreCartList(newCartList)
  }
  function removeProductFromCart (sku: SkuId): void {
    const newCartList: CartProduct[] = []
    let removeCounter = 0
    preCartList.forEach(product => {
      if (product.sku === sku && removeCounter === 0) {
        removeCounter++
        return
      } else {
        newCartList.push(product)
      }
    })
    setPreCartList(newCartList)
  }
  function clearProductFromCart (sku: SkuId): void {
    const newCartList = preCartList.filter(product => product.sku !== sku)
    setPreCartList(newCartList)
  }
  function getCartQuantity (sku: SkuId): number {
    return preCartList.filter(product => product.sku === sku).length
  }
  useEffect(() => {
    // Process Final Checkout with Promotions
    const checkoutList = getCheckoutList(preCartList)
    setFinalCheckoutList(checkoutList)
  }, [preCartList])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-sm lg:flex">
        {cardList.map(card => (
          <ProductCard
            key={card.sku}
            cardData={card}
            cartQuantity={getCartQuantity(card.sku)}
            addProductToCart={addProductToCart}
            removeProductFromCart={removeProductFromCart}
          />
        ))}
      </div>
      <div>
        {uniqueCheckoutSku.map(sku => (
          <>
            <CheckoutCard
              key={sku}
              checkoutProductList={finalCheckoutList.filter(product => product.sku === sku)}
              addProductToCart={addProductToCart}
              removeProductFromCart={removeProductFromCart}
              clearProductFromCart={clearProductFromCart}/>
          </>
        ))}
      </div>
    </main>
  )
}
