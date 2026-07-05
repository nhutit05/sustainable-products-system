export const CustomerTypeRole = {
  ROLE_CUSTOMER: 'customer',
  ROLE_ADMIN: 'admin',
} as const

export type CustomerTypeRoleKey = keyof typeof CustomerTypeRole

export const CustomerTypeColor: Record<CustomerTypeRoleKey, string> = {
  ROLE_CUSTOMER: 'amber',
  ROLE_ADMIN: 'blue',
}

export const CustomerTypeName: Record<CustomerTypeRoleKey, string> = {
  ROLE_CUSTOMER: 'Khách hàng',
  ROLE_ADMIN: 'Quản trị viên',
}
