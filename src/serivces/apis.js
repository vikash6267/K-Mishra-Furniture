const BASE_URL = process.env.REACT_APP_BASE_URL


// ??USER APIS
export const userEndpoints = {
    LOGIN_API : BASE_URL + "/user/login",
    SIGNUP_API : BASE_URL +"/user/signup",
    FETCH_PROFILE : BASE_URL + "/user/fetchMyProfile",
    CONTACT_US_API: BASE_URL + "/user/contact",

}


// PRODUCT APIS
export const productEndpoints = {
    GET_ALL_PRODUCT_API: BASE_URL + "/product/all-product",
     GET_PRODUCT_DETAILS : BASE_URL + "/product/getProductDetails",
     UPDATE_PRODUCT_DETAILS : BASE_URL + "/product/update",


      //COUPON APIS 
     GET_COUPON : BASE_URL + "/coupon/get"
     
  }





  export const paymentEndpoints ={
    PRODUCT_PAYMENT_API: BASE_URL + "/order/capturePayment",
    PRODUCT_VERIFY_API: BASE_URL + "/order/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/order/sendPaymentSuccessEmail",
    
    
    // Get all orders
    GET_ALL_ORDER: BASE_URL + "/order/get",

    
  }
  




  // ADMIN APIS 

  export const adminEndPoints = {
    ADD_PRODUCT_API : BASE_URL + "/product/create",
    EDIT_PRODUCT_API : BASE_URL + "/product/update",
    DELETE_PRODUCT_API : BASE_URL + "/product/delete",



    //Category
    ADD_CATEGORY_API : BASE_URL + "/product/createCategory",
    EDIT_CATEGORY_API : BASE_URL + "/product/editCategory",
    DELTE_CATEGORY_API : BASE_URL + "/product/deleteCategory",
    GET_ALL_CATEGORY_API : BASE_URL + "/product/showAllCategories",


    IMAGE_UPLOAD : BASE_URL + "/image/multi",


    //Order
    GET_ALL_ORDER : BASE_URL + "/product/adminGetOrder",
    UPDATE_ORDER : BASE_URL + "/product/updateOrder"


   
  }