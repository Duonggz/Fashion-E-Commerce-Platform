import API_BASE_URL from "../config/api"
import { useEffect, useState } from "react"
import axios from "axios"


const Orders = () => {

  const [orders,setOrders] = useState<any[]>([])

  const loadOrders = async () => {

    const res = await axios.get(
      `${API_BASE_URL}/api/admin/orders`
    )

    setOrders(res.data)

  }

  useEffect(()=>{

    loadOrders()

  },[])

  const confirmPayment = async(id:string)=>{

    await axios.put(
      `${API_BASE_URL}/api/admin/orders/`+id+"/pay"
    )

    loadOrders()

  }

  const confirmShipping = async (id: string) => {
    await axios.put(
      `${API_BASE_URL}/api/admin/orders/` + id + "/ship"
    )
    loadOrders()
  }

  return(

    <div>

      <h2>Orders</h2>

      {/* THÊM CONTAINER GRID */}
      <div className="orders-container">

        {orders.map(o=>(

          <div 
            key={o._id}
            className="order-card"
          >

            <h3>{o.orderId}</h3>

            <p><b>Name:</b> {o.customerInfo?.fullname}</p>
            <p><b>Phone:</b> {o.customerInfo?.phone}</p>
            <p><b>Address:</b> {o.customerInfo?.address}</p>

            <p><b>Total:</b> {o.totalPrice}đ</p>

            <p className={`status ${o.status}`}>
              {o.status}
            </p>

            <div className="order-items">
              {o.items.map((item:any,i:number)=>(
                <div key={i}>
                  {item.name} - {item.size} x {item.quantity}
                </div>
              ))}
            </div>

            {o.status === "pending" && (

              <button
                onClick={()=>confirmPayment(o._id)}
              >
                Confirm Paid
              </button>
            )}

            {o.status === "paid" && (
              <button onClick={() => confirmShipping(o._id)}>
                Mark as Shipping
              </button>
            )}

          </div>

        ))}

      </div>

    </div>

  )

}

export default Orders


