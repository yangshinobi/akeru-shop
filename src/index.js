import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { addToCart } from "./features/cart/cartSlice";
import {
  ThirdwebProvider,
  metamaskWallet,
  walletConnect,
  paperWallet,
} from "@thirdweb-dev/react";
import { Mumbai, Polygon, PolygonAmoyTestnet } from "@thirdweb-dev/chains";

const root = ReactDOM.createRoot(document.getElementById("root"));

const savedCart = localStorage.getItem("default-user-cart");
if (savedCart) {
  const cartData = JSON.parse(savedCart);

  cartData.forEach((item) => {
    store.dispatch(addToCart(item));
  });
}

root.render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={PolygonAmoyTestnet}
      supportedChains={[Mumbai, Polygon, PolygonAmoyTestnet]}
      clientId="7de394ce6fd45a1f2c116d50083657b0"
      supportedWallets={[
        metamaskWallet(),
        walletConnect(),
        paperWallet({
          paperClientId: "7c7e2c81-5c90-4777-bd17-b87a5fbb36de",
        }),
      ]}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </ThirdwebProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
