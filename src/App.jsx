import "./App.css";
// Library
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// Secuirty
import OpenRoute from "./routes/OpenRoute";
import PrivateRoute from "./routes/PrivateRoute";
//Component
import Header from "./components/common/Navbar/Header";

//component
import Modal from "./components/core/cart/Modal";
//Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import AllProduct from "./pages/AllProduct";
import CheckoutForm from "./components/core/cart/CheckoutForm";
import Order from "./pages/MyOrder";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import ContactUsForm from "./pages/ContactUsForm";

// Admin
import MainDashboard from "./pages/Admin/MainDashboard";
import AddProduct from "./pages/Admin/Product/AddProduct";
import AllProductAdmin from "./pages/Admin/Product/AllProduct";
import AddCategory from "./pages/Admin/Product/AddCategory";
import Orders from "./pages/Admin/Product/Orders";
//API
import { getAllProduct } from "./serivces/operations/product";
import { useEffect } from "react";
import { setCheckout } from "./redux/slices/paymentSlice";
import AboutUs from "./pages/About";

function App() {
  const { checkout } = useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.profile);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProduct());
  }, []);
  return (
    <div className="min-w-screen min-h-screen flex flex-col font-montserrat">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/allProduct" element={<AllProduct />} />
        <Route path="product/:productID" element={<ProductDetails />} />
        <Route path="contact" element={<ContactUsForm />} />

        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="order"
          element={
            <PrivateRoute>
              <Order />
            </PrivateRoute>
          }
        />

        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {user?.accountType === "Admin" && (
          <Route
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route
              path="admin/dashboard/add-product"
              element={
                <PrivateRoute>
                  <AddProduct />
                  {/* <AllProductAdmin /> */}
                </PrivateRoute>
              }
            />
            <Route
              path="admin/dashboard/add-category"
              element={
                <PrivateRoute>
                  <AddCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="admin/dashboard/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="admin/dashboard/all-product"
              element={
                <PrivateRoute>
                  <AllProductAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="admin/dashboard"
              element={
                <PrivateRoute>
                  <MainDashboard />
                </PrivateRoute>
              }
            />
            /
          </Route>
        )}
      </Routes>

      {checkout && (
        <PrivateRoute>
          <Modal
            show={checkout}
            handleClose={() => dispatch(setCheckout(false))}
          >
            <CheckoutForm handleClose={() => dispatch(setCheckout(false))} />
          </Modal>
        </PrivateRoute>
      )}

      {/* Admin Routes */}
    </div>
  );
}

export default App;
