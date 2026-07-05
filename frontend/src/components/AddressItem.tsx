import { MapPin, SquarePen } from 'lucide-react'
import type { Address } from '../model/address.model'

interface AddressItemProps {
  address: Address
  setShowUpdate: (value: boolean) => void
}

export default function AddressItem({ address, setShowUpdate }: AddressItemProps) {
  return (
    <div
      className={`addrItem flex items-center justify-between p-3 border  rounded-2xl bg-white text-left ${address.isDefault ? 'border-emerald-600 shadow-xs shadow-emerald-50' : 'border-gray-400'}`}
    >
      <div className="">
        <div className="flex items-center">
          <MapPin className="inline-block mr-2 text-gray-400" size={20} />
          <h3 className="text-lg font-bold text-gray-800">{address.addressName}</h3>
          {address.isDefault ? (
            <p className="flex items-center ml-3 text-blue-500 text-xs font-semibold px-3 py-1 rounded-2xl bg-blue-100">
              Mặc định
            </p>
          ) : null}
        </div>
        <p className="text-gray-600">
          {address.addressStreet} , {address.villageName}, {address.cityName}{' '}
        </p>
      </div>
      <div className="p-3">
        <SquarePen
          onClick={() => setShowUpdate(true)}
          className="text-blue-600 hover:text-blue-900 transition-colors cursor-pointer"
          size={20}
        />
      </div>
    </div>
  )
}
