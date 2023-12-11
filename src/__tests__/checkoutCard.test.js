import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CheckoutCard from '../app/components/CheckoutCard'
import { buildCheckoutCart } from './__utils__/_index'

describe('CheckoutCard', () => {
  it('Renders a card with cart adjustment buttons', () => {
    const skuList = ['atv', 'atv', 'ipd']
    const checkoutList = buildCheckoutCart(skuList)
    const mockRemoveFn = jest.fn()
    const mockAddFn = jest.fn()
    const mockClearItemFn = jest.fn()
    const cardProductList = checkoutList.filter(product => product.sku === 'atv')
    render(<CheckoutCard checkoutProductList={cardProductList} removeProductFromCart={mockRemoveFn} addProductToCart={mockAddFn} clearItemFromCart={mockClearItemFn}/>)
 
    const incrementCartButton = screen.getByRole('add-btn')
    const removeCartButton = screen.getByRole('remove-btn')
    const clearCartButton = screen.getByRole('clear-btn')
    expect(incrementCartButton).toBeInTheDocument()
    expect(removeCartButton).toBeInTheDocument()
    expect(clearCartButton).toBeInTheDocument()
    fireEvent.click(incrementCartButton)
    expect(mockAddFn).toHaveBeenCalledTimes(1)
    fireEvent.click(removeCartButton)
    expect(mockRemoveFn).toHaveBeenCalledTimes(1)
    fireEvent.click(clearCartButton)
    expect(mockClearItemFn).toHaveBeenCalledTimes(1)
  })
})
