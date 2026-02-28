import { UserRole } from '~/constants/enums'

export function getRedirectPathByRole(role: UserRole): string {
  const rolePaths: Record<UserRole, string> = {
    [UserRole.Admin]: '/dashboard/admin',
    [UserRole.Staff]: '/dashboard/staff',
    [UserRole.User]: '/home', // default role
    [UserRole.Headstaff]: '/head-staff'
  }

  return rolePaths[role] || '/home'
}
