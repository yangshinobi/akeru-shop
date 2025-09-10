import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAddress } from "@thirdweb-dev/react";
import { BsCreditCard2Back } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Checkout() {
  // const BASE_URL = "http://localhost:3800";

  const navigate = useNavigate();

  const address = useAddress();

  const tempCartItems = useSelector((state) => state.cart.cartItems);

  const [subtotal, setSubTotalPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0.001);
  const [tax, setTax] = useState(0.001);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [province, setProvince] = useState("");
  const [town, setTown] = useState("");
  const [zip, setZip] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ETH");

  const [cartItems, setCartItems] = useState([]);

  const calculatePrices = (cartItems) => {
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += parseFloat(item.price);
    }

    setShippingPrice(0.001);
    setTax(0.001);
    setSubTotalPrice(subtotal);
  };

  useEffect(() => {
    const uniqueProductCountSet = new Set();

    // Iterate through tempCartItems and filter out unique product IDs
    tempCartItems.forEach((item) => {
      if (item.productId) {
        const productId = item.productId;
        if (!uniqueProductCountSet.has(productId)) {
          uniqueProductCountSet.add(productId);
        }
      }
    });

    const productCountSet = new Set();

    const newCartItem = [];
    if (paymentMethod === "Card") {
      if (uniqueProductCountSet.size > 1) {
        toast(
          "Only one type of item can be purchased with card. \n Please use MATIC for payment ",
          {
            toastId: "Card-checkout-selected"
          }
        );
      }

      tempCartItems.forEach((item) => {
        if (item.productId) {
          const productId = item.productId;
          if (productCountSet.size > 0 && productCountSet.has(productId)) {
            newCartItem.push(item);
          } else if (productCountSet.size === 0) {
            productCountSet.add(productId);
            newCartItem.push(item);
          }
        }
      });
      calculatePrices(newCartItem);
      setCartItems(newCartItem);
    } else {
      calculatePrices(tempCartItems);
      setCartItems(tempCartItems);
    }
  }, [tempCartItems, paymentMethod]);

  const createOrder = async () => {
    if (!address) {
      toast("Connect your wallet", {
        toastId: "Wallet Connect Error"
      });
      return;
    }

    if (
      !fullName ||
      !email ||
      !phoneNo ||
      !houseNo ||
      !streetAddress ||
      !province ||
      !town ||
      !zip ||
      !paymentMethod
    ) {
      toast("Fill all the values", {
        toastId: "Order Details"
      });

      console.log("fill all the details");
      return;
    }

    const customerInfo = {
      name: fullName,
      email: email,
      phoneNo: phoneNo,
      shippingAddress: {
        houseNo: houseNo,
        streetAddress: streetAddress,
        province: province,
        town: town,
        zip: zip
      }
    };

    const productDetails = [];

    for (const item of cartItems) {
      const productObj = {
        tokenId: item.tokenId,
        productName: item.productName,
        price: item.price,
        sku: item.sku + "-" + item.number + "-" + item.size,
        color: item.color,
        size: item.size,
        productNumber: item.number,
        quantity: item.quantity,
        productId: item.productId
      };
      productDetails.push(productObj);
    }

    const orderDetails = {
      productDetails: productDetails,
      subTotal: subtotal,
      tax: tax,
      shippingCharge: shippingPrice,
      totalAmount: subtotal + tax + shippingPrice
    };

    const receiverWalletAddress = address;

    const shippingDetails = {
      shippingMethod: "DTDC Courier",
      estimateDeliveryDate: new Date()
    };

    const paymentInfo = {
      paymentMethod: paymentMethod
    };

    const orderObj = {
      customerInfo: customerInfo,
      orderDetails: orderDetails,
      receiverWalletAddress: receiverWalletAddress,
      shippingDetails: shippingDetails,
      paymentInfo: paymentInfo
    };

    if (paymentMethod === "Card") {
      navigate("/checkoutWithCard", {
        state: {
          tokenId: cartItems[0].tokenId,
          price: cartItems[0].price,
          quantity: cartItems.length,
          walletAddress: address,
          extraCharge: tax + shippingPrice,
          orderObj: orderObj,
          paymentMethod: paymentMethod
        }
      });
    } else if (paymentMethod === "ETH") {
      const tokenQuantityMapping = new Map();

      cartItems.forEach((item) => {
        if (!tokenQuantityMapping.has(item.tokenId)) {
          tokenQuantityMapping.set(item.tokenId, 0);
        }

        tokenQuantityMapping.set(
          item.tokenId,
          tokenQuantityMapping.get(item.tokenId) + 1
        );
      });
      const uniqueTokens = [];
      const quantities = [];

      tokenQuantityMapping.forEach((quantity, tokenId) => {
        uniqueTokens.push(tokenId);
        quantities.push(quantity);
      });

      navigate("/checkoutWithCrypto", {
        state: {
          tokenIds: uniqueTokens,
          quantity: quantities,
          walletAddress: address,
          totalPrice: subtotal + shippingPrice + tax,
          orderObj: orderObj,
          paymentMethod: paymentMethod
        }
      });
    }
  };

  return (
    <div className="mt-40">
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">Check your items</p>
          <div className="mt-6 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            <div className="mt-2">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {cartItems &&
                    cartItems.map((product, idx) => (
                      <li key={idx} className="flex py-6">
                        <div className="h-25 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={product.productDisplayImage}
                            alt={"productImg"}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <div>{product.productName}</div>
                              </h3>
                              <p className="ml-4">USD {product.price}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Color: {product.color}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Size: {product.size}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Number: {product.number}
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">
                              Qty {product.quantity}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <p className="mt-8 text-lg font-medium">Payment Methods</p>
            <div className="relative my-4">
              <input
                className="peer hidden"
                id="radio_1"
                type="radio"
                name="radio"
                checked={paymentMethod === "ETH"}
                onClick={(e) => {
                  setPaymentMethod("ETH");
                }}
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4 items-center"
                for="radio_1"
              >
                <FaEthereum />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">Matic </span>
                </div>
              </label>
            </div>
            <div className="relative my-4">
              <input
                className="peer hidden"
                id="radio_2"
                type="radio"
                name="radio"
                checked={paymentMethod === "Card"}
                onClick={(e) => {
                  setPaymentMethod("Card");
                }}
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4 items-center"
                for="radio_2"
              >
                <BsCreditCard2Back />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">Card Payment</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Shipping Details</p>
          <p className="text-gray-400">
            Complete your order by providing your shipping details.
          </p>
          <div>
            <label className="mt-4 mb-2 block text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="card-holder"
                name="card-holder"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your full name here"
                required
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                  />
                </svg>
              </div>
            </div>

            <label className="mt-4 mb-2 block text-sm font-medium">Email</label>
            <div className="relative">
              <input
                type="text"
                id="email"
                name="email"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="your.email@gmail.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>

            <label className="mt-4 mb-2 block text-sm font-medium">
              Shipping Address
            </label>
            <div className="flex flex-col sm:flex-row" style={{ gap: "10px" }}>
              <input
                type="text"
                name="billing-zip"
                className="flex-shrink-0 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-4/12 focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="House No"
                required
                onChange={(e) => {
                  setHouseNo(e.target.value);
                }}
              />

              <div className="relative flex-shrink-0 sm:w-8/12">
                <input
                  type="text"
                  id="billing-address"
                  name="billing-address"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Street Address"
                  required
                  onChange={(e) => {
                    setStreetAddress(e.target.value);
                  }}
                />
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row mt-4"
              style={{ gap: "16px" }}
            >
              <div className="relative flex-shrink-0 sm:w-4/12">
                <input
                  type="text"
                  id="billing-address"
                  name="billing-address"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Province"
                  required
                  onChange={(e) => {
                    setProvince(e.target.value);
                  }}
                />
              </div>

              <input
                type="text"
                name="billing-zip"
                className="flex-shrink-0 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-4/12 focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Town"
                required
                onChange={(e) => {
                  setTown(e.target.value);
                }}
              />

              <input
                type="text"
                name="billing-zip"
                className="flex-shrink-0 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-3/12 focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="ZIP"
                required
                onChange={(e) => {
                  setZip(e.target.value);
                }}
              />
            </div>

            <div
              className="flex flex-col sm:flex-row mt-4"
              style={{ gap: "16px" }}
            >
              <input
                type="text"
                name="billing-zip"
                className="flex-shrink-0 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-2/12 focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="    +41  "
                disabled
              />

              <div className="relative flex-shrink-0 sm:w-8/12">
                <input
                  type="text"
                  id="billing-address"
                  name="billing-address"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Phone No"
                  required
                  onChange={(e) => {
                    setPhoneNo(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-gray-900">${subtotal}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Shipping</p>
                <p className="font-semibold text-gray-900">${shippingPrice}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Tax</p>
                <p className="font-semibold text-gray-900">${tax}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${(subtotal + shippingPrice + tax).toFixed(4)}
              </p>
            </div>
          </div>
          <button
            className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
            onClick={createOrder}
          >
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
