
'use client'
import { Fragment, useState } from "react"
import { ProductCardT, CheckoutProduct, SkuId, getProductCardList, productList, getCheckoutList, getCheckoutTotal } from "./_products"
import ProductCard from "./components/ProductCard"
import CheckoutCard from "./components/CheckoutCard"
import { ShoppingCartIcon } from "@heroicons/react/20/solid"
import PaymentModal from "./components/PaymentModal"

export default function Home() {
  const cardList = getProductCardList(productList)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
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
    const newCartList = [...finalCheckoutList, payload]
    const newCheckoutList = getCheckoutList(newCartList)
    setFinalCheckoutList(newCheckoutList)
  }
  function removeProductFromCart (sku: SkuId): void {
    const newCartList: CheckoutProduct[] = []
    let removeCounter = 0
    finalCheckoutList.forEach(product => {
      if (product.sku === sku && removeCounter === 0) {
        removeCounter++
        return
      } else {
        newCartList.push(product)
      }
    })
    const newCheckoutList = getCheckoutList(newCartList)
    setFinalCheckoutList(newCheckoutList)
  }
  function clearProductFromCart (sku: SkuId): void {
    const newCartList = finalCheckoutList.filter(product => product.sku !== sku)
    const newCheckoutList = getCheckoutList(newCartList)
    setFinalCheckoutList(newCheckoutList)
  }
  function getCartQuantity (sku: SkuId): number {
    return finalCheckoutList.filter(product => product.sku === sku).length
  }
  function finishPayment (): void {
    setFinalCheckoutList([])
    setShowPaymentModal(false)
  }
  return (
    <main className="flex min-h-screen justify-between pl-10">
      <section className="flex flex-col items-center flex-1">
        <h2 className="text-5xl text-indigo-600 italic mx-auto my-[60px]">RC Computer Store</h2>
        <div className="text-sm flex flex-wrap justify-around content-center w-[700px] mx-auto">
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
      </section>
      <div className="flex flex-col shrink-0 justify-start items-center w-[30%] border-l border-gray-200">
        <section className="text-4xl flex justify-center mb-4 border-b border-gray-200 w-full py-6 font-semibold text-green-600">CHECKOUT <ShoppingCartIcon className="ml-2 w-[36px]"/></section>
        {uniqueCheckoutSku.map(sku => (
          <Fragment key={sku}>
            <CheckoutCard
              key={sku}
              checkoutProductList={finalCheckoutList.filter(product => product.sku === sku)}
              addProductToCart={addProductToCart}
              removeProductFromCart={removeProductFromCart}
              clearProductFromCart={clearProductFromCart}/>
          </Fragment>
        ))}
        {uniqueCheckoutSku.length > 0 && (
          <section className="flex flex-col mt-4 w-full">
            <div className="flex justify-between p-4">
              <span className="text-4xl">Total:</span>
              <span className="text-4xl">${getCheckoutTotal(finalCheckoutList).toFixed(2)}</span>
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
