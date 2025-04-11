import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../redux/slices/authSlice"
import { resetCart } from "../../redux/slices/cartSlice"
import { setUser } from "../../redux/slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { userEndpoints } from "../apis"
import { resetWishlist } from "../../redux/slices/wishListSlice"
const {
  SIGNUP_API,
  LOGIN_API,
  FETCH_PROFILE,
} = userEndpoints





export function signUp(
  formData,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, formData)

      // console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      console.log(response.data.user)
      dispatch(setToken(response.data.token))
      dispatch(setUser(response.data.user))
      localStorage.setItem("user", JSON.stringify(response.data.user))

      localStorage.setItem("token", JSON.stringify(response.data.token))
      // navigate("/profile")


      toast.success("Login Successful")

    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Login Failed")
      // navigate("/login")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      // console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      dispatch(setUser(response.data.user))
      localStorage.setItem("user", JSON.stringify(response.data.user))

      localStorage.setItem("token", JSON.stringify(response.data.token))
      // navigate("/profile")
   
    } catch (error) {
      console.log("LOGIN API ERROR............", error?.response.data.message)
      toast.error( error?.response?.data?.message)
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function fetchMyProfile(token) {

  return async (dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", FETCH_PROFILE, null, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      })

      console.log("APP JS RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      // console.log(response.data)

      dispatch(setUser(response.data.user))



      localStorage.setItem("user", JSON.stringify(response.data.user))

    } catch (error) {
      // console.log("LOGIN API ERROR............", error)
    }
    dispatch(setLoading(false))
  }
}





export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    dispatch(resetWishlist())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}