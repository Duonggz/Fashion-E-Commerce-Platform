import API_BASE_URL from "../config/api"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import "../assets/styles/profile.css"

const statusLabel: Record<string, string> = {
  pending: "Pending Payment",
  paid: "Paid",
  shipping: "Shipping",
  success: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  out_of_stock: "Out of Stock"
}

const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  paid: "#3b82f6",
  shipping: "#8b5cf6",
  success: "#10b981",
  cancelled: "#ef4444",
  returned: "#f97316",
  out_of_stock: "#6b7280"
}

const Profile = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState(user)
  const [orders, setOrders] = useState<any[]>([])
  const [openOrder, setOpenOrder] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { navigate("/auth"); return }
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/user/${user._id}`)
      setOrders(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    navigate("/")
  }

  const saveProfile = async () => {
    const res = await axios.put(`${API_BASE_URL}/api/users/update/${user._id}`, form)
    localStorage.setItem("user", JSON.stringify(res.data))
    setEdit(false)
    alert("Updated!")
  }

  if (!user) return null

  return (
    <div className="profile-page">

      {/* LOGO */}
      <div className="profile-logo-bar">
        <img
          src="/assets/icons/logotmdt3.png"
          alt="logo"
          className="profile-logo"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="profile-layout">

        {/* LEFT */}
        <div className="profile-left">
          <h3 className="profile-section-title">My Account</h3>

          {!edit ? (
            <div className="profile-info-box">
              <div className="profile-info-row">
                <span className="profile-info-label">Name</span>
                <span className="profile-info-value">{user.fullname}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Phone</span>
                <span className="profile-info-value">{user.phone}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{user.email}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Address</span>
                <span className="profile-info-value">{user.address}</span>
              </div>

              <div className="profile-btn-group">
                <button className="profile-btn profile-btn-dark" onClick={() => setEdit(true)}>
                  Edit Profile
                </button>
                <button className="profile-btn profile-btn-red" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info-box">
              <label className="profile-form-label">Name</label>
              <input className="profile-input" value={form.fullname}
                onChange={e => setForm({ ...form, fullname: e.target.value })} />

              <label className="profile-form-label">Phone</label>
              <input className="profile-input" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />

              <label className="profile-form-label">Address</label>
              <input className="profile-input" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} />

              <div className="profile-btn-group">
                <button className="profile-btn profile-btn-green" onClick={saveProfile}>Save</button>
                <button className="profile-btn profile-btn-gray" onClick={() => setEdit(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="profile-right">
          <h3 className="profile-section-title">My Orders</h3>

          {orders.length === 0 ? (
            <div className="profile-empty">
              <p style={{ fontSize: 32 }}>🛍️</p>
              <p style={{ color: "#9ca3af", marginTop: 8 }}>No orders yet</p>
            </div>
          ) : (
            <div className="profile-order-list">
              {orders.map((o) => (
                <div key={o._id} className="profile-order-card">

                  <div
                    className="profile-order-header"
                    onClick={() => setOpenOrder(openOrder === o._id ? null : o._id)}
                  >
                    <div className="profile-order-left">
                      <span className="profile-order-id">{o.orderId}</span>
                      <span className="profile-order-date">
                        {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="profile-order-right">
                      <span
                        className="profile-badge"
                        style={{
                          background: statusColor[o.status] + "20",
                          color: statusColor[o.status]
                        }}
                      >
                        {statusLabel[o.status] || o.status}
                      </span>
                      <span className="profile-arrow">
                        {openOrder === o._id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {openOrder === o._id && (
                    <div className="profile-order-detail">

                      {/* TIMELINE */}
                      <div className="profile-timeline">
                        {["pending", "paid", "shipping", "success"].map((step, i) => {
                          const steps = ["pending", "paid", "shipping", "success"]
                          const currentIndex = steps.indexOf(o.status)
                          const isDone = i <= currentIndex
                          const isCancelled = ["cancelled", "returned", "out_of_stock"].includes(o.status)

                          return (
                            <div key={step} className="profile-timeline-step">
                              <div
                                className="profile-timeline-dot"
                                style={{
                                  background: isCancelled ? "#ef4444" : isDone ? statusColor[step] : "#e2e8f0"
                                }}
                              />
                              {i < 3 && (
                                <div
                                  className="profile-timeline-line"
                                  style={{
                                    background: !isCancelled && i < currentIndex ? "#10b981" : "#e2e8f0"
                                  }}
                                />
                              )}
                              <span
                                className="profile-timeline-label"
                                style={{
                                  color: isDone && !isCancelled ? "#374151" : "#9ca3af",
                                  fontWeight: isDone && !isCancelled ? 600 : 400
                                }}
                              >
                                {statusLabel[step]}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* ITEMS */}
                      <div className="profile-item-list">
                        {o.items.map((item: any, i: number) => (
                          <div key={i} className="profile-item-row">
                            <span>{item.name}</span>
                            <span className="profile-item-size">
                              {item.size} × {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* TOTAL */}
                      <div className="profile-total-row">
                        <span className="profile-total-label">Total</span>
                        <span className="profile-total-value">
                          {o.totalPrice?.toLocaleString()}đ
                        </span>
                      </div>

                      {/* ADDRESS */}
                      <div className="profile-address">
                        📍 {o.customerInfo?.address}
                      </div>

                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile