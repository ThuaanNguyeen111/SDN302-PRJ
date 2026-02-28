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
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email</title>
      <style>
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          padding: 40px 50px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header img {
          width: 80px;
          height: auto;
          margin-bottom: 15px;
        }
        h2 {
          font-size: 28px;
          color: #d32f2f;
          margin-bottom: 10px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #d32f2f;
          color: #ffffff !important;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 18px;
          display: inline-block;
          box-shadow: 0 4px 8px rgba(211, 47, 47, 0.3);
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #b02727;
        }
        .link-note {
          text-align: center;
          font-size: 14px;
          color: #555;
          margin-bottom: 5px;
        }
        .link {
          display: block;
          text-align: center;
          font-size: 14px;
          word-break: break-word;
          color: #d32f2f;
          margin-bottom: 20px;
        }
        .footer {
          border-top: 1px solid #e0e0e0;
          padding-top: 20px;
          text-align: center;
          font-size: 14px;
          color: #888;
          margin-top: 40px;
        }
        @media only screen and (max-width: 600px) {
          .container {
            padding: 20px;
          }
          h2 {
            font-size: 22px;
          }
          .button {
            font-size: 16px;
            padding: 12px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://static.vecteezy.com/system/resources/previews/015/972/171/non_2x/blood-drop-with-plus-heart-shape-blood-donation-concept-blood-donation-logo-illustration-vector.jpg" alt="Blood Donation Logo" />
          <h2>Blood Donation</h2>
        </div>
        <p>Dear <strong>${name}</strong>,</p>
        <p>${message}</p>

        <div class="button-container">
          <a href="${link}" class="button" target="_blank" rel="noopener noreferrer">${buttonText}</a>
        </div>

        <p class="link-note">Or copy this link:</p>
        <a href="${link}" class="link" target="_blank" rel="noopener noreferrer">${link}</a>

        <div class="footer">
          <p>This link is valid for <strong>24 hours</strong>.</p>
          <p>Thank you for supporting our mission to save lives.</p>
          <p>The Blood Donation Team</p>
        </div>
      </div>
    </body>
  </html>
  `
}
export default generateEmailHTML
