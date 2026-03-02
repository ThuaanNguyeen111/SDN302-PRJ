function generateEmailHTML({
  name,
  message,
  buttonText,
  link
}: {
  name: string
  message: string
  buttonText: string
  link: string
}) {
  return `
  <!DOCTYPE html>
  <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email từ Baby Product</title>
      <style>
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background-color: #fff0f5; margin: 0; padding: 20px; color: #444; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); padding: 40px; border: 1px solid #f8bbd0; }
        .header { text-align: center; margin-bottom: 30px; }
        .header img { width: 120px; height: auto; margin-bottom: 10px; }
        h2 { font-size: 24px; color: #c2185b; margin-bottom: 10px; }
        p { font-size: 16px; line-height: 1.7; margin-bottom: 15px; }
        .button-container { text-align: center; margin: 30px 0; }
        .button { background-color: #ec407a; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.3s ease; }
        .button:hover { background-color: #d81b60; }
        .footer { border-top: 1px solid #fce4ec; padding-top: 20px; text-align: center; font-size: 13px; color: #888; margin-top: 40px; }
        .footer strong { color: #ec407a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://img.freepik.com/premium-vector/vector-detailed-cute-baby-logo-template_1120060-3.jpg" alt="Baby Product Logo" />
          <h2>Chào mừng bạn đến với Baby Product!</h2>
        </div>
        <p>Thân chào <strong>${name}</strong>,</p>
        <p>${message}</p>

        <div class="button-container">
          <a href="${link}" class="button" target="_blank" rel="noopener noreferrer">${buttonText}</a>
        </div>

        <p style="font-size: 14px; color: #999; text-align: center;">Hoặc sao chép liên kết này vào trình duyệt:</p>
        <p style="word-break: break-all; font-size: 13px; text-align: center;"><a href="${link}" style="color: #ec407a;">${link}</a></p>

        <div class="footer">
          <p>Liên kết này có hiệu lực trong vòng <strong>24 giờ</strong>.</p>
          <p>Cảm ơn bạn đã tin tưởng chọn <strong>Baby Product</strong> đồng hành cùng mẹ và bé.</p>
          <p>© 2026 Đội ngũ Baby Product</p>
        </div>
      </div>
    </body>
  </html>
  `
}
export default generateEmailHTML
