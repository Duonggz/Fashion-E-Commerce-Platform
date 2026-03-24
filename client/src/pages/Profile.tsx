import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const Profile = () => {

  const navigate = useNavigate()

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  )

  useEffect(()=>{

    if(!user){
      navigate("/auth")
    }

  },[user,navigate])

  const logout = () => {

    localStorage.removeItem("user")
    localStorage.removeItem("cart")

    alert("Đã đăng xuất")

    navigate("/")

  }

  const [edit,setEdit] = useState(false)
  const [form,setForm] = useState(user)

  {edit && (
    <div>
      <input value={form.fullname}
        onChange={e=>setForm({...form,fullname:e.target.value})}
      />
      <input value={form.phone}
        onChange={e=>setForm({...form,phone:e.target.value})}
      />
      <input value={form.address}
        onChange={e=>setForm({...form,address:e.target.value})}
      />

      <button onClick={async ()=>{
        const res = await axios.put(
          "http://localhost:3000/api/users/update/"+user._id,
          form
        )

        localStorage.setItem("user", JSON.stringify(res.data))
        setEdit(false)
        alert("Cập nhật thành công")
      }}>
        Lưu
      </button>

      <button onClick={()=>setEdit(true)}>
        Chỉnh sửa
      </button>
    </div>
  )}

  if(!user) return null

  return(

    <div style={{ width: "100%", maxWidth: 420, position: "fixed", top: "50%", left: "55%", transform: "translate(-50%, -50%)" }}>

      <h2>Thông tin khách hàng</h2>

      <p>Tên: {user.fullname}</p>
      <p>Phone: {user.phone}</p>
      <p>Email: {user.email}</p>
      <p>Địa chỉ: {user.address}</p>

      <button onClick={logout}>
        Đăng xuất
      </button>

      

    </div>

  )

}

export default Profile