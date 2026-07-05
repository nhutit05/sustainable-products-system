import { createContext, useMemo, useState } from 'react'
import type { customerResponse } from '../model/customer'

export interface CustomerContextType {
  token: string | null
  customerData: customerResponse | null
  setCustomerData: React.Dispatch<React.SetStateAction<customerResponse | null>>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  const [customerData, setCustomerData] = useState<customerResponse | null>(null)

  const value = useMemo(
    () => ({
      token,
      customerData,
      setCustomerData,
    }),
    [customerData, token]
  )

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export default CustomerContext
