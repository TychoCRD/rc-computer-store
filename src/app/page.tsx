
'use client'
import { useEffect, useState } from "react"
import { ProductCard, CheckoutProduct, SkuId, getProductCardList, productList, CartProduct, getCheckoutList } from "./Checkout/_products"
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/20/solid"

export default function Home() {
  const cardList = getProductCardList(productList)
  const [preCartList, setPreCartList] = useState<CartProduct[]>([])
  const [finalCheckoutList, setFinalCheckoutList] = useState<CheckoutProduct[]>([])
  function addProductToCart (product: ProductCard): void {
    const payload = {
      ...product,
      id: String(Date.now())
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
  function getCartQuantity (sku: SkuId): number {
    return preCartList.filter(product => product.sku === sku).length
  }
  useEffect(() => {
    console.log('process checkout')
    // Process Final Checkout with Promotions
    const checkoutList = getCheckoutList(preCartList)
    setFinalCheckoutList(checkoutList)
  }, [preCartList])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-sm lg:flex">
        {cardList.map(card => (
          <div
          key={card.sku}
          className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white w-[400px] h-[250px] mr-4 mb-4"
        >
          <div className="bg-gray-200">
            {/* <img
              src={card.imageSrc}
              alt={card.imageAlt}
              className="h-full w-full object-cover object-center sm:h-full sm:w-full"
            /> */}
          </div>
          <div className="flex flex-1 flex-col space-y-2 p-4">
            <h3 className="text-sm font-medium text-gray-900">
              <span className="text-2xl">
                {card.name}
              </span>
            </h3>
            <p className="text-base font-medium text-gray-900">${card.price}</p>
            <div className="h-[30%]">
              {card.cardPromotionText && (
                <p className="text-xs text-orange-600">PROMOTION: {card.cardPromotionText}</p>
              )}
            </div>
            {getCartQuantity(card.sku) > 0 && (
              <div className="flex">
                <div className="border rounded-lg text-gray-800 border-solid w-[24px] cursor-pointer"
                  onClick={() => removeProductFromCart(card.sku)}><MinusSmallIcon/></div>
                <span className="mx-2">{getCartQuantity(card.sku)}</span>
                <div className="border rounded-lg text-gray-800 border-solid w-[24px] cursor-pointer"
                  onClick={() => addProductToCart(card)}><PlusSmallIcon/></div>
              </div>
            )}
            {getCartQuantity(card.sku) === 0 && (
              <button
                type="button"
                className="inline-flex w-auto justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 mb-4 disabled:opacity-25 cursor-pointer"
              onClick={() => addProductToCart(card)}>
                Add to cart
              </button>
            )}
          </div>
        </div>
        ))}
      </div>
      <div>
        {finalCheckoutList.map(product => (
          <div key={product.id}>{`${product.id}: ${product.sku}, ${product.price}`}</div>
        ))}
      </div>
    </main>
  )
}
