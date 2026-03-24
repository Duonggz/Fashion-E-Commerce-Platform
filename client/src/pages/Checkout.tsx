import axios from "axios"
import { useEffect, useState } from "react"

interface CartItem {
  productId: string
  name: string
  size: string
  price: number
  quantity: number
}

const Checkout = () => {

  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState<any>(null)
  const [totalPrice, setTotalPrice] = useState(0)

  const [qr, setQr] = useState("")
  const [orderId, setOrderId] = useState("")
  const [paid, setPaid] = useState(false)

  const [timeLeft, setTimeLeft] = useState(300) // 5 phút

  useEffect(() => {

   const savedUser =
      JSON.parse(localStorage.getItem("user") || "null")

    let savedCart: any[] = []

    if(savedUser && savedUser._id){
      savedCart = JSON.parse(
        localStorage.getItem("cart_"+savedUser._id) || "[]"
      )
    }

    setCart(savedCart)
    setUser(savedUser)

    const total = savedCart.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    )

    setTotalPrice(total)

  }, [])

  const checkout = async () => {

    try {

      setTimeLeft(300)
      setPaid(false)

      const res = await axios.post(
        "http://localhost:3000/api/checkout",
        {
          items: cart,
          user,
          totalPrice
        }
      )

      setQr(res.data.qr)
      setOrderId(res.data.order.orderId)

    } catch (err) {

      console.log(err)
      alert("Checkout lỗi")

    }

  }

  // countdown 5 phút

  useEffect(() => {

    if (!qr) return

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          clearInterval(timer)

          alert("Hết thời gian thanh toán")

          setQr("")

          return 0

        }

        return prev - 1

      })

    }, 1000)

    return () => clearInterval(timer)

  }, [qr])

  // polling kiểm tra payment

  useEffect(() => {

    if (!orderId) return

    const interval = setInterval(async () => {

      try {

        const res = await axios.get(
          "http://localhost:3000/api/order-status/" + orderId
        )

        if (res.data.status === "paid") {
          setPaid(true)
          setQr("")

          if (user && user._id) {
            localStorage.removeItem("cart_" + user._id)
          }

          setCart([])
          clearInterval(interval)
        }

      } catch (err) {

        console.log(err)

      }

    }, 3000)

    return () => clearInterval(interval)

  }, [orderId])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (

    <div style={{ display: "flex", gap: 50 }}>

      <div>

        <h2>Thông tin đơn hàng</h2>
          {user && (
            <div>
              <p>Tên: {user.fullname}</p>
              <p>SĐT: {user.phone}</p>
              <p>Email: {user.email}</p>
              <p>Địa chỉ: {user.address}</p>
            </div>
          )}

        {cart.map((item, index) => (

          <div key={index}>
            {item.name} - {item.size} x {item.quantity}
          </div>

        ))}

        <h3>Total: {totalPrice.toLocaleString()}đ</h3>

        {!qr && !paid && (

          <button onClick={checkout}>
            Thanh toán
          </button>

        )}

        {paid && (

          <h2 style={{ color: "green" }}>
            Bạn đã thanh toán thành công
          </h2>

        )}

        {timeLeft === 0 && !paid && (

        <h2 style={{color:"red"}}>
        Đơn hàng đã hết hạn
        </h2>

        )}

      </div>

      {qr && (

        <div>

          <h2>Quét QR để thanh toán</h2>

          <img src={qr} width={300} />

          <p>

            Thời gian còn lại:

            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}

          </p>

        </div>

      )}

    </div>

  )

}

export default Checkout