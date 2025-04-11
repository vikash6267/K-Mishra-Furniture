import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../authSlice"
import cartReducer from "../cartSlice"
import profileReducer from "../profileSlice"
import productReducer from "../product"
import paymentReducer from "../paymentSlice"
import wishlistReducer from "../wishListSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
  product: productReducer,
  payment :paymentReducer,
  wishlist:wishlistReducer

  })
  
  export default rootReducer