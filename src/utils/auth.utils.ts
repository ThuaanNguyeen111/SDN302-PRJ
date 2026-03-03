import { UserRole } from '~/constants/enums'

export function getRedirectPathByRole(role: UserRole): string {
  const rolePaths: Record<UserRole, string> = {
    [UserRole.Guest]: '/', // Khách chưa đăng nhập
    [UserRole.Admin]: '/dashboard/admin',
    [UserRole.Staff]: '/dashboard/staff',
    [UserRole.Member]: '/home' // default role
  }

  return rolePaths[role] || '/home'
}
