const linePayConfig = {
  LINE_PAY_CHANNEL_ID: process.env.LINE_PAY_CHANNEL_ID,
  LINE_PAY_CHANNEL_SECRET: process.env.LINE_PAY_CHANNEL_SECRET,
  LINE_PAY_BASE_URL: "https://sandbox-api-pay.line.me",
  LINE_PAY_CONFIRM_URL: "http://localhost:5173/#/linepay/confirm",
  LINE_PAY_CANCEL_URL: "http://localhost:5173/#/linepay/cancel"
}


module.exports = linePayConfig