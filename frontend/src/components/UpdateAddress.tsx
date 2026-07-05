import { X } from 'lucide-react'
import { useCustomer } from '../context/useCustomer'
import type {
  VillageResponse,
  CityResponse,
  Addressresponse,
  AddressRequest,
} from '../model/address.model'
import { useEffect, useState } from 'react'
import { useNotification } from '../context/useNotification'
import { useNavigate } from 'react-router-dom'

interface UpdateAddressProps {
  address: Addressresponse
  setShowUpdateAddress: (show: boolean) => void
}

export default function UpdateAddress({ address, setShowUpdateAddress }: UpdateAddressProps) {
  const addressTypeName = ['Nhà riêng', 'Công ty', 'Khác']

  const { token, customerData } = useCustomer()

  const [cities, setCities] = useState<CityResponse[]>([])
  const [selectedCity, setSelectedCity] = useState<CityResponse | null>(null)
  const [isDefault, setIsDefault] = useState<boolean>(address.isDefault || false)

  const [villages, setVillages] = useState<VillageResponse[]>([])
  const [selectedVillage, setSelectedVillage] = useState<VillageResponse | null>(null)

  const [addressName, setAddressName] = useState<string>(address.addressName)
  const [addressStreet, setAddressStreet] = useState<string>(address.addressStreet)

  const { showNotification } = useNotification()

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCites = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/cities', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setCities(data)
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
      }
    }

    const fetchVillages = async (cityId: number) => {
      try {
        const response = await fetch(`http://localhost:8080/api/villages?cityId=${cityId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setVillages(data)
        }
      } catch (error) {
        console.error('Error fetching villages:', error)
      }
    }

    if (token) {
      fetchCites()
    }

    if (selectedCity) {
      fetchVillages(selectedCity.cityId)
    }
  }, [token, selectedCity])

  useEffect(() => {
    const fetchCityAndVillage = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/cities/${address.cityId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const cityData = await response.json()
          setSelectedCity(cityData)
        }

        const villageResponse = await fetch(
          `http://localhost:8080/api/villages/${address.villageId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (villageResponse.ok) {
          const villageData = await villageResponse.json()
          setSelectedVillage(villageData)
        }
      } catch (error) {
        console.error('Error fetching city:', error)
      }
    }

    if (token) {
      fetchCityAndVillage()
    }
  }, [token, address.cityId, address.villageId])

  const handleSubmitAddress = async (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()

    try {
      const response = await fetch(`http://localhost:8080/api/addresses/${address.addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressName: addressName,
          addressStreet: addressStreet,
          isDefault: isDefault,
          villageId: selectedVillage?.villageId || 0,
          userId: customerData?.userId || 0,
        }),
      })

      if (response.ok) {
        navigate('/profile/addresses')
        showNotification({
          message: 'Cập nhật địa chỉ thành công!',
          type: 'SUCCESS',
          duration: 3000,
        })
        setShowUpdateAddress(false)
      }
    } catch (error) {
      showNotification({
        message: 'Cập nhật địa chỉ thất bại!',
        type: 'ERROR',
        duration: 3000,
      })
      console.error('Error updating address:', error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300/70 z-50">
      <div className="bg-white p-6 rounded-2xl shadow min-w-160 relative">
        <h2 className="text-xl font-bold mb-4 text-green-900 uppercase">Cập nhật địa chỉ</h2>
        <form onSubmit={handleSubmitAddress} className="text-left grid grid-cols-2 gap-4">
          <div className="mb-4 ">
            <label
              htmlFor="addressName"
              className="block text-gray-700 font-semibold mb-2 flex-1/3"
            >
              Loại địa chỉ
            </label>
            <select
              id="addressName"
              name="addressName"
              value={addressName}
              onChange={(e) =>
                addressTypeName.find((name) => name === e.target.value) &&
                setAddressName(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="">Chọn loại địa chỉ</option>
              {addressTypeName.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="addressStreet" className="block text-gray-700 font-semibold mb-2">
              Số nhà, tên đường
            </label>
            <input
              type="text"
              id="addressStreet"
              name="addressStreet"
              value={addressStreet}
              onChange={(e) => setAddressStreet(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="vd: 123 Đường ABC"
            />
          </div>
          {/* VILLAGE */}
          <div className="mb-4">
            <label htmlFor="village" className="block text-gray-700 font-semibold mb-2">
              Phường/Xã
            </label>
            <select
              name="village"
              id="village"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
              value={selectedVillage?.villageId || 0}
              onChange={(e) => {
                setSelectedVillage(
                  villages.find((village) => village.villageId === parseInt(e.target.value)) || null
                )
              }}
            >
              <option value="">Chọn phường, xã</option>
              {villages.map((village) => (
                <option key={village.villageId} value={village.villageId}>
                  {village.villageName}
                </option>
              ))}
            </select>
          </div>

          {/* CITY */}
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-700 font-semibold mb-2">
              Tỉnh, Thành phố
            </label>
            <select
              name="city"
              id="city"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
              value={selectedCity?.cityId || 0}
              onChange={(e) => {
                setSelectedCity(
                  cities.find((city) => city.cityId === parseInt(e.target.value)) || null
                )
              }}
            >
              <option value="">Chọn tỉnh, thành phố</option>
              {cities.map((city) => (
                <option key={city.cityId} value={city.cityId}>
                  {city.cityName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            <label htmlFor="isDefault" className="text-gray-700 font-semibold">
              Đặt làm địa chỉ mặc định
            </label>
          </div>
        </form>
        <div className="address-form_actions flex items-center gap-5 justify-end mt-5">
          <button
            type="button"
            className="text-red-500 border border-red-500 hover:cursor-pointer hover:scale-101 font-bold py-2 px-4 rounded-xl"
            onClick={() => setShowUpdateAddress(false)}
          >
            Hủy
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 hover:scale-101 hover:cursor-pointer text-white font-bold py-2 px-4 rounded-xl"
            onClick={handleSubmitAddress}
          >
            Cập nhật địa chỉ
          </button>
        </div>
        <X
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={() => setShowUpdateAddress(false)}
        />
      </div>
    </div>
  )
}
