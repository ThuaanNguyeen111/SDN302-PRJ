import nodemailer from 'nodemailer'
import generateEmailHTML from './generateEmailHTML'

export async function sendForgotPasswordEmail(toEmail: string, name: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  const resetLink = `http://localhost:5173/members/reset-password?forgot_password_token=${token}`

  await transporter.sendMail({
    from: `"Baby Product Security" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Yêu cầu khôi phục mật khẩu - Baby Product',
    html: generateEmailHTML({
      name,
      buttonText: 'Đặt lại mật khẩu',
      message:
        'Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này để đảm bảo an toàn.',
      link: resetLink
    })
  })
}
