import React, { useState, useEffect } from "react";
import { fetchProductDetails } from "../serivces/operations/product";
import { useParams, useLocation } from "react-router-dom";
import "./ProductDetails.css";
import { displayMoney, calculateDiscount } from "../helper/utills";

import { IoIosAdd, IoIosRemove } from "react-icons/io";

import { addToCart, handleIsCartOpen } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoMdShare } from "react-icons/io";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  addToWish,
  removeFromWish,
  fetchWishlist,
} from "../serivces/operations/product";

import ImageSlider from "../components/core/Product Details/ImageSlider";
import Details from "../components/core/Product Details/Details";
import ProductCard from "../components/common/ProductCard";

function ProductDetails() {
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [alsoLike, setAlsoLike] = useState([]);

  const [loading, setLoading] = useState(false);
  const { productID, refer } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const { wishlistProduct } = useSelector((state) => state.wishlist);
  const [earnings, setEarnings] = useState(0);
  const { token } = useSelector((state) => state.auth);
  const { allProduct } = useSelector((state) => state.product);

  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const { cart } = useSelector((state) => state.cart);
  // Function to handle showing/hiding the modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  //
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const allSizes = ["S", "M", "L", "XL", "XXL"];





 

  const selectRandomProducts = (products) => {
    if (!Array.isArray(products)) {
      console.error("Products is not an array");
      return [];
    }

    // Create a shallow copy of the products array
    const productsCopy = products.slice();

    // Fisher-Yates shuffle algorithm
    for (let i = productsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productsCopy[i], productsCopy[j]] = [productsCopy[j], productsCopy[i]];
    }

    // Select the first four products from the shuffled array
    return productsCopy.slice(0, 4);
  };

  const [selectedUnavailableSize, setSelectedUnavailableSize] = useState(null);





  let selectedProducts;
  // Calculating Avg Review count

  useEffect(() => {
    selectedProducts = selectRandomProducts(allProduct);
    setAlsoLike(selectedProducts);
  }, [product]);

  // handling Add-to-cart
  const handleAddItem = () => {
   
    if (refer) {
      dispatch(
        addToCart({
          products: product,
          quantity,
            refer: refer,
        })
      );
    } else {
      dispatch(addToCart({ products: product, quantity, size: selectedSize }));

      dispatch(handleIsCartOpen());
    }
  };

  function increaseQuantityHandler() {
    if (product.stock <= quantity) {
      return;
    }

    setQuantity((prv) => prv + 1);
  }

  function deceraseQuantityHandler() {
    if (quantity <= 1) {
      return;
    }
    setQuantity((prv) => prv - 1);
  }

  useEffect(() => {
    // Calling fetchProductDetails fucntion to fetch the details
    const isProductAvailble = allProduct.find(
      (item) => item?.slug === productID
    );

    if (false) {
      setProduct(isProductAvailble);
      console.log(isProductAvailble);
    }

    (async () => {
      try {
        // if(!isProductAvailble){
        if (true) {
          setLoading(true);
        }
        const res = await fetchProductDetails(productID);
        // console.log("Product details res: ", res);

        if (res.data !== undefined) {
          setProduct(res?.data?.productDetails);
          // console.log(res?.data?.productDetails);
        }
        setLoading(false);
      } catch (error) {
        console.log("Could not fetch Course Details");
        setLoading(false);
      }
    })();

    // console.log(product)
    console.log(product?.tag);
    console.log(product?.tag?.join(", "));
  }, [productID]);
  useEffect(() => {
    if (product && product.price) {
      console.log(product.price); // Check the value of product.price
      const calculatedEarnings = parseInt(product.price * 0.3);
      setEarnings(calculatedEarnings);
      console.log(earnings); // Move this line here
    }
  }, [product, setEarnings]);

  const shareProduct = () => {
    let productUrl = `https://absencemain.vercel.app/product/${product?.slug}`;
    if (user?.referralCode) {
      productUrl += "/" + user.referralCode;
    }
    const shareData = {
      title: product.title,
      text: "Check out this product!",
      url: productUrl,
    };

    if (navigator?.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  // Call the shareProduct function when needed

  if (loading || !product) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // calculating Prices

  const oldPrice = product ? displayMoney(product.highPrice) : 0;

  const isProductInWishlist = wishlistProduct.some(
    (item) => item._id === product._id
  );



  const isProductInCart = cart.some(
    (cartItem) => cartItem.product._id === productID
  );

  return (
    <HelmetProvider>
      <Helmet>
        <title>{product?.title || "Default Product Title"}</title>
        <link
          rel="canonical"
          href={`https://wearabsence.com/product/${product.slug}`}
        />
        <meta
          name="description"
          content={product?.description || "Default product description"}
        />
        <meta
          property="og:title"
          content={product?.title || "Default Product Title"}
        />
        <meta
          property="og:description"
          content={product?.description || "Default product description"}
        />
        <meta
          property="og:url"
          content={`https://wearabsence.com/${product?.id || "product-id"}`}
        />
        <meta property="og:type" content="product" />
        <meta name="keywords" content={product?.tag?.join(", ")} />
        <meta
          property="og:image"
          content={product?.images?.[0]?.url || "default-image-url.jpg"}
        />
     
      </Helmet>
      <div className="bg-black mt-[90px] text-white flex  ">
        {/* Marquee tag to continuously display earnings */}
        
      </div>
      <div className="prodcutDetialsContainer min-w-screen mb-[200px] ">
        <section className="w-screen " id="product_details">
          <div className="">
            <div className="wrapper prod_details_wrapper lg:w-11/12 mx-auto">
              {/*=== Product Details Left-content ===*/}
              <div className="lg:w-[50%] md:w-[50%] w-screen">
                <ImageSlider slides={product?.images} />
              </div>
              {/*=== Product Details Right-content ===*/}
              <div className="prod_details_right_col_001">
                <div className="">
                  <div className=" space-y-2 flex min-w-screen items-center flex-col lg:block">
                    <h2 className=" uppercase text-xl min-w-screen font-semibold  ">
                      {product.title}
                    </h2>
                    <div className="">
                      {/* {product.description && product.description} */}

                      <h2 className="price">
                        $ {product.price} &nbsp;
                        <small className="del_price">
                          <del className=" text-red-500">{oldPrice}</del>
                        </small>
                      </h2>
                    </div>
                  </div>

                  {/* <div>
{isProductInWishlist ? (
  <div className="flex items-center">
    <FaHeart
      onClick={() => handleRemoveFromWishlist(product._id, token)}
      className="text-red-500 bg-white rounded-full p-1 cursor-pointer mr-1 hover:text-red-600 hover:bg-red-100 transition-colors duration-300"
    />
    <span 
      className="text-red-500 bg-white rounded-full p-1 cursor-pointer hover:text-red-600 hover:bg-red-100 transition-colors duration-300" 
      onClick={() => handleRemoveFromWishlist(product._id, token)}
    >
      Remove From Wishlist
    </span>
  </div>
) : (
  <div className="flex items-center">
    <FaRegHeart
      onClick={() => handleAddToWishlist(product._id, token)}
      className="bg-red-500 text-white rounded-full p-1 cursor-pointer mr-1 hover:bg-red-600 transition-colors duration-300"
    />
    <span 
      className="bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600 transition-colors duration-300" 
      onClick={() => handleAddToWishlist(product._id, token)}
    >
      Add To Wishlist
    </span>
  </div>
)}
</div> */}
                </div>

                {/* <div className="text-sm flex flex-wrap items-center gap-2 prod_details_ratings">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
              </div> */}

                <div className="prod_details_price">
                  <div className="price_box">
                    {/* <h2 className="price">
                  {newPrice} &nbsp;
                  <small className="del_price">
                    <del>{oldPrice}</del>
                  </small>
                </h2> */}
                    {/* <p className="saved_price">
                  You save: {savedPrice} ({savedDiscount}%)
                </p>
                <span className="tax_txt">(Inclusive of all taxes)</span> */}
                  </div>

                  {/* <div className="flex items-center min-w-screen  ">
                {product.quantity >= 1 ? (
                  <span className="instock flex items-center">
                    <MdOutlineDone /> In Stock
                  </span>
                ) : (
                  <span className="outofstock">
                    <IoClose />
                    Out of stock
                  </span>
                )}
              </div> */}
                </div>
                {/* <div className="seprator2"></div> */}

                <div className=" flex flex-col  items-center mt-2 lg:block">
                  {/* <div className="productDiscriptiopn_text">
                  <h4>Descripition :</h4>
                  <p>{product.description}</p>
                </div> */}
                  <div>
                    <div>
                      {/* <h2>Select Size:</h2> */}
                      <div>
                        {/* <div className="flex flex-wrap gap-3">
                          {product?.sizes?.map((size) => (
                            <div
                              key={size}
                              onClick={() => handleSizeClick(size)}
                            
                              className={`px-2 py-1 rounded border cursor-pointer
                               ${
                                size?.size === selectedSize
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-blue-500"
                              } ${
                                product?.sizes?.includes(size)
                                  ? "border-gray-500"
                                  : "border-red-500"
                              }`}
                            >
                              {product?.sizes?.includes(size) ? (
                                size?.size
                              ) : (
                                <del className="text-red-500">{size}</del>
                              )}
                            </div>
                          ))}
                        </div> */}

                      

                      
                      </div>
                    </div>
                  </div>
                  {/* <div className="deliveryText">
                <MdOutlineLocalShipping />
                We deliver! Just say when and how.
              </div> */}
                </div>
                <div className="seprator2"></div>

                <div className="prod_details_additem mt-2 flex ">
                  <h5>QTY :</h5>
                  <div className=" flex ">
                    <button
                      onClick={deceraseQuantityHandler}
                      className="additem_decrease"
                    >
                      <IoIosRemove />
                    </button>
                    <input
                      readOnly
                      type="number"
                      value={quantity}
                      className="input text-center w-[32px] text-[1rem]"
                    />
                    <button
                      onClick={increaseQuantityHandler}
                      className="additem_increase"
                    >
                      <IoIosAdd />
                    </button>
                  </div>
                </div>

                <div className=" mt-4 text-wrap flex rounded-xl text-center justify-center flex-col gap-4">
                 

                  {/* <button
                variant="contained"
                className="p-2 bg-gray-600 rounded-xl text-white"
                onClick={handleAddItem}
                disabled={product.stock <= 0}
              >
                Add to cart
              </button> */}

                  {isProductInCart ? (
                    <button
                      className="p-2 px-16 rounded-2xl bg-gray-900 text-white w-full"
                      onClick={() => dispatch(handleIsCartOpen())}
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      className="p-2 px-16 rounded-2xl bg-gray-900 text-white"
                      onClick={handleAddItem}
                      disabled={product.quantity <= 0}
                    >
                      Add To Cart
                    </button>
                  )}
                </div>

            
                <div className=" min-h-[200px]">
                  <Details product={product}></Details>
                </div>
              </div>
            </div>
          </div>
        </section>

     

        {/* for Mobile  */}
        {/* <div className="fixed bottom-0 z-40 h-[50px] ">
      <div style={{ zIndex: 100 }} className="bg-white w-full">
      

        <div className="w-[100vw] border-2 p-2  z-50  lg:hidden sm:hidden md:hidden flex justify-between  items-center">
       
          <div className=" w-11/12 mx-auto flex justify-between items-center">
       
            <div>
              <FaHeart
                className={` text-[27px] ${
                  isProductInWishlist ? "text-red-600" : "text-gray-900"
                }  `}
                onClick={WishlistButton}
              />
            </div>


            <div>

            
              <button
                className=" p-2 px-16 rounded-2xl bg-gray-900 text-white"
                onClick={handleAddItem}
                disabled={product.stock <= 0}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div> */}

        <div className=" lg:mt-[100px]">
          <div className=" flex items-center justify-between w-11/12 mx-auto mt-[10px] ">
            <p className=" font-semibold text-[12px]">YOU MAY ALSO LIKE </p>

            <Link to="/allProduct" className="">
              <div
                to="/allProduct"
                className=" text-[12px] border-2 text-black p-1 px-3 rounded-md"
              >
                Discover More
              </div>

              {/* <IoShirtSharp className=" text-blue-600" /> */}
            </Link>
          </div>
          <div className="  w-11/12 mx-auto  grid lg:grid-cols-4 gap-4 sm:grid-cols-3 md:grid-cols-3 xs:grid-cols-2 grid-cols-2 mt-[20px]">
            {allProduct &&
              alsoLike.map((product) => (
                <ProductCard key={product._id} products={product} />
              ))}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default ProductDetails;
