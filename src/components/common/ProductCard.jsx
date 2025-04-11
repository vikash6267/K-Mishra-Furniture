import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { displayMoney } from "../../helper/utills";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

function ProductCard({ products }) {
  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);

  const { _id, slug, title, description, price, highPrice, sizes, images } = products;
  const truncatedDescription =
    description.length > 25
      ? description.substring(0, 25) + "..."
      : description;

  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const handleAddToCart = (products) => {
    dispatch(addToCart({ products }));
  };

  const newPrice = displayMoney(price);
  const oldPrice = displayMoney(highPrice);

  return (
    <Link to={`/product/${_id}`} key={_id} data-aos="zoom-in-down">
      <div className="flex flex-col gap-3 mt-2 w-full max-w-xs">
        <div className="relative h-48">
          <img
            src={images[0]?.url}
            alt={title}
            className="object-cover w-full h-full transition-all duration-300 ease-in-out transform hover:translate-y-1"
          />
          <img
            src={images[1]?.url}
            alt={title}
            className="object-cover w-full h-full absolute top-0 left-0 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"
          />
        </div>
        <div>
          <p className="font-montserrat text-lg text-gray-600 truncate">{title}</p>
          <p className="font-montserrat text-sm text-gray-600">{newPrice}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
