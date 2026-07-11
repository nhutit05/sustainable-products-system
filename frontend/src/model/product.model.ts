export type ProductIntroduce = {
  productId: number
  productName: string
  productPrice: number
  productCarbonIndex: number
  baseEcoPoints: number
  productImage: string
  categoryName: string
  imageUrls: string[]
}

export type ProductDetail = {
  productId: number
  productName: string
  productPrice: number
  productCarbonIndex: number
  baseEcoPoints: number
  inventory: number
  original: string
  statusSale: boolean
  expiredAt: string // Hoặc Date nếu bạn muốn parse thành đối tượng ngày tháng
  weight: number
  categoryId: number
  categoryName: string
  imageUrls: string[]
}

export type ProductImage = {
  productImageId: number
  productId: number
  imageUrl: string
}

export type Material = {
  materialId: number
  materialName: string
}

export type ProductRequest = {
  baseEcoPoints: number | ''
  materialIds: number[]
  original: string
  productCarbonIndex: number | ''
  percentageMaterialIds: number[]
  expiredAt: string
  weight: number | ''
  categoryId: number | ''
  statusSale: boolean
  productName: string
  productPrice: number | ''
  inventory: number | ''
}

export type ProductMaterial = {
  productId: number
  productName: string
  materialId: number
  materialName: string
  percentage: number
}

export type ProductResponse = {
  productId: number
  productName: string
  productPrice: number
  productCarbonIndex: number
  baseEcoPoints: number
  inventory: number
  original: string
  statusSale: boolean
  expiredAt: string
  weight: number
  categoryId: number
  categoryName: string
  materials: ProductMaterial[]
  productImage: string
  imageUrls: string[]
}

// CATEGORIES

export type CategoryResponse = {
  categoryId: number
  categoryName: string
}
