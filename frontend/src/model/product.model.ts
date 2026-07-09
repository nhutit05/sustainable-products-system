export type ProductIntroduce = {
  productId: number
  productName: string
  productPrice: number
  productCarbonIndex: number
  baseEcoPoints: number
  productImage: string
  categoryName: string
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
  fileId: number
}

export type ProductImage = {
  productImageId: number
  productId: number
  imageUrl: string
}

export type ProductRequest = {
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
  fileId: number
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
  imageUrls: string[]
}

// CATEGORIES

export type CategoryResponse = {
  categoryId: number
  categoryName: string
}
