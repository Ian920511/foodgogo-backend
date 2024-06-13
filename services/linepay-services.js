const axios = require('axios')
const crypto = require('crypto-js')

const createSignature = (uri, payload, nonce) => {
  const channelSecret = process.env.LINE_PAY_CHANNEL_SECRET
  const json = JSON.stringify(payload)
  const string = channelSecret + uri + json + nonce
  const signature = crypto.HmacSHA256(string, channelSecret)

  return crypto.enc.Base64.stringify(signature)
}

const linePayService = {
  createLinePayRequest: async (orderId, products, amount, currency='TWD') => {
    const payload = {
      amount,
      currency,
      orderId,
      packages: [
        {
          id: orderId,
          amount,
          name: 'Payment',
          products: products.map(items => ({
            name: items.product.name,
            quantity: items.quantity,
            price: items.product.price
          }))
        }
      ],
      redirectUrls: {
        confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
        cancelUrl: process.env.LINE_PAY_CANCEL_URL
      }
    }
    
    const uri = '/v3/payments/request'
    const nonce = parseInt(new Date().getTime() / 1000)
    const signature = createSignature(uri, payload, nonce)

    const response = await axios.post(`${process.env.LINE_PAY_BASE_URL}/v3/payments/request`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': process.env.LINE_PAY_CHANNEL_ID,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization': signature
      }
    })
    
    return response.data
  },

  confirmLinePayPayment: async (transactionId, amount, currency = 'TWD') => {
    const payload = {
      amount,
      currency
    }

    
    const uri = `/v3/payments/${transactionId}/confirm`
    const nonce = parseInt(new Date().getTime() / 1000)
    const signature = createSignature(uri, payload, nonce)

    const response = await axios.post(`${process.env.LINE_PAY_BASE_URL}/v3/payments/${transactionId}/confirm`,
    payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': process.env.LINE_PAY_CHANNEL_ID,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization': signature
      }
    })

    return response.data
  }

}

module.exports = linePayService
