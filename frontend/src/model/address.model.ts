export type Addressresponse = {
  addressId: number
  addressName: string
  addressStreet: string
  isDefault: boolean
  villageId: number
  villageName: string
  cityId: number
  cityName: string
}

export type AddressRequest = {
  addressName: string
  addressStreet: string
  isDefault: boolean
  villageId: number
  userId: number
}

// CITY
export type CityResponse = {
  cityId: number
  cityName: string
  cityLevel: string
}
// VILLAGES
export type VillageResponse = {
  villageId: number
  villageName: string
  villageLevel: string
  city: CityResponse
}
