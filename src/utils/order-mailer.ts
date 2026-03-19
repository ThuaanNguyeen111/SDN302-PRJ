import nodemailer from 'nodemailer'
import generateEmailHTML from './generateEmailHTML'

export async function sendOrderConfirmationEmail(toEmail: string, name: string, orderId: string, totalAmount: number) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  // Định dạng số tiền sang VNĐ cho chuyên nghiệp
  const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)

  await transporter.sendMail({
    from: `"Baby Product - Đơn hàng" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `[Baby Product] Xác nhận đơn hàng #${orderId} thành công`,
    html: generateEmailHTML({
      name,
      buttonText: 'Xem chi tiết đơn hàng',
      message: `Chúc mừng bạn! Đơn hàng #${orderId} với tổng trị giá ${formattedAmount} đã được đặt thành công. Chúng tôi sẽ nhanh chóng kiểm tra và giao hàng đến cho mẹ và bé trong thời gian sớm nhất.`,
      link: `http://localhost:5173/account/orders/${orderId}`
    })
  })
}
