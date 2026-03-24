import API_BASE_URL from "../config/api"
import { useState } from "react"
import "../assets/styles/auth.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"

type TabType = "login" | "register"

const Auth: React.FC = () => {

  const [activeTab,setActiveTab] = useState<TabType>("login")

  const navigate = useNavigate()

  /* LOGIN STATE */

  const [loginData,setLoginData] = useState({

    username:"",
    password:""

  })


  /* REGISTER STATE */

  const [registerData,setRegisterData] = useState({

    username:"",
    fullname:"",
    password:"",
    phone:"",
    email:"",
    address:""

  })


  /* LOGIN */

  const handleLoginSubmit = async (e:React.FormEvent) => {

    e.preventDefault()

    try{

      const res = await axios.post(

        `${API_BASE_URL}/api/users/login`,
        loginData

      )

      if(res.data.error){

        alert("Sai tài khoản hoặc mật khẩu")

        return

      }

      /* SAVE USER */

      localStorage.setItem(

        "user",
        JSON.stringify(res.data)

      )

      alert("Đăng nhập thành công")

      navigate("/")

    }
    catch(err){

      console.error(err)

      alert("Lỗi đăng nhập")

    }

  }


  /* REGISTER */

  const handleRegisterSubmit = async (e:React.FormEvent) => {

    e.preventDefault()

    try{

      await axios.post(

        `${API_BASE_URL}/api/users/register`,
        registerData

      )

      alert("Đăng ký thành công")

      setActiveTab("login")

    }
    catch(err){

      console.error(err)

      alert("Lỗi đăng ký")

    }

  }


  return (

    <div className="auth-container">

      <div className="auth-box">

        {/* TABS */}

        <div className="auth-tabs">

          <button
            className={`tab ${activeTab === "login" ? "active" : ""}`}
            onClick={()=>setActiveTab("login")}
          >

            ĐĂNG NHẬP

          </button>

          <button
            className={`tab ${activeTab === "register" ? "active" : ""}`}
            onClick={()=>setActiveTab("register")}
          >

            ĐĂNG KÝ

          </button>

        </div>


        {/* LOGIN */}

        {activeTab === "login" && (

          <form className="form active" onSubmit={handleLoginSubmit}>

            <div className="input-group">

              <label>Tên đăng nhập</label>

              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e)=>
                  setLoginData({
                    ...loginData,
                    username:e.target.value
                  })
                }
              />

            </div>


            <div className="input-group">

              <label>Mật khẩu</label>

              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e)=>
                  setLoginData({
                    ...loginData,
                    password:e.target.value
                  })
                }
              />

            </div>


            <button type="submit" className="btn">

              ĐĂNG NHẬP

            </button>

          </form>

        )}


        {/* REGISTER */}

        {activeTab === "register" && (

          <form className="form active" onSubmit={handleRegisterSubmit}>

            <div className="input-group">

              <label>Tên đăng nhập</label>

              <input
                type="text"
                required
                value={registerData.username}
                onChange={(e)=>
                  setRegisterData({
                    ...registerData,
                    username:e.target.value
                  })
                }
              />

            </div>


            <div className="input-group">

              <label>Tên người dùng</label>

              <input
                type="text"
                required
                value={registerData.fullname}
                onChange={(e)=>
                  setRegisterData({
                    ...registerData,
                    fullname:e.target.value
                  })
                }
              />

            </div>


            <div className="input-group">

              <label>Mật khẩu</label>

              <input
                type="password"
                required
                value={registerData.password}
                onChange={(e)=>
                  setRegisterData({
                    ...registerData,
                    password:e.target.value
                  })
                }
              />

            </div>


            <div className="input-group">

              <label>Số điện thoại</label>

              <input
                type="text"
                required
                value={registerData.phone}
                onChange={(e)=>
                  setRegisterData({
                    ...registerData,
                    phone:e.target.value
                  })
                }
              />

            </div>


            <div className="input-group">

              <label>Địa chỉ email</label>

              <input
                type="email"
                required
                value={registerData.email}
                onChange={(e)=>
                  setRegisterData({
                    ...registerData,
                    email:e.target.value
                  })
                }
              />

            </div>


            <div className="input-group">

              <label>Địa chỉ</label>

              <input
                type="text"
                required
                value={registerData.address}
                onChange={(e)=>
                  setRegisterData({
                    ...registerData,
                    address:e.target.value
                  })
                }
              />

            </div>


            <button type="submit" className="btn">

              ĐĂNG KÝ

            </button>

          </form>

        )}

      </div>

    </div>

  )

}

export default Auth



