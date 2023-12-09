
'use client'
import { useEffect, useState } from "react"
import { ProductCardT, CheckoutProduct, SkuId, getProductCardList, productList, CartProduct, getCheckoutList } from "./Checkout/_products"
import ProductCard from "./components/ProductCard"

export default function Home() {
  const cardList = getProductCardList(productList)
  const [preCartList, setPreCartList] = useState<CartProduct[]>([])
  const [finalCheckoutList, setFinalCheckoutList] = useState<CheckoutProduct[]>([])
  function addProductToCart (product: ProductCardT): void {
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
        {finalCheckoutList.map(product => (
          <>
            <div key={product.id}>
              <span>{`${product.id}: ${product.sku}, ${product.price}`}</span>
              {product.promotionDescription && (
                <div>{product.promotionDescription}</div>
              )}
            </div>
          </>
        ))}
      </div>
    </main>
  )
}
