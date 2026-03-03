export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum BloodStatus {
  EMPTY = 'EMPTY',
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum TokenTypes {
  AccessToken,
  RefreshToken,
  EmailVerificationToken,
  ForgotPasswordToken
}
export enum UserRole {
  Guest = 0, // Khách chưa đăng nhập
  Member = 1, // Thành viên đã đăng ký
  Staff = 2, // Nhân viên
  Admin = 3 // Quản trị viên
}

export enum UserRoleRedirectPath {
  Admin = '/dashboard/admin',
  Staff = '/dashboard/staff',
  Member = '/home'
}
