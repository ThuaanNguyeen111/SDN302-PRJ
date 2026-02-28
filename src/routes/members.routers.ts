import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  forgotPasswordverifyForgotPasswordController,
  getMeController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  updateMeController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  emailVerifyValidator,
  forgotPasswordValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifyfiedUserValidator,
  verifyForgotPasswordValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/request/user.requests'
import { WarpAsync } from '~/utils/handlers'
const usersRouters = Router()

//!-------------------------------------------------------------------------------------------------|

/**
 * register thì cần đẩy dữ liệu lên nên dùng post
 * @description Endpoint for user registration.
 * @endpoint POST /api/members/register
 * @requestBody {
 *   name: string,
 *   email: string,
 *   password: string,
 *   confirm_password: string,
 *   date_of_birth: string (ISO 8601 format)
 * }
 * @note JSON does not support the native 'Date' type,
 *       so the date_of_birth should be sent as an ISO 8601 string.
 */
//!-------------------------------------------------------------------------------------------------|
usersRouters.post('/register', registerValidator, WarpAsync(registerController))
//!-------------------------------------------------------------------------------------------------|
/**
 * @description Endpoint to log the user out and invalidate tokens.
 * @endpoint POST /users/logout
 * @headers {
 *   Authorization: "Bearer <access_token>"
 * }
 * @requestBody {
 *   refresh_token: string
 * }
 */
//!--------------------------------------------------------------------------------------------------|
usersRouters.post('/logout', accessTokenValidator, refreshTokenValidator, WarpAsync(logoutController))
//!--------------------------------------------------------------------------------------------------|

/* 
  des: verify email
  khi người dùng đăng ký, trong email của họ sẽ có 1 link
  trong link này đã setup sẵn 1 request kèm email_verify_token
  thì verify email là cái route cho request đó
  path: /members/verify-email?token=<email_verify_token>
  bởi vì khi mình gửi cho người dùng thì mình không lấy gì về hết nên không xài phương thức get
  mà xài phương thức post
  body: {email_verify_token: string}
*/

//!--------------------------------------------------------------------------------------------------|
usersRouters.get('/verify-email', emailVerifyValidator, WarpAsync(emailVerifyController))
//!--------------------------------------------------------------------------------------------------|

/**
 * des: resend email verify token
 * @description Endpoint to resend the email verification token.
 * @endpoint POST /members/resend-email-verify-token
 *
 */

//!-----------------------------------------------------------------------------------------------------------|
usersRouters.post('/resend-email-verify-token', WarpAsync(resendEmailVerifyController))
//!-----------------------------------------------------------------------------------------------------------|

/*
 * Description: Handles user password reset request.
 * When a user forgets their password, they submit their email address.
 * If a user account associated with that email exists, the system will:
 * - Generate a secure forgot_password_token
 * - Send a password reset link containing the token to the user's email
 *
 * Method: POST
 * Endpoint: /users/forgot-password
 * Request Body: { email: string }
 */

//!-----------------------------------------------------------------------------------------------------------|
usersRouters.post('/forgot-password', forgotPasswordValidator, WarpAsync(forgotPasswordController))
//!-----------------------------------------------------------------------------------------------------------|

/*
 * Description: Verify the forgot password token
 * After a user requests to reset their password, they receive an email containing a link.
 * This link includes a `forgot_password_token` which is sent to the server via this endpoint.
 * The server validates the token to ensure it is still valid and has not expired.
 * If the token is valid, the user is allowed to proceed to reset their password.
 *
 * Method: POST
 * Path: /members/verify-forgot-password-token
 * Body: { forgot_password_token: string }
 */

//!-----------------------------------------------------------------------------------------------------------|
usersRouters.post(
  '/verify-forgot-password-token',
  verifyForgotPasswordValidator,
  WarpAsync(forgotPasswordverifyForgotPasswordController)
)
//!-----------------------------------------------------------------------------------------------------------|

/*
 * Description: Initiate the password reset process by providing an email.
 * When a user forgets their password, they can request a reset by submitting their email.
 * The server verifies if the email exists, generates a `forgot_password_token`, and sends a reset link via email.
 * This endpoint does not require authentication since users are not logged in.
 *
 * Method: POST
 * Path: /members/forgot-password
 * Body: { password, confirm_password, forgot_password_token }
 */
//!-----------------------------------------------------------------------------------------------------------|
usersRouters.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordValidator,
  WarpAsync(resetPasswordController)
)
//!-----------------------------------------------------------------------------------------------------------|

/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/

//!-----------------------------------------------------------------------------------------------------------|
usersRouters.get('/me', accessTokenValidator, WarpAsync(getMeController))

usersRouters.patch(
  '/me',
  accessTokenValidator,
  verifyfiedUserValidator,
  filterMiddleware<UpdateMeReqBody>(['name', 'date_of_birth', 'gender', 'citizen_id', 'address', 'avatar']),
  updateMeValidator,
  WarpAsync(updateMeController)
)
//!-----------------------------------------------------------------------------------------------------------|

export default usersRouters
