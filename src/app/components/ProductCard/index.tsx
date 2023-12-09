import { ProductCardT, SkuId } from "@/app/Checkout/_products"
import { MinusSmallIcon, PlusSmallIcon, ShoppingCartIcon } from "@heroicons/react/20/solid"

type ProductCardProps = {
  cartQuantity: number
  cardData: ProductCardT
  removeProductFromCart(sku: SkuId): void
  addProductToCart(cardData: ProductCardT): void
}

export default function ProductCard({ ...props }: ProductCardProps) {
  return (
    <div
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
           {props.cardData.name}
          </span>
        </h3>
        <p className="text-base font-medium text-gray-900">${props.cardData.price}</p>
        <div className="h-[30%]">
         {props.cardData.cardPromotionText && (
            <p className="text-xs text-orange-600">PROMOTION:{props.cardData.cardPromotionText}</p>
          )}
        </div>
        {props.cartQuantity > 0 && (
          <div className="flex items-center">
            <div className="border rounded-lg text-gray-800 border-solid w-[24px] cursor-pointer"
              onClick={() => props.removeProductFromCart(props.cardData.sku)}><MinusSmallIcon/></div>
            <span className="mx-2">{props.cartQuantity}</span>
            <div className="border rounded-lg text-gray-800 border-solid w-[24px] cursor-pointer"
              onClick={() => props.addProductToCart(props.cardData)}><PlusSmallIcon/></div>
            <div className="text-gray-400 w-[24px] ml-2"><ShoppingCartIcon/></div>
          </div>
        )}
        {props.cartQuantity === 0 && (
          <button
            type="button"
            className="inline-flex w-auto justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 mb-4 disabled:opacity-25 cursor-pointer"
          onClick={() => props.addProductToCart(props.cardData)}>
            Add to cart
          </button>
        )}
      </div>
    </div>
  )
}