export const createVietQR = (orderId: string, amount: number) => {

  const bank = "MB"
  const account = "0601200488889"
  const name = "NGUYEN ANH MINH"

  return `https://api.vietqr.io/image/${bank}-${account}-compact.png?amount=${amount}&addInfo=${orderId}&accountName=${encodeURIComponent(name)}`

}