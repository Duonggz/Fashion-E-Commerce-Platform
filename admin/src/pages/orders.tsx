import API_BASE_URL from "../config/api"
import { useEffect, useState } from "react"
import axios from "axios"

const statusLabel: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  shipping: "Đang giao",
  success: "Thành công",
  cancelled: "Đã hủy",
  returned: "Hoàn hàng",
  out_of_stock: "Hết hàng"
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

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([])

  const loadOrders = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/admin/orders`)
    setOrders(res.data)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const confirmPayment = async (id: string) => {
    await axios.put(`${API_BASE_URL}/api/admin/orders/${id}/pay`)
    loadOrders()
  }

  const confirmShipping = async (id: string) => {
    await axios.put(`${API_BASE_URL}/api/admin/orders/${id}/ship`)
    loadOrders()
  }

  const cancelOrder = async (id: string) => {
    await axios.put(`${API_BASE_URL}/api/admin/orders/${id}/cancel`)
    loadOrders()
  }

  const confirmSuccess = async (id: string) => {
    await axios.put(`${API_BASE_URL}/api/admin/orders/${id}/success`)
    loadOrders()
  }

  const confirmReturn = async (id: string) => {
    await axios.put(`${API_BASE_URL}/api/admin/orders/${id}/return`)
    loadOrders()
  }

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={th}>Mã đơn</th>
              <th style={th}>Tên</th>
              <th style={th}>SĐT</th>
              <th style={th}>Địa chỉ</th>
              <th style={th}>Sản phẩm</th>
              <th style={th}>Tổng tiền</th>
              <th style={th}>Trạng thái</th>
              <th style={th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} style={{ borderBottom: "1px solid #e2e8f0" }}>

                <td style={td}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {o.orderId}
                  </span>
                </td>

                <td style={td}>{o.customerInfo?.fullname}</td>
                <td style={td}>{o.customerInfo?.phone}</td>
                <td style={td}>{o.customerInfo?.address}</td>

                <td style={td}>
                  {o.items.map((item: any, i: number) => (
                    <div key={i} style={{ fontSize: "12px" }}>
                      {item.name} - {item.size} x {item.quantity}
                    </div>
                  ))}
                </td>

                <td style={td}>
                  <b>{o.totalPrice?.toLocaleString()}đ</b>
                </td>

                <td style={td}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: statusColor[o.status] + "20",
                    color: statusColor[o.status]
                  }}>
                    {statusLabel[o.status] || o.status}
                  </span>
                </td>

                <td style={td}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>

                    {o.status === "pending" && (
                      <button
                        style={btnBlue}
                        onClick={() => confirmPayment(o._id)}
                      >
                        Xác nhận thanh toán
                      </button>
                    )}

                    {o.status === "paid" && (
                      <>
                        <button
                          style={btnPurple}
                          onClick={() => confirmShipping(o._id)}
                        >
                          Giao hàng
                        </button>
                        <button
                          style={btnRed}
                          onClick={() => cancelOrder(o._id)}
                        >
                          Hủy đơn
                        </button>
                      </>
                    )}

                    {o.status === "shipping" && (
                      <>
                        <button
                          style={btnGreen}
                          onClick={() => confirmSuccess(o._id)}
                        >
                          Thành công
                        </button>
                        <button
                          style={btnOrange}
                          onClick={() => confirmReturn(o._id)}
                        >
                          Hoàn hàng
                        </button>
                      </>
                    )}

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th: React.CSSProperties = {
  padding: "12px 16px",
  fontWeight: 600,
  color: "#374151",
  whiteSpace: "nowrap"
}

const td: React.CSSProperties = {
  padding: "12px 16px",
  verticalAlign: "top",
  whiteSpace: "nowrap"
}

const btnBase: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600
}

const btnBlue = { ...btnBase, background: "#3b82f6", color: "#fff" }
const btnPurple = { ...btnBase, background: "#8b5cf6", color: "#fff" }
const btnRed = { ...btnBase, background: "#ef4444", color: "#fff" }
const btnGreen = { ...btnBase, background: "#10b981", color: "#fff" }
const btnOrange = { ...btnBase, background: "#f97316", color: "#fff" }

export default Orders