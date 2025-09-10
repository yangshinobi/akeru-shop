import React, { useState } from "react";
import { CheckoutWithCard } from "@paperxyz/react-client-sdk";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CardCheckout() {
  // const BASE_URL = "http://localhost:3800";

  const BASE_URL = "https://nft-ecom-backend.vercel.app";

  const [calledCreateOrder, setcalledCreateOrder] = useState(false);

  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

  const createOrderForPayment = async (transactionId) => {
    setcalledCreateOrder(true);
    try {
      const url = BASE_URL + "/order/add/new";

      const paymentInfo = {
        paymentMethod: state.paymentMethod,
        transactionId: transactionId,
        blockchainTransactionHash: "",
      };

      let orderObj = state.orderObj;

      orderObj.paymentInfo = paymentInfo;

      const id = toast.loading("Processing...");

      const response = await axios.post(url, orderObj);

      if (response.data.status === 200) {
        console.log(response.data.id);
        dispatch(clearCart());
        navigate("/");

        toast.update(id, {
          render: "Order Placed Successfully...",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          hideProgressBar: false,
          draggable: true,
          pauseOnHover: true,
        });
      } else {
        console.log("Some Error Occured");
        // toast("Some Error Occured", {
        //   toastId: "OrderCreationError"
        // });
      }
    } catch (error) {
      console.error("Error:", error);
      toast("Order was not placed due to some issues. Please Try Again", {
        toastId: "Order Failed",
      });
    }
  };

  return (
    <div className="mt-24 mb-20">
      <div className="mx-auto max-w-screen-sm pt-20">
        {state.walletAddress && (
          <CheckoutWithCard
            configs={{
              contractId: "e4907796-43a3-416b-b402-c08e87e984f5",
              walletAddress: state.walletAddress,
              title: "Akeru Payment",
              quantity: state.quantity,
              mintMethod: {
                name: "purchaseNFT",
                args: {
                  _tokenId: state.tokenId,
                  _quantity: state.quantity,
                  recipient: state.walletAddress,
                },
                payment: {
                  currency: "MATIC",
                  value: `${(
                    state.price * state.quantity +
                    state.extraCharge
                  ).toFixed(4)}`,
                },
              },
              feeBearer: "BUYER",
            }}
            onPaymentSuccess={(result) => {
              console.log("Payment successful:", result);
              if (!calledCreateOrder) {
                createOrderForPayment(result.transactionId);
              }
            }}
            onError={(err) => {
              console.log("error", err);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default CardCheckout;
