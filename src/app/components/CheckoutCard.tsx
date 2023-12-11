import { CheckoutProduct, ProductCardT, SkuId } from "../_products"

type CheckoutCardProps = {
  checkoutProductList: CheckoutProduct[]
  removeProductFromCart(sku: SkuId): void
  addProductToCart(cardData: ProductCardT): void
}

export default function CheckoutCard({ ...props }: CheckoutCardProps) {
  return (
    <div className="flex flex-col border-b-1 border-solid border border-gray-200 px-4">
      
    </div>
  )
}