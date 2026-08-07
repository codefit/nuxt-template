export type UserRole = 'admin' | 'user'

export interface UserPublic {
  id: number
  email: string
  name: string
  role: UserRole
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface ForgotPasswordForm {
  email: string
}

export interface ResetPasswordForm {
  token: string
  password: string
}
