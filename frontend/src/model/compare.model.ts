export type CompareProductSummary = {
  productId: number
  productName: string
  productPrice: number
  productCarbonIndex: number
  baseEcoPoints: number
  imageUrl: string
}

export type CompareAttribute = {
  key: string
  label: string
  // key là productId dạng string, value là giá trị hiển thị của thuộc tính đó
  values: Record<string, string>
  highlightedValue?: string
}

export type CompareSection = {
  sectionName: string
  attributes: CompareAttribute[]
}

export type CompareProductResponse = {
  products: CompareProductSummary[]
  sections: CompareSection[]
}
