import API_BASE_URL from "../config/api"
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

  const [timeLeft, setTimeLeft] = useState(300)

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null")

    let savedCart: any[] = []

    if (savedUser && savedUser._id) {
      savedCart = JSON.parse(
        localStorage.getItem("cart_" + savedUser._id) || "[]"
      )
    }

    setCart(savedCart)
    setUser(savedUser)

    const total = savedCart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )

    setTotalPrice(total)
  }, [])

  const checkout = async () => {
    try {
      setTimeLeft(300)
      setPaid(false)

      const res = await axios.post(`${API_BASE_URL}/api/checkout`, {
        items: cart,
        user,
        totalPrice,
      })

      setQr(res.data.qr)
      setOrderId(res.data.order.orderId)
    } catch (err) {
      console.log(err)
      alert("Checkout lỗi")
    }
  }

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

  useEffect(() => {
    if (!orderId) return

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/order-status/` + orderId
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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 80,
      paddingBottom: 60,
      background: "#fff",
    }}>

      <img
        src="/assets/icons/logotmdt3.png"
        alt="Logo"
        style={{ width: 40, height: 40, objectFit: "contain", marginBottom: 32 }}
      />

      <div style={{
        display: "flex",
        gap: 48,
        width: "100%",
        maxWidth: 860,
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 24px",
        boxSizing: "border-box",
      }}>

        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>

          <h2 style={{
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 24,
            color: "#111",
          }}>
            Thông tin đơn hàng
          </h2>

          {user && (
            <div style={{
              background: "#fafafa",
              border: "1px solid #eee",
              padding: "20px 24px",
              marginBottom: 24,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: "#444" }}>
                <strong style={{ color: "#111" }}>Tên:</strong> {user.fullname}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#444" }}>
                <strong style={{ color: "#111" }}>SĐT:</strong> {user.phone}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#444" }}>
                <strong style={{ color: "#111" }}>Email:</strong> {user.email}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#444" }}>
                <strong style={{ color: "#111" }}>Địa chỉ:</strong> {user.address}
              </p>
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            {cart.map((item, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#444",
                padding: "10px 0",
                borderBottom: "1px solid #f0f0f0",
              }}>
                <span>{item.name} — {item.size} × {item.quantity}</span>
                <span style={{ fontWeight: 500, color: "#111" }}>
                  {(item.price * item.quantity).toLocaleString()}đ
                </span>
              </div>
            ))}
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            borderTop: "1px solid #ddd",
            marginBottom: 28,
          }}>
            <span style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
              Tổng cộng
            </span>
            <strong style={{ fontSize: 18, fontWeight: 600, color: "#111" }}>
              {totalPrice.toLocaleString()}đ
            </strong>
          </div>

          {!qr && !paid && timeLeft !== 0 && (
            <button
              onClick={checkout}
              style={{
                width: "100%",
                padding: 14,
                background: "#111",
                color: "#fff",
                border: "1px solid #111",
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 0,
              }}
            >
              Thanh toán
            </button>
          )}

          {paid && (
            <div style={{
              padding: "16px 20px",
              background: "#f0faf4",
              border: "1px solid #b2dfcc",
              color: "#1a7a4a",
              fontSize: 14,
              fontWeight: 500,
            }}>
              ✓ Bạn đã thanh toán thành công
            </div>
          )}

          {timeLeft === 0 && !paid && (
            <div style={{
              padding: "16px 20px",
              background: "#fff5f5",
              border: "1px solid #ffcccc",
              color: "#cc0000",
              fontSize: 14,
              fontWeight: 500,
            }}>
              ✕ Đơn hàng đã hết hạn
            </div>
          )}

        </div>

        {/* RIGHT — QR */}
        {qr && (
          <div style={{
            width: 300,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid #eee",
            padding: "32px 24px",
            background: "#fafafa",
          }}>
            <h2 style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 24,
              color: "#111",
              textAlign: "center",
            }}>
              Quét QR để thanh toán
            </h2>

            <img src={qr} alt="QR" style={{
              width: 240,
              height: 240,
              objectFit: "contain",
              border: "1px solid #eee",
              background: "#fff",
              padding: 8,
            }} />

            <div style={{ marginTop: 20, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "#888", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 6px" }}>
                Thời gian còn lại
              </p>
              <div style={{
                fontSize: 28,
                fontWeight: 300,
                letterSpacing: 4,
                color: timeLeft <= 60 ? "#cc0000" : "#111",
              }}>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Checkout