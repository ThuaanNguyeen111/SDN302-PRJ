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
  User, //0
  Admin, //1
  Staff, //2
  Headstaff //3
}

export enum UserRoleRedirectPath {
  Admin = '/dashboard/admin',
  Staff = '/dashboard/staff',
  User = '/home'
}
