import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { Web3Button } from "@thirdweb-dev/react";
import ABI from "./ABI.json";
import { ethers } from "ethers";

function CryptoCheckout() {
  // const BASE_URL = "http://localhost:3800";

  let toastId = null;

  const [maticPrice, setMaticPrice] = useState("");

  const BASE_URL = "https://nft-ecom-backend.vercel.app";

  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

  async function fetchData() {
    const resp = await axios.get(
      `https://api.polygonscan.com/api?module=stats&action=maticprice&apikey=AZPNQB8MAR37N2V31TYVVVJ34IGA578CRI`
    );
    setMaticPrice(resp.data.result.maticusd);
    console.log(resp.data.result, "polygon price resp");
  }

  useEffect(() => {
    fetchData();
  }, []);

  const createOrderForPayment = async (transactionHash) => {
    try {
      const url = BASE_URL + "/order/add/new";

      const paymentInfo = {
        paymentMethod: state.paymentMethod,
        transactionId: "",
        blockchainTransactionHash: transactionHash,
      };

      let orderObj = state.orderObj;

      orderObj.paymentInfo = paymentInfo;

      const response = await axios.post(url, orderObj);

      if (response.data.status === 200) {
        console.log(response.data.id);

        toast.update(toastId, {
          render: "Order Placed Successfully...",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          hideProgressBar: false,
          draggable: true,
          pauseOnHover: true,
        });

        // updateOrderPayment(orderId, transactionId);
        dispatch(clearCart());
        navigate("/");
        // toast("Order Placed Successfully...", {
        //   toastId: "PaymentUpdateSuccess",
        // });
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

  // const updateOrderPayment = async (transactionHash) => {
  //   const orderId = state.orderId;

  //   try {
  //     const paymentInfo = {
  //       transactionId: "",
  //       blockchainTransactionHash: transactionHash,
  //       paymentStatus: "SUCCESS",
  //     };

  //     const apiUrl = BASE_URL + `/order/${orderId}`;
  //     const response = await axios.post(apiUrl, { paymentInfo });

  //     console.log("Response:", response.data);

  //     if (response.data.status === 200) {
  //       toast("Order Placed Successfully...", {
  //         toastId: "PaymentUpdateSuccess",
  //       });
  //       navigate("/");
  //     } else {
  //       toast("Some Error Occured", {
  //         toastId: "PaymentUpdateSuccess",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  return (
    <div className="mt-24 mb-20">
      <div className="mx-auto max-w-screen-sm pt-20">
        <Web3Button
          className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
          contractAddress="0x15D27106f063131818178a35a7C057787347755C"
          contractAbi={JSON.parse(ABI.result)}
          theme="dark"
          style={{
            width: "100%",
            marginBottom: "32px",
            marginTop: "16px",
            color: "white",
            background: "#111827",
            minHeight: "48px",
          }}
          action={async (contract) => {
            toastId = toast.loading("Processing...");

            const res = await contract.call(
              "purchaseBulkNFT",
              [state.tokenIds, state.quantity, state.walletAddress],
              {
                value: ethers.utils.parseEther(
                  String(
                    (Number(state.totalPrice) / Number(maticPrice)).toFixed(5)
                  )
                ),
              }
            );
            console.log(res);
            createOrderForPayment(res.receipt.transactionHash);
          }}
          onSuccess={(result) => console.log(result)}
          onError={(error) => console.log(error)}
        >
          {`Pay ${String(
            (Number(state.totalPrice) / Number(maticPrice)).toFixed(5)
          )} Matic`}
        </Web3Button>
      </div>
    </div>
  );
}

export default CryptoCheckout;
