export interface MaterialFactor {
  id: number
  name: string
  factor: number
}

export interface MaterialInput {
  id: string
  material: string
  percentage: number
}

export interface CarbonResult {
  carbon: number
  score: number
  level: string
  color: string
  recommendation: string
}
