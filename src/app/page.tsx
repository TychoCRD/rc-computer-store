
'use client'
import { useEffect, useState } from "react"
import { ProductCardT, CheckoutProduct, SkuId, getProductCardList, productList, CartProduct, getCheckoutList, getCheckoutTotal } from "./_products"
import ProductCard from "./components/ProductCard"
import CheckoutCard from "./components/CheckoutCard"
import { ShoppingCartIcon } from "@heroicons/react/20/solid"
import PaymentModal from "./components/PaymentModal"

export default function Home() {
  const cardList = getProductCardList(productList)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
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
  function finishPayment (): void {
    setPreCartList([])
    setShowPaymentModal(false)
  }
  useEffect(() => {
    // Process Final Checkout with Promotions
    const checkoutList = getCheckoutList(preCartList)
    setFinalCheckoutList(checkoutList)
  }, [preCartList])
  return (
    <main className="flex min-h-screen justify-between pl-10">
      <div className="flex-1 font-sans text-sm flex flex-wrap overflow py-10 items-center justify-center content-center">
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
      <div className="flex flex-col shrink-0 justify-start items-center w-[30%] border-l border-gray-200 py-4">
        <section className="text-4xl flex justify-center mb-4 border-b border-gray-200 w-full py-2 font-semibold text-green-600">CHECKOUT <ShoppingCartIcon className="ml-2 w-[36px]"/></section>
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
        {uniqueCheckoutSku.length > 0 && (
          <section className="flex flex-col mt-4 w-full">
            <div className="flex justify-between p-4">
              <span className="text-4xl">Total:</span>
              <span className="text-4xl">${getCheckoutTotal(finalCheckoutList)}</span>
            </div>
            <div className="flex self-end p-4 w-full">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-2xl font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2 mb-4 disabled:opacity-25 cursor-pointer"
                onClick={() => setShowPaymentModal(true)}>
                Pay now
              </button>
            </div>
          </section>
        )}
      </div>
      <PaymentModal
        show={showPaymentModal}
        closeHandler={() => finishPayment()}/>
    </main>
  )
}
