import nodemailer from 'nodemailer'
import generateEmailHTML from './generateEmailHTML'

export async function sendVerificationEmail(toEmail: string, name: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  const verificationLink = `http://localhost:4000/members/verify-email?email_verify_token=${token}`

  await transporter.sendMail({
    from: `"Baby Product" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Verify Your Account ',
    html: generateEmailHTML({
      name,
      buttonText: 'Verify Email',
      message: 'Thank you for registering. Please verify your email by clicking the button below.',
      link: verificationLink
    })
  })
}
