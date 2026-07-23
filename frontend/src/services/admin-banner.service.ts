import axios from 'axios'
import type { BannerResponse } from '../model/banner.model'

const API_URL = 'http://localhost:8080/api'

export async function getAllBanners(token: string): Promise<BannerResponse[]> {
  const response = await axios.get<BannerResponse[]>(`${API_URL}/admin/banners`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getActiveBanners(): Promise<BannerResponse[]> {
  const response = await axios.get<BannerResponse[]>(`${API_URL}/banners/active`)
  return response.data
}

export async function createBanner(
  token: string,
  data: {
    title: string
    subtitle?: string
    content?: string
    buttonText?: string
    buttonLink?: string
    displayOrder?: number
    isActive?: boolean
  },
  imageFile: File
): Promise<BannerResponse> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  formData.append('image', imageFile)

  const response = await axios.post<BannerResponse>(`${API_URL}/admin/banners`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateBanner(
  token: string,
  id: number,
  data: {
    title: string
    subtitle?: string
    content?: string
    buttonText?: string
    buttonLink?: string
    displayOrder?: number
    isActive?: boolean
  },
  imageFile?: File
): Promise<BannerResponse> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  if (imageFile) {
    formData.append('image', imageFile)
  }

  const response = await axios.put<BannerResponse>(`${API_URL}/admin/banners/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function deleteBanner(token: string, id: number): Promise<void> {
  await axios.delete(`${API_URL}/admin/banners/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
