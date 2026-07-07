import { createContext, useEffect, useMemo, useState } from 'react'
import type { customerResponse } from '../model/customer'

export interface CustomerContextType {
  token: string | null
  customerData: customerResponse | null
  setCustomerData: React.Dispatch<React.SetStateAction<customerResponse | null>>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  const [username, setUsername] = useState<string | null>(null)
  const [customerData, setCustomerData] = useState<customerResponse | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUsername(data.username)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (token) {
      fetchUser()
    }

    const fetchCustomerData = async () => {
      try {
        if (token) {
          const response = await fetch(
            `http://localhost:8080/api/customers/me?username=${username}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          )
          if (response.ok) {
            const customer = await response.json()
            setCustomerData(customer)
          }
        }
      } catch (error) {
        console.error('Error fetching customer data:', error)
      }
    }

    fetchCustomerData()
  }, [token, username])

  const value = useMemo(
    () => ({
      token,
      username,
      customerData,
      setCustomerData,
    }),
    [customerData, token, username]
  )

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export default CustomerContext
