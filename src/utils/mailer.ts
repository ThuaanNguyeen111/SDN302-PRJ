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
    from: `"Baby Product Support" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Xác thực tài khoản Baby Product của bạn',
    html: generateEmailHTML({
      name,
      buttonText: 'Xác thực ngay',
      message:
        'Cảm ơn bạn đã đăng ký thành viên. Để bắt đầu trải nghiệm mua sắm những sản phẩm tốt nhất cho mẹ và bé, vui lòng nhấn nút bên dưới để xác thực tài khoản.',
      link: verificationLink
    })
  })
}
