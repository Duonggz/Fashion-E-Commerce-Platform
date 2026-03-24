import { Link, useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import "../assets/styles/product-detail.css"

interface Size {
  size: string
  quantity: number
}

interface Product {
  _id: string
  name: string
  price: number
  image: string
  description: string
  sizes: Size[]
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [quantity, setQuantity] = useState<number>(1)

  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    document.body.style.overflow = "auto"

    const loadProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${id}`)
        setProduct(res.data)
      } catch (err) {
        console.error("Load product error", err)
      }
    }

    loadProduct()
  }, [id])

  const handleSelectSize = (sizeItem: Size) => {
    setSelectedSize(sizeItem)
  }

  const addToCart = () => {
    if (!user || !user._id) {
      alert("Vui lòng đăng nhập trước")
      navigate("/auth")
      return
    }

    if (!selectedSize) {
      alert("Vui lòng chọn size")
      return
    }

    if (!product) return

    if (selectedSize.quantity <= 0) {
      alert("Size này đã hết hàng")
      return
    }

    const cartKey = "cart_" + user._id
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]")

    const existing = cart.find(
      (item: any) =>
        item.productId === product._id &&
        item.size === selectedSize.size
    )

    const currentInCart = existing ? existing.quantity : 0
    const totalWanted = currentInCart + quantity

    if (totalWanted > selectedSize.quantity) {
      alert(`Số lượng vượt quá tồn kho. Còn lại ${selectedSize.quantity} sản phẩm size ${selectedSize.size}`)
      return
    }

    if (existing) {
      existing.quantity += quantity
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize.size,
        quantity
      })
    }

    localStorage.setItem(cartKey, JSON.stringify(cart))
    alert("Đã thêm vào giỏ hàng")
  }

  if (!product) return <p>Loading...</p>

  return (
    <div>
      <header className="category-header">
        <div className="category-logo">
          <Link to="/">
            <img src="/assets/icons/logotmdt3.png" />
          </Link>
        </div>

        <div className="category-icons">
          <Link to={user ? "/profile" : "/auth"}>
            <img src="/assets/icons/193.png" />
          </Link>

          <Link to="/cart">
            <img src="/assets/icons/194.png" />
          </Link>
        </div>
      </header>

      <div className="product-detail">
        <div className="product-images">
          <img
            src={product.image}
            alt={product.name}
            className="main-image"
          />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <h2 className="product-price">
            {product.price.toLocaleString()}đ
          </h2>

          <p className="product-description">{product.description}</p>

          <h3 className="size-title">Size</h3>

          <div className="size-grid">
            {product.sizes.map((sizeItem, index) => {
              const isDisabled = sizeItem.quantity <= 0
              const isActive = selectedSize?.size === sizeItem.size

              return (
                <button
                  type="button"
                  key={`${sizeItem.size}-${index}`}
                  disabled={isDisabled}
                  className={
                    isDisabled
                      ? "size-btn disabled"
                      : isActive
                      ? "size-btn active"
                      : "size-btn"
                  }
                  onClick={() => handleSelectSize(sizeItem)}
                >
                  {sizeItem.size}
                </button>
              )
            })}
          </div>

          {selectedSize && (
            <p style={{ marginTop: "10px" }}>
              Còn lại: {selectedSize.quantity}
            </p>
          )}

          <div className="quantity">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="add-cart"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail