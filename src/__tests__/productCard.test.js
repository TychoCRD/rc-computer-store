import { fireEvent, render, screen } from '@testing-library/react'
import ProductCard from '../app/components/ProductCard'
import '@testing-library/jest-dom'

describe('ProductCard', () => {
  it('renders an Add Card button if quantity is 0', () => {
    const cardData = {
      sku: 'ipd',
      name: 'Super iPad',
      price: 549.99,
    }
    const mockRemoveFn = jest.fn()
    const mockAddFn = jest.fn()
    render(<ProductCard cartQuantity={0} cardData={cardData} removeProductFromCart={mockRemoveFn} addProductToCart={mockAddFn}/>)
 
    const addCartButton = screen.getByRole('button')
    expect(addCartButton).toBeInTheDocument()
    fireEvent.click(addCartButton)
    expect(mockAddFn).toHaveBeenCalledTimes(1)
  })
  it('renders cart adjustment buttons if quantity > 0', () => {
    const cardData = {
      sku: 'ipd',
      name: 'Super iPad',
      price: 549.99,
    }
    const mockRemoveFn = jest.fn()
    const mockAddFn = jest.fn()
    render(<ProductCard cartQuantity={1} cardData={cardData} removeProductFromCart={mockRemoveFn} addProductToCart={mockAddFn}/>)
 
    const addCartButton = screen.getByRole('add-btn')
    const removeCartButton = screen.getByRole('remove-btn')
    expect(addCartButton).toBeInTheDocument()
    expect(removeCartButton).toBeInTheDocument()
    fireEvent.click(addCartButton)
    expect(mockAddFn).toHaveBeenCalledTimes(1)
    fireEvent.click(removeCartButton)
    expect(mockRemoveFn).toHaveBeenCalledTimes(1)
  })
})
