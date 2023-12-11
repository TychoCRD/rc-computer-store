import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/20/solid"

type CartQuantityAdjusterProps = {
  cartQuantity: number
  removeProductFromCart(): void
  addProductToCart(): void
}

export default function CartQuantityAdjuster({ ...props }: CartQuantityAdjusterProps) {
  return (
    <div className="flex items-center">
      <button role="remove-btn" className="border rounded-lg text-gray-800 border-solid w-[24px] cursor-pointer"
        onClick={props.removeProductFromCart}><MinusSmallIcon/></button>
      <span className="mx-2">{props.cartQuantity}</span>
      <button role="add-btn" className="border rounded-lg text-gray-800 border-solid w-[24px] cursor-pointer"
        onClick={props.addProductToCart}><PlusSmallIcon/></button>
    </div>
  )
}