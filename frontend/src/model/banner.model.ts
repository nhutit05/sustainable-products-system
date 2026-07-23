export interface BannerResponse {
  bannerId: number
  title: string
  subtitle: string
  content: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BannerRequest {
  title: string
  subtitle: string
  content: string
  buttonText: string
  buttonLink: string
  displayOrder: number
  isActive: boolean
}
