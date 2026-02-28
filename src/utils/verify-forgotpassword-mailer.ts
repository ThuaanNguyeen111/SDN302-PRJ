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

  const resetLink = `http://localhost:3000/members/reset-password?forgot_password_token=${token}`

  await transporter.sendMail({
    from: `"Baby Product" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Reset Your Password - Baby Product',
    html: generateEmailHTML({
      name,
      buttonText: 'Reset Password',
      message: 'We received a request to reset your password. Click the button below to continue.',
      link: resetLink
    })
  })
}
