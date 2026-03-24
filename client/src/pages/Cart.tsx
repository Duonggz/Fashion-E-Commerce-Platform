import { useEffect, useState } from "react"
import "../assets/styles/cart.css"
import { useNavigate } from "react-router-dom"

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size: string
  quantity: number
}

const Cart = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartItem[]>([])

  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    if (!user || !user._id) return

    const storedCart = JSON.parse(
      localStorage.getItem("cart_" + user._id) || "[]"
    )

    setCart(storedCart)
  }, [])

  const updateStorage = (newCart: CartItem[]) => {
    if (user && user._id) {
      localStorage.setItem(
        "cart_" + user._id,
        JSON.stringify(newCart)
      )
    }
  }

  const removeItem = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
    updateStorage(newCart)
  }

  const changeQty = (index: number, amount: number) => {
    const newCart = [...cart]
    newCart[index].quantity += amount
    if (newCart[index].quantity < 1)
      newCart[index].quantity = 1
    setCart(newCart)
    updateStorage(newCart)
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="cart-page">

      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item, index) => (
        <div key={index} className="cart-item">

          <img src={item.image} alt={item.name} />

          <div className="cart-info">
            <h3>{item.name}</h3>
            <p>Size: {item.size}</p>

            <div className="cart-qty">
              <button onClick={() => changeQty(index, -1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => changeQty(index, 1)}>+</button>
            </div>
          </div>

          <div className="cart-item-right">
            <p style={{ fontSize: "15px", fontWeight: 500 }}>
              {(item.price * item.quantity).toLocaleString()}đ
            </p>
            <button
              className="remove-btn"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </div>

        </div>
      ))}

      {cart.length > 0 && (
        <div className="cart-total">
          <h2>Total: {total.toLocaleString()}đ</h2>
          <button onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </div>
      )}

    </div>
  )
}

export default Cart