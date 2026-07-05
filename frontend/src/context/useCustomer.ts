import { useContext } from 'react'
import CustomerContext from './CustomerContext'

export const useCustomer = () => {
  const context = useContext(CustomerContext)

  if (!context) {
    throw new Error('useCustomer must be used within CustomerProvider')
  }

  return context
}
