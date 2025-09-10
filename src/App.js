import "react-lazy-load-image-component/src/effects/blur.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./App.css";
import Ecom from "./components/Ecom";
import Describe from "./components/Describe";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/Profile";
import CardCheckout from "./components/CardCheckout";
import OrderDetails from "./components/OrderDetails";
import CryptoCheckout from "./components/CryptoCheckout";
import ProfileDetails from "./components/ProfileDetails";
// import Comingsoon from "./components/comingsoon";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Ecom />} />

          <Route path="/product/:productId" element={<Describe />} />
          <Route path="/orders" element={<Profile />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/checkoutWithCard" element={<CardCheckout />} />

          <Route path="/checkoutWithCrypto" element={<CryptoCheckout />} />
          <Route path="/profile" element={<ProfileDetails />} />
          {/* <Route path="/landing-page" element={<Comingsoon />} />
          <Route path="*" element={<Navigate to="/landing-page" replace />} /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
