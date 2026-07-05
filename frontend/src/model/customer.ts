export type meResponse = {
  username: string
  authorities: {
    authority: string
  }[]
}

export type customerResponse = {
  userId: number
  username: string
  email: string
  numberPhone: string
  nationalId: string
  accumulatedEcoPoints: number
}
