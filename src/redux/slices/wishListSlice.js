import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistProduct: localStorage.getItem("wishlist")
    ? JSON.parse(localStorage.getItem("wishlist"))
    : [], // If localStorage.getItem("wishlist") is null or undefined, set an empty array
};


const wishListSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    allWishlist: (state, action) => {
        console.log("first",action.payload)
      state.wishlistProduct = action.payload;
      localStorage.setItem("wishlist", JSON.stringify(state.wishlistProduct));

    },
    resetWishlist: (state) =>{
        state.wishlistProduct = []
      localStorage.removeItem("wishlist")


    }


  },
});

export const { allWishlist ,resetWishlist} = wishListSlice.actions;

export default wishListSlice.reducer;
