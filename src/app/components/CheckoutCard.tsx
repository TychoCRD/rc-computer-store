import {TrashIcon} from "@heroicons/react/20/solid"
import {CheckoutProduct, ProductCardT, SkuId, getCheckoutPrePromotionTotal, getCheckoutTotal} from "../_products"
import CartQuantityAdjuster from "./CartQuantityAdjuster"

type CheckoutCardProps = {
  checkoutProductList: CheckoutProduct[]
  addProductToCart(cardData: ProductCardT): void
  removeProductFromCart(sku: SkuId): void
  clearProductFromCart(sku: SkuId): void
}

export default function CheckoutCard({...props}: CheckoutCardProps) {
  const {checkoutProductList} = props
  const cartQuantity = checkoutProductList.length
  const productName = checkoutProductList[0].name
  const productSku = checkoutProductList[0].sku
  const listFinalTotal = getCheckoutTotal(checkoutProductList).toFixed(2)
  const listPrePromotionTotal = getCheckoutPrePromotionTotal(checkoutProductList).toFixed(2)
  const productWithPromotion = checkoutProductList.find(product => product.promotionDescription)
  const promotionDescription = productWithPromotion ? productWithPromotion.promotionDescription as string : ''
  return (
    <div className="flex flex-col border-b-1 border-solid border-b border-gray-200 p-4 w-full">
      <section className="flex font-medium items-center justify-between mb-2">
        <span className="text-lg">
          {productName}
        </span>
        <span className="text-lg">${listFinalTotal}</span>
      </section>
      <section className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <button role="clear-btn" className="text-gray-500 w-[24px] cursor-pointer mr-4"
            onClick={() => props.clearProductFromCart(productSku)}><TrashIcon/></button>
          <span className="text-gray-500 text-lg mr-2">Quantity: 
          </span>
          <CartQuantityAdjuster
            cartQuantity={cartQuantity}
            addProductToCart={() => props.addProductToCart(checkoutProductList[0])}
            removeProductFromCart={() => props.removeProductFromCart(productSku)}/>
        </div>
        {listPrePromotionTotal !== listFinalTotal && (
          <div data-testid="promotion-price" className="mr-2 text-xl text-orange-600 line-through">${listPrePromotionTotal}</div>
        )}
      </section>
      {promotionDescription.length > 0 && (
        <section data-testid="promotion-text" className="text-base text-orange-600 italic">{promotionDescription}</section>
        )}
    </div>
  )
}