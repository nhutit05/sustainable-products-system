import { createContext, useMemo, useState } from 'react'
import type { customerResponse } from '../model/customer'

export interface CustomerContextType {
  customerData: customerResponse | null
  setCustomerData: React.Dispatch<React.SetStateAction<customerResponse | null>>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const [customerData, setCustomerData] = useState<customerResponse | null>(null)

  const value = useMemo(
    () => ({
      customerData,
      setCustomerData,
    }),
    [customerData]
  )

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export default CustomerContext
