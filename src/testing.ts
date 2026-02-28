import { UserRole } from './constants/enums'
import { getRedirectPathByRole } from './utils/auth.utils'

console.log('Redirect for Staff (2):', getRedirectPathByRole(2 as UserRole))
